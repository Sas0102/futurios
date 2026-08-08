# Futurios Backend
## Setup 

1. Create virtual environment:
   python -m venv venv

2. Activate it:
   venv\Scripts\activate   (Windows)

3. Install dependencies:
   pip install fastapi uvicorn

4. Run the server:
   uvicorn main:app --reload

5. Test it:
   Visit http://127.0.0.1:8000/health
   Should return: {"status": "ok"}

## Run with Docker

1. Build the image:
   docker build -t futurios-backend .

2. Run the container:
   docker run -p 8000:8000 futurios-backend

3. Test it:
   Visit http://127.0.0.1:8000/health


## Database setup (PostgreSQL)

1. Install PostgreSQL 17 and pgAdmin 4 (bundled together):
   https://www.postgresql.org/download/windows/

2. Create a database named `futurios_db` using pgAdmin.

3. Add your database connection string to `.env`:
   DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/futurios_db

4. Install Python dependencies:
   pip install sqlalchemy psycopg2-binary alembic

5. Apply database migrations:
   alembic upgrade head

6. Verify connection:
   Visit http://127.0.0.1:8000/db-check
   Should return: {"database": "connected"}

## Database schema

- **users** — stores registered users (email, name, hashed password)
- **organisations** — stores tenant organisations (name, slug)
- **memberships** — links users to organisations with a role (e.g. member, admin)

Each user can belong to multiple organisations, and each organisation can have multiple users, connected through the memberships table.

## Voice AI Architecture (Day 5)

This backend uses a provider interface pattern for voice AI capabilities, allowing
real providers (AI4Bharat, Exotel) to be swapped in later without changing business logic.

### Provider Interfaces (`providers.py`)
- **STTProvider** — abstract interface for Speech-to-Text. Any provider (e.g. AI4Bharat)
  must implement `transcribe(audio_bytes) -> str`
- **TTSProvider** — abstract interface for Text-to-Speech. Any provider must implement
  `synthesize(text) -> bytes`
- **TelephonyProvider** — abstract interface for call handling (e.g. Exotel). Must implement
  `make_call(phone_number) -> call_id` and `end_call(call_id)`

Currently using Mock implementations (`MockSTTProvider`, `MockTTSProvider`,
`MockTelephonyProvider`) for local development and testing, since real AI4Bharat models
require significant setup (model downloads, GPU, audio pipeline tuning) planned for
Day 6-7.

### Voice Session Model
The `voice_sessions` table tracks each individual call/session:
- Linked to the `agents` table (which agent handled the session)
- Tracks `status` (active/completed/failed), `transcript`, `started_at`, `ended_at`

### Data flow (planned, per architecture diagram)
Customer call → Telephony provider → Audio preprocessing → STT (transcription) →
Business logic (FastAPI) → Response generation → TTS (speech) → back to customer

A test endpoint (`POST /agents/{agent_id}/test-session`) verifies this pipeline works
end-to-end using mock providers, ahead of real integration.

## Week 2: RBAC + Multi-Organisation Support

### Permission Model
- **admin**: full control — create/edit/delete agents, add/remove/promote members
- **member**: read-only — can view agents and team members, cannot modify anything

### Safety Rule
An organisation can never be left with zero admins. Attempting to remove or demote
the last remaining admin is blocked with a 400 error.

### New Endpoints
- `GET /me/organisations` — list all organisations the logged-in user belongs to, with their role in each
- `POST /organisations/{organisation_id}/members` — add an existing user (by email) to an organisation (admin only)
- `GET /organisations/{organisation_id}/members` — list all members and their roles (any member)
- `PUT /organisations/{organisation_id}/members/{user_id}` — change a member's role (admin only, blocked if it would remove the last admin)
- `DELETE /organisations/{organisation_id}/members/{user_id}` — remove a member (admin only, blocked if it would remove the last admin)

