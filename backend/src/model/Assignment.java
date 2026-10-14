package model;

public class Assignment {
    private String id;
    private String subjectCode;
    private String subjectName;
    private String title;
    private String faculty;
    private String dueDate;
    private String status;        // "Pending", "Submitted", "Overdue"
    private int totalMarks;
    private Integer marksEarned;
    private String description;
    private String submittedDate;
    private String submissionFile;

    public Assignment() {}

    public Assignment(String id, String subjectCode, String subjectName, String title,
                      String faculty, String dueDate, String status, int totalMarks,
                      Integer marksEarned, String description, String submittedDate, String submissionFile) {
        this.id = id;
        this.subjectCode = subjectCode;
        this.subjectName = subjectName;
        this.title = title;
        this.faculty = faculty;
        this.dueDate = dueDate;
        this.status = status;
        this.totalMarks = totalMarks;
        this.marksEarned = marksEarned;
        this.description = description;
        this.submittedDate = submittedDate;
        this.submissionFile = submissionFile;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getSubjectCode() { return subjectCode; }
    public void setSubjectCode(String subjectCode) { this.subjectCode = subjectCode; }

    public String getSubjectName() { return subjectName; }
    public void setSubjectName(String subjectName) { this.subjectName = subjectName; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getFaculty() { return faculty; }
    public void setFaculty(String faculty) { this.faculty = faculty; }

    public String getDueDate() { return dueDate; }
    public void setDueDate(String dueDate) { this.dueDate = dueDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public int getTotalMarks() { return totalMarks; }
    public void setTotalMarks(int totalMarks) { this.totalMarks = totalMarks; }

    public Integer getMarksEarned() { return marksEarned; }
    public void setMarksEarned(Integer marksEarned) { this.marksEarned = marksEarned; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getSubmittedDate() { return submittedDate; }
    public void setSubmittedDate(String submittedDate) { this.submittedDate = submittedDate; }

    public String getSubmissionFile() { return submissionFile; }
    public void setSubmissionFile(String submissionFile) { this.submissionFile = submissionFile; }
}
