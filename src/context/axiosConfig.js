// src/axiosConfig.js
import axios from 'axios';

axios.interceptors.request.use((config) => {
  // No agregar token si es una ruta pública
  const publicRoutes = ['/api/auth/register', '/api/auth/login'];

  if (publicRoutes.includes(config.url)) {
    delete config.headers['x-auth-token'];
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axios;
