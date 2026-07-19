/* ==========================================================================
   TABLEQR — CAFE ADMIN CONSOLE LOGIC

   DEMO DATA STORE
   --------------------------------------------------------------------------
   In production, everything below (menuItems, orders, tables, stats) is
   fetched from the server for this cafe's account. For now it's seeded
   in-memory so the console is fully interactive on its own.
========================================================================== */

/* ----------------------------------------------------------------------
   SESSION GUARD
   Only a signed-in Super Admin or Cafe Admin should ever see this page.
   lg.js sets sessionStorage("tableqr_session") to "super_admin" or the
   cafe admin's login id on a successful sign-in.
---------------------------------------------------------------------- */
(function guardSession() {
    try {
        const session = sessionStorage.getItem("tableqr_session");
        if (!session) {
            window.location.href = "../index.html";
        }
    } catch (err) {
        console.warn("Could not read session storage:", err);
    }
})();

/* ----------------------------------------------------------------------
   DEMO DATA
---------------------------------------------------------------------- */
const CATEGORIES = ["Coffee", "Tea", "Pastries", "Sandwiches"];

let menuItems = [
    { id: "m1", name: "Caramel Cortado", category: "Coffee", price: 4.50, desc: "Espresso, steamed milk, caramel drizzle.", available: true },
    { id: "m2", name: "Flat White", category: "Coffee", price: 4.00, desc: "Double ristretto, microfoam.", available: true },
    { id: "m3", name: "Pour Over — Ethiopia", category: "Coffee", price: 5.25, desc: "Bright, floral, single origin.", available: true },
    { id: "m4", name: "Chamomile Bloom", category: "Tea", price: 3.75, desc: "Whole chamomile flowers, honey on request.", available: true },
    { id: "m5", name: "Jasmine Pearl", category: "Tea", price: 4.25, desc: "Hand-rolled green tea pearls.", available: false },
    { id: "m6", name: "Almond Croissant", category: "Pastries", price: 4.75, desc: "Laminated dough, almond cream, toasted flakes.", available: true },
    { id: "m7", name: "Pistachio Roll", category: "Pastries", price: 5.00, desc: "Cardamom dough, pistachio paste.", available: true },
    { id: "m8", name: "Fig & Prosciutto", category: "Sandwiches", price: 8.50, desc: "Fig jam, prosciutto, arugula, sourdough.", available: true },
    { id: "m9", name: "Roast Vegetable Panini", category: "Sandwiches", price: 7.50, desc: "Courgette, pepper, halloumi, basil oil.", available: true },
];

let orders = [
    { id: "TQR-8841", table: 4, items: [["Caramel Cortado", 1], ["Almond Croissant", 1]], total: 9.25, time: "2 min ago", status: "new" },
    { id: "TQR-8840", table: 11, items: [["Flat White", 2], ["Fig & Prosciutto", 1]], total: 16.50, time: "6 min ago", status: "preparing" },
    { id: "TQR-8839", table: 2, items: [["Pour Over — Ethiopia", 1]], total: 5.25, time: "9 min ago", status: "preparing" },
    { id: "TQR-8838", table: 7, items: [["Chamomile Bloom", 1], ["Pistachio Roll", 1]], total: 8.75, time: "14 min ago", status: "ready" },
    { id: "TQR-8837", table: 1, items: [["Roast Vegetable Panini", 1], ["Flat White", 1]], total: 11.50, time: "22 min ago", status: "completed" },
    { id: "TQR-8836", table: 9, items: [["Caramel Cortado", 1]], total: 4.50, time: "27 min ago", status: "completed" },
    { id: "TQR-8835", table: 5, items: [["Jasmine Pearl", 1], ["Almond Croissant", 1]], total: 9.00, time: "33 min ago", status: "cancelled" },
];

let tables = [
    { num: 1, cap: 2, status: "occupied", meta: "Seated 18 min" },
    { num: 2, cap: 2, status: "occupied", meta: "Seated 9 min" },
    { num: 3, cap: 4, status: "available", meta: "Ready to seat" },
    { num: 4, cap: 2, status: "occupied", meta: "Seated 2 min" },
    { num: 5, cap: 4, status: "reserved", meta: "7:30 PM · Rao" },
    { num: 6, cap: 2, status: "available", meta: "Ready to seat" },
    { num: 7, cap: 6, status: "occupied", meta: "Seated 14 min" },
    { num: 8, cap: 4, status: "available", meta: "Ready to seat" },
    { num: 9, cap: 2, status: "occupied", meta: "Seated 27 min" },
    { num: 10, cap: 4, status: "reserved", meta: "8:00 PM · Chen" },
    { num: 11, cap: 6, status: "occupied", meta: "Seated 6 min" },
    { num: 12, cap: 2, status: "available", meta: "Ready to seat" },
];

