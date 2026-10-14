package model;

public class Student {
    private String id;
    private String name;
    private String rollNumber;
    private String email;
    private String phone;
    private String department;
    private String course;
    private String year;
    private String semester;
    private String section;
    private String academicYear;
    private String avatarUrl;
    private String dob;
    private String bloodGroup;
    private String guardianName;
    private String guardianPhone;
    private String address;

    public Student() {}

    public Student(String id, String name, String rollNumber, String email, String phone,
                   String department, String course, String year, String semester,
                   String section, String academicYear, String avatarUrl, String dob,
                   String bloodGroup, String guardianName, String guardianPhone, String address) {
        this.id = id;
        this.name = name;
        this.rollNumber = rollNumber;
        this.email = email;
        this.phone = phone;
        this.department = department;
        this.course = course;
        this.year = year;
        this.semester = semester;
        this.section = section;
        this.academicYear = academicYear;
        this.avatarUrl = avatarUrl;
        this.dob = dob;
        this.bloodGroup = bloodGroup;
        this.guardianName = guardianName;
        this.guardianPhone = guardianPhone;
        this.address = address;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getRollNumber() { return rollNumber; }
    public void setRollNumber(String rollNumber) { this.rollNumber = rollNumber; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getCourse() { return course; }
    public void setCourse(String course) { this.course = course; }

    public String getYear() { return year; }
    public void setYear(String year) { this.year = year; }

    public String getSemester() { return semester; }
    public void setSemester(String semester) { this.semester = semester; }

    public String getSection() { return section; }
    public void setSection(String section) { this.section = section; }

    public String getAcademicYear() { return academicYear; }
    public void setAcademicYear(String academicYear) { this.academicYear = academicYear; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public String getDob() { return dob; }
    public void setDob(String dob) { this.dob = dob; }

    public String getBloodGroup() { return bloodGroup; }
    public void setBloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; }

    public String getGuardianName() { return guardianName; }
    public void setGuardianName(String guardianName) { this.guardianName = guardianName; }

    public String getGuardianPhone() { return guardianPhone; }
    public void setGuardianPhone(String guardianPhone) { this.guardianPhone = guardianPhone; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
}
