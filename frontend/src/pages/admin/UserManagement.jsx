import React, { useState, useEffect } from 'react';
import { getUsers, updateUser, deleteUser } from '../../services/api';
import PageHeader from '../../components/PageHeader';
import ConfirmDialog from '../../components/ConfirmDialog';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Shield, Trash2, Edit2, Check, X } from 'lucide-react';
import { toast } from 'sonner';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editRole, setEditRole] = useState('');
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getUsers();
      setUsers(res.data.data || []);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateRole = async (id) => {
    try {
      await updateUser(id, { role: editRole });
      toast.success('User role updated successfully');
      setEditingId(null);
      fetchUsers();
    } catch (error) {
      toast.error('Role update failed');
    }
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await deleteUser(deleteTargetId);
      toast.success('User deleted successfully');
      setDeleteTargetId(null);
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Management"
        description="Manage user access accounts and authorization roles"
      />

      <Card className="border-slate-200/80 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User Name</TableHead>
                  <TableHead>Email Address</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => {
                  const userId = user._id || user.id;
                  const isEditing = editingId === userId;

                  return (
                    <TableRow key={userId}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                            {user.name?.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-slate-900">{user.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-slate-500">{user.email}</TableCell>
                      <TableCell>
                        {isEditing ? (
                          <div className="flex items-center space-x-2">
                            <Select value={editRole} onValueChange={setEditRole}>
                              <SelectTrigger className="h-8 w-32 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="OFFICER">OFFICER</SelectItem>
                                <SelectItem value="ADMIN">ADMIN</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-emerald-600" onClick={() => handleUpdateRole(userId)}>
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400" onClick={() => setEditingId(null)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'} className="text-xs gap-1">
                            {user.role === 'ADMIN' && <Shield className="h-3 w-3" />}
                            {user.role}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-slate-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-500 hover:text-blue-600"
                          onClick={() => {
                            setEditingId(userId);
                            setEditRole(user.role);
                          }}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-500 hover:text-red-600"
                          onClick={() => setDeleteTargetId(userId)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={!!deleteTargetId}
        onOpenChange={(open) => !open && setDeleteTargetId(null)}
        title="Delete User Account"
        description="Are you sure you want to delete this user? This action cannot be undone."
        confirmText="Delete User"
        onConfirm={handleDelete}
      />
    </div>
  );
}
