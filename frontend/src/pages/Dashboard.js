import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user, isAdmin, isManager, isCustomer } = useAuth();

  return (
    <div className="dashboard-page">
      <div className="dashboard-hero card">
        <h1>Welcome back, {user?.first_name || user?.username || 'User'}!</h1>
        <p>
          You are signed in as <strong>{user?.role}</strong>. Use the links below to manage your account and access the system.
        </p>
      </div>

      <div className="dashboard-grid">
        {isCustomer && (
          <>
            <div className="dashboard-card card">
              <h2>Customer Portal</h2>
              <p>View your bills, payments, and usage history in one place.</p>
              <Link to="/customer" className="btn btn-primary">
                Go to Portal
              </Link>
            </div>
            <div className="dashboard-card card">
              <h2>Quick Actions</h2>
              <ul>
                <li><Link to="/customer#bills">My Bills</Link></li>
                <li><Link to="/customer#payments">Payment History</Link></li>
                <li><Link to="/customer#usage">Usage History</Link></li>
              </ul>
            </div>
          </>
        )}

        {isAdmin && (
          <>
            <div className="dashboard-card card">
              <h2>Admin Control Center</h2>
              <p>Manage customers, billing rates, and view operational reports.</p>
              <Link to="/admin" className="btn btn-primary">
                Open Admin Panel
              </Link>
            </div>
            <div className="dashboard-card card">
              <h2>Admin Tools</h2>
              <ul>
                <li><Link to="/admin">Customer Management</Link></li>
                <li><Link to="/admin">Billing Rates</Link></li>
                <li><Link to="/admin">Revenue Reports</Link></li>
              </ul>
            </div>
          </>
        )}

        {isManager && (
          <>
            <div className="dashboard-card card">
              <h2>Manager Analytics</h2>
              <p>Review daily, weekly, and monthly analytics for operational insights.</p>
              <Link to="/manager" className="btn btn-primary">
                Open Analytics
              </Link>
            </div>
            <div className="dashboard-card card">
              <h2>Performance Metrics</h2>
              <ul>
                <li><Link to="/manager">Usage Trends</Link></li>
                <li><Link to="/manager">Customer Segments</Link></li>
                <li><Link to="/manager">Outstanding Balance Analysis</Link></li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
