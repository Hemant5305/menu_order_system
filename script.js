/* =========================================================
   STATE
========================================================= */
const state = {
    cafe: { name: "Kettle & Crumb", tagline: "All-day café · Sante Majra", address: "Sector 115, Sante Majra", hours: "Open daily · 8:00 AM – 10:00 PM", phone: "+91 98xxx xxxxx", tableCount: 20, orderSound: true },
    categories: ['Breakfast', 'Starters', 'Main Course', 'Beverages', 'Desserts'],
    menu: [
        { id: 1, name: 'Masala Dosa', desc: 'Crisp rice crepe, spiced potato filling, coconut chutney & sambar.', price: 180, cat: 'Breakfast', diet: 'veg', spice: 1, rating: 4.7, bestseller: true, available: true, img: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?q=80&w=600&auto=format&fit=crop' },
        { id: 2, name: 'Eggs Benedict', desc: 'Poached eggs, hollandaise, toasted muffin, hash browns.', price: 290, cat: 'Breakfast', diet: 'nonveg', spice: 0, rating: 4.6, bestseller: false, available: true, img: 'https://images.unsplash.com/photo-1608039755401-742074f0548d?q=80&w=600&auto=format&fit=crop' },
        { id: 3, name: 'Belgian Waffle', desc: 'Buttermilk waffle, maple syrup, seasonal berries.', price: 220, cat: 'Breakfast', diet: 'veg', spice: 0, rating: 4.8, bestseller: true, available: true, img: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?q=80&w=600&auto=format&fit=crop' },
        { id: 4, name: 'Peri-Peri Fries', desc: 'Skin-on fries tossed in smoky peri-peri seasoning.', price: 150, cat: 'Starters', diet: 'veg', spice: 2, rating: 4.5, bestseller: true, available: true, img: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=600&auto=format&fit=crop' },
        { id: 5, name: 'Chicken Seekh Skewers', desc: 'Char-grilled minced chicken skewers, mint chutney.', price: 260, cat: 'Starters', diet: 'nonveg', spice: 2, rating: 4.6, bestseller: false, available: true, img: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=600&auto=format&fit=crop' },
        { id: 6, name: 'Paneer Tikka', desc: 'Chargrilled cottage cheese, bell pepper, tandoori spice.', price: 240, cat: 'Starters', diet: 'veg', spice: 1, rating: 4.7, bestseller: false, available: true, img: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?q=80&w=600&auto=format&fit=crop' },
        { id: 7, name: 'Butter Chicken', desc: 'Slow-cooked chicken in a rich tomato-butter gravy.', price: 340, cat: 'Main Course', diet: 'nonveg', spice: 1, rating: 4.9, bestseller: true, available: true, img: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=600&auto=format&fit=crop' },
        { id: 8, name: 'Truffle Mushroom Risotto', desc: 'Creamy arborio rice, wild mushrooms, truffle oil.', price: 380, cat: 'Main Course', diet: 'veg', spice: 0, rating: 4.6, bestseller: false, available: true, img: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?q=80&w=600&auto=format&fit=crop' },
        { id: 9, name: 'Margherita Pizza', desc: 'San Marzano tomato, fresh mozzarella, basil.', price: 310, cat: 'Main Course', diet: 'veg', spice: 0, rating: 4.7, bestseller: true, available: false, img: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=600&auto=format&fit=crop' },
        { id: 10, name: 'Flat White', desc: 'Double espresso, steamed micro-foam milk.', price: 150, cat: 'Beverages', diet: 'veg', spice: 0, rating: 4.8, bestseller: true, available: true, img: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?q=80&w=600&auto=format&fit=crop' },
        { id: 11, name: 'Iced Caramel Latte', desc: 'Espresso, cold milk, caramel drizzle over ice.', price: 190, cat: 'Beverages', diet: 'veg', spice: 0, rating: 4.6, bestseller: false, available: true, img: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=600&auto=format&fit=crop' },
        { id: 12, name: 'Masala Chai', desc: 'Spiced Assam tea brewed with fresh milk.', price: 80, cat: 'Beverages', diet: 'veg', spice: 1, rating: 4.9, bestseller: true, available: true, img: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?q=80&w=600&auto=format&fit=crop' },
        { id: 13, name: 'Molten Chocolate Cake', desc: 'Warm chocolate cake, liquid centre, vanilla ice cream.', price: 220, cat: 'Desserts', diet: 'veg', spice: 0, rating: 4.9, bestseller: true, available: true, img: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?q=80&w=600&auto=format&fit=crop' },
        { id: 14, name: 'New York Cheesecake', desc: 'Classic baked cheesecake, berry compote.', price: 210, cat: 'Desserts', diet: 'veg', spice: 0, rating: 4.7, bestseller: false, available: true, img: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=600&auto=format&fit=crop' },
    ],
    cart: {},              // itemId -> qty
    orders: [],            // {id, table, items:[{id,name,price,qty}], subtotal, tax, total, note, status, time}
    revenueLog: [],        // {date, amount, source, note}
    activity: []
};
let orderSeq = 240;
let tableNumber = 7;
let adminPassword = 'owner123';
let editingItemId = null;

function logActivity(text) {
    state.activity.unshift({ text, time: Date.now() });
    if (state.activity.length > 25) state.activity.pop();
}
function timeAgo(ts) {
    const s = Math.floor((Date.now() - ts) / 1000);
    if (s < 10) return 'just now';
    if (s < 60) return s + 's ago';
    const m = Math.floor(s / 60); if (m < 60) return m + ' min ago';
    const h = Math.floor(m / 60); if (h < 24) return h + ' hr ago';
    return Math.floor(h / 24) + ' day(s) ago';
}
function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg; t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3400);
}
function money(n) { return '₹' + Math.round(n).toLocaleString('en-IN'); }

/* =========================================================
   TABLE DETECTION (simulated QR scan via ?table= param)
========================================================= */
function initTable() {
    const params = new URLSearchParams(window.location.search);
    const t = parseInt(params.get('table'));
    tableNumber = (t && t > 0) ? t : 7;
    document.getElementById('tableNumDisplay').textContent = String(tableNumber).padStart(2, '0');
    document.getElementById('simTableInput').value = tableNumber;
    document.getElementById('ticketTable').textContent = String(tableNumber).padStart(2, '0');
}
document.getElementById('simTableGo').addEventListener('click', () => {
    const v = parseInt(document.getElementById('simTableInput').value) || 7;
    const url = new URL(window.location.href);
    url.searchParams.set('table', v);
    window.history.replaceState({}, '', url);
    tableNumber = v;
    document.getElementById('tableNumDisplay').textContent = String(v).padStart(2, '0');
    document.getElementById('ticketTable').textContent = String(v).padStart(2, '0');
    showToast(`Scanned — you're now ordering for Table ${v}`);
});

/* =========================================================
   SCROLL REVEAL
========================================================= */
const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in-view'); });
}, { threshold: 0.12 });
function observeReveals() { document.querySelectorAll('.dish-card.reveal').forEach(el => io.observe(el)); }

/* =========================================================
   CUSTOMER MENU RENDER
========================================================= */
let activeCategory = 'All';
let activeDietFilter = 'all';
let searchTerm = '';

function renderCatRail() {
    const cats = ['All', ...state.categories];
    document.getElementById('catRail').innerHTML = cats.map(c =>
        `<button class="cat-chip ${c === activeCategory ? 'active' : ''}" onclick="setCategory('${c}')">${c}</button>`).join('');
}
function setCategory(cat) { activeCategory = cat; renderCatRail(); renderMenuGrid(); }
function setDietFilter(f, el) {
    activeDietFilter = f;
    document.querySelectorAll('.fp').forEach(b => b.classList.remove('active'));
    el.classList.add('active');
    renderMenuGrid();
}
document.getElementById('menuSearch').addEventListener('input', function () {
    searchTerm = this.value.trim().toLowerCase();
    renderMenuGrid();
});

function renderMenuGrid() {
    let items = state.menu.filter(i => {
        if (activeCategory !== 'All' && i.cat !== activeCategory) return false;
        if (activeDietFilter === 'veg' && i.diet !== 'veg') return false;
        if (activeDietFilter === 'nonveg' && i.diet !== 'nonveg') return false;
        if (activeDietFilter === 'bestseller' && !i.bestseller) return false;
        if (searchTerm && !(i.name.toLowerCase().includes(searchTerm) || i.desc.toLowerCase().includes(searchTerm))) return false;
        return true;
    });
    const grid = document.getElementById('menuGrid');
    document.getElementById('noResults').classList.toggle('hidden-panel', items.length > 0);
    grid.innerHTML = items.map(i => {
        const qty = state.cart[i.id] || 0;
        return `
    <div class="dish-card reveal ${!i.available ? 'unavailable' : ''}">
      <div class="dish-photo">
        <img src="${i.img}" alt="${i.name}" loading="lazy">
        <span class="diet-mark ${i.diet}"></span>
        ${i.bestseller ? '<span class="best-ribbon">★ Bestseller</span>' : ''}
        ${!i.available ? '<div class="sold-out-flag">Sold Out</div>' : ''}
      </div>
      <div class="dish-body">
        <div class="dish-top"><span class="dish-name">${i.name}</span>
          <span class="dish-rating">★ <b>${i.rating}</b></span>
        </div>
        <div class="spice-row">${'🌶️'.repeat(i.spice)}</div>
        <div class="dish-desc">${i.desc}</div>
        <div class="dish-foot">
          <span class="dish-price">${money(i.price)}</span>
          ${!i.available ? '' : qty > 0 ?
                `<div class="qty-stepper">
              <button onclick="changeQty(${i.id},-1)">−</button>
              <span>${qty}</span>
              <button onclick="changeQty(${i.id},1)">+</button>
            </div>` :
                `<button class="add-btn" onclick="changeQty(${i.id},1)">Add +</button>`
            }
        </div>
      </div>
    </div>`;
    }).join('');
    observeReveals();
}

/* =========================================================
   CART
========================================================= */
function changeQty(id, delta) {
    const cur = state.cart[id] || 0;
    const next = Math.max(0, cur + delta);
    if (next === 0) delete state.cart[id]; else state.cart[id] = next;
    renderMenuGrid();
    renderCartTab();
    renderTicket();
}
function cartLines() {
    return Object.entries(state.cart).map(([id, qty]) => {
        const item = state.menu.find(m => m.id == id);
        return { item, qty };
    }).filter(l => l.item);
}
function cartTotals() {
    const subtotal = cartLines().reduce((sum, l) => sum + l.item.price * l.qty, 0);
    const tax = subtotal * 0.05;
    return { subtotal, tax, total: subtotal + tax };
}
function renderCartTab() {
    const lines = cartLines();
    const count = lines.reduce((s, l) => s + l.qty, 0);
    const { total } = cartTotals();
    document.getElementById('cartTab').classList.toggle('hidden-panel', count === 0);
    document.getElementById('cartTabCount').textContent = count;
    document.getElementById('cartTabTotal').textContent = money(total);
}
function renderTicket() {
    const lines = cartLines();
    const { subtotal, tax, total } = cartTotals();
    document.getElementById('ticketEmpty').classList.toggle('hidden-panel', lines.length > 0);
    document.getElementById('ticketItems').innerHTML = lines.map(l => `
    <div class="ticket-item">
      <span class="ti-name">${l.item.name} <span style="opacity:.6;">×${l.qty}</span></span>
      <div class="ti-qty-ctrl">
        <button onclick="changeQty(${l.item.id},-1)">−</button>
        <span>${money(l.item.price * l.qty)}</span>
        <button onclick="changeQty(${l.item.id},1)">+</button>
      </div>
    </div>`).join('');
    document.getElementById('ticketSubtotal').textContent = money(subtotal);
    document.getElementById('ticketTax').textContent = money(tax);
    document.getElementById('ticketTotal').textContent = money(total);
    document.getElementById('ticketTime').textContent = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    document.getElementById('placeOrderBtn').style.opacity = lines.length ? '1' : '.5';
    document.getElementById('placeOrderBtn').style.pointerEvents = lines.length ? 'all' : 'none';
}
function openCartDrawer() { renderTicket(); document.getElementById('cartDrawerBg').classList.add('show'); }
function closeCartDrawer() { document.getElementById('cartDrawerBg').classList.remove('show'); }

function placeOrder() {
    const lines = cartLines();
    if (!lines.length) return;
    const { subtotal, tax, total } = cartTotals();
    const order = {
        id: 'T' + tableNumber + '-' + (orderSeq++),
        table: tableNumber,
        items: lines.map(l => ({ id: l.item.id, name: l.item.name, price: l.item.price, qty: l.qty })),
        subtotal, tax, total,
        note: document.getElementById('ticketNote').value,
        status: 'Placed',
        time: Date.now()
    };
    state.orders.unshift(order);
    logActivity(`New order <b>${order.id}</b> from Table ${order.table} — ${money(total)}`);
    state.cart = {};
    document.getElementById('ticketNote').value = '';
    renderMenuGrid(); renderCartTab();
    closeCartDrawer();
    showToast(`Order placed! Ticket ${order.id} sent to the kitchen.`);
    showTracker(order);
    if (document.getElementById('adminShell') && document.getElementById('adminShell').classList.contains('show')) renderAdminData();
}
function showTracker(order) {
    document.getElementById('trackerBar').classList.remove('hidden-panel');
    document.getElementById('trackerOrderId').textContent = order.id;
    document.getElementById('trackerStatus').textContent = order.status;
    document.getElementById('trackerStatus').className = 'tracker-status';
    window._activeOrderId = order.id;
}
function refreshTracker() {
    if (!window._activeOrderId) return;
    const order = state.orders.find(o => o.id === window._activeOrderId);
    if (!order) return;
    document.getElementById('trackerStatus').textContent = order.status;
    if (order.status === 'Completed') {
        setTimeout(() => { document.getElementById('trackerBar').classList.add('hidden-panel'); window._activeOrderId = null; }, 2500);
    }
}
function openTrackerDetail() {
    if (!window._activeOrderId) return;
    const order = state.orders.find(o => o.id === window._activeOrderId);
    if (!order) return;
    showToast(`${order.id} — ${order.items.reduce((s, i) => s + i.qty, 0)} items — currently ${order.status}`);
}

/* =========================================================
   ADMIN — LOGIN
========================================================= */
function openAdmin(e) { e.preventDefault(); document.getElementById('admin-root').classList.add('show'); }
function closeAdmin(e) {
    if (e) e.preventDefault();
    document.getElementById('admin-root').classList.remove('show');
    document.getElementById('adminLogin').style.display = 'flex';
    document.getElementById('adminShell').classList.remove('show');
    document.getElementById('loginForm').reset();
}
document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const pass = document.getElementById('loginPass').value;
    if (pass !== adminPassword) { showToast('Incorrect password — try owner123'); return; }
    document.getElementById('adminLogin').style.display = 'none';
    document.getElementById('adminShell').classList.add('show');
    renderAdminData();
});
function switchTab(tab, el) {
    document.querySelectorAll('.side-link[data-tab]').forEach(l => l.classList.remove('active'));
    el.classList.add('active');
    document.querySelectorAll('.admin-tab').forEach(t => t.classList.add('hidden-panel'));
    document.getElementById('tab-' + tab).classList.remove('hidden-panel');
}
function switchTabByName(tab) { const el = document.querySelector(`.side-link[data-tab="${tab}"]`); if (el) switchTab(tab, el); }

/* =========================================================
   ADMIN — DASHBOARD RENDER
========================================================= */
function animateStatCounts() {
    document.querySelectorAll('.val[data-count]').forEach(el => {
        const target = parseFloat(el.dataset.count) || 0;
        const prefix = el.dataset.prefix || '';
        const start = performance.now(); const duration = 800;
        function tick(now) {
            const p = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = prefix + Math.round(target * eased).toLocaleString('en-IN');
            if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    });
}
function todayStr(d) { return (d ? new Date(d) : new Date()).toISOString().slice(0, 10); }
function ordersToday() { return state.orders.filter(o => todayStr(o.time) === todayStr()); }
function revenueFromOrders(dateStr) {
    return state.orders.filter(o => o.status === 'Completed' && todayStr(o.time) === dateStr).reduce((s, o) => s + o.total, 0);
}
function revenueManual(dateStr) {
    return state.revenueLog.filter(r => r.date === dateStr).reduce((s, r) => s + r.amount, 0);
}
function totalRevenueForDate(dateStr) { return revenueFromOrders(dateStr) + revenueManual(dateStr); }

function statusPill(s) { return `<span class="pill ${s}">${s}</span>`; }

function renderAdminData() {
    const today = todayStr();
    const todays = ordersToday();
    const pending = state.orders.filter(o => o.status === 'Placed').length;
    const preparing = state.orders.filter(o => o.status === 'Preparing').length;
    const served = state.orders.filter(o => o.status === 'Served').length;
    const completed = state.orders.filter(o => o.status === 'Completed').length;
    const todayRevenue = totalRevenueForDate(today);

    // best seller
    const tally = {};
    state.orders.forEach(o => o.items.forEach(i => { tally[i.name] = (tally[i.name] || 0) + i.qty; }));
    const best = Object.entries(tally).sort((a, b) => b[1] - a[1])[0];

    document.getElementById('statGrid').innerHTML = `
    <div class="stat-card"><span class="lbl">Today's Revenue</span><div class="val" data-count="${todayRevenue}" data-prefix="₹">₹0</div><div class="delta">Orders + manual entries</div></div>
    <div class="stat-card"><span class="lbl">Orders Today</span><div class="val" data-count="${todays.length}">0</div><div class="delta">${pending} awaiting action</div></div>
    <div class="stat-card"><span class="lbl">Pending Orders</span><div class="val" data-count="${pending}">0</div><div class="delta">Needs kitchen attention</div></div>
    <div class="stat-card"><span class="lbl">Best Seller</span><div class="val" style="font-size:19px;">${best ? best[0] : '—'}</div><div class="delta">${best ? best[1] + ' sold' : 'No orders yet'}</div></div>
  `;
    animateStatCounts();

    const total = Math.max(state.orders.length, 1);
    const statuses = [{ n: 'Placed', c: pending }, { n: 'Preparing', c: preparing }, { n: 'Served', c: served }, { n: 'Completed', c: completed }];
    document.getElementById('statusBars').innerHTML = statuses.map(s => `
    <div class="status-bar-row">
      <div class="status-bar-top"><span>${s.n}</span><span>${s.c}</span></div>
      <div class="status-bar-track"><div class="status-bar-fill ${s.n}" style="width:${Math.round((s.c / total) * 100)}%"></div></div>
    </div>`).join('');

    document.getElementById('activityFeed').innerHTML = state.activity.length ? state.activity.slice(0, 8).map(a => `
    <div class="activity-item"><span class="activity-dot"></span><div><b>${a.text}</b><span>${timeAgo(a.time)}</span></div></div>
  `).join('') : `<div class="activity-empty">No activity yet — new orders and updates show up here.</div>`;

    document.getElementById('recentOrdersBody').innerHTML = state.orders.slice(0, 6).map(o => `
    <tr><td>${o.id}</td><td>Table ${o.table}</td><td>${o.items.reduce((s, i) => s + i.qty, 0)} items</td><td>${money(o.total)}</td><td>${statusPill(o.status)}</td></tr>
  `).join('') || `<tr><td colspan="5" class="empty-note">No orders yet — place one from the customer menu to see it here.</td></tr>`;

    document.getElementById('orderCount').textContent = state.orders.length + ' orders';
    renderOrderBoard();
    renderMenuAdmin();
    renderRevenueTab();
}

/* =========================================================
   ORDERS BOARD (kanban by status)
========================================================= */
const orderFlow = { Placed: 'Preparing', Preparing: 'Served', Served: 'Completed' };
function advanceOrder(id) {
    const order = state.orders.find(o => o.id === id);
    if (!order || !orderFlow[order.status]) return;
    order.status = orderFlow[order.status];
    logActivity(`Order <b>${order.id}</b> moved to <b>${order.status}</b>`);
    renderAdminData();
    refreshTracker();
    showToast(`${order.id} marked ${order.status}`);
}
function renderOrderBoard() {
    const cols = ['Placed', 'Preparing', 'Served', 'Completed'];
    document.getElementById('orderCols').innerHTML = cols.map(status => {
        const orders = state.orders.filter(o => o.status === status);
        return `
    <div class="order-col">
      <div class="order-col-head"><span>${status}</span><span>${orders.length}</span></div>
      ${orders.length ? orders.map(o => `
        <div class="order-card">
          <div class="oc-top"><span>${o.id}</span><span>Table ${o.table}</span></div>
          <ul>${o.items.map(i => `<li><span>${i.name} ×${i.qty}</span><span>${money(i.price * i.qty)}</span></li>`).join('')}</ul>
          <div class="oc-total">Total ${money(o.total)}</div>
          ${o.note ? `<div class="oc-note">"${o.note}"</div>` : ''}
          ${orderFlow[status] ? `<button class="mini-btn ok" style="width:100%;" onclick="advanceOrder('${o.id}')">Mark ${orderFlow[status]}</button>` : ''}
        </div>
      `).join('') : `<div class="empty-col">No orders</div>`}
    </div>`;
    }).join('');
}

/* =========================================================
   MENU MANAGEMENT
========================================================= */
let adminCatFilter = 'All';
function setAdminCatFilter(cat) { adminCatFilter = cat; renderMenuAdmin(); }
function renderMenuAdmin() {
    const cats = ['All', ...state.categories];
    document.getElementById('adminCatFilter').innerHTML = cats.map(c =>
        `<button class="mini-btn ${c === adminCatFilter ? 'ok' : ''}" onclick="setAdminCatFilter('${c}')">${c}</button>`).join('');
    const items = adminCatFilter === 'All' ? state.menu : state.menu.filter(i => i.cat === adminCatFilter);
    document.getElementById('adminMenuGrid').innerHTML = items.map(i => `
    <div class="menu-admin-card ${!i.available ? 'inactive' : ''}">
      <img src="${i.img}">
      <div class="mac-body">
        <div class="mac-top"><b>${i.name}</b><span class="mac-price">${money(i.price)}</span></div>
        <div class="mac-cat">${i.cat} · ${i.diet === 'veg' ? 'Veg' : 'Non-Veg'}${i.bestseller ? ' · ★ Bestseller' : ''}</div>
        <div class="mac-footer">
          <label class="switch-row" style="gap:8px;">
            <input type="checkbox" ${i.available ? 'checked' : ''} onchange="toggleAvailability(${i.id})">
            <span style="font-size:11px;">${i.available ? 'Available' : 'Sold Out'}</span>
          </label>
          <button class="mini-btn" onclick="openItemEditor(${i.id})">Edit</button>
        </div>
      </div>
    </div>`).join('');
    document.getElementById('menuCount').textContent = state.menu.length + ' items';
}
function toggleAvailability(id) {
    const item = state.menu.find(m => m.id === id);
    item.available = !item.available;
    logActivity(`${item.name} marked ${item.available ? 'available' : 'sold out'}`);
    renderMenuAdmin(); renderMenuGrid();
}

let editorImgData = null;
function openItemEditor(id) {
    editingItemId = id || null;
    const item = id ? state.menu.find(m => m.id === id) : null;
    document.getElementById('editorTitle').textContent = item ? 'Edit Menu Item' : 'Add Menu Item';
    document.getElementById('editorCategory').innerHTML = state.categories.map(c => `<option ${item && item.cat === c ? 'selected' : ''}>${c}</option>`).join('');
    document.getElementById('editorName').value = item ? item.name : '';
    document.getElementById('editorDesc').value = item ? item.desc : '';
    document.getElementById('editorPrice').value = item ? item.price : '';
    document.getElementById('editorDiet').value = item ? item.diet : 'veg';
    document.getElementById('editorSpice').value = item ? item.spice : '0';
    document.getElementById('editorBestseller').checked = item ? item.bestseller : false;
    editorImgData = item ? item.img : 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=600&auto=format&fit=crop';
    document.getElementById('editorImgPreview').src = editorImgData;
    document.getElementById('editorDeleteWrap').innerHTML = item ? `<button type="button" class="mini-btn danger" onclick="deleteEditorItem()">Delete Item</button>` : '';
    document.getElementById('itemEditorBg').classList.add('show');
}
function closeItemEditor() { document.getElementById('itemEditorBg').classList.remove('show'); }
function handleEditorImageUpload(e) {
    const file = e.target.files[0]; if (!file) return;
    const r = new FileReader();
    r.onload = () => { editorImgData = r.result; document.getElementById('editorImgPreview').src = editorImgData; };
    r.readAsDataURL(file);
}
function saveEditorItem() {
    const name = document.getElementById('editorName').value.trim();
    if (!name) { showToast('Please enter a dish name'); return; }
    const data = {
        name,
        desc: document.getElementById('editorDesc').value.trim(),
        price: parseInt(document.getElementById('editorPrice').value) || 0,
        cat: document.getElementById('editorCategory').value,
        diet: document.getElementById('editorDiet').value,
        spice: parseInt(document.getElementById('editorSpice').value),
        bestseller: document.getElementById('editorBestseller').checked,
        img: editorImgData,
        rating: 4.5,
        available: true
    };
    if (editingItemId) {
        const item = state.menu.find(m => m.id === editingItemId);
        Object.assign(item, data);
        logActivity(`Menu item <b>${name}</b> was updated`);
        showToast('Item updated');
    } else {
        const newId = Math.max(0, ...state.menu.map(m => m.id)) + 1;
        state.menu.push({ id: newId, ...data });
        logActivity(`New menu item <b>${name}</b> was added`);
        showToast('Item added to the live menu');
    }
    closeItemEditor();
    renderMenuAdmin(); renderMenuGrid(); renderCatRail();
}
function deleteEditorItem() {
    if (!confirm('Remove this item from the menu?')) return;
    state.menu = state.menu.filter(m => m.id !== editingItemId);
    logActivity('A menu item was deleted');
    closeItemEditor();
    renderMenuAdmin(); renderMenuGrid();
    showToast('Item removed');
}

/* =========================================================
   REVENUE
========================================================= */
document.getElementById('revenueForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const date = document.getElementById('revDate').value;
    const amount = parseFloat(document.getElementById('revAmount').value) || 0;
    const note = document.getElementById('revNote').value.trim();
    if (!date || amount <= 0) { showToast('Enter a valid date and amount'); return; }
    state.revenueLog.unshift({ date, amount, source: 'Manual', note });
    logActivity(`Manual revenue entry added — ${money(amount)} on ${date}`);
    this.reset();
    renderRevenueTab();
    showToast('Revenue entry added');
});
function renderRevenueTab() {
    const today = todayStr();
    const todayTotal = totalRevenueForDate(today);
    const last7 = [...Array(7)].map((_, i) => {
        const d = new Date(); d.setDate(d.getDate() - (6 - i));
        const ds = todayStr(d);
        return { date: ds, amount: totalRevenueForDate(ds), label: d.toLocaleDateString('en-IN', { weekday: 'short' }) };
    });
    const weekTotal = last7.reduce((s, d) => s + d.amount, 0);
    const avg = weekTotal / 7;
    document.getElementById('revenueStatGrid').innerHTML = `
    <div class="stat-card"><span class="lbl">Today</span><div class="val" data-count="${todayTotal}" data-prefix="₹">₹0</div><div class="delta">Live total</div></div>
    <div class="stat-card"><span class="lbl">Last 7 Days</span><div class="val" data-count="${weekTotal}" data-prefix="₹">₹0</div><div class="delta">Combined revenue</div></div>
    <div class="stat-card"><span class="lbl">Daily Average</span><div class="val" data-count="${Math.round(avg)}" data-prefix="₹">₹0</div><div class="delta">Across the week</div></div>
    <div class="stat-card"><span class="lbl">Completed Orders</span><div class="val" data-count="${state.orders.filter(o => o.status === 'Completed').length}">0</div><div class="delta">All time (session)</div></div>
  `;
    animateStatCounts();
    const max = Math.max(...last7.map(d => d.amount), 1);
    document.getElementById('revenueChart').innerHTML = last7.map(d => `
    <div class="rc-bar-wrap">
      <span class="rc-amt">${d.amount ? money(d.amount) : ''}</span>
      <div class="rc-bar" style="height:${Math.max(4, (d.amount / max) * 120)}px"></div>
      <span class="rc-label">${d.label}</span>
    </div>`).join('');

    const combined = [
        ...state.revenueLog.map(r => ({ date: r.date, source: r.source, note: r.note, amount: r.amount })),
        ...Object.values(state.orders.filter(o => o.status === 'Completed').reduce((acc, o) => {
            const d = todayStr(o.time);
            if (!acc[d]) acc[d] = { date: d, source: 'Orders', note: 'Completed table orders', amount: 0 };
            acc[d].amount += o.total;
            return acc;
        }, {}))
    ].sort((a, b) => b.date.localeCompare(a.date));
    document.getElementById('revenueLogBody').innerHTML = combined.map(r => `
    <tr><td>${r.date}</td><td>${r.source}</td><td>${r.note || '—'}</td><td>${money(r.amount)}</td></tr>
  `).join('') || `<tr><td colspan="4" class="empty-note">No revenue logged yet.</td></tr>`;
}

/* =========================================================
   SETTINGS
========================================================= */
document.getElementById('settingsForm').addEventListener('submit', function (e) {
    e.preventDefault();
    state.cafe.name = document.getElementById('setCafeName').value;
    state.cafe.tagline = document.getElementById('setTagline').value;
    state.cafe.address = document.getElementById('setAddress').value;
    state.cafe.hours = document.getElementById('setHours').value;
    state.cafe.phone = document.getElementById('setPhone').value;
    state.cafe.tableCount = parseInt(document.getElementById('setTableCount').value) || 20;
    state.cafe.orderSound = document.getElementById('setOrderSound').checked;

    document.querySelector('.brand-name').textContent = state.cafe.name;
    document.querySelector('.brand-tag').textContent = state.cafe.tagline;
    document.querySelector('.menu-footer div:first-child').innerHTML = `<b>${state.cafe.name}</b> · ${state.cafe.address}`;
    document.querySelector('.menu-footer div:nth-child(2)').textContent = state.cafe.hours;
    document.title = state.cafe.name + ' — Table Order';

    logActivity('Café settings were updated and published');
    document.getElementById('settingsSavedNote').textContent = '✓ Published to live menu';
    setTimeout(() => document.getElementById('settingsSavedNote').textContent = '', 3000);
    showToast('Settings saved');
});

/* =========================================================
   INIT
========================================================= */
initTable();
renderCatRail();
renderMenuGrid();
renderCartTab();
observeReveals();
document.getElementById('revDate').value = todayStr();