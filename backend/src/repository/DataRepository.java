package repository;

import model.*;
import java.util.*;
import java.util.stream.Collectors;

public class DataRepository {
    private static DataRepository instance;

    private Admin admin;
    private Student student;
    private final List<Student> allStudents = new ArrayList<>();
    private final List<Teacher> teachers = new ArrayList<>();
    private final List<AttendanceSession> attendanceSessions = new ArrayList<>();
    private final List<Subject> subjects = new ArrayList<>();
    private final List<AttendanceRecord> attendanceRecords = new ArrayList<>();
    private final List<TimeTableSlot> timeTableSlots = new ArrayList<>();
    private final List<LeaveRequest> leaveRequests = new ArrayList<>();
    private final List<Assignment> assignments = new ArrayList<>();
    private final List<SemesterResult> semesterResults = new ArrayList<>();
    private final List<Holiday> holidays = new ArrayList<>();
    private final List<Notification> notifications = new ArrayList<>();

    private int availableLeave = 8;
    private int usedLeave = 4;

    private DataRepository() {
        seedData();
    }

    public static synchronized DataRepository getInstance() {
        if (instance == null) {
            instance = new DataRepository();
        }
        return instance;
    }

    private void seedData() {
        // 1. Admin Profile (Chief Administrator as requested)
        admin = new Admin(
            "ADM-001",
            "Bhaskara Sharma",
            "bhaskarasharmabvss@gmail.com",
            "ADMIN",
            "Provost & Chief Academic Administrator",
            "Office of the Registrar & Academic Council",
            "+91 94440 25262",
            ""
        );

        // 2. Primary Student Profile
        student = new Student(
            "STU-2024-8842",
            "Aarav Sharma",
            "22CS1084",
            "aarav.sharma@campus.edu.in",
            "+91 98765 43210",
            "Computer Science & Engineering",
            "B.Tech - Computer Science & Engineering",
            "3rd Year",
            "Semester VI",
            "Section B",
            "2025 - 2026",
            "",
            "2004-08-14",
            "O+ Positive",
            "Rajendra Sharma",
            "+91 98765 40001",
            "Flat 402, Royal Palms Enclave, Tech Park Road, Bangalore, Karnataka - 560103"
        );

        // 3. Complete Enrolled Student Cohort for Administrative Directory
        allStudents.add(student);
        allStudents.add(new Student("STU-2024-8843", "Ananya Roy", "22CS1085", "ananya.roy@campus.edu.in", "+91 98765 43211", "Computer Science & Engineering", "B.Tech - Computer Science", "3rd Year", "Semester VI", "Section B", "2025 - 2026", "", "2004-06-19", "A+ Positive", "Subhash Roy", "+91 98765 40002", "Indiranagar, Bangalore"));
        allStudents.add(new Student("STU-2024-8844", "Rohan Kulkarni", "22CS1086", "rohan.k@campus.edu.in", "+91 98765 43212", "Computer Science & Engineering", "B.Tech - Computer Science", "3rd Year", "Semester VI", "Section B", "2025 - 2026", "", "2004-11-03", "B+ Positive", "Virendra Kulkarni", "+91 98765 40003", "Koramangala 4th Block, Bangalore"));
        allStudents.add(new Student("STU-2024-8845", "Priya Patel", "22CS1087", "priya.p@campus.edu.in", "+91 98765 43213", "Computer Science & Engineering", "B.Tech - Computer Science", "3rd Year", "Semester VI", "Section B", "2025 - 2026", "", "2004-03-27", "AB+ Positive", "Kirit Patel", "+91 98765 40004", "HSR Layout Sector 2, Bangalore"));
        allStudents.add(new Student("STU-2024-8846", "Vikramaditya Verma", "22CS1088", "vikram.v@campus.edu.in", "+91 98765 43214", "Computer Science & Engineering", "B.Tech - Computer Science", "3rd Year", "Semester VI", "Section B", "2025 - 2026", "", "2004-09-12", "O- Negative", "Alok Verma", "+91 98765 40005", "Whitefield, Bangalore"));
        allStudents.add(new Student("STU-2024-8847", "Meera Sundaram", "22CS1089", "meera.s@campus.edu.in", "+91 98765 43215", "Computer Science & Engineering", "B.Tech - Computer Science", "3rd Year", "Semester VI", "Section B", "2025 - 2026", "", "2004-12-05", "B- Negative", "Sundaram Natarajan", "+91 98765 40006", "Jayanagar 9th Block, Bangalore"));

        // 3b. Faculty / Teachers Roster
        teachers.add(new Teacher(
            "TCH-001",
            "Dr. Vikram Sen",
            "vikram.sen@campus.edu.in",
            "+91 98765 11001",
            "Computer Science & Engineering",
            "Professor & HOD",
            Arrays.asList("CS601"),
            Arrays.asList("B.Tech CSE - Section B", "B.Tech CSE - Section A"),
            true,
            ""
        ));
        teachers.add(new Teacher(
            "TCH-002",
            "Prof. Ananya Roy",
            "ananya.roy@campus.edu.in",
            "+91 98765 11002",
            "Computer Science & Engineering",
            "Associate Professor",
            Arrays.asList("CS602"),
            Arrays.asList("B.Tech CSE - Section B"),
            true,
            ""
        ));
        teachers.add(new Teacher(
            "TCH-003",
            "Prof. Rajesh Verma",
            "rajesh.verma@campus.edu.in",
            "+91 98765 11003",
            "Computer Science & Engineering",
            "Assistant Professor",
            Arrays.asList("CS603"),
            Arrays.asList("B.Tech CSE - Section B"),
            true,
            ""
        ));
        teachers.add(new Teacher(
            "TCH-004",
            "Dr. Sunita Rao",
            "sunita.rao@campus.edu.in",
            "+91 98765 11004",
            "Computer Science & Engineering",
            "Professor",
            Arrays.asList("CS604"),
            Arrays.asList("B.Tech CSE - Section B"),
            true,
            ""
        ));

        // 3c. Initial Attendance Sessions
        attendanceSessions.add(new AttendanceSession(
            "SES-101",
            "2026-10-13",
            "Period 1 (09:00 - 10:00)",
            "B.Tech CSE - Section B",
            "CS601",
            "Distributed Systems",
            "TCH-001",
            "Dr. Vikram Sen",
            6,
            5,
            1,
            0,
            "SUBMITTED",
            "2026-10-13 09:55 AM",
            null
        ));

        // 4. Subjects (Curriculum)
        subjects.add(new Subject("SUB-1", "CS601", "Distributed Systems", "Dr. Vikram Sen", "vikram.sen@campus.edu.in", 4, 45, 40, 5, 1, "2026-10-15", 85));
        subjects.add(new Subject("SUB-2", "CS602", "Machine Learning & AI", "Prof. Ananya Roy", "ananya.roy@campus.edu.in", 4, 42, 30, 12, 1, "2026-10-18", 78)); // 71.4% Shortage Alert
        subjects.add(new Subject("SUB-3", "CS603", "Web Technologies & Cloud", "Prof. Rajesh Verma", "rajesh.verma@campus.edu.in", 3, 48, 44, 4, 0, "2026-10-22", 92));
        subjects.add(new Subject("SUB-4", "CS604", "Cloud Computing & DevOps", "Dr. Sunita Rao", "sunita.rao@campus.edu.in", 4, 40, 34, 6, 1, "2026-10-26", 80));
        subjects.add(new Subject("SUB-5", "CS605", "Computer Networks Lab", "Prof. Deepak Kulkarni", "deepak.k@campus.edu.in", 2, 28, 26, 2, 0, "2026-10-29", 90));
        subjects.add(new Subject("SUB-6", "CS606", "Software Engineering & Agile", "Prof. Meenakshi Iyer", "meenakshi.i@campus.edu.in", 3, 36, 28, 8, 0, "2026-11-02", 75));

        // 5. Attendance Class History
        attendanceRecords.add(new AttendanceRecord("ATT-101", "2026-09-18", "SUB-1", "Distributed Systems", "CS601", "09:00 AM - 10:00 AM", "Dr. Vikram Sen", "Present", "Regular Lecture"));
        attendanceRecords.add(new AttendanceRecord("ATT-102", "2026-09-18", "SUB-2", "Machine Learning & AI", "CS602", "10:15 AM - 11:15 AM", "Prof. Ananya Roy", "Absent", "Medical indisposition"));
        attendanceRecords.add(new AttendanceRecord("ATT-103", "2026-09-18", "SUB-3", "Web Technologies & Cloud", "CS603", "11:30 AM - 12:30 PM", "Prof. Rajesh Verma", "Present", "Hands-on coding"));
        attendanceRecords.add(new AttendanceRecord("ATT-104", "2026-09-17", "SUB-4", "Cloud Computing & DevOps", "CS604", "09:00 AM - 10:00 AM", "Dr. Sunita Rao", "Present", "Kubernetes demo"));
        attendanceRecords.add(new AttendanceRecord("ATT-105", "2026-09-17", "SUB-5", "Computer Networks Lab", "CS605", "10:15 AM - 12:30 PM", "Prof. Deepak Kulkarni", "Present", "Packet analysis"));
        attendanceRecords.add(new AttendanceRecord("ATT-106", "2026-09-17", "SUB-6", "Software Engineering & Agile", "CS606", "02:00 PM - 03:00 PM", "Prof. Meenakshi Iyer", "Present", "Sprint review"));
        attendanceRecords.add(new AttendanceRecord("ATT-107", "2026-09-16", "SUB-1", "Distributed Systems", "CS601", "09:00 AM - 10:00 AM", "Dr. Vikram Sen", "Present", "Consensus protocols"));
        attendanceRecords.add(new AttendanceRecord("ATT-108", "2026-09-16", "SUB-2", "Machine Learning & AI", "CS602", "10:15 AM - 11:15 AM", "Prof. Ananya Roy", "Absent", "Unplanned Absence"));
        attendanceRecords.add(new AttendanceRecord("ATT-109", "2026-09-16", "SUB-3", "Web Technologies & Cloud", "CS603", "01:30 PM - 02:30 PM", "Prof. Rajesh Verma", "Present", "REST API design"));
        attendanceRecords.add(new AttendanceRecord("ATT-110", "2026-09-15", "SUB-4", "Cloud Computing & DevOps", "CS604", "09:00 AM - 10:00 AM", "Dr. Sunita Rao", "Present", "AWS architecture"));

        // 6. Timetable Slots
        timeTableSlots.add(new TimeTableSlot("TT-1", "Monday", "CS601", "Distributed Systems", "Dr. Vikram Sen", "Room CS-204", "09:00 AM", "10:00 AM", "Lecture", "#4F46E5"));
        timeTableSlots.add(new TimeTableSlot("TT-2", "Monday", "CS602", "Machine Learning & AI", "Prof. Ananya Roy", "Room CS-204", "10:15 AM", "11:15 AM", "Lecture", "#EF4444"));
        timeTableSlots.add(new TimeTableSlot("TT-3", "Monday", "CS605", "Computer Networks Lab", "Prof. Deepak Kulkarni", "Lab Net-02", "11:30 AM", "01:30 PM", "Lab", "#059669"));
        timeTableSlots.add(new TimeTableSlot("TT-4", "Monday", "CS604", "Cloud Computing & DevOps", "Dr. Sunita Rao", "Room CS-204", "02:30 PM", "03:30 PM", "Lecture", "#0284C7"));

        timeTableSlots.add(new TimeTableSlot("TT-5", "Tuesday", "CS603", "Web Technologies & Cloud", "Prof. Rajesh Verma", "Room CS-201", "09:00 AM", "10:00 AM", "Lecture", "#7C3AED"));
        timeTableSlots.add(new TimeTableSlot("TT-6", "Tuesday", "CS606", "Software Engineering & Agile", "Prof. Meenakshi Iyer", "Room CS-201", "10:15 AM", "11:15 AM", "Lecture", "#D97706"));
        timeTableSlots.add(new TimeTableSlot("TT-7", "Tuesday", "CS601", "Distributed Systems", "Dr. Vikram Sen", "Room CS-204", "11:30 AM", "12:30 PM", "Lecture", "#4F46E5"));
        timeTableSlots.add(new TimeTableSlot("TT-8", "Tuesday", "CS602", "Machine Learning & AI", "Prof. Ananya Roy", "Lab AI-01", "01:30 PM", "03:30 PM", "Lab", "#EF4444"));

        timeTableSlots.add(new TimeTableSlot("TT-9", "Wednesday", "CS604", "Cloud Computing & DevOps", "Dr. Sunita Rao", "Lab Cloud-03", "09:00 AM", "11:00 AM", "Lab", "#0284C7"));
        timeTableSlots.add(new TimeTableSlot("TT-10", "Wednesday", "CS603", "Web Technologies & Cloud", "Prof. Rajesh Verma", "Room CS-201", "11:30 AM", "12:30 PM", "Lecture", "#7C3AED"));
        timeTableSlots.add(new TimeTableSlot("TT-11", "Wednesday", "CS602", "Machine Learning & AI", "Prof. Ananya Roy", "Room CS-204", "01:30 PM", "02:30 PM", "Lecture", "#EF4444"));
        timeTableSlots.add(new TimeTableSlot("TT-12", "Wednesday", "CS606", "Software Engineering & Agile", "Prof. Meenakshi Iyer", "Room CS-201", "02:30 PM", "03:30 PM", "Lecture", "#D97706"));

        timeTableSlots.add(new TimeTableSlot("TT-13", "Thursday", "CS601", "Distributed Systems", "Dr. Vikram Sen", "Room CS-204", "09:00 AM", "10:00 AM", "Lecture", "#4F46E5"));
        timeTableSlots.add(new TimeTableSlot("TT-14", "Thursday", "CS605", "Computer Networks Lab", "Prof. Deepak Kulkarni", "Room CS-204", "10:15 AM", "11:15 AM", "Lecture", "#059669"));
        timeTableSlots.add(new TimeTableSlot("TT-15", "Thursday", "CS603", "Web Technologies & Cloud", "Prof. Rajesh Verma", "Lab Web-02", "11:30 AM", "01:30 PM", "Lab", "#7C3AED"));
        timeTableSlots.add(new TimeTableSlot("TT-16", "Thursday", "CS604", "Cloud Computing & DevOps", "Dr. Sunita Rao", "Room CS-204", "02:30 PM", "03:30 PM", "Lecture", "#0284C7"));

        timeTableSlots.add(new TimeTableSlot("TT-17", "Friday", "CS606", "Software Engineering & Agile", "Prof. Meenakshi Iyer", "Room CS-201", "09:00 AM", "10:00 AM", "Lecture", "#D97706"));
        timeTableSlots.add(new TimeTableSlot("TT-18", "Friday", "CS602", "Machine Learning & AI", "Prof. Ananya Roy", "Room CS-204", "10:15 AM", "11:15 AM", "Lecture", "#EF4444"));
        timeTableSlots.add(new TimeTableSlot("TT-19", "Friday", "CS601", "Distributed Systems", "Dr. Vikram Sen", "Room CS-204", "11:30 AM", "12:30 PM", "Lecture", "#4F46E5"));
        timeTableSlots.add(new TimeTableSlot("TT-20", "Friday", "CS604", "Cloud Computing & DevOps", "Dr. Sunita Rao", "Room CS-204", "01:30 PM", "02:30 PM", "Lecture", "#0284C7"));

        timeTableSlots.add(new TimeTableSlot("TT-21", "Saturday", "CS603", "Web Technologies & Cloud", "Prof. Rajesh Verma", "Room CS-201", "09:30 AM", "11:00 AM", "Tutorial", "#7C3AED"));
        timeTableSlots.add(new TimeTableSlot("TT-22", "Saturday", "CS605", "Computer Networks Lab", "Prof. Deepak Kulkarni", "Room CS-204", "11:15 AM", "12:45 PM", "Tutorial", "#059669"));

        // 7. Leave Requests
        leaveRequests.add(new LeaveRequest("LV-201", "Medical Leave", "2026-09-10", "2026-09-11", 2, "Severe Viral Fever and Doctor Consultation", "medical_certificate.pdf", "Approved", "2026-09-09", "Bhaskara Sharma (Admin)", "Approved with attendance exemption granted."));
        leaveRequests.add(new LeaveRequest("LV-202", "On-Duty / Academic", "2026-08-25", "2026-08-26", 2, "Representing University in Inter-College Hackathon 2026", "hackathon_invite.pdf", "Approved", "2026-08-22", "Bhaskara Sharma (Admin)", "Duty approved, credits awarded."));
        leaveRequests.add(new LeaveRequest("LV-203", "Casual Leave", "2026-09-24", "2026-09-25", 2, "Attending Sister's Wedding Ceremony", "invitation_card.pdf", "Pending", "2026-09-16", "Under Review", "Pending review by Campus Provost."));

        // 8. Assignments
        assignments.add(new Assignment("ASN-01", "CS602", "Machine Learning & AI", "Neural Network Architecture & Backpropagation Implementation", "Prof. Ananya Roy", "2026-09-22", "Pending", 100, null, "Implement a 3-layer neural network from scratch in Python with gradient descent.", null, null));
        assignments.add(new Assignment("ASN-02", "CS601", "Distributed Systems", "Raft Consensus Algorithm Simulation Report", "Dr. Vikram Sen", "2026-09-25", "Pending", 50, null, "Simulate leader election and log replication scenarios with 5 nodes.", null, null));
        assignments.add(new Assignment("ASN-03", "CS604", "Cloud Computing & DevOps", "CI/CD Pipeline Setup using GitHub Actions and Docker", "Dr. Sunita Rao", "2026-09-28", "Pending", 50, null, "Containerize a microservice and deploy automated tests through Docker Hub.", null, null));
        assignments.add(new Assignment("ASN-04", "CS603", "Web Technologies & Cloud", "Single Page Application with Reactive State Management", "Prof. Rajesh Verma", "2026-09-10", "Submitted", 100, 94, "Build a responsive web application dashboard without external frameworks.", "2026-09-09", "web_tech_assignment_aarav.zip"));
        assignments.add(new Assignment("ASN-05", "CS605", "Computer Networks Lab", "Wireshark Packet Capture & Protocol Analysis Report", "Prof. Deepak Kulkarni", "2026-09-05", "Submitted", 50, 48, "Trace TCP 3-way handshake and SSL/TLS negotiation packets.", "2026-09-04", "wireshark_analysis_22CS1084.pdf"));
        assignments.add(new Assignment("ASN-06", "CS606", "Software Engineering & Agile", "Agile Sprint Backlog & Jira User Stories Documentation", "Prof. Meenakshi Iyer", "2026-08-30", "Overdue", 50, null, "Design complete user stories and sprint burndown chart for an e-commerce platform.", null, null));

        // 9. Semester Results
        List<SemesterResult.CourseGrade> sem6Grades = new ArrayList<>();
        sem6Grades.add(new SemesterResult.CourseGrade("Distributed Systems", "CS601", 4, "O", 10, "Pass"));
        sem6Grades.add(new SemesterResult.CourseGrade("Machine Learning & AI", "CS602", 4, "A+", 9, "Pass"));
        sem6Grades.add(new SemesterResult.CourseGrade("Web Technologies & Cloud", "CS603", 3, "O", 10, "Pass"));
        sem6Grades.add(new SemesterResult.CourseGrade("Cloud Computing & DevOps", "CS604", 4, "A+", 9, "Pass"));
        sem6Grades.add(new SemesterResult.CourseGrade("Computer Networks Lab", "CS605", 2, "O", 10, "Pass"));
        sem6Grades.add(new SemesterResult.CourseGrade("Software Engineering & Agile", "CS606", 3, "A", 8, "Pass"));
        semesterResults.add(new SemesterResult(6, "Semester VI (Current)", 9.25, 8.92, 20, 20, "First Class with Distinction", sem6Grades));

        List<SemesterResult.CourseGrade> sem5Grades = new ArrayList<>();
        sem5Grades.add(new SemesterResult.CourseGrade("Design & Analysis of Algorithms", "CS501", 4, "O", 10, "Pass"));
        sem5Grades.add(new SemesterResult.CourseGrade("Database Management Systems", "CS502", 4, "A+", 9, "Pass"));
        sem5Grades.add(new SemesterResult.CourseGrade("Operating Systems & Kernel", "CS503", 4, "A+", 9, "Pass"));
        sem5Grades.add(new SemesterResult.CourseGrade("Theory of Computation", "CS504", 3, "A", 8, "Pass"));
        sem5Grades.add(new SemesterResult.CourseGrade("DBMS Lab", "CS505", 2, "O", 10, "Pass"));
        sem5Grades.add(new SemesterResult.CourseGrade("Compiler Design Basics", "CS506", 3, "A+", 9, "Pass"));
        semesterResults.add(new SemesterResult(5, "Semester V", 9.10, 8.85, 20, 20, "First Class with Distinction", sem5Grades));

        semesterResults.add(new SemesterResult(4, "Semester IV", 8.95, 8.78, 22, 22, "First Class with Distinction", Collections.emptyList()));
        semesterResults.add(new SemesterResult(3, "Semester III", 8.80, 8.71, 24, 24, "First Class with Distinction", Collections.emptyList()));
        semesterResults.add(new SemesterResult(2, "Semester II", 8.65, 8.64, 23, 23, "First Class with Distinction", Collections.emptyList()));
        semesterResults.add(new SemesterResult(1, "Semester I", 8.40, 8.40, 23, 23, "First Class", Collections.emptyList()));

        // 10. Holidays
        holidays.add(new Holiday("HOL-1", "Mahatma Gandhi Jayanti", "2026-10-02", null, "Public Holiday", "National holiday commemoration", 14));
        holidays.add(new Holiday("HOL-2", "Dussehra & Vijayadashami Break", "2026-10-20", "2026-10-24", "Semester Break", "Autumn festive holidays for 5 days", 32));
        holidays.add(new Holiday("HOL-3", "Mid-Term Examination Week", "2026-10-15", "2026-10-20", "Exam", "Odd Semester Mid-Term Examinations", 27));
        holidays.add(new Holiday("HOL-4", "Diwali Festival Holidays", "2026-11-08", "2026-11-12", "Public Holiday", "Deepavali celebration vacation", 51));
        holidays.add(new Holiday("HOL-5", "Annual University Tech Fest 'INNOVISION'", "2026-11-20", "2026-11-22", "Event", "Flagship university technical symposium & hackathons", 63));
        holidays.add(new Holiday("HOL-6", "Semester End Practical Exams", "2026-12-05", "2026-12-12", "Exam", "Laboratory and Project Viva examinations", 78));

        // 11. Official Notifications
        notifications.add(new Notification("NOTIF-1", "Attendance Shortage Alert!", "Your attendance in Machine Learning & AI (CS602) has dropped to 71.4%. Minimum 75% is mandatory to be eligible for end-term examinations.", "Attendance", "2026-09-18 09:30 AM", false, "alert-circle", "#attendance"));
        notifications.add(new Notification("NOTIF-2", "Mid-Term Exam Schedule Released", "The schedule for Semester VI Mid-Term examinations (starting October 15) has been published by the Controller of Examinations.", "Exams", "2026-09-17 04:15 PM", false, "file-text", "#results"));
        notifications.add(new Notification("NOTIF-3", "Assignment Due in 4 Days", "Neural Network Architecture assignment for Machine Learning & AI is due on September 22, 2026.", "Assignments", "2026-09-16 11:00 AM", false, "calendar", "#assignments"));
        notifications.add(new Notification("NOTIF-4", "Hackathon Leave Request Approved", "Your leave application for 'Inter-College Hackathon 2026' from Aug 25 to Aug 26 has been approved by Dean.", "College", "2026-09-14 02:45 PM", true, "check-circle", "#leave"));
        notifications.add(new Notification("NOTIF-5", "Semester V Grade Sheets Ready", "Official physical grade cards for Semester V are now available for collection at the Academic Section counter.", "Results", "2026-09-12 10:00 AM", true, "award", "#results"));
        notifications.add(new Notification("NOTIF-6", "Guest Lecture on Cloud Scalability", "Distinguished talk by Principal Cloud Architect, Google Cloud, on Saturday Sep 26 in Main Auditorium.", "General", "2026-09-10 03:30 PM", true, "info", "#notifications"));
    }

