import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import Expenses from './pages/Expenses'
import Chat from './pages/Chat'
import Investing from './pages/Investing'
import Income from './pages/Income'
import Navbar from './components/Navbar'

// Wrapper that shows Navbar only outside onboarding
function AppLayout() {
  const location = useLocation()
  const showNavbar = location.pathname !== '/'

  return (
    <div className="app-layout">
      {showNavbar && <Navbar />}
      <div className={showNavbar ? 'page-content' : ''}>
        <Routes>
          <Route path="/" element={<Onboarding />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/investing" element={<Investing />} />
          <Route path="/income" element={<Income />} />
        </Routes>
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  )
}

export default App