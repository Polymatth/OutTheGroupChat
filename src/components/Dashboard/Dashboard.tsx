
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import TransactionForm from './TransactionForm';
import TransactionList from './TransactionList';
import SpendingChart from './SpendingChart';
import BudgetOverview from './BudgetOverview';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { state } = useApp();
  const [showTransactionForm, setShowTransactionForm] = useState(false);

  if (state.loading) {
    return (
      <div className="dashboard loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your financial data...</p>
        </div>
      </div>
    );
  }

  // Calculate current month stats
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthlyTransactions = state.transactions.filter(t => {
    const transactionDate = new Date(t.date);
    return transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear;
  });

  const monthlyIncome = monthlyTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const monthlyExpenses = monthlyTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const netIncome = monthlyIncome - monthlyExpenses;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Financial Overview</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowTransactionForm(true)}
        >
          + Add Transaction
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card income">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>Monthly Income</h3>
            <p className="stat-value text-green">
              ${monthlyIncome.toLocaleString()}
            </p>
          </div>
        </div>
        
        <div className="stat-card expenses">
          <div className="stat-icon">💸</div>
          <div className="stat-content">
            <h3>Monthly Expenses</h3>
            <p className="stat-value text-red">
              ${monthlyExpenses.toLocaleString()}
            </p>
          </div>
        </div>
        
        <div className="stat-card net">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>Net Income</h3>
            <p className={`stat-value ${netIncome >= 0 ? 'text-green' : 'text-red'}`}>
              ${netIncome.toLocaleString()}
            </p>
          </div>
        </div>
        
        <div className="stat-card health">
          <div className="stat-icon">❤️</div>
          <div className="stat-content">
            <h3>Financial Health</h3>
            <p className="stat-value">
              {state.financialHealthScore}/100
            </p>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-section">
          <SpendingChart transactions={state.transactions} />
        </div>
        
        <div className="dashboard-section">
          <BudgetOverview 
            transactions={state.transactions} 
            userProfile={state.userProfile} 
          />
        </div>
        
        <div className="dashboard-section full-width">
          <TransactionList transactions={state.transactions.slice(0, 10)} />
        </div>
      </div>

      {showTransactionForm && (
        <TransactionForm onClose={() => setShowTransactionForm(false)} />
      )}
    </div>
  );
};

export default Dashboard;