const weekSales = [
    { day: "Mon", value: 890 },
    { day: "Tue", value: 1120 },
    { day: "Wed", value: 980 },
    { day: "Thu", value: 1340 },
    { day: "Fri", value: 1610 },
    { day: "Sat", value: 1890 },
    { day: "Today", value: 1284.5 },
];

const ORDER_STATUS_FLOW = ["new", "preparing", "ready", "completed"];
const STATUS_LABEL = { new: "New order", preparing: "Preparing", ready: "Ready", completed: "Completed", cancelled: "Cancelled" };
const TABLE_STATUS_FLOW = ["available", "occupied", "reserved"];

let activeCategory = "All";
let activeOrderStatus = "all";
let editingItemId = null;

/* ----------------------------------------------------------------------
   ELEMENT REFS
---------------------------------------------------------------------- */
const railLinks = document.querySelectorAll(".rail-link");
const views = document.querySelectorAll(".view");
const railToggle = document.getElementById("railToggle");
const rail = document.getElementById("rail");
const signOutBtn = document.getElementById("signOutBtn");

const statGrid = document.getElementById("statGrid");
const barChart = document.getElementById("barChart");
const salesTrendNote = document.getElementById("salesTrendNote");
const rankList = document.getElementById("rankList");

const categoryTabs = document.getElementById("categoryTabs");
const menuGrid = document.getElementById("menuGrid");
const addItemBtn = document.getElementById("addItemBtn");

const orderStatusTabs = document.getElementById("orderStatusTabs");
const orderGrid = document.getElementById("orderGrid");
const ordersBadge = document.getElementById("ordersBadge");

const tableGrid = document.getElementById("tableGrid");

const modalScrim = document.getElementById("modalScrim");
const modalTitle = document.getElementById("modalTitle");
const modalClose = document.getElementById("modalClose");
const modalCancel = document.getElementById("modalCancel");
const itemForm = document.getElementById("itemForm");
const itemName = document.getElementById("itemName");
const itemPrice = document.getElementById("itemPrice");
const itemCategory = document.getElementById("itemCategory");
const itemDesc = document.getElementById("itemDesc");
const itemAvailable = document.getElementById("itemAvailable");

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
    try {
        sessionStorage.removeItem("tableqr_session");
    } catch (err) { console.warn("Could not clear session storage:", err); }
    window.location.href = "../index.html";
});

/* ==========================================================================
   DASHBOARD
========================================================================== */
function renderStats() {
    const totalOrdersToday = orders.length;
    const revenueToday = orders.reduce((sum, o) => sum + o.total, 0);
    const mostOrdered = getMostOrderedToday()[0];
    const customers = 412;

    const stats = [
        {
            label: "Daily sales", value: `$${revenueToday.toFixed(2)}`, delta: "+12.4%", up: true, note: "vs. yesterday",
            icon: `<svg viewBox="0 0 24 24" fill="none"><path d="M4 18V9M9.5 18V4M15 18v-6M20 18v-9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`
        },
        {
            label: "Total orders", value: String(totalOrdersToday), delta: "+3", up: true, note: "since 9:00 AM",
            icon: `<svg viewBox="0 0 24 24" fill="none"><path d="M6 3h12v18l-2.5-1.6L13 21l-2.5-1.6L8 21 6 19.4V3Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>`
        },
        {
            label: "Most ordered", value: mostOrdered ? mostOrdered.name : "—", delta: mostOrdered ? `×${mostOrdered.count}` : "", up: true, note: "today's favorite",
            icon: `<svg viewBox="0 0 24 24" fill="none"><path d="M6 3v7a2.5 2.5 0 0 0 5 0V3M8.5 3v18M17 3c-2 1.2-2 4.5-2 6.5s.6 3 2 3 2-1 2-3V3v18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`
        },
        {
            label: "Revenue (month)", value: "$28,940", delta: "+8.1%", up: true, note: "27 days in",
            icon: `<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8.5" stroke="currentColor" stroke-width="1.8"/><path d="M12 7.5v9M15 9.8c0-1.3-1.3-2.3-3-2.3s-3 .9-3 2.1c0 3.1 6 1.5 6 4.5 0 1.3-1.3 2.2-3 2.2s-3-.9-3-2.2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`
        },
        {
            label: "Customers", value: String(customers), delta: "+37 new", up: true, note: "this month",
            icon: `<svg viewBox="0 0 24 24" fill="none"><circle cx="9" cy="8.5" r="3" stroke="currentColor" stroke-width="1.8"/><path d="M3.5 19c.6-3.2 2.9-5 5.5-5s4.9 1.8 5.5 5M15.5 8.8a2.7 2.7 0 1 1 0-5.4M17 19c-.3-2-1.2-3.5-2.6-4.4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`
        },
    ];

    statGrid.innerHTML = stats.map(s => `
    <div class="stat-ticket ticket-edge">
      <div class="stat-ticket-top">
        <span class="stat-icon">${s.icon}</span>
        ${s.delta ? `<span class="stat-delta ${s.up ? "is-up" : "is-down"}">${s.delta}</span>` : ""}
      </div>
      <div class="stat-value">${s.value}</div>
      <div class="stat-label">${s.label}</div>
      <div class="stat-tear">${s.note}</div>
    </div>
  `).join("");
}

