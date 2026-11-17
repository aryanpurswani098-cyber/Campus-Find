import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsApi } from '../api/notifications';
import { NotificationItem } from '../components/features/NotificationItem';
import { EmptyState } from '../components/ui/EmptyState';
import { SkeletonGrid } from '../components/ui/LoadingSkeleton';
import { Button } from '../components/ui/Button';
import { Bell, CheckCheck } from 'lucide-react';
import { showToast } from '../components/ui/Toast';

export const Notifications: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications', 'all'],
    queryFn: () => notificationsApi.getNotifications()
  });

  const markReadMutation = useMutation({
    mutationFn: notificationsApi.markRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  const markAllReadMutation = useMutation({
    mutationFn: notificationsApi.markAllRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      showToast.success('All marked as read');
    }
  });

  const hasUnread = notifications?.some(n => !n.is_read);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-cf-text-primary">Notifications</h1>
          <p className="text-cf-text-secondary mt-1">Stay updated on matches, claims, and system alerts.</p>
        </div>
        {hasUnread && (
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => markAllReadMutation.mutate()} 
            loading={markAllReadMutation.isPending}
            leftIcon={<CheckCheck className="w-4 h-4" />}
          >
            Mark all read
          </Button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-cf-border overflow-hidden min-h-[400px]">
        {isLoading ? (
          <SkeletonGrid count={5} type="list" />
        ) : notifications && notifications.length > 0 ? (
          <div className="divide-y divide-cf-border">
            {notifications.map(notif => (
              <NotificationItem 
                key={notif.id} 
                notification={notif} 
                onRead={(id) => markReadMutation.mutate(id)} 
              />
            ))}
          </div>
        ) : (
          <EmptyState 
            icon={Bell} 
            title="All caught up!" 
            description="You don't have any notifications right now."
          />
        )}
      </div>
    </div>
  );
};
