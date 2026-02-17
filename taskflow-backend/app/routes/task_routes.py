from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.task_schema import TaskCreate, TaskUpdate
from app.core.dependencies import get_current_user
from app.database import db
from app.models.task_model import task_model
from datetime import datetime
from bson import ObjectId

router = APIRouter(prefix="/tasks", tags=["Tasks"])

# Create Task under Project
@router.post("/{project_id}")
def create_task(project_id: str, task: TaskCreate, current_user=Depends(get_current_user)):
    """Create a new task under a project."""
    projects_collection = db["projects"]
    tasks_collection = db["tasks"]

    try:
        project = projects_collection.find_one({
            "_id": ObjectId(project_id),
            "owner": current_user["email"]
        })
    except Exception:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid project ID")

    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    new_task = task_model(task.dict(), current_user["email"], project_id)
    result = tasks_collection.insert_one(new_task)

    return {
        "id": str(result.inserted_id),
        "message": "Task created ✅",
        "title": new_task["title"],
        "status": new_task["status"]
    }

# Get Tasks by Project
@router.get("/project/{project_id}")
def get_tasks(project_id: str, current_user=Depends(get_current_user)):
    """Get all tasks for a specific project."""
    tasks_collection = db["tasks"]
    tasks = list(tasks_collection.find({
        "project_id": project_id,
        "owner": current_user["email"]
    }))

    for t in tasks:
        t["_id"] = str(t["_id"])

    return tasks

# Update Task
@router.put("/{task_id}")
def update_task(task_id: str, task: TaskUpdate, current_user=Depends(get_current_user)):
    """Update a task by ID."""
    tasks_collection = db["tasks"]
    
    try:
        existing_task = tasks_collection.find_one({
            "_id": ObjectId(task_id),
            "owner": current_user["email"]
        })
    except Exception:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid task ID")

    if not existing_task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")

    update_data = {k: v for k, v in task.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()

    tasks_collection.update_one(
        {"_id": ObjectId(task_id)},
        {"$set": update_data}
    )

    return {"message": "Task updated ✅"}

# Delete Task
@router.delete("/{task_id}")
def delete_task(task_id: str, current_user=Depends(get_current_user)):
    """Delete a task by ID."""
    tasks_collection = db["tasks"]
    
    try:
        result = tasks_collection.delete_one({
            "_id": ObjectId(task_id),
            "owner": current_user["email"]
        })
    except Exception:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid task ID")

    if result.deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")

    return {"message": "Task deleted ✅"}

# Filter Tasks by Status
@router.get("/project/{project_id}/filter")
def filter_tasks(
    project_id: str,
    status: str,
    current_user=Depends(get_current_user)
):
    """Filter tasks by status for a specific project."""
    tasks_collection = db["tasks"]

    # Validate status
    valid_statuses = ["Todo", "In Progress", "Done"]
    if status not in valid_statuses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid status. Must be one of: {', '.join(valid_statuses)}"
        )

    tasks = list(tasks_collection.find({
        "project_id": project_id,
        "status": status,
        "owner": current_user["email"]
    }))

    for t in tasks:
        t["_id"] = str(t["_id"])

    return tasks
