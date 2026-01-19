#!/bin/bash
set -e

# Startup script for Render deployment
# Attempts to sync database schema, then starts the server

echo "=== Starting niche-selection-server ==="
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"

# Function to wait for database with exponential backoff
wait_for_db() {
  local max_attempts=5
  local attempt=1
  local delay=2

  while [ $attempt -le $max_attempts ]; do
    echo "Attempting to connect to database (attempt $attempt/$max_attempts)..."

    if npx prisma db push --accept-data-loss 2>&1; then
      echo "Database schema synced successfully!"
      return 0
    fi

    if [ $attempt -lt $max_attempts ]; then
      echo "Database not ready, waiting ${delay}s before retry..."
      sleep $delay
      delay=$((delay * 2))
    fi

    attempt=$((attempt + 1))
  done

  echo "Warning: Could not sync database schema after $max_attempts attempts"
  echo "The server will start anyway - database operations may fail"
  return 0
}

# Attempt database sync (don't fail the startup if this fails)
wait_for_db || true

echo "Starting server..."
exec npm start
