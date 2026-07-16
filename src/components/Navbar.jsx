import { useNavigate, useLocation } from 'react-router-dom'
import { useFinance } from '../context/FinanceContext'

// Navigation items — icon, label and route for each page
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
    <nav className="navbar">

      {/* Logo */}
      <div className="navbar-logo">
        Financial Educator
        <span>AI-powered assistant</span>
      </div>

      {/* Navigation links */}
      <div className="navbar-nav">
        {navItems.map(item => (
          <button
            key={item.path}
            className={`navbar-link ${location.pathname === item.path ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <span className="navbar-icon">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>

      {/* Footer with user info and reset */}
      <div className="navbar-footer">
        {profile && (
          <p className="navbar-user">👤 {profile.name}</p>
        )}
        <button className="navbar-reset" onClick={handleReset}>
          🚪 Reset profile
        </button>
      </div>

    </nav>
  )
}