
import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import './ChatBot.css';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { state } = useApp();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Welcome message
      addBotMessage("Hi! I'm your financial assistant. I can help you understand your spending patterns, suggest budget improvements, or answer questions about your finances. How can I help you today?");
    }
  }, [isOpen]);

  const addBotMessage = (text: string) => {
    const message: Message = {
      id: Date.now().toString(),
      text,
      sender: 'bot',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, message]);
  };

  const addUserMessage = (text: string) => {
    const message: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, message]);
  };

  const generateBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Calculate some basic stats
    const currentMonth = new Date().getMonth();
    const monthlyTransactions = state.transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getMonth() === currentMonth;
    });
    
    const monthlyIncome = monthlyTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const monthlyExpenses = monthlyTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const topCategory = monthlyTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
        return acc;
      }, {} as Record<string, number>);
    
    const topSpendingCategory = Object.entries(topCategory)
      .sort(([,a], [,b]) => b - a)[0];

    // Response logic
    if (message.includes('spending') || message.includes('expense')) {
      if (monthlyExpenses === 0) {
        return "You haven't recorded any expenses this month yet. Start tracking your spending to get personalized insights!";
      }
      return `This month you've spent $${monthlyExpenses.toLocaleString()}. Your biggest expense category is ${topSpendingCategory?.[0] || 'unknown'} at $${topSpendingCategory?.[1]?.toLocaleString() || '0'}. Consider reviewing this category for potential savings.`;
    }
    
    if (message.includes('income') || message.includes('earn')) {
      if (monthlyIncome === 0) {
        return "I don't see any income recorded this month. Make sure to add your income sources to get a complete financial picture.";
      }
      return `Your income this month is $${monthlyIncome.toLocaleString()}. ${monthlyIncome > monthlyExpenses ? "Great job staying within your means!" : "You might want to review your expenses as they exceed your income."}`;
    }
    
    if (message.includes('budget') || message.includes('goal')) {
      if (!state.userProfile?.budgetGoals) {
        return "You haven't set up budget goals yet. Visit your profile to set spending limits for different categories. This will help you track and control your expenses better.";
      }
      return "I can see you have budget goals set up. Check your dashboard to see how you're tracking against them. Would you like tips on staying within budget?";
    }
    
    if (message.includes('save') || message.includes('saving')) {
      const savings = monthlyIncome - monthlyExpenses;
      if (savings > 0) {
        return `You're saving $${savings.toLocaleString()} this month! That's ${((savings/monthlyIncome)*100).toFixed(1)}% of your income. Great work!`;
      } else {
        return "Your expenses exceed your income this month. Try the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings. Start by identifying non-essential expenses you can reduce.";
      }
    }
    
    if (message.includes('health') || message.includes('score')) {
      const score = state.financialHealthScore;
      let advice = '';
      if (score >= 80) advice = "Excellent! Keep up the great work.";
      else if (score >= 60) advice = "Good, but there's room for improvement. Focus on increasing savings.";
      else if (score >= 40) advice = "Fair. Consider creating a budget and reducing unnecessary expenses.";
      else advice = "Needs attention. Start by tracking all expenses and creating a realistic budget.";
      
      return `Your financial health score is ${score}/100. ${advice}`;
    }
    
    if (message.includes('tip') || message.includes('advice') || message.includes('help')) {
      const tips = [
        "Track every expense, no matter how small. Small purchases add up quickly.",
        "Use the 24-hour rule for non-essential purchases over $100.",
        "Automate your savings - pay yourself first before other expenses.",
        "Review and cancel unused subscriptions monthly.",
        "Set specific, measurable financial goals and track your progress.",
        "Build an emergency fund covering 3-6 months of expenses."
      ];
      return tips[Math.floor(Math.random() * tips.length)];
    }
    
    // Default responses
    const defaultResponses = [
      "I can help you analyze your spending patterns, set budget goals, or provide financial tips. What would you like to know?",
      "Try asking me about your spending, income, savings, or financial health score.",
      "I'm here to help with your financial questions. You can ask about budgets, expenses, or get money-saving tips.",
      "Feel free to ask me about your financial data or request advice on managing your money better."
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    addUserMessage(userMessage);
    setInputValue('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const response = generateBotResponse(userMessage);
      addBotMessage(response);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <>
      <button 
        className={`chatbot-toggle ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        title="Financial Assistant"
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {isOpen && (
        <div className="chatbot-container">
          <div className="chatbot-header">
            <div className="chatbot-title">
              <span className="chatbot-avatar">🤖</span>
              <div>
                <h3>Financial Assistant</h3>
                <span className="chatbot-status">Online</span>
              </div>
            </div>
            <button 
              className="chatbot-close"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.sender}`}>
                <div className="message-content">
                  {message.text}
                </div>
                <div className="message-time">
                  {formatTime(message.timestamp)}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="message bot typing">
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-input">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about your finances..."
              className="chatbot-input-field"
            />
            <button 
              onClick={handleSendMessage}
              className="chatbot-send-btn"
              disabled={!inputValue.trim()}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
