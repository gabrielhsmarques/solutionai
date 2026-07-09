import { useNavigate } from 'react-router-dom'
import IncomeForm from '../components/IncomeForm'
import IncomeList from '../components/IncomeList'

export default function Income() {
  const navigate = useNavigate()

  return (
    <div style={styles.container}>
      <div style={styles.content}>

        {/* Header */}
        <div style={styles.header}>
          <button onClick={() => navigate('/dashboard')} style={styles.backBtn}>
            ← Back
          </button>
          <h1 style={styles.title}>Income & Payments</h1>
        </div>

        {/* Two column layout on desktop */}
        <div style={styles.twoColumns}>
          <div>
            <IncomeForm />
          </div>
          <div>
            <IncomeList />
          </div>
        </div>

      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    padding: '1.5rem 3rem'
  },
  content: {
    width: '100%'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1.5rem'
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
    fontSize: '24px',
    fontWeight: '600',
    color: '#1a1a1a'
  },
  twoColumns: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
    alignItems: 'start'
  }
}