"use strict";

// ===== Константы =====
// Ключи localStorage содержат номер команды для изоляции от других команд.
const CART_KEY = "team07:cart:v1";
const FAVORITES_KEY = "team07:favorites:v1";
const PROMO_CODE = "LAPTOP10"; // скидка 10%
const PROMO_DISCOUNT = 0.1;

// ===== Данные каталога (этап 0) =====
// specs: массив пар [название характеристики, значение] для popup с подробностями.
const products = [
  { id: "macbook-pro",         name: "Apple MacBook Pro 14\" (M1 Pro, Space Grey)", price: 189990, category: "Премиум",      description: "Чип Apple M1 Pro, дисплей Retina, 512 ГБ SSD — мощный ноутбук для профессиональных задач", image: "./assets/macbook-pro.webp", specs: [["Процессор", "Apple M1 Pro"], ["Оперативная память", "16 ГБ"], ["Экран", "14\" Liquid Retina XDR, 3024×1964"], ["Накопитель", "SSD 512 ГБ"], ["Операционная система", "macOS"]] },
  { id: "zenbook-pro-duo",     name: "ASUS ZenBook Pro Duo",                        price: 159990, category: "Игровые",      description: "Два экрана: основной 4K UHD и дополнительный ScreenPad Plus — для творчества и игр", image: "./assets/zenbook-pro-duo.webp", specs: [["Процессор", "Intel Core i9"], ["Оперативная память", "16 ГБ"], ["Экран", "15.6\" 4K UHD OLED + ScreenPad Plus 14\""], ["Видеокарта", "NVIDIA GeForce RTX 2060"], ["Накопитель", "SSD 1 ТБ"]] },
  { id: "xps-13",              name: "Dell XPS 13 9300",                            price: 129990, category: "Офисные",      description: "Компактный ультрабук с дисплеем InfinityEdge почти без рамок", image: "./assets/xps-13.webp", specs: [["Процессор", "Intel Core i7-1065G7"], ["Оперативная память", "16 ГБ"], ["Экран", "13.4\" InfinityEdge, 1920×1200"], ["Накопитель", "SSD 512 ГБ"], ["Операционная система", "Windows 10"]] },
  { id: "matebook-x-pro",      name: "Huawei MateBook X Pro",                       price: 119990, category: "Для учёбы",    description: "Тонкий корпус, сенсорный дисплей высокого разрешения — удобно брать с собой на пары", image: "./assets/matebook-x-pro.webp", specs: [["Процессор", "Intel Core i7-8550U"], ["Оперативная память", "16 ГБ"], ["Экран", "13.9\" 3K LTPS, сенсорный"], ["Накопитель", "SSD 512 ГБ"], ["Операционная система", "Windows 10"]] },
  { id: "yoga-920",            name: "Lenovo Yoga 920",                             price: 99990,  category: "Трансформеры", description: "Ноутбук-трансформер 2-в-1 с гибким шарниром: работает как ноутбук и как планшет", image: "./assets/yoga-920.webp", specs: [["Процессор", "Intel Core i7-8550U"], ["Оперативная память", "16 ГБ"], ["Экран", "13.9\" 4K, сенсорный"], ["Накопитель", "SSD 512 ГБ"], ["Режимы", "Ноутбук, планшет, палатка"]] },
  { id: "macbook-pro-15",      name: "Apple MacBook Pro 15\" (2015)",               price: 119990, category: "Премиум",      description: "Классический MacBook Pro с Retina-дисплеем и фирменной клавиатурой", image: "./assets/macbook-pro-15.jpg", specs: [["Процессор", "Intel Core i7"], ["Оперативная память", "16 ГБ"], ["Экран", "15.4\" Retina, 2880×1800"], ["Накопитель", "SSD 256 ГБ"], ["Год выпуска", "2015"]] },
  { id: "macbook-air",         name: "Apple MacBook Air",                           price: 89990,  category: "Для учёбы",    description: "Лёгкий и тонкий ноутбук для учёбы, поездок и повседневных задач", image: "./assets/macbook-air.jpg", specs: [["Процессор", "Intel Core i5"], ["Оперативная память", "8 ГБ"], ["Экран", "13.3\", 1440×900"], ["Накопитель", "SSD 128 ГБ"], ["Вес", "1,35 кг"]] },
  { id: "powerbook-g4",        name: "Apple PowerBook G4 12\"",                     price: 34990,  category: "Ретро",        description: "Легендарный ноутбук 2003 года в алюминиевом корпусе — для коллекционеров", image: "./assets/powerbook-g4.jpg", specs: [["Процессор", "PowerPC G4, 1 ГГц"], ["Оперативная память", "512 МБ"], ["Экран", "12\", 1024×768"], ["Накопитель", "HDD 40 ГБ"], ["Год выпуска", "2003"]] },
  { id: "thinkpad-r51",        name: "IBM ThinkPad R51",                            price: 29990,  category: "Ретро",        description: "Классический бизнес-ноутбук IBM с знаменитым красным трекпоинтом", image: "./assets/thinkpad-r51.jpg", specs: [["Процессор", "Intel Pentium M"], ["Оперативная память", "512 МБ"], ["Экран", "14.1\", 1024×768"], ["Накопитель", "HDD 40 ГБ"], ["Особенность", "Трекпоинт TrackPoint"]] },
  { id: "vivobook-x556uq",     name: "ASUS VivoBook X556UQ",                        price: 54990,  category: "Офисные",      description: "15-дюймовый ноутбук с дискретной графикой GeForce 940MX для офиса и мультимедиа", image: "./assets/vivobook-x556uq.jpg", specs: [["Процессор", "Intel Core i5-6200U"], ["Оперативная память", "8 ГБ"], ["Экран", "15.6\", 1920×1080"], ["Видеокарта", "NVIDIA GeForce 940MX"], ["Накопитель", "HDD 1 ТБ"]] },
  { id: "vivobook-flip-tp2015",name: "ASUS VivoBook Flip TP2015",                   price: 59990,  category: "Трансформеры", description: "Компактный трансформер: экран поворачивается на 360°, сенсорное управление", image: "./assets/vivobook-flip-tp2015.png", specs: [["Процессор", "Intel Pentium N3710"], ["Оперативная память", "4 ГБ"], ["Экран", "11.6\" HD, сенсорный"], ["Накопитель", "eMMC 64 ГБ"], ["Режимы", "Ноутбук, планшет"]] },
  { id: "aspire-one",          name: "Acer Aspire One",                             price: 24990,  category: "Для учёбы",    description: "Компактный нетбук — недорогое решение для конспектов и интернета", image: "./assets/aspire-one.jpg", specs: [["Процессор", "Intel Atom N270"], ["Оперативная память", "1 ГБ"], ["Экран", "10.1\", 1024×600"], ["Накопитель", "SSD 16 ГБ"], ["Год выпуска", "2008"]] },
  { id: "pavilion-dv2000",     name: "HP Pavilion dv2000",                          price: 34990,  category: "Офисные",      description: "Популярный мультимедийный ноутбук HP с 14-дюймовым экраном", image: "./assets/pavilion-dv2000.jpg", specs: [["Процессор", "Intel Core 2 Duo"], ["Оперативная память", "2 ГБ"], ["Экран", "14.1\", 1280×800"], ["Накопитель", "HDD 160 ГБ"], ["Год выпуска", "2007"]] },
  { id: "ideapad-320",         name: "Lenovo IdeaPad 320",                          price: 44990,  category: "Для учёбы",    description: "Надёжный ноутбук для учёбы и дома с полноразмерной клавиатурой", image: "./assets/ideapad-320.jpg", specs: [["Процессор", "Intel Core i5-7200U"], ["Оперативная память", "8 ГБ"], ["Экран", "15.6\", 1920×1080"], ["Накопитель", "HDD 1 ТБ"], ["Операционная система", "Windows 10"]] },
  { id: "ideapad-g500s",       name: "Lenovo IdeaPad G500s",                        price: 39990,  category: "Офисные",      description: "Практичный 15-дюймовый ноутбук для повседневных офисных задач", image: "./assets/ideapad-g500s.jpg", specs: [["Процессор", "Intel Core i3-3110M"], ["Оперативная память", "4 ГБ"], ["Экран", "15.6\", 1366×768"], ["Накопитель", "HDD 500 ГБ"], ["Операционная система", "Windows 8"]] },
];

