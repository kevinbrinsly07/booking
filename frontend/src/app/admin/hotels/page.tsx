'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '@/lib/auth-store';
import api from '@/lib/api';

interface Hotel {
  _id: string;
  name: string;
  location: string;
  description?: string;
  rating: number;
  ownerId?: string;
  contactInfo?: {
    email: string;
    phone: string;
    address: string;
  };
  isActive: boolean;
  createdAt: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  hotelIds: string[];
}

interface Room {
  _id: string;
  roomNumber: string;
  type: string;
  price: number;
  hotelId: string;
}

export default function HotelsManagementPage() {
  const router = useRouter();
  const { user: currentUser, logout } = useAuthStore();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedHotel, setExpandedHotel] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    } else if (currentUser.role !== 'super_admin') {
      router.push('/hotel');
      toast.error('Access denied: Super admin only');
    } else {
      fetchData();
    }
  }, [currentUser, router]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [hotelsRes, usersRes, roomsRes] = await Promise.all([
        api.get('/hotels'),
        api.get('/users'),
        api.get('/rooms')
      ]);
      console.log('Admin fetched hotels:', hotelsRes.data);
      console.log('Admin fetched rooms:', roomsRes.data);
      setHotels(hotelsRes.data);
      setUsers(usersRes.data);
      setRooms(roomsRes.data);
    } catch (error: any) {
      console.error('Admin fetch error:', error);
      toast.error('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const getHotelManager = (hotelId: string) => {
    return users.find(u => 
      u.role === 'hotel_admin' && u.hotelIds?.includes(hotelId)
    );
  };

  const getHotelRooms = (hotelId: string) => {
    // Handle both ObjectId and string comparison
    return rooms.filter(r => {
      const roomHotelId = typeof r.hotelId === 'object' ? (r.hotelId as any)._id || r.hotelId : r.hotelId;
      return roomHotelId === hotelId || roomHotelId.toString() === hotelId;
    });
  };

  const handleToggleActive = async (hotelId: string, isActive: boolean) => {
    try {
      await api.patch(`/hotels/${hotelId}`, { isActive: !isActive });
      toast.success(`Hotel ${!isActive ? 'activated' : 'deactivated'} successfully`);
      fetchData();
    } catch (error: any) {
      toast.error('Failed to update hotel status');
    }
  };

  const handleDeleteHotel = async (hotelId: string) => {
    if (!confirm('Are you sure you want to delete this hotel? This will also delete all associated rooms.')) {
      return;
    }

    try {
      await api.delete(`/hotels/${hotelId}`);
      toast.success('Hotel deleted successfully');
      fetchData();
    } catch (error: any) {
      toast.error('Failed to delete hotel');
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!currentUser || currentUser.role !== 'super_admin') return null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-purple flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-purple">
      <nav className="border-b border-white/10 backdrop-blur-sm bg-dark-purple/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center">
              <svg className="w-8 h-8 text-neon-lime mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <h1 className="text-xl font-bold gradient-text">Super Admin - Hotels</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/admin/users')}
                className="px-4 py-2 text-white/70 hover:text-white transition-colors"
              >
                Users
              </button>
              <button
                onClick={handleLogout}
                className="btn-secondary"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2 neon-glow">Hotels Management</h2>
          <p className="text-white/60">Manage all hotels and their managers</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card-elevated">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm mb-1">Total Hotels</p>
                <p className="text-3xl font-bold text-white">{hotels.length}</p>
              </div>
              <div className="p-3 bg-neon-lime/10 rounded-lg border border-neon-lime/30">
                <svg className="w-6 h-6 text-neon-lime" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
          </div>

          <div className="card-elevated">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm mb-1">Hotel Managers</p>
                <p className="text-3xl font-bold text-white">
                  {users.filter(u => u.role === 'hotel_admin').length}
                </p>
              </div>
              <div className="p-3 bg-white/10 rounded-lg border border-white/30">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="card-elevated">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm mb-1">Total Rooms</p>
                <p className="text-3xl font-bold text-white">{rooms.length}</p>
              </div>
              <div className="p-3 bg-white/5 rounded-lg border border-white/20">
                <svg className="w-6 h-6 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Hotels List - Grouped by Hotel with Rooms */}
        <div className="space-y-6">
          {hotels.map((hotel) => {
            const manager = getHotelManager(hotel._id);
            const hotelRooms = getHotelRooms(hotel._id);
            const isExpanded = expandedHotel === hotel._id;

            return (
              <div key={hotel._id} className="card-elevated border-l-4 border-neon-lime/50">
                {/* Hotel Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <svg className="w-6 h-6 text-neon-lime" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <h3 className="text-2xl font-bold text-white">{hotel.name}</h3>
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                        hotel.isActive
                          ? 'bg-neon-lime/20 text-neon-lime border border-neon-lime/30'
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        {hotel.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <span className="px-3 py-1 rounded-lg text-xs font-bold bg-white/10 text-white/70 border border-white/20">
                        {hotelRooms.length} {hotelRooms.length === 1 ? 'Room' : 'Rooms'}
                      </span>
                    </div>
                    <p className="text-white/70 mb-1 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {hotel.location}
                    </p>
                    {hotel.description && (
                      <p className="text-white/50 text-sm">{hotel.description}</p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggleActive(hotel._id, hotel.isActive)}
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/20 rounded-lg font-semibold transition-all duration-200"
                    >
                      {hotel.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleDeleteHotel(hotel._id)}
                      className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg font-semibold hover:bg-red-500/30 transition-all duration-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Manager Info */}
                <div className="border-t border-white/10 pt-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <p className="text-white/60 text-sm font-semibold">Hotel Manager</p>
                  </div>
                  {manager ? (
                    <div className="ml-7">
                      <p className="text-white font-semibold">{manager.name}</p>
                      <p className="text-white/50 text-sm">{manager.email}</p>
                    </div>
                  ) : (
                    <p className="text-white/40 text-sm italic ml-7">No manager assigned</p>
                  )}
                </div>

                {/* Rooms Section - Always Visible */}
                <div className="border-t border-white/10 pt-4">
                  <button
                    onClick={() => setExpandedHotel(isExpanded ? null : hotel._id)}
                    className="flex items-center gap-2 mb-4 text-white hover:text-neon-lime transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                    </svg>
                    <h4 className="text-white font-bold text-lg">
                      Rooms in {hotel.name} ({hotelRooms.length})
                    </h4>
                    <svg 
                      className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {isExpanded && (
                    <div>
                      {hotelRooms.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {hotelRooms.map((room) => (
                            <div key={room._id} className="bg-gradient-to-br from-white/10 to-white/5 rounded-lg p-4 border border-white/20 hover:border-neon-lime/50 transition-all duration-200">
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <p className="text-white font-bold text-lg">Room {room.roomNumber}</p>
                                  <p className="text-white/60 text-sm">{room.type}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-neon-lime font-bold text-xl">${room.price}</p>
                                  <p className="text-white/50 text-xs">per night</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 text-white/40 text-xs">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                                <span>Hotel ID: {hotel._id.slice(-8)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 bg-white/5 rounded-lg border border-white/10">
                          <svg className="w-12 h-12 text-white/30 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                          </svg>
                          <p className="text-white/40">No rooms available for this hotel</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {hotels.length === 0 && (
            <div className="text-center py-12">
              <p className="text-white/60 text-lg">No hotels found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
