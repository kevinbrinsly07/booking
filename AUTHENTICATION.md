# Authentication & User Management

## Overview
Complete authentication system with JWT tokens and role-based access control (RBAC).

## User Roles

### 1. USER (Regular Client)
- Search and view hotels
- Make bookings
- View own bookings
- Cancel own bookings
- Update profile

### 2. HOTEL_ADMIN
- All USER permissions
- Manage hotels they own
- Manage rooms for their hotels
- View bookings for their hotels
- Update booking status

### 3. SUPER_ADMIN
- All permissions
- Create/update/delete any user
- Assign hotels to hotel admins
- Manage all hotels and bookings
- System-wide access

## API Endpoints

### Authentication

#### Register
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890"
}

Response:
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "phone": "+1234567890",
    "hotelIds": []
  }
}
```

#### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response: Same as Register
```

#### Get Profile
```bash
GET /api/auth/profile
Authorization: Bearer <token>

Response:
{
  "id": "65a1b2c3d4e5f6g7h8i9j0k1",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "phone": "+1234567890",
  "hotelIds": [],
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### User Management (Protected Routes)

#### List All Users (SUPER_ADMIN or HOTEL_ADMIN)
```bash
GET /api/users
Authorization: Bearer <token>
```

#### Get User
```bash
GET /api/users/:id
Authorization: Bearer <token>
```

#### Update User
```bash
PATCH /api/users/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Updated",
  "phone": "+9876543210"
}
```

#### Delete User (SUPER_ADMIN only)
```bash
DELETE /api/users/:id
Authorization: Bearer <token>
```

#### Assign Hotel to User (SUPER_ADMIN only)
```bash
POST /api/users/:userId/hotels/:hotelId
Authorization: Bearer <token>
```

#### Remove Hotel from User (SUPER_ADMIN only)
```bash
DELETE /api/users/:userId/hotels/:hotelId
Authorization: Bearer <token>
```

## Frontend Authentication

### Login Page
- Route: `/login`
- Auto-redirects authenticated users
- Redirects to `/hotel` for admins, `/client` for users

### Register Page
- Route: `/register`
- Creates USER role by default
- Auto-login after successful registration

### Protected Routes
Both `/client` and `/hotel` pages check authentication status.

### Auth Store (Zustand)
```typescript
import { useAuthStore } from '@/lib/auth-store';

// In your component
const { user, token, setUser, setToken, logout } = useAuthStore();

// Check if logged in
if (!user) {
  // redirect to login
}

// Check role
if (user.role === 'hotel_admin') {
  // show admin features
}

// Logout
logout();
```

## Security Features

1. **Password Hashing**: bcrypt with 10 salt rounds
2. **JWT Tokens**: 24-hour expiration
3. **Route Guards**: JwtAuthGuard + RolesGuard
4. **Decorators**: `@Roles()`, `@CurrentUser()`
5. **Auto-logout**: On 401 errors
6. **Token Storage**: Persisted in localStorage via Zustand

## Usage Examples

### Protect a Route (Backend)
```typescript
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { Roles } from './auth/decorators/roles.decorator';
import { CurrentUser } from './auth/decorators/current-user.decorator';
import { UserRole } from './users/schemas/user.schema';

@Controller('api/hotels')
@UseGuards(JwtAuthGuard, RolesGuard)
export class HotelsController {
  
  @Post()
  @Roles(UserRole.HOTEL_ADMIN, UserRole.SUPER_ADMIN)
  create(@Body() createHotelDto: CreateHotelDto, @CurrentUser() user: any) {
    // user.userId, user.email, user.role available
    return this.hotelsService.create(createHotelDto, user.userId);
  }
}
```

### Check Auth (Frontend)
```typescript
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';

export default function ProtectedPage() {
  const router = useRouter();
  const { user, isLoading } = useAuthStore();

  useEffect(() => {
    if (!user && !isLoading) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (!user) return null;

  return <div>Protected Content</div>;
}
```

## Environment Variables

Add to `.env`:
```env
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRATION=24h
```

## Testing

### Create Super Admin (Direct DB)
```javascript
// Run in MongoDB Atlas or mongosh
use hotel-booking;

db.users.insertOne({
  name: "Super Admin",
  email: "admin@hotel.com",
  password: "$2b$10$X7vE5.Y9Z8...", // bcrypt hash of your password
  role: "super_admin",
  isActive: true,
  hotelIds: [],
  createdAt: new Date(),
  updatedAt: new Date()
});
```

Or use the register endpoint and manually update role:
```javascript
db.users.updateOne(
  { email: "admin@hotel.com" },
  { $set: { role: "super_admin" } }
);
```


Login credentials:

Super Admin: admin@hotel.com / admin123456
Hotel Admin: hotel@hotel.com / hotel123456
Regular User: user@hotel.com / user123456