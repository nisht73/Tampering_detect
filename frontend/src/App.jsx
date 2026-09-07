import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import NewScreening from './pages/NewScreening';
import ScreeningDetails from './pages/ScreeningDetails';
import ScreeningHistory from './pages/ScreeningHistory';
import Profile from './pages/Profile';
import UserManagement from './pages/admin/UserManagement';
import AuditLogs from './pages/admin/AuditLogs';

const App = () => {
  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="screening/new" element={<NewScreening />} />
            <Route path="screening/:id" element={<ScreeningDetails />} />
            <Route path="screenings" element={<ScreeningHistory />} />
            <Route path="profile" element={<Profile />} />
            
            {/* Admin Routes */}
            <Route element={<ProtectedRoute roles={['ADMIN']} />}>
              <Route path="admin/users" element={<UserManagement />} />
              <Route path="admin/audit-logs" element={<AuditLogs />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </>
  );
};

export default App;