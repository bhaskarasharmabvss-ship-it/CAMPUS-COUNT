/**
 * Liquid Crystal 3D SVG Chart Engine for CampusCount
 * Pure Vanilla SVG rendering with monochromatic crystal luminescence and depth
 */

const Charts = {
  /**
   * Render 3D Circular Liquid Crystal Attendance Gauge
   */
  renderGauge(elementId, percentage) {
    const el = document.getElementById(elementId);
    if (!el) return;

    const size = 180;
    const strokeWidth = 14;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const clampedPct = Math.min(100, Math.max(0, percentage));
    const offset = circumference - (clampedPct / 100) * circumference;

    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const trackColor = isLight ? 'rgba(0, 0, 0, 0.07)' : 'rgba(255, 255, 255, 0.08)';

    let strokeGradient = 'url(#crystalSafeGrad)';
    let valColor = '#34D399';
    let statusLabel = 'Optimal Standing (≥75%)';

    if (clampedPct < 75) {
      strokeGradient = 'url(#crystalAlertGrad)';
      valColor = '#F87171';
      statusLabel = 'Critical Shortage (<75%)';
    } else if (clampedPct < 80) {
      strokeGradient = 'url(#crystalWarnGrad)';
      valColor = '#FBBF24';
      statusLabel = 'Standard Standing (75-80%)';
    }

    el.innerHTML = `
      <div style="position: relative; width: ${size}px; height: ${size}px; margin: 0 auto; display: flex; align-items: center; justify-content: center; filter: drop-shadow(0 0 16px ${valColor}33);">
        <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
          <defs>
            <linearGradient id="crystalSafeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#10B981" />
              <stop offset="100%" stop-color="#34D399" />
            </linearGradient>
            <linearGradient id="crystalAlertGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#EF4444" />
              <stop offset="100%" stop-color="#F87171" />
            </linearGradient>
            <linearGradient id="crystalWarnGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#F59E0B" />
              <stop offset="100%" stop-color="#FBBF24" />
            </linearGradient>
            <filter id="crystalGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          <!-- Outer Crystal Ring Track -->
          <circle 
            cx="${size/2}" cy="${size/2}" r="${radius}" 
            fill="none" stroke="${trackColor}" stroke-width="${strokeWidth}" 
          />
          
          <!-- Luminous Progress Ring -->
          <circle 
            cx="${size/2}" cy="${size/2}" r="${radius}" 
            fill="none" stroke="${strokeGradient}" stroke-width="${strokeWidth}" 
            stroke-dasharray="${circumference}" 
            stroke-dashoffset="${offset}" 
            stroke-linecap="round"
            filter="url(#crystalGlow)"
            style="transition: stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1);"
            transform="rotate(-90 ${size/2} ${size/2})" 
          />
        </svg>

        <div style="position: absolute; text-align: center; pointer-events: none;">
          <div style="font-size: 2.1rem; font-weight: 900; letter-spacing: -0.03em; color: ${valColor}; font-family: 'Outfit', sans-serif; line-height: 1;">
            ${clampedPct.toFixed(1)}%
          </div>
          <div style="font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--crystal-muted); margin-top: 4px;">
            ${statusLabel}
          </div>
        </div>
      </div>
    `;
  },

  /**
   * Render Monthly Attendance Trend Line & Area Chart with Liquid Glow
   */
  renderTrendChart(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const width = 560;
    const height = 190;
    const padding = { top: 25, right: 30, bottom: 35, left: 45 };

    const data = [
      { label: "Jun", value: 89.2 },
      { label: "Jul", value: 86.5 },
      { label: "Aug", value: 84.0 },
      { label: "Sep", value: 82.8 },
      { label: "Oct", value: 84.5 }
    ];

    const plotWidth = width - padding.left - padding.right;
    const plotHeight = height - padding.top - padding.bottom;
    const minVal = 60;
    const maxVal = 100;

    const points = data.map((d, i) => {
      const x = padding.left + (i / (data.length - 1)) * plotWidth;
      const y = padding.top + plotHeight - ((d.value - minVal) / (maxVal - minVal)) * plotHeight;
      return { x, y, ...d };
    });

    let pathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cx = (p0.x + p1.x) / 2;
      pathD += ` C ${cx} ${p0.y}, ${cx} ${p1.y}, ${p1.x} ${p1.y}`;
    }

    const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padding.bottom} L ${points[0].x} ${height - padding.bottom} Z`;
    const y75 = padding.top + plotHeight - ((75 - minVal) / (maxVal - minVal)) * plotHeight;

    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const gridColor = isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)';
    const textColor = isLight ? '#64748B' : '#94A3B8';

    container.innerHTML = `
      <div style="position: relative; width: 100%;">
        <svg viewBox="0 0 ${width} ${height}" style="width: 100%; height: auto; display: block;">
          <defs>
            <linearGradient id="trendAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#F97316" stop-opacity="0.28" />
              <stop offset="100%" stop-color="#F97316" stop-opacity="0.0" />
            </linearGradient>
          </defs>

          <!-- 75% Cutoff threshold line -->
          <line x1="${padding.left}" y1="${y75}" x2="${width - padding.right}" y2="${y75}" stroke="#EF4444" stroke-dasharray="4 4" stroke-width="1.5" />
          <text x="${width - padding.right}" y="${y75 - 6}" fill="#EF4444" font-size="10" font-weight="700" text-anchor="end">75% Mandatory Cutoff</text>

          <!-- Grid Lines -->
          <line x1="${padding.left}" y1="${height - padding.bottom}" x2="${width - padding.right}" y2="${height - padding.bottom}" stroke="${gridColor}" stroke-width="1" />

          <!-- Filled Gradient Area -->
          <path d="${areaD}" fill="url(#trendAreaGrad)" />

          <!-- Curve in Vibrant Orange -->
          <path d="${pathD}" fill="none" stroke="#EA580C" stroke-width="3.5" stroke-linecap="round" />

          <!-- Data Points -->
          ${points.map(p => `
            <g class="chart-point" style="cursor: pointer;">
              <circle cx="${p.x}" cy="${p.y}" r="5.5" fill="#FFFFFF" stroke="#EA580C" stroke-width="3" />
              <text x="${p.x}" y="${p.y - 12}" fill="#0F172A" font-size="11" font-weight="800" text-anchor="middle">${p.value}%</text>
              <text x="${p.x}" y="${height - 12}" fill="${textColor}" font-size="11" font-weight="600" text-anchor="middle">${p.label}</text>
            </g>
          `).join('')}
        </svg>
      </div>
    `;
  },

  /**
   * Render Results SGPA/CGPA Dual Line Chart
   */
  renderResultsChart(containerId, results) {
    const container = document.getElementById(containerId);
    if (!container || !results) return;

    const width = 600;
    const height = 230;
    const padding = { top: 30, right: 30, bottom: 35, left: 45 };
    const plotWidth = width - padding.left - padding.right;
    const plotHeight = height - padding.top - padding.bottom;

    const list = [...results].reverse(); // Sem 1 to 6
    const minVal = 7.0;
    const maxVal = 10.0;

    const sgpaPoints = list.map((d, i) => {
      const x = padding.left + (i / (list.length - 1)) * plotWidth;
      const y = padding.top + plotHeight - ((d.sgpa - minVal) / (maxVal - minVal)) * plotHeight;
      return { x, y, val: d.sgpa, label: `Sem ${d.semesterNumber}` };
    });

    const cgpaPoints = list.map((d, i) => {
      const x = padding.left + (i / (list.length - 1)) * plotWidth;
      const y = padding.top + plotHeight - ((d.cgpa - minVal) / (maxVal - minVal)) * plotHeight;
      return { x, y, val: d.cgpa, label: `Sem ${d.semesterNumber}` };
    });

    const buildPath = (pts) => {
      let d = `M ${pts[0].x} ${pts[0].y}`;
      for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[i];
        const p1 = pts[i + 1];
        const cx = (p0.x + p1.x) / 2;
        d += ` C ${cx} ${p0.y}, ${cx} ${p1.y}, ${p1.x} ${p1.y}`;
      }
      return d;
    };

    container.innerHTML = `
      <div style="position: relative; width: 100%;">
        <div style="display: flex; gap: 20px; justify-content: flex-end; margin-bottom: 12px;">
          <div style="display: flex; align-items: center; gap: 6px; font-size: 0.8rem; font-weight: 700; color: var(--text-primary);">
            <span style="width: 10px; height: 10px; border-radius: 50%; background: var(--text-primary);"></span> SGPA (Term)
          </div>
          <div style="display: flex; align-items: center; gap: 6px; font-size: 0.8rem; font-weight: 700; color: #34D399;">
            <span style="width: 10px; height: 10px; border-radius: 50%; background: #34D399;"></span> CGPA (Cumulative)
          </div>
        </div>
        <svg viewBox="0 0 ${width} ${height}" style="width: 100%; height: auto;">
          ${[8.0, 8.5, 9.0, 9.5, 10.0].map(v => {
            const y = padding.top + plotHeight - ((v - minVal) / (maxVal - minVal)) * plotHeight;
            return `
              <line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" stroke="var(--border-subtle)" stroke-width="1" />
              <text x="${padding.left - 8}" y="${y + 3}" fill="var(--crystal-muted)" font-size="10" text-anchor="end">${v.toFixed(1)}</text>
            `;
          }).join('')}

          <path d="${buildPath(sgpaPoints)}" fill="none" stroke="var(--text-primary)" stroke-width="3" stroke-linecap="round" />
          <path d="${buildPath(cgpaPoints)}" fill="none" stroke="#34D399" stroke-width="3" stroke-linecap="round" />

          ${sgpaPoints.map(p => `
            <circle cx="${p.x}" cy="${p.y}" r="4.5" fill="var(--bg-deep)" stroke="var(--text-primary)" stroke-width="3" />
            <text x="${p.x}" y="${p.y - 9}" fill="var(--text-primary)" font-size="10" font-weight="800" text-anchor="middle">${p.val.toFixed(2)}</text>
            <text x="${p.x}" y="${height - 12}" fill="var(--crystal-dim)" font-size="11" font-weight="600" text-anchor="middle">${p.label}</text>
          `).join('')}

          ${cgpaPoints.map(p => `
            <circle cx="${p.x}" cy="${p.y}" r="4.5" fill="var(--bg-deep)" stroke="#34D399" stroke-width="3" />
            <text x="${p.x}" y="${p.y + 16}" fill="#34D399" font-size="10" font-weight="800" text-anchor="middle">${p.val.toFixed(2)}</text>
          `).join('')}
        </svg>
      </div>
    `;
  }
};
