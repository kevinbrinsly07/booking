# Hotel Booking System - Complete Setup

## ✅ What's Implemented

### Backend (NestJS + MongoDB Atlas)

#### 1. **Authentication & User Management** ✨ NEW
- **JWT Authentication** with passport strategies
- **Role-Based Access Control (RBAC)**:
  - `USER` - Regular clients (book hotels, view bookings)
  - `HOTEL_ADMIN` - Hotel owners (manage hotels, rooms, bookings)
  - `SUPER_ADMIN` - System administrators (full access)
- **Secure password hashing** with bcrypt
- **Token-based sessions** (24-hour expiration)

#### 2. **Core Modules**
- **Hotels Module**: CRUD operations, search, owner assignment
- **Rooms Module**: Room management, availability checking
- **Bookings Module**: Concurrency-safe booking system
- **Redis Module**: Optional caching and distributed locking
- **Users Module**: User profile management

#### 3. **Security Features**
- Rate limiting (100 requests/minute)
- Authentication guards on all sensitive routes
- Role-based route protection
- CORS enabled for frontend communication
- Input validation with class-validator

#### 4. **Database Schema Updates**
- `User` schema with roles and hotel assignments
- `Hotel` schema with owner reference
- `Booking` schema with user reference
- Proper indexes for performance

### Frontend (Next.js 14 + Tailwind CSS)

#### 1. **Authentication Pages** ✨ NEW
- `/login` - Login page with form validation
- `/register` - Registration page for new users
- Auto-redirect based on user role
- Persistent authentication with Zustand

#### 2. **Existing Features**
- `/client` - Client portal (search hotels, make bookings)
- `/hotel` - Hotel admin dashboard
- Responsive design with Tailwind CSS
- API integration with axios interceptors

#### 3. **Auth Integration**
- Zustand store for auth state management
- Automatic token injection in API calls
- Auto-logout on token expiration
- Protected routes with role checks

## 🚀 Quick Start

### 1. Start the Application
```bash
cd /Users/kevinbrinsly/booking
./start.sh
```

**Access Points:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api
- MongoDB: Atlas (cloud)

### 2. Create Your First User

#### Register via Frontend
1. Go to http://localhost:3000/register
2. Fill in your details
3. You'll be auto-logged in as a `USER`

#### Register via API
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "+1234567890"
  }'
```

### 3. Upgrade a User to Admin

You need to manually update the role in MongoDB Atlas:

1. Go to your MongoDB Atlas dashboard
2. Browse Collections → `hotel-booking` → `users`
3. Find your user by email
4. Click Edit and change `role` from `"user"` to `"hotel_admin"` or `"super_admin"`
5. Save changes

Or use mongosh:
```javascript
db.users.updateOne(
  { email: "john@example.com" },
  { $set: { role: "hotel_admin" } }
)
```

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | None | Register new user |
| POST | `/api/auth/login` | None | Login with email/password |
| GET | `/api/auth/profile` | JWT | Get current user profile |
| GET | `/api/auth/me` | JWT | Get current user details |

### User Management

| Method | Endpoint | Auth | Roles | Description |
|--------|----------|------|-------|-------------|
| GET | `/api/users` | JWT | ADMIN | List all users |
| GET | `/api/users/:id` | JWT | Any | Get user details |
| PATCH | `/api/users/:id` | JWT | Any | Update user |
| DELETE | `/api/users/:id` | JWT | SUPER_ADMIN | Delete user |
| POST | `/api/users/:userId/hotels/:hotelId` | JWT | SUPER_ADMIN | Assign hotel to user |

### Hotels

| Method | Endpoint | Auth | Roles | Description |
|--------|----------|------|-------|-------------|
| GET | `/api/hotels` | None | Any | List all hotels |
| GET | `/api/hotels/search?location=X` | None | Any | Search hotels |
| GET | `/api/hotels/:id` | None | Any | Get hotel details |
| POST | `/api/hotels` | JWT | ADMIN | Create hotel |
| PATCH | `/api/hotels/:id` | JWT | ADMIN | Update hotel |
| DELETE | `/api/hotels/:id` | JWT | ADMIN | Delete hotel |

### Rooms

| Method | Endpoint | Auth | Roles | Description |
|--------|----------|------|-------|-------------|
| GET | `/api/rooms` | None | Any | List all rooms |
| GET | `/api/rooms/available` | None | Any | Get available rooms |
| GET | `/api/rooms/:id` | None | Any | Get room details |
| POST | `/api/rooms` | JWT | ADMIN | Create room |
| PATCH | `/api/rooms/:id` | JWT | ADMIN | Update room |
| DELETE | `/api/rooms/:id` | JWT | ADMIN | Delete room |

### Bookings

| Method | Endpoint | Auth | Roles | Description |
|--------|----------|------|-------|-------------|
| GET | `/api/bookings` | JWT | Any | List bookings |
| GET | `/api/bookings/:id` | JWT | Any | Get booking details |
| POST | `/api/bookings` | JWT | Any | Create booking |
| PATCH | `/api/bookings/:id` | JWT | Any | Update booking |
| PATCH | `/api/bookings/:id/confirm` | JWT | ADMIN | Confirm booking |
| PATCH | `/api/bookings/:id/cancel` | JWT | Any | Cancel booking |
| PATCH | `/api/bookings/:id/complete` | JWT | ADMIN | Complete booking |

## 🔐 Authentication Flow

### 1. User Registration
```
User → Frontend (/register) → POST /api/auth/register → Backend
     ← JWT Token + User Data ← Response
     → Store in Zustand → Redirect to /client
