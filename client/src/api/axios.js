import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 30000,
});

// Attach JWT token for admin requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('sarkarsetuAdminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally (auto-logout)
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('sarkarsetuAdminToken');
      localStorage.removeItem('sarkarsetuAdmin');
    }
    return Promise.reject(err);
  }
);

export default API;
