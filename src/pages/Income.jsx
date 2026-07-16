import IncomeForm from '../components/IncomeForm'
import IncomeList from '../components/IncomeList'

export default function Income() {
  return (
    <div className="w-full">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Income & Payments</h1>

      <div className="grid grid-cols-2 gap-6 items-start max-md:grid-cols-1">
        <div>
          <IncomeForm />
        </div>
        <div>
          <IncomeList />
        </div>
      </div>
    </div>
  )
}