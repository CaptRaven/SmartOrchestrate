import { Bell, CheckCircle, AlertTriangle, Info, X } from 'lucide-react';
import { Notification } from '../lib/supabase';
import { useApp } from '../contexts/AppContext';

export default function Notifications() {
  const { notifications, markNotificationRead, loading } = useApp();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading notifications...</div>
      </div>
    );
  }

  const unreadNotifications = notifications.filter(n => !n.read);
  const readNotifications = notifications.filter(n => n.read);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
        <p className="text-gray-600 mt-1">Stay updated with AI actions and system alerts</p>
      </div>

      {unreadNotifications.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Unread ({unreadNotifications.length})</h2>
          <div className="space-y-3">
            {unreadNotifications.map(notification => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onMarkRead={() => markNotificationRead(notification.id)}
              />
            ))}
          </div>
        </div>
      )}

      {readNotifications.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Read</h2>
          <div className="space-y-3 opacity-60">
            {readNotifications.map(notification => (
              <NotificationCard
                key={notification.id}
                notification={notification}
              />
            ))}
          </div>
        </div>
      )}

      {notifications.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No notifications yet</h3>
          <p className="text-gray-600">You will receive updates about AI actions and system alerts here.</p>
        </div>
      )}
    </div>
  );
}

function NotificationCard({ notification, onMarkRead }: {
  notification: Notification;
  onMarkRead?: () => void;
}) {
  const typeConfig = {
    info: {
      icon: Info,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      borderColor: 'border-blue-500'
    },
    success: {
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      borderColor: 'border-green-500'
    },
    warning: {
      icon: AlertTriangle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      borderColor: 'border-yellow-500'
    },
    error: {
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      borderColor: 'border-red-500'
    }
  };

  const config = typeConfig[notification.type];
  const Icon = config.icon;

  return (
    <div className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${config.borderColor} ${
      !notification.read ? 'ring-2 ring-blue-200' : ''
    }`}>
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${config.bgColor} flex-shrink-0`}>
          <Icon className={`w-5 h-5 ${config.color}`} />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{notification.title}</h3>
          <p className="text-gray-600 text-sm mb-2">{notification.message}</p>
          <p className="text-xs text-gray-500">
            {new Date(notification.created_at).toLocaleString()}
          </p>
        </div>
        {!notification.read && (
          <button
            onClick={() => onMarkRead && onMarkRead()}
            className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 transition-colors"
            title="Mark as read"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
