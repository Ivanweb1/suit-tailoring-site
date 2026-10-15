(() => {
  const header = document.getElementById('header');
  const hero = document.getElementById('hero');
  const params = new URLSearchParams(location.search);

  // Варианты первого экрана для показа заказчику:
  // ?hero=long — с большим текстом, ?bg=photo — одно фото вместо слайдера
  if (params.get('hero') === 'long') hero.classList.add('hero--long');
  const isPhoto = params.get('bg') === 'photo';
  if (isPhoto) hero.classList.add('hero--photo');

  /* ---------- Шапка: фон после прокрутки ---------- */
  const onScroll = () => header.classList.toggle('is-solid', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Выпадающее меню по наведению ---------- */
  const mega = document.getElementById('mega');
  const links = header.querySelectorAll('.nav__link');
  const panels = mega.querySelectorAll('.mega__panel');
  let closeTimer;

  const openMenu = (key) => {
    clearTimeout(closeTimer);
    links.forEach((l) => l.classList.toggle('is-active', l.dataset.menu === key));
    panels.forEach((p) => p.classList.toggle('is-active', p.dataset.panel === key));
    header.classList.add('is-open');
    mega.setAttribute('aria-hidden', 'false');
  };
  const closeMenu = () => {
    closeTimer = setTimeout(() => {
      header.classList.remove('is-open');
      links.forEach((l) => l.classList.remove('is-active'));
      mega.setAttribute('aria-hidden', 'true');
    }, 150);
  };

  links.forEach((link) => {
    link.addEventListener('mouseenter', () => (link.dataset.menu ? openMenu(link.dataset.menu) : closeMenu()));
    link.addEventListener('focus', () => link.dataset.menu && openMenu(link.dataset.menu));
  });
  header.addEventListener('mouseleave', closeMenu);
  header.addEventListener('mouseenter', () => clearTimeout(closeTimer));

  /* ---------- Слайдер первого экрана ---------- */
  const slides = hero.querySelectorAll('.hero__slide');
  const dots = hero.querySelectorAll('.hero__dots button');
  let current = 0;
  let slideTimer;

  const show = (i) => {
    current = (i + slides.length) % slides.length;
    slides.forEach((s, n) => s.classList.toggle('is-active', n === current));
    dots.forEach((d, n) => d.classList.toggle('is-active', n === current));
  };
  const play = () => {
    clearInterval(slideTimer);
    if (!isPhoto) slideTimer = setInterval(() => show(current + 1), 6000);
  };
  dots.forEach((d, n) => d.addEventListener('click', () => { show(n); play(); }));
  play();

  /* ---------- Мобильное меню ---------- */
  const mobile = document.getElementById('mobileMenu');
  const burger = header.querySelector('[data-mobile-open]');
  const setMobile = (open) => {
    mobile.classList.toggle('is-open', open);
    mobile.setAttribute('aria-hidden', String(!open));
    burger.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('is-locked', open);
  };
  burger.addEventListener('click', () => setMobile(true));
  mobile.querySelector('[data-mobile-close]').addEventListener('click', () => setMobile(false));
  mobile.querySelectorAll('.mobile-menu__nav a').forEach((a) => a.addEventListener('click', () => setMobile(false)));

  /* ---------- Всплывающее окно записи ---------- */
  const modal = document.getElementById('modal');
  const modalTitle = document.getElementById('modalTitle');
  let lastFocus;

  const openModal = (title) => {
    lastFocus = document.activeElement;
    modalTitle.textContent = title || 'Записаться на консультацию';
    setMobile(false);
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('is-locked');
    modal.querySelector('.modal__close').focus();
  };
  const closeModal = () => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('is-locked');
    if (lastFocus) lastFocus.focus();
  };

  document.querySelectorAll('[data-modal-open]').forEach((el) =>
    el.addEventListener('click', (e) => { e.preventDefault(); openModal(el.dataset.modalTitle); })
  );
  modal.querySelectorAll('[data-modal-close]').forEach((el) => el.addEventListener('click', closeModal));
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (modal.classList.contains('is-open')) closeModal();
    else if (mobile.classList.contains('is-open')) setMobile(false);
  });

  // Раскрытие «Оставить заявку» и «Написать в мессенджер»
  modal.querySelectorAll('[data-toggle]').forEach((btn) => {
    const target = document.getElementById(btn.dataset.toggle);
    btn.setAttribute('aria-expanded', 'false');
    btn.addEventListener('click', () => {
      const open = target.hidden;
      target.hidden = !open;
      btn.setAttribute('aria-expanded', String(open));
    });
  });

  // Заглушка отправки заявки — подключить к CRM/почте на этапе разработки
  const form = document.getElementById('requestForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    form.classList.add('is-sent');
    form.innerHTML = '<p>Спасибо! Мы перезвоним вам в ближайшее время.</p>';
  });
})();
