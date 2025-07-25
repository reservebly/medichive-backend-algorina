const axios = require('axios');

async function testLogin() {
  try {
    const response = await axios.post('http://localhost:3000/auth/login', {
      email: 'sanjeewa.lab@example.com',
      password: '12345678'  // Using the actual password from database
    });
    
    console.log('✅ Login Response:');
    console.log(JSON.stringify(response.data, null, 2));
    
    if (response.data.user && response.data.user.id) {
      console.log('\n✅ User ID found:', response.data.user.id);
    } else {
      console.log('\n❌ User ID not found in response');
    }
    
  } catch (error) {
    console.log('❌ Login failed:');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    } else {
      console.log('Error:', error.message);
    }
  }
}

testLogin();
