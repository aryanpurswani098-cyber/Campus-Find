import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuth';
import { itemsApi } from '../api/items';
import { matchesApi } from '../api/matches';
import { notificationsApi } from '../api/notifications';
import { StatCard } from '../components/features/StatCard';
import { MatchCard } from '../components/features/MatchCard';
import { NotificationItem } from '../components/features/NotificationItem';
import { SkeletonGrid } from '../components/ui/LoadingSkeleton';
import { Search, Shield, Bell, Archive, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const { data: myItems, isLoading: itemsLoading } = useQuery({
    queryKey: ['myItems'],
    queryFn: () => itemsApi.getMyItems()
  });

  const { data: myMatches, isLoading: matchesLoading } = useQuery({
    queryKey: ['myMatches', 'pending'],
    queryFn: () => matchesApi.getMyMatches('pending')
  });

  const { data: notifications, isLoading: notifsLoading } = useQuery({
    queryKey: ['notifications', 'recent'],
    queryFn: () => notificationsApi.getNotifications({ per_page: 5 })
  });

  const lostCount = myItems?.filter(i => i.item_type === 'lost').length || 0;
  const foundCount = myItems?.filter(i => i.item_type === 'found').length || 0;
  const matchCount = myMatches?.length || 0;
  const unreadNotifs = notifications?.filter(n => !n.is_read).length || 0;

  if (itemsLoading || matchesLoading || notifsLoading) {
    return (
      <div className="space-y-8">
        <div>
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse" />
        </div>
        <SkeletonGrid count={4} type="stat" />
        <SkeletonGrid count={3} type="list" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-cf-text-primary">
          Good Morning, {user?.name.split(' ')[0]}! 👋
        </h1>
        <p className="text-cf-text-secondary mt-1">
          Here's what's happening on campus today.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="My Lost Items" value={lostCount} icon={Archive} color="text-red-500" />
        <StatCard label="My Found Items" value={foundCount} icon={Search} color="text-cf-green" />
        <StatCard label="Potential Matches" value={matchCount} icon={Shield} color="text-purple-500" />
        <StatCard label="New Notifications" value={unreadNotifs} icon={Bell} color="text-blue-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-cf-text-primary">Recent Matches</h2>
            <Link to="/matches" className="text-sm font-medium text-cf-green hover:underline">View All</Link>
          </div>
          {myMatches && myMatches.length > 0 ? (
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
              }}
              className="space-y-4"
            >
              {myMatches.slice(0, 3).map(match => (
                <MatchCard key={match.id} match={match} />
              ))}
            </motion.div>
          ) : (
            <div className="bg-white p-8 rounded-xl border border-cf-border text-center text-cf-text-secondary">
              No pending matches at the moment.
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-cf-text-primary">Recent Activity</h2>
            <Link to="/notifications" className="text-sm font-medium text-cf-green hover:underline">View All</Link>
          </div>
          <div className="bg-white rounded-xl border border-cf-border overflow-hidden">
            {notifications && notifications.length > 0 ? (
              notifications.map(notif => (
                <NotificationItem key={notif.id} notification={notif} />
              ))
            ) : (
              <div className="p-6 text-center text-cf-text-secondary">
                No recent activity.
              </div>
            )}
          </div>

          <div className="pt-4 space-y-3">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Quick Actions</h3>
            <Link to="/report/lost" className="flex items-center p-3 bg-white border border-cf-border rounded-lg hover:border-cf-green hover:shadow-sm transition-all group">
              <PlusCircle className="w-5 h-5 text-red-500 mr-3 group-hover:scale-110 transition-transform" />
              <span className="font-medium text-cf-text-primary">Report Lost Item</span>
            </Link>
            <Link to="/report/found" className="flex items-center p-3 bg-white border border-cf-border rounded-lg hover:border-cf-green hover:shadow-sm transition-all group">
              <PlusCircle className="w-5 h-5 text-cf-green mr-3 group-hover:scale-110 transition-transform" />
              <span className="font-medium text-cf-text-primary">Report Found Item</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
