import { BrowserRouter, Routes, Route } from 'react-router-dom';
import OnBoarding from './pages/onBoarding.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<OnBoarding />} />
        <Route path="/dashboard" element={<h1>Dashboard em breve</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;