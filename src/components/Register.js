import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import './Uwuregister.css';

const Register = () => {
  const authContext = useContext(AuthContext);
  const { register, error, isAuthenticated } = authContext;
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  });

  const { name, email, password, password2 } = user;

  const onChange = e => setUser({ ...user, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    if (name === '' || email === '' || password === '') {
      alert('Por favor complete todos los campos');
    } else if (password !== password2) {
      alert('Las contraseñas no coinciden');
    } else {
      register({
        name,
        email,
        password
      });
    }
  };

  return (
    <div className='uwu-login-container'>
      <div className='uwu-background-pattern'></div>
      <div className='uwu-login-card'>
        <div className='uwu-header'>
          <div className='uwu-icon'>🌸</div>
          <h1>Registro UwU</h1>
          <p>Se parte de esta hermosa comunidad!</p>
        </div>
        <form className='uwu-form' onSubmit={onSubmit}>
          <div className='uwu-form-group'>
            <label htmlFor='name'>Nombre</label>
            <div className='uwu-input-container'>
              <span className='uwu-input-icon'>👤</span>
              <input
                type='text'
                name='name'
                value={name}
                onChange={onChange}
                required
              />
            </div>
          </div>
  
          <div className='uwu-form-group'>
            <label htmlFor='email'>Email</label>
            <div className='uwu-input-container'>
              <span className='uwu-input-icon'>📧</span>
              <input
                type='email'
                name='email'
                value={email}
                onChange={onChange}
                required
              />
            </div>
          </div>
  
          <div className='uwu-form-group'>
            <label htmlFor='password'>Contraseña</label>
            <div className='uwu-input-container'>
              <span className='uwu-input-icon'>🔒</span>
              <input
                type='password'
                name='password'
                value={password}
                onChange={onChange}
                required
                minLength='6'
              />
            </div>
          </div>
  
          <div className='uwu-form-group'>
            <label htmlFor='password2'>Confirmar Contraseña</label>
            <div className='uwu-input-container'>
              <span className='uwu-input-icon'>🔒</span>
              <input
                type='password'
                name='password2'
                value={password2}
                onChange={onChange}
                required
                minLength='6'
              />
            </div>
          </div>
  
          {error && <div className="uwu-error">{error}</div>}
  
          <button type="submit" className="uwu-submit-button">
            <span className="uwu-button-icon">🎀</span> Registrarse
          </button>
        </form>
        <div className='uwu-footer'>
          <span className='uwu-heart-icon'>💕</span> Hecho con 💕 por Edwyn
        </div>
      </div>
    </div>
  );
}
export default Register;
