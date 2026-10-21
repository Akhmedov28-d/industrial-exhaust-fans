// Номер продавца
const SELLER_WHATSAPP_PHONE = "996755707077";

// Пароль для входа владельца
const ADMIN_PASSWORD = "admin123";

// Иконка WhatsApp
const whatsappIconSvg = `
  <svg class="card__whatsapp-icon" viewBox="0 0 24 24">
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.81 13.47 3.81 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.08 7.39C8.92 7.39 8.65 7.45 8.42 7.7C8.19 7.95 7.55 8.55 7.55 9.77C7.55 10.99 8.44 12.16 8.56 12.33C8.68 12.5 10.28 15.09 12.81 16.09C14.91 16.92 15.34 16.76 15.8 16.71C16.26 16.67 17.29 16.1 17.5 15.5C17.71 14.91 17.71 14.4 17.65 14.3C17.59 14.2 17.43 14.13 17.18 14.01C16.94 13.88 15.72 13.29 15.5 13.2C15.27 13.12 15.11 13.08 14.95 13.33C14.78 13.57 14.33 14.1 14.19 14.26C14.05 14.43 13.92 14.45 13.67 14.33C13.43 14.2 12.63 13.94 11.68 13.1C10.94 12.44 10.44 11.62 10.3 11.37C10.16 11.12 10.28 10.99 10.41 10.86C10.52 10.75 10.66 10.57 10.78 10.43C10.9 10.29 10.94 10.18 11.02 10.02C11.1 9.85 11.06 9.71 11 9.59C10.94 9.46 10.47 8.32 10.28 7.84C10.09 7.37 9.89 7.43 9.74 7.42L9.08 7.39Z"/>
  </svg>
`;

// Стартовые данные
const defaultItems = [
  {
    id: 1,
    category: "hoods",
    title: "Вытяжка пристенная ЗВКП-1200",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
    power: "0.75",
    phase: "1 фазная (220В)",
    airflow: "2800",
    price: 24500
  },
  {
    id: 2,
    category: "hoods",
    title: "Вытяжка островная ЗВКО-1600 Усиленная",
    image: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80",
    power: "1.5",
    phase: "3 фазная (380В)",
    airflow: "4500",
    price: 42000
  },
  {
    id: 3,
    category: "parts",
    title: "Радиальный двигатель-улитка ВР-80-75",
    image: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=600&q=80",
    description: "Двигатель 1.1 кВт / 1500 об/мин, улитка правого вращения",
    price: 13500
  },
  {
    id: 4,
    category: "parts",
    title: "Фильтр лабиринтный жироулавливающий 500×500",
    image: "https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=600&q=80",
    description: "Пищевая нержавеющая сталь AISI 430, съемный",
    price: 2200
  }
];

function getStoredItems() {
  const data = localStorage.getItem("prom_vent_items_v2");
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      return defaultItems;
    }
  }
  localStorage.setItem("prom_vent_items_v2", JSON.stringify(defaultItems));
  return defaultItems;
}

function saveStoredItems(items) {
  localStorage.setItem("prom_vent_items_v2", JSON.stringify(items));
}

let itemsList = getStoredItems();
let activeCategory = "hoods";

const catalogGrid = document.getElementById("catalogGrid");
const tabButtons = document.querySelectorAll(".tab-btn");

const adminLoginBtn = document.getElementById("adminLoginBtn");
const adminLogoutBtn = document.getElementById("adminLogoutBtn");
const clientView = document.getElementById("clientView");
const adminPanel = document.getElementById("adminPanel");
const authModal = document.getElementById("authModal");
const authModalClose = document.getElementById("authModalClose");
const authModalOverlay = document.getElementById("authModalOverlay");
const authForm = document.getElementById("authForm");
const adminPasswordInput = document.getElementById("adminPasswordInput");
const authError = document.getElementById("authError");

const addItemForm = document.getElementById("addItemForm");
const itemCategory = document.getElementById("itemCategory");
const hoodSpecsBlock = document.getElementById("hoodSpecsBlock");
const partSpecsBlock = document.getElementById("partSpecsBlock");
const itemImageFile = document.getElementById("itemImageFile");
const imagePreview = document.getElementById("imagePreview");
const adminTableBody = document.getElementById("adminTableBody");
const totalItemsCount = document.getElementById("totalItemsCount");

