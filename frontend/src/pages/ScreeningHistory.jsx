import React, { useState, useEffect } from 'react';
import { getScreenings } from '../services/api';
import { useNavigate } from 'react-router-dom';
import RiskBadge from '../components/RiskBadge';
import StatusBadge from '../components/StatusBadge';
import PageHeader from '../components/PageHeader';
import EmptyState from '../components/EmptyState';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, ChevronLeft, ChevronRight, PlusCircle, Filter } from 'lucide-react';

export default function ScreeningHistory() {
  const [screenings, setScreenings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    status: 'ALL',
    riskLevel: 'ALL',
    search: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchScreenings = async () => {
      setLoading(true);
      try {
        const params = {
          page,
          limit: 10,
          search: filters.search || undefined,
          status: filters.status !== 'ALL' ? filters.status : undefined,
          riskLevel: filters.riskLevel !== 'ALL' ? filters.riskLevel : undefined,
        };
        const res = await getScreenings(params);
        setScreenings(res.data.data || []);
        setTotalPages(res.data.pagination?.pages || 1);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchScreenings();
    }, 300);
    return () => clearTimeout(timer);
  }, [page, filters]);

  const handleSearchChange = (e) => {
    setFilters((prev) => ({ ...prev, search: e.target.value }));
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Screening History"
        description="Search and review past document screening requests"
        action={
          <Button onClick={() => navigate('/screening/new')} className="bg-blue-600 hover:bg-blue-700 font-semibold gap-2">
            <PlusCircle className="h-4 w-4" /> New Screening
          </Button>
        }
      />

      {/* Filter and Search Toolbar Card */}
      <Card className="border-slate-200/80 shadow-sm">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              value={filters.search}
              onChange={handleSearchChange}
              placeholder="Search by Screening ID..."
              className="pl-9"
            />
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <Select
              value={filters.status}
              onValueChange={(val) => {
                setFilters((prev) => ({ ...prev, status: val }));
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full md:w-44">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="PROCESSING">Processing</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
                <SelectItem value="REVIEW_REQUIRED">Review Required</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.riskLevel}
              onValueChange={(val) => {
                setFilters((prev) => ({ ...prev, riskLevel: val }));
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full md:w-44">
                <SelectValue placeholder="All Risk Levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Risk Levels</SelectItem>
                <SelectItem value="LOW">Low Risk</SelectItem>
                <SelectItem value="MEDIUM">Medium Risk</SelectItem>
                <SelectItem value="HIGH">High Risk</SelectItem>
                <SelectItem value="CRITICAL">Critical Risk</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results Table Card */}
      <Card className="border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : screenings.length > 0 ? (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Screening ID</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Document Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Risk Assessment</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {screenings.map((s) => (
                  <TableRow
                    key={s._id || s.screeningId}
                    onClick={() => navigate(`/screening/${s.screeningId}`)}
                    className="cursor-pointer hover:bg-slate-50/80"
                  >
                    <TableCell className="font-mono text-xs font-semibold text-blue-600">
                      {s.screeningId}
                    </TableCell>
                    <TableCell className="text-xs text-slate-500">
                      {new Date(s.createdAt).toLocaleString()}
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
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="text-xs text-blue-600 hover:text-blue-800">
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>
                  Page <strong className="text-slate-800">{page}</strong> of <strong className="text-slate-800">{totalPages}</strong>
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    Next <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <EmptyState
            title="No screenings found"
            description="No screening records match your current search and filter parameters."
            actionLabel="Start New Screening"
            onAction={() => navigate('/screening/new')}
          />
        )}
      </Card>
    </div>
  );
}
