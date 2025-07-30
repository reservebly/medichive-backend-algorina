// api_service.dart
import 'dart:io';
import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  // Update this base URL to match your backend server
  static const String baseUrl =
      'http://localhost:3000'; // Change this to your server URL

  // Helper method to create user-friendly error messages
  String _createUserFriendlyError(http.Response response) {
    try {
      final errorData = json.decode(response.body);
      final statusCode = response.statusCode;
      final message = errorData['message'] ?? 'Unknown error occurred';

      switch (statusCode) {
        case 400:
          if (message.contains('Patient ID')) {
            return 'Please enter a valid Patient ID (numbers only)';
          } else if (message.contains('description')) {
            return 'Please enter a description for the report';
          } else if (message.contains('file')) {
            return 'Please select a valid file to upload';
          }
          return 'Invalid input. Please check your data and try again.';

        case 404:
          if (message.contains('Patient')) {
            return 'Patient not found. Please check the Patient ID and try again.';
          } else if (message.contains('Lab')) {
            return 'Lab not found. Please check the Lab ID and try again.';
          }
          return 'Requested resource not found. Please check your input.';

        case 413:
          return 'File is too large. Please choose a smaller file.';

        case 415:
          return 'File type not supported. Please choose a valid image (JPG, PNG) or PDF file.';

        case 500:
          return 'Server error occurred. Please try again later or contact support.';

        case 503:
          return 'Service temporarily unavailable. Please try again later.';

        default:
          return 'Upload failed: $message';
      }
    } catch (e) {
      // If we can't parse the error response, provide a generic message
      return 'Connection error. Please check your internet connection and try again.';
    }
  }

  // Check if a patient exists (helper method)
  Future<bool> patientExists(int patientId) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/patient/$patientId'),
        headers: {'Content-Type': 'application/json'},
      );
      return response.statusCode == 200;
    } catch (e) {
      return false;
    }
  }

  // Get available patients (helper method)
  Future<List<Map<String, dynamic>>> getAvailablePatients() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/patient'),
        headers: {'Content-Type': 'application/json'},
      );
      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        return data.cast<Map<String, dynamic>>();
      }
      return [];
    } catch (e) {
      return [];
    }
  }

  // Upload lab report with only link
  Future<Map<String, dynamic>> uploadLabReport(
    int patientId,
    String description,
    String reportLink, {
    int? labId,
  }) async {
    final url = Uri.parse('$baseUrl/lab-report/upload-link');

    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: json.encode({
        'patientId': patientId,
        'description': description,
        'reportLink': reportLink,
        if (labId != null) 'labId': labId,
      }),
    );

    if (response.statusCode == 201) {
      return json.decode(response.body);
    } else {
      throw Exception(_createUserFriendlyError(response));
    }
  }

  // Upload lab report with image only
  Future<Map<String, dynamic>> uploadLabReportImage({
    required int patientId,
    required String description,
    required File imageFile,
    String? reportLink,
    int? labId,
  }) async {
    final url = Uri.parse('$baseUrl/lab-report/upload-image');

    var request = http.MultipartRequest('POST', url);

    // Add form fields
    request.fields['patientId'] = patientId.toString();
    request.fields['description'] = description;
    if (reportLink != null && reportLink.isNotEmpty) {
      request.fields['reportLink'] = reportLink;
    }
    if (labId != null) {
      request.fields['labId'] = labId.toString();
    }

    // Add image file
    request.files.add(
      await http.MultipartFile.fromPath('image', imageFile.path),
    );

    final streamedResponse = await request.send();
    final response = await http.Response.fromStream(streamedResponse);

    if (response.statusCode == 201) {
      return json.decode(response.body);
    } else {
      throw Exception(_createUserFriendlyError(response));
    }
  }

  // Upload lab report with PDF only
  Future<Map<String, dynamic>> uploadLabReportPDF({
    required int patientId,
    required String description,
    required File pdfFile,
    String? reportLink,
    int? labId,
  }) async {
    final url = Uri.parse('$baseUrl/lab-report/upload-pdf');

    var request = http.MultipartRequest('POST', url);

    // Add form fields
    request.fields['patientId'] = patientId.toString();
    request.fields['description'] = description;
    if (reportLink != null && reportLink.isNotEmpty) {
      request.fields['reportLink'] = reportLink;
    }
    if (labId != null) {
      request.fields['labId'] = labId.toString();
    }

    // Add PDF file
    request.files.add(await http.MultipartFile.fromPath('pdf', pdfFile.path));

    final streamedResponse = await request.send();
    final response = await http.Response.fromStream(streamedResponse);

    if (response.statusCode == 201) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to upload lab report with PDF: ${response.body}');
    }
  }

  // Upload lab report with both image and PDF
  Future<Map<String, dynamic>> uploadLabReportWithImageAndPDF({
    required int patientId,
    required String description,
    required File imageFile,
    required File pdfFile,
    String? reportLink,
    int? labId,
  }) async {
    final url = Uri.parse('$baseUrl/lab-report/upload-both');

    var request = http.MultipartRequest('POST', url);

    // Add form fields
    request.fields['patientId'] = patientId.toString();
    request.fields['description'] = description;
    if (reportLink != null && reportLink.isNotEmpty) {
      request.fields['reportLink'] = reportLink;
    }
    if (labId != null) {
      request.fields['labId'] = labId.toString();
    }

    // Add files
    request.files.add(
      await http.MultipartFile.fromPath('files', imageFile.path),
    );
    request.files.add(await http.MultipartFile.fromPath('files', pdfFile.path));

    final streamedResponse = await request.send();
    final response = await http.Response.fromStream(streamedResponse);

    if (response.statusCode == 201) {
      return json.decode(response.body);
    } else {
      throw Exception(
        'Failed to upload lab report with image and PDF: ${response.body}',
      );
    }
  }

  // Universal upload method (recommended)
  Future<Map<String, dynamic>> uploadLabReportUniversal({
    required int patientId,
    required String description,
    required String uploadMethod, // 'link', 'image', 'pdf', 'both'
    String? reportLink,
    File? imageFile,
    File? pdfFile,
    int? labId,
  }) async {
    final url = Uri.parse('$baseUrl/lab-report/upload');

    var request = http.MultipartRequest('POST', url);

    // Add form fields
    request.fields['patientId'] = patientId.toString();
    request.fields['description'] = description;
    request.fields['uploadMethod'] = uploadMethod;

    if (reportLink != null && reportLink.isNotEmpty) {
      request.fields['reportLink'] = reportLink;
    }
    if (labId != null) {
      request.fields['labId'] = labId.toString();
    }

    // Add files based on upload method
    if (uploadMethod == 'image' && imageFile != null) {
      request.files.add(
        await http.MultipartFile.fromPath('files', imageFile.path),
      );
    } else if (uploadMethod == 'pdf' && pdfFile != null) {
      request.files.add(
        await http.MultipartFile.fromPath('files', pdfFile.path),
      );
    } else if (uploadMethod == 'both' && imageFile != null && pdfFile != null) {
      request.files.add(
        await http.MultipartFile.fromPath('files', imageFile.path),
      );
      request.files.add(
        await http.MultipartFile.fromPath('files', pdfFile.path),
      );
    }

    final streamedResponse = await request.send();
    final response = await http.Response.fromStream(streamedResponse);

    if (response.statusCode == 201) {
      return json.decode(response.body);
    } else {
      throw Exception(_createUserFriendlyError(response));
    }
  }

  // Get all lab reports
  Future<List<Map<String, dynamic>>> getLabReports({
    int? patientId,
    int? labId,
  }) async {
    String url = '$baseUrl/lab-report';
    List<String> queryParams = [];

    if (patientId != null) {
      queryParams.add('patientId=$patientId');
    }
    if (labId != null) {
      queryParams.add('labId=$labId');
    }

    if (queryParams.isNotEmpty) {
      url += '?${queryParams.join('&')}';
    }

    final response = await http.get(
      Uri.parse(url),
      headers: {'Content-Type': 'application/json'},
    );

    if (response.statusCode == 200) {
      final List<dynamic> data = json.decode(response.body);
      return data.cast<Map<String, dynamic>>();
    } else {
      throw Exception('Failed to get lab reports: ${response.body}');
    }
  }

  // Get a specific lab report
  Future<Map<String, dynamic>> getLabReport(int id) async {
    final url = Uri.parse('$baseUrl/lab-report/$id');

    final response = await http.get(
      url,
      headers: {'Content-Type': 'application/json'},
    );

    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to get lab report: ${response.body}');
    }
  }

  // Update a lab report
  Future<Map<String, dynamic>> updateLabReport(
    int id,
    Map<String, dynamic> updateData,
  ) async {
    final url = Uri.parse('$baseUrl/lab-report/$id');

    final response = await http.patch(
      url,
      headers: {'Content-Type': 'application/json'},
      body: json.encode(updateData),
    );

    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to update lab report: ${response.body}');
    }
  }

  // Delete a lab report
  Future<void> deleteLabReport(int id) async {
    final url = Uri.parse('$baseUrl/lab-report/$id');

    final response = await http.delete(
      url,
      headers: {'Content-Type': 'application/json'},
    );

    if (response.statusCode != 200) {
      throw Exception('Failed to delete lab report: ${response.body}');
    }
  }

  // Get file URL for viewing
  String getFileUrl(String filename) {
    return '$baseUrl/lab-report/files/$filename';
  }
}
