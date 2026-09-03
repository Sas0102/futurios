from datetime import datetime
from zoneinfo import ZoneInfo

IST = ZoneInfo("Asia/Kolkata")

DAY_CODES = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]

STOP_WORDS = {"do", "you", "is", "are", "the", "a", "an", "i", "have", "has", "what", "where", "how", "can", "your"}

APPOINTMENT_OFFER_PHRASES = ["which would you prefer", "which time works", "does that work for you"]


def get_conversation_state(history: list[dict] | None) -> dict:
    """
    Derives simple conversation state from recent turns. Currently tracks
    only 'awaiting_slot_confirmation' — whether the agent's last message
    offered appointment time(s) and is waiting on the caller to pick one.
    Re-derived from history each turn, not stored separately — consistent
    with how the rest of this brain already works (stateless between
    requests, rebuilt from conversation_turns).
    """
    history = history or []
    last_agent_message = ""
    for turn in reversed(history):
        if turn["role"] == "agent":
            last_agent_message = turn["message"].lower()
            break

    awaiting_slot_confirmation = any(phrase in last_agent_message for phrase in APPOINTMENT_OFFER_PHRASES)

    return {"awaiting_slot_confirmation": awaiting_slot_confirmation}


def resolve_confirmation(predicted_intent: str, conversation_state: dict) -> str:
    """
    Safety guard, informed by ML model evaluation: short agreement-like
    phrases ("sounds good", "that works") cannot be reliably classified as
    appointment_confirmed from text alone — their real meaning depends on
    whether the receptionist actually just offered a time slot. This makes
    conversation state, not raw text, the deciding factor.

    Applies regardless of whether predicted_intent came from today's
    rule-based detect_intent() or a future trained model — once the ML
    model is integrated, its raw prediction should be passed through this
    same function before being trusted.
    """
    if predicted_intent != "appointment_confirmed":
        return predicted_intent
    if conversation_state.get("awaiting_slot_confirmation"):
        return "appointment_confirmed"
    return "confirmation_unclear"

def handle_appointment_enquiry(transcript: str) -> str:
    """
    Very simple mock business logic: looks at the transcript and returns
    a canned response, simulating an appointment availability check.
    Real logic (checking actual doctor schedules, etc.) comes in later weeks.
    """
    transcript_lower = transcript.lower()

    if "appointment" in transcript_lower or "book" in transcript_lower:
        return "I can help you book an appointment. We have availability tomorrow at 10 AM and 3 PM. Which would you prefer?"
    elif "hello" in transcript_lower or "hi" in transcript_lower:
        return "Hello! Thank you for calling. How can I help you today?"
    else:
        return "I'm sorry, I didn't quite catch that. Could you please repeat your request?"

def detect_intent(message: str, history: list[dict] | None = None, faqs: list | None = None) -> str:
    """
    Determines the caller's intent from their message and conversation
    state. Rule-based keyword matching — not a real NLU/LLM model.
    """
    GOODBYE_KEYWORDS = ["bye", "goodbye", "that's all", "thank you, that's it", "अलविदा", "धन्यवाद"]
    CALLBACK_KEYWORDS = ["call me back", "callback", "call back later", "वापस कॉल करें", "कॉलबैक"]
    APPOINTMENT_KEYWORDS = ["appointment", "book", "अपॉइंटमेंट", "बुक"]
    GREETING_KEYWORDS = ["hello", "hi", "नमस्ते", "हेलो"]
    message_lower = message.lower()
    faqs = faqs or []
    conversation_state = get_conversation_state(history)

    if any(kw in message_lower for kw in GOODBYE_KEYWORDS):
        return "goodbye"

    if any(kw in message_lower for kw in CALLBACK_KEYWORDS):
        return "callback_request"

    if any(kw in message_lower for kw in APPOINTMENT_KEYWORDS):
        return "appointment_booking"

    if any(kw in message_lower for kw in GREETING_KEYWORDS):
        return "greeting"

    confirmation_keywords = ["10", "3", "am", "pm", "works", "sounds good", "that time", "suits me", "go with", "fine"]
    if any(kw in message_lower for kw in confirmation_keywords):
        return resolve_confirmation("appointment_confirmed", conversation_state)

    message_words = set(message_lower.split()) - STOP_WORDS
    for faq in faqs:
        question_words = set(faq.question.lower().split()) - STOP_WORDS
        if len(message_words & question_words) >= 2:
            return "faq"

    return "fallback"

