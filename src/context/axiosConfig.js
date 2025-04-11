// src/axiosConfig.js
import axios from 'axios';

// Configura la URL base si estás en producción
if (process.env.NODE_ENV === 'production') {
  // Ajusta la URL según corresponda a tu backend en Render
  axios.defaults.baseURL = 'https://uwucafeprp.onrender.com';
}

// Configura el token desde localStorage si existe al iniciar la app
const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['x-auth-token'] = token;
}

axios.interceptors.request.use((config) => {
  // No agregar token si es una ruta pública
  const publicRoutes = ['/api/auth/register', '/api/auth/login'];
  
  if (publicRoutes.includes(config.url)) {
    delete config.headers['x-auth-token'];
  } else {
    // Para todas las demás rutas, asegúrate de que el token esté configurado
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axios;