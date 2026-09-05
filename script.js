// ============ AUTH GATE (Sign In / Sign Up) ============
// Без бэкенда: сабмит любой формы просто закрывает окно и показывает сайт.
(function initAuthGate(){
  const gate = document.getElementById("authGate");
  if (!gate) return;

  document.body.style.overflow = "hidden";

  const tabs = gate.querySelectorAll(".authgate__tab");
  const forms = {
    signin: document.getElementById("signinForm"),
    signup: document.getElementById("signupForm"),
  };

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => {
        t.classList.remove("authgate__tab--active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("authgate__tab--active");
      tab.setAttribute("aria-selected", "true");
      const key = tab.dataset.tab;
      Object.entries(forms).forEach(([k, f]) => { f.hidden = k !== key; });
    });
  });

  function enterSite(e){
    e.preventDefault();
    gate.classList.add("authgate--closing");
    document.body.style.overflow = "";
    setTimeout(() => gate.remove(), 400);
  }

  forms.signin.addEventListener("submit", enterSite);
  forms.signup.addEventListener("submit", enterSite);
})();

// ============ КАТАЛОГ (порядок = чёрный → серый → белый) ============
const CATALOG = {
  obsidian: {
    name: "OBSIDIAN",
    line: "ARCTIC 01",
    color: "Чёрный",
    colorHex: "#0a0a0a",
    price: 15990,
    priceLabel: "15 990 ₽",
    desc: "Флагманский силуэт коллекции. Матовый чёрный, 800fp гусиный пух, ветрозащитная мембрана. Скроен для перехода зимнего города в горы без пересадки.",
    photo: "assets/model-obsidian-cutout.png",
  },
  ashfall: {
    name: "ASHFALL",
    line: "ARCTIC 02",
    color: "Серый",
    colorHex: "#6d6d6d",
    price: 15990,
    priceLabel: "15 990 ₽",
    desc: "Пепельно-стальной. Технический софтшелл поверх пуховых блоков. Утилитарный крой с двумя карго-карманами и разгрузочными шнурами.",
    photo: "assets/model-ashfall-cutout.png",
  },
  glacier: {
    name: "GLACIER",
    line: "ARCTIC 03",
    color: "Белый",
    colorHex: "#e8e5df",
    price: 15990,
    priceLabel: "15 990 ₽",
    desc: "Снежный офф-уайт. Плотный рипстоп с грязеотталкивающей пропиткой. Тёплый минимум для тех, кто предпочитает свет — но не жар.",
    photo: "assets/model-glacier-cutout.png",
  },
};

// Supabase — заявки идут в public.khrustiks_orders (проект dark-deed).
// Ключ publishable — только INSERT для anon по RLS, чтение/правка недоступны.
const SUPABASE_URL = "https://nrwxylnanldzvkufxtsw.supabase.co";
const SUPABASE_KEY = "sb_publishable_lCPJHdNB1xs3e0BmWo3HOw_e7swipoK";

// Опциональный дубль в Google Sheets — если задать URL Apps Script,
// заявки полетят параллельно и туда (см. crm/setup.md).
const CRM_ENDPOINT = "";

// ============ STATE ============
const state = {
  product: null,     // ключ CATALOG
  size: null,
  color: null,       // ключ CATALOG (для смены цвета в модалке)
};

// быстрый выбор размера на первом экране; модалка подхватывает его при открытии
let heroQuickSize = "M";
document.querySelectorAll(".hero__sizes .size-chip").forEach(chip => {
  chip.addEventListener("click", () => {
    document.querySelectorAll(".hero__sizes .size-chip").forEach(c => c.classList.remove("size-chip--active"));
    chip.classList.add("size-chip--active");
    heroQuickSize = chip.dataset.size;
  });
});

// ============ HERO: миниатюры ============
document.querySelectorAll(".hero__thumbs .thumb").forEach(btn => {
  btn.addEventListener("click", () => {
    const key = btn.dataset.product;
    document.querySelectorAll(".hero__thumbs .thumb").forEach(b => b.classList.remove("thumb--active"));
    btn.classList.add("thumb--active");
    const p = CATALOG[key];
    document.getElementById("heroPrice").innerHTML = p.priceLabel;
    // подменяем фото героя
    const img = document.getElementById("heroFigureImg");
    img.src = p.heroPhoto || p.photo;
    img.alt = `Модель в куртке ${p.name}`;
    // кнопка «Купить» открывает нужный товар
    document.querySelector(".hero__buy-row .btn--primary").setAttribute("onclick", `openProduct('${key}')`);
  });
});

// ============ МОДАЛКА ТОВАРА ============
const modal = document.getElementById("productModal");
const $ = id => document.getElementById(id);

