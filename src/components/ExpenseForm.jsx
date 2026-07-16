import { useState } from 'react'
import { useFinance } from '../context/FinanceContext'

const categories = [
  'Housing',
  'Food',
  'Transport',
  'Health',
  'Entertainment',
  'Other'
]

export default function ExpenseForm() {
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState(categories[0])
  const { addExpense } = useFinance()

  function handleSubmit() {
    if (!description || !amount) return

    const newExpense = {
      id: Date.now(),
      description,
      amount: parseFloat(amount),
      category,
      date: new Date().toLocaleDateString('en-US')
    }

    addExpense(newExpense)
    setDescription('')
    setAmount('')
    setCategory(categories[0])
  }

  return (
    <div className="bg-white rounded-xl p-5 shadow-card mb-4">
      <h2 className="text-base font-semibold text-gray-900 mb-4">New Expense</h2>

      <label className="block text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
        Description
      </label>
      <input
        type="text"
        placeholder="Ex: Supermarket"
        value={description}
        onChange={e => setDescription(e.target.value)}
        className="w-full px-3.5 py-2.5 text-[15px] rounded-lg border border-gray-300 outline-none focus:border-primary mb-4 transition-colors"
      />

      <label className="block text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
        Amount ($)
      </label>
      <input
        type="number"
        placeholder="Ex: 150"
        value={amount}
        onChange={e => setAmount(e.target.value)}
        className="w-full px-3.5 py-2.5 text-[15px] rounded-lg border border-gray-300 outline-none focus:border-primary mb-4 transition-colors"
      />

      <label className="block text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
        Category
      </label>
      <select
        value={category}
        onChange={e => setCategory(e.target.value)}
        className="w-full px-3.5 py-2.5 text-[15px] rounded-lg border border-gray-300 outline-none focus:border-primary mb-4 bg-white"
      >
        {categories.map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      <button
        onClick={handleSubmit}
        className="w-full py-3 text-[15px] font-medium bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
      >
        Save Expense
      </button>
    </div>
  )
}