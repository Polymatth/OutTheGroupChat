import React from 'react'
import './login.css'
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { app } from "./firebase-config";

const auth = getAuth(firebaseApp);

function Login() {
  return (
    <div className='login'>
      <div className='login_container'>
        <h1>Welcome Back!</h1>
        <form>
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <button type="submit">Login</button>
          <button type = "signup">Create a new account  </button>
        </form>
      </div>
    </div>
  )
}


export default Login