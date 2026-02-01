# API Documentation

Base URL: `http://localhost:3001/api`

## Hotels API

### Create Hotel
```http
POST /hotels
Content-Type: application/json

{
  "name": "Grand Plaza Hotel",
  "location": "New York, NY",
  "description": "Luxury hotel in downtown Manhattan",
  "rating": 4.5,
  "amenities": ["WiFi", "Pool", "Gym", "Restaurant"],
  "contactInfo": {
    "email": "info@grandplaza.com",
    "phone": "+1-555-0100",
    "address": "123 Broadway, New York, NY 10001"
  }
}
```

### List Hotels
```http
GET /hotels
GET /hotels?location=New York
```

### Search Hotels
```http
GET /hotels/search?q=plaza&location=New York
```

### Get Hotel by ID
```http
GET /hotels/:id
```

### Update Hotel
```http
PATCH /hotels/:id
Content-Type: application/json

{
  "rating": 4.8,
  "amenities": ["WiFi", "Pool", "Gym", "Restaurant", "Spa"]
}
```

### Delete Hotel
```http
DELETE /hotels/:id
```

## Rooms API

### Create Room
```http
POST /rooms
Content-Type: application/json

{
  "hotelId": "65a1234567890abcdef12345",
  "roomNumber": "101",
  "type": "Deluxe Suite",
  "price": 250,
  "capacity": 2,
  "amenities": ["King Bed", "Ocean View", "Balcony"],
  "description": "Spacious suite with ocean view"
}
```

### List Rooms
```http
GET /rooms
GET /rooms?hotelId=65a1234567890abcdef12345
```

### Check Available Rooms
```http
GET /rooms/available?hotelId=65a1234567890abcdef12345&checkIn=2026-02-15&checkOut=2026-02-18
```

### Get Room by ID
```http
GET /rooms/:id
```

### Update Room
```http
PATCH /rooms/:id
Content-Type: application/json

{
  "price": 275,
  "status": "available"
}
```

### Delete Room
```http
DELETE /rooms/:id
```

## Bookings API

### Create Booking
```http
POST /bookings
Content-Type: application/json

{
  "hotelId": "65a1234567890abcdef12345",
  "roomId": "65a1234567890abcdef12346",
  "userId": "user123",
  "guestName": "John Doe",
  "guestEmail": "john@example.com",
  "guestPhone": "+1-555-0123",
  "checkIn": "2026-02-15",
  "checkOut": "2026-02-18",
  "guests": 2,
  "specialRequests": "Late check-in please"
}
```

**Response:**
```json
{
  "_id": "65a1234567890abcdef12347",
  "hotelId": "65a1234567890abcdef12345",
  "roomId": "65a1234567890abcdef12346",
  "userId": "user123",
  "guestName": "John Doe",
  "guestEmail": "john@example.com",
  "checkIn": "2026-02-15T00:00:00.000Z",
  "checkOut": "2026-02-18T00:00:00.000Z",
  "guests": 2,
  "status": "pending",
  "totalAmount": 750,
  "version": 0,
  "createdAt": "2026-01-31T10:00:00.000Z"
}
```

### List Bookings
```http
GET /bookings
GET /bookings?userId=user123
GET /bookings?hotelId=65a1234567890abcdef12345
```

### Get Booking by ID
```http
GET /bookings/:id
```

### Update Booking
```http
PATCH /bookings/:id
Content-Type: application/json

{
  "guests": 3,
  "specialRequests": "Need extra bed"
}
```

### Confirm Booking
```http
PATCH /bookings/:id/confirm
```

### Cancel Booking
```http
PATCH /bookings/:id/cancel
Content-Type: application/json

{
  "cancellationReason": "Change of plans"
}
```

### Complete Booking
```http
PATCH /bookings/:id/complete
```

### Check Room Availability
```http
GET /bookings/room/:roomId/availability?checkIn=2026-02-15&checkOut=2026-02-18
```

**Response:**
```json
{
  "available": true
}
```

## Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    "checkOut date must be after checkIn date"
  ]
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Hotel with ID 65a1234567890abcdef12345 not found"
}
```

### 409 Conflict
```json
{
  "statusCode": 409,
  "message": "Room is currently being booked by another user. Please try again."
}
```

### 429 Too Many Requests
```json
{
  "statusCode": 429,
  "message": "ThrottlerException: Too Many Requests"
}
```

## Status Codes

- `200 OK` - Successful GET/PATCH request
- `201 Created` - Successful POST request
- `400 Bad Request` - Invalid input data
- `404 Not Found` - Resource not found
- `409 Conflict` - Conflict (e.g., double booking)
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error

## Rate Limiting

- Default limit: 100 requests per minute per IP
- Headers included in response:
  - `X-RateLimit-Limit`: Maximum requests allowed
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Time when limit resets

## Pagination

For endpoints that return lists, use query parameters:

```http
GET /bookings?page=1&limit=10
```

## Filtering

Use query parameters for filtering:

```http
GET /bookings?status=confirmed&userId=user123
```

## Sorting

Use `sort` query parameter:

```http
GET /bookings?sort=-createdAt  # Descending
GET /bookings?sort=totalAmount # Ascending
```

## Example Workflows

### Complete Booking Flow

1. **Search for hotels**
```http
GET /hotels/search?q=beach&location=Miami
```

2. **Get hotel details**
```http
GET /hotels/65a1234567890abcdef12345
```

3. **Check room availability**
```http
GET /rooms/available?hotelId=65a1234567890abcdef12345&checkIn=2026-02-15&checkOut=2026-02-18
```

4. **Create booking**
```http
POST /bookings
{
  "hotelId": "65a1234567890abcdef12345",
  "roomId": "65a1234567890abcdef12346",
  ...
}
```

5. **Confirm booking**
```http
PATCH /bookings/65a1234567890abcdef12347/confirm
```

### Hotel Management Flow

1. **Create hotel**
```http
POST /hotels
```

2. **Add rooms**
```http
POST /rooms
```

3. **View bookings**
```http
GET /bookings?hotelId=65a1234567890abcdef12345
```

4. **Update booking status**
```http
PATCH /bookings/65a1234567890abcdef12347/complete
```

## Testing with cURL

```bash
# Create a hotel
curl -X POST http://localhost:3001/api/hotels \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Hotel",
    "location": "Test City",
    "rating": 4.0
  }'

# Get all hotels
curl http://localhost:3001/api/hotels

# Create a booking
curl -X POST http://localhost:3001/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "hotelId": "YOUR_HOTEL_ID",
    "roomId": "YOUR_ROOM_ID",
    "userId": "user123",
    "guestName": "John Doe",
    "guestEmail": "john@example.com",
    "checkIn": "2026-02-15",
    "checkOut": "2026-02-18",
    "guests": 2
  }'
```

## Postman Collection

Import this JSON to get started with Postman:

```json
{
  "info": {
    "name": "Hotel Booking API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Hotels",
      "item": []
    },
    {
      "name": "Rooms",
      "item": []
    },
    {
      "name": "Bookings",
      "item": []
    }
  ]
}
```
