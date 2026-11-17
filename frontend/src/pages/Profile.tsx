import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { User, Mail, Hash, LogOut, ShieldAlert } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const Profile: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-cf-text-primary">My Profile</h1>
        <p className="text-cf-text-secondary mt-1">Manage your account settings and preferences.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-cf-border overflow-hidden">
        <div className="p-8 border-b border-cf-border flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 bg-cf-green rounded-full flex items-center justify-center text-4xl text-white font-bold shrink-0">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div className="text-center md:text-left flex-1">
            <h2 className="text-2xl font-bold text-cf-text-primary">{user?.name}</h2>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-2 text-cf-text-secondary">
              <span className="flex items-center"><Mail className="w-4 h-4 mr-1"/> {user?.email}</span>
              {user?.student_id && <span className="flex items-center"><Hash className="w-4 h-4 mr-1"/> {user?.student_id}</span>}
              <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs font-medium uppercase">{user?.role}</span>
            </div>
          </div>
        </div>
        
        <div className="p-8 space-y-6">
          <h3 className="text-lg font-semibold text-cf-text-primary border-b border-cf-border pb-2">Account Details</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-800">{user?.name}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Email Address (Read-only)</label>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-500">{user?.email}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Student ID</label>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-800">{user?.student_id || 'Not provided'}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Account Created</label>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-800">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 bg-gray-50 border-t border-cf-border space-y-4">
          <h3 className="text-lg font-semibold text-red-600 flex items-center">
            <ShieldAlert className="w-5 h-5 mr-2" /> Danger Zone
          </h3>
          <p className="text-sm text-gray-600">Once you delete your account, there is no going back. Please be certain.</p>
          <div className="flex gap-4">
            <Button variant="danger">Deactivate Account</Button>
            <Button variant="secondary" onClick={logout} leftIcon={<LogOut className="w-4 h-4" />}>Log Out</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
