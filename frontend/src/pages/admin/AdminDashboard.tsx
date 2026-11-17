import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../../api/admin';
import { StatCard } from '../../components/features/StatCard';
import { SkeletonGrid } from '../../components/ui/LoadingSkeleton';
import { Archive, Search, CheckCircle, Users, Activity, FileWarning, ShieldAlert } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['adminStats'],
    queryFn: adminApi.getStats
  });

  if (isLoading) return <div className="space-y-6"><SkeletonGrid count={4} type="stat" /><SkeletonGrid count={2} type="stat" /></div>;
  if (!stats) return null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-cf-text-primary">Admin Overview</h1>
        <p className="text-cf-text-secondary mt-1">Platform-wide statistics and metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Items" value={stats.total_items} icon={Archive} color="text-blue-500" />
        <StatCard label="Lost Items" value={stats.lost_items} icon={Search} color="text-red-500" />
        <StatCard label="Found Items" value={stats.found_items} icon={CheckCircle} color="text-cf-green" />
        <StatCard label="Recovered Items" value={stats.recovered_items} icon={Activity} color="text-emerald-500" />
        
        <StatCard label="Pending Reports (Verify)" value={stats.pending_reports} icon={FileWarning} color="text-amber-500" />
        <StatCard label="Pending Claims" value={stats.pending_claims} icon={ShieldAlert} color="text-purple-500" />
        <StatCard label="Active Users" value={stats.active_users} icon={Users} color="text-indigo-500" />
        <StatCard label="Recovery Rate" value={Math.round(stats.recovery_rate * 100)} icon={Activity} color="text-cf-green" trend="%" />
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl border border-cf-border shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <a href="/admin/reports" className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center">
                <FileWarning className="w-5 h-5 text-amber-500 mr-3" />
                <span className="font-medium">Verify Pending Reports</span>
              </div>
              <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-xs font-bold">{stats.pending_reports}</span>
            </a>
            <a href="/admin/claims" className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center">
                <ShieldAlert className="w-5 h-5 text-purple-500 mr-3" />
                <span className="font-medium">Review Claims</span>
              </div>
              <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-bold">{stats.pending_claims}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
