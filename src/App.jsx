import { BrowserRouter, Routes, Route } from 'react-router-dom'
import OnBoarding from './pages/onBoarding.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Expenses from './pages/Expenses.jsx'
import Chat from './pages/Chat.jsx'
import Investing from './pages/investing.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<OnBoarding />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/investing" element={<Investing />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App