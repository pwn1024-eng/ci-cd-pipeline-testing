from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)

# In-memory data store (for demo purposes)
employees = [
    {"id": 1, "name": "Alice Johnson", "role": "Software Engineer", "department": "Engineering", "email": "alice@office.com", "status": "Active"},
    {"id": 2, "name": "Bob Smith", "role": "Product Manager", "department": "Product", "email": "bob@office.com", "status": "Active"},
    {"id": 3, "name": "Carol Williams", "role": "UX Designer", "department": "Design", "email": "carol@office.com", "status": "On Leave"},
    {"id": 4, "name": "David Brown", "role": "DevOps Engineer", "department": "Engineering", "email": "david@office.com", "status": "Active"},
    {"id": 5, "name": "Eva Martinez", "role": "HR Specialist", "department": "Human Resources", "email": "eva@office.com", "status": "Active"},
]

tasks = [
    {"id": 1, "title": "Prepare Q4 report", "assignee": "Alice Johnson", "status": "In Progress", "due_date": "2026-10-30"},
    {"id": 2, "title": "Update employee handbook", "assignee": "Eva Martinez", "status": "Pending", "due_date": "2026-11-05"},
    {"id": 3, "title": "Design new dashboard", "assignee": "Carol Williams", "status": "In Progress", "due_date": "2026-10-25"},
    {"id": 4, "title": "Deploy staging environment", "assignee": "David Brown", "status": "Completed", "due_date": "2026-10-18"},
]


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "timestamp": datetime.utcnow().isoformat()})


@app.route("/api/employees", methods=["GET"])
def get_employees():
    department = request.args.get("department")
    status = request.args.get("status")
    result = employees
    if department:
        result = [e for e in result if e["department"].lower() == department.lower()]
    if status:
        result = [e for e in result if e["status"].lower() == status.lower()]
    return jsonify(result)


@app.route("/api/employees/<int:emp_id>", methods=["GET"])
def get_employee(emp_id):
    emp = next((e for e in employees if e["id"] == emp_id), None)
    if not emp:
        return jsonify({"error": "Employee not found"}), 404
    return jsonify(emp)


@app.route("/api/employees", methods=["POST"])
def create_employee():
    data = request.get_json()
    if not data or not data.get("name") or not data.get("role"):
        return jsonify({"error": "Name and role are required"}), 400
    new_id = max(e["id"] for e in employees) + 1 if employees else 1
    new_emp = {
        "id": new_id,
        "name": data["name"],
        "role": data["role"],
        "department": data.get("department", "General"),
        "email": data.get("email", ""),
        "status": data.get("status", "Active"),
    }
    employees.append(new_emp)
    return jsonify(new_emp), 201


@app.route("/api/employees/<int:emp_id>", methods=["PUT"])
def update_employee(emp_id):
    emp = next((e for e in employees if e["id"] == emp_id), None)
    if not emp:
        return jsonify({"error": "Employee not found"}), 404
    data = request.get_json() or {}
    emp.update({k: v for k, v in data.items() if k in ["name", "role", "department", "email", "status"]})
    return jsonify(emp)


@app.route("/api/employees/<int:emp_id>", methods=["DELETE"])
def delete_employee(emp_id):
    global employees
    emp = next((e for e in employees if e["id"] == emp_id), None)
    if not emp:
        return jsonify({"error": "Employee not found"}), 404
    employees = [e for e in employees if e["id"] != emp_id]
    return jsonify({"message": "Employee deleted"}), 200


@app.route("/api/tasks", methods=["GET"])
def get_tasks():
    return jsonify(tasks)


@app.route("/api/tasks", methods=["POST"])
def create_task():
    data = request.get_json()
    if not data or not data.get("title"):
        return jsonify({"error": "Title is required"}), 400
    new_id = max(t["id"] for t in tasks) + 1 if tasks else 1
    new_task = {
        "id": new_id,
        "title": data["title"],
        "assignee": data.get("assignee", "Unassigned"),
        "status": data.get("status", "Pending"),
        "due_date": data.get("due_date", ""),
    }
    tasks.append(new_task)
    return jsonify(new_task), 201


@app.route("/api/stats", methods=["GET"])
def get_stats():
    return jsonify({
        "total_employees": len(employees),
        "active_employees": len([e for e in employees if e["status"] == "Active"]),
        "on_leave": len([e for e in employees if e["status"] == "On Leave"]),
        "total_tasks": len(tasks),
        "completed_tasks": len([t for t in tasks if t["status"] == "Completed"]),
        "departments": list(set(e["department"] for e in employees)),
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
