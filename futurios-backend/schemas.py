from pydantic import BaseModel, EmailStr, field_validator
from enum import Enum
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    email: EmailStr
    full_name: str
    password: str

class UserOut(BaseModel):
    id: int
    email: str
    full_name: str

    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut

class OrganisationCreate(BaseModel):
    name: str
    slug: str

class OrganisationOut(BaseModel):
    id: int
    name: str
    slug: str

    class Config:
        from_attributes = True

ALLOWED_LANGUAGES = {"en", "hi", "or"}

class AgentStatusEnum(str, Enum):
    draft = "draft"
    active = "active"
    inactive = "inactive"

class AgentCreate(BaseModel):
    name: str
    description: str | None = None
    status: AgentStatusEnum
    languages: list[str] = ["en"]
    system_prompt: str | None = None
    business_hours: dict | None = None

    @field_validator("languages")
    @classmethod
    def check_languages(cls, v):
        if not v:
            raise ValueError("At least one language is required")
        invalid = set(v) - ALLOWED_LANGUAGES
        if invalid:
            raise ValueError(f"Unsupported language(s): {invalid}. Allowed: {ALLOWED_LANGUAGES}")
        return v


class AgentUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    status: AgentStatusEnum | None = None
    languages: list[str] | None = None
    system_prompt: str | None = None
    business_hours: dict | None = None

    @field_validator("languages")
    @classmethod
    def check_languages(cls, v):
        if v is None:
            return v
        if not v:
            raise ValueError("At least one language is required")
        invalid = set(v) - ALLOWED_LANGUAGES
        if invalid:
            raise ValueError(f"Unsupported language(s): {invalid}. Allowed: {ALLOWED_LANGUAGES}")
        return v


class AgentOut(BaseModel):
    id: int
    name: str
    description: Optional[str]
    status: AgentStatusEnum
    organisation_id: int
    languages: list[str]
    system_prompt: Optional[str]
    business_hours: Optional[dict]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class VoiceSessionOut(BaseModel):
    id: int
    agent_id: int
    status: str
    transcript: Optional[str]
    started_at: datetime
    ended_at: Optional[datetime]

    class Config:
        from_attributes = True


class MyOrganisationOut(BaseModel):
    id: int
    name: str
    slug: str
    role: str

    class Config:
        from_attributes = True

class RoleEnum(str, Enum):
    admin = "admin"
    member = "member"

class MembershipCreate(BaseModel):
    email: str
    role: Optional[RoleEnum] = RoleEnum.member

class MembershipOut(BaseModel):
    id: int
    user_id: int
    organisation_id: int
    role: str
    user_email: str
    user_full_name: str

    class Config:
        from_attributes = True

class MembershipRoleUpdate(BaseModel):
    role: RoleEnum

class SimulateRequest(BaseModel):
    call_id: str
    message: str


class SimulateResponse(BaseModel):
    response_text: str
    intent: str
    detected_language: str
    confidence: float
    transfer_required: bool
    transfer_department: str | None = None
    end_call: bool

class FAQCreate(BaseModel):
    question: str
    answer: str

class FAQOut(BaseModel):
    id: int
    organisation_id: int
    question: str
    answer: str

    class Config:
        from_attributes = True

class AppointmentOut(BaseModel):
    id: int
    organisation_id: int
    agent_id: int
    call_id: str
    caller_message: str
    phone_number: str | None
    created_at: datetime

    class Config:
        from_attributes = True


class CallbackRequestOut(BaseModel):
    id: int
    organisation_id: int
    agent_id: int
    call_id: str
    caller_message: str
    phone_number: str | None
    created_at: datetime

    class Config:
        from_attributes = True

class CallSummaryOut(BaseModel):
    id: int
    call_id: str
    organisation_id: int
    agent_id: int
    final_intent: str
    transfer_required: bool
    transfer_department: str | None
    turn_count: int
    created_at: datetime

    class Config:
        from_attributes = True