import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFinance } from '../context/FinanceContext'
import { generateDailyTip } from '../services/geminiService'

export default function Dashboard() {
  const { profile } = useFinance()
  const navigate = useNavigate()
  const [dailyTip, setDailyTip] = useState('')
  const [loadingTip, setLoadingTip] = useState(true)

  useEffect(() => {
    if (!profile) {
      navigate('/')
      return
    }
    

    async function fetchTip() {
      try {
        const tip = await generateDailyTip(profile)
        setDailyTip(tip)
      } catch (error) {
        console.error('Gemini error:', error)
        setDailyTip('Keep track of your expenses daily — small habits build financial freedom.')
      } finally {
        setLoadingTip(false)
      }
    }

    fetchTip()
  }, [profile, navigate])

  if (!profile) return null

  const income = parseFloat(profile.income) || 0
  const debt = parseFloat(profile.debt) || 0
  const monthlyDebtPayment = parseFloat((debt * 0.1).toFixed(2))
  const leftover = parseFloat((income - monthlyDebtPayment).toFixed(2))

  return (
    <div style={styles.container}>
      <div style={styles.content}>

        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.greeting}>Hello, {profile.name}! 👋</h1>
            <p style={styles.subtitle}>Here is your financial summary</p>
          </div>
          <button
            onClick={() => {
              localStorage.clear()
              navigate('/')
            }}
            style={styles.resetBtn}
          >
            Reset
          </button>
        </div>

        {/* Metric Cards */}
        <div style={styles.cardsGrid}>
          <div style={styles.card}>
            <p style={styles.cardLabel}>Monthly Income</p>
            <p style={styles.cardValue}>
              ${income.toLocaleString()}
            </p>
          </div>
          <div style={{ ...styles.card, ...styles.cardDanger }}>
            <p style={styles.cardLabel}>Total Debt</p>
            <p style={{ ...styles.cardValue, color: '#E24B4A' }}>
              ${debt.toLocaleString()}
            </p>
          </div>
          <div style={{ ...styles.card, ...styles.cardSuccess }}>
            <p style={styles.cardLabel}>Monthly Leftover</p>
            <p style={{ ...styles.cardValue, color: '#1D9E75' }}>
              ${leftover.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Goal */}
        <div style={styles.goalCard}>
          <p style={styles.sectionTitle}>YOUR GOAL</p>
          <p style={styles.goalText}>🎯 {profile.goal}</p>
          {profile.dependents > 0 && (
            <p style={styles.dependentsText}>
              👨‍👩‍👧 {profile.dependents} dependent(s)
            </p>
          )}
        </div>

        {/* Daily Tip */}
        <div style={styles.tipCard}>
          <p style={styles.sectionTitle}>💡 DAILY TIP</p>
          {loadingTip ? (
            <div style={styles.tipLoading}>
              <div style={styles.tipDot} />
              <div style={{ ...styles.tipDot, animationDelay: '0.2s' }} />
              <div style={{ ...styles.tipDot, animationDelay: '0.4s' }} />
            </div>
          ) : (
            <p style={styles.tipText}>{dailyTip}</p>
          )}
        </div>

        {/* Quick Access */}
        <p style={styles.sectionTitle}>QUICK ACCESS</p>
        <div style={styles.shortcutsGrid}>
          <button
            style={styles.shortcutBtn}
            onClick={() => navigate('/expenses')}
          >
            <span style={styles.shortcutIcon}>💸</span>
            <span style={styles.shortcutLabel}>Expenses</span>
          </button>
          <button
            style={styles.shortcutBtn}
            onClick={() => navigate('/chat')}
          >
            <span style={styles.shortcutIcon}>🤖</span>
            <span style={styles.shortcutLabel}>AI Educator</span>
          </button>
          <button
            style={styles.shortcutBtn}
            onClick={() => navigate('/investing')}
          >
            <span style={styles.shortcutIcon}>📈</span>
            <span style={styles.shortcutLabel}>Investing</span>
          </button>
        </div>

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
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1.25rem'
  },
  greeting: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1a1a1a'
  },
  subtitle: {
    fontSize: '13px',
    color: '#888',
    marginTop: '2px'
  },
  resetBtn: {
    fontSize: '12px',
    padding: '6px 12px',
    backgroundColor: 'transparent',
    border: '1px solid #ddd',
    borderRadius: '8px',
    cursor: 'pointer',
    color: '#888'
  },
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '10px',
    marginBottom: '1rem'
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '14px 12px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
  },
  cardDanger: {
    backgroundColor: '#fff5f5'
  },
  cardSuccess: {
    backgroundColor: '#f0faf6'
  },
  cardLabel: {
    fontSize: '11px',
    color: '#888',
    marginBottom: '6px',
    textTransform: 'uppercase',
    letterSpacing: '0.04em'
  },
  cardValue: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1a1a1a'
  },
  goalCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '1rem 1.25rem',
    marginBottom: '1rem',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
  },
  tipText: {
    fontSize: '14px',
    color: '#534AB7',
    lineHeight: '1.6'
  },
  tipCard: {
    backgroundColor: '#EEF2FF',
    borderRadius: '12px',
    padding: '1rem 1.25rem',
    marginBottom: '1.25rem',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
  },
  tipLoading: {
    display: 'flex',
    gap: '6px',
    alignItems: 'center',
    padding: '4px 0'
  },
  tipDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#534AB7',
    animation: 'bounce 0.8s infinite alternate',
  },
  sectionTitle: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#888',
    letterSpacing: '0.06em',
    marginBottom: '8px'
  },
  goalText: {
    fontSize: '15px',
    color: '#1a1a1a',
    fontWeight: '500'
  },
  dependentsText: {
    fontSize: '13px',
    color: '#888',
    marginTop: '6px'
  },
  shortcutsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '10px'
  },
  shortcutBtn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#ffffff',
    border: '1px solid #eee',
    borderRadius: '12px',
    padding: '16px 8px',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  shortcutIcon: {
    fontSize: '24px'
  },
  shortcutLabel: {
    fontSize: '12px',
    color: '#555',
    fontWeight: '500'
  }
}