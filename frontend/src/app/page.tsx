import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <nav className="border-b border-white/10 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center">
              <svg className="w-8 h-8 text-neon-lime mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-2xl font-bold gradient-text neon-glow">
                Hotel Booking
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login" className="px-6 py-2 text-white hover:text-neon-lime transition-colors font-semibold">
                Login
              </Link>
              <Link 
                href="/register" 
                className="btn-primary"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Hero Images Grid */}
        <div className="mb-16 grid grid-cols-4 gap-4 h-64 rounded-2xl overflow-hidden">
          <div className="col-span-2 relative overflow-hidden group">
            <img 
              src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=800&fit=crop" 
              alt="Luxury Hotel"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-purple/80 to-transparent" />
          </div>
          <div className="relative overflow-hidden group">
            <img 
              src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&h=800&fit=crop" 
              alt="Beach Resort"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-purple/80 to-transparent" />
          </div>
          <div className="relative overflow-hidden group">
            <img 
              src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&h=800&fit=crop" 
              alt="Mountain Resort"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-purple/80 to-transparent" />
          </div>
        </div>

        <div className="text-center mb-20">
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 neon-glow">
            Welcome to
            <span className="block gradient-text mt-2">Hotel Booking System</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/70 mb-12 max-w-3xl mx-auto">
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

        {/* Portal Selection Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <Link 
            href="/client"
            className="card-elevated group hover:scale-105 transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-center justify-center mb-6">
              <div className="p-6 bg-neon-lime/10 rounded-2xl border border-neon-lime/30 group-hover:bg-neon-lime/20 transition-all">
                <svg className="w-16 h-16 text-neon-lime" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
            <h2 className="text-3xl font-bold mb-4 text-white group-hover:text-neon-lime transition-colors text-center">
              For Clients
            </h2>
            <p className="text-white/70 text-center text-lg">
              Browse available hotels, make bookings, and manage your reservations with ease
            </p>
            <div className="mt-6 flex items-center justify-center text-neon-lime font-semibold">
              <span>Explore Hotels</span>
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </Link>

          <Link 
            href="/hotel"
            className="card-elevated group hover:scale-105 transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-center justify-center mb-6">
              <div className="p-6 bg-neon-lime/10 rounded-2xl border border-neon-lime/30 group-hover:bg-neon-lime/20 transition-all">
                <svg className="w-16 h-16 text-neon-lime" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
            <h2 className="text-3xl font-bold mb-4 text-white group-hover:text-neon-lime transition-colors text-center">
              For Hotels
            </h2>
            <p className="text-white/70 text-center text-lg">
              Manage your property, rooms, and bookings with our powerful dashboard
            </p>
            <div className="mt-6 flex items-center justify-center text-neon-lime font-semibold">
              <span>Go to Dashboard</span>
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-white/60">
            © 2026 Hotel Booking System. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  )
}
