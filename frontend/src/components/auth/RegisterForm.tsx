'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '@/lib/auth-store';
import api from '@/lib/api';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  role?: string;
  hotelName?: string;
  hotelLocation?: string;
  hotelDescription?: string;
  hotelAddress?: string;
}

export default function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get('role');
  const [isLoading, setIsLoading] = useState(false);
  const { setUser, setToken } = useAuthStore();
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormData>();

  const password = watch('password');

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      const { confirmPassword, ...registerData } = data;
      
      // Add role based on URL parameter
      const requestData = {
        ...registerData,
        role: roleParam === 'hotel' ? 'hotel_admin' : 'user'
      };
      
      const response = await api.post('/auth/register', requestData);
      const { access_token, user } = response.data;
      
      setToken(access_token);
      setUser(user);
      
      toast.success('Registration successful!');
      
      // Redirect based on role
      if (user.role === 'hotel_admin' || user.role === 'super_admin') {
        router.push('/hotel');
      } else {
        router.push('/client');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label className="block text-sm font-semibold text-white/90 mb-2">
          Full Name
        </label>
        <input
          {...register('name', { required: 'Name is required' })}
          type="text"
          className="input-field"
          placeholder="John Doe"
        />
        {errors.name && (
          <p className="mt-2 text-sm text-neon-lime">{errors.name.message}</p>
        )}
      </div>

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
          Phone Number <span className="text-white/50 font-normal">(Optional)</span>
        </label>
        <input
          {...register('phone')}
          type="tel"
          className="input-field"
          placeholder="+1 (555) 000-0000"
        />
      </div>

      {roleParam === 'hotel' && (
        <>
          <div className="pt-4 border-t border-white/10">
            <h3 className="text-lg font-semibold text-white/90 mb-4">Hotel Information</h3>
          </div>

          <div>
            <label className="block text-sm font-semibold text-white/90 mb-2">
              Hotel Name
            </label>
            <input
              {...register('hotelName', { 
                required: roleParam === 'hotel' ? 'Hotel name is required' : false 
              })}
              type="text"
              className="input-field"
              placeholder="Grand Hotel"
            />
            {errors.hotelName && (
              <p className="mt-2 text-sm text-neon-lime">{errors.hotelName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-white/90 mb-2">
              Hotel Location
            </label>
            <input
              {...register('hotelLocation', { 
                required: roleParam === 'hotel' ? 'Hotel location is required' : false 
              })}
              type="text"
              className="input-field"
              placeholder="New York, USA"
            />
            {errors.hotelLocation && (
              <p className="mt-2 text-sm text-neon-lime">{errors.hotelLocation.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-white/90 mb-2">
              Hotel Address <span className="text-white/50 font-normal">(Optional)</span>
            </label>
            <input
              {...register('hotelAddress')}
              type="text"
              className="input-field"
              placeholder="123 Main Street, New York, NY 10001"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-white/90 mb-2">
              Hotel Description <span className="text-white/50 font-normal">(Optional)</span>
            </label>
            <textarea
              {...register('hotelDescription')}
              className="input-field min-h-[100px]"
              placeholder="Describe your hotel..."
            />
          </div>
        </>
      )}

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

      <div>
        <label className="block text-sm font-semibold text-white/90 mb-2">
          Confirm Password
        </label>
        <input
          {...register('confirmPassword', { 
            required: 'Please confirm your password',
            validate: value => value === password || 'Passwords do not match'
          })}
          type="password"
          className="input-field"
          placeholder="••••••••"
        />
        {errors.confirmPassword && (
          <p className="mt-2 text-sm text-neon-lime">{errors.confirmPassword.message}</p>
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
            Creating account...
          </span>
        ) : 'Create Account'}
      </button>
    </form>
  );
}
