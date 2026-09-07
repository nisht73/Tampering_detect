import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use((response) => {
  return response;
}, (error) => {
  if (error.response && error.response.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
  return Promise.reject(error);
});

export const login = (email, password) => api.post('/auth/login', { email, password });
export const register = (name, email, password) => api.post('/auth/register', { name, email, password });
export const getMe = () => api.get('/auth/me');

export const uploadDocument = (formData) => api.post('/documents/upload', formData, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});

export const createScreening = (data) => api.post('/screenings', data);
export const getScreening = (screeningId) => api.get(`/screenings/${screeningId}`);
export const getScreenings = (params) => api.get('/screenings', { params });

export const getDashboardStats = () => api.get('/stats/dashboard');

export const getUsers = (params) => api.get('/users', { params });
export const getUser = (id) => api.get(`/users/${id}`);
export const updateUser = (id, data) => api.put(`/users/${id}`, data);
export const deleteUser = (id) => api.delete(`/users/${id}`);

export const getAuditLogs = (params) => api.get('/audit-logs', { params });

export default api;