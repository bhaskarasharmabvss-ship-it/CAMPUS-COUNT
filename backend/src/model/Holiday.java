package model;

public class Holiday {
    private String id;
    private String title;
    private String date;         // YYYY-MM-DD
    private String endDate;      // optional
    private String type;         // "Public Holiday", "College Holiday", "Semester Break", "Exam", "Event"
    private String description;
    private int daysRemaining;

    public Holiday() {}

    public Holiday(String id, String title, String date, String endDate, String type, String description, int daysRemaining) {
        this.id = id;
        this.title = title;
        this.date = date;
        this.endDate = endDate;
        this.type = type;
        this.description = description;
        this.daysRemaining = daysRemaining;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getEndDate() { return endDate; }
    public void setEndDate(String endDate) { this.endDate = endDate; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public int getDaysRemaining() { return daysRemaining; }
    public void setDaysRemaining(int daysRemaining) { this.daysRemaining = daysRemaining; }
}
