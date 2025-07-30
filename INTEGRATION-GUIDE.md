# Flutter Lab Report Upload Integration Guide

This guide will help you integrate the lab report upload functionality between your Flutter app and NestJS backend.

## 🚀 Quick Start

### 1. Backend Setup

1. **Install Dependencies** (if not already installed):

   ```bash
   npm install @nestjs/platform-express multer @types/multer form-data
   ```

2. **Environment Configuration:**

   - Copy `.env.example` to `.env`
   - Update database connection string if needed

   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/medichive_backend"
   PORT=3000
   JWT_SECRET="your-jwt-secret"
   ```

3. **Database Setup:**

   ```bash
   # Check migration status
   npx prisma migrate status

   # Apply pending migrations
   npx prisma migrate deploy

   # Generate Prisma client
   npx prisma generate
   ```

4. **Start the Server:**
   ```bash
   npm run start:dev
   ```
   The server will start on http://localhost:3000

### 2. Flutter Integration

1. **Add Dependencies to pubspec.yaml:**

   ```yaml
   dependencies:
     flutter:
       sdk: flutter
     http: ^1.1.0
     file_picker: ^6.1.1
     image_picker: ^1.0.4
   ```

2. **Add the API Service:**

   - Copy the `api_service.dart` file to your Flutter project
   - Update the `baseUrl` in the ApiService class to match your server

3. **Add the Upload Page:**

   - Copy the `upload_report_page_updated.dart` file
   - Rename it to fit your project structure

4. **Update Base URL:**

   ```dart
   // In api_service.dart
   static const String baseUrl = 'http://YOUR_SERVER_IP:3000';

   // For Android emulator: http://10.0.2.2:3000
   // For iOS simulator: http://localhost:3000
   // For physical device: http://YOUR_COMPUTER_IP:3000
   ```

## 📱 Flutter Usage Examples

### Basic Upload with Link

```dart
final apiService = ApiService();

try {
  final result = await apiService.uploadLabReport(
    1, // patientId
    'Blood Test Report - Complete Blood Count',
    'https://hospital.com/reports/blood-test-123.pdf',
    labId: 1, // optional
  );

  print('Upload successful: ${result['id']}');
} catch (e) {
  print('Upload failed: $e');
}
```

### Upload with Image File

```dart
final apiService = ApiService();

try {
  final result = await apiService.uploadLabReportImage(
    patientId: 1,
    description: 'X-Ray Chest Report',
    imageFile: File('/path/to/xray.jpg'),
    reportLink: 'https://hospital.com/xray-123', // optional
    labId: 1, // optional
  );

  print('Image upload successful: ${result['id']}');
} catch (e) {
  print('Image upload failed: $e');
}
```

### Universal Upload (Recommended)

```dart
final apiService = ApiService();

try {
  final result = await apiService.uploadLabReportUniversal(
    patientId: 1,
    description: 'Complete Medical Report',
    uploadMethod: 'both', // 'link', 'image', 'pdf', 'both'
    reportLink: 'https://hospital.com/report-123',
    imageFile: File('/path/to/scan.jpg'),
    pdfFile: File('/path/to/report.pdf'),
    labId: 1,
  );

  print('Universal upload successful: ${result['id']}');
} catch (e) {
  print('Universal upload failed: $e');
}
```

### Get Patient's Lab Reports

```dart
final apiService = ApiService();

