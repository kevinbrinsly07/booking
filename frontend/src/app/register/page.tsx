'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';
import RegisterForm from '@/components/auth/RegisterForm';
import Link from 'next/link';

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get('role');
  const { user, isLoading } = useAuthStore();

  useEffect(() => {
    if (user && !isLoading) {
      if (user.role === 'hotel_admin' || user.role === 'super_admin') {
        router.push('/hotel');
      } else {
        router.push('/client');
      }
    }
  }, [user, isLoading, router]);

  const isHotelRole = roleParam === 'hotel';

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-purple px-4 py-8 sm:py-12">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-neon-lime/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-neon-lime/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Logo/Brand */}
        <Link href="/" className="flex items-center justify-center mb-8">
          <svg className="w-12 h-12 text-neon-lime mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-2xl font-bold gradient-text">Hotel Booking</span>
        </Link>

        {/* Form Card */}
        <div className="card-elevated">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white neon-glow mb-2">Create Account</h1>
            <p className="text-white/60">
              {isHotelRole ? 'Register as a Hotel Manager' : 'Join us to start booking'}
            </p>
            {roleParam && (
              <div className="mt-3 inline-flex items-center px-4 py-2 bg-neon-lime/10 border border-neon-lime/30 rounded-lg">
                <svg className="w-5 h-5 text-neon-lime mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isHotelRole ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  )}
                </svg>
                <span className="text-neon-lime font-semibold text-sm">
                  {isHotelRole ? 'Hotel Account' : 'Client Account'}
                </span>
              </div>
            )}
          </div>
          
          <RegisterForm />
          
          <div className="mt-6 text-center">
            <p className="text-white/60 text-sm">
              Already have an account?{' '}
              <Link href="/login" className="text-neon-lime hover:underline font-semibold">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-white/60 hover:text-white text-sm flex items-center justify-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-dark-purple">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <RegisterContent />
    </Suspense>
  );
}
