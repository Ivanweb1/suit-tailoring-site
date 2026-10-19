(() => {
  const header = document.getElementById('header');
  const hero = document.getElementById('hero');
  const params = new URLSearchParams(location.search);

  // Варианты первого экрана для показа заказчику:
  // ?hero=long — с большим текстом, ?bg=photo — одно фото вместо слайдера
  // Вариант первого экрана меняет и блок «Почему выбирают VESTORO»
  if (params.get('hero') === 'long') document.body.classList.add('v-long');

  // Блок «Как создаётся костюм»: ?process=short|long, по умолчанию — как вариант страницы
  const processMode = params.get('process') || (params.get('hero') === 'long' ? 'short' : 'long');
  if (processMode === 'short') document.body.classList.add('process-short');

  /* ---------- Плавное появление блоков ---------- */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
    }), { threshold: 0.15 });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-visible'));
  }
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

  /* ---------- Карусели: стрелки листают на ширину видимой части ---------- */
  document.querySelectorAll('[data-carousel-nav]').forEach((nav) => {
    const track = document.getElementById(nav.dataset.carouselNav);
    const [prev, next] = nav.querySelectorAll('button');
    const update = () => {
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
    };
    nav.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => {
      track.scrollBy({ left: Number(b.dataset.dir) * track.clientWidth * 0.8, behavior: 'smooth' });
    }));
    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  });

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

  /* ---------- Всплывающие окна ---------- */
  const modal = document.getElementById('modal');
  const modalTitle = document.getElementById('modalTitle');
  let lastFocus;

  const openM = (m) => {
    if (!document.querySelector('.modal.is-open')) lastFocus = document.activeElement;
    document.querySelectorAll('.modal.is-open').forEach((o) => { o.classList.remove('is-open'); o.setAttribute('aria-hidden', 'true'); });
    setMobile(false);
    m.classList.add('is-open');
    m.setAttribute('aria-hidden', 'false');
    document.body.classList.add('is-locked');
    m.querySelector('.modal__close').focus();
  };
  const closeM = (m) => {
    m.querySelectorAll('video').forEach((v) => v.pause());
    m.classList.remove('is-open');
    m.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('is-locked');
    if (lastFocus) lastFocus.focus();
  };

  // Окно записи
  document.querySelectorAll('[data-modal-open]').forEach((el) =>
    el.addEventListener('click', (e) => {
      e.preventDefault();
      modalTitle.textContent = el.dataset.modalTitle || 'Записаться на консультацию';
      openM(modal);
    })
  );

  // Примеры работ: видео в окне (data-video — путь к ролику)
  const videoModal = document.getElementById('videoModal');
  const player = document.getElementById('videoPlayer');
  const videoNote = document.getElementById('videoNote');
  document.querySelectorAll('[data-video]').forEach((tile) =>
    tile.addEventListener('click', () => {
      const src = tile.dataset.video;
      player.poster = tile.dataset.poster;
      videoNote.hidden = !!src;
      if (src) { player.src = src; player.controls = true; } else { player.removeAttribute('src'); player.controls = false; }
      openM(videoModal);
      if (src) player.play().catch(() => {});
    })
  );

  document.querySelectorAll('.modal').forEach((m) =>
    m.querySelectorAll('[data-modal-close]').forEach((el) => el.addEventListener('click', () => closeM(m)))
  );
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const open = document.querySelector('.modal.is-open');
    if (open) closeM(open);
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

  const visitForm = document.getElementById('visitForm');
  visitForm.addEventListener('submit', (e) => {
    e.preventDefault();
    visitForm.innerHTML = '<p class="visit__done">Спасибо! Менеджер свяжется с вами, чтобы согласовать время визита портного.</p>';
  });

  const subscribeForm = document.getElementById('subscribeForm');
  subscribeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    subscribeForm.innerHTML = '<p class="subscribe__done">Спасибо! Вы подписаны на новости VESTORO.</p>';
  });
})();
