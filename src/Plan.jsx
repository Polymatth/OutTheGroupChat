// src/components/Dashboard.jsx

import React from 'react';
import './Plan.css';

// You can replace this with data fetched from an API
const travelPlans = [
  {
    id: 1,
    title: 'Summer Trip To Italy',
    location: 'Rome, Italy',
    budget: 1500,
    imageUrl: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: 2,
    title: 'Weekend in Paris',
    location: 'Paris, France',
    budget: 800,
    imageUrl: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  // Add more plan objects here...
];

// A reusable card component for each travel plan
const PlanCard = ({ plan }) => {
  return (
    <div className="plan_card">
      <img src={plan.imageUrl} alt={plan.title} className="card_image" />
      <div className="card_content">
        <h3>{plan.title}</h3>
        <p className="card_location">
          <span role="img" aria-label="location pin">📍</span> {plan.location}
        </p>
        <div className="card_budget">
          Budget: ${plan.budget.toLocaleString()}
        </div>
      </div>
    </div>
  );
};

function Plan() {
  return (
    <div className="dashboard">
      <header className="dashboard_header">
        <div className="logo">
          <span role="img" aria-label="paper plane">✈️</span> OutTheGroupChat
        </div>
        <div className="user_profile">
          ZI
        </div>
      </header>

      <main className="dashboard_content">
        <div className="page_header">
          <div className="page_title">
            <h1>Your Travel Plans</h1>
            <p>Here are all the adventures you've planned.</p>
          </div>
          <button className="create_plan_button">
            <span className="plus_icon">+</span> Create New Plan
          </button>
        </div>

        <div className="search_container">
          <input 
            type="text" 
            className="search_bar" 
            placeholder="Search plans by name or location..." 
          />
        </div>

        <div className="plans_grid">
          {travelPlans.map(plan => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
           {/* Duplicating for visual effect as in the screenshot */}
           {travelPlans.map(plan => (
            <PlanCard key={plan.id + '_dup'} plan={plan} />
          ))}
        </div>
      </main>
    </div>
  );
}

export default Plan;