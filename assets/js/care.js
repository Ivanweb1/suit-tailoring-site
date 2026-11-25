/* VESTORO — страница «Как ухаживать за одеждой» (care.html).
   Строит сетку статей из CARE_ARTICLES (care-data.js), фильтрует по темам (?topic=...)
   и открывает статью в окне чтения #articleModal. */

(() => {
  const articles = window.CARE_ARTICLES || [];
  const topics = window.CARE_TOPICS || {};
  const list = document.getElementById('careList');
  const tags = document.querySelectorAll('[data-topic-tag]');
  const articleModal = document.getElementById('articleModal');

  if (!list || !articles.length) return;

  const esc = (s) =>
    String(s || '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));

  // Подсчёт статей в каждой категории
  const counts = { all: articles.length };
  articles.forEach((a) => { counts[a.topic] = (counts[a.topic] || 0) + 1; });
  tags.forEach((tag) => {
    const key = tag.dataset.topicTag;
    const n = tag.querySelector('.c-filter__n');
    if (n) n.textContent = `(${counts[key] || 0})`;
  });

  const openArticle = (article) => {
    if (!articleModal || !article) return;
    document.getElementById('articleImg').src = article.image;
    document.getElementById('articleImg').alt = article.title;
    document.getElementById('articleMeta').textContent = `${topics[article.topic] || 'Уход'} · ${article.date}`;
    document.getElementById('articleTitle').textContent = article.title;
    document.getElementById('articleLead').textContent = article.lead;

    const bodyEl = document.getElementById('articleContent');
    let html = '';
    (article.sections || []).forEach((sec) => {
      if (sec.heading) html += `<h3>${esc(sec.heading)}</h3>`;
      if (sec.text) html += `<p>${esc(sec.text)}</p>`;
      if (sec.list && sec.list.length) {
        html += `<ul>${sec.list.map((item) => `<li>${esc(item)}</li>`).join('')}</ul>`;
      }
    });
    if (article.tip) {
      html += `<div class="article-box__tip"><strong>Совет мастера VESTORO</strong>${esc(article.tip)}</div>`;
    }
    bodyEl.innerHTML = html;

    if (window.vestoroModal) window.vestoroModal.open(articleModal);
  };

  const render = (topic = 'all') => {
    const filtered = topic === 'all' ? articles : articles.filter((a) => a.topic === topic);
    list.innerHTML = filtered.map((a, idx) => `
      <li style="animation-delay: ${Math.min(idx * 45, 240)}ms">
        <a class="care-card" href="care-article.html?id=${encodeURIComponent(a.id)}">
          <span class="care-card__media">
            <img src="${esc(a.image)}" alt="${esc(a.title)}" loading="lazy">
            <span class="care-card__tag">${esc(topics[a.topic] || '')}</span>
          </span>
          <span class="care-card__date">${esc(a.date)}</span>
          <span class="care-card__title">${esc(a.title)}</span>
          <span class="care-card__excerpt">${esc(a.excerpt)}</span>
          <span class="care-card__more">Читать статью →</span>
        </a>
      </li>
    `).join('');
  };

  const setTopic = (topic, pushUrl = true) => {
    const valid = topic === 'all' || topics[topic] ? topic : 'all';
    tags.forEach((tag) => tag.setAttribute('aria-pressed', String(tag.dataset.topicTag === valid)));
    render(valid);
    if (pushUrl && history.replaceState) {
      const url = new URL(location.href);
      if (valid === 'all') url.searchParams.delete('topic');
      else url.searchParams.set('topic', valid);
      history.replaceState(null, '', url.pathname + url.search + url.hash);
    }
  };

  tags.forEach((tag) => tag.addEventListener('click', () => setTopic(tag.dataset.topicTag, true)));

  // Инициализация из URL (?topic=... и ?article=...)
  const params = new URLSearchParams(location.search);
  setTopic(params.get('topic') || 'all', false);

  const articleParam = params.get('article');
  if (articleParam) {
    const found = articles.find((a) => a.id === articleParam);
    if (found) {
      // Открываем после инициализации main.js (window.vestoroModal)
      window.addEventListener('DOMContentLoaded', () => openArticle(found));
    }
  }
})();
