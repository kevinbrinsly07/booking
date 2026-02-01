#!/bin/bash

echo "🚀 Starting Hotel Booking System (No Docker)"
echo "============================================="

# Check if MongoDB Atlas URL is set
if grep -q "mongodb+srv://" backend/.env 2>/dev/null || grep -q "mongodb://" backend/.env 2>/dev/null; then
    echo "✅ MongoDB Atlas URL configured"
else
    echo "⚠️  WARNING: MongoDB Atlas URL not configured in backend/.env"
    echo "   Please add your MongoDB Atlas connection string:"
    echo "   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hotel-booking"
    exit 1
fi

# Check if Redis is running (optional)
if command -v redis-cli &> /dev/null; then
    if redis-cli ping &> /dev/null; then
        echo "✅ Redis is running"
    else
        echo "⚠️  Redis is not running. Starting Redis..."
        if command -v brew &> /dev/null; then
            brew services start redis
            sleep 2
        else
            echo "❌ Please install and start Redis manually, or the app will run without caching"
        fi
    fi
else
    echo "ℹ️  Redis not installed - app will run without caching (optional feature)"
fi

# Start backend
echo ""
echo "📦 Starting Backend..."
cd backend

if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
fi

if [ ! -f ".env" ]; then
    echo "Creating .env from example..."
    cp .env.example .env
    echo "⚠️  Please edit backend/.env and add your MongoDB Atlas URL"
    exit 1
fi

# Start backend in background
npm run start:dev > ../backend.log 2>&1 &
BACKEND_PID=$!
echo "✅ Backend started (PID: $BACKEND_PID)"
echo "   Logs: backend.log"
echo "   API: http://localhost:3001/api"

# Start frontend
cd ../frontend
echo ""
echo "🎨 Starting Frontend..."

if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

if [ ! -f ".env.local" ]; then
    echo "Creating .env.local from example..."
    cp .env.local.example .env.local
fi

# Start frontend in background
npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!
echo "✅ Frontend started (PID: $FRONTEND_PID)"
echo "   Logs: frontend.log"
echo "   App: http://localhost:3000"

cd ..

# Save PIDs
echo $BACKEND_PID > .backend.pid
echo $FRONTEND_PID > .frontend.pid

echo ""
echo "============================================="
echo "✨ Hotel Booking System is running!"
echo ""
echo "Frontend:  http://localhost:3000"
echo "Backend:   http://localhost:3001/api"
echo ""
echo "To stop: ./stop.sh"
echo "To view logs: tail -f backend.log frontend.log"
echo "============================================="
