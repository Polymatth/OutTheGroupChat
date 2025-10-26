import React, { useState } from 'react';
import './NewPlan.css';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from './firebase';
import {collection, addDoc} from 'firebase/firestore';
import { db } from './firebase';

function NewPlan() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    planName: '',
    budget: '',
    people: '',
    location: '',
    activities: '',
    residence: '',
  });

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission here
    const user = auth.currentUser;
    console.log(user.uid);
      console.log("Adding plan for user:", user.uid);
      const plansRef = collection (db, "users", user.uid, "plans");
      const planDoc = await addDoc(plansRef, {
        planName: formData.planName,
        budget: formData.budget,
        people: formData.people,
        location: formData.location,
        activities: formData.activities,
        residence: formData.residence
      });
      console.log("/sharelink/"+formData.planId);
      console.log('Form submitted:', formData);
      const shareLink = `/sharelink/${planDoc.id}`;
      console.log(shareLink)
      navigate(shareLink);
    // You can add API call or navigation here
      return planDoc.id;
  
  };

  return (
    <div>
      <h1 id="create">Create a New Travel Plan</h1>
      <form id="new-plan-questions" onSubmit={handleSubmit}>
        <label htmlFor="plan-name">Plan Name</label>
        <input 
          type="text" 
          id="plan-name" 
          name="planName" 
          placeholder="ex. Group Vacation"
          value={formData.planName}
          onChange={handleChange}
        /><br />

        <label htmlFor="budget">Budget and Expenses</label> <br />
        <input 
          type="text" 
          id="budget" 
          name="budget" 
          placeholder="ex. 2000$"
          value={formData.budget}
          onChange={handleChange}
        /><br />

        <label htmlFor="people">Hoping For</label> <br />
        <input 
          type="text" 
          id="people" 
          name="people" 
          placeholder="ex. 5 friends"
          value={formData.people}
          onChange={handleChange}
        /><br />

        <label htmlFor="location">Location</label> <br />
        <input 
          type="text" 
          id="location" 
          name="location" 
          placeholder="ex. Seoul, South Korea"
          value={formData.location}
          onChange={handleChange}
        /><br />

        <label htmlFor="activities">Potential Activities</label> <br />
        <input 
          type="text" 
          id="activities" 
          name="activities" 
          placeholder="ex. Skiing, Hot Chocolate Expo"
          value={formData.activities}
          onChange={handleChange}
        /><br />

        <label htmlFor="residence">Where we'll stay</label> <br />
        <input 
          type="text" 
          id="residence" 
          name="residence" 
          placeholder="ex. Great Wolf Lodge"
          value={formData.residence}
          onChange={handleChange}
        /><br />
        
        <button type="submit" className="submit-button" onClick={handleSubmit}>
            Create Plan
          </button>
      </form>
    </div>
  );
}

export default NewPlan;