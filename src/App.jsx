import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import MarketComparison from './pages/MarketComparison';
import Commodities from './pages/Commodities';
import Admin from './pages/Admin';

function App() {
  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 overflow-y-auto">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/compare" element={<MarketComparison />} />
          <Route path="/commodities" element={<Commodities />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
