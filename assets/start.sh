#!/bin/bash

APP_NAME="invoice-assistant-electron.app"
APP_PATH="$(dirname "$0")/$APP_NAME"

echo "🔧 Removing macOS quarantine attributes..."
xattr -cr "$APP_PATH"

echo "🚀 Launching application..."
open "$APP_PATH"
