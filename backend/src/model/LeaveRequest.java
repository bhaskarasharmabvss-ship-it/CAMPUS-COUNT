package model;

public class LeaveRequest {
    private String id;
    private String leaveType;     // "Medical Leave", "Casual Leave", "On-Duty / Academic", "Emergency Leave"
    private String fromDate;      // YYYY-MM-DD
    private String toDate;        // YYYY-MM-DD
    private int numberOfDays;
    private String reason;
    private String documentName;
    private String status;        // "Pending", "Approved", "Rejected"
    private String appliedOn;
    private String reviewedBy;
    private String remarks;

    public LeaveRequest() {}

    public LeaveRequest(String id, String leaveType, String fromDate, String toDate,
                        int numberOfDays, String reason, String documentName,
                        String status, String appliedOn, String reviewedBy, String remarks) {
        this.id = id;
        this.leaveType = leaveType;
        this.fromDate = fromDate;
        this.toDate = toDate;
        this.numberOfDays = numberOfDays;
        this.reason = reason;
        this.documentName = documentName;
        this.status = status;
        this.appliedOn = appliedOn;
        this.reviewedBy = reviewedBy;
        this.remarks = remarks;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getLeaveType() { return leaveType; }
    public void setLeaveType(String leaveType) { this.leaveType = leaveType; }

    public String getFromDate() { return fromDate; }
    public void setFromDate(String fromDate) { this.fromDate = fromDate; }

    public String getToDate() { return toDate; }
    public void setToDate(String toDate) { this.toDate = toDate; }

    public int getNumberOfDays() { return numberOfDays; }
    public void setNumberOfDays(int numberOfDays) { this.numberOfDays = numberOfDays; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getDocumentName() { return documentName; }
    public void setDocumentName(String documentName) { this.documentName = documentName; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getAppliedOn() { return appliedOn; }
    public void setAppliedOn(String appliedOn) { this.appliedOn = appliedOn; }

    public String getReviewedBy() { return reviewedBy; }
    public void setReviewedBy(String reviewedBy) { this.reviewedBy = reviewedBy; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}
