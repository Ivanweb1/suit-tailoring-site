/* Ткани: страница со всеми домами (fabrics.html) и страница одного дома (fabric.html?house=…).
   Всё строится из assets/js/fabric-houses.js. Подключается до main.js, чтобы новые блоки получили плавное появление и кнопки записи */
(() => {
  const TYPES = window.FABRIC_TYPES;
  const HOUSES = window.FABRIC_HOUSES;
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const meta = (h) => [h.country, h.since && `с ${h.since}`].filter(Boolean).join(' · ') || TYPES[h.type].eyebrow;
  const plural = (n, one, few, many) => {
    const d = n % 10, t = n % 100;
    if (d === 1 && t !== 11) return one;
    if (d >= 2 && d <= 4 && (t < 12 || t > 14)) return few;
    return many;
  };
  const houseUrl = (h) => `fabric.html?house=${h.slug}`;

  // Кадр дома: фото ткани с белым логотипом, без фото — светлая «сорочечная» фактура
  const media = (h, eager) => `<span class="f-house__media">${
    h.photo ? `<img class="f-house__photo" src="${esc(h.photo)}" alt=""${eager ? '' : ' loading="lazy"'}>` : ''}${
    h.logo ? `<img class="f-house__logo" src="${esc(h.logo)}" alt="">` : `<span class="f-house__word">${esc(h.name)}</span>`}</span>`;

  const card = (h) => `
    <li id="${esc(h.slug)}" data-type="${esc(h.type)}">
      <a class="f-house${h.photo ? '' : ' f-house--plain'}" href="${houseUrl(h)}">
        ${media(h)}
        <span class="f-house__meta">${esc(meta(h))}</span>
        <h3 class="f-house__name">${esc(h.name)}</h3>
        <span class="f-house__text${h.text ? '' : ' is-empty'}">${esc(h.text || 'Описание — от заказчика')}</span>
        <span class="f-house__link">О доме</span>
      </a>
    </li>`;

  const invite = (t) => `
    <li>
      <button class="f-invite" type="button" data-modal-open>
        <img src="${esc(t.invite.photo)}" alt="" loading="lazy">
        <span class="f-invite__eyebrow">${esc(t.invite.eyebrow)}</span>
        <span class="f-invite__title">${esc(t.invite.title)}</span>
        <span class="f-invite__link">${esc(t.invite.link)}</span>
      </button>
    </li>`;

  /* ---------- Страница всех тканей ---------- */
  const cats = document.getElementById('fabricCats');
  if (cats) {
    const keys = Object.keys(TYPES).filter((k) => HOUSES.some((h) => h.type === k));
    const total = HOUSES.length;

    document.querySelectorAll('[data-houses-total]').forEach((el) => { el.textContent = total; });
    document.querySelectorAll('[data-houses-word]').forEach((el) => { el.textContent = plural(total, 'дом тканей', 'дома тканей', 'домов тканей'); });

    cats.innerHTML = keys.map((k, i) => {
      const t = TYPES[k];
      const list = HOUSES.filter((h) => h.type === k);
      return `
      <section class="f-cat${i % 2 ? ' f-cat--alt' : ''}" data-type="${k}" id="type-${k}">
        <div class="f-cat__head reveal">
          <div><p class="eyebrow">${esc(t.eyebrow)}</p><h2 class="f-cat__title">${t.title}</h2></div>
          <p class="f-cat__lead">${esc(t.lead)}<span>${list.length} ${plural(list.length, 'дом', 'дома', 'домов')}</span></p>
        </div>
        <ul class="f-grid">${list.map(card).join('')}${t.invite ? invite(t) : ''}</ul>
      </section>`;
    }).join('');

    // Фильтр: «Все» и по одному тегу на категорию, со счётчиком домов
    const tagList = document.getElementById('fabricTags');
    tagList.innerHTML = [['all', 'Все', total], ...keys.map((k) => [k, TYPES[k].tag, HOUSES.filter((h) => h.type === k).length])]
      .map(([k, label, n]) => `<li><button class="c-filter__tag" type="button" data-type-tag="${k}" aria-pressed="false">${esc(label)}<span class="c-filter__n">(${n})</span></button></li>`)
      .join('');
    if (keys.length < 2) tagList.closest('.c-filter').hidden = true;

    const sections = [...cats.querySelectorAll('.f-cat')];
    const tags = [...tagList.querySelectorAll('button')];
    let current = 'all';
    const render = (animate) => {
      sections.forEach((s) => {
        s.hidden = current !== 'all' && s.dataset.type !== current;
        if (animate && !s.hidden) [...s.querySelectorAll('.f-grid > li')].forEach((li, i) => {
          li.classList.remove('is-in'); li.style.setProperty('--i', i % 8); void li.offsetWidth; li.classList.add('is-in');
        });
      });
      tags.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.typeTag === current)));
    };
    const setType = (t, byClick) => {
      current = keys.includes(t) ? t : 'all';
      if (byClick) {
        // Адрес меняется без перезагрузки: по ссылке fabrics.html?type=suit фильтр сохраняется
        const url = new URL(location.href);
        if (current === 'all') url.searchParams.delete('type'); else url.searchParams.set('type', current);
        url.hash = '';
        history.replaceState(null, '', url);
        const first = sections.find((s) => !s.hidden);
        if (first.getBoundingClientRect().top > window.innerHeight * 0.5) first.scrollIntoView({ behavior: 'smooth' });
      }
      render(byClick);
    };
    tags.forEach((b) => b.addEventListener('click', () => setType(b.dataset.typeTag, true)));
    setType(new URLSearchParams(location.search).get('type') || 'all', false);

    // Ссылка из меню вида fabrics.html#albini: карточки появляются из скрипта, поэтому прокручиваем сами
    const target = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (target) {
      if (target.closest('[hidden]')) setType('all', false);
      requestAnimationFrame(() => target.scrollIntoView());
    }
  }

  /* ---------- Страница одного дома ---------- */
  const root = document.getElementById('house');
  if (root) {
    const slug = new URLSearchParams(location.search).get('house');
    const h = HOUSES.find((x) => x.slug === slug);
    if (!h) { location.replace('fabrics.html'); return; }
    const t = TYPES[h.type];
    const others = HOUSES.filter((x) => x.type === h.type && x !== h);
    const placeholder = (text) => `<p class="fh-empty">${esc(text)}</p>`;

    document.title = `${h.name} — ткани в ателье VESTORO`;
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.content = `${h.name}${h.country ? ` (${h.country})` : ''} в ателье VESTORO: ${h.text || 'ткани для индивидуального пошива'}`;

    const about = h.about && h.about.length ? h.about : [h.text].filter(Boolean);
    const features = h.features || [];
    const collections = h.collections || [];

    root.innerHTML = `
      <section class="fh-hero${h.photo ? '' : ' fh-hero--plain'}">
        ${h.photo ? `<img class="fh-hero__bg" src="${esc(h.photo)}" alt="">` : ''}
        <div class="fh-hero__content">
          <nav class="fh-crumbs" aria-label="Навигация"><a href="fabrics.html">Ткани</a><span>·</span><a href="fabrics.html?type=${h.type}">${esc(t.tag)}</a></nav>
          ${h.logo ? `<img class="fh-hero__logo" src="${esc(h.logo)}" alt="">` : ''}
          <h1 class="fh-hero__name">${esc(h.name)}</h1>
          <p class="fh-hero__meta">${esc(meta(h))}</p>
        </div>
      </section>

      <section class="fh-about">
        <div class="fh-about__head reveal">
          <p class="eyebrow">О доме</p>
          <h2 class="h-title">История <em>и характер</em></h2>
        </div>
        <div class="fh-about__body reveal">
          ${about.map((p) => `<p>${esc(p)}</p>`).join('')}
          ${h.about && h.about.length ? '' : placeholder('Подробная история дома, его преимущества и место в гардеробе клиента — текст от заказчика.')}
          <button class="btn btn--line" type="button" data-modal-open>Подобрать ткань ${esc(h.name)}</button>
        </div>
      </section>

      <section class="fh-features">
        <div class="h-head reveal">
          <p class="eyebrow">Особенности тканей</p>
          <h2 class="h-title">Чем ценятся <em>ткани ${esc(h.name)}</em></h2>
        </div>
        ${features.length
          ? `<ol class="fh-features__list reveal">${features.map((f, i) => `<li><span class="fh-features__n">${String(i + 1).padStart(2, '0')}</span><h3>${esc(f.title)}</h3><p>${esc(f.text)}</p></li>`).join('')}</ol>`
          : `<div class="reveal">${placeholder('Особенности тканей дома — от заказчика.')}</div>`}
      </section>

      <section class="fh-collections">
        <div class="h-head reveal">
          <p class="eyebrow">Коллекции</p>
          <h2 class="h-title">Актуальные коллекции <em>и новинки сезона</em></h2>
        </div>
        <ul class="fh-collections__list reveal">${(collections.length ? collections : [{}, {}, {}]).map((c) => `
          <li class="fh-col${c.title ? '' : ' fh-col--empty'}">
            <span class="fh-col__media">${c.photo ? `<img src="${esc(c.photo)}" alt="" loading="lazy">` : (h.photo ? `<img src="${esc(h.photo)}" alt="" loading="lazy">` : '')}</span>
            <h3 class="fh-col__title">${esc(c.title || 'Название коллекции')}</h3>
            <p class="fh-col__text">${esc(c.text || 'Описание коллекции и фото образцов — от заказчика.')}</p>
          </li>`).join('')}
        </ul>
      </section>

      ${others.length ? `
      <section class="fh-more">
        <div class="f-cat__head reveal">
          <div><p class="eyebrow">${esc(t.eyebrow)}</p><h2 class="f-cat__title">Другие <em>дома</em></h2></div>
          <p class="f-cat__lead">В ателье на Новолесной можно сравнить ткани разных домов вживую.<span><a href="fabrics.html">Все ткани</a></span></p>
        </div>
        <ul class="f-grid">${others.slice(0, 4).map(card).join('')}</ul>
      </section>` : ''}`;
  }
})();
