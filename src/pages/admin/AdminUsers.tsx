import { useState, useEffect } from 'react';
import { Button } from '@/component/ui/button';
import { Input } from '@/component/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/component/ui/dialog';
import { Label } from '@/component/ui/label';
import { 
  Search, 
  Edit,
  Trash2,
  Users,
} from 'lucide-react';
import { apiGet, apiPut, apiDelete } from '@/lib/api';
import { User } from '@/types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export const AdminUsers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [updatingRole, setUpdatingRole] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'ADMIN' | 'COACH' | 'CUSTOMER'>('CUSTOMER');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await apiGet('/users');
      let list: User[] = [];
      if (Array.isArray(res)) list = res;
      else if (res && res.content) list = res.content;
      setUsers(list);
    } catch (err) {
      console.error('Failed to load users', err);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const query = searchQuery.toLowerCase();
    return (
      user.name?.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    );
  });

  const handleEditRole = (user: User) => {
    setSelectedUser(user);
    setSelectedRole(user.role);
    setShowEditModal(true);
  };

  const handleUpdateRole = async () => {
    if (!selectedUser) return;

    setUpdatingRole(true);
    try {
      const updatedUser = await apiPut(`/users/${selectedUser.id}`, {
        ...selectedUser,
        role: selectedRole,
      });

      setUsers(users.map(u => u.id === selectedUser.id ? updatedUser : u));
      toast.success(`User role updated to ${selectedRole}`);
      setShowEditModal(false);
      setSelectedUser(null);
    } catch (err: any) {
      console.error('Failed to update user', err);
      toast.error(err?.message || 'Failed to update user role');
    } finally {
      setUpdatingRole(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await apiDelete(`/users/${userId}`);
      setUsers(users.filter(u => u.id !== userId));
      toast.success('User deleted successfully!');
    } catch (err: any) {
      console.error('Failed to delete user', err);
      toast.error(err?.message || 'Failed to delete user');
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-4xl text-foreground mb-2">Users</h1>
        <p className="text-muted-foreground">Manage registered users and their roles.</p>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Users Table/Grid */}
      {loading ? (
        <div className="text-center py-16">
          <Users className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
          <h2 className="font-display text-2xl text-foreground mb-2">Loading users...</h2>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-16">
          <Users className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
          <h2 className="font-display text-2xl text-foreground mb-2">No users found</h2>
          {searchQuery && <p className="text-muted-foreground">Try adjusting your search.</p>}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-4 py-3 font-medium text-foreground">Name</th>
                <th className="text-left px-4 py-3 font-medium text-foreground">Email</th>
                <th className="text-left px-4 py-3 font-medium text-foreground">Role</th>
                <th className="text-right px-4 py-3 font-medium text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-border hover:bg-secondary/50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-foreground">{user.name}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium",
                      user.role === 'ADMIN' && "bg-red-500/20 text-red-500",
                      user.role === 'COACH' && "bg-blue-500/20 text-blue-500",
                      user.role === 'CUSTOMER' && "bg-green-500/20 text-green-500"
                    )}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditRole(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Role Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User Role</DialogTitle>
            <DialogDescription>
              Update the role for {selectedUser?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={selectedUser?.email || ''}
                disabled
                className="text-sm"
              />
            </div>

            <div>
              <Label htmlFor="role">Role *</Label>
              <select
                id="role"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as 'ADMIN' | 'COACH' | 'CUSTOMER')}
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
              >
                <option value="CUSTOMER">Customer</option>
                <option value="COACH">Coach</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleUpdateRole}
                disabled={updatingRole}
                className="flex-1"
              >
                {updatingRole ? 'Updating...' : 'Update Role'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowEditModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsers;
