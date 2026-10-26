/* Адреса ателье (contacts.html). Москва — из макета Figma; Петербург и Париж — по ТЗ, адреса и фото ждём от заказчика.
   Новый город — одна запись в LOCATIONS: появятся вкладка, карта, контакты и фото.
   Поля: key (латиницей, для адреса contacts.html?city=spb), city, address, addressNote, note, phone, email, hours,
         map — что искать на Яндекс.Картах (адрес или город), photos — [{ src, alt }]; без фото — место под снимки. */

window.LOCATIONS = [
  {
    key: 'moscow',
    city: 'Москва',
    address: 'Москва, Новолесная улица, 5',
    addressNote: 'Бесплатная парковка',
    phone: '+7 (495) 725-05-64',
    email: 'zayavka@vestoro.ru',
    hours: 'Пн–Сб 10:00–21:00 · Вс 10:00–19:00',
    map: 'Москва, Новолесная улица, 5',
    // Временные снимки — заменить на новые фото с Яндекс.Диска заказчика
    photos: [
      { src: 'assets/img/hero-atelier.jpg', alt: 'Гостиная ателье' },
      { src: 'assets/img/atelier/facade.jpg', alt: 'Вход в ателье' },
      { src: 'assets/img/history/space-library.jpg', alt: 'Библиотека тканей' },
      { src: 'assets/img/atelier/fabrics.jpg', alt: 'Книги тканей Scabal' },
      { src: 'assets/img/atelier/shoes.jpg', alt: 'Обувь в ателье' },
    ],
  },
  {
    key: 'spb',
    city: 'Санкт-Петербург',
    address: '',
    note: 'Ателье в Петербурге работает по предварительной записи: согласуем дату визита, и портной приедет к вам с книгами тканей.',
    phone: '+7 (495) 725-05-64',
    email: 'zayavka@vestoro.ru',
    hours: 'По предварительной записи',
    map: 'Санкт-Петербург',
    photos: [],
  },
  {
    key: 'paris',
    city: 'Париж',
    address: '',
    note: 'Встречи в Париже — по предварительной записи. Свяжитесь с нами, чтобы согласовать дату и место.',
    phone: '+7 (495) 725-05-64',
    email: 'zayavka@vestoro.ru',
    hours: 'По предварительной записи',
    map: 'Париж',
    photos: [],
  },
];