const qrOpenBtn = document.getElementById("qrOpenBtn");
const qrModal = document.getElementById("qrModal");
const qrModalClose = document.getElementById("qrModalClose");
const qrModalOverlay = document.getElementById("qrModalOverlay");
const qrImage = document.getElementById("qrImage");
const qrSiteUrl = document.getElementById("qrSiteUrl");

/* Отрисовка каталога */
function renderCatalog() {
  catalogGrid.innerHTML = "";

  const filtered = itemsList.filter(item => item.category === activeCategory);

  if (filtered.length === 0) {
    catalogGrid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; color: var(--color-text-muted); padding: 50px 0; font-weight: 600;">
        В этой папке пока нет товаров.
      </div>
    `;
    return;
  }

  filtered.forEach(item => {
    const card = document.createElement("article");
    card.className = "card";

    let specsHtml = "";
    if (item.category === "hoods") {
      specsHtml = `
        <div class="card__specs">
          <div class="card__spec-item">
            <span class="card__spec-name">⚙️ 1) Мощность:</span>
            <span class="card__spec-val">${item.power} кВт</span>
          </div>
          <div class="card__spec-item">
            <span class="card__spec-name">⚡ 2) Тип сети:</span>
            <span class="card__spec-val">${item.phase}</span>
          </div>
          <div class="card__spec-item">
            <span class="card__spec-name">💨 3) Прокачка воздуха:</span>
            <span class="card__spec-val">${item.airflow} м³/ч</span>
          </div>
        </div>
      `;
    } else {
      specsHtml = `
        <div class="card__specs">
          <div class="card__spec-item">
            <span class="card__spec-name">🔧 Описание:</span>
            <span class="card__spec-val">${item.description || "Комплектующие"}</span>
          </div>
        </div>
      `;
    }

    const badgeText = item.category === "hoods" ? "Вытяжка" : "Запчасть";

    card.innerHTML = `
      <div class="card__image-box">
        <span class="card__badge">${badgeText}</span>
        <img src="${item.image}" alt="${item.title}" class="card__img" loading="lazy">
      </div>
      
      <h3 class="card__title">${item.title}</h3>
      ${specsHtml}

      <div class="card__footer">
        <div class="card__price-wrap">
          <span class="card__price-label">Стоимость:</span>
          <div class="card__price-value">
            ${Number(item.price).toLocaleString("ru-RU")} <span class="card__price-currency">сом</span>
          </div>
        </div>
        <button class="card__btn-whatsapp" type="button">
          ${whatsappIconSvg}
          <span>Заказать</span>
        </button>
      </div>
    `;

    const orderBtn = card.querySelector(".card__btn-whatsapp");
    orderBtn.addEventListener("click", () => {
      sendOrderToWhatsApp(item);
    });

    catalogGrid.appendChild(card);
  });
}

function sendOrderToWhatsApp(item) {
  let message = "";

  if (item.category === "hoods") {
    message = 
`Здравствуйте! Меня интересует вытяжка:
• Название: ${item.title}
• Мощность двигателя: ${item.power} кВт
• Тип сети: ${item.phase}
• Объем прокачки воздуха: ${item.airflow} м³/ч
• Цена на сайте: ${Number(item.price).toLocaleString("ru-RU")} сом

Подскажите, пожалуйста, по наличию или срокам изготовления?`;
  } else {
    message = 
`Здравствуйте! Меня интересует запчасть:
• Название: ${item.title}
• Параметры: ${item.description || "По каталогу"}
• Цена на сайте: ${Number(item.price).toLocaleString("ru-RU")} сом

Подскажите по наличию и совместимости?`;
  }

  const encoded = encodeURIComponent(message);
  const waUrl = `https://wa.me/${SELLER_WHATSAPP_PHONE}?text=${encoded}`;
  window.open(waUrl, "_blank");
}

/* Переключение вкладок */
tabButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    tabButtons.forEach(b => b.classList.remove("tab-btn--active"));
    btn.classList.add("tab-btn--active");
    activeCategory = btn.dataset.cat;
    renderCatalog();
  });
});

/* Переключение формы добавления */
itemCategory.addEventListener("change", (e) => {
  if (e.target.value === "hoods") {
    hoodSpecsBlock.classList.remove("admin-form__specs-box--hidden");
    partSpecsBlock.classList.add("admin-form__specs-box--hidden");
    document.getElementById("specPower").required = true;
    document.getElementById("specAirflow").required = true;
  } else {
    hoodSpecsBlock.classList.add("admin-form__specs-box--hidden");
    partSpecsBlock.classList.remove("admin-form__specs-box--hidden");
    document.getElementById("specPower").required = false;
    document.getElementById("specAirflow").required = false;
  }
});

