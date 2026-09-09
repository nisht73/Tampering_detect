import React from 'react';
import { useAuth } from '../context/AuthContext';
import PageHeader from '../components/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Calendar, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Profile() {
  const { user } = useAuth();

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <PageHeader
        title="User Profile"
        description="View your personal account details and access privileges"
      />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="border-slate-200/80 shadow-md overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-blue-600 to-indigo-600" />
          <CardContent className="px-8 pb-8 pt-0 relative">
            <div className="flex justify-between items-end -mt-10 mb-6">
              <Avatar className="h-20 w-20 border-4 border-white shadow-md">
                <AvatarFallback className="bg-blue-600 text-white font-bold text-xl">
                  {getInitials(user?.name)}
                </AvatarFallback>
              </Avatar>
              <Badge variant="info" className="px-3 py-1 text-xs gap-1">
                <ShieldCheck className="h-3.5 w-3.5" />
                {user?.role || 'OFFICER'}
              </Badge>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{user?.name}</h2>
                <p className="text-sm text-slate-500 flex items-center mt-1">
                  <Mail className="h-4 w-4 mr-2 text-slate-400" />
                  {user?.email}
                </p>
              </div>

              <div className="border-t border-slate-100 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                <div className="space-y-1">
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Assigned Role</span>
                  <p className="font-semibold text-slate-800 capitalize">{user?.role || 'Officer'}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Account Created</span>
                  <p className="font-semibold text-slate-800 flex items-center">
                    <Calendar className="h-4 w-4 mr-1.5 text-slate-400" />
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
