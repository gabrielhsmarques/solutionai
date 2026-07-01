import { useFinance } from '../context/FinanceContext'

// Emoji for each category — makes the list more visual
const categoryEmoji = {
  Housing: '🏠',
  Food: '🍔',
  Transport: '🚗',
  Health: '❤️',
  Entertainment: '🎬',
  Other: '📦'
}

export default function ExpenseList() {
  const { expenses } = useFinance()

  // Calculates the total by summing all expense amounts
  // reduce works like a calculator that goes through each
  // item and accumulates the sum
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0)

  // If there are no expenses yet, shows an empty state message
  if (expenses.length === 0) {
    return (
      <div style={styles.empty}>
        <p style={styles.emptyText}>No expenses yet.</p>
        <p style={styles.emptySubtext}>Add your first expense above!</p>
      </div>
    )
  }

  return (
    <div>
      {/* Total card */}
      <div style={styles.totalCard}>
        <p style={styles.totalLabel}>TOTAL THIS MONTH</p>
        <p style={styles.totalValue}>${total.toFixed(2)}</p>
      </div>

      {/* Expense list — most recent first */}
      {[...expenses].reverse().map(expense => (
        <div key={expense.id} style={styles.expenseCard}>
          <div style={styles.expenseLeft}>
            <span style={styles.emoji}>
              {categoryEmoji[expense.category] || '📦'}
            </span>
            <div>
              <p style={styles.expenseDescription}>{expense.description}</p>
              <p style={styles.expenseMeta}>
                {expense.category} · {expense.date}
              </p>
            </div>
          </div>
          <p style={styles.expenseAmount}>
            -${expense.amount.toFixed(2)}
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
    backgroundColor: '#534AB7',
    borderRadius: '12px',
    padding: '1rem 1.25rem',
    marginBottom: '1rem'
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
  expenseCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '1rem 1.25rem',
    marginBottom: '8px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
  },
  expenseLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  emoji: {
    fontSize: '24px'
  },
  expenseDescription: {
    fontSize: '15px',
    fontWeight: '500',
    color: '#1a1a1a',
    marginBottom: '2px'
  },
  expenseMeta: {
    fontSize: '12px',
    color: '#888'
  },
  expenseAmount: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#E24B4A'
  }
}