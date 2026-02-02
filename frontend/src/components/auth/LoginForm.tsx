'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '@/lib/auth-store';
import api from '@/lib/api';

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { setUser, setToken } = useAuthStore();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', data);
      const { access_token, user } = response.data;
      
      setToken(access_token);
      setUser(user);
      
      toast.success('Login successful!');
      
      // Redirect based on role
      if (user.role === 'super_admin') {
        router.push('/admin');
      } else if (user.role === 'hotel_admin') {
        router.push('/hotel');
      } else {
        router.push('/client');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-white/90 mb-2">
          Email Address
        </label>
        <input
          {...register('email', { 
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address'
            }
          })}
          type="email"
          className="input-field"
          placeholder="you@example.com"
        />
        {errors.email && (
          <p className="mt-2 text-sm text-neon-lime">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold text-white/90 mb-2">
          Password
        </label>
        <input
          {...register('password', { 
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters'
            }
          })}
          type="password"
          className="input-field"
          placeholder="••••••••"
        />
        {errors.password && (
          <p className="mt-2 text-sm text-neon-lime">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-dark-purple" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Signing in...
          </span>
        ) : 'Sign In'}
      </button>

      <div className="mt-6 text-center">
        <p className="text-white/60 text-sm">
          Forgot your password?{' '}
          <a href="#" className="text-neon-lime hover:underline font-semibold">
            Reset it
          </a>
        </p>
      </div>
    </form>
  );
}
