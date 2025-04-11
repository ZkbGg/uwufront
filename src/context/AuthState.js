import React, { useReducer, useEffect } from 'react';
import axios from 'axios';
import AuthContext from './AuthContext';
import './axiosConfig'; // esto aplica los interceptores automáticamente

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  loading: true,
  user: null,
  error: null,
  users: []
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
      return {
        ...state,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
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

  // Configurar headers
  const setAuthToken = token => {
    if (token) {
      if (token.length > 1000) {
        console.warn('Token demasiado largo, puede causar problemas');
        return false;
      }
      axios.defaults.headers.common['x-auth-token'] = token;
      return true;
    } else {
      delete axios.defaults.headers.common['x-auth-token'];
      return false;
    }
  };

  // Cargar usuario
  const loadUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('No hay token, no se puede cargar usuario');
      dispatch({ type: 'AUTH_ERROR' });
      return;
    }
    
    const tokenSet = setAuthToken(token);
    if (!tokenSet) {
      console.log('Token inválido, no se puede cargar usuario');
      dispatch({ type: 'AUTH_ERROR' });
      return;
    }

    try {
      console.log('Intentando cargar usuario...');
      const res = await axios.get('/api/auth/user');
      console.log('Usuario cargado:', res.data);

      dispatch({
        type: 'USER_LOADED',
        payload: res.data
      });
    } catch (err) {
      console.error('Error al cargar usuario:', err.response?.data || err.message);
      dispatch({ type: 'AUTH_ERROR' });
    }
  };

  // Efecto inicial para cargar usuario si hay token
  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Token en inicio de aplicación:', token);
    
    if (token) {
      setAuthToken(token);
      loadUser();
    } else {
      dispatch({ type: 'AUTH_ERROR' });
    }
    // eslint-disable-next-line
  }, []);

  // Registrar usuario
  const register = async formData => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
  
    try {
      console.log('Intentando registrar usuario:', formData.email);
      const res = await axios.post('/api/auth/register', formData, config);
      console.log('Registro exitoso, respuesta:', res.data);
  
      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: res.data
      });
  
      if (res.data.token) {
        setAuthToken(res.data.token);
        loadUser();
      }
    } catch (err) {
      console.error('Error en registro:', err.response?.data || err.message);
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
      console.log('Intentando login con:', formData.email);
      const res = await axios.post('/api/auth/login', formData, config);
      console.log('Login exitoso, respuesta:', res.data);

      // Almacena el token inmediatamente
      if (res.data && res.data.token) {
        localStorage.setItem('token', res.data.token);
        setAuthToken(res.data.token);
      }

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: res.data
      });

      // Carga los datos del usuario
      await loadUser();
    } catch (err) {
      console.error('Error en login:', err.response?.data || err.message);
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