/* Загрузка фото в Base64 */
let currentUploadedImageBase64 = "";

itemImageFile.addEventListener("change", function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      currentUploadedImageBase64 = e.target.result;
      imagePreview.src = currentUploadedImageBase64;
      imagePreview.classList.remove("admin-form__preview--hidden");
    };
    reader.readAsDataURL(file);
  }
});

/* Сохранение нового товара */
addItemForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!currentUploadedImageBase64) {
    alert("Пожалуйста, прикрепите фото товара!");
    return;
  }

  const category = itemCategory.value;
  const title = document.getElementById("itemTitle").value.trim();
  const price = parseFloat(document.getElementById("itemPrice").value);

  const newItem = {
    id: Date.now(),
    category,
    title,
    image: currentUploadedImageBase64,
    price
  };

  if (category === "hoods") {
    newItem.power = document.getElementById("specPower").value.trim();
    newItem.phase = document.getElementById("specPhase").value;
    newItem.airflow = document.getElementById("specAirflow").value.trim();
  } else {
    newItem.description = document.getElementById("partDesc").value.trim() || "Комплектующие";
  }

  itemsList.unshift(newItem);
  saveStoredItems(itemsList);

  addItemForm.reset();
  imagePreview.classList.add("admin-form__preview--hidden");
  currentUploadedImageBase64 = "";

  renderAdminTable();
  alert("Товар успешно добавлен и опубликован!");
});

/* Таблица админки */
function renderAdminTable() {
  totalItemsCount.textContent = itemsList.length;
  adminTableBody.innerHTML = "";

  itemsList.forEach(item => {
    const tr = document.createElement("tr");

    const categoryText = item.category === "hoods" ? "Вытяжка" : "Запчасть";
    const specsText = item.category === "hoods"
      ? `${item.power} кВт | ${item.phase} | ${item.airflow} м³/ч`
      : (item.description || "—");

    tr.innerHTML = `
      <td><img src="${item.image}" class="admin-table__thumb" alt="фото"></td>
      <td><b>${categoryText}</b></td>
      <td><strong>${item.title}</strong></td>
      <td>${specsText}</td>
      <td><b>${Number(item.price).toLocaleString("ru-RU")} сом</b></td>
      <td>
        <button class="admin-table__del-btn" data-id="${item.id}">Удалить</button>
      </td>
    `;

    const delBtn = tr.querySelector(".admin-table__del-btn");
    delBtn.addEventListener("click", () => {
      if (confirm(`Удалить позицию "${item.title}"?`)) {
        itemsList = itemsList.filter(p => p.id !== item.id);
        saveStoredItems(itemsList);
        renderAdminTable();
      }
    });

    adminTableBody.appendChild(tr);
  });
}

/* Авторизация владельца */
adminLoginBtn.addEventListener("click", () => {
  authModal.classList.remove("modal--hidden");
  adminPasswordInput.value = "";
  authError.classList.add("modal__error--hidden");
  adminPasswordInput.focus();
});

authModalClose.addEventListener("click", () => authModal.classList.add("modal--hidden"));
authModalOverlay.addEventListener("click", () => authModal.classList.add("modal--hidden"));

authForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (adminPasswordInput.value === ADMIN_PASSWORD) {
    authModal.classList.add("modal--hidden");
    clientView.style.display = "none";
    adminPanel.classList.remove("admin-panel--hidden");
    renderAdminTable();
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else {
    authError.classList.remove("modal__error--hidden");
  }
});

adminLogoutBtn.addEventListener("click", () => {
  adminPanel.classList.add("admin-panel--hidden");
  clientView.style.display = "block";
  renderCatalog();
});

/* Генератор QR-кода */
qrOpenBtn.addEventListener("click", () => {
  const currentUrl = window.location.href;
  qrSiteUrl.textContent = currentUrl;
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(currentUrl)}`;
  qrImage.src = qrApiUrl;
  qrModal.classList.remove("modal--hidden");
});

qrModalClose.addEventListener("click", () => qrModal.classList.add("modal--hidden"));
qrModalOverlay.addEventListener("click", () => qrModal.classList.add("modal--hidden"));

renderCatalog();