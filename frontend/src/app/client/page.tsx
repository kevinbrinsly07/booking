"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import SearchForm from "@/components/client/SearchForm";
import BookingList from "@/components/client/BookingList";
import HotelList from "@/components/client/HotelList";
import { hotelService, Hotel } from "@/lib/services";

export default function ClientPortal() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'search' | 'bookings' | 'favorites' | 'profile'>('search');
  const [searchParams, setSearchParams] = useState({});
  const [favorites, setFavorites] = useState<string[]>([]); // Store hotel IDs as strings
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  const [featuredHotels, setFeaturedHotels] = useState<Hotel[]>([]);
  const [featuredHotelsLoading, setFeaturedHotelsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login?returnTo=client');
    }
  }, [user]);

  useEffect(() => {
    const fetchFeaturedHotels = async () => {
      try {
        setFeaturedHotelsLoading(true);
        const response = await hotelService.getAll();
        // Take first 3 hotels as featured
        setFeaturedHotels(response.data.slice(0, 3));
      } catch (error) {
        console.error('Error fetching featured hotels:', error);
        // Fallback to mock data if API fails
        setFeaturedHotels([]);
      } finally {
        setFeaturedHotelsLoading(false);
      }
    };

    fetchFeaturedHotels();
  }, []);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen">
      <nav className="bg-dark-purple/50 border-b border-white/10 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center">
              <svg
                className="w-8 h-8 text-neon-lime mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <h1 className="text-xl font-bold gradient-text">Client Portal</h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-3">
              <button
                onClick={() => setActiveTab("search")}
                className={`px-5 py-2 rounded-lg font-semibold transition-all duration-200 ${
                  activeTab === "search"
                    ? "bg-neon-lime text-dark-purple"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                Search Hotels
              </button>
              <button
                onClick={() => setActiveTab("bookings")}
                className={`px-5 py-2 rounded-lg font-semibold transition-all duration-200 ${
                  activeTab === "bookings"
                    ? "bg-neon-lime text-dark-purple"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                My Bookings
              </button>
              <button
                onClick={() => setActiveTab("favorites")}
                className={`px-5 py-2 rounded-lg font-semibold transition-all duration-200 ${
                  activeTab === "favorites"
                    ? "bg-neon-lime text-dark-purple"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                Favorites
              </button>
              <button
                onClick={() => setActiveTab("profile")}
                className={`px-5 py-2 rounded-lg font-semibold transition-all duration-200 ${
                  activeTab === "profile"
                    ? "bg-neon-lime text-dark-purple"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                Profile
              </button>
              <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-white/10">
                <button
                  onClick={() => router.push("/profile")}
                  className="text-sm text-neon-lime hover:text-neon-lime/80 font-semibold flex items-center"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  {user.name}
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg font-semibold hover:bg-red-500/30 transition-all duration-200"
                >
                  Logout
                </button>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-3">
              <button
                onClick={() => router.push("/profile")}
                className="text-sm text-neon-lime hover:text-neon-lime/80 font-semibold flex items-center"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
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
                    setActiveTab("search");
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    activeTab === "search"
                      ? "bg-neon-lime text-dark-purple"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  }`}
                >
                  Search Hotels
                </button>
                <button
                  onClick={() => {
                    setActiveTab("bookings");
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    activeTab === "bookings"
                      ? "bg-neon-lime text-dark-purple"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  }`}
                >
                  My Bookings
                </button>
                <button
                  onClick={() => {
                    setActiveTab("favorites");
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    activeTab === "favorites"
                      ? "bg-neon-lime text-dark-purple"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  }`}
                >
                  Favorites
                </button>
                <button
                  onClick={() => {
                    setActiveTab("profile");
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    activeTab === "profile"
                      ? "bg-neon-lime text-dark-purple"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  }`}
                >
                  Profile
                </button>
                <div className="border-t border-white/10 pt-2 mt-4">
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
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
        {activeTab === "search" ? (
          <div>
            <SearchForm onSearch={setSearchParams} />
            <HotelList searchParams={searchParams} />
          </div>
        ) : activeTab === "bookings" ? (
          <BookingList />
        ) : activeTab === "favorites" ? (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Your Favorite Hotels</h2>
              <span className="text-white/70">{favorites.length} saved</span>
            </div>
            
            {favorites.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredHotels
                  .filter(hotel => favorites.includes(hotel._id || hotel.id || ''))
                  .map((hotel) => (
                  <div key={hotel._id || hotel.id || Math.random()} className="card-elevated p-6 group hover:scale-105 transition-all duration-300">
                    <div className="aspect-video bg-gradient-to-br from-neon-lime/20 to-purple-500/20 rounded-lg mb-4 flex items-center justify-center relative">
                      <svg className="w-12 h-12 text-neon-lime/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <button
                        onClick={() => {
                          setFavorites(prev => prev.filter(id => id !== hotel.id));
                        }}
                        className="absolute top-3 right-3 p-2 rounded-full bg-red-500/20 hover:bg-red-500/30 transition-colors"
                      >
                        <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{hotel.name}</h3>
                    <p className="text-white/70 text-sm mb-2">{hotel.location}</p>
                    <p className="text-white/70 text-sm mb-4 line-clamp-2">{hotel.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-white/70 text-sm">{hotel.rating.toFixed(1)}</span>
                      </div>
                      <span className="text-neon-lime font-bold">From $199/night</span>
                    </div>
                    <button className="w-full mt-4 bg-neon-lime text-dark-purple font-semibold py-2 px-4 rounded-lg hover:bg-neon-lime/90 transition-colors">
                      Book Now
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-neon-lime/50 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <h2 className="text-2xl font-bold text-white mb-2">No Favorites Yet</h2>
                <p className="text-white/70 mb-6">Start exploring hotels and save your favorites for quick access</p>
                <button 
                  onClick={() => setActiveTab("search")}
                  className="btn-primary"
                >
                  Explore Hotels
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Profile Information</h2>
              <button
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                className="px-4 py-2 bg-neon-lime text-dark-purple font-semibold rounded-lg hover:bg-neon-lime/90 transition-colors"
              >
                {isEditingProfile ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
            
            <div className="card-elevated p-8">
              {isEditingProfile ? (
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-2">Name</label>
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-neon-lime focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-2">Email</label>
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-neon-lime focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-2">Role</label>
                      <p className="text-white bg-white/5 px-4 py-3 rounded-lg border border-white/10 capitalize">{user.role}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-2">Member Since</label>
                      <p className="text-white bg-white/5 px-4 py-3 rounded-lg border border-white/10">
                        {new Date().toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        // Here you would typically save to backend
                        console.log('Saving profile:', editForm);
                        setIsEditingProfile(false);
                      }}
                      className="px-6 py-3 bg-neon-lime text-dark-purple font-semibold rounded-lg hover:bg-neon-lime/90 transition-colors"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditForm({ name: user?.name || '', email: user?.email || '' });
                        setIsEditingProfile(false);
                      }}
                      className="px-6 py-3 bg-white/5 text-white border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">Name</label>
                    <p className="text-white bg-white/5 px-4 py-3 rounded-lg border border-white/10">{user.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">Email</label>
                    <p className="text-white bg-white/5 px-4 py-3 rounded-lg border border-white/10">{user.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">Role</label>
                    <p className="text-white bg-white/5 px-4 py-3 rounded-lg border border-white/10 capitalize">{user.role}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">Member Since</label>
                    <p className="text-white bg-white/5 px-4 py-3 rounded-lg border border-white/10">
                      {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Additional Dashboard Sections */}
      {activeTab === "search" && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          {/* Quick Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <div className="card-elevated p-6 text-center">
              <div className="text-3xl font-bold text-neon-lime mb-2">12</div>
              <p className="text-white/70 text-sm">Total Bookings</p>
            </div>
            <div className="card-elevated p-6 text-center">
              <div className="text-3xl font-bold text-neon-lime mb-2">8</div>
              <p className="text-white/70 text-sm">Completed Stays</p>
            </div>
            <div className="card-elevated p-6 text-center">
              <div className="text-3xl font-bold text-neon-lime mb-2">4.8</div>
              <p className="text-white/70 text-sm">Average Rating</p>
            </div>
            <div className="card-elevated p-6 text-center">
              <div className="text-3xl font-bold text-neon-lime mb-2">$2,450</div>
              <p className="text-white/70 text-sm">Total Spent</p>
            </div>
          </div>

          {/* Featured Hotels */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Featured Hotels</h2>
            {featuredHotelsLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="card-elevated p-6 animate-pulse">
                    <div className="aspect-video bg-white/10 rounded-lg mb-4"></div>
                    <div className="h-6 bg-white/10 rounded mb-2"></div>
                    <div className="h-4 bg-white/10 rounded mb-4"></div>
                    <div className="flex justify-between items-center">
                      <div className="h-4 bg-white/10 rounded w-16"></div>
                      <div className="h-6 bg-white/10 rounded w-20"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredHotels.map((hotel) => (
                  <div key={hotel._id || hotel.id || Math.random()} className="card-elevated p-6 group hover:scale-105 transition-all duration-300">
                    <div className="aspect-video bg-gradient-to-br from-neon-lime/20 to-purple-500/20 rounded-lg mb-4 flex items-center justify-center relative">
                      <svg className="w-12 h-12 text-neon-lime/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <button
                        onClick={() => {
                          const hotelId = hotel._id || hotel.id || '';
                          if (favorites.includes(hotelId)) {
                            setFavorites(prev => prev.filter(id => id !== hotelId));
                          } else {
                            setFavorites(prev => [...prev, hotelId]);
                          }
                        }}
                        className="absolute top-3 right-3 p-2 rounded-full bg-red-500/20 hover:bg-red-500/30 transition-colors"
                      >
                        <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{hotel.name}</h3>
                    <p className="text-white/70 text-sm mb-2">{hotel.location}</p>
                    <p className="text-white/70 text-sm mb-4 line-clamp-2">{hotel.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-white/70 text-sm">{hotel.rating.toFixed(1)}</span>
                      </div>
                      <span className="text-neon-lime font-bold">From $199/night</span>
                    </div>
                    <button className="w-full mt-4 bg-neon-lime text-dark-purple font-semibold py-2 px-4 rounded-lg hover:bg-neon-lime/90 transition-colors">
                      Book Now
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <button 
                onClick={() => setActiveTab("bookings")}
                className="card-elevated p-6 text-center group hover:scale-105 transition-all duration-300"
              >
                <svg className="w-8 h-8 text-neon-lime mx-auto mb-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="text-white font-semibold mb-1">My Bookings</h3>
                <p className="text-white/70 text-sm">View all reservations</p>
              </button>
              <button 
                onClick={() => setActiveTab("favorites")}
                className="card-elevated p-6 text-center group hover:scale-105 transition-all duration-300"
              >
                <svg className="w-8 h-8 text-neon-lime mx-auto mb-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <h3 className="text-white font-semibold mb-1">Favorites</h3>
                <p className="text-white/70 text-sm">Saved hotels</p>
              </button>
              <button 
                onClick={() => setActiveTab("profile")}
                className="card-elevated p-6 text-center group hover:scale-105 transition-all duration-300"
              >
                <svg className="w-8 h-8 text-neon-lime mx-auto mb-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <h3 className="text-white font-semibold mb-1">Settings</h3>
                <p className="text-white/70 text-sm">Account preferences</p>
              </button>
              <button 
                onClick={() => router.push("/profile")}
                className="card-elevated p-6 text-center group hover:scale-105 transition-all duration-300"
              >
                <svg className="w-8 h-8 text-neon-lime mx-auto mb-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <h3 className="text-white font-semibold mb-1">Settings</h3>
                <p className="text-white/70 text-sm">Account preferences</p>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
