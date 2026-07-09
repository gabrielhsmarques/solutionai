import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFinance } from '../context/FinanceContext'
import { generateDailyTip } from '../services/geminiService'

export default function Dashboard() {
  const { profile, expenses, incomes, saveProfile } = useFinance()
  const navigate = useNavigate()
  const [dailyTip, setDailyTip] = useState('')
  const [loadingTip, setLoadingTip] = useState(true)
  const [editingGoal, setEditingGoal] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState('')
  const [newDebt, setNewDebt] = useState('')

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
        setDailyTip('Keep track of your expenses daily — small habits build financial freedom.')
      } finally {
        setLoadingTip(false)
      }
    }

    fetchTip()
  }, [profile, navigate])

  if (!profile) return null

  // Base values from onboarding
  const income = parseFloat(profile.income) || 0
  const totalDebt = parseFloat(profile.debt) || 0

  // Extra incomes registered by the user (excluding debt payments)
  const extraIncome = incomes
    .filter(i => i.category !== 'Debt Payment')
    .reduce((sum, i) => sum + i.amount, 0)

  // Total real income = fixed salary + extra incomes
  const totalIncome = income + extraIncome

  // Calculates total spent — only real expenses, no debt payments
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)

  // Calculates how much debt has been paid via income "Debt Payment" category
  const debtPaid = incomes
    .filter(i => i.category === 'Debt Payment')
    .reduce((sum, i) => sum + i.amount, 0)

  // Remaining debt after payments
  const remainingDebt = Math.max(totalDebt - debtPaid, 0)

  // Debt payoff progress percentage
  const debtProgress = totalDebt > 0
    ? Math.min((debtPaid / totalDebt) * 100, 100)
    : 0

  // Leftover = total income - expenses - debt payments
  const leftover = Math.max(totalIncome - totalExpenses - debtPaid, 0)

  function handleGoalSave() {
    if (!selectedGoal) return

    // If the new goal is debt-related, ADD the new debt to the existing one
    // instead of replacing it — the app handles the math, not the user
    const currentDebt = parseFloat(profile.debt) || 0
    const additionalDebt = parseFloat(newDebt) || 0

    const updatedProfile = {
      ...profile,
      goal: selectedGoal,
      ...(selectedGoal === 'Get out of debt' && newDebt
        ? { debt: (currentDebt + additionalDebt).toFixed(2) }
        : {})
    }

    saveProfile(updatedProfile)
    setEditingGoal(false)
    setSelectedGoal('')
    setNewDebt('')
  }

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
            <p style={styles.cardLabel}>Total Income</p>
            <p style={styles.cardValue}>${totalIncome.toLocaleString()}</p>
          </div>
          <div style={{ ...styles.card, ...styles.cardDanger }}>
            <p style={styles.cardLabel}>Total Spent</p>
            <p style={{ ...styles.cardValue, color: '#E24B4A' }}>
              ${totalExpenses.toFixed(2)}
            </p>
          </div>
          <div style={{ ...styles.card, ...styles.cardSuccess }}>
            <p style={styles.cardLabel}>Leftover</p>
            <p style={{ ...styles.cardValue, color: '#1D9E75' }}>
              ${leftover.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Debt Progress Card */}
        {totalDebt > 0 && (
          <div style={styles.debtCard}>
            <div style={styles.debtHeader}>
              <p style={styles.sectionTitle}>💳 DEBT PAYOFF PROGRESS</p>
              <p style={styles.debtPercent}>{debtProgress.toFixed(1)}%</p>
            </div>

            {/* Progress bar */}
            <div style={styles.progressTrack}>
              <div style={{
                ...styles.progressFill,
                width: `${debtProgress}%`
              }} />
            </div>

            <div style={styles.debtNumbers}>
              <span style={styles.debtPaid}>
                Paid: ${debtPaid.toFixed(2)}
              </span>
              <span style={styles.debtRemaining}>
                Remaining: ${remainingDebt.toFixed(2)}
              </span>
            </div>
          </div>
        )}

        {/* Expenses Summary */}
        <div style={styles.summaryCard}>
          <p style={styles.sectionTitle}>📊 EXPENSES THIS MONTH</p>
          {expenses.length === 0 ? (
            <p style={styles.emptyText}>No expenses recorded yet.</p>
          ) : (
            <>
              {/* Groups expenses by category and shows totals */}
              {Object.entries(
                expenses.reduce((acc, e) => {
                  acc[e.category] = (acc[e.category] || 0) + e.amount
                  return acc
                }, {})
              ).map(([category, amount]) => (
                <div key={category} style={styles.categoryRow}>
                  <span style={styles.categoryName}>{category}</span>
                  <span style={styles.categoryAmount}>
                    ${amount.toFixed(2)}
                  </span>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Goal */}
        <div style={styles.goalCard}>
          <div style={styles.goalHeader}>
            <p style={styles.sectionTitle}>YOUR GOAL</p>
            <button
              onClick={() => setEditingGoal(true)}
              style={styles.editBtn}
            >
              ✏️ Change
            </button>
          </div>
          <p style={styles.goalText}>🎯 {profile.goal}</p>
          {profile.dependents > 0 && (
            <p style={styles.dependentsText}>
              👨‍👩‍👧 {profile.dependents} dependent(s)
            </p>
          )}
        </div>

        {/* Goal Edit Modal */}
        {editingGoal && (
          <div style={styles.modalOverlay}>
            <div style={styles.modal}>
              <h2 style={styles.modalTitle}>Change your goal</h2>
              <p style={styles.modalSubtitle}>
                Your expenses and profile will be kept.
              </p>

              {[
                'Get out of debt',
                'Build an emergency fund',
                'Start investing',
                'Organize my budget'
              ].map(option => (
                <button
                  key={option}
                  style={{
                    ...styles.goalOption,
                    ...(selectedGoal === option ? styles.goalOptionActive : {})
                  }}
                  onClick={() => setSelectedGoal(option)}
                >
                  {option}
                </button>
              ))}

              {/* Shows debt input only when "Get out of debt" is selected */}
              {selectedGoal === 'Get out of debt' && (
                <div style={{ marginTop: '1rem' }}>
                  <label style={styles.modalLabel}>
                    Add new debt amount ($) — will be added to your current debt
                  </label>
                  <input
                    type="number"
                    placeholder="Ex: 5000"
                    value={newDebt}
                    onChange={e => setNewDebt(e.target.value)}
                    style={styles.modalInput}
                  />
                </div>
              )}

              <button
                onClick={handleGoalSave}
                disabled={!selectedGoal}
                style={{
                  ...styles.confirmBtn,
                  ...(!selectedGoal ? styles.buttonDisabled : {})
                }}
              >
                Confirm
              </button>

              <button
                onClick={() => {
                  setEditingGoal(false)
                  setSelectedGoal('')
                  setNewDebt('')
                }}
                style={styles.cancelBtn}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Quick Access */}
        <p style={styles.sectionTitle}>QUICK ACCESS</p>
        <div style={styles.shortcutsGrid}>
          <button style={styles.shortcutBtn} onClick={() => navigate('/expenses')}>
            <span style={styles.shortcutIcon}>💸</span>
            <span style={styles.shortcutLabel}>Expenses</span>
          </button>
          <button style={styles.shortcutBtn} onClick={() => navigate('/income')}>
            <span style={styles.shortcutIcon}>💰</span>
            <span style={styles.shortcutLabel}>Income</span>
          </button>
          <button style={styles.shortcutBtn} onClick={() => navigate('/chat')}>
            <span style={styles.shortcutIcon}>🤖</span>
            <span style={styles.shortcutLabel}>AI Educator</span>
          </button>
          <button style={styles.shortcutBtn} onClick={() => navigate('/investing')}>
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
  cardDanger: { backgroundColor: '#fff5f5' },
  cardSuccess: { backgroundColor: '#f0faf6' },
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
  debtCard: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '1rem 1.25rem',
    marginBottom: '1rem',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
  },
  debtHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px'
  },
  debtPercent: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1D9E75'
  },
  progressTrack: {
    height: '10px',
    backgroundColor: '#f0f0f0',
    borderRadius: '99px',
    overflow: 'hidden',
    marginBottom: '8px'
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#1D9E75',
    borderRadius: '99px',
    transition: 'width 0.6s ease'
  },
  debtNumbers: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  debtPaid: {
    fontSize: '12px',
    color: '#1D9E75',
    fontWeight: '500'
  },
  debtRemaining: {
    fontSize: '12px',
    color: '#E24B4A',
    fontWeight: '500'
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '1rem 1.25rem',
    marginBottom: '1rem',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
  },
  emptyText: {
    fontSize: '13px',
    color: '#aaa'
  },
  categoryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '8px',
    marginBottom: '8px',
    borderBottom: '1px solid #f5f5f5'
  },
  categoryName: {
    fontSize: '14px',
    color: '#555'
  },
  categoryAmount: {
    fontSize: '14px',
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
  tipCard: {
    backgroundColor: '#EEF2FF',
    borderRadius: '12px',
    padding: '1rem 1.25rem',
    marginBottom: '1.25rem',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
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
  tipText: {
    fontSize: '14px',
    color: '#534AB7',
    lineHeight: '1.6'
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
    animation: 'bounce 0.8s infinite alternate'
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
    cursor: 'pointer'
  },
  shortcutIcon: { fontSize: '24px' },
  shortcutLabel: {
    fontSize: '12px',
    color: '#555',
    fontWeight: '500'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    padding: '1rem'
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    padding: '1.5rem',
    width: '100%',
    maxWidth: '380px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
  },
  modalTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: '4px'
  },
  modalSubtitle: {
    fontSize: '13px',
    color: '#888',
    marginBottom: '1.25rem'
  },
  goalOption: {
    display: 'block',
    width: '100%',
    padding: '12px 16px',
    marginBottom: '8px',
    fontSize: '14px',
    textAlign: 'left',
    backgroundColor: '#f9f9f9',
    border: '1px solid #eee',
    borderRadius: '10px',
    cursor: 'pointer',
    color: '#1a1a1a'
  },
  goalOptionActive: {
    backgroundColor: '#EEF2FF',
    borderColor: '#534AB7',
    color: '#534AB7',
    fontWeight: '500'
  },
  modalLabel: {
    display: 'block',
    fontSize: '12px',
    fontWeight: '500',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    marginBottom: '6px'
  },
  modalInput: {
    width: '100%',
    padding: '10px 14px',
    fontSize: '15px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    outline: 'none',
    marginBottom: '1rem'
  },
  confirmBtn: {
    display: 'block',
    width: '100%',
    padding: '12px',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: '500',
    backgroundColor: '#534AB7',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer'
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
    cursor: 'not-allowed'
  },
  cancelBtn: {
    display: 'block',
    width: '100%',
    padding: '12px',
    fontSize: '14px',
    backgroundColor: 'transparent',
    border: '1px solid #ddd',
    borderRadius: '10px',
    cursor: 'pointer',
    color: '#888'
  },
  editBtn: {
  fontSize: '12px',
  padding: '4px 10px',
  backgroundColor: 'transparent',
  border: '1px solid #ddd',
  borderRadius: '8px',
  cursor: 'pointer',
  color: '#534AB7'
}

}