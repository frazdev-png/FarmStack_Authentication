from datetime import datetime

def project_model(project: dict, owner_email: str) -> dict:
    return {
        "title": project["title"],
        "description": project.get("description", ""),
        "owner": owner_email,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
