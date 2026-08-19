// ============ AUTH GATE (Sign In / Sign Up) ============
// Пока без бэкенда: сабмит любой формы просто закрывает окно и
// открывает сайт. Валидация полей — только браузерная (required).
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

// ============ CRM ENDPOINT ============
// Вставь сюда URL веб-приложения из Google Apps Script (см. crm/setup.md).
// Пока пусто — форма сохранит заявку локально и покажет её JSON.
const CRM_ENDPOINT = ""; // "https://script.google.com/macros/s/AKfycb.../exec"

// ============ STATE ============
const state = {
  product: null,     // ключ CATALOG
  size: null,
  color: null,       // ключ CATALOG (для смены цвета в модалке)
};

// быстрый выбор размера прямо на первом экране (как в референсе) —
// подхватывается модалкой при открытии, чтобы не выбирать размер дважды
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

document.addEventListener("keydown", e => { if (e.key === "Escape") { closeProduct(); closeProfile(); } });

// делаем функции доступными глобально (используются в onclick=)
window.openProduct = openProduct;
window.closeProduct = closeProduct;

// ============ ПРОФИЛЬ (адрес доставки + способ оплаты) ============
// Бэкенда пока нет — данные хранятся в localStorage браузера.
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

  // подставляем сохранённые в профиле контакты/адрес — только в пустые поля,
  // чтобы не затирать то, что покупатель уже успел напечатать
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
    if (CRM_ENDPOINT) {
      // Google Apps Script принимает POST как text/plain, чтобы не срабатывал CORS-preflight
      const res = await fetch(CRM_ENDPOINT, {
        method: "POST",
        headers: {"Content-Type": "text/plain;charset=utf-8"},
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const json = await res.json().catch(() => ({ok:true}));
      if (json.ok === false) throw new Error(json.error || "CRM error");
    } else {
      // dev-режим: просто эмулируем задержку
      await new Promise(r => setTimeout(r, 600));
      console.log("[KHRUSTIKS · CRM_ENDPOINT не задан] Заявка:", data);
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
