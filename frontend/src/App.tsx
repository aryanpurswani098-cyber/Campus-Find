import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from './components/ui/Toast';
import { useAuthStore } from './store/authStore';

// Layouts & Guards
import { AppLayout } from './components/layout/AppLayout';
import { useAuth } from './hooks/useAuth';

// Pages
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { LostItems } from './pages/LostItems';
import { FoundItems } from './pages/FoundItems';
import { ReportLost } from './pages/ReportLost';
import { ReportFound } from './pages/ReportFound';
import { ItemDetail } from './pages/ItemDetail';
import { Matches } from './pages/Matches';
import { MyItems } from './pages/MyItems';
import { Notifications } from './pages/Notifications';
import { Profile } from './pages/Profile';
import { MapView } from './pages/MapView';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminReports } from './pages/admin/AdminReports';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminClaims } from './pages/admin/AdminClaims';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};

const AppRoutes = () => {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected App Routes */}
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/items/lost" element={<LostItems />} />
        <Route path="/items/found" element={<FoundItems />} />
        <Route path="/items/:id" element={<ItemDetail />} />
        <Route path="/report/lost" element={<ReportLost />} />
        <Route path="/report/found" element={<ReportFound />} />
        <Route path="/matches" element={<Matches />} />
        <Route path="/my-items" element={<MyItems />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/map" element={<MapView />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/reports" element={<AdminRoute><AdminReports /></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
        <Route path="/admin/claims" element={<AdminRoute><AdminClaims /></AdminRoute>} />
      </Route>
    </Routes>
  );
};

import { CursorOrb } from './components/ui/CursorOrb';

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes />
        <Toaster />
        <CursorOrb />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
