# Database Table Relationships

This document outlines the relationships between Lab Admin, User, Complaint, and Lab tables in the MediChive system.

## Current Schema Relationships

### 1. User ↔ LabAdmin Relationship

- **Type**: One-to-One
- **Connection**:
  - `User.labAdmin` → `LabAdmin`
  - `LabAdmin.user` → `User` (via `userId`)
- **Purpose**: Each lab admin is associated with a user account

### 2. LabAdmin ↔ Lab Relationship

- **Type**: Many-to-One (Optional)
- **Connection**:
  - `LabAdmin.lab` → `Lab` (via `labId`)
  - `Lab.labAdmins` → `LabAdmin[]`
- **Purpose**: Lab admins can manage specific labs

### 3. User ↔ Lab Relationship

- **Type**: One-to-One (Optional)
- **Connection**:
  - `User.lab` → `Lab`
  - `Lab.user` → `User` (via `userId`)
- **Purpose**: Each lab is owned/registered by a user

### 4. User ↔ Complaint Relationship

- **Type**: One-to-Many
- **Connection**:
  - `User.complaints` → `Complaint[]`
  - `Complaint.user` → `User` (via `userId`)
- **Purpose**: Users can file multiple complaints

### 5. Lab ↔ LabReport Relationship

- **Type**: One-to-Many
- **Connection**:
  - `Lab.labReports` → `LabReport[]`
  - `LabReport.lab` → `Lab` (via `labId`)
- **Purpose**: Labs generate multiple lab reports

### 6. Patient ↔ LabReport Relationship

- **Type**: One-to-Many
- **Connection**:
  - `Patient.labReports` → `LabReport[]`
  - `LabReport.patient` → `Patient` (via `patientId`)
- **Purpose**: Patients have multiple lab reports

## Database Schema Visual Representation

```
User
├── labAdmin (1:1) → LabAdmin
├── lab (1:1) → Lab
├── complaints (1:N) → Complaint[]
└── patient (1:1) → Patient
                      └── labReports (1:N) → LabReport[]

LabAdmin
├── user (1:1) → User
└── lab (N:1) → Lab

Lab
├── user (1:1) → User
├── labAdmins (1:N) → LabAdmin[]
└── labReports (1:N) → LabReport[]

Complaint
└── user (N:1) → User

LabReport
├── patient (N:1) → Patient
└── lab (N:1) → Lab
```

## Key Fields Added/Modified

### LabAdmin Model

- Added `labId` (optional foreign key to Lab)
- Added `lab` relation field

### Lab Model

- Added `labAdmins` relation field (array)
- Added `labReports` relation field (array)

### User Model

- Added `complaints` relation field (array)

### Complaint Model

- Added `user` relation field (optional)

### LabReport Model

- Added `labId` (optional foreign key to Lab)
- Added `patient` relation field
- Added `lab` relation field (optional)

### Patient Model

- Added `labReports` relation field (array)

## Usage Examples

### Finding all complaints by a lab admin's users

```typescript
const labAdmin = await prisma.labAdmin.findUnique({
  where: { userId: 'lab-admin-user-id' },
  include: {
    user: {
      include: {
        complaints: true,
      },
    },
  },
});
```

### Finding all lab reports for a specific lab

```typescript
const labReports = await prisma.lab.findUnique({
  where: { id: labId },
  include: {
    labReports: {
      include: {
        patient: {
          include: {
            user: true,
          },
        },
      },
    },
  },
});
```

### Finding lab admin's managed lab and its reports

```typescript
const labAdminWithLab = await prisma.labAdmin.findUnique({
  where: { userId: 'lab-admin-user-id' },
  include: {
    lab: {
      include: {
        labReports: true,
      },
    },
  },
});
```

## Migration Applied

- Migration: `20250725073111_connect_lab_admin_user_complaint_lab_tables`
- Status: Successfully applied to database
- Schema is now in sync with database
