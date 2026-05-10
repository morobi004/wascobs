import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const districts = [
    'Maseru', 'Berea', 'Leribe', 'Mafeteng', 'Mohale\'s Hoek',
    'Quthing', 'Qacha\'s Nek', 'Mokhotlong', 'Thaba-Tseka', 'Butha-Buthe'
  ];

  const features = [
    {
      icon: '💧',
      title: 'Water Bill Management',
      description: 'View and manage your water bills online with ease'
    },
    {
      icon: '📊',
      title: 'Usage Tracking',
      description: 'Monitor your water consumption with detailed analytics'
    },
    {
      icon: '💳',
      title: 'Online Payments',
      description: 'Pay your bills securely using multiple payment methods'
    },
    {
      icon: '📱',
      title: 'Mobile Friendly',
      description: 'Access your account from any device, anywhere'
    },
    {
      icon: '🔔',
      title: 'Bill Notifications',
      description: 'Get notified when new bills are generated'
    },
    {
      icon: '🚰',
      title: 'Leakage Reporting',
      description: 'Report water leakages in your area quickly'
    }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="hero-icon">💧</span>
            WASCO Water Bill Management System
          </h1>
          <p className="hero-subtitle">
            Water and Sewerage Company - Serving all 10 districts of Lesotho
          </p>
          <p className="hero-description">
            Manage your water bills, track consumption, and make payments online with ease.
            Join thousands of customers already using our digital platform.
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="btn btn-primary">
              Get Started
            </Link>
            <Link to="/login" className="btn btn-secondary">
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Our Services</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Districts Section */}
      <section className="districts-section">
        <div className="container">
          <h2 className="section-title">Serving All 10 Districts</h2>
          <p className="section-subtitle">
            WASCO provides water and sewerage services across Lesotho
          </p>
          <div className="districts-grid">
            {districts.map((district, index) => (
              <div key={index} className="district-card">
                <span className="district-icon">📍</span>
                <span className="district-name">{district}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">10</div>
              <div className="stat-label">Districts Covered</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">50K+</div>
              <div className="stat-label">Active Customers</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Online Access</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">99%</div>
              <div className="stat-label">Customer Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to Get Started?</h2>
          <p>Join WASCO's digital platform today and manage your water bills with ease</p>
          <Link to="/register" className="btn btn-large">
            Create Your Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>WASCO</h3>
              <p>Water and Sewerage Company</p>
              <p>Serving Lesotho since 1989</p>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li><Link to="/services">Services</Link></li>
                <li><Link to="/districts">Districts</Link></li>
                <li><Link to="/contact">Contact Us</Link></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Support</h4>
              <ul>
                <li><Link to="/faq">FAQ</Link></li>
                <li><Link to="/help">Help Center</Link></li>
                <li><Link to="/report-leakage">Report Leakage</Link></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Contact</h4>
              <p>📞 +266 2231 2345</p>
              <p>📧 info@wasco.co.ls</p>
              <p>📍 Maseru, Lesotho</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 WASCO. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;

// Made with Bob
