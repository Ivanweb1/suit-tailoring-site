(() => {
  /* ---------- Истории костюмов для окна по клику ----------
     Заполняется по материалам заказчика. Ключ — data-client у карточки.
     Пустые поля показываются как «уточняется», без фото — снимок клиента и общие кадры ателье.
     Пример:
     modi: {
       made: 'Костюм-двойка и две сорочки',
       fabric: 'Scabal, шерсть Super 150’s',
       event: 'Официальный визит',
       quote: 'Текст отзыва от первого лица, две-четыре строки.',
       year: '2008',
       photos: [{ src: 'assets/img/clients/modi-1.jpg', alt: 'Костюм' }],
     },
  */
  const STORIES = {};

  // Общие кадры, пока нет фото костюма, ткани и деталей конкретного клиента
  const EXTRA_PHOTOS = [
    { src: 'assets/img/work-3.jpg', alt: 'Костюм VESTORO на манекене' },
    { src: 'assets/img/fabric-scabal.jpg', alt: 'Ткань Scabal' },
    { src: 'assets/img/history/bespoke/buttonhole.jpg', alt: 'Ручная миланская петля' },
    { src: 'assets/img/history/bespoke/lining.jpg', alt: 'Подкладка' },
  ];

  const SPHERES = { politika: 'Политика', biznes: 'Бизнес', kultura: 'Культура', nauka: 'Наука и медицина', sport: 'Спорт' };
  const MIN_PER_TAG = 3; // тег с одним-двумя именами выглядит пустым — не показываем
  const PAGE = 15;       // столько карточек нижнего яруса видно сразу, остальные — по «Все клиенты»

  /* ---------- Фильтр нижнего яруса ---------- */
  const grid = document.getElementById('clientsGrid');
  const cards = [...grid.children];
  const filter = document.getElementById('clientsFilter');
  const tags = [...filter.querySelectorAll('[data-sphere-tag]')];
  const more = document.getElementById('clientsMore');
  const status = document.getElementById('clientsStatus');
  const section = document.getElementById('all');
  let current = 'all';
  let expanded = false;

  const inSphere = (s) => (s === 'all' ? cards : cards.filter((li) => li.dataset.sphere === s));

  tags.forEach((btn) => {
    const s = btn.dataset.sphereTag;
    const n = inSphere(s).length;
    btn.querySelector('.c-filter__n').textContent = `(${n})`;
    if (s !== 'all' && n < MIN_PER_TAG) btn.closest('li').hidden = true;
  });
  const available = tags.filter((b) => !b.closest('li').hidden).map((b) => b.dataset.sphereTag);
  if (available.length < 2) filter.hidden = true; // только «Все» — фильтр не нужен

  const render = (animate) => {
    const list = inSphere(current);
    const limit = current === 'all' && !expanded ? PAGE : Infinity;
    cards.forEach((li) => { li.hidden = true; li.classList.remove('is-in'); });
    list.forEach((li, i) => {
      li.hidden = i >= limit;
      if (animate && !li.hidden) { li.style.setProperty('--i', i % 10); void li.offsetWidth; li.classList.add('is-in'); }
    });
    more.hidden = list.length <= limit;
    tags.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.sphereTag === current)));
    status.textContent = current === 'all' ? `Все клиенты · ${cards.length}` : `${SPHERES[current]} · ${list.length}`;
  };

  const setSphere = (s, byClick) => {
    current = available.includes(s) ? s : 'all';
    if (byClick) {
      // Адрес меняется без перезагрузки: по ссылке ?sphere=politika фильтр сохраняется
      const url = new URL(location.href);
      if (current === 'all') url.searchParams.delete('sphere'); else url.searchParams.set('sphere', current);
      history.replaceState(null, '', url);
      // Верхний ярус фильтр не трогает — показываем, что изменилось ниже
      if (section.getBoundingClientRect().top > window.innerHeight * 0.5) section.scrollIntoView({ behavior: 'smooth' });
    }
    render(byClick);
  };

  tags.forEach((b) => b.addEventListener('click', () => setSphere(b.dataset.sphereTag, true)));
  more.querySelector('button').addEventListener('click', () => { expanded = true; render(true); });
  setSphere(new URLSearchParams(location.search).get('sphere') || 'all', false);

  /* ---------- Окно с историей костюма ---------- */
  const modal = document.getElementById('storyModal');
  const mainPhoto = document.getElementById('storyPhoto');
  const thumbs = document.getElementById('storyThumbs');
  const field = (name) => modal.querySelector(`[data-field="${name}"]`);
  const PLACEHOLDER = {
    made: 'Уточняется',
    fabric: 'Уточняется',
    event: 'Уточняется',
    quote: 'Здесь — отзыв клиента от первого лица в две-четыре строки. Текст и фото — от заказчика.',
  };

  const fill = (name, value) => {
    const el = field(name);
    el.textContent = value || PLACEHOLDER[name];
    el.classList.toggle('is-empty', !value);
  };

  const showPhoto = (i, photos) => {
    mainPhoto.src = photos[i].src;
    mainPhoto.alt = photos[i].alt;
    [...thumbs.querySelectorAll('button')].forEach((b, n) => b.classList.toggle('is-active', n === i));
  };

  const openStory = (card) => {
    const key = card.dataset.client;
    const story = STORIES[key] || {};
    const name = card.querySelector('[data-name]').textContent;
    const img = card.querySelector('img');
    const sphere = card.dataset.sphere || card.closest('li').dataset.sphere;

    modal.querySelector('#storySphere').textContent = SPHERES[sphere] ? `История костюма · ${SPHERES[sphere]}` : 'История костюма';
    modal.querySelector('#storyName').textContent = name;
    modal.querySelector('#storyRole').textContent = card.querySelector('[data-role]').textContent;
    ['made', 'fabric', 'event', 'quote'].forEach((f) => fill(f, story[f]));
    const year = field('year');
    year.textContent = story.year || 'уточняется';
    year.classList.toggle('is-empty', !story.year);

    const photos = story.photos || [{ src: img.getAttribute('src'), alt: name }, ...EXTRA_PHOTOS];
    thumbs.innerHTML = '';
    photos.forEach((p, i) => {
      const li = document.createElement('li');
      li.innerHTML = '<button type="button"><img alt="" loading="lazy"></button>';
      const b = li.querySelector('button');
      b.setAttribute('aria-label', `Фото ${i + 1}: ${p.alt}`);
      b.querySelector('img').src = p.src;
      b.addEventListener('click', () => showPhoto(i, photos));
      thumbs.appendChild(li);
    });
    showPhoto(0, photos);
    window.vestoroModal.open(modal);
  };

  document.querySelectorAll('[data-client]').forEach((card) => card.addEventListener('click', () => openStory(card)));
})();
