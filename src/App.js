import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // Todo en un solo import
import AuthState from './context/AuthState';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';

import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Personas from './components/Personas';
import Buscador from './components/Buscador';
import Pagewrapper from './components/Pagewrapper';
import './App.css';

function App() {
  return (
    <AuthState>
      <Router>
        <div className="App">
          <Navbar />
          <div className="container">
            <Routes>
              {/* ✅ Redirección desde "/" */}
              <Route path="/" element={<Navigate to="/login" />} />
              
              <Route path="/buscar" element={<Pagewrapper><Buscador /></Pagewrapper>} />
              <Route path="/login" element={<Pagewrapper><Login /></Pagewrapper>} />
              <Route path="/register" element={<Pagewrapper><Register /></Pagewrapper>} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Pagewrapper><Dashboard /></Pagewrapper>
                </ProtectedRoute>
              }/>
              <Route path="/personas" element={
                <AdminRoute>
                  <Pagewrapper><Personas /></Pagewrapper>
                </AdminRoute>
              } />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthState>
  );
}

export default App;