### Modified Endpoints
- `POST /agents`, `PUT /agents/{id}`, `DELETE /agents/{id}` now require **admin** role
  (previously only required membership)

### Known limitation / fixed issue
A PostgreSQL sequence desync occurred after manually inserting a row via pgAdmin during
testing, causing duplicate primary key errors. Fixed with `setval()`. Going forward, all
data changes should go through the API rather than direct manual database edits, to avoid
this recurring.

## Week 3: Agent Configuration (Languages, Prompt, Business Hours)

The `agents` table was extended to support real voice agent configuration, matching
the fields needed for the frontend's agent create/edit screens.

### New Agent Fields
- **languages** (array of strings) — the language(s) this agent can operate in.
  Restricted to `en`, `hi`, `or` (English, Hindi, Odia), matching the AI4Bharat
  multilingual model planned for STT/TTS integration in Week 5-6. Defaults to `["en"]`
  if not provided. Sending any other value (e.g. `"fr"`) returns a `422` validation
  error with a clear message — this is enforced at the API layer via a Pydantic
  validator, before anything reaches the database.
- **system_prompt** (string, optional) — free-text instruction/greeting basis for the
  agent. Nullable; no validation on content yet.
- **business_hours** (JSON object, optional) — the agent's operating hours. Nullable.

### `business_hours` shape (convention, not yet enforced)
```json
{
  "mon": ["09:00", "17:00"],
  "tue": ["09:00", "17:00"],
  "wed": ["09:00", "17:00"],
  "thu": ["09:00", "17:00"],
  "fri": ["09:00", "17:00"],
  "sat": [],
  "sun": []
}
```
- Keys: 3-letter lowercase day codes, `mon`–`sun`
- Value: `[open_time, close_time]` in 24-hour `"HH:MM"` strings, or an empty array `[]`
  if closed that day
- **This shape is a shared convention with the frontend, not backend-validated yet.**
  Deliberately left loose until the frontend's actual data shape is confirmed, to avoid
  rejecting valid input before we know what it looks like in practice.

### Known limitations
- `business_hours` only supports a single open/close shift per day — no split hours
  (e.g. closed for a lunch break) in this version.
- No `agent_tools` or `agent_versions` support yet — intentionally deferred. Tools have
  nothing to call until the booking/appointment system exists (~Week 7); versioning
  isn't needed while only one person edits agent configs at a time.

### Modified Endpoints
- `POST /agents` and `PUT /agents/{agent_id}` now accept and return `languages`,
  `system_prompt`, and `business_hours` in addition to existing fields.

### Testing
Automated tests added in `tests/test_agents.py`, covering:
- Default language behavior when `languages` is omitted
- Multi-language creation (`["hi", "or"]`)
- Rejection of unsupported languages (422)
- Non-admin members are still correctly blocked from creating/editing agents

Run with:
```bash
pytest tests/test_agents.py -v
```
**Note:** these tests currently run against the real local development database
(no separate test database yet) — this is a known gap to address later, not an
oversight.

## TTS Model Evaluation (AI4Bharat)

Two AI4Bharat TTS approaches were evaluated for the voice response pipeline.

### Option A: Indic Parler-TTS
- Single multilingual model, 21 languages including English, Hindi, Odia
- Autoregressive architecture — generates audio sequentially, which is inherently slower
- CPU generation time: ~65 seconds for a single short sentence (tested on Colab CPU)
- Quality: good for English and Hindi; Odia noticeably weaker (accented, less fluent),
  not resolved by adjusting the voice description prompt
- **Verdict: too slow for real-time use on CPU**

### Option B: Indic-TTS (FastPitch + HiFi-GAN)
- AI4Bharat's original ICASSP 2023 models, monolingual (one checkpoint per language)
- Non-autoregressive architecture — generates audio in parallel, much faster
- CPU real-time factor: ~0.89 (Hindi), ~1.0 (Odia) — i.e., close to or faster than real-time
  (tested on Colab CPU; local hardware not yet confirmed)
