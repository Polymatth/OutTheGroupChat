import React, { use, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import './Respond.css';
import { auth } from './firebase';
import {doc, collection, addDoc, getDoc} from 'firebase/firestore';
import { db } from './firebase';

function Respond() {
  // State to manage which response is selected ('going', 'maybe', 'cant-go')
  const [selectedResponse, setSelectedResponse] = useState(null);
  // State for the user's notes and name
  const [notes, setNotes] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const {userId, planId} = useParams();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        // Fetch plan details from Firestore using userId and planId
        // For now, we'll use placeholder data
        const planRef = doc(db, "users", userId, "plans", planId);
        const planSnap = await getDoc(planRef);
        if (planSnap.exists()) {
          setPlan(planSnap.data());
        } else {
          console.log("No such plan!");
        }
      } catch (error) {
        console.error("Error fetching plan:", error);
      }
      setLoading(false);
    };

    fetchPlan();
  }, [userId, planId]);

  if (loading) {
    return <div>Loading...</div>;
  }
  if (!plan) {
    return <div>Plan not found.</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedResponse) {
      alert("Please select a response (Going, Maybe, or Can't Go).");
      return;
    }
    // In a real app, you would submit this data to your backend.
    console.log({
      response: selectedResponse,
      notes: notes,
    });
    
    const responsesRef = collection (db, "users", userId, "plans", planId, "responses")
    console.log(responsesRef);
    const responseDoc = await addDoc(responsesRef, {
      name: name,
      response: selectedResponse,
      notes: notes,
      budget: "",
    });
    navigate('/thankyou');
    alert("Thank you for your response! (Placeholder)");
  };

  return (
    <div className="respond-page">
      <div className="respond-container">
        <div className="invitation-header">
          <p>You're invited to</p>
          <h1>{plan.planName}</h1>
        </div>
        
        <div className="plan-info">
          <p><strong>📍 Location:</strong> {plan.location}</p>
        </div>

        <form onSubmit={handleSubmit} className="response-form">
          <label htmlFor="name" className="form-label">Your Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
            className="name-input"
          />
          
          <p className="form-label">Will you be there?</p>
          <div className="response-buttons">
            <button 
              type="button" 
              className={`response-btn going ${selectedResponse === 'going' ? 'selected' : ''}`}
              onClick={() => setSelectedResponse('going')}
            >
              Going
            </button>
            <button 
              type="button" 
              className={`response-btn maybe ${selectedResponse === 'maybe' ? 'selected' : ''}`}
              onClick={() => setSelectedResponse('maybe')}
            >
              Maybe
            </button>
            <button 
              type="button" 
              className={`response-btn cant-go ${selectedResponse === 'cant-go' ? 'selected' : ''}`}
              onClick={() => setSelectedResponse('cant-go')}
            >
              Can't Go
            </button>
          </div>
          
          <label htmlFor="notes" className="form-label">Add a note (optional)</label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g., I can't wait! I'll be arriving a day early."
          />
          <button type="submit" className="submit-response-button" onClick={handleSubmit}>
            Submit Response
          </button>
        </form>
          
        <div className="footer-note">
          <p>Already have an account? <Link to= "/login" >Log in</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Respond;