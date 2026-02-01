'use client'

import { useState, useEffect } from 'react'
import { roomService } from '@/lib/services'
import type { Room } from '@/lib/services'

export default function RoomManagement() {
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingRoom, setEditingRoom] = useState<Room | null>(null)
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    roomNumber: '',
    type: '',
    price: '',
    capacity: '',
    amenities: '',
    status: 'available' as 'available' | 'occupied' | 'maintenance'
  })

  useEffect(() => {
    fetchRooms()
  }, [])

  const fetchRooms = async () => {
    try {
      setLoading(true)
      const response = await roomService.getAll()
      setRooms(response.data)
    } catch (error) {
      console.error('Error fetching rooms:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingRoom) {
        const roomId = editingRoom._id || editingRoom.id
        await roomService.update(roomId!, {
          roomNumber: formData.roomNumber,
          type: formData.type,
          price: parseFloat(formData.price),
          capacity: parseInt(formData.capacity),
          amenities: formData.amenities.split(',').map(a => a.trim()),
          status: formData.status
        })
      } else {
        await roomService.create({
          roomNumber: formData.roomNumber,
          type: formData.type,
          price: parseFloat(formData.price),
          capacity: parseInt(formData.capacity),
          amenities: formData.amenities.split(',').map(a => a.trim()),
          status: formData.status,
          hotelId: '' // This should be set based on the logged-in hotel admin's hotel
        })
      }
      setFormData({
        roomNumber: '',
        type: '',
        price: '',
        capacity: '',
        amenities: '',
        status: 'available'
      })
      setShowAddForm(false)
      setEditingRoom(null)
      fetchRooms()
    } catch (error) {
      console.error('Error saving room:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this room?')) {
      try {
        await roomService.delete(id)
        fetchRooms()
      } catch (error) {
        console.error('Error deleting room:', error)
      }
    }
  }

  const handleEdit = (room: Room) => {
    setEditingRoom(room)
    setFormData({
      roomNumber: room.roomNumber,
      type: room.type,
      price: room.price.toString(),
      capacity: room.capacity.toString(),
      amenities: room.amenities.join(', '),
      status: room.status
    })
    setShowAddForm(true)
  }

  const handleCancelEdit = () => {
    setEditingRoom(null)
    setFormData({
      roomNumber: '',
      type: '',
      price: '',
      capacity: '',
      amenities: '',
      status: 'available'
    })
    setShowAddForm(false)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-white text-xl">Loading rooms...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-white neon-glow">Room Management</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn-primary flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Room
        </button>
      </div>

      {showAddForm && (
        <div className="card-elevated mb-6">
          <h3 className="text-xl font-bold text-white mb-6">{editingRoom ? 'Edit Room' : 'Add New Room'}</h3>
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-white/90 mb-2">
                Room Number
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="101"
                value={formData.roomNumber}
                onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-white/90 mb-2">
                Room Type
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="Deluxe Suite"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-white/90 mb-2">
                Price per Night
              </label>
              <input
                type="number"
                className="input-field"
                placeholder="250"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-white/90 mb-2">
                Capacity
              </label>
              <input
                type="number"
                className="input-field"
                placeholder="2"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-white/90 mb-2">
                Amenities (comma separated)
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="WiFi, TV, Mini Bar"
                value={formData.amenities}
                onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
              />
            </div>
            <div className="md:col-span-2 flex gap-3">
              <button
                type="submit"
                className="btn-primary"
              >
                {editingRoom ? 'Update Room' : 'Save Room'}
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.length > 0 ? (
          rooms.map((room) => {
            const roomId = room._id || room.id
            return (
              <div key={roomId} className="card-elevated group hover:scale-105 transition-all duration-300 overflow-hidden">
              {/* Room Image */}
              <div className="relative h-44 -mx-6 -mt-6 mb-4 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600&h=400&fit=crop" 
                  alt={`Room ${room.roomNumber}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-purple/80 to-transparent" />
                <span
                  className={`absolute top-3 right-3 px-3 py-1 rounded-lg text-xs font-bold border backdrop-blur-sm ${
                    room.status === 'available'
                      ? 'bg-neon-lime/20 text-neon-lime border-neon-lime/30'
                      : room.status === 'occupied'
                      ? 'bg-red-500/20 text-red-400 border-red-500/30'
                      : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                  }`}
                >
                  {room.status}
                </span>
              </div>
              
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-neon-lime transition-colors">Room {room.roomNumber}</h3>
                  <p className="text-white/70 mt-1">{room.type}</p>
                </div>
              </div>
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-white/80">
                  <svg className="w-5 h-5 text-neon-lime mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-semibold text-neon-lime">${room.price}</span>
                  <span className="text-white/60 text-sm ml-1">/night</span>
                </div>
                <div className="flex items-center text-white/80">
                  <svg className="w-5 h-5 text-neon-lime mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>{room.capacity} guests</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => handleEdit(room)}
                  className="flex-1 btn-secondary text-sm"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(roomId)}
                  className="flex-1 px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg font-semibold hover:bg-red-500/30 transition-all duration-200 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
            )
          })
        ) : (
          <div className="col-span-3 text-center text-white/60 py-8">No rooms available. Add your first room!</div>
        )}
      </div>
    </div>
  )
}
