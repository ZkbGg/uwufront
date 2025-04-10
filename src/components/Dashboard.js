import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import './Dashboard.css'; 

const Dashboard = () => {
  const authContext = useContext(AuthContext);
  const { user, loadUser, updateProfile, deleteAccount } = authContext;

  useEffect(() => {
    loadUser();
    // eslint-disable-next-line
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || ''
      });
    }
  }, [user]);

  const { name, email } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    const success = await updateProfile(formData);
    if (success) {
      setIsEditing(false);
    }
  };

  const onDelete = () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.')) {
      deleteAccount();
    }
  };

  if (!user) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="user-info">
        {!isEditing ? (
          <>
            <h2>Bienvenido, {user.name}</h2>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Fecha de registro:</strong> {new Date(user.date).toLocaleDateString()}</p>
            <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
              Editar Perfil
            </button>
            <button className="btn btn-danger" onClick={onDelete}>
              Eliminar Cuenta
            </button>
          </>
        ) : (
          <form onSubmit={onSubmit}>
            <div className='form-group'>
              <label htmlFor='name'>Nombre</label>
              <input
                type='text'
                name='name'
                value={name}
                onChange={onChange}
                required
              />
            </div>
            <div className='form-group'>
              <label htmlFor='email'>Email</label>
              <input
                type='email'
                name='email'
                value={email}
                onChange={onChange}
                required
              />
            </div>
            <div className="button-group">
              <input
                type='submit'
                value='Guardar Cambios'
                className='btn btn-primary'
              />
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    name: user.name || '',
                    email: user.email || ''
                  });
                }}
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Dashboard;