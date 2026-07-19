/* =========================================================
   DEMO CREDENTIAL STORE
   ---------------------------------------------------------
   In production these checks belong on a server. For now,
   the Super Admin login is fixed, and Cafe Admin logins are
   whatever the Super Admin dashboard (script.js) has issued
   and saved into localStorage under "tableqr_cafes".
   ========================================================= */
const SUPER_ADMIN = {
    id: "superadmin",
    password: "TableQR@2026"
};

const CAFES_STORAGE_KEY = "tableqr_cafes";

function getCafeAdmins() {
    try {
        const raw = localStorage.getItem(CAFES_STORAGE_KEY);
        if (!raw) return [];
        const cafes = JSON.parse(raw);
        return cafes
            .filter(c => c.admin && c.admin.loginId && c.admin.password)
            .map(c => ({
                loginId: c.admin.loginId,
                password: c.admin.password,
                cafeName: c.name,
                status: c.status
            }));
    } catch (e) {
        return [];
    }
}

/* =========================================================
   ELEMENT REFS
   ========================================================= */
const loginForm = document.getElementById("loginForm");
const loginIdInput = document.getElementById("loginId");
const passwordInput = document.getElementById("loginPassword");
const togglePassword = document.getElementById("togglePassword");
const formError = document.getElementById("formError");
const submitBtn = document.getElementById("submitLogin");
const submitLabel = document.getElementById("submitLabel");
const toastEl = document.getElementById("toast");
const ticketIdEl = document.getElementById("ticketId");
const forgotLink = document.getElementById("forgotLink");

/* =========================================================
   COSMETIC — ticket id on the story panel
   ========================================================= */
ticketIdEl.textContent = "#TQR-" + String(Math.floor(100000 + Math.random() * 900000));

/* =========================================================
   PASSWORD VISIBILITY
   ========================================================= */
const iconEye = togglePassword.querySelector(".icon-eye");
const iconEyeOff = togglePassword.querySelector(".icon-eye-off");

togglePassword.addEventListener("click", () => {
    const isHidden = passwordInput.type === "password";
    passwordInput.type = isHidden ? "text" : "password";
    iconEye.hidden = isHidden;
    iconEyeOff.hidden = !isHidden;
    togglePassword.setAttribute("aria-label", isHidden ? "Hide password" : "Show password");
});

/* =========================================================
   FORGOT PASSWORD (placeholder)
   ========================================================= */
forgotLink.addEventListener("click", (e) => {
    e.preventDefault();
    showToast("Ask your platform admin to reset your password.", false);
});

/* =========================================================
   ERROR HELPERS
   ========================================================= */
function showError(message) {
    formError.textContent = message;
    formError.hidden = false;
    loginForm.classList.remove("shake");
    void loginForm.offsetWidth; // restart animation
    loginForm.classList.add("shake");
}
function clearError() {
    formError.hidden = true;
    formError.textContent = "";
}

/* =========================================================
   TOAST
   ========================================================= */
let toastTimer = null;
function showToast(message, isSuccess = true) {
    toastEl.textContent = message;
    toastEl.classList.toggle("is-error", !isSuccess);
    toastEl.classList.add("is-shown");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("is-shown"), 3200);
}

/* =========================================================
   SUBMIT
   ========================================================= */
loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    clearError();

    const id = loginIdInput.value.trim();
    const password = passwordInput.value;

    if (!id || !password) {
        showError("Enter both your login ID and password to continue.");
        return;
    }

    setLoading(true);

    // simulate a brief auth check so it feels real, not instant
    setTimeout(() => {
        setLoading(false);

        // --- Super Admin ---
        /* ============================================================
   DEMO CAFE ADMIN — single cafe console demo login
============================================================ */
        const CAFE_ADMIN = {
            id: "amberoak",
            password: "CafeAdmin@2026",
            cafeName: "Amber & Oak"
        };

        // --- Cafe Admin (issued via Super Admin > Add Cafe) ---
        const cafeAdmins = getCafeAdmins();
        const match = cafeAdmins.find(a => a.loginId.toLowerCase() === id.toLowerCase() && a.password === password);

        if (match) {
            showToast(`Signed in as ${match.cafeName}'s admin. Their console isn't built yet — check back soon.`, true);
            return;
        }

        // --- No match ---
        showError("That ID and password don't match our records. Double-check and try again.");
    }, 650);
});

function setLoading(isLoading) {
    submitBtn.disabled = isLoading;
    submitLabel.innerHTML = isLoading ? `<span class="spinner"></span> Checking…` : "Sign In";
}