# Role-Based Features Documentation

This document outlines all features and capabilities available to each role in the Hotel Booking System.

---

## Table of Contents
- [User Roles Overview](#user-roles-overview)
- [Super Admin Features](#super-admin-features)
- [Hotel Admin Features](#hotel-admin-features)
- [User (Client) Features](#user-client-features)
- [Guest (Unauthenticated) Features](#guest-unauthenticated-features)
- [Feature Comparison Matrix](#feature-comparison-matrix)

---

## User Roles Overview

The system implements three authenticated roles plus guest access:

| Role | Description | Access Level |
|------|-------------|--------------|
| **Super Admin** | System administrator with full access | Highest |
| **Hotel Admin** | Hotel manager who manages specific hotels | Medium |
| **User** | Regular customer who books hotels | Standard |
| **Guest** | Unauthenticated visitor | Limited |

---

## Super Admin Features

Super Admins have complete control over the entire system.

### 1. User Management
- **Create Users** (`POST /users`)
  - Create users with any role (user, hotel_admin, super_admin)
  - Set initial user properties
  - Assign hotels to users
  
- **View All Users** (`GET /users`)
  - Access complete list of all system users
  - View user details and roles
  - Monitor user activity status
  
- **View User Details** (`GET /users/:id`)
  - Access detailed information for any user
  - View user booking history
  - Check assigned hotels
  
- **Update Users** (`PATCH /users/:id`)
  - Modify user information
  - Change user roles
  - Update contact details
  - Activate/deactivate accounts
  
- **Delete Users** (`DELETE /users/:id`)
  - Remove users from the system
  - Clean up inactive accounts
  
- **Assign Hotels to Users** (`POST /users/:userId/hotels/:hotelId`)
  - Associate hotel admins with specific hotels
  - Manage hotel access permissions
  
- **Remove Hotels from Users** (`DELETE /users/:userId/hotels/:hotelId`)
  - Revoke hotel access
  - Reassign hotel management

### 2. Hotel Management
- **Create Hotels** (`POST /hotels`)
  - Add new hotels to the system
  - Set hotel details (name, location, description)
  - Configure ratings and amenities
  - Set contact information
  
- **View All Hotels** (`GET /hotels`)
  - Access complete hotel database
  - Filter by location
  - Search hotels
  
- **View Hotel Details** (`GET /hotels/:id`)
  - Access detailed hotel information
  - View associated rooms
  - Check hotel statistics
  
- **Update Hotels** (`PATCH /hotels/:id`)
  - Modify hotel information
  - Update amenities and ratings
  - Change contact details
  
- **Delete Hotels** (`DELETE /hotels/:id`)
  - Remove hotels from the system
  - Clean up obsolete listings

### 3. Room Management
- **Create Rooms** (`POST /rooms`)
  - Add rooms to any hotel
  - Set room types and capacities
  - Configure pricing
  - Define room amenities
  
- **View All Rooms** (`GET /rooms`)
  - Access complete room inventory
  - Filter by hotel
  - Check room status
  
- **View Room Details** (`GET /rooms/:id`)
  - Access detailed room information
  - View booking history
  - Check availability status
  
- **Update Rooms** (`PATCH /rooms/:id`)
  - Modify room details
  - Update pricing
  - Change room status
  - Update amenities
  
- **Delete Rooms** (`DELETE /rooms/:id`)
  - Remove rooms from inventory
  - Clean up obsolete listings

### 4. Booking Management
- **View All Bookings** (`GET /bookings`)
  - Access all bookings system-wide
  - Filter by user, hotel, or status
  - Monitor booking activity
  
- **View Booking Details** (`GET /bookings/:id`)
  - Access detailed booking information
  - View guest details
  - Check payment status
  
- **Update Bookings** (`PATCH /bookings/:id`)
  - Modify booking details
  - Change dates or guest information
  
- **Confirm Bookings** (`PATCH /bookings/:id/confirm`)
  - Approve pending bookings
  - Process confirmations
  
- **Cancel Bookings** (`PATCH /bookings/:id/cancel`)
  - Cancel bookings with reason
  - Process refunds
  
- **Complete Bookings** (`PATCH /bookings/:id/complete`)
  - Mark bookings as completed
  - Finalize transactions

### 5. System Monitoring
- Access to all system resources
- View system-wide statistics
- Monitor performance metrics
- Access audit logs
- Manage system configuration

### 6. Authentication & Profile
- **Register** (`POST /auth/register`)
- **Login** (`POST /auth/login`)
- **View Profile** (`GET /auth/profile`, `GET /auth/me`)
- **Update Profile** (`PATCH /users/:id`)

---

## Hotel Admin Features

Hotel Admins manage specific hotels assigned to them by Super Admins.

### 1. User Management (Limited)
- **View All Users** (`GET /users`)
  - View list of users (limited scope)
  - Access guest information for bookings at their hotels
  
- **View User Details** (`GET /users/:id`)
  - View details of users who booked at their hotels
  - Access contact information for coordination

### 2. Hotel Management (Assigned Hotels Only)
- **View Hotels** (`GET /hotels`)
  - View hotels assigned to them
  - Access hotel details they manage
  
- **View Hotel Details** (`GET /hotels/:id`)
  - Access detailed information for assigned hotels
  - View room inventory
  - Check performance statistics
  
- **Update Hotels** (`PATCH /hotels/:id`)
  - Update details for assigned hotels only
  - Modify amenities and descriptions
  - Update contact information
  - Adjust ratings (if permitted)

### 3. Room Management (Own Hotels Only)
- **Create Rooms** (`POST /rooms`)
  - Add rooms to their hotels
  - Set room types and pricing
  - Configure room amenities
  
- **View Rooms** (`GET /rooms`)
  - View rooms in their hotels
  - Check room status and availability
  - Filter by hotel
  
- **View Available Rooms** (`GET /rooms/available`)
  - Check room availability for specific dates
  - Manage inventory
  
- **View Room Details** (`GET /rooms/:id`)
  - Access detailed room information
  - View booking calendar
  
- **Update Rooms** (`PATCH /rooms/:id`)
  - Modify room details
  - Update pricing and availability
  - Change room status (available, maintenance, unavailable)
  - Update amenities
  
- **Delete Rooms** (`DELETE /rooms/:id`)
  - Remove rooms from their hotels

### 4. Booking Management (Own Hotels Only)
- **View Bookings** (`GET /bookings?hotelId=xxx`)
  - View all bookings for their hotels
  - Filter by date range
  - Monitor booking status
  
- **View Booking Details** (`GET /bookings/:id`)
  - Access detailed booking information
  - View guest details and requests
  - Check payment information
  
- **Update Bookings** (`PATCH /bookings/:id`)
  - Modify booking details
  - Accommodate special requests
  
- **Confirm Bookings** (`PATCH /bookings/:id/confirm`)
  - Approve pending bookings
  - Process reservations
  
- **Cancel Bookings** (`PATCH /bookings/:id/cancel`)
  - Cancel bookings when necessary
  - Provide cancellation reasons
  
- **Complete Bookings** (`PATCH /bookings/:id/complete`)
  - Mark bookings as completed
  - Process check-outs

### 5. Availability Management
- **Check Room Availability** (`GET /bookings/room/:roomId/availability`)
  - Check specific room availability
  - Manage booking calendar
  - Prevent double bookings

### 6. Dashboard Features
- **Hotel Performance Metrics**
  - View occupancy rates
  - Monitor revenue
  - Track booking trends
  
- **Booking Calendar**
  - Visual calendar of bookings
  - Manage room assignments
  - Track check-ins/check-outs
  
- **Guest Management**
  - View upcoming guests
  - Access guest preferences
  - Manage special requests

### 7. Authentication & Profile
- **Register** (`POST /auth/register?role=hotel`)
- **Login** (`POST /auth/login`)
- **View Profile** (`GET /auth/profile`, `GET /auth/me`)
- **Update Profile** (`PATCH /users/:id`)

---

## User (Client) Features

Regular users can search, book, and manage their hotel reservations.

### 1. Hotel Discovery
- **Browse Hotels** (`GET /hotels`)
  - View all available hotels
  - Filter by location
  - View hotel ratings and amenities
  
- **Search Hotels** (`GET /hotels/search`)
  - Search by name or keywords
  - Filter by location
  - Find specific hotels
  
- **View Hotel Details** (`GET /hotels/:id`)
  - View detailed hotel information
  - See amenities and contact info
  - Check location and ratings
  - View available rooms

### 2. Room Browsing
- **View Available Rooms** (`GET /rooms/available`)
  - Search rooms by hotel and dates
  - Check availability for specific periods
  - View room types and pricing
  - See room amenities
  
- **View Room Details** (`GET /rooms/:id`)
  - View detailed room information
  - Check pricing and capacity
  - See room amenities
  - View room photos/descriptions

### 3. Booking Management
- **Create Booking** (`POST /bookings`)
  - Book available rooms
  - Provide guest information
  - Specify dates and number of guests
  - Add special requests
  - Receive booking confirmation
  
- **View Own Bookings** (`GET /bookings?userId=xxx`)
  - View personal booking history
  - Filter by status (pending, confirmed, completed, cancelled)
  - Check upcoming reservations
  
- **View Booking Details** (`GET /bookings/:id`)
  - Access detailed booking information
  - View confirmation details
  - Check booking status
  - Download booking confirmation
  
- **Update Bookings** (`PATCH /bookings/:id`)
  - Modify own bookings (if allowed)
  - Update guest information
  - Change special requests
  
- **Cancel Bookings** (`PATCH /bookings/:id/cancel`)
  - Cancel own reservations
  - Provide cancellation reason
  - Request refunds

### 4. Search & Filter
- **Search by Location**
  - Find hotels in specific cities
  - Filter by proximity
  
- **Search by Dates**
  - Check availability for specific dates
  - Find rooms for desired period
  
- **Filter by Amenities**
  - Filter by hotel amenities (WiFi, Pool, Gym, etc.)
  - Filter by room amenities

### 5. Profile Management
- **View Profile** (`GET /auth/profile`, `GET /auth/me`)
  - View personal information
  - Check booking history
  - View saved preferences
  
- **Update Profile** (`PATCH /users/:id`)
  - Update personal information
  - Change contact details
  - Update password

### 6. Authentication
- **Register** (`POST /auth/register`)
  - Create new account
  - Provide basic information
  
- **Login** (`POST /auth/login`)
  - Access personal account
  - View bookings and profile

---

## Guest (Unauthenticated) Features

Guests can browse hotels and view information but cannot make bookings.

### 1. Hotel Discovery
- **Browse Hotels** (`GET /hotels`)
  - View all available hotels
  - Filter by location
  - View basic hotel information
  
- **Search Hotels** (`GET /hotels/search`)
  - Search by name or keywords
  - Filter by location
  
- **View Hotel Details** (`GET /hotels/:id`)
  - View detailed hotel information
  - See amenities and location
  - View contact information

### 2. Room Browsing
- **View Rooms** (`GET /rooms`)
  - View available room types
  - Check room pricing
  
- **View Available Rooms** (`GET /rooms/available`)
  - Check room availability
  - View room details
  
- **View Room Details** (`GET /rooms/:id`)
  - See room specifications
  - Check pricing and amenities

### 3. Authentication
- **Register** (`POST /auth/register`)
  - Create account to start booking
  - Choose user role
  
- **Login** (`POST /auth/login`)
  - Access existing account

**Note:** Guests must register/login to create bookings or access profile features.

---

## Feature Comparison Matrix

| Feature | Guest | User | Hotel Admin | Super Admin |
|---------|-------|------|-------------|-------------|
| **Authentication** |
| Register | ✅ | ✅ | ✅ | ✅ |
| Login | ✅ | ✅ | ✅ | ✅ |
| View Own Profile | ❌ | ✅ | ✅ | ✅ |
| Update Own Profile | ❌ | ✅ | ✅ | ✅ |
| **Hotels** |
| Browse Hotels | ✅ | ✅ | ✅ | ✅ |
| Search Hotels | ✅ | ✅ | ✅ | ✅ |
| View Hotel Details | ✅ | ✅ | ✅ | ✅ |
| Create Hotels | ❌ | ❌ | ❌ | ✅ |
| Update Hotels | ❌ | ❌ | ✅ (own) | ✅ (all) |
| Delete Hotels | ❌ | ❌ | ❌ | ✅ |
| **Rooms** |
| View Rooms | ✅ | ✅ | ✅ | ✅ |
| Check Availability | ✅ | ✅ | ✅ | ✅ |
| View Room Details | ✅ | ✅ | ✅ | ✅ |
| Create Rooms | ❌ | ❌ | ✅ (own) | ✅ (all) |
| Update Rooms | ❌ | ❌ | ✅ (own) | ✅ (all) |
| Delete Rooms | ❌ | ❌ | ✅ (own) | ✅ (all) |
| **Bookings** |
| Create Booking | ❌ | ✅ | ✅ | ✅ |
| View Own Bookings | ❌ | ✅ | ❌ | ❌ |
| View Hotel Bookings | ❌ | ❌ | ✅ (own) | ✅ (all) |
| View All Bookings | ❌ | ❌ | ❌ | ✅ |
| View Booking Details | ❌ | ✅ (own) | ✅ (own hotels) | ✅ (all) |
| Update Bookings | ❌ | ✅ (own) | ✅ (own hotels) | ✅ (all) |
| Confirm Bookings | ❌ | ❌ | ✅ (own hotels) | ✅ (all) |
| Cancel Bookings | ❌ | ✅ (own) | ✅ (own hotels) | ✅ (all) |
| Complete Bookings | ❌ | ❌ | ✅ (own hotels) | ✅ (all) |
| **User Management** |
| View Users List | ❌ | ❌ | ✅ (limited) | ✅ (all) |
| View User Details | ❌ | ❌ | ✅ (limited) | ✅ (all) |
| Create Users | ❌ | ❌ | ❌ | ✅ |
| Update Users | ❌ | ❌ | ❌ | ✅ |
| Delete Users | ❌ | ❌ | ❌ | ✅ |
| Assign Hotels to Users | ❌ | ❌ | ❌ | ✅ |
| **System Features** |
| Dashboard Access | ❌ | ✅ (client) | ✅ (hotel) | ✅ (admin) |
| Analytics & Reports | ❌ | ❌ | ✅ (own hotels) | ✅ (all) |
| System Configuration | ❌ | ❌ | ❌ | ✅ |

---

## Access Control Summary

### Authentication Requirements
- **Public Endpoints:** Hotel browsing, room viewing, search functionality
- **Authenticated Endpoints:** Bookings, profile management, user-specific data
- **Role-Protected Endpoints:** User management, hotel/room CRUD operations

### Authorization Guards
- **JWT Authentication:** Required for all protected endpoints
- **Role-Based Access Control (RBAC):** Enforced via `@Roles()` decorator
- **Resource Ownership:** Users can only access/modify their own bookings
- **Hotel Scope:** Hotel admins can only manage assigned hotels

### Security Features
- Password hashing with bcrypt
- JWT token-based authentication
- Role-based authorization
- Resource-level access control
- Redis-based distributed locking for booking concurrency
- Session management

---

## Frontend Access

### Public Pages
- Home page with hotel search
- Hotel listings page
- Hotel details page
- Room details page
- Login page
- Registration page

### User Dashboard (`/client`)
- My bookings
- Search and book hotels
- Booking history
- Profile management

### Hotel Admin Dashboard (`/hotel`)
- Hotel management
- Room management
- Booking management
- Guest information
- Analytics dashboard

### Super Admin Dashboard (`/admin`)
- User management (`/admin/users`)
- Hotel management (`/admin/hotels`)
- System-wide analytics
- Configuration settings

---

## Technical Implementation

### Backend (NestJS)
- **Guards:** `JwtAuthGuard`, `LocalAuthGuard`, `RolesGuard`
- **Decorators:** `@Roles()`, `@CurrentUser()`
- **Strategies:** JWT Strategy, Local Strategy

### Frontend (Next.js)
- **Auth Store:** Zustand-based authentication state
- **Protected Routes:** Client-side route guards
- **Role-based Rendering:** Conditional UI based on user role
- **API Integration:** Role-aware API calls

### Database
- **User Schema:** Includes role field and hotelIds array
- **Role Enum:** `USER`, `HOTEL_ADMIN`, `SUPER_ADMIN`
- **Indexes:** Optimized for role-based queries

---

## Future Enhancements

Potential features to add:
- Multi-hotel support for hotel admins
- Staff roles (receptionist, manager, etc.)
- Customer support role
- Loyalty program management
- Revenue management tools
- Advanced reporting and analytics
- Automated notifications
- Review and rating system
- Payment processing integration
- Multi-language support
- Mobile app with role-specific features

---

*Last Updated: February 1, 2026*