function renderBarChart() {
    const max = Math.max(...weekSales.map(d => d.value));
    barChart.innerHTML = weekSales.map(d => `
    <div class="bar-col">
      <div class="bar-fill ${d.day === "Today" ? "is-today" : ""}" style="height:${Math.round((d.value / max) * 100)}%" title="$${d.value.toFixed(2)}"></div>
      <span class="bar-day">${d.day}</span>
    </div>
  `).join("");
    salesTrendNote.textContent = "▲ trending up";
}

function getMostOrderedToday() {
    const counts = {};
    orders.forEach(o => {
        o.items.forEach(([name, qty]) => {
            counts[name] = (counts[name] || 0) + qty;
        });
    });
    return Object.entries(counts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);
}

function renderRankList() {
    const ranked = getMostOrderedToday().slice(0, 5);
    const max = ranked.length ? ranked[0].count : 1;
    rankList.innerHTML = ranked.map((item, i) => `
    <li class="rank-item">
      <span class="rank-num">0${i + 1}</span>
      <div class="rank-item-full">
        <div style="display:flex; justify-content:space-between;">
          <span class="rank-name">${item.name}</span>
          <span class="rank-count">×${item.count}</span>
        </div>
        <div class="rank-bar-track"><div class="rank-bar-fill" style="width:${(item.count / max) * 100}%"></div></div>
      </div>
    </li>
  `).join("");
}

function renderDashboard() {
    renderStats();
    renderBarChart();
    renderRankList();
}

/* ==========================================================================
   MENU
========================================================================== */
function renderCategoryTabs() {
    const all = ["All", ...CATEGORIES];
    categoryTabs.innerHTML = all.map(cat => {
        const count = cat === "All" ? menuItems.length : menuItems.filter(i => i.category === cat).length;
        return `<button class="chip-tab ${cat === activeCategory ? "is-active" : ""}" data-cat="${cat}">${cat} <span class="count">${count}</span></button>`;
    }).join("");

    categoryTabs.querySelectorAll(".chip-tab").forEach(btn => {
        btn.addEventListener("click", () => {
            activeCategory = btn.dataset.cat;
            renderCategoryTabs();
            renderMenuGrid();
        });
    });
}

function renderMenuGrid() {
    const items = activeCategory === "All" ? menuItems : menuItems.filter(i => i.category === activeCategory);

    if (!items.length) {
        menuGrid.innerHTML = `<p style="color:var(--muted); grid-column:1/-1;">No items in this category yet.</p>`;
        return;
    }

    menuGrid.innerHTML = items.map(item => `
    <div class="menu-card ticket-edge" data-id="${item.id}">
      <div class="menu-card-top">
        <div>
          <span class="menu-card-name">${item.name}</span>
          <span class="menu-card-cat">${item.category}</span>
        </div>
        <div class="card-actions">
          <button class="icon-action edit-item" aria-label="Edit ${item.name}">
            <svg viewBox="0 0 24 24" fill="none"><path d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17v3Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>
          </button>
          <button class="icon-action is-danger delete-item" aria-label="Delete ${item.name}">
            <svg viewBox="0 0 24 24" fill="none"><path d="M5 7h14M9.5 7V4.5h5V7M7 7l1 13h8l1-13" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
        </div>
      </div>
      <p class="menu-card-desc">${item.desc || ""}</p>
      <div class="menu-card-foot">
        <div class="price-edit">
          <span>$</span><span class="price-edit-value" data-id="${item.id}">${item.price.toFixed(2)}</span>
        </div>
        <span class="availability ${item.available ? "" : "is-off"}">
          <i class="dot ${item.available ? "dot-available" : "dot-reserved"}"></i>
          ${item.available ? "On menu" : "Hidden"}
        </span>
      </div>
    </div>
  `).join("");

    menuGrid.querySelectorAll(".edit-item").forEach(btn => {
        btn.addEventListener("click", (e) => openItemModal(e.target.closest(".menu-card").dataset.id));
    });
    menuGrid.querySelectorAll(".delete-item").forEach(btn => {
        btn.addEventListener("click", (e) => deleteItem(e.target.closest(".menu-card").dataset.id));
    });
    menuGrid.querySelectorAll(".price-edit-value").forEach(el => {
        el.addEventListener("click", () => beginInlinePriceEdit(el));
    });
}

