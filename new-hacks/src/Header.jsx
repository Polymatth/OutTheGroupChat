import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; // We will create this file next

function Header() {
  return (
    <header className="site-header">
      <div className="header-content">
        <div className="header-logo">
          <Link to="/">
            <h1><span className="logo-icon">(LOGO)</span> OutTheGroupChat</h1>
          </Link>
        </div>
        <nav className="header-nav">
          {/* This button can link to your dashboard or a new plan page */}
          <Link to="/Login">
            <button className="header-create-button">+ Create New Plan</button>
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;