// ===== Состояние =====
let cart = [];        // [{ id, qty }]
let favorites = [];   // [id]
let promo = null;     // PROMO_CODE или null
let view = "catalog"; // "catalog" | "favorites"
let search = "";
let category = "all";
let sort = "none";

// ===== Утилиты =====
function formatPrice(value) {
  return value.toLocaleString("ru-RU") + " ₽";
}

function findProduct(id) {
  return products.find((product) => product.id === id);
}

// ===== Сохранение корзины (этап 3: localStorage, ключ team07:cart:v1) =====
function saveState() {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify({ cart, promo }));
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error("Не удалось сохранить состояние:", error);
  }
}

function loadState() {
  try {
    const rawCart = localStorage.getItem(CART_KEY);
    if (rawCart) {
      const data = JSON.parse(rawCart);
      if (Array.isArray(data.cart)) cart = data.cart.filter((item) => findProduct(item.id));
      promo = data.promo === PROMO_CODE ? PROMO_CODE : null;
    }
    const rawFavorites = localStorage.getItem(FAVORITES_KEY);
    if (rawFavorites) {
      const parsed = JSON.parse(rawFavorites);
      if (Array.isArray(parsed)) favorites = parsed.filter((id) => findProduct(id));
    }
  } catch (error) {
    console.error("Не удалось прочитать сохранённое состояние:", error);
  }
}

