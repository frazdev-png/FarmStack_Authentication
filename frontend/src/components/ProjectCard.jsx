const ProjectCard = ({ project, onEdit, onDelete }) => {
  return (
    <div className="project-card">
      <div className="project-header">
        <div>
          <h3 className="project-title">{project.title}</h3>
        </div>
      </div>
      <p className="project-description">{project.description}</p>
      <div className="project-actions">
        <button onClick={() => onEdit(project)} className="btn-edit">
          Edit
        </button>
        <button onClick={() => onDelete(project._id)} className="btn-delete">
          Delete
        </button>
      </div>
    </div>
  )
}

export default ProjectCard