import React from 'react';
import { X, CheckCircle, AlertTriangle, Info, XCircle } from 'lucide-react';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  icon?: React.ReactNode;
  duration?: number;
}

interface NotificationProps {
  notification: Notification;
  onDismiss: (id: string) => void;
}

interface NotificationsContainerProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
}

const NotificationItem: React.FC<NotificationProps> = ({ notification, onDismiss }) => {
  const getIcon = () => {
    if (notification.icon) return notification.icon;
    
    switch (notification.type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-600" />;
      default:
        return <Info className="h-5 w-5 text-gray-600" />;
    }
  };

  const getBackgroundColor = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  React.useEffect(() => {
    if (notification.duration) {
      const timer = setTimeout(() => {
        onDismiss(notification.id);
      }, notification.duration);

      return () => clearTimeout(timer);
    }
  }, [notification.duration, notification.id, onDismiss]);

  return (
    <div className={`border rounded-lg p-4 shadow-lg ${getBackgroundColor()} animate-in slide-in-from-top-2 duration-300`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {getIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm text-gray-900">
            {notification.title}
          </h4>
          <p className="text-sm text-gray-700 mt-1">
            {notification.message}
          </p>
        </div>
        
        <button
          onClick={() => onDismiss(notification.id)}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export const NotificationsContainer: React.FC<NotificationsContainerProps> = ({ 
  notifications, 
  onDismiss 
}) => {
  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onDismiss={onDismiss}
        />
      ))}
    </div>
  );
};

export default NotificationsContainer;

