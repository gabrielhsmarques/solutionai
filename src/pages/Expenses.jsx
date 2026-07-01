import { useNavigate } from 'react-router-dom'
import ExpenseForm from '../components/ExpenseForm'
import ExpenseList from '../components/ExpenseList'

// This page is simple — it just organizes the two components we created.
// This pattern is called "composition" in React:
// pages built from smaller, focused components.
export default function Expenses() {
  const navigate = useNavigate()

  return (
    <div style={styles.container}>
      <div style={styles.content}>

        {/* Header with back button */}
        <div style={styles.header}>
          <button
            onClick={() => navigate('/dashboard')}
            style={styles.backBtn}
          >
            ← Back
          </button>
          <h1 style={styles.title}>My Expenses</h1>
        </div>

        {/* Form to add a new expense */}
        <ExpenseForm />

        {/* List of recorded expenses */}
        <ExpenseList />

      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    padding: '1.5rem 1rem'
  },
  content: {
    maxWidth: '480px',
    margin: '0 auto'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1.25rem'
  },
  backBtn: {
    fontSize: '14px',
    padding: '6px 12px',
    backgroundColor: 'transparent',
    border: '1px solid #ddd',
    borderRadius: '8px',
    cursor: 'pointer',
    color: '#555'
  },
  title: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1a1a1a'
  }
}