'use client'

import { useState } from 'react'

interface SearchParams {
  location: string
  checkIn: string
  checkOut: string
  guests: number
}

interface SearchFormProps {
  onSearch: (params: SearchParams) => void
}

export default function SearchForm({ onSearch }: SearchFormProps) {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchParams)
  }

  const popularDestinations = [
    { name: 'New York', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=300&h=200&fit=crop' },
    { name: 'Miami', image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=300&h=200&fit=crop' },
    { name: 'Los Angeles', image: 'https://images.unsplash.com/photo-1580655653885-65763b2597d0?w=300&h=200&fit=crop' },
    { name: 'Chicago', image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=300&h=200&fit=crop' },
  ]

  return (
    <div>
      <div className="card-elevated mb-8">
        <div className="flex items-center mb-6">
          <svg className="w-6 h-6 text-neon-lime mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h2 className="text-2xl font-bold text-white">Search Hotels</h2>
        </div>
      
      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-semibold text-white/90 mb-2">
            Location
          </label>
          <input
            type="text"
            value={searchParams.location}
            onChange={(e) => setSearchParams({ ...searchParams, location: e.target.value })}
            className="input-field"
            placeholder="City or hotel name"
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-white/90 mb-2">
            Check-in
          </label>
          <input
            type="date"
            value={searchParams.checkIn}
            onChange={(e) => setSearchParams({ ...searchParams, checkIn: e.target.value })}
            className="input-field"
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-white/90 mb-2">
            Check-out
          </label>
          <input
            type="date"
            value={searchParams.checkOut}
            onChange={(e) => setSearchParams({ ...searchParams, checkOut: e.target.value })}
            className="input-field"
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-white/90 mb-2">
            Guests
          </label>
          <input
            type="number"
            min="1"
            value={searchParams.guests}
            onChange={(e) => setSearchParams({ ...searchParams, guests: parseInt(e.target.value) || 1 })}
            className="input-field"
          />
        </div>
        
        <div className="md:col-span-2 lg:col-span-4">
          <button
            type="submit"
            className="btn-primary w-full"
          >
            <span className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search Hotels
            </span>
          </button>
        </div>
      </form>
      </div>

      {/* Popular Destinations */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <svg className="w-5 h-5 text-neon-lime mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Popular Destinations
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {popularDestinations.map((dest) => (
            <button
              key={dest.name}
              onClick={() => {
                const newParams = { ...searchParams, location: dest.name }
                setSearchParams(newParams)
                onSearch(newParams)
              }}
              className="group relative h-32 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300"
            >
              <img 
                src={dest.image} 
                alt={dest.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-purple via-dark-purple/50 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-bold text-lg drop-shadow-lg">{dest.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