    // --- Authentication ---
    public synchronized Map<String, Object> authenticate(String emailOrId, String password, String requestedRole) {
        Map<String, Object> resp = new HashMap<>();
        String trimmedUser = emailOrId != null ? emailOrId.trim() : "";
        String trimmedPass = password != null ? password.trim() : "";

        // 1. Admin Authentication: bhaskarasharmabvss@gmail.com / 252629
        if ("ADMIN".equalsIgnoreCase(requestedRole) || "bhaskarasharmabvss@gmail.com".equalsIgnoreCase(trimmedUser)) {
            if ("bhaskarasharmabvss@gmail.com".equalsIgnoreCase(trimmedUser) && "252629".equals(trimmedPass)) {
                resp.put("success", true);
                resp.put("role", "admin");
                resp.put("token", "admin-session-" + UUID.randomUUID().toString().substring(0, 8));
                resp.put("user", admin);
                return resp;
            } else {
                resp.put("success", false);
                resp.put("message", "Invalid Administrator credentials. Ensure email is bhaskarasharmabvss@gmail.com and password is correct.");
                return resp;
            }
        }

        // 2. Teacher / Faculty Authentication: teacher@attendify.edu or teacher email / teacher123
        if ("TEACHER".equalsIgnoreCase(requestedRole) || "teacher@attendify.edu".equalsIgnoreCase(trimmedUser) || trimmedUser.contains("faculty") || trimmedUser.toLowerCase().contains("sen") || trimmedUser.toLowerCase().contains("roy") || trimmedUser.toLowerCase().contains("verma")) {
            Teacher matchedTeacher = teachers.isEmpty() ? null : teachers.get(0);
            for (Teacher t : teachers) {
                if (t.getEmail().equalsIgnoreCase(trimmedUser) || t.getId().equalsIgnoreCase(trimmedUser)) {
                    matchedTeacher = t;
                    break;
                }
            }
            if ("teacher123".equals(trimmedPass) || "252629".equals(trimmedPass) || "teacher@attendify.edu".equalsIgnoreCase(trimmedUser)) {
                resp.put("success", true);
                resp.put("role", "teacher");
                resp.put("token", "teacher-session-" + UUID.randomUUID().toString().substring(0, 8));
                resp.put("user", matchedTeacher);
                return resp;
            } else {
                resp.put("success", false);
                resp.put("message", "Invalid Teacher credentials. Use teacher@attendify.edu with password teacher123.");
                return resp;
            }
        }

        // 3. Student Authentication: 22CS1084 / student123
        boolean matchFound = false;
        Student matchedStudent = student;
        for (Student s : allStudents) {
            if (s.getEmail().equalsIgnoreCase(trimmedUser) || s.getRollNumber().equalsIgnoreCase(trimmedUser)) {
                matchedStudent = s;
                matchFound = true;
                break;
            }
        }

        if (matchFound || "22CS1084".equalsIgnoreCase(trimmedUser) || "aarav.sharma@campus.edu.in".equalsIgnoreCase(trimmedUser) || "student".equalsIgnoreCase(trimmedUser)) {
            resp.put("success", true);
            resp.put("role", "student");
            resp.put("token", "student-session-" + UUID.randomUUID().toString().substring(0, 8));
            resp.put("user", matchedStudent);
            return resp;
        }

        resp.put("success", false);
        resp.put("message", "Student not found in campus database. Try Roll Number 22CS1084 with password student123.");
        return resp;
    }

