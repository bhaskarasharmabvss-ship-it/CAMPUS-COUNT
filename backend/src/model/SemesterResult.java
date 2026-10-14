package model;

import java.util.List;

public class SemesterResult {
    private int semesterNumber;
    private String semesterName;
    private double sgpa;
    private double cgpa;
    private int creditsEarned;
    private int totalCredits;
    private String status;        // "Passed", "Distinction"
    private List<CourseGrade> courseGrades;

    public static class CourseGrade {
        private String subjectName;
        private String code;
        private int credits;
        private String grade;       // "O", "A+", "A", "B+", etc.
        private int gradePoint;     // 10, 9, 8, etc.
        private String result;      // "Pass", "Distinction"

        public CourseGrade() {}

        public CourseGrade(String subjectName, String code, int credits, String grade, int gradePoint, String result) {
            this.subjectName = subjectName;
            this.code = code;
            this.credits = credits;
            this.grade = grade;
            this.gradePoint = gradePoint;
            this.result = result;
        }

        public String getSubjectName() { return subjectName; }
        public void setSubjectName(String subjectName) { this.subjectName = subjectName; }

        public String getCode() { return code; }
        public void setCode(String code) { this.code = code; }

        public int getCredits() { return credits; }
        public void setCredits(int credits) { this.credits = credits; }

        public String getGrade() { return grade; }
        public void setGrade(String grade) { this.grade = grade; }

        public int getGradePoint() { return gradePoint; }
        public void setGradePoint(int gradePoint) { this.gradePoint = gradePoint; }

        public String getResult() { return result; }
        public void setResult(String result) { this.result = result; }
    }

    public SemesterResult() {}

    public SemesterResult(int semesterNumber, String semesterName, double sgpa, double cgpa,
                          int creditsEarned, int totalCredits, String status, List<CourseGrade> courseGrades) {
        this.semesterNumber = semesterNumber;
        this.semesterName = semesterName;
        this.sgpa = sgpa;
        this.cgpa = cgpa;
        this.creditsEarned = creditsEarned;
        this.totalCredits = totalCredits;
        this.status = status;
        this.courseGrades = courseGrades;
    }

    public int getSemesterNumber() { return semesterNumber; }
    public void setSemesterNumber(int semesterNumber) { this.semesterNumber = semesterNumber; }

    public String getSemesterName() { return semesterName; }
    public void setSemesterName(String semesterName) { this.semesterName = semesterName; }

    public double getSgpa() { return sgpa; }
    public void setSgpa(double sgpa) { this.sgpa = sgpa; }

    public double getCgpa() { return cgpa; }
    public void setCgpa(double cgpa) { this.cgpa = cgpa; }

    public int getCreditsEarned() { return creditsEarned; }
    public void setCreditsEarned(int creditsEarned) { this.creditsEarned = creditsEarned; }

    public int getTotalCredits() { return totalCredits; }
    public void setTotalCredits(int totalCredits) { this.totalCredits = totalCredits; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public List<CourseGrade> getCourseGrades() { return courseGrades; }
    public void setCourseGrades(List<CourseGrade> courseGrades) { this.courseGrades = courseGrades; }
}
