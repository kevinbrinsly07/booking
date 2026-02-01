# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │   Next.js Frontend (Port 3000)                           │  │
│  │   - Client Portal (Search, Book, Manage)                 │  │
│  │   - Hotel Dashboard (Manage Bookings, Rooms)             │  │
│  │   - React Components with Tailwind CSS                   │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/HTTPS
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Application Layer                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │   NestJS Backend (Port 3001)                             │  │
│  │                                                            │  │
│  │   ┌────────────┐  ┌────────────┐  ┌────────────┐        │  │
│  │   │  Hotels    │  │   Rooms    │  │  Bookings  │        │  │
│  │   │  Module    │  │   Module   │  │   Module   │        │  │
│  │   └────────────┘  └────────────┘  └────────────┘        │  │
│  │          │              │               │                 │  │
│  │          └──────────────┴───────────────┘                 │  │
│  │                      │                                     │  │
│  │   ┌─────────────────────────────────────────────┐        │  │
│  │   │      Redis Module (Caching & Locking)       │        │  │
│  │   └─────────────────────────────────────────────┘        │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                   │                          │
                   │                          │
         ┌─────────▼────────┐       ┌────────▼────────┐
         │   MongoDB        │       │     Redis       │
         │  (Port 27017)    │       │  (Port 6379)    │
         │                  │       │                 │
         │  - Hotels        │       │  - Locks        │
         │  - Rooms         │       │  - Cache        │
         │  - Bookings      │       │  - Sessions     │
         └──────────────────┘       └─────────────────┘
```

## Data Flow

### Booking Creation Flow

```
User Request
    │
    ▼
┌─────────────────────┐
│  Frontend Booking   │
│  Component          │
└─────────────────────┘
    │
    │ POST /api/bookings
    ▼
┌─────────────────────┐
│  NestJS Controller  │
│  (Validation)       │
└─────────────────────┘
    │
    ▼
┌─────────────────────┐
│  Booking Service    │
│  1. Acquire Lock    │ ◄──────┐
│  2. Check Avail.    │        │
│  3. Create Booking  │        │
│  4. Cache Result    │        │
│  5. Release Lock    │        │
└─────────────────────┘        │
    │         │                 │
    │         └─────────────────┘
    │               Redis
    │              (Locking)
    ▼
┌─────────────────────┐
│   MongoDB           │
│   (Persistence)     │
└─────────────────────┘
    │
    ▼
Response to User
```

## Concurrency Control Architecture

### Distributed Locking Mechanism

```
Request 1                Request 2
    │                        │
    ▼                        ▼
┌──────────┐            ┌──────────┐
│ Acquire  │            │ Acquire  │
│ Lock     │            │ Lock     │
└──────────┘            └──────────┘
    │                        │
    │ SET room:101           │ SET room:101
    │ NX EX 30               │ NX EX 30
    ▼                        ▼
┌──────────┐            ┌──────────┐
│   OK     │            │  NULL    │
│ (Success)│            │ (Failed) │
└──────────┘            └──────────┘
    │                        │
    ▼                        ▼
Process Booking         Return 409
    │                   Conflict
    ▼
Release Lock
```

### Optimistic Locking

```javascript
// Booking Schema
{
  _id: ObjectId,
  roomId: ObjectId,
  status: String,
  version: Number,  // ← Optimistic lock
  ...
}

