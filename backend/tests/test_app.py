import pytest
from app import app, employees, tasks


@pytest.fixture
def client():
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client


def test_health(client):
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.get_json()
    assert data["status"] == "ok"
    assert "timestamp" in data


def test_get_employees(client):
    res = client.get("/api/employees")
    assert res.status_code == 200
    data = res.get_json()
    assert isinstance(data, list)
    assert len(data) >= 1


def test_get_employee_by_id(client):
    res = client.get("/api/employees/1")
    assert res.status_code == 200
    data = res.get_json()
    assert data["id"] == 1
    assert "name" in data


def test_get_employee_not_found(client):
    res = client.get("/api/employees/9999")
    assert res.status_code == 404


def test_create_employee(client):
    payload = {
        "name": "Test User",
        "role": "QA Engineer",
        "department": "Engineering",
        "email": "test@office.com",
    }
    res = client.post("/api/employees", json=payload)
    assert res.status_code == 201
    data = res.get_json()
    assert data["name"] == "Test User"
    assert data["role"] == "QA Engineer"


def test_create_employee_missing_fields(client):
    res = client.post("/api/employees", json={"name": "Only Name"})
    assert res.status_code == 400


def test_get_tasks(client):
    res = client.get("/api/tasks")
    assert res.status_code == 200
    data = res.get_json()
    assert isinstance(data, list)


def test_get_stats(client):
    res = client.get("/api/stats")
    assert res.status_code == 200
    data = res.get_json()
    assert "total_employees" in data
    assert "total_tasks" in data
    assert "departments" in data
