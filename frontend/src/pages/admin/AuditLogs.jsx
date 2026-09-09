import React, { useState, useEffect } from 'react';
import { getAuditLogs } from '../../services/api';
import PageHeader from '../../components/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import EmptyState from '../../components/EmptyState';
import { FileText } from 'lucide-react';

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await getAuditLogs({ limit: 50 });
        setLogs(res.data.data || []);
      } catch (error) {
        console.error('Failed to load audit logs');
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const getActionVariant = (action) => {
    if (!action) return 'secondary';
    if (action.includes('LOGIN') || action.includes('LOGOUT')) return 'info';
    if (action.includes('COMPLETED')) return 'success';
    if (action.includes('CREATED') || action.includes('UPLOADED')) return 'default';
    if (action.includes('FAILED')) return 'destructive';
    if (action.includes('REQUESTED')) return 'warning';
    return 'secondary';
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="System Audit Logs"
        description="Review security logs, user authentication, and screening processing events"
      />

      <Card className="border-slate-200/80 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-3">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : logs.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>User / Actor</TableHead>
                  <TableHead>Action Event</TableHead>
                  <TableHead>Screening ID</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log._id}>
                    <TableCell className="text-xs text-slate-500 font-mono">
                      {new Date(log.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-xs font-semibold text-slate-800">
                      {log.userId?.name || log.userId?.email || 'System Process'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getActionVariant(log.action)} className="font-mono text-[11px]">
                        {log.action}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs font-mono text-blue-600">
                      {log.screeningId || '—'}
                    </TableCell>
                    <TableCell className="text-xs text-slate-600 font-medium">
                      {log.status || '—'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <EmptyState
              icon={FileText}
              title="No audit logs available"
              description="System activities will be recorded here as operations occur."
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
