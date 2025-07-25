const http = require('http');

async function testCompleteFlow() {
  console.log('🔍 Testing Complete Backend Flow...\n');
  
  let userId = null;
  
  // Step 1: Test Login
  console.log('📋 Step 1: Testing Login API');
  try {
    const loginResult = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, JSON.stringify({
      email: 'sanjeewa.lab@example.com',
      password: '12345678'
    }));
    
    if (loginResult.statusCode === 200 || loginResult.statusCode === 201) {
      const loginData = JSON.parse(loginResult.data);
      console.log('✅ Login successful!');
      console.log(`   Access Token: ${loginData.accessToken ? 'Present' : 'Missing'}`);
      console.log(`   Refresh Token: ${loginData.refreshToken ? 'Present' : 'Missing'}`);
      console.log(`   User Object: ${loginData.user ? 'Present' : 'Missing'}`);
      
      if (loginData.user && loginData.user.id) {
        userId = loginData.user.id;
        console.log(`   User ID: ${userId}`);
        console.log(`   User Name: ${loginData.user.name}`);
        console.log(`   User Role: ${loginData.user.role}`);
      } else {
        console.log('❌ User ID missing in login response!');
        return;
      }
    } else {
      console.log('❌ Login failed:', loginResult.data);
      return;
    }
  } catch (error) {
    console.log('❌ Login error:', error.message);
    return;
  }
  
  // Step 2: Test User Profile
  console.log('\n📋 Step 2: Testing User Profile API');
  try {
    const profileResult = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: `/lab/profile/${userId}`,
      method: 'GET'
    });
    
    if (profileResult.statusCode === 200) {
      const profileData = JSON.parse(profileResult.data);
      console.log('✅ User Profile successful!');
      console.log(`   Name: ${profileData.name || 'N/A'}`);
      console.log(`   Email: ${profileData.email || 'N/A'}`);
      console.log(`   Username: ${profileData.username || 'N/A'}`);
      console.log(`   Contact: ${profileData.contactNo || 'N/A'}`);
      console.log(`   Role: ${profileData.roles || 'N/A'}`);
    } else {
      console.log('❌ User Profile failed:', profileResult.data);
    }
  } catch (error) {
    console.log('❌ User Profile error:', error.message);
  }
  
  // Step 3: Test Lab Profile
  console.log('\n📋 Step 3: Testing Lab Profile API');
  try {
    const labProfileResult = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: `/lab/lab-profile/${userId}`,
      method: 'GET'
    });
    
    if (labProfileResult.statusCode === 200) {
      const labProfileData = JSON.parse(labProfileResult.data);
      console.log('✅ Lab Profile successful!');
      console.log(`   Lab Name: ${labProfileData.name || 'N/A'}`);
      console.log(`   Registration: ${labProfileData.registrationNumber || 'N/A'}`);
      console.log(`   Description: ${labProfileData.description || 'N/A'}`);
    } else {
      console.log('❌ Lab Profile failed:', labProfileResult.data);
    }
  } catch (error) {
    console.log('❌ Lab Profile error:', error.message);
  }
  
  // Step 4: Test Lab Reports
  console.log('\n📋 Step 4: Testing Lab Reports API');
  try {
    const reportsResult = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/lab/lab-reports',
      method: 'GET'
    });
    
    if (reportsResult.statusCode === 200) {
      const reportsData = JSON.parse(reportsResult.data);
      console.log('✅ Lab Reports successful!');
      console.log(`   Reports count: ${Array.isArray(reportsData) ? reportsData.length : 'N/A'}`);
    } else {
      console.log('❌ Lab Reports failed:', reportsResult.data);
    }
  } catch (error) {
    console.log('❌ Lab Reports error:', error.message);
  }
  
  console.log('\n🎉 Backend testing completed!');
  console.log('\n📱 Flutter Integration Notes:');
  console.log('1. Make sure your Flutter app uses: http://10.0.2.2:3000 (Android) or http://localhost:3000 (iOS)');
  console.log('2. User ID should be extracted from login response: response.data.user.id');
  console.log('3. Store user ID in SharedPreferences after successful login');
  console.log('4. Pass stored user ID to ProfilePage constructor');
}

function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, data }));
    });
    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

testCompleteFlow();
