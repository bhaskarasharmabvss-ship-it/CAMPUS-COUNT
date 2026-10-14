package model;

import java.util.List;

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
}
