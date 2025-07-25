# 🔍 Flutter "Unknown User" Issue - Debugging Guide

## Problem Analysis

The Flutter app shows "Submitting as: Unknown User" in the Complaints screen, but the backend is working correctly and returning proper user information.

## 🧪 Backend Verification (✅ WORKING)

Tested the backend endpoints and confirmed:

- ✅ Login endpoint: `http://localhost:3000/auth/login` returns complete user data
- ✅ Profile endpoint: `http://localhost:3000/lab/profile/{userId}` returns user profile
- ✅ User ID is properly returned: `abc912df-707d-4b1b-b7e9-7c9e1a297289`
- ✅ User name is available: `Nadeesha Lakmal`

## 🎯 Root Cause: Flutter App Issues

The problem is in the Flutter app's user session management:

### Issue 1: User Data Not Stored After Login

The Flutter app might not be properly storing user information in SharedPreferences after login.

### Issue 2: User Data Not Retrieved in Complaint Screen

The complaint screen might not be retrieving the stored user information.

### Issue 3: Incorrect API Base URL

The Flutter app might be using wrong base URL (should be `http://10.0.2.2:3000` for Android emulator).

## 🛠️ Flutter Fixes Required

### 1. Fix ApiService Base URL (Android Emulator)

```dart
class ApiService {
  static const String baseUrl = 'http://10.0.2.2:3000'; // For Android emulator
  // static const String baseUrl = 'http://localhost:3000'; // For iOS simulator
}
```

### 2. Fix Login Response Handling

```dart
// In login screen
Future<void> _login() async {
  try {
    final response = await _apiService.login(_emailController.text, _passwordController.text);

    // ✅ CRITICAL: Store user data properly
    final userData = response['user'];
    final userId = userData['id'];
    final userName = userData['name'];
    final userEmail = userData['email'];

    // Store in SharedPreferences
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('user_id', userId);
    await prefs.setString('user_name', userName);
    await prefs.setString('user_email', userEmail);
    await prefs.setString('access_token', response['accessToken']);

    print('✅ User data stored: ID=$userId, Name=$userName');

    // Navigate to next screen
    Navigator.pushReplacementNamed(context, '/lab-details');

  } catch (error) {
    print('❌ Login error: $error');
    // Show error message
  }
}
```

### 3. Fix User Data Retrieval in Complaint Screen

```dart
// In complaint screen
class _ComplaintScreenState extends State<ComplaintScreen> {
  String _userName = 'Unknown User';
  String _userId = '';

  @override
  void initState() {
    super.initState();
    _loadUserData();
  }

  Future<void> _loadUserData() async {
    final prefs = await SharedPreferences.getInstance();
    final userId = prefs.getString('user_id') ?? '';
    final userName = prefs.getString('user_name') ?? 'Unknown User';

    setState(() {
      _userId = userId;
      _userName = userName;
    });

    print('✅ Loaded user data: ID=$_userId, Name=$_userName');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Complaints & Support')),
      body: Column(
        children: [
          // ✅ Show proper user name
          Container(
            padding: EdgeInsets.all(16),
            child: Row(
              children: [
                Icon(Icons.person, color: Colors.blue),
                SizedBox(width: 8),
                Text('Submitting as: $_userName'),
              ],
            ),
          ),
          // Rest of complaint form...
        ],
      ),
    );
  }
}
```

### 4. Fix ApiService Login Method

```dart
// In ApiService class
Future<Map<String, dynamic>> login(String email, String password) async {
  final response = await http.post(
    Uri.parse('$baseUrl/auth/login'), // ✅ Correct endpoint
    headers: {'Content-Type': 'application/json'},
    body: json.encode({
      'email': email,
      'password': password,
    }),
  );

  if (response.statusCode == 200 || response.statusCode == 201) {
    final data = json.decode(response.body);
    print('✅ Login successful: ${data['user']['name']}');
    return data;
  } else {
    print('❌ Login failed: ${response.statusCode} - ${response.body}');
    throw Exception('Login failed');
  }
}
```

### 5. Test User Session Persistence

Add this debug method to test if user data is properly stored:

```dart
// Add this method to test user session
Future<void> debugUserSession() async {
  final prefs = await SharedPreferences.getInstance();
  final userId = prefs.getString('user_id');
  final userName = prefs.getString('user_name');
  final userEmail = prefs.getString('user_email');

  print('🔍 Debug User Session:');
  print('  User ID: $userId');
  print('  User Name: $userName');
  print('  User Email: $userEmail');

  if (userId == null || userId.isEmpty) {
    print('❌ ERROR: User ID not found in SharedPreferences!');
  } else {
    print('✅ User session is valid');
  }
}
```

## 🧪 Testing Steps

### 1. Test Login Flow

1. Login with credentials: `nadeesha.labadmin@example.com` / `secure_hashed_pw_456`
2. Check if user data is stored in SharedPreferences
3. Verify navigation to lab details screen

### 2. Test User Display

1. Navigate to Complaints screen
2. Check if it shows "Submitting as: Nadeesha Lakmal" instead of "Unknown User"
3. Verify user ID is available for complaint submission

### 3. Test API Connectivity

1. Ensure Flutter app can reach `http://10.0.2.2:3000` (Android emulator)
2. Test profile endpoint: `http://10.0.2.2:3000/lab/profile/{userId}`
3. Verify complaint submission works

## 📋 Checklist

- [ ] Update ApiService base URL to `http://10.0.2.2:3000`
- [ ] Fix login response handling to store user data properly
- [ ] Fix complaint screen to load and display user data
- [ ] Test with credentials: `nadeesha.labadmin@example.com` / `secure_hashed_pw_456`
- [ ] Verify "Unknown User" changes to actual user name
- [ ] Test complaint submission with proper user ID

## 🎯 Expected Result

After implementing these fixes:

- ✅ Login should store user data in SharedPreferences
- ✅ Complaint screen should show "Submitting as: Nadeesha Lakmal"
- ✅ User ID should be available for all API calls
- ✅ Profile data should load correctly

The backend is working perfectly - this is purely a Flutter app implementation issue!
