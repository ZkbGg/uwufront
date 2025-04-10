import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext'; // o el path correcto a `authState.js`
import './Uwulogin.css';

// Puedes instalar estos iconos con: npm install react-icons
// O reemplazarlos por imágenes si prefieres
import { FaUser, FaLock, FaHeart, FaCoffee } from 'react-icons/fa';

const Login = () => {
  const authContext = useContext(AuthContext);
  const { login, error, isAuthenticated } = authContext;
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const [user, setUser] = useState({
    email: '',
    password: ''
  });

  const { email, password } = user;

  const onChange = e => setUser({ ...user, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    if (email === '' || password === '') {
      alert('Por favor complete todos los campos');
    } else {
      login({
        email,
        password
      });
    }
  };

  return (
    <div className="uwu-login-container">
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
              />
            </div>
          </div>

          {error && <div className="uwu-error">{error}</div>}

          <button type="submit" className="uwu-submit-button">
            <FaHeart className="uwu-button-icon" /> Entrar al UwU Café
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