/* ============ KONFIGURASI (ubah di sini) ============ */
const CONFIG = {
  whatsapp: "6285155382233",              
  instagram: "https://www.instagram.com/youbake.id?obrf=MWtvNHZ1bm9jbWRqOA==", 
  minBox10x10: 2,                          
  address: "Batu Ceper Jurumudi Benda Tangerang",
  mapsQuery: "Tangerang, Banten",             // ganti dengan alamat/nama tempat untuk Google Maps
  hours: "Setiap hari, 09.00 - 16.00WIB"
};

const SIZES = ["10x10", "20x10", "20x20"];
const PRODUCTS = [
  { id: "mix", name: "Mix Brownies", img: "images/mix.jpg", tag: "Terlengkap",
    desc: "Tiga topping dalam satu loyang: keju, almond, dan Cadbury.", price: [30000, 58000, 105000] },
  { id: "cadbury", name: "Cadbury Brownies", img: "images/cadbury.jpg", tag: "Favorit",
    desc: "Potongan cokelat Cadbury di atas brownies pekat yang lumer.", price: [32000, 62000, 115000] },
  { id: "chocochip", name: "Chocochip Brownies", img: "images/chocochip.jpg", tag: "",
    desc: "Choco chips di seluruh permukaan, manisnya pas.", price: [28500, 55000, 100000] },
  { id: "cheese", name: "Cheese Brownies", img: "images/cheese.jpg", tag: "Gurih-manis",
    desc: "Taburan keju panggang di atas brownies cokelat.", price: [28000, 54000, 98000] },
  { id: "blueberry", name: "Blueberry Cheese", img: "images/blueberry.jpg", tag: "Fruity & creamy",
    desc: "Isian blueberry dan krim keju yang segar di dalam brownies.", price: [29000, 57000, 112000] },
  { id: "almond", name: "Almond Brownies", img: "images/almond.jpg", tag: "Klasik",
    desc: "Almond renyah di atas brownies fudgy. Pilihan yang tidak pernah salah.", price: [29000, 57000, 112000] }
];

const rp = n => "Rp " + n.toLocaleString("id-ID");
const $ = s => document.querySelector(s);
let cart = [];
try { cart = JSON.parse(localStorage.getItem("youbake-cart")) || []; } catch (e) { cart = []; }

/* ============ MENU ============ */
const state = {}; // ukuran terpilih per produk
function renderProducts() {
  $("#productGrid").innerHTML = PRODUCTS.map(p => {
    state[p.id] = 0;
    return `
    <div class="col-sm-6 col-lg-4">
      <article class="p-card" data-id="${p.id}">
        <div class="p-img"><img src="${p.img}" alt="${p.name}" loading="lazy" width="771" height="770"></div>
        <div class="p-body">
          ${p.tag ? `<span class="p-tag">${p.tag}</span>` : ""}
          <h3>${p.name}</h3>
          <p>${p.desc}</p>
          <div class="size-pills" role="group" aria-label="Pilih ukuran">
            ${SIZES.map((s, i) => `<button type="button" data-i="${i}" class="${i === 0 ? "active" : ""}">${s.replace("x", "×")}</button>`).join("")}
          </div>
          <div class="p-foot">
            <span class="p-price">${rp(p.price[0])}</span>
            <button class="btn btn-orange add-btn" type="button"><i class="bi bi-bag-plus me-1"></i>Tambah</button>
          </div>
        </div>
      </article>
    </div>`;
  }).join("");
}

$("#productGrid").addEventListener("click", e => {
  const card = e.target.closest(".p-card"); if (!card) return;
  const p = PRODUCTS.find(x => x.id === card.dataset.id);
  const pill = e.target.closest(".size-pills button");
  if (pill) {
    state[p.id] = +pill.dataset.i;
    card.querySelectorAll(".size-pills button").forEach(b => b.classList.toggle("active", b === pill));
    card.querySelector(".p-price").textContent = rp(p.price[state[p.id]]);
  }
  if (e.target.closest(".add-btn")) {
    addToCart(p, state[p.id]);
  }
});

/* ============ KERANJANG ============ */
function save() { try { localStorage.setItem("youbake-cart", JSON.stringify(cart)); } catch (e) {} }
function toast(msg) {
  $("#toastBody").textContent = msg;
  bootstrap.Toast.getOrCreateInstance($("#toast"), { delay: 1800 }).show();
}
function addToCart(p, si) {
  const key = p.id + "|" + SIZES[si];
  const item = cart.find(i => i.key === key);
  item ? item.qty++ : cart.push({ key, id: p.id, size: SIZES[si], qty: 1 });
  save(); renderCart(); toast(`${p.name} ${SIZES[si].replace("x", "×")} ditambahkan`);
}
function boxes10() { return cart.filter(i => i.size === "10x10").reduce((s, i) => s + i.qty, 0); }

function renderCart() {
  const count = cart.reduce((s, i) => s + i.qty, 0);
  $("#cartCount").textContent = count;
  let total = 0;
  $("#cartItems").innerHTML = cart.length ? cart.map(i => {
    const p = PRODUCTS.find(x => x.id === i.id), price = p.price[SIZES.indexOf(i.size)];
    total += price * i.qty;
    return `<div class="cart-row">
      <img src="${p.img}" alt="">
      <div class="info"><b>${p.name}</b>${i.size.replace("x", "×")} cm · ${rp(price)}</div>
      <div class="qty" data-key="${i.key}">
        <button type="button" data-d="-1" aria-label="Kurangi">−</button><span>${i.qty}</span>
        <button type="button" data-d="1" aria-label="Tambah">+</button>
      </div></div>`;
  }).join("") : `<div class="cart-empty"><i class="bi bi-bag fs-1"></i><p class="mt-2">Keranjang masih kosong. Pilih brownies dari menu.</p></div>`;
  $("#cartTotal").textContent = rp(total);

  const warn = $("#cartWarn"), need = boxes10() > 0 && boxes10() < CONFIG.minBox10x10;
  warn.classList.toggle("d-none", !need);
  if (need) warn.textContent = `Ukuran 10×10 minimal ${CONFIG.minBox10x10} box. Tambah ${CONFIG.minBox10x10 - boxes10()} box lagi.`;
  $("#checkoutBtn").disabled = !cart.length || need;
}
$("#cartItems").addEventListener("click", e => {
  const b = e.target.closest("button[data-d]"); if (!b) return;
  const key = b.parentElement.dataset.key, it = cart.find(i => i.key === key);
  it.qty += +b.dataset.d;
  if (it.qty <= 0) cart = cart.filter(i => i.key !== key);
  save(); renderCart();
});
$("#clearBtn").addEventListener("click", () => { cart = []; save(); renderCart(); });

$("#checkoutBtn").addEventListener("click", () => {
  let total = 0;
  const lines = cart.map(i => {
    const p = PRODUCTS.find(x => x.id === i.id), price = p.price[SIZES.indexOf(i.size)];
    total += price * i.qty;
    return `- ${p.name} ${i.size} x${i.qty} = ${rp(price * i.qty)}`;
  });
  const name = $("#custName").value.trim(), note = $("#custNote").value.trim();
  const msg = `Halo You Bake, saya mau pesan:\n${lines.join("\n")}\n\nTotal: ${rp(total)}` +
    (name ? `\nNama: ${name}` : "") + (note ? `\nCatatan: ${note}` : "");
  window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
});

/* ============ MIX & MATCH ============ */
const picked = new Set();
$("#toppingChips").addEventListener("click", e => {
  const c = e.target.closest(".chip"); if (!c) return;
  const t = c.dataset.t;
  picked.has(t) ? picked.delete(t) : picked.add(t);
  c.classList.toggle("on", picked.has(t)); c.setAttribute("aria-pressed", picked.has(t));
  const cta = $("#mixCta"), ok = picked.size > 0;
  cta.classList.toggle("disabled", !ok); cta.setAttribute("aria-disabled", !ok);
  cta.textContent = ok ? "Tanya harga kombinasi ini" : "Pilih topping dulu";
  cta.href = ok ? `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent("Halo You Bake, saya mau Mix & Match dengan topping: " + [...picked].join(", ") + ". Berapa harganya?")}` : "#";
});
$("#mixCta").addEventListener("click", e => { if (!picked.size) e.preventDefault(); });

/* ============ UMUM ============ */
document.querySelectorAll(".wa-link").forEach(a => {
  a.href = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent("Halo You Bake, saya mau tanya soal brownies.")}`;
  a.target = "_blank"; a.rel = "noopener";
});
document.querySelectorAll(".ig-link").forEach(a => a.href = CONFIG.instagram);
$("#year").textContent = new Date().getFullYear();
const nav = $("#nav"), onScroll = () => nav.classList.toggle("scrolled", scrollY > 40);
addEventListener("scroll", onScroll, { passive: true }); onScroll();
document.querySelectorAll("#menuNav a").forEach(a => a.addEventListener("click", () => {
  const m = bootstrap.Collapse.getInstance($("#menuNav")); if (m) m.hide();
}));

renderProducts(); renderCart();

/* ============ KONTAK + MAPS ============ */
$("#addrText").textContent = CONFIG.address;
$("#hoursText").textContent = CONFIG.hours;
$("#waText").textContent = "+" + CONFIG.whatsapp;
$("#igText").textContent = CONFIG.instagram.replace(/^https?:\/\/(www\.)?/, "");
$("#mapFrame").src = `https://maps.google.com/maps?q=${encodeURIComponent(CONFIG.mapsQuery)}&output=embed`;
$("#mapsLink").href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONFIG.mapsQuery)}`;

/* ============ GALERI + LIGHTBOX ============ */
const GALLERY = [...PRODUCTS.map(p => [p.img, p.name]), ["images/mixmatch.jpg", "Mix & Match"], ["images/size-10x10.jpg", "Ukuran 10x10 cm"]];
$("#galleryGrid").innerHTML = GALLERY.map(([src, cap], i) => `
  <div class="col-6 col-md-3 reveal"><button type="button" class="g-item" data-i="${i}" aria-label="Perbesar foto ${cap}"><img src="${src}" alt="${cap}" loading="lazy"></button></div>`).join("");
$("#galleryGrid").addEventListener("click", e => {
  const b = e.target.closest(".g-item"); if (!b) return;
  const [src, cap] = GALLERY[+b.dataset.i];
  $("#lightboxImg").src = src; $("#lightboxImg").alt = cap; $("#lightboxCap").textContent = cap;
  bootstrap.Modal.getOrCreateInstance($("#lightbox")).show();
});

/* ============ LIGHTBOX TESTIMONI ============ */
document.addEventListener("click", e => {
  const b = e.target.closest("[data-lightbox]"); if (!b) return;
  $("#lightboxImg").src = b.dataset.lightbox; $("#lightboxImg").alt = b.dataset.cap;
  $("#lightboxCap").textContent = "";
  bootstrap.Modal.getOrCreateInstance($("#lightbox")).show();
});

/* ============ ANIMASI SCROLL ============ */
document.querySelectorAll(".p-card").forEach(c => c.parentElement.classList.add("reveal"));
if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  document.documentElement.classList.add("js");
  const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }), { threshold: .12 });
  document.querySelectorAll(".reveal").forEach(el => io.observe(el));
}
