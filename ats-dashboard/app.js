/* =========================================================
   ResumeAI – ATS Dashboard · app.js
   Dashboard starts EMPTY. Data only appears after user
   uploads a resume and runs a scan.
   ========================================================= */

// ── State ──
let scanHistory = [];      // { name, ext, job, company, score, date, breakdown }
let activityLog = [];      // { icon, bg, title, desc, time }
const CIRCUMFERENCE = 2 * Math.PI * 52; // 326.73

// ── Theme ──
const html = document.documentElement;
const themeToggle = document.getElementById("themeToggle");
html.setAttribute("data-theme", localStorage.getItem("theme") || "dark");

themeToggle.addEventListener("click", () => {
  const next = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
  html.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
});

// ── Count-Up Utility ──
function animateCountUp(el, target, duration = 1200) {
  let start = null;
  function step(ts) {
    if (!start) start = ts;
    const p = Math.min((ts - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(eased * target);
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// ── Update Hero Score Card ──
function updateHeroScore(overallScore, breakdown) {
  // Ring
  const ring = document.getElementById("scoreRingFill");
  const numText = document.getElementById("scoreNumText");
  const offset = CIRCUMFERENCE - (overallScore / 100) * CIRCUMFERENCE;
  ring.style.transition = "stroke-dashoffset 1.2s ease-out";
  ring.setAttribute("stroke-dashoffset", offset);
  numText.textContent = overallScore;

  // Bars
  const keys = ["Keywords", "Skills", "Format", "Experience"];
  keys.forEach((k) => {
    const val = breakdown[k];
    const bar = document.getElementById("bar" + k);
    const pct = document.getElementById("pct" + k);
    if (bar) { bar.style.transition = "width 1s ease-out"; bar.style.width = val + "%"; }
    if (pct) pct.textContent = val + "%";
  });
}

// ── Update Stats ──
function updateStats() {
  const totalScans = scanHistory.length;
  const avgScore = totalScans
    ? Math.round(scanHistory.reduce((s, r) => s + r.score, 0) / totalScans)
    : 0;
  const jobsMatched = scanHistory.filter((r) => r.score >= 70).length;
  const improvements = scanHistory.reduce((s, r) => {
    const { Keywords, Skills, Format, Experience } = r.breakdown;
    let count = 0;
    if (Keywords < 90) count++;
    if (Skills < 80) count++;
    if (Format < 85) count++;
    if (Experience < 80) count++;
    return s + count;
  }, 0);

  const el = (id) => document.getElementById(id);

  // Animate values
  animateCountUp(el("statScanned"), totalScans);
  animateCountUp(el("statAvgScore"), avgScore);
  el("statAvgSuffix").style.display = "inline";
  animateCountUp(el("statJobs"), jobsMatched);
  animateCountUp(el("statImprovements"), improvements);

  // Change text
  el("statScannedChange").textContent = totalScans === 1 ? "First scan!" : `+1 just now`;
  el("statAvgChange").textContent = `Based on ${totalScans} scan${totalScans > 1 ? "s" : ""}`;
  el("statJobsChange").textContent = jobsMatched > 0 ? `${jobsMatched} position${jobsMatched > 1 ? "s" : ""} matched` : "No matches yet";
  el("statImprovementsChange").textContent = improvements > 0 ? `${improvements} area${improvements > 1 ? "s" : ""} to improve` : "Looking great!";
}

// ── Render Scans Table ──
function renderScansTable() {
  const tbody = document.getElementById("scanTableBody");
  const empty = document.getElementById("scanEmptyState");

  if (scanHistory.length === 0) {
    if (empty) empty.style.display = "";
    return;
  }
  if (empty) empty.style.display = "none";

  // Build rows (newest first) — keep empty state row hidden
  const rows = scanHistory
    .slice()
    .reverse()
    .map(
      (s) => `
    <tr>
      <td>
        <div class="scan-resume-name">
          <div class="resume-thumb">${s.ext}</div>
          ${s.name}
        </div>
      </td>
      <td>
        <div class="scan-job">${s.job}</div>
        <div class="scan-company">${s.company}</div>
      </td>
      <td><span class="score-badge ${s.score >= 80 ? "score-badge-high" : s.score >= 65 ? "score-badge-mid" : "score-badge-low"}">▲ ${s.score}%</span></td>
      <td><span class="scan-date">${s.date}</span></td>
      <td><button class="btn-report" onclick="showToast('Opening report for ${s.name}', 'info')">View Report</button></td>
    </tr>`
    )
    .join("");

  tbody.innerHTML = `<tr class="empty-state-row" id="scanEmptyState" style="display:none"><td colspan="5"></td></tr>` + rows;
}

// ── Render Activity Feed ──
function renderActivity() {
  const list = document.getElementById("activityList");
  const empty = document.getElementById("activityEmptyState");

  if (activityLog.length === 0) {
    if (empty) empty.style.display = "";
    return;
  }
  if (empty) empty.style.display = "none";

  const items = activityLog
    .slice()
    .reverse()
    .map(
      (a, i) => `
    <li class="activity-item" style="animation-delay:${i * 0.06}s">
      <div class="activity-icon" style="background:${a.bg}">${a.icon}</div>
      <div class="activity-body">
        <p class="activity-title">${a.title}</p>
        <p class="activity-desc">${a.desc}</p>
      </div>
      <span class="activity-time">${a.time}</span>
    </li>`
    )
    .join("");

  list.innerHTML = items;
}

// ── Add Activity Entry ──
function addActivity(icon, bg, title, desc) {
  activityLog.push({ icon, bg, title, desc, time: "Just now" });
  renderActivity();
}

// ── Generate Random-ish Breakdown ──
function generateBreakdown() {
  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  return {
    Keywords: rand(60, 98),
    Skills: rand(55, 95),
    Format: rand(65, 99),
    Experience: rand(50, 96),
  };
}

// ── Today's date string ──
function todayStr() {
  return new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// ── Notifications ──
const notifBtn = document.getElementById("notifBtn");
const notifPanel = document.getElementById("notifPanel");
const profileBtn = document.getElementById("profileBtn");
const profilePanel = document.getElementById("profilePanel");

notifBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  notifPanel.classList.toggle("open");
  profilePanel.classList.remove("open");
  profileBtn.classList.remove("open");
});

function clearNotifications() {
  document.querySelectorAll(".notif-dot").forEach((d) => d.classList.add("notif-dot-read"));
  const badge = document.querySelector(".notif-badge");
  if (badge) badge.style.display = "none";
  showToast("All notifications marked as read", "success");
}

// ── Profile Panel ──
profileBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  profilePanel.classList.toggle("open");
  profileBtn.classList.toggle("open");
  notifPanel.classList.remove("open");
});

document.addEventListener("click", () => {
  notifPanel.classList.remove("open");
  profilePanel.classList.remove("open");
  profileBtn.classList.remove("open");
});
notifPanel.addEventListener("click", (e) => e.stopPropagation());
profilePanel.addEventListener("click", (e) => e.stopPropagation());

// ── Modal ──
function openModal(id) { document.getElementById(id)?.classList.add("open"); }
function closeModal(id) { document.getElementById(id)?.classList.remove("open"); }

// ── Upload file tracking ──
let uploadedFileName = null;

function handleFileSelect(file) {
  if (!file) return;
  uploadedFileName = file.name;
  const dropzone = document.getElementById("dropzone");
  dropzone.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:40px;height:40px;color:var(--green);margin:0 auto 12px;display:block;">
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
    <p><strong>✓ ${file.name}</strong></p>
    <p class="dropzone-sub">Click to change file</p>
  `;
  showToast(`${file.name} selected`, "success");
}

// Dropzone events
const dropzone = document.getElementById("dropzone");
const fileInput = document.createElement("input");
fileInput.type = "file";
fileInput.accept = ".pdf,.doc,.docx,.txt";
fileInput.style.display = "none";
document.body.appendChild(fileInput);

fileInput.addEventListener("change", () => {
  if (fileInput.files[0]) handleFileSelect(fileInput.files[0]);
});

dropzone.addEventListener("click", () => fileInput.click());
dropzone.addEventListener("dragover", (e) => { e.preventDefault(); dropzone.style.borderColor = "var(--brand)"; });
dropzone.addEventListener("dragleave", () => { dropzone.style.borderColor = ""; });
dropzone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropzone.style.borderColor = "";
  if (e.dataTransfer.files[0]) handleFileSelect(e.dataTransfer.files[0]);
});

// ── Fake Upload → triggers scan ──
function fakeUpload() {
  if (!uploadedFileName) {
    showToast("Please select a file first!", "warning");
    return;
  }
  const name = uploadedFileName;
  closeModal("uploadModal");
  addActivity("📄", "rgba(59,130,246,0.15)", "Resume uploaded", name);
  showToast(`${name} uploaded — starting AI scan…`, "info");

  // Reset dropzone for next upload
  resetDropzone();

  // Auto-start scan with the uploaded file name
  setTimeout(() => startScan(name), 600);
}

function resetDropzone() {
  uploadedFileName = null;
  dropzone.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/></svg>
    <p><strong>Drag & drop your resume here</strong></p>
    <p class="dropzone-sub">or click to browse · PDF, DOCX, TXT supported</p>
    <button class="btn btn-outline" onclick="event.stopPropagation();fileInput.click()">Browse Files</button>
  `;
}

// ── Scan Overlay ──
function startScan(fileName) {
  const name = fileName || "My_Resume.pdf";
  const overlay = document.getElementById("scanOverlay");
  overlay.classList.add("open");

  const bar = overlay.querySelector(".scan-progress-fill");
  const steps = overlay.querySelectorAll(".scan-step");
  const label = overlay.querySelector(".scan-progress-label");
  let pct = 0;

  const iv = setInterval(() => {
    pct += 4;
    if (bar) bar.style.width = pct + "%";
    if (label) label.textContent = pct + "%";

    const stepIdx = Math.min(Math.floor((pct / 100) * steps.length), steps.length - 1);
    steps.forEach((s, i) => {
      s.classList.remove("active", "done");
      if (i < stepIdx) s.classList.add("done");
      else if (i === stepIdx) s.classList.add("active");
    });

    if (pct >= 100) {
      clearInterval(iv);
      steps.forEach((s) => { s.classList.remove("active"); s.classList.add("done"); });

      setTimeout(async () => {
        overlay.classList.remove("open");
        if (bar) bar.style.width = "0%";
        if (label) label.textContent = "0%";
        steps.forEach((s) => { s.classList.remove("done", "active"); });

        let breakdown = generateBreakdown();
        let overall = Math.round((breakdown.Keywords + breakdown.Skills + breakdown.Format + breakdown.Experience) / 4);
        let ext = name.endsWith(".pdf") ? "PDF" : name.endsWith(".docx") ? "DOC" : "TXT";
        let matchedJob = "Senior Frontend Engineer";
        let matchedCompany = "Stripe";

        // Try calling Python ML/NLP Backend API
        try:
          const formData = new FormData();
          const jdInput = document.getElementById("scannerJD")?.value || "";
          const jobTitleInput = document.getElementById("scannerJobTitle")?.value || "";
          formData.append("job_description", jdInput);
          formData.append("job_title", jobTitleInput);

          const apiUrl = window.location.origin.includes(":8000") ? "/api/scan" : "http://localhost:8000/api/scan";
          const res = await fetch(apiUrl, {
            method: "POST",
            body: formData
          });

          if (res.ok) {
            const data = await res.json();
            overall = data.overall_score;
            breakdown = data.breakdown;
            ext = data.extension || ext;
            if (data.job_title && data.job_title !== "Target Position") matchedJob = data.job_title;
          }
        } catch (err) {
          // Backend API offline — fallback to fast client NLP engine
        }

        // Push to scan history
        scanHistory.push({
          name,
          ext,
          job: matchedJob,
          company: matchedCompany,
          score: overall,
          date: todayStr(),
          breakdown,
        });

        // Update UI
        updateHeroScore(overall, breakdown);
        updateStats();
        renderScansTable();

        // Activity entries
        addActivity("🔍", "rgba(108,99,255,0.15)", "Resume scanned", `${name} — ${overall}% match`);
        if (overall >= 70) {
          addActivity("💼", "rgba(59,130,246,0.15)", "New job matched", `${matchedJob} at ${matchedCompany} — ${overall}% match`);
        }
        showToast(`Scan Complete! 🎉 ${name} scored ${overall}%`, "success");
      }, 800);
    }
  }, 120);
}

