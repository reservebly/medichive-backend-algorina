const http = require('http');

async function testProfileIssue() {
  console.log('🔍 Testing Profile Issue...\n');
  
  // First, test login to get user data
  console.log('📋 Step 1: Testing Login');
  
  const loginData = JSON.stringify({
    email: 'sanjeewa.lab@example.com',
    password: '12345678'
  });
  
  const loginOptions = {
    hostname: 'localhost',
    port: 3000,
    path: '/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  };
  
  try {
    const loginResult = await makeRequest(loginOptions, loginData);
    
    if (loginResult.statusCode === 200 || loginResult.statusCode === 201) {
      const loginResponse = JSON.parse(loginResult.data);
      console.log('✅ Login successful!');
      console.log(`   User ID: ${loginResponse.user?.id}`);
      console.log(`   User Name: ${loginResponse.user?.name}`);
      
      if (loginResponse.user?.id) {
        // Test profile endpoint with the user ID
        console.log('\n📋 Step 2: Testing Profile Endpoint');
        
        const profileOptions = {
          hostname: 'localhost',
          port: 3000,
          path: `/lab/profile/${loginResponse.user.id}`,
          method: 'GET',
        };
        
        const profileResult = await makeRequest(profileOptions);
        console.log(`Profile endpoint status: ${profileResult.statusCode}`);
        
        if (profileResult.statusCode === 200) {
          const profileData = JSON.parse(profileResult.data);
          console.log('✅ Profile data retrieved successfully!');
          console.log('📊 Profile details:');
          console.log(`   Name: ${profileData.name || 'N/A'}`);
          console.log(`   Email: ${profileData.email || 'N/A'}`);
          console.log(`   Username: ${profileData.username || 'N/A'}`);
          console.log(`   Role: ${profileData.roles || 'N/A'}`);
          console.log(`   Contact: ${profileData.contactNo || 'N/A'}`);
          console.log(`   Address: ${profileData.address || 'N/A'}`);
          
          console.log('\n🎉 Profile API is working correctly!');
          console.log('💡 Check your Flutter app\'s API service URL and error handling');
          
        } else {
          console.log('❌ Profile endpoint failed:');
          console.log(profileResult.data);
        }
      }
    } else {
      console.log('❌ Login failed:');
      console.log(loginResult.data);
    }
  } catch (error) {
    console.log('❌ Connection error:', error.message);
    console.log('💡 Make sure the backend server is running with: npm run start:dev');
  }
}

function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, data });
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

testProfileIssue();
