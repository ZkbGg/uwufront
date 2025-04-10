import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import './Personas.css';
import { useNavigate } from 'react-router-dom';

const Personas = () => {
  const { token, user } = useContext(AuthContext); // 👈 ahora también usamos "user"
  const [personas, setPersonas] = useState([]);
  const [nuevaPersona, setNuevaPersona] = useState({ nombre: '', apellido: '', cantidad: '' });
  const navigate = useNavigate();

  // 🔒 Redirigir si no hay token
  useEffect(() => {
    if (!token) {
      navigate('/login', { state: { message: 'Iniciá sesión para ver las coins uwu 🍪' } });
    }
  }, [token, navigate]);

  const registrarLog = async (mensaje) => {
    try {
      await axios.post('/api/log', {
        log: mensaje,
        usuario: user?.alias || 'anónimo' // 👈 incluir alias del usuario
      }, {
        headers: { 'x-auth-token': token }
      });
    } catch (error) {
      console.error('Error al registrar log:', error);
    }
  };
  
  // Cargar personas
  useEffect(() => {
    if (!token) return;

    const fetchPersonas = async () => {
      try {
        const res = await axios.get('/api/personas', {
          headers: { 'x-auth-token': token }
        });
        setPersonas(res.data);
      } catch (error) {
        console.error('Error al cargar personas:', error);
      }
    };

    fetchPersonas();
  }, [token]);

  // Agregar persona
  const agregarPersona = async () => {
    try {
      const res = await axios.post('/api/personas', nuevaPersona, {
        headers: { 'x-auth-token': token }
      });
      setPersonas([...personas, res.data]);
      setNuevaPersona({ nombre: '', apellido: '', cantidad: '' });

      // 📝 Log
      await registrarLog(`✅ Se agregó persona: ${res.data.nombre} ${res.data.apellido}, cantidad: ${res.data.cantidad}`);
      console.log('✔️ Log enviado al backend');
    } catch (error) {
      console.error('Error al agregar persona:', error);
    }
  };

  // Editar cantidad
  const editarCantidad = async (id, nuevaCantidad) => {
    try {
      const res = await axios.put(`/api/personas/${id}`, { cantidad: nuevaCantidad }, {
        headers: { 'x-auth-token': token }
      });
      setPersonas(personas.map(p => (p._id === id ? res.data : p)));

      // 📝 Log
      await registrarLog(`✏️ Se editó cantidad de ${res.data.nombre} ${res.data.apellido} a ${res.data.cantidad}`);
    } catch (error) {
      console.error('Error al editar cantidad:', error);
    }
  };

  if (!token) return null;

  return (
    <div className="personas-container">
      <h2 className="personas-title">Lista de clientes VIP</h2>

      <div className="personas-list">
        {personas.length === 0 ? (
          <p className="no-personas">No hay personas registradas.</p>
        ) : (
          personas.map(p => (
            <div key={p._id} className="persona-item">
              <div className="persona-info">
                <span className="persona-nombre">{p.nombre} {p.apellido}</span>
                <div className="persona-cantidad">
                  <label>Cantidad:</label>
                  <input
                    type="number"
                    value={p.cantidad}
                    onChange={e => editarCantidad(p._id, e.target.value)}
                    className="cantidad-input"
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="add-persona-form">
        <h3>Agregar Nuevo Cliente</h3>
        <div className="form-inputs">
          <input
            placeholder="Nombre"
            value={nuevaPersona.nombre}
            onChange={e => setNuevaPersona({ ...nuevaPersona, nombre: e.target.value })}
            className="input-field"
          />
          <input
            placeholder="Apellido"
            value={nuevaPersona.apellido}
            onChange={e => setNuevaPersona({ ...nuevaPersona, apellido: e.target.value })}
            className="input-field"
          />
          <input
            type="number"
            placeholder="Cantidad"
            value={nuevaPersona.cantidad}
            onChange={e => setNuevaPersona({ ...nuevaPersona, cantidad: e.target.value })}
            className="input-field"
          />
          <button 
            onClick={agregarPersona} 
            className="add-button"
            disabled={!nuevaPersona.nombre || !nuevaPersona.apellido}
          >
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Personas;
