from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_create_agent_defaults_to_english():
    # Step 1: log in as an existing admin user to get a real token
    login_response = client.post("/login", json={
        "email": "member@futurios.com",
        "password": "memberpass123",
    })
    assert login_response.status_code == 200
    token = login_response.json()["access_token"]

    # Step 2: create an agent, deliberately not sending "languages"
    response = client.post(
        "/agents?organisation_id=1",
        json={
            "name": "Pytest Agent - Default Language",
            "status": "active",
        },
        headers={"Authorization": f"Bearer {token}"},
    )

    # Step 3: check it worked, and that languages defaulted correctly
    assert response.status_code == 200
    data = response.json()
    assert data["languages"] == ["en"]


def test_create_agent_with_valid_multiple_languages():
    login_response = client.post("/login", json={
        "email": "member@futurios.com",
        "password": "memberpass123",
    })
    token = login_response.json()["access_token"]

    response = client.post(
        "/agents?organisation_id=1",
        json={
            "name": "Pytest Agent - Multilingual",
            "status": "active",
            "languages": ["hi", "or"],
        },
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == 200
    assert response.json()["languages"] == ["hi", "or"]


def test_create_agent_with_invalid_language_returns_422():
    login_response = client.post("/login", json={
        "email": "member@futurios.com",
        "password": "memberpass123",
    })
    token = login_response.json()["access_token"]

    response = client.post(
        "/agents?organisation_id=1",
        json={
            "name": "Pytest Agent - Invalid Language",
            "status": "active",
            "languages": ["fr"],
        },
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == 422


def test_member_cannot_create_agent():
    login_response = client.post("/login", json={
        "email": "member1@test.com",
        "password": "testpass123",
    })
    token = login_response.json()["access_token"]

    response = client.post(
        "/agents?organisation_id=1",
        json={
            "name": "Pytest Agent - Should Be Blocked",
            "status": "active",
        },
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == 403

def test_invalid_status_returns_422():
    login_response = client.post("/login", json={
        "email": "member@futurios.com",
        "password": "memberpass123",
    })
    token = login_response.json()["access_token"]

    response = client.post(
        "/agents?organisation_id=1",
        json={"name": "Bad Status Agent", "status": "banana"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 422


def test_agent_has_updated_at_field():
    login_response = client.post("/login", json={
        "email": "member@futurios.com",
        "password": "memberpass123",
    })
    token = login_response.json()["access_token"]

    response = client.post(
        "/agents?organisation_id=1",
        json={"name": "Timestamp Check Agent", "status": "active"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    assert "updated_at" in response.json()


def test_member_cannot_delete_agent():
    login_response = client.post("/login", json={
        "email": "member1@test.com",
        "password": "testpass123",
    })
    token = login_response.json()["access_token"]

    response = client.delete(
        "/agents/15",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 403