function beginInlinePriceEdit(el) {
    const id = el.dataset.id;
    const item = menuItems.find(i => i.id === id);
    if (!item) return;

    const input = document.createElement("input");
    input.type = "number";
    input.step = "0.01";
    input.min = "0";
    input.value = item.price.toFixed(2);

    el.replaceWith(input);
    input.focus();
    input.select();

    function commit() {
        const val = parseFloat(input.value);
        if (!isNaN(val) && val >= 0) {
            item.price = val;
            showToast(`Updated price for ${item.name}`);
        }
        renderMenuGrid();
    }

    input.addEventListener("blur", commit);
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") input.blur();
        if (e.key === "Escape") { renderMenuGrid(); }
    });
}

function deleteItem(id) {
    const item = menuItems.find(i => i.id === id);
    if (!item) return;
    if (!confirm(`Remove "${item.name}" from the menu?`)) return;
    menuItems = menuItems.filter(i => i.id !== id);
    showToast(`Removed ${item.name}`);
    renderCategoryTabs();
    renderMenuGrid();
}

/* ----- Add / edit modal ----- */
function populateCategorySelect() {
    itemCategory.innerHTML = CATEGORIES.map(c => `<option value="${c}">${c}</option>`).join("");
}

function openItemModal(id) {
    editingItemId = id || null;
    populateCategorySelect();

    if (id) {
        const item = menuItems.find(i => i.id === id);
        modalTitle.textContent = "Edit item";
        itemName.value = item.name;
        itemPrice.value = item.price.toFixed(2);
        itemCategory.value = item.category;
        itemDesc.value = item.desc || "";
        itemAvailable.checked = item.available;
    } else {
        modalTitle.textContent = "Add item";
        itemForm.reset();
        itemAvailable.checked = true;
    }

    modalScrim.classList.add("is-open");
    itemName.focus();
}

function closeItemModal() {
    modalScrim.classList.remove("is-open");
    editingItemId = null;
}

addItemBtn.addEventListener("click", () => openItemModal(null));
modalClose.addEventListener("click", closeItemModal);
modalCancel.addEventListener("click", closeItemModal);
modalScrim.addEventListener("click", (e) => { if (e.target === modalScrim) closeItemModal(); });

itemForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const payload = {
        name: itemName.value.trim(),
        price: parseFloat(itemPrice.value),
        category: itemCategory.value,
        desc: itemDesc.value.trim(),
        available: itemAvailable.checked,
    };

    if (!payload.name || isNaN(payload.price)) return;

    if (editingItemId) {
        const item = menuItems.find(i => i.id === editingItemId);
        Object.assign(item, payload);
        showToast(`Saved changes to ${item.name}`);
    } else {
        menuItems.push({ id: "m" + Date.now(), ...payload });
        showToast(`Added ${payload.name} to the menu`);
    }

    closeItemModal();
    renderCategoryTabs();
    renderMenuGrid();
});

/* ==========================================================================
   ORDERS
========================================================================== */
function renderOrderStatusTabs() {
    const statuses = [
        { key: "all", label: "All" },
        { key: "new", label: "New order" },
        { key: "preparing", label: "Preparing" },
        { key: "ready", label: "Ready" },
        { key: "completed", label: "Completed" },
        { key: "cancelled", label: "Cancelled" },
    ];

    orderStatusTabs.innerHTML = statuses.map(s => {
        const count = s.key === "all" ? orders.length : orders.filter(o => o.status === s.key).length;
        return `<button class="chip-tab ${s.key === activeOrderStatus ? "is-active" : ""}" data-status="${s.key}">${s.label} <span class="count">${count}</span></button>`;
    }).join("");

    orderStatusTabs.querySelectorAll(".chip-tab").forEach(btn => {
        btn.addEventListener("click", () => {
            activeOrderStatus = btn.dataset.status;
            renderOrderStatusTabs();
            renderOrderGrid();
        });
    });
}