def build_response_text(intent: str, message: str) -> str:
    """
    Generates the reply text for a given intent. Kept separate from
    detect_intent so each concern can be tested/extended independently.
    """
    if intent == "appointment_confirmed":
        return "Great, you're booked. We'll see you then. Is there anything else I can help with?"
    elif intent == "goodbye":
        return "Thank you for calling. Have a great day!"
    elif intent == "callback_request":
        return "No problem, I've noted that you'd like a callback. Someone will reach out to you soon."
    elif intent == "appointment_booking":
        return handle_appointment_enquiry(message)
    elif intent == "greeting":
        return handle_appointment_enquiry(message)
    elif intent == "faq":
        return "Let me check on that for you — one moment."
    elif intent == "confirmation_unclear":
        return "Just to confirm — are you responding about an appointment time? Could you let me know which day and time works best for you?"
    else:
        return handle_appointment_enquiry(message)


def generate_receptionist_reply(message: str, agent, history: list[dict] | None = None, faqs: list | None = None) -> dict:
    intent = detect_intent(message, history, faqs)
    response_text = build_response_text(intent, message)
    detected_language = agent.languages[0] if agent.languages else "en"

    end_call = intent == "goodbye"

    return {
        "response_text": response_text,
        "intent": intent,
        "detected_language": detected_language,
        "transfer_required": False,
        "transfer_department": None,
        "end_call": end_call,
        }

def is_within_business_hours(business_hours: dict | None) -> bool:
    """
    Checks whether the current time (assumed IST) falls within the agent's
    configured business hours for today. If business_hours is None (not set),
    the agent is treated as always available — no restriction.
    """
    if business_hours is None:
        return True

    now = datetime.now(IST)
    today_code = DAY_CODES[now.weekday()]
    today_hours = business_hours.get(today_code, [])

    if len(today_hours) != 2:
        return False  # empty list = closed that day

    current_time_str = now.strftime("%H:%M")
    open_time, close_time = today_hours

    return open_time <= current_time_str <= close_time

def find_matching_faq(message: str, faqs: list) -> str | None:
    """
    Very simple keyword-overlap FAQ matching: checks if any significant
    word from the caller's message appears in a stored FAQ question.
    Common filler words (STOP_WORDS) are excluded so a match requires
    genuinely meaningful shared words, not just "do"/"you"/etc.
    Not semantic search — a real embedding-based match would be needed
    for production-quality FAQ matching. Good enough to prove the flow works.
    """
    message_words = set(message.lower().split()) - STOP_WORDS

    for faq in faqs:
        question_words = set(faq.question.lower().split()) - STOP_WORDS
        overlap = message_words & question_words
        if len(overlap) >= 2:
            return faq.answer

    return None

EMERGENCY_KEYWORDS = [
    "emergency", "chest pain", "can't breathe", "cannot breathe",
    "severe bleeding", "heart attack", "stroke", "unconscious", "dying",
]

DEPARTMENT_KEYWORDS = {
    "billing": ["billing", "invoice", "payment issue", "charge", "refund"],
    "medical": ["speak to a doctor", "speak with a doctor", "nurse", "medical advice", "prescription", "specialist"],
}

GENERAL_TRANSFER_KEYWORDS = ["speak to a human", "real person", "representative", "manager", "speak to someone"]

def extract_best_text(speech_results: list) -> str:
    """
    Vonage returns multiple candidate transcriptions. Rather than trusting
    only the top-confidence guess (which can omit key words, as seen in
    real testing), check all candidates for the presence of critical
    keywords before falling back to the top result as-is.
    """
    if not speech_results:
        return ""
    return " ".join(r.get("text", "") for r in speech_results)


def is_emergency(message: str) -> bool:
    """
    Checks for language suggesting a medical emergency. This check must
    run BEFORE any other logic (agent status, business hours, normal
    intent detection) — an emergency is never subject to "we're closed"
    or normal conversational handling.
    """
    message_lower = message.lower()
    return any(kw in message_lower for kw in EMERGENCY_KEYWORDS)


def detect_transfer_department(message: str) -> str | None:
    """
    Checks whether the caller is explicitly asking for a specific
    department or a human in general. Returns the department name,
    or None if no transfer request is detected.
    """
    message_lower = message.lower()

    for department, keywords in DEPARTMENT_KEYWORDS.items():
        if any(kw in message_lower for kw in keywords):
            return department

    if any(kw in message_lower for kw in GENERAL_TRANSFER_KEYWORDS):
        return "general"

    return None

def calculate_confidence(intent: str, faq_matched: bool = False) -> float:
    """
    Heuristic confidence score — NOT a real probability from a trained
    model. Reflects how directly the rule-based logic matched the intent.
    Once the trained intent/sentiment model is integrated, this should be
    replaced with the model's actual predicted probability.
    """
    if intent in ("emergency", "agent_unavailable", "outside_business_hours"):
        return 1.0  # deterministic system states, not language ambiguity
    if intent == "human_transfer":
        return 0.95
    if intent in ("appointment_confirmed", "goodbye", "callback_request", "appointment_booking", "greeting"):
        return 0.9
    if intent == "faq":
        return 0.85 if faq_matched else 0.5
    if intent == "confirmation_unclear":
        return 0.5
    return 0.3  # fallback — nothing matched

