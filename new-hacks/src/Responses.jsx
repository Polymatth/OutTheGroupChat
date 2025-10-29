import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import './Responses.css'
import { auth } from './firebase';


function Responses() {

  const [planName, setPlanName] = useState(""); // Placeholder plan name
  const [responses, setResponses] = useState([]); // Placeholder responses data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const planId = useParams().planId; // Get planId from route params
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/summarize/${planId}`);
  };

  useEffect(() => {
    const fetchedResponses = async () => {
      // Fetch responses from backend (Firebase, etc.)
      try {
        const user = auth.currentUser;
        if (!user) {
          setError('Please login to view responses');
          setLoading(false);
          return;
        }
        const planDoc = await getDoc(doc(db, "users", user.uid, "plans", planId));

        const responsesRef = collection(db, "users", user.uid, "plans", planId, "responses");
        const responsesSnapshot = await getDocs(responsesRef);
        const fetchedResponses = responsesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPlanName(planDoc.data().planName);
        setResponses(fetchedResponses);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching responses:', err);
        setError('Failed to load responses. Please try again later.');
        setLoading(false);
      }
    };

    fetchedResponses();
  }, []);
  if (loading) {
    return <div>Loading responses...</div>;
  }
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="view-responses-page">
      <div className="responses-container">
        <h2>Responses for "{planName}"</h2>
        <p className="summary">Showing {responses.length} out of 5 invited.</p>

        <div className="responses-list">
          {responses.map((response) => (
            <div key={response.id} className="response-card">
              <div className="user-info">
                <h4>{response.name}</h4>
                <p className="notes">"{response.notes}"</p>
              </div>
              <div className={`status-badge status-${response.response.toLowerCase().replace("'", "").replace(" ", "-")}`}>
                {response.response}
              </div>
            </div>
          ))}
        </div>

        <div className="actions-footer">
          <button className="back-button" onClick={handleClick}>Summarize with AI</button>
          <Link to="/plan" className="back-button">
            Back to Plan
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Responses;