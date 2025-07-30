# Lab Report API Documentation

This document explains how to use the Lab Report Upload API endpoints with your Flutter application.

## Base URL

```
http://localhost:3000
```

## Endpoints

### 1. Upload Lab Report with Link Only

**POST** `/lab-report/upload-link`

**Content-Type:** `application/json`

**Body:**

```json
{
  "patientId": 1,
  "description": "Blood Test Report - Complete Blood Count",
  "reportLink": "https://example.com/reports/blood-test.pdf",
  "labId": 1 // Optional
}
```

### 2. Upload Lab Report with Image

**POST** `/lab-report/upload-image`

**Content-Type:** `multipart/form-data`

**Form Fields:**

- `patientId`: (string) Patient ID
- `description`: (string) Report description
- `reportLink`: (string, optional) Additional web link
- `labId`: (string, optional) Lab ID
- `image`: (file) Image file (JPG, PNG, GIF - max 10MB)

### 3. Upload Lab Report with PDF

**POST** `/lab-report/upload-pdf`

**Content-Type:** `multipart/form-data`

**Form Fields:**

- `patientId`: (string) Patient ID
- `description`: (string) Report description
- `reportLink`: (string, optional) Additional web link
- `labId`: (string, optional) Lab ID
- `pdf`: (file) PDF file (max 20MB)

### 4. Upload Lab Report with Both Image and PDF

**POST** `/lab-report/upload-both`

**Content-Type:** `multipart/form-data`

**Form Fields:**

- `patientId`: (string) Patient ID
- `description`: (string) Report description
- `reportLink`: (string, optional) Additional web link
- `labId`: (string, optional) Lab ID
- `files`: (array of files) Image and PDF files

### 5. Universal Upload Endpoint (Recommended)

**POST** `/lab-report/upload`

**Content-Type:** `multipart/form-data`

**Form Fields:**

- `patientId`: (string) Patient ID
- `description`: (string) Report description
- `uploadMethod`: (string) "link" | "image" | "pdf" | "both"
- `reportLink`: (string, optional) Web link
- `labId`: (string, optional) Lab ID
- `files`: (array of files, optional) Files based on upload method

### 6. Get All Lab Reports

**GET** `/lab-report`

**Query Parameters:**

- `patientId`: (number, optional) Filter by patient
- `labId`: (number, optional) Filter by lab

### 7. Get Specific Lab Report

**GET** `/lab-report/:id`

### 8. Update Lab Report

**PATCH** `/lab-report/:id`

**Content-Type:** `application/json`

### 9. Delete Lab Report

**DELETE** `/lab-report/:id`

### 10. Get Uploaded File

**GET** `/lab-report/files/:filename`

## Flutter Integration

### Dependencies needed in pubspec.yaml:

```yaml
dependencies:
  http: ^1.1.0
  file_picker: ^6.1.1
  image_picker: ^1.0.4
```

### Example Usage with the Flutter API Service:

```dart
// Upload with link only
final result = await apiService.uploadLabReport(
  1, // patientId
  'Blood Test Report',
  'https://example.com/report.pdf',
  labId: 1,
);

// Upload with image
final result = await apiService.uploadLabReportImage(
  patientId: 1,
  description: 'X-Ray Report',
  imageFile: File('/path/to/image.jpg'),
  labId: 1,
);

// Universal upload (recommended)
final result = await apiService.uploadLabReportUniversal(
  patientId: 1,
  description: 'Complete Blood Count',
  uploadMethod: 'both',
  imageFile: File('/path/to/image.jpg'),
  pdfFile: File('/path/to/report.pdf'),
  labId: 1,
);
```

## Response Format

All upload endpoints return:

```json
{
  "id": 1,
  "patientId": 1,
  "labId": 1,
  "description": "Blood Test Report",
  "reportLink": "https://example.com/report.pdf",
  "imagePath": "uploads/lab-reports/image_1234567890.jpg",
  "pdfPath": "uploads/lab-reports/pdf_1234567890.pdf",
  "createdAt": "2025-01-15T10:30:00.000Z",
  "updatedAt": "2025-01-15T10:30:00.000Z",
  "patient": {
    "id": 1,
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "patient@example.com",
      "contactNo": "+94701234567"
    }
  },
  "lab": {
    "id": 1,
    "name": "Test Laboratory",
    "contactNumber": "+94701234568"
  }
}
```

## Error Handling

The API returns appropriate HTTP status codes:

- `201`: Created successfully
- `400`: Bad request (validation errors)
- `404`: Resource not found
- `500`: Internal server error

Error response format:

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

## Getting Started

1. **Start the backend server:**

   ```bash
   npm run start:dev
   ```

2. **Create test data (optional):**

   ```bash
   npm run prisma:seed
   ```

3. **Test endpoints with tools like Postman or curl**

4. **Update the base URL in your Flutter app:**
   ```dart
   // In api_service.dart
   static const String baseUrl = 'http://your-server-ip:3000';
   ```

## Security Notes

- In production, implement proper authentication and authorization
- Add rate limiting for file uploads
- Validate file types and sizes on the server
- Use HTTPS for secure file transfers
- Implement proper error handling and logging

## File Storage

- Uploaded files are stored in the `uploads/lab-reports/` directory
- Files are accessible via the `/lab-report/files/:filename` endpoint
- In production, consider using cloud storage services like AWS S3

## Database Setup

Make sure your PostgreSQL database is running and the connection string in `.env` is correct:

```
DATABASE_URL="postgresql://username:password@localhost:5432/medichive_backend"
```

Run migrations:

```bash
npx prisma migrate deploy
```
