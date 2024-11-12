#!/bin/sh

set -e

# Check if NODE_ENV is set, default to 'development' if not
if [ -z "$NODE_ENV" ]; then
  NODE_ENV="development"
  echo "NODE_ENV not found, defaulting to 'development'"
else
  echo "NODE_ENV is set to '$NODE_ENV'"
fi

# Retrieve SERVER_HOST from environment variables
if [ "$NODE_ENV" = "production" ]; then
  if [ -z "$SERVER_HOST" ]; then
    echo "SERVER_HOST not found in the environment. Exiting."
    exit 1
  fi
else
  SERVER_HOST="127.0.0.1"
fi
echo "Setting SERVER_HOST to $SERVER_HOST"

# Directory to search in
TARGET_DIR="/app/src/public"

if [ "$NODE_ENV" = "production" ]; then
  for file in $TARGET_DIR; do
    if [ -f "$file" ]; then
      echo "Processing $file..."

      # Replace all occurrences of '127.0.0.1' with SERVER_HOST
      awk -v url="$SERVER_HOST" '{gsub(/127\.0\.0\.1/, url); print}' "$file" > "${file}.tmp" && mv "${file}.tmp" "$file"
      
      echo "Updated SERVER_HOST in $file"
    fi
  done
else
  echo "Running in development mode, no changes made to src/public files."
fi


# Execute remaining commands
exec "$@"
