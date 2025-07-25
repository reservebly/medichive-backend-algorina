const { PrismaClient } = require('@prisma/client');

async function testDatabaseConnection() {
  const prisma = new PrismaClient();
  
  console.log('🔍 Testing Database Connection...\n');
  
  try {
    // Test database connection
    console.log('📋 Attempting to connect to database...');
    await prisma.$connect();
    console.log('✅ Database connection successful!');
    
    // Test if we can query the database
    console.log('\n📋 Testing database query...');
    const userCount = await prisma.user.count();
    console.log(`✅ Database query successful - Found ${userCount} users`);
    
    // Test specific table access
    console.log('\n📋 Testing table access...');
    const tables = ['user', 'doctor', 'institute', 'complaint', 'labReport'];
    
    for (const tableName of tables) {
      try {
        const count = await prisma[tableName].count();
        console.log(`✅ ${tableName} table: ${count} records`);
      } catch (error) {
        console.log(`❌ ${tableName} table: ${error.message}`);
      }
    }
    
    console.log('\n🎉 Database is fully connected and operational!');
    
    // Show database details
    console.log('\n📊 Database Details:');
    console.log('   URL: postgresql://postgres:***@localhost:5432/medichive_backend');
    console.log('   Schema: public');
    console.log('   Status: Connected ✅');
    
  } catch (error) {
    console.log('❌ Database connection failed!');
    console.log('Error:', error.message);
    
    if (error.code === 'P1001') {
      console.log('\n💡 Possible solutions:');
      console.log('   1. Make sure PostgreSQL is running');
      console.log('   2. Check if database "medichive_backend" exists');
      console.log('   3. Verify database credentials in .env file');
    }
  } finally {
    await prisma.$disconnect();
  }
}

testDatabaseConnection();
