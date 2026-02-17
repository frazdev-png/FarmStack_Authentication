import api from './axios'

export const getTasks = async (projectId) => {
  try {
    console.log(`Fetching tasks for project: ${projectId}`)
    const response = await api.get(`/tasks/project/${projectId}`)
    console.log('Tasks response:', response.data)
    return response.data
  } catch (error) {
    console.error('Error fetching tasks:', error.response?.data || error.message)
    throw error
  }
}

export const createTask = async (projectId, taskData) => {
  try {
    const response = await api.post(`/tasks/${projectId}`, taskData)
    console.log('Create task response:', response.data)
    return response.data
  } catch (error) {
    console.error('Error creating task:', error.response?.data || error.message)
    throw error
  }
}

export const updateTask = async (taskId, taskData) => {
  try {
    const response = await api.put(`/tasks/${taskId}`, taskData)
    console.log('Update task response:', response.data)
    return response.data
  } catch (error) {
    console.error('Error updating task:', error.response?.data || error.message)
    throw error
  }
}

export const deleteTask = async (taskId) => {
  try {
    const response = await api.delete(`/tasks/${taskId}`)
    console.log('Delete task response:', response.data)
    return response.data
  } catch (error) {
    console.error('Error deleting task:', error.response?.data || error.message)
    throw error
  }
}