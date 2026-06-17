import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<h1>OnBoarding em breve</h1>} />
        <Route path="/dashboard" element={<h1>Dashboard em breve</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;