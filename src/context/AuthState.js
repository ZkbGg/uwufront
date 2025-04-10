import React, { useReducer } from 'react';
import axios from 'axios';
import AuthContext from './AuthContext';
import './axiosConfig'; // esto aplica los interceptores automáticamente
import { useEffect } from 'react';

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  loading: true,
  user: null,
  error: null
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'USER_LOADED':
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: action.payload
      };
    case 'REGISTER_SUCCESS':
    case 'LOGIN_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      axios.defaults.headers.common['x-auth-token'] = action.payload.token;
      return {
        ...state,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        // Si el servidor devuelve user en el payload, actualizamos el estado
        user: action.payload.user || state.user
      };
    case 'REGISTER_FAIL':
    case 'LOGIN_FAIL':
    case 'AUTH_ERROR':
    case 'LOGOUT':
    case 'DELETE_ACCOUNT':
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
        error: action.payload
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    case 'USERS_LOADED':
      return {
        ...state,
        users: action.payload,
        loading: false
      };
    default:
      return state;
  }
};

const AuthState = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      setAuthToken(localStorage.getItem('token'));
      loadUser(); // 👈 esto hace la llamada inicial
    } else {
      dispatch({ type: 'AUTH_ERROR' }); // 👈 esto detiene el loading si no hay token
    }
  }, []);
  

  // Configurar headers
  const setAuthToken = token => {
    if (token) {
      if (token.length > 1000) {
        console.warn('Token demasiado largo, puede causar problemas');
      }
      axios.defaults.headers.common['x-auth-token'] = token;
    } else {
      delete axios.defaults.headers.common['x-auth-token'];
    }
  };

  // Cargar usuario
  const loadUser = async () => {
    if (!localStorage.token || localStorage.token.length > 1000) {
      console.warn('Token inválido o muy largo, no se carga usuario');
      
      return;
    }
    
    
      axios.defaults.headers.common['x-auth-token'] = localStorage.token;

    try {
      const res = await axios.get('/api/auth/user');

      dispatch({
        type: 'USER_LOADED',
        payload: res.data
      });
    } catch (err) {
      dispatch({ type: 'AUTH_ERROR' });
    }
  };

  // Registrar usuario
  const register = async formData => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
  
    try {
        console.log('Headers actuales:', axios.defaults.headers);
      const res = await axios.post('/api/auth/register', formData, config);
  
      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: res.data
      });
  
      if (res.data.token) {
      // Configurar token antes de llamar a loadUser
      setAuthToken(res.data.token);
      loadUser(); // 👈 Solo después de setear correctamente el token
    }
    } catch (err) {
      dispatch({
        type: 'REGISTER_FAIL',
        payload: err.response?.data?.msg || 'Error al registrar'
      });
    }
  };

  // Login
  const login = async formData => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      const res = await axios.post('/api/auth/login', formData, config);

      console.log('LOGIN RESPONSE:', res.data); // 👈 Asegúrate que tenga token

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: res.data
      });

      loadUser();
    } catch (err) {
      dispatch({
        type: 'LOGIN_FAIL',
        payload: err.response?.data?.msg || 'Error de autenticación'
      });
    }
  };

  // Actualizar perfil
  const updateProfile = async formData => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      const res = await axios.put('/api/auth/user', formData, config);

      dispatch({
        type: 'USER_LOADED',
        payload: res.data
      });

      return true;
    } catch (err) {
      dispatch({
        type: 'AUTH_ERROR',
        payload: err.response?.data?.msg || 'Error al actualizar perfil'
      });
      return false;
    }
  };

  // Eliminar cuenta
  const deleteAccount = async () => {
    try {
      await axios.delete('/api/auth/user');

      dispatch({ type: 'DELETE_ACCOUNT' });
    } catch (err) {
      dispatch({
        type: 'AUTH_ERROR',
        payload: err.response?.data?.msg || 'Error al eliminar cuenta'
      });
    }
  };

  // Logout
  const logout = () => dispatch({ type: 'LOGOUT' });

  // Limpiar errores
  const clearError = () => dispatch({ type: 'CLEAR_ERROR' });

  // Verificar si el usuario es administrador
  const isAdmin = () => {
    return state.user?.role === 'admin';
  };

  // Verificar si el usuario tiene un rol específico
  const hasRole = (role) => {
    return state.user?.role === role;
  };

  // Obtener todos los usuarios (solo para administradores)
  const getAllUsers = async () => {
    try {
      const res = await axios.get('/api/auth/users');
      
      dispatch({
        type: 'USERS_LOADED',
        payload: res.data
      });
      
      return res.data;
    } catch (err) {
      dispatch({
        type: 'AUTH_ERROR',
        payload: err.response?.data?.msg || 'Error al obtener usuarios'
      });
      return [];
    }
  };

  // Crear usuario (solo para administradores)
  const createUser = async (userData) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      const res = await axios.post('/api/auth/users', userData, config);
      return res.data;
    } catch (err) {
      dispatch({
        type: 'AUTH_ERROR',
        payload: err.response?.data?.msg || 'Error al crear usuario'
      });
      return null;
    }
  };

  // Actualizar rol de usuario (solo para administradores)
  const updateUserRole = async (userId, role) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      const res = await axios.put('/api/auth/users/role', { userId, role }, config);
      return res.data;
    } catch (err) {
      dispatch({
        type: 'AUTH_ERROR',
        payload: err.response?.data?.msg || 'Error al actualizar rol'
      });
      return null;
    }
  };

  // Eliminar usuario por ID (solo para administradores)
  const deleteUserById = async (userId) => {
    try {
      await axios.delete(`/api/auth/users/${userId}`);
      return { success: true, msg: 'Usuario eliminado correctamente' };
    } catch (err) {
      dispatch({
        type: 'AUTH_ERROR',
        payload: err.response?.data?.msg || 'Error al eliminar usuario'
      });
      return { success: false, msg: err.response?.data?.msg || 'Error al eliminar usuario' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        user: state.user,
        error: state.error,
        users: state.users,
        register,
        login,
        logout,
        loadUser,
        clearError,
        updateProfile,
        deleteAccount,
        isAdmin,
        hasRole,
        getAllUsers,
        createUser,
        updateUserRole,
        deleteUserById
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthState;