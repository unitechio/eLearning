#!/bin/bash
echo "🌐 Đang khởi động Google Chrome ở chế độ Debug (Port 9222)..."
cd "$(dirname "$0")/gemini" || exit
/usr/bin/google-chrome --remote-debugging-port=9222 --user-data-dir="./gemini_profile" --no-first-run