// ===== Корзина (этапы 2 и 4) =====
// Повторное добавление того же товара увеличивает количество (позиция с qty).
function addToCart(id) {
  const item = cart.find((entry) => entry.id === id);
  if (item) {
    item.qty += 1;
  } else {
    cart.push({ id, qty: 1 });
  }
  saveState();
  renderCatalog();
  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter((entry) => entry.id !== id);
  saveState();
  renderCatalog();
  renderCart();
}

function changeQty(id, delta) {
  const item = cart.find((entry) => entry.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter((entry) => entry.id !== id);
  }
  saveState();
  renderCatalog();
  renderCart();
}

function computeBaseTotal() {
  return cart.reduce((sum, item) => {
    const product = findProduct(item.id);
    return product ? sum + product.price * item.qty : sum;
  }, 0);
}

// ===== Промокод (этап 8) =====
// Повторное применение того же кода не накапливает скидку: сумма всегда = база × 0.9.
function applyPromo() {
  const input = document.querySelector("#promo-input");
  const status = document.querySelector("#promo-status");
  const value = input.value.trim().toUpperCase();
  if (value !== PROMO_CODE) {
    status.textContent = "Неверный промокод";
    return;
  }
  if (promo === PROMO_CODE) {
    status.textContent = "Промокод уже применён";
    return;
  }
  promo = PROMO_CODE;
  status.textContent = "Промокод применён: скидка 10%";
  saveState();
  renderCart();
}

function cancelPromo() {
  promo = null;
  document.querySelector("#promo-status").textContent = "Промокод отменён";
  saveState();
  renderCart();
}

// ===== Избранное (этап 9) =====
function toggleFavorite(id) {
  const index = favorites.indexOf(id);
  if (index >= 0) {
    favorites.splice(index, 1);
  } else {
    favorites.push(id);
  }
  saveState();
  renderCatalog();
}

function setView(nextView) {
  view = nextView;
  document.querySelector("#tab-catalog").classList.toggle("active", view === "catalog");
  document.querySelector("#tab-catalog").setAttribute("aria-pressed", String(view === "catalog"));
  document.querySelector("#tab-favorites").classList.toggle("active", view === "favorites");
  document.querySelector("#tab-favorites").setAttribute("aria-pressed", String(view === "favorites"));
  renderCatalog();
}

