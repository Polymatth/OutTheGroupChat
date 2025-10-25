import React from 'react';
import './Home.css';

function Home() {
  return (
    <div className='home'>
      <div className='home_overlay'></div>
      <nav className='home_nav'>
        <div className='home_logo'>
          <h1><span className="logo_icon">(LOGO)</span> OutTheGroupChat</h1>
        </div>
        <div className='home_nav_button'>
          <button className="create_plan_button">Create a Plan</button>
        </div>
      </nav>
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
          <button>Start Planning for Free</button>
        </div>
      </div>
    </div>
  );
}

export default Home;