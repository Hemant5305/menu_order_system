/* ==========================================================================
   TABLEQR — SUPER ADMIN CONTROL ROOM LOGIC

   This page reads and writes the SAME localStorage key ("tableqr_cafes")
   that lg.js's getCafeAdmins() reads from. Any cafe added here can
   immediately sign in through the real login gate.
========================================================================== */

/* ----------------------------------------------------------------------
   SESSION GUARD
   Only a signed-in Super Admin should see this page — a Cafe Admin
   session should never land here.
---------------------------------------------------------------------- */
(function guardSession() {
    try {
        const session = sessionStorage.getItem("tableqr_session");
        if (session !== "super_admin") {
            window.location.href = "../index.html";
        }
    } catch (err) {
        console.warn("Could not read session storage:", err);
    }
})();

/* ----------------------------------------------------------------------
   CAFE STORAGE — shared contract with lg.js
---------------------------------------------------------------------- */
const CAFES_STORAGE_KEY = "tableqr_cafes";

function loadCafes() {
    try {
        const raw = localStorage.getItem(CAFES_STORAGE_KEY);
        if (!raw) return null;
        return JSON.parse(raw);
    } catch (err) {
        console.warn("Could not read cafe roster:", err);
        return null;
    }
}

function saveCafes(cafes) {
    try {
        localStorage.setItem(CAFES_STORAGE_KEY, JSON.stringify(cafes));
    } catch (err) {
        console.warn("Could not save cafe roster:", err);
    }
}

/* Seed a starter roster the first time the Control Room is opened. */
let cafes = loadCafes();
if (!cafes) {
    cafes = [
        { id: "c1", name: "Amber & Oak", status: "active", joined: "2026-01-14", admin: { loginId: "amberoak", password: "CafeAdmin@2026" } },
        { id: "c2", name: "Blue Fern Coffee", status: "awaiting", joined: "2026-06-02", admin: { loginId: "bluefern", password: "BlueFern#118" } },
        { id: "c3", name: "Northside Roasters", status: "active", joined: "2026-03-22", admin: { loginId: "northside", password: "Roast#4471" } },
        { id: "c4", name: "Cliffside Tea Bar", status: "suspended", joined: "2026-02-08", admin: { loginId: "cliffside", password: "TeaBar#902" } },
    ];
    saveCafes(cafes);
}

const activityLog = [
    { text: "Amber & Oak's admin signed in", time: "2 min ago", tone: "active" },
    { text: "Blue Fern Coffee onboarded — awaiting first sign-in", time: "3 days ago", tone: "awaiting" },
    { text: "Cliffside Tea Bar suspended for billing review", time: "6 days ago", tone: "suspended" },
    { text: "Northside Roasters' admin signed in", time: "1 week ago", tone: "active" },
];

const growthData = [
    { label: "Feb", value: 3 },
    { label: "Mar", value: 5 },
    { label: "Apr", value: 6 },
    { label: "May", value: 8 },
    { label: "Jun", value: 10 },
    { label: "Jul", value: cafes.length },
];

let activeStatus = "all";
let editingCafeId = null;

/* ----------------------------------------------------------------------
   ELEMENT REFS
---------------------------------------------------------------------- */
const railLinks = document.querySelectorAll(".rail-link");
const views = document.querySelectorAll(".view");
const railToggle = document.getElementById("railToggle");
const rail = document.getElementById("rail");
const signOutBtn = document.getElementById("signOutBtn");
const cafeSearch = document.getElementById("cafeSearch");

const statGrid = document.getElementById("statGrid");
const growthChart = document.getElementById("growthChart");
const activityList = document.getElementById("activityList");

const statusTabs = document.getElementById("statusTabs");
const manifestBody = document.getElementById("manifestBody");
const cafesBadge = document.getElementById("cafesBadge");
const addCafeBtn = document.getElementById("addCafeBtn");

const modalScrim = document.getElementById("modalScrim");
const modalTitle = document.getElementById("modalTitle");
const modalClose = document.getElementById("modalClose");
const modalCancel = document.getElementById("modalCancel");
const cafeForm = document.getElementById("cafeForm");
const cafeNameInput = document.getElementById("cafeName");
const cafeLoginIdInput = document.getElementById("cafeLoginId");
const cafePasswordInput = document.getElementById("cafePassword");
const generatePasswordBtn = document.getElementById("generatePasswordBtn");

const toastEl = document.getElementById("toast");

/* ----------------------------------------------------------------------
   TOAST
---------------------------------------------------------------------- */
let toastTimer = null;
function showToast(message) {
    toastEl.textContent = message;
    toastEl.classList.add("is-shown");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("is-shown"), 2600);
}

/* ----------------------------------------------------------------------
   NAVIGATION
---------------------------------------------------------------------- */
railLinks.forEach(link => {
    link.addEventListener("click", () => {
        const target = link.dataset.view;
        railLinks.forEach(l => l.classList.toggle("is-active", l === link));
        views.forEach(v => v.classList.toggle("is-active", v.dataset.view === target));
        rail.classList.remove("is-open");
    });
});

