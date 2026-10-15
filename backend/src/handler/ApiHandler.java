package handler;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import model.*;
import repository.DataRepository;
import util.JsonUtil;

import java.io.*;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.util.*;

public class ApiHandler implements HttpHandler {
    private final DataRepository repo = DataRepository.getInstance();

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        String method = exchange.getRequestMethod().toUpperCase();
        URI uri = exchange.getRequestURI();
        String path = uri.getPath();

        // Handle CORS Preflight
        if ("OPTIONS".equals(method)) {
            sendCorsHeaders(exchange, 204, -1);
            exchange.close();
            return;
        }

        try {
            // --- Authentication ---
            if (path.equals("/api/auth/login") && "POST".equals(method)) {
                String body = readRequestBody(exchange);
                Map<String, String> data = JsonUtil.parseSimpleJson(body);
                String email = data.getOrDefault("email", data.get("username"));
                String pass = data.get("password");
                String role = data.get("role");
                System.out.println("DEBUG login: body=[" + body + "] data=[" + data + "] email=[" + email + "] role=[" + role + "]");
                Map<String, Object> authResp = repo.authenticate(email, pass, role);
                int statusCode = Boolean.TRUE.equals(authResp.get("success")) ? 200 : 401;
                sendJsonResponse(exchange, statusCode, JsonUtil.toJson(authResp));
            } else if ((path.equals("/api/auth/register") || path.equals("/api/student/register")) && "POST".equals(method)) {
                String body = readRequestBody(exchange);
                Map<String, String> data = JsonUtil.parseSimpleJson(body);
                Student s = repo.registerStudent(
                    data.get("name"),
                    data.get("rollNumber"),
                    data.get("email"),
                    data.get("phone"),
                    data.get("department"),
                    data.get("course"),
                    data.get("year"),
                    data.get("semester"),
                    data.get("section"),
                    data.get("password"),
                    data.get("guardianName"),
                    data.get("guardianPhone"),
                    data.get("address")
                );
                Map<String, Object> resp = new HashMap<>();
                resp.put("success", true);
                resp.put("message", "Student self-registration completed successfully! Welcome, " + s.getName());
                resp.put("student", s);
                sendJsonResponse(exchange, 201, JsonUtil.toJson(resp));
            } else if (path.equals("/api/attendance/qr/generate") && ("POST".equals(method) || "GET".equals(method))) {
                String subCode = "CS601";
                String period = "Period 2 (10:00 - 11:00 AM)";
                String dateStr = "";
                if ("POST".equals(method)) {
                    String body = readRequestBody(exchange);
                    Map<String, String> data = JsonUtil.parseSimpleJson(body);
                    subCode = data.getOrDefault("subjectCode", "CS601");
                    period = data.getOrDefault("period", "Period 2 (10:00 - 11:00 AM)");
                    dateStr = data.getOrDefault("date", "");
                }
                Map<String, Object> session = repo.generateAttendanceQr(subCode, period, dateStr);
                sendJsonResponse(exchange, 200, JsonUtil.toJson(session));
            } else if (path.equals("/api/attendance/qr/scan") && "POST".equals(method)) {
                String body = readRequestBody(exchange);
                Map<String, String> data = JsonUtil.parseSimpleJson(body);
                String qrData = data.get("qrData");
                if (qrData == null) qrData = data.get("qrPayload");
                if (qrData == null) qrData = data.get("qrCode");
                if (qrData == null) qrData = data.get("token");
                String roll = data.get("rollNumber");
                String name = data.get("studentName");
                Map<String, Object> resp = repo.markAttendanceViaQr(qrData, roll, name);
                sendJsonResponse(exchange, 200, JsonUtil.toJson(resp));
            } else if (path.equals("/api/auth/me") && "GET".equals(method)) {
                String query = uri.getQuery();
                if (query != null && query.contains("role=admin")) {
                    sendJsonResponse(exchange, 200, JsonUtil.toJson(repo.getAdmin()));
                } else {
                    sendJsonResponse(exchange, 200, JsonUtil.toJson(repo.getStudent()));
                }
            } else if (path.equals("/api/student") && "GET".equals(method)) {
                sendJsonResponse(exchange, 200, JsonUtil.toJson(repo.getStudent()));
            } else if (path.equals("/api/student/update") && "POST".equals(method)) {
                String body = readRequestBody(exchange);
                Map<String, String> data = JsonUtil.parseSimpleJson(body);
                repo.updateStudent(data.get("phone"), data.get("email"), data.get("address"), data.get("guardianPhone"));
                Map<String, Object> resp = new HashMap<>();
                resp.put("success", true);
                resp.put("message", "Profile updated successfully");
                resp.put("student", repo.getStudent());
                sendJsonResponse(exchange, 200, JsonUtil.toJson(resp));
            } else if (path.equals("/api/attendance") && "GET".equals(method)) {
                Map<String, Object> resp = new HashMap<>();
                resp.put("summary", repo.getAttendanceSummary());
                resp.put("subjects", repo.getSubjects());
                sendJsonResponse(exchange, 200, JsonUtil.toJson(resp));
            } else if (path.equals("/api/attendance/logs") && "GET".equals(method)) {
                sendJsonResponse(exchange, 200, JsonUtil.toJson(repo.getAttendanceRecords()));
            } else if (path.equals("/api/attendance/calendar") && "GET".equals(method)) {
                sendJsonResponse(exchange, 200, getCalendarDataJson());
            } else if (path.equals("/api/timetable") && "GET".equals(method)) {
                sendJsonResponse(exchange, 200, JsonUtil.toJson(repo.getTimeTableSlots()));
            } else if (path.equals("/api/results") && "GET".equals(method)) {
                Map<String, Object> resp = new HashMap<>();
                resp.put("currentSgpa", 9.25);
                resp.put("currentCgpa", 8.92);
                resp.put("totalCreditsEarned", 132);
                resp.put("degreeTotalCredits", 160);
                resp.put("semesterResults", repo.getSemesterResults());
                sendJsonResponse(exchange, 200, JsonUtil.toJson(resp));
            } else if (path.equals("/api/leave") && "GET".equals(method)) {
                Map<String, Object> resp = new HashMap<>();
                resp.put("balances", repo.getLeaveBalance());
                resp.put("requests", repo.getLeaveRequests());
                sendJsonResponse(exchange, 200, JsonUtil.toJson(resp));
            } else if (path.equals("/api/leave") && "POST".equals(method)) {
                String body = readRequestBody(exchange);
                Map<String, String> data = JsonUtil.parseSimpleJson(body);
                String leaveType = data.getOrDefault("leaveType", "Casual Leave");
                String fromDate = data.getOrDefault("fromDate", "2026-10-14");
                String toDate = data.getOrDefault("toDate", "2026-10-15");
                int days = 1;
                try {
                    days = Integer.parseInt(data.getOrDefault("numberOfDays", "1"));
                } catch (NumberFormatException ignored) {}
                String reason = data.getOrDefault("reason", "Personal reasons");
                String doc = data.getOrDefault("documentName", "leave_doc.pdf");

                LeaveRequest req = repo.addLeaveRequest(leaveType, fromDate, toDate, days, reason, doc);
                Map<String, Object> resp = new HashMap<>();
                resp.put("success", true);
                resp.put("message", "Leave application submitted successfully for review by Provost Bhaskara Sharma");
                resp.put("leaveRequest", req);
                resp.put("balances", repo.getLeaveBalance());
                sendJsonResponse(exchange, 201, JsonUtil.toJson(resp));
            } else if (path.equals("/api/assignments") && "GET".equals(method)) {
                sendJsonResponse(exchange, 200, JsonUtil.toJson(repo.getAssignments()));
            } else if (path.equals("/api/assignments/submit") && "POST".equals(method)) {
                String body = readRequestBody(exchange);
                Map<String, String> data = JsonUtil.parseSimpleJson(body);
                String assignmentId = data.get("assignmentId");
                String fileName = data.getOrDefault("fileName", "submission.zip");
                boolean success = repo.submitAssignment(assignmentId, fileName);
                Map<String, Object> resp = new HashMap<>();
                resp.put("success", success);
                resp.put("message", success ? "Assignment submitted successfully!" : "Assignment not found");
                resp.put("assignments", repo.getAssignments());
                sendJsonResponse(exchange, success ? 200 : 404, JsonUtil.toJson(resp));
            } else if (path.equals("/api/subjects") && "GET".equals(method)) {
                sendJsonResponse(exchange, 200, JsonUtil.toJson(repo.getSubjects()));
            } else if (path.equals("/api/holidays") && "GET".equals(method)) {
                sendJsonResponse(exchange, 200, JsonUtil.toJson(repo.getHolidays()));
            } else if (path.equals("/api/notifications") && "GET".equals(method)) {
                sendJsonResponse(exchange, 200, JsonUtil.toJson(repo.getNotifications()));
            } else if (path.equals("/api/notifications/read") && "POST".equals(method)) {
                repo.markAllNotificationsRead();
                Map<String, Object> resp = new HashMap<>();
                resp.put("success", true);
                resp.put("message", "All notifications marked as read");
                resp.put("notifications", repo.getNotifications());
                sendJsonResponse(exchange, 200, JsonUtil.toJson(resp));
            }
            // --- Dedicated Administrator Endpoints ---
            else if (path.equals("/api/admin/leave/action") && "POST".equals(method)) {
                String body = readRequestBody(exchange);
                Map<String, String> data = JsonUtil.parseSimpleJson(body);
                String reqId = data.get("requestId");
                String status = data.getOrDefault("status", "Approved");
                String remarks = data.get("remarks");
                boolean success = repo.actionLeave(reqId, status, remarks);
                Map<String, Object> resp = new HashMap<>();
                resp.put("success", success);
                resp.put("message", success ? "Leave application " + status.toLowerCase() + " by Chief Administrator Bhaskara Sharma" : "Request ID not found");
                resp.put("requests", repo.getLeaveRequests());
                resp.put("balances", repo.getLeaveBalance());
                sendJsonResponse(exchange, success ? 200 : 404, JsonUtil.toJson(resp));
            } else if (path.equals("/api/admin/attendance/mark") && "POST".equals(method)) {
                String body = readRequestBody(exchange);
                Map<String, String> data = JsonUtil.parseSimpleJson(body);
                String subCode = data.get("subjectCode");
                String status = data.getOrDefault("status", "Present");
                String remarks = data.get("remarks");
                boolean success = repo.markAttendanceForSubject(subCode, status, remarks);
                Map<String, Object> resp = new HashMap<>();
                resp.put("success", success);
                resp.put("message", success ? "Attendance successfully recorded (" + status + ") for " + subCode : "Subject not found");
                resp.put("summary", repo.getAttendanceSummary());
                resp.put("subjects", repo.getSubjects());
                resp.put("records", repo.getAttendanceRecords());
                sendJsonResponse(exchange, success ? 200 : 404, JsonUtil.toJson(resp));
            } else if (path.equals("/api/admin/notifications/broadcast") && "POST".equals(method)) {
                String body = readRequestBody(exchange);
                Map<String, String> data = JsonUtil.parseSimpleJson(body);
                String title = data.getOrDefault("title", "Official University Circular");
                String desc = data.getOrDefault("description", "Issued by Campus Administrator Bhaskara Sharma");
                String cat = data.getOrDefault("category", "College");
                Notification n = repo.broadcastNotice(title, desc, cat, "#notifications");
                Map<String, Object> resp = new HashMap<>();
                resp.put("success", true);
                resp.put("message", "Official announcement broadcasted to all enrolled students");
                resp.put("notification", n);
                resp.put("notifications", repo.getNotifications());
                sendJsonResponse(exchange, 201, JsonUtil.toJson(resp));
            } else if (path.equals("/api/admin/students") && "GET".equals(method)) {
                sendJsonResponse(exchange, 200, JsonUtil.toJson(repo.getAllStudents()));
            } else if (path.equals("/api/admin/students/add") && "POST".equals(method)) {
                String body = readRequestBody(exchange);
                Map<String, String> data = JsonUtil.parseSimpleJson(body);
                Student s = repo.addStudent(
                    data.get("name"),
                    data.get("rollNumber"),
                    data.get("email"),
                    data.get("phone"),
                    data.get("department"),
                    data.get("course"),
                    data.get("year"),
                    data.get("semester"),
                    data.get("section"),
                    data.get("bloodGroup"),
                    data.get("guardianName"),
                    data.get("guardianPhone"),
                    data.get("address")
                );
                Map<String, Object> resp = new HashMap<>();
                resp.put("success", true);
                resp.put("message", "Student successfully registered in university database");
                resp.put("student", s);
                resp.put("students", repo.getAllStudents());
                sendJsonResponse(exchange, 201, JsonUtil.toJson(resp));
            } else if (path.equals("/api/admin/students/delete") && "POST".equals(method)) {
                String body = readRequestBody(exchange);
                Map<String, String> data = JsonUtil.parseSimpleJson(body);
                boolean success = repo.deleteStudent(data.get("id"));
                Map<String, Object> resp = new HashMap<>();
                resp.put("success", success);
                resp.put("message", success ? "Student record archived successfully" : "Student ID not found");
                resp.put("students", repo.getAllStudents());
                sendJsonResponse(exchange, success ? 200 : 404, JsonUtil.toJson(resp));
            } else if (path.equals("/api/teachers") && "GET".equals(method) || path.equals("/api/admin/teachers") && "GET".equals(method)) {
                sendJsonResponse(exchange, 200, JsonUtil.toJson(repo.getTeachers()));
            } else if (path.equals("/api/admin/teachers/add") && "POST".equals(method)) {
                String body = readRequestBody(exchange);
                Map<String, String> data = JsonUtil.parseSimpleJson(body);
                String sub = data.getOrDefault("subject", "CS601");
                String cls = data.getOrDefault("classSection", "B.Tech CSE - Section B");
                Teacher t = repo.addTeacher(
                    data.get("name"),
                    data.get("email"),
                    data.get("phone"),
                    data.get("department"),
                    data.get("designation"),
                    Arrays.asList(sub),
                    Arrays.asList(cls)
                );
                Map<String, Object> resp = new HashMap<>();
                resp.put("success", true);
                resp.put("message", "Faculty member added successfully to Department Roster");
                resp.put("teacher", t);
                resp.put("teachers", repo.getTeachers());
                sendJsonResponse(exchange, 201, JsonUtil.toJson(resp));
            } else if (path.equals("/api/admin/teachers/delete") && "POST".equals(method)) {
                String body = readRequestBody(exchange);
                Map<String, String> data = JsonUtil.parseSimpleJson(body);
                boolean success = repo.deleteTeacher(data.get("id"));
                Map<String, Object> resp = new HashMap<>();
                resp.put("success", success);
                resp.put("message", success ? "Faculty profile deactivated" : "Teacher ID not found");
                resp.put("teachers", repo.getTeachers());
                sendJsonResponse(exchange, success ? 200 : 404, JsonUtil.toJson(resp));
            } else if (path.equals("/api/teacher/attendance/submit") && "POST".equals(method)) {
                String body = readRequestBody(exchange);
                Map<String, String> data = JsonUtil.parseSimpleJson(body);
                int total = 6;
                int present = 6;
                int absent = 0;
                int late = 0;
                try {
                    total = Integer.parseInt(data.getOrDefault("totalStudents", "6"));
                    present = Integer.parseInt(data.getOrDefault("presentCount", "6"));
                    absent = Integer.parseInt(data.getOrDefault("absentCount", "0"));
                    late = Integer.parseInt(data.getOrDefault("lateCount", "0"));
                } catch (Exception ignored) {}

                AttendanceSession session = new AttendanceSession(
                    "SES-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase(),
                    data.getOrDefault("date", "2026-10-13"),
                    data.getOrDefault("period", "Period 1 (09:00 - 10:00)"),
                    data.getOrDefault("classSection", "B.Tech CSE - Section B"),
                    data.getOrDefault("subjectCode", "CS601"),
                    data.getOrDefault("subjectName", "Distributed Systems"),
                    data.getOrDefault("teacherId", "TCH-001"),
                    data.getOrDefault("teacherName", "Dr. Vikram Sen"),
                    total,
                    present,
                    absent,
                    late,
                    data.getOrDefault("status", "SUBMITTED"),
                    new java.text.SimpleDateFormat("yyyy-MM-dd hh:mm a").format(new Date()),
                    null
                );
                repo.submitAttendanceSession(session);

                Map<String, Object> resp = new HashMap<>();
                resp.put("success", true);
                resp.put("message", "Attendance session successfully submitted & locked into institutional ledger!");
                resp.put("session", session);
                resp.put("sessions", repo.getAttendanceSessions());
                sendJsonResponse(exchange, 201, JsonUtil.toJson(resp));
            } else if (path.equals("/api/teacher/attendance/history") && "GET".equals(method)) {
                sendJsonResponse(exchange, 200, JsonUtil.toJson(repo.getAttendanceSessions()));
            } else if (path.equals("/api/admin/timetable/add") && "POST".equals(method)) {
                String body = readRequestBody(exchange);
                Map<String, String> data = JsonUtil.parseSimpleJson(body);
                TimeTableSlot slot = repo.addTimeTableSlot(
                    data.getOrDefault("day", "Monday"),
                    data.getOrDefault("startTime", "09:00 AM"),
                    data.getOrDefault("endTime", "10:00 AM"),
                    data.getOrDefault("subjectCode", "CS601"),
                    data.getOrDefault("subjectName", "Distributed Systems"),
                    data.getOrDefault("faculty", "Dr. Vikram Sen"),
                    data.getOrDefault("room", "Lab B-302"),
                    data.getOrDefault("type", "Theory")
                );
                Map<String, Object> resp = new HashMap<>();
                resp.put("success", true);
                resp.put("message", "Timetable slot added and published to student & teacher schedules");
                resp.put("slot", slot);
                resp.put("slots", repo.getTimeTableSlots());
                sendJsonResponse(exchange, 201, JsonUtil.toJson(resp));
            } else if (path.equals("/api/admin/timetable/delete") && "POST".equals(method)) {
                String body = readRequestBody(exchange);
                Map<String, String> data = JsonUtil.parseSimpleJson(body);
                boolean success = repo.deleteTimeTableSlot(data.get("id"));
                Map<String, Object> resp = new HashMap<>();
                resp.put("success", success);
                resp.put("message", success ? "Timetable slot removed" : "Slot ID not found");
                resp.put("slots", repo.getTimeTableSlots());
                sendJsonResponse(exchange, success ? 200 : 404, JsonUtil.toJson(resp));
            } else if (path.equals("/api/admin/subjects/add") && "POST".equals(method)) {
                String body = readRequestBody(exchange);
                Map<String, String> data = JsonUtil.parseSimpleJson(body);
                int credits = 3;
                try { credits = Integer.parseInt(data.getOrDefault("credits", "3")); } catch (Exception ignored) {}
                Subject s = repo.addSubject(data.get("code"), data.get("name"), data.get("faculty"), data.get("facultyEmail"), credits);
                Map<String, Object> resp = new HashMap<>();
                resp.put("success", true);
                resp.put("message", "Course successfully added to academic curriculum");
                resp.put("subject", s);
                resp.put("subjects", repo.getSubjects());
                sendJsonResponse(exchange, 201, JsonUtil.toJson(resp));
            } else {
                Map<String, String> err = new HashMap<>();
                err.put("error", "Endpoint not found: " + path);
                sendJsonResponse(exchange, 404, JsonUtil.toJson(err));
            }
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, String> err = new HashMap<>();
            err.put("error", "Internal server error: " + e.getMessage());
            sendJsonResponse(exchange, 500, JsonUtil.toJson(err));
        }
    }

    private String getCalendarDataJson() {
        Map<String, Object> cal = new HashMap<>();
        cal.put("year", 2026);
        cal.put("month", 10);
        cal.put("monthName", "October");

        Map<String, Object> days = new LinkedHashMap<>();
        for (int day = 1; day <= 31; day++) {
            String dateStr = String.format("2026-10-%02d", day);
            int dayOfWeek = (day + 3) % 7; // October 2026
            Map<String, Object> dayInfo = new HashMap<>();
            dayInfo.put("date", dateStr);
            dayInfo.put("day", day);

            if (dayOfWeek == 0) {
                dayInfo.put("status", "no-class");
                dayInfo.put("label", "Sunday - Weekend");
            } else if (day == 13) {
                dayInfo.put("status", "present");
                dayInfo.put("label", "Present (Today - 4/4 classes)");
            } else if (day == 2 || day == 20) {
                dayInfo.put("status", "no-class");
                dayInfo.put("label", "Official Holiday");
            } else if (day == 7 || day == 9) {
                dayInfo.put("status", "absent");
                dayInfo.put("label", "Absent (1 class missed)");
            } else if (day > 13) {
                dayInfo.put("status", "upcoming");
                dayInfo.put("label", "Scheduled Session");
            } else {
                dayInfo.put("status", "present");
                dayInfo.put("label", "Present (All classes)");
            }
            days.put(String.valueOf(day), dayInfo);
        }
        cal.put("days", days);
        return JsonUtil.toJson(cal);
    }

    private void sendJsonResponse(HttpExchange exchange, int statusCode, String json) throws IOException {
        byte[] bytes = json.getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().set("Content-Type", "application/json; charset=UTF-8");
        sendCorsHeaders(exchange, statusCode, bytes.length);
        OutputStream os = exchange.getResponseBody();
        os.write(bytes);
        os.close();
    }

    private void sendCorsHeaders(HttpExchange exchange, int statusCode, long responseLength) throws IOException {
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type, Authorization");
        exchange.sendResponseHeaders(statusCode, responseLength);
    }

    private String readRequestBody(HttpExchange exchange) throws IOException {
        InputStream is = exchange.getRequestBody();
        BufferedReader reader = new BufferedReader(new InputStreamReader(is, StandardCharsets.UTF_8));
        StringBuilder sb = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) {
            sb.append(line);
        }
        return sb.toString();
    }
}
