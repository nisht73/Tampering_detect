import React, { useEffect, useState } from 'react';
import { getDashboardStats, getScreenings } from '../services/api';
import { 
  FileText, ShieldAlert, ShieldCheck, Shield, AlertTriangle, AlertOctagon
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useNavigate } from 'react-router-dom';
import RiskBadge from '../components/RiskBadge';
import StatusBadge from '../components/StatusBadge';
import Loading from '../components/Loading';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentScreenings, setRecentScreenings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, screeningsRes] = await Promise.all([
          getDashboardStats().catch(() => ({ data: { success: true, data: { total: 0, pending: 0, byStatus: [], byRiskLevel: [], recent: [] } } })),
          getScreenings({ limit: 10 }).catch(() => ({ data: { data: [] } }))
        ]);
        
        const raw = statsRes.data.data || statsRes.data;
        // Transform byRiskLevel array into flat counts
        const riskCounts = { low: 0, medium: 0, high: 0, critical: 0 };
        if (raw.byRiskLevel) {
          raw.byRiskLevel.forEach(item => {
            const key = (item._id || '').toLowerCase();
            if (riskCounts.hasOwnProperty(key)) riskCounts[key] = item.count;
          });
        }
        setStats({ total: raw.total || 0, pending: raw.pending || 0, ...riskCounts });
        setRecentScreenings(raw.recent || screeningsRes.data.data || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <Loading text="Loading dashboard..." />;

  const statCards = [
    { label: 'Total Screenings', value: stats?.total || 0, icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { label: 'Pending Processing', value: stats?.pending || 0, icon: Shield, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Low Risk', value: stats?.low || 0, icon: ShieldCheck, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Medium Risk', value: stats?.medium || 0, icon: AlertTriangle, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { label: 'High Risk', value: stats?.high || 0, icon: ShieldAlert, color: 'text-orange-600', bg: 'bg-orange-100' },
    { label: 'Critical Risk', value: stats?.critical || 0, icon: AlertOctagon, color: 'text-red-600', bg: 'bg-red-100' },
  ];

  const pieData = [
    { name: 'Low', value: stats?.low || 0, color: '#10B981' },
    { name: 'Medium', value: stats?.medium || 0, color: '#F59E0B' },
    { name: 'High', value: stats?.high || 0, color: '#F97316' },
    { name: 'Critical', value: stats?.critical || 0, color: '#EF4444' },
  ].filter(item => item.value > 0);

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col items-center text-center">
            <div className={`p-3 rounded-full ${stat.bg} ${stat.color} mb-3`}>
              <stat.icon className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Risk Distribution</h3>
          <div className="h-64">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, 'Screenings']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400">
                No risk data available
              </div>
            )}
          </div>
        </div>

        {/* Recent Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 lg:col-span-2 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-slate-800">Recent Screenings</h3>
            <button 
              onClick={() => navigate('/screenings')}
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
            >
              View all
            </button>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">ID</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Risk</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {recentScreenings.length > 0 ? recentScreenings.map((screening) => (
                  <tr 
                    key={screening._id} 
                    onClick={() => navigate(`/screening/${screening.screeningId}`)}
                    className="hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-indigo-600">
                      {screening.screeningId}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500">
                      {new Date(screening.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-700">
                      {screening.documentType || 'Unknown'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <StatusBadge status={screening.status} />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <RiskBadge level={screening.riskResult?.level} />
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="px-4 py-8 text-center text-sm text-slate-500">
                      No recent screenings found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
