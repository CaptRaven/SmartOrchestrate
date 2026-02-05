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
    <aside className="w-64 bg-white shadow-md flex-shrink-0 flex flex-col h-screen fixed left-0 top-0 z-50">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center shadow-lg">
            <LayoutDashboard className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-tight">SmartOrchestrate</h1>
            <p className="text-xs text-gray-500 font-medium">Factory OS v2.0</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">Menu</div>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                isActive
                  ? 'bg-blue-50 text-blue-700 font-medium shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}

        <div className="mt-8 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">System</div>
        <Link
          to="/notifications"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
            location.pathname === '/notifications'
              ? 'bg-blue-50 text-blue-700 font-medium shadow-sm'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <div className="relative">
            <Bell className={`w-5 h-5 transition-colors ${location.pathname === '/notifications' ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white" />
            )}
          </div>
          <span className="flex-1">Notifications</span>
          {unreadCount > 0 && (
            <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </Link>
      </nav>

      <div className="p-4 border-t border-gray-100 bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">
            JD
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-gray-900 truncate">John Doe</p>
            <p className="text-xs text-gray-500 truncate">Plant Manager</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
