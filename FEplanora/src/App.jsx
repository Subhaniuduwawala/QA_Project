import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AdminLogin from './pages/Admin/AdminLogin';
import AdminSignup from './pages/Admin/Adminsignup';
import EventsDashboard from './pages/Admin/EventsDashboard';
import './App.css';

// Authentication guard component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("adminToken");
  return token ? children : <Navigate to="/admin/login" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/signup" element={<AdminSignup />} />
        <Route path="/admin/dashboard" element={<ProtectedRoute><EventsDashboard /></ProtectedRoute>} />
        <Route path="/admin/events" element={<ProtectedRoute><EventsDashboard /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
