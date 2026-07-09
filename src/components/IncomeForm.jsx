import { useState } from 'react'
import { useFinance } from '../context/FinanceContext'

// Available categories for income and debt payment entries
const categories = [
  'Fixed Salary',
  'Freelance',
  'Favor / Gift',
  'Sale',
  'Debt Payment',
  'Other'
]

export default function IncomeForm() {
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState(categories[0])
  const { addIncome } = useFinance()

  function handleSubmit() {
    if (!description || !amount) return

    const newIncome = {
      id: Date.now(),
      description,
      amount: parseFloat(amount),
      category,
      date: new Date().toLocaleDateString('en-US')
    }

    addIncome(newIncome)
    setDescription('')
    setAmount('')
    setCategory(categories[0])
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>New Entry</h2>

      {/* Description input */}
      <label style={styles.label}>Description</label>
      <input
        type="text"
        placeholder="Ex: Freelance project"
        value={description}
        onChange={e => setDescription(e.target.value)}
        style={styles.input}
      />

      {/* Amount input */}
      <label style={styles.label}>Amount ($)</label>
      <input
        type="number"
        placeholder="Ex: 300"
        value={amount}
        onChange={e => setAmount(e.target.value)}
        style={styles.input}
      />

      {/* Category select */}
      <label style={styles.label}>Category</label>
      <select
        value={category}
        onChange={e => setCategory(e.target.value)}
        style={styles.select}
      >
        {categories.map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      <button onClick={handleSubmit} style={styles.button}>
        Save Entry
      </button>
    </div>
  )
}

const styles = {
  container: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '1.25rem',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    marginBottom: '1rem'
  },
  title: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: '1rem'
  },
  label: {
    display: 'block',
    fontSize: '12px',
    fontWeight: '500',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    marginBottom: '4px'
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    fontSize: '15px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    marginBottom: '1rem',
    outline: 'none'
  },
  select: {
    width: '100%',
    padding: '10px 14px',
    fontSize: '15px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    marginBottom: '1rem',
    outline: 'none',
    backgroundColor: '#fff'
  },
  button: {
    width: '100%',
    padding: '12px',
    fontSize: '15px',
    fontWeight: '500',
    backgroundColor: '#1D9E75',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer'
  }
}