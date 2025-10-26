// src/components/Dashboard.jsx

import React from 'react';
import './Plan.css';
import { Link } from 'react-router-dom';
import { Router } from 'react-router-dom';

// You can replace this with data fetched from an API
const travelPlans = [
  {
    id: 1,
    title: 'Summer Trip To Italy',
    location: 'Rome, Italy',
    budget: 1500,
    imageUrl: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
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
          <span role="img" aria-label="paper plane"></span> OutTheGroupChat
        </div>
      </header>

      <main className="dashboard_content">
        <div className="page_header">
          <div className="page_title">
            <h1>Your Travel Plans</h1>
            <p>Here are all the adventures you've planned.</p>
          </div>
          <Link to="/newplan">
          <button className="create_plan_button">
            <span className="plus_icon">+</span> Create New Plan
          </button>
          </Link>
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