
import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { UserProfile as UserProfileType } from '../../context/AppContext';
import './UserProfile.css';

const UserProfile: React.FC = () => {
  const { state, updateUserProfile, addNotification } = useApp();
  const [formData, setFormData] = useState<UserProfileType>({
    name: '',
    age: 25,
    employment: 'employed',
    monthlyIncome: 0,
    budgetGoals: {}
  });
  const [budgetCategories, setBudgetCategories] = useState<string[]>(['Groceries', 'Entertainment', 'Utilities', 'Transportation']);
  const [newCategory, setNewCategory] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (state.userProfile) {
      setFormData(state.userProfile);
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  }, [state.userProfile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'age' || name === 'monthlyIncome' ? parseFloat(value) || 0 : value
    }));
  };

  const handleBudgetChange = (category: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      budgetGoals: {
        ...prev.budgetGoals,
        [category]: parseFloat(value) || 0
      }
    }));
  };

  const handleAddCategory = () => {
    if (newCategory.trim() && !budgetCategories.includes(newCategory.trim())) {
      setBudgetCategories(prev => [...prev, newCategory.trim()]);
      setNewCategory('');
    }
  };

  const handleRemoveCategory = (category: string) => {
    setBudgetCategories(prev => prev.filter(c => c !== category));
    setFormData(prev => {
      const { [category]: removed, ...restBudgets } = prev.budgetGoals;
      return { ...prev, budgetGoals: restBudgets };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      addNotification({
        type: 'error',
        title: 'Validation Error',
        message: 'Please enter your name'
      });
      return;
    }

    await updateUserProfile(formData);
    setIsEditing(false);
    
    addNotification({
      type: 'success',
      title: 'Profile Updated',
      message: 'Your profile has been saved successfully!'
    });
  };

  const calculateBudgetTotal = () => {
    return Object.values(formData.budgetGoals).reduce((sum, amount) => sum + amount, 0);
  };

  return (
    <div className="user-profile">
      <div className="profile-header">
        <h1 className="profile-title">User Profile</h1>
        {!isEditing && (
          <button 
            className="btn btn-primary"
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </button>
        )}
      </div>

      <div className="profile-content">
        <div className="profile-section">
          <div className="section-header">
            <h2>Personal Information</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-row">
              <div className="form-group">
                <label className="label">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="Enter your full name"
                  disabled={!isEditing}
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="label">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="input"
                  min="18"
                  max="100"
                  disabled={!isEditing}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="label">Employment Status</label>
                <select
                  name="employment"
                  value={formData.employment}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!isEditing}
                  required
                >
                  <option value="employed">Employed</option>
                  <option value="student">Student</option>
                  <option value="unemployed">Unemployed</option>
                </select>
              </div>
              
              <div className="form-group">
                <label className="label">Monthly Income</label>
                <input
                  type="number"
                  name="monthlyIncome"
                  value={formData.monthlyIncome}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="0"
                  min="0"
                  step="0.01"
                  disabled={!isEditing}
                />
              </div>
            </div>
          </form>
        </div>

        <div className="profile-section">
          <div className="section-header">
            <h2>Budget Goals</h2>
            <p className="section-description">
              Set monthly spending limits for different categories to help control your expenses.
            </p>
          </div>
          
          <div className="budget-goals">
            {isEditing && (
              <div className="add-category">
                <div className="add-category-input">
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Add new category..."
                    className="input"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                  />
                  <button 
                    type="button"
                    onClick={handleAddCategory}
                    className="btn btn-secondary"
                    disabled={!newCategory.trim()}
                  >
                    Add
                  </button>
                </div>
              </div>
            )}

            <div className="budget-categories">
              {budgetCategories.map((category) => (
                <div key={category} className="budget-category">
                  <div className="category-header">
                    <span className="category-name">{category}</span>
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => handleRemoveCategory(category)}
                        className="remove-category-btn"
                        title="Remove category"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  <input
                    type="number"
                    value={formData.budgetGoals[category] || ''}
                    onChange={(e) => handleBudgetChange(category, e.target.value)}
                    className="input budget-input"
                    placeholder="0"
                    min="0"
                    step="0.01"
                    disabled={!isEditing}
                  />
                </div>
              ))}
            </div>

            {Object.keys(formData.budgetGoals).length > 0 && (
              <div className="budget-summary">
                <div className="budget-total">
                  <strong>Total Monthly Budget: ${calculateBudgetTotal().toLocaleString()}</strong>
                </div>
                {formData.monthlyIncome > 0 && (
                  <div className="budget-ratio">
                    Budget uses {((calculateBudgetTotal() / formData.monthlyIncome) * 100).toFixed(1)}% of your income
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="profile-actions">
            <button 
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setIsEditing(false);
                if (state.userProfile) {
                  setFormData(state.userProfile);
                }
              }}
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="btn btn-primary"
              onClick={handleSubmit}
            >
              Save Profile
            </button>
          </div>
        )}

        {!isEditing && !state.userProfile && (
          <div className="profile-empty">
            <div className="empty-icon">👤</div>
            <h3>Complete Your Profile</h3>
            <p>Set up your profile to get personalized financial insights and recommendations.</p>
            <button 
              className="btn btn-primary"
              onClick={() => setIsEditing(true)}
            >
              Get Started
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
