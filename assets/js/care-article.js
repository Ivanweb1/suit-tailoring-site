/* VESTORO — типовая страница статьи (care-article.html?id=<slug>).
   Берёт данные из window.CARE_ARTICLES (care-data.js), строит оглавление,
   чек-лист, совет мастера, навигацию «Предыдущая / Следующая» и блок «Читайте также». */

(() => {
  const articles = window.CARE_ARTICLES || [];
  const topics = window.CARE_TOPICS || {};
  if (!articles.length) return;

  const esc = (s) =>
    String(s || '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));

  const params = new URLSearchParams(location.search);
  const slug = params.get('id');
  const idx = Math.max(0, articles.findIndex((a) => a.id === slug));
  const article = articles[idx] || articles[0];
  const topicName = topics[article.topic] || 'Уход за одеждой';

  document.title = `${article.title} — VESTORO`;

  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  };

  // Крошки и шапка
  const crumbTopic = document.getElementById('crumbTopic');
  if (crumbTopic) {
    crumbTopic.textContent = topicName;
    crumbTopic.href = `care.html?topic=${encodeURIComponent(article.topic)}`;
  }
  setText('artTopic', topicName);
  setText('artDate', article.date);
  setText('artReadTime', article.readTime || '4 мин чтения');
  setText('artTitle', article.title);
  setText('artLead', article.lead);

  const cover = document.getElementById('artCover');
  if (cover) {
    cover.src = article.image;
    cover.alt = article.title;
  }

  // Текст статьи + оглавление
  const contentEl = document.getElementById('artContent');
  const tocEl = document.getElementById('artToc');
  const tocItems = [];
  let html = '';

  (article.sections || []).forEach((sec, i) => {
    const anchor = `sec-${i + 1}`;
    if (sec.heading) {
      html += `<h2 id="${anchor}">${esc(sec.heading)}</h2>`;
      tocItems.push(`<li><a href="#${anchor}">${esc(sec.heading)}</a></li>`);
    }
    if (sec.text) html += `<p>${esc(sec.text)}</p>`;
    if (sec.list && sec.list.length) {
      html += `<ul>${sec.list.map((item) => `<li>${esc(item)}</li>`).join('')}</ul>`;
    }
  });

  if ((article.remember && article.remember.length) || (article.avoid && article.avoid.length)) {
    html += `<div class="art-checklist" id="sec-checklist">`;
    if (article.remember && article.remember.length) {
      html += `<div class="art-checklist__col"><h3>Важно помнить</h3><ul>${article.remember.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>`;
    }
    if (article.avoid && article.avoid.length) {
      html += `<div class="art-checklist__col art-checklist__col--avoid"><h3>Чего избегать</h3><ul>${article.avoid.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>`;
    }
    html += `</div>`;
    tocItems.push('<li><a href="#sec-checklist">Памятка по уходу</a></li>');
  }

  if (article.tip) {
    html += `<aside class="art-tip" id="sec-tip"><span class="art-tip__label">Совет мастера VESTORO</span><p>${esc(article.tip)}</p></aside>`;
    tocItems.push('<li><a href="#sec-tip">Совет мастера VESTORO</a></li>');
  }

  if (contentEl) contentEl.innerHTML = html;
  if (tocEl) tocEl.innerHTML = tocItems.join('');

  // Предыдущая / Следующая статья
  const pagerEl = document.getElementById('artPager');
  if (pagerEl && articles.length > 1) {
    const prev = articles[(idx - 1 + articles.length) % articles.length];
    const next = articles[(idx + 1) % articles.length];
    pagerEl.innerHTML = `
      <a class="art-pager__link" href="care-article.html?id=${encodeURIComponent(prev.id)}">
        <span class="art-pager__dir">← Предыдущая статья</span>
        <span class="art-pager__name">${esc(prev.title)}</span>
      </a>
      <a class="art-pager__link art-pager__link--next" href="care-article.html?id=${encodeURIComponent(next.id)}">
        <span class="art-pager__dir">Следующая статья →</span>
        <span class="art-pager__name">${esc(next.title)}</span>
      </a>
    `;
  }

  // Читайте также (3 другие статьи)
  const relatedEl = document.getElementById('artRelated');
  if (relatedEl) {
    const others = articles.filter((a) => a.id !== article.id).slice(0, 3);
    relatedEl.innerHTML = others.map((a) => `
      <li>
        <a class="care-card" href="care-article.html?id=${encodeURIComponent(a.id)}">
          <span class="care-card__media">
            <img src="${esc(a.image)}" alt="${esc(a.title)}" loading="lazy">
            <span class="care-card__tag">${esc(topics[a.topic] || '')}</span>
          </span>
          <span class="care-card__date">${esc(a.date)}</span>
          <span class="care-card__title">${esc(a.title)}</span>
          <span class="care-card__more">Читать статью →</span>
        </a>
      </li>
    `).join('');
  }

  // Копирование ссылки на статью
  const shareBtn = document.getElementById('artShareBtn');
  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      const label = shareBtn.querySelector('span');
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(location.href).then(() => {
          if (label) label.textContent = 'Ссылка скопирована';
          setTimeout(() => { if (label) label.textContent = 'Скопировать ссылку'; }, 2200);
        }).catch(() => {});
      }
    });
  }
})();
