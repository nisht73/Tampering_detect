import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard';
    if (path === '/screening/new') return 'New Screening';
    if (path.startsWith('/screening/')) return 'Screening Details';
    if (path === '/screenings') return 'Screening History';
    if (path === '/profile') return 'User Profile';
    if (path === '/admin/users') return 'User Management';
    if (path === '/admin/audit-logs') return 'Audit Logs';
    return '';
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-10 flex-shrink-0">
      <div className="flex items-center">
        <button className="md:hidden mr-4 text-slate-500 hover:text-slate-700">
          <Menu className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-semibold text-slate-800">{getPageTitle()}</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="hidden sm:flex flex-col items-end">
          <span className="text-sm font-medium text-slate-900">{user?.name}</span>
          <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full font-medium">
            {user?.role || 'USER'}
          </span>
        </div>
        <button 
          onClick={logout}
          className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          title="Logout"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
