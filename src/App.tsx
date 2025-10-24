import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import AIAssistant from './components/AIAssistant';
import Maintenance from './components/Maintenance';
import Optimization from './components/Optimization';
import Sustainability from './components/Sustainability';
import Notifications from './components/Notifications';

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <main className="max-w-7xl mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/ai" element={<AIAssistant />} />
              <Route path="/maintenance" element={<Maintenance />} />
              <Route path="/optimization" element={<Optimization />} />
              <Route path="/sustainability" element={<Sustainability />} />
              <Route path="/notifications" element={<Notifications />} />
            </Routes>
          </main>
        </div>
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
