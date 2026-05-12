// ============================================================
// SkillMap AI — Application Logic (app.js)
// ============================================================

let lastAnalysis = null;
let clusterChart = null;

// ── Navigation ──────────────────────────────────────────────
function navigateTo(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const page = document.getElementById('page-' + pageId);
  if (page) { page.classList.add('active'); page.style.display = 'block'; }
  document.querySelectorAll('.page:not(.active)').forEach(p => p.style.display = 'none');
  const nav = document.querySelector(`.nav-item[data-page="${pageId}"]`);
  if (nav) nav.classList.add('active');
  if (pageId === 'skill-insights' && lastAnalysis) renderInsights(lastAnalysis);
  document.getElementById('sidebar').classList.remove('open');
}

// ── Init ────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderQuickChips();
  document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
  document.getElementById('page-career-match').style.display = 'block';
  document.getElementById('mobileToggle').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
  });
});

// ── Quick-Add Chips ─────────────────────────────────────────
function renderQuickChips() {
  const container = document.getElementById('quickChips');
  container.innerHTML = quickAddSkills.map(s =>
    `<span class="chip" onclick="addChipSkill(this, '${s}')">${s}</span>`
  ).join('');
}

function addChipSkill(el, skill) {
  const ta = document.getElementById('careerInput');
  const current = ta.value.trim();
  if (el.classList.contains('active')) {
    el.classList.remove('active');
    ta.value = current.split(',').map(s=>s.trim()).filter(s=>s.toLowerCase()!==skill.toLowerCase()).join(', ');
  } else {
    el.classList.add('active');
    ta.value = current ? current + ', ' + skill : skill;
  }
  updateDetectedCount();
}

function updateDetectedCount() {
  const text = document.getElementById('careerInput').value;
  const tokens = MLEngine.normalize(MLEngine.tokenize(text));
  document.getElementById('detectedCount').textContent = tokens.length > 0 ? `${tokens.length} skill(s) detected` : '';
}

document.addEventListener('DOMContentLoaded', () => {
  const ci = document.getElementById('careerInput');
  if (ci) ci.addEventListener('input', updateDetectedCount);
});

// ── Career Analysis ─────────────────────────────────────────
function runCareerAnalysis() {
  const text = document.getElementById('careerInput').value.trim();
  if (!text) { showToast('Please enter your skills and experience first.'); return; }
  const btn = document.getElementById('analyzeBtn');
  btn.disabled = true; btn.innerHTML = '<span class="loading-spinner" style="width:18px;height:18px;border-width:2px;margin:0"></span> Analyzing...';
  setTimeout(() => {
    lastAnalysis = MLEngine.analyzeProfile(text);
    renderCareerResults(lastAnalysis);
    btn.disabled = false; btn.innerHTML = '🚀 Analyze Profile';
  }, 600);
}

function clearCareerInput() {
  document.getElementById('careerInput').value = '';
  document.getElementById('careerResults').innerHTML = '';
  document.getElementById('detectedCount').textContent = '';
  document.querySelectorAll('#quickChips .chip').forEach(c => c.classList.remove('active'));
  lastAnalysis = null;
}

