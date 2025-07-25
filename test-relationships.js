const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testDatabaseRelationships() {
  console.log('🔍 Testing Database Relationships...\n');

  try {
    // Test 1: Find lab admin with their lab and user details
    console.log('1. Testing LabAdmin → Lab → User relationships:');
    const labAdmins = await prisma.labAdmin.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            roles: true
          }
        },
        lab: {
          select: {
            id: true,
            name: true,
            registrationNumber: true
          }
        }
      }
    });
    console.log(`Found ${labAdmins.length} lab admins`);
    labAdmins.forEach(admin => {
      console.log(`- Admin: ${admin.user.name} (${admin.user.email})`);
      console.log(`  Lab: ${admin.lab ? admin.lab.name : 'No lab assigned'}`);
    });

    // Test 2: Find all labs with their admin and reports
    console.log('\n2. Testing Lab → LabAdmin → LabReports relationships:');
    const labs = await prisma.lab.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        labAdmins: {
          include: {
            user: {
              select: {
                name: true,
                email: true
              }
            }
          }
        },
        labReports: {
          select: {
            id: true,
            description: true,
            createdAt: true
          }
        }
      }
    });
    console.log(`Found ${labs.length} labs`);
    labs.forEach(lab => {
      console.log(`- Lab: ${lab.name} (Owner: ${lab.user.name})`);
      console.log(`  Admins: ${lab.labAdmins.length}`);
      console.log(`  Reports: ${lab.labReports.length}`);
    });

    // Test 3: Find users with their complaints
    console.log('\n3. Testing User → Complaint relationships:');
    const usersWithComplaints = await prisma.user.findMany({
      where: {
        complaints: {
          some: {}
        }
      },
      include: {
        complaints: {
          select: {
            id: true,
            complaintId: true,
            title: true,
            status: true,
            createdAt: true
          }
        }
      }
    });
    console.log(`Found ${usersWithComplaints.length} users with complaints`);
    usersWithComplaints.forEach(user => {
      console.log(`- User: ${user.name} has ${user.complaints.length} complaint(s)`);
    });

    // Test 4: Find patients with their lab reports
    console.log('\n4. Testing Patient → LabReport → Lab relationships:');
    const patientsWithReports = await prisma.patient.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        labReports: {
          include: {
            lab: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });
    console.log(`Found ${patientsWithReports.length} patients`);
    patientsWithReports.forEach(patient => {
      console.log(`- Patient: ${patient.user.name} has ${patient.labReports.length} report(s)`);
      patient.labReports.forEach(report => {
        console.log(`  Report ID: ${report.id} from Lab: ${report.lab ? report.lab.name : 'Unknown'}`);
      });
    });

    console.log('\n✅ All relationship tests completed successfully!');

  } catch (error) {
    console.error('❌ Error testing relationships:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testDatabaseRelationships();
