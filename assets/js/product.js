/* Страницы изделий мужского раздела (men-suits.html, men-jackets.html).
   «Что определяет качество и стоимость»: схема, по «Подробнее» / точке / миниатюре — окно с полным текстом пункта. */
(() => {
  const root = document.getElementById('details');
  if (!root) return;
  const modal = document.getElementById('dtModal');
  const body = document.getElementById('dtModalBody');
  const img = document.getElementById('dtModalImg');
  const tpls = [...root.querySelectorAll('template[id^="dt-tpl-"]')];
  let cur = 0;

  const show = (i) => {
    cur = (i + tpls.length) % tpls.length;
    const t = tpls[cur];
    body.replaceChildren(t.content.cloneNode(true));
    img.src = t.dataset.img;
    img.alt = t.dataset.alt;
    img.style.objectPosition = t.dataset.pos;
    modal.querySelector('.modal__body').scrollTop = 0;
    modal.querySelector('.modal__dialog').scrollTop = 0;
  };

  const open = (i) => {
    show(i);
    if (window.vestoroModal) window.vestoroModal.open(modal);
  };

  root.querySelectorAll('[data-dt-open]').forEach((el) =>
    el.addEventListener('click', () => open(Number(el.dataset.dtOpen)))
  );
  root.querySelectorAll('.dt-point .scheme__thumb').forEach((el) =>
    el.addEventListener('click', () => open(Number(el.closest('.dt-point').dataset.dot) - 1))
  );
  modal.querySelectorAll('[data-dt-step]').forEach((el) =>
    el.addEventListener('click', () => show(cur + Number(el.dataset.dtStep)))
  );
  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('is-open')) return;
    if (e.key === 'ArrowRight') show(cur + 1);
    if (e.key === 'ArrowLeft') show(cur - 1);
  });
})();
