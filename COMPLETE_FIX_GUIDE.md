# 🔧 Complete Fix for "User ID not available" Error

## Backend Fixes Applied:

### ✅ **1. Auth Service Enhanced**

- Login response now includes complete user object with ID
- Returns: `{ accessToken, refreshToken, user: { id, username, email, name, role, ... } }`

### ✅ **2. Lab Service Fixed**

- Removed error objects that caused API failures
- Now throws proper exceptions for error handling
- Profile endpoints return proper data structure

### ✅ **3. Lab Controller Enhanced**

- Added proper error handling with try-catch blocks
- Returns proper HTTP status codes
- Better error messages for debugging

## 📱 Flutter App Fixes Needed:

### **1. Fix ApiService Class**

Make sure your `ApiService` has the correct base URL:

```dart
class ApiService {
  // For Android Emulator
  static const String baseUrl = 'http://10.0.2.2:3000';

  // For iOS Simulator, use:
  // static const String baseUrl = 'http://localhost:3000';

  Future<Map<String, dynamic>> login(String email, String password) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/login'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode({'email': email, 'password': password}),
    );

    if (response.statusCode == 200 || response.statusCode == 201) {
      return json.decode(response.body);
    } else {
      throw Exception('Login failed: ${response.body}');
    }
  }

  Future<Map<String, dynamic>> getProfile(String userId) async {
    final response = await http.get(
      Uri.parse('$baseUrl/lab/profile/$userId'),
      headers: {'Content-Type': 'application/json'},
    );

    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to get profile: ${response.body}');
    }
  }
}
```

### **2. Fix Login Screen**

Update your login screen to properly extract and store user ID:

```dart
Future<void> _login() async {
  try {
    final response = await _apiService.login(_emailController.text, _passwordController.text);

    // Extract user data from response
    final user = response['user'];
    if (user == null || user['id'] == null) {
      throw Exception('User data missing in response');
    }

    // Store user data in SharedPreferences
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('user_id', user['id']);
    await prefs.setString('user_name', user['name'] ?? '');
    await prefs.setString('user_email', user['email'] ?? '');
    await prefs.setString('user_role', user['role'] ?? '');
    await prefs.setString('access_token', response['accessToken'] ?? '');

    // Navigate to Lab Details with user ID
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(
        builder: (context) => LabDetails(userId: user['id']),
      ),
    );
  } catch (e) {
    print('Login error: $e');
    // Show error message
  }
}
```

### **3. Fix Lab Details Screen**

Update your Lab Details screen to check for user ID:

```dart
class LabDetails extends StatefulWidget {
  final String? userId;

  const LabDetails({Key? key, this.userId}) : super(key: key);

  @override
  State<LabDetails> createState() => _LabDetailsState();
}

class _LabDetailsState extends State<LabDetails> {
  String? _userId;

  @override
  void initState() {
    super.initState();
    _loadUserId();
  }

  Future<void> _loadUserId() async {
    if (widget.userId != null) {
      _userId = widget.userId;
    } else {
      // Try to get from SharedPreferences
      final prefs = await SharedPreferences.getInstance();
      _userId = prefs.getString('user_id');
    }

    if (_userId == null) {
      // Redirect to login if no user ID found
      Navigator.pushReplacementNamed(context, '/login');
    }

    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    if (_userId == null) {
      return Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    return Scaffold(
      // Your existing UI
      body: Column(
        children: [
          // Your existing buttons
          ElevatedButton(
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => ProfilePage(userId: _userId!),
                ),
              );
            },
            child: Text('Your Profile'),
          ),
        ],
      ),
    );
  }
}
```

## 🔑 Test Credentials:

```
Email: sanjeewa.lab@example.com
Password: 12345678
```

## 🚀 Quick Start:

1. Make sure backend is running: `npm run start:dev`
2. Update your Flutter ApiService base URL
3. Update login screen to store user ID
4. Update Lab Details to use stored user ID
5. Test with the provided credentials

The backend is now fixed and ready for your Flutter app!
