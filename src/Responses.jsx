import React from 'react';
import { Link } from 'react-router-dom';
import './Responses.css';

// Placeholder data - in a real app, this would come from your backend.
const responsesData = [
  {
    id: 1,
    name: 'Alice Johnson',
    avatarUrl: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    status: 'Going',
    notes: 'Booked my flight! I can bring snacks for the plane.',
  },
  {
    id: 2,
    name: 'Bob Williams',
    avatarUrl: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    status: 'Maybe',
    notes: 'Still need to check my work schedule for the first week.',
  },
  {
    id: 3,
    name: 'Charlie Brown',
    avatarUrl: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    status: 'Going',
    notes: 'I am so ready for this trip!',
  },
  {
    id: 4,
    name: 'Diana Miller',
    avatarUrl: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    status: "Can't Go",
    notes: "So sorry, I have a family wedding that weekend. Have fun!",
  },
];

function Responses() {
  const planName = "Summer Trip To Italy"; // Placeholder plan name

  return (
    <div className="view-responses-page">
      <div className="responses-container">
        <h2>Responses for "{planName}"</h2>
        <p className="summary">Showing {responsesData.length} out of 5 invited.</p>

        <div className="responses-list">
          {responsesData.map((response) => (
            <div key={response.id} className="response-card">
              <img src={response.avatarUrl} alt={response.name} className="avatar" />
              <div className="user-info">
                <h4>{response.name}</h4>
                <p className="notes">"{response.notes}"</p>
              </div>
              <div className={`status-badge status-${response.status.toLowerCase().replace("'", "").replace(" ", "-")}`}>
                {response.status}
              </div>
            </div>
          ))}
        </div>

        <div className="actions-footer">
          <button className="reminder-button">Send a Reminder</button>
          <Link to="/plan" className="back-button">
            Back to Plan
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Responses;