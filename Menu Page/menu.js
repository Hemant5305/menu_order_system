const MENU = {
  coffee: [
    { id:'c1', name:'Single Origin Pour Over', desc:'Slow-brewed Ethiopian Yirgacheffe, bright and floral with citrus notes.', price:320, tags:['veg','bestseller'], img:'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&q=70' },
    { id:'c2', name:'Flat White', desc:'Double ristretto with steamed microfoam milk. Silky and strong.', price:260, tags:['veg'], img:'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300&q=70' },
    { id:'c3', name:'Cold Brew', desc:'18-hour cold-steeped concentrate served over ice. Clean and bold.', price:290, tags:['veg','bestseller'], img:'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=300&q=70' },
    { id:'c4', name:'Espresso', desc:'Single or double shot of our house blend — dark chocolate, walnut.', price:180, tags:['veg'], img:'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=300&q=70' },
    { id:'c5', name:'Café Latte', desc:'Full-bodied espresso with steamed milk and a thin layer of foam.', price:240, tags:['veg'], img:'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=300&q=70' },
    { id:'c6', name:'Iced Mocha', desc:'Espresso, chocolate sauce, milk and ice — dessert in a glass.', price:310, tags:['veg','bestseller'], img:'https://images.unsplash.com/photo-1534778101976-62847782c213?w=300&q=70' },
  ],
  tea: [
    { id:'t1', name:'Masala Chai', desc:'House blend of Assam tea, ginger, cardamom, cinnamon and cloves.', price:140, tags:['veg'], img:'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300&q=70' },
    { id:'t2', name:'Blue Matcha Latte', desc:'Butterfly pea flower + oat milk — naturally vivid, earthy-sweet.', price:280, tags:['veg','bestseller'], img:'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=300&q=70' },
    { id:'t3', name:'Fresh Lime Soda', desc:'Muddled lime, chat masala, soda — salted or sweet.', price:120, tags:['veg'], img:'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=300&q=70' },
  ],
  food: [
    { id:'f1', name:'Avocado Toast', desc:'Sourdough, smashed avo, chilli flakes, lemon oil and micro greens.', price:380, tags:['veg','bestseller'], img:'https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?w=300&q=70' },
    { id:'f2', name:'Shakshuka', desc:'Eggs poached in spiced tomato-pepper sauce, served with pita bread.', price:420, tags:['veg','spicy'], img:'https://images.unsplash.com/photo-1590759668628-05b0fc34bb70?w=300&q=70' },
    { id:'f3', name:'Chicken Club Sandwich', desc:'Grilled chicken, cheddar, bacon, lettuce, tomato and chipotle mayo.', price:480, tags:['bestseller'], img:'https://images.unsplash.com/photo-1539252554453-80ab65ce3586?w=300&q=70' },
    { id:'f4', name:'Pesto Pasta', desc:'Fresh pappardelle, house-made basil pesto, cherry tomatoes and parmesan.', price:440, tags:['veg'], img:'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=300&q=70' },
  ],
  desserts: [
    { id:'d1', name:'Tiramisu', desc:'Mascarpone cream, espresso-soaked ladyfingers, cocoa dust. Classic Italian.', price:340, tags:['veg','bestseller'], img:'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=300&q=70' },
    { id:'d2', name:'Brownie Skillet', desc:'Warm dark chocolate brownie with vanilla bean ice cream, served in cast iron.', price:360, tags:['veg'], img:'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=300&q=70' },
    { id:'d3', name:'Cheesecake Slice', desc:'New York-style baked cheesecake with a graham cracker crust and berry coulis.', price:310, tags:['veg'], img:'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=300&q=70' },
  ]
};

const cart = {};
let orderSeq = 4000;

function renderMenu(){
  Object.entries(MENU).forEach(([cat, items]) => {
    const grid = document.getElementById('grid-'+cat);
    grid.innerHTML = items.map(item => `
      <div class="menu-item" id="mi-${item.id}">
        <div class="item-info">
          <div class="item-name">${item.name}</div>
          <div class="item-desc">${item.desc}</div>
          <div class="item-footer">
            <div class="item-price">₹${item.price}</div>
            <div class="item-tags">${item.tags.map(t=>`<span class="tag ${t}">${t}</span>`).join('')}</div>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:10px;flex-shrink:0;">
          <div class="item-img"><img src="${item.img}" alt="${item.name}" loading="lazy"></div>
          <div class="add-wrap" id="ctrl-${item.id}">
            <button class="add-btn" onclick="addItem('${item.id}')">+</button>
          </div>
        </div>
      </div>
    `).join('');
  });
}

function findItem(id){
  for(const items of Object.values(MENU)) {
    const it = items.find(i=>i.id===id);
    if(it) return it;
  }
}

function addItem(id){
  const item = findItem(id);
  if(!item) return;
  cart[id] = (cart[id]||0)+1;
  updateCtrl(id);
  updateCartCount();
  showToast(item.name+' added');
}

function removeItem(id){
  if(!cart[id]) return;
  cart[id]--;
  if(cart[id]<=0) delete cart[id];
  updateCtrl(id);
  updateCartCount();
  renderCartItems();
}

