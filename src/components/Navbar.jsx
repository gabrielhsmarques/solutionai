import { useNavigate, useLocation } from 'react-router-dom'
import { useFinance } from '../context/FinanceContext'

const navItems = [
  { icon: '📊', label: 'Dashboard', path: '/dashboard' },
  { icon: '💸', label: 'Expenses', path: '/expenses' },
  { icon: '💰', label: 'Income', path: '/income' },
  { icon: '🤖', label: 'AI Educator', path: '/chat' },
  { icon: '📈', label: 'Investing', path: '/investing' }
]

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { profile } = useFinance()

  function handleReset() {
    localStorage.clear()
    navigate('/')
  }

  return (
    <nav className="
      fixed top-0 left-0 h-screen w-[220px] z-50
      bg-white border-r border-gray-100
      flex flex-col p-4
      max-md:w-full max-md:h-[60px] max-md:top-auto max-md:bottom-0
      max-md:flex-row max-md:items-center max-md:border-r-0 max-md:border-t
    ">

      {/* Logo — hidden on mobile */}
      <div className="text-[15px] font-bold text-primary mb-8 px-2 leading-tight max-md:hidden">
        Financial Educator
        <span className="block text-[11px] font-normal text-gray-400 mt-0.5">
          AI-powered assistant
        </span>
      </div>

      {/* Navigation links */}
      <div className="flex flex-col gap-1 flex-1 max-md:flex-row max-md:justify-around max-md:gap-0">
        {navItems.map(item => {
          const isActive = location.pathname === item.path
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`
                flex items-center gap-2.5 px-3 py-2.5 rounded-lg
                text-sm font-medium text-left w-full transition-all
                max-md:flex-col max-md:items-center max-md:gap-0.5 max-md:px-2 max-md:py-1.5 max-md:text-[10px] max-md:w-auto
                ${isActive
                  ? 'bg-primary-light text-primary font-semibold'
                  : 'text-gray-600 hover:bg-primary-light hover:text-primary'
                }
              `}
            >
              <span className="text-lg w-[22px] text-center max-md:text-xl">
                {item.icon}
              </span>
              {item.label}
            </button>
          )
        })}
      </div>

      {/* Footer — hidden on mobile */}
      <div className="border-t border-gray-100 pt-4 mt-4 max-md:hidden">
        {profile && (
          <p className="text-[13px] font-medium text-gray-600 px-2 mb-2">
            👤 {profile.name}
          </p>
        )}
        <button
          onClick={handleReset}
          className="
            flex items-center gap-2 px-3 py-2 rounded-lg
            text-[13px] text-danger w-full text-left
            hover:bg-danger-light transition-all
          "
        >
          🚪 Reset profile
        </button>
      </div>

    </nav>
  )
}