function renderOrderGrid() {
    const filtered = activeOrderStatus === "all" ? orders : orders.filter(o => o.status === activeOrderStatus);

    if (!filtered.length) {
        orderGrid.innerHTML = `<p style="color:var(--muted); grid-column:1/-1;">No orders in this stage right now.</p>`;
        return;
    }

    orderGrid.innerHTML = filtered.map(order => {
        const flowIndex = ORDER_STATUS_FLOW.indexOf(order.status);
        const canAdvance = flowIndex > -1 && flowIndex < ORDER_STATUS_FLOW.length - 1;
        const nextLabel = canAdvance ? `Mark ${STATUS_LABEL[ORDER_STATUS_FLOW[flowIndex + 1]]}` : (order.status === "completed" ? "Order complete" : "Order cancelled");

        return `
      <div class="order-card ticket-edge" data-id="${order.id}">
        <div class="order-card-top">
          <div>
            <div class="order-id">${order.id}</div>
            <div class="order-table">Table ${order.table}</div>
          </div>
          <span class="status-pill ${order.status}">${STATUS_LABEL[order.status]}</span>
        </div>
        <ul class="order-items">
          ${order.items.map(([name, qty]) => `<li><span>${name}</span><span>×${qty}</span></li>`).join("")}
        </ul>
        <div class="order-card-foot">
          <span class="order-total">$${order.total.toFixed(2)}</span>
          <span class="order-time">${order.time}</span>
        </div>
        <button class="order-next-btn" data-id="${order.id}" ${canAdvance ? "" : "disabled"}>${nextLabel}</button>
      </div>
    `;
    }).join("");

    orderGrid.querySelectorAll(".order-next-btn").forEach(btn => {
        btn.addEventListener("click", () => advanceOrder(btn.dataset.id));
    });

    ordersBadge.textContent = orders.filter(o => o.status === "new" || o.status === "preparing").length;
}

function advanceOrder(id) {
    const order = orders.find(o => o.id === id);
    if (!order) return;
    const idx = ORDER_STATUS_FLOW.indexOf(order.status);
    if (idx > -1 && idx < ORDER_STATUS_FLOW.length - 1) {
        order.status = ORDER_STATUS_FLOW[idx + 1];
        showToast(`${order.id} moved to ${STATUS_LABEL[order.status]}`);
    }
    renderOrderStatusTabs();
    renderOrderGrid();
    renderDashboard();
}

/* ==========================================================================
   TABLES
========================================================================== */
function renderTableGrid() {
    tableGrid.innerHTML = tables.map(t => `
    <div class="table-card ${t.status}" data-num="${t.num}">
      <span class="table-num">${t.num}</span>
      <span class="table-cap">${t.cap} seats</span>
      <span class="table-status">${t.status}</span>
      <span class="table-meta">${t.meta}</span>
    </div>
  `).join("");

    tableGrid.querySelectorAll(".table-card").forEach(card => {
        card.addEventListener("click", () => cycleTableStatus(Number(card.dataset.num)));
    });
}

function cycleTableStatus(num) {
    const table = tables.find(t => t.num === num);
    if (!table) return;
    const idx = TABLE_STATUS_FLOW.indexOf(table.status);
    table.status = TABLE_STATUS_FLOW[(idx + 1) % TABLE_STATUS_FLOW.length];
    table.meta = table.status === "available" ? "Ready to seat" : table.status === "occupied" ? "Seated just now" : "Reserved";
    showToast(`Table ${num} set to ${table.status}`);
    renderTableGrid();
}

/* ----------------------------------------------------------------------
   RANGE TOGGLE (cosmetic — demo data doesn't change per range)
---------------------------------------------------------------------- */
document.querySelectorAll(".range-toggle button").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".range-toggle button").forEach(b => b.classList.remove("is-active"));
        btn.classList.add("is-active");
    });
});

/* ==========================================================================
   INIT
========================================================================== */
renderDashboard();
renderCategoryTabs();
renderMenuGrid();
renderOrderStatusTabs();
renderOrderGrid();
renderTableGrid();