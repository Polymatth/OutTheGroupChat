import React from 'react';
import './Header.css';
import { Link } from 'react-router-dom'

function Header() {
  return (
    <header className='header'>
      <div className='header_container'>
        <div className='header_logo'>
          <h1><span className="logo_icon">(LOGO)</span> OutTheGroupChat</h1>
        </div>
        <nav className='header_nav'>
           <Link to="/login">
             <button className="create_plan_button">Create a Plan</button> 
           </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;