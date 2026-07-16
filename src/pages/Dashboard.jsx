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

  const income = parseFloat(profile.income) || 0
  const totalDebt = parseFloat(profile.debt) || 0

  const extraIncome = incomes
    .filter(i => i.category !== 'Debt Payment')
    .reduce((sum, i) => sum + i.amount, 0)

  const totalIncome = income + extraIncome
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)

  const debtPaid = incomes
    .filter(i => i.category === 'Debt Payment')
    .reduce((sum, i) => sum + i.amount, 0)

  const remainingDebt = Math.max(totalDebt - debtPaid, 0)
  const debtProgress = totalDebt > 0
    ? Math.min((debtPaid / totalDebt) * 100, 100)
    : 0

  const leftover = totalIncome - totalExpenses - debtPaid

  function handleGoalSave() {
    if (!selectedGoal) return

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
    <div className="w-full">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">
          Hello, {profile.name}! 👋
        </h1>
        <p className="text-[13px] text-gray-400 mt-0.5">
          Here is your financial summary
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-white rounded-xl p-4 shadow-card">
          <p className="text-[11px] text-gray-400 mb-1.5 uppercase tracking-wide">
            Total Income
          </p>
          <p className="text-lg font-semibold text-gray-900">
            ${totalIncome.toLocaleString()}
          </p>
        </div>

        <div className="bg-danger-light rounded-xl p-4 shadow-card">
          <p className="text-[11px] text-gray-400 mb-1.5 uppercase tracking-wide">
            Total Spent
          </p>
          <p className="text-lg font-semibold text-danger">
            ${totalExpenses.toFixed(2)}
          </p>
        </div>

        <div className={`rounded-xl p-4 shadow-card ${leftover < 0 ? 'bg-danger-light' : 'bg-success-light'}`}>
          <p className="text-[11px] text-gray-400 mb-1.5 uppercase tracking-wide">
            Leftover
          </p>
          <p className={`text-lg font-semibold ${leftover < 0 ? 'text-danger' : 'text-success'}`}>
            {leftover < 0 ? '-' : ''}${Math.abs(leftover).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-2 gap-4 mb-6 max-md:grid-cols-1">

        {/* Left Column */}
        <div className="flex flex-col gap-4">

          {/* Debt Progress */}
          {totalDebt > 0 && (
            <div className="bg-white rounded-xl p-5 shadow-card">
              <div className="flex justify-between items-center mb-2">
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
                  💳 Debt Payoff Progress
                </p>
                <p className="text-sm font-semibold text-success">
                  {debtProgress.toFixed(1)}%
                </p>
              </div>
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-success rounded-full transition-all duration-500"
                  style={{ width: `${debtProgress}%` }}
                />
              </div>
              <div className="flex justify-between text-xs font-medium">
                <span className="text-success">Paid: ${debtPaid.toFixed(2)}</span>
                <span className="text-danger">Remaining: ${remainingDebt.toFixed(2)}</span>
              </div>
            </div>
          )}

          {/* Expenses Summary */}
          <div className="bg-white rounded-xl p-5 shadow-card">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2">
              📊 Expenses This Month
            </p>
            {expenses.length === 0 ? (
              <p className="text-[13px] text-gray-300">No expenses recorded yet.</p>
            ) : (
              Object.entries(
                expenses.reduce((acc, e) => {
                  acc[e.category] = (acc[e.category] || 0) + e.amount
                  return acc
                }, {})
              ).map(([category, amount]) => (
                <div
                  key={category}
                  className="flex justify-between items-center pb-2 mb-2 border-b border-gray-100 last:border-0 last:mb-0 last:pb-0"
                >
                  <span className="text-sm text-gray-600">{category}</span>
                  <span className="text-sm font-semibold text-gray-900">
                    ${amount.toFixed(2)}
                  </span>
                </div>
              ))
            )}
          </div>

        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-4">

          {/* Goal */}
          <div className="bg-white rounded-xl p-5 shadow-card">
            <div className="flex justify-between items-center mb-1.5">
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
                Your Goal
              </p>
              <button
                onClick={() => setEditingGoal(true)}
                className="text-xs px-2.5 py-1 border border-gray-300 rounded-lg text-primary hover:bg-primary-light transition-colors"
              >
                ✏️ Change
              </button>
            </div>
            <p className="text-sm font-medium text-gray-900">🎯 {profile.goal}</p>
            {profile.dependents > 0 && (
              <p className="text-[13px] text-gray-400 mt-1.5">
                👨‍👩‍👧 {profile.dependents} dependent(s)
              </p>
            )}
          </div>

          {/* Daily Tip */}
          <div className="bg-primary-light rounded-xl p-5 shadow-card">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2">
              💡 Daily Tip
            </p>
            {loadingTip ? (
              <div className="flex gap-1.5 items-center py-1">
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce2" />
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce2 [animation-delay:0.2s]" />
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce2 [animation-delay:0.4s]" />
              </div>
            ) : (
              <p className="text-sm text-primary leading-relaxed">{dailyTip}</p>
            )}
          </div>

        </div>
      </div>

      {/* Goal Edit Modal */}
      {editingGoal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-[380px] shadow-modal">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">
              Change your goal
            </h2>
            <p className="text-[13px] text-gray-400 mb-5">
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
                onClick={() => setSelectedGoal(option)}
                className={`
                  block w-full text-left p-3 mb-2 text-sm rounded-lg border transition-colors
                  ${selectedGoal === option
                    ? 'bg-primary-light border-primary text-primary font-medium'
                    : 'bg-gray-50 border-gray-200 text-gray-900 hover:border-primary'
                  }
                `}
              >
                {option}
              </button>
            ))}

            {selectedGoal === 'Get out of debt' && (
              <div className="mt-4">
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wide mb-1.5">
                  Add new debt amount ($) — will be added to your current debt
                </label>
                <input
                  type="number"
                  placeholder="Ex: 5000"
                  value={newDebt}
                  onChange={e => setNewDebt(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-300 outline-none focus:border-primary mb-4"
                />
              </div>
            )}

            <button
              onClick={handleGoalSave}
              disabled={!selectedGoal}
              className={`
                block w-full py-3 mb-2 text-sm font-medium rounded-lg transition-colors
                ${selectedGoal
                  ? 'bg-primary text-white hover:bg-primary-dark cursor-pointer'
                  : 'bg-gray-300 text-white cursor-not-allowed'
                }
              `}
            >
              Confirm
            </button>

            <button
              onClick={() => {
                setEditingGoal(false)
                setSelectedGoal('')
                setNewDebt('')
              }}
              className="block w-full py-3 text-sm text-gray-400 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

    </div>
  )
}