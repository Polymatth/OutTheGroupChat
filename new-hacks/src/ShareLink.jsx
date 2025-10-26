// src/components/ShareLink.jsx

import React, { use } from 'react';
import { auth } from './firebase';
import { Link } from 'react-router-dom'; // To link back to the dashboard
import { useParams } from 'react-router-dom';
import './ShareLink.css';

function ShareLink() {
  // This is a hardcoded placeholder link for demonstration.
  const userId = auth.currentUser.uid;
  const planId = useParams().planId;
  const ShareableLink = `${window.location.origin}/respond/${userId}/${planId}`;

  // A placeholder function for the copy button.
  const handleCopy = () => {
    // In a real app, this would copy the link to the clipboard.
    // For now, it just shows an alert.
    navigator.clipboard.writeText(ShareableLink);
    alert(`Link copied to clipboard! (placeholder)\n${ShareableLink}`);
  };

  return (
    <div className="share-link-page">
      <div className="share-container">
        <h2>Share Your Travel Plan</h2>
        <p className="subtitle">Anyone with this link will be able to view the plan.</p>

        {/* The box containing the fake link and copy button */}
        <div className="link-box">
          <p className="share-link">{ShareableLink}</p>
          <button onClick={handleCopy} className="copy-button">Copy</button>
        </div>

        {/* A simple separator */}
        <div className="separator">
          <hr />
          <span>OR</span>
          <hr />
        </div>

        {/* Placeholder social sharing buttons */}
        <div className="social-share">
          <p>Share directly with your group:</p>
          <div className="social-buttons">
            <button className="social-btn">Email</button>
            <button className="social-btn">WhatsApp</button>
            <button className="social-btn">Messenger</button>
          </div>
        </div>

        {/* A "Done" button to navigate back to the main plan page */}
        <Link to = "/responses" className="done-button">
          Done
        </Link>
      </div>
    </div>
  );
}

export default ShareLink;