import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">💧</span>
          WASCO
        </Link>

        <ul className="navbar-menu">
          {!isAuthenticated ? (
            <>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/districts">Districts</Link></li>
              <li><Link to="/login" className="btn-login">Login</Link></li>
              <li><Link to="/register" className="btn-register">Register</Link></li>
            </>
          ) : (
            <>
              <li><Link to="/dashboard">Dashboard</Link></li>
              {user?.role === 'customer' && (
                <>
                  <li><Link to="/bills">My Bills</Link></li>
                  <li><Link to="/payments">Payments</Link></li>
                  <li><Link to="/usage">Usage</Link></li>
                </>
              )}
              {user?.role === 'administrator' && (
                <>
                  <li><Link to="/admin/customers">Customers</Link></li>
                  <li><Link to="/admin/rates">Rates</Link></li>
                  <li><Link to="/admin/bills">Bills</Link></li>
                </>
              )}
              {user?.role === 'branch_manager' && (
                <>
                  <li><Link to="/manager/analytics">Analytics</Link></li>
                  <li><Link to="/manager/reports">Reports</Link></li>
                </>
              )}
              <li className="user-info">
                <span>👤 {user?.first_name}</span>
              </li>
              <li>
                <button onClick={handleLogout} className="btn-logout">
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

// Made with Bob
