#!/bin/bash

# Thanh Social Network - Setup Script
# This script will help you set up the project quickly

set -e

echo "🚀 Setting up Thanh Social Network..."
echo "======================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check if Git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

echo "✅ Git detected"

# Clean and install dependencies
echo "📦 Installing dependencies..."
if [ -f package-lock.json ]; then
    echo "   Using existing package-lock.json..."
    npm ci
else
    echo "   Creating package-lock.json..."
    npm install
fi

# Verify package-lock.json was created
if [ ! -f package-lock.json ]; then
    echo "❌ package-lock.json was not created. Running npm install again..."
    rm -rf node_modules
    npm install
fi

echo "✅ package-lock.json created successfully"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please update .env file with your Supabase credentials:"
    echo "   - REACT_APP_SUPABASE_URL"
    echo "   - REACT_APP_SUPABASE_ANON_KEY"
fi

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p public/images
mkdir -p src/components
mkdir -p src/pages
mkdir -p src/context
mkdir -p src/lib
mkdir -p src/utils

# Check if Supabase credentials are set
if grep -q "your_supabase_project_url" .env; then
    echo "⚠️  Warning: Please update your Supabase credentials in .env file"
    echo "   Current .env contents:"
    cat .env
fi

# Run tests to make sure everything works
echo "🧪 Running tests..."
npm test -- --watchAll=false --testPathIgnorePatterns=[] || echo "⚠️  Some tests failed, but setup continues..."

# Build the project to check for errors
echo "🔨 Building project..."
npm run build

echo ""
echo "🎉 Setup completed successfully!"
echo "=============================="
echo ""
echo "Next steps:"
echo "1. Update .env file with your Supabase credentials"
echo "2. Run 'npm start' to start development server"
echo "3. Visit http://localhost:3000 to see your app"
echo ""
echo "For deployment:"
echo "1. Update 'homepage' in package.json with your GitHub username"
echo "2. Run 'npm run deploy' to deploy to GitHub Pages"
echo ""
echo "Need help? Check out:"
echo "- README.md for detailed instructions"
echo "- DEPLOYMENT_GUIDE.md for deployment help"
echo "- https://supabase.com/docs for Supabase setup"
echo ""
echo "Happy coding! 🚀"