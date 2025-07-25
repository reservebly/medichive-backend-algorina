#!/usr/bin/env node

const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

async function resetDatabase() {
  console.log('🔄 Starting database reset...\n');
  
  try {
    // Step 1: Push schema with force reset
    console.log('📋 Step 1: Resetting database schema...');
    const pushResult = await execPromise('npx prisma db push --force-reset');
    console.log('✅ Database schema reset successfully');
    if (pushResult.stdout) console.log(pushResult.stdout);
    
    // Step 2: Generate Prisma client
    console.log('\n📋 Step 2: Generating Prisma client...');
    const generateResult = await execPromise('npx prisma generate');
    console.log('✅ Prisma client generated successfully');
    if (generateResult.stdout) console.log(generateResult.stdout);
    
    console.log('\n🎉 Database reset completed successfully!');
    console.log('📝 Note: The database is now empty and ready for fresh data');
    
  } catch (error) {
    console.error('❌ Database reset failed:');
    console.error(error.message);
    if (error.stdout) console.log('STDOUT:', error.stdout);
    if (error.stderr) console.log('STDERR:', error.stderr);
  }
}

resetDatabase();
