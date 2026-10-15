package model;

public class AttendanceSummary {
    private int totalClasses;
    private int presentClasses;
    private int absentClasses;
    private int leaveClasses;
    private double overallPercentage;
    private boolean isShortage;
    private int totalSubjects;
    private int lowAttendanceSubjects;
    private double currentCgpa;
    private int pendingAssignments;

    // Semester Target & Requirements ("Total No. of Classes Should Have for a Sem")
    private int semesterTotalClasses = 360;          // Total classes scheduled in semester
    private int semesterRequiredClasses = 270;       // Minimum required for 75% exam eligibility
    private double semesterTargetPercentage = 75.0;  // Standard university minimum threshold (75%)
    private int classesRemainingInSemester = 121;    // Remaining classes to be conducted
    private int classesNeededForEligibility = 68;    // Classes needed to secure >= 75%
    private int safeAbsencesAllowed = 53;            // Classes student can safely miss

    public AttendanceSummary() {}

    public AttendanceSummary(int totalClasses, int presentClasses, int absentClasses, int leaveClasses,
                             double currentCgpa, int pendingAssignments, int totalSubjects, int lowAttendanceSubjects) {
        this.totalClasses = totalClasses;
        this.presentClasses = presentClasses;
        this.absentClasses = absentClasses;
        this.leaveClasses = leaveClasses;
        this.currentCgpa = currentCgpa;
        this.pendingAssignments = pendingAssignments;
        this.totalSubjects = totalSubjects;
        this.lowAttendanceSubjects = lowAttendanceSubjects;
        if (totalClasses > 0) {
            this.overallPercentage = Math.round(((double) presentClasses / totalClasses) * 1000.0) / 10.0;
        } else {
            this.overallPercentage = 0.0;
        }
        this.isShortage = this.overallPercentage < 75.0;

        // Calculate semester metrics (e.g. 60 classes per subject for 6 subjects = 360)
        this.semesterTotalClasses = Math.max(360, totalSubjects * 60);
        this.semesterRequiredClasses = (int) Math.ceil(this.semesterTotalClasses * 0.75); // 270
        this.classesRemainingInSemester = Math.max(0, this.semesterTotalClasses - totalClasses);
        int needed = this.semesterRequiredClasses - presentClasses;
        this.classesNeededForEligibility = Math.max(0, needed);
        this.safeAbsencesAllowed = Math.max(0, this.classesRemainingInSemester - this.classesNeededForEligibility);
    }

    public int getTotalClasses() { return totalClasses; }
    public void setTotalClasses(int totalClasses) { this.totalClasses = totalClasses; }

    public int getPresentClasses() { return presentClasses; }
    public void setPresentClasses(int presentClasses) { this.presentClasses = presentClasses; }

    public int getAbsentClasses() { return absentClasses; }
    public void setAbsentClasses(int absentClasses) { this.absentClasses = absentClasses; }

    public int getLeaveClasses() { return leaveClasses; }
    public void setLeaveClasses(int leaveClasses) { this.leaveClasses = leaveClasses; }

    public double getOverallPercentage() { return overallPercentage; }
    public void setOverallPercentage(double overallPercentage) { this.overallPercentage = overallPercentage; }

    public boolean isShortage() { return isShortage; }
    public void setShortage(boolean shortage) { isShortage = shortage; }

    public int getTotalSubjects() { return totalSubjects; }
    public void setTotalSubjects(int totalSubjects) { this.totalSubjects = totalSubjects; }

    public int getLowAttendanceSubjects() { return lowAttendanceSubjects; }
    public void setLowAttendanceSubjects(int lowAttendanceSubjects) { this.lowAttendanceSubjects = lowAttendanceSubjects; }

    public double getCurrentCgpa() { return currentCgpa; }
    public void setCurrentCgpa(double currentCgpa) { this.currentCgpa = currentCgpa; }

    public int getPendingAssignments() { return pendingAssignments; }
    public void setPendingAssignments(int pendingAssignments) { this.pendingAssignments = pendingAssignments; }

    public int getSemesterTotalClasses() { return semesterTotalClasses; }
    public void setSemesterTotalClasses(int semesterTotalClasses) { this.semesterTotalClasses = semesterTotalClasses; }

    public int getSemesterRequiredClasses() { return semesterRequiredClasses; }
    public void setSemesterRequiredClasses(int semesterRequiredClasses) { this.semesterRequiredClasses = semesterRequiredClasses; }

    public double getSemesterTargetPercentage() { return semesterTargetPercentage; }
    public void setSemesterTargetPercentage(double semesterTargetPercentage) { this.semesterTargetPercentage = semesterTargetPercentage; }

    public int getClassesRemainingInSemester() { return classesRemainingInSemester; }
    public void setClassesRemainingInSemester(int classesRemainingInSemester) { this.classesRemainingInSemester = classesRemainingInSemester; }

    public int getClassesNeededForEligibility() { return classesNeededForEligibility; }
    public void setClassesNeededForEligibility(int classesNeededForEligibility) { this.classesNeededForEligibility = classesNeededForEligibility; }

    public int getSafeAbsencesAllowed() { return safeAbsencesAllowed; }
    public void setSafeAbsencesAllowed(int safeAbsencesAllowed) { this.safeAbsencesAllowed = safeAbsencesAllowed; }
}
