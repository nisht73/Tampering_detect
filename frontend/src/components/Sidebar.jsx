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
  FileText 
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();

  const navLinkClass = ({ isActive }) =>
    `flex items-center px-4 py-3 mx-2 my-1 rounded-md transition-colors ${
      isActive
        ? 'bg-indigo-600 text-white'
        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
    }`;

  return (
    <div className="w-64 flex-shrink-0 bg-slate-900 flex flex-col h-full border-r border-slate-800 hidden md:flex">
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <Shield className="h-8 w-8 text-indigo-500 mr-3" />
        <span className="text-white font-bold text-xl tracking-tight">DocScreen</span>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1">
          <NavLink to="/dashboard" className={navLinkClass}>
            <LayoutDashboard className="h-5 w-5 mr-3" />
            Dashboard
          </NavLink>
          <NavLink to="/screening/new" className={navLinkClass}>
            <PlusCircle className="h-5 w-5 mr-3" />
            New Screening
          </NavLink>
          <NavLink to="/screenings" className={navLinkClass}>
            <History className="h-5 w-5 mr-3" />
            Screening History
          </NavLink>
          <NavLink to="/profile" className={navLinkClass}>
            <User className="h-5 w-5 mr-3" />
            Profile
          </NavLink>
          
          {user?.role === 'ADMIN' && (
            <>
              <div className="my-4 border-t border-slate-800 mx-4"></div>
              <div className="px-6 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Admin
              </div>
              <NavLink to="/admin/users" className={navLinkClass}>
                <Users className="h-5 w-5 mr-3" />
                User Management
              </NavLink>
              <NavLink to="/admin/audit-logs" className={navLinkClass}>
                <FileText className="h-5 w-5 mr-3" />
                Audit Logs
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
