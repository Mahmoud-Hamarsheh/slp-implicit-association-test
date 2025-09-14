#!/usr/bin/env bash
# Exit on error
set -o errexit

# Debug information
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"
echo "Current directory: $(pwd)"
echo "Files in directory: $(ls -la)"

# Install dependencies
echo "Installing dependencies..."
npm ci --verbose

# Check if build directory exists
echo "Checking build directory..."
if [ ! -d "dist" ]; then
    echo "Creating dist directory..."
    mkdir -p dist
fi

# Build the project
echo "Building project..."
npm run build

# Verify build output
echo "Build completed. Checking output..."
if [ -d "dist" ]; then
    echo "Dist directory contents:"
    ls -la dist/
else
    echo "ERROR: Dist directory not found after build!"
    exit 1
fi

echo "Build script completed successfully!"
