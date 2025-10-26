import React, { use, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import './Respond.css';
import { auth } from './firebase';
import {collection, addDoc} from 'firebase/firestore';
import { db } from './firebase';

function Respond() {
  // State to manage which response is selected ('going', 'maybe', 'cant-go')
  const [selectedResponse, setSelectedResponse] = useState(null);
  // State for the user's notes
  const [notes, setNotes] = useState('');
  
  // Placeholder data that would normally come from the URL/API
  const planDetails = {
    name: "Summer Trip To Italy",
    host: "Alice Johnson",
    dates: "July 15th - July 22nd, 2026",
    location: "Rome, Italy"
  };

  const navigate = useNavigate();

  const userId = useParams().userId;
  const planId = useParams().planId;

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
      name: "",
      response: selectedResponse,
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
          <h1>{planDetails.name}</h1>
        </div>
        
        <div className="plan-info">
          <p><strong>🗓️ Dates:</strong> {planDetails.dates}</p>
          <p><strong>📍 Location:</strong> {planDetails.location}</p>
          <p><strong>✉️ From:</strong> {planDetails.host}</p>
        </div>

        <form onSubmit={handleSubmit} className="response-form">
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