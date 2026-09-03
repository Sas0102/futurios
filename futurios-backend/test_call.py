import jwt
import time
import requests

APPLICATION_ID = "4eb6c6c2-8739-4c12-a033-cbcfd1b00689"
PRIVATE_KEY_PATH = r"C:\Users\LENOVO\OneDrive\Desktop\voice-ai-docs\futurios-backend\private.key"  # UPDATE THIS

with open(PRIVATE_KEY_PATH, "r") as f:
    private_key = f.read()

payload = {
    "iat": int(time.time()),
    "exp": int(time.time()) + 60,
    "jti": str(int(time.time())),
    "application_id": APPLICATION_ID,
}
token = jwt.encode(payload, private_key, algorithm="RS256")

response = requests.post(
    "https://api.nexmo.com/v1/calls",
    headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
    json={
        "to": [{"type": "phone", "number": "91XXXXXXXXXX"}],  # UPDATE: your real number, country code, no + or spaces
        "from": {"type": "phone", "number": "12345678901"},
        "answer_url": ["https://unadorned-expediter-gift.ngrok-free.dev/vonage/answer"],
        "event_url": ["https://unadorned-expediter-gift.ngrok-free.dev/vonage/event"],
    },
)

print(response.status_code)
print(response.json())