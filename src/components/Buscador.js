import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Buscador.css';

const Buscador = () => {
  const [query, setQuery] = useState('');
  const [resultado, setResultado] = useState(null);
  const [personas, setPersonas] = useState([]);

  useEffect(() => {
    // Obtenemos todas las personas solo una vez
    const fetchPersonas = async () => {
      try {
        const res = await axios.get('/api/personas'); // Cambia por tu ruta
        setPersonas(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPersonas();
  }, []);

  const handleBuscar = () => {
    if (!query.trim()) return setResultado(null);

    const found = personas.find(p =>
      `${p.nombre} ${p.apellido}`.toLowerCase().includes(query.toLowerCase())
    );

    setResultado(found || null);
  };

  return (
    <div className="buscador-container">
      <h2>Buscar Persona</h2>
      <input
        type="text"
        placeholder="Buscar por nombre o apellido"
        value={query}
        onChange={e => setQuery(e.target.value)}
        className="buscador-input"
      />
      <button onClick={handleBuscar} className="buscador-btn">
  Buscar 💗
</button>

      {resultado && (
        <div className="buscador-resultado">
          <p><strong>Nombre:</strong> {resultado.nombre}</p>
          <p><strong>Apellido:</strong> {resultado.apellido}</p>
          <p><strong>Cantidad:</strong> {resultado.cantidad}</p>
        </div>
      )}

      {resultado === null && query.trim() !== '' && (
        <p className="no-encontrado">No se encontró ninguna persona.</p>
      )}
    </div>
  );
};

export default Buscador;
