import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../models/student_model.dart';
import '../../services/database_service.dart';

class ReportsScreen extends StatelessWidget {
  const ReportsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return StreamProvider<List<Student>>.value(
      value: DatabaseService().students,
      initialData: const [],
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Reports'),
        ),
        body: Consumer<List<Student>>(
          builder: (context, students, child) {
            final totalStudents = students.length;
            // Mocking high attendance for now as we don't have detailed attendance data yet
            final highAttendanceCount = students.isNotEmpty ? (students.length * 0.8).round() : 0; 

            return Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildSummaryCard(
                    context,
                    'Total Students',
                    totalStudents.toString(),
                    Icons.people,
                    Colors.blue,
                  ),
                  const SizedBox(height: 16),
                  _buildSummaryCard(
                    context,
                    'High Attendance (>80%)',
                    highAttendanceCount.toString(),
                    Icons.check_circle,
                    Colors.green,
                  ),
                   const SizedBox(height: 16),
                   const Text("Detailed analysis coming soon...", style: TextStyle(color: Colors.grey),)
                ],
              ),
            );
          },
        ),
      ),
    );
  }

  Widget _buildSummaryCard(BuildContext context, String title, String value, IconData icon, Color color) {
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Row(
          children: [
            CircleAvatar(
              radius: 25,
              backgroundColor: color.withOpacity(0.1),
              child: Icon(icon, color: color, size: 30),
            ),
            const SizedBox(width: 20),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 16,
                    color: Colors.grey,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                Text(
                  value,
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: color,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
