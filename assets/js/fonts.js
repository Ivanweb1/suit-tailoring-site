// Варианты шрифта заголовков для показа заказчику.
// Главная: index.html?font=<ключ>. Сравнение всех вариантов: fonts.html
window.VESTORO_FONTS = [
  {
    key: 'current', name: 'Cormorant Garamond', note: 'Сейчас на сайте — замена фирменного LT Remark',
    family: '"Cormorant Garamond"', weight: 400, css: 'Cormorant+Garamond:ital,wght@0,400;1,400',
  },
  {
    key: 'cormorant-light', name: 'Cormorant Garamond Light', note: 'Тот же шрифт, но тоньше и легче — меньше «веса» в заголовках',
    family: '"Cormorant Garamond"', weight: 300, css: 'Cormorant+Garamond:ital,wght@0,300;1,300',
  },
  {
    key: 'prata', name: 'Prata', note: 'Контрастный дидон с тонкими засечками — ближе всего к ювелирным и fashion-домам',
    family: '"Prata"', weight: 400, scale: 0.84, css: 'Prata',
  },
  {
    key: 'playfair', name: 'Playfair Display', note: 'Журнальная классика в духе Vogue и Harper’s Bazaar',
    family: '"Playfair Display"', weight: 400, scale: 0.88, css: 'Playfair+Display:ital,wght@0,400;1,400',
  },
  {
    key: 'noto-display', name: 'Noto Serif Display Light', note: 'Высокий контраст и очень тонкие линии — строго и дорого',
    family: '"Noto Serif Display"', weight: 300, scale: 0.92, css: 'Noto+Serif+Display:ital,wght@0,300;1,300',
  },
  {
    key: 'forum', name: 'Forum', note: 'Римские капители — торжественно, в духе старых ателье Сэвил-Роу',
    family: '"Forum"', weight: 400, scale: 0.98, css: 'Forum',
  },
  {
    key: 'tenor', name: 'Tenor Sans', note: 'Без засечек, тонкий и вытянутый — современная сдержанная элегантность',
    family: '"Tenor Sans"', weight: 400, scale: 0.8, css: 'Tenor+Sans',
  },
];

window.vestoroLoadFont = (font) => {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${font.css}&display=swap`;
  document.head.appendChild(link);
};

// На главной: ?font=<ключ> меняет шрифт всех заголовков и показывает переключатель
(() => {
  const root = document.documentElement;
  if (!root.hasAttribute('data-font-switch')) return;
  const key = new URLSearchParams(location.search).get('font');
  const font = window.VESTORO_FONTS.find((f) => f.key === key);
  if (!font) return;

  window.vestoroLoadFont(font);
  root.style.setProperty('--serif', `${font.family}, "Times New Roman", serif`);
  root.style.setProperty('--serif-w', font.weight);
  root.style.setProperty('--serif-scale', font.scale || 1);

  document.addEventListener('DOMContentLoaded', () => {
    const box = document.createElement('label');
    box.className = 'font-switch';
    box.innerHTML = '<span>Шрифт</span>';
    const select = document.createElement('select');
    window.VESTORO_FONTS.forEach((f) => select.add(new Option(f.name, f.key, false, f.key === key)));
    select.addEventListener('change', () => {
      const params = new URLSearchParams(location.search);
      params.set('font', select.value);
      location.search = params.toString();
    });
    box.appendChild(select);
    document.body.appendChild(box);
  });
})();
