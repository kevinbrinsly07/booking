# Quick Start Guide - Manual Setup (No Docker)

Since Docker is not running, follow these steps to set up the project manually:

## Prerequisites Check

```bash
# Check if Node.js is installed
node --version  # Should be 18 or higher

# Check if MongoDB is installed
mongod --version

# Check if Redis is installed
redis-server --version
```

## Step 1: Install Prerequisites (if needed)

### Install Homebrew (if not installed)
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### Install MongoDB
```bash
brew tap mongodb/brew
brew install mongodb-community
```

### Install Redis
```bash
brew install redis
```

## Step 2: Start Services

### Terminal 1 - Start MongoDB
```bash
brew services start mongodb-community
# Or run directly: mongod --config /usr/local/etc/mongod.conf
```

### Terminal 2 - Start Redis
```bash
brew services start redis
# Or run directly: redis-server
```

## Step 3: Setup Backend

### Terminal 3 - Backend
```bash
cd /Users/kevinbrinsly/booking/backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start backend
npm run start:dev
```

## Step 4: Setup Frontend

### Terminal 4 - Frontend
```bash
cd /Users/kevinbrinsly/booking/frontend

# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local

# Start frontend
npm run dev
```

## Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api

## Verify Services are Running

```bash
# Check MongoDB
mongosh --eval "db.version()"

# Check Redis
redis-cli ping  # Should return PONG

# Check Backend
curl http://localhost:3001/api/hotels

# Check Frontend
open http://localhost:3000
```

## Alternative: Start Docker Desktop

If you want to use Docker instead:

1. Open Docker Desktop application from your Applications folder
2. Wait for Docker to start (whale icon in menu bar should be active)
3. Then run:
```bash
cd /Users/kevinbrinsly/booking
docker-compose up -d
```

## Troubleshooting

### MongoDB won't start
```bash
# Check if port 27017 is in use
lsof -i :27017

# If something is using it, kill it or change port in .env
```

### Redis won't start
```bash
# Check if port 6379 is in use
lsof -i :6379
```

### Port conflicts
```bash
# Backend (3001) or Frontend (3000) port in use
lsof -i :3001
lsof -i :3000

# Kill the process
kill -9 <PID>
```

## Quick Test

Once everything is running, test the API:

```bash
# Create a hotel
curl -X POST http://localhost:3001/api/hotels \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Hotel",
    "location": "San Francisco",
    "description": "A test hotel",
    "rating": 4.5
  }'
```

Then visit http://localhost:3000 to see the frontend!
