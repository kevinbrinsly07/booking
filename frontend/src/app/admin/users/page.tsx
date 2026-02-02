'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '@/lib/auth-store';
import api from '@/lib/api';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'hotel_admin' | 'super_admin';
  phone?: string;
  hotelIds: string[];
  isActive: boolean;
  createdAt: string;
}

export default function UsersManagementPage() {
  const router = useRouter();
  const { user: currentUser, logout } = useAuthStore();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    } else if (currentUser.role !== 'super_admin') {
      router.push('/hotel');
      toast.error('Access denied: Super admin only');
    } else {
      fetchUsers();
    }
  }, [currentUser, router]);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error: any) {
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await api.patch(`/users/${userId}`, { role: newRole });
      toast.success('Role updated successfully');
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update role');
    }
  };

  const handleToggleActive = async (userId: string, isActive: boolean) => {
    try {
      await api.patch(`/users/${userId}`, { isActive: !isActive });
      toast.success(`User ${!isActive ? 'activated' : 'deactivated'} successfully`);
      fetchUsers();
    } catch (error: any) {
      toast.error('Failed to update user status');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      await api.delete(`/users/${userId}`);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error: any) {
      toast.error('Failed to delete user');
    }
  };

  if (!currentUser || currentUser.role !== 'super_admin') return null;

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'bg-neon-lime/20 text-neon-lime border-neon-lime/30';
      case 'hotel_admin':
        return 'bg-white/10 text-white border-white/30';
      default:
        return 'bg-white/5 text-white/70 border-white/20';
    }
  };

  return (
    <div className="min-h-screen bg-dark-purple">
      <nav className="border-b border-white/10 backdrop-blur-sm bg-dark-purple/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center">
              <svg className="w-8 h-8 text-neon-lime mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <h1 className="text-xl font-bold gradient-text">User Management</h1>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.push('/hotel')}
                className="btn-secondary"
              >
                Back to Dashboard
              </button>
              <button
                onClick={() => {
                  logout();
                  router.push('/login');
                }}
                className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg font-semibold hover:bg-red-500/30 transition-all duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card-elevated">
          <div className="pb-6 border-b border-white/10">
            <h2 className="text-2xl font-bold text-white neon-glow">All Users</h2>
            <p className="text-white/60 mt-1">Manage user accounts and permissions</p>
          </div>

          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-lime mx-auto"></div>
              <p className="mt-4 text-white/70">Loading users...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-neon-lime uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-neon-lime uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-neon-lime uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-neon-lime uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-neon-lime uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-neon-lime uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 bg-neon-lime/20 border border-neon-lime/30 rounded-full flex items-center justify-center text-neon-lime font-bold">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-white">{user.name}</div>
                            {user.phone && <div className="text-sm text-white/60">{user.phone}</div>}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white/80">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user._id, e.target.value)}
                          disabled={user._id === currentUser.id}
                          className={`px-3 py-1 rounded-lg text-xs font-bold border ${getRoleBadgeColor(user.role)} disabled:opacity-50 bg-transparent cursor-pointer`}
                        >
                          <option value="user" className="bg-dark-purple text-white">User</option>
                          <option value="hotel_admin" className="bg-dark-purple text-white">Hotel Admin</option>
                          <option value="super_admin" className="bg-dark-purple text-white">Super Admin</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs font-bold rounded-lg border ${
                            user.isActive
                              ? 'bg-neon-lime/20 text-neon-lime border-neon-lime/30'
                              : 'bg-red-500/20 text-red-400 border-red-500/30'
                          }`}
                        >
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white/70">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                        <button
                          onClick={() => handleToggleActive(user._id, user.isActive)}
                          disabled={user._id === currentUser.id}
                          className="text-neon-lime hover:text-neon-lime/80 disabled:opacity-50 font-semibold"
                        >
                          {user.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          disabled={user._id === currentUser.id}
                          className="text-red-400 hover:text-red-300 disabled:opacity-50 font-semibold"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!isLoading && users.length === 0 && (
            <div className="p-8 text-center text-white/60">
              No users found
            </div>
          )}
        </div>

        <div className="mt-6 card-elevated">
          <h3 className="font-bold text-white mb-4 flex items-center">
            <svg className="w-5 h-5 text-neon-lime mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            User Management Tips
          </h3>
          <ul className="text-sm text-white/80 space-y-2">
            <li className="flex items-start">
              <span className="text-neon-lime mr-2">•</span>
              <span><strong className="text-white">USER</strong>: Can search hotels and make bookings</span>
            </li>
            <li className="flex items-start">
              <span className="text-neon-lime mr-2">•</span>
              <span><strong className="text-white">HOTEL_ADMIN</strong>: Can manage their hotel's rooms and bookings</span>
            </li>
            <li className="flex items-start">
              <span className="text-neon-lime mr-2">•</span>
              <span><strong className="text-white">SUPER_ADMIN</strong>: Can manage hotels, users, and system settings (not bookings)</span>
            </li>
            <li className="flex items-start">
              <span className="text-neon-lime mr-2">•</span>
              <span>You cannot modify your own account to prevent accidental lockout</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
