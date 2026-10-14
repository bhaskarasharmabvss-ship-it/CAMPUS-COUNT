/**
 * API Service for CampusCount Academic System
 * Supports Dual Authentication (Student Dossier & Campus Administrator Portal)
 * Liquid Crystal Data Layer with real backend synchronization
 */

const API_BASE = window.location.origin.includes('localhost:8080') 
  ? '/api' 
  : (window.location.protocol.startsWith('http') ? '/api' : null);

// Integrated state store mirroring DataRepository
const MockDB = {
  admin: {
    id: "ADM-001",
    name: "Bhaskara Sharma",
    email: "bhaskarasharmabvss@gmail.com",
    role: "ADMIN",
    designation: "Provost & Chief Academic Administrator",
    department: "Office of the Registrar & Academic Council",
    phone: "+91 94440 25262",
    avatarUrl: ""
  },
  student: {
    id: "STU-2024-8842",
    name: "Aarav Sharma",
    rollNumber: "22CS1084",
    email: "aarav.sharma@campus.edu.in",
    phone: "+91 98765 43210",
    department: "Computer Science & Engineering",
    course: "B.Tech - Computer Science & Engineering",
    year: "3rd Year",
    semester: "Semester VI",
    section: "Section B",
    academicYear: "2025 - 2026",
    avatarUrl: "",
    dob: "2004-08-14",
    bloodGroup: "O+ Positive",
    guardianName: "Rajendra Sharma",
    guardianPhone: "+91 98765 40001",
    address: "Flat 402, Royal Palms Enclave, Tech Park Road, Bangalore, Karnataka - 560103"
  },
  allStudents: [
    { id: "STU-2024-8842", name: "Aarav Sharma", rollNumber: "22CS1084", email: "aarav.sharma@campus.edu.in", phone: "+91 98765 43210", department: "Computer Science & Engineering", course: "B.Tech CSE", year: "3rd Year", semester: "Semester VI", section: "Section B", attendanceRate: 84.5, shortage: false },
    { id: "STU-2024-8843", name: "Ananya Roy", rollNumber: "22CS1085", email: "ananya.roy@campus.edu.in", phone: "+91 98765 43211", department: "Computer Science & Engineering", course: "B.Tech CSE", year: "3rd Year", semester: "Semester VI", section: "Section B", attendanceRate: 91.2, shortage: false },
    { id: "STU-2024-8844", name: "Rohan Kulkarni", rollNumber: "22CS1086", email: "rohan.k@campus.edu.in", phone: "+91 98765 43212", department: "Computer Science & Engineering", course: "B.Tech CSE", year: "3rd Year", semester: "Semester VI", section: "Section B", attendanceRate: 68.4, shortage: true },
    { id: "STU-2024-8845", name: "Priya Patel", rollNumber: "22CS1087", email: "priya.p@campus.edu.in", phone: "+91 98765 43213", department: "Computer Science & Engineering", course: "B.Tech CSE", year: "3rd Year", semester: "Semester VI", section: "Section B", attendanceRate: 95.0, shortage: false },
    { id: "STU-2024-8846", name: "Vikramaditya Verma", rollNumber: "22CS1088", email: "vikram.v@campus.edu.in", phone: "+91 98765 43214", department: "Computer Science & Engineering", course: "B.Tech CSE", year: "3rd Year", semester: "Semester VI", section: "Section B", attendanceRate: 72.1, shortage: true },
    { id: "STU-2024-8847", name: "Meera Sundaram", rollNumber: "22CS1089", email: "meera.s@campus.edu.in", phone: "+91 98765 43215", department: "Computer Science & Engineering", course: "B.Tech CSE", year: "3rd Year", semester: "Semester VI", section: "Section B", attendanceRate: 88.5, shortage: false }
  ],
  teachers: [
    { id: "TCH-001", name: "Dr. Vikram Sen", email: "vikram.sen@campus.edu.in", phone: "+91 98765 11001", department: "Computer Science & Engineering", designation: "Professor & HOD", subjects: ["CS601"], assignedClasses: ["B.Tech CSE - Section B", "B.Tech CSE - Section A"], active: true },
    { id: "TCH-002", name: "Prof. Ananya Roy", email: "ananya.roy@campus.edu.in", phone: "+91 98765 11002", department: "Computer Science & Engineering", designation: "Associate Professor", subjects: ["CS602"], assignedClasses: ["B.Tech CSE - Section B"], active: true },
    { id: "TCH-003", name: "Prof. Rajesh Verma", email: "rajesh.verma@campus.edu.in", phone: "+91 98765 11003", department: "Computer Science & Engineering", designation: "Assistant Professor", subjects: ["CS603"], assignedClasses: ["B.Tech CSE - Section B"], active: true },
    { id: "TCH-004", name: "Dr. Sunita Rao", email: "sunita.rao@campus.edu.in", phone: "+91 98765 11004", department: "Computer Science & Engineering", designation: "Professor", subjects: ["CS604"], assignedClasses: ["B.Tech CSE - Section B"], active: true }
  ],
  attendanceSessions: [
    { id: "SES-101", date: "2026-10-13", period: "Period 1 (09:00 - 10:00)", classSection: "B.Tech CSE - Section B", subjectCode: "CS601", subjectName: "Distributed Systems", teacherId: "TCH-001", teacherName: "Dr. Vikram Sen", totalStudents: 6, presentCount: 5, absentCount: 1, lateCount: 0, percentage: 83.3, status: "SUBMITTED", timestamp: "Today 09:55 AM" },
    { id: "SES-100", date: "2026-10-12", period: "Period 3 (11:30 - 12:30)", classSection: "B.Tech CSE - Section B", subjectCode: "CS603", subjectName: "Web Technologies & Cloud", teacherId: "TCH-003", teacherName: "Prof. Rajesh Verma", totalStudents: 6, presentCount: 6, absentCount: 0, lateCount: 0, percentage: 100.0, status: "SUBMITTED", timestamp: "Yesterday 12:25 PM" }
  ],
  summary: {
    totalClasses: 239,
    presentClasses: 202,
    absentClasses: 37,
    leaveClasses: 7,
    overallPercentage: 84.5,
    isShortage: false,
    totalSubjects: 6,
    lowAttendanceSubjects: 1,
    currentCgpa: 8.92,
    pendingAssignments: 2
  },
  subjects: [
    { id: "SUB-1", code: "CS601", name: "Distributed Systems", faculty: "Dr. Vikram Sen", facultyEmail: "vikram.sen@campus.edu.in", credits: 4, totalClasses: 45, presentClasses: 40, absentClasses: 5, attendancePercentage: 88.9, pendingAssignments: 1, examDate: "2026-10-15", syllabusCompletion: 85, isShortage: false, classesNeededFor75: 0 },
    { id: "SUB-2", code: "CS602", name: "Machine Learning & AI", faculty: "Prof. Ananya Roy", facultyEmail: "ananya.roy@campus.edu.in", credits: 4, totalClasses: 42, presentClasses: 30, absentClasses: 12, attendancePercentage: 71.4, pendingAssignments: 1, examDate: "2026-10-18", syllabusCompletion: 78, isShortage: true, classesNeededFor75: 6 },
    { id: "SUB-3", code: "CS603", name: "Web Technologies & Cloud", faculty: "Prof. Rajesh Verma", facultyEmail: "rajesh.verma@campus.edu.in", credits: 3, totalClasses: 48, presentClasses: 44, absentClasses: 4, attendancePercentage: 91.7, pendingAssignments: 0, examDate: "2026-10-22", syllabusCompletion: 92, isShortage: false, classesNeededFor75: 0 },
    { id: "SUB-4", code: "CS604", name: "Cloud Computing & DevOps", faculty: "Dr. Sunita Rao", facultyEmail: "sunita.rao@campus.edu.in", credits: 4, totalClasses: 40, presentClasses: 34, absentClasses: 6, attendancePercentage: 85.0, pendingAssignments: 1, examDate: "2026-10-26", syllabusCompletion: 80, isShortage: false, classesNeededFor75: 0 },
    { id: "SUB-5", code: "CS605", name: "Computer Networks Lab", faculty: "Prof. Deepak Kulkarni", facultyEmail: "deepak.k@campus.edu.in", credits: 2, totalClasses: 28, presentClasses: 26, absentClasses: 2, attendancePercentage: 92.9, pendingAssignments: 0, examDate: "2026-10-29", syllabusCompletion: 90, isShortage: false, classesNeededFor75: 0 },
    { id: "SUB-6", code: "CS606", name: "Software Engineering & Agile", faculty: "Prof. Meenakshi Iyer", facultyEmail: "meenakshi.i@campus.edu.in", credits: 3, totalClasses: 36, presentClasses: 28, absentClasses: 8, attendancePercentage: 77.8, pendingAssignments: 0, examDate: "2026-11-02", syllabusCompletion: 75, isShortage: false, classesNeededFor75: 0 }
  ],
  attendanceLogs: [
    { id: "ATT-101", date: "2026-10-13", subjectId: "SUB-1", subjectName: "Distributed Systems", subjectCode: "CS601", classTime: "09:00 AM - 10:00 AM", faculty: "Dr. Vikram Sen", status: "Present", remarks: "Regular Lecture" },
    { id: "ATT-102", date: "2026-10-13", subjectId: "SUB-2", subjectName: "Machine Learning & AI", subjectCode: "CS602", classTime: "10:15 AM - 11:15 AM", faculty: "Prof. Ananya Roy", status: "Absent", remarks: "Medical indisposition" },
    { id: "ATT-103", date: "2026-10-12", subjectId: "SUB-3", subjectName: "Web Technologies & Cloud", subjectCode: "CS603", classTime: "11:30 AM - 12:30 PM", faculty: "Prof. Rajesh Verma", status: "Present", remarks: "Hands-on coding" },
    { id: "ATT-104", date: "2026-10-12", subjectId: "SUB-4", subjectName: "Cloud Computing & DevOps", subjectCode: "CS604", classTime: "09:00 AM - 10:00 AM", faculty: "Dr. Sunita Rao", status: "Present", remarks: "Kubernetes demo" }
  ],
  leaveBalance: {
    availableLeave: 8,
    usedLeave: 4,
    pendingRequests: 1,
    approvedRequests: 2,
    rejectedRequests: 0
  },
  leaveRequests: [
    { id: "LV-201", leaveType: "Medical Leave", fromDate: "2026-09-10", toDate: "2026-09-11", numberOfDays: 2, reason: "Severe Viral Fever and Doctor Consultation", documentName: "medical_certificate.pdf", status: "Approved", appliedOn: "2026-09-09", reviewedBy: "Bhaskara Sharma (Admin)", remarks: "Approved with attendance exemption granted." },
    { id: "LV-202", leaveType: "On-Duty / Academic", fromDate: "2026-08-25", toDate: "2026-08-26", numberOfDays: 2, reason: "Representing University in Inter-College Hackathon 2026", documentName: "hackathon_invite.pdf", status: "Approved", appliedOn: "2026-08-22", reviewedBy: "Bhaskara Sharma (Admin)", remarks: "Duty approved, credits awarded." },
    { id: "LV-203", leaveType: "Casual Leave", fromDate: "2026-09-24", toDate: "2026-09-25", numberOfDays: 2, reason: "Attending Sister's Wedding Ceremony", documentName: "invitation_card.pdf", status: "Pending", appliedOn: "2026-09-16", reviewedBy: "Under Review", remarks: "Pending review by Campus Provost." }
  ],
  assignments: [
    { id: "ASN-01", subjectCode: "CS602", subjectName: "Machine Learning & AI", title: "Neural Network Architecture & Backpropagation Implementation", faculty: "Prof. Ananya Roy", dueDate: "2026-10-18", status: "Pending", totalMarks: 100, marksEarned: null, description: "Implement a 3-layer neural network from scratch in Python with gradient descent.", submittedDate: null, submissionFile: null },
    { id: "ASN-02", subjectCode: "CS601", subjectName: "Distributed Systems", title: "Raft Consensus Algorithm Simulation Report", faculty: "Dr. Vikram Sen", dueDate: "2026-10-22", status: "Pending", totalMarks: 50, marksEarned: null, description: "Simulate leader election and log replication scenarios with 5 nodes.", submittedDate: null, submissionFile: null },
    { id: "ASN-03", subjectCode: "CS604", subjectName: "Cloud Computing & DevOps", title: "CI/CD Pipeline Setup using GitHub Actions and Docker", faculty: "Dr. Sunita Rao", dueDate: "2026-10-25", status: "Pending", totalMarks: 50, marksEarned: null, description: "Containerize a microservice and deploy automated tests through Docker Hub.", submittedDate: null, submissionFile: null },
    { id: "ASN-04", subjectCode: "CS603", subjectName: "Web Technologies & Cloud", title: "Single Page Application with Reactive State Management", faculty: "Prof. Rajesh Verma", dueDate: "2026-10-05", status: "Submitted", totalMarks: 100, marksEarned: 94, description: "Build a responsive web application dashboard without external frameworks.", submittedDate: "2026-10-04", submissionFile: "web_tech_assignment_aarav.zip" }
  ],
  results: {
    currentSgpa: 9.25,
    currentCgpa: 8.92,
    totalCreditsEarned: 132,
    degreeTotalCredits: 160,
    semesterResults: [
      {
        semesterNumber: 6,
        semesterName: "Semester VI (Current)",
        sgpa: 9.25,
        cgpa: 8.92,
        creditsEarned: 20,
        totalCredits: 20,
        status: "First Class with Distinction",
        courseGrades: [
          { subjectName: "Distributed Systems", code: "CS601", credits: 4, grade: "O", gradePoint: 10, result: "Pass" },
          { subjectName: "Machine Learning & AI", code: "CS602", credits: 4, grade: "A+", gradePoint: 9, result: "Pass" },
          { subjectName: "Web Technologies & Cloud", code: "CS603", credits: 3, grade: "O", gradePoint: 10, result: "Pass" },
          { subjectName: "Cloud Computing & DevOps", code: "CS604", credits: 4, grade: "A+", gradePoint: 9, result: "Pass" },
          { subjectName: "Computer Networks Lab", code: "CS605", credits: 2, grade: "O", gradePoint: 10, result: "Pass" },
          { subjectName: "Software Engineering & Agile", code: "CS606", credits: 3, grade: "A", gradePoint: 8, result: "Pass" }
        ]
      },
      {
        semesterNumber: 5,
        semesterName: "Semester V",
        sgpa: 9.10,
        cgpa: 8.85,
        creditsEarned: 20,
        totalCredits: 20,
        status: "First Class with Distinction",
        courseGrades: [
          { subjectName: "Design & Analysis of Algorithms", code: "CS501", credits: 4, grade: "O", gradePoint: 10, result: "Pass" },
          { subjectName: "Database Management Systems", code: "CS502", credits: 4, grade: "A+", gradePoint: 9, result: "Pass" },
          { subjectName: "Operating Systems & Kernel", code: "CS503", credits: 4, grade: "A+", gradePoint: 9, result: "Pass" },
          { subjectName: "Theory of Computation", code: "CS504", credits: 3, grade: "A", gradePoint: 8, result: "Pass" }
        ]
      },
      { semesterNumber: 4, semesterName: "Semester IV", sgpa: 8.95, cgpa: 8.78, creditsEarned: 22, totalCredits: 22, status: "First Class with Distinction", courseGrades: [] },
      { semesterNumber: 3, semesterName: "Semester III", sgpa: 8.80, cgpa: 8.71, creditsEarned: 24, totalCredits: 24, status: "First Class with Distinction", courseGrades: [] },
      { semesterNumber: 2, semesterName: "Semester II", sgpa: 8.65, cgpa: 8.64, creditsEarned: 23, totalCredits: 23, status: "First Class with Distinction", courseGrades: [] },
      { semesterNumber: 1, semesterName: "Semester I", sgpa: 8.40, cgpa: 8.40, creditsEarned: 23, totalCredits: 23, status: "First Class", courseGrades: [] }
    ]
  },
  holidays: [
    { id: "HOL-1", title: "Mahatma Gandhi Jayanti", date: "2026-10-02", endDate: null, type: "Public Holiday", description: "National holiday commemoration", daysRemaining: 0 },
    { id: "HOL-2", title: "Dussehra & Vijayadashami Break", date: "2026-10-20", endDate: "2026-10-24", type: "Semester Break", description: "Autumn festive holidays for 5 days", daysRemaining: 7 },
    { id: "HOL-3", title: "Mid-Term Examination Week", date: "2026-10-15", endDate: "2026-10-20", type: "Exam", description: "Odd Semester Mid-Term Examinations", daysRemaining: 2 },
    { id: "HOL-4", title: "Diwali Festival Holidays", date: "2026-11-08", endDate: "2026-11-12", type: "Public Holiday", description: "Deepavali celebration vacation", daysRemaining: 26 },
    { id: "HOL-5", title: "Annual University Tech Fest 'INNOVISION'", date: "2026-11-20", endDate: "2026-11-22", type: "Event", description: "Flagship university technical symposium & hackathons", daysRemaining: 38 }
  ],
  notifications: [
    { id: "NOTIF-1", title: "Attendance Shortage Alert!", description: "Your attendance in Machine Learning & AI (CS602) has dropped to 71.4%. Minimum 75% is mandatory to be eligible for end-term examinations.", category: "Attendance", timestamp: "2026-10-13 09:30 AM", isRead: false, iconType: "alert-circle", actionUrl: "attendance" },
    { id: "NOTIF-2", title: "Mid-Term Exam Schedule Released", description: "The schedule for Semester VI Mid-Term examinations (starting October 15) has been published by the Controller of Examinations.", category: "Exams", timestamp: "2026-10-12 04:15 PM", isRead: false, iconType: "file-text", actionUrl: "results" },
    { id: "NOTIF-3", title: "Assignment Due in 4 Days", description: "Neural Network Architecture assignment for Machine Learning & AI is due on October 18, 2026.", category: "Assignments", timestamp: "2026-10-11 11:00 AM", isRead: false, iconType: "calendar", actionUrl: "assignments" }
  ]
};

