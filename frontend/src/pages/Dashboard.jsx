import React, { useEffect, useState } from 'react';
import { getDashboardStats, getScreenings } from '../services/api';
import {
  FileText,
  ShieldAlert,
  ShieldCheck,
  Shield,
  AlertTriangle,
  AlertOctagon,
  PlusCircle,
  ArrowRight,
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useNavigate } from 'react-router-dom';
import RiskBadge from '../components/RiskBadge';
import StatusBadge from '../components/StatusBadge';
import StatCard from '../components/StatCard';
import PageHeader from '../components/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentScreenings, setRecentScreenings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, screeningsRes] = await Promise.all([
          getDashboardStats().catch(() => ({
            data: { success: true, data: { total: 0, pending: 0, byStatus: [], byRiskLevel: [], recent: [] } },
          })),
          getScreenings({ limit: 10 }).catch(() => ({ data: { data: [] } })),
        ]);

        const raw = statsRes.data.data || statsRes.data;
        const riskCounts = { low: 0, medium: 0, high: 0, critical: 0 };
        if (raw.byRiskLevel) {
          raw.byRiskLevel.forEach((item) => {
            const key = (item._id || '').toLowerCase();
            if (Object.prototype.hasOwnProperty.call(riskCounts, key)) riskCounts[key] = item.count;
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

  const statCardsData = [
    { label: 'Total Screenings', value: stats?.total || 0, icon: FileText, color: 'blue' },
    { label: 'Processing', value: stats?.pending || 0, icon: Shield, color: 'purple' },
    { label: 'Low Risk', value: stats?.low || 0, icon: ShieldCheck, color: 'green' },
    { label: 'Medium Risk', value: stats?.medium || 0, icon: AlertTriangle, color: 'yellow' },
    { label: 'High Risk', value: stats?.high || 0, icon: ShieldAlert, color: 'yellow' },
    { label: 'Critical Risk', value: stats?.critical || 0, icon: AlertOctagon, color: 'red' },
  ];

  const pieData = [
    { name: 'Low Risk', value: stats?.low || 0, color: '#10B981' },
    { name: 'Medium Risk', value: stats?.medium || 0, color: '#F59E0B' },
    { name: 'High Risk', value: stats?.high || 0, color: '#F97316' },
    { name: 'Critical Risk', value: stats?.critical || 0, color: '#EF4444' },
  ].filter((item) => item.value > 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard Overview"
        description="Monitor automated AI document screening results and risk distribution"
        action={
          <Button onClick={() => navigate('/screening/new')} className="bg-blue-600 hover:bg-blue-700 font-semibold gap-2 shadow-sm">
            <PlusCircle className="h-4 w-4" />
            New Screening
          </Button>
        }
      />

      {/* Stat Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.05 } },
          }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
        >
          {statCardsData.map((stat, idx) => (
            <motion.div key={idx} variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}>
              <StatCard label={stat.label} value={stat.value} icon={stat.icon} color={stat.color} />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Main Content Grid: Chart + Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Distribution Chart Card */}
        <Card className="border-slate-200/80 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold">Risk Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-64 w-full" />
            ) : pieData.length > 0 ? (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={4}
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
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-slate-400 text-sm">
                <FileText className="h-8 w-8 mb-2 opacity-50" />
                No screening risk data recorded yet
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Screenings Table Card */}
        <Card className="lg:col-span-2 border-slate-200/80 shadow-sm flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-base font-bold">Recent Screenings</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate('/screenings')} className="text-xs text-blue-600 hover:text-blue-800 font-semibold gap-1">
              View All <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </CardHeader>
          <CardContent className="flex-1 p-0">
            {loading ? (
              <div className="p-6 space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : recentScreenings.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Screening ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Risk Result</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentScreenings.map((s) => (
                    <TableRow
                      key={s._id || s.screeningId}
                      onClick={() => navigate(`/screening/${s.screeningId}`)}
                      className="cursor-pointer hover:bg-slate-50/80"
                    >
                      <TableCell className="font-mono text-xs font-semibold text-blue-600">
                        {s.screeningId}
                      </TableCell>
                      <TableCell className="text-xs text-slate-500">
                        {new Date(s.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-xs font-medium text-slate-700 capitalize">
                        {s.documentType || 'Composite'}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={s.status} />
                      </TableCell>
                      <TableCell>
                        <RiskBadge level={s.riskResult?.level || s.overallResult} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="p-12 text-center text-sm text-slate-400">
                No recent screenings found.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
