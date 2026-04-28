import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../models/student_model.dart';
import '../../services/database_service.dart';

class StudentDetailScreen extends StatelessWidget {
  final Student student;

  const StudentDetailScreen({super.key, required this.student});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(student.name),
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              _buildProfileCard(),
              const SizedBox(height: 20),
              _buildAttendanceSection(context),
              const SizedBox(height: 20),
              _buildAcademicSection(context),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildProfileCard() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            const CircleAvatar(radius: 40, child: Icon(Icons.person, size: 40)),
            const SizedBox(height: 10),
            Text(student.name, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
            Text(student.grade, style: const TextStyle(fontSize: 16, color: Colors.grey)),
            const Divider(),
            ListTile(
              leading: const Icon(Icons.phone),
              title: Text(student.contact),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildAttendanceSection(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text("Attendance", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                ElevatedButton.icon(
                  onPressed: () => _markAttendance(context),
                  icon: const Icon(Icons.add, size: 18),
                  label: const Text("Mark Today"),
                ),
              ],
            ),
            const SizedBox(height: 10),
            if (student.attendance.isEmpty)
              const Text("No attendance records.")
            else
              ListView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: student.attendance.length > 5 ? 5 : student.attendance.length,
                itemBuilder: (context, index) {
                  // Show latest first
                  final record = student.attendance[student.attendance.length - 1 - index];
                  return ListTile(
                    title: Text(DateFormat('MMM dd, yyyy').format(record.date)),
                    trailing: record.isPresent
                        ? const Icon(Icons.check_circle, color: Colors.green)
                        : const Icon(Icons.cancel, color: Colors.red),
                  );
                },
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildAcademicSection(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text("Academic Progress", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                ElevatedButton.icon(
                  onPressed: () => _addScore(context),
                  icon: const Icon(Icons.add, size: 18),
                  label: const Text("Add Score"),
                ),
              ],
            ),
            const SizedBox(height: 10),
             if (student.academicRecords.isEmpty)
              const Text("No academic records.")
            else
              ListView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: student.academicRecords.length,
                itemBuilder: (context, index) {
                  final record = student.academicRecords[index];
                  return ListTile(
                    title: Text(record.subject),
                    subtitle: Text(DateFormat('MMM dd').format(record.date)),
                    trailing: Text("${record.score}/${record.totalScore}", style: const TextStyle(fontWeight: FontWeight.bold)),
                  );
                },
              ),
          ],
        ),
      ),
    );
  }

  void _markAttendance(BuildContext context) async {
    // Logic to update attendance locally then push to DB
    // Ideally this should verify if today is already marked
    final newRecord = AttendanceRecord(date: DateTime.now(), isPresent: true);
    
    // In a real app we'd deep copy or use immutable structures, straightforward here
    student.attendance.add(newRecord);
    
    await DatabaseService().updateStudentData(student);
    if(context.mounted) {
       ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("Attendance Marked")));
       // Rebuild is needed, simplest way is pop and push or use state management. 
       // Since this is Stateless, we rely on parent StreamBuilder update or need to convert to Stateful/use Provider properly for single item.
       // However, DatabaseService().updateStudentData updates Firestore which triggers Stream in StudentListScreen. 
       // But THIS screen is passed a 'Student' object directly, not a stream.
       // For simplicity in this demo, we'll just pop.
       Navigator.pop(context);
    }
  }

  void _addScore(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) {
        String subject = '';
        String score = '';
        String total = '';
        return AlertDialog(
          title: const Text("Add Academic Score"),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(decoration: const InputDecoration(labelText: "Subject"), onChanged: (v) => subject = v),
              TextField(decoration: const InputDecoration(labelText: "Score"), keyboardType: TextInputType.number, onChanged: (v) => score = v),
              TextField(decoration: const InputDecoration(labelText: "Total Score"), keyboardType: TextInputType.number, onChanged: (v) => total = v),
            ],
          ),
          actions: [
            TextButton(child: const Text("Cancel"), onPressed: () => Navigator.pop(context)),
            TextButton(
              child: const Text("Save"),
              onPressed: () async {
                 if (subject.isNotEmpty && score.isNotEmpty && total.isNotEmpty) {
                   final newRecord = AcademicRecord(
                     subject: subject,
                     score: double.tryParse(score) ?? 0,
                     totalScore: double.tryParse(total) ?? 100,
                     date: DateTime.now(),
                   );
                   student.academicRecords.add(newRecord);
                   await DatabaseService().updateStudentData(student);
                   if (context.mounted) {
                     Navigator.pop(context);
                     Navigator.pop(context); // Go back to refresh
                   }
                 }
              },
            ),
          ],
        );
      },
    );
  }
}
