const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';

async function testUserProfileEndpoints() {
  console.log('🧪 Testing User Profile Endpoints...\n');

  try {
    // Test 1: Login to get user credentials
    console.log('1. Testing Login...');
    const loginResponse = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'nadeesha.labadmin@example.com',
        password: 'secure_hashed_pw_456'
      })
    });

    const loginData = await loginResponse.json();
    
    if (loginResponse.ok) {
      console.log('✅ Login successful');
      console.log(`User ID: ${loginData.user.id}`);
      console.log(`User Name: ${loginData.user.name}`);
      console.log(`Email: ${loginData.user.email}`);
      console.log(`Role: ${loginData.user.role}`);
      
      const userId = loginData.user.id;
      const token = loginData.accessToken;

      // Test 2: Get user profile using the userId
      console.log('\n2. Testing Profile Endpoint...');
      const profileResponse = await fetch(`${BASE_URL}/lab/profile/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const profileData = await profileResponse.json();
      
      if (profileResponse.ok) {
        console.log('✅ Profile endpoint working');
        console.log('Profile Data:', JSON.stringify(profileData, null, 2));
      } else {
        console.log('❌ Profile endpoint failed');
        console.log('Error:', profileData);
      }

      // Test 3: Test complaint creation with user ID
      console.log('\n3. Testing Complaint Creation...');
      const complaintResponse = await fetch(`${BASE_URL}/lab/complaints`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          complaint_text: 'Test complaint for user identification',
          title: 'Test Complaint',
          description: 'Testing if user ID is properly stored',
          category: 'TECHNICAL_ISSUE',
          priority: 'MEDIUM',
          userId: userId
        })
      });

      const complaintData = await complaintResponse.json();
      
      if (complaintResponse.ok) {
        console.log('✅ Complaint creation successful');
        console.log(`Complaint ID: ${complaintData.complaintId}`);
        console.log(`User ID in complaint: ${complaintData.userId}`);
      } else {
        console.log('❌ Complaint creation failed');
        console.log('Error:', complaintData);
      }

      // Test 4: Get user complaints
      console.log('\n4. Testing User Complaints Retrieval...');
      const userComplaintsResponse = await fetch(`${BASE_URL}/api/complaints/user-id/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const userComplaints = await userComplaintsResponse.json();
      
      if (userComplaintsResponse.ok) {
        console.log('✅ User complaints retrieval successful');
        console.log(`Found ${userComplaints.length} complaints for user`);
        if (userComplaints.length > 0) {
          console.log('Latest complaint:', {
            id: userComplaints[0].complaintId,
            title: userComplaints[0].title,
            userId: userComplaints[0].userId
          });
        }
      } else {
        console.log('❌ User complaints retrieval failed');
        console.log('Error:', userComplaints);
      }

    } else {
      console.log('❌ Login failed');
      console.log('Error:', loginData);
    }

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

// Run the test
testUserProfileEndpoints();
