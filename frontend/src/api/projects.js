import api from './axios'

export const getProjects = async () => {
  try {
    const response = await api.get('/projects/')
    console.log('Projects response:', response.data)
    return response.data
  } catch (error) {
    console.error('Error fetching projects:', error.response?.data || error.message)
    throw error
  }
}

export const createProject = async (projectData) => {
  try {
    const response = await api.post('/projects/', projectData)
    console.log('Create project response:', response.data)
    return response.data
  } catch (error) {
    console.error('Error creating project:', error.response?.data || error.message)
    throw error
  }
}

export const updateProject = async (id, projectData) => {
  try {
    const response = await api.put(`/projects/${id}`, projectData)
    console.log('Update project response:', response.data)
    return response.data
  } catch (error) {
    console.error('Error updating project:', error.response?.data || error.message)
    throw error
  }
}

export const deleteProject = async (id) => {
  try {
    const response = await api.delete(`/projects/${id}`)
    console.log('Delete project response:', response.data)
    return response.data
  } catch (error) {
    console.error('Error deleting project:', error.response?.data || error.message)
    throw error
  }
}