/* Цены: вкладки прайса и форма «Узнать стоимость». Данные — в prices-data.js.
   Подключается до main.js, чтобы новые блоки получили плавное появление */
(() => {
  const GROUPS = window.PRICE_GROUPS;
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const rub = (n) => `от ${n.toLocaleString('ru-RU').replace(/ /g, ' ')} ₽`;

  /* ---------- Прайс по вкладкам ---------- */
  const tabs = document.getElementById('priceTabs');
  const panels = document.getElementById('pricePanels');
  if (tabs && panels) {
    tabs.innerHTML = GROUPS.map((g) =>
      `<button class="p-tab" type="button" role="tab" id="tab-${g.key}" aria-controls="panel-${g.key}" data-tab="${g.key}">${esc(g.tab)}</button>`).join('');
    panels.innerHTML = GROUPS.map((g) => `
      <div class="p-panel" role="tabpanel" id="panel-${g.key}" aria-labelledby="tab-${g.key}">
        <h3 class="p-panel__title">${esc(g.tab)}</h3>
        <ul class="p-list">${g.items.map((it) => `
          <li class="p-row">
            <span class="p-row__name">${esc(it.name)}${it.note ? `<small>${esc(it.note)}</small>` : ''}</span>
            <span class="p-row__price">${rub(it.price)}</span>
          </li>`).join('')}
        </ul>
      </div>`).join('');

    const btns = [...tabs.querySelectorAll('.p-tab')];
    const show = (key, byClick) => {
      const k = GROUPS.some((g) => g.key === key) ? key : GROUPS[0].key;
      btns.forEach((b) => { const on = b.dataset.tab === k; b.setAttribute('aria-selected', String(on)); b.tabIndex = on ? 0 : -1; });
      [...panels.children].forEach((p) => { p.hidden = p.id !== `panel-${k}`; });
      if (byClick) {
        // Адрес меняется без перезагрузки: prices.html?tab=outerwear открывает нужную вкладку
        const url = new URL(location.href);
        if (k === GROUPS[0].key) url.searchParams.delete('tab'); else url.searchParams.set('tab', k);
        history.replaceState(null, '', url);
      }
    };
    btns.forEach((b, i) => {
      b.addEventListener('click', () => show(b.dataset.tab, true));
      b.addEventListener('keydown', (e) => {
        const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!d) return;
        const n = btns[(i + d + btns.length) % btns.length];
        n.focus(); show(n.dataset.tab, true);
      });
    });
    show(new URLSearchParams(location.search).get('tab'), false);
  }

  /* ---------- Форма «Узнать стоимость» ---------- */
  const form = document.getElementById('quoteForm');
  if (form) {
    const select = form.querySelector('select');
    select.insertAdjacentHTML('beforeend', GROUPS.map((g) => `<option>${esc(g.tab)}</option>`).join(''));
    // Заглушка отправки — подключить к CRM/почте на этапе разработки
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      form.innerHTML = '<p class="p-quote__done">Спасибо! Портной перезвонит, уточнит детали и назовёт стоимость.</p>';
    });
  }
})();
