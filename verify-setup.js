// verify-setup.js
// Quick verification script to check if the lab report system is ready

const fs = require('fs');
const path = require('path');

console.log('🔍 MediChive Lab Report Setup Verification\n');

// Check if required files exist
const requiredFiles = [
  'src/lab-report/lab-report.controller.ts',
  'src/lab-report/lab-report.service.ts',
  'src/lab-report/lab-report.module.ts',
  'src/lab-report/dto/create-lab-report.dto.ts',
  'src/lab-report/dto/update-lab-report.dto.ts',
  'src/lab-report/entities/lab-report.entity.ts',
  'src/prisma/prisma.service.ts',
  '.env',
  'package.json'
];

console.log('📁 Checking required files...');
let missingFiles = [];

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`   ✅ ${file}`);
  } else {
    console.log(`   ❌ ${file} - MISSING`);
    missingFiles.push(file);
  }
});

// Check uploads directory
const uploadsDir = path.join('uploads', 'lab-reports');
if (fs.existsSync(uploadsDir)) {
  console.log(`   ✅ ${uploadsDir}/`);
} else {
  console.log(`   ⚠️  ${uploadsDir}/ - Will be created automatically`);
  try {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log(`   ✅ Created ${uploadsDir}/`);
  } catch (error) {
    console.log(`   ❌ Failed to create ${uploadsDir}/: ${error.message}`);
  }
}

// Check package.json dependencies
console.log('\n📦 Checking dependencies...');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const requiredDeps = [
    '@nestjs/common',
    '@nestjs/core',
    '@nestjs/platform-express',
    '@prisma/client',
    'multer',
    'class-validator',
    'class-transformer'
  ];

  requiredDeps.forEach(dep => {
    if (packageJson.dependencies[dep]) {
      console.log(`   ✅ ${dep}: ${packageJson.dependencies[dep]}`);
    } else {
      console.log(`   ❌ ${dep} - MISSING`);
      missingFiles.push(dep);
    }
  });

  // Check dev dependencies
  const requiredDevDeps = ['@types/multer'];
  requiredDevDeps.forEach(dep => {
    if (packageJson.devDependencies && packageJson.devDependencies[dep]) {
      console.log(`   ✅ ${dep}: ${packageJson.devDependencies[dep]}`);
    } else {
      console.log(`   ❌ ${dep} - MISSING (dev dependency)`);
      missingFiles.push(dep);
    }
  });

} catch (error) {
  console.log(`   ❌ Failed to read package.json: ${error.message}`);
}

// Check .env file
console.log('\n🔧 Checking environment configuration...');
try {
  const envContent = fs.readFileSync('.env', 'utf8');
  
  if (envContent.includes('DATABASE_URL')) {
    console.log('   ✅ DATABASE_URL configured');
  } else {
    console.log('   ❌ DATABASE_URL not found in .env');
  }
  
  if (envContent.includes('PORT')) {
    console.log('   ✅ PORT configured');
  } else {
    console.log('   ⚠️  PORT not configured (will use default)');
  }
  
  if (envContent.includes('JWT_SECRET')) {
    console.log('   ✅ JWT_SECRET configured');
  } else {
    console.log('   ⚠️  JWT_SECRET not configured');
  }
  
} catch (error) {
  console.log(`   ❌ Failed to read .env file: ${error.message}`);
  console.log('   💡 Copy .env.example to .env and configure it');
}

// Check if build works
console.log('\n🔨 Checking if project builds...');
const { execSync } = require('child_process');
try {
  execSync('npm run build', { stdio: 'pipe' });
  console.log('   ✅ Project builds successfully');
} catch (error) {
  console.log('   ❌ Build failed');
  console.log('   💡 Run "npm run build" to see detailed errors');
}

// Summary
console.log('\n📋 Setup Summary:');
if (missingFiles.length === 0) {
  console.log('   🎉 All required files and dependencies are present!');
  console.log('   🚀 You can start the server with: npm run start:dev');
} else {
  console.log(`   ⚠️  Found ${missingFiles.length} missing items:`);
  missingFiles.forEach(item => console.log(`      - ${item}`));
  console.log('\n   💡 Install missing dependencies with: npm install');
}

console.log('\n📚 Next Steps:');
console.log('   1. Start the server: npm run start:dev');
console.log('   2. Test endpoints: node test-lab-report-api.js');
console.log('   3. Check API docs: LAB-REPORT-API.md');
console.log('   4. Integration guide: INTEGRATION-GUIDE.md');
console.log('   5. Update Flutter app base URL to your server IP');

console.log('\n🔗 Helpful Commands:');
console.log('   • Start server: npm run start:dev');
console.log('   • Build project: npm run build');
console.log('   • Check database: npx prisma studio');
console.log('   • Run migrations: npx prisma migrate deploy');
console.log('   • Test API: node test-lab-report-api.js');

console.log('\n✨ Setup verification complete!\n');
