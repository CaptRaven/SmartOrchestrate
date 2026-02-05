import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { AppProvider } from './contexts/AppContext';
import Navigation from './components/Navigation';

const Dashboard = lazy(() => import('./components/Dashboard'));
const AIAssistant = lazy(() => import('./components/AIAssistant'));
const Maintenance = lazy(() => import('./components/Maintenance'));
const Optimization = lazy(() => import('./components/Optimization'));
const Sustainability = lazy(() => import('./components/Sustainability'));
const Notifications = lazy(() => import('./components/Notifications'));

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <div className="min-h-screen bg-gray-50 flex">
          <Navigation />
          <main className="flex-1 ml-64 p-8 overflow-y-auto">
            <Suspense fallback={<div className="flex items-center justify-center h-full text-gray-500">Loading...</div>}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/ai" element={<AIAssistant />} />
                <Route path="/maintenance" element={<Maintenance />} />
                <Route path="/optimization" element={<Optimization />} />
                <Route path="/sustainability" element={<Sustainability />} />
                <Route path="/notifications" element={<Notifications />} />
              </Routes>
            </Suspense>
          </main>
        </div>
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
