import React from 'react'
import './Home.css'

function Home() {
  return (
    <div className='home'>
      <div className='home_container'>
        <div className='home_title'>
          <h1>Out of the Group Chat!</h1>
        </div>
        <div className='home_subtitle'>
          <h2>Your collaborative travel planning assistant</h2> 
        </div>
        <div className='home_button'>
           <button>Get Started</button>
        </div>
      </div>
    </div>
  )
}

export default Home