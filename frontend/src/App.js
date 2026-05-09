import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';

// Placeholder components - will be implemented
const Login = () => (
  <div className="container">
    <div className="card" style={{ maxWidth: '400px', margin: '100px auto' }}>
      <h2>WASCO Login</h2>
      <p>Login component will be implemented here</p>
      <p>Backend API is ready at: http://localhost:5000/api</p>
    </div>
  </div>
);

const Register = () => (
  <div className="container">
    <div className="card" style={{ maxWidth: '400px', margin: '100px auto' }}>
      <h2>WASCO Register</h2>
      <p>Registration component will be implemented here</p>
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  
  return (
    <div className="container">
      <div className="card">
        <h2>Welcome to WASCO Dashboard</h2>
        <p>User: {user?.full_name}</p>
        <p>Role: {user?.role}</p>
        <p>Email: {user?.email}</p>
      </div>
    </div>
  );
};

const Home = () => (
  <div className="container">
    <div className="card">
      <h1>WASCO Water Bill Management System</h1>
      <p>Welcome to the Water and Sewerage Company (WASCO) online billing system.</p>
      <h3>Features:</h3>
      <ul>
        <li>View and pay water bills online</li>
        <li>Track water consumption</li>
        <li>View payment history</li>
        <li>Report water leakages</li>
        <li>Access to all 10 districts in Lesotho</li>
      </ul>
      <div style={{ marginTop: '20px' }}>
        <a href="/login" className="btn btn-primary" style={{ marginRight: '10px' }}>Login</a>
        <a href="/register" className="btn btn-secondary">Register</a>
      </div>
    </div>
  </div>
);

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

// Made with Bob
