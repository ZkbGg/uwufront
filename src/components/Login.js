import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import './Uwulogin.css';

// Puedes instalar estos iconos con: npm install react-icons
import { FaUser, FaLock, FaHeart, FaCoffee } from 'react-icons/fa';

const Login = () => {
  const authContext = useContext(AuthContext);
  const { login, error, isAuthenticated, clearError, loading } = authContext;
  const navigate = useNavigate();

  const [user, setUser] = useState({
    email: '',
    password: ''
  });
  
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loginFailed, setLoginFailed] = useState(false);

  const { email, password } = user;

  // Este efecto se ejecuta cuando cambia isAuthenticated o loading
  useEffect(() => {
    console.log('Estado de autenticación cambió:', { isAuthenticated, loading });
    
    // Solo redirigir si está autenticado y no está cargando
    if (isAuthenticated === true && loading === false) {
      console.log('Usuario autenticado, redirigiendo a dashboard...');
      navigate('/dashboard');
    }
    
    // Si hay un error de login y el formulario fue enviado, resetear el estado de envío
    if (error && formSubmitted) {
      setFormSubmitted(false);
      setLoginFailed(true);
      // Limpiar el error después de 3 segundos
      setTimeout(() => {
        clearError();
        setLoginFailed(false);
      }, 3000);
    }
  }, [isAuthenticated, loading, error, navigate, formSubmitted, clearError]);

  // Este efecto se ejecuta al montar el componente
  useEffect(() => {
    console.log('Componente Login montado');
    // Si ya está autenticado, redirigir inmediatamente
    if (isAuthenticated === true) {
      console.log('Ya autenticado al montar, redirigiendo...');
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const onChange = e => setUser({ ...user, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    
    if (email === '' || password === '') {
      alert('Por favor complete todos los campos');
      return;
    }
    
    console.log('Enviando formulario de login...');
    setFormSubmitted(true);
    
    // Intentar hacer login
    await login({
      email,
      password
    });
    
    // No necesitamos setTimeout aquí porque el useEffect se encargará de la redirección
    // cuando isAuthenticated cambie a true
  };

  // Función para debug
  const checkAuthStatus = () => {
    console.log('Estado actual:', { 
      isAuthenticated, 
      loading, 
      error,
      formSubmitted,
      user: authContext.user
    });
  };

  return (
    <div className="uwu-login-container">
      {/* Botón de debug oculto - quitar en producción */}
      <button 
        onClick={checkAuthStatus} 
        style={{ position: 'absolute', top: '5px', right: '5px', fontSize: '10px' }}
      >
        Check Auth
      </button>

      {/* Fondo con patrón */}
      <div className="uwu-background-pattern"></div>

      {/* Tarjeta de login */}
      <div className="uwu-login-card">
        {/* Cabecera */}
        <div className="uwu-header">
          <div className="uwu-icon">
            <FaCoffee />
          </div>
          <h1>UwU Café</h1>
          <p>¡Bienvenido al mejor local de Porteños RP!</p>
        </div>

        {/* Formulario - usando tu lógica de autenticación existente */}
        <form onSubmit={onSubmit} className="uwu-form">
          <div className="uwu-form-group">
            <label htmlFor="email">Email</label>
            <div className="uwu-input-container">
              <span className="uwu-input-icon">
                <FaUser />
              </span>
              <input
                type="email"
                name="email"
                value={email}
                onChange={onChange}
                placeholder="Tu email en UwU Café"
                required
                disabled={formSubmitted}
              />
            </div>
          </div>

          <div className="uwu-form-group">
            <label htmlFor="password">Contraseña</label>
            <div className="uwu-input-container">
              <span className="uwu-input-icon">
                <FaLock />
              </span>
              <input
                type="password"
                name="password"
                value={password}
                onChange={onChange}
                placeholder="Tu contraseña secreta"
                required
                disabled={formSubmitted}
              />
            </div>
          </div>

          {(error || loginFailed) && (
            <div className="uwu-error">
              {error || 'Error al iniciar sesión. Inténtalo de nuevo.'}
            </div>
          )}

          <button 
            type="submit" 
            className="uwu-submit-button"
            disabled={formSubmitted}
          >
            {formSubmitted ? (
              'Accediendo...'
            ) : (
              <>
                <FaHeart className="uwu-button-icon" /> Entrar al UwU Café
              </>
            )}
          </button>

          <div className="uwu-footer">
            <FaHeart className="uwu-heart-icon" />
            <span>Disfruta tu estancia!</span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;