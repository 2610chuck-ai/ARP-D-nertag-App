import { employees, menuItems } from './data.js';
import { config, createOrder, formatDate, formatEuro, getOrderWindow, hasLiveApi } from './shared.js';

const employeeSearch = document.querySelector('#employee-search');
const employeeSelect = document.querySelector('#employee');
const priceInput = document.querySelector('#price');
const notesInput = document.querySelector('#notes');
const amountPaidInput = document.querySelector('#amount-paid');
const targetDateLabel = document.querySelector('#target-date-label');
const deadlineBox = document.querySelector('#deadline-box');
const submitMessage = document.querySelector('#submit-message');
const form = document.querySelector('#order-form');
const modeBadge = document.querySelector('#mode-badge');
const menuSections = document.querySelector('#menu-sections');
const selectedItemCard = document.querySelector('#selected-item-card');
const paymentHint = document.querySelector('#payment-hint');

const windowInfo = getOrderWindow();
let filteredEmployees = [...employees];
let selectedCategory = '';
let selectedItemId = '';

document.title = config.companyName;

function setModeBadge() {
  modeBadge.textContent = hasLiveApi() ? 'Live' : 'Demo';
  modeBadge.classList.toggle('mode-live', hasLiveApi());
  modeBadge.classList.toggle('mode-demo', !hasLiveApi());
}

function getCategoryIcon(categoryName) {
  const mapping = {
    Döner: '🥙',
    Box: '🍟',
    Lahmacun: '🌯',
    Pide: '🫓',
    Seele: '🥖',
    Specials: '🍗',
    Pizzen: '🍕',
    Getränke: '🥤',
    'Warme Getränke': '☕'
  };
  return mapping[categoryName] || '🍽️';
}

function getItemVisual(itemName, categoryName) {
  const name = `${itemName} ${categoryName}`.toLowerCase();
  if (name.includes('pizza')) return '🍕';
  if (name.includes('falafel')) return '🧆';
  if (name.includes('salat')) return '🥗';
  if (name.includes('pommes')) return '🍟';
  if (name.includes('kaffee') || name.includes('espresso') || name.includes('cappuccino') || name.includes('tee')) return '☕';
  if (name.includes('cola') || name.includes('fanta') || name.includes('sprite') || name.includes('ayran') || name.includes('red bull')) return '🥤';
  if (name.includes('pide')) return '🫓';
  if (name.includes('lahmacun') || name.includes('yufka') || name.includes('döner') || name.includes('kebap')) return '🥙';
  if (name.includes('nuggets') || name.includes('schnitzel')) return '🍗';
  return getCategoryIcon(categoryName);
}

function renderDeadlineBox() {
  const label = formatDate(windowInfo.targetThursday);
  const warning = windowInfo.nextWeekWarning
    ? '<div class="warning-badge">Achtung: Bestellung für nächste Woche</div>'
    : '<div class="success-badge">Bestellung gilt noch für diese Woche</div>';

  deadlineBox.innerHTML = `
    ${warning}
    <div class="status-line"><strong>Bestellschluss:</strong> ${windowInfo.cutoffLabel}</div>
    <div class="status-line"><strong>Aktueller Bestelltermin:</strong> ${label}</div>
  `;

  targetDateLabel.value = label;
}

function renderEmployees(list) {
  const previous = employeeSelect.value;
  employeeSelect.innerHTML = '<option value="">Bitte Mitarbeiter wählen</option>';
  list.forEach((employee) => {
    const option = document.createElement('option');
    option.value = employee;
    option.textContent = employee;
    employeeSelect.appendChild(option);
  });
  if (previous && list.includes(previous)) {
    employeeSelect.value = previous;
  }
}

function findSelectedItem() {
  const category = menuItems.find((entry) => entry.category === selectedCategory);
  const item = category?.items?.find((entry) => entry.id === selectedItemId);
  return category && item ? { category, item } : null;
}

