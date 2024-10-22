#!/bin/sh

# DEPRECATE this pos
set -e

# Check if NODE_ENV is set, default to 'development' if not
if [ -z "$NODE_ENV" ]; then
  NODE_ENV="development"
  echo "NODE_ENV not found, defaulting to 'development'"
else
  echo "NODE_ENV is set to '$NODE_ENV'"
fi

# Set SERVER_URL based on NODE_ENV
if [ "$NODE_ENV" = "development" ]; then
  SERVER_URL="http://127.0.0.1:3001"
else
  : "${SERVER_URL:=http://127.0.0.1:3001}"  # Use provided SERVER_URL or default to localhost
fi
echo "Setting SERVER_URL to $SERVER_URL"

# Set file path based on NODE_ENV
if [ "$NODE_ENV" = "development" ]; then
  FILE_PATH="src/public/add_person.html"
else
  FILE_PATH="/app/src/public/add_person.html"
fi

# Check if the file exists and replace the placeholder
if [ -f "$FILE_PATH" ]; then
  echo "File exists. Content before replacement:"
  cat "$FILE_PATH"

  # Escape special characters in SERVER_URL
  ESCAPED_SERVER_URL=$(printf '%s\n' "$SERVER_URL" | sed -e 's/[\/&]/\\&/g')
  echo "Escaped SERVER_URL: $ESCAPED_SERVER_URL"

  # Use awk instead of sed for more reliable replacement
  awk -v url="$ESCAPED_SERVER_URL" '{gsub(/{{SERVER_URL}}/, url); print}' "$FILE_PATH" > "${FILE_PATH}.tmp" && mv "${FILE_PATH}.tmp" "$FILE_PATH"

  echo "Updated SERVER_URL in $FILE_PATH"
  echo "File content after replacement:"
  cat "$FILE_PATH"
else
  echo "File not found: $FILE_PATH"
fi

# Execute remaining commands
exec "$@"
