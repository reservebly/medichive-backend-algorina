const http = require('http');

// Test 1: Simple server check
console.log('🔍 Testing Database and Server Status\n');

console.log('📋 Test 1: Server Availability');
const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  }
};

const loginData = JSON.stringify({
  email: 'sanjeewa.lab@example.com',
  password: '12345678'
});

const req = http.request(options, (res) => {
  console.log(`✅ Server responding - Status: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      console.log('\n📋 Test 2: Login API Response');
      
      if (res.statusCode === 200 || res.statusCode === 201) {
        console.log('✅ Login successful!');
        console.log(`✅ Access Token: ${response.accessToken ? 'Present' : 'Missing'}`);
        console.log(`✅ Refresh Token: ${response.refreshToken ? 'Present' : 'Missing'}`);
        console.log(`✅ User Object: ${response.user ? 'Present' : 'Missing'}`);
        
        if (response.user) {
          console.log('\n📋 Test 3: User Data Verification');
          console.log(`✅ User ID: ${response.user.id}`);
          console.log(`✅ User Name: ${response.user.name}`);
          console.log(`✅ User Email: ${response.user.email}`);
          console.log(`✅ User Role: ${response.user.role}`);
          
          console.log('\n🎉 Database is working correctly!');
          console.log('🚀 Ready for Flutter app integration');
        }
      } else {
        console.log('❌ Login failed:');
        console.log(data);
      }
    } catch (error) {
      console.log('❌ Invalid JSON response:', data);
    }
  });
});

req.on('error', (error) => {
  console.log('❌ Server connection failed:', error.message);
  console.log('💡 Make sure the server is running with: npm run start:dev');
});

req.write(loginData);
req.end();