// ── Render Career Results ───────────────────────────────────
function renderCareerResults(analysis) {
  const c = document.getElementById('careerResults');
  const top = analysis.ranked[0];
  let html = `
    <div class="card mb-lg" style="animation:fadeUp .3s ease forwards">
      <div class="flex items-center justify-between" style="flex-wrap:wrap;gap:16px">
        <div>
          <div class="text-xs text-muted">ANALYSIS SUMMARY</div>
          <div class="font-bold" style="font-size:1.1rem;margin-top:4px">${analysis.totalSkillsDetected} skills detected across ${Object.keys(analysis.clusterCoverage).filter(k=>analysis.clusterCoverage[k].matched>0).length} clusters</div>
        </div>
        <div class="flex gap-lg" style="flex-wrap:wrap">
          ${renderMiniStat('Skills Found', analysis.totalSkillsDetected, '--accent-secondary')}
          ${renderMiniStat('Best Match', top.score + '%', '--success')}
          ${renderMiniStat('Top Role', top.role.icon + ' ' + top.role.name, '--warning')}
        </div>
      </div>
    </div>
    <h2 style="font-size:1.1rem;font-weight:700;margin-bottom:16px">🏆 Ranked Career Matches</h2>`;
  
  analysis.ranked.forEach((r, i) => {
    const delay = (i * 0.08) + 0.2;
    html += `
    <div class="result-card ${i===0?'top-match':''} mb-md relative" style="animation-delay:${delay}s">
      <div class="flex items-center justify-between" style="flex-wrap:wrap;gap:12px">
        <div class="flex items-center gap-md">
          <div style="font-size:2rem">${r.role.icon}</div>
          <div>
            <div class="font-bold" style="font-size:1rem">${r.role.name}</div>
            <div class="text-sm text-secondary">${r.role.description}</div>
            <div class="text-xs text-muted mt-sm">${r.role.cluster} · ${r.matchedCount}/${r.totalSkills} skills matched</div>
          </div>
        </div>
        <div class="text-center">
          ${renderScoreRing(r.score, 70)}
          <div class="text-xs text-muted" style="margin-top:4px">Match</div>
        </div>
      </div>
      <div class="mt-md">
        <div class="progress-bar"><div class="progress-fill" style="width:${r.coverage}%"></div></div>
        <div class="text-xs text-muted mt-sm">${r.coverage}% skill coverage</div>
      </div>
      <div class="mt-md flex gap-sm" style="flex-wrap:wrap">
        ${r.matchedSkills.slice(0,8).map(s=>`<span class="skill-tag matched">✓ ${cap(s)}</span>`).join('')}
        ${r.missingSkills.slice(0,4).map(s=>`<span class="skill-tag missing">✗ ${cap(s)}</span>`).join('')}
        ${r.missingSkills.length>4?`<span class="skill-tag missing">+${r.missingSkills.length-4} more</span>`:''}
      </div>
      ${i===0?renderRoadmapSection(analysis.gapAnalysis):''}
    </div>`;
  });
  c.innerHTML = html;
}

function renderMiniStat(label, value, colorVar) {
  return `<div style="text-align:center"><div class="text-xs text-muted">${label}</div><div class="font-bold" style="color:var(${colorVar});margin-top:2px">${value}</div></div>`;
}

function renderScoreRing(score, size) {
  const r = (size/2) - 5, c = 2*Math.PI*r, offset = c - (c * score/100);
  const color = score >= 70 ? 'var(--success)' : score >= 40 ? 'var(--warning)' : 'var(--danger)';
  return `<div class="score-ring" style="width:${size}px;height:${size}px">
    <svg width="${size}" height="${size}"><circle class="ring-bg" cx="${size/2}" cy="${size/2}" r="${r}"/><circle class="ring-fill" cx="${size/2}" cy="${size/2}" r="${r}" style="stroke:${color};stroke-dasharray:${c};stroke-dashoffset:${offset}"/></svg>
    <div class="score-value" style="font-size:${size/5}px;color:${color}">${score}%</div>
  </div>`;
}

function renderRoadmapSection(gap) {
  if (!gap || !gap.roadmap || gap.roadmap.length === 0) return '';
  let html = `<div class="mt-lg" style="border-top:1px solid var(--border-color);padding-top:16px">
    <div class="font-bold mb-md">📚 Learning Roadmap for ${gap.roleName}</div>`;
  gap.roadmap.forEach(phase => {
    html += `<div class="roadmap-phase">
      <div class="phase-title">Phase ${phase.phase}: ${phase.title}</div>
      <div class="phase-duration">⏱ ${phase.duration}</div>
      <div class="flex gap-sm" style="flex-wrap:wrap">
        ${phase.skills.map(s => `<span class="skill-tag ${s.importance>=0.8?'critical':s.importance>=0.6?'missing':'extra'}">${cap(s.name)} (${Math.round(s.importance*100)}%)</span>`).join('')}
      </div>
    </div>`;
  });
  return html + '</div>';
}

// ── Job Match ───────────────────────────────────────────────
function runJobMatch() {
  const resume = document.getElementById('resumeInput').value.trim();
  const jd = document.getElementById('jdInput').value.trim();
  if (!resume || !jd) { showToast('Please fill in both your resume and the job description.'); return; }
  const btn = document.getElementById('jobMatchBtn');
  btn.disabled = true; btn.innerHTML = '<span class="loading-spinner" style="width:18px;height:18px;border-width:2px;margin:0"></span> Comparing...';
  setTimeout(() => {
    const result = MLEngine.resumeJobMatch(resume, jd);
    renderJobMatchResults(result);
    btn.disabled = false; btn.innerHTML = '🔍 Compare Match';
  }, 600);
}

function clearJobMatch() {
  document.getElementById('resumeInput').value = '';
  document.getElementById('jdInput').value = '';
  document.getElementById('jobMatchResults').innerHTML = '';
  document.getElementById('jmStatus').textContent = '';
}

