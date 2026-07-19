/* =========================================================
   AUTH GUARD
   ---------------------------------------------------------
   If sessionStorage is blocked (e.g. some sandboxed preview
   contexts), we can't verify a session either way — fail
   OPEN rather than crash the whole script or redirect-loop.
   ========================================================= */
function hasActiveSession() {
    try {
        return !!sessionStorage.getItem("tableqr_session");
    } catch (err) {
        console.warn("Session storage unavailable, skipping auth guard:", err);
        return true;
    }
}
// Line ~6 — change the auth guard redirect
if (!hasActiveSession()) {
    window.location.href = "../index.html";   // was "admin.html" — caused the loop
}

// Logout button — change the redirect target
document.getElementById("logoutBtn").addEventListener("click", () => {
    try { sessionStorage.removeItem("tableqr_session"); }
    catch (err) { console.warn("Could not clear session storage:", err); }
    window.location.href = "../index.html";   // was "admin.html" — same loop
});

/* =========================================================
   STATE
   ========================================================= */
let cafes = [
    {
        id: "cf_1001",
        name: "Blue Tokai",
        address: "Shop 4, Sector 14 Market, Gurugram",
        contact: "+91 98110 22345",
        tables: 18,
        open: "08:00",
        close: "23:00",
        status: "open",
        logo: "",
        bg: "",
        admin: { name: "Rahul Mehta", email: "rahul@bluetokai.com", loginId: "blue4821", password: "Bt9xk2Qz" }
    },
    {
        id: "cf_1002",
        name: "The Reading Room",
        address: "12 MG Road, Hisar",
        contact: "+91 99920 11234",
        tables: 9,
        open: "09:00",
        close: "22:00",
        status: "paused",
        logo: "",
        bg: "",
        admin: { name: "Simran Kaur", email: "simran@readingroom.in", loginId: "reading7734", password: "Rr4mv8Lp" }
    },
    {
        id: "cf_1003",
        name: "Third Wave Diner",
        address: "Old Delhi Bypass, Hisar",
        contact: "+91 97290 88771",
        tables: 24,
        open: "07:30",
        close: "23:30",
        status: "open",
        logo: "",
        bg: "",
        admin: { name: "Arjun Sethi", email: "arjun@thirdwave.co", loginId: "third2290", password: "Tw6zq1Rn" }
    }
];

let editingId = null;
let deletingId = null;
let logoDataUrl = "";
let bgDataUrl = "";

/* =========================================================
   ELEMENT REFS
   ========================================================= */
const ticketGrid = document.getElementById("ticketGrid");
const emptyState = document.getElementById("emptyState");
const deckCount = document.getElementById("deckCount");
const searchInput = document.getElementById("searchInput");

const overlay = document.getElementById("overlay");
const drawer = document.getElementById("cafeDrawer");
const cafeForm = document.getElementById("cafeForm");
const drawerTitle = document.getElementById("drawerTitle");
const drawerEyebrow = document.getElementById("drawerEyebrow");

const deleteModal = document.getElementById("deleteModal");
const deleteModalText = document.getElementById("deleteModalText");

const toastEl = document.getElementById("toast");

/* =========================================================
   RENDER
   ========================================================= */
function renderStats() {
    document.getElementById("statTotal").textContent = cafes.length;
    document.getElementById("statTables").textContent = cafes.reduce((s, c) => s + Number(c.tables || 0), 0);
    document.getElementById("statOpen").textContent = cafes.filter(c => c.status === "open").length;
    document.getElementById("statPaused").textContent = cafes.filter(c => c.status === "paused").length;
}

function formatTime(t) {
    if (!t) return "—";
    const [h, m] = t.split(":").map(Number);
    const suffix = h >= 12 ? "PM" : "AM";
    const h12 = ((h + 11) % 12) + 1;
    return `${h12}:${String(m).padStart(2, "0")} ${suffix}`;
}

function cafeInitials(name) {
    return name.split(" ").filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join("");
}