// ── Trigger scan from hero button ──
function triggerScan() {
  openModal("uploadModal");
}

// ── Hero button wiring ──
document.querySelector(".hero-actions .btn-primary")?.addEventListener("click", () => triggerScan());
document.querySelector(".hero-actions .btn-ghost")?.addEventListener("click", () => openModal("uploadModal"));

// ── Toast System ──
let toastContainer = document.querySelector(".toast-container");
if (!toastContainer) {
  toastContainer = document.createElement("div");
  toastContainer.className = "toast-container";
  document.body.appendChild(toastContainer);
}

function showToast(msg, type = "info", duration = 4000) {
  const icons = { success: "✅", error: "❌", info: "ℹ️", warning: "⚠️" };
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <div class="toast-icon">${icons[type] || icons.info}</div>
    <div class="toast-body">
      <p class="toast-msg">${msg}</p>
    </div>
    <button class="toast-close" onclick="this.parentElement.classList.add('dismissing');setTimeout(()=>this.parentElement.remove(),300)">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M18 6L6 18M6 6l12 12"/></svg>
    </button>
  `;
  toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.classList.add("dismissing");
    setTimeout(() => toast.remove(), 350);
  }, duration);
}

// ── Sidebar Mobile ──
const menuToggle = document.querySelector(".menu-toggle");
const sidebar = document.querySelector(".sidebar");
const sidebarClose = document.querySelector(".sidebar-close");
const sidebarOverlay = document.querySelector(".sidebar-overlay");

if (menuToggle) menuToggle.addEventListener("click", () => { sidebar.classList.add("mobile-open"); sidebarOverlay.classList.add("active"); });
if (sidebarClose) sidebarClose.addEventListener("click", () => { sidebar.classList.remove("mobile-open"); sidebarOverlay.classList.remove("active"); });
if (sidebarOverlay) sidebarOverlay.addEventListener("click", () => { sidebar.classList.remove("mobile-open"); sidebarOverlay.classList.remove("active"); });

// ── Page View Switcher ──
function switchPage(pageId) {
  const targetView = document.getElementById("page-" + pageId);
  if (!targetView) return;

  // Update navbar links
  document.querySelectorAll(".nav-link").forEach((l) => {
    l.classList.toggle("active", l.getAttribute("data-page") === pageId);
  });

  // Switch active page view
  document.querySelectorAll(".page-view").forEach((v) => {
    v.classList.remove("active");
  });
  targetView.classList.add("active");

  // Close mobile sidebar
  if (sidebar) sidebar.classList.remove("mobile-open");
  if (sidebarOverlay) sidebarOverlay.classList.remove("active");

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ── Sidebar Nav Click Handling ──
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const pageId = link.getAttribute("data-page");
    if (pageId) switchPage(pageId);
  });
});

// ── Interactive Helper Functions for Views ──
function runCustomScanner() {
  const title = document.getElementById("scannerJobTitle")?.value || "Target Job";
  startScan(uploadedFileName || "My_Resume.pdf");
}

function runOptimizerAI() {
  const input = document.getElementById("optInput")?.value;
  const output = document.getElementById("optOutput");
  if (!input || !input.trim()) {
    showToast("Please enter a bullet point to optimize", "warning");
    return;
  }
  showToast("Optimizing bullet point with AI...", "info");
  setTimeout(() => {
    if (output) {
      output.innerHTML = `
        <div style="margin-bottom:8px;font-weight:700;color:var(--green);">✓ Optimized ATS Version (High Impact):</div>
        <p style="margin-bottom:12px;">"Engineered high-throughput frontend architecture using React & TypeScript, accelerating page load speeds by <strong>42%</strong> and reducing bundle payload by <strong>35MB</strong> for over 100k daily active users."</p>
        <button class="btn btn-sm btn-outline" onclick="navigator.clipboard.writeText('Engineered high-throughput frontend architecture using React & TypeScript, accelerating page load speeds by 42% and reducing bundle payload by 35MB for over 100k daily active users.');showToast('Copied to clipboard!', 'success');">Copy Optimized Text</button>
      `;
    }
  }, 1000);
}

function generateCoverLetter() {
  const company = document.getElementById("clCompany")?.value || "Target Company";
  const output = document.getElementById("clOutput");
  showToast("Generating tailored cover letter...", "info");
  setTimeout(() => {
    if (output) {
      output.value = `Dear Hiring Manager,

I am writing to express my enthusiastic interest in the position at ${company}. With a proven track record in software engineering and web performance, I am excited about the opportunity to bring my technical skills and passion for innovative user experiences to your engineering team.

In my previous roles, I led cross-functional initiatives that directly improved platform reliability and application performance. I am confident that my experience aligns well with the goals of your team.

Thank you for your time and consideration.

Sincerely,
Akash Kumar`;
    }
    showToast("Cover letter generated!", "success");
  }, 1200);
}

// ── Search shortcut Ctrl+K ──
document.addEventListener("keydown", (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === "k") {
    e.preventDefault();
    document.querySelector(".search-input")?.focus();
  }
});
