import ExpenseForm from '../components/ExpenseForm'
import ExpenseList from '../components/ExpenseList'

export default function Expenses() {
  return (
    <div className="w-full">
      <h1 className="text-2xl font-semibold text-text mb-6">My Expenses</h1>

      <div className="grid grid-cols-2 gap-6 items-start max-md:grid-cols-1">
        <div>
          <ExpenseForm />
        </div>
        <div>
          <ExpenseList />
        </div>
      </div>
    </div>
  )
}