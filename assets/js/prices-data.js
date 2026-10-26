/* Прайс страницы «Цены» (prices.html). Цены и коллекции — из макета Figma.
   Новый раздел — одна запись в PRICE_GROUPS (появится вкладка), новая позиция — строка в items.
   Поля позиции: name — название, note — уточнение (ткань, материал), price — цена «от», число в рублях. */

window.PRICE_GROUPS = [
  {
    key: 'suits', tab: 'Костюмы',
    items: [
      { name: 'Классическая (Classic) коллекция', note: 'Ткани: Super 100’s–130’s, Reda, Guabello', price: 165000 },
      { name: 'Премиальная (Premium) коллекция', price: 255000 },
      { name: 'Люкс (Luxury) коллекция', price: 399000 },
      { name: 'Эксклюзивная (VESTORO Private) коллекция', price: 500000 },
    ],
  },
  {
    key: 'jackets', tab: 'Пиджаки',
    items: [
      { name: 'Классическая (Classic) коллекция', price: 115000 },
      { name: 'Премиальная (Premium) коллекция', price: 178000 },
      { name: 'Люкс (Luxury) коллекция', price: 275000 },
      { name: 'Эксклюзивная (VESTORO Private) коллекция', price: 350000 },
    ],
  },
  {
    key: 'trousers', tab: 'Брюки',
    items: [
      { name: 'Классическая (Classic) коллекция', price: 56000 },
      { name: 'Премиальная (Premium) коллекция', price: 71000 },
      { name: 'Люкс (Luxury) коллекция', price: 104000 },
      { name: 'Эксклюзивная (VESTORO Private) коллекция', price: 150000 },
    ],
  },
  {
    key: 'shirts', tab: 'Рубашки',
    items: [
      { name: 'Классическая (Classic) коллекция', price: 18000 },
      { name: 'Премиальная (Premium) коллекция', price: 24000 },
      { name: 'Люкс (Luxury) коллекция', price: 36000 },
      { name: 'Эксклюзивная (VESTORO Private) коллекция', price: 64000 },
    ],
  },
  {
    key: 'outerwear', tab: 'Верхняя одежда',
    items: [
      { name: 'Пальто', note: '100% шерсть', price: 125000 },
      { name: 'Пальто', note: 'Шерсть с кашемиром', price: 145000 },
      { name: 'Пальто', note: '100% кашемир', price: 240000 },
    ],
  },
  {
    key: 'shoes', tab: 'Обувь',
    items: [
      { name: 'Обувь', note: '100% кожа', price: 45000 },
    ],
  },
  {
    key: 'accessories', tab: 'Аксессуары',
    items: [
      { name: 'Галстук', note: '100% шёлк', price: 13000 },
      { name: 'Ремень', note: '100% кожа', price: 12000 },
      { name: 'Портфель', note: '100% кожа', price: 79000 },
      { name: 'Запонки', price: 9000 },
      { name: 'Шарф', price: 9000 },
    ],
  },
];
