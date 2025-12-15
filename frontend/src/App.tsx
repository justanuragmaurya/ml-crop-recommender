import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ModelsPage from './pages/ModelsPage';
import MetricsPage from './pages/MetricsPage';

function Navigation() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 ${
      isActive
        ? 'bg-green-100 text-green-800 shadow-sm ring-1 ring-green-200'
        : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
    }`;

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-stone-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <NavLink to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform duration-200 shadow-sm border border-green-200">
              🌱
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-stone-800 leading-none">Crop</span>
              <span className="text-xs font-medium text-green-700 tracking-wider uppercase">Guidance</span>
            </div>
          </NavLink>
          
          <div className="flex items-center gap-1 sm:gap-2">
            <NavLink to="/" className={linkClass}>
              <span>🔍</span>
              <span className="hidden sm:inline">Predict</span>
            </NavLink>
            <NavLink to="/models" className={linkClass}>
              <span>🤖</span>
              <span className="hidden sm:inline">Models</span>
            </NavLink>
            <NavLink to="/metrics" className={linkClass}>
              <span>📈</span>
              <span className="hidden sm:inline">Metrics</span>
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="mt-16 py-8 border-t border-stone-200 bg-stone-50/50">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <p className="text-stone-500 text-sm font-medium">
          Crop Guidance System &bull; Precision Agriculture
        </p>
        <p className="text-stone-400 text-xs mt-2">
          Powered by Stacked Ensemble Machine Learning
        </p>
      </div>
    </footer>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col font-sans">
        <Navigation />
        <main className="flex-1 py-10 px-4 sm:px-6">
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
