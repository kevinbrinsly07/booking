'use client'

import Link from 'next/link'
import React, { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import img1 from '../assets/img1.webp';
import img2 from '../assets/img2.webp';
import img3 from '../assets/img3.webp';
import img4 from '../assets/img4.webp';
import img5 from '../assets/img5.webp';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}


export default function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    if (typeof window === 'undefined' || !carouselRef.current) return

    // Create parallax effect for the image container
    const imageContainer = carouselRef.current.querySelector('.parallax-container')
    
    if (imageContainer) {
      gsap.fromTo(imageContainer, 
        { y: 0 }, // Start position
        {
          y: -150, // Reduced movement for better coverage
          ease: 'none',
          scrollTrigger: {
            trigger: carouselRef.current,
            start: 'top 80%', // Start when carousel is 80% from top of viewport
            end: 'bottom 20%', // End when carousel bottom is 20% from top of viewport
            scrub: 1.5, // Smooth scrubbing with slight delay for more natural feel
            invalidateOnRefresh: true
          }
        }
      )
    }

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
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
      <div className="relative md:h-screen flex items-center justify-center overflow-hidden">
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
        <div className="absolute bottom-5 md:bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
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
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:mt-0 mt-[120px]">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 neon-glow">
            Welcome to
            <span className="block gradient-text mt-3 pb-3">Hotel Booking System</span>
          </h1>
          <p className="text-lg md:text-2xl text-white/70 mb-12 max-w-3xl mx-auto leading-relaxed">
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
      <div className="py-10 lg:py-40 relative">
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
      <div className="py-10 lg:py-20">
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

      {/* Modern Hotel Gallery Carousel */}
      <div ref={carouselRef} className="relative h-[500px] overflow-hidden bg-transparent">
        <div className="parallax-container h-[700px] absolute inset-0">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${
                index === currentImageIndex 
                  ? 'opacity-100 scale-100' 
                  : 'opacity-0 scale-105'
              }`}
              style={{
                backgroundImage: `url(${image.src})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center top', // Position from top to ensure full coverage
                backgroundRepeat: 'no-repeat',
                backgroundAttachment: 'fixed' // Helps with parallax feel
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-10 lg:py-40 relative">
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
      <footer className="border-t border-white/10 mt-16 relative bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div className="col-span-1">
              <div className="flex items-center mb-4">
                <svg className="w-8 h-8 text-neon-lime mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="text-xl font-bold gradient-text">Hotel Booking</span>
              </div>
              <p className="text-white/70 text-sm leading-relaxed">
                Your trusted partner for premium hotel bookings worldwide. Experience seamless reservations with our modern platform.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/client" className="text-white/70 hover:text-neon-lime transition-colors text-sm">Browse Hotels</Link></li>
                <li><Link href="/hotel" className="text-white/70 hover:text-neon-lime transition-colors text-sm">Hotel Dashboard</Link></li>
                <li><Link href="/register" className="text-white/70 hover:text-neon-lime transition-colors text-sm">Sign Up</Link></li>
                <li><Link href="/login" className="text-white/70 hover:text-neon-lime transition-colors text-sm">Login</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-white/70 hover:text-neon-lime transition-colors text-sm">Help Center</a></li>
                <li><a href="#" className="text-white/70 hover:text-neon-lime transition-colors text-sm">Contact Us</a></li>
                <li><a href="#" className="text-white/70 hover:text-neon-lime transition-colors text-sm">Privacy Policy</a></li>
                <li><a href="#" className="text-white/70 hover:text-neon-lime transition-colors text-sm">Terms of Service</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-white font-semibold mb-4">Contact</h3>
              <ul className="space-y-2">
                <li className="text-white/70 text-sm">Email: support@hotelbooking.com</li>
                <li className="text-white/70 text-sm">Phone: +1 (555) 123-4567</li>
                <li className="text-white/70 text-sm">Address: 123 Hotel St, City, State</li>
              </ul>
              <div className="flex space-x-4 mt-4">
                <a href="#" className="text-white/70 hover:text-neon-lime transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-white/70 hover:text-neon-lime transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
                <a href="#" className="text-white/70 hover:text-neon-lime transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/10 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-white/60 text-sm">
                © 2026 Hotel Booking System. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-white/60 hover:text-white text-sm transition-colors">Privacy</a>
                <a href="#" className="text-white/60 hover:text-white text-sm transition-colors">Terms</a>
                <a href="#" className="text-white/60 hover:text-white text-sm transition-colors">Cookies</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
