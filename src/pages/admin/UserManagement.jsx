import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Mail, 
  Phone, 
  Calendar,
  User,
  Shield,
  CheckCircle,
  XCircle,
  MoreVertical,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { apiService } from '@/services/api';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchQuery, roleFilter, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAllUsers();
      if (response.success) {
        // Sort users: admins first, then customers, then by creation date (newest first)
        const sortedUsers = response.data.users.sort((a, b) => {
          // Admins first
          if (a.role === 'admin' && b.role !== 'admin') return -1;
          if (a.role !== 'admin' && b.role === 'admin') return 1;
          // Then by date (newest first)
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        setUsers(sortedUsers);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(user =>
        user.name?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query) ||
        user.phone?.toLowerCase().includes(query)
      );
    }

    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
  };

  const handleDeleteUser = async (userId, userRole) => {
    // Prevent deletion of admin users
    if (userRole === 'admin') {
      alert('Cannot delete admin user');
      return;
    }

    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await apiService.deleteUser(userId);
      if (response.success) {
        fetchUsers(); // Refresh users
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const viewUserDetails = (user) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  const getRoleColor = (role) => {
    return role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">User Management</h2>
          <p className="text-muted-foreground">
            Manage customer and admin accounts
          </p>
        </div>
        <Button variant="outline" size="sm">
          Export Users
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger>
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="User Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="user">Customers</SelectItem>
            <SelectItem value="admin">Admins</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" onClick={() => {
          setSearchQuery('');
          setRoleFilter('all');
        }}>
          Clear Filters
        </Button>
      </div>

      {/* Users Table */}
      <div className="border rounded-lg bg-white">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Phone className="h-3 w-3" />
                      <span>{user.phone || 'Not provided'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getRoleColor(user.role)}>
                      <Shield className="h-3 w-3 mr-1" />
                      {user.role === 'admin' ? 'Admin' : 'Customer'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                       
                        
                        {/* Only show delete for non-admin users */}
                        {user.role === 'user' && (
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDeleteUser(user._id, user.role)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Usera
                          </DropdownMenuItem>
                        )}
                        
                        {/* Admin users cannot be deleted */}
                        {user.role === 'admin' && (
                          <DropdownMenuItem className="text-gray-400 cursor-not-allowed" disabled>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Cannot delete admin
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {!loading && filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg mb-2">No users found</h3>
            <p className="text-muted-foreground">
              {users.length === 0 
                ? 'No users registered yet' 
                : 'No users match your filters'}
            </p>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Users</p>
              <p className="text-2xl font-bold">{users.length}</p>
            </div>
            <User className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Customers</p>
              <p className="text-2xl font-bold">
                {users.filter(u => u.role === 'user').length}
              </p>
            </div>
            <User className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Admins</p>
              <p className="text-2xl font-bold">
                {users.filter(u => u.role === 'admin').length}
              </p>
            </div>
            <Shield className="h-8 w-8 text-purple-500" />
          </div>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Users</p>
              <p className="text-2xl font-bold">
                {users.filter(u => u.isActive).length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* User Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{selectedUser.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={getRoleColor(selectedUser.role)}>
                      {selectedUser.role === 'admin' ? 'Admin' : 'Customer'}
                    </Badge>
                    <Badge className={getStatusColor(selectedUser.isActive)}>
                      {selectedUser.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Contact Information</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedUser.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedUser.phone || 'Not provided'}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Account Information</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Joined: {new Date(selectedUser.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Last Updated: {new Date(selectedUser.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {selectedUser.addresses && selectedUser.addresses.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Saved Addresses</h4>
                  <div className="space-y-2">
                    {selectedUser.addresses.map((address, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex justify-between">
                          <span className="font-medium capitalize">{address.type}</span>
                          {address.isDefault && (
                            <Badge className="text-xs">Default</Badge>
                          )}
                        </div>
                        <p className="text-sm">{address.street}</p>
                        <p className="text-sm text-muted-foreground">
                          {address.city}, {address.state} - {address.zipCode}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Close
                </Button>
                {/* Only show delete button for non-admin users */}
                {selectedUser.role === 'user' && (
                  <Button 
                    variant="destructive"
                    onClick={() => {
                      setIsDialogOpen(false);
                      setTimeout(() => {
                        handleDeleteUser(selectedUser._id, selectedUser.role);
                      }, 300);
                    }}
                  >
                    Delete User
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;