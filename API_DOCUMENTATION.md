# TaskFlow API Documentation

## Base URL
```
http://localhost:8000
```

## Authentication
All endpoints (except `/auth/signup` and `/auth/login`) require a Bearer token in the Authorization header:
```
Authorization: Bearer {token}
```

---

## Endpoints

### Authentication

#### Signup
Create a new user account.

**Endpoint:** `POST /auth/signup`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully ✅",
  "email": "user@example.com"
}
```

**Errors:**
- `400`: Email already registered
- `422`: Validation error (invalid email format, password too short)

---

#### Login
Authenticate user and receive JWT token.

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "email": "user@example.com"
}
```

**Errors:**
- `401`: Invalid email or password
- `422`: Validation error

---

### Users

#### Get Current User
Get information about the authenticated user.

**Endpoint:** `GET /users/me`

**Headers:** 
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "email": "user@example.com",
  "message": "You are authenticated ✅"
}
```

**Errors:**
- `401`: Unauthorized (invalid or missing token)

---

### Projects

#### Get All Projects
Retrieve all projects for the authenticated user.

**Endpoint:** `GET /projects/`

**Headers:** 
```
Authorization: Bearer {token}
```

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Project Name",
    "description": "Project description",
    "owner": "user@example.com",
    "created_at": "2024-02-08T10:30:00",
    "updated_at": "2024-02-08T10:30:00"
  }
]
```

---

#### Create Project
Create a new project.

**Endpoint:** `POST /projects/`

**Headers:** 
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "New Project",
  "description": "Project description (optional)"
}
```

**Response (200):**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "message": "Project created ✅",
  "project": {
    "title": "New Project",
    "description": "Project description",
    "owner": "user@example.com",
    "created_at": "2024-02-08T10:30:00",
    "updated_at": "2024-02-08T10:30:00"
  }
}
```

**Errors:**
- `401`: Unauthorized
- `422`: Validation error

---

#### Update Project
Update an existing project.

**Endpoint:** `PUT /projects/{project_id}`

**Headers:** 
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Updated Title",
  "description": "Updated description"
}
```

**Response (200):**
```json
{
  "message": "Project updated ✅"
}
```

**Errors:**
- `401`: Unauthorized
- `404`: Project not found
- `400`: Invalid project ID

---

#### Delete Project
Delete a project and all associated tasks.

**Endpoint:** `DELETE /projects/{project_id}`

**Headers:** 
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "message": "Project & related tasks deleted ✅"
}
```

**Errors:**
- `401`: Unauthorized
- `404`: Project not found
- `400`: Invalid project ID

---

### Tasks

#### Get Tasks for Project
Retrieve all tasks for a specific project.

**Endpoint:** `GET /tasks/project/{project_id}`

**Headers:** 
```
Authorization: Bearer {token}
```

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "title": "Task Title",
    "description": "Task description",
    "status": "Todo",
    "project_id": "507f1f77bcf86cd799439011",
    "owner": "user@example.com",
    "created_at": "2024-02-08T10:30:00",
    "updated_at": "2024-02-08T10:30:00"
  }
]
```

---

#### Create Task
Create a new task in a project.

**Endpoint:** `POST /tasks/{project_id}`

**Headers:** 
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "New Task",
  "description": "Task description (optional)",
  "status": "Todo"
}
```

**Status values:** `Todo`, `In Progress`, `Done`

**Response (200):**
```json
{
  "id": "507f1f77bcf86cd799439012",
  "message": "Task created ✅",
  "task": {
    "title": "New Task",
    "description": "Task description",
    "status": "Todo",
    "project_id": "507f1f77bcf86cd799439011",
    "owner": "user@example.com",
    "created_at": "2024-02-08T10:30:00",
    "updated_at": "2024-02-08T10:30:00"
  }
}
```

**Errors:**
- `401`: Unauthorized
- `404`: Project not found
- `400`: Invalid project ID
- `422`: Validation error

---

#### Update Task
Update an existing task.

**Endpoint:** `PUT /tasks/{task_id}`

**Headers:** 
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "status": "In Progress"
}
```

**Response (200):**
```json
{
  "message": "Task updated ✅"
}
```

**Errors:**
- `401`: Unauthorized
- `404`: Task not found
- `400`: Invalid task ID
- `422`: Validation error (invalid status)

---

#### Delete Task
Delete a task.

**Endpoint:** `DELETE /tasks/{task_id}`

**Headers:** 
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "message": "Task deleted ✅"
}
```

**Errors:**
- `401`: Unauthorized
- `404`: Task not found
- `400`: Invalid task ID

---

#### Filter Tasks by Status
Get tasks filtered by status.

**Endpoint:** `GET /tasks/project/{project_id}/filter?status=Todo`

**Headers:** 
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `status` (required): `Todo`, `In Progress`, or `Done`

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "title": "Task Title",
    "description": "Task description",
    "status": "Todo",
    "project_id": "507f1f77bcf86cd799439011",
    "owner": "user@example.com",
    "created_at": "2024-02-08T10:30:00",
    "updated_at": "2024-02-08T10:30:00"
  }
]
```

**Errors:**
- `401`: Unauthorized
- `400`: Invalid status value

---

## Error Responses

### 400 Bad Request
```json
{
  "detail": "Error description"
}
```

### 401 Unauthorized
```json
{
  "detail": "Invalid token" or "User not found" or "Invalid or expired token"
}
```

### 404 Not Found
```json
{
  "detail": "Resource not found"
}
```

### 422 Unprocessable Entity
```json
{
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "invalid email format",
      "type": "value_error.email"
    }
  ]
}
```

### 500 Internal Server Error
```json
{
  "detail": "Internal server error"
}
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input or request |
| 401 | Unauthorized - Missing or invalid token |
| 404 | Not Found - Resource not found |
| 422 | Unprocessable Entity - Validation error |
| 500 | Internal Server Error - Server error |

---

## Testing the API

### Using Swagger UI
Visit `http://localhost:8000/docs` in your browser for interactive API documentation.

### Using cURL

**Signup:**
```bash
curl -X POST http://localhost:8000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

**Login:**
```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

**Get Projects (with token):**
```bash
curl -X GET http://localhost:8000/projects/ \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Rate Limiting
Currently, no rate limiting is implemented. Please implement rate limiting in production.

## Pagination
Currently, no pagination is implemented. All results are returned in a single response.

## Last Updated
February 8, 2026
