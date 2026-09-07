import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Calendar, ShieldCheck } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-900 h-32"></div>
        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-12 mb-6">
            <div className="h-24 w-24 rounded-full bg-white p-1 border-4 border-white shadow-lg flex items-center justify-center">
              <div className="h-full w-full rounded-full bg-indigo-100 flex items-center justify-center">
                <User className="h-10 w-10 text-indigo-600" />
              </div>
            </div>
            <div className="mb-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                <ShieldCheck className="h-4 w-4 mr-1.5" />
                {user?.role || 'User'}
              </span>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{user?.name}</h1>
              <p className="text-slate-500 flex items-center mt-1">
                <Mail className="h-4 w-4 mr-2" />
                {user?.email}
              </p>
            </div>

            <div className="border-t border-slate-100 pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">Role</p>
                <p className="text-slate-900 font-medium">{user?.role}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">Account Created</p>
                <p className="text-slate-900 font-medium flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-slate-400" />
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
