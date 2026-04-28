import 'package:flutter/material.dart';
import '../../models/student_model.dart';
import '../../services/database_service.dart';

class AddStudentScreen extends StatefulWidget {
  final Student? student;
  const AddStudentScreen({super.key, this.student});

  @override
  State<AddStudentScreen> createState() => _AddStudentScreenState();
}

class _AddStudentScreenState extends State<AddStudentScreen> {
  final _formKey = GlobalKey<FormState>();
  String _name = '';
  String _grade = '';
  String _contact = '';

  @override
  void initState() {
    super.initState();
    if (widget.student != null) {
      _name = widget.student!.name;
      _grade = widget.student!.grade;
      _contact = widget.student!.contact;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.student == null ? 'Add Student' : 'Edit Student'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              TextFormField(
                initialValue: _name,
                decoration: const InputDecoration(labelText: 'Name'),
                validator: (val) => val!.isEmpty ? 'Please enter a name' : null,
                onChanged: (val) => _name = val,
              ),
              const SizedBox(height: 16),
              TextFormField(
                initialValue: _grade,
                decoration: const InputDecoration(labelText: 'Grade/Class'),
                validator: (val) => val!.isEmpty ? 'Please enter a grade' : null,
                onChanged: (val) => _grade = val,
              ),
              const SizedBox(height: 16),
              TextFormField(
                initialValue: _contact,
                decoration: const InputDecoration(labelText: 'Contact Info'),
                validator: (val) => val!.isEmpty ? 'Please enter contact info' : null,
                onChanged: (val) => _contact = val,
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: () async {
                  if (_formKey.currentState!.validate()) {
                    final student = Student(
                      id: widget.student?.id ?? '',
                      name: _name,
                      grade: _grade,
                      contact: _contact,
                      attendance: widget.student?.attendance ?? [],
                      academicRecords: widget.student?.academicRecords ?? [],
                    );
                    
                    await DatabaseService().updateStudentData(student);
                    if (context.mounted) Navigator.pop(context);
                  }
                },
                child: Text(widget.student == null ? 'Add Student' : 'Update Student'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
