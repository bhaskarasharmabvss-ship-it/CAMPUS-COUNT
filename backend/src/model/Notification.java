package model;

public class Notification {
    private String id;
    private String title;
    private String description;
    private String category;    // "College", "Attendance", "Exams", "Results", "Assignments", "General"
    private String timestamp;
    private boolean isRead;
    private String iconType;
    private String actionUrl;

    public Notification() {}

    public Notification(String id, String title, String description, String category,
                        String timestamp, boolean isRead, String iconType, String actionUrl) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.category = category;
        this.timestamp = timestamp;
        this.isRead = isRead;
        this.iconType = iconType;
        this.actionUrl = actionUrl;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getTimestamp() { return timestamp; }
    public void setTimestamp(String timestamp) { this.timestamp = timestamp; }

    public boolean isRead() { return isRead; }
    public void setRead(boolean read) { isRead = read; }

    public String getIconType() { return iconType; }
    public void setIconType(String iconType) { this.iconType = iconType; }

    public String getActionUrl() { return actionUrl; }
    public void setActionUrl(String actionUrl) { this.actionUrl = actionUrl; }
}
