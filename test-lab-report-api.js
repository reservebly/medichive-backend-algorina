// test-lab-report-api.js
// Simple test script to verify the lab report API endpoints

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3000';

// Test data
const testPatientId = 1;
const testLabId = 1;
const testDescription = 'Test lab report uploaded via API';
const testReportLink = 'https://example.com/sample-report.pdf';

async function testLabReportEndpoints() {
  console.log('🧪 Testing Lab Report API Endpoints...\n');

  try {
    // Test 1: Upload with link only
    console.log('1️⃣ Testing upload with link only...');
    try {
      const linkResponse = await axios.post(`${BASE_URL}/lab-report/upload-link`, {
        patientId: testPatientId,
        description: testDescription,
        reportLink: testReportLink,
        labId: testLabId
      });
      console.log('✅ Link upload successful:', linkResponse.data.id);
    } catch (error) {
      console.log('❌ Link upload failed:', error.response?.data || error.message);
    }

    // Test 2: Get all lab reports
    console.log('\n2️⃣ Testing get all lab reports...');
    try {
      const allReportsResponse = await axios.get(`${BASE_URL}/lab-report`);
      console.log(`✅ Retrieved ${allReportsResponse.data.length} lab reports`);
      
      if (allReportsResponse.data.length > 0) {
        console.log('Sample report:', {
          id: allReportsResponse.data[0].id,
          patientId: allReportsResponse.data[0].patientId,
          description: allReportsResponse.data[0].description.substring(0, 50) + '...',
          createdAt: allReportsResponse.data[0].createdAt
        });
      }
    } catch (error) {
      console.log('❌ Get all reports failed:', error.response?.data || error.message);
    }

    // Test 3: Get reports filtered by patient
    console.log('\n3️⃣ Testing get lab reports by patient...');
    try {
      const patientReportsResponse = await axios.get(`${BASE_URL}/lab-report?patientId=${testPatientId}`);
      console.log(`✅ Retrieved ${patientReportsResponse.data.length} reports for patient ${testPatientId}`);
    } catch (error) {
      console.log('❌ Get patient reports failed:', error.response?.data || error.message);
    }

    // Test 4: Test the universal upload endpoint with link method
    console.log('\n4️⃣ Testing universal upload endpoint (link method)...');
    try {
      const universalLinkResponse = await axios.post(`${BASE_URL}/lab-report/upload`, {
        patientId: testPatientId,
        description: 'Universal upload test - link method',
        reportLink: 'https://example.com/universal-test.pdf',
        uploadMethod: 'link',
        labId: testLabId
      });
      console.log('✅ Universal link upload successful:', universalLinkResponse.data.id);
    } catch (error) {
      console.log('❌ Universal link upload failed:', error.response?.data || error.message);
    }

    // Test 5: Create a dummy image file and test image upload
    console.log('\n5️⃣ Testing image upload...');
    try {
      // Create a simple test image file (1x1 pixel PNG)
      const testImageContent = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAI9jINpPwAAAABJRU5ErkJggg==', 'base64');
      const testImagePath = path.join(__dirname, 'test-image.png');
      fs.writeFileSync(testImagePath, testImageContent);

      const formData = new FormData();
      formData.append('patientId', testPatientId.toString());
      formData.append('description', 'Test image upload');
      formData.append('labId', testLabId.toString());
      formData.append('image', fs.createReadStream(testImagePath));

      const imageResponse = await axios.post(`${BASE_URL}/lab-report/upload-image`, formData, {
        headers: formData.getHeaders()
      });
      console.log('✅ Image upload successful:', imageResponse.data.id);

      // Clean up test file
      fs.unlinkSync(testImagePath);
    } catch (error) {
      console.log('❌ Image upload failed:', error.response?.data || error.message);
    }

    console.log('\n🎉 Lab Report API testing completed!');

  } catch (error) {
    console.error('❌ Test setup failed:', error.message);
  }
}

// Check if server is running first
async function checkServerStatus() {
  try {
    const response = await axios.get(`${BASE_URL}/`);
    console.log('✅ Server is running!');
    return true;
  } catch (error) {
    console.log('❌ Server is not running. Please start the server with: npm run start:dev');
    console.log('Expected server URL:', BASE_URL);
    return false;
  }
}

async function main() {
  console.log('🚀 Lab Report API Test Suite\n');
  
  const serverRunning = await checkServerStatus();
  if (serverRunning) {
    await testLabReportEndpoints();
  }
}

if (require.main === module) {
  main();
}
