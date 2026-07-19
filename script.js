/* =========================================================
   DEMO CREDENTIAL STORE
   ========================================================= */
const SUPER_ADMIN = {
    id: "superadmin",
    password: "TableQR@2026"
};

const CAFE_ADMIN = {
    id: "amberoak",
    password: "CafeAdmin@2026",
    cafeName: "Amber & Oak"
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
const loginForm       = document.getElementById("loginForm");
const loginIdInput    = document.getElementById("loginId");
const passwordInput   = document.getElementById("loginPassword");
const togglePassword  = document.getElementById("togglePassword");
const formError       = document.getElementById("formError");
const submitBtn       = document.getElementById("submitLogin");
const submitLabel     = document.getElementById("submitLabel");
const toastEl         = document.getElementById("toast");
const ticketIdEl      = document.getElementById("ticketId");
const forgotLink      = document.getElementById("forgotLink");

/* =========================================================
   COSMETIC — random ticket ID on the story panel
   ========================================================= */
ticketIdEl.textContent = "#TQR-" + String(Math.floor(100000 + Math.random() * 900000));

/* =========================================================
   PASSWORD VISIBILITY TOGGLE
   ========================================================= */
const iconEye    = togglePassword.querySelector(".icon-eye");
const iconEyeOff = togglePassword.querySelector(".icon-eye-off");

togglePassword.addEventListener("click", () => {
    const isHidden = passwordInput.type === "password";
    passwordInput.type = isHidden ? "text" : "password";
    iconEye.hidden    = isHidden;
    iconEyeOff.hidden = !isHidden;
    togglePassword.setAttribute("aria-label", isHidden ? "Hide password" : "Show password");
});

/* =========================================================
   FORGOT PASSWORD
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
    void loginForm.offsetWidth;
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
   SUBMIT — auth check + redirect
   ========================================================= */
loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    clearError();

    const id       = loginIdInput.value.trim();
    const password = passwordInput.value;

    if (!id || !password) {
        showError("Enter both your login ID and password to continue.");
        return;
    }

    setLoading(true);

    setTimeout(() => {
        setLoading(false);

        /* ---------- 1. Super Admin ---------- */
        if (id.toLowerCase() === SUPER_ADMIN.id.toLowerCase() &&
            password === SUPER_ADMIN.password) {
            try {
                sessionStorage.setItem("tableqr_session", "super_admin");
            } catch (err) {
                console.warn("sessionStorage unavailable:", err);
            }
            showToast("Welcome back, Super Admin. Redirecting…");
            setTimeout(() => {
                window.location.href = "SUPER_Admin_page/admin.html";
            }, 800);
            return;
        }

        /* ---------- 2. Demo Cafe Admin (Amber & Oak) ---------- */
        if (id.toLowerCase() === CAFE_ADMIN.id.toLowerCase() &&
            password === CAFE_ADMIN.password) {
            try {
                sessionStorage.setItem("tableqr_session", CAFE_ADMIN.id);
            } catch (err) {
                console.warn("sessionStorage unavailable:", err);
            }
            showToast(`Welcome, ${CAFE_ADMIN.cafeName} admin. Redirecting…`);
            setTimeout(() => {
                window.location.href = "ADMIN_page/adm.html";
            }, 800);
            return;
        }

        /* ---------- 3. Dynamic Cafe Admins (added via Super Admin) ---------- */
        const cafeAdmins = getCafeAdmins();
        const match = cafeAdmins.find(
            a => a.loginId.toLowerCase() === id.toLowerCase() &&
                 a.password === password
        );

        if (match) {
            try {
                sessionStorage.setItem("tableqr_session", match.loginId);
            } catch (err) {
                console.warn("sessionStorage unavailable:", err);
            }
            showToast(`Welcome, ${match.cafeName} admin. Redirecting…`);
            setTimeout(() => {
                window.location.href = "ADMIN_page/adm.html";
            }, 800);
            return;
        }

        /* ---------- 4. No match ---------- */
        showError("That ID and password don't match our records. Double-check and try again.");

    }, 650);
});

function setLoading(isLoading) {
    submitBtn.disabled = isLoading;
    submitLabel.innerHTML = isLoading
        ? `<span class="spinner"></span> Checking…`
        : "Sign In";
}