- Quality: good for both Hindi and Odia
- Requires the `coqui-tts` package (community-maintained fork of the original,
  now-unmaintained `coqui-ai/TTS`); requires `transformers==4.57.6` specifically due to
  a breaking change in `transformers` 5.x
- FastPitch models are multi-speaker (`female`/`male` speaker IDs required)
- Default speech pace was too slow; fixed via the `length_scale` parameter
  (`0.8` gave a more natural pace) — only accessible via the Python API, not the `tts`
  CLI tool
- **Verdict: current best option** — dramatically faster than Parler-TTS, acceptable quality

### Open question
AI4Bharat has also released `en.zip` and `en+hi.zip` checkpoints for this same
FastPitch+HiFi-GAN architecture, suggesting English may be coverable by the same model
family — not yet tested. If confirmed, this would allow one consistent TTS system across
all 3 required languages instead of mixing two different approaches.

### Known gap
All timings above were measured on Google Colab's CPU, not the actual deployment target
(local i5 laptop). Real hardware testing is still required before treating these numbers
as validated for production use.

### Updates (sync with frontend contract)
- Added `updated_at` timestamp field to agents — auto-refreshes on every update via SQLAlchemy's `onupdate=func.now()`, verified via PUT + separate GET
- `status` is now validated against a fixed set (`draft`, `active`, `inactive`) using a Pydantic enum — invalid values correctly return 422 instead of being silently accepted
- Confirmed `DELETE /agents/{id}` correctly blocks non-admin members (403), completing full RBAC coverage across POST/PUT/DELETE
- Test suite expanded from 4 to 7 automated tests covering all of the above

## Frontend-Backend Sync Fixes

Reviewed against Saswati's actual frontend implementation (agentService.ts, agent.ts,AgentForm.tsx) to close real gaps between the documented contract and backend behavior.

- **`updated_at`**: added to the Agent model, auto-refreshes on every update
- **`status` validation**: now enforced via a Pydantic enum (`draft`, `active`, `inactive`)
  — invalid values return 422 instead of being silently accepted
- **RBAC completeness**: confirmed DELETE (in addition to previously-tested POST/PUT)
  correctly blocks non-admin members
- Test suite expanded to 7 automated tests covering all of the above

### Known gap (not backend's responsibility to fix)
Dashboard, Calls, and Analytics screens on the frontend currently run on dummy data
(`dummyData.ts`, `dummyCalls.ts`) — no corresponding backend endpoints exist yet.
Flagged for a separate scope discussion, not part of the current Agent-focused work.

## Architecture Change: Vonage Voice API for MVP Telephony
Decision made to use Vonage Voice API to handle real phone numbers, PSTN calls,
STT, TTS, and call lifecycle events for the MVP — replacing the self-hosted
AI4Bharat/Piper STT/TTS evaluation track for now. Rationale: avoids CPU latency
and Odia-language TTS quality issues found during independent model evaluation
(see TTS Model Evaluation section above), at the cost of relying on a third-party
telephony vendor rather than in-house models.

## Receptionist Brain (v1)
An independent module, decoupled from Vonage, that accepts caller text and
returns a structured decision object. Vonage-specific webhook code (planned,
not yet built) will later convert this result into NCCO talk/input instructions.

### Endpoint
`POST /agents/{agent_id}/simulate`

Request:
```json
{
  "call_id": "test-call-1",
  "message": "I want to book an appointment tomorrow"
}
```

Response:
```json
{
  "response_text": "I can help you book an appointment. We have availability tomorrow at 10 AM and 3 PM. Which would you prefer?",
  "intent": "appointment_booking",
  "detected_language": "hi",
  "transfer_required": false,
  "end_call": false
}
```
### Current behavior
- Reuses existing keyword-based logic (`handle_appointment_enquiry`) for response text
- Classifies message into a basic intent: `appointment_booking`, `greeting`, or `fallback`
- `detected_language` defaults to the agent's first configured language (not real
  language detection yet)
