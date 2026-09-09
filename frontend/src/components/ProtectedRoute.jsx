import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loading from './Loading';
import { toast } from 'sonner';

export default function ProtectedRoute({ roles = [] }) {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return <Loading fullPage text="Verifying session..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles.length > 0 && !roles.includes(user?.role)) {
    toast.error('Unauthorized access');
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
