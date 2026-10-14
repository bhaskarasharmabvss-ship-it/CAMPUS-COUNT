package model;

public class TimeTableSlot {
    private String id;
    private String dayOfWeek;  // Monday, Tuesday, Wednesday, Thursday, Friday, Saturday
    private String subjectCode;
    private String subjectName;
    private String faculty;
    private String roomNumber;
    private String startTime;  // e.g. "09:00 AM"
    private String endTime;    // e.g. "10:00 AM"
    private String type;       // "Lecture", "Lab", "Tutorial"
    private String color;      // Accent color code for UI

    public TimeTableSlot() {}

    public TimeTableSlot(String id, String dayOfWeek, String subjectCode, String subjectName,
                         String faculty, String roomNumber, String startTime, String endTime,
                         String type, String color) {
        this.id = id;
        this.dayOfWeek = dayOfWeek;
        this.subjectCode = subjectCode;
        this.subjectName = subjectName;
        this.faculty = faculty;
        this.roomNumber = roomNumber;
        this.startTime = startTime;
        this.endTime = endTime;
        this.type = type;
        this.color = color;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getDayOfWeek() { return dayOfWeek; }
    public void setDayOfWeek(String dayOfWeek) { this.dayOfWeek = dayOfWeek; }

    public String getSubjectCode() { return subjectCode; }
    public void setSubjectCode(String subjectCode) { this.subjectCode = subjectCode; }

    public String getSubjectName() { return subjectName; }
    public void setSubjectName(String subjectName) { this.subjectName = subjectName; }

    public String getFaculty() { return faculty; }
    public void setFaculty(String faculty) { this.faculty = faculty; }

    public String getRoomNumber() { return roomNumber; }
    public void setRoomNumber(String roomNumber) { this.roomNumber = roomNumber; }

    public String getStartTime() { return startTime; }
    public void setStartTime(String startTime) { this.startTime = startTime; }

    public String getEndTime() { return endTime; }
    public void setEndTime(String endTime) { this.endTime = endTime; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }
}
