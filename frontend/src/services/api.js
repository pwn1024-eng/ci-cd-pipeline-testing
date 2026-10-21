import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

export const getEmployees = (params) => api.get('/employees', { params }).then(r => r.data)
export const getEmployee = (id) => api.get(`/employees/${id}`).then(r => r.data)
export const createEmployee = (data) => api.post('/employees', data).then(r => r.data)
export const updateEmployee = (id, data) => api.put(`/employees/${id}`, data).then(r => r.data)
export const deleteEmployee = (id) => api.delete(`/employees/${id}`).then(r => r.data)

export const getTasks = () => api.get('/tasks').then(r => r.data)
export const createTask = (data) => api.post('/tasks', data).then(r => r.data)

export const getStats = () => api.get('/stats').then(r => r.data)
export const getHealth = () => api.get('/health').then(r => r.data)

export default api
