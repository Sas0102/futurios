from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def get_token(email, password):
    response = client.post("/login", json={"email": email, "password": password})
    return response.json()["access_token"]


def test_super_admin_can_list_all_organisations():
    token = get_token("member@futurios.com", "memberpass123")
    response = client.get("/admin/organisations", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_regular_user_cannot_list_all_organisations():
    token = get_token("member1@test.com", "testpass123")
    response = client.get("/admin/organisations", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 403


def test_plans_endpoint_is_public_and_returns_four_plans():
    response = client.get("/plans")
    assert response.status_code == 200
    plan_names = [p["name"] for p in response.json()]
    assert set(plan_names) == {"base", "growth", "pro", "custom"}


def test_demo_request_can_be_submitted_without_auth():
    response = client.post("/demo-requests", json={
        "name": "Automated Test Lead",
        "email": "autotest@example.com",
    })
    assert response.status_code == 200
    assert response.json()["company_name"] is None


def test_agent_creation_blocked_when_over_plan_limit():
    token = get_token("orgadmin-only@test.com", "testpass123")
    # Assumes org 1 is on Base plan (max_agents: 1) and already has more than 1 agent
    response = client.post(
        "/agents?organisation_id=1",
        json={"name": "Should Be Blocked By Plan Limit", "status": "active"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 403
    assert "Plan limit reached" in response.json()["detail"]


def test_api_key_creation_blocked_on_base_plan():
    token = get_token("orgadmin-only@test.com", "testpass123")
    # Assumes org 1 is on Base plan (api_access: false)
    response = client.post(
        "/organisations/1/api-keys",
        json={"name": "Should Be Blocked"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 403


def test_invalid_api_key_is_rejected():
    response = client.get(
        "/api/v1/agents",
        headers={"X-API-Key": "futr_thisisnotarealkey"},
    )
    assert response.status_code == 401