railToggle.addEventListener("click", () => rail.classList.toggle("is-open"));

signOutBtn.addEventListener("click", () => {
    try { sessionStorage.removeItem("tableqr_session"); }
    catch (err) { console.warn("Could not clear session storage:", err); }
    window.location.href = "../index.html";
});

/* ==========================================================================
   OVERVIEW
========================================================================== */
function renderStats() {
    const total = cafes.length;
    const active = cafes.filter(c => c.status === "active").length;
    const awaiting = cafes.filter(c => c.status === "awaiting").length;

    const stats = [
        {
            label: "Total cafes", value: String(total), delta: "+1 this month", note: "on the network",
            icon: `<svg viewBox="0 0 24 24" fill="none"><path d="M4 10.5 5.6 4h12.8L20 10.5M4 10.5v9A1.5 1.5 0 0 0 5.5 21h13a1.5 1.5 0 0 0 1.5-1.5v-9M4 10.5a2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`
        },
        {
            label: "Active consoles", value: String(active), delta: `${Math.round((active / total) * 100) || 0}% of network`, note: "signed in at least once",
            icon: `<svg viewBox="0 0 24 24" fill="none"><path d="M5 12.5 9.5 17 19 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`
        },
        {
            label: "Awaiting sign-in", value: String(awaiting), delta: "needs a nudge", note: "onboarded, not opened",
            icon: `<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8.5" stroke="currentColor" stroke-width="1.8"/><path d="M12 7.5V12l3 2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`
        },
        {
            label: "Network orders today", value: "214", delta: "+18", note: "across all cafes",
            icon: `<svg viewBox="0 0 24 24" fill="none"><path d="M6 3h12v18l-2.5-1.6L13 21l-2.5-1.6L8 21 6 19.4V3Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>`
        },
        {
            label: "Network revenue today", value: "$4,120", delta: "+9.6%", note: "all cafes combined",
            icon: `<svg viewBox="0 0 24 24" fill="none"><path d="M4 18V9M9.5 18V4M15 18v-6M20 18v-9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`
        },
    ];

    statGrid.innerHTML = stats.map(s => `
    <div class="stat-ticket ticket-edge">
      <div class="stat-ticket-top">
        <span class="stat-icon">${s.icon}</span>
        <span class="stat-delta is-up">${s.delta}</span>
      </div>
      <div class="stat-value">${s.value}</div>
      <div class="stat-label">${s.label}</div>
      <div class="stat-tear">${s.note}</div>
    </div>
  `).join("");

    cafesBadge.textContent = total;
}

function renderGrowthChart() {
    const max = Math.max(...growthData.map(d => d.value));
    growthChart.innerHTML = growthData.map((d, i) => `
    <div class="bar-col">
      <div class="bar-fill ${i === growthData.length - 1 ? "is-current" : ""}" style="height:${Math.round((d.value / max) * 100)}%" title="${d.value} cafes"></div>
      <span class="bar-day">${d.label}</span>
    </div>
  `).join("");
}

function renderActivity() {
    activityList.innerHTML = activityLog.map(item => `
    <li class="activity-item">
      <span class="activity-dot dot-${item.tone}" style="background:var(--${item.tone})"></span>
      <div class="activity-body">
        <span class="activity-text">${item.text}</span>
        <span class="activity-time">${item.time}</span>
      </div>
    </li>
  `).join("");
}

function renderOverview() {
    renderStats();
    renderGrowthChart();
    renderActivity();
}

/* ==========================================================================
   CAFES — ROSTER / MANIFEST
========================================================================== */
function renderStatusTabs() {
    const statuses = [
        { key: "all", label: "All" },
        { key: "active", label: "Active" },
        { key: "awaiting", label: "Awaiting sign-in" },
        { key: "suspended", label: "Suspended" },
    ];

    statusTabs.innerHTML = statuses.map(s => {
        const count = s.key === "all" ? cafes.length : cafes.filter(c => c.status === s.key).length;
        return `<button class="chip-tab ${s.key === activeStatus ? "is-active" : ""}" data-status="${s.key}">${s.label} <span class="count">${count}</span></button>`;
    }).join("");

    statusTabs.querySelectorAll(".chip-tab").forEach(btn => {
        btn.addEventListener("click", () => {
            activeStatus = btn.dataset.status;
            renderStatusTabs();
            renderManifest();
        });
    });
}

