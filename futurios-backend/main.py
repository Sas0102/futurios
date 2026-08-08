from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from config import settings
from database import engine, get_db
from models import User
from schemas import UserCreate, UserOut, UserLogin, Token
from auth import hash_password, verify_password, create_access_token
from models import User, Organisation, Membership
from schemas import OrganisationCreate, OrganisationOut
from auth import hash_password, verify_password, create_access_token, get_current_user
from models import User, Organisation, Membership, Agent
from schemas import (
    OrganisationCreate, OrganisationOut,
    AgentCreate, AgentUpdate, AgentOut,
)
from models import User, Organisation, Membership, Agent, VoiceSession
from schemas import VoiceSessionOut
from providers import MockSTTProvider, MockTTSProvider
from fastapi import UploadFile, File
from auth import require_role
from schemas import MyOrganisationOut
from schemas import MembershipCreate, MembershipOut
from schemas import MembershipRoleUpdate
from business_logic import handle_appointment_enquiry, generate_receptionist_reply
from models import ConversationTurn
from business_logic import handle_appointment_enquiry, generate_receptionist_reply, is_within_business_hours
from models import FAQ
from schemas import FAQCreate, FAQOut
from business_logic import handle_appointment_enquiry, generate_receptionist_reply, is_within_business_hours, find_matching_faq
from models import Appointment, CallbackRequest
from schemas import AppointmentOut, CallbackRequestOut
from business_logic import (
    handle_appointment_enquiry, generate_receptionist_reply,
    is_within_business_hours, find_matching_faq,
    is_emergency, detect_transfer_department,
    calculate_confidence,
)
from models import Appointment, CallbackRequest, CallSummary
from schemas import AppointmentOut, CallbackRequestOut, CallSummaryOut

from schemas import SimulateRequest, SimulateResponse
from business_logic import handle_appointment_enquiry
from auth import require_super_admin


app = FastAPI(title=settings.app_name)

# Allow Saswati's frontend (running on port 3000) to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {"status": "ok", "environment": settings.environment}


@app.get("/db-check")
def db_check():
    try:
        with engine.connect() as connection:
            return {"database": "connected"}
    except Exception as e:
        return {"database": "failed", "error": str(e)}


@app.post("/signup", response_model=UserOut)
def signup(user_data: UserCreate, db: Session = Depends(get_db)):
    # Check if email already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Create new user with hashed password
    new_user = User(
        email=user_data.email,
        full_name=user_data.full_name,
        hashed_password=hash_password(user_data.password),
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


@app.post("/login", response_model=Token)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == credentials.email).first()

    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    access_token = create_access_token(data={"sub": str(user.id)})

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user,
    }

