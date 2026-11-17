import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../../api/admin';
import { Badge } from '../../components/ui/Badge';
import { Shield, ShieldCheck, User as UserIcon } from 'lucide-react';

export const AdminUsers: React.FC = () => {
  const { data: users, isLoading } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: adminApi.getAdminUsers
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-cf-text-primary">Manage Users</h1>
        <p className="text-cf-text-secondary mt-1">View and manage platform users.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-cf-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-cf-border text-xs uppercase tracking-wider text-gray-500 font-semibold">
                <th className="p-4">User</th>
                <th className="p-4">Role</th>
                <th className="p-4">Student ID</th>
                <th className="p-4">Joined</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cf-border text-sm">
              {isLoading ? (
                <tr><td colSpan={5} className="p-8 text-center text-gray-500">Loading...</td></tr>
              ) : (
                users?.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-cf-green/10 text-cf-green flex items-center justify-center shrink-0">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-cf-text-primary">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center text-xs font-medium uppercase text-gray-600">
                        {user.role === 'admin' ? <ShieldAlertIcon /> : <UserIcon className="w-4 h-4 mr-1" />}
                        {user.role}
                      </div>
                    </td>
                    <td className="p-4 text-gray-700">{user.student_id || '-'}</td>
                    <td className="p-4 text-gray-500">{new Date(user.created_at).toLocaleDateString()}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${user.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const ShieldAlertIcon = () => <ShieldCheck className="w-4 h-4 mr-1 text-purple-600" />;
