(() => {
  /* ---------- Фильтр: ВСЕ · МУЖСКАЯ ОДЕЖДА · ЖЕНСКАЯ ОДЕЖДА · ОБУВЬ · АКСЕССУАРЫ ----------
     Работает по всем трём блокам сразу (манекены, люди, видео); блок без подходящих работ скрывается.
     Адрес меняется на works.html?cat=men, по такой ссылке фильтр сохраняется */
  const CATS = { men: 'Мужская одежда', women: 'Женская одежда', shoes: 'Обувь', accessories: 'Аксессуары' };
  const items = [...document.querySelectorAll('[data-cat]')];
  const blocks = [...document.querySelectorAll('.w-block')];
  const tags = [...document.querySelectorAll('[data-cat-tag]')];
  const inCat = (c) => (c === 'all' ? items : items.filter((li) => li.dataset.cat === c));
  let current = 'all';

  // Подпись категории под каждой работой
  items.forEach((li) => { const m = li.querySelector('[data-meta]'); if (m) m.textContent = CATS[li.dataset.cat]; });

  tags.forEach((b) => {
    const n = inCat(b.dataset.catTag).length;
    b.querySelector('.c-filter__n').textContent = `(${n})`;
    if (!n) b.closest('li').hidden = true;
  });

  const plural = (n) => {
    const d = n % 10, h = n % 100;
    if (d === 1 && h !== 11) return 'работа';
    if (d >= 2 && d <= 4 && (h < 12 || h > 14)) return 'работы';
    return 'работ';
  };

  const render = (animate) => {
    items.forEach((li) => { li.hidden = current !== 'all' && li.dataset.cat !== current; li.classList.remove('is-in'); });
    blocks.forEach((block) => {
      const visible = [...block.querySelectorAll('[data-cat]')].filter((li) => !li.hidden);
      block.hidden = !visible.length;
      const count = block.querySelector('.w-block__count');
      if (count) count.textContent = `${visible.length} ${plural(visible.length)}`;
      if (animate) visible.forEach((li, i) => { li.style.setProperty('--i', i % 8); void li.offsetWidth; li.classList.add('is-in'); });
    });
    tags.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.catTag === current)));
  };

  const setCat = (c, byClick) => {
    current = CATS[c] ? c : 'all';
    if (byClick) {
      const url = new URL(location.href);
      if (current === 'all') url.searchParams.delete('cat'); else url.searchParams.set('cat', current);
      history.replaceState(null, '', url);
    }
    render(byClick);
  };
  tags.forEach((b) => b.addEventListener('click', () => setCat(b.dataset.catTag, true)));
  setCat(new URLSearchParams(location.search).get('cat') || 'all', false);

  /* ---------- Мини-кейс по клику на фото ----------
     Факты берутся из атрибутов карточки: data-fabric, data-style, data-master, data-date, data-note.
     Пусто — показывается «уточняется» */
  const EXTRA_PHOTOS = [
    { src: 'assets/img/fabric-scabal.jpg', alt: 'Ткань' },
    { src: 'assets/img/history/bespoke/buttonhole.jpg', alt: 'Ручная петля' },
    { src: 'assets/img/history/bespoke/lining.jpg', alt: 'Подкладка' },
  ];
  const modal = document.getElementById('caseModal');
  const mainPhoto = document.getElementById('casePhoto');
  const thumbs = document.getElementById('caseThumbs');
  const field = (n) => modal.querySelector(`[data-field="${n}"]`);
  const NOTE = 'Короткая история изделия: для кого и к какому событию шили, сколько было примерок. Текст и фото — от заказчика.';

  const showPhoto = (i, photos) => {
    mainPhoto.src = photos[i].src;
    mainPhoto.alt = photos[i].alt;
    [...thumbs.querySelectorAll('button')].forEach((b, n) => b.classList.toggle('is-active', n === i));
  };

  document.querySelectorAll('.w-item').forEach((card) => card.addEventListener('click', () => {
    const li = card.closest('[data-cat]');
    const title = card.querySelector('.w-item__title').textContent;
    const img = card.querySelector('img');
    modal.querySelector('#caseCat').textContent = `Мини-кейс · ${CATS[li.dataset.cat]}`;
    modal.querySelector('#caseTitle').textContent = title;
    modal.querySelector('#caseKind').textContent = card.dataset.kind || '';
    ['fabric', 'style', 'master', 'date'].forEach((f) => {
      const v = card.dataset[f];
      field(f).textContent = v || 'Уточняется';
      field(f).classList.toggle('is-empty', !v);
    });
    field('note').textContent = card.dataset.note || NOTE;
    field('note').classList.toggle('is-empty', !card.dataset.note);

    const photos = [{ src: img.getAttribute('src'), alt: title }, ...EXTRA_PHOTOS];
    thumbs.innerHTML = '';
    photos.forEach((p, i) => {
      const t = document.createElement('li');
      t.innerHTML = '<button type="button"><img alt="" loading="lazy"></button>';
      const b = t.querySelector('button');
      b.setAttribute('aria-label', `Фото ${i + 1}: ${p.alt}`);
      b.querySelector('img').src = p.src;
      b.addEventListener('click', () => showPhoto(i, photos));
      thumbs.appendChild(t);
    });
    showPhoto(0, photos);
    window.vestoroModal.open(modal);
  }));
})();
