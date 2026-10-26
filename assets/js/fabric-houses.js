/* Данные о тканях: категории и дома. Из них строятся страница «Ткани» (fabrics.html) и страница дома (fabric.html?house=…).
   Новый дом — одна запись в FABRIC_HOUSES; новая категория — одна запись в FABRIC_TYPES.

   Поля дома:
     slug        — латиницей, для адреса: fabric.html?house=loro-piana
     name        — название
     type        — ключ категории из FABRIC_TYPES
     country, since — страна и год основания (since можно не указывать)
     logo        — SVG-логотип, если есть; без него название набирается шрифтом
     photo       — фото ткани для карточки; без фото — светлая карточка с фактурой
     text        — 1–2 предложения для карточки
     about       — подробнее о доме, для страницы дома (абзацы массивом)
     features    — особенности тканей: [{ title, text }]
     collections — коллекции и новинки сезона: [{ title, text, photo }]
   Пустые about / features / collections на странице дома показываются местом под материалы заказчика. */

window.FABRIC_TYPES = {
  suit: {
    tag: 'Костюмные',
    eyebrow: 'Костюмные ткани',
    title: 'Ткани <em>для костюма</em>',
    lead: 'Шерсть, кашемир, шёлк и лён от фабрик Италии, Англии и Франции — для делового, вечернего и повседневного гардероба.',
    invite: { eyebrow: 'Библиотека тканей', title: 'Более 7 000 образцов в ателье на Новолесной', link: 'Записаться на подбор', photo: 'assets/img/history/space-library.jpg' },
  },
  shirt: {
    tag: 'Сорочечные',
    eyebrow: 'Сорочечные ткани',
    title: 'Ткани <em>для сорочки</em>',
    lead: 'Хлопок, лён и смесовые ткани для сорочек: от классического поплина и оксфорда до тонкого батиста.',
    invite: { eyebrow: 'Сорочка по меркам', title: 'Подберём ткань под ваш костюм', link: 'Записаться на консультацию', photo: 'assets/img/wardrobe/men-shirts.jpg' },
  },
};

