/**
 * Attendance Module for Student Attendance Management System
 * Manages Subject Table, Calendar, Day Inspector Modal, and Attendance Target Simulator
 */

const AttendanceModule = {
  currentMonth: 8, // 0-indexed (8 = September)
  currentYear: 2026,
  subjectsData: [],
  logsData: [],

  init(subjects, logs) {
    this.subjectsData = subjects || [];
    this.logsData = logs || [];
    this.renderSubjectTable(this.subjectsData);
    this.renderCalendar(this.currentYear, this.currentMonth);
    this.renderLogsTable(this.logsData);
    this.initSimulator();
    this.setupFilters();
  },

  /**
   * Render Subject-Wise Attendance Table with Color-Coded Progress Bars
   */
  renderSubjectTable(subjects) {
    const tbody = document.getElementById('subject-attendance-tbody');
    if (!tbody) return;

    tbody.innerHTML = subjects.map(s => {
      const pct = s.attendancePercentage;
      const colorClass = pct >= 80 ? 'green' : (pct >= 75 ? 'amber' : 'red');
      const isShort = pct < 75;

      return `
        <tr>
          <td>
            <div style="display: flex; align-items: center; gap: 10px;">
              <div style="width: 32px; height: 32px; border-radius: 8px; background: ${isShort ? '#FEE2E2' : '#EEF2FF'}; color: ${isShort ? '#DC2626' : '#4F46E5'}; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.75rem;">
                ${s.code.substring(0, 2)}
              </div>
              <div>
                <strong style="display: block; font-size: 0.9rem; color: #0F172A;">${s.name}</strong>
                <span style="font-size: 0.75rem; color: #64748B;">Code: ${s.code} • ${s.credits} Credits</span>
              </div>
            </div>
          </td>
          <td>
            <div style="font-size: 0.85rem; font-weight: 600;">${s.faculty}</div>
            <div style="font-size: 0.72rem; color: #64748B;">${s.facultyEmail || ''}</div>
          </td>
          <td style="font-weight: 600; text-align: center;">${s.totalClasses}</td>
          <td style="color: #10B981; font-weight: 700; text-align: center;">${s.presentClasses}</td>
          <td style="color: #EF4444; font-weight: 700; text-align: center;">${s.absentClasses}</td>
          <td style="min-width: 170px;">
            <div class="progress-container">
              <div class="progress-track">
                <div class="progress-fill ${colorClass}" style="width: ${Math.min(100, pct)}%;"></div>
              </div>
              <span class="progress-pct ${colorClass}">${pct.toFixed(1)}%</span>
            </div>
          </td>
          <td>
            ${isShort 
              ? `<span class="status-pill" style="background: #FEF2F2; color: #DC2626; border: 1px solid #FECACA;" title="Needs ${s.classesNeededFor75} classes to hit 75%">
                   <span class="pulse-dot"></span> Need ${s.classesNeededFor75} classes
                 </span>`
              : `<span class="status-pill" style="background: #ECFDF5; color: #059669; border: 1px solid #A7F3D0;">
                   ✓ On Track
                 </span>`
            }
          </td>
        </tr>
      `;
    }).join('');
  },

  /**
   * Render Monthly Attendance Calendar Grid
   * Green = Present, Red = Absent, Yellow = Leave, Gray = No Class/Weekend
   */
  renderCalendar(year, month) {
    const calGrid = document.getElementById('calendar-days-grid');
    const monthTitle = document.getElementById('calendar-month-title');
    if (!calGrid) return;

    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    if (monthTitle) {
      monthTitle.textContent = `${monthNames[month]} ${year}`;
    }

    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sunday
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let html = '';

    // Empty cells before month starts
    for (let i = 0; i < firstDayIndex; i++) {
      html += `<div class="cal-day-cell empty"></div>`;
    }

    // Days in current month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayOfWeek = (firstDayIndex + day - 1) % 7;
      const isSunday = (dayOfWeek === 0);

      let statusClass = 'present';
      let badgeText = 'Present';
      let tooltip = 'Attended all scheduled classes';

      if (isSunday) {
        statusClass = 'no-class';
        badgeText = 'Weekend';
        tooltip = 'No classes scheduled';
      } else if (day === 18) {
        statusClass = 'present today';
        badgeText = 'Today';
        tooltip = 'Today (Attended 3/4 classes)';
      } else if (day === 16 || day === 12 || day === 4) {
        statusClass = 'absent';
        badgeText = 'Absent';
        tooltip = 'Missed 1 or more classes';
      } else if (day === 10 || day === 11) {
        statusClass = 'leave';
        badgeText = 'Leave';
        tooltip = 'Approved Medical Leave';
      } else if (day > 18) {
        statusClass = 'no-class';
        badgeText = 'Scheduled';
        tooltip = 'Upcoming classes';
      }

      html += `
        <div class="cal-day-cell ${statusClass}" onclick="AttendanceModule.inspectDay('${dateStr}', '${badgeText}')" title="${tooltip}">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <span class="cal-day-num">${day}</span>
            <span class="cal-badge ${statusClass}">${badgeText}</span>
          </div>
          <div style="font-size: 0.65rem; color: #64748B; margin-top: auto;">
            ${isSunday ? 'Holiday' : (day > 18 ? 'Future' : '4 Classes')}
          </div>
        </div>
      `;
    }

    calGrid.innerHTML = html;
  },

  prevMonth() {
    this.currentMonth--;
    if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear--;
    }
    this.renderCalendar(this.currentYear, this.currentMonth);
  },

  nextMonth() {
    this.currentMonth++;
    if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear++;
    }
    this.renderCalendar(this.currentYear, this.currentMonth);
  },

  /**
   * Day Inspector Modal: Shows classes on that specific day
   */
  inspectDay(dateStr, status) {
    const modal = document.getElementById('day-inspector-modal');
    const content = document.getElementById('day-inspector-content');
    const title = document.getElementById('day-inspector-title');

    if (!modal || !content) return;

    title.textContent = `Attendance Log: ${dateStr}`;

    const dayLogs = this.logsData.filter(l => l.date === dateStr);

    if (dayLogs.length > 0) {
      content.innerHTML = `
        <div style="display: flex; gap: 8px; margin-bottom: 16px;">
          <span class="status-pill ${status.toLowerCase()}">${status}</span>
          <span style="font-size: 0.85rem; color: #64748B;">Total Sessions: ${dayLogs.length}</span>
        </div>
        <div class="schedule-list">
          ${dayLogs.map(l => `
            <div class="schedule-card">
              <div class="schedule-meta-left">
                <div class="schedule-time-badge">
                  <div class="time-start">${l.classTime.split(' - ')[0]}</div>
                  <div class="time-end">${l.classTime.split(' - ')[1]}</div>
                </div>
                <div class="schedule-info">
                  <h4>${l.subjectName} (${l.subjectCode})</h4>
                  <p>Faculty: ${l.faculty} • Remarks: ${l.remarks}</p>
                </div>
              </div>
              <div>
                <span class="status-pill ${l.status.toLowerCase()}">${l.status}</span>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    } else {
      content.innerHTML = `
        <div style="text-align: center; padding: 24px; color: #64748B;">
          <p style="font-size: 0.95rem; font-weight: 600;">No manual class log recorded for ${dateStr}</p>
          <p style="font-size: 0.82rem; margin-top: 4px;">Classes followed standard timetable distribution.</p>
        </div>
      `;
    }

    modal.classList.add('active');
  },

  /**
   * Render Class-by-Class Attendance Logs Table
   */
  renderLogsTable(logs) {
    const tbody = document.getElementById('attendance-logs-tbody');
    if (!tbody) return;

    tbody.innerHTML = logs.map(l => {
      const statusPill = l.status === 'Present' 
        ? '<span class="status-pill" style="background:#ECFDF5; color:#059669; border:1px solid #A7F3D0;">Present</span>'
        : (l.status === 'Absent' 
          ? '<span class="status-pill" style="background:#FEF2F2; color:#DC2626; border:1px solid #FECACA;">Absent</span>'
          : '<span class="status-pill" style="background:#FFFBEB; color:#D97706; border:1px solid #FDE68A;">Leave</span>');

      return `
        <tr>
          <td><strong style="color: #0F172A;">${l.date}</strong></td>
          <td>
            <div style="font-weight: 600;">${l.subjectName}</div>
            <div style="font-size: 0.75rem; color: #64748B;">${l.subjectCode}</div>
          </td>
          <td style="color: #475569; font-size: 0.85rem;">${l.classTime}</td>
          <td>${l.faculty}</td>
          <td>${statusPill}</td>
          <td style="font-size: 0.8rem; color: #64748B;">${l.remarks || 'Regular Session'}</td>
        </tr>
      `;
    }).join('');
  },

  /**
   * Interactive Filters Setup
   */
  setupFilters() {
    const subSelect = document.getElementById('filter-subject-select');
    const statusSelect = document.getElementById('filter-status-select');

    const applyFilter = () => {
      const subVal = subSelect ? subSelect.value : 'ALL';
      const statusVal = statusSelect ? statusSelect.value : 'ALL';

      let filtered = [...this.logsData];
      if (subVal !== 'ALL') {
        filtered = filtered.filter(l => l.subjectCode === subVal);
      }
      if (statusVal !== 'ALL') {
        filtered = filtered.filter(l => l.status === statusVal);
      }
      this.renderLogsTable(filtered);
    };

    if (subSelect) subSelect.addEventListener('change', applyFilter);
    if (statusSelect) statusSelect.addEventListener('change', applyFilter);
  },

  /**
   * Attendance Simulator Widget
   * Lets student simulate: "If I attend next X classes, what will my % be?"
   */
  initSimulator() {
    const subSelect = document.getElementById('sim-subject-select');
    const attendInput = document.getElementById('sim-attend-slider');
    const attendLabel = document.getElementById('sim-attend-val');
    const resultBox = document.getElementById('sim-result-box');

    if (!subSelect || !attendInput) return;

    // Populate subjects in simulator
    subSelect.innerHTML = `<option value="ALL">Overall Attendance (All Subjects)</option>` + 
      this.subjectsData.map(s => `<option value="${s.id}">${s.name} (${s.attendancePercentage}%)</option>`).join('');

    const updateSimulation = () => {
      const selectedId = subSelect.value;
      const upcomingAttend = parseInt(attendInput.value);
      attendLabel.textContent = `Attend ${upcomingAttend} classes`;

      let totalP = 0, totalT = 0, name = "Overall Attendance";

      if (selectedId === 'ALL') {
        totalT = this.subjectsData.reduce((acc, s) => acc + s.totalClasses, 0);
        totalP = this.subjectsData.reduce((acc, s) => acc + s.presentClasses, 0);
      } else {
        const sub = this.subjectsData.find(s => s.id === selectedId);
        if (sub) {
          totalT = sub.totalClasses;
          totalP = sub.presentClasses;
          name = sub.name;
        }
      }

      const currentPct = ((totalP / totalT) * 100);
      const newTotal = totalT + upcomingAttend;
      const newPresent = totalP + upcomingAttend;
      const projectedPct = ((newPresent / newTotal) * 100);

      const diff = (projectedPct - currentPct).toFixed(1);
      const isSafe = projectedPct >= 75;

      resultBox.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <div>
            <div style="font-size: 0.8rem; color: #64748B;">Projected for ${name}</div>
            <div style="font-size: 1.6rem; font-weight: 800; color: ${isSafe ? '#10B981' : '#EF4444'};">
              ${projectedPct.toFixed(1)}%
              <span style="font-size: 0.8rem; color: #10B981; font-weight: 600;">(+${diff}%)</span>
            </div>
          </div>
          <div>
            <span class="status-pill" style="background: ${isSafe ? '#ECFDF5' : '#FEF2F2'}; color: ${isSafe ? '#059669' : '#DC2626'}; border: 1px solid ${isSafe ? '#A7F3D0' : '#FECACA'};">
              ${isSafe ? '✓ Safe (>= 75%)' : '⚠ Still below 75%'}
            </span>
          </div>
        </div>
      `;
    };

    subSelect.addEventListener('change', updateSimulation);
    attendInput.addEventListener('input', updateSimulation);
    updateSimulation();
  }
};
