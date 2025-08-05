#!/usr/bin/env node

/**
 * Quick Setup Script for Thanh Social Network
 * Handles package-lock.json generation and basic setup
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Quick Setup for Thanh Social Network');
console.log('=====================================\n');

// Check Node.js version
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.split('.')[0].substring(1));

if (majorVersion < 16) {
  console.error(`❌ Node.js ${majorVersion} is not supported. Please use Node.js 16 or higher.`);
  process.exit(1);
}

console.log(`✅ Node.js ${nodeVersion} detected`);

// Function to run command with proper error handling
function runCommand(command, description) {
  console.log(`🔄 ${description}...`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${description} completed`);
    return true;
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message);
    return false;
  }
}

// Check if package.json exists
if (!fs.existsSync('package.json')) {
  console.error('❌ package.json not found. Make sure you are in the project root directory.');
  process.exit(1);
}

// Clean previous installation
if (fs.existsSync('node_modules')) {
  console.log('🧹 Cleaning previous installation...');
  try {
    execSync('rm -rf node_modules package-lock.json', { stdio: 'inherit' });
    console.log('✅ Previous installation cleaned');
  } catch (error) {
    console.log('⚠️  Could not clean previous installation, continuing...');
  }
}

// Install dependencies and generate package-lock.json
console.log('📦 Installing dependencies and generating package-lock.json...');
const installSuccess = runCommand('npm install', 'Dependencies installation');

if (!installSuccess) {
  console.error('❌ Failed to install dependencies');
  process.exit(1);
}

// Verify package-lock.json was created
if (!fs.existsSync('package-lock.json')) {
  console.error('❌ package-lock.json was not created');
  console.log('🔄 Trying alternative method...');
  
  const altInstallSuccess = runCommand('npm install --package-lock-only', 'Alternative package-lock generation');
  
  if (!altInstallSuccess || !fs.existsSync('package-lock.json')) {
    console.error('❌ Failed to create package-lock.json');
    process.exit(1);
  }
}

console.log('✅ package-lock.json created successfully');

// Create .env file if it doesn't exist
if (!fs.existsSync('.env')) {
  if (fs.existsSync('.env.example')) {
    console.log('📝 Creating .env file from template...');
    fs.copyFileSync('.env.example', '.env');
    console.log('✅ .env file created');
    console.log('⚠️  Please update .env with your Supabase credentials');
  } else {
    console.log('📝 Creating basic .env file...');
    const envContent = `# Supabase Configuration
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
`;
    fs.writeFileSync('.env', envContent);
    console.log('✅ Basic .env file created');
    console.log('⚠️  Please update .env with your Supabase credentials');
  }
}

// Test build
console.log('🔨 Testing build process...');
const buildSuccess = runCommand('npm run build', 'Build test');

if (!buildSuccess) {
  console.log('⚠️  Build test failed, but setup continues...');
  console.log('   This might be due to missing Supabase credentials');
}

// Display results
console.log('\n🎉 Quick setup completed!');
console.log('========================\n');

// Check file sizes and provide info
const packageLockStats = fs.statSync('package-lock.json');
const nodeModulesExists = fs.existsSync('node_modules');

console.log('📊 Setup Summary:');
console.log(`   • package-lock.json: ${Math.round(packageLockStats.size / 1024)}KB`);
console.log(`   • node_modules: ${nodeModulesExists ? '✅ Created' : '❌ Missing'}`);
console.log(`   • .env file: ${fs.existsSync('.env') ? '✅ Created' : '❌ Missing'}`);

console.log('\n📋 Next steps:');
console.log('1. Update .env file with your Supabase credentials');
console.log('2. Update package.json homepage with your GitHub username');
console.log('3. Run "npm start" to start development server');
console.log('4. Run "npm run deploy" to deploy to GitHub Pages');

console.log('\n🔧 Available commands:');
console.log('   npm start          - Start development server');
console.log('   npm run build      - Build for production');
console.log('   npm run deploy     - Deploy to GitHub Pages');
console.log('   npm run verify     - Verify setup');

console.log('\n✨ Happy coding!');

// Exit with success
process.exit(0);