import api from './api'

export interface Hotel {
  _id?: string
  id?: string
  name: string
  location: string
  description?: string
  rating: number
  amenities: string[]
  imageUrl?: string
  images: string[]
  contactInfo?: {
    email: string
    phone: string
    address: string
  }
  ownerId?: string
  isActive: boolean
  createdAt?: Date
  updatedAt?: Date
}

export interface Room {
  _id?: string
  id?: string
  hotelId: string
  roomNumber: string
  type: string
  price: number
  capacity: number
  amenities: string[]
  status: 'available' | 'occupied' | 'maintenance'
}

export interface Booking {
  _id?: string
  id?: string
  userId: string
  hotelId: string
  roomId: string
  guestName: string
  guestEmail: string
  guestPhone?: string
  checkIn: Date
  checkOut: Date
  guests: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  totalAmount: number
  paidAmount?: number
  createdAt?: Date
  updatedAt?: Date
}

// Hotel APIs
export const hotelService = {
  getAll: () => api.get<Hotel[]>('/hotels'),
  getById: (id: string) => api.get<Hotel>(`/hotels/${id}`),
  create: (data: Partial<Hotel>) => api.post<Hotel>('/hotels', data),
  update: (id: string, data: Partial<Hotel>) => api.patch<Hotel>(`/hotels/${id}`, data),
  delete: (id: string) => api.delete(`/hotels/${id}`),
  search: (params: any) => api.get<Hotel[]>('/hotels/search', { params }),
}

// Room APIs
export const roomService = {
  getAll: (hotelId?: string) => api.get<Room[]>('/rooms', { params: { hotelId } }),
  getById: (id: string) => api.get<Room>(`/rooms/${id}`),
  create: (data: Partial<Room>) => api.post<Room>('/rooms', data),
  update: (id: string, data: Partial<Room>) => api.patch<Room>(`/rooms/${id}`, data),
  delete: (id: string) => api.delete(`/rooms/${id}`),
  checkAvailability: (roomId: string, checkIn: Date, checkOut: Date) =>
    api.get<{ available: boolean }>(`/rooms/${roomId}/availability`, {
      params: { checkIn, checkOut },
    }),
}

// Booking APIs
export const bookingService = {
  getAll: (userId?: string) => api.get<Booking[]>('/bookings', { params: { userId } }),
  getById: (id: string) => api.get<Booking>(`/bookings/${id}`),
  create: (data: Partial<Booking>) => api.post<Booking>('/bookings', data),
  update: (id: string, data: Partial<Booking>) => api.patch<Booking>(`/bookings/${id}`, data),
  cancel: (id: string) => api.patch<Booking>(`/bookings/${id}/cancel`),
  confirm: (id: string) => api.patch<Booking>(`/bookings/${id}/confirm`),
}
