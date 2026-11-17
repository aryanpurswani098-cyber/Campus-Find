import React from 'react';
import { Notification } from '../../types';
import { formatDistanceToNow } from 'date-fns';
import { Bell, AlertCircle, CheckCircle, Search } from 'lucide-react';

interface NotificationItemProps {
  notification: Notification;
  onRead?: (id: string) => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onRead }) => {
  
  const getIcon = () => {
    switch(notification.notification_type) {
      case 'match': return <AlertCircle className="w-5 h-5 text-purple-500" />;
      case 'claim': return <Search className="w-5 h-5 text-blue-500" />;
      case 'verification': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'recovery': return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      default: return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div 
      className={`p-4 flex gap-4 cursor-pointer transition-colors hover:bg-gray-50 border-b border-cf-border last:border-0 ${!notification.is_read ? 'bg-blue-50/30' : 'bg-white'}`}
      onClick={() => {
        if (!notification.is_read && onRead) onRead(notification.id);
      }}
    >
      <div className="shrink-0 mt-1">
        {getIcon()}
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start mb-1">
          <h4 className={`text-sm ${!notification.is_read ? 'font-semibold' : 'font-medium'} text-cf-text-primary`}>
            {notification.title}
          </h4>
          <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
            {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
          </span>
        </div>
        <p className={`text-sm ${!notification.is_read ? 'text-gray-800' : 'text-gray-600'}`}>
          {notification.message}
        </p>
      </div>
      {!notification.is_read && (
        <div className="shrink-0 flex items-center">
          <div className="w-2 h-2 rounded-full bg-cf-green" />
        </div>
      )}
    </div>
  );
};