```

### 2. User Login
```
User → Frontend (/login) → POST /api/auth/login → Backend
     ← JWT Token + User Data ← Response
     → Store in Zustand → Redirect based on role
```

### 3. Protected API Calls
```
Frontend → API Request with Bearer Token → Backend
        → JwtAuthGuard validates token
        → RolesGuard checks permissions
        → Controller handles request
        ← Response
```

## 🎯 User Workflows

### Regular User (CLIENT)
1. Register/Login at `/login` or `/register`
2. Browse hotels at `/client`
3. Search by location, dates
4. Make a booking
5. View bookings
6. Cancel bookings

### Hotel Admin
1. Login at `/login`
2. Auto-redirected to `/hotel`
3. View dashboard with stats
4. Manage rooms (add, edit, delete)
5. View all bookings for their hotels
6. Confirm/cancel bookings

### Super Admin
1. Login at `/login`
2. Access to all features
3. Can manage users via API
4. Assign hotels to hotel admins
5. Full system control

## 📁 Project Structure

```
booking/
├── backend/
│   ├── src/
│   │   ├── auth/              # ✨ Authentication module
│   │   │   ├── guards/        # JWT & Roles guards
│   │   │   ├── strategies/    # Passport strategies
│   │   │   ├── decorators/    # Custom decorators
│   │   │   └── dto/           # Login/Register DTOs
│   │   ├── users/             # ✨ User management
│   │   │   ├── schemas/       # User schema with roles
│   │   │   └── dto/           # User DTOs
│   │   ├── hotels/            # Hotels module
│   │   ├── rooms/             # Rooms module
│   │   ├── bookings/          # Bookings module
│   │   └── redis/             # Redis module
│   └── .env                   # MongoDB Atlas config
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── login/         # ✨ Login page
│   │   │   ├── register/      # ✨ Register page
│   │   │   ├── client/        # Client portal
│   │   │   └── hotel/         # Hotel dashboard
│   │   ├── components/
│   │   │   ├── auth/          # ✨ Auth components
│   │   │   ├── client/        # Client components
│   │   │   └── hotel/         # Hotel components
│   │   └── lib/
│   │       ├── auth-store.ts  # ✨ Zustand auth store
│   │       ├── api.ts         # Axios with auth
│   │       └── services.ts    # API services
├── start.sh                   # Start script
├── stop.sh                    # Stop script
└── AUTHENTICATION.md          # ✨ Auth documentation
```

## 🔧 Environment Variables

Located in `/Users/kevinbrinsly/booking/backend/.env`:

```env
# MongoDB Atlas
MONGODB_URI=mongodb+srv://brinslykevin_db_user:...@cluster0.x4ar7zp.mongodb.net/hotel-booking?...

# JWT (✨ Important for Auth)
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRATION=24h

# Redis (Optional)
REDIS_HOST=localhost
REDIS_PORT=6379

# Server
PORT=3001
NODE_ENV=development
```

## 🛠️ Management Commands

### Start/Stop
```bash
# Start everything
./start.sh

# Stop everything
./stop.sh

# View logs
tail -f backend.log frontend.log
```

### Database Operations

#### Create Super Admin User
```javascript
// Via mongosh or Atlas
db.users.insertOne({
  name: "Super Admin",
  email: "admin@hotel.com",
  password: "$2b$10$...", // Generate via bcrypt
  role: "super_admin",
  isActive: true,
  hotelIds: [],
  createdAt: new Date(),
  updatedAt: new Date()
});
```

#### Generate Password Hash
```javascript
// In Node.js
const bcrypt = require('bcrypt');
const hash = await bcrypt.hash('your-password', 10);
console.log(hash);
```

## 📖 Additional Documentation

- [AUTHENTICATION.md](AUTHENTICATION.md) - Detailed auth guide
- [API.md](API.md) - Complete API reference
- [ARCHITECTURE.md](ARCHITECTURE.md) - System architecture
- [QUICKSTART.md](QUICKSTART.md) - Setup guide

## 🎉 What's Next?

### Recommended Enhancements
1. **Email Verification** - Verify email on registration
2. **Password Reset** - Forgot password flow
3. **2FA (Two-Factor Authentication)** - Extra security
4. **OAuth Integration** - Google, Facebook login
5. **User Profiles** - Extended profile management
6. **Admin Dashboard** - Dedicated admin UI
7. **Audit Logs** - Track user actions
8. **API Documentation** - Swagger/OpenAPI integration

### Testing
```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

## 💡 Tips

1. **Creating Test Users**: Use the `/register` endpoint or frontend form
2. **Role Management**: Update roles directly in MongoDB Atlas
3. **Token Debugging**: Check browser DevTools → Application → Local Storage → `auth-storage`
4. **API Testing**: Use the included curl commands or Postman
5. **Logs**: Always check `backend.log` and `frontend.log` for errors

## 🔒 Security Notes

⚠️ **Before Production:**
1. Change `JWT_SECRET` to a strong random string
2. Enable HTTPS
3. Set proper CORS origins
4. Add rate limiting per IP
5. Enable MongoDB Atlas IP whitelist
6. Use environment-specific configs
7. Add request logging
8. Implement refresh tokens

---

**Current Status:** ✅ Fully functional with authentication and user management!

**Running at:**
- Frontend: http://localhost:3000
- Backend: http://localhost:3001/api