function renderGrid(filterText = "") {
    const q = filterText.trim().toLowerCase();
    const filtered = cafes.filter(c =>
        c.name.toLowerCase().includes(q) || c.address.toLowerCase().includes(q)
    );

    deckCount.textContent = `${filtered.length} location${filtered.length === 1 ? "" : "s"}`;
    ticketGrid.innerHTML = "";

    emptyState.hidden = filtered.length !== 0;

    filtered.forEach(cafe => {
        const card = document.createElement("article");
        card.className = "ticket";
        card.dataset.id = cafe.id;

        card.innerHTML = `
      <div class="ticket-cover" style="${cafe.bg ? `background-image:url('${cafe.bg}')` : ""}">
        <span class="ticket-badge ${cafe.status === "open" ? "is-open" : "is-paused"}">
          ${cafe.status === "open" ? "Open" : "Paused"}
        </span>
        <div class="ticket-logo">
          ${cafe.logo ? `<img src="${cafe.logo}" alt="${cafe.name} logo">` : cafeInitials(cafe.name)}
        </div>
      </div>
      <div class="perf"></div>
      <div class="ticket-body">
        <div>
          <div class="ticket-name">${cafe.name}</div>
          <div class="ticket-address">${cafe.address}</div>
        </div>

        <div class="ticket-meta">
          <div>
            <span class="meta-k">Tables</span>
            <span class="meta-v">${cafe.tables}</span>
          </div>
          <div>
            <span class="meta-k">Opens</span>
            <span class="meta-v">${formatTime(cafe.open)}</span>
          </div>
          <div>
            <span class="meta-k">Closes</span>
            <span class="meta-v">${formatTime(cafe.close)}</span>
          </div>
        </div>

        <div class="ticket-foot">
          <span class="ticket-contact">${cafe.contact}</span>
          <div class="ticket-actions">
            <button class="icon-btn" data-action="edit" title="Edit cafe">✎</button>
            <button class="icon-btn danger" data-action="delete" title="Delete cafe">🗑</button>
          </div>
        </div>
      </div>
    `;

        ticketGrid.appendChild(card);
    });

    renderStats();
}

/* =========================================================
   DRAWER — ADD / EDIT
   ========================================================= */
function openDrawer(cafe = null) {
    editingId = cafe ? cafe.id : null;
    logoDataUrl = cafe?.logo || "";
    bgDataUrl = cafe?.bg || "";

    drawerEyebrow.textContent = cafe ? `Editing · ${cafe.id}` : "New Entry";
    drawerTitle.textContent = cafe ? "Edit Cafe" : "Add a Cafe";
    document.getElementById("submitCafe").textContent = cafe ? "Save Changes" : "Save Cafe";

    document.getElementById("cafeId").value = cafe?.id || "";
    document.getElementById("cafeName").value = cafe?.name || "";
    document.getElementById("cafeAddress").value = cafe?.address || "";
    document.getElementById("cafeContact").value = cafe?.contact || "";
    document.getElementById("cafeTables").value = cafe?.tables || "";
    document.getElementById("cafeOpen").value = cafe?.open || "";
    document.getElementById("cafeClose").value = cafe?.close || "";
    document.getElementById("adminName").value = cafe?.admin?.name || "";
    document.getElementById("adminEmail").value = cafe?.admin?.email || "";
    document.getElementById("adminLoginId").value = cafe?.admin?.loginId || "";
    document.getElementById("adminPassword").value = "";

    setPreview("cafeLogo", logoDataUrl);
    setPreview("cafeBg", bgDataUrl);

    overlay.classList.add("is-active");
    drawer.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    document.getElementById("cafeName").focus();
}

function closeDrawerFn() {
    drawer.classList.remove("is-open");
    overlay.classList.remove("is-active");
    drawer.setAttribute("aria-hidden", "true");
    cafeForm.reset();
    editingId = null;
}

function setPreview(inputId, dataUrl) {
    const img = document.getElementById(inputId + "Preview");
    const placeholder = document.getElementById(inputId + "Placeholder");
    if (dataUrl) {
        img.src = dataUrl;
        img.hidden = false;
        placeholder.hidden = true;
    } else {
        img.hidden = true;
        placeholder.hidden = false;
    }
}

document.getElementById("openAddCafe").addEventListener("click", () => openDrawer());
document.querySelector('[data-action="add-cafe"]').addEventListener("click", () => openDrawer());
document.getElementById("closeDrawer").addEventListener("click", closeDrawerFn);
document.getElementById("cancelDrawer").addEventListener("click", closeDrawerFn);
overlay.addEventListener("click", () => {
    closeDrawerFn();
    closeDeleteModal();
});

document.getElementById("cafeLogo").addEventListener("change", (e) => {
    handleImageUpload(e.target, "cafeLogo", (url) => logoDataUrl = url);
});
document.getElementById("cafeBg").addEventListener("change", (e) => {
    handleImageUpload(e.target, "cafeBg", (url) => bgDataUrl = url);
});

function handleImageUpload(input, targetId, onLoad) {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
        onLoad(reader.result);
        setPreview(targetId, reader.result);
    };
    reader.readAsDataURL(file);
}

document.getElementById("cafeName").addEventListener("input", (e) => {
    if (!editingId) {
        document.getElementById("adminLoginId").value = generateLoginId(e.target.value);
    }
});
document.getElementById("generateLoginId").addEventListener("click", () => {
    const name = document.getElementById("cafeName").value || "cafe";
    document.getElementById("adminLoginId").value = generateLoginId(name);
});

document.getElementById("generatePassword").addEventListener("click", () => {
    document.getElementById("adminPassword").value = generatePassword();
});

function generatePassword() {
    const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
    let pass = "";
    for (let i = 0; i < 10; i++) pass += chars[Math.floor(Math.random() * chars.length)];
    return pass;
}