function renderManifest() {
    const query = cafeSearch.value.trim().toLowerCase();
    let rows = activeStatus === "all" ? cafes : cafes.filter(c => c.status === activeStatus);
    if (query) {
        rows = rows.filter(c => c.name.toLowerCase().includes(query) || c.admin.loginId.toLowerCase().includes(query));
    }

    if (!rows.length) {
        manifestBody.innerHTML = `<div style="padding:26px 22px; color:var(--muted); font-size:.86rem;">No cafes match here yet.</div>`;
        return;
    }

    manifestBody.innerHTML = rows.map(cafe => {
        const canOpenConsole = cafe.name === "Amber & Oak";
        return `
    <div class="manifest-row" data-id="${cafe.id}">
      <div class="manifest-cafe">
        <span class="manifest-cafe-name">${cafe.name}</span>
        <span class="manifest-cafe-id">#${cafe.id}</span>
      </div>
      <span class="manifest-login">${cafe.admin.loginId}</span>
      <span class="status-pill ${cafe.status}">${cafe.status === "awaiting" ? "Awaiting sign-in" : cafe.status}</span>
      <span class="manifest-joined">${cafe.joined}</span>
      <div class="manifest-actions">
        <button class="icon-action open-console" data-id="${cafe.id}" ${canOpenConsole ? "" : "disabled"} title="${canOpenConsole ? "Open console" : "Console not built yet"}">
          <svg viewBox="0 0 24 24" fill="none"><path d="M9 6h9v9M18 6 6 18" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <button class="icon-action toggle-status" data-id="${cafe.id}" title="${cafe.status === "suspended" ? "Reactivate" : "Suspend"}">
          <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8.5" stroke="currentColor" stroke-width="1.6"/><path d="M12 8v4.5M12 15.5h.01" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
        </button>
        <button class="icon-action is-danger remove-cafe" data-id="${cafe.id}" title="Remove cafe">
          <svg viewBox="0 0 24 24" fill="none"><path d="M5 7h14M9.5 7V4.5h5V7M7 7l1 13h8l1-13" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
      </div>
    </div>
  `;
    }).join("");

    manifestBody.querySelectorAll(".open-console").forEach(btn => {
        btn.addEventListener("click", () => {
            if (btn.disabled) return;
            window.location.href = "../Admin_page/admin.html";
        });
    });
    manifestBody.querySelectorAll(".toggle-status").forEach(btn => {
        btn.addEventListener("click", () => toggleStatus(btn.dataset.id));
    });
    manifestBody.querySelectorAll(".remove-cafe").forEach(btn => {
        btn.addEventListener("click", () => removeCafe(btn.dataset.id));
    });
}

function toggleStatus(id) {
    const cafe = cafes.find(c => c.id === id);
    if (!cafe) return;
    cafe.status = cafe.status === "suspended" ? "active" : "suspended";
    saveCafes(cafes);
    showToast(`${cafe.name} is now ${cafe.status}`);
    renderStatusTabs();
    renderManifest();
    renderStats();
}

function removeCafe(id) {
    const cafe = cafes.find(c => c.id === id);
    if (!cafe) return;
    if (!confirm(`Remove "${cafe.name}" from the network? Their login will stop working.`)) return;
    cafes = cafes.filter(c => c.id !== id);
    saveCafes(cafes);
    showToast(`Removed ${cafe.name}`);
    renderStatusTabs();
    renderManifest();
    renderStats();
}

cafeSearch.addEventListener("input", renderManifest);

/* ----- Add cafe modal ----- */
function slugify(name) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 20);
}

function generatePassword() {
    const words = ["Roast", "Bloom", "Grind", "Steep", "Brew", "Cinder", "Amber", "Grove"];
    const word = words[Math.floor(Math.random() * words.length)];
    const num = Math.floor(100 + Math.random() * 900);
    return `${word}#${num}`;
}

cafeNameInput.addEventListener("input", () => {
    cafeLoginIdInput.value = slugify(cafeNameInput.value);
});

generatePasswordBtn.addEventListener("click", () => {
    cafePasswordInput.value = generatePassword();
});

function openCafeModal() {
    editingCafeId = null;
    modalTitle.textContent = "Add a cafe";
    cafeForm.reset();
    cafePasswordInput.value = generatePassword();
    modalScrim.classList.add("is-open");
    cafeNameInput.focus();
}

function closeCafeModal() {
    modalScrim.classList.remove("is-open");
}

addCafeBtn.addEventListener("click", openCafeModal);
modalClose.addEventListener("click", closeCafeModal);
modalCancel.addEventListener("click", closeCafeModal);
modalScrim.addEventListener("click", (e) => { if (e.target === modalScrim) closeCafeModal(); });

cafeForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = cafeNameInput.value.trim();
    const loginId = cafeLoginIdInput.value.trim().toLowerCase();
    const password = cafePasswordInput.value.trim();

    if (!name || !loginId || !password) return;

    if (cafes.some(c => c.admin.loginId.toLowerCase() === loginId)) {
        showToast("That login ID is already taken — try another.");
        return;
    }

    const newCafe = {
        id: "c" + Date.now(),
        name,
        status: "awaiting",
        joined: new Date().toISOString().slice(0, 10),
        admin: { loginId, password },
    };

    cafes.push(newCafe);
    saveCafes(cafes);
    showToast(`${name} onboarded — login ID "${loginId}" is ready to sign in.`);

    closeCafeModal();
    renderStatusTabs();
    renderManifest();
    renderStats();
});

/* ==========================================================================
   INIT
========================================================================== */
renderOverview();
renderStatusTabs();
renderManifest();