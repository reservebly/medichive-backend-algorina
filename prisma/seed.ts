import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create a simple test patient user without bcrypt for now
  const patientUser = await prisma.user.upsert({
    where: { email: 'patient@example.com' },
    update: {},
    create: {
      username: 'patient_test',
      password: 'hashed_password_placeholder', // We'll fix this with actual auth later
      name: 'John Doe',
      email: 'patient@example.com',
      address: '123 Main Street, Colombo',
      nic: '199012345678',
      contactNo: '+94701234567',
      roles: 'PATIENT',
      dob: new Date('1990-01-01'),
      gender: 'MALE',
    },
  });

  console.log('✅ Created patient user:', patientUser.id);

  // Create test patient
  const patient = await prisma.patient.upsert({
    where: { userId: patientUser.id },
    update: {},
    create: {
      userId: patientUser.id,
    },
  });

  console.log('✅ Created patient:', patient.id);

  // Create a test lab user
  const labUser = await prisma.user.upsert({
    where: { email: 'lab@example.com' },
    update: {},
    create: {
      username: 'lab_test',
      password: 'hashed_password_placeholder',
      name: 'Test Laboratory',
      email: 'lab@example.com',
      address: '456 Lab Street, Colombo',
      nic: '198512345679',
      contactNo: '+94701234568',
      roles: 'LAB_ADMIN',
      dob: new Date('1985-01-01'),
      gender: 'OTHER',
    },
  });

  console.log('✅ Created lab user:', labUser.id);

  // Create test lab
  const lab = await prisma.lab.upsert({
    where: { userId: labUser.id },
    update: {},
    create: {
      name: 'Test Laboratory',
      registrationNumber: 'LAB001',
      contactNumber: '+94701234568',
      website: 'https://testlab.com',
      address: '456 Lab Street, Colombo',
      description: 'A test laboratory for MediChive',
      certificate: 'LAB_CERT_001.pdf',
      userId: labUser.id,
    },
  });

  console.log('✅ Created lab:', lab.id);

  // Create a test lab admin
  await prisma.labAdmin.upsert({
    where: { userId: labUser.id },
    update: {},
    create: {
      userId: labUser.id,
      labId: lab.id,
    },
  });

  console.log('✅ Created lab admin');

  console.log('✅ Database seed completed successfully!');
  console.log('📊 Test data created:');
  console.log(`   👤 Patient ID: ${patient.id} (${patientUser.name})`);
  console.log(`   🏥 Lab ID: ${lab.id} (${lab.name})`);
  console.log('\n� Ready to test lab report API endpoints!');
}

main()
  .catch((e) => {
    console.error('❌ Seed script failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
