import React from 'react';
import { Link } from 'react-router-dom';

const PageNotFound = () => (
  <div className="not-found-page">
    <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
      <h1>404</h1>
      <p>Page not found. The link you followed may be broken or the page has moved.</p>
      <Link to="/" className="btn btn-primary">
        Return Home
      </Link>
    </div>
  </div>
);

export default PageNotFound;
