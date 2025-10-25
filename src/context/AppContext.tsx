
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { persistence } from '../utils/persistence';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
}

export interface UserProfile {
  name: string;
  age: number;
  employment: 'student' | 'employed' | 'unemployed';
  monthlyIncome: number;
  budgetGoals: Record<string, number>;
}

export interface Notification {
  id: string;
  type: 'warning' | 'success' | 'info' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface AppState {
  transactions: Transaction[];
  userProfile: UserProfile | null;
  notifications: Notification[];
  financialHealthScore: number;
  loading: boolean;
}

type AppAction = 
  | { type: 'SET_TRANSACTIONS'; payload: Transaction[] }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'SET_USER_PROFILE'; payload: UserProfile }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'SET_FINANCIAL_HEALTH_SCORE'; payload: number }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: AppState = {
  transactions: [],
  userProfile: null,
  notifications: [],
  financialHealthScore: 0,
  loading: true,
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateUserProfile: (profile: UserProfile) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  calculateFinancialHealth: () => void;
} | null>(null);

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload };
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [...state.transactions, action.payload] };
    case 'SET_USER_PROFILE':
      return { ...state, userProfile: action.payload };
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [action.payload, ...state.notifications] };
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(n =>
          n.id === action.payload ? { ...n, read: true } : n
        ),
      };
    case 'SET_FINANCIAL_HEALTH_SCORE':
      return { ...state, financialHealthScore: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      // Load user profile
      const profileData = await persistence.getItem('userProfile');
      if (profileData) {
        dispatch({ type: 'SET_USER_PROFILE', payload: JSON.parse(profileData) });
      }

      // Load transactions or create sample data
      const transactionsData = await persistence.getItem('transactions');
      if (transactionsData) {
        dispatch({ type: 'SET_TRANSACTIONS', payload: JSON.parse(transactionsData) });
      } else {
        // Create sample transactions
        const sampleTransactions = generateSampleTransactions();
        dispatch({ type: 'SET_TRANSACTIONS', payload: sampleTransactions });
        await persistence.setItem('transactions', JSON.stringify(sampleTransactions));
      }

      // Load notifications
      const notificationsData = await persistence.getItem('notifications');
      if (notificationsData) {
        dispatch({ type: 'ADD_NOTIFICATION', payload: JSON.parse(notificationsData) });
      }

      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      console.error('Error loading initial data:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    
    dispatch({ type: 'ADD_TRANSACTION', payload: newTransaction });
    
    // Save to persistence
    const updatedTransactions = [...state.transactions, newTransaction];
    await persistence.setItem('transactions', JSON.stringify(updatedTransactions));
    
    // Check for budget alerts
    checkBudgetAlerts(newTransaction);
  };

  const updateUserProfile = async (profile: UserProfile) => {
    dispatch({ type: 'SET_USER_PROFILE', payload: profile });
    await persistence.setItem('userProfile', JSON.stringify(profile));
  };

  const addNotification = async (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false,
    };
    
    dispatch({ type: 'ADD_NOTIFICATION', payload: newNotification });
    
    // Save to persistence
    const updatedNotifications = [newNotification, ...state.notifications];
    await persistence.setItem('notifications', JSON.stringify(updatedNotifications));
  };

  const calculateFinancialHealth = () => {
    if (!state.userProfile || state.transactions.length === 0) {
      dispatch({ type: 'SET_FINANCIAL_HEALTH_SCORE', payload: 0 });
      return;
    }

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

    // Calculate score components
    const incomeExpenseRatio = monthlyIncome > 0 ? Math.min((monthlyIncome - monthlyExpenses) / monthlyIncome, 1) : 0;
    const savingsRate = monthlyIncome > 0 ? Math.max((monthlyIncome - monthlyExpenses) / monthlyIncome, 0) : 0;
    
    // Age factor (younger people expected to have lower scores)
    const ageFactor = state.userProfile.age < 25 ? 0.8 : 1;
    
    // Employment factor
    const employmentFactor = state.userProfile.employment === 'employed' ? 1 : 
                           state.userProfile.employment === 'student' ? 0.7 : 0.5;

    const score = Math.round(
      (incomeExpenseRatio * 40 + savingsRate * 30 + 20) * ageFactor * employmentFactor
    );

    dispatch({ type: 'SET_FINANCIAL_HEALTH_SCORE', payload: Math.min(Math.max(score, 0), 100) });
  };

  const checkBudgetAlerts = (transaction: Transaction) => {
    if (transaction.type === 'expense' && state.userProfile?.budgetGoals) {
      const categoryBudget = state.userProfile.budgetGoals[transaction.category];
      if (categoryBudget) {
        const currentMonth = new Date().getMonth();
        const monthlySpending = state.transactions
          .filter(t => 
            t.category === transaction.category && 
            t.type === 'expense' &&
            new Date(t.date).getMonth() === currentMonth
          )
          .reduce((sum, t) => sum + Math.abs(t.amount), 0);

        const spendingPercentage = (monthlySpending / categoryBudget) * 100;
        
        if (spendingPercentage >= 90) {
          addNotification({
            type: 'warning',
            title: 'Budget Alert',
            message: `You've spent ${spendingPercentage.toFixed(0)}% of your ${transaction.category} budget this month.`,
          });
        }
      }
    }
  };

  useEffect(() => {
    calculateFinancialHealth();
  }, [state.transactions, state.userProfile]);

  return (
    <AppContext.Provider value={{
      state,
      dispatch,
      addTransaction,
      updateUserProfile,
      addNotification,
      calculateFinancialHealth,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

function generateSampleTransactions(): Transaction[] {
  const categories = ['Groceries', 'Entertainment', 'Utilities', 'Transportation', 'Healthcare', 'Shopping', 'Dining'];
  const transactions: Transaction[] = [];
  
  // Generate transactions for the last 3 months
  for (let i = 0; i < 90; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Income (salary, freelance)
    if (i % 30 === 0) {
      transactions.push({
        id: `income-${i}`,
        date: date.toISOString().split('T')[0],
        description: 'Salary',
        amount: 3500,
        category: 'Income',
        type: 'income',
      });
    }
    
    // Random expenses
    if (Math.random() > 0.6) {
      const category = categories[Math.floor(Math.random() * categories.length)];
      const amount = -(Math.random() * 200 + 10);
      
      transactions.push({
        id: `expense-${i}`,
        date: date.toISOString().split('T')[0],
        description: `${category} purchase`,
        amount: amount,
        category,
        type: 'expense',
      });
    }
  }
  
  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
