#!/bin/bash
# Fix for "too many open files" error on macOS

# Increase file descriptor limit for current session
ulimit -n 10240

echo "✅ File descriptor limit increased to 10240"
echo ""
echo "To make this permanent, add to your ~/.zshrc:"
echo "ulimit -n 10240"
echo ""
echo "Or run this script before starting Expo:"
echo "source ./fix-file-limit.sh && npx expo start"
