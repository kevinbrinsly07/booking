'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '@/lib/auth-store';
import api from '@/lib/api';

interface ProfileFormData {
  name: string;
  phone?: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, setUser, logout } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<ProfileFormData>();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) return null;

  const newPassword = watch('newPassword');

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    setSuccessMessage('');
    setErrorMessage('');
    
    try {
      const updateData: any = {
        name: data.name,
        phone: data.phone,
      };

      // Only include password if user wants to change it
      if (data.newPassword && data.currentPassword) {
        updateData.password = data.newPassword;
      }

      const response = await api.patch(`/users/${user.id}`, updateData);
      setUser(response.data);
      setSuccessMessage('Profile updated successfully!');
      
      // Reset password fields
      reset({
        name: data.name,
        phone: data.phone,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <nav className="bg-dark-purple/50 border-b border-white/10 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <h1 className="text-xl font-bold text-white flex items-center">
              <svg className="w-6 h-6 text-neon-lime mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              My Profile
            </h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push(user.role === 'user' ? '/client' : '/hotel')}
                className="px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all"
              >
                Back to {user.role === 'user' ? 'Hotels' : 'Dashboard'}
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card-elevated">
          {/* Header Section */}
          <div className="mb-6 pb-6 border-b border-white/10">
            <h2 className="text-2xl font-bold text-white">Profile Information</h2>
            <p className="text-white/60 mt-1">Update your account details and password</p>
          </div>

          {/* Success/Error Messages */}
          {successMessage && (
            <div className="mb-6 bg-neon-lime/20 border border-neon-lime/50 text-neon-lime px-4 py-3 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>{successMessage}</span>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="mb-6 bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          {/* Account Info Display */}
          <div className="mb-6 p-4 bg-dark-200/30 border border-white/10 rounded-lg">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-white/60 mb-1">Email Address</p>
                <p className="font-semibold text-white">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-white/60 mb-1">Account Role</p>
                <p className="font-semibold text-neon-lime capitalize">{user.role.replace('_', ' ')}</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <svg className="w-5 h-5 text-neon-lime mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Personal Information
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Full Name *
                  </label>
                  <input
                    {...register('name', { required: 'Name is required' })}
                    type="text"
                    defaultValue={user.name}
                    className="w-full px-4 py-2 bg-dark-200/50 border border-white/10 text-white rounded-lg focus:outline-none focus:border-neon-lime transition-colors"
                    placeholder="John Doe"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Phone Number
                  </label>
                  <input
                    {...register('phone')}
                    type="tel"
                    defaultValue={user.phone}
                    className="w-full px-4 py-2 bg-dark-200/50 border border-white/10 text-white rounded-lg focus:outline-none focus:border-neon-lime transition-colors"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>
            </div>

            <hr className="border-white/10" />

            {/* Password Change Section */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center">
                <svg className="w-5 h-5 text-neon-lime mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Change Password
              </h3>
              <p className="text-sm text-white/60 mb-4">Leave blank if you don't want to change your password</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Current Password
                  </label>
                  <input
                    {...register('currentPassword')}
                    type="password"
                    className="w-full px-4 py-2 bg-dark-200/50 border border-white/10 text-white rounded-lg focus:outline-none focus:border-neon-lime transition-colors"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    New Password
                  </label>
                  <input
                    {...register('newPassword', {
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters'
                      }
                    })}
                    type="password"
                    className="w-full px-4 py-2 bg-dark-200/50 border border-white/10 text-white rounded-lg focus:outline-none focus:border-neon-lime transition-colors"
                    placeholder="••••••••"
                  />
                  {errors.newPassword && (
                    <p className="mt-1 text-sm text-red-400">{errors.newPassword.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    {...register('confirmPassword', {
                      validate: value => 
                        !newPassword || value === newPassword || 'Passwords do not match'
                    })}
                    type="password"
                    className="w-full px-4 py-2 bg-dark-200/50 border border-white/10 text-white rounded-lg focus:outline-none focus:border-neon-lime transition-colors"
                    placeholder="••••••••"
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-400">{errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-white/10">
              <button
                type="button"
                onClick={() => router.push(user.role === 'user' ? '/client' : '/hotel')}
                className="px-6 py-3 bg-white/10 text-white border border-white/10 rounded-lg hover:bg-white/20 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-dark-purple" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
