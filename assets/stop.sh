#!/bin/bash

PORT=8123
PIDS=$(lsof -ti tcp:$PORT)

if [ -z "$PIDS" ]; then
  echo "✅ No process found on port $PORT."
else
  echo "🛑 Killing process on port $PORT: $PIDS"
  kill -9 $PIDS
fi
