
import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import './Notifications.css';

const Notifications: React.FC = () => {
  const { state, dispatch } = useApp();
  const [isVisible, setIsVisible] = useState(false);
  const [currentNotification, setCurrentNotification] = useState<typeof state.notifications[0] | null>(null);

  useEffect(() => {
    // Show the most recent unread notification
    const unreadNotifications = state.notifications.filter(n => !n.read);
    if (unreadNotifications.length > 0 && !currentNotification) {
      const notification = unreadNotifications[0];
      setCurrentNotification(notification);
      setIsVisible(true);
      
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        handleDismiss();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [state.notifications, currentNotification]);

  const handleDismiss = () => {
    if (currentNotification) {
      dispatch({ type: 'MARK_NOTIFICATION_READ', payload: currentNotification.id });
      setIsVisible(false);
      
      // Clear current notification after animation
      setTimeout(() => {
        setCurrentNotification(null);
      }, 300);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'warning': return '⚠️';
      case 'success': return '✅';
      case 'error': return '❌';
      case 'info': return 'ℹ️';
      default: return '📢';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'warning': return 'var(--warning-color)';
      case 'success': return 'var(--success-color)';
      case 'error': return 'var(--danger-color)';
      case 'info': return 'var(--primary-color)';
      default: return 'var(--gray-600)';
    }
  };

  if (!currentNotification || !isVisible) {
    return null;
  }

  return (
    <div className={`notification-container ${isVisible ? 'visible' : ''}`}>
      <div 
        className={`notification notification-${currentNotification.type}`}
        style={{ borderLeftColor: getNotificationColor(currentNotification.type) }}
      >
        <div className="notification-icon">
          {getNotificationIcon(currentNotification.type)}
        </div>
        
        <div className="notification-content">
          <div className="notification-title">
            {currentNotification.title}
          </div>
          <div className="notification-message">
            {currentNotification.message}
          </div>
          <div className="notification-time">
            {new Date(currentNotification.timestamp).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>
        
        <button 
          className="notification-dismiss"
          onClick={handleDismiss}
          title="Dismiss notification"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default Notifications;
