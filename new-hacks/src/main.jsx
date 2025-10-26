// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import "./App.css"

const root = document.getElementById('root');

if (!root) {
  console.error('Root element not found! Check if the HTML has a div with id="root"');
} else {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}