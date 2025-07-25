const { PrismaClient } = require('@prisma/client');
const axios = require('axios');

async function checkDatabase() {
  const prisma = new PrismaClient();
  
  console.log('🔍 Checking Database Status...\n');
  
  try {
    // Test 1: Database Connection
    console.log('📋 Test 1: Database Connection');
    await prisma.$connect();
    console.log('✅ Database connection successful\n');
    
    // Test 2: Check Users Table
    console.log('📋 Test 2: Checking Users Table');
    const userCount = await prisma.user.count();
    console.log(`✅ Found ${userCount} users in database`);
    
    const labAdmins = await prisma.user.findMany({
      where: { roles: 'LAB_ADMIN' },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        roles: true,
        password: true
      }
    });
    
    console.log(`✅ Found ${labAdmins.length} LAB_ADMIN users:`);
    labAdmins.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.name} (${user.email}) - Password: ${user.password}`);
    });
    console.log('');
    
    // Test 3: Check Other Tables
    console.log('📋 Test 3: Checking Other Tables');
    const tables = [
      { name: 'Doctor', model: prisma.doctor },
      { name: 'Institute', model: prisma.institute },
      { name: 'Complaint', model: prisma.complaint },
      { name: 'LabReport', model: prisma.labReport }
    ];
    
    for (const table of tables) {
      try {
        const count = await table.model.count();
        console.log(`✅ ${table.name} table: ${count} records`);
      } catch (error) {
        console.log(`❌ ${table.name} table: Error - ${error.message}`);
      }
    }
    console.log('');
    
    // Test 4: Test API Connection
    console.log('📋 Test 4: Testing API Connection');
    try {
      const response = await axios.get('http://localhost:3000', { timeout: 5000 });
      console.log('✅ Backend server is responding');
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        console.log('❌ Backend server is not running or not accessible');
      } else {
        console.log(`✅ Server responded (status: ${error.response?.status || 'unknown'})`);
      }
    }
    console.log('');
    
    // Test 5: Test Login API
    console.log('📋 Test 5: Testing Login API');
    try {
      const loginResponse = await axios.post('http://localhost:3000/auth/login', {
        email: 'sanjeewa.lab@example.com',
        password: '12345678'
      }, { timeout: 5000 });
      
      console.log('✅ Login API working successfully');
      console.log(`✅ Response includes:`);
      console.log(`   - Access Token: ${loginResponse.data.accessToken ? 'YES' : 'NO'}`);
      console.log(`   - Refresh Token: ${loginResponse.data.refreshToken ? 'YES' : 'NO'}`);
      console.log(`   - User Object: ${loginResponse.data.user ? 'YES' : 'NO'}`);
      
      if (loginResponse.data.user) {
        console.log(`   - User ID: ${loginResponse.data.user.id}`);
        console.log(`   - User Name: ${loginResponse.data.user.name}`);
        console.log(`   - User Role: ${loginResponse.data.user.role}`);
      }
      
    } catch (error) {
      console.log('❌ Login API failed:');
      if (error.response) {
        console.log(`   Status: ${error.response.status}`);
        console.log(`   Message: ${error.response.data.message || 'Unknown error'}`);
      } else {
        console.log(`   Error: ${error.message}`);
      }
    }
    
    console.log('\n🎉 Database check completed!');
    
  } catch (error) {
    console.error('❌ Database check failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
