import { createContext, useContext, useState, useEffect } from 'react'
import { encryptData, decryptData } from '../utils/crypto'

const FinanceContext = createContext()

export function FinanceProvider({ children }) {
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('profile')
    return saved ? decryptData(saved, null) : null
  })

  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('expenses')
    return saved ? decryptData(saved, []) : []
  })

  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem('goals')
    return saved ? decryptData(saved, []) : []
  })

  const [incomes, setIncomes] = useState(() => {
    const saved = localStorage.getItem('incomes')
    return saved ? decryptData(saved, []) : []
  })

  useEffect(() => {
    localStorage.setItem('profile', encryptData(profile))
  }, [profile])

  useEffect(() => {
    localStorage.setItem('expenses', encryptData(expenses))
  }, [expenses])

  useEffect(() => {
    localStorage.setItem('goals', encryptData(goals))
  }, [goals])

  useEffect(() => {
    localStorage.setItem('incomes', encryptData(incomes))
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