function openProduct(key){
  const p = CATALOG[key];
  if (!p) return;
  state.product = key;
  state.color = key;
  state.size = null;

  $("modalEye").textContent = p.line;
  $("modalTitle").textContent = p.name;
  $("modalDesc").textContent = p.desc;
  $("modalPrice").innerHTML = p.priceLabel;
  $("modalMedia").innerHTML = `<img src="${p.photo}" alt="Модель в куртке ${p.name}" />`;

  // размеры — сброс, с преднастройкой из чипа на первом экране
  document.querySelectorAll("#sizes button").forEach(b => {
    b.classList.remove("is-selected");
    if (b.dataset.size === heroQuickSize) {
      b.classList.add("is-selected");
      state.size = heroQuickSize;
    }
    b.onclick = () => {
      document.querySelectorAll("#sizes button").forEach(x => x.classList.remove("is-selected"));
      b.classList.add("is-selected");
      state.size = b.dataset.size;
    };
  });

  // цвета
  const colors = $("colors");
  colors.innerHTML = "";
  Object.entries(CATALOG).forEach(([k, prod]) => {
    const b = document.createElement("button");
    b.style.background = prod.colorHex;
    b.title = prod.name;
    b.setAttribute("aria-label", prod.name);
    if (k === key) b.classList.add("is-selected");
    b.onclick = () => openProduct(k);
    colors.appendChild(b);
  });

  // CTA
  $("modalCta").onclick = () => {
    if (!state.size) {
      $("modalCta").animate([{transform:"translateX(-4px)"},{transform:"translateX(4px)"},{transform:"translateX(0)"}], {duration:220});
      $("sizes").animate([{opacity:0.4},{opacity:1}], {duration:300});
      return;
    }
    closeProduct();
    fillOrder();
    document.getElementById("order").scrollIntoView({behavior:"smooth", block:"start"});
  };

  modal.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeProduct(){
  modal.hidden = true;
  document.body.style.overflow = "";
}

document.addEventListener("keydown", e => { if (e.key === "Escape") { closeProduct(); closeProfile(); closeSearch(); } });

// делаем функции доступными глобально (используются в onclick=)
window.openProduct = openProduct;
window.closeProduct = closeProduct;

// ============ ПРОФИЛЬ (адрес доставки + способ оплаты) ============
// Данные хранятся в localStorage браузера.
const PROFILE_KEY = "khrustiks_profile";

function loadProfile(){
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function saveProfileData(data){
  localStorage.setItem(PROFILE_KEY, JSON.stringify(data));
}

function refreshProfileDot(){
  $("profileDot").hidden = !loadProfile();
}

const profileModal = $("profileModal");
const profileForm = $("profileForm");

function openProfile(){
  const saved = loadProfile();
  if (saved) {
    Object.entries(saved).forEach(([key, val]) => {
      const field = profileForm.elements[key];
      if (!field) return;
      if (field instanceof RadioNodeList) {
        [...field].forEach(r => { r.checked = r.value === val; });
      } else {
        field.value = val;
      }
    });
  }
  $("profileStatus").hidden = true;
  profileModal.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeProfile(){
  if (profileModal) profileModal.hidden = true;
  document.body.style.overflow = "";
}
window.openProfile = openProfile;
window.closeProfile = closeProfile;

if (profileForm) {
  profileForm.addEventListener("submit", e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(profileForm).entries());
    saveProfileData(data);
    refreshProfileDot();
    const status = $("profileStatus");
    status.hidden = false;
    status.className = "order__status is-ok";
    status.textContent = "Сохранено — данные подставятся при оформлении заказа.";
  });
}

refreshProfileDot();

// ============ ПОИСК ПО КАТАЛОГУ ============
const searchModal = $("searchModal");
const searchInput = $("searchInput");
const searchResults = $("searchResults");

function openSearch(){
  searchModal.hidden = false;
  document.body.style.overflow = "hidden";
  searchInput.value = "";
  renderSearchResults("");
  setTimeout(() => searchInput.focus(), 50);
}

function closeSearch(){
  searchModal.hidden = true;
  document.body.style.overflow = "";
}
window.openSearch = openSearch;
window.closeSearch = closeSearch;

function renderSearchResults(query){
  const q = query.trim().toLowerCase();

  if (!q) {
    searchResults.innerHTML = `<div class="search__empty">Начните вводить название куртки или цвет.</div>`;
    return;
  }

  const matches = Object.entries(CATALOG).filter(([key, p]) =>
    p.name.toLowerCase().includes(q) ||
    p.color.toLowerCase().includes(q) ||
    p.line.toLowerCase().includes(q) ||
    key.includes(q)
  );

  if (!matches.length) {
    searchResults.innerHTML = `<div class="search__empty">Ничего не нашлось по «${query}».</div>`;
    return;
  }

  searchResults.innerHTML = matches.map(([key, p]) => `
    <button class="search__item" onclick="selectSearchResult('${key}')">
      <span class="search__item-media search__item-media--${key === "glacier" ? "white" : key === "ashfall" ? "grey" : "black"}">
        <img src="${p.photo}" alt="" />
      </span>
      <span class="search__item-body">
        <span class="search__item-name">${p.name}</span>
        <span class="search__item-sub">${p.line} · ${p.color}</span>
      </span>
      <span class="search__item-price">${p.priceLabel}</span>
    </button>
  `).join("");
}

function selectSearchResult(key){
  closeSearch();
  openProduct(key);
}
window.selectSearchResult = selectSearchResult;

if (searchInput) {
  searchInput.addEventListener("input", () => renderSearchResults(searchInput.value));
}

// ============ ЗАПОЛНЕНИЕ ФОРМЫ ============
function fillOrder(){
  const p = CATALOG[state.product];
  if (!p) return;

  $("fProduct").value = p.name;
  $("fColor").value = p.color;
  $("fSize").value = state.size || "";
  $("fPrice").value = p.price;

  $("orderNo").textContent = randomOrderNo();
  $("orderSummary").textContent = `${p.name} · ${p.color} · ${state.size || "—"}`;
  $("totalPrice").innerHTML = p.priceLabel;

  // счётчик в корзине (визуально)
  const cc = $("cartCount");
  cc.textContent = (parseInt(cc.textContent, 10) || 0) + 1;

  // подставляем данные профиля только в пустые поля
  const saved = loadProfile();
  if (saved) {
    const orderForm = $("orderForm");
    ["name", "phone", "email", "city", "zip", "address"].forEach(key => {
      const field = orderForm.elements[key];
      if (field && !field.value && saved[key]) field.value = saved[key];
    });
  }
}

function randomOrderNo(){
  const y = new Date().getFullYear().toString().slice(-2);
  const n = Math.floor(1000 + Math.random() * 9000);
  return `K${y}-${n}`;
}

// ============ ОТПРАВКА ЗАЯВКИ ============
document.getElementById("orderForm").addEventListener("submit", async e => {
  e.preventDefault();
  const form = e.currentTarget;
  const status = $("orderStatus");
  status.hidden = false;
  status.className = "order__status";
  status.textContent = "Отправляем…";

  // валидация выбранного товара
  if (!$("fProduct").value) {
    status.classList.add("is-err");
    status.textContent = "Сначала выберите куртку в разделе «Новая коллекция».";
    return;
  }

  const data = Object.fromEntries(new FormData(form).entries());
  data.orderNo = $("orderNo").textContent;
  data.createdAt = new Date().toISOString();
  data.source = "khrustiks.ru";

  try {
    // основной путь: запись в Supabase (public.khrustiks_orders)
    const dbRes = await fetch(`${SUPABASE_URL}/rest/v1/khrustiks_orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
        "Prefer": "return=minimal",
      },
      body: JSON.stringify({
        order_no: data.orderNo,
        product: data.product,
        color: data.color,
        size: data.size,
        price: Number(data.price) || null,
        name: data.name,
        phone: data.phone,
        email: data.email,
        city: data.city,
        zip: data.zip,
        address: data.address,
        delivery: data.delivery,
        comment: data.comment,
        source: data.source,
      }),
    });
    if (!dbRes.ok) throw new Error("HTTP " + dbRes.status);

    // опционально: дубль в Google Sheets, ошибка тут не роняет успешную заявку
    if (CRM_ENDPOINT) {
      fetch(CRM_ENDPOINT, {
        method: "POST",
        headers: {"Content-Type": "text/plain;charset=utf-8"},
        body: JSON.stringify(data),
      }).catch(err => console.warn("Sheets duplicate failed:", err));
    }

    status.classList.add("is-ok");
    status.innerHTML = `Заявка <b>${data.orderNo}</b> принята. Менеджер свяжется в течение часа.`;
    form.reset();
    document.querySelectorAll("#sizes button").forEach(b => b.classList.remove("is-selected"));
    $("cartCount").textContent = "0";
    $("orderSummary").textContent = "Товар не выбран";
    $("totalPrice").innerHTML = "0&nbsp;₽";
  } catch (err) {
    status.classList.add("is-err");
    status.textContent = "Не удалось отправить: " + err.message + ". Напишите на hello@khrustiks.ru — примем вручную.";
  }
});