// ===== Рендер каталога (этапы 1, 5–7, 9) =====
function visibleProducts() {
  let list = products.slice();

  if (view === "favorites") {
    list = list.filter((product) => favorites.includes(product.id));
  }
  if (search.trim() !== "") {
    const query = search.trim().toLowerCase();
    list = list.filter((product) => product.name.toLowerCase().includes(query));
  }
  if (category !== "all") {
    list = list.filter((product) => product.category === category);
  }
  if (sort === "asc") {
    list.sort((a, b) => a.price - b.price);
  } else if (sort === "desc") {
    list.sort((a, b) => b.price - a.price);
  }
  return list;
}

function buildPlaceholder() {
  const fallback = document.createElement("div");
  fallback.className = "img-fallback";
  const icon = document.createElement("span");
  icon.textContent = "🖼";
  const text = document.createElement("span");
  text.textContent = "Изображение недоступно";
  fallback.append(icon, text);
  return fallback;
}

// ===== Popup с характеристиками товара =====
function buildSpecsTable(product) {
  const table = document.createElement("table");
  table.className = "specs-table";
  for (const [label, value] of product.specs) {
    const row = document.createElement("tr");
    const th = document.createElement("th");
    th.scope = "row";
    th.textContent = label;
    const td = document.createElement("td");
    td.textContent = value;
    row.append(th, td);
    table.append(row);
  }
  return table;
}

function openProductDialog(product) {
  const dialog = document.querySelector("#product-dialog");
  const content = document.querySelector("#dialog-content");
  content.textContent = "";

  const image = document.createElement("img");
  image.src = product.image;
  image.alt = product.name;
  image.addEventListener("error", () => image.replaceWith(buildPlaceholder()));

  const title = document.createElement("h3");
  title.id = "dialog-title";
  title.textContent = product.name;

  const categoryLine = document.createElement("p");
  categoryLine.className = "product-category";
  categoryLine.textContent = product.category;

  const description = document.createElement("p");
  description.className = "product-description";
  description.textContent = product.description;

  const price = document.createElement("p");
  price.className = "product-price";
  price.textContent = formatPrice(product.price);

  const specsTable = buildSpecsTable(product);

  const actions = document.createElement("div");
  actions.className = "dialog-actions";

  const addButton = document.createElement("button");
  addButton.type = "button";
  addButton.textContent = "Добавить в корзину";
  addButton.addEventListener("click", () => {
    addToCart(product.id);
    dialog.close();
  });

  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.textContent = "Закрыть";
  closeButton.addEventListener("click", () => dialog.close());

  actions.append(addButton, closeButton);
  content.append(image, title, categoryLine, description, price, specsTable, actions);
  dialog.showModal();
}

