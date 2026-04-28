class Student {
  final String id;
  final String name;
  final String grade;
  final String contact;
  final List<AttendanceRecord> attendance;
  final List<AcademicRecord> academicRecords;

  Student({
    required this.id,
    required this.name,
    required this.grade,
    required this.contact,
    this.attendance = const [],
    this.academicRecords = const [],
  });

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'name': name,
      'grade': grade,
      'contact': contact,
      'attendance': attendance.map((x) => x.toMap()).toList(),
      'academicRecords': academicRecords.map((x) => x.toMap()).toList(),
    };
  }

  factory Student.fromMap(Map<String, dynamic> map, String id) {
    return Student(
      id: id,
      name: map['name'] ?? '',
      grade: map['grade'] ?? '',
      contact: map['contact'] ?? '',
      attendance:List<AttendanceRecord>.from(
        (map['attendance'] as List<dynamic>? ?? []).map<AttendanceRecord>(
          (x) => AttendanceRecord.fromMap(x as Map<String, dynamic>),
        ),
      ),
      academicRecords: List<AcademicRecord>.from(
        (map['academicRecords'] as List<dynamic>? ?? []).map<AcademicRecord>(
          (x) => AcademicRecord.fromMap(x as Map<String, dynamic>),
        ),
      ),
    );
  }
}

class AttendanceRecord {
  final DateTime date;
  final bool isPresent;

  AttendanceRecord({required this.date, required this.isPresent});

  Map<String, dynamic> toMap() {
    return {
      'date': date.toIso8601String(),
      'isPresent': isPresent,
    };
  }

  factory AttendanceRecord.fromMap(Map<String, dynamic> map) {
    return AttendanceRecord(
      date: DateTime.parse(map['date']),
      isPresent: map['isPresent'] ?? false,
    );
  }
}

class AcademicRecord {
  final String subject;
  final double score;
  final double totalScore;
  final DateTime date;

  AcademicRecord({
    required this.subject,
    required this.score,
    required this.totalScore,
    required this.date,
  });

  Map<String, dynamic> toMap() {
    return {
      'subject': subject,
      'score': score,
      'totalScore': totalScore,
      'date': date.toIso8601String(),
    };
  }

  factory AcademicRecord.fromMap(Map<String, dynamic> map) {
    return AcademicRecord(
      subject: map['subject'] ?? '',
      score: (map['score'] as num).toDouble(),
      totalScore: (map['totalScore'] as num).toDouble(),
      date: DateTime.parse(map['date']),
    );
  }
}
