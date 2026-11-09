/* Страницы изделий мужского раздела (men-suits.html, men-jackets.html).
   «Что определяет качество и стоимость»: открыт один пункт, справа меняется фото. */
(() => {
  const root = document.getElementById('details');
  if (!root) return;
  const items = [...root.querySelectorAll('.dt-item')];
  const photos = [...root.querySelectorAll('.dt__photo img')];

  const open = (item) => {
    items.forEach((it) => {
      const on = it === item;
      it.classList.toggle('is-open', on);
      it.querySelector('.dt-item__head').setAttribute('aria-expanded', String(on));
      it.querySelector('.dt-item__body').hidden = !on;
    });
    photos.forEach((p) => p.classList.toggle('is-active', p.dataset.dt === item.dataset.dt));
  };

  items.forEach((it) => it.querySelector('.dt-item__head').addEventListener('click', () => {
    if (it.classList.contains('is-open')) return;
    open(it);
    // На телефоне пункт раскрывается на месте — держим его заголовок в кадре
    const top = it.getBoundingClientRect().top;
    if (top < 70) window.scrollBy({ top: top - 80, behavior: 'smooth' });
  }));
})();
