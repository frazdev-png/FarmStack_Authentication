from fastapi import FastAPI
from app.routes.auth_routes import router as auth_router
from app.routes.user_routes import router as user_router
from app.routes.project_routes import router as project_router
from app.routes.task_routes import router as task_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="TaskFlow API", description="A FastAPI-based project management system")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173", "http://127.0.0.1:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router)
app.include_router(user_router)
app.include_router(project_router)
app.include_router(task_router)


@app.get("/")
def root():
    return {"message": "TaskFlow Backend is running 🚀", "status": "healthy"}

