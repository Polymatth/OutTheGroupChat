
import React from 'react';
import { Transaction, UserProfile } from '../../context/AppContext';
import './BudgetOverview.css';

interface BudgetOverviewProps {
  transactions: Transaction[];
  userProfile: UserProfile | null;
}

const BudgetOverview: React.FC<BudgetOverviewProps> = ({ transactions, userProfile }) => {
  if (!userProfile || !userProfile.budgetGoals) {
    return (
      <div className="budget-overview">
        <div className="budget-header">
          <h3>Budget Overview</h3>
        </div>
        <div className="budget-empty">
          <div className="empty-icon">🎯</div>
          <p>Set up your budget goals in your profile to track spending.</p>
        </div>
      </div>
    );
  }

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthlySpending = transactions
    .filter(t => {
      const transactionDate = new Date(t.date);
      return t.type === 'expense' && 
             transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear;
    })
    .reduce((acc, transaction) => {
      const category = transaction.category;
      acc[category] = (acc[category] || 0) + Math.abs(transaction.amount);
      return acc;
    }, {} as Record<string, number>);

  const budgetItems = Object.entries(userProfile.budgetGoals).map(([category, budget]) => {
    const spent = monthlySpending[category] || 0;
    const percentage = budget > 0 ? (spent / budget) * 100 : 0;
    const remaining = budget - spent;
    
    return {
      category,
      budget,
      spent,
      remaining,
      percentage: Math.min(percentage, 100),
      status: percentage >= 100 ? 'over' : percentage >= 80 ? 'warning' : 'good'
    };
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'over': return 'var(--danger-color)';
      case 'warning': return 'var(--warning-color)';
      default: return 'var(--success-color)';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'over': return '🚨';
      case 'warning': return '⚠️';
      default: return '✅';
    }
  };

  return (
    <div className="budget-overview">
      <div className="budget-header">
        <h3>Budget Overview</h3>
        <span className="budget-month">
          {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </span>
      </div>
      
      <div className="budget-items">
        {budgetItems.map((item) => (
          <div key={item.category} className={`budget-item ${item.status}`}>
            <div className="budget-item-header">
              <div className="budget-category">
                <span className="budget-icon">{getStatusIcon(item.status)}</span>
                <span className="category-name">{item.category}</span>
              </div>
              <span className="budget-percentage">{item.percentage.toFixed(0)}%</span>
            </div>
            
            <div className="budget-progress">
              <div 
                className="budget-progress-fill"
                style={{
                  width: `${item.percentage}%`,
                  backgroundColor: getStatusColor(item.status)
                }}
              />
            </div>
            
            <div className="budget-details">
              <span className="budget-spent">
                ${item.spent.toLocaleString()} spent
              </span>
              <span className="budget-remaining">
                ${item.remaining >= 0 ? item.remaining.toLocaleString() : '0'} left
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BudgetOverview;
