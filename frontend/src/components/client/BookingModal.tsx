'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { bookingService, roomService, Room } from '@/lib/services'
import { useAuthStore } from '@/lib/auth-store'

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  hotel: {
    id: string
    name: string
    location: string
    pricePerNight: number
  }
}

export default function BookingModal({ isOpen, onClose, hotel }: BookingModalProps) {
  const router = useRouter()
  const { user } = useAuthStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [rooms, setRooms] = useState<Room[]>([])
  const [loadingRooms, setLoadingRooms] = useState(false)
  
  const [formData, setFormData] = useState({
    guestName: user?.name || '',
    guestEmail: user?.email || '',
    guestPhone: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    roomId: '',
    specialRequests: '',
  })

  // Redirect to login if not authenticated
  useEffect(() => {
    if (isOpen && !user) {
      onClose()
      router.push('/login?redirect=/client')
    }
  }, [isOpen, user, onClose, router])

  // Fetch available rooms for the hotel
  useEffect(() => {
    if (isOpen && hotel.id) {
      fetchRooms()
    }
  }, [isOpen, hotel.id])

  const fetchRooms = async () => {
    setLoadingRooms(true)
    setError(null)
    try {
      const response = await roomService.getAll(hotel.id)
      const availableRooms = response.data.filter((room: Room) => room.status === 'available')
      setRooms(availableRooms)
      
      if (availableRooms.length === 0) {
        setError('No rooms available for this hotel. Please contact the hotel to add rooms.')
      }
    } catch (err) {
      console.error('Error fetching rooms:', err)
      setError('Failed to load rooms. Please try again.')
    } finally {
      setLoadingRooms(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const calculateTotalPrice = () => {
    if (!formData.checkIn || !formData.checkOut || !formData.roomId) return 0
    const checkIn = new Date(formData.checkIn)
    const checkOut = new Date(formData.checkOut)
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
    
    const selectedRoom = rooms.find(room => room._id === formData.roomId)
    const pricePerNight = selectedRoom?.price || hotel.pricePerNight
    
    return nights > 0 ? nights * pricePerNight : 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      if (!user) {
        setError('Please log in to make a booking')
        setIsSubmitting(false)
        return
      }

      // Validate dates
      const checkIn = new Date(formData.checkIn)
      const checkOut = new Date(formData.checkOut)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      if (checkIn < today) {
        setError('Check-in date cannot be in the past')
        setIsSubmitting(false)
        return
      }

      if (checkOut <= checkIn) {
        setError('Check-out date must be after check-in date')
        setIsSubmitting(false)
        return
      }

      if (!formData.roomId) {
        setError('Please select a room')
        setIsSubmitting(false)
        return
      }

      const bookingData = {
        hotelId: hotel.id,
        roomId: formData.roomId,
        userId: user.id,
        guestName: formData.guestName,
        guestEmail: formData.guestEmail,
        guestPhone: formData.guestPhone || undefined,
        checkIn: new Date(formData.checkIn),
        checkOut: new Date(formData.checkOut),
        guests: Number(formData.guests),
        specialRequests: formData.specialRequests || undefined,
      }

      console.log('Booking data being sent:', bookingData)
      console.log('API baseURL:', bookingService)
      
      const response = await bookingService.create(bookingData)
      console.log('Booking response:', response)
      setSuccess(true)
      
      // Close modal after 2 seconds
      setTimeout(() => {
        onClose()
        setSuccess(false)
        setFormData({
          guestName: user?.name || '',
          guestEmail: user?.email || '',
          guestPhone: '',
          checkIn: '',
          checkOut: '',
          guests: 1,
          roomId: '',
          specialRequests: '',
        })
      }, 2000)
    } catch (err: any) {
      console.error('Booking error:', err)
      console.error('Error response:', err.response)
      console.error('Error config:', err.config)
      const errorMessage = err.response?.data?.message 
        ? Array.isArray(err.response.data.message) 
          ? err.response.data.message.join(', ')
          : err.response.data.message
        : 'Failed to create booking. Please try again.'
      setError(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  const totalPrice = calculateTotalPrice()
  const nights = formData.checkIn && formData.checkOut 
    ? Math.ceil((new Date(formData.checkOut).getTime() - new Date(formData.checkIn).getTime()) / (1000 * 60 * 60 * 24))
    : 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-dark-purple/95 border border-white/10 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-dark-purple/95 border-b border-white/10 px-6 py-4 flex items-center justify-between backdrop-blur-sm z-10">
          <div>
            <h2 className="text-2xl font-bold text-white">{hotel.name}</h2>
            <p className="text-white/60 text-sm mt-1">
              <svg className="w-4 h-4 inline mr-1 text-neon-lime" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {hotel.location}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mx-6 mt-6 bg-neon-lime/20 border border-neon-lime/50 text-neon-lime px-4 py-3 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Booking created successfully! Redirecting...</span>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mx-6 mt-6 bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-5">
            {/* Guest Information */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Guest Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="guestName"
                    value={formData.guestName}
                    onChange={handleChange}
                    required
                    className="w-full bg-dark-200/50 border border-white/10 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-neon-lime transition-colors"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="guestEmail"
                    value={formData.guestEmail}
                    onChange={handleChange}
                    required
                    className="w-full bg-dark-200/50 border border-white/10 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-neon-lime transition-colors"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="guestPhone"
                    value={formData.guestPhone}
                    onChange={handleChange}
                    className="w-full bg-dark-200/50 border border-white/10 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-neon-lime transition-colors"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Number of Guests *
                  </label>
                  <input
                    type="number"
                    name="guests"
                    value={formData.guests}
                    onChange={handleChange}
                    min="1"
                    max="10"
                    required
                    className="w-full bg-dark-200/50 border border-white/10 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-neon-lime transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Room Selection */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Select Room</h3>
              {loadingRooms ? (
                <div className="bg-dark-200/30 border border-white/10 rounded-lg p-4 text-center">
                  <p className="text-white/60">Loading available rooms...</p>
                </div>
              ) : rooms.length === 0 ? (
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
                  <p className="text-red-400">No rooms available for this hotel. Please contact the hotel administrator to add rooms.</p>
                </div>
              ) : (
                <div className="grid gap-3">
                  {rooms.map((room) => (
                    <label
                      key={room._id}
                      className={`bg-dark-200/30 border rounded-lg p-4 cursor-pointer transition-all ${
                        formData.roomId === room._id
                          ? 'border-neon-lime bg-neon-lime/10'
                          : 'border-white/10 hover:border-white/30'
                      }`}
                    >
                      <input
                        type="radio"
                        name="roomId"
                        value={room._id}
                        checked={formData.roomId === room._id}
                        onChange={handleChange}
                        className="hidden"
                      />
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-white font-semibold">Room {room.roomNumber}</h4>
                            <span className="text-xs bg-neon-lime/20 text-neon-lime px-2 py-0.5 rounded">
                              {room.type}
                            </span>
                          </div>
                          <p className="text-white/60 text-sm">Capacity: {room.capacity} guests</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-neon-lime">${room.price}</div>
                          <div className="text-xs text-white/60">per night</div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Booking Dates */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Booking Dates</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Check-in Date *
                  </label>
                  <input
                    type="date"
                    name="checkIn"
                    value={formData.checkIn}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                    className="w-full bg-dark-200/50 border border-white/10 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-neon-lime transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Check-out Date *
                  </label>
                  <input
                    type="date"
                    name="checkOut"
                    value={formData.checkOut}
                    onChange={handleChange}
                    min={formData.checkIn || new Date().toISOString().split('T')[0]}
                    required
                    className="w-full bg-dark-200/50 border border-white/10 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-neon-lime transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Special Requests */}
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Special Requests (Optional)
              </label>
              <textarea
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleChange}
                rows={3}
                className="w-full bg-dark-200/50 border border-white/10 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-neon-lime transition-colors resize-none"
                placeholder="Any special requests or requirements..."
              />
            </div>

            {/* Price Summary */}
            {nights > 0 && formData.roomId && (
              <div className="bg-dark-200/30 border border-white/10 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-3">Price Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-white/80">
                    <span>${rooms.find(r => r._id === formData.roomId)?.price || hotel.pricePerNight} × {nights} night{nights !== 1 ? 's' : ''}</span>
                    <span>${totalPrice}</span>
                  </div>
                  <div className="border-t border-white/10 pt-2 mt-2">
                    <div className="flex justify-between text-xl font-bold">
                      <span className="text-white">Total</span>
                      <span className="text-neon-lime">${totalPrice}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || success}
              className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-dark-purple" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : success ? (
                '✓ Booked!'
              ) : (
                'Confirm Booking'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
