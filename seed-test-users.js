const { PrismaClient } = require('@prisma/client');

async function seedTestUsers() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🌱 Seeding test users...\n');
    
    // Create test LAB_ADMIN users with plain text passwords
    const users = [
      {
        id: '23373073-d4a0-4df4-80c2-e5fe1d75e632',
        username: 'sanjeewa_lab',
        email: 'sanjeewa.lab@example.com',
        name: 'Sanjeewa Lab Admin',
        password: '12345678', // Plain text password
        roles: 'LAB_ADMIN',
        contactNo: '+94771234567',
        address: '123 Lab Street, Colombo',
        gender: 'MALE',
        nic: '123456789V'
      },
      {
        id: '415612c9-f11a-4141-b8e1-6d562b3080db',
        username: 'ial_lab',
        email: 'ial.lab@example.com',
        name: 'IAL Lab Admin',
        password: 'asdfghjk', // Plain text password
        roles: 'LAB_ADMIN',
        contactNo: '+94771234568',
        address: '456 Medical Avenue, Colombo',
        gender: 'FEMALE',
        nic: '987654321V'
      }
    ];
    
    for (const userData of users) {
      const user = await prisma.user.create({
        data: userData
      });
      console.log(`✅ Created user: ${user.name} (${user.email})`);
    }
    
    console.log('\n🎉 Test users created successfully!');
    console.log('\n📋 Login credentials:');
    console.log('1. Email: sanjeewa.lab@example.com | Password: 12345678');
    console.log('2. Email: ial.lab@example.com | Password: asdfghjk');
    
  } catch (error) {
    console.error('❌ Error creating users:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

seedTestUsers();
