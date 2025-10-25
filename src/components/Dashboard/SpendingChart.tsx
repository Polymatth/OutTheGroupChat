
import React from 'react';
import { Transaction } from '../../context/AppContext';
import './SpendingChart.css';

interface SpendingChartProps {
  transactions: Transaction[];
}

const SpendingChart: React.FC<SpendingChartProps> = ({ transactions }) => {
  // Calculate spending by category for current month
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthlyExpenses = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    return t.type === 'expense' && 
           transactionDate.getMonth() === currentMonth && 
           transactionDate.getFullYear() === currentYear;
  });

  const categorySpending = monthlyExpenses.reduce((acc, transaction) => {
    const category = transaction.category;
    acc[category] = (acc[category] || 0) + Math.abs(transaction.amount);
    return acc;
  }, {} as Record<string, number>);

  const totalSpending = Object.values(categorySpending).reduce((sum, amount) => sum + amount, 0);
  
  const chartData = Object.entries(categorySpending)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: totalSpending > 0 ? (amount / totalSpending) * 100 : 0
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 6); // Show top 6 categories

  const getCategoryColor = (index: number) => {
    const colors = [
      '#3b82f6', '#10b981', '#f59e0b', '#ef4444', 
      '#8b5cf6', '#06b6d4', '#f97316', '#84cc16'
    ];
    return colors[index % colors.length];
  };

  if (chartData.length === 0) {
    return (
      <div className="spending-chart">
        <div className="chart-header">
          <h3>Monthly Spending</h3>
        </div>
        <div className="chart-empty">
          <div className="empty-icon">📊</div>
          <p>No expenses this month</p>
        </div>
      </div>
    );
  }

  return (
    <div className="spending-chart">
      <div className="chart-header">
        <h3>Monthly Spending</h3>
        <span className="chart-total">Total: ${totalSpending.toLocaleString()}</span>
      </div>
      
      <div className="chart-content">
        <div className="chart-bars">
          {chartData.map((item, index) => (
            <div key={item.category} className="chart-bar-container">
              <div className="chart-bar-info">
                <span className="category-name">{item.category}</span>
                <span className="category-amount">${item.amount.toLocaleString()}</span>
              </div>
              <div className="chart-bar-track">
                <div 
                  className="chart-bar-fill"
                  style={{
                    width: `${item.percentage}%`,
                    backgroundColor: getCategoryColor(index)
                  }}
                />
              </div>
              <span className="category-percentage">{item.percentage.toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpendingChart;
