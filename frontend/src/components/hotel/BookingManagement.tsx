'use client'

import { useState, useEffect } from 'react'
import { bookingService, roomService } from '@/lib/services'
import type { Booking, Room } from '@/lib/services'

export default function BookingManagement() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [rooms, setRooms] = useState<Record<string, Room>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [bookingsRes, roomsRes] = await Promise.all([
        bookingService.getAll(),
        roomService.getAll()
      ])
      setBookings(bookingsRes.data)
      
      // Create a map of room IDs to room data
      const roomsMap = roomsRes.data.reduce((acc, room) => {
        const roomId = room._id || room.id
        if (roomId) acc[roomId] = room
        return acc
      }, {} as Record<string, Room>)
      setRooms(roomsMap)
    } catch (error) {
      console.error('Error fetching booking data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (bookingId: string, action: string) => {
    try {
      setError(null)
      setSuccessMessage(null)
      
      if (action === 'confirm') {
        await bookingService.confirm(bookingId)
        setSuccessMessage('Booking confirmed successfully!')
      } else if (action === 'cancel') {
        await bookingService.cancel(bookingId)
        setSuccessMessage('Booking cancelled successfully!')
      }
      
      await fetchData() // Refresh data
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (error: any) {
      console.error('Error updating booking:', error)
      setError(error.response?.data?.message || 'Failed to update booking status')
      
      // Clear error message after 5 seconds
      setTimeout(() => setError(null), 5000)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
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
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-white text-xl">Loading bookings...</div>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-8 neon-glow">Booking Management</h2>
      
      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 p-4 bg-neon-lime/20 border border-neon-lime/30 rounded-lg text-neon-lime flex items-center">
          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {successMessage}
        </div>
      )}
      
      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 flex items-center">
          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          {error}
        </div>
      )}
      
      {/* Card Grid View */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {bookings.length > 0 ? (
          bookings.map((booking) => {
            const room = rooms[String(booking.roomId)]
            const bookingId = booking._id || booking.id || ''
            return (
              <div key={bookingId} className="card-elevated hover:scale-105 transition-all duration-300 overflow-hidden">
                {/* Room Image */}
                <div className="relative h-40 -mx-6 -mt-6 mb-4 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400&h=300&fit=crop" 
                    alt={room ? `Room ${room.roomNumber}` : 'Room'}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-purple/90 to-transparent" />
                  <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${getStatusColor(booking.status)} uppercase backdrop-blur-sm`}>
                      {booking.status}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 text-white">
                    <p className="text-lg font-bold">Room {room?.roomNumber || 'N/A'}</p>
                  </div>
                </div>
                
                {/* Booking Details */}
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-white/60">Guest</p>
                    <p className="text-white font-semibold">User #{String(booking.userId).slice(0, 8)}</p>
                  </div>
                  
                  <div className="flex items-center text-white/70 text-sm">
                    <svg className="w-4 h-4 mr-2 text-neon-lime" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{new Date(booking.checkIn).toLocaleDateString()} to {new Date(booking.checkOut).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-white/10">
                    <span className="text-2xl font-bold text-neon-lime">${booking.totalAmount}</span>
                    <select 
                      className="input-field text-sm py-2 px-3"
                      onChange={(e) => {
                        if (e.target.value) {
                          handleStatusChange(bookingId, e.target.value)
                          e.target.value = ''
                        }
                      }}
                    >
                      <option value="">Action</option>
                      {booking.status === 'pending' && <option value="confirm">Confirm</option>}
                      {booking.status !== 'cancelled' && <option value="cancel">Cancel</option>}
                    </select>
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <div className="col-span-3 text-center text-white/60 py-8">No bookings yet</div>
        )}
      </div>

      {/* Table View */}
      <div className="card-elevated overflow-hidden">
        <h3 className="text-xl font-bold text-white mb-4 px-6 pt-4">All Bookings</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-white/10">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-neon-lime">Guest</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-neon-lime">Room</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-neon-lime">Check-in</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-neon-lime">Check-out</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-neon-lime">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-neon-lime">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-neon-lime">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {bookings.length > 0 ? (
                bookings.map((booking) => {
                  const room = rooms[String(booking.roomId)]
                  const bookingId = booking._id || booking.id || ''
                  return (
                    <tr key={bookingId} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 text-white font-medium">User #{String(booking.userId).slice(0, 8)}</td>
                      <td className="px-6 py-4 text-white">Room {room?.roomNumber || 'N/A'}</td>
                      <td className="px-6 py-4 text-white/80">{new Date(booking.checkIn).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-white/80">{new Date(booking.checkOut).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${getStatusColor(booking.status)} uppercase`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-neon-lime">${booking.totalAmount}</td>
                      <td className="px-6 py-4">
                        <select 
                          className="input-field text-sm py-2"
                          onChange={(e) => {
                            if (e.target.value) {
                              handleStatusChange(bookingId, e.target.value)
                              e.target.value = ''
                            }
                          }}
                        >
                          <option value="">Action</option>
                          {booking.status === 'pending' && <option value="confirm">Confirm</option>}
                          {booking.status !== 'cancelled' && <option value="cancel">Cancel</option>}
                        </select>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-white/60">No bookings yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
