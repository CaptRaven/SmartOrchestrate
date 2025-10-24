import { LayoutDashboard, Bot, Wrench, TrendingUp, Leaf, Bell } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';

export default function Navigation() {
  const location = useLocation();
  const { notifications } = useApp();

  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/ai', icon: Bot, label: 'AI Assistant' },
    { path: '/maintenance', icon: Wrench, label: 'Maintenance' },
    { path: '/optimization', icon: TrendingUp, label: 'Optimize' },
    { path: '/sustainability', icon: Leaf, label: 'Sustainability' }
  ];

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">SmartOrchestrator</h1>
              <p className="text-xs text-gray-500">AI Factory Assistant</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}

            <Link
              to="/notifications"
              className={`relative flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                location.pathname === '/notifications'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
