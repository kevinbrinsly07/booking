# Quick Start Guide - No Docker Required

## Setup (One Time)

### 1. Get MongoDB Atlas Connection String

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a free cluster (if you don't have one)
3. Click "Connect" → "Connect your application"
4. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
5. Replace `<password>` with your database user password
6. Add the database name: `mongodb+srv://username:password@cluster.mongodb.net/hotel-booking`

### 2. Configure Backend

```bash
cd backend
cp .env.example .env
nano .env  # or use any text editor
```

**Replace this line in `.env`:**
```
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/hotel-booking?retryWrites=true&w=majority
```

With your actual MongoDB Atlas connection string.

### 3. Install Dependencies

Backend:
```bash
cd backend
npm install
```

Frontend:
```bash
cd frontend
npm install
cp .env.local.example .env.local
```

## Running the Application

### Option 1: Use Startup Script (Recommended)

```bash
# Start everything
./start.sh

# Stop everything
./stop.sh
```

### Option 2: Manual Start

**Terminal 1 - Backend:**
```bash
cd backend
npm run start:dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001/api
- **API Docs:** http://localhost:3001/api/hotels (test endpoint)

## Redis (Optional)

Redis provides caching and distributed locking but is **optional**.

### Install Redis (macOS):
```bash
brew install redis
brew services start redis
```

### Without Redis:
The app will work fine without Redis, just without:
- Response caching (slightly slower)
- Distributed locking (but still safe with MongoDB transactions)

## Testing the API

```bash
# Create a test hotel
curl -X POST http://localhost:3001/api/hotels \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Hotel",
    "location": "San Francisco, CA",
    "description": "A beautiful test hotel",
    "rating": 4.5
  }'

# Get all hotels
curl http://localhost:3001/api/hotels
```

## Troubleshooting

### "Cannot connect to MongoDB"
- Check your MongoDB Atlas connection string in `backend/.env`
- Make sure your IP is whitelisted in MongoDB Atlas (Network Access)
- Verify username and password are correct

### Port already in use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 3001
lsof -ti:3001 | xargs kill -9
```

### "Module not found" errors
```bash
# Reinstall dependencies
cd backend && rm -rf node_modules && npm install
cd frontend && rm -rf node_modules && npm install
```

## View Logs

```bash
# View backend logs
tail -f backend.log

# View frontend logs
tail -f frontend.log

# View both
tail -f backend.log frontend.log
```

## MongoDB Atlas Tips

### Whitelist Your IP
1. Go to MongoDB Atlas Dashboard
2. Network Access → Add IP Address
3. Add your current IP or use `0.0.0.0/0` (allow all - for development only)

### Create Database User
1. Database Access → Add New Database User
2. Choose "Password" authentication
3. Set username and password
4. Grant "Read and write to any database" role

## Production Deployment

When deploying to production:

1. **Use environment variables** for sensitive data
2. **Enable MongoDB Atlas IP whitelist** with your server's IP
3. **Use production MongoDB cluster** (not shared/free tier)
4. **Enable Redis** for better performance
5. **Set strong JWT_SECRET** in `.env`
6. **Enable HTTPS**

## Next Steps

1. ✅ Configure MongoDB Atlas
2. ✅ Run `./start.sh`
3. ✅ Open http://localhost:3000
4. 🎉 Start building!

For detailed API documentation, see [API.md](API.md)
