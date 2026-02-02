'use client'

import Link from 'next/link'
import React, { useState, useEffect } from 'react'

import img1 from '../assets/img1.webp';
import img2 from '../assets/img2.webp';
import img3 from '../assets/img3.webp';
import img4 from '../assets/img4.webp';
import img5 from '../assets/img5.webp';


export default function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const heroImages = [
    {
      src: img1.src,
      alt: "Luxury Hotel",
      title: "Luxury Suites",
      subtitle: "Premium accommodations"
    },
    {
      src: img2.src,
      alt: "Beach Resort",
      title: "Beach Paradise",
      subtitle: "Oceanfront views"
    },
    {
      src: img3.src,
      alt: "Mountain Resort",
      title: "Mountain Escape",
      subtitle: "Alpine retreats"
    },
    {
      src: img4.src,
      alt: "City Hotel",
      title: "Urban Luxury",
      subtitle: "City center elegance"
    },
    {
      src: img5.src,
      alt: "Resort Pool",
      title: "Tropical Paradise",
      subtitle: "Crystal clear waters"
    }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % heroImages.length
      )
    }, 5000) // Change image every 5 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center">
              <svg className="w-8 h-8 text-neon-lime mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              {/* <span className="text-2xl font-bold gradient-text neon-glow">
                Hotel Booking
              </span> */}
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login" className="px-6 py-2 text-white hover:text-neon-lime transition-colors font-semibold">
                Login
              </Link>
              <Link 
                href="/register?role=client" 
                className="btn-primary"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Full Image Carousel */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Carousel Images */}
        <div className="absolute inset-0">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-dark-purple/70 via-dark-purple/50 to-transparent" />
            </div>
          ))}
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentImageIndex
                  ? 'bg-neon-lime scale-125'
                  : 'bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 neon-glow">
            Welcome to
            <span className="block gradient-text mt-3 pb-3">Hotel Booking System</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/70 mb-12 max-w-3xl mx-auto leading-relaxed">
            Manage your hotel bookings efficiently with our comprehensive platform.
            Experience seamless booking management like never before.
          </p>
          
          {/* Features highlight */}
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <div className="flex items-center bg-white/5 px-6 py-3 rounded-full border border-white/10">
              <svg className="w-5 h-5 text-neon-lime mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-white/90 font-semibold">Instant Booking</span>
            </div>
            <div className="flex items-center bg-white/5 px-6 py-3 rounded-full border border-white/10">
              <svg className="w-5 h-5 text-neon-lime mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="text-white/90 font-semibold">Secure Payment</span>
            </div>
            <div className="flex items-center bg-white/5 px-6 py-3 rounded-full border border-white/10">
              <svg className="w-5 h-5 text-neon-lime mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="text-white/90 font-semibold">Fast Support</span>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="py-40 relative">
        <div className="absolute inset-0 opacity-50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-white mb-16 neon-glow">
            Why Choose Our Platform?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="flex items-center justify-center mb-6">
                <div className="p-6 bg-neon-lime/10 rounded-2xl border border-neon-lime/30 group-hover:bg-neon-lime/20 group-hover:scale-110 transition-all duration-300">
                  <svg className="w-16 h-16 text-neon-lime" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Modern Interface</h3>
              <p className="text-white/70">Intuitive design that makes booking effortless and enjoyable</p>
            </div>
            <div className="text-center group">
              <div className="flex items-center justify-center mb-6">
                <div className="p-6 bg-neon-lime/10 rounded-2xl border border-neon-lime/30 group-hover:bg-neon-lime/20 group-hover:scale-110 transition-all duration-300">
                  <svg className="w-16 h-16 text-neon-lime" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Global Reach</h3>
              <p className="text-white/70">Connect with hotels worldwide from the comfort of your home</p>
            </div>
            <div className="text-center group">
              <div className="flex items-center justify-center mb-6">
                <div className="p-6 bg-neon-lime/10 rounded-2xl border border-neon-lime/30 group-hover:bg-neon-lime/20 group-hover:scale-110 transition-all duration-300">
                  <svg className="w-16 h-16 text-neon-lime" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Trusted Service</h3>
              <p className="text-white/70">Millions of satisfied customers trust our booking platform</p>
            </div>
          </div>
        </div>
      </div>

      {/* Portal Selection Cards */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="card-elevated group hover:scale-105 transition-all duration-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>
              <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                <img 
                  src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=200&h=200&fit=crop" 
                  alt="Client interface"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex items-center justify-center mb-6 relative z-10">
                <div className="p-6 bg-neon-lime/10 rounded-2xl border border-neon-lime/30 group-hover:bg-neon-lime/20 transition-all">
                  <svg className="w-16 h-16 text-neon-lime" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <h2 className="text-3xl font-bold mb-4 text-white group-hover:text-neon-lime transition-colors text-center relative z-10">
                For Clients
              </h2>
              <p className="text-white/70 text-center text-lg mb-6 relative z-10">
                Browse available hotels, make bookings, and manage your reservations with ease
              </p>
              <div className="flex flex-col gap-3 relative z-10">
                <Link href="/client" className="btn-primary text-center">
                  Explore Hotels
                </Link>
                <Link href="/register?role=client" className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 hover:border-neon-lime/50 transition-all font-semibold text-center">
                  Sign Up as Client
                </Link>
              </div>
            </div>

            <div className="card-elevated group hover:scale-105 transition-all duration-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-teal-500/10"></div>
              <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                <img 
                  src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop" 
                  alt="Hotel management"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex items-center justify-center mb-6 relative z-10">
                <div className="p-6 bg-neon-lime/10 rounded-2xl border border-neon-lime/30 group-hover:bg-neon-lime/20 transition-all">
                  <svg className="w-16 h-16 text-neon-lime" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
              <h2 className="text-3xl font-bold mb-4 text-white group-hover:text-neon-lime transition-colors text-center relative z-10">
                For Hotels
              </h2>
              <p className="text-white/70 text-center text-lg mb-6 relative z-10">
                Manage your property, rooms, and bookings with our powerful dashboard
              </p>
              <div className="flex flex-col gap-3 relative z-10">
                <Link href="/hotel" className="btn-primary text-center">
                  Go to Dashboard
                </Link>
                <Link href="/register?role=hotel" className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 hover:border-neon-lime/50 transition-all font-semibold text-center">
                  Sign Up as Hotel
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-40 relative">
        <div className="absolute inset-0 opacity-50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="group">
              <div className="text-4xl md:text-5xl font-bold text-neon-lime mb-2">10K+</div>
              <p className="text-white/70">Hotels Worldwide</p>
            </div>
            <div className="group">
              <div className="text-4xl md:text-5xl font-bold text-neon-lime mb-2">500K+</div>
              <p className="text-white/70">Happy Customers</p>
            </div>
            <div className="group">
              <div className="text-4xl md:text-5xl font-bold text-neon-lime mb-2">1M+</div>
              <p className="text-white/70">Bookings Made</p>
            </div>
            <div className="group">
              <div className="text-4xl md:text-5xl font-bold text-neon-lime mb-2">99.9%</div>
              <p className="text-white/70">Uptime Guarantee</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-xs text-white/60">
            © 2026 Hotel Booking System. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  )
}