function updateCtrl(id){
  const wrap = document.getElementById('ctrl-'+id);
  if(!wrap) return;
  const qty = cart[id]||0;
  if(qty===0){
    wrap.innerHTML = `<button class="add-btn" onclick="addItem('${id}')">+</button>`;
  } else {
    wrap.innerHTML = `
      <div class="qty-ctrl">
        <button class="qty-btn" onclick="removeItem('${id}')">−</button>
        <div class="qty-val">${qty}</div>
        <button class="qty-btn" onclick="addItem('${id}')">+</button>
      </div>`;
  }
}

function updateCartCount(){
  const total = Object.values(cart).reduce((a,b)=>a+b,0);
  document.getElementById('cartCount').textContent = total;
}

function cartTotal(){
  return Object.entries(cart).reduce((sum,[id,qty])=>{
    const item = findItem(id);
    return sum + (item ? item.price*qty : 0);
  },0);
}

function renderCartItems(){
  const el = document.getElementById('cartItems');
  const entries = Object.entries(cart).filter(([,q])=>q>0);
  if(entries.length===0){
    el.innerHTML = `<div class="empty-cart"><div class="ico">🛒</div><p>Your cart is empty.<br>Add items from the menu.</p></div>`;
    document.getElementById('placeBtn').disabled = true;
    document.getElementById('cartTotal').textContent = '₹0';
    return;
  }
  document.getElementById('placeBtn').disabled = false;
  el.innerHTML = entries.map(([id,qty])=>{
    const item = findItem(id);
    return `
      <div class="cart-item">
        <div class="ci-info">
          <div class="ci-name">${qty}× ${item.name}</div>
          <div class="ci-price">₹${item.price*qty}</div>
        </div>
        <button class="ci-remove" onclick="removeFromCart('${id}')">✕</button>
      </div>`;
  }).join('');
  document.getElementById('cartTotal').textContent = '₹'+cartTotal();
}

function removeFromCart(id){
  delete cart[id];
  updateCtrl(id);
  updateCartCount();
  renderCartItems();
}

function openCart(){
  renderCartItems();
  document.getElementById('cartOverlay').classList.add('open');
  document.getElementById('cartDrawer').classList.add('open');
}

function closeCart(){
  document.getElementById('cartOverlay').classList.remove('open');
  document.getElementById('cartDrawer').classList.remove('open');
}

function placeOrder(){
  const entries = Object.entries(cart).filter(([,q])=>q>0);
  if(!entries.length) return;
  const orderId = 'ORD-'+String(++orderSeq);
  const notes = document.getElementById('orderNotes').value;
  const items = entries.map(([id,qty])=>{const it=findItem(id);return{name:it.name,qty,price:it.price};});
  const order = {
    id: orderId,
    table: 'Table 7',
    cafe: 'Blue Tokai',
    items,
    total: cartTotal(),
    notes,
    status: 'Pending',
    time: new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})
  };

  // Push to shared admin store
  if(!window.__tableqr_orders) window.__tableqr_orders = [];
  window.__tableqr_orders.unshift(order);
  // Also fire custom event for admin panel on same page
  window.dispatchEvent(new CustomEvent('newOrder', {detail: order}));

  // Save to sessionStorage for admin panel pickup
  try{
    const existing = JSON.parse(sessionStorage.getItem('tqr_orders')||'[]');
    existing.unshift(order);
    sessionStorage.setItem('tqr_orders', JSON.stringify(existing));
  }catch(e){}

  // Clear cart
  Object.keys(cart).forEach(id=>{
    delete cart[id];
    updateCtrl(id);
  });
  updateCartCount();
  closeCart();

  document.getElementById('confirmOrderId').textContent = orderId;
  document.getElementById('confirmPanel').classList.add('show');
}

function dismissConfirm(){
  document.getElementById('confirmPanel').classList.remove('show');
  document.getElementById('orderNotes').value='';
}

function scrollTo(id){
  document.getElementById(id).scrollIntoView({behavior:'smooth',block:'start'});
  document.querySelectorAll('.cat-tab').forEach(t=>t.classList.remove('active'));
  const tabs=['coffee','tea','food','desserts'];
  const idx=tabs.indexOf(id);
  document.querySelectorAll('.cat-tab')[idx].classList.add('active');
}

function showToast(msg){
  const t=document.getElementById('toast');
  t.textContent=msg;t.classList.add('show');
  clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove('show'),2400);
}

// Active tab on scroll
const observer = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      const id=e.target.id;
      const tabs=['coffee','tea','food','desserts'];
      const idx=tabs.indexOf(id);
      if(idx>=0){
        document.querySelectorAll('.cat-tab').forEach(t=>t.classList.remove('active'));
        document.querySelectorAll('.cat-tab')[idx].classList.add('active');
      }
    }
  });
},{threshold:0.3});

renderMenu();
['coffee','tea','food','desserts'].forEach(id=>{
  const el=document.getElementById(id);
  if(el) observer.observe(el);
});