    public synchronized Admin getAdmin() { return admin; }

    public synchronized Student getStudent() { return student; }

    public synchronized List<Student> getAllStudents() { return new ArrayList<>(allStudents); }

    public synchronized void updateStudent(String phone, String email, String address, String guardianPhone) {
        if (phone != null && !phone.trim().isEmpty()) student.setPhone(phone.trim());
        if (email != null && !email.trim().isEmpty()) student.setEmail(email.trim());
        if (address != null && !address.trim().isEmpty()) student.setAddress(address.trim());
        if (guardianPhone != null && !guardianPhone.trim().isEmpty()) student.setGuardianPhone(guardianPhone.trim());
    }

    public synchronized List<Subject> getSubjects() { return new ArrayList<>(subjects); }

    public synchronized Subject getSubjectById(String id) {
        return subjects.stream().filter(s -> s.getId().equals(id) || s.getCode().equalsIgnoreCase(id)).findFirst().orElse(null);
    }

    public synchronized List<AttendanceRecord> getAttendanceRecords() { return new ArrayList<>(attendanceRecords); }

    public synchronized AttendanceSummary getAttendanceSummary() {
        int total = subjects.stream().mapToInt(Subject::getTotalClasses).sum();
        int present = subjects.stream().mapToInt(Subject::getPresentClasses).sum();
        int absent = subjects.stream().mapToInt(Subject::getAbsentClasses).sum();
        int leave = 7;
        int lowAttCount = (int) subjects.stream().filter(Subject::isShortage).count();
        int pendingAsn = (int) assignments.stream().filter(a -> "Pending".equalsIgnoreCase(a.getStatus())).count();

        return new AttendanceSummary(
            total,
            present,
            absent,
            leave,
            8.92,
            pendingAsn,
            subjects.size(),
            lowAttCount
        );
    }

