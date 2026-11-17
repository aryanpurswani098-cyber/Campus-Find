import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { 
  MapPin, LayoutDashboard, Search, Eye, PlusCircle, 
  Archive, Bell, User, Settings, Shield, LogOut 
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { notificationsApi } from '../../api/notifications';

interface SidebarProps {
  onMobileClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onMobileClose }) => {
  const { user, isAdmin, logout } = useAuth();
  
  const { data: unreadData } = useQuery({
    queryKey: ['notifications', 'unread'],
    queryFn: notificationsApi.getUnreadCount,
    refetchInterval: 30000
  });

  const mainLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/items/lost', icon: Search, label: 'Lost Items' },
    { to: '/items/found', icon: Eye, label: 'Found Items' },
    { to: '/report/lost', icon: PlusCircle, label: 'Report Lost' },
    { to: '/report/found', icon: PlusCircle, label: 'Report Found' },
    { to: '/my-items', icon: Archive, label: 'My Items' },
    { to: '/matches', icon: Shield, label: 'Matches' },
    { to: '/notifications', icon: Bell, label: 'Notifications', badge: unreadData?.count },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  const adminLinks = [
    { to: '/admin', icon: LayoutDashboard, label: 'Admin Dashboard' },
    { to: '/admin/reports', icon: Archive, label: 'Reports' },
    { to: '/admin/users', icon: User, label: 'Users' },
    { to: '/admin/claims', icon: Shield, label: 'Claims' },
  ];

  const NavItem = ({ to, icon: Icon, label, badge }: any) => (
    <NavLink
      to={to}
      onClick={onMobileClose}
      className={({ isActive }) => 
        `flex items-center px-4 py-3 mx-2 rounded-lg transition-colors group relative ${
          isActive 
            ? 'bg-white/10 text-white font-medium' 
            : 'text-gray-400 hover:bg-white/5 hover:text-white'
        }`
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.div 
              layoutId="sidebar-indicator"
              className="absolute left-0 top-2 bottom-2 w-1 bg-cf-green rounded-r-md"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          <Icon className="w-5 h-5 mr-3 z-10" />
          <span className="flex-1 z-10">{label}</span>
          {badge > 0 && (
            <span className="bg-cf-green text-white text-xs font-bold px-2 py-0.5 rounded-full z-10">
              {badge > 99 ? '99+' : badge}
            </span>
          )}
        </>
      )}
    </NavLink>
  );

  return (
    <div className="flex flex-col h-full bg-[#111318] text-white">
      <div className="p-6 flex items-center">
        <MapPin className="w-8 h-8 text-cf-green mr-2" />
        <span className="text-xl font-bold tracking-tight">CampusFind</span>
      </div>

      <div className="flex-1 overflow-y-auto py-4 space-y-1">
        <div className="px-6 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Main Menu
        </div>
        {mainLinks.map((link) => (
          <NavItem key={link.to} {...link} />
        ))}

        {isAdmin && (
          <>
            <div className="px-6 mt-8 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Admin
            </div>
            {adminLinks.map((link) => (
              <NavItem key={link.to} {...link} />
            ))}
          </>
        )}
      </div>

      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center p-2">
          <div className="w-10 h-10 rounded-full bg-cf-green flex items-center justify-center text-white font-bold shrink-0">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div className="ml-3 flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <p className="text-xs text-gray-400 truncate">{user?.role}</p>
          </div>
          <button 
            onClick={logout}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
