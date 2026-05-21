#!/bin/bash

# Kill all node processes
echo "Killing existing Node processes..."
ps aux | grep "node" | grep -v grep | awk '{print $2}' | xargs kill -9 2>/dev/null || true

# Wait for processes to terminate
sleep 2

# Start backend
echo "Starting backend server..."
cd backend
npm run dev
