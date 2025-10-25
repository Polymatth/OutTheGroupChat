
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import './TransactionForm.css';

interface TransactionFormProps {
  onClose: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onClose }) => {
  const { addTransaction } = useApp();
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    type: 'expense' as 'income' | 'expense',
    date: new Date().toISOString().split('T')[0]
  });

  const categories = {
    expense: ['Groceries', 'Entertainment', 'Utilities', 'Transportation', 'Healthcare', 'Shopping', 'Dining', 'Education', 'Other'],
    income: ['Salary', 'Freelance', 'Investment', 'Gift', 'Other']
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.description || !formData.amount || !formData.category) {
      alert('Please fill in all fields');
      return;
    }

    const amount = formData.type === 'expense' 
      ? -Math.abs(parseFloat(formData.amount))
      : Math.abs(parseFloat(formData.amount));

    addTransaction({
      description: formData.description,
      amount,
      category: formData.category,
      type: formData.type,
      date: formData.date
    });

    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Reset category when type changes
      ...(name === 'type' ? { category: '' } : {})
    }));
  };

  return (
    <div className="transaction-form-overlay">
      <div className="transaction-form-modal">
        <div className="transaction-form-header">
          <h2>Add New Transaction</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="transaction-form">
          <div className="form-group">
            <label className="label">Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="input"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          <div className="form-group">
            <label className="label">Description</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="input"
              placeholder="Enter description..."
              required
            />
          </div>

          <div className="form-group">
            <label className="label">Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              className="input"
              placeholder="0.00"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="form-group">
            <label className="label">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="input"
              required
            >
              <option value="">Select category...</option>
              {categories[formData.type].map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="label">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="input"
              required
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Add Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;
