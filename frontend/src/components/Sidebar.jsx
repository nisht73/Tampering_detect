import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Shield,
  LayoutDashboard,
  PlusCircle,
  History,
  User,
  Users,
  FileText,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Sidebar({ className, onNavClick }) {
  const { user, logout } = useAuth();

  const navLinkClass = ({ isActive }) =>
    cn(
      'flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
      isActive
        ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    );

  return (
    <aside
      className={cn(
        'w-64 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col h-full z-20',
        className
      )}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-100">
        <div className="p-1.5 bg-blue-600 rounded-lg text-white mr-3 shadow-sm">
          <Shield className="h-5 w-5" />
        </div>
        <div>
          <span className="text-slate-900 font-bold text-lg tracking-tight">DocScreen</span>
          <span className="text-[10px] font-semibold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded ml-2">AI</span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Main Navigation
        </div>

        <NavLink to="/dashboard" className={navLinkClass} onClick={onNavClick}>
          <LayoutDashboard className="h-4 w-4 mr-3 text-slate-500" />
          Dashboard
        </NavLink>

        <NavLink to="/screening/new" className={navLinkClass} onClick={onNavClick}>
          <PlusCircle className="h-4 w-4 mr-3 text-slate-500" />
          New Screening
        </NavLink>

        <NavLink to="/screenings" className={navLinkClass} onClick={onNavClick}>
          <History className="h-4 w-4 mr-3 text-slate-500" />
          Screening History
        </NavLink>

        <NavLink to="/profile" className={navLinkClass} onClick={onNavClick}>
          <User className="h-4 w-4 mr-3 text-slate-500" />
          Profile
        </NavLink>

        {/* Admin Navigation Section */}
        {user?.role === 'ADMIN' && (
          <>
            <div className="my-4 border-t border-slate-100" />
            <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Administration
            </div>
            <NavLink to="/admin/users" className={navLinkClass} onClick={onNavClick}>
              <Users className="h-4 w-4 mr-3 text-slate-500" />
              User Management
            </NavLink>
            <NavLink to="/admin/audit-logs" className={navLinkClass} onClick={onNavClick}>
              <FileText className="h-4 w-4 mr-3 text-slate-500" />
              Audit Logs
            </NavLink>
          </>
        )}
      </div>

      {/* Footer / User Profile Brief */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 truncate">
            <div className="h-9 w-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold text-slate-800 truncate">{user?.name}</p>
              <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
