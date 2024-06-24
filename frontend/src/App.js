import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { PrimeReactProvider } from 'primereact/api';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Pagina from './components/Pagina';
import Catalogo from './components/Catalogo';

const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <PrimeReactProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route 
            path="/paneldecontrol" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/" element={<Pagina />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </PrimeReactProvider>
  );
}

export default App;
