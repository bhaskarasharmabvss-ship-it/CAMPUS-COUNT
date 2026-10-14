# Attendify 3D — Smart Campus Management System

> **A high-end, 3D-accelerated student attendance and timetable orchestration platform with dedicated, role-segregated portals for Administrators, Teachers, and Students.**

---

## 🌟 Key Highlights

- **Three-Tier Role Architecture**: Separate and isolated workflows for Provost Administrators, Teaching Faculty, and Enrolled Students with zero permission leakage.
- **Three.js 3D Visual Centerpiece**: Interactive, mouse-reactive 3D academic crystal hologram with gyroscopic orbital rings.
- **Faculty Attendance Studio**: Period-by-period roll calls with live counters, Present/Absent/Late toggle controls, bulk marking, draft saves, and validated submissions.
- **Timetable Conflict Orchestrator**: Automated schedule conflict engine preventing overlapping periods for the same class or professor.
- **Student Academic Dossier**: Animated biometric attendance gauge, autonomous 75% shortage warnings, interactive attendance recovery simulator, and official examination hall tickets with barcodes.
- **Zero External Frontend Dependencies**: Pure Vanilla HTML5, CSS3 Glassmorphism tokens, and ES6+ JavaScript.

---

## 🔐 Credentials & Access Stations

| Portal Role | Authorized Identifier | Password | Access Highlights |
| :--- | :--- | :--- | :--- |
| **Provost Administrator** | `bhaskarasharmabvss@gmail.com` | `252629` | Full campus overview, student registry CRUD, faculty directory CRUD, timetable orchestrator, CSV export |
| **Teaching Faculty** | `teacher@attendify.edu` | `teacher123` | Period attendance studio, enrolled class rosters, draft sessions, submission history |
| **Enrolled Student** | `22CS1084` *(Aarav Sharma)* | `student123` | Biometric gauge, 75% shortage alerts, timetable, examination hall ticket |

---

## 🚀 Quick Start Guide

### Prerequisites
- **Java SE Development Kit (JDK 8 or later)**
- Any modern web browser (Chrome, Edge, Firefox, Safari)

### Run the Application

#### Option A: One-Click Startup Script (Windows)
Double-click `run.bat` or run in PowerShell:
```powershell
.\run.ps1
```

#### Option B: Manual Command
Compile backend:
```bash
javac -d "backend/bin" backend/src/**/*.java
```
Start server:
```bash
java -cp "backend/bin" Main 8080
```

Open your browser at:
- **Landing Page:** [http://localhost:8080/#landing](http://localhost:8080/#landing)
- **Direct App:** [http://localhost:8080/](http://localhost:8080/)

---

## 📂 Project Structure

```
├── backend/
│   ├── src/
│   │   ├── handler/
│   │   │   ├── ApiHandler.java          # REST API Router & JSON endpoints
│   │   │   └── StaticFileHandler.java   # HTTP asset server
│   │   ├── model/
│   │   │   ├── Admin.java
│   │   │   ├── AttendanceRecord.java
│   │   │   ├── AttendanceSession.java   # Faculty roll call session model
│   │   │   ├── Notification.java
│   │   │   ├── Student.java
│   │   │   ├── Subject.java
│   │   │   ├── Teacher.java             # Faculty profile model
│   │   │   └── TimeTableSlot.java
│   │   ├── repository/
│   │   │   └── DataRepository.java      # In-memory persistence & seed records
│   │   └── util/
│   │       └── JsonUtil.java            # Lightweight JSON serializer/deserializer
│   └── Main.java                        # HttpServer entry point
├── frontend/
│   ├── assets/                          # SVG brand vectors
│   ├── css/
│   │   ├── style.css                    # Liquid Obsidian/Quartz design tokens
│   │   ├── components.css               # Glassmorphic cards, modals & 3D hero
│   │   └── responsive.css               # Mobile/tablet breakpoints
│   ├── js/
│   │   ├── api.js                       # Client API gateway with fallbacks
│   │   ├── app.js                       # Role routing & UI orchestration
│   │   ├── attendance.js                # Attendance logs & filters
│   │   ├── charts.js                    # Dynamic SVG attendance gauges
│   │   └── three-hero.js                # Three.js 3D crystal canvas
│   └── index.html                       # Master single-page app
├── index.html                           # Root mirror for direct opens
├── run.bat                              # Windows batch launch script
├── run.ps1                              # PowerShell launch script
└── README.md
```

---

## 🛡️ License
Autonomous Campus Management Platform. Institutional Academic License 2026.