    public synchronized List<TimeTableSlot> getTimeTableSlots() { return new ArrayList<>(timeTableSlots); }

    public synchronized List<LeaveRequest> getLeaveRequests() { return new ArrayList<>(leaveRequests); }

    public synchronized LeaveRequest addLeaveRequest(String leaveType, String fromDate, String toDate, int numberOfDays, String reason, String docName) {
        String id = "LV-" + (200 + leaveRequests.size() + 1);
        LeaveRequest req = new LeaveRequest(
            id,
            leaveType,
            fromDate,
            toDate,
            numberOfDays,
            reason,
            (docName != null && !docName.isEmpty()) ? docName : "supporting_document.pdf",
            "Pending",
            "2026-10-13",
            "Under Review",
            "Submitted for review by Administrator Bhaskara Sharma"
        );
        leaveRequests.add(0, req);
        return req;
    }

    // --- Admin Operations ---
    public synchronized boolean actionLeave(String requestId, String status, String remarks) {
        for (LeaveRequest r : leaveRequests) {
            if (r.getId().equalsIgnoreCase(requestId)) {
                r.setStatus(status);
                r.setReviewedBy("Bhaskara Sharma (Chief Administrator)");
                r.setRemarks(remarks != null && !remarks.isEmpty() ? remarks : ("Leave request " + status.toLowerCase() + " by Admin"));
                if ("Approved".equalsIgnoreCase(status)) {
                    usedLeave += r.getNumberOfDays();
                    availableLeave = Math.max(0, availableLeave - r.getNumberOfDays());
                }
                return true;
            }
        }
        return false;
    }

