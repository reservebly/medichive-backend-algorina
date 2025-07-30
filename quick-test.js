// quick-test.js - Simple test to diagnose the issue

const axios = require('axios');

async function testServer() {
  console.log('🔍 Diagnosing Lab Report Upload Issue...\n');
  
  try {
    // Test 1: Check if server is running
    console.log('1️⃣ Testing server connectivity...');
    const healthCheck = await axios.get('http://localhost:3000');
    console.log('✅ Server is running!');
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ Server is not running!');
      console.log('💡 Start the server with: npm run start:dev');
      return;
    }
    console.log('⚠️ Server responded with error:', error.response?.status);
  }

  try {
    // Test 2: Check lab report endpoint
    console.log('\n2️⃣ Testing lab report endpoint...');
    const response = await axios.get('http://localhost:3000/lab-report');
    console.log('✅ Lab report endpoint is working');
    console.log(`📊 Found ${response.data.length} existing reports`);
  } catch (error) {
    console.log('❌ Lab report endpoint failed:', error.response?.status);
    console.log('Error details:', error.response?.data);
  }

  try {
    // Test 3: Test with the same data from your Flutter app
    console.log('\n3️⃣ Testing upload with your data...');
    const testData = {
      patientId: 1,
      description: 'sugar report',
      reportLink: 'ygqvfhbjkjk',
    };
    
    const uploadResponse = await axios.post('http://localhost:3000/lab-report/upload-link', testData);
    console.log('✅ Upload successful!', uploadResponse.data);
  } catch (error) {
    console.log('❌ Upload failed with status:', error.response?.status);
    console.log('Error message:', error.response?.data?.message);
    console.log('Full error:', error.response?.data);
    
    // Analyze the specific error
    if (error.response?.status === 404) {
      console.log('\n💡 Likely cause: Patient ID 1 does not exist in database');
      console.log('💡 Solution: Create test data with: npm run prisma:seed');
    } else if (error.response?.status === 500) {
      console.log('\n💡 Likely cause: Database connection issue or missing patient');
      console.log('💡 Solutions:');
      console.log('   - Check if PostgreSQL is running');
      console.log('   - Verify DATABASE_URL in .env file');
      console.log('   - Create test patient: npm run prisma:seed');
    }
  }
}

testServer().catch(console.error);
