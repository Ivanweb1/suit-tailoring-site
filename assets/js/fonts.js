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
  // В духе Gieves & Hawkes: контрастная антиква, прописные вперемешку с курсивом
  {
    key: 'playfair-2', group: 'gh', name: 'Playfair (новая версия)', note: 'Ближе всего к заголовкам Gieves & Hawkes: острые засечки, высокий контраст, живой курсив',
    family: '"Playfair"', weight: 400, scale: 0.88, css: 'Playfair:ital,opsz,wght@0,96,400;1,96,400',
  },
  {
    key: 'bona-nova', group: 'gh', name: 'Bona Nova', note: 'Классическая книжная антиква с изящным курсивом — спокойно и благородно',
    family: '"Bona Nova"', weight: 400, scale: 0.9, css: 'Bona+Nova:ital,wght@0,400;1,400',
  },
  {
    key: 'brygada', group: 'gh', name: 'Brygada 1918', note: 'Антиква начала XX века — характерные засечки, ощущение старого дома',
    family: '"Brygada 1918"', weight: 400, scale: 0.8, css: 'Brygada+1918:ital,wght@0,400;1,400',
  },
  {
    key: 'source-display', group: 'gh', name: 'Source Serif Display', note: 'Строгая контрастная антиква для крупных заголовков, хорошо читается в прописных',
    family: '"Source Serif 4"', weight: 400, scale: 0.9, css: 'Source+Serif+4:ital,opsz,wght@0,60,400;1,60,400',
  },
  {
    key: 'literata-display', group: 'gh', name: 'Literata Display Light', note: 'Тонкая дисплейная антиква — лёгкая, но с характером',
    family: '"Literata"', weight: 300, scale: 0.8, css: 'Literata:ital,opsz,wght@0,72,300;1,72,300',
  },
  {
    key: 'old-standard', group: 'gh', name: 'Old Standard TT', note: 'Классический типографский шрифт XIX века — как вывески старых ателье',
    family: '"Old Standard TT"', weight: 400, scale: 0.9, css: 'Old+Standard+TT:ital@0;1',
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
