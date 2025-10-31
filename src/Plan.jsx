// src/components/Dashboard.jsx

import React, { useState, useEffect } from 'react';
import './Plan.css';
import { Link, useNavigate } from 'react-router-dom';
import { db, auth } from './firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

// A reusable card component for each travel plan
const PlanCard = ({ plan }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/responses/${plan.id}`);
  };

  return (
    <div className="plan_card" onClick={handleClick} style={{ cursor: 'pointer' }}>
      <img src={plan.imageUrl} alt={plan.title} className="card_image" />
      <div className="card_content">
        <h3>{plan.planName}</h3>
        <p className="card_location">
          <span role="img" aria-label="location pin">📍</span> {plan.location}
        </p>
        <div className="card_budget">
          Budget: ${plan.budget?.toLocaleString() ?? '0'}
        </div>
      </div>
    </div>
  );
};

function Plan() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setError('Please login to view your plans');
          setLoading(false);
          return;
        }

        const plansRef = collection(db, "users", user.uid, "plans");
        const plansSnapshot = await getDocs(plansRef);
        
        const fetchedPlans = plansSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setPlans(fetchedPlans);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching plans:', err);
        setError('Failed to load plans. Please try again later.');
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  if (loading) {
    return (
      <div className="dashboard">
        <header className="dashboard_header">
          <div className="logo">
            <span role="img" aria-label="paper plane"></span> OutTheGroupChat
          </div>
        </header>
        <main className="dashboard_content">
          <div>Loading your plans...</div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <header className="dashboard_header">
          <div className="logo">
            <span role="img" aria-label="paper plane"></span> OutTheGroupChat
          </div>
        </header>
        <main className="dashboard_content">
          <div className="error-message">{error}</div>
        </main>
      </div>
    );
  }

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
              <span className="plus_icon"></span> Create New Plan
            </button>
          </Link>
        </div>

        <div className="plans_grid">
          {plans.length === 0 ? (
            <div className="no-plans-message">
              <p>You haven't created any plans yet. Click "Create New Plan" to get started!</p>
            </div>
          ) : (
            plans.map(plan => (
              <PlanCard key={plan.id} plan={plan} />
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default Plan;