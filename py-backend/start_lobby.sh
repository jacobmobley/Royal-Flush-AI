#!/bin/bash

# Ensure a port number is provided
if [ -z "$1" ]; then
  echo "Usage: $0 <port>"
  exit 1
fi

PORT=$1

# Run the poker server on the specified port
echo "Starting poker server on port $PORT..."
python3 poker_server.py "$PORT" &

# Save the PID of the background process
PID=$!
echo $PID > "poker_server_$PORT.pid"

echo "Poker server started on port $PORT with PID $PID"