function renderJobMatchResults(result) {
  const c = document.getElementById('jobMatchResults');
  const scoreColor = result.score >= 70 ? '--success' : result.score >= 40 ? '--warning' : '--danger';
  let html = `
    <div class="grid-3 mb-lg">
      <div class="card text-center" style="animation:fadeUp .3s ease forwards">
        ${renderScoreRing(result.score, 90)}
        <div class="font-bold mt-md">Match Score</div>
        <div class="text-sm text-secondary">Cosine similarity</div>
      </div>
      <div class="card text-center" style="animation:fadeUp .4s ease forwards">
        <div style="font-size:2.2rem;font-weight:800;color:var(--success)">${result.overlapCount}</div>
        <div class="font-bold mt-sm">Matched Keywords</div>
        <div class="text-sm text-secondary">of ${result.totalJDSkills} required</div>
      </div>
      <div class="card text-center" style="animation:fadeUp .5s ease forwards">
        <div style="font-size:2.2rem;font-weight:800;color:var(--danger)">${result.missingKeywords.length}</div>
        <div class="font-bold mt-sm">Missing Keywords</div>
        <div class="text-sm text-secondary">${result.coveragePercent}% JD coverage</div>
      </div>
    </div>`;

  // Tabs
  html += `<div class="tab-bar">
    <button class="tab-btn active" onclick="switchTab(this,'jm-matched')">✓ Matched (${result.matchedKeywords.length})</button>
    <button class="tab-btn" onclick="switchTab(this,'jm-missing')">✗ Missing (${result.missingKeywords.length})</button>
    <button class="tab-btn" onclick="switchTab(this,'jm-suggestions')">💡 Suggestions (${result.suggestions.length})</button>
  </div>`;

  // Matched tab
  html += `<div class="tab-panel active" id="jm-matched"><div class="card"><div class="chip-container">
    ${result.matchedKeywords.map(k=>`<span class="skill-tag matched">✓ ${cap(k)}</span>`).join('')}
    ${result.matchedKeywords.length===0?'<div class="text-muted">No matching keywords found.</div>':''}
  </div></div></div>`;

  // Missing tab
  html += `<div class="tab-panel" id="jm-missing"><div class="card">`;
  if (Object.keys(result.missingByCluster).length > 0) {
    Object.entries(result.missingByCluster).forEach(([cluster, skills]) => {
      html += `<div class="mb-md"><div class="text-xs text-muted font-bold" style="margin-bottom:6px">${cluster}</div>
        <div class="chip-container">${skills.map(s=>`<span class="skill-tag missing">✗ ${cap(s)}</span>`).join('')}</div></div>`;
    });
  } else {
    html += '<div class="text-muted">No missing keywords — perfect match!</div>';
  }
  html += `</div></div>`;

  // Suggestions tab
  html += `<div class="tab-panel" id="jm-suggestions">`;
  result.suggestions.forEach(s => {
    html += `<div class="suggestion-card ${s.type}">
      <div class="font-bold">${s.icon} ${s.title}</div>
      <div class="text-sm text-secondary mt-sm">${s.description}</div>
      <ul class="suggestion-actions">${s.actions.map(a=>`<li>${a}</li>`).join('')}</ul>
    </div>`;
  });
  if (result.suggestions.length === 0) html += '<div class="card text-muted text-center" style="padding:32px">No specific suggestions at this time.</div>';
  html += `</div>`;

  c.innerHTML = html;
}

function switchTab(btn, panelId) {
  const parent = btn.closest('.tab-bar');
  parent.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  let sibling = parent.nextElementSibling;
  while (sibling && sibling.classList.contains('tab-panel')) {
    sibling.classList.remove('active'); sibling.style.display = 'none';
    sibling = sibling.nextElementSibling;
  }
  const panel = document.getElementById(panelId);
  if (panel) { panel.classList.add('active'); panel.style.display = 'block'; }
}

