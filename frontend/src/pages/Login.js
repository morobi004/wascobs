import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', formData);
      
      if (response.data.success) {
        login(response.data.token, response.data.user);
        navigate('/dashboard');
      } else {
        setError(response.data.message || 'Login failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-icon">💧</div>
            <h2>Welcome Back</h2>
            <p>Login to your WASCO account</p>
          </div>

          {error && (
            <div className="error-message">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" className="forgot-link">
                Forgot password?
              </Link>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-full"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Don't have an account?{' '}
              <Link to="/register" className="auth-link">
                Register here
              </Link>
            </p>
          </div>

          <div className="demo-credentials">
            <p className="demo-title">Demo Credentials:</p>
            <div className="demo-list">
              <div className="demo-item">
                <strong>Customer:</strong> customer@wasco.ls / password123
              </div>
              <div className="demo-item">
                <strong>Admin:</strong> admin@wasco.ls / admin123
              </div>
              <div className="demo-item">
                <strong>Manager:</strong> manager@wasco.ls / manager123
              </div>
            </div>
          </div>
        </div>

        <div className="auth-info">
          <h3>Why Choose WASCO?</h3>
          <ul>
            <li>✅ Secure online bill payments</li>
            <li>✅ Real-time usage tracking</li>
            <li>✅ 24/7 account access</li>
            <li>✅ Instant bill notifications</li>
            <li>✅ Easy leakage reporting</li>
            <li>✅ Serving all 10 districts</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Login;

// Made with Bob
