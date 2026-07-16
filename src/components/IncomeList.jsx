import { useFinance } from '../context/FinanceContext'

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

  const extraIncomes = incomes.filter(i => i.category !== 'Debt Payment')
  const debtPayments = incomes.filter(i => i.category === 'Debt Payment')

  const totalExtra = extraIncomes.reduce((sum, i) => sum + i.amount, 0)
  const totalDebtPaid = debtPayments.reduce((sum, i) => sum + i.amount, 0)

  if (incomes.length === 0) {
    return (
      <div className="text-center py-8 bg-white rounded-xl shadow-card">
        <p className="text-[15px] font-medium text-gray-900 mb-1">No entries yet.</p>
        <p className="text-[13px] text-gray-400">Add your first income or debt payment above!</p>
      </div>
    )
  }

  return (
    <div>
      {extraIncomes.length > 0 && (
        <div className="bg-success rounded-xl p-5 mb-2.5">
          <p className="text-[11px] font-semibold text-white/70 tracking-wide mb-1">
            EXTRA INCOME THIS MONTH
          </p>
          <p className="text-[28px] font-semibold text-white">+${totalExtra.toFixed(2)}</p>
        </div>
      )}

      {debtPayments.length > 0 && (
        <div className="bg-primary rounded-xl p-5 mb-4">
          <p className="text-[11px] font-semibold text-white/70 tracking-wide mb-1">
            DEBT PAYMENTS THIS MONTH
          </p>
          <p className="text-[28px] font-semibold text-white">-${totalDebtPaid.toFixed(2)}</p>
        </div>
      )}

      {[...incomes].reverse().map(income => (
        <div
          key={income.id}
          className="flex justify-between items-center bg-white rounded-xl p-4 mb-2 shadow-card"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">
              {categoryEmoji[income.category] || '📦'}
            </span>
            <div>
              <p className="text-[15px] font-medium text-gray-900">
                {income.description}
              </p>
              <p className="text-xs text-gray-400">
                {income.category} · {income.date}
              </p>
            </div>
          </div>
          <p className={`text-base font-semibold ${income.category === 'Debt Payment' ? 'text-primary' : 'text-success'}`}>
            {income.category === 'Debt Payment' ? '-' : '+'}${income.amount.toFixed(2)}
          </p>
        </div>
      ))}
    </div>
  )
}