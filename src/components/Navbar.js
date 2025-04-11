import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
  const authContext = useContext(AuthContext);
  const { isAuthenticated, logout, user, isAdmin } = authContext;

  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate('/login'); // Redirige al login
  };

  const handleTitleClick = (e) => {
    if (isAuthenticated) {
      e.preventDefault(); // No hace nada si está logeado
    } else {
      navigate('/login'); // Redirige si no está logeado
    }
  };

  const authLinks = (
    <>
      <li>Hola {user && user.name}</li>
      <li>
        <Link to='/dashboard'>Dashboard</Link>
      </li>
      <li>
        <Link to='/buscar'>
          <i className="fas fa-search"></i> Consultar coins
        </Link>
      </li>
      {isAdmin() && (
        <li>
          <Link to="/personas">Agregar Coins</Link>
        </li>
      )}
      <li>
        <a onClick={onLogout} href="#!">
          <i className="fas fa-sign-out-alt"></i> <span>Salir</span>
        </a>
      </li>
    </>
  );

  const guestLinks = (
    <>
      <li>
        <Link to='/register'>Registro</Link>
      </li>
      <li>
        <Link to='/login'>Login</Link>
      </li>
      <li>
        <Link to='/buscar'>
          <i className="fas fa-search"></i> Consultar coins
        </Link>
      </li>
    </>
  );

  return (
    <div className="navbar">
      <h1>
        <a href="/login" onClick={handleTitleClick}>
          <i className="fas fa-id-card-alt"></i> UwU Cafe Porteños RP
        </a>
      </h1>
      <ul>
        {isAuthenticated ? authLinks : guestLinks}
      </ul>
    </div>
  );
};

export default Navbar;
