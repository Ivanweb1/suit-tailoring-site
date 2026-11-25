/* VESTORO — интерактивный подбор и заказ подарочного сертификата (certificates.html).
   Поддерживает параметры URL (?type=electronic|nominal|preset).
   Оплата через CloudPayments подключается в обработчике отправки формы #certOrderForm. */

(() => {
  const TYPE_META = {
    electronic: {
      title: 'Электронная подарочная карта',
      short: 'Электронная карта',
      delivery: 'Электронный (email / мессенджер)',
      mode: 'nominal',
    },
    nominal: {
      title: 'Подарочная карта свободного номинала',
      short: 'Свободный номинал',
      delivery: 'Курьером по Москве в фирменной коробке',
      mode: 'nominal',
    },
    preset: {
      title: 'Готовое подарочное предложение',
      short: 'Готовое предложение',
      delivery: 'Курьером по Москве в фирменной коробке',
      mode: 'preset',
    },
  };

  const state = {
    type: 'nominal',
    nominal: 165000,
    presetName: 'Индивидуальный пошив костюма',
    presetPrice: 165000,
    occasion: 'День рождения',
    audience: 'Мужчине',
    recipient: '',
    wish: '',
  };

  const formatRub = (n) => `${Number(n || 0).toLocaleString('ru-RU')} ₽`;

  const typeCards = document.querySelectorAll('[data-cert-card]');
  const typePills = document.querySelectorAll('[data-cert-type]');
  const nominalBlock = document.getElementById('certNominalBlock');
  const presetBlock = document.getElementById('certPresetBlock');
  const nominalPills = document.querySelectorAll('[data-cert-nominal]');
  const customSumInput = document.getElementById('certCustomSum');
  const presetPills = document.querySelectorAll('[data-cert-preset]');
  const occasionPills = document.querySelectorAll('[data-cert-occasion]');
  const audiencePills = document.querySelectorAll('[data-cert-audience]');
  const recipientInput = document.getElementById('certRecipient');
  const wishInput = document.getElementById('certWish');

  // Элементы живого превью
  const cardKind = document.getElementById('cardKind');
  const cardValue = document.getElementById('cardValue');
  const cardItem = document.getElementById('cardItem');
  const cardRecipient = document.getElementById('cardRecipient');

  // Сводка в конструкторе и в форме заказа
  const setText = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  };

  const deliverySelect = document.getElementById('orderDelivery');
  const orderForm = document.getElementById('certOrderForm');
  const orderDone = document.getElementById('certOrderDone');
  const orderReset = document.getElementById('certOrderReset');

  const syncHiddenInputs = () => {
    if (!orderForm) return;
    const meta = TYPE_META[state.type];
    const isPreset = meta.mode === 'preset';
    const amount = isPreset ? state.presetPrice : state.nominal;
    const giftLabel = isPreset ? state.presetName : `Свободный номинал ${formatRub(state.nominal)}`;

    orderForm.elements.cert_type.value = meta.title;
    orderForm.elements.cert_gift.value = giftLabel;
    orderForm.elements.cert_amount.value = String(amount);
    orderForm.elements.cert_occasion.value = state.occasion;
    orderForm.elements.cert_audience.value = state.audience;
    orderForm.elements.cert_recipient.value = state.recipient.trim();
    orderForm.elements.cert_wish.value = state.wish.trim();
  };

  const render = () => {
    const meta = TYPE_META[state.type];
    const isPreset = meta.mode === 'preset';

    typeCards.forEach((card) => {
      const active = card.dataset.certCard === state.type;
      card.classList.toggle('is-selected', active);
      card.setAttribute('aria-pressed', String(active));
    });
    typePills.forEach((pill) => {
      pill.setAttribute('aria-pressed', String(pill.dataset.certType === state.type));
    });

    if (nominalBlock) nominalBlock.hidden = isPreset;
    if (presetBlock) presetBlock.hidden = !isPreset;

    const displayAmount = isPreset ? `от ${formatRub(state.presetPrice)}` : formatRub(state.nominal);
    const displayItem = isPreset
      ? state.presetName
      : (state.type === 'electronic' ? 'Электронный сертификат на пошив' : 'На индивидуальный пошив в VESTORO');

    if (cardKind) cardKind.textContent = meta.short;
    if (cardValue) cardValue.textContent = displayAmount;
    if (cardItem) cardItem.textContent = displayItem;

    if (cardRecipient) {
      const name = state.recipient.trim();
      const wish = state.wish.trim();
      if (name && wish) {
        cardRecipient.innerHTML = `Для: <strong>${escapeHtml(name)}</strong> · «${escapeHtml(wish)}»`;
      } else if (name) {
        cardRecipient.innerHTML = `Для: <strong>${escapeHtml(name)}</strong> · Повод: ${escapeHtml(state.occasion)}`;
      } else {
        cardRecipient.innerHTML = `Повод: <strong>${escapeHtml(state.occasion)}</strong> · ${escapeHtml(state.audience)}`;
      }
    }

    // Сводка справа в конструкторе
    setText('sumType', meta.short);
    setText('sumGift', isPreset ? state.presetName : 'Свободный номинал');
    setText('sumAmount', displayAmount);
    setText('sumOccasion', `${state.occasion} · ${state.audience}`);

    // Сводка в форме заказа (#order)
    setText('recapType', meta.title);
    setText('recapGift', isPreset ? state.presetName : 'Любое изделие ателье');
    setText('recapAmount', displayAmount);
    setText('recapOccasion', `${state.occasion} (${state.audience.toLowerCase()})`);
    setText('recapRecipient', state.recipient.trim() || 'Не указано');

    syncHiddenInputs();
  };

  const escapeHtml = (str) =>
    str.replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));

  const selectType = (type, scrollToBuilder = false) => {
    if (!TYPE_META[type]) return;
    state.type = type;
    if (deliverySelect) {
      deliverySelect.value = type === 'electronic' ? 'electronic' : 'courier';
    }
    render();
    if (scrollToBuilder) {
      const builder = document.getElementById('builder');
      if (builder) builder.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  typeCards.forEach((card) =>
    card.addEventListener('click', () => selectType(card.dataset.certCard, true))
  );
  typePills.forEach((pill) =>
    pill.addEventListener('click', () => selectType(pill.dataset.certType, false))
  );

  nominalPills.forEach((pill) =>
    pill.addEventListener('click', () => {
      nominalPills.forEach((p) => p.setAttribute('aria-pressed', 'false'));
      pill.setAttribute('aria-pressed', 'true');
      state.nominal = Number(pill.dataset.certNominal);
      if (customSumInput) customSumInput.value = '';
      render();
    })
  );

  if (customSumInput) {
    customSumInput.addEventListener('input', () => {
      const digits = customSumInput.value.replace(/\D/g, '');
      const val = Number(digits);
      if (val >= 5000) {
        nominalPills.forEach((p) => p.setAttribute('aria-pressed', 'false'));
        state.nominal = val;
        render();
      }
    });
  }

  presetPills.forEach((pill) =>
    pill.addEventListener('click', () => {
      presetPills.forEach((p) => p.setAttribute('aria-pressed', 'false'));
      pill.setAttribute('aria-pressed', 'true');
      state.presetName = pill.dataset.certPreset;
      state.presetPrice = Number(pill.dataset.certPrice);
      render();
    })
  );

  occasionPills.forEach((pill) =>
    pill.addEventListener('click', () => {
      occasionPills.forEach((p) => p.setAttribute('aria-pressed', 'false'));
      pill.setAttribute('aria-pressed', 'true');
      state.occasion = pill.dataset.certOccasion;
      render();
    })
  );

  audiencePills.forEach((pill) =>
    pill.addEventListener('click', () => {
      audiencePills.forEach((p) => p.setAttribute('aria-pressed', 'false'));
      pill.setAttribute('aria-pressed', 'true');
      state.audience = pill.dataset.certAudience;
      render();
    })
  );

  if (recipientInput) {
    recipientInput.addEventListener('input', () => {
      state.recipient = recipientInput.value;
      render();
    });
  }
  if (wishInput) {
    wishInput.addEventListener('input', () => {
      state.wish = wishInput.value;
      render();
    });
  }

  // Отправка заявки на сертификат (заглушка до подключения CRM и CloudPayments)
  if (orderForm && orderDone) {
    orderForm.addEventListener('submit', (e) => {
      e.preventDefault();
      syncHiddenInputs();
      const buyerName = orderForm.elements.name.value.trim();
      const meta = TYPE_META[state.type];
      const amount = meta.mode === 'preset' ? `от ${formatRub(state.presetPrice)}` : formatRub(state.nominal);

      setText('doneSummary', `${buyerName ? `${buyerName}, ` : ''}ваша заявка на «${meta.title}» (${amount}) принята. Менеджер ателье VESTORO свяжется с вами в течение 15 минут, чтобы подтвердить детали и способ вручения.`);
      orderForm.hidden = true;
      orderDone.hidden = false;
    });
  }

  if (orderReset && orderForm && orderDone) {
    orderReset.addEventListener('click', () => {
      orderForm.reset();
      orderForm.hidden = false;
      orderDone.hidden = true;
      render();
    });
  }

  // Параметр URL ?type=electronic|nominal|preset
  const initialType = new URLSearchParams(location.search).get('type');
  if (initialType && TYPE_META[initialType]) {
    state.type = initialType;
    if (deliverySelect) deliverySelect.value = initialType === 'electronic' ? 'electronic' : 'courier';
  }

  render();
})();
