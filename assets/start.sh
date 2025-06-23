#!/bin/bash

APP_NAME="invoice-assistant-electron.app"

# 尝试几个常见路径
if [ -d "/Applications/$APP_NAME" ]; then
  APP_PATH="/Applications/$APP_NAME"
elif [ -d "$HOME/Downloads/$APP_NAME" ]; then
  APP_PATH="$HOME/Downloads/$APP_NAME"
elif [ -d "$(dirname "$0")/$APP_NAME" ]; then
  APP_PATH="$(dirname "$0")/$APP_NAME"
else
  osascript -e 'display dialog "未找到 invoice-assistant-electron.app，请确认应用位置。" buttons {"好"} with icon stop'
  exit 1
fi

# 解锁 macOS quarantine
xattr -cr "$APP_PATH"

# 打开 app
open "$APP_PATH"
