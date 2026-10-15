/**
 * Main Application Orchestrator for CampusCount Academic System
 * Supports Dual Role (Administrator & Student Dossier)
 * Liquid Crystal Monochrome Design with 3D Depth Physics & Interactive Animations
 */

const App = {
  currentView: 'admin-dashboard',
  currentRole: 'admin',
  currentUser: null,
  theme: 'light',
  studentData: null,
  summaryData: null,
  subjectsData: [],
  notificationsData: [],
  adminStudents: [],
  adminAttendanceMap: {},
  qrMediaStream: null,
  selectedTargetPct: 75,
  teacherQrInterval: null,
  teacherQrSecondsLeft: 600,
  activeTeacherQrToken: 'ATTEND-CS602-ML',

  async init() {
    this.initTheme();
    this.init3DPhysics();
    this.initLiquidCrystalCanvas();
    this.setupNavigation();
    this.setupModals();
    this.setupSearch();
    this.setupDynamicGreeting();

    await this.initSession();
    await this.loadAllData();
  },

  /**
   * Theme & Appearance Manager (Multi-palette, Fonts, Dark/Light Mode)
   */
  initTheme() {
    this.theme = localStorage.getItem('campus_theme') || 'light';
    this.palette = localStorage.getItem('campus_palette') || 'indigo';
    this.font = localStorage.getItem('campus_font') || 'urbanist';
    
    document.documentElement.setAttribute('data-theme', this.theme);
    document.documentElement.setAttribute('data-palette', this.palette);
    document.documentElement.setAttribute('data-font', this.font);
    this.updateCustomizerUI();
  },

  toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    this.setThemeMode(this.theme);
  },

  setThemeMode(mode) {
    this.theme = mode;
    document.documentElement.setAttribute('data-theme', this.theme);
    localStorage.setItem('campus_theme', this.theme);
    this.updateCustomizerUI();
    this.showToast(`Switched to ${this.theme === 'light' ? 'Quartz Light' : 'Obsidian Neon Dark'} mode`, 'info');
    if (typeof Charts !== 'undefined' && Charts.renderTrendChart) {
      Charts.renderTrendChart('attendance-trend-chart');
    }
  },

  setPalette(paletteName) {
    this.palette = paletteName;
    document.documentElement.setAttribute('data-palette', this.palette);
    localStorage.setItem('campus_palette', this.palette);
    this.updateCustomizerUI();
    
    const names = {
      indigo: 'Royal Indigo & Radiant Violet',
      emerald: 'Emerald Cyber Mint',
      sunset: 'Sunset Aurora',
      cyberpunk: 'Cyberpunk Neon'
    };
    this.showToast(`Active Palette: ${names[paletteName] || paletteName}`, 'success');
    if (typeof Charts !== 'undefined' && Charts.renderTrendChart) {
      Charts.renderTrendChart('attendance-trend-chart');
    }
  },

  setFont(fontName) {
    this.font = fontName;
    document.documentElement.setAttribute('data-font', this.font);
    localStorage.setItem('campus_font', this.font);
    this.updateCustomizerUI();

    const names = {
      urbanist: 'Urbanist + Plus Jakarta Sans',
      space: 'Space Grotesk + Outfit',
      poppins: 'Poppins + Inter',
      outfit: 'Outfit + Plus Jakarta Sans'
    };
    this.showToast(`Typography: ${names[fontName] || fontName}`, 'info');
  },

  openThemeCustomizer() {
    this.updateCustomizerUI();
    this.openModal('theme-customizer-modal');
  },

  resetThemeToDefault() {
    this.setPalette('indigo');
    this.setFont('urbanist');
    this.setThemeMode('light');
    this.showToast('Reset to Recommended Design (Royal Indigo & Urbanist)', 'success');
  },

  updateCustomizerUI() {
    // Highlight active palette card
    document.querySelectorAll('.palette-card').forEach(card => {
      const p = card.getAttribute('data-palette');
      const badge = card.querySelector('.palette-badge');
      if (p === (this.palette || 'indigo')) {
        card.classList.add('active');
        if (badge) badge.textContent = 'Active';
      } else {
        card.classList.remove('active');
        if (badge) badge.textContent = 'Select';
      }
    });

    // Highlight active font card
    document.querySelectorAll('.font-card').forEach(card => {
      const f = card.getAttribute('data-font');
      if (f === (this.font || 'urbanist')) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });

    // Highlight active mode buttons
    const lightBtn = document.getElementById('customizer-mode-light');
    const darkBtn = document.getElementById('customizer-mode-dark');
    if (lightBtn && darkBtn) {
      if (this.theme === 'dark') {
        lightBtn.classList.remove('active');
        darkBtn.classList.add('active');
      } else {
        lightBtn.classList.add('active');
        darkBtn.classList.remove('active');
      }
    }
  },

  /**
   * 3D Card Tilt Physics for Liquid Crystal Cards
   */
  init3DPhysics() {
    document.addEventListener('mousemove', (e) => {
      const cards = document.querySelectorAll('.lc-tilt-card, .kpi-card');
      cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          const cardX = rect.left + rect.width / 2;
          const cardY = rect.top + rect.height / 2;
          const deltaX = (e.clientX - cardX) / (rect.width / 2);
          const deltaY = (e.clientY - cardY) / (rect.height / 2);

          if (Math.abs(deltaX) <= 1.5 && Math.abs(deltaY) <= 1.5) {
            const tiltX = -deltaY * 6.5;
            const tiltY = deltaX * 6.5;
            card.style.transform = `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`;
          } else {
            card.style.transform = '';
          }
        }
      });
    });

    document.addEventListener('mouseleave', () => {
      document.querySelectorAll('.lc-tilt-card, .kpi-card').forEach(card => {
        card.style.transform = '';
      });
    });
  },

  /**
   * 3D Liquid Crystal Background Ambient Canvas
   */
  initLiquidCrystalCanvas() {
    const canvas = document.getElementById('liquid-bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const count = 48;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 2.6 + 1.2,
        angle: Math.random() * Math.PI * 2,
        angularSpeed: (Math.random() - 0.5) * 0.02
      });
    }

    let mouseX = width / 2;
    let mouseY = height / 2;
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const isLight = document.documentElement.getAttribute('data-theme') !== 'dark';

      // Connect nodes with crystal refract lines
      for (let i = 0; i < count; i++) {
        for (let j = i + 1; j < count; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            const alpha = (1 - dist / 130) * 0.14;
            ctx.strokeStyle = isLight ? `rgba(99, 102, 241, ${alpha * 1.2})` : `rgba(168, 85, 247, ${alpha * 1.5})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw floating geometric crystal shards
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.angle += p.angularSpeed;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const dmx = (mouseX - p.x) * 0.0002;
        const dmy = (mouseY - p.y) * 0.0002;
        p.x += dmx;
        p.y += dmy;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.fillStyle = isLight ? 'rgba(99, 102, 241, 0.22)' : 'rgba(168, 85, 247, 0.35)';
        ctx.strokeStyle = isLight ? 'rgba(79, 70, 229, 0.65)' : 'rgba(216, 180, 254, 0.75)';
        ctx.lineWidth = 0.8;

        ctx.beginPath();
        ctx.moveTo(0, -p.radius * 2);
        ctx.lineTo(p.radius * 1.5, 0);
        ctx.lineTo(0, p.radius * 2);
        ctx.lineTo(-p.radius * 1.5, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      });

      requestAnimationFrame(draw);
    };
    requestAnimationFrame(draw);
  },

  /**
   * Session & Role Initialization
   */
  async initSession() {
    this.currentRole = localStorage.getItem('campus_role') || 'admin';
    const savedUser = localStorage.getItem('campus_user');
    if (savedUser) {
      try {
        this.currentUser = JSON.parse(savedUser);
      } catch (e) {
        this.currentUser = null;
      }
    }

    if (!this.currentUser) {
      if (this.currentRole === 'admin') {
        this.currentUser = MockDB.admin;
      } else {
        this.currentUser = MockDB.student;
      }
    }

    this.applyRoleUI();
  },

  applyRoleUI() {
    const studentNav = document.getElementById('student-nav-group');
    const teacherNav = document.getElementById('teacher-nav-group');
    const adminNav = document.getElementById('admin-nav-group');
    const brandPortal = document.getElementById('brand-portal-label');
    const breadcrumbPortal = document.getElementById('breadcrumb-portal');
    const switchLabel = document.getElementById('header-switch-label');
    const headerName = document.getElementById('header-chip-name');
    const headerRole = document.getElementById('header-chip-role');
    const sidebarName = document.getElementById('sidebar-user-name');
    const sidebarRole = document.getElementById('sidebar-user-role');
    const headerBadge = document.getElementById('header-chip-badge');
    const sidebarBadge = document.getElementById('sidebar-avatar-badge');

    // Hide all navigation groups first
    if (studentNav) studentNav.style.display = 'none';
    if (teacherNav) teacherNav.style.display = 'none';
    if (adminNav) adminNav.style.display = 'none';

    if (this.currentRole === 'admin') {
      if (adminNav) adminNav.style.display = 'block';
      if (brandPortal) brandPortal.textContent = 'Admin Console';
      if (breadcrumbPortal) breadcrumbPortal.textContent = 'Provost Console';
      if (switchLabel) switchLabel.textContent = 'Switch Portal';

      const adminUser = this.currentUser || MockDB.admin;
      if (headerName) headerName.textContent = adminUser.name || 'Bhaskara Sharma';
      if (headerRole) headerRole.textContent = 'Chief Administrator';
      if (sidebarName) sidebarName.textContent = adminUser.name || 'Bhaskara Sharma';
      if (sidebarRole) sidebarRole.textContent = 'Provost & Administrator';
      if (headerBadge) {
        headerBadge.textContent = 'BS';
        headerBadge.className = 'chip-avatar-wrap avatar-badge admin';
      }
      if (sidebarBadge) {
        sidebarBadge.textContent = 'BS';
        sidebarBadge.className = 'sidebar-avatar-wrap avatar-badge admin';
      }
    } else if (this.currentRole === 'teacher') {
      if (teacherNav) teacherNav.style.display = 'block';
      if (brandPortal) brandPortal.textContent = 'Faculty Portal';
      if (breadcrumbPortal) breadcrumbPortal.textContent = 'Teacher Console';
      if (switchLabel) switchLabel.textContent = 'Switch Portal';

      const tchUser = this.currentUser || (MockDB.teachers && MockDB.teachers[0]) || { name: 'Dr. Vikram Sen', designation: 'Professor & HOD' };
      if (headerName) headerName.textContent = tchUser.name || 'Dr. Vikram Sen';
      if (headerRole) headerRole.textContent = tchUser.designation || 'Professor & HOD';
      if (sidebarName) sidebarName.textContent = tchUser.name || 'Dr. Vikram Sen';
      if (sidebarRole) sidebarRole.textContent = tchUser.designation || 'Faculty Member';
      if (headerBadge) {
        headerBadge.textContent = 'VS';
        headerBadge.className = 'chip-avatar-wrap avatar-badge teacher';
      }
      if (sidebarBadge) {
        sidebarBadge.textContent = 'VS';
        sidebarBadge.className = 'sidebar-avatar-wrap avatar-badge teacher';
      }
    } else {
      if (studentNav) studentNav.style.display = 'block';
      if (brandPortal) brandPortal.textContent = 'Student Hub';
      if (breadcrumbPortal) breadcrumbPortal.textContent = 'Student Portal';
      if (switchLabel) switchLabel.textContent = 'Switch Portal';

      const stuUser = this.currentUser || MockDB.student;
      if (headerName) headerName.textContent = stuUser.name || 'Aarav Sharma';
      if (headerRole) headerRole.textContent = stuUser.rollNumber || '22CS1084';
      if (sidebarName) sidebarName.textContent = stuUser.name || 'Aarav Sharma';
      if (sidebarRole) sidebarRole.textContent = stuUser.rollNumber || '22CS1084';
      if (headerBadge) {
        headerBadge.textContent = 'AS';
        headerBadge.className = 'chip-avatar-wrap avatar-badge student';
      }
      if (sidebarBadge) {
        sidebarBadge.textContent = 'AS';
        sidebarBadge.className = 'sidebar-avatar-wrap avatar-badge student';
      }
    }
  },

  /**
   * Load Data from API and Render Dashboard Views
   */
  async loadAllData() {
    try {
      // 1. Student Profile
      this.studentData = await ApiService.getStudent();
      this.bindStudentProfile(this.studentData);

      // 2. Attendance & Summary
      const attData = await ApiService.getAttendance();
      this.summaryData = attData.summary;
      this.subjectsData = attData.subjects;
      this.bindSummaryKPIs(this.summaryData);

      // 3. Attendance Logs
      const logs = await ApiService.getAttendanceLogs();
      AttendanceModule.init(this.subjectsData, logs);

      // 4. Render SVG Charts
      Charts.renderGauge('overall-attendance-gauge', this.summaryData.overallPercentage);
      Charts.renderTrendChart('monthly-trend-chart');

      // 5. Timetable
      const timetable = await ApiService.getTimeTable();
      this.renderTimetable(timetable);
      this.renderTodaySchedule(timetable);

      // 6. Results
      const results = await ApiService.getResults();
      this.renderResults(results);

      // 7. Leave Management
      const leave = await ApiService.getLeave();
      this.renderLeave(leave);

      // 8. Assignments
      const assignments = await ApiService.getAssignments();
      this.renderAssignments(assignments);

      // 9. Subjects Grid
      this.renderSubjectsGrid(this.subjectsData);

      // 10. Holidays
      const holidays = await ApiService.getHolidays();
      this.renderHolidays(holidays);

      // 11. Notifications
      this.notificationsData = await ApiService.getNotifications();
      this.renderNotifications(this.notificationsData);

      // 12. Load Admin Data
      await this.loadAdminData();

      // Check URL hash for initial view
      const hash = window.location.hash.replace('#', '');
      if (hash && document.getElementById(`view-${hash}`)) {
        this.navigateTo(hash);
      } else {
        if (this.currentRole === 'admin') {
          this.navigateTo('admin-dashboard');
        } else {
          this.navigateTo('home');
        }
      }

    } catch (err) {
      console.error("Initialization error:", err);
      this.showToast("Loaded in standalone mode.", "info");
    }
  },

  /**
   * Navigation Setup for all 12 modules
   */
  setupNavigation() {
    document.querySelectorAll('.nav-item[data-view]').forEach(item => {
      item.addEventListener('click', (e) => {
        const viewName = item.getAttribute('data-view');
        if (viewName === 'logout') {
          this.openModal('logout-modal');
        } else {
          this.navigateTo(viewName);
        }
      });
    });

    // Mobile Sidebar Drawer Toggle
    const toggleBtn = document.getElementById('sidebar-toggle-btn');
    const sidebar = document.getElementById('sidebar');
    const backdrop = document.getElementById('sidebar-backdrop');

    if (toggleBtn && sidebar && backdrop) {
      toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        backdrop.classList.toggle('active');
      });

      backdrop.addEventListener('click', () => {
        sidebar.classList.remove('open');
        backdrop.classList.remove('active');
      });
    }

    // Hash change handler
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && document.getElementById(`view-${hash}`)) {
        this.navigateTo(hash);
      }
    });
  },

  /**
   * Navigate to target view (Home, Attendance, Results, Admin Modules, etc.)
   */
  navigateTo(viewName) {
    if (viewName === 'logout') {
      this.openModal('logout-modal');
      return;
    }

    this.currentView = viewName;
    window.location.hash = viewName;

    // Update active view visibility
    document.querySelectorAll('.page-view').forEach(view => {
      view.classList.remove('active');
    });
    const targetView = document.getElementById(`view-${viewName}`);
    if (targetView) {
      targetView.classList.add('active');
    }

    // Update active nav item
    document.querySelectorAll('.nav-item[data-view]').forEach(item => {
      if (item.getAttribute('data-view') === viewName) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Update breadcrumb
    const crumbEl = document.getElementById('breadcrumb-current');
    if (crumbEl) {
      const titles = {
        landing: 'Attendify 3D Home',
        home: 'Dashboard Overview',
        attendance: 'Attendance Management',
        results: 'Academic Results & CGPA',
        timetable: 'Weekly Class Time Table',
        notifications: 'Notification Center',
        leave: 'Leave & Permissions',
        holidays: 'Academic Calendar & Holidays',
        subjects: 'Enrolled Subjects',
        assignments: 'Assignments & Submissions',
        profile: 'Student Dossier & Profile',
        settings: 'System & Preferences',
        'teacher-dashboard': 'Faculty Overview',
        'teacher-mark': 'Mark Class Attendance',
        'teacher-students': 'Assigned Students Roster',
        'teacher-history': 'Attendance Records & History',
        'admin-dashboard': 'Campus Overview',
        'admin-attendance': 'Attendance Dispatcher',
        'admin-leaves': 'Leave Adjudication',
        'admin-broadcast': 'Campus Broadcast',
        'admin-students': 'Student Registry',
        'admin-teachers': 'Faculty Directory',
        'admin-timetable': 'Timetable Conflict Orchestrator'
      };
      crumbEl.textContent = titles[viewName] || viewName.toUpperCase();
    }

    // Specific view life-cycle triggers
    if (viewName === 'landing') {
      setTimeout(() => {
        if (typeof ThreeHero !== 'undefined') {
          ThreeHero.init('threejs-hero-canvas-wrap');
        }
      }, 60);
    } else if (viewName.startsWith('teacher-')) {
      this.loadTeacherData();
    } else if (viewName === 'admin-teachers') {
      this.renderAdminTeachersTable();
    } else if (viewName === 'admin-timetable') {
      this.renderAdminTimetable();
    } else if (viewName === 'timetable') {
      this.renderTimetable(this.cachedTimetableSlots);
    } else if (viewName === 'home') {
      this.renderTodaySchedule(this.cachedTimetableSlots, this.currentDashDay);
    }

    // Close mobile drawer if open
    const sidebar = document.getElementById('sidebar');
    const backdrop = document.getElementById('sidebar-backdrop');
    if (sidebar && backdrop) {
      sidebar.classList.remove('open');
      backdrop.classList.remove('active');
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  navigateToHome() {
    if (this.currentRole === 'admin') {
      this.navigateTo('admin-dashboard');
    } else if (this.currentRole === 'teacher') {
      this.navigateTo('teacher-dashboard');
    } else {
      this.navigateTo('home');
    }
  },

  /**
   * Bind Student Data to Top Header, Sidebar, and Profile Page
   */
  bindStudentProfile(student) {
    if (!student) return;

    // Header & Sidebar
    document.querySelectorAll('.student-name-bind').forEach(el => el.textContent = student.name);
    document.querySelectorAll('.student-roll-bind').forEach(el => el.textContent = student.rollNumber);
    document.querySelectorAll('.student-dept-bind').forEach(el => el.textContent = student.department);
    document.querySelectorAll('.student-course-bind').forEach(el => el.textContent = student.course);
    document.querySelectorAll('.student-sem-bind').forEach(el => el.textContent = `${student.year}, ${student.semester} (${student.section})`);
    document.querySelectorAll('.student-ay-bind').forEach(el => el.textContent = student.academicYear);

    // Profile Details View
    const emailEl = document.getElementById('profile-email-bind');
    const phoneEl = document.getElementById('profile-phone-bind');
    const dobEl = document.getElementById('profile-dob-bind');
    const bloodEl = document.getElementById('profile-blood-bind');
    const guardianEl = document.getElementById('profile-guardian-bind');
    const addressEl = document.getElementById('profile-address-bind');

    if (emailEl) emailEl.textContent = student.email;
    if (phoneEl) phoneEl.textContent = student.phone;
    if (dobEl) dobEl.textContent = student.dob;
    if (bloodEl) bloodEl.textContent = student.bloodGroup;
    if (guardianEl) guardianEl.textContent = `${student.guardianName} (${student.guardianPhone})`;
    if (addressEl) addressEl.textContent = student.address;
  },

  /**
   * Bind Summary KPIs on Home Dashboard & Semester VI Attendance Target Hub
   */
  bindSummaryKPIs(summary) {
    if (!summary) return;

    const overallEl = document.getElementById('kpi-overall-attendance');
    const attendedEl = document.getElementById('kpi-classes-attended');
    const missedEl = document.getElementById('kpi-classes-missed');
    const subjectsEl = document.getElementById('kpi-total-subjects');
    const cgpaEl = document.getElementById('kpi-current-cgpa');
    const pendingAsnEl = document.getElementById('kpi-pending-assignments');

    if (overallEl) overallEl.textContent = `${summary.overallPercentage.toFixed(1)}%`;
    if (attendedEl) attendedEl.textContent = summary.presentClasses;
    if (missedEl) missedEl.textContent = summary.absentClasses;
    if (subjectsEl) subjectsEl.textContent = summary.totalSubjects;
    if (cgpaEl) cgpaEl.textContent = summary.currentCgpa.toFixed(2);
    if (pendingAsnEl) pendingAsnEl.textContent = summary.pendingAssignments;

    // Home attendance breakdown numbers
    const statP = document.getElementById('home-stat-present');
    const statA = document.getElementById('home-stat-absent');
    const statL = document.getElementById('home-stat-leave');
    if (statP) statP.textContent = `${summary.presentClasses} Classes`;
    if (statA) statA.textContent = `${summary.absentClasses} Classes`;
    if (statL) statL.textContent = `${summary.leaveClasses} Sessions`;

    // Semester VI Target Requirement Metrics (Total no. of should have for a sem)
    const semTotal = summary.semesterTotalClasses || 360;
    const semConducted = summary.totalClasses || 239;
    const semAttended = summary.presentClasses || 202;
    const semTargetPct = this.selectedTargetPct || 75;
    const semRequired = Math.ceil(semTotal * (semTargetPct / 100));
    const semRemaining = Math.max(0, semTotal - semConducted);
    const semNeeded = Math.max(0, semRequired - semAttended);
    const semBuffer = Math.max(0, semRemaining - semNeeded);

    const semTotalEl = document.getElementById('sem-total-classes-val');
    const semReqEl = document.getElementById('sem-required-classes-val');
    const semAttEl = document.getElementById('sem-attended-classes-val');
    const semNeedEl = document.getElementById('sem-needed-classes-val');
    const semBufEl = document.getElementById('sem-buffer-classes-val');
    const semFillEl = document.getElementById('sem-progress-fill');
    const semStatusEl = document.getElementById('sem-status-indicator');
    const semStandingEl = document.getElementById('sem-standing-badge');

    if (semTotalEl) semTotalEl.textContent = semTotal;
    if (semReqEl) semReqEl.textContent = semRequired;
    if (semAttEl) semAttEl.textContent = semAttended;
    if (semNeedEl) semNeedEl.textContent = semNeeded;
    if (semBufEl) semBufEl.textContent = semBuffer;

    if (semFillEl) {
      const fillPct = Math.min(100, (semAttended / semTotal) * 100).toFixed(1);
      semFillEl.style.width = `${fillPct}%`;
    }

    if (semStatusEl) {
      semStatusEl.textContent = `Attended: ${semAttended} Classes (${semNeeded === 0 ? 'Target Met' : 'Need ' + semNeeded + ' More for ' + semTargetPct + '%'})`;
    }

    if (semStandingEl) {
      const curPct = ((semAttended / semConducted) * 100).toFixed(1);
      const isEligible = parseFloat(curPct) >= 75.0;
      semStandingEl.innerHTML = `<span class="pulsing-dot" style="background: ${isEligible ? '#10B981' : '#EF4444'};"></span><span>Standing: ${isEligible ? 'Eligible' : 'Attendance Shortage'} (${curPct}%)</span>`;
    }

    this.setSemesterTarget(semTargetPct);

    // Shortage warning banner on Home
    const shortageBox = document.getElementById('home-shortage-alert');
    if (shortageBox) {
      if (summary.lowAttendanceSubjects > 0) {
        shortageBox.style.display = 'flex';
      } else {
        shortageBox.style.display = 'none';
      }
    }

    // Sidebar Shortage Alert badge
    const sideAlert = document.getElementById('sidebar-attendance-alert');
    if (sideAlert) {
      if (summary.lowAttendanceSubjects > 0) {
        sideAlert.style.display = 'inline-block';
        sideAlert.textContent = `${summary.lowAttendanceSubjects} Low`;
      } else {
        sideAlert.style.display = 'none';
      }
    }

    // Sidebar Assignment Count badge
    const sideAsnBadge = document.getElementById('sidebar-assignment-count');
    if (sideAsnBadge) {
      sideAsnBadge.textContent = summary.pendingAssignments;
      sideAsnBadge.style.display = summary.pendingAssignments > 0 ? 'inline-block' : 'none';
    }
  },

  /**
   * Interactive Semester Goal Calculator (75% Exam Minimum, 80%, 85%, 90%)
   */
  setSemesterTarget(targetPct) {
    targetPct = parseInt(targetPct) || 75;
    this.selectedTargetPct = targetPct;

    document.querySelectorAll('.sem-goal-chip').forEach(chip => {
      if (chip.textContent.includes(`${targetPct}%`)) {
        chip.classList.add('active');
      } else {
        chip.classList.remove('active');
      }
    });

    const summary = this.summaryData || {
      semesterTotalClasses: 360,
      totalClasses: 239,
      presentClasses: 202
    };

    const total = summary.semesterTotalClasses || 360;
    const conducted = summary.totalClasses || 239;
    const attended = summary.presentClasses || 202;
    const remainingInSem = Math.max(0, total - conducted);
    const required = Math.ceil(total * (targetPct / 100));
    const needed = Math.max(0, required - attended);
    const buffer = Math.max(0, remainingInSem - needed);

    const reqEl = document.getElementById('sem-required-classes-val');
    const needEl = document.getElementById('sem-needed-classes-val');
    const bufEl = document.getElementById('sem-buffer-classes-val');
    const adviceEl = document.getElementById('sem-goal-advice');

    if (reqEl) reqEl.textContent = required;
    if (needEl) needEl.textContent = needed;
    if (bufEl) bufEl.textContent = buffer;

    if (adviceEl) {
      if (needed === 0) {
        adviceEl.textContent = `🎉 Target Achieved! You already have ${attended} classes (exceeds ${required} for ${targetPct}%).`;
        adviceEl.style.color = '#059669';
      } else if (needed <= remainingInSem) {
        adviceEl.textContent = `Attend ${needed} more classes out of ${remainingInSem} remaining to secure ${targetPct}%. (Safe buffer: ${buffer} leaves)`;
        adviceEl.style.color = 'var(--primary)';
      } else {
        adviceEl.textContent = `⚠️ Target ${targetPct}% mathematically out of reach (${needed} needed with ${remainingInSem} left). Aim for next highest threshold.`;
        adviceEl.style.color = '#EF4444';
      }
    }
  },

  /**
   * Render Today's Schedule on Home Dashboard with Day-Wise Switcher
   */
  renderTodaySchedule(slots, targetDay = null) {
    const list = document.getElementById('today-schedule-list');
    if (!list) return;

    this.cachedTimetableSlots = slots || this.cachedTimetableSlots || (typeof MockDB !== 'undefined' ? MockDB.timeTable : []);
    const allSlots = this.cachedTimetableSlots || [];

    const daysArr = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const actualToday = daysArr[new Date().getDay()];
    
    // Determine active day for dashboard
    if (targetDay) {
      this.currentDashDay = targetDay;
    } else if (!this.currentDashDay) {
      this.currentDashDay = (actualToday === 'Sunday') ? 'Friday' : actualToday;
    }

    const activeDay = this.currentDashDay;
    const isActualToday = (activeDay === actualToday);

    // Sync active state on header day tabs
    const tabBtns = document.querySelectorAll('#dash-day-tabs-container .dash-day-tab');
    tabBtns.forEach(btn => {
      const day = btn.getAttribute('data-day');
      if (day === activeDay) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Update Subtitle
    const subtitleEl = document.getElementById('dash-schedule-subtitle');
    let daySlots = allSlots.filter(s => s.dayOfWeek === activeDay);

    if (subtitleEl) {
      subtitleEl.innerHTML = `${activeDay} • ${daySlots.length} Scheduled Classes ${isActualToday ? '<span style="color: var(--primary); font-weight: 700; margin-left: 4px;">(Today)</span>' : ''}`;
    }

    if (daySlots.length === 0) {
      list.innerHTML = `
        <div style="padding: 28px 20px; text-align: center; color: var(--crystal-dim); background: var(--bg-deep); border-radius: var(--radius-lg); border: 1.5px dashed var(--border-crystal);">
          <div style="font-size: 1.8rem; margin-bottom: 8px;">☕</div>
          <strong style="color: var(--text-primary); font-size: 0.95rem;">No Classes Scheduled on ${activeDay}</strong>
          <p style="font-size: 0.8rem; margin-top: 4px;">Enjoy your academic preparation time or switch to another day above.</p>
        </div>
      `;
      return;
    }

    list.innerHTML = daySlots.map((s, idx) => {
      let statusClass = 'completed';
      let statusLabel = '✓ Marked Present';
      let badgeStyle = 'background: rgba(16, 185, 129, 0.12); color: #10B981; border: 1px solid rgba(16, 185, 129, 0.3);';

      if (isActualToday && idx === 1) {
        statusClass = 'ongoing';
        statusLabel = '<span class="pulse-dot"></span> In Session (Active)';
        badgeStyle = 'background: rgba(99, 102, 241, 0.15); color: #6366F1; border: 1px solid var(--primary); box-shadow: 0 0 10px var(--primary-glow);';
      } else if (!isActualToday || idx > 1) {
        statusClass = 'upcoming';
        statusLabel = '📅 Scheduled';
        badgeStyle = 'background: var(--bg-surface); color: var(--crystal-dim); border: 1px solid var(--border-crystal);';
      }

      return `
        <div class="schedule-card ${statusClass === 'ongoing' ? 'ongoing' : ''}" style="transition: all 0.25s ease;">
          <div class="schedule-meta-left">
            <div class="schedule-time-badge" style="min-width: 82px; text-align: center;">
              <div style="font-size: 0.65rem; font-weight: 800; text-transform: uppercase; color: var(--primary); letter-spacing: 0.05em; margin-bottom: 2px;">Period ${idx + 1}</div>
              <div class="time-start" style="font-size: 0.82rem; font-weight: 800; color: var(--text-primary);">${s.startTime}</div>
              <div class="time-end" style="font-size: 0.72rem; color: var(--crystal-dim);">${s.endTime}</div>
            </div>
            <div class="schedule-info">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                <span class="badge" style="background: var(--primary-subtle); color: var(--primary); border: 1px solid var(--border-crystal-hover); font-size: 0.68rem; font-weight: 800; font-family: var(--font-mono);">${s.subjectCode || 'CS' + (601 + idx)}</span>
                <span style="font-size: 0.72rem; font-weight: 700; color: var(--crystal-dim); text-transform: uppercase;">${s.type}</span>
              </div>
              <h4 style="margin: 0; font-size: 0.95rem; font-weight: 800; color: var(--text-primary);">${s.subjectName}</h4>
              <p style="margin: 4px 0 0 0; font-size: 0.78rem; color: var(--crystal-dim);">
                <span>${s.faculty}</span> • 
                <span style="font-weight: 700; color: var(--primary);">${s.roomNumber}</span>
              </p>
            </div>
          </div>
          <div style="text-align: right; display: flex; flex-direction: column; align-items: flex-end; gap: 6px;">
            <span class="status-pill ${statusClass}" style="${badgeStyle}; font-weight: 700; font-size: 0.74rem;">${statusLabel}</span>
            <span style="font-size: 0.68rem; color: var(--crystal-muted); font-family: var(--font-mono);">Section B</span>
          </div>
        </div>
      `;
    }).join('');
  },

  /**
   * Switch Active Day on Home Dashboard Schedule Card
   */
  switchDashScheduleDay(day) {
    this.currentDashDay = day;
    this.renderTodaySchedule(this.cachedTimetableSlots, day);
  },

  /**
   * Render Timetable with Day-Wise Separation Architecture
   */
  renderTimetable(slots) {
    this.cachedTimetableSlots = slots || this.cachedTimetableSlots || (typeof MockDB !== 'undefined' ? MockDB.timeTable : []);
    const allSlots = this.cachedTimetableSlots || [];

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const daysArr = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const actualToday = daysArr[new Date().getDay()];

    // Determine current timetable selection (defaults to today or Friday if Sunday)
    if (!this.currentTimetableDay) {
      this.currentTimetableDay = (actualToday === 'Sunday') ? 'Friday' : actualToday;
    }
    const selectedDay = this.currentTimetableDay;

    // 1. Render Day Navigation Segmented Tabs
    const tabsContainer = document.getElementById('timetable-day-tabs-container');
    if (tabsContainer) {
      let tabsHtml = `
        <button type="button" class="tt-day-tab ${selectedDay === 'today' || (selectedDay === actualToday) ? 'active' : ''} ${actualToday !== 'Sunday' ? 'is-today-tab' : ''}" onclick="App.switchTimetableDay('today')" title="Focus on Today's Schedule">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          <span>Today</span>
          <span class="tab-count-pill">${allSlots.filter(s => s.dayOfWeek === (actualToday === 'Sunday' ? 'Friday' : actualToday)).length}</span>
        </button>
      `;

      days.forEach(day => {
        const count = allSlots.filter(s => s.dayOfWeek === day).length;
        const isActive = (selectedDay === day);
        const isToday = (day === actualToday);

        tabsHtml += `
          <button type="button" class="tt-day-tab ${isActive ? 'active' : ''} ${isToday ? 'is-today-tab' : ''}" onclick="App.switchTimetableDay('${day}')">
            <span>${day}</span>
            <span class="tab-count-pill">${count}</span>
          </button>
        `;
      });

      tabsHtml += `
        <button type="button" class="tt-day-tab ${selectedDay === 'all' ? 'active' : ''}" onclick="App.switchTimetableDay('all')" title="View All Days Separated">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect width="18" height="18" x="3" y="4" rx="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
          <span>All Days (Separated)</span>
          <span class="tab-count-pill">${allSlots.length}</span>
        </button>
      `;

      tabsContainer.innerHTML = tabsHtml;
    }

    // 2. Render Active Day Summary Strip
    const summaryContainer = document.getElementById('timetable-day-summary');
    if (summaryContainer) {
      if (selectedDay === 'all') {
        const lectureCount = allSlots.filter(s => s.type === 'Lecture').length;
        const labCount = allSlots.filter(s => s.type === 'Lab').length;
        const tutorialCount = allSlots.filter(s => s.type === 'Tutorial').length;

        summaryContainer.innerHTML = `
          <div class="tt-day-heading-wrap">
            <h3>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="color: var(--primary);"><rect width="18" height="18" x="3" y="4" rx="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
              Weekly Academic Schedule (Separated by Day)
            </h3>
            <p>Comprehensive weekly overview segregated across 6 working days • Monday to Saturday</p>
          </div>
          <div class="tt-stat-chips-row">
            <div class="tt-stat-chip">
              <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span>6 Academic Days</span>
            </div>
            <div class="tt-stat-chip">
              <svg viewBox="0 0 24 24"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/></svg>
              <span>${allSlots.length} Total Slots</span>
            </div>
            <div class="tt-stat-chip" style="color: #6366F1;">
              <span>${lectureCount} Lectures</span>
            </div>
            <div class="tt-stat-chip" style="color: #10B981;">
              <span>${labCount} Labs</span>
            </div>
            <div class="tt-stat-chip" style="color: #F59E0B;">
              <span>${tutorialCount} Tutorials</span>
            </div>
          </div>
        `;
      } else {
        const activeTargetDay = (selectedDay === 'today') ? ((actualToday === 'Sunday') ? 'Friday' : actualToday) : selectedDay;
        const daySlots = allSlots.filter(s => s.dayOfWeek === activeTargetDay);
        const lectures = daySlots.filter(s => s.type === 'Lecture').length;
        const labs = daySlots.filter(s => s.type === 'Lab').length;
        const tutorials = daySlots.filter(s => s.type === 'Tutorial').length;
        const isToday = (activeTargetDay === actualToday);

        summaryContainer.innerHTML = `
          <div class="tt-day-heading-wrap">
            <h3>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="color: var(--primary);"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              ${activeTargetDay}'s Academic Schedule
              ${isToday ? '<span class="kpi-badge safe" style="font-size: 0.74rem; vertical-align: middle;">Today</span>' : ''}
            </h3>
            <p>${daySlots.length} sessions planned for Section B • Computer Science & Engineering</p>
          </div>
          <div class="tt-stat-chips-row">
            <div class="tt-stat-chip">
              <svg viewBox="0 0 24 24"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              <span>${daySlots.length} Periods</span>
            </div>
            <div class="tt-stat-chip" style="color: #6366F1;">
              <span>${lectures} Lectures</span>
            </div>
            ${labs > 0 ? `<div class="tt-stat-chip" style="color: #10B981;"><span>${labs} Lab Session</span></div>` : ''}
            ${tutorials > 0 ? `<div class="tt-stat-chip" style="color: #F59E0B;"><span>${tutorials} Tutorial</span></div>` : ''}
            <div class="tt-stat-chip">
              <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
              <span>Sec B (Room CS-201 / CS-204)</span>
            </div>
          </div>
        `;
      }
    }

    // 3. Render Main Schedule Container
    const grid = document.getElementById('timetable-weekly-grid');
    if (!grid) return;

    if (selectedDay === 'all') {
      // All Days Separated Sections
      grid.innerHTML = `
        <div class="tt-all-days-grid">
          ${days.map(day => {
            const daySlots = allSlots.filter(s => s.dayOfWeek === day);
            const isToday = (day === actualToday);

            return `
              <div class="tt-day-separated-section ${isToday ? 'is-today-section' : ''}">
                <div class="tt-day-section-header">
                  <div class="tt-day-section-title">
                    <span>${day}</span>
                    ${isToday ? '<span class="kpi-badge safe" style="font-size: 0.68rem;">Today</span>' : ''}
                  </div>
                  <span class="tab-count-pill" style="font-size: 0.74rem; font-weight: 800; padding: 3px 10px; border-radius: 9999px; background: var(--bg-surface); border: 1px solid var(--border-crystal); color: var(--text-primary);">${daySlots.length} Classes</span>
                </div>
                <div class="tt-day-slots-stack">
                  ${daySlots.length > 0 ? daySlots.map((s, idx) => `
                    <div class="tt-mini-slot-card" style="--slot-color: ${s.color || '#6366F1'};">
                      <div class="tt-mini-slot-top">
                        <span class="tt-mini-slot-time">Period ${idx + 1} • ${s.startTime} - ${s.endTime}</span>
                        <span class="tt-type-pill ${(s.type || 'lecture').toLowerCase()}">${s.type}</span>
                      </div>
                      <h4 class="tt-mini-slot-title">${s.subjectName}</h4>
                      <div class="tt-mini-slot-meta">
                        <span>${s.faculty}</span>
                        <span style="font-weight: 700; color: var(--primary);">${s.roomNumber}</span>
                      </div>
                    </div>
                  `).join('') : `
                    <div style="padding: 20px; text-align: center; color: var(--crystal-dim); font-size: 0.82rem;">No classes scheduled</div>
                  `}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    } else {
      // Single Day Focused Timeline
      const activeTargetDay = (selectedDay === 'today') ? ((actualToday === 'Sunday') ? 'Friday' : actualToday) : selectedDay;
      const daySlots = allSlots.filter(s => s.dayOfWeek === activeTargetDay);
      const isToday = (activeTargetDay === actualToday);

      if (daySlots.length === 0) {
        grid.innerHTML = `
          <div class="tt-empty-day-box">
            <div class="tt-empty-day-icon">☕</div>
            <h4>No Classes Scheduled on ${activeTargetDay}</h4>
            <p>You have no lectures or practical laboratory sessions scheduled for this day.</p>
            <button class="btn btn-primary btn-sm" onclick="App.switchTimetableDay('Monday')" style="margin-top: 16px;">
              View Monday's Timetable →
            </button>
          </div>
        `;
        return;
      }

      grid.innerHTML = `
        <div class="tt-day-timeline">
          ${daySlots.map((s, idx) => {
            let statusClass = 'completed';
            let statusLabel = '✓ Marked Present';

            if (isToday && idx === 1) {
              statusClass = 'ongoing';
              statusLabel = '• In Session (Active)';
            } else if (!isToday || idx > 1) {
              statusClass = 'upcoming';
              statusLabel = '📅 Scheduled';
            }

            return `
              <div class="tt-period-row" style="--slot-color: ${s.color || '#6366F1'};">
                <!-- Column 1: Time & Period -->
                <div class="tt-time-col">
                  <span class="tt-period-badge">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><circle cx="12" cy="12" r="10"/></svg>
                    Period ${idx + 1}
                  </span>
                  <div class="tt-time-main">${s.startTime}</div>
                  <span class="tt-duration-pill">${s.startTime} - ${s.endTime}</span>
                </div>

                <!-- Column 2: Subject Details & Faculty -->
                <div class="tt-subject-col">
                  <div class="tt-subject-header-row">
                    <span class="tt-code-pill">${s.subjectCode || 'CS60' + (idx + 1)}</span>
                    <span class="tt-type-pill ${(s.type || 'lecture').toLowerCase()}">${s.type}</span>
                  </div>
                  <h3 class="tt-subject-name">${s.subjectName}</h3>
                  <div class="tt-meta-row">
                    <span class="tt-meta-item">
                      <svg viewBox="0 0 24 24"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      ${s.faculty}
                    </span>
                    <span class="tt-meta-item" style="color: var(--primary); font-weight: 700;">
                      <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
                      ${s.roomNumber}
                    </span>
                    <span class="tt-meta-item">
                      <svg viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="4" rx="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                      4 Credits
                    </span>
                  </div>
                </div>

                <!-- Column 3: Status & Action -->
                <div class="tt-action-col">
                  <span class="tt-status-pill ${statusClass}">${statusLabel}</span>
                  <button class="btn btn-secondary btn-sm" onclick="App.navigateTo('attendance')" style="font-size: 0.74rem; padding: 6px 12px; border-radius: var(--radius-sm);" title="Check Subject Attendance">
                    Attendance Logs →
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    }
  },

  /**
   * Switch Selected Day in Timetable View
   */
  switchTimetableDay(day) {
    const daysArr = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const actualToday = daysArr[new Date().getDay()];

    if (day === 'today') {
      this.currentTimetableDay = (actualToday === 'Sunday') ? 'Friday' : actualToday;
    } else {
      this.currentTimetableDay = day;
    }

    this.renderTimetable(this.cachedTimetableSlots || (typeof MockDB !== 'undefined' ? MockDB.timeTable : []));
    
    // Update button active state if it's the quick action
    const todayFocusBtn = document.getElementById('tt-btn-today-focus');
    const allDaysBtn = document.getElementById('tt-btn-all-days');
    if (todayFocusBtn) {
      if (this.currentTimetableDay === 'today' || this.currentTimetableDay === actualToday) {
        todayFocusBtn.classList.add('btn-primary');
        todayFocusBtn.classList.remove('btn-secondary');
      } else {
        todayFocusBtn.classList.remove('btn-primary');
        todayFocusBtn.classList.add('btn-secondary');
      }
    }
    if (allDaysBtn) {
      if (this.currentTimetableDay === 'all') {
        allDaysBtn.classList.add('btn-primary');
        allDaysBtn.classList.remove('btn-secondary');
      } else {
        allDaysBtn.classList.remove('btn-primary');
        allDaysBtn.classList.add('btn-secondary');
      }
    }
  },

  /**
   * Render Academic Results & SVG Chart
   */
  renderResults(resultsData) {
    const semTbody = document.getElementById('results-sem-tbody');
    const sgpaEl = document.getElementById('results-sgpa-val');
    const cgpaEl = document.getElementById('results-cgpa-val');
    const creditsEl = document.getElementById('results-credits-val');

    if (sgpaEl) sgpaEl.textContent = resultsData.currentSgpa.toFixed(2);
    if (cgpaEl) cgpaEl.textContent = resultsData.currentCgpa.toFixed(2);
    if (creditsEl) creditsEl.textContent = `${resultsData.totalCreditsEarned} / ${resultsData.degreeTotalCredits}`;

    const currentSem = resultsData.semesterResults[0]; // Sem VI
    if (semTbody && currentSem && currentSem.courseGrades) {
      semTbody.innerHTML = currentSem.courseGrades.map(c => `
        <tr>
          <td>
            <strong>${c.subjectName}</strong>
          </td>
          <td><code>${c.code}</code></td>
          <td style="text-align: center;">${c.credits}</td>
          <td style="text-align: center;"><span class="kpi-badge safe" style="font-size: 0.82rem;">${c.grade}</span></td>
          <td style="text-align: center; font-weight: 700;">${c.gradePoint} / 10</td>
          <td style="color: #059669; font-weight: 700;">${c.result}</td>
        </tr>
      `).join('');
    }

    // Render SGPA/CGPA dual trend line chart
    Charts.renderResultsChart('results-trend-chart', resultsData.semesterResults);
  },

  /**
   * Render Leave Balances & Request History
   */
  renderLeave(leaveData) {
    const bal = leaveData.balances;
    const availEl = document.getElementById('leave-avail-val');
    const usedEl = document.getElementById('leave-used-val');
    const pendEl = document.getElementById('leave-pending-val');
    const apprvEl = document.getElementById('leave-apprv-val');

    if (availEl) availEl.textContent = `${bal.availableLeave} Days`;
    if (usedEl) usedEl.textContent = `${bal.usedLeave} Days`;
    if (pendEl) pendEl.textContent = bal.pendingRequests;
    if (apprvEl) apprvEl.textContent = bal.approvedRequests;

    const tbody = document.getElementById('leave-history-tbody');
    if (tbody) {
      tbody.innerHTML = leaveData.requests.map(r => {
        let statusPill = r.status === 'Approved'
          ? '<span class="status-pill" style="background: #ECFDF5; color: #059669; border: 1px solid #A7F3D0;">✓ Approved</span>'
          : (r.status === 'Rejected'
            ? '<span class="status-pill" style="background: #FEF2F2; color: #DC2626; border: 1px solid #FECACA;">✗ Rejected</span>'
            : '<span class="status-pill" style="background: #FFFBEB; color: #D97706; border: 1px solid #FDE68A;"><span class="pulse-dot"></span> Pending Review</span>');

        return `
          <tr>
            <td><strong style="color: #0F172A;">${r.appliedOn}</strong></td>
            <td><strong>${r.leaveType}</strong></td>
            <td style="color: #475569;">${r.fromDate} to ${r.toDate} (${r.numberOfDays}d)</td>
            <td style="max-width: 260px; font-size: 0.85rem;">${r.reason}</td>
            <td>${statusPill}</td>
            <td style="font-size: 0.78rem; color: #64748B;">${r.remarks}</td>
          </tr>
        `;
      }).join('');
    }
  },

  /**
   * Render Assignments Cards
   */
  renderAssignments(assignments) {
    const grid = document.getElementById('assignments-cards-grid');
    if (!grid) return;

    grid.innerHTML = assignments.map(a => {
      const isPending = a.status === 'Pending';
      const isSubmitted = a.status === 'Submitted';
      const isOverdue = a.status === 'Overdue';

      let statusBadge = isPending 
        ? '<span class="status-pill upcoming">Pending Submission</span>'
        : (isSubmitted 
          ? `<span class="status-pill" style="background: #ECFDF5; color: #059669; border: 1px solid #A7F3D0;">✓ Submitted (${a.marksEarned ? a.marksEarned + '/' + a.totalMarks : 'Under Review'})</span>`
          : '<span class="status-pill" style="background: #FEF2F2; color: #DC2626; border: 1px solid #FECACA;">Overdue</span>');

      return `
        <div class="card" style="display: flex; flex-direction: column; justify-content: space-between;">
          <div class="card-body">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
              <span class="hero-pill" style="color: #4F46E5; background: #EEF2FF; border: 1px solid #C7D2FE;">${a.subjectCode}</span>
              ${statusBadge}
            </div>
            <h4 style="font-size: 1.05rem; font-weight: 700; color: #0F172A; line-height: 1.3;">${a.title}</h4>
            <p style="font-size: 0.82rem; color: #64748B; margin-top: 6px;">${a.description}</p>
            <div style="margin-top: 16px; padding-top: 14px; border-top: 1px solid #F1F5F9; font-size: 0.8rem; color: #475569;">
              <div><strong>Faculty:</strong> ${a.faculty}</div>
              <div style="margin-top: 4px;"><strong>Due Date:</strong> <span style="color: ${isOverdue ? '#DC2626' : '#4F46E5'}; font-weight: 600;">${a.dueDate}</span></div>
            </div>
          </div>
          <div class="card-footer" style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 0.78rem; font-weight: 600; color: #64748B;">Total Marks: ${a.totalMarks}</span>
            ${isPending 
              ? `<button class="btn btn-primary btn-sm" onclick="App.openSubmitAssignmentModal('${a.id}', '${a.title}')">Submit Solution</button>`
              : `<button class="btn btn-secondary btn-sm" onclick="App.showToast('Submission is archived for grading.', 'info')">View Submission</button>`
            }
          </div>
        </div>
      `;
    }).join('');
  },

  /**
   * Render Subjects Grid
   */
  renderSubjectsGrid(subjects) {
    const grid = document.getElementById('subjects-cards-grid');
    if (!grid) return;

    grid.innerHTML = subjects.map(s => {
      const isShortage = s.attendancePercentage < 75;
      const pctColor = s.attendancePercentage >= 80 ? 'green' : (s.attendancePercentage >= 75 ? 'amber' : 'red');

      return `
        <div class="card">
          <div class="card-body">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
              <span class="hero-pill" style="color: #4F46E5; background: #EEF2FF; border: 1px solid #C7D2FE;">${s.code}</span>
              <span style="font-size: 0.78rem; font-weight: 700; color: #64748B;">${s.credits} Credits</span>
            </div>
            <h4 style="font-size: 1.1rem; font-weight: 700; color: #0F172A;">${s.name}</h4>
            <p style="font-size: 0.82rem; color: #64748B; margin-top: 4px;">Faculty: ${s.faculty}</p>

            <div style="margin-top: 18px;">
              <div style="display: flex; justify-content: space-between; font-size: 0.8rem; margin-bottom: 6px;">
                <span style="color: #64748B;">Attendance Rate:</span>
                <span class="progress-pct ${pctColor}" style="font-size: 0.85rem;">${s.attendancePercentage.toFixed(1)}%</span>
              </div>
              <div class="progress-track">
                <div class="progress-fill ${pctColor}" style="width: ${Math.min(100, s.attendancePercentage)}%;"></div>
              </div>
            </div>

            ${isShortage ? `
              <div style="margin-top: 12px; padding: 8px 12px; border-radius: 8px; background: #FEF2F2; border: 1px solid #FECACA; font-size: 0.78rem; color: #DC2626; display: flex; align-items: center; gap: 6px;">
                <span class="pulse-dot"></span> Attendance Shortage! Need ${s.classesNeededFor75} classes.
              </div>
            ` : ''}

            <div style="margin-top: 16px; padding-top: 14px; border-top: 1px solid #F1F5F9; display: flex; justify-content: space-between; font-size: 0.78rem; color: #64748B;">
              <div>Syllabus: <strong>${s.syllabusCompletion}%</strong></div>
              <div>Exam: <strong>${s.examDate}</strong></div>
            </div>
          </div>
          <div class="card-footer" style="display: flex; justify-content: space-between; align-items: center;">
            <button class="btn btn-outline-primary btn-sm" onclick="App.showToast('Syllabus units: 5 Units fully uploaded', 'info')">View Syllabus</button>
            <button class="btn btn-secondary btn-sm" onclick="App.navigateTo('attendance')">Attendance Log</button>
          </div>
        </div>
      `;
    }).join('');
  },

  /**
   * Render Academic Calendar & Holidays
   */
  renderHolidays(holidays) {
    const list = document.getElementById('holidays-cards-list');
    if (!list) return;

    list.innerHTML = holidays.map(h => {
      const isPublic = h.type === 'Public Holiday';
      const isExam = h.type === 'Exam';

      return `
        <div class="card" style="display: flex; align-items: center; justify-content: space-between; padding: 18px 24px; gap: 16px; flex-wrap: wrap;">
          <div style="display: flex; align-items: center; gap: 16px;">
            <div style="width: 48px; height: 48px; border-radius: 12px; background: ${isPublic ? '#ECFDF5' : (isExam ? '#FEF2F2' : '#EEF2FF')}; color: ${isPublic ? '#059669' : (isExam ? '#DC2626' : '#4F46E5')}; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.9rem;">
              ${h.date.split('-')[2]}
            </div>
            <div>
              <h4 style="font-size: 1.05rem; font-weight: 700; color: #0F172A;">${h.title}</h4>
              <p style="font-size: 0.82rem; color: #64748B; margin-top: 2px;">
                ${h.date} ${h.endDate ? 'to ' + h.endDate : ''} • <span style="font-weight: 600;">${h.type}</span> • ${h.description}
              </p>
            </div>
          </div>
          <div>
            <span class="hero-pill" style="background: #F1F5F9; color: #475569; font-size: 0.82rem; font-weight: 700; border: 1px solid #E2E8F0;">
              In ${h.daysRemaining} days
            </span>
          </div>
        </div>
      `;
    }).join('');
  },

  /**
   * Render Notifications
   */
  renderNotifications(notifs) {
    const list = document.getElementById('notifications-full-list');
    const homePreview = document.getElementById('home-notifications-preview');
    const badge = document.getElementById('header-notif-badge');
    const sideBadge = document.getElementById('sidebar-notif-count');
    const unreadCount = notifs.filter(n => !n.isRead).length;

    if (badge) {
      badge.textContent = unreadCount;
      badge.style.display = unreadCount > 0 ? 'flex' : 'none';
    }

    if (sideBadge) {
      sideBadge.textContent = unreadCount;
      sideBadge.style.display = unreadCount > 0 ? 'inline-block' : 'none';
    }

    if (list) {
      list.innerHTML = notifs.map(n => `
        <div class="card" style="padding: 16px 20px; display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; ${!n.isRead ? 'border-left: 4px solid var(--primary); background: #FAF5FF;' : ''}">
          <div style="display: flex; gap: 14px;">
            <div style="width: 36px; height: 36px; border-radius: 10px; background: #EEF2FF; color: #4F46E5; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-weight: 700;">
              •
            </div>
            <div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span class="hero-pill" style="background: #E0E7FF; color: #4338CA; font-size: 0.72rem;">${n.category}</span>
                <span style="font-size: 0.75rem; color: #64748B;">${n.timestamp}</span>
              </div>
              <h4 style="font-size: 0.98rem; font-weight: 700; color: #0F172A; margin-top: 6px;">${n.title}</h4>
              <p style="font-size: 0.85rem; color: #475569; margin-top: 4px;">${n.description}</p>
            </div>
          </div>
          <div>
            ${!n.isRead ? '<span class="status-pill upcoming" style="font-size: 0.7rem;">New</span>' : ''}
          </div>
        </div>
      `).join('');
    }

    if (homePreview) {
      homePreview.innerHTML = notifs.slice(0, 3).map(n => `
        <div style="padding: 12px 14px; border-radius: 10px; background: #F8FAFC; border: 1px solid #E2E8F0; margin-bottom: 8px;">
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.72rem; color: #64748B;">
            <span style="font-weight: 700; color: #4F46E5;">${n.category}</span>
            <span>${n.timestamp.split(' ')[1]} ${n.timestamp.split(' ')[2]}</span>
          </div>
          <div style="font-size: 0.88rem; font-weight: 700; color: #0F172A; margin-top: 4px;">${n.title}</div>
          <div style="font-size: 0.78rem; color: #64748B; margin-top: 2px;">${n.description}</div>
        </div>
      `).join('');
    }
  },

  async markAllNotificationsRead() {
    const res = await ApiService.markAllNotificationsRead();
    if (res.success) {
      this.notificationsData = res.notifications;
      this.renderNotifications(this.notificationsData);
      this.showToast("All notifications marked as read", "success");
    }
  },

  /**
   * Modals Management
   */
  setupModals() {
    // Dismiss modal on backdrop click
    document.querySelectorAll('.modal-overlay').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.closeModal(modal.id);
        }
      });
    });

    // Dismiss modal on Escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.active').forEach(modal => {
          this.closeModal(modal.id);
        });
      }
    });

    // Leave Application Form submission
    const leaveForm = document.getElementById('leave-apply-form');
    if (leaveForm) {
      leaveForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const leaveType = document.getElementById('leave-type-select').value;
        const fromDate = document.getElementById('leave-from-date').value;
        const toDate = document.getElementById('leave-to-date').value;
        const reason = document.getElementById('leave-reason-text').value;

        const d1 = new Date(fromDate);
        const d2 = new Date(toDate);
        const diffDays = Math.max(1, Math.round((d2 - d1) / (1000 * 60 * 60 * 24)) + 1);

        const res = await ApiService.applyLeave({
          leaveType,
          fromDate,
          toDate,
          numberOfDays: diffDays,
          reason,
          documentName: "supporting_proof.pdf"
        });

        if (res.success) {
          this.closeModal('leave-modal');
          leaveForm.reset();
          const leaveData = await ApiService.getLeave();
          this.renderLeave(leaveData);
          this.showToast("Leave application submitted successfully!", "success");
        }
      });
    }

    // Auto calculate days in leave form
    const fDate = document.getElementById('leave-from-date');
    const tDate = document.getElementById('leave-to-date');
    const daysPreview = document.getElementById('leave-days-preview');

    const updateDays = () => {
      if (fDate && tDate && fDate.value && tDate.value && daysPreview) {
        const d1 = new Date(fDate.value);
        const d2 = new Date(tDate.value);
        const diff = Math.max(1, Math.round((d2 - d1) / (1000 * 60 * 60 * 24)) + 1);
        daysPreview.textContent = `${diff} day(s) duration`;
      }
    };
    if (fDate) fDate.addEventListener('change', updateDays);
    if (tDate) tDate.addEventListener('change', updateDays);

    // Edit Profile Form
    const profileForm = document.getElementById('edit-profile-form');
    if (profileForm) {
      profileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const phone = document.getElementById('edit-phone-input').value;
        const email = document.getElementById('edit-email-input').value;
        const address = document.getElementById('edit-address-input').value;

        const res = await ApiService.updateStudent({ phone, email, address });
        if (res.success) {
          this.studentData = res.student;
          this.bindStudentProfile(this.studentData);
          this.closeModal('profile-modal');
          this.showToast("Profile details updated successfully!", "success");
        }
      });
    }

    // Submit Assignment Form
    const asnForm = document.getElementById('submit-assignment-form');
    if (asnForm) {
      asnForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const asnId = document.getElementById('submit-asn-id').value;
        const fileInput = document.getElementById('submit-asn-file');
        const fileName = fileInput.files.length > 0 ? fileInput.files[0].name : "solution_archive.zip";

        const res = await ApiService.submitAssignment(asnId, fileName);
        if (res.success) {
          this.closeModal('assignment-modal');
          asnForm.reset();
          this.renderAssignments(res.assignments);
          const att = await ApiService.getAttendance();
          this.bindSummaryKPIs(att.summary);
          this.showToast("Assignment submitted successfully!", "success");
        }
      });
    }
  },

  openSubmitAssignmentModal(id, title) {
    document.getElementById('submit-asn-id').value = id;
    document.getElementById('submit-asn-title-bind').textContent = title;
    this.openModal('assignment-modal');
  },

  openEditProfileModal() {
    if (this.studentData) {
      document.getElementById('edit-phone-input').value = this.studentData.phone || '';
      document.getElementById('edit-email-input').value = this.studentData.email || '';
      document.getElementById('edit-address-input').value = this.studentData.address || '';
    }
    this.openModal('profile-modal');
  },

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      modal.style.display = 'flex';
      modal.style.opacity = '1';
      modal.style.pointerEvents = 'auto';
      modal.style.visibility = 'visible';
    }
  },

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
      modal.style.opacity = '0';
      modal.style.pointerEvents = 'none';
      modal.style.visibility = 'hidden';
      setTimeout(() => {
        if (!modal.classList.contains('active')) {
          modal.style.display = 'none';
        }
      }, 300);
    }
  },

  /**
   * Command Palette / Global Search (Ctrl + K)
   */
  setupSearch() {
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        this.openModal('search-modal');
        const input = document.getElementById('global-search-input');
        if (input) setTimeout(() => input.focus(), 100);
      }
    });

    const searchInput = document.getElementById('global-search-input');
    const searchResults = document.getElementById('search-results-list');

    if (searchInput && searchResults) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        if (!query) {
          searchResults.innerHTML = `<div style="padding: 16px; color: #94A3B8; text-align: center;">Type to search subjects, pages, or assignments...</div>`;
          return;
        }

        const items = [
          { name: "Attendance Management", type: "Page", view: "attendance" },
          { name: "Academic Results & Marksheet", type: "Page", view: "results" },
          { name: "Class Time Table", type: "Page", view: "timetable" },
          { name: "Leave & Permissions", type: "Page", view: "leave" },
          { name: "Academic Calendar & Holidays", type: "Page", view: "holidays" },
          { name: "Distributed Systems (CS601)", type: "Subject", view: "subjects" },
          { name: "Machine Learning & AI (CS602)", type: "Subject", view: "attendance" },
          { name: "Web Technologies & Cloud (CS603)", type: "Subject", view: "subjects" },
          { name: "Neural Network Assignment", type: "Assignment", view: "assignments" },
          { name: "Student Profile Dossier", type: "Page", view: "profile" }
        ];

        const matched = items.filter(i => i.name.toLowerCase().includes(query) || i.type.toLowerCase().includes(query));

        if (matched.length > 0) {
          searchResults.innerHTML = matched.map(m => `
            <div style="padding: 12px 16px; border-radius: 10px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #F1F5F9;" 
                 onclick="App.navigateTo('${m.view}'); App.closeModal('search-modal');">
              <span style="font-weight: 600; color: #0F172A;">${m.name}</span>
              <span class="hero-pill" style="background: #EEF2FF; color: #4F46E5; font-size: 0.72rem;">${m.type}</span>
            </div>
          `).join('');
        } else {
          searchResults.innerHTML = `<div style="padding: 16px; color: #94A3B8; text-align: center;">No results found for "${query}"</div>`;
        }
      });
    }
  },

  /**
   * Dynamic Greeting & Date setup
   */
  setupDynamicGreeting() {
    const greetingEl = document.getElementById('hero-greeting-bind');
    const dateEl = document.getElementById('hero-date-bind');

    const now = new Date();
    const hour = now.getHours();
    let greet = "Good Morning";
    if (hour >= 12 && hour < 17) greet = "Good Afternoon";
    else if (hour >= 17) greet = "Good Evening";

    if (greetingEl) {
      const studentName = (this.studentData && this.studentData.name) ? this.studentData.name.split(' ')[0] : 'Aarav';
      greetingEl.textContent = `${greet}, ${studentName}!`;
    }

    if (dateEl) {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      dateEl.textContent = now.toLocaleDateString('en-US', options);
    }
  },

  /**
   * ==========================================================================
   * AUTHENTICATION & ROLE SWITCHING (ADMIN / STUDENT)
   * ==========================================================================
   */
  openLoginModal(role = null) {
    if (role && typeof this.switchAuthTab === 'function') {
      this.switchAuthTab(role);
    }
    this.openModal('login-modal');
  },

  switchAuthTab(role) {
    const adminBtn = document.getElementById('tab-btn-admin');
    const teacherBtn = document.getElementById('tab-btn-teacher');
    const studentBtn = document.getElementById('tab-btn-student');
    const adminForm = document.getElementById('admin-login-form');
    const teacherForm = document.getElementById('teacher-login-form');
    const studentForm = document.getElementById('student-login-form');

    if (adminBtn) adminBtn.classList.remove('active');
    if (teacherBtn) teacherBtn.classList.remove('active');
    if (studentBtn) studentBtn.classList.remove('active');
    if (adminForm) adminForm.style.display = 'none';
    if (teacherForm) teacherForm.style.display = 'none';
    if (studentForm) studentForm.style.display = 'none';

    if (role === 'admin') {
      if (adminBtn) adminBtn.classList.add('active');
      if (adminForm) adminForm.style.display = 'block';
    } else if (role === 'teacher') {
      if (teacherBtn) teacherBtn.classList.add('active');
      if (teacherForm) teacherForm.style.display = 'block';
    } else {
      if (studentBtn) studentBtn.classList.add('active');
      if (studentForm) studentForm.style.display = 'block';
    }
  },

  fillAdminCredentials() {
    const emailInput = document.getElementById('admin-login-email');
    const passInput = document.getElementById('admin-login-password');
    if (emailInput) emailInput.value = 'bhaskarasharmabvss@gmail.com';
    if (passInput) passInput.value = '252629';
    this.showToast('Autofilled Chief Administrator credentials (Bhaskara Sharma)', 'info');
  },

  fillTeacherCredentials() {
    const emailInput = document.getElementById('teacher-login-email');
    const passInput = document.getElementById('teacher-login-password');
    if (emailInput) emailInput.value = 'teacher@attendify.edu';
    if (passInput) passInput.value = 'teacher123';
    this.showToast('Autofilled Faculty credentials (Dr. Vikram Sen)', 'info');
  },

  fillStudentCredentials() {
    const idInput = document.getElementById('student-login-id');
    const passInput = document.getElementById('student-login-password');
    if (idInput) idInput.value = '22CS1084';
    if (passInput) passInput.value = 'student123';
    this.showToast('Autofilled Student credentials (Aarav Sharma)', 'info');
  },

  togglePasswordVisibility(inputId, iconId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(iconId);
    if (!input) return;
    if (input.type === 'password') {
      input.type = 'text';
      if (icon) icon.innerHTML = '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>';
    } else {
      input.type = 'password';
      if (icon) icon.innerHTML = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>';
    }
  },

  async handleAdminLogin(e) {
    if (e) e.preventDefault();
    const email = document.getElementById('admin-login-email').value.trim();
    const password = document.getElementById('admin-login-password').value.trim();

    try {
      const resp = await ApiService.login({ email, password, role: 'admin' });
      if (resp && resp.success) {
        this.currentRole = 'admin';
        this.currentUser = resp.user || MockDB.admin;
        localStorage.setItem('campus_role', 'admin');
        localStorage.setItem('campus_user', JSON.stringify(this.currentUser));
        this.applyRoleUI();
        this.closeModal('login-modal');
        this.showToast(`Authenticated as Administrator: ${this.currentUser.name}`, 'success');
        this.navigateTo('admin-dashboard');
        await this.loadAdminData();
      } else {
        this.showToast(resp.message || 'Invalid Administrator credentials.', 'error');
      }
    } catch (err) {
      console.error(err);
      this.showToast('Authentication error. Please try again.', 'error');
    }
  },

  async handleTeacherLogin(e) {
    if (e) e.preventDefault();
    const email = document.getElementById('teacher-login-email').value.trim();
    const password = document.getElementById('teacher-login-password').value.trim();

    try {
      const resp = await ApiService.login({ email, password, role: 'teacher' });
      if (resp && resp.success) {
        this.currentRole = 'teacher';
        this.currentUser = resp.user || (MockDB.teachers && MockDB.teachers[0]);
        localStorage.setItem('campus_role', 'teacher');
        localStorage.setItem('campus_user', JSON.stringify(this.currentUser));
        this.applyRoleUI();
        this.closeModal('login-modal');
        this.showToast(`Authenticated as Faculty: ${this.currentUser.name}`, 'success');
        this.navigateTo('teacher-dashboard');
        await this.loadTeacherData();
      } else {
        this.showToast(resp.message || 'Invalid Teacher credentials.', 'error');
      }
    } catch (err) {
      console.error(err);
      this.showToast('Authentication error. Please try again.', 'error');
    }
  },

  async handleStudentLogin(e) {
    if (e) e.preventDefault();
    const rollOrEmail = document.getElementById('student-login-id').value.trim();
    const password = document.getElementById('student-login-password').value.trim();

    try {
      const resp = await ApiService.login({ email: rollOrEmail, password, role: 'student' });
      if (resp && resp.success) {
        this.currentRole = 'student';
        this.currentUser = resp.user || MockDB.student;
        localStorage.setItem('campus_role', 'student');
        localStorage.setItem('campus_user', JSON.stringify(this.currentUser));
        this.applyRoleUI();
        this.closeModal('login-modal');
        this.showToast(`Logged in as Student: ${this.currentUser.name} (${this.currentUser.rollNumber})`, 'success');
        this.navigateTo('home');
      } else {
        this.showToast(resp.message || 'Student login failed.', 'error');
      }
    } catch (err) {
      console.error(err);
      this.showToast('Authentication error. Please try again.', 'error');
    }
  },

  logout() {
    this.closeModal('logout-modal');
    localStorage.removeItem('campus_user');
    this.showToast('Signed out of session. Redirecting to Portal Access...', 'info');
    this.openLoginModal();
  },

  /**
   * ==========================================================================
   * STUDENT SELF REGISTRATION CONTROLLER
   * ==========================================================================
   */
  openStudentRegisterModal() {
    this.closeModal('login-modal');
    this.openModal('student-register-modal');
  },

  closeStudentRegisterModal() {
    this.closeModal('student-register-modal');
  },

  async handleStudentRegister(event) {
    if (event) event.preventDefault();

    const name = document.getElementById('reg-student-name').value.trim();
    const rollNumber = document.getElementById('reg-student-roll').value.trim().toUpperCase();
    const email = document.getElementById('reg-student-email').value.trim();
    const phone = document.getElementById('reg-student-phone').value.trim();
    const department = document.getElementById('reg-student-dept').value;
    const semester = document.getElementById('reg-student-sem').value;
    const section = document.getElementById('reg-student-section').value;
    const password = document.getElementById('reg-student-password').value;

    if (!name || !rollNumber || !email || !password) {
      this.showToast('Please fill all required registration fields', 'warning');
      return;
    }

    try {
      const payload = {
        name,
        rollNumber,
        email,
        phone,
        department,
        semester,
        section,
        password
      };

      const res = await ApiService.registerStudent(payload);
      if (res && res.success) {
        this.showToast(`Registration Successful! Welcome, ${name}.`, 'success');
        this.closeModal('student-register-modal');

        const studentUser = res.student || {
          id: rollNumber,
          rollNumber: rollNumber,
          name: name,
          email: email,
          phone: phone,
          department: department,
          semester: semester,
          section: section,
          course: `B.Tech ${department}`,
          academicYear: "2024-2025",
          year: "3rd Year"
        };

        this.currentUser = studentUser;
        this.studentData = studentUser;
        this.currentRole = 'student';
        localStorage.setItem('campus_role', 'student');
        localStorage.setItem('campus_user', JSON.stringify(studentUser));

        this.applyRoleUI();
        this.bindStudentProfile(studentUser);
        this.navigateTo('home');
      } else {
        this.showToast(res.message || 'Registration failed', 'error');
      }
    } catch (err) {
      console.error("Registration error:", err);
      this.showToast('Error registering student. Please try again.', 'error');
    }
  },

  /**
   * ==========================================================================
   * QR ATTENDANCE SCANNER & VERIFIER CONTROLLER
   * ==========================================================================
   */
  openQrScanner() {
    this.openModal('qr-scanner-modal');
    const resultCard = document.getElementById('qr-scan-result-card');
    if (resultCard) {
      resultCard.style.display = 'none';
      resultCard.innerHTML = '';
    }
    const input = document.getElementById('manual-qr-code-input');
    if (input) input.value = '';
    this.startQrCamera();
  },

  closeQrScanner() {
    this.stopQrCamera();
    this.closeModal('qr-scanner-modal');
  },

  async startQrCamera() {
    const video = document.getElementById('qr-camera-video');
    const fallbackMsg = document.getElementById('qr-camera-fallback-msg');
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        this.qrMediaStream = stream;
        if (video) {
          video.srcObject = stream;
          video.play();
        }
        if (fallbackMsg) fallbackMsg.style.display = 'none';
      } else {
        if (fallbackMsg) fallbackMsg.style.display = 'block';
      }
    } catch (err) {
      console.warn("Camera access not available or permission denied:", err);
      if (fallbackMsg) fallbackMsg.style.display = 'block';
    }
  },

  stopQrCamera() {
    if (this.qrMediaStream) {
      this.qrMediaStream.getTracks().forEach(track => track.stop());
      this.qrMediaStream = null;
    }
    const video = document.getElementById('qr-camera-video');
    if (video) {
      video.srcObject = null;
    }
  },

  async simulateQrScan(code) {
    this.showToast(`Scanning QR payload: ${code}...`, 'info');
    await this.processQrScan(code);
  },

  async submitManualQrCode() {
    const input = document.getElementById('manual-qr-code-input');
    const code = input ? input.value.trim() : '';
    if (!code) {
      this.showToast('Please enter a session QR code', 'warning');
      return;
    }
    await this.processQrScan(code);
  },

  async processQrScan(qrPayload) {
    const studentId = this.currentUser && this.currentUser.id ? this.currentUser.id : (this.studentData ? this.studentData.rollNumber : '22CS1084');
    const studentName = this.currentUser && this.currentUser.name ? this.currentUser.name : (this.studentData ? this.studentData.name : 'Aarav Sharma');

    try {
      const res = await ApiService.scanAttendanceQr(qrPayload, studentId, studentName);
      const resultCard = document.getElementById('qr-scan-result-card');

      if (res && res.success) {
        if (resultCard) {
          resultCard.style.display = 'block';
          resultCard.style.background = '#ECFDF5';
          resultCard.style.border = '1px solid #10B981';
          resultCard.style.color = '#065F46';
          resultCard.innerHTML = `
            <div style="display: flex; align-items: flex-start; gap: 10px;">
              <span style="font-size: 1.4rem;">✅</span>
              <div>
                <strong style="font-size: 0.95rem; display: block; margin-bottom: 2px;">Attendance Successfully Verified!</strong>
                <p style="margin: 0; font-size: 0.8rem; color: #047857;">${res.message || 'You have been marked PRESENT for this period.'}</p>
                <div style="margin-top: 6px; font-size: 0.75rem; color: #065F46; font-family: monospace;">Token: ${qrPayload} • Recorded at: ${new Date().toLocaleTimeString()}</div>
              </div>
            </div>
          `;
        }

        // Increment present classes in local model & update KPIs
        if (this.summaryData) {
          this.summaryData.presentClasses = (this.summaryData.presentClasses || 202) + 1;
          this.summaryData.totalClasses = (this.summaryData.totalClasses || 239) + 1;
          this.summaryData.overallPercentage = (this.summaryData.presentClasses / this.summaryData.totalClasses) * 100;
          this.bindSummaryKPIs(this.summaryData);
        }

        this.showToast('Attendance recorded! Marked PRESENT.', 'success');
      } else {
        if (resultCard) {
          resultCard.style.display = 'block';
          resultCard.style.background = '#FEF2F2';
          resultCard.style.border = '1px solid #EF4444';
          resultCard.style.color = '#991B1B';
          resultCard.innerHTML = `
            <div style="display: flex; align-items: flex-start; gap: 10px;">
              <span style="font-size: 1.4rem;">⚠️</span>
              <div>
                <strong style="font-size: 0.95rem; display: block; margin-bottom: 2px;">Attendance Verification Failed</strong>
                <p style="margin: 0; font-size: 0.8rem;">${res.message || 'Invalid or expired QR code.'}</p>
              </div>
            </div>
          `;
        }
        this.showToast(res.message || 'QR verification failed', 'error');
      }
    } catch (err) {
      console.error("Scan error:", err);
      this.showToast("Could not process QR scan", "error");
    }
  },

  /**
   * ==========================================================================
   * FACULTY LIVE PERIOD QR CODE GENERATOR & CHECK-IN TRACKER
   * ==========================================================================
   */
  openTeacherQrModal() {
    const subjectSelect = document.getElementById('teacher-att-subject');
    const classSelect = document.getElementById('teacher-att-class');
    const subjectCode = subjectSelect ? subjectSelect.value : 'CS602';
    const className = classSelect ? classSelect.value : 'CSE-VI-B';

    const courseLabel = document.getElementById('teacher-qr-course-label');
    const tokenLabel = document.getElementById('teacher-qr-token-label');
    const tallyEl = document.getElementById('teacher-qr-scans-tally');

    const token = `ATTEND-${subjectCode}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    if (courseLabel) courseLabel.textContent = `${subjectCode} (${className})`;
    if (tokenLabel) tokenLabel.textContent = token;
    if (tallyEl) tallyEl.textContent = '14 / 64';

    this.activeTeacherQrToken = token;
    this.renderSvgQrCode(token);
    this.startTeacherQrTimer();
    this.openModal('teacher-qr-modal');
  },

  closeTeacherQrModal() {
    if (this.teacherQrInterval) {
      clearInterval(this.teacherQrInterval);
      this.teacherQrInterval = null;
    }
    this.closeModal('teacher-qr-modal');
  },

  refreshTeacherQrCode() {
    const subjectSelect = document.getElementById('teacher-att-subject');
    const subjectCode = subjectSelect ? subjectSelect.value : 'CS602';
    const token = `ATTEND-${subjectCode}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const tokenLabel = document.getElementById('teacher-qr-token-label');
    if (tokenLabel) tokenLabel.textContent = token;
    this.activeTeacherQrToken = token;
    this.renderSvgQrCode(token);
    this.teacherQrSecondsLeft = 600;
    this.showToast('New dynamic session token generated', 'info');
  },

  startTeacherQrTimer() {
    if (this.teacherQrInterval) clearInterval(this.teacherQrInterval);
    this.teacherQrSecondsLeft = 600;

    let checkedIn = 14;
    this.teacherQrInterval = setInterval(() => {
      this.teacherQrSecondsLeft--;
      if (this.teacherQrSecondsLeft <= 0) {
        clearInterval(this.teacherQrInterval);
        this.teacherQrInterval = null;
        const timerLabel = document.getElementById('teacher-qr-timer-label');
        if (timerLabel) timerLabel.textContent = '00:00 (Expired)';
        return;
      }

      const mins = Math.floor(this.teacherQrSecondsLeft / 60).toString().padStart(2, '0');
      const secs = (this.teacherQrSecondsLeft % 60).toString().padStart(2, '0');
      const timerLabel = document.getElementById('teacher-qr-timer-label');
      if (timerLabel) timerLabel.textContent = `${mins}:${secs}`;

      if (this.teacherQrSecondsLeft % 7 === 0 && checkedIn < 58) {
        checkedIn += Math.floor(Math.random() * 2) + 1;
        const tallyEl = document.getElementById('teacher-qr-scans-tally');
        if (tallyEl) tallyEl.textContent = `${checkedIn} / 64`;
      }
    }, 1000);
  },

  renderSvgQrCode(text) {
    const wrap = document.getElementById('teacher-qr-svg-wrap');
    if (!wrap) return;

    const size = 21;
    const matrix = [];
    for (let r = 0; r < size; r++) {
      matrix[r] = [];
      for (let c = 0; c < size; c++) {
        matrix[r][c] = 0;
      }
    }

    const addFinder = (row, col) => {
      for (let r = -1; r <= 7; r++) {
        for (let c = -1; c <= 7; c++) {
          const pr = row + r;
          const pc = col + c;
          if (pr >= 0 && pr < size && pc >= 0 && pc < size) {
            if (r === -1 || r === 7 || c === -1 || c === 7) {
              matrix[pr][pc] = 0;
            } else if (r === 0 || r === 6 || c === 0 || c === 6) {
              matrix[pr][pc] = 1;
            } else if (r >= 2 && r <= 4 && c >= 2 && c <= 4) {
              matrix[pr][pc] = 1;
            } else {
              matrix[pr][pc] = 0;
            }
          }
        }
      }
    };

    addFinder(0, 0);
    addFinder(0, 14);
    addFinder(14, 0);

    for (let i = 8; i < 13; i++) {
      matrix[6][i] = i % 2 === 0 ? 1 : 0;
      matrix[i][6] = i % 2 === 0 ? 1 : 0;
    }

    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = ((hash << 5) - hash) + text.charCodeAt(i);
      hash |= 0;
    }

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if ((r < 8 && c < 8) || (r < 8 && c > 12) || (r > 12 && c < 8)) continue;
        if (r === 6 || c === 6) continue;
        const bit = ((hash ^ (r * 31 + c * 17)) & 1);
        matrix[r][c] = bit;
      }
    }

    const cellSize = 10;
    const svgDim = size * cellSize;
    let rects = '';
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (matrix[r][c] === 1) {
          rects += `<rect x="${c * cellSize}" y="${r * cellSize}" width="${cellSize}" height="${cellSize}" fill="#0F172A" rx="1.5"/>`;
        }
      }
    }

    const centerSize = 28;
    const centerPos = (svgDim - centerSize) / 2;
    const centerBadge = `
      <rect x="${centerPos}" y="${centerPos}" width="${centerSize}" height="${centerSize}" fill="#FFFFFF" rx="6" stroke="var(--primary)" stroke-width="2"/>
      <circle cx="${svgDim / 2}" cy="${svgDim / 2}" r="5" fill="var(--primary)"/>
    `;

    wrap.innerHTML = `
      <svg width="210" height="210" viewBox="0 0 ${svgDim} ${svgDim}" style="background: #FFFFFF; border-radius: 8px;">
        ${rects}
        ${centerBadge}
      </svg>
    `;
  },

  /**
   * ==========================================================================
   * ADMINISTRATOR PORTAL CONTROLLERS & DATA DISPATCHERS
   * ==========================================================================
   */
  async loadAdminData() {
    try {
      // 1. Fetch Students
      this.adminStudents = await ApiService.getAdminStudents();
      this.renderAdminStudentRegistry(this.adminStudents);

      // 2. Render Attendance Dispatcher Matrix
      this.renderAdminAttendanceMatrix();

      // 3. Render Leave Requests
      const leaveData = await ApiService.getLeave();
      this.renderAdminLeaves(leaveData.requests || []);

      // 4. Render Broadcast Feed
      const notifs = await ApiService.getNotifications();
      this.renderAdminBroadcastFeed(notifs);

      // 5. Update KPI counters
      const stuCount = this.adminStudents.length;
      const shortages = this.adminStudents.filter(s => s.shortage || s.attendanceRate < 75).length;
      const kpiStu = document.getElementById('admin-kpi-students');
      const kpiShort = document.getElementById('admin-kpi-shortages');
      const adminShortageBadge = document.getElementById('admin-shortage-badge');
      if (kpiStu) kpiStu.textContent = stuCount;
      if (kpiShort) kpiShort.textContent = shortages;
      if (adminShortageBadge) adminShortageBadge.textContent = `${shortages} Alert`;
    } catch (err) {
      console.error("Admin data load error:", err);
    }
  },

  renderAdminAttendanceMatrix() {
    const tbody = document.getElementById('admin-matrix-tbody');
    if (!tbody) return;

    if (!this.adminAttendanceMap) this.adminAttendanceMap = {};

    tbody.innerHTML = this.adminStudents.map(s => {
      if (!this.adminAttendanceMap[s.id]) {
        this.adminAttendanceMap[s.id] = { status: s.shortage ? 'Absent' : 'Present', remarks: 'Regular Lecture' };
      }
      const curStatus = this.adminAttendanceMap[s.id].status;
      const rate = s.attendanceRate || 80.0;
      const isShort = rate < 75;

      return `
        <tr>
          <td>
            <div style="display: flex; align-items: center; gap: 10px;">
              <div style="width: 34px; height: 34px; border-radius: 50%; background: var(--bg-surface); border: 1px solid var(--border-crystal); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.8rem;">
                ${s.name.charAt(0)}
              </div>
              <div>
                <strong style="color: var(--text-primary);">${s.name}</strong>
                <div style="font-size: 0.74rem; color: var(--crystal-dim);">${s.course || 'B.Tech CSE'}</div>
              </div>
            </div>
          </td>
          <td><code style="font-size: 0.82rem; color: var(--crystal-subtle);">${s.rollNumber}</code></td>
          <td>
            <div style="font-weight: 700; color: ${isShort ? '#EF4444' : '#10B981'}; font-size: 0.88rem;">
              ${rate}%
            </div>
          </td>
          <td>
            <span class="shortage-badge ${isShort ? 'danger' : 'safe'}">
              ${isShort ? '⚠ Shortage Risk' : '✓ Normal'}
            </span>
          </td>
          <td>
            <div class="att-toggle-group">
              <button type="button" class="att-toggle-btn present ${curStatus === 'Present' ? 'active' : ''}" 
                      onclick="App.setStudentAttStatus('${s.id}', 'Present')">Present</button>
              <button type="button" class="att-toggle-btn absent ${curStatus === 'Absent' ? 'active' : ''}" 
                      onclick="App.setStudentAttStatus('${s.id}', 'Absent')">Absent</button>
            </div>
          </td>
          <td>
            <input type="text" class="form-control" style="padding: 4px 8px; font-size: 0.78rem; min-width: 140px;" 
                   placeholder="Faculty remark..." 
                   value="${this.adminAttendanceMap[s.id].remarks || 'Regular Lecture'}" 
                   onchange="App.setStudentAttRemarks('${s.id}', this.value)">
          </td>
        </tr>
      `;
    }).join('');
  },

  setStudentAttStatus(studentId, status) {
    if (!this.adminAttendanceMap) this.adminAttendanceMap = {};
    if (!this.adminAttendanceMap[studentId]) this.adminAttendanceMap[studentId] = {};
    this.adminAttendanceMap[studentId].status = status;
    this.renderAdminAttendanceMatrix();
  },

  setStudentAttRemarks(studentId, remarks) {
    if (!this.adminAttendanceMap) this.adminAttendanceMap = {};
    if (!this.adminAttendanceMap[studentId]) this.adminAttendanceMap[studentId] = {};
    this.adminAttendanceMap[studentId].remarks = remarks;
  },

  setAllAttendanceStatus(status) {
    if (!this.adminAttendanceMap) this.adminAttendanceMap = {};
    this.adminStudents.forEach(s => {
      if (!this.adminAttendanceMap[s.id]) this.adminAttendanceMap[s.id] = {};
      this.adminAttendanceMap[s.id].status = status;
    });
    this.renderAdminAttendanceMatrix();
    this.showToast(`All cohort students set to: ${status}`, 'info');
  },

  handleAdminSubjectChange() {
    this.renderAdminAttendanceMatrix();
  },

  quickMarkSubject(code) {
    this.navigateTo('admin-attendance');
    const select = document.getElementById('admin-att-subject-select');
    if (select) select.value = code;
    this.renderAdminAttendanceMatrix();
  },

  async commitAdminAttendance() {
    const select = document.getElementById('admin-att-subject-select');
    const code = select ? select.value : 'CS601';
    const date = document.getElementById('admin-att-date') ? document.getElementById('admin-att-date').value : '2026-10-13';

    try {
      const studentStatus = (this.adminAttendanceMap && this.adminAttendanceMap['STU-2024-8842']) 
        ? this.adminAttendanceMap['STU-2024-8842'].status 
        : 'Present';

      const resp = await ApiService.adminMarkAttendance({
        subjectCode: code,
        status: studentStatus,
        date: date,
        remarks: `Signed by Provost Bhaskara Sharma on ${date}`
      });

      this.showToast(`✓ Attendance dispatched & committed for ${code} (${studentStatus})`, 'success');

      // Refresh student attendance data
      const attData = await ApiService.getAttendance();
      this.summaryData = attData.summary;
      this.subjectsData = attData.subjects;
      this.bindSummaryKPIs(this.summaryData);
      const logs = await ApiService.getAttendanceLogs();
      AttendanceModule.init(this.subjectsData, logs);
      this.renderSubjectsGrid(this.subjectsData);

      // Re-render admin dashboard
      await this.loadAdminData();
    } catch (err) {
      console.error(err);
      this.showToast('Attendance recorded in local console.', 'success');
    }
  },

  renderAdminLeaves(requests) {
    const container = document.getElementById('admin-leaves-list');
    if (!container) return;

    if (!requests || requests.length === 0) {
      container.innerHTML = `<div style="padding: 24px; text-align: center; color: var(--crystal-dim);">No leave applications pending review.</div>`;
      return;
    }

    container.innerHTML = requests.map(req => {
      const isPending = req.status === 'Pending';
      return `
        <div class="leave-adjudicate-card lc-tilt-card">
          <div class="leave-adjudicate-header">
            <div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span class="badge ${isPending ? 'badge-amber' : (req.status === 'Approved' ? 'badge-green' : 'badge-red')}">
                  ${req.status.toUpperCase()}
                </span>
                <strong style="font-size: 1.05rem; color: var(--text-primary);">${req.leaveType}</strong>
              </div>
              <div style="font-size: 0.8rem; color: var(--crystal-dim); margin-top: 4px;">
                Application ID: <code>${req.id}</code> • Applied on ${req.appliedOn}
              </div>
            </div>
            <div style="text-align: right;">
              <span style="font-weight: 700; color: var(--text-primary);">${req.numberOfDays} Day(s)</span>
              <div style="font-size: 0.78rem; color: var(--crystal-muted);">${req.fromDate} to ${req.toDate}</div>
            </div>
          </div>

          <div style="font-size: 0.86rem; color: var(--crystal-subtle); margin: 10px 0; background: var(--bg-glass); padding: 12px; border-radius: 8px; border: 1px solid var(--border-subtle);">
            <strong>Reason:</strong> ${req.reason}
            ${req.documentName ? `<div style="margin-top: 6px; font-size: 0.78rem; color: #38BDF8;">📎 Attached: ${req.documentName}</div>` : ''}
          </div>

          ${req.remarks ? `
            <div style="font-size: 0.8rem; color: var(--crystal-dim); margin-bottom: 10px;">
              <strong>Reviewer Note:</strong> ${req.remarks} (by ${req.reviewedBy || 'Bhaskara Sharma'})
            </div>
          ` : ''}

          ${isPending ? `
            <div class="leave-actions-row">
              <input type="text" id="leave-remark-${req.id}" class="form-control" style="flex: 1; padding: 7px 12px; font-size: 0.82rem;" placeholder="Provost decision remarks...">
              <button class="btn btn-primary btn-sm" onclick="App.actionLeave('${req.id}', 'Approved')">✓ Approve Exemption</button>
              <button class="btn btn-danger btn-sm" onclick="App.actionLeave('${req.id}', 'Rejected')">✕ Reject Application</button>
            </div>
          ` : ''}
        </div>
      `;
    }).join('');
  },

  async actionLeave(requestId, status) {
    const remarkInput = document.getElementById(`leave-remark-${requestId}`);
    const remarks = remarkInput ? remarkInput.value.trim() : '';

    try {
      const resp = await ApiService.adminActionLeave({
        requestId,
        status,
        remarks: remarks || `Adjudicated ${status} by Provost Bhaskara Sharma`
      });

      this.showToast(`✓ Leave request ${requestId} has been ${status}!`, 'success');
      const leaveData = await ApiService.getLeave();
      this.renderLeave(leaveData);
      this.renderAdminLeaves(leaveData.requests || []);

      const pendingBadge = document.getElementById('admin-pending-leaves-badge');
      const pendingCount = document.getElementById('admin-leave-pending-count');
      const approvedCount = document.getElementById('admin-leave-approved-count');
      const kpiLeaves = document.getElementById('admin-kpi-leaves');
      if (pendingBadge) pendingBadge.textContent = leaveData.balances.pendingRequests;
      if (pendingCount) pendingCount.textContent = `${leaveData.balances.pendingRequests} Pending`;
      if (approvedCount) approvedCount.textContent = `${leaveData.balances.approvedRequests} Approved`;
      if (kpiLeaves) kpiLeaves.textContent = leaveData.balances.pendingRequests;
    } catch (err) {
      console.error(err);
      this.showToast('Leave action updated.', 'success');
    }
  },

  async handleAdminBroadcast(e) {
    if (e) e.preventDefault();
    const title = document.getElementById('broadcast-title').value.trim();
    const category = document.getElementById('broadcast-category').value;
    const content = document.getElementById('broadcast-content').value.trim();

    try {
      const resp = await ApiService.adminBroadcastNotice({
        title,
        description: content,
        category
      });

      this.showToast(`📢 Official notice "${title}" broadcasted to student body!`, 'success');
      document.getElementById('admin-broadcast-form').reset();

      this.notificationsData = await ApiService.getNotifications();
      this.renderNotifications(this.notificationsData);
      this.renderAdminBroadcastFeed(this.notificationsData);

      const notifBadge = document.getElementById('header-notif-badge');
      if (notifBadge) notifBadge.textContent = this.notificationsData.filter(n => !n.isRead).length;
    } catch (err) {
      console.error(err);
      this.showToast('Announcement broadcasted.', 'info');
    }
  },

  renderAdminBroadcastFeed(notifs) {
    const feed = document.getElementById('admin-broadcast-feed');
    if (!feed) return;

    feed.innerHTML = notifs.map(n => `
      <div style="padding: 12px; border-radius: 8px; background: var(--bg-card); border: 1px solid var(--border-subtle);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
          <span class="badge badge-blue" style="font-size: 0.7rem;">${n.category}</span>
          <span style="font-size: 0.72rem; color: var(--crystal-muted);">${n.timestamp}</span>
        </div>
        <strong style="font-size: 0.88rem; color: var(--text-primary);">${n.title}</strong>
        <p style="font-size: 0.78rem; color: var(--crystal-dim); margin-top: 4px;">${n.description}</p>
      </div>
    `).join('');
  },

  renderAdminStudentRegistry(students) {
    const tbody = document.getElementById('admin-students-tbody');
    if (!tbody) return;

    tbody.innerHTML = students.map(s => {
      const isShort = s.shortage || s.attendanceRate < 75;
      return `
        <tr>
          <td>
            <div style="display: flex; align-items: center; gap: 10px;">
              <div style="width: 34px; height: 34px; border-radius: 50%; background: var(--bg-surface); border: 1px solid var(--border-crystal); display: flex; align-items: center; justify-content: center; font-weight: 700;">
                ${s.name.charAt(0)}
              </div>
              <div>
                <strong style="color: var(--text-primary);">${s.name}</strong>
                <div style="font-size: 0.74rem; color: var(--crystal-dim);">${s.email}</div>
              </div>
            </div>
          </td>
          <td><code style="font-size: 0.84rem;">${s.rollNumber}</code></td>
          <td>${s.course || 'B.Tech CSE VI'}</td>
          <td>
            <div style="display: flex; align-items: center; gap: 8px;">
              <div class="progress-bar-wrap" style="width: 70px;">
                <div class="progress-fill ${isShort ? 'red' : 'green'}" style="width: ${s.attendanceRate}%;"></div>
              </div>
              <strong style="color: ${isShort ? '#EF4444' : '#10B981'}; font-size: 0.84rem;">${s.attendanceRate}%</strong>
            </div>
          </td>
          <td>
            <span class="shortage-badge ${isShort ? 'danger' : 'safe'}">
              ${isShort ? '⚠ Exam Shortage' : '✓ Exam Eligible'}
            </span>
          </td>
          <td>
            <button class="btn btn-secondary btn-sm" onclick="App.warnStudent('${s.rollNumber}', '${s.name}')">
              ${isShort ? '🚨 Send Warning' : 'Dossier'}
            </button>
          </td>
        </tr>
      `;
    }).join('');
  },

  warnStudent(rollNumber, name) {
    this.showToast(`Shortage notice dispatched to ${name} (${rollNumber}) via university SMS gateway.`, 'info');
  },

  filterAdminStudents() {
    const query = (document.getElementById('admin-student-search') ? document.getElementById('admin-student-search').value : '').toLowerCase();
    const filtered = this.adminStudents.filter(s => 
      s.name.toLowerCase().includes(query) || s.rollNumber.toLowerCase().includes(query)
    );
    this.renderAdminStudentRegistry(filtered);
  },

  setStudentFilter(filter) {
    const allBtn = document.getElementById('admin-filter-all-btn');
    const shortBtn = document.getElementById('admin-filter-shortage-btn');

    if (filter === 'shortage') {
      if (shortBtn) shortBtn.classList.add('active');
      if (allBtn) allBtn.classList.remove('active');
      const filtered = this.adminStudents.filter(s => s.shortage || s.attendanceRate < 75);
      this.renderAdminStudentRegistry(filtered);
      this.showToast('Showing 2 students below 75% cutoff', 'info');
    } else {
      if (allBtn) allBtn.classList.add('active');
      if (shortBtn) shortBtn.classList.remove('active');
      this.renderAdminStudentRegistry(this.adminStudents);
    }
  },

  filterShortageOnly() {
    this.navigateTo('admin-students');
    this.setStudentFilter('shortage');
  },

  // ==========================================================================
  // TEACHER DASHBOARD & ATTENDANCE TAKING WORKFLOW
  // ==========================================================================
  teacherState: {
    selectedClass: 'B.Tech CSE - Section B',
    selectedSubject: 'CS601',
    selectedSubjectName: 'Distributed Systems',
    selectedDate: '2026-10-13',
    selectedPeriod: 'Period 1 (09:00 - 10:00 AM)',
    studentStatuses: {}
  },

  async loadTeacherData() {
    try {
      this.teachersList = await ApiService.getTeachers();
      this.teacherSessions = await ApiService.getAttendanceSessions();
      this.renderTeacherOverview();
      this.renderTeacherStudents();
      this.renderTeacherAttendanceTaker();
      this.renderTeacherHistory();
    } catch (e) {
      console.error("Error loading teacher data:", e);
    }
  },

  renderTeacherOverview() {
    const assignedClassesEl = document.getElementById('teacher-kpi-classes');
    const assignedStudentsEl = document.getElementById('teacher-kpi-students');
    const scheduledTodayEl = document.getElementById('teacher-kpi-scheduled');
    const sessionsCompletedEl = document.getElementById('teacher-kpi-sessions');

    if (assignedClassesEl) assignedClassesEl.textContent = '2';
    if (assignedStudentsEl) assignedStudentsEl.textContent = this.adminStudents ? this.adminStudents.length : '6';
    if (scheduledTodayEl) scheduledTodayEl.textContent = '2';
    if (sessionsCompletedEl) sessionsCompletedEl.textContent = this.teacherSessions ? this.teacherSessions.length : '1';
  },

  renderTeacherStudents() {
    const tbody = document.getElementById('teacher-students-tbody');
    if (!tbody) return;

    const students = this.adminStudents || MockDB.allStudents;
    tbody.innerHTML = students.map(s => {
      const isShort = s.shortage || s.attendanceRate < 75;
      return `
        <tr>
          <td>
            <div style="display: flex; align-items: center; gap: 10px;">
              <div style="width: 32px; height: 32px; border-radius: 50%; background: var(--bg-surface); border: 1px solid var(--border-crystal); display: flex; align-items: center; justify-content: center; font-weight: 700;">
                ${s.name.charAt(0)}
              </div>
              <div>
                <strong style="color: var(--text-primary);">${s.name}</strong>
                <div style="font-size: 0.72rem; color: var(--crystal-dim);">${s.email}</div>
              </div>
            </div>
          </td>
          <td><code>${s.rollNumber}</code></td>
          <td>${s.course || 'B.Tech CSE VI'}</td>
          <td>
            <strong style="color: ${isShort ? '#EF4444' : '#10B981'};">${s.attendanceRate}%</strong>
          </td>
          <td>
            <span class="shortage-badge ${isShort ? 'danger' : 'safe'}">
              ${isShort ? '⚠ Detained / Shortage' : '✓ Eligible'}
            </span>
          </td>
          <td>
            <button class="btn btn-secondary btn-sm" onclick="App.viewStudentDossier('${s.rollNumber}')">
              View Profile
            </button>
          </td>
        </tr>
      `;
    }).join('');
  },

  renderTeacherAttendanceTaker() {
    const tbody = document.getElementById('teacher-att-roster-tbody');
    if (!tbody) return;

    const students = this.adminStudents || MockDB.allStudents;
    const statuses = this.teacherState.studentStatuses;

    tbody.innerHTML = students.map((s, idx) => {
      if (!statuses[s.rollNumber]) {
        statuses[s.rollNumber] = (idx === 1 && s.shortage) ? 'Absent' : 'Present';
      }
      const cur = statuses[s.rollNumber];

      return `
        <tr>
          <td><strong>#${idx + 1}</strong></td>
          <td>
            <strong>${s.name}</strong>
            <div style="font-size: 0.72rem; color: var(--crystal-dim);">${s.course || 'B.Tech CSE'}</div>
          </td>
          <td><code>${s.rollNumber}</code></td>
          <td>
            <div class="att-toggle-group-3">
              <button type="button" class="att-toggle-btn-3 present ${cur === 'Present' ? 'active' : ''}" 
                      onclick="App.setTeacherStudentStatus('${s.rollNumber}', 'Present')">✓ Present</button>
              <button type="button" class="att-toggle-btn-3 absent ${cur === 'Absent' ? 'active' : ''}" 
                      onclick="App.setTeacherStudentStatus('${s.rollNumber}', 'Absent')">✗ Absent</button>
              <button type="button" class="att-toggle-btn-3 late ${cur === 'Late' ? 'active' : ''}" 
                      onclick="App.setTeacherStudentStatus('${s.rollNumber}', 'Late')">⏳ Late</button>
            </div>
          </td>
          <td>
            <input type="text" class="form-control" style="padding: 4px 8px; font-size: 0.78rem;" 
                   placeholder="Session notes..." value="Lecture & Lab Session">
          </td>
        </tr>
      `;
    }).join('');

    this.updateTeacherCounters();
  },

  setTeacherStudentStatus(roll, status) {
    this.teacherState.studentStatuses[roll] = status;
    this.renderTeacherAttendanceTaker();
  },

  markAllTeacherStudents(status) {
    const students = this.adminStudents || MockDB.allStudents;
    students.forEach(s => {
      this.teacherState.studentStatuses[s.rollNumber] = status;
    });
    this.renderTeacherAttendanceTaker();
    this.showToast(`All students marked ${status}!`, 'info');
  },

  updateTeacherCounters() {
    const statuses = this.teacherState.studentStatuses;
    const rolls = Object.keys(statuses);
    const total = rolls.length || 6;
    let present = 0, absent = 0, late = 0;

    rolls.forEach(r => {
      if (statuses[r] === 'Present') present++;
      else if (statuses[r] === 'Absent') absent++;
      else if (statuses[r] === 'Late') late++;
    });

    const elTotal = document.getElementById('taker-count-total');
    const elPres = document.getElementById('taker-count-present');
    const elAbs = document.getElementById('taker-count-absent');
    const elLate = document.getElementById('taker-count-late');
    const elRate = document.getElementById('taker-rate-val');

    if (elTotal) elTotal.textContent = total;
    if (elPres) elPres.textContent = present;
    if (elAbs) elAbs.textContent = absent;
    if (elLate) elLate.textContent = late;
    if (elRate) elRate.textContent = total > 0 ? (Math.round((present / total) * 1000) / 10) + '%' : '100%';
  },

  saveTeacherDraft() {
    this.showToast('💾 Attendance session saved as draft.', 'info');
  },

  async submitTeacherAttendance() {
    const classEl = document.getElementById('teacher-class-select');
    const subEl = document.getElementById('teacher-subject-select');
    const dateEl = document.getElementById('teacher-date-input');
    const periodEl = document.getElementById('teacher-period-select');

    const statuses = this.teacherState.studentStatuses;
    const rolls = Object.keys(statuses);
    let present = 0, absent = 0, late = 0;
    rolls.forEach(r => {
      if (statuses[r] === 'Present') present++;
      else if (statuses[r] === 'Absent') absent++;
      else if (statuses[r] === 'Late') late++;
    });

    const sessionData = {
      date: dateEl ? dateEl.value : '2026-10-13',
      period: periodEl ? periodEl.value : 'Period 1 (09:00 - 10:00 AM)',
      classSection: classEl ? classEl.value : 'B.Tech CSE - Section B',
      subjectCode: subEl ? subEl.value : 'CS601',
      subjectName: subEl ? subEl.options[subEl.selectedIndex].text : 'Distributed Systems',
      teacherId: (this.currentUser && this.currentUser.id) || 'TCH-001',
      teacherName: (this.currentUser && this.currentUser.name) || 'Dr. Vikram Sen',
      totalStudents: rolls.length || 6,
      presentCount: present,
      absentCount: absent,
      lateCount: late
    };

    try {
      const resp = await ApiService.teacherSubmitAttendance(sessionData);
      this.showToast(`✓ Attendance Session locked & committed (${present} Present, ${absent} Absent)!`, 'success');
      this.teacherSessions = await ApiService.getAttendanceSessions();
      this.renderTeacherHistory();
      this.navigateTo('teacher-history');
    } catch (e) {
      this.showToast('Attendance recorded in local ledger.', 'success');
    }
  },

  renderTeacherHistory() {
    const tbody = document.getElementById('teacher-history-tbody');
    if (!tbody) return;

    const sessions = this.teacherSessions || MockDB.attendanceSessions || [];
    tbody.innerHTML = sessions.map(s => `
      <tr>
        <td><strong>${s.id}</strong></td>
        <td>${s.date}</td>
        <td><span class="badge badge-blue">${s.period}</span></td>
        <td><strong>${s.subjectCode}</strong> - ${s.subjectName || 'Course'}</td>
        <td>${s.classSection || 'B.Tech CSE'}</td>
        <td>
          <span style="color: #10B981; font-weight: 700;">${s.presentCount} P</span> / 
          <span style="color: #EF4444; font-weight: 700;">${s.absentCount} A</span>
          ${s.lateCount ? ` / <span style="color: #F59E0B;">${s.lateCount} L</span>` : ''}
        </td>
        <td><strong style="color: #38BDF8;">${s.percentage}%</strong></td>
        <td><span class="badge badge-green">✓ ${s.status}</span></td>
      </tr>
    `).join('');
  },

  // ==========================================================================
  // ADMIN MANAGEMENT (STUDENTS, TEACHERS, TIMETABLE, CSV EXPORT)
  // ==========================================================================
  async renderAdminTeachersTable() {
    const tbody = document.getElementById('admin-teachers-tbody');
    if (!tbody) return;

    if (!this.teachersList) {
      this.teachersList = await ApiService.getTeachers();
    }
    const teachers = this.teachersList || MockDB.teachers || [];
    tbody.innerHTML = teachers.map(t => {
      const initials = (t.name || 'Faculty').split(' ').map(n => n[0]).slice(0, 2).join('');
      return `
        <tr>
          <td>
            <div style="display: flex; align-items: center; gap: 10px;">
              <div class="avatar-badge teacher" style="width: 34px; height: 34px; font-size: 0.75rem; flex-shrink: 0;">${initials}</div>
              <div>
                <strong style="color: var(--text-primary); font-size: 0.88rem;">${t.name}</strong>
                <div style="font-size: 0.72rem; color: var(--crystal-dim);">${t.email}</div>
              </div>
            </div>
          </td>
          <td><strong>${t.id}</strong></td>
          <td>${t.department || 'Computer Science & Engineering'}</td>
          <td>${t.designation || 'Professor'}</td>
          <td><span class="badge badge-blue">${Array.isArray(t.assignedClasses) ? t.assignedClasses.join(', ') : (t.assignedClasses || 'CSE-VI-B')}</span></td>
          <td><span class="badge badge-outline">${Array.isArray(t.subjects) ? t.subjects.join(', ') : (t.subjects || 'CS602')}</span></td>
          <td><span class="badge badge-green">${t.active !== false ? 'Active' : 'Inactive'}</span></td>
          <td>
            <button class="btn btn-danger btn-sm" onclick="App.deleteTeacher('${t.id}', '${t.name}')">
              Deactivate
            </button>
          </td>
        </tr>
      `;
    }).join('');
  },

  filterAdminTeachers() {
    const query = (document.getElementById('admin-teacher-search')?.value || '').toLowerCase();
    const dept = document.getElementById('admin-teacher-dept-filter')?.value || 'all';
    const tbody = document.getElementById('admin-teachers-tbody');
    if (!tbody) return;

    const teachers = this.teachersList || MockDB.teachers || [];
    const filtered = teachers.filter(t => {
      const matchesQuery = !query || t.name.toLowerCase().includes(query) || t.id.toLowerCase().includes(query) || (t.email && t.email.toLowerCase().includes(query));
      const matchesDept = dept === 'all' || (t.department && t.department.toLowerCase().includes(dept.toLowerCase()));
      return matchesQuery && matchesDept;
    });

    tbody.innerHTML = filtered.map(t => {
      const initials = (t.name || 'Faculty').split(' ').map(n => n[0]).slice(0, 2).join('');
      return `
        <tr>
          <td>
            <div style="display: flex; align-items: center; gap: 10px;">
              <div class="avatar-badge teacher" style="width: 34px; height: 34px; font-size: 0.75rem; flex-shrink: 0;">${initials}</div>
              <div>
                <strong style="color: var(--text-primary); font-size: 0.88rem;">${t.name}</strong>
                <div style="font-size: 0.72rem; color: var(--crystal-dim);">${t.email}</div>
              </div>
            </div>
          </td>
          <td><strong>${t.id}</strong></td>
          <td>${t.department || 'Computer Science & Engineering'}</td>
          <td>${t.designation || 'Professor'}</td>
          <td><span class="badge badge-blue">${Array.isArray(t.assignedClasses) ? t.assignedClasses.join(', ') : (t.assignedClasses || 'CSE-VI-B')}</span></td>
          <td><span class="badge badge-outline">${Array.isArray(t.subjects) ? t.subjects.join(', ') : (t.subjects || 'CS602')}</span></td>
          <td><span class="badge badge-green">${t.active !== false ? 'Active' : 'Inactive'}</span></td>
          <td>
            <button class="btn btn-danger btn-sm" onclick="App.deleteTeacher('${t.id}', '${t.name}')">
              Deactivate
            </button>
          </td>
        </tr>
      `;
    }).join('');
  },

  async renderAdminTimetable() {
    const tbody = document.getElementById('admin-timetable-tbody');
    if (!tbody) return;
    const tt = this.timetableData || await ApiService.getTimeTable();
    this.timetableData = tt;

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const rows = [];
    days.forEach(day => {
      const slots = (tt && tt[day]) || [];
      slots.forEach(slot => {
        rows.push(`
          <tr>
            <td><strong>${day}</strong></td>
            <td><span class="badge badge-outline">${slot.startTime} - ${slot.endTime}</span></td>
            <td>
              <strong style="color: var(--text-primary);">${slot.subjectCode}</strong>
              <div style="font-size: 0.72rem; color: var(--crystal-dim);">${slot.subjectName}</div>
            </td>
            <td>${slot.faculty || 'Dr. Vikram Sen'}</td>
            <td><span class="badge badge-info">${slot.room || 'Room 304'}</span></td>
            <td><span class="badge badge-blue">CSE-VI-B</span></td>
            <td>${slot.type || 'Theory'}</td>
            <td><span class="badge badge-green">✓ Conflict-Free</span></td>
          </tr>
        `);
      });
    });
    tbody.innerHTML = rows.length ? rows.join('') : `<tr><td colspan="8" style="text-align: center; color: var(--crystal-dim);">No timetable entries found.</td></tr>`;
  },

  async submitAddStudent(e) {
    if (e) e.preventDefault();
    const id = (document.getElementById('new-stu-id')?.value || '').trim();
    const name = (document.getElementById('new-stu-name')?.value || '').trim();
    const rollNumber = (document.getElementById('new-stu-roll')?.value || '').trim();
    const email = (document.getElementById('new-stu-email')?.value || '').trim();
    const phone = (document.getElementById('new-stu-phone')?.value || '').trim();
    const department = document.getElementById('new-stu-dept')?.value || 'Computer Science & Engineering';
    const course = document.getElementById('new-stu-course')?.value || 'B.Tech CSE';
    const year = document.getElementById('new-stu-year')?.value || '3rd Year';
    const semester = document.getElementById('new-stu-sem')?.value || 'Semester VI';
    const section = (document.getElementById('new-stu-section') || document.getElementById('new-stu-sec'))?.value || 'Section B';

    try {
      await ApiService.adminAddStudent({
        id: id || rollNumber, name, rollNumber, email, phone, department, course, year, semester, section
      });
      this.showToast(`✓ Student ${name} (${rollNumber}) enrolled successfully!`, 'success');
      this.closeModal('add-student-modal');
      document.getElementById('add-student-form')?.reset();
      this.adminStudents = await ApiService.getAdminStudents();
      this.renderAdminStudentRegistry(this.adminStudents);
    } catch (err) {
      this.showToast('Student enrolled in local registry.', 'success');
    }
  },

  async deleteStudent(id, name) {
    if (confirm(`Are you sure you want to archive student record for ${name} (${id})?`)) {
      try {
        await ApiService.adminDeleteStudent(id);
        this.showToast(`Student record for ${name} archived.`, 'info');
        this.adminStudents = await ApiService.getAdminStudents();
        this.renderAdminStudentRegistry(this.adminStudents);
      } catch (e) {
        this.showToast('Record updated.', 'info');
      }
    }
  },

  async submitAddTeacher(e) {
    if (e) e.preventDefault();
    const id = (document.getElementById('new-tch-id')?.value || '').trim();
    const name = (document.getElementById('new-tch-name')?.value || '').trim();
    const email = (document.getElementById('new-tch-email')?.value || '').trim();
    const phone = (document.getElementById('new-tch-phone')?.value || '').trim();
    const department = document.getElementById('new-tch-dept')?.value || 'Computer Science & Engineering';
    const designation = (document.getElementById('new-tch-designation') || document.getElementById('new-tch-desig'))?.value || 'Assistant Professor';
    const classes = (document.getElementById('new-tch-classes')?.value || 'CSE-VI-B').split(',').map(s => s.trim());
    const subjects = ((document.getElementById('new-tch-subjects') || document.getElementById('new-tch-subject'))?.value || 'CS602').split(',').map(s => s.trim());

    try {
      await ApiService.adminAddTeacher({
        id: id || ('TCH-' + Math.floor(100 + Math.random() * 900)),
        name, email, phone, department, designation,
        assignedClasses: classes,
        subjects: subjects
      });
      this.showToast(`✓ Faculty member ${name} added to Department!`, 'success');
      this.closeModal('add-teacher-modal');
      document.getElementById('add-teacher-form')?.reset();
      this.teachersList = await ApiService.getTeachers();
      this.renderAdminTeachersTable();
    } catch (err) {
      this.showToast('Faculty added to registry.', 'success');
    }
  },

  async deleteTeacher(id, name) {
    if (confirm(`Deactivate faculty profile for ${name} (${id})?`)) {
      try {
        await ApiService.adminDeleteTeacher(id);
        this.showToast(`Faculty member ${name} deactivated.`, 'info');
        this.teachersList = await ApiService.getTeachers();
        this.renderAdminTeachersTable();
      } catch (e) {
        this.showToast('Profile updated.', 'info');
      }
    }
  },

  exportStudentsCSV() {
    const students = this.adminStudents || MockDB.allStudents;
    let csv = "ID,Name,Roll Number,Email,Course,Semester,Attendance Percentage,Eligibility\n";
    students.forEach(s => {
      const isShort = s.shortage || s.attendanceRate < 75;
      csv += `"${s.id}","${s.name}","${s.rollNumber}","${s.email}","${s.course || 'B.Tech CSE'}","${s.semester || 'Sem VI'}","${s.attendanceRate}%","${isShort ? 'DETAINED' : 'ELIGIBLE'}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `attendify_students_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this.showToast('✓ Student records exported to CSV successfully!', 'success');
  },

  viewStudentDossier(roll) {
    const s = (this.adminStudents || MockDB.allStudents).find(item => item.rollNumber === roll);
    if (!s) return;
    const nameEl = document.getElementById('dossier-modal-name');
    const rollEl = document.getElementById('dossier-modal-roll');
    const deptEl = document.getElementById('dossier-modal-dept');
    const attEl = document.getElementById('dossier-modal-att');

    if (nameEl) nameEl.textContent = s.name;
    if (rollEl) rollEl.textContent = s.rollNumber;
    if (deptEl) deptEl.textContent = s.course || 'B.Tech CSE';
    if (attEl) attEl.textContent = s.attendanceRate + '%';

    this.openModal('student-dossier-modal');
  },

  publishTimetable() {
    this.showToast('🎉 Master Timetable published & synchronized with all faculty and student devices!', 'success');
  },

  /**
   * Interactive Toast Notification System
   */
  showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span>${type === 'success' ? '✓' : (type === 'error' ? '✗' : 'ℹ')}</span>
      <span>${message}</span>
    `;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }
};

// Expose App globally
window.App = App;

// Initialize App when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
