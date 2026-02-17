import { useState, useEffect } from 'react'
import TaskCard from './TaskCard'
import { getTasks, createTask, updateTask, deleteTask } from '../api/tasks'

const Tasks = ({ projectId, onClose }) => {
  const [tasks, setTasks] = useState([])
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Todo'
  })

  useEffect(() => {
    if (projectId) {
      loadTasks()
    }
  }, [projectId])

  const loadTasks = async () => {
    try {
      const data = await getTasks(projectId)
      setTasks(data)
    } catch (error) {
      console.error('Error loading tasks:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingTask) {
        await updateTask(editingTask._id, formData)
      } else {
        await createTask(projectId, formData)
      }
      setFormData({ title: '', description: '', status: 'Todo' })
      setEditingTask(null)
      setShowTaskForm(false)
      loadTasks()
    } catch (error) {
      console.error('Error saving task:', error)
    }
  }

  const handleEdit = (task) => {
    setEditingTask(task)
    setFormData({
      title: task.title,
      description: task.description,
      status: task.status || 'Todo'
    })
    setShowTaskForm(true)
  }

  const handleDelete = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(taskId)
        loadTasks()
      } catch (error) {
        console.error('Error deleting task:', error)
      }
    }
  }

  return (
    <div className="tasks-section">
      <div className="tasks-header">
        <h2 className="tasks-title">Tasks</h2>
        <div className="task-actions">
          <button onClick={() => setShowTaskForm(true)} className="btn-primary">
            Add Task
          </button>
          <button onClick={onClose} className="btn-edit">
            Close
          </button>
        </div>
      </div>

      {showTaskForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">
                {editingTask ? 'Edit Task' : 'Add Task'}
              </h3>
              <button
                onClick={() => {
                  setShowTaskForm(false)
                  setEditingTask(null)
                  setFormData({ title: '', description: '', status: 'Todo' })
                }}
                className="btn-close"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  className="form-input"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  className="form-input"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                >
                  <option value="Todo">Todo</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn-primary">
                  {editingTask ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowTaskForm(false)
                    setEditingTask(null)
                    setFormData({ title: '', description: '', status: 'Todo' })
                  }}
                  className="btn-delete"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="tasks-grid">
        {tasks.length === 0 ? (
          <p>No tasks yet. Add your first task!</p>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default Tasks