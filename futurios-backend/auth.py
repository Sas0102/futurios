from datetime import datetime, timedelta
import bcrypt
from jose import jwt
from config import settings
from models import Membership
from sqlalchemy.orm import Session
import secrets
import hashlib
from models import User, ApiKey
from fastapi import Header
from datetime import datetime, UTC
from models import Subscription  # if not already imported
from fastapi import HTTPException  # almost certainly already imported, since your other routes use it

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 1 day

def hash_password(password: str) -> str:
    pwd_bytes = password.encode("utf-8")
    hashed = bcrypt.hashpw(pwd_bytes, bcrypt.gensalt())
    return hashed.decode("utf-8")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.secret_key, algorithm=ALGORITHM)

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError
from sqlalchemy.orm import Session
from database import get_db
from models import User

from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
...
security = HTTPBearer()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
) -> User:
    token = credentials.credentials
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(User).filter(User.id == int(user_id)).first()
    if user is None:
        raise credentials_exception

    return user

def require_role(user_id: int, organisation_id: int, required_role: str, db: Session) -> Membership:
    membership = db.query(Membership).filter(
        Membership.user_id == user_id,
        Membership.organisation_id == organisation_id,
    ).first()

    if not membership:
        raise HTTPException(status_code=403, detail="You are not a member of this organisation")

    if required_role == "admin" and membership.role != "admin":
        raise HTTPException(status_code=403, detail="Only admins can perform this action")

    return membership

def check_plan_limit(db: Session, organisation_id: int, limit_key: str, current_count: int):
    """
    Checks whether an organisation has room under a given plan limit.
    limit_key must match a key in the plan's `limits` JSON (e.g. "max_agents").
    A limit value of None means unlimited — always allowed.
    Raises 403 if the limit is reached or exceeded.
    """
    subscription = db.query(Subscription).filter(Subscription.organisation_id == organisation_id).first()
    if not subscription:
        return  # no subscription record — fail open rather than block everything; worth revisiting once all orgs are guaranteed to have one

    limit_value = subscription.plan.limits.get(limit_key)
    if limit_value is None:
        return  # unlimited on this plan

    if current_count >= limit_value:
        raise HTTPException(
            status_code=403,
            detail=f"Plan limit reached: your current plan allows a maximum of {limit_value} for '{limit_key}'. Upgrade your plan to continue."
        )

def require_super_admin(current_user: User = Depends(get_current_user)):
    if not current_user.is_super_admin:
        raise HTTPException(status_code=403, detail="Super admin access required")
    return current_user

def generate_api_key() -> tuple[str, str, str]:
    """
    Generates a new API key. Returns (raw_key, key_hash, key_prefix).
    raw_key is shown to the user ONCE at creation time and never stored.
    Only key_hash is persisted; used later to verify incoming requests.
    """
    raw_key = f"futr_{secrets.token_urlsafe(32)}"
    key_hash = hashlib.sha256(raw_key.encode()).hexdigest()
    key_prefix = raw_key[:12]
    return raw_key, key_hash, key_prefix


def hash_api_key(raw_key: str) -> str:
    return hashlib.sha256(raw_key.encode()).hexdigest()


def get_organisation_from_api_key(
    x_api_key: str = Header(...),
    db: Session = Depends(get_db),
) -> int:
    key_hash = hash_api_key(x_api_key)
    api_key_record = db.query(ApiKey).filter(
        ApiKey.key_hash == key_hash,
        ApiKey.is_active == True,
    ).first()

    if not api_key_record:
        raise HTTPException(status_code=401, detail="Invalid or inactive API key")

    api_key_record.last_used_at = datetime.now(UTC)
    db.commit()

    return api_key_record.organisation_id