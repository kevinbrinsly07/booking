'use client'

import { useState, useEffect } from 'react'
import BookingModal from './BookingModal'
import { hotelService } from '@/lib/services'

interface Hotel {
  _id: string
  name: string
  location: string
  description: string
  rating: number
  amenities: string[]
  images: string[]
  isActive: boolean
}

export default function HotelList() {
  const [currentImageIndex, setCurrentImageIndex] = useState<{ [key: string]: number }>({})
  const [selectedHotel, setSelectedHotel] = useState<{
    id: string
    name: string
    location: string
    pricePerNight: number
  } | null>(null)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchHotels()
  }, [])

  const fetchHotels = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await hotelService.getAll()
      setHotels(response.data)
    } catch (err) {
      console.error('Error fetching hotels:', err)
      setError('Failed to load hotels. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleBookNow = (hotel: { id: string; name: string; location: string; pricePerNight: number }) => {
    setSelectedHotel(hotel)
    setIsBookingModalOpen(true)
  }

  const closeBookingModal = () => {
    setIsBookingModalOpen(false)
    setSelectedHotel(null)
  }

  const nextImage = (hotelId: string, imagesLength: number) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [hotelId]: ((prev[hotelId] || 0) + 1) % imagesLength
    }))
  }

  const prevImage = (hotelId: string, imagesLength: number) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [hotelId]: ((prev[hotelId] || 0) - 1 + imagesLength) % imagesLength
    }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-lime mx-auto mb-4"></div>
          <p className="text-white/60">Loading hotels...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button onClick={fetchHotels} className="btn-primary">
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (hotels.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-white/60 mb-4">No hotels available at the moment.</p>
          <button onClick={fetchHotels} className="btn-primary">
            Refresh
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {hotels.map((hotel) => {
        const currentIndex = currentImageIndex[hotel._id] || 0
        const displayImages = hotel.images.length > 0 ? hotel.images : ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop']
        return (
        <div key={hotel._id} className="card-elevated group cursor-pointer overflow-hidden">
          {/* Image carousel */}
          <div className="relative h-56 -mx-6 -mt-6 mb-6 overflow-hidden bg-dark-200">
            <img 
              src={displayImages[currentIndex]} 
              alt={hotel.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-purple/80 via-transparent to-transparent" />
            
            {/* Image navigation */}
            {displayImages.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); prevImage(hotel._id, displayImages.length); }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-dark-purple/80 hover:bg-dark-purple text-white p-2 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); nextImage(hotel._id, displayImages.length); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-dark-purple/80 hover:bg-dark-purple text-white p-2 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                
                {/* Image indicators */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {displayImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(prev => ({ ...prev, [hotel._id]: idx })); }}
                      className={`w-2 h-2 rounded-full transition-all ${
                        idx === currentIndex ? 'bg-neon-lime w-6' : 'bg-white/50 hover:bg-white/70'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
            
            <div className="absolute top-4 left-4">
              <span className="bg-neon-lime text-dark-purple px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                {hotel.isActive ? 'Available' : 'Fully Booked'}
              </span>
            </div>
          </div>
          
          {/* Hotel info */}
          <div>
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-neon-lime transition-colors">
              {hotel.name}
            </h3>
            <p className="text-white/60 mb-4 flex items-center">
              <svg className="w-4 h-4 mr-1 text-neon-lime" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {hotel.location}
            </p>
            
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${i < Math.floor(hotel.rating) ? 'text-neon-lime' : 'text-white/20'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-2 text-white/80 text-sm font-semibold">{hotel.rating}</span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-neon-lime">
                  View Rooms
                </div>
                <div className="text-xs text-white/60">Multiple options</div>
              </div>
            </div>
            
            <button 
              onClick={() => handleBookNow({
                id: hotel._id,
                name: hotel.name,
                location: hotel.location,
                pricePerNight: 0 // Will be determined by selected room
              })}
              className="btn-primary w-full"
            >
              Book Now
            </button>
          </div>
        </div>
      )})
      }
      
      {/* Booking Modal */}
      {selectedHotel && (
        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={closeBookingModal}
          hotel={selectedHotel}
        />
      )}
    </div>
  )
}
