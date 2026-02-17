from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.project_schema import ProjectCreate, ProjectUpdate
from app.core.dependencies import get_current_user
from app.database import db
from app.models.project_model import project_model
from datetime import datetime
from bson import ObjectId

router = APIRouter(prefix="/projects", tags=["Projects"])

# Create Project
@router.post("/")
def create_project(project: ProjectCreate, current_user=Depends(get_current_user)):
    """Create a new project for the authenticated user."""
    projects_collection = db["projects"]
    new_project = project_model(project.dict(), current_user["email"])
    result = projects_collection.insert_one(new_project)
    return {
        "id": str(result.inserted_id),
        "message": "Project created ✅",
        "title": new_project["title"],
        "description": new_project["description"]
    }

# Get all user's projects
@router.get("/")
def get_projects(current_user=Depends(get_current_user)):
    """Get all projects for the authenticated user."""
    projects_collection = db["projects"]
    projects = list(projects_collection.find({"owner": current_user["email"]}))
    for p in projects:
        p["_id"] = str(p["_id"])
    return projects

# Update Project
@router.put("/{project_id}")
def update_project(project_id: str, project: ProjectUpdate, current_user=Depends(get_current_user)):
    """Update a project by ID."""
    projects_collection = db["projects"]
    
    try:
        existing_project = projects_collection.find_one({"_id": ObjectId(project_id), "owner": current_user["email"]})
    except Exception:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid project ID")
    
    if not existing_project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    update_data = {k: v for k, v in project.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()

    projects_collection.update_one({"_id": ObjectId(project_id)}, {"$set": update_data})
    return {"message": "Project updated ✅"}

# Delete Project
@router.delete("/{project_id}")
def delete_project(project_id: str, current_user=Depends(get_current_user)):
    """Delete a project and all related tasks."""
    projects_collection = db["projects"]
    tasks_collection = db["tasks"]

    try:
        result = projects_collection.delete_one({
            "_id": ObjectId(project_id),
            "owner": current_user["email"]
        })
    except Exception:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid project ID")

    if result.deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    # cascade delete tasks
    tasks_collection.delete_many({
        "project_id": project_id,
        "owner": current_user["email"]
    })

    return {"message": "Project & related tasks deleted ✅"}