// ── Skill Insights ──────────────────────────────────────────
function renderInsights(analysis) {
  const c = document.getElementById('insightsContent');
  const cc = analysis.clusterCoverage;

  let html = `<div class="grid-2 mb-lg">
    <div class="card" style="animation:fadeUp .3s ease forwards">
      <div class="card-title mb-md">🗂 Cluster Coverage</div>
      <canvas id="clusterChartCanvas" height="260"></canvas>
    </div>
    <div class="card" style="animation:fadeUp .4s ease forwards">
      <div class="card-title mb-md">📈 Coverage Breakdown</div>`;
  
  const colors = {'Programming Languages':'#6366f1','Web Development':'#8b5cf6','Data Science & ML':'#06b6d4','Cloud & DevOps':'#f59e0b','Databases':'#22c55e','Soft Skills & Tools':'#ec4899'};
  Object.entries(cc).forEach(([cluster, data]) => {
    const color = colors[cluster] || '#6366f1';
    html += `<div class="mb-md">
      <div class="flex justify-between items-center text-sm"><span>${cluster}</span><span class="font-bold" style="color:${color}">${data.matched}/${data.total}</span></div>
      <div class="progress-bar mt-sm"><div class="progress-fill" style="width:${data.percent}%;background:${color}"></div></div>
    </div>`;
  });
  html += `</div></div>`;

  // Detected vs Missing grouped
  html += `<div class="card mb-lg" style="animation:fadeUp .5s ease forwards">
    <div class="card-title mb-md">🔍 Detected vs. Missing Skills</div>
    <div class="grid-2">`;
  Object.entries(cc).forEach(([cluster, data]) => {
    if (data.matched === 0 && data.missingSkills.length === 0) return;
    html += `<div class="mb-md" style="padding:12px;background:var(--bg-input);border-radius:var(--radius-md)">
      <div class="text-sm font-bold mb-sm">${cluster}</div>
      <div class="chip-container">
        ${data.matchedSkills.map(s=>`<span class="skill-tag matched">✓ ${cap(s)}</span>`).join('')}
        ${data.missingSkills.map(s=>`<span class="skill-tag missing" style="opacity:0.6">✗ ${cap(s)}</span>`).join('')}
      </div>
    </div>`;
  });
  html += `</div></div>`;

  // Role distribution
  if (analysis.ranked) {
    html += `<div class="card" style="animation:fadeUp .6s ease forwards">
      <div class="card-title mb-md">🏅 Role Match Distribution</div>
      <canvas id="roleDistChart" height="200"></canvas>
    </div>`;
  }

  c.innerHTML = html;

  // Render cluster chart
  setTimeout(() => {
    const ctx = document.getElementById('clusterChartCanvas');
    if (ctx) {
      if (clusterChart) clusterChart.destroy();
      const labels = Object.keys(cc);
      const data = labels.map(l => cc[l].percent);
      const bgColors = labels.map(l => colors[l] || '#6366f1');
      clusterChart = new Chart(ctx, {
        type: 'bar',
        data: { labels: labels.map(l => l.length > 15 ? l.slice(0,15)+'…' : l), datasets: [{ label: 'Coverage %', data, backgroundColor: bgColors.map(c => c + '99'), borderColor: bgColors, borderWidth: 2, borderRadius: 6 }] },
        options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, max: 100, ticks: { color: '#94a3b8' }, grid: { color: 'rgba(99,102,241,0.08)' } }, x: { ticks: { color: '#94a3b8', maxRotation: 45 }, grid: { display: false } } } }
      });
    }
    // Role distribution chart
    const rdCtx = document.getElementById('roleDistChart');
    if (rdCtx && analysis.ranked) {
      new Chart(rdCtx, {
        type: 'bar',
        data: { labels: analysis.ranked.map(r => r.role.icon + ' ' + r.role.name), datasets: [{ label: 'Match %', data: analysis.ranked.map(r => r.score), backgroundColor: analysis.ranked.map((r,i) => i===0 ? '#6366f199' : '#64748b66'), borderColor: analysis.ranked.map((r,i) => i===0 ? '#6366f1' : '#64748b'), borderWidth: 1, borderRadius: 4 }] },
        options: { indexAxis: 'y', responsive: true, plugins: { legend: { display: false } }, scales: { x: { beginAtZero: true, max: 100, ticks: { color: '#94a3b8' }, grid: { color: 'rgba(99,102,241,0.08)' } }, y: { ticks: { color: '#94a3b8', font: { size: 11 } }, grid: { display: false } } } }
      });
    }
  }, 100);
}



// ── Helpers ──────────────────────────────────────────────────
function cap(s) { return MLEngine.capitalize(s); }

function showToast(msg) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.style.cssText = 'position:fixed;bottom:24px;right:24px;background:var(--bg-card);border:1px solid var(--border-hover);color:var(--text-primary);padding:12px 20px;border-radius:12px;font-size:0.875rem;z-index:999;box-shadow:0 8px 32px rgba(0,0,0,0.4);transition:opacity .3s ease;';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  setTimeout(() => { toast.style.opacity = '0'; }, 3000);
}
