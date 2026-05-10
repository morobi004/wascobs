import React, { useEffect, useState } from 'react';
import { adminAPI } from '../utils/api';

const AdminPanel = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminAPI.getDashboardStats();
        setStats(response.data.data || {});
      } catch (err) {
        setError('Unable to load admin dashboard statistics at this time.');
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="admin-panel-page">
      <div className="page-header card">
        <h1>Admin Dashboard</h1>
        <p>Manage customers, billing rates, and review operations from a single control panel.</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="metrics-grid">
        <div className="metric-card card">
          <h3>Total Customers</h3>
          <p>{stats?.totalCustomers ?? '—'}</p>
        </div>
        <div className="metric-card card">
          <h3>Active Bills</h3>
          <p>{stats?.activeBills ?? '—'}</p>
        </div>
        <div className="metric-card card">
          <h3>Revenue Collected</h3>
          <p>{stats?.revenueCollected ? `M${stats.revenueCollected}` : '—'}</p>
        </div>
        <div className="metric-card card">
          <h3>Outstanding Balance</h3>
          <p>{stats?.outstandingBalance ? `M${stats.outstandingBalance}` : '—'}</p>
        </div>
      </div>

      <div className="admin-actions card">
        <h2>Quick Actions</h2>
        <div className="action-grid">
          <div className="action-item">
            <h4>Customer Management</h4>
            <p>Add, update, or remove customer accounts.</p>
          </div>
          <div className="action-item">
            <h4>Billing Rates</h4>
            <p>Review or update active rate tiers for all customer types.</p>
          </div>
          <div className="action-item">
            <h4>Reports & Audits</h4>
            <p>Export revenue, collection, and usage reports for the business.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
