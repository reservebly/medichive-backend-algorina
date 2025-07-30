import 'package:flutter/material.dart';
import 'package:file_picker/file_picker.dart';
import 'package:image_picker/image_picker.dart';
import 'dart:io';
import 'api_service.dart';

class UploadReportPage extends StatefulWidget {
  const UploadReportPage({super.key});

  @override
  State<UploadReportPage> createState() => _UploadReportPageState();
}

class _UploadReportPageState extends State<UploadReportPage> {
  final _formKey = GlobalKey<FormState>();
  final _idController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _linkController = TextEditingController();
  final _labIdController = TextEditingController(); // Optional lab ID
  final ImagePicker _imagePicker = ImagePicker();

  bool _isLoading = false;
  File? _selectedImage;
  File? _selectedPDF;
  String _uploadMethod = 'link'; // 'link', 'image', 'pdf', 'both'

  @override
  void dispose() {
    _idController.dispose();
    _descriptionController.dispose();
    _linkController.dispose();
    _labIdController.dispose();
    super.dispose();
  }

  Future<void> _pickImage() async {
    try {
      final XFile? image = await _imagePicker.pickImage(
        source: ImageSource.gallery,
        imageQuality: 80,
      );
      if (image != null) {
        setState(() {
          _selectedImage = File(image.path);
        });
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('Failed to pick image: $e')));
      }
    }
  }

  Future<void> _pickPDF() async {
    try {
      FilePickerResult? result = await FilePicker.platform.pickFiles(
        type: FileType.custom,
        allowedExtensions: ['pdf'],
      );
      if (result != null && result.files.single.path != null) {
        setState(() {
          _selectedPDF = File(result.files.single.path!);
        });
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('Failed to pick PDF: $e')));
      }
    }
  }

  void _removeImage() {
    setState(() {
      _selectedImage = null;
    });
  }

  void _removePDF() {
    setState(() {
      _selectedPDF = null;
    });
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;

    // Validation based on upload method
    if (_uploadMethod == 'image' && _selectedImage == null) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text('Please select an image')));
      return;
    }

    if (_uploadMethod == 'pdf' && _selectedPDF == null) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text('Please select a PDF file')));
      return;
    }

    if (_uploadMethod == 'both' &&
        (_selectedImage == null || _selectedPDF == null)) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please select both image and PDF file')),
      );
      return;
    }

    if (_uploadMethod == 'link' && _linkController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter a report link')),
      );
      return;
    }

    setState(() => _isLoading = true);

    try {
      final patientId = int.parse(_idController.text.trim());
      final description = _descriptionController.text.trim();
      final reportLink = _linkController.text.trim();
      final labIdText = _labIdController.text.trim();
      final labId = labIdText.isNotEmpty ? int.tryParse(labIdText) : null;

      final apiService = ApiService();

      // Use the universal upload method
      final result = await apiService.uploadLabReportUniversal(
        patientId: patientId,
        description: description,
        uploadMethod: _uploadMethod,
        reportLink: reportLink.isNotEmpty ? reportLink : null,
        imageFile: _selectedImage,
        pdfFile: _selectedPDF,
        labId: labId,
      );

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Report uploaded successfully!'),
            backgroundColor: Colors.green,
          ),
        );
        Navigator.pop(context, result);
      }
    } catch (e) {
      setState(() => _isLoading = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to upload: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Upload Lab Report'),
        backgroundColor: Colors.white,
        foregroundColor: Colors.black,
        elevation: 1,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Patient ID Field
              TextFormField(
                controller: _idController,
                keyboardType: TextInputType.number,
                decoration: const InputDecoration(
                  labelText: 'Patient ID *',
                  border: OutlineInputBorder(),
                  helperText: 'Required',
                ),
                validator: (value) {
                  if (value == null || value.trim().isEmpty) {
                    return 'Please enter Patient ID';
                  }
                  if (int.tryParse(value.trim()) == null) {
                    return 'Patient ID must be a number';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 20),

              // Lab ID Field (Optional)
              TextFormField(
                controller: _labIdController,
                keyboardType: TextInputType.number,
                decoration: const InputDecoration(
                  labelText: 'Lab ID (Optional)',
                  border: OutlineInputBorder(),
                  helperText:
                      'Leave empty if not associated with a specific lab',
                ),
                validator: (value) {
                  if (value != null && value.trim().isNotEmpty) {
                    if (int.tryParse(value.trim()) == null) {
                      return 'Lab ID must be a number';
                    }
                  }
                  return null;
                },
              ),
              const SizedBox(height: 20),

              // Description Field
              TextFormField(
                controller: _descriptionController,
                maxLines: 3,
                decoration: const InputDecoration(
                  labelText: 'Description *',
                  border: OutlineInputBorder(),
                  helperText: 'Required',
                ),
                validator: (value) => value == null || value.trim().isEmpty
                    ? 'Please enter description'
                    : null,
              ),
              const SizedBox(height: 20),

              // Upload Method Selection
              const Text(
                'Upload Method',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 10),

              // Radio buttons for upload method
              Column(
                children: [
                  RadioListTile<String>(
                    title: const Text('Report Link Only'),
                    subtitle: const Text('Upload by providing a web link'),
                    value: 'link',
                    groupValue: _uploadMethod,
                    onChanged: (value) => setState(() {
                      _uploadMethod = value!;
                      // Clear files when switching to link mode
                      _selectedImage = null;
                      _selectedPDF = null;
                    }),
                  ),
                  RadioListTile<String>(
                    title: const Text('Image File Only'),
                    subtitle: const Text('Upload image file (JPG, PNG, GIF)'),
                    value: 'image',
                    groupValue: _uploadMethod,
                    onChanged: (value) => setState(() {
                      _uploadMethod = value!;
                      // Clear PDF when switching to image mode
                      _selectedPDF = null;
                    }),
                  ),
                  RadioListTile<String>(
                    title: const Text('PDF File Only'),
                    subtitle: const Text('Upload PDF document'),
                    value: 'pdf',
                    groupValue: _uploadMethod,
                    onChanged: (value) => setState(() {
                      _uploadMethod = value!;
                      // Clear image when switching to PDF mode
                      _selectedImage = null;
                    }),
                  ),
                  RadioListTile<String>(
                    title: const Text('Both Image and PDF'),
                    subtitle: const Text('Upload both image and PDF files'),
                    value: 'both',
                    groupValue: _uploadMethod,
                    onChanged: (value) =>
                        setState(() => _uploadMethod = value!),
                  ),
                ],
              ),

              const SizedBox(height: 20),

              // Report Link Field (for link upload method)
              if (_uploadMethod == 'link') ...[
                TextFormField(
                  controller: _linkController,
                  decoration: const InputDecoration(
                    labelText: 'Report Link *',
                    border: OutlineInputBorder(),
                    helperText: 'Required for link uploads',
                    prefixIcon: Icon(Icons.link),
                  ),
                  validator: (value) => value == null || value.trim().isEmpty
                      ? 'Please enter a report link'
                      : null,
                ),
                const SizedBox(height: 20),
              ],

              // Optional report link for file uploads
              if (_uploadMethod != 'link') ...[
                TextFormField(
                  controller: _linkController,
                  decoration: const InputDecoration(
                    labelText: 'Additional Report Link (Optional)',
                    border: OutlineInputBorder(),
                    helperText: 'Optional web link for additional reference',
                    prefixIcon: Icon(Icons.link),
                  ),
                ),
                const SizedBox(height: 20),
              ],

              // Image Upload Section
              if (_uploadMethod == 'image' || _uploadMethod == 'both') ...[
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Image File *',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    ElevatedButton.icon(
                      onPressed: _pickImage,
                      icon: const Icon(Icons.image),
                      label: const Text('Select Image'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.blue[50],
                        foregroundColor: Colors.blue[700],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                if (_selectedImage != null)
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      border: Border.all(color: Colors.green),
                      borderRadius: BorderRadius.circular(8),
                      color: Colors.green[50],
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.image, color: Colors.green),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                _selectedImage!.path.split('/').last,
                                style: const TextStyle(
                                  fontWeight: FontWeight.bold,
                                ),
                                overflow: TextOverflow.ellipsis,
                              ),
                              Text(
                                'Size: ${(_selectedImage!.lengthSync() / 1024 / 1024).toStringAsFixed(2)} MB',
                                style: const TextStyle(
                                  fontSize: 12,
                                  color: Colors.grey,
                                ),
                              ),
                            ],
                          ),
                        ),
                        IconButton(
                          onPressed: _removeImage,
                          icon: const Icon(Icons.close, color: Colors.red),
                        ),
                      ],
                    ),
                  ),
                const SizedBox(height: 20),
              ],

              // PDF Upload Section
              if (_uploadMethod == 'pdf' || _uploadMethod == 'both') ...[
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'PDF File *',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    ElevatedButton.icon(
                      onPressed: _pickPDF,
                      icon: const Icon(Icons.picture_as_pdf),
                      label: const Text('Select PDF'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.red[50],
                        foregroundColor: Colors.red[700],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                if (_selectedPDF != null)
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      border: Border.all(color: Colors.red),
                      borderRadius: BorderRadius.circular(8),
                      color: Colors.red[50],
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.picture_as_pdf, color: Colors.red),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                _selectedPDF!.path.split('/').last,
                                style: const TextStyle(
                                  fontWeight: FontWeight.bold,
                                ),
                                overflow: TextOverflow.ellipsis,
                              ),
                              Text(
                                'Size: ${(_selectedPDF!.lengthSync() / 1024 / 1024).toStringAsFixed(2)} MB',
                                style: const TextStyle(
                                  fontSize: 12,
                                  color: Colors.grey,
                                ),
                              ),
                            ],
                          ),
                        ),
                        IconButton(
                          onPressed: _removePDF,
                          icon: const Icon(Icons.close, color: Colors.red),
                        ),
                      ],
                    ),
                  ),
                const SizedBox(height: 20),
              ],

              // Submit Button
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _isLoading ? null : _submit,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF1E79BF),
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  child: _isLoading
                      ? const SizedBox(
                          width: 20,
                          height: 20,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            color: Colors.white,
                          ),
                        )
                      : const Text(
                          'Upload Report',
                          style: TextStyle(fontSize: 16, color: Colors.white),
                        ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
