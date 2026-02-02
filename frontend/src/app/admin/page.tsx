'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';
import { toast } from 'react-hot-toast';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else if (user.role !== 'super_admin') {
      toast.error('Access denied: Super admin only');
      router.push('/hotel');
    }
  }, [user, router]);

  if (!user || user.role !== 'super_admin') return null;

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-dark-purple">
      <nav className="border-b border-white/10 backdrop-blur-sm bg-dark-purple/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center">
              <svg className="w-8 h-8 text-neon-lime mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <h1 className="text-xl font-bold gradient-text">Super Admin Dashboard</h1>
            </div>
            <button
              onClick={handleLogout}
              className="btn-secondary"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-white mb-4 neon-glow">Welcome, {user.name}</h2>
          <p className="text-white/60 text-lg">Manage your hotel booking platform</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <button
            onClick={() => router.push('/admin/hotels')}
            className="card-elevated group hover:scale-105 transition-all duration-300 text-left"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-4 bg-neon-lime/10 rounded-lg border border-neon-lime/30">
                <svg className="w-8 h-8 text-neon-lime" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-neon-lime transition-colors">Hotels Management</h3>
            <p className="text-white/60">View and manage all hotels, their managers, and rooms</p>
            <div className="mt-4 flex items-center text-neon-lime font-semibold">
              <span>Go to Hotels</span>
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </button>

          <button
            onClick={() => router.push('/admin/users')}
            className="card-elevated group hover:scale-105 transition-all duration-300 text-left"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-4 bg-white/10 rounded-lg border border-white/30">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-neon-lime transition-colors">Users Management</h3>
            <p className="text-white/60">Manage all users, roles, and permissions</p>
            <div className="mt-4 flex items-center text-neon-lime font-semibold">
              <span>Go to Users</span>
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
