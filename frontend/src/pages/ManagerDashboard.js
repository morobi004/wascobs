import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { managerAPI } from '../utils/api';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ManagerDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await managerAPI.getMonthlyAnalytics({ month: 1, year: 2024 });
        setAnalytics(response.data.data || {
          usageByDistrict: [1200, 980, 760, 650, 540],
          labels: ['Maseru', 'Berea', 'Leribe', 'Mafeteng', 'Mohale\'s Hoek']
        });
      } catch (err) {
        setAnalytics({
          usageByDistrict: [1200, 980, 760, 650, 540],
          labels: ['Maseru', 'Berea', 'Leribe', 'Mafeteng', 'Mohale\'s Hoek']
        });
        setError('Unable to fetch live analytics data; showing a sample analytics view.');
      }
    };

    fetchAnalytics();
  }, []);

  const chartData = {
    labels: analytics?.labels || ['Maseru', 'Berea', 'Leribe', 'Mafeteng', 'Mohale\'s Hoek'],
    datasets: [
      {
        label: 'Consumption (m3)',
        data: analytics?.usageByDistrict || [1200, 980, 760, 650, 540],
        backgroundColor: 'rgba(25, 118, 210, 0.75)',
        borderColor: 'rgba(25, 118, 210, 1)',
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: 'Monthly Water Consumption by District'
      }
    }
  };

  return (
    <div className="manager-dashboard-page">
      <div className="page-header card">
        <h1>Manager Analytics</h1>
        <p>Review operational performance, usage trends, and district comparisons.</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="analytics-grid">
        <div className="analytics-card card">
          <h2>Monthly Usage</h2>
          <Bar data={chartData} options={chartOptions} />
        </div>

        <div className="analytics-card card">
          <h2>Executive Summary</h2>
          <ul>
            <li>Average daily consumption: 14,350 m3</li>
            <li>Highest consuming district: Maseru</li>
            <li>Collection rate: 92%</li>
            <li>Outstanding accounts: 1,120</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
