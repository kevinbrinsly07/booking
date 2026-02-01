# Hotel Booking System - Setup Guide

## Quick Start with Docker

The easiest way to run the entire application stack:

```bash
# Start all services (MongoDB, Redis, Backend, Frontend)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Stop and remove volumes (fresh start)
docker-compose down -v
```

Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api
- MongoDB: localhost:27017
- Redis: localhost:6379

## Manual Setup

### 1. Install Prerequisites

#### macOS
```bash
# Install Homebrew if not already installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node

# Install MongoDB
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Install Redis
brew install redis
brew services start redis
```

#### Linux (Ubuntu/Debian)
```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod

# Install Redis
sudo apt-get install redis-server
sudo systemctl start redis-server
```

#### Windows
1. Download and install Node.js from https://nodejs.org
2. Download and install MongoDB from https://www.mongodb.com/try/download/community
3. Download and install Redis from https://github.com/microsoftarchive/redis/releases

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env file with your configuration
nano .env  # or use your preferred editor

# Run database migrations/seed (optional)
# npm run seed

# Start in development mode
npm run start:dev

# Or start in production mode
npm run build
npm run start:prod
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.local.example .env.local

# Edit .env.local
nano .env.local

# Start development server
npm run dev

# Or build for production
npm run build
npm run start
```

## Verification

### Check MongoDB Connection
```bash
mongosh
> show dbs
> use hotel-booking
> show collections
```

### Check Redis Connection
```bash
redis-cli
> ping
PONG
> exit
```

### Test Backend API
```bash
curl http://localhost:3001/api/hotels
```

### Test Frontend
Open browser and navigate to http://localhost:3000

## Development Workflow

### Running Tests

#### Backend Tests
```bash
cd backend

# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov

# Watch mode
npm run test:watch
```

#### Frontend Tests
```bash
cd frontend

# Run tests
npm run test

# Watch mode
npm run test:watch
```

### Code Formatting

#### Backend
```bash
cd backend
npm run format
npm run lint
```

#### Frontend
```bash
cd frontend
npm run lint
```

## Seeding Sample Data

To populate the database with sample data for testing:

```bash
cd backend

# Create seed script (save as src/seed.ts)
# Then run:
ts-node src/seed.ts
```

## Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
brew services list  # macOS
sudo systemctl status mongod  # Linux

# Restart MongoDB
brew services restart mongodb-community  # macOS
sudo systemctl restart mongod  # Linux
```

### Redis Connection Issues
```bash
# Check if Redis is running
brew services list  # macOS
sudo systemctl status redis  # Linux

# Restart Redis
brew services restart redis  # macOS
sudo systemctl restart redis  # Linux
```

### Port Already in Use
```bash
# Find process using port 3000 or 3001
lsof -i :3000
lsof -i :3001

# Kill the process
kill -9 <PID>
```

### Clear Node Modules and Reinstall
```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules package-lock.json .next
npm install
```

## Environment Variables Reference

### Backend (.env)
```env
# Application
NODE_ENV=development          # development | production
PORT=3001                     # Backend port

# Database
MONGODB_URI=mongodb://localhost:27017/hotel-booking

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=               # Optional

# Security
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRATION=7d

# Rate Limiting
THROTTLE_TTL=60              # Time window in seconds
THROTTLE_LIMIT=100           # Max requests per window

# CORS
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env.local)
```env
# API
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Production Deployment

### Using Docker

1. Build images:
```bash
docker-compose build
```

2. Start services:
```bash
docker-compose up -d
```

3. Check logs:
```bash
docker-compose logs -f
```

### Manual Deployment

#### Backend
```bash
cd backend
npm run build
NODE_ENV=production node dist/main
```

#### Frontend
```bash
cd frontend
npm run build
npm run start
```

## Monitoring

### Check Application Health
```bash
# Backend
curl http://localhost:3001/api/health

# Frontend
curl http://localhost:3000
```

### Monitor Redis
```bash
redis-cli
> INFO
> MONITOR
```

### Monitor MongoDB
```bash
mongosh
> db.serverStatus()
> db.currentOp()
```

## Next Steps

1. ✅ Verify all services are running
2. ✅ Test the API endpoints
3. ✅ Explore the frontend interface
4. ✅ Create test bookings
5. ✅ Review the code structure
6. 🔧 Customize for your needs
7. 🚀 Deploy to production

## Support

For issues or questions:
1. Check the main README.md
2. Review the troubleshooting section above
3. Check application logs
4. Open an issue on GitHub

Happy coding! 🎉
