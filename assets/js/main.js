/* Gold Cleaning Services — main.js */
(function () {
  'use strict';

  /* ---------- Header: logo grande no topo, encolhe ao rolar ---------- */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 24);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

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
    var lastTrigger = null;
    var downOnBackdrop = false;

    links.forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        var img = link.querySelector('img');
        lbImg.src = link.getAttribute('href');
        lbImg.alt = img ? img.alt : '';
        lbCaption.textContent = link.getAttribute('data-caption') || (img ? img.alt : '');
        lastTrigger = link;
        lightbox.showModal();
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', function () { lightbox.close(); });
    }
    /* fechar apenas quando o gesto começa E termina no backdrop (evita fecho por arrasto) */
    lightbox.addEventListener('pointerdown', function (e) {
      downOnBackdrop = (e.target === lightbox);
    });
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox && downOnBackdrop) lightbox.close();
    });
    lightbox.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { e.preventDefault(); lightbox.close(); }
    });
    lightbox.addEventListener('close', function () {
      if (lastTrigger) lastTrigger.focus();
    });
  }
  /* Sem showModal (browsers antigos), os links da galeria navegam
     diretamente para a imagem — fallback nativo, sem JS adicional. */

  /* ---------- Ano no rodapé ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
