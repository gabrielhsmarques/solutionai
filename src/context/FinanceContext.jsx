import { createContext, useContext, useState, useEffect } from 'react'

const FinanceContext = createContext()

export function FinanceProvider({ children }) {
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

  // New: stores all income entries (extra income + debt payments)
  const [incomes, setIncomes] = useState(() => {
    const saved = localStorage.getItem('incomes')
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

  useEffect(() => {
    localStorage.setItem('incomes', JSON.stringify(incomes))
  }, [incomes])

  function saveProfile(data) {
    setProfile(data)
  }

  function addExpense(expense) {
    setExpenses(prev => [...prev, expense])
  }

  function addGoal(goal) {
    setGoals(prev => [...prev, goal])
  }

  // New: adds an income or debt payment entry
  function addIncome(income) {
    setIncomes(prev => [...prev, income])
  }

  return (
    <FinanceContext.Provider value={{
      profile,
      expenses,
      goals,
      incomes,
      saveProfile,
      addExpense,
      addGoal,
      addIncome
    }}>
      {children}
    </FinanceContext.Provider>
  )
}

export function useFinance() {
  return useContext(FinanceContext)
}