- `transfer_required` and `end_call` are hardcoded `false` (no real transfer/ending
  logic yet)
- Inactive agents return a safe fallback response (`agent_unavailable`, `end_call: true`)
  rather than an HTTP error — the brain always returns a valid structured decision

### Conversation memory
New `conversation_turns` table stores every caller and agent message per `call_id`
(role, message, timestamp). Currently write-only — history is saved but not yet
read back into reply generation. This is the foundation for upcoming context-aware
responses.

### Explicitly not yet built (tracked, not forgotten)
- Business-hours checking
- Real intent detection beyond 3 keyword categories
- Company info / FAQ matching
- Appointment, lead, and callback persistence
- Department routing / human-transfer decisions
- Confidence scoring
- Call summaries
- Vonage webhooks (`/answer`, `/input`)

### Business Hours Checking
`/simulate` now checks the agent's `business_hours` against the current time
before generating a reply. Outside business hours, the brain returns a safe
fallback (`intent: "outside_business_hours"`, `end_call: true`) instead of a
normal conversational response.

**Known limitation:** timezone is hardcoded to IST (Asia/Kolkata) for all
agents. No per-organisation/per-agent timezone field exists yet. Acceptable
for an India-only MVP; would need addressing if the platform expands beyond
India.

**Windows-specific setup note:** the `zoneinfo` module requires the `tzdata`
package to be installed separately on Windows (`pip install tzdata`) — Linux
and Mac have this data built into the OS, Windows does not.

### Context-Aware Replies (basic)
The brain now fetches prior conversation turns for a given `call_id` before
generating each reply, enabling one basic multi-turn pattern: if the agent's
previous message asked the caller to choose an appointment time, a follow-up
message like "10am works" is recognized as a confirmation
(`intent: "appointment_confirmed"`) rather than falling through to the
generic fallback response.

**Known limitation:** this is rule-based pattern matching on the previous
agent message, not real conversational understanding. It only handles the
one flow currently built (appointment time confirmation). A general-purpose
LLM-based understanding layer would be needed for the brain to handle
arbitrary multi-turn conversations — a separate, bigger decision (cost,
latency, provider choice) not yet made.
### Real Intent Detection (7 intents)
`detect_intent()` and `build_response_text()` are now separate functions —
detecting what the caller wants vs. generating a reply for it, so each can
be tested and extended independently.

Current intents: `greeting`, `appointment_booking`, `appointment_confirmed`,
`callback_request`, `goodbye`, `faq`, `fallback`.

`goodbye` is the first intent to set `end_call: true` on a normal
(non-error) path.

### Pre-trained intent models — evaluated and rejected
Several free, open-source Hugging Face intent classification models were
investigated (Godfrey2712/intent_recognition, NOVA-vision-language/task-intent-detector,
Falconsai/intent_classification). All were rejected: each is trained on a
fixed label set for a different domain (argumentation analysis, cooking-task
steps, and generic discourse acts, respectively) that does not map to
receptionist intents. A pre-trained classifier is only usable if your
desired output labels already match what it was trained on — none did.

### FAQ System
New `faqs` table, scoped to an organisation (shared across all its agents,
not per-agent). Admin-only creation via `POST /organisations/{id}/faqs`,
open listing via `GET /organisations/{id}/faqs`.

FAQ intent detection checks the caller's message against real stored FAQ
questions (word overlap, 2+ shared words), rather than a fixed keyword
list — adding a new FAQ automatically makes related questions detectable,
no code change required.

