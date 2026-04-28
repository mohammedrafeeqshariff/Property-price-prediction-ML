import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/student_model.dart';

class DatabaseService {
  final CollectionReference studentCollection =
      FirebaseFirestore.instance.collection('students');

  // Add or Update Student
  Future<void> updateStudentData(Student student) async {
    return await studentCollection.doc(student.id.isNotEmpty ? student.id : null).set(student.toMap());
  }

  // Get Students Stream
  Stream<List<Student>> get students {
    return studentCollection.snapshots().map(_studentListFromSnapshot);
  }

  List<Student> _studentListFromSnapshot(QuerySnapshot snapshot) {
    return snapshot.docs.map((doc) {
      return Student.fromMap(doc.data() as Map<String, dynamic>, doc.id);
    }).toList();
  }

  // Delete Student
  Future<void> deleteStudent(String id) async {
    await studentCollection.doc(id).delete();
  }
}
