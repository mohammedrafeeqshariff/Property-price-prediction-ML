import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../models/student_model.dart';
import '../../services/database_service.dart';
import 'add_student_screen.dart';
import 'student_detail_screen.dart';

class StudentListScreen extends StatefulWidget {
  const StudentListScreen({super.key});

  @override
  State<StudentListScreen> createState() => _StudentListScreenState();
}

class _StudentListScreenState extends State<StudentListScreen> {
  String searchQuery = "";

  @override
  Widget build(BuildContext context) {
    return StreamProvider<List<Student>>.value(
      value: DatabaseService().students,
      initialData: const [],
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Students'),
          actions: [
            IconButton(
              icon: const Icon(Icons.add),
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => const AddStudentScreen()),
                );
              },
            )
          ],
        ),
        body: Column(
          children: [
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: TextField(
                decoration: const InputDecoration(
                  labelText: 'Search by Name',
                  prefixIcon: Icon(Icons.search),
                ),
                onChanged: (val) {
                  setState(() {
                    searchQuery = val.toLowerCase();
                  });
                },
              ),
            ),
            Expanded(
              child: StudentList(searchQuery: searchQuery),
            ),
          ],
        ),
      ),
    );
  }
}

class StudentList extends StatelessWidget {
  final String searchQuery;
  const StudentList({super.key, required this.searchQuery});

  @override
  Widget build(BuildContext context) {
    final students = Provider.of<List<Student>>(context);
    final filteredStudents = students.where((student) {
      return student.name.toLowerCase().contains(searchQuery);
    }).toList();

    if (students.isEmpty) {
      return const Center(child: Text("No students found. Add one!"));
    }

    return ListView.builder(
      itemCount: filteredStudents.length,
      itemBuilder: (context, index) {
        return StudentTile(student: filteredStudents[index]);
      },
    );
  }
}

class StudentTile extends StatelessWidget {
  final Student student;
  const StudentTile({super.key, required this.student});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.fromLTRB(20.0, 6.0, 20.0, 0.0),
      child: ListTile(
        leading: CircleAvatar(
          radius: 25.0,
          backgroundColor: Theme.of(context).primaryColor,
          child: Text(student.name[0].toUpperCase(), style: const TextStyle(color: Colors.white)),
        ),
        title: Text(student.name),
        subtitle: Text('Grade: ${student.grade}'),
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => StudentDetailScreen(student: student),
            ),
          );
        },
        trailing: IconButton(
          icon: const Icon(Icons.edit, color: Colors.grey),
          onPressed: () {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => AddStudentScreen(student: student),
              ),
            );
          },
        ),
      ),
    );
  }
}
