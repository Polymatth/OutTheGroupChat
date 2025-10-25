import React from 'react'
import Home from './Home.jsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './Login.jsx'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  )
}

export default App