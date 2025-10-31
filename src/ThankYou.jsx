// src/components/ThankYou.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import './ThankYou.css';

// A simple SVG checkmark icon to provide strong visual feedback of success.
const SuccessIcon = () => (
  <svg className="success-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
    <circle cx="26" cy="26" r="25" fill="none" />
    <path fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
  </svg>
);

function ThankYou() {
  return (
    <div className="thank-you-page">
      <div className="thank-you-container">
        <SuccessIcon />
        <h1>Thank You!</h1>
        <p className="message">
          Your response has been successfully recorded.
        </p>
        <p className="sub-message">
          The plan organizer has been notified of your status.
        </p>
        <Link to="/" className="home-button">
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default ThankYou;