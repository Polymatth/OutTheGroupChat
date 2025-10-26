import React, { useState } from 'react';
import './Login.css';
import { auth } from './firebase'; 
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from "firebase/auth";
import { useNavigate, Link } from 'react-router-dom';
import {doc, getDoc, setDoc} from 'firebase/firestore';
import { db } from './firebase';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/plan'); // Changed to navigate to plan page
    } catch (error) {
      alert(error.message);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        uid: user.uid
      });
      navigate('/plan'); // Changed to navigate to plan page
    } catch (error) {
      console.error("Error creating user document:", error);
      alert(error.message);
    }
  };

  return (
    <div className='login'>
      <div className='login_container'>
        <h1>Welcome!</h1>
        <form>
          <input 
            type="email" 
            placeholder="Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" onClick={handleLogin}>Login</button>
          <button type="button" onClick={handleSignUp}>Create a new account</button>
        </form>
      </div>
    </div>
  );
}

export default Login;