function buildProductCard(product) {
  const card = document.createElement("article");
  card.className = "product-card";

  const image = document.createElement("img");
  image.src = product.image;
  image.alt = product.name;
  image.loading = "lazy";
  // Этап 5 (F1): заглушка, если картинка не загрузилась.
  image.addEventListener("error", () => image.replaceWith(buildPlaceholder()));

  // Клик по картинке открывает popup с характеристиками.
  const imageButton = document.createElement("button");
  imageButton.type = "button";
  imageButton.className = "product-image-button";
  imageButton.setAttribute("aria-label", "Подробнее о " + product.name);
  imageButton.append(image);
  imageButton.addEventListener("click", () => openProductDialog(product));

  const title = document.createElement("h3");
  title.className = "product-title";
  const titleButton = document.createElement("button");
  titleButton.type = "button";
  titleButton.className = "product-link";
  titleButton.textContent = product.name;
  titleButton.setAttribute("aria-label", "Подробнее о " + product.name);
  titleButton.addEventListener("click", () => openProductDialog(product));
  title.append(titleButton);

  const categoryLine = document.createElement("p");
  categoryLine.className = "product-category";
  categoryLine.textContent = product.category;

  const description = document.createElement("p");
  description.className = "product-description";
  description.textContent = product.description;

  const price = document.createElement("p");
  price.className = "product-price";
  price.textContent = formatPrice(product.price);

  const actions = document.createElement("div");
  actions.className = "product-actions";

  // Кнопка «Добавить», когда товара нет в корзине, заменяется выбором
  // количества после добавления и возвращается при количестве 0.
  const cartItem = cart.find((entry) => entry.id === product.id);
  const qtyInCart = cartItem ? cartItem.qty : 0;

  if (qtyInCart === 0) {
    const addButton = document.createElement("button");
    addButton.type = "button";
    addButton.className = "add-button";
    addButton.textContent = "Добавить";
    addButton.setAttribute("aria-label", "Добавить " + product.name + " в корзину");
    addButton.addEventListener("click", () => addToCart(product.id));
    actions.append(addButton);
  } else {
    const qtySelector = document.createElement("div");
    qtySelector.className = "qty-selector";

    const minusButton = document.createElement("button");
    minusButton.type = "button";
    minusButton.textContent = "−";
    minusButton.setAttribute("aria-label", "Убрать один " + product.name);
    minusButton.addEventListener("click", () => changeQty(product.id, -1));

    const qtyLabel = document.createElement("span");
    qtyLabel.textContent = qtyInCart + " шт.";
    qtyLabel.setAttribute("aria-label", "В корзине " + qtyInCart + " шт.");

    const plusButton = document.createElement("button");
    plusButton.type = "button";
    plusButton.textContent = "+";
    plusButton.setAttribute("aria-label", "Добавить ещё один " + product.name);
    plusButton.addEventListener("click", () => changeQty(product.id, 1));

    qtySelector.append(minusButton, qtyLabel, plusButton);
    actions.append(qtySelector);
  }

  const favoriteButton = document.createElement("button");
  favoriteButton.type = "button";
  const isFavorite = favorites.includes(product.id);
  favoriteButton.textContent = isFavorite ? "♥" : "♡";
  favoriteButton.className = "favorite-button" + (isFavorite ? " active" : "");
  favoriteButton.setAttribute("aria-pressed", String(isFavorite));
  favoriteButton.setAttribute("aria-label", isFavorite ? "Убрать " + product.name + " из избранного" : "Добавить " + product.name + " в избранное");
  favoriteButton.addEventListener("click", () => toggleFavorite(product.id));

  actions.append(favoriteButton);
  card.append(imageButton, title, categoryLine, description, price, actions);
  return card;
}

function renderCatalog() {
  const grid = document.querySelector("#product-grid");
  const emptyMessage = document.querySelector("#catalog-empty");
  grid.textContent = "";

  const list = visibleProducts();
  if (list.length === 0) {
    emptyMessage.hidden = false;
    if (view === "favorites") emptyMessage.textContent = "В избранном пока пусто";
    else emptyMessage.textContent = "Ничего не найдено";
    return;
  }
  emptyMessage.hidden = true;
  for (const product of list) {
    grid.append(buildProductCard(product));
  }
}

// ===== Рендер корзины (этапы 2 и 4) =====
function buildCartItem(item) {
  const product = findProduct(item.id);
  const row = document.createElement("li");
  row.className = "cart-item";

  const name = document.createElement("span");
  name.className = "cart-item-name";
  name.textContent = product.name;

  const price = document.createElement("span");
  price.className = "cart-item-price";
  price.textContent = formatPrice(product.price);

  const qtyControls = document.createElement("span");
  qtyControls.className = "cart-item-qty";

  const minusButton = document.createElement("button");
  minusButton.type = "button";
  minusButton.textContent = "−";
  minusButton.setAttribute("aria-label", "Уменьшить количество " + product.name);
  minusButton.addEventListener("click", () => changeQty(item.id, -1));

  const qtyValue = document.createElement("span");
  qtyValue.textContent = item.qty + " шт.";

  const plusButton = document.createElement("button");
  plusButton.type = "button";
  plusButton.textContent = "+";
  plusButton.setAttribute("aria-label", "Увеличить количество " + product.name);
  plusButton.addEventListener("click", () => changeQty(item.id, 1));

  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.textContent = "Удалить";
  removeButton.setAttribute("aria-label", "Удалить " + product.name + " из корзины");
  removeButton.addEventListener("click", () => removeFromCart(item.id));

  qtyControls.append(minusButton, qtyValue, plusButton);
  row.append(name, price, qtyControls, removeButton);
  return row;
}

