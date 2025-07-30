// create-test-patient.js
// Script to create a test patient with ID that matches your Flutter app

const axios = require('axios');

async function createTestPatient() {
  console.log('🏥 Creating Test Patient for Lab Report Upload...\n');

  try {
    // First create a user
    const userData = {
      username: 'test_patient_9',
      password: 'password123',
      name: 'Test Patient 9',
      email: 'patient9@example.com',
      address: '123 Test Street, Colombo',
      nic: '199012345679',
      contactNo: '+94701234569',
      roles: 'PATIENT',
      dob: '1990-01-01',
      gender: 'MALE'
    };

    console.log('1️⃣ Creating user...');
    const userResponse = await axios.post('http://localhost:3000/user', userData);
    console.log('✅ User created:', userResponse.data.id);

    // Then create a patient linked to this user
    const patientData = {
      userId: userResponse.data.id
    };

    console.log('2️⃣ Creating patient...');
    const patientResponse = await axios.post('http://localhost:3000/patient', patientData);
    console.log('✅ Patient created with ID:', patientResponse.data.id);

    console.log('\n🎉 Success! You can now use the following:');
    console.log(`   Patient ID: ${patientResponse.data.id}`);
    console.log(`   Patient Name: ${userData.name}`);
    console.log(`   Patient Email: ${userData.email}`);

  } catch (error) {
    console.log('❌ Failed to create test patient:', error.response?.data || error.message);
    
    if (error.response?.status === 404) {
      console.log('\n💡 The user/patient endpoints might not exist.');
      console.log('💡 Let\'s create a patient directly using Prisma...');
      await createPatientWithPrisma();
    }
  }
}

async function createPatientWithPrisma() {
  console.log('\n🔧 Creating patient using direct database insertion...');
  
  // Create a simple SQL insert script
  const sqlScript = `
-- Create a test user and patient
INSERT INTO "User" (
  id, username, password, name, email, address, nic, "contactNo", 
  roles, dob, gender, "createdAt", "updatedAt"
) VALUES (
  gen_random_uuid(), 
  'test_patient_9', 
  'password123', 
  'Test Patient 9', 
  'patient9@example.com', 
  '123 Test Street, Colombo', 
  '199012345679', 
  '+94701234569', 
  'PATIENT', 
  '1990-01-01', 
  'MALE', 
  NOW(), 
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- Create the patient record
INSERT INTO "Patient" (id, "userId") 
SELECT 9, id FROM "User" WHERE email = 'patient9@example.com'
ON CONFLICT (id) DO NOTHING;
`;

  console.log('💾 SQL Script to run in your database:');
  console.log(sqlScript);
  console.log('\n💡 You can run this in Prisma Studio or your PostgreSQL client.');
  console.log('💡 Or run: npx prisma studio and manually create the records.');
}

// Check if server is running first
async function checkServer() {
  try {
    await axios.get('http://localhost:3000');
    return true;
  } catch (error) {
    console.log('❌ Server is not running on port 3000');
    console.log('💡 Start the server with: npm run start:dev');
    return false;
  }
}

async function main() {
  console.log('🚀 Test Patient Creator\n');
  
  const serverRunning = await checkServer();
  if (serverRunning) {
    await createTestPatient();
  } else {
    await createPatientWithPrisma();
  }
}

if (require.main === module) {
  main();
}
