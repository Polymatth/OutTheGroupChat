
import React from 'react';
import { Transaction } from '../../context/AppContext';
import './TransactionList.css';

interface TransactionListProps {
  transactions: Transaction[];
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => {
  const formatAmount = (amount: number) => {
    const absolute = Math.abs(amount);
    return amount >= 0 
      ? `+$${absolute.toLocaleString()}` 
      : `-$${absolute.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      'Groceries': '🛒',
      'Entertainment': '🎬',
      'Utilities': '⚡',
      'Transportation': '🚗',
      'Healthcare': '🏥',
      'Shopping': '🛍️',
      'Dining': '🍽️',
      'Education': '📚',
      'Salary': '💼',
      'Freelance': '💻',
      'Investment': '📈',
      'Gift': '🎁',
      'Income': '💰',
      'Other': '📝'
    };
    return icons[category] || '📝';
  };

  if (transactions.length === 0) {
    return (
      <div className="transaction-list-empty">
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <h3>No transactions yet</h3>
          <p>Start by adding your first transaction to see your financial activity.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="transaction-list">
      <div className="transaction-list-header">
        <h3>Recent Transactions</h3>
        <span className="transaction-count">{transactions.length} transactions</span>
      </div>
      
      <div className="transaction-items">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="transaction-item">
            <div className="transaction-icon">
              {getCategoryIcon(transaction.category)}
            </div>
            
            <div className="transaction-details">
              <div className="transaction-description">
                {transaction.description}
              </div>
              <div className="transaction-meta">
                <span className="transaction-category">{transaction.category}</span>
                <span className="transaction-date">{formatDate(transaction.date)}</span>
              </div>
            </div>
            
            <div className={`transaction-amount ${transaction.type}`}>
              {formatAmount(transaction.amount)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionList;
