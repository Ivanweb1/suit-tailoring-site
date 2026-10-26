/* Наши адреса: вкладки городов, карта, контакты и фото ателье. Данные — в contacts-data.js.
   Подключается до main.js, чтобы кнопки записи и просмотр фото подключились к новым элементам */
(() => {
  const root = document.getElementById('contacts-page');
  if (!root) return;
  const L = window.LOCATIONS;
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const q = encodeURIComponent;
  const tel = (p) => p.replace(/[^+\d]/g, '');

  const tabs = document.getElementById('cityTabs');
  const info = document.getElementById('cityInfo');
  const map = document.getElementById('cityMap');
  const gallery = document.getElementById('cityPhotos');

  tabs.innerHTML = L.map((l) => `<button class="k-tab" type="button" role="tab" data-city="${l.key}">${esc(l.city)}</button>`).join('');
  if (L.length < 2) tabs.hidden = true;

  // Панели и фото всех городов строятся сразу (main.js подключит к ним запись и просмотр фото), видна одна
  info.innerHTML = L.map((l) => `
    <div class="k-city" data-city="${l.key}" hidden>
      <ul class="k-facts">
        <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s7-6.6 7-12a7 7 0 0 0-14 0c0 5.4 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>
          <span>${l.address ? esc(l.address) : '<em class="k-empty">Адрес уточняется</em>'}${l.addressNote ? `<small>${esc(l.addressNote)}</small>` : ''}</span></li>
        <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 3.5l2.6 3.4-1.6 2.2a12 12 0 0 0 7.3 7.3l2.2-1.6 3.4 2.6-1.6 3.1C11.3 20.3 3.7 12.7 3.5 5.1z"/></svg>
          <a href="tel:${tel(l.phone)}">${esc(l.phone)}</a></li>
        <li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v14H4zM4 6l8 7 8-7"/></svg>
          <a href="mailto:${esc(l.email)}">${esc(l.email)}</a></li>
        <li><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3 2"/></svg>
          <span>${esc(l.hours)}</span></li>
      </ul>
      ${l.note ? `<p class="k-note">${esc(l.note)}</p>` : ''}
      <div class="k-actions">
        <button class="btn btn--gold" type="button" data-modal-open data-modal-title="Записаться в ателье">Записаться в ателье</button>
        ${l.address ? `<a class="k-route" href="https://yandex.ru/maps/?rtext=~${q(l.map)}&rtt=auto" target="_blank" rel="noopener">Построить маршрут</a>` : ''}
      </div>
    </div>`).join('');

  gallery.innerHTML = L.map((l) => `
    <ul class="k-photos" data-city="${l.key}" hidden>${l.photos.length
      ? l.photos.map((p) => `<li><button type="button" data-photo="${esc(p.src)}" aria-label="Открыть фото: ${esc(p.alt)}"><img src="${esc(p.src)}" alt="${esc(p.alt)}" loading="lazy"></button></li>`).join('')
      : `<li class="k-photos__empty">Фото ателье в городе ${esc(l.city)} — скоро</li>`}
    </ul>`).join('');

  const show = (key, byClick) => {
    const l = L.find((x) => x.key === key) || L[0];
    tabs.querySelectorAll('.k-tab').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.city === l.key)));
    root.querySelectorAll('[data-city]:not(.k-tab)').forEach((el) => { el.hidden = el.dataset.city !== l.key; });
    // Карта Яндекса: поиск по адресу ставит метку, по городу — показывает город
    const src = `https://yandex.ru/map-widget/v1/?text=${q(l.map)}&z=${l.address ? 16 : 11}`;
    if (map.getAttribute('src') !== src) map.src = src;
    map.title = `Карта: ${l.city}`;
    if (byClick) {
      const url = new URL(location.href);
      if (l === L[0]) url.searchParams.delete('city'); else url.searchParams.set('city', l.key);
      history.replaceState(null, '', url);
    }
  };
  tabs.addEventListener('click', (e) => { const b = e.target.closest('.k-tab'); if (b) show(b.dataset.city, true); });
  show(new URLSearchParams(location.search).get('city'), false);
})();
