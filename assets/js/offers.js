/* Специальные предложения: карточки, фильтр «Все · Действующие · Завершённые» и окно «Участвовать».
   Данные — в offers-data.js. Подключается до main.js, чтобы новые блоки получили плавное появление */
(() => {
  const list = document.getElementById('offersList');
  if (!list) return;
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const MONTHS = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const parse = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
  const human = (d) => `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;

  const offers = window.OFFERS.map((o) => {
    const end = o.until ? parse(o.until) : null;
    return { ...o, end, ended: !!end && end < today };
  });
  // Действующие — сначала, завершённые — в конце (свежие завершённые выше)
  offers.sort((a, b) => (a.ended - b.ended) || (a.ended ? b.end - a.end : 0));

  const status = (o) => {
    if (o.ended) return `Акция завершена ${human(o.end)}`;
    if (o.end) return `Действует до ${human(o.end)}`;
    return 'Действует сейчас';
  };

  list.innerHTML = offers.map((o, i) => `
    <li class="o-offer${o.ended ? ' is-ended' : ''}${i % 2 ? ' o-offer--flip' : ''} reveal" id="${esc(o.slug)}" data-state="${o.ended ? 'ended' : 'active'}">
      <figure class="o-offer__media"><img src="${esc(o.photo)}" alt="" loading="lazy"${o.position ? ` style="object-position: ${esc(o.position)}"` : ''}></figure>
      <div class="o-offer__body">
        <p class="o-offer__status"><span></span>${esc(status(o))}</p>
        <h2 class="o-offer__title">${esc(o.title)}</h2>
        <p class="o-offer__text">${esc(o.text)}</p>
        ${o.ended ? '' : `<button class="btn btn--dark o-offer__cta" type="button" data-offer="${esc(o.slug)}">Участвовать</button>`}
      </div>
    </li>`).join('');

  /* ---------- Фильтр ---------- */
  const tags = [...document.querySelectorAll('[data-state-tag]')];
  const items = [...list.children];
  const count = (s) => items.filter((li) => s === 'all' || li.dataset.state === s).length;
  tags.forEach((b) => {
    const n = count(b.dataset.stateTag);
    b.querySelector('.c-filter__n').textContent = `(${n})`;
    if (!n) b.closest('li').hidden = true;
  });
  let current = 'all';
  const render = (animate) => {
    items.forEach((li, i) => {
      li.hidden = current !== 'all' && li.dataset.state !== current;
      if (animate && !li.hidden) { li.classList.remove('is-in'); li.style.setProperty('--i', i % 6); void li.offsetWidth; li.classList.add('is-in'); }
    });
    tags.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.stateTag === current)));
  };
  const setState = (s, byClick) => {
    current = ['active', 'ended'].includes(s) && count(s) ? s : 'all';
    if (byClick) {
      // Адрес меняется без перезагрузки: specials.html?show=active
      const url = new URL(location.href);
      if (current === 'all') url.searchParams.delete('show'); else url.searchParams.set('show', current);
      history.replaceState(null, '', url);
      if (list.getBoundingClientRect().top > window.innerHeight * 0.6) list.scrollIntoView({ behavior: 'smooth' });
    }
    render(byClick);
  };
  tags.forEach((b) => b.addEventListener('click', () => setState(b.dataset.stateTag, true)));
  setState(new URLSearchParams(location.search).get('show') || 'all', false);

  /* ---------- Окно «Участвовать»: условия акции и заявка ---------- */
  const modal = document.getElementById('offerModal');
  const formHTML = modal.querySelector('.o-form').outerHTML;
  list.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-offer]');
    if (!btn) return;
    const o = offers.find((x) => x.slug === btn.dataset.offer);
    modal.querySelector('#offerPhoto').src = o.photo;
    modal.querySelector('#offerTitle').textContent = o.title;
    modal.querySelector('#offerText').textContent = o.text;
    modal.querySelector('#offerStatus').textContent = status(o);
    // Каждый раз чистая форма; название акции уходит в заявку скрытым полем
    modal.querySelector('.o-form').outerHTML = formHTML;
    const form = modal.querySelector('.o-form');
    form.querySelector('[name=offer]').value = o.title;
    form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      // Заглушка отправки — подключить к CRM/почте на этапе разработки
      form.innerHTML = '<p class="o-form__done">Спасибо! Мы свяжемся с вами, чтобы рассказать об условиях и записать в ателье.</p>';
    });
    window.vestoroModal.open(modal);
  });
})();
