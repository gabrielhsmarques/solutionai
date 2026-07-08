import { useState } from 'react'
import { useFinance } from '../context/FinanceContext'

// Available categories to classify the expense
const categories = [
  'Housing',
  'Food',
  'Transport',
  'Health',
  'Entertainment',
  'Debt Payment',
  'Other'
]

export default function ExpenseForm() {
  // Three controlled fields — description, amount and category
  // "Controlled" means React manages the input value,
  // not the browser. Each change in the input updates the state.
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState(categories[0])

  // We grab the addExpense function from our global state
  const { addExpense } = useFinance()

  function handleSubmit() {
    // Basic validation — prevents saving without description or amount
    if (!description || !amount) return

    // Builds the expense object with a unique id based on timestamp
    const newExpense = {
      id: Date.now(),
      description,
      amount: parseFloat(amount),
      category,
      date: new Date().toLocaleDateString('en-US')
    }

    // Saves to global state — automatically persists to localStorage
    addExpense(newExpense)

    // Clears the fields after saving
    setDescription('')
    setAmount('')
    setCategory(categories[0])
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>New Expense</h2>

      {/* Description input */}
      <label style={styles.label}>Description</label>
      <input
        type="text"
        placeholder="Ex: Supermarket"
        value={description}
        onChange={e => setDescription(e.target.value)}
        style={styles.input}
      />

      {/* Amount input */}
      <label style={styles.label}>Amount ($)</label>
      <input
        type="number"
        placeholder="Ex: 150"
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

      {/* Save button */}
      <button onClick={handleSubmit} style={styles.button}>
        Save Expense
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
    backgroundColor: '#534AB7',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer'
  }
}