'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/auth-store'
import HotelDashboard from '@/components/hotel/HotelDashboard'
import RoomManagement from '@/components/hotel/RoomManagement'
import BookingManagement from '@/components/hotel/BookingManagement'

export default function HotelPortal() {
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const [activeTab, setActiveTab] = useState<'dashboard' | 'rooms' | 'bookings'>('dashboard')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push('/login?returnTo=hotel')
    } else if (user.role === 'super_admin') {
      // Redirect super admins to admin dashboard - they don't manage bookings
      router.push('/admin')
    } else if (user.role !== 'hotel_admin') {
      router.push('/client')
    }
  }, [user, router])

  if (!user || user.role !== 'hotel_admin') {
    return null
  }

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-dark-purple">
      <nav className="border-b border-white/10 backdrop-blur-sm bg-dark-purple/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center">
              <svg className="w-8 h-8 text-neon-lime mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <h1 className="text-xl font-bold gradient-text">Hotel Management</h1>
            </div>
            <div className="hidden md:flex items-center space-x-3">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-5 py-2 rounded-lg font-semibold transition-all duration-200 ${
                  activeTab === 'dashboard'
                    ? 'bg-neon-lime text-dark-purple'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('rooms')}
                className={`px-5 py-2 rounded-lg font-semibold transition-all duration-200 ${
                  activeTab === 'rooms'
                    ? 'bg-neon-lime text-dark-purple'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                Rooms
              </button>
              <button
                onClick={() => setActiveTab('bookings')}
                className={`px-5 py-2 rounded-lg font-semibold transition-all duration-200 ${
                  activeTab === 'bookings'
                    ? 'bg-neon-lime text-dark-purple'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                Bookings
              </button>
              <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-white/10">
                <button
                  onClick={() => router.push('/profile')}
                  className="text-sm text-neon-lime hover:text-neon-lime/80 font-semibold flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <div className="hidden sm:flex flex-col items-start">
                    <span>{user.name}</span>
                    <span className="text-xs text-white/50">({user.role})</span>
                  </div>
                  <span className="sm:hidden">{user.name}</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg font-semibold hover:bg-red-500/30 transition-all duration-200"
                >
                  Logout
                </button>
              </div>
            </div>

            {/* Mobile menu button and user info */}
            <div className="md:hidden flex items-center space-x-3">
              <button
                onClick={() => router.push('/profile')}
                className="text-sm text-neon-lime hover:text-neon-lime/80 font-semibold flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="hidden sm:inline">{user.name}</span>
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white/70 hover:text-white p-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-white/10 bg-dark-purple/95 backdrop-blur-sm">
              <div className="px-4 py-4 space-y-2">
                <button
                  onClick={() => {
                    setActiveTab('dashboard')
                    setIsMobileMenuOpen(false)
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    activeTab === 'dashboard'
                      ? 'bg-neon-lime text-dark-purple'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => {
                    setActiveTab('rooms')
                    setIsMobileMenuOpen(false)
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    activeTab === 'rooms'
                      ? 'bg-neon-lime text-dark-purple'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Rooms
                </button>
                <button
                  onClick={() => {
                    setActiveTab('bookings')
                    setIsMobileMenuOpen(false)
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    activeTab === 'bookings'
                      ? 'bg-neon-lime text-dark-purple'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Bookings
                </button>
                <div className="border-t border-white/10 pt-2 mt-4">
                  <button
                    onClick={() => {
                      router.push('/profile')
                      setIsMobileMenuOpen(false)
                    }}
                    className="w-full text-left px-4 py-3 text-neon-lime hover:bg-neon-lime/10 rounded-lg font-semibold transition-all duration-200"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsMobileMenuOpen(false)
                    }}
                    className="w-full text-left px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg font-semibold transition-all duration-200"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'dashboard' && <HotelDashboard />}
        {activeTab === 'rooms' && <RoomManagement />}
        {activeTab === 'bookings' && <BookingManagement />}
      </div>
    </div>
  )
}
