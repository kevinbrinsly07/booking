'use client'

import { useState, useEffect } from 'react'
import { bookingService, Booking } from '@/lib/services'
import { useAuthStore } from '@/lib/auth-store'

export default function BookingList() {
  const { user } = useAuthStore()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cancelingId, setCancelingId] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      fetchBookings()
    }
  }, [user])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await bookingService.getAll(user?.id)
      setBookings(response.data)
    } catch (err) {
      console.error('Error fetching bookings:', err)
      setError('Failed to load bookings. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) {
      return
    }

    try {
      setCancelingId(bookingId)
      await bookingService.cancel(bookingId)
      // Refresh bookings list
      await fetchBookings()
      alert('Booking cancelled successfully!')
    } catch (err: any) {
      console.error('Error cancelling booking:', err)
      alert(err.response?.data?.message || 'Failed to cancel booking. Please try again.')
    } finally {
      setCancelingId(null)
    }
  }

  const formatDate = (date: string | Date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-neon-lime/20 text-neon-lime border-neon-lime/30'
      case 'pending':
        return 'bg-white/10 text-white border-white/30'
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'completed':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      default:
        return 'bg-white/10 text-white/70 border-white/30'
    }
  }

  if (loading) {
    return (
      <div className="card-elevated">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-lime mx-auto mb-4"></div>
            <p className="text-white/60">Loading bookings...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card-elevated">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-red-400 mb-4">{error}</p>
            <button onClick={fetchBookings} className="btn-primary">
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="card-elevated">
      <div className="pb-6 border-b border-white/10">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <svg className="w-6 h-6 text-neon-lime mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          My Bookings
        </h2>
      </div>

      {bookings.length === 0 ? (
        <div className="py-12 text-center">
          <svg className="w-16 h-16 text-white/20 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-white/60 mb-4">No bookings yet</p>
          <a href="/client" className="btn-primary inline-block">
            Browse Hotels
          </a>
        </div>
      ) : (
        <div className="divide-y divide-white/10">
          {bookings.map((booking, index) => (
            <div key={booking._id || booking.id || index} className="py-6 first:pt-6 hover:bg-white/5 -mx-6 px-6 transition-all duration-200">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Booking Icon */}
                <div className="relative w-full md:w-48 h-40 rounded-lg overflow-hidden flex-shrink-0 bg-dark-200 flex items-center justify-center">
                  <svg className="w-20 h-20 text-neon-lime/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span className={`absolute top-3 right-3 px-3 py-1 rounded-lg text-xs font-bold border ${getStatusColor(booking.status)} uppercase backdrop-blur-sm`}>
                    {booking.status}
                  </span>
                </div>
                
                {/* Booking Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">Booking #{(booking._id || booking.id || 'Unknown').slice(-8)}</h3>
                        <p className="text-white/60 text-sm mb-2">
                          Guest: {booking.guestName}
                        </p>
                        <p className="text-white/70 text-sm">Guests: {booking.guests}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-white/70 mb-2">
                      <svg className="w-4 h-4 mr-2 text-neon-lime" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm">
                        {formatDate(booking.checkIn)} to {formatDate(booking.checkOut)}
                      </span>
                    </div>
                    <p className="text-white/60 text-xs">
                      Booked on: {formatDate(booking.createdAt || new Date())}
                    </p>
                  </div>
                  
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mt-4">
                    <div className="text-3xl font-bold text-neon-lime">
                      ${booking.totalAmount}
                    </div>
                    <div className="flex gap-3">
                      {booking.status.toLowerCase() !== 'cancelled' && booking.status.toLowerCase() !== 'completed' && (
                        <button 
                          onClick={() => handleCancelBooking(booking._id || booking.id || '')}
                          disabled={cancelingId === (booking._id || booking.id)}
                          className="px-6 py-3 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg font-semibold hover:bg-red-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {cancelingId === (booking._id || booking.id) ? 'Canceling...' : 'Cancel Booking'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
