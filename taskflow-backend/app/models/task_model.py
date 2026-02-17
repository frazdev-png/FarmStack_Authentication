from datetime import datetime

def task_model(task: dict, owner_email: str, project_id: str) -> dict:
    return {
        "title": task["title"],
        "description": task.get("description", ""),
        "status": task.get("status", "Todo"),
        "project_id": project_id,
        "owner": owner_email,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