    public synchronized boolean markAttendanceForSubject(String subjectCode, String status, String remarks) {
        Subject sub = subjects.stream().filter(s -> s.getCode().equalsIgnoreCase(subjectCode) || s.getId().equalsIgnoreCase(subjectCode)).findFirst().orElse(null);
        if (sub == null) return false;

        sub.setTotalClasses(sub.getTotalClasses() + 1);
        if ("Present".equalsIgnoreCase(status)) {
            sub.setPresentClasses(sub.getPresentClasses() + 1);
        } else {
            sub.setAbsentClasses(sub.getAbsentClasses() + 1);
        }

        String recId = "ATT-" + (100 + attendanceRecords.size() + 1);
        attendanceRecords.add(0, new AttendanceRecord(
            recId,
            "2026-10-13",
            sub.getId(),
            sub.getName(),
            sub.getCode(),
            "09:00 AM - 10:00 AM",
            sub.getFaculty(),
            status,
            remarks != null && !remarks.isEmpty() ? remarks : "Recorded by Chief Administrator Bhaskara Sharma"
        ));
        return true;
    }

    public synchronized Notification broadcastNotice(String title, String description, String category, String actionUrl) {
        String id = "NOTIF-" + (notifications.size() + 1);
        Notification notif = new Notification(
            id,
            title,
            description,
            category != null ? category : "Announcement",
            "2026-10-13 02:25 PM",
            false,
            "bell",
            actionUrl != null ? actionUrl : "#notifications"
        );
        notifications.add(0, notif);
        return notif;
    }

