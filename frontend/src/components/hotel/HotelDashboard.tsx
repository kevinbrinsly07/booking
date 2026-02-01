'use client'

import { useState, useEffect } from 'react'
import { roomService, bookingService } from '@/lib/services'
import type { Room, Booking } from '@/lib/services'

export default function HotelDashboard() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [roomsData, bookingsData] = await Promise.all([
        roomService.getAll(),
        bookingService.getAll()
      ])
      setRooms(roomsData.data)
      setBookings(bookingsData.data)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const totalBookings = bookings.length
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length
  const totalRevenue = bookings.reduce((sum, b) => sum + b.totalAmount, 0)
  const availableRooms = rooms.filter(r => r.status === 'available').length
  const occupancyRate = rooms.length > 0 
    ? Math.round(((rooms.length - availableRooms) / rooms.length) * 100) 
    : 0

  const stats = [
    { label: 'Total Bookings', value: totalBookings, change: confirmedBookings > 0 ? `${confirmedBookings} confirmed` : 'No bookings', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
    { label: 'Revenue', value: `$${totalRevenue.toLocaleString()}`, change: `${totalBookings} bookings`, icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { label: 'Occupancy Rate', value: `${occupancyRate}%`, change: `${rooms.length - availableRooms} occupied`, icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { label: 'Available Rooms', value: availableRooms, change: `${rooms.length} total`, icon: 'M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z' },
  ]

  // Get top 3 rooms by bookings (you can enhance this logic with actual booking counts per room)
  const featuredRooms = rooms.slice(0, 3).map((room, index) => ({
    id: room._id || room.id || `room-${index}`,
    name: room.type,
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&h=400&fit=crop',
    roomNumber: room.roomNumber,
    price: room.price,
  }))

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-white text-xl">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-8 neon-glow">Dashboard Overview</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="card-elevated group hover:scale-105 transition-transform duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-neon-lime/10 rounded-lg border border-neon-lime/30">
                <svg className="w-6 h-6 text-neon-lime" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                </svg>
              </div>
              <span className="text-neon-lime text-sm font-bold">{stat.change}</span>
            </div>
            <p className="text-white/60 text-sm mb-2">{stat.label}</p>
            <p className="text-3xl font-bold text-white group-hover:text-neon-lime transition-colors">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Featured Rooms Performance */}
      <div className="card-elevated mb-8">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
          <svg className="w-6 h-6 text-neon-lime mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
          Featured Rooms
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          {featuredRooms.length > 0 ? (
            featuredRooms.map((room) => (
              <div key={room.id} className="group cursor-pointer overflow-hidden rounded-lg">
                <div className="relative h-48 overflow-hidden rounded-lg">
                  <img 
                    src={room.image} 
                    alt={room.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-purple via-dark-purple/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h4 className="text-white font-bold text-lg mb-2">{room.name}</h4>
                    <div className="flex justify-between items-center">
                      <div className="text-white/80 text-sm">
                        Room <span className="text-neon-lime font-bold">{room.roomNumber}</span>
                      </div>
                      <div className="text-neon-lime font-bold">${room.price}/night</div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center text-white/60 py-8">No rooms available</div>
          )}
        </div>
      </div>

      <div className="card-elevated">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
          <svg className="w-6 h-6 text-neon-lime mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Recent Bookings
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-white/10">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-neon-lime">Guest</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-neon-lime">Room</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-neon-lime">Check-in</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-neon-lime">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-neon-lime">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {bookings.slice(0, 5).map((booking) => {
                const userIdStr = String(booking.userId)
                const roomIdStr = String(booking.roomId)
                const bookingId = booking._id || booking.id
                return (
                  <tr key={bookingId} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-4 text-white">Guest #{userIdStr.slice(0, 8)}</td>
                    <td className="px-4 py-4 text-white/80">Room #{roomIdStr.slice(0, 8)}</td>
                    <td className="px-4 py-4 text-white/80">{new Date(booking.checkIn).toLocaleDateString()}</td>
                    <td className="px-4 py-4">
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${
                        booking.status === 'confirmed' 
                          ? 'bg-neon-lime/20 text-neon-lime border-neon-lime/30'
                          : booking.status === 'pending'
                          ? 'bg-white/10 text-white border-white/30'
                          : 'bg-red-500/20 text-red-400 border-red-500/30'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-neon-lime font-bold">${booking.totalAmount}</td>
                  </tr>
                )
              })}
              {bookings.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-white/60">No bookings yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
