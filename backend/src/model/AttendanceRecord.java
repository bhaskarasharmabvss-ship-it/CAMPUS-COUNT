package model;

public class AttendanceRecord {
    private String id;
    private String date;        // Format: YYYY-MM-DD
    private String subjectId;
    private String subjectName;
    private String subjectCode;
    private String classTime;   // e.g. "09:00 AM - 10:00 AM"
    private String faculty;
    private String status;      // "Present", "Absent", "Leave"
    private String remarks;

    public AttendanceRecord() {}

    public AttendanceRecord(String id, String date, String subjectId, String subjectName,
                            String subjectCode, String classTime, String faculty,
                            String status, String remarks) {
        this.id = id;
        this.date = date;
        this.subjectId = subjectId;
        this.subjectName = subjectName;
        this.subjectCode = subjectCode;
        this.classTime = classTime;
        this.faculty = faculty;
        this.status = status;
        this.remarks = remarks;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getSubjectId() { return subjectId; }
    public void setSubjectId(String subjectId) { this.subjectId = subjectId; }

    public String getSubjectName() { return subjectName; }
    public void setSubjectName(String subjectName) { this.subjectName = subjectName; }

    public String getSubjectCode() { return subjectCode; }
    public void setSubjectCode(String subjectCode) { this.subjectCode = subjectCode; }

    public String getClassTime() { return classTime; }
    public void setClassTime(String classTime) { this.classTime = classTime; }

    public String getFaculty() { return faculty; }
    public void setFaculty(String faculty) { this.faculty = faculty; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}
