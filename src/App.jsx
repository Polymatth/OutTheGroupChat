// src/App.jsx (Corrected and Final Version)

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 1. Import the correctly named components
import Home from './Home.jsx';
import Login from './Login.jsx';
import Plan from './Plan.jsx';
import './App.css'; 

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Route for the home page */}
          <Route path="/" element={<Home />} />

          {/* 2. Route for the login page, now using the correct component */}
          <Route path="/login" element={<Login />} /> 

          {/* Route for the plan page */}
          <Route path="/plan" element={<Plan />} /> 
          {/* Note: I changed "/Plan" to "/plan" to follow standard URL conventions (lowercase) */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;