/* login ID pattern: first word of cafe name + 4 random digits, e.g. blue4821 */
function generateLoginId(cafeName) {
    const base = (cafeName || "cafe").trim().split(/\s+/)[0].toLowerCase().replace(/[^a-z0-9]/g, "") || "cafe";
    const digits = Math.floor(1000 + Math.random() * 9000);
    return `${base}${digits}`;
}

/* =========================================================
   FORM SUBMIT
   ========================================================= */
cafeForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!cafeForm.reportValidity()) return;

    const payload = {
        name: document.getElementById("cafeName").value.trim(),
        address: document.getElementById("cafeAddress").value.trim(),
        contact: document.getElementById("cafeContact").value.trim(),
        tables: Number(document.getElementById("cafeTables").value),
        open: document.getElementById("cafeOpen").value,
        close: document.getElementById("cafeClose").value,
        logo: logoDataUrl,
        bg: bgDataUrl,
        admin: {
            name: document.getElementById("adminName").value.trim(),
            email: document.getElementById("adminEmail").value.trim(),
            loginId: document.getElementById("adminLoginId").value.trim() || generateLoginId(document.getElementById("cafeName").value),
            password: document.getElementById("adminPassword").value || cafes.find(c => c.id === editingId)?.admin?.password || generatePassword()
        }
    };

    if (editingId) {
        const idx = cafes.findIndex(c => c.id === editingId);
        cafes[idx] = { ...cafes[idx], ...payload };
        showToast(`Saved changes to ${payload.name}`);
    } else {
        const newCafe = {
            id: "cf_" + Math.floor(1000 + Math.random() * 9000),
            status: "open",
            ...payload
        };
        cafes.unshift(newCafe);
        showToast(`${payload.name} added — login ID ${payload.admin.loginId} is ready to hand off`);
    }

    persistCafes();
    renderGrid(searchInput.value);
    closeDrawerFn();
});

/* =========================================================
   PERSISTENCE — so the login page can authenticate cafe admins
   ========================================================= */
const CAFES_STORAGE_KEY = "tableqr_cafes";

function persistCafes() {
    try {
        localStorage.setItem(CAFES_STORAGE_KEY, JSON.stringify(cafes));
    } catch (e) {
        console.warn("Could not save to localStorage:", e);
    }
}

function loadPersistedCafes() {
    try {
        const raw = localStorage.getItem(CAFES_STORAGE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.length) {
                cafes = parsed;
            }
        }
    } catch (e) {
        console.warn("Could not read localStorage:", e);
    }
}

/* =========================================================
   GRID CLICK DELEGATION — edit / delete
   ========================================================= */
ticketGrid.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;
    const card = e.target.closest(".ticket");
    const id = card.dataset.id;
    const cafe = cafes.find(c => c.id === id);

    if (btn.dataset.action === "edit") {
        openDrawer(cafe);
    }
    if (btn.dataset.action === "delete") {
        openDeleteModal(cafe);
    }
});

/* =========================================================
   DELETE MODAL
   ========================================================= */
function openDeleteModal(cafe) {
    deletingId = cafe.id;
    deleteModalText.textContent = `This will permanently delete "${cafe.name}", its tables, and its admin login. This can't be undone.`;
    deleteModal.classList.add("is-open");
    overlay.classList.add("is-active");
}
function closeDeleteModal() {
    deleteModal.classList.remove("is-open");
    overlay.classList.remove("is-active");
    deletingId = null;
}

document.getElementById("cancelDelete").addEventListener("click", closeDeleteModal);
document.getElementById("confirmDelete").addEventListener("click", () => {
    const cafe = cafes.find(c => c.id === deletingId);
    cafes = cafes.filter(c => c.id !== deletingId);
    persistCafes();
    renderGrid(searchInput.value);
    closeDeleteModal();
    if (cafe) showToast(`${cafe.name} removed from the network`);
});

/* =========================================================
   SEARCH
   ========================================================= */
searchInput.addEventListener("input", (e) => renderGrid(e.target.value));

/* =========================================================
   TOAST
   ========================================================= */
let toastTimer = null;
function showToast(message) {
    toastEl.textContent = message;
    toastEl.classList.add("is-shown");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("is-shown"), 2600);
}

/* =========================================================
   KEYBOARD — Esc closes drawer / modal
   ========================================================= */
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        closeDrawerFn();
        closeDeleteModal();
    }
});

/* =========================================================
   NAV (visual state only — single view for now)
   ========================================================= */
document.querySelectorAll(".rail-item[data-view]").forEach(item => {
    item.addEventListener("click", () => {
        document.querySelectorAll(".rail-item[data-view]").forEach(i => i.classList.remove("is-active"));
        item.classList.add("is-active");
    });
});

document.getElementById("logoutBtn").addEventListener("click", () => {
    try { sessionStorage.removeItem("tableqr_session"); }
    catch (err) { console.warn("Could not clear session storage:", err); }
    window.location.href = "admin.html";
});

/* =========================================================
   INIT
   ========================================================= */
loadPersistedCafes();
persistCafes();
renderGrid();