// Update with version check
db.bookings.updateOne(
  { _id: bookingId, version: currentVersion },
  { $set: { status: 'confirmed' }, $inc: { version: 1 } }
)
```

## Module Architecture

### Hotels Module

```
hotels/
├── schemas/
│   └── hotel.schema.ts      # MongoDB schema
├── dto/
│   └── hotel.dto.ts         # Data transfer objects
├── hotels.controller.ts     # HTTP endpoints
├── hotels.service.ts        # Business logic
└── hotels.module.ts         # Module definition
```

**Responsibilities:**
- Hotel CRUD operations
- Search and filtering
- Hotel information management

### Rooms Module

```
rooms/
├── schemas/
│   └── room.schema.ts       # MongoDB schema with indexes
├── dto/
│   └── room.dto.ts          # DTOs
├── rooms.controller.ts      # HTTP endpoints
├── rooms.service.ts         # Business logic
└── rooms.module.ts          # Module definition
```

**Responsibilities:**
- Room inventory management
- Availability checking
- Room status updates

### Bookings Module

```
bookings/
├── schemas/
│   └── booking.schema.ts    # Schema with concurrency fields
├── dto/
│   └── booking.dto.ts       # DTOs
├── bookings.controller.ts   # HTTP endpoints
├── bookings.service.ts      # Core booking logic
└── bookings.module.ts       # Module definition
```

**Responsibilities:**
- Booking creation with locking
- Availability validation
- Status management (pending, confirmed, cancelled)
- Concurrency control

### Redis Module

```
redis/
├── redis.module.ts          # Global module
└── redis.service.ts         # Lock & cache operations
```

**Responsibilities:**
- Distributed locking
- Caching frequently accessed data
- Session management (future)

## Database Schema Design

### Hotels Collection

```javascript
{
  _id: ObjectId,
  name: String,
  location: String,
  description: String,
  rating: Number,
  amenities: [String],
  images: [String],
  contactInfo: {
    email: String,
    phone: String,
    address: String
  },
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Rooms Collection

```javascript
{
  _id: ObjectId,
  hotelId: ObjectId,        // Reference to Hotel
  roomNumber: String,
  type: String,
  price: Number,
  capacity: Number,
  amenities: [String],
  status: Enum['available', 'occupied', 'maintenance'],
  description: String,
  images: [String],
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}

// Indexes
{ hotelId: 1, roomNumber: 1 }  // Unique compound index
{ status: 1 }                   // Status queries
```

### Bookings Collection

```javascript
{
  _id: ObjectId,
  hotelId: ObjectId,        // Reference to Hotel
  roomId: ObjectId,         // Reference to Room
  userId: String,
  guestName: String,
  guestEmail: String,
  guestPhone: String,
  checkIn: Date,
  checkOut: Date,
  guests: Number,
  status: Enum['pending', 'confirmed', 'cancelled', 'completed'],
  totalAmount: Number,
  paidAmount: Number,
  specialRequests: String,
  cancellationReason: String,
  cancelledAt: Date,
  version: Number,          // Optimistic locking
  lockId: String,           // Distributed lock tracking
  createdAt: Date,
  updatedAt: Date
}

// Indexes
{ userId: 1, status: 1 }
{ hotelId: 1, checkIn: 1, checkOut: 1 }
{ roomId: 1, checkIn: 1, checkOut: 1 }  // Critical for availability
{ status: 1, checkIn: 1 }
```

## Caching Strategy

### Cache Keys

```
booking:{bookingId}              # Individual booking
room:{roomId}:availability       # Room availability
hotel:{hotelId}:details          # Hotel details
user:{userId}:bookings           # User's bookings list
```

### Cache TTL

- Bookings: 1 hour
- Room availability: 5 minutes
- Hotel details: 24 hours
- User bookings: 10 minutes

### Cache Invalidation

```javascript
// On booking creation/update
await redis.delete(`booking:${bookingId}`);
await redis.delete(`room:${roomId}:availability`);
await redis.delete(`user:${userId}:bookings`);
```

## Scalability Considerations

### Horizontal Scaling

```
Load Balancer
    │
    ├──► Backend Instance 1 ──┐
    ├──► Backend Instance 2 ──┼──► MongoDB Cluster
    └──► Backend Instance 3 ──┘
                │
                └──► Redis Cluster
```

**Benefits:**
- Distributed locking works across instances
- Shared cache for all instances
- Database connection pooling

### Database Optimization

1. **Indexes** for frequent queries
2. **Sharding** by hotelId for large scale
3. **Read Replicas** for read-heavy operations
4. **Connection Pooling** to limit connections

### Caching Layers

```
Request → CDN → Application Cache (Redis) → Database
```

## Security Architecture

### Request Flow with Security

```
Client Request
    │
    ▼
┌──────────────────┐
│   Rate Limiter   │  ← Throttle (100 req/min)
└──────────────────┘
    │
    ▼
┌──────────────────┐
│   CORS Check     │  ← Origin validation
└──────────────────┘
    │
    ▼
┌──────────────────┐
│   JWT Auth       │  ← Token verification (future)
│   (Future)       │
└──────────────────┘
    │
    ▼
┌──────────────────┐
│   Validation     │  ← DTO validation
│   Pipeline       │
└──────────────────┘
    │
    ▼
┌──────────────────┐
│   Controller     │
└──────────────────┘
```

## Performance Optimizations

### Query Optimization

```javascript
// Bad: N+1 queries
const bookings = await Booking.find();
for (const booking of bookings) {
  const hotel = await Hotel.findById(booking.hotelId);
  const room = await Room.findById(booking.roomId);
}

// Good: Populate references
const bookings = await Booking.find()
  .populate('hotelId')
  .populate('roomId');
```

### Pagination

```javascript
const bookings = await Booking.find()
  .skip((page - 1) * limit)
  .limit(limit)
  .sort({ createdAt: -1 });
```

### Connection Pooling

```javascript
MongooseModule.forRoot(uri, {
  maxPoolSize: 10,
  minPoolSize: 2,
});
```

## Monitoring & Observability

### Metrics to Track

1. **Application Metrics**
   - Request rate
   - Response time
   - Error rate
   - Active connections

2. **Database Metrics**
   - Query performance
   - Connection pool usage
   - Index efficiency

3. **Cache Metrics**
   - Hit rate
   - Miss rate
   - Eviction rate

4. **Business Metrics**
   - Bookings per hour
   - Concurrent booking attempts
   - Lock contention rate

## Future Enhancements

### Microservices Architecture

```
API Gateway
    │
    ├──► Auth Service
    ├──► Hotel Service
    ├──► Booking Service
    ├──► Payment Service
    └──► Notification Service
```

### Event-Driven Architecture

```
Booking Created Event
    │
    ├──► Send Confirmation Email
    ├──► Update Analytics
    ├──► Trigger Payment
    └──► Notify Hotel
```

### CQRS Pattern

```
Write Side              Read Side
    │                       │
    ▼                       ▼
Command DB          Materialized Views
(MongoDB)           (Redis/ElasticSearch)
```

This architecture ensures:
- ✅ High availability
- ✅ Scalability
- ✅ Data consistency
- ✅ Performance
- ✅ Fault tolerance
