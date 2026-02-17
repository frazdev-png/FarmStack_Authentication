import { useState, useEffect } from 'react'
import ProjectCard from '../components/ProjectCard'
import Tasks from '../components/Tasks'
import { getProjects, createProject, updateProject, deleteProject } from '../api/projects'

const Dashboard = () => {
  const [projects, setProjects] = useState([])
  const [showProjectForm, setShowProjectForm] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [selectedProject, setSelectedProject] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  })

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      const data = await getProjects()
      setProjects(data)
    } catch (error) {
      console.error('Error loading projects:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingProject) {
        await updateProject(editingProject._id, formData)
      } else {
        await createProject(formData)
      }
      setFormData({ title: '', description: '' })
      setEditingProject(null)
      setShowProjectForm(false)
      loadProjects()
    } catch (error) {
      console.error('Error saving project:', error)
    }
  }

  const handleEdit = (project) => {
    setEditingProject(project)
    setFormData({
      title: project.title,
      description: project.description
    })
    setShowProjectForm(true)
  }

  const handleDelete = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(projectId)
        loadProjects()
        if (selectedProject === projectId) {
          setSelectedProject(null)
        }
      } catch (error) {
        console.error('Error deleting project:', error)
      }
    }
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">My Projects</h1>
        <button onClick={() => setShowProjectForm(true)} className="btn-primary">
          + New Project
        </button>
      </div>

      {showProjectForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">
                {editingProject ? 'Edit Project' : 'Create Project'}
              </h3>
              <button
                onClick={() => {
                  setShowProjectForm(false)
                  setEditingProject(null)
                  setFormData({ title: '', description: '' })
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
                  rows="4"
                />
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn-primary">
                  {editingProject ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowProjectForm(false)
                    setEditingProject(null)
                    setFormData({ title: '', description: '' })
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

      <div className="projects-grid">
        {projects.map((project) => (
          <ProjectCard
            key={project._id}
            project={project}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onSelect={() => setSelectedProject(project._id)}
          />
        ))}
      </div>

      {selectedProject && (
        <Tasks
          projectId={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  )
}

export default Dashboard