function updateSelectedCard() {
  const selected = findSelectedItem();

  if (!selected) {
    selectedItemCard.className = 'selected-order-card empty';
    selectedItemCard.innerHTML = `
      <div class="selected-order-media">🍽️</div>
      <div>
        <strong>Noch nichts ausgewählt</strong>
        <p>Tippe unten ein Gericht an.</p>
      </div>
    `;
    priceInput.value = '';
    paymentHint.textContent = 'Preis erscheint nach Auswahl des Gerichts.';
    return;
  }

  const { category, item } = selected;
  const paid = Number(amountPaidInput.value || 0);
  const difference = Number.isFinite(paid) ? paid - Number(item.price) : 0;

  selectedItemCard.className = 'selected-order-card';
  selectedItemCard.innerHTML = `
    <div class="selected-order-media">${getItemVisual(item.name, category.category)}</div>
    <div>
      <strong>${item.name}</strong>
      <p>${category.category} · ${formatEuro(item.price)}</p>
    </div>
  `;

  priceInput.value = formatEuro(item.price);

  if (!amountPaidInput.value) {
    paymentHint.textContent = 'Jetzt nur noch den bezahlten Betrag eintragen.';
  } else if (difference >= 0) {
    paymentHint.textContent = `Voraussichtliches Rückgeld: ${formatEuro(difference)}`;
  } else {
    paymentHint.textContent = `Es fehlen noch ${formatEuro(Math.abs(difference))}`;
  }
}

function updateSelectionUi() {
  const activeKey = `${selectedCategory}__${selectedItemId}`;
  menuSections.querySelectorAll('.menu-tile').forEach((button) => {
    button.classList.toggle('is-selected', button.dataset.key === activeKey);
  });
}

function chooseItem(categoryName, itemId) {
  selectedCategory = categoryName;
  selectedItemId = itemId;
  updateSelectionUi();
  updateSelectedCard();
}

function renderMenu() {
  menuSections.innerHTML = '';

  menuItems.forEach((category) => {
    const section = document.createElement('section');
    section.className = 'menu-section';

    const cards = category.items
      .map(
        (item) => `
          <button
            class="menu-tile"
            type="button"
            data-key="${category.category}__${item.id}"
            data-category="${category.category}"
            data-item-id="${item.id}"
          >
            <div class="menu-tile-media">${getItemVisual(item.name, category.category)}</div>
            <div class="menu-tile-content">
              <div class="menu-tile-top">
                <span class="menu-tile-code">${item.id}</span>
                <span class="menu-tile-price">${formatEuro(item.price)}</span>
              </div>
              <strong>${item.name}</strong>
              <span class="menu-tile-category">${category.category}</span>
            </div>
          </button>
        `
      )
      .join('');

    section.innerHTML = `
      <div class="menu-section-head">
        <div class="menu-section-icon">${getCategoryIcon(category.category)}</div>
        <div>
          <h3>${category.category}</h3>
          <p>${category.items.length} Gerichte</p>
        </div>
      </div>
      <div class="menu-tiles">${cards}</div>
    `;

    menuSections.appendChild(section);
  });

  menuSections.querySelectorAll('.menu-tile').forEach((button) => {
    button.addEventListener('click', () => {
      chooseItem(button.dataset.category, button.dataset.itemId);
    });
  });
}

employeeSearch.addEventListener('input', () => {
  const term = employeeSearch.value.trim().toLowerCase();
  filteredEmployees = employees.filter((employee) => employee.toLowerCase().includes(term));
  renderEmployees(filteredEmployees);
});

amountPaidInput.addEventListener('input', updateSelectedCard);

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  submitMessage.textContent = 'Speichere Bestellung...';

  const employeeName = employeeSelect.value.trim();
  if (!employeeName) {
    submitMessage.textContent = 'Bitte einen Mitarbeiter auswählen.';
    return;
  }

  const selected = findSelectedItem();
  if (!selected) {
    submitMessage.textContent = 'Bitte ein Gericht auswählen.';
    return;
  }

  const paid = Number(amountPaidInput.value);
  if (Number.isNaN(paid) || paid < 0) {
    submitMessage.textContent = 'Bitte einen gültigen Zahlbetrag eintragen.';
    return;
  }

  const order = {
    employee_name: employeeName,
    category: selected.category.category,
    menu_item_id: selected.item.id,
    menu_item_name: selected.item.name,
    price: Number(selected.item.price),
    notes: notesInput.value.trim(),
    amount_paid: paid,
    target_order_date: windowInfo.targetThursdayDate
  };

  try {
    const result = await createOrder(order);
    submitMessage.textContent =
      result.mode === 'updated'
        ? 'Vorhandene Bestellung wurde aktualisiert.'
        : 'Bestellung gespeichert. Auf der Azubi-Seite ist sie jetzt sichtbar.';

    notesInput.value = '';
    amountPaidInput.value = '';
    selectedCategory = '';
    selectedItemId = '';
    updateSelectionUi();
    updateSelectedCard();
    targetDateLabel.value = formatDate(windowInfo.targetThursday);
  } catch (error) {
    console.error(error);
    submitMessage.textContent = `Fehler beim Speichern: ${error.message}`;
  }
});

setModeBadge();
renderDeadlineBox();
renderEmployees(filteredEmployees);
renderMenu();
updateSelectedCard();
