import { useEffect, useState } from "react";
import { getProjects, createProject } from "../api/projects";
import ProjectCard from "../components/ProjectCard";
import Tasks from "../components/Tasks";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedProject, setSelectedProject] = useState(null); // Selected project for tasks

  // Load all projects
  const loadProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      console.error("Failed to load projects:", err);
    }
  };

  // Create new project
  const handleCreate = async () => {
    if (!title.trim()) return;
    try {
      await createProject({ title, description });
      setTitle("");
      setDescription("");
      loadProjects();
    } catch (err) {
      console.error("Failed to create project:", err);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">My Projects</h2>

      {/* Create Project */}
      <div className="mb-6 flex flex-col md:flex-row gap-2">
        <input
          className="border p-2 flex-1 rounded"
          placeholder="Project title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="border p-2 flex-1 rounded"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Project
        </button>
      </div>

      {/* Project List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {projects.map((p) => (
          <div
            key={p._id}
            onClick={() => setSelectedProject(p)}
            className={`cursor-pointer ${
              selectedProject?._id === p._id ? "border-2 border-blue-600" : ""
            }`}
          >
            <ProjectCard project={p} />
          </div>
        ))}
      </div>

      {/* Tasks for selected project */}
      {selectedProject && (
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-4">
            Tasks for: {selectedProject.title}
          </h3>
          <Tasks projectId={selectedProject._id} />
        </div>
      )}
    </div>
  );
}
