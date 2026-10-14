package model;

import java.util.ArrayList;
import java.util.List;

public class Teacher {
    private String id;
    private String name;
    private String email;
    private String phone;
    private String department;
    private String designation;
    private List<String> subjects;
    private List<String> assignedClasses;
    private boolean active;
    private String avatarUrl;

    public Teacher() {
        this.subjects = new ArrayList<>();
        this.assignedClasses = new ArrayList<>();
        this.active = true;
    }

    public Teacher(String id, String name, String email, String phone, String department, String designation, List<String> subjects, List<String> assignedClasses, boolean active, String avatarUrl) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.department = department;
        this.designation = designation;
        this.subjects = subjects != null ? subjects : new ArrayList<>();
        this.assignedClasses = assignedClasses != null ? assignedClasses : new ArrayList<>();
        this.active = active;
        this.avatarUrl = avatarUrl != null ? avatarUrl : "";
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getDesignation() { return designation; }
    public void setDesignation(String designation) { this.designation = designation; }

    public List<String> getSubjects() { return subjects; }
    public void setSubjects(List<String> subjects) { this.subjects = subjects; }

    public List<String> getAssignedClasses() { return assignedClasses; }
    public void setAssignedClasses(List<String> assignedClasses) { this.assignedClasses = assignedClasses; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
}
