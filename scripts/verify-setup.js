#!/usr/bin/env node

/**
 * Verify Setup Script for Thanh Social Network
 * Checks if all required files and configurations are in place
 */

const fs = require('fs');
const path = require('path');

const requiredFiles = [
  'package.json',
  'package-lock.json',
  '.env',
  'src/App.js',
  'src/index.js',
  'public/index.html',
  'public/manifest.json',
  '.gitignore',
  'README.md'
];

const requiredDirectories = [
  'src',
  'src/components',
  'src/pages', 
  'src/context',
  'src/lib',
  'public',
  'node_modules'
];

function checkFile(filePath) {
  const exists = fs.existsSync(filePath);
  const status = exists ? '✅' : '❌';
  console.log(`${status} ${filePath}`);
  return exists;
}

function checkDirectory(dirPath) {
  const exists = fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
  const status = exists ? '✅' : '❌';
  console.log(`${status} ${dirPath}/`);
  return exists;
}

function checkPackageLock() {
  if (!fs.existsSync('package-lock.json')) {
    console.log('❌ package-lock.json missing - run "npm install"');
    return false;
  }
  
  try {
    const packageLock = JSON.parse(fs.readFileSync('package-lock.json', 'utf8'));
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    if (packageLock.name !== packageJson.name) {
      console.log('⚠️  package-lock.json name mismatch');
      return false;
    }
    
    console.log('✅ package-lock.json is valid');
    return true;
  } catch (error) {
    console.log('❌ package-lock.json is corrupted');
    return false;
  }
}

function checkEnvironment() {
  if (!fs.existsSync('.env')) {
    console.log('❌ .env file missing');
    return false;
  }
  
  const envContent = fs.readFileSync('.env', 'utf8');
  const hasSupabaseUrl = envContent.includes('REACT_APP_SUPABASE_URL=');
  const hasSupabaseKey = envContent.includes('REACT_APP_SUPABASE_ANON_KEY=');
  const hasPlaceholders = envContent.includes('your_supabase_project_url') || 
                          envContent.includes('your_supabase_anon_key');
  
  if (!hasSupabaseUrl || !hasSupabaseKey) {
    console.log('❌ .env missing required Supabase variables');
    return false;
  }
  
  if (hasPlaceholders) {
    console.log('⚠️  .env contains placeholder values - update with real Supabase credentials');
    return false;
  }
  
  console.log('✅ .env is configured');
  return true;
}

function checkNodeModules() {
  const requiredPackages = [
    'react',
    'react-dom', 
    'react-router-dom',
    '@supabase/supabase-js',
    'lucide-react',
    'date-fns'
  ];
  
  let allInstalled = true;
  
  for (const pkg of requiredPackages) {
    const pkgPath = path.join('node_modules', pkg);
    if (!fs.existsSync(pkgPath)) {
      console.log(`❌ ${pkg} not installed`);
      allInstalled = false;
    }
  }
  
  if (allInstalled) {
    console.log('✅ All required packages installed');
  }
  
  return allInstalled;
}

console.log('🔍 Verifying Thanh Social Network Setup...');
console.log('==========================================\n');

console.log('📁 Checking required directories:');
let directoriesOk = true;
for (const dir of requiredDirectories) {
  if (!checkDirectory(dir)) {
    directoriesOk = false;
  }
}

console.log('\n📄 Checking required files:');
let filesOk = true;
for (const file of requiredFiles) {
  if (!checkFile(file)) {
    filesOk = false;
  }
}

console.log('\n🔒 Checking package-lock.json:');
const packageLockOk = checkPackageLock();

console.log('\n🌍 Checking environment:');
const envOk = checkEnvironment();

console.log('\n📦 Checking node_modules:');
const packagesOk = checkNodeModules();

console.log('\n==========================================');

if (directoriesOk && filesOk && packageLockOk && envOk && packagesOk) {
  console.log('🎉 Setup verification PASSED!');
  console.log('\nYou can now run:');
  console.log('  npm start     - Start development server');
  console.log('  npm run build - Build for production');
  console.log('  npm run deploy - Deploy to GitHub Pages');
  process.exit(0);
} else {
  console.log('❌ Setup verification FAILED!');
  console.log('\nPlease fix the issues above and run again.');
  console.log('\nCommon fixes:');
  console.log('  npm install                    - Install missing packages');
  console.log('  cp .env.example .env          - Create environment file');
  console.log('  mkdir -p src/components       - Create missing directories');
  process.exit(1);
}