@app.post("/organisations", response_model=OrganisationOut)
def create_organisation(
    org_data: OrganisationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    existing = db.query(Organisation).filter(Organisation.slug == org_data.slug).first()
    if existing:
        raise HTTPException(status_code=400, detail="Slug already taken")

    new_org = Organisation(name=org_data.name, slug=org_data.slug)
    db.add(new_org)
    db.commit()
    db.refresh(new_org)

    membership = Membership(user_id=current_user.id, organisation_id=new_org.id, role="admin")
    db.add(membership)
    db.commit()

    return new_org


@app.get("/organisations/{org_id}", response_model=OrganisationOut)
def get_organisation(org_id: int, db: Session = Depends(get_db)):
    org = db.query(Organisation).filter(Organisation.id == org_id).first()
    if not org:
        raise HTTPException(status_code=404, detail="Organisation not found")
    return org

@app.post("/agents", response_model=AgentOut)
def create_agent(
    agent_data: AgentCreate,
    organisation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Confirm the user belongs to this organisation
    
    require_role(current_user.id, organisation_id, "admin", db)

    new_agent = Agent(
    name=agent_data.name,
    description=agent_data.description,
    status=agent_data.status,
    organisation_id=organisation_id,
    languages=agent_data.languages,
    system_prompt=agent_data.system_prompt,
    business_hours=agent_data.business_hours,
    )
    db.add(new_agent)
    db.commit()
    db.refresh(new_agent)
    return new_agent


@app.get("/agents/{agent_id}", response_model=AgentOut)
def get_agent(agent_id: int, db: Session = Depends(get_db)):
    agent = db.query(Agent).filter(Agent.id == agent_id).first()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    return agent


@app.get("/organisations/{organisation_id}/agents", response_model=list[AgentOut])
def list_agents(organisation_id: int, db: Session = Depends(get_db)):
    return db.query(Agent).filter(Agent.organisation_id == organisation_id).all()


@app.put("/agents/{agent_id}", response_model=AgentOut)
def update_agent(
    agent_id: int,
    agent_data: AgentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    agent = db.query(Agent).filter(Agent.id == agent_id).first()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    
    require_role(current_user.id, agent.organisation_id, "admin", db)

    if agent_data.name is not None:
        agent.name = agent_data.name
    if agent_data.description is not None:
        agent.description = agent_data.description
    if agent_data.status is not None:
        agent.status = agent_data.status
    if agent_data.languages is not None:
        agent.languages = agent_data.languages
    if agent_data.system_prompt is not None:
        agent.system_prompt = agent_data.system_prompt
    if agent_data.business_hours is not None:
        agent.business_hours = agent_data.business_hours

    db.commit()
    db.refresh(agent)
    return agent


@app.delete("/agents/{agent_id}")
def delete_agent(
    agent_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    agent = db.query(Agent).filter(Agent.id == agent_id).first()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    require_role(current_user.id, agent.organisation_id, "admin", db)

    db.delete(agent)
    db.commit()
    return {"detail": "Agent deleted successfully"}


@app.post("/agents/{agent_id}/test-session", response_model=VoiceSessionOut)
def test_voice_session(agent_id: int, db: Session = Depends(get_db)):
    agent = db.query(Agent).filter(Agent.id == agent_id).first()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")

    # Simulate receiving audio and transcribing it using the mock STT provider
    stt = MockSTTProvider()
    fake_audio = b"pretend-this-is-real-audio-bytes"
    transcript = stt.transcribe(fake_audio)

    # Create a voice session record with this transcript
    session = VoiceSession(
        agent_id=agent.id,
        status="completed",
        transcript=transcript,
    )
    db.add(session)
    db.commit()
    db.refresh(session)

    # Simulate generating a voice response using the mock TTS provider (not saved, just proving it runs)
    tts = MockTTSProvider()
    _ = tts.synthesize("Thank you for calling, how can I help?")

    return session


def save_call_summary(db: Session, call_id: str, organisation_id: int, agent_id: int, final_intent: str, transfer_required: bool, transfer_department: str | None):
    turn_count = db.query(ConversationTurn).filter(ConversationTurn.call_id == call_id).count()
    summary = CallSummary(
        call_id=call_id,
        organisation_id=organisation_id,
        agent_id=agent_id,
        final_intent=final_intent,
        transfer_required=transfer_required,
        transfer_department=transfer_department,
        turn_count=turn_count,
    )
    db.add(summary)
    db.commit()


@app.post("/agents/{agent_id}/simulate", response_model=SimulateResponse)
def simulate_conversation(
    agent_id: int,
    simulate_data: SimulateRequest,
    db: Session = Depends(get_db),
):
    agent = db.query(Agent).filter(Agent.id == agent_id).first()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")

    if is_emergency(simulate_data.message):
        save_call_summary(db, simulate_data.call_id, agent.organisation_id, agent.id, "emergency", True, "emergency")
        return SimulateResponse(
            response_text="This sounds like a medical emergency. Please hang up and call your local emergency number immediately.",
            intent="emergency",
            detected_language=agent.languages[0] if agent.languages else "en",
            confidence=1.0,
            transfer_required=True,
            transfer_department="emergency",
            end_call=True,
        )

    if agent.status != "active":
        save_call_summary(db, simulate_data.call_id, agent.organisation_id, agent.id, "agent_unavailable", False, None)
        return SimulateResponse(
            response_text="This agent is currently unavailable.",
            intent="agent_unavailable",
            detected_language=agent.languages[0] if agent.languages else "en",
            confidence=1.0,
            transfer_required=False,
            end_call=True,
        )

    if not is_within_business_hours(agent.business_hours):
        save_call_summary(db, simulate_data.call_id, agent.organisation_id, agent.id, "outside_business_hours", False, None)
        return SimulateResponse(
            response_text="Thank you for calling. We are currently closed. Please call back during our business hours.",
            intent="outside_business_hours",
            detected_language=agent.languages[0] if agent.languages else "en",
            confidence=1.0,
            transfer_required=False,
            end_call=True,
        )

    caller_turn = ConversationTurn(
        call_id=simulate_data.call_id,
        agent_id=agent.id,
        role="caller",
        message=simulate_data.message,
    )
    db.add(caller_turn)
    db.commit()

    prior_turns = (
        db.query(ConversationTurn)
        .filter(ConversationTurn.call_id == simulate_data.call_id)
        .filter(ConversationTurn.id != caller_turn.id)
        .order_by(ConversationTurn.id)
        .all()
    )
    history = [{"role": t.role, "message": t.message} for t in prior_turns]

    faqs = db.query(FAQ).filter(FAQ.organisation_id == agent.organisation_id).all()

    result = generate_receptionist_reply(simulate_data.message, agent, history=history, faqs=faqs)

    matched_answer = None
    if result["intent"] == "faq":
        matched_answer = find_matching_faq(simulate_data.message, faqs)
        if matched_answer:
            result["response_text"] = matched_answer
        else:
            result["response_text"] = "I don't have that information right now, but I can have someone call you back with details."

    transfer_department = detect_transfer_department(simulate_data.message)
    if transfer_department:
        result["intent"] = "human_transfer"
        result["response_text"] = f"Of course, let me connect you to our {transfer_department} department."
        result["transfer_required"] = True
        result["transfer_department"] = transfer_department

    if result["intent"] == "appointment_confirmed":
        new_appointment = Appointment(
            organisation_id=agent.organisation_id,
            agent_id=agent.id,
            call_id=simulate_data.call_id,
            caller_message=simulate_data.message,
        )
        db.add(new_appointment)
        db.commit()

    if result["intent"] == "callback_request":
        new_callback = CallbackRequest(
            organisation_id=agent.organisation_id,
            agent_id=agent.id,
            call_id=simulate_data.call_id,
            caller_message=simulate_data.message,
        )
        db.add(new_callback)
        db.commit()

    agent_turn = ConversationTurn(
        call_id=simulate_data.call_id,
        agent_id=agent.id,
        role="agent",
        message=result["response_text"],
    )
    db.add(agent_turn)
    db.commit()

    faq_matched = False
    if result["intent"] == "faq":
        faq_matched = matched_answer is not None
    result["confidence"] = calculate_confidence(result["intent"], faq_matched)

    if result["end_call"]:
        save_call_summary(db, simulate_data.call_id, agent.organisation_id, agent.id, result["intent"], result["transfer_required"], result["transfer_department"])

    return SimulateResponse(**result)


@app.post("/agents/{agent_id}/voice-sessions", response_model=VoiceSessionOut)
async def receive_audio(
    agent_id: int,
    audio: UploadFile = File(...),
    simulated_transcript: str = None,
    db: Session = Depends(get_db),
):
    agent = db.query(Agent).filter(Agent.id == agent_id).first()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")

    audio_bytes = await audio.read()
    print(f"[voice_session] agent_id={agent_id} organisation_id={agent.organisation_id} audio_size={len(audio_bytes)} bytes")

    stt = MockSTTProvider()
    transcript = stt.transcribe(audio_bytes, simulated_text=simulated_transcript)

    response_text = handle_appointment_enquiry(transcript)

    tts = MockTTSProvider()
    response_audio = tts.synthesize(response_text)

    session = VoiceSession(
        agent_id=agent.id,
        status="completed",
        transcript=f"Caller: {transcript} | Agent: {response_text}",
    )
    db.add(session)
    db.commit()
    db.refresh(session)

    print(f"[voice_session] session_id={session.id} organisation_id={agent.organisation_id} transcript_logged=True response_generated=True")

    return session

@app.get("/me/organisations", response_model=list[MyOrganisationOut])
def get_my_organisations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    memberships = db.query(Membership).filter(Membership.user_id == current_user.id).all()

    result = []
    for m in memberships:
        result.append(MyOrganisationOut(
            id=m.organisation.id,
            name=m.organisation.name,
            slug=m.organisation.slug,
            role=m.role,
        ))
    return result

@app.post("/organisations/{organisation_id}/members", response_model=MembershipOut)
def add_member(
    organisation_id: int,
    member_data: MembershipCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    require_role(current_user.id, organisation_id, "admin", db)

    user_to_add = db.query(User).filter(User.email == member_data.email).first()
    if not user_to_add:
        raise HTTPException(status_code=404, detail="No user found with this email")

    existing = db.query(Membership).filter(
        Membership.user_id == user_to_add.id,
        Membership.organisation_id == organisation_id,
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="User is already a member of this organisation")

    new_membership = Membership(
        user_id=user_to_add.id,
        organisation_id=organisation_id,
        role=member_data.role,
    )
    db.add(new_membership)
    db.commit()
    db.refresh(new_membership)

    return MembershipOut(
        id=new_membership.id,
        user_id=new_membership.user_id,
        organisation_id=new_membership.organisation_id,
        role=new_membership.role,
        user_email=user_to_add.email,
        user_full_name=user_to_add.full_name,
    )


@app.get("/organisations/{organisation_id}/members", response_model=list[MembershipOut])
def list_members(
    organisation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    require_role(current_user.id, organisation_id, "member", db)

    memberships = db.query(Membership).filter(Membership.organisation_id == organisation_id).all()

    result = []
    for m in memberships:
        result.append(MembershipOut(
            id=m.id,
            user_id=m.user_id,
            organisation_id=m.organisation_id,
            role=m.role,
            user_email=m.user.email,
            user_full_name=m.user.full_name,
        ))
    return result

@app.put("/organisations/{organisation_id}/members/{user_id}", response_model=MembershipOut)
def update_member_role(
    organisation_id: int,
    user_id: int,
    role_data: MembershipRoleUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    require_role(current_user.id, organisation_id, "admin", db)

    membership = db.query(Membership).filter(
        Membership.user_id == user_id,
        Membership.organisation_id == organisation_id,
    ).first()
    if not membership:
        raise HTTPException(status_code=404, detail="Membership not found")

    if membership.role == "admin" and role_data.role != "admin":
        admin_count = db.query(Membership).filter(
            Membership.organisation_id == organisation_id,
            Membership.role == "admin",
        ).count()
        if admin_count <= 1:
            raise HTTPException(status_code=400, detail="Cannot remove the last admin of an organisation")

    membership.role = role_data.role
    db.commit()
    db.refresh(membership)

    return MembershipOut(
        id=membership.id,
        user_id=membership.user_id,
        organisation_id=membership.organisation_id,
        role=membership.role,
        user_email=membership.user.email,
        user_full_name=membership.user.full_name,
    )


@app.delete("/organisations/{organisation_id}/members/{user_id}")
def remove_member(
    organisation_id: int,
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    require_role(current_user.id, organisation_id, "admin", db)

    membership = db.query(Membership).filter(
        Membership.user_id == user_id,
        Membership.organisation_id == organisation_id,
    ).first()
    if not membership:
        raise HTTPException(status_code=404, detail="Membership not found")

    if membership.role == "admin":
        admin_count = db.query(Membership).filter(
            Membership.organisation_id == organisation_id,
            Membership.role == "admin",
        ).count()
        if admin_count <= 1:
            raise HTTPException(status_code=400, detail="Cannot remove the last admin of an organisation")

    db.delete(membership)
    db.commit()
    return {"detail": "Member removed successfully"}

@app.delete("/organisations/{organisation_id}/leave")
def leave_organisation(
    organisation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    membership = db.query(Membership).filter(
        Membership.user_id == current_user.id,
        Membership.organisation_id == organisation_id,
    ).first()
    if not membership:
        raise HTTPException(status_code=404, detail="You are not a member of this organisation")

    if membership.role == "admin":
        admin_count = db.query(Membership).filter(
            Membership.organisation_id == organisation_id,
            Membership.role == "admin",
        ).count()
        if admin_count <= 1:
            raise HTTPException(status_code=400, detail="Cannot leave: you are the last admin. Promote someone else first, or delete the organisation.")

    db.delete(membership)
    db.commit()
    return {"detail": "You have left the organisation"}

@app.delete("/organisations/{organisation_id}")
def delete_organisation(
    organisation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    require_role(current_user.id, organisation_id, "admin", db)

    org = db.query(Organisation).filter(Organisation.id == organisation_id).first()
    if not org:
        raise HTTPException(status_code=404, detail="Organisation not found")

    agent_count = db.query(Agent).filter(Agent.organisation_id == organisation_id).count()
    if agent_count > 0:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot delete organisation: it still has {agent_count} agent(s). Remove all agents first."
        )

    # Safe to clean up memberships automatically — they're just access records, not real data
    db.query(Membership).filter(Membership.organisation_id == organisation_id).delete()

    db.delete(org)
    db.commit()
    return {"detail": "Organisation deleted successfully"}

@app.post("/organisations/{organisation_id}/faqs", response_model=FAQOut)
def create_faq(
    organisation_id: int,
    faq_data: FAQCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    require_role(current_user.id, organisation_id, "admin", db)

    new_faq = FAQ(
        organisation_id=organisation_id,
        question=faq_data.question,
        answer=faq_data.answer,
    )
    db.add(new_faq)
    db.commit()
    db.refresh(new_faq)
    return new_faq


@app.get("/organisations/{organisation_id}/faqs", response_model=list[FAQOut])
def list_faqs(organisation_id: int, db: Session = Depends(get_db)):
    return db.query(FAQ).filter(FAQ.organisation_id == organisation_id).all()


@app.get("/organisations/{organisation_id}/appointments", response_model=list[AppointmentOut])
def list_appointments(organisation_id: int, db: Session = Depends(get_db)):
    return db.query(Appointment).filter(Appointment.organisation_id == organisation_id).all()


@app.get("/organisations/{organisation_id}/callback-requests", response_model=list[CallbackRequestOut])
def list_callback_requests(organisation_id: int, db: Session = Depends(get_db)):
    return db.query(CallbackRequest).filter(CallbackRequest.organisation_id == organisation_id).all()


@app.get("/organisations/{organisation_id}/call-summaries", response_model=list[CallSummaryOut])
def list_call_summaries(organisation_id: int, db: Session = Depends(get_db)):
    return db.query(CallSummary).filter(CallSummary.organisation_id == organisation_id).all()


@app.get("/admin/organisations", response_model=list[OrganisationOut])
def list_all_organisations(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_super_admin),
):
    return db.query(Organisation).all()