// КР3. Небольшая интерактивность: меню, фильтры, модальное окно и учебные формы.
// Адаптивная раскладка реализована CSS Grid/Flexbox и медиазапросами, без Bootstrap.

const navToggle = document.querySelector('.site-nav-toggle');
const siteNav = document.getElementById('main-navigation');

if (navToggle && siteNav) {
  const closeMenu = () => {
    siteNav.classList.remove('site-nav--open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Открыть меню');
  };

  navToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('site-nav--open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню');
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && siteNav.classList.contains('site-nav--open')) {
      closeMenu();
      navToggle.focus();
    }
  });

  window.matchMedia('(min-width: 1200px)').addEventListener('change', closeMenu);
}

const filterToggle = document.getElementById('catalog-filters-toggle');
const filterForm = document.getElementById('catalog-filters-form');

if (filterToggle && filterForm) {
  filterToggle.addEventListener('click', () => {
    const isOpen = filterForm.classList.toggle('catalog-filters__form--open');
    filterToggle.setAttribute('aria-expanded', String(isOpen));
    filterToggle.innerHTML = isOpen
      ? 'Скрыть фильтры <span aria-hidden="true">▴</span>'
      : 'Показать фильтры <span aria-hidden="true">▾</span>';
  });

  const cards = Array.from(document.querySelectorAll('.catalog-products .product-card'));
  const count = document.getElementById('catalog-results-count');
  const categories = filterForm.querySelectorAll('input[name="category"]');
  const allCheckbox = filterForm.querySelector('input[value="all"]');

  categories.forEach((box) => {
    box.addEventListener('change', () => {
      if (box === allCheckbox && box.checked) {
        categories.forEach((other) => { if (other !== box) other.checked = false; });
      } else if (box !== allCheckbox && box.checked) {
        allCheckbox.checked = false;
      }
    });
  });

  function applyFilters() {
    const selected = Array.from(categories)
      .filter((checkbox) => checkbox.checked && checkbox.value !== 'all')
      .map((checkbox) => checkbox.value);
    const minField = filterForm.querySelector('[name="price-from"]');
    const maxField = filterForm.querySelector('[name="price-to"]');
    const minPrice = minField.value === '' ? 0 : Number(minField.value);
    const maxPrice = maxField.value === '' ? Infinity : Number(maxField.value);
    let visible = 0;

    cards.forEach((card) => {
      const price = Number(card.dataset.price);
      const tags = (card.dataset.category || '').split(' ');
      const categoryMatch = selected.length === 0 || selected.some((s) => tags.includes(s));
      const match = categoryMatch && price >= minPrice && price <= maxPrice;
      card.hidden = !match;
      if (match) visible += 1;
    });
    count.textContent = `Найдено товаров: ${visible}`;
  }

  filterForm.addEventListener('submit', (event) => {
    event.preventDefault();
    applyFilters();
  });
  filterForm.addEventListener('reset', () => {
    // Состояние полей сбрасывается браузером по завершении события reset.
    setTimeout(applyFilters, 0);
  });
}

const orderDialog = document.getElementById('order-dialog');
const orderForm = document.getElementById('order-form');
const selectedProductInput = document.getElementById('selected-product');
const closeDialogButton = document.getElementById('close-order-dialog');
const successMessage = document.getElementById('success-message');

if (orderDialog && orderForm && selectedProductInput) {
  document.querySelectorAll('button.product-card__button[data-product]').forEach((button) => {
    button.addEventListener('click', () => {
      selectedProductInput.value = button.dataset.product;
      successMessage.hidden = true;
      orderDialog.showModal();
    });
  });

  closeDialogButton?.addEventListener('click', () => orderDialog.close());

  orderForm.addEventListener('submit', (event) => {
    event.preventDefault();
    Array.from(orderForm.elements).forEach((element) => {
      if (element.willValidate) {
        element.removeAttribute('aria-invalid');
        if (!element.checkValidity()) element.setAttribute('aria-invalid', 'true');
      }
    });
    if (!orderForm.reportValidity()) return;
    orderDialog.close();
    orderForm.reset();
    successMessage.hidden = false;
    // Реальной отправки заявки нет: backend не подключён.
  });
}

function initDemoForm(formId, feedbackId) {
  const form = document.getElementById(formId);
  const feedback = document.getElementById(feedbackId);
  if (!form || !feedback) return;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    feedback.textContent = 'Поля проверены. Это учебная форма: данные не отправлены на сервер.';
    feedback.hidden = false;
    form.reset();
  });
}
initDemoForm('page-order-form', 'page-order-feedback');
initDemoForm('contact-form', 'contact-feedback');
