package model;

import java.util.ArrayList;
import java.util.List;

public class AttendanceSession {
    private String id;
    private String date;
    private String period;
    private String classSection;
    private String subjectCode;
    private String subjectName;
    private String teacherId;
    private String teacherName;
    private int totalStudents;
    private int presentCount;
    private int absentCount;
    private int lateCount;
    private double percentage;
    private String status; // "SUBMITTED" or "DRAFT"
    private String timestamp;
    private List<StudentAttendanceEntry> entries;

    public AttendanceSession() {
        this.entries = new ArrayList<>();
    }

    public AttendanceSession(String id, String date, String period, String classSection, String subjectCode, String subjectName, String teacherId, String teacherName, int totalStudents, int presentCount, int absentCount, int lateCount, String status, String timestamp, List<StudentAttendanceEntry> entries) {
        this.id = id;
        this.date = date;
        this.period = period;
        this.classSection = classSection;
        this.subjectCode = subjectCode;
        this.subjectName = subjectName;
        this.teacherId = teacherId;
        this.teacherName = teacherName;
        this.totalStudents = totalStudents;
        this.presentCount = presentCount;
        this.absentCount = absentCount;
        this.lateCount = lateCount;
        this.percentage = totalStudents > 0 ? Math.round(((double) presentCount / totalStudents) * 1000.0) / 10.0 : 0.0;
        this.status = status;
        this.timestamp = timestamp;
        this.entries = entries != null ? entries : new ArrayList<>();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getPeriod() { return period; }
    public void setPeriod(String period) { this.period = period; }

    public String getClassSection() { return classSection; }
    public void setClassSection(String classSection) { this.classSection = classSection; }

    public String getSubjectCode() { return subjectCode; }
    public void setSubjectCode(String subjectCode) { this.subjectCode = subjectCode; }

    public String getSubjectName() { return subjectName; }
    public void setSubjectName(String subjectName) { this.subjectName = subjectName; }

    public String getTeacherId() { return teacherId; }
    public void setTeacherId(String teacherId) { this.teacherId = teacherId; }

    public String getTeacherName() { return teacherName; }
    public void setTeacherName(String teacherName) { this.teacherName = teacherName; }

    public int getTotalStudents() { return totalStudents; }
    public void setTotalStudents(int totalStudents) { this.totalStudents = totalStudents; }

    public int getPresentCount() { return presentCount; }
    public void setPresentCount(int presentCount) { this.presentCount = presentCount; }

    public int getAbsentCount() { return absentCount; }
    public void setAbsentCount(int absentCount) { this.absentCount = absentCount; }

    public int getLateCount() { return lateCount; }
    public void setLateCount(int lateCount) { this.lateCount = lateCount; }

    public double getPercentage() { return percentage; }
    public void setPercentage(double percentage) { this.percentage = percentage; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getTimestamp() { return timestamp; }
    public void setTimestamp(String timestamp) { this.timestamp = timestamp; }

    public List<StudentAttendanceEntry> getEntries() { return entries; }
    public void setEntries(List<StudentAttendanceEntry> entries) { this.entries = entries; }

    public static class StudentAttendanceEntry {
        private String studentId;
        private String rollNumber;
        private String studentName;
        private String status; // "PRESENT", "ABSENT", "LATE"

        public StudentAttendanceEntry() {}

        public StudentAttendanceEntry(String studentId, String rollNumber, String studentName, String status) {
            this.studentId = studentId;
            this.rollNumber = rollNumber;
            this.studentName = studentName;
            this.status = status;
        }

        public String getStudentId() { return studentId; }
        public void setStudentId(String studentId) { this.studentId = studentId; }

        public String getRollNumber() { return rollNumber; }
        public void setRollNumber(String rollNumber) { this.rollNumber = rollNumber; }

        public String getStudentName() { return studentName; }
        public void setStudentName(String studentName) { this.studentName = studentName; }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }
}
