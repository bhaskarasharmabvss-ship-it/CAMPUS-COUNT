package model;

public class Subject {
    private String id;
    private String code;
    private String name;
    private String faculty;
    private String facultyEmail;
    private int credits;
    private int totalClasses;
    private int presentClasses;
    private int absentClasses;
    private double attendancePercentage;
    private int pendingAssignments;
    private String examDate;
    private int syllabusCompletion;
    private boolean isShortage;
    private int classesNeededFor75;

    public Subject() {}

    public Subject(String id, String code, String name, String faculty, String facultyEmail,
                   int credits, int totalClasses, int presentClasses, int absentClasses,
                   int pendingAssignments, String examDate, int syllabusCompletion) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.faculty = faculty;
        this.facultyEmail = facultyEmail;
        this.credits = credits;
        this.totalClasses = totalClasses;
        this.presentClasses = presentClasses;
        this.absentClasses = absentClasses;
        this.pendingAssignments = pendingAssignments;
        this.examDate = examDate;
        this.syllabusCompletion = syllabusCompletion;
        recalculateAttendance();
    }

    public void recalculateAttendance() {
        if (totalClasses > 0) {
            this.attendancePercentage = Math.round(((double) presentClasses / totalClasses) * 1000.0) / 10.0;
        } else {
            this.attendancePercentage = 0.0;
        }
        this.isShortage = this.attendancePercentage < 75.0;

        // Calculate classes needed to reach 75%:
        // (P + X) / (T + X) >= 0.75 => P + X >= 0.75*T + 0.75*X => 0.25*X >= 0.75*T - P => X >= (3*T - 4*P)
        if (this.isShortage) {
            int needed = (3 * totalClasses) - (4 * presentClasses);
            this.classesNeededFor75 = Math.max(0, needed);
        } else {
            this.classesNeededFor75 = 0;
        }
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getFaculty() { return faculty; }
    public void setFaculty(String faculty) { this.faculty = faculty; }

    public String getFacultyEmail() { return facultyEmail; }
    public void setFacultyEmail(String facultyEmail) { this.facultyEmail = facultyEmail; }

    public int getCredits() { return credits; }
    public void setCredits(int credits) { this.credits = credits; }

    public int getTotalClasses() { return totalClasses; }
    public void setTotalClasses(int totalClasses) {
        this.totalClasses = totalClasses;
        recalculateAttendance();
    }

    public int getPresentClasses() { return presentClasses; }
    public void setPresentClasses(int presentClasses) {
        this.presentClasses = presentClasses;
        recalculateAttendance();
    }

    public int getAbsentClasses() { return absentClasses; }
    public void setAbsentClasses(int absentClasses) {
        this.absentClasses = absentClasses;
        recalculateAttendance();
    }

    public double getAttendancePercentage() { return attendancePercentage; }

    public int getPendingAssignments() { return pendingAssignments; }
    public void setPendingAssignments(int pendingAssignments) { this.pendingAssignments = pendingAssignments; }

    public String getExamDate() { return examDate; }
    public void setExamDate(String examDate) { this.examDate = examDate; }

    public int getSyllabusCompletion() { return syllabusCompletion; }
    public void setSyllabusCompletion(int syllabusCompletion) { this.syllabusCompletion = syllabusCompletion; }

    public boolean isShortage() { return isShortage; }
    public int getClassesNeededFor75() { return classesNeededFor75; }
}