try {
  final reports = await apiService.getLabReports(patientId: 1);

  for (final report in reports) {
    print('Report ID: ${report['id']}');
    print('Description: ${report['description']}');
    print('Created: ${report['createdAt']}');

    // Check if has image
    if (report['imagePath'] != null) {
      final imageUrl = apiService.getFileUrl(
        report['imagePath'].split('/').last
      );
      print('Image URL: $imageUrl');
    }

    // Check if has PDF
    if (report['pdfPath'] != null) {
      final pdfUrl = apiService.getFileUrl(
        report['pdfPath'].split('/').last
      );
      print('PDF URL: $pdfUrl');
    }
  }
} catch (e) {
  print('Failed to get reports: $e');
}
```

## 🔧 Network Configuration

### For Development Testing:

1. **Android Emulator:**

   ```dart
   static const String baseUrl = 'http://10.0.2.2:3000';
   ```

2. **iOS Simulator:**

   ```dart
   static const String baseUrl = 'http://localhost:3000';
   ```

3. **Physical Device:**

   - Find your computer's IP address
   - Make sure both devices are on the same network

   ```dart
   static const String baseUrl = 'http://192.168.1.100:3000'; // Your computer's IP
   ```

4. **Windows - Find IP Address:**

   ```cmd
   ipconfig | findstr IPv4
   ```

5. **macOS/Linux - Find IP Address:**
   ```bash
   ifconfig | grep inet
   ```

## 🛡️ Error Handling

### Common Errors and Solutions:

1. **Connection Refused:**

   - Check if backend server is running
   - Verify the base URL is correct
   - Check firewall settings

2. **File Too Large:**

   - Backend limits: Images (10MB), PDFs (20MB)
   - Compress files if needed

3. **Invalid Patient ID:**

   - Ensure patient exists in database
   - Check patient ID format (must be number)

4. **File Type Not Supported:**
   - Images: JPG, JPEG, PNG, GIF
   - Documents: PDF only

### Flutter Error Handling Example:

```dart
try {
  final result = await apiService.uploadLabReportImage(
    patientId: patientId,
    description: description,
    imageFile: imageFile,
  );

  // Success
  ScaffoldMessenger.of(context).showSnackBar(
    SnackBar(
      content: Text('Report uploaded successfully!'),
      backgroundColor: Colors.green,
    ),
  );

} on Exception catch (e) {
  String errorMessage = 'Upload failed';

  if (e.toString().contains('Connection refused')) {
    errorMessage = 'Cannot connect to server. Please check your connection.';
  } else if (e.toString().contains('File too large')) {
    errorMessage = 'File is too large. Please choose a smaller file.';
  } else if (e.toString().contains('Invalid patient')) {
    errorMessage = 'Invalid patient ID. Please check and try again.';
  }

  ScaffoldMessenger.of(context).showSnackBar(
    SnackBar(
      content: Text(errorMessage),
      backgroundColor: Colors.red,
    ),
  );
}
```

## 📊 Testing the Integration

### 1. Test Backend Endpoints:

Use the included test script:

```bash
node test-lab-report-api.js
```

Or test manually with curl:

```bash
# Test link upload
curl -X POST http://localhost:3000/lab-report/upload-link \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": 1,
    "description": "Test Report",
    "reportLink": "https://example.com/report.pdf"
  }'

# Test get all reports
curl http://localhost:3000/lab-report
```

### 2. Test Flutter Integration:

1. Start the backend server
2. Run your Flutter app
3. Try uploading different types of reports
4. Check the `uploads/lab-reports/` directory for uploaded files
5. Verify data in the database

## 🗄️ Database Testing

Check your data using Prisma Studio:

```bash
npx prisma studio
```

Or query directly:

```sql
-- Check patients
SELECT * FROM "Patient" JOIN "User" ON "Patient"."userId" = "User"."id";

-- Check lab reports
SELECT * FROM "lab_reports";

-- Check labs
SELECT * FROM "labs";
```

## 🚀 Production Deployment

### Backend Considerations:

1. **Environment Variables:**

   ```
   NODE_ENV=production
   DATABASE_URL="postgresql://..."
   JWT_SECRET="strong-secret-key"
   PORT=3000
   ```

2. **File Storage:**

   - Consider using cloud storage (AWS S3, Google Cloud Storage)
   - Implement proper file validation and scanning
   - Set up CDN for file delivery

3. **Security:**
   - Add authentication middleware
   - Implement rate limiting
   - Use HTTPS
   - Validate file types and content

### Flutter Considerations:

1. **Production API URL:**

   ```dart
   static const String baseUrl = 'https://your-production-domain.com';
   ```

2. **Error Handling:**

   - Implement retry mechanisms
   - Add offline support
   - Show proper loading states

3. **File Management:**
   - Compress images before upload
   - Show upload progress
   - Cache uploaded files locally

## 📋 Checklist

### Backend Setup:

- [ ] Dependencies installed
- [ ] Database connected and migrated
- [ ] Environment variables configured
- [ ] Server starts without errors
- [ ] File upload directory exists
- [ ] Test endpoints working

### Flutter Setup:

- [ ] Dependencies added to pubspec.yaml
- [ ] API service integrated
- [ ] Upload page implemented
- [ ] Base URL configured correctly
- [ ] Error handling implemented
- [ ] File picker working

### Testing:

- [ ] Backend endpoints tested
- [ ] Flutter app connects to backend
- [ ] File uploads work
- [ ] Data saves to database
- [ ] Files are accessible
- [ ] Error scenarios handled

## 🆘 Troubleshooting

### Common Issues:

1. **CORS Issues:**
   Add CORS configuration in main.ts:

   ```typescript
   app.enableCors({
     origin: true,
     credentials: true,
   });
   ```

2. **File Path Issues:**

   - Check file permissions
   - Verify upload directory exists
   - Use absolute paths

3. **Database Connection:**

   - Verify PostgreSQL is running
   - Check connection string format
   - Test database connectivity

4. **Flutter Network Issues:**
   - Check device network connectivity
   - Verify API base URL
   - Test with actual device IP
   - Check for proxy/firewall blocking

## 📞 Support

If you encounter issues:

1. Check the server logs for error messages
2. Verify all dependencies are installed
3. Test API endpoints individually
4. Check database connectivity
5. Verify file permissions and paths

For more detailed API documentation, see `LAB-REPORT-API.md`.
