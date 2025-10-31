import React from 'react';
import './Home.css';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className='home_page_wrapper'>
      {/* Header section */}
      <header className='home_header'>
        <div className='header_logo'>
            <h1><span className="logo_icon"></span> OutTheGroupChat</h1>
        </div>
        <div className='header_nav_button'>
          <Link to="/login">
             <button className="create_plan_button">Create a Plan</button>
          </Link>
        </div>
      </header>

      {/* Hero section with background image */}
      <main className='home_hero_section'>
        <div className='home_overlay'></div>
        <div className='home_container'>
          <div className='home_title'>
            <h2>Plan Trips, Not Feuds.</h2>
          </div>
          
          <div className='home_subtitle'>
            <p>
              From budget chaos to schedule clashes, our AI builds the perfect group trip that everyone actually agrees on. Ditch the spreadsheet and get out the group chat.
            </p>
          </div>
          
          <div className='home_button'>
             <Link to="/login">
              <button>Start Planning for Free</button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;