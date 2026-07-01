import { createContext, useContext, useState, useEffect } from 'react';

const FinanceContext = createContext()

export const FinanceProvider = ({ children }) => {
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('profile')
    return saved ? JSON.parse(saved) : null
  })
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('expenses')
    return saved ? JSON.parse(saved) : []
  })
  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem('goals')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('profile', JSON.stringify(profile))
  }, [profile])

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses))
  }, [expenses])

  useEffect(() => {
    localStorage.setItem('goals', JSON.stringify(goals))
  }, [goals])

  function saveProfile(data) {
    setProfile(data)
  }

  function addExpense(expense) {
    setExpenses(prev => [...prev, expense])
  }

  function addGoal(goal) {
    setGoals(prev => [...prev, goal])
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
  )
}

export function useFinance() {
    return useContext(FinanceContext)
}
