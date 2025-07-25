## Profile Issue Troubleshooting Guide

### 🔍 **Possible Causes for Profile Details Not Showing:**

#### 1. **Backend Server Not Running**

- Check if server is running on port 3000
- Run: `npm run start:dev`
- Verify with: `netstat -ano | findstr :3000`

#### 2. **Flutter API Service Issues**

Check your Flutter `ApiService` class:

```dart
// Make sure your base URL is correct
String baseUrl = 'http://10.0.2.2:3000'; // For Android emulator
// OR
String baseUrl = 'http://localhost:3000'; // For iOS simulator/web

// Profile endpoint should be:
Future<Map<String, dynamic>> getProfile(String userId) async {
  final response = await http.get(
    Uri.parse('$baseUrl/lab/profile/$userId'),
    headers: {'Content-Type': 'application/json'},
  );

  if (response.statusCode == 200) {
    return json.decode(response.body);
  } else {
    throw Exception('Failed to load profile: ${response.statusCode}');
  }
}
```

#### 3. **User ID Issues**

- Make sure you're passing the correct user ID from login
- User ID should be: `23373073-d4a0-4df4-80c2-e5fe1d75e632`
- Check if user ID is properly stored after login

#### 4. **Network/CORS Issues**

- Backend CORS is configured for Android emulator (`10.0.2.2:3000`)
- Make sure your Flutter app is using the correct IP address

#### 5. **Database Connection Issues**

- Verify database is running: PostgreSQL on port 5432
- Check if user exists in database

### 🔧 **Quick Tests:**

#### Test Login API:

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"sanjeewa.lab@example.com","password":"12345678"}'
```

#### Test Profile API:

```bash
curl -X GET http://localhost:3000/lab/profile/23373073-d4a0-4df4-80c2-e5fe1d75e632
```

### 📱 **Flutter Debugging:**

Add debug prints in your ProfilePage:

```dart
Future<void> _loadProfile() async {
  try {
    print('Loading profile for user ID: ${widget.userId}');
    final profileData = await _apiService.getProfile(widget.userId);
    print('Profile data received: $profileData');
    setState(() {
      _profileData = profileData;
      _isLoading = false;
    });
  } catch (e) {
    print('Profile loading error: $e');
    setState(() {
      _error = e.toString();
      _isLoading = false;
    });
  }
}
```

### 🎯 **Most Likely Issues:**

1. Backend server not running
2. Wrong API URL in Flutter (should be `http://10.0.2.2:3000` for Android)
3. User ID not properly passed from login screen
