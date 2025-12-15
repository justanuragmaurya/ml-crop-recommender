import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ModelsPage from './pages/ModelsPage';
import MetricsPage from './pages/MetricsPage';

function Navigation() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
      isActive
        ? 'bg-green-100 text-green-700'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
    }`;

  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <NavLink to="/" className="flex items-center gap-2 text-xl font-bold text-green-700">
            <span className="text-2xl">🌱</span>
            <span className="hidden sm:inline">Crop Guidance</span>
          </NavLink>
          <div className="flex items-center gap-2">
            <NavLink to="/" className={linkClass}>
              <span className="flex items-center gap-1.5">
                <span className="hidden sm:inline">🔍</span> Predict
              </span>
            </NavLink>
            <NavLink to="/models" className={linkClass}>
              <span className="flex items-center gap-1.5">
                <span className="hidden sm:inline">🤖</span> Models
              </span>
            </NavLink>
            <NavLink to="/metrics" className={linkClass}>
              <span className="flex items-center gap-1.5">
                <span className="hidden sm:inline">📈</span> Metrics
              </span>
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="mt-12 py-6 border-t border-gray-200 text-center text-gray-500 text-sm">
      <p>Crop Guidance System • Powered by Stacked Ensemble ML</p>
    </footer>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 py-8 px-4">
          <div className="max-w-4xl mx-auto">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/models" element={<ModelsPage />} />
              <Route path="/metrics" element={<MetricsPage />} />
            </Routes>
          </div>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
