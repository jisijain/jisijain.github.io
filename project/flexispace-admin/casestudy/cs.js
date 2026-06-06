/* FlexiSpace Case Study — interactions
   reveal-on-scroll · progress bar · topbar · hero parallax ·
   number counters · before/after slider · live-demo navigation */
(function () {
  'use strict';
  var rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- reveal on scroll ---- */
  var revs = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !rm) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revs.forEach(function (el) { io.observe(el); });
  } else {
    revs.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---- progress bar + topbar state ---- */
  var bar = document.getElementById('progress');
  var topbar = document.getElementById('topbar');
  function onScroll() {
    var h = document.documentElement;
    var sc = h.scrollTop || document.body.scrollTop;
    var max = h.scrollHeight - h.clientHeight;
    if (bar) bar.style.width = (max > 0 ? (sc / max) * 100 : 0) + '%';
    if (topbar) topbar.classList.toggle('scrolled', sc > 24);
    parallax(sc);
  }

  /* ---- hero parallax ---- */
  var pa = document.querySelector('.ph-a'), pb = document.querySelector('.ph-b'), pc = document.querySelector('.ph-c');
  function parallax(sc) {
    if (rm || !pa) return;
    if (sc > 900) return;
    pa.style.transform = 'translateY(' + (-sc * 0.06) + 'px)';
    pb.style.transform = 'rotate(-5deg) translateY(' + (-sc * 0.12) + 'px)';
    pc.style.transform = 'rotate(5deg) translateY(' + (-sc * 0.02) + 'px)';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- number counters ---- */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var dec = (el.getAttribute('data-dec') === '1');
    var suffix = el.getAttribute('data-suffix') || '';
    var prefix = el.getAttribute('data-prefix') || '';
    if (rm) { el.textContent = prefix + (dec ? target.toFixed(1) : Math.round(target)) + suffix; return; }
    var dur = 1400, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var e = 1 - Math.pow(1 - p, 3);
      var val = target * e;
      el.textContent = prefix + (dec ? val.toFixed(1) : Math.round(val)) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { animateCount(en.target); co.unobserve(en.target); } });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { co.observe(el); });
  } else { counters.forEach(animateCount); }

  /* ---- before / after slider ---- */
  document.querySelectorAll('.ba').forEach(function (ba) {
    var after = ba.querySelector('.ba-after');
    var handle = ba.querySelector('.ba-handle');
    var knob = ba.querySelector('.ba-knob');
    var dragging = false;
    function setPos(clientX) {
      var r = ba.getBoundingClientRect();
      var x = Math.max(0, Math.min(1, (clientX - r.left) / r.width));
      var pct = x * 100;
      after.style.clipPath = 'inset(0 0 0 ' + pct + '%)';
      handle.style.left = pct + '%';
      knob.style.left = pct + '%';
    }
    function down(e) { dragging = true; ba.style.cursor = 'ew-resize'; setPos((e.touches ? e.touches[0] : e).clientX); e.preventDefault(); }
    function move(e) { if (!dragging) return; setPos((e.touches ? e.touches[0] : e).clientX); }
    function up() { dragging = false; ba.style.cursor = ''; }
    knob.addEventListener('mousedown', down); ba.addEventListener('mousedown', down);
    window.addEventListener('mousemove', move); window.addEventListener('mouseup', up);
    knob.addEventListener('touchstart', down, { passive: false }); ba.addEventListener('touchstart', down, { passive: false });
    window.addEventListener('touchmove', move, { passive: false }); window.addEventListener('touchend', up);
  });

  /* ---- live demo chip navigation ---- */
  var frame = document.getElementById('demoFrame');
  document.querySelectorAll('.dchip').forEach(function (chip) {
    chip.addEventListener('click', function () {
      document.querySelectorAll('.dchip').forEach(function (c) { c.classList.remove('on'); });
      chip.classList.add('on');
      var screen = chip.getAttribute('data-screen');
      if (frame && frame.contentWindow) frame.contentWindow.postMessage({ type: 'fsnav', screen: screen }, '*');
    });
  });

  /* ---- footer floating dots ---- */
  var dots = document.querySelector('.dots');
  if (dots && !rm) {
    for (var i = 0; i < 14; i++) {
      var s = document.createElement('span');
      var sz = 8 + Math.random() * 34;
      s.style.width = sz + 'px'; s.style.height = sz + 'px';
      s.style.left = (Math.random() * 100) + '%';
      s.style.top = (Math.random() * 100) + '%';
      s.style.opacity = 0.15 + Math.random() * 0.4;
      s.style.animation = 'cuefloat ' + (6 + Math.random() * 6) + 's ease-in-out ' + (Math.random() * 4) + 's infinite';
      dots.appendChild(s);
    }
  }
})();
