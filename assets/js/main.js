/* Gold Cleaning Services — main.js */
(function () {
  'use strict';

  /* ---------- Botão "voltar ao topo" ---------- */
  var toTop = document.createElement('button');
  toTop.type = 'button';
  toTop.className = 'to-top';
  toTop.setAttribute('aria-label', 'Voltar ao topo da página');
  toTop.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m18 15-6-6-6 6"/></svg>';
  document.body.appendChild(toTop);
  toTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- Header: logo grande no topo, encolhe ao rolar ---------- */
  var header = document.querySelector('.site-header');
  var onScroll = function () {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 24);
    toTop.classList.toggle('is-visible', window.scrollY > 600);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Navegação móvel ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('nav');
  function closeNav() {
    nav.classList.remove('is-open');
    document.body.style.overflow = '';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menu');
  }
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      document.body.style.overflow = open ? 'hidden' : '';
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeNav();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open') &&
          !document.querySelector('dialog[open]')) {
        closeNav();
        toggle.focus();
      }
    });
  }

  /* ---------- "Ver mais serviços" (telemóvel) ---------- */
  var svcToggle = document.querySelector('.services-toggle');
  var svcGrid = document.getElementById('lista-servicos');
  if (svcToggle && svcGrid) {
    svcGrid.classList.add('is-collapsed');
    svcToggle.addEventListener('click', function () {
      var collapsed = svcGrid.classList.toggle('is-collapsed');
      svcToggle.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
      svcToggle.textContent = collapsed ? 'Ver mais serviços' : 'Ver menos serviços';
    });
  }

  /* ---------- Slider antes/depois ---------- */
  document.querySelectorAll('.ba-slider').forEach(function (slider) {
    var range = slider.querySelector('input[type="range"]');
    var after = slider.querySelector('.ba-slider__after');
    var divider = slider.querySelector('.ba-slider__divider');
    if (!range || !after || !divider) return;
    var update = function () {
      var v = Number(range.value);
      after.style.clipPath = 'inset(0 0 0 ' + v + '%)';
      divider.style.left = v + '%';
      range.setAttribute('aria-valuetext', v + '% — lado esquerdo mostra o antes, lado direito o depois');
    };
    range.addEventListener('input', update);
    update();
  });

  /* ---------- Galeria / lightbox ---------- */
  var lightbox = document.getElementById('lightbox');
  var links = document.querySelectorAll('.gallery a');
  if (lightbox && typeof lightbox.showModal === 'function' && links.length) {
    var lbImg = lightbox.querySelector('img');
    var lbCaption = lightbox.querySelector('figcaption');
    var closeBtn = lightbox.querySelector('.lightbox__close');
    var prevBtn = lightbox.querySelector('.lightbox__prev');
    var nextBtn = lightbox.querySelector('.lightbox__next');
    var lastTrigger = null;
    var downOnBackdrop = false;
    var current = 0;

    var items = [];
    links.forEach(function (link, i) {
      var img = link.querySelector('img');
      items.push({
        src: link.getAttribute('href'),
        alt: img ? img.alt : '',
        caption: link.getAttribute('data-caption') || (img ? img.alt : '')
      });
      link.addEventListener('click', function (e) {
        e.preventDefault();
        lastTrigger = link;
        show(i);
        lightbox.showModal();
      });
    });

    function show(i) {
      current = (i + items.length) % items.length;
      var item = items[current];
      lbImg.src = item.src;
      lbImg.alt = item.alt;
      lbCaption.textContent = item.caption;
    }

    if (closeBtn) closeBtn.addEventListener('click', function () { lightbox.close(); });
    if (prevBtn) prevBtn.addEventListener('click', function () { show(current - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { show(current + 1); });

    /* fechar apenas quando o gesto começa E termina no backdrop (evita fecho por arrasto) */
    lightbox.addEventListener('pointerdown', function (e) {
      downOnBackdrop = (e.target === lightbox);
    });
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox && downOnBackdrop) lightbox.close();
    });
    lightbox.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { e.preventDefault(); lightbox.close(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); show(current - 1); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); show(current + 1); }
    });
    lightbox.addEventListener('close', function () {
      if (lastTrigger) lastTrigger.focus();
    });
  }
  /* Sem showModal (browsers antigos), os links da galeria navegam
     diretamente para a imagem — fallback nativo, sem JS adicional. */

  /* ---------- Mapa Google (click-to-load, sem cookies até ao clique) ---------- */
  var mapBtn = document.querySelector('.map-load');
  if (mapBtn) {
    mapBtn.addEventListener('click', function () {
      var media = document.querySelector('.map-card__media');
      if (!media) return;
      var iframe = document.createElement('iframe');
      iframe.src = 'https://maps.google.com/maps?q=40.958470,-8.596591&z=16&hl=pt&output=embed';
      iframe.title = 'Mapa interativo do Google Maps com a localização da Gold Cleaning na Rua Nova, Rio Meão';
      iframe.className = 'map-card__iframe';
      iframe.setAttribute('allowfullscreen', '');
      iframe.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
      media.innerHTML = '';
      media.appendChild(iframe);
      iframe.focus();
    });
  }

  /* ---------- Ano no rodapé ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
