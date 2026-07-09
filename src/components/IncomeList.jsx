import { useFinance } from '../context/FinanceContext'

// Emoji for each income category
const categoryEmoji = {
  'Fixed Salary': '💼',
  'Freelance': '💻',
  'Favor / Gift': '🤝',
  'Sale': '🛍️',
  'Debt Payment': '💳',
  'Other': '📦'
}

export default function IncomeList() {
  const { incomes } = useFinance()

  // Separates extra incomes from debt payments for clearer display
  const extraIncomes = incomes.filter(i => i.category !== 'Debt Payment')
  const debtPayments = incomes.filter(i => i.category === 'Debt Payment')

  const totalExtra = extraIncomes.reduce((sum, i) => sum + i.amount, 0)
  const totalDebtPaid = debtPayments.reduce((sum, i) => sum + i.amount, 0)

  if (incomes.length === 0) {
    return (
      <div style={styles.empty}>
        <p style={styles.emptyText}>No entries yet.</p>
        <p style={styles.emptySubtext}>Add your first income or debt payment above!</p>
      </div>
    )
  }

  return (
    <div>
      {/* Extra income total card */}
      {extraIncomes.length > 0 && (
        <div style={styles.totalCard}>
          <p style={styles.totalLabel}>EXTRA INCOME THIS MONTH</p>
          <p style={styles.totalValue}>+${totalExtra.toFixed(2)}</p>
        </div>
      )}

      {/* Debt payments total card */}
      {debtPayments.length > 0 && (
        <div style={{ ...styles.totalCard, backgroundColor: '#534AB7' }}>
          <p style={styles.totalLabel}>DEBT PAYMENTS THIS MONTH</p>
          <p style={styles.totalValue}>-${totalDebtPaid.toFixed(2)}</p>
        </div>
      )}

      {/* Full list — most recent first */}
      {[...incomes].reverse().map(income => (
        <div key={income.id} style={styles.incomeCard}>
          <div style={styles.incomeLeft}>
            <span style={styles.emoji}>
              {categoryEmoji[income.category] || '📦'}
            </span>
            <div>
              <p style={styles.incomeDescription}>{income.description}</p>
              <p style={styles.incomeMeta}>
                {income.category} · {income.date}
              </p>
            </div>
          </div>
          <p style={{
            ...styles.incomeAmount,
            color: income.category === 'Debt Payment' ? '#534AB7' : '#1D9E75'
          }}>
            {income.category === 'Debt Payment' ? '-' : '+'}${income.amount.toFixed(2)}
          </p>
        </div>
      ))}
    </div>
  )
}

const styles = {
  empty: {
    textAlign: 'center',
    padding: '2rem',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
  },
  emptyText: {
    fontSize: '15px',
    fontWeight: '500',
    color: '#1a1a1a',
    marginBottom: '4px'
  },
  emptySubtext: {
    fontSize: '13px',
    color: '#888'
  },
  totalCard: {
    backgroundColor: '#1D9E75',
    borderRadius: '12px',
    padding: '1rem 1.25rem',
    marginBottom: '10px'
  },
  totalLabel: {
    fontSize: '11px',
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: '0.06em',
    marginBottom: '4px'
  },
  totalValue: {
    fontSize: '28px',
    fontWeight: '600',
    color: '#fff'
  },
  incomeCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '1rem 1.25rem',
    marginBottom: '8px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
  },
  incomeLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  emoji: { fontSize: '24px' },
  incomeDescription: {
    fontSize: '15px',
    fontWeight: '500',
    color: '#1a1a1a',
    marginBottom: '2px'
  },
  incomeMeta: {
    fontSize: '12px',
    color: '#888'
  },
  incomeAmount: {
    fontSize: '16px',
    fontWeight: '600'
  }
}