    public synchronized Subject addSubject(String code, String name, String faculty, String facultyEmail, int credits) {
        String id = "SUB-" + (subjects.size() + 1);
        Subject s = new Subject(id, code, name, faculty, facultyEmail, credits, 0, 0, 0, 0, "2026-11-20", 0);
        subjects.add(s);
        return s;
    }

    public synchronized List<Assignment> getAssignments() { return new ArrayList<>(assignments); }

    public synchronized boolean submitAssignment(String assignmentId, String submissionFile) {
        for (Assignment a : assignments) {
            if (a.getId().equalsIgnoreCase(assignmentId)) {
                a.setStatus("Submitted");
                a.setSubmittedDate("2026-10-13");
                a.setSubmissionFile(submissionFile != null ? submissionFile : "assignment_submission.zip");
                return true;
            }
        }
        return false;
    }

    public synchronized List<SemesterResult> getSemesterResults() { return new ArrayList<>(semesterResults); }

    public synchronized List<Holiday> getHolidays() { return new ArrayList<>(holidays); }

    public synchronized List<Notification> getNotifications() { return new ArrayList<>(notifications); }

    public synchronized void markAllNotificationsRead() {
        for (Notification n : notifications) {
            n.setRead(true);
        }
    }

    public synchronized Map<String, Integer> getLeaveBalance() {
        Map<String, Integer> map = new HashMap<>();
        int pending = (int) leaveRequests.stream().filter(l -> "Pending".equalsIgnoreCase(l.getStatus())).count();
        int approved = (int) leaveRequests.stream().filter(l -> "Approved".equalsIgnoreCase(l.getStatus())).count();
        int rejected = (int) leaveRequests.stream().filter(l -> "Rejected".equalsIgnoreCase(l.getStatus())).count();
        map.put("availableLeave", availableLeave);
        map.put("usedLeave", usedLeave);
        map.put("pendingRequests", pending);
        map.put("approvedRequests", approved);
        map.put("rejectedRequests", rejected);
        return map;
    }

    // ==========================================
    // TEACHER / FACULTY OPERATIONS
    // ==========================================
    public synchronized List<Teacher> getTeachers() {
        return new ArrayList<>(teachers);
    }

    public synchronized Teacher getTeacherById(String id) {
        return teachers.stream()
                .filter(t -> t.getId().equalsIgnoreCase(id) || t.getEmail().equalsIgnoreCase(id))
                .findFirst()
                .orElse(null);
    }

    public synchronized Teacher addTeacher(String name, String email, String phone, String department, String designation, List<String> subjectsList, List<String> classesList) {
        String id = "TCH-" + String.format("%03d", teachers.size() + 1);
        Teacher t = new Teacher(id, name, email, phone, department, designation, subjectsList, classesList, true, "");
        teachers.add(t);
        return t;
    }

    public synchronized boolean updateTeacher(String id, String name, String email, String phone, String department, String designation, boolean active) {
        Teacher t = getTeacherById(id);
        if (t != null) {
            if (name != null && !name.trim().isEmpty()) t.setName(name.trim());
            if (email != null && !email.trim().isEmpty()) t.setEmail(email.trim());
            if (phone != null && !phone.trim().isEmpty()) t.setPhone(phone.trim());
            if (department != null && !department.trim().isEmpty()) t.setDepartment(department.trim());
            if (designation != null && !designation.trim().isEmpty()) t.setDesignation(designation.trim());
            t.setActive(active);
            return true;
        }
        return false;
    }

    public synchronized boolean deleteTeacher(String id) {
        return teachers.removeIf(t -> t.getId().equalsIgnoreCase(id));
    }

    // ==========================================
    // STUDENT OPERATIONS (ADMIN & TEACHER)
    // ==========================================
    public synchronized Student addStudent(String name, String rollNumber, String email, String phone, String department, String course, String year, String semester, String section, String bloodGroup, String guardianName, String guardianPhone, String address) {
        String id = "STU-2024-" + (8842 + allStudents.size());
        Student s = new Student(
            id,
            name,
            rollNumber,
            email,
            phone,
            department != null ? department : "Computer Science & Engineering",
            course != null ? course : "B.Tech - Computer Science",
            year != null ? year : "3rd Year",
            semester != null ? semester : "Semester VI",
            section != null ? section : "Section B",
            "2025 - 2026",
            "",
            "2004-05-15",
            bloodGroup != null ? bloodGroup : "O+ Positive",
            guardianName != null ? guardianName : "Guardian Name",
            guardianPhone != null ? guardianPhone : phone,
            address != null ? address : "Bangalore, India"
        );
        allStudents.add(s);
        return s;
    }

    public synchronized boolean updateStudentBio(String rollOrId, String name, String email, String phone, String dept, String semester, String section) {
        for (Student s : allStudents) {
            if (s.getId().equalsIgnoreCase(rollOrId) || s.getRollNumber().equalsIgnoreCase(rollOrId)) {
                if (name != null && !name.trim().isEmpty()) s.setName(name.trim());
                if (email != null && !email.trim().isEmpty()) s.setEmail(email.trim());
                if (phone != null && !phone.trim().isEmpty()) s.setPhone(phone.trim());
                if (dept != null && !dept.trim().isEmpty()) s.setDepartment(dept.trim());
                if (semester != null && !semester.trim().isEmpty()) s.setSemester(semester.trim());
                if (section != null && !section.trim().isEmpty()) s.setSection(section.trim());
                return true;
            }
        }
        return false;
    }

    public synchronized boolean deleteStudent(String rollOrId) {
        return allStudents.removeIf(s -> s.getId().equalsIgnoreCase(rollOrId) || s.getRollNumber().equalsIgnoreCase(rollOrId));
    }

    // ==========================================
    // ATTENDANCE SESSIONS (TEACHER WORKFLOW)
    // ==========================================
    public synchronized List<AttendanceSession> getAttendanceSessions() {
        return new ArrayList<>(attendanceSessions);
    }

    public synchronized List<AttendanceSession> getAttendanceSessionsForTeacher(String teacherId) {
        if (teacherId == null || teacherId.trim().isEmpty()) return getAttendanceSessions();
        return attendanceSessions.stream()
                .filter(s -> s.getTeacherId().equalsIgnoreCase(teacherId) || s.getTeacherName().toLowerCase().contains(teacherId.toLowerCase()))
                .collect(Collectors.toList());
    }

    public synchronized AttendanceSession submitAttendanceSession(AttendanceSession session) {
        if (session.getId() == null || session.getId().trim().isEmpty()) {
            session.setId("SES-" + String.format("%03d", attendanceSessions.size() + 101));
        }
        attendanceSessions.add(0, session);

        // Update corresponding subject stats
        Subject sub = getSubjectById(session.getSubjectCode());
        if (sub != null) {
            sub.setTotalClasses(sub.getTotalClasses() + 1);
            if (session.getPresentCount() > 0) {
                sub.setPresentClasses(sub.getPresentClasses() + 1);
            } else {
                sub.setAbsentClasses(sub.getAbsentClasses() + 1);
            }
        }

        // Add AttendanceRecord to history
        AttendanceRecord rec = new AttendanceRecord(
            "ATT-" + (100 + attendanceRecords.size() + 1),
            session.getDate(),
            sub != null ? sub.getId() : "SUB-1",
            session.getSubjectName(),
            session.getSubjectCode(),
            session.getPeriod(),
            session.getTeacherName(),
            session.getPresentCount() >= session.getAbsentCount() ? "Present" : "Absent",
            "Marked via Teacher Session (" + session.getPresentCount() + "/" + session.getTotalStudents() + " present)"
        );
        attendanceRecords.add(0, rec);

        return session;
    }

    // ==========================================
    // TIMETABLE OPERATIONS
    // ==========================================
    public synchronized TimeTableSlot addTimeTableSlot(String day, String startTime, String endTime, String subjectCode, String subjectName, String faculty, String room, String type) {
        String id = "TT-" + (timeTableSlots.size() + 1);
        TimeTableSlot slot = new TimeTableSlot(id, day, subjectCode, subjectName, faculty, room, startTime, endTime, type, "#38BDF8");
        timeTableSlots.add(slot);
        return slot;
    }

    public synchronized boolean deleteTimeTableSlot(String slotId) {
        return timeTableSlots.removeIf(s -> s.getId().equalsIgnoreCase(slotId));
    }
}
