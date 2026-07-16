import { useFinance } from '../context/FinanceContext'

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
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0)

  if (expenses.length === 0) {
    return (
      <div className="text-center py-8 bg-white rounded-xl shadow-card">
        <p className="text-[15px] font-medium text-gray-900 mb-1">No expenses yet.</p>
        <p className="text-[13px] text-gray-400">Add your first expense above!</p>
      </div>
    )
  }

  return (
    <div>
      <div className="bg-danger rounded-xl p-5 mb-4">
        <p className="text-[11px] font-semibold text-white/70 tracking-wide mb-1">
          TOTAL THIS MONTH
        </p>
        <p className="text-[28px] font-semibold text-white">${total.toFixed(2)}</p>
      </div>

      {[...expenses].reverse().map(expense => (
        <div
          key={expense.id}
          className="flex justify-between items-center bg-white rounded-xl p-4 mb-2 shadow-card"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">
              {categoryEmoji[expense.category] || '📦'}
            </span>
            <div>
              <p className="text-[15px] font-medium text-gray-900">
                {expense.description}
              </p>
              <p className="text-xs text-gray-400">
                {expense.category} · {expense.date}
              </p>
            </div>
          </div>
          <p className="text-base font-semibold text-danger">
            -${expense.amount.toFixed(2)}
          </p>
        </div>
      ))}
    </div>
  )
}