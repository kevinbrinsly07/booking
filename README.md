# Hotel Booking Management System

A comprehensive hotel booking system built with Next.js (frontend) and NestJS (backend), featuring MongoDB for data persistence and Redis for caching and concurrency control.

## 🏗️ Project Structure

```
booking/
├── frontend/          # Next.js application
│   ├── src/
│   │   ├── app/       # Next.js 14 App Router
│   │   ├── components/# React components
│   │   └── lib/       # Utilities and API services
│   └── package.json
│
└── backend/           # NestJS application
    ├── src/
    │   ├── hotels/    # Hotel management module
    │   ├── rooms/     # Room management module
    │   ├── bookings/  # Booking management with concurrency control
    │   └── redis/     # Redis service for caching & locking
    └── package.json
```

## ✨ Features

### For Clients
- 🔍 Search hotels by location, dates, and capacity
- 📅 Real-time room availability checking
- 💳 Book rooms with instant confirmation
- 📊 View and manage bookings
- ❌ Cancel bookings with reason tracking

### For Hotels
- 🏨 Hotel profile management
- 🛏️ Room inventory management
- 📈 Dashboard with statistics and analytics
- 📋 Booking management and status updates
- 💰 Revenue tracking

### Technical Features
- 🔒 **Distributed Locking**: Redis-based locking prevents double bookings
- ⚡ **Caching**: Redis caching for improved performance
- 🛡️ **Rate Limiting**: Throttling to prevent abuse
- 📊 **Database Indexing**: Optimized MongoDB queries
- 🎯 **Concurrency Control**: Version-based optimistic locking
- 🚦 **Traffic Management**: Built-in request throttling

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB 5+
- Redis 6+
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```env
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb://localhost:27017/hotel-booking
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=your-secret-key
```

5. Start the backend server:
```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

The API will be available at `http://localhost:3001/api`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```bash
cp .env.local.example .env.local
```

4. Update `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 🏛️ Architecture

### Backend Architecture

#### 1. **Module-Based Structure**
- **Hotels Module**: Manages hotel properties and information
- **Rooms Module**: Handles room inventory and availability
- **Bookings Module**: Core booking logic with concurrency control
- **Redis Module**: Distributed caching and locking service

#### 2. **Concurrency Management**

The system implements multiple strategies to handle concurrent bookings:

##### Distributed Locking
```typescript
// Acquire lock before booking
const lockAcquired = await redisService.acquireLock(
  `booking:lock:${roomId}`,
  lockId,
  30 // 30 seconds TTL
);
```

##### Optimistic Locking
- Version field in booking schema
- Prevents conflicts during updates

##### Availability Checking
- Real-time room availability validation
- Checks for overlapping bookings

#### 3. **Caching Strategy**
- Redis caching for frequently accessed data
- 1-hour TTL for booking data
- Cache invalidation on updates

#### 4. **Database Indexing**
```typescript
// Compound indexes for optimal query performance
BookingSchema.index({ roomId: 1, checkIn: 1, checkOut: 1 });
BookingSchema.index({ userId: 1, status: 1 });
```

### Frontend Architecture

#### 1. **Next.js 14 App Router**
- Server and client components
- File-based routing
- API route handlers

#### 2. **Component Structure**
- **Client Components**: Search, booking lists
- **Hotel Components**: Dashboard, room/booking management
- **Shared Components**: Reusable UI elements

#### 3. **State Management**
- React hooks for local state
- API integration with axios
- Future: Zustand for global state

## 📡 API Endpoints

### Hotels
```
POST   /api/hotels              Create hotel
GET    /api/hotels              List all hotels
GET    /api/hotels/:id          Get hotel by ID
PATCH  /api/hotels/:id          Update hotel
DELETE /api/hotels/:id          Delete hotel
GET    /api/hotels/search       Search hotels
```

### Rooms
```
POST   /api/rooms               Create room
GET    /api/rooms               List rooms (filter by hotelId)
GET    /api/rooms/:id           Get room by ID
GET    /api/rooms/available     Check availability
PATCH  /api/rooms/:id           Update room
DELETE /api/rooms/:id           Delete room
```

### Bookings
```
POST   /api/bookings            Create booking (with lock)
GET    /api/bookings            List bookings (filter by userId/hotelId)
GET    /api/bookings/:id        Get booking by ID
PATCH  /api/bookings/:id        Update booking
PATCH  /api/bookings/:id/confirm   Confirm booking
PATCH  /api/bookings/:id/cancel    Cancel booking
PATCH  /api/bookings/:id/complete  Complete booking
GET    /api/bookings/room/:roomId/availability  Check room availability
```

## 🔒 Security Features

- Input validation with class-validator
- Data sanitization
- Rate limiting with @nestjs/throttler
- CORS configuration
- Environment variable protection

## 📊 Performance Optimizations

1. **Database Level**
   - Strategic indexing on frequently queried fields
   - Compound indexes for complex queries
   - Connection pooling

2. **Application Level**
   - Redis caching layer
   - Distributed locking for critical operations
   - Optimistic concurrency control

3. **Frontend Level**
   - Next.js automatic code splitting
   - Image optimization
   - Server-side rendering where beneficial

## 🧪 Testing

### Backend
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:cov
```

### Frontend
```bash
# Run tests
npm run test

# Watch mode
npm run test:watch
```

## 📦 Deployment

### Backend Deployment

1. Build the application:
```bash
npm run build
```

2. Set production environment variables

3. Start the production server:
```bash
npm run start:prod
```

### Frontend Deployment

1. Build the application:
```bash
npm run build
```

2. Deploy to Vercel, Netlify, or any Node.js hosting:
```bash
npm run start
```

## 🔄 Concurrency Handling Deep Dive

### Scenario: Two users book the same room simultaneously

1. **Request 1** attempts to book Room 101
   - Acquires Redis lock: `booking:lock:room101`
   - Checks availability in database
   - Creates booking
   - Releases lock

2. **Request 2** attempts to book Room 101 (concurrent)
   - Tries to acquire Redis lock: `booking:lock:room101`
   - Lock acquisition fails (Request 1 holds it)
   - Returns 409 Conflict error
   - User is prompted to try again

### Lock Timeout Protection

If a process crashes while holding a lock, Redis TTL ensures automatic release after 30 seconds.

## 🛠️ Future Enhancements

- [ ] User authentication with JWT
- [ ] Payment integration (Stripe/PayPal)
- [ ] Email notifications
- [ ] Admin panel for system management
- [ ] Advanced search with filters
- [ ] Reviews and ratings system
- [ ] Multi-language support
- [ ] Mobile application (React Native)
- [ ] Analytics dashboard
- [ ] Automated testing suite

## 📝 Environment Variables

### Backend
```env
NODE_ENV=development|production
PORT=3001
MONGODB_URI=mongodb://localhost:27017/hotel-booking
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=optional
JWT_SECRET=your-secret-key
JWT_EXPIRATION=7d
THROTTLE_TTL=60
THROTTLE_LIMIT=100
CORS_ORIGIN=http://localhost:3000
```

### Frontend
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Support

For support, email support@hotelbooking.com or open an issue in the repository.

---

Built with ❤️ using Next.js, NestJS, MongoDB, and Redis