**Known limitation:** word-overlap matching only catches near-identical
phrasing. It does not understand synonyms or different word forms (e.g.
"accept" vs. "accepted" only share the root, not the exact word, and won't
match). A caller asking the same question with different wording may not
match an existing FAQ. This is an accepted tradeoff of the current
zero-cost, keyword-based approach — not a bug to keep patching with more
string rules. Planned resolution: once real call data accumulates via
`conversation_turns`, a lightweight open-source embedding model or a
properly trained classifier can replace this.

### Confidence Scoring
`/simulate` now returns a `confidence` field (0.0–1.0). This is currently a
**hand-built heuristic**, not a real probability from a trained model:
- `1.0` — deterministic system states (emergency, agent unavailable, outside
  business hours) — these aren't language-ambiguous, so full confidence is
  appropriate
- `0.95` — human transfer requests
- `0.9` — clearly keyword-matched intents (greeting, appointment_booking,
  appointment_confirmed, callback_request, goodbye)
- `0.85` — FAQ intent with a real matched answer
- `0.5` — FAQ intent detected, but no stored FAQ actually matched
- `0.3` — fallback (nothing matched)

**Planned change:** once the trained intent/sentiment model (see below) is
integrated into this endpoint, this heuristic should be replaced with the
model's actual predicted probability.

### Call Summaries
New `call_summaries` table. A summary is saved automatically whenever a call
ends (`end_call: true`), covering all 4 paths that can end a call: emergency,
agent unavailable, outside business hours, and a normal `goodbye`. Each
summary records the final intent, whether a transfer was required, which
department (if any), and the total number of conversation turns.

View via `GET /organisations/{organisation_id}/call-summaries`.

### FAQ Matching — Stop Words Fix
Found and fixed a false-positive bug: FAQ matching/detection counted shared
words between the caller's message and stored FAQ questions, but didn't
exclude common filler words ("do", "you", "is", "the", etc.). This caused
unrelated questions to wrongly match stored FAQs purely because they shared
generic connector words. Fixed by introducing a `STOP_WORDS` set, excluded
from both `detect_intent()`'s FAQ check and `find_matching_faq()`, so a match
now requires genuinely meaningful shared words.

This is a refinement of the previously-documented word-overlap limitation
(see earlier note on "accept" vs. "accepted" not matching) — that limitation
still stands; this fix addresses a different, more serious failure mode
(confidently wrong matches, not just missed matches).

## ML Model Track (parallel, not yet integrated)

A separate effort has produced a trained intent + sentiment classification
model, intended to eventually replace the rule-based `detect_intent()`
function used in `/simulate` today.

**Current state:**
- Dataset: 7,000 caller-side English utterances (5,600 train / 700
  validation / 700 test)
- Labels: same 7 intents as the rule-based system (greeting,
  appointment_booking, appointment_confirmed, callback_request, faq,
  goodbye, fallback), plus 3-class sentiment (positive, neutral, negative)
- Architecture: multi-task DistilBERT, one shared encoder, two classification
  heads (intent + sentiment)
- Best checkpoint (epoch 2): 98.00% intent accuracy, 99.29% sentiment
  accuracy, 97.43% exact match on validation
- Saved package: `voice_receptionist_baseline_v1` (weights, tokenizer,
  config, reports, checkpoint)

**Planned full pipeline** (not yet built):
Caller audio → STT → intent/sentiment model → entity extraction →
conversation-state manager → clinic database/FAQ or appointment action →
templated reply generation → TTS.

**Key design principles for the eventual reply system** (agreed, not yet
implemented):
- Extract structured entities (date, time, doctor, department, patient
  relation, callback time) rather than relying on raw keyword matching
- Never confirm an appointment without checking real availability first
- Never invent medical, pricing, or clinic information — only use real
  stored data
- Add an apologetic/calming sentence when sentiment is negative
- Use controlled reply templates, not free-form generation, to keep output
  predictable and safe for a healthcare context

**Status:** this model is not yet called anywhere in the codebase. The
current `/simulate` endpoint uses only the rule-based logic described
throughout this document. Integration is planned future work.