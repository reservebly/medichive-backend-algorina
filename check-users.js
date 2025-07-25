const { PrismaClient } = require('@prisma/client');

async function checkUsers() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Checking users in database...\n');
    
    const users = await prisma.user.findMany({
      where: {
        roles: 'LAB_ADMIN'
      },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        password: true,
        roles: true
      }
    });
    
    console.log(`Found ${users.length} LAB_ADMIN users:`);
    users.forEach((user, index) => {
      console.log(`\n${index + 1}. User:`, {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        role: user.roles,
        passwordLength: user.password ? user.password.length : 'null',
        passwordStart: user.password ? user.password.substring(0, 10) + '...' : 'null'
      });
    });
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();