window.FABRIC_HOUSES = [
  /* ---------- Костюмные ---------- */
  {
    slug: 'loro-piana', name: 'Loro Piana', type: 'suit', country: 'Италия', since: 1924,
    logo: 'assets/img/fabrics/loro-piana.svg', photo: 'assets/img/fabrics/photo/loro-piana.jpg',
    text: 'Итальянский дом, известный самыми редкими волокнами мира: baby cashmere, викуньей и тончайшей мериносовой шерстью. Ткани для тех, кто ценит мягкость и тихую роскошь.',
    features: [
      { title: 'Baby cashmere', text: 'Пух первой стрижки молодых кашмирских коз — одно из самых мягких волокон в мире.' },
      { title: 'Викунья', text: 'Шерсть андской викуньи — редчайшее натуральное волокно.' },
      { title: 'Tasmanian', text: 'Костюмная ткань из тонкой мериносовой шерсти: держит форму и почти не мнётся.' },
    ],
  },
  {
    slug: 'zegna', name: 'Ermenegildo Zegna', type: 'suit', country: 'Италия', since: 1910,
    logo: 'assets/img/fabrics/zegna.svg', photo: 'assets/img/fabrics/photo/zegna.jpg',
    text: 'Шерстяная фабрика в Триверо, где больше века ткут костюмные ткани из лучшей мериносовой шерсти. Классика делового гардероба.',
    features: [
      { title: 'Trofeo', text: 'Плотная гладкая шерсть для делового костюма на каждый день.' },
      { title: '15milmil15', text: 'Ткань из шерсти диаметром не толще 15 микрон.' },
    ],
  },
  {
    slug: 'scabal', name: 'Scabal', type: 'suit', country: 'Бельгия', since: 1938,
    logo: 'assets/img/fabrics/scabal.svg', photo: 'assets/img/fabrics/photo/scabal.jpg',
    text: 'Брюссельский дом с собственной фабрикой в английском Хаддерсфилде. Известен смелыми коллекциями — вплоть до шерсти с бриллиантовой крошкой.',
    features: [
      { title: 'Ткачество в Хаддерсфилде', text: 'Ткани производятся на собственной фабрике в историческом центре английского сукноделия.' },
      { title: 'Коллекции с драгоценностями', text: 'Шерсть и шёлк с бриллиантовой крошкой и золотой нитью — для особых случаев.' },
    ],
  },
  {
    slug: 'dormeuil', name: 'Dormeuil', type: 'suit', country: 'Франция', since: 1842,
    logo: 'assets/img/fabrics/dormeuil.svg', photo: 'assets/img/fabrics/photo/dormeuil.jpg',
    text: 'Парижский дом тканей, одевающий джентльменов почти два века. Эталон французской элегантности в костюмной шерсти.',
  },
  {
    slug: 'holland-sherry', name: 'Holland & Sherry', type: 'suit', country: 'Великобритания', since: 1836,
    logo: 'assets/img/fabrics/holland-sherry.svg', photo: 'assets/img/fabrics/photo/holland-sherry.jpg',
    text: 'Лондонский поставщик тканей для портных Сэвил-Роу. Английская шерсть, твид и фланель с благородной плотной драпировкой.',
  },
  {
    slug: 'drago', name: 'Drago', type: 'suit', country: 'Италия', since: 1973,
    logo: 'assets/img/fabrics/drago.svg', photo: 'assets/img/fabrics/photo/drago.jpg',
    text: 'Семейная фабрика из Бьеллы. Лёгкие тонкие шерстяные ткани для костюмов, в которых комфортно весь день.',
  },
  {
    slug: 'vitale-barberis-canonico', name: 'Vitale Barberis Canonico', type: 'suit', country: 'Италия', since: 1663,
    text: 'Одна из старейших шерстяных фабрик мира из Пратриверо под Бьеллой. Классическая итальянская костюмная шерсть с богатой палитрой рисунков.',
  },
  {
    slug: 'reda', name: 'Reda', type: 'suit', country: 'Италия', since: 1865,
    text: 'Фабрика из Валле-Моссо с собственными фермами мериносов в Новой Зеландии. Лёгкие дышащие ткани для деловых костюмов.',
  },
  {
    slug: 'charles-clayton', name: 'Charles Clayton', type: 'suit', country: 'Великобритания',
    logo: 'assets/img/fabrics/charles-clayton.svg', photo: 'assets/img/fabrics/photo/charles-clayton.jpg',
    text: 'Костюмные ткани классических рисунков: полоска, клетка, «гусиная лапка» — для делового и повседневного гардероба.',
  },

  /* ---------- Сорочечные ---------- */
  {
    slug: 'thomas-mason', name: 'Thomas Mason', type: 'shirt', country: 'Великобритания', since: 1796,
    logo: 'assets/img/fabrics/thomas-mason.svg',
    text: 'Английская марка сорочечных тканей с двухвековой историей. Поплин, оксфорд и твил для классических сорочек.',
  },
  {
    slug: 'albini', name: 'Albini', type: 'shirt', country: 'Италия', since: 1876,
    text: 'Один из ведущих европейских производителей сорочечного хлопка. Ткани из египетского хлопка Giza для сорочек, которые носят годами.',
    features: [{ title: 'Хлопок Giza', text: 'Длинноволокнистый египетский хлопок: гладкая поверхность и мягкий блеск.' }],
  },
  {
    slug: 'canclini', name: 'Canclini', type: 'shirt', country: 'Италия', since: 1925,
    text: 'Итальянская фабрика сорочечных тканей из окрестностей Комо. Тонкий поплин, фил-а-фил и ткани для торжественных сорочек.',
  },
  {
    slug: 'monti', name: 'Tessitura Monti', type: 'shirt', country: 'Италия', since: 1911,
    text: 'Итальянские сорочечные ткани с широкой палитрой цветов и рисунков — от строгих деловых до летних.',
  },
  {
    slug: 'david-john-anderson', name: 'David & John Anderson', type: 'shirt', country: 'Шотландия', since: 1822,
    text: 'Шотландская марка роскошных сорочечных тканей из тончайшего хлопка. Для сорочек особого случая.',
  },
  {
    slug: 'soktas', name: 'Soktas', type: 'shirt', country: 'Турция', since: 1971,
    text: 'Производитель премиальных сорочечных тканей из хлопка, выращенного в долине Большого Мендереса.',
  },
  {
    slug: 'the-great-white', name: 'The Great White', type: 'shirt', country: '',
    text: '',
  },
];
