
import React, { useState, useEffect } from 'react';
import { AppProvider } from './context/AppContext';
import Dashboard from './components/Dashboard/Dashboard';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import ChatBot from './components/ChatBot/ChatBot';
import Notifications from './components/Notifications/Notifications';
import UserProfile from './components/UserProfile/UserProfile';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'profile':
        return <UserProfile />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <AppProvider>
      <div className={`app ${darkMode ? 'dark' : ''}`}>
        <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
        <div className="main-content">
          <Header darkMode={darkMode} setDarkMode={setDarkMode} />
          <main className="content">
            {renderCurrentView()}
          </main>
        </div>
        <ChatBot />
        <Notifications />
      </div>
    </AppProvider>
  );
}

export default App;
