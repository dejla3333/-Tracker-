import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';

export const Layout = ({ children }) => {
  const location = useLocation();
  const { settings, toggleDirection } = useApp();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/goals', label: 'Goals', icon: '🎯' },
    { path: '/completed', label: 'Completed', icon: '✅' },
    { path: '/statistics', label: 'Statistics', icon: '📈' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-primary-600">Goal Tracker</h1>
            <button
              onClick={toggleDirection}
              className="btn btn-secondary text-sm"
              title="Toggle Direction"
            >
              {settings.direction === 'ltr' ? 'RTL' : 'LTR'}
            </button>
          </div>
        </div>
      </header>

      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors whitespace-nowrap ${
                  location.pathname === item.path
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-gray-500 text-sm">
            Goal Tracker 
          </p>
        </div>
      </footer>
    </div>
  );
};