function renderCart() {
  const list = document.querySelector("#cart-list");
  const emptyMessage = document.querySelector("#cart-empty");
  const totalLine = document.querySelector("#cart-total");
  const promoCancelButton = document.querySelector("#promo-cancel");
  const bar = document.querySelector("#cart-bar");
  const barSummary = document.querySelector("#cart-bar-summary");

  list.textContent = "";
  for (const item of cart) {
    const product = findProduct(item.id);
    if (!product) continue;
    list.append(buildCartItem(item));
  }

  const hasItems = cart.length > 0;
  emptyMessage.hidden = hasItems;
  promoCancelButton.hidden = promo === null;

  const baseTotal = computeBaseTotal();
  const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);

  // Итог с учётом скидки для popup корзины.
  let displayTotal = baseTotal;
  if (promo === PROMO_CODE && hasItems) {
    displayTotal = Math.round(baseTotal * (1 - PROMO_DISCOUNT));
    totalLine.textContent =
      "Итого: " + formatPrice(displayTotal) + " (скидка 10%, без скидки — " + formatPrice(baseTotal) + ")";
  } else {
    totalLine.textContent = "Итого: " + formatPrice(baseTotal);
  }

  // Краткая сводка на нижней плашке: плашка плавно выдвигается при появлении
  // товаров и так же плавно уезжает вниз, когда корзина снова пуста.
  if (hasItems) {
    barSummary.textContent =
      "В корзине: " + itemCount + " шт. на " + formatPrice(displayTotal);
    if (bar.hidden) {
      bar.hidden = false;
      // Двойной requestAnimationFrame: даём браузеру применить скрытое
      // состояние, чтобы переход transform/opacity сработал.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => bar.classList.add("visible"));
      });
    } else {
      bar.classList.add("visible");
    }
  } else if (!bar.hidden) {
    bar.classList.remove("visible");
    setTimeout(() => {
      if (cart.length === 0) bar.hidden = true;
    }, 320);
  }
}

// ===== Инициализация =====
function init() {
  loadState();

  // Категории из данных товаров (этап 7).
  const categorySelect = document.querySelector("#category-select");
  const categories = [...new Set(products.map((product) => product.category))];
  for (const name of categories) {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    categorySelect.append(option);
  }
  if (category !== "all") categorySelect.value = category;

  // Поиск (этап 6).
  document.querySelector("#search-input").addEventListener("input", (event) => {
    search = event.target.value;
    renderCatalog();
  });

  // Фильтр по категории и сортировка (этап 7).
  categorySelect.addEventListener("change", (event) => {
    category = event.target.value;
    renderCatalog();
  });
  document.querySelector("#sort-select").addEventListener("change", (event) => {
    sort = event.target.value;
    renderCatalog();
  });
  document.querySelector("#reset-filters").addEventListener("click", () => {
    search = "";
    category = "all";
    sort = "none";
    document.querySelector("#search-input").value = "";
    categorySelect.value = "all";
    document.querySelector("#sort-select").value = "none";
    renderCatalog();
  });

  // Вкладки «Каталог / Избранное» (этап 9).
  document.querySelector("#tab-catalog").addEventListener("click", () => setView("catalog"));
  document.querySelector("#tab-favorites").addEventListener("click", () => setView("favorites"));

  // Popup с характеристиками.
  document.querySelector("#dialog-close").addEventListener("click", () => {
    document.querySelector("#product-dialog").close();
  });

  // Промокод (этап 8).
  // Popup корзины и нижняя плашка.
  document.querySelector("#open-cart").addEventListener("click", () => {
    document.querySelector("#cart-dialog").showModal();
  });
  document.querySelector("#cart-dialog-close").addEventListener("click", () => {
    document.querySelector("#cart-dialog").close();
  });
  document.querySelector("#cart-clear").addEventListener("click", () => {
    cart = [];
    promo = null;
    saveState();
    document.querySelector("#promo-status").textContent = "";
    document.querySelector("#promo-input").value = "";
    renderCatalog();
    renderCart();
  });

  document.querySelector("#promo-apply").addEventListener("click", applyPromo);
  document.querySelector("#promo-cancel").addEventListener("click", cancelPromo);

  renderCatalog();
  renderCart();
}

document.addEventListener("DOMContentLoaded", init);
