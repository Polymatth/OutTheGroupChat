// src/App.jsx (Corrected and Final Version)

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


import Header from './Header.jsx';
import Home from './Home.jsx';
import Login from './Login.jsx';
import Plan from './Plan.jsx';
import NewPlan from './NewPlan.jsx';
import ShareLink from './ShareLink.jsx';
import Respond from './Respond.jsx';
import Responses from './Responses.jsx';
import ThankYou from './ThankYou.jsx';


import './App.css'; 

function App() {
  return (
    <Router>
      <div className="App"> 
        <Routes>
          {/* Route for the home page */}
          <Route path="/" element={<Home />} />

          {/* Route for the login page */}
          <Route path="/login" element={<Login />} /> 

          {/* Route for the travel plan page */}
          <Route path="/plan" element={<Plan />} />
          
          {/* Route for the New Plan page */}
          <Route path="/newplan" element={<NewPlan />} />
          
          {/* Route for the Share Link page */}
          <Route path="/sharelink/:planId" element={<ShareLink />} />

          {/* Route for the Responses page */}
          <Route path="/responses" element={<Responses />} />

          {/* Route for the Respond Page */}
           <Route path="/respond/:userId/:planId" element={<Respond />} />

           {/* Route for the Thank You Page */}
           <Route path="/thankyou" element={<ThankYou />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;