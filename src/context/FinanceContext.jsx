import { createContext, useContext, useState } from 'react';

const FinanceContext = createContext();

export const FinanceProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [goals, setGoals] = useState([]);
  
  function saveProfile(data) {
    setProfile(data);
  }

  function addExpense(expense) {
    setExpenses(prev => [...prev, expense]);
  }

  function addGoal(goal) {
    setGoals(prev => [...prev, goal]);
  }

  return (
    <FinanceContext.Provider value={{ 
        profile, 
        expenses, 
        goals, 
        saveProfile, 
        addExpense, 
        addGoal 
    }}>
        {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
    return useContext(FinanceContext);
}