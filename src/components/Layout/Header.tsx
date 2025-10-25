
import React from 'react';
import { useApp } from '../../context/AppContext';
import './Header.css';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ darkMode, setDarkMode }) => {
  const { state } = useApp();
  
  const unreadNotifications = state.notifications.filter(n => !n.read).length;

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="header-title">
            Welcome back{state.userProfile ? `, ${state.userProfile.name}` : ''}!
          </h1>
          <p className="header-subtitle">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        
        <div className="header-right">
          <div className="financial-health">
            <span className="health-label">Financial Health</span>
            <div className="health-score">
              <div 
                className="health-circle"
                style={{
                  background: `conic-gradient(var(--primary-color) ${state.financialHealthScore * 3.6}deg, var(--gray-200) 0deg)`
                }}
              >
                <span className="health-number">{state.financialHealthScore}</span>
              </div>
            </div>
          </div>
          
          <button 
            className="notification-btn"
            title={`${unreadNotifications} unread notifications`}
          >
            🔔
            {unreadNotifications > 0 && (
              <span className="notification-badge">{unreadNotifications}</span>
            )}
          </button>
          
          <button 
            className="theme-toggle"
            onClick={() => setDarkMode(!darkMode)}
            title={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