const ApiService = {
  // --- Authentication ---
  async login({ email, password, role }) {
    if (API_BASE) {
      try {
        const res = await fetch(`${API_BASE}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, role })
        });
        const data = await res.json();
        return data;
      } catch (e) {
        console.warn("Backend auth failed, evaluating local credentials", e);
      }
    }

    // Local fallback evaluation
    if (role === 'admin' || email === 'bhaskarasharmabvss@gmail.com') {
      if (email === 'bhaskarasharmabvss@gmail.com' && password === '252629') {
        return { success: true, role: 'admin', user: MockDB.admin, token: 'mock-admin-token' };
      }
      return { success: false, message: 'Invalid Administrator credentials. Please verify your email and password.' };
    }

    if (role === 'teacher' || email === 'teacher@attendify.edu' || (email && (email.includes('teacher') || email.includes('vikram.sen')))) {
      if (password === 'teacher123' || password === '252629' || email === 'teacher@attendify.edu') {
        const teacher = (MockDB.teachers && MockDB.teachers[0]) || { name: 'Dr. Vikram Sen', id: 'TCH-001', designation: 'Professor & HOD' };
        return { success: true, role: 'teacher', user: teacher, token: 'mock-teacher-token' };
      }
      return { success: false, message: 'Invalid Teacher credentials. Use teacher@attendify.edu with teacher123.' };
    }

    // Student login
    return { success: true, role: 'student', user: MockDB.student, token: 'mock-student-token' };
  },

  async getStudent() {
    if (API_BASE) {
      try {
        const res = await fetch(`${API_BASE}/student`);
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn("Backend unavailable, using mock data", e);
      }
    }
    return MockDB.student;
  },

  async updateStudent(data) {
    if (API_BASE) {
      try {
        const res = await fetch(`${API_BASE}/student/update`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn("Backend update failed, updating local mock", e);
      }
    }
    Object.assign(MockDB.student, data);
    return { success: true, message: "Profile updated successfully", student: MockDB.student };
  },

  async getAttendance() {
    if (API_BASE) {
      try {
        const res = await fetch(`${API_BASE}/attendance`);
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn("Backend unavailable, using mock data", e);
      }
    }
    return { summary: MockDB.summary, subjects: MockDB.subjects };
  },

  async getAttendanceLogs() {
    if (API_BASE) {
      try {
        const res = await fetch(`${API_BASE}/attendance/logs`);
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn("Backend unavailable, using mock data", e);
      }
    }
    return MockDB.attendanceLogs;
  },

  async getTimeTable() {
    if (API_BASE) {
      try {
        const res = await fetch(`${API_BASE}/timetable`);
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn("Backend unavailable, using mock data", e);
      }
    }
    return [
      { id: "TT-1", dayOfWeek: "Monday", subjectCode: "CS601", subjectName: "Distributed Systems", faculty: "Dr. Vikram Sen", roomNumber: "Room CS-204", startTime: "09:00 AM", endTime: "10:00 AM", type: "Lecture", color: "#6366F1" },
      { id: "TT-2", dayOfWeek: "Monday", subjectCode: "CS602", subjectName: "Machine Learning & AI", faculty: "Prof. Ananya Roy", roomNumber: "Room CS-204", startTime: "10:15 AM", endTime: "11:15 AM", type: "Lecture", color: "#F43F5E" },
      { id: "TT-3", dayOfWeek: "Monday", subjectCode: "CS605", subjectName: "Computer Networks Lab", faculty: "Prof. Deepak Kulkarni", roomNumber: "Lab Net-02", startTime: "11:30 AM", endTime: "01:30 PM", type: "Lab", color: "#10B981" },
      { id: "TT-4", dayOfWeek: "Monday", subjectCode: "CS604", subjectName: "Cloud Computing & DevOps", faculty: "Dr. Sunita Rao", roomNumber: "Room CS-204", startTime: "02:30 PM", endTime: "03:30 PM", type: "Lecture", color: "#06B6D4" },
      { id: "TT-5", dayOfWeek: "Tuesday", subjectCode: "CS603", subjectName: "Web Technologies & Cloud", faculty: "Prof. Rajesh Verma", roomNumber: "Room CS-201", startTime: "09:00 AM", endTime: "10:00 AM", type: "Lecture", color: "#8B5CF6" },
      { id: "TT-6", dayOfWeek: "Tuesday", subjectCode: "CS606", subjectName: "Software Engineering & Agile", faculty: "Prof. Meenakshi Iyer", roomNumber: "Room CS-201", startTime: "10:15 AM", endTime: "11:15 AM", type: "Lecture", color: "#F59E0B" },
      { id: "TT-7", dayOfWeek: "Tuesday", subjectCode: "CS601", subjectName: "Distributed Systems", faculty: "Dr. Vikram Sen", roomNumber: "Room CS-204", startTime: "11:30 AM", endTime: "12:30 PM", type: "Lecture", color: "#6366F1" },
      { id: "TT-8", dayOfWeek: "Wednesday", subjectCode: "CS604", subjectName: "Cloud Computing & DevOps", faculty: "Dr. Sunita Rao", roomNumber: "Lab Cloud-03", startTime: "09:00 AM", endTime: "11:00 AM", type: "Lab", color: "#06B6D4" },
      { id: "TT-9", dayOfWeek: "Thursday", subjectCode: "CS601", subjectName: "Distributed Systems", faculty: "Dr. Vikram Sen", roomNumber: "Room CS-204", startTime: "09:00 AM", endTime: "10:00 AM", type: "Lecture", color: "#6366F1" },
      { id: "TT-10", dayOfWeek: "Friday", subjectCode: "CS602", subjectName: "Machine Learning & AI", faculty: "Prof. Ananya Roy", roomNumber: "Room CS-204", startTime: "10:15 AM", endTime: "11:15 AM", type: "Lecture", color: "#F43F5E" }
    ];
  },

  async getResults() {
    if (API_BASE) {
      try {
        const res = await fetch(`${API_BASE}/results`);
        if (res.ok) return await res.json();
      } catch (e) {}
    }
    return MockDB.results;
  },

  async getLeave() {
    if (API_BASE) {
      try {
        const res = await fetch(`${API_BASE}/leave`);
        if (res.ok) return await res.json();
      } catch (e) {}
    }
    return { balances: MockDB.leaveBalance, requests: MockDB.leaveRequests };
  },

  async applyLeave(data) {
    if (API_BASE) {
      try {
        const res = await fetch(`${API_BASE}/leave`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (res.ok) return await res.json();
      } catch (e) {}
    }
    const newReq = {
      id: `LV-${200 + MockDB.leaveRequests.length + 1}`,
      leaveType: data.leaveType || "Casual Leave",
      fromDate: data.fromDate,
      toDate: data.toDate,
      numberOfDays: parseInt(data.numberOfDays) || 1,
      reason: data.reason,
      documentName: data.documentName || "document.pdf",
      status: "Pending",
      appliedOn: "2026-10-13",
      reviewedBy: "Under Review",
      remarks: "Submitted for review by Administrator Bhaskara Sharma"
    };
    MockDB.leaveRequests.unshift(newReq);
    MockDB.leaveBalance.pendingRequests++;
    return { success: true, message: "Leave application submitted successfully!", leaveRequest: newReq, balances: MockDB.leaveBalance };
  },

  async getAssignments() {
    if (API_BASE) {
      try {
        const res = await fetch(`${API_BASE}/assignments`);
        if (res.ok) return await res.json();
      } catch (e) {}
    }
    return MockDB.assignments;
  },

  async submitAssignment(assignmentId, fileName) {
    if (API_BASE) {
      try {
        const res = await fetch(`${API_BASE}/assignments/submit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ assignmentId, fileName })
        });
        if (res.ok) return await res.json();
      } catch (e) {}
    }
    const asn = MockDB.assignments.find(a => a.id === assignmentId);
    if (asn) {
      asn.status = "Submitted";
      asn.submittedDate = "2026-10-13";
      asn.submissionFile = fileName || "assignment_file.zip";
      MockDB.summary.pendingAssignments = Math.max(0, MockDB.summary.pendingAssignments - 1);
      return { success: true, message: "Assignment submitted successfully!", assignments: MockDB.assignments };
    }
    return { success: false, message: "Assignment not found" };
  },

  async getHolidays() {
    if (API_BASE) {
      try {
        const res = await fetch(`${API_BASE}/holidays`);
        if (res.ok) return await res.json();
      } catch (e) {}
    }
    return MockDB.holidays;
  },

  async getNotifications() {
    if (API_BASE) {
      try {
        const res = await fetch(`${API_BASE}/notifications`);
        if (res.ok) return await res.json();
      } catch (e) {}
    }
    return MockDB.notifications;
  },

  async markAllNotificationsRead() {
    if (API_BASE) {
      try {
        const res = await fetch(`${API_BASE}/notifications/read`, { method: 'POST' });
        if (res.ok) return await res.json();
      } catch (e) {}
    }
    MockDB.notifications.forEach(n => n.isRead = true);
    return { success: true, message: "All notifications marked as read", notifications: MockDB.notifications };
  },

  // --- Admin Specific Operations ---
  async getAdminStudents() {
    if (API_BASE) {
      try {
        const res = await fetch(`${API_BASE}/admin/students`);
        if (res.ok) return await res.json();
      } catch (e) {}
    }
    return MockDB.allStudents;
  },

  async adminMarkAttendance(data) {
    if (API_BASE) {
      try {
        const res = await fetch(`${API_BASE}/admin/attendance/mark`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (res.ok) return await res.json();
      } catch (e) {}
    }
    const sub = MockDB.subjects.find(s => s.code === data.subjectCode || s.id === data.subjectCode);
    if (sub) {
      sub.totalClasses++;
      if (data.status === 'Present') sub.presentClasses++;
      else sub.absentClasses++;
      sub.attendancePercentage = Math.round((sub.presentClasses / sub.totalClasses) * 1000) / 10;
      sub.isShortage = sub.attendancePercentage < 75;
      return { success: true, message: `Attendance marked ${data.status} for ${data.subjectCode}`, subjects: MockDB.subjects };
    }
    return { success: false, message: "Subject not found" };
  },

  async adminActionLeave({ requestId, status, remarks }) {
    if (API_BASE) {
      try {
        const res = await fetch(`${API_BASE}/admin/leave/action`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ requestId, status, remarks })
        });
        if (res.ok) return await res.json();
      } catch (e) {}
    }
    const req = MockDB.leaveRequests.find(r => r.id === requestId);
    if (req) {
      req.status = status;
      req.reviewedBy = "Bhaskara Sharma (Chief Administrator)";
      req.remarks = remarks || `Application ${status.toLowerCase()} by Admin`;
      MockDB.leaveBalance.pendingRequests = Math.max(0, MockDB.leaveBalance.pendingRequests - 1);
      if (status === 'Approved') MockDB.leaveBalance.approvedRequests++;
      return { success: true, message: `Leave ${status} successfully!`, requests: MockDB.leaveRequests, balances: MockDB.leaveBalance };
    }
    return { success: false, message: "Request not found" };
  },

  async adminBroadcastNotice({ title, description, category }) {
    if (API_BASE) {
      try {
        const res = await fetch(`${API_BASE}/admin/notifications/broadcast`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, description, category })
        });
        if (res.ok) return await res.json();
      } catch (e) {}
    }
    const notif = {
      id: `NOTIF-${MockDB.notifications.length + 1}`,
      title,
      description,
      category: category || "Announcement",
      timestamp: "Just now",
      isRead: false,
      iconType: "bell",
      actionUrl: "#notifications"
    };
    MockDB.notifications.unshift(notif);
    return { success: true, message: "Official announcement broadcasted!", notifications: MockDB.notifications };
  },

  // --- Teacher & Faculty Operations ---
  async getTeachers() {
    if (API_BASE) {
      try {
        const res = await fetch(`${API_BASE}/teachers`);
        if (res.ok) return await res.json();
      } catch (e) {}
    }
    return MockDB.teachers;
  },

  async adminAddTeacher(data) {
    if (API_BASE) {
      try {
        const res = await fetch(`${API_BASE}/admin/teachers/add`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (res.ok) return await res.json();
      } catch (e) {}
    }
    const t = {
      id: `TCH-00${MockDB.teachers.length + 1}`,
      name: data.name,
      email: data.email,
      phone: data.phone || "+91 98765 00000",
      department: data.department || "Computer Science",
      designation: data.designation || "Assistant Professor",
      subjects: [data.subject || "CS601"],
      assignedClasses: [data.classSection || "B.Tech CSE - Section B"],
      active: true
    };
    MockDB.teachers.push(t);
    return { success: true, message: "Faculty member registered successfully!", teacher: t, teachers: MockDB.teachers };
  },

  async adminDeleteTeacher(id) {
    if (API_BASE) {
      try {
        const res = await fetch(`${API_BASE}/admin/teachers/delete`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id })
        });
        if (res.ok) return await res.json();
      } catch (e) {}
    }
    MockDB.teachers = MockDB.teachers.filter(t => t.id !== id);
    return { success: true, message: "Faculty member deactivated", teachers: MockDB.teachers };
  },

  async adminAddStudent(data) {
    if (API_BASE) {
      try {
        const res = await fetch(`${API_BASE}/admin/students/add`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (res.ok) return await res.json();
      } catch (e) {}
    }
    const s = {
      id: `STU-2024-${8842 + MockDB.allStudents.length}`,
      name: data.name,
      rollNumber: data.rollNumber,
      email: data.email,
      phone: data.phone || "+91 98765 43210",
      department: data.department || "Computer Science & Engineering",
      course: data.course || "B.Tech CSE",
      year: data.year || "3rd Year",
      semester: data.semester || "Semester VI",
      section: data.section || "Section B",
      attendanceRate: 85.0,
      shortage: false
    };
    MockDB.allStudents.push(s);
    return { success: true, message: "Student registered successfully!", student: s, students: MockDB.allStudents };
  },

  async adminDeleteStudent(id) {
    if (API_BASE) {
      try {
        const res = await fetch(`${API_BASE}/admin/students/delete`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id })
        });
        if (res.ok) return await res.json();
      } catch (e) {}
    }
    MockDB.allStudents = MockDB.allStudents.filter(s => s.id !== id && s.rollNumber !== id);
    return { success: true, message: "Student record archived", students: MockDB.allStudents };
  },

  async teacherSubmitAttendance(sessionData) {
    if (API_BASE) {
      try {
        const res = await fetch(`${API_BASE}/teacher/attendance/submit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sessionData)
        });
        if (res.ok) return await res.json();
      } catch (e) {}
    }
    const session = {
      id: `SES-${Math.floor(100 + Math.random() * 900)}`,
      date: sessionData.date || new Date().toISOString().split('T')[0],
      period: sessionData.period,
      classSection: sessionData.classSection,
      subjectCode: sessionData.subjectCode,
      subjectName: sessionData.subjectName,
      teacherId: sessionData.teacherId || "TCH-001",
      teacherName: sessionData.teacherName || "Dr. Vikram Sen",
      totalStudents: parseInt(sessionData.totalStudents) || 6,
      presentCount: parseInt(sessionData.presentCount) || 6,
      absentCount: parseInt(sessionData.absentCount) || 0,
      lateCount: parseInt(sessionData.lateCount) || 0,
      percentage: Math.round(((parseInt(sessionData.presentCount) || 6) / (parseInt(sessionData.totalStudents) || 6)) * 1000) / 10,
      status: "SUBMITTED",
      timestamp: "Just now"
    };
    MockDB.attendanceSessions.unshift(session);
    return { success: true, message: "Attendance session successfully submitted!", session, sessions: MockDB.attendanceSessions };
  },

  async getAttendanceSessions() {
    if (API_BASE) {
      try {
        const res = await fetch(`${API_BASE}/teacher/attendance/history`);
        if (res.ok) return await res.json();
      } catch (e) {}
    }
    return MockDB.attendanceSessions;
  },

  async adminAddTimetableSlot(slotData) {
    if (API_BASE) {
      try {
        const res = await fetch(`${API_BASE}/admin/timetable/add`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(slotData)
        });
        if (res.ok) return await res.json();
      } catch (e) {}
    }
    const slot = {
      id: `TT-${MockDB.timeTable.length + 1}`,
      dayOfWeek: slotData.day,
      startTime: slotData.startTime,
      endTime: slotData.endTime,
      subjectCode: slotData.subjectCode,
      subjectName: slotData.subjectName,
      faculty: slotData.faculty,
      roomNumber: slotData.room,
      type: slotData.type || "Lecture",
      color: "#38BDF8"
    };
    MockDB.timeTable.push(slot);
    return { success: true, message: "Timetable slot added successfully!", slot, slots: MockDB.timeTable };
  },

  async adminDeleteTimetableSlot(id) {
    if (API_BASE) {
      try {
        const res = await fetch(`${API_BASE}/admin/timetable/delete`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id })
        });
        if (res.ok) return await res.json();
      } catch (e) {}
    }
    MockDB.timeTable = MockDB.timeTable.filter(s => s.id !== id);
    return { success: true, message: "Timetable slot removed", slots: MockDB.timeTable };
  }
};
