import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { AuthProvider } from './contexts/AuthContext';

import ProtectedRoute from './components/auth/ProtectedRoute.js';
import Navigation from './components/layouts/Navigation.js';

import Home from './pages/Home.js';
import Login from './pages/Login';
import Register from './pages/Register';
import Templates from './pages/Templates.js';
import NewTemplate from './pages/NewTemplate.js';



function App() {
  return (
    <BrowserRouter> 
      <AuthProvider>
        <Navigation />
          <Routes>
            {/* Public pages */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected pages */}
            <Route path="/templates" element={
                <ProtectedRoute>
                  <Templates />
                </ProtectedRoute>
              }
            />
            <Route path="/new-template" element={
                <ProtectedRoute>
                  <NewTemplate />
                </ProtectedRoute>
              }
            />
          </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;