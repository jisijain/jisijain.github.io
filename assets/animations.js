/* =========================================================================
   MAHIMA JAIN — shared interactions
   scroll reveal · parallax · magnetic buttons · nav · mobile menu · loader
   ========================================================================= */
(function(){
  'use strict';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Loader ---- */
  function initLoader(){
    const l = document.querySelector('.loader');
    if(!l) return;
    const hide = () => { if(l.classList.contains('done')) return; l.classList.add('done'); setTimeout(()=>l.remove(), 450); };
    window.addEventListener('load', () => setTimeout(hide, reduce ? 80 : 450));
    // safety — never block content for long
    setTimeout(hide, 1800);
  }

  /* ---- Scroll to top ---- */
  function initScrollTop(){
    if(document.querySelector('.to-top')) return;
    const btn = document.createElement('button');
    btn.className = 'to-top';
    btn.setAttribute('aria-label', 'Scroll to top');
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
    document.body.appendChild(btn);
    const onScroll = () => btn.classList.toggle('show', window.scrollY > 560);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive:true });
    btn.addEventListener('click', () => window.scrollTo({ top:0, behavior: reduce ? 'auto' : 'smooth' }));
  }

  /* ---- Nav scroll state ---- */
  function initNav(){
    const nav = document.querySelector('.nav');
    if(!nav) return;
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive:true });
  }

  /* ---- Mobile menu ---- */
  function initMobileMenu(){
    const burger = document.querySelector('.nav__burger');
    const menu = document.querySelector('.mobile-menu');
    if(!burger || !menu) return;
    const toggle = (force) => {
      const open = force !== undefined ? force : !menu.classList.contains('open');
      menu.classList.toggle('open', open);
      burger.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    };
    burger.addEventListener('click', () => toggle());
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggle(false)));
  }

  /* ---- Scroll reveal (position-based; resilient where IO doesn't fire) ---- */
  function initReveal(){
    let pending = [...document.querySelectorAll('.reveal, .line-mask')];
    if(reduce){ pending.forEach(e=>e.classList.add('in')); return; }
    const check = () => {
      const vh = window.innerHeight || document.documentElement.clientHeight || 800;
      pending = pending.filter(el => {
        const r = el.getBoundingClientRect();
        if(r.top < vh*0.92 && r.bottom > -40){ el.classList.add('in'); return false; }
        return true;
      });
      if(!pending.length){ window.removeEventListener('scroll', onScroll); }
    };
    const onScroll = () => requestAnimationFrame(check);
    window.addEventListener('scroll', onScroll, { passive:true });
    window.addEventListener('resize', check);
    window.addEventListener('load', check);
    // run over the first few frames in case layout/viewport settles late
    check();
    let t = 0; const tick = () => { check(); if(pending.length && t++ < 30) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
    setTimeout(check, 1200);
    // ultimate failsafe: never leave content permanently hidden
    setTimeout(() => pending.forEach(e => e.classList.add('in')), 4000);
  }

  /* ---- Parallax (data-parallax = speed, +down / -up) ---- */
  function initParallax(){
    if(reduce) return;
    const items = [...document.querySelectorAll('[data-parallax]')].map(el => ({
      el, speed: parseFloat(el.dataset.parallax) || 0.15
    }));
    if(!items.length) return;
    let ticking = false;
    const update = () => {
      const vh = window.innerHeight;
      items.forEach(({el, speed}) => {
        const r = el.getBoundingClientRect();
        const center = r.top + r.height/2;
        const off = (center - vh/2) * speed * -1;
        el.style.transform = `translate3d(0, ${off.toFixed(1)}px, 0)`;
      });
      ticking = false;
    };
    const onScroll = () => { if(!ticking){ requestAnimationFrame(update); ticking = true; } };
    window.addEventListener('scroll', onScroll, { passive:true });
    window.addEventListener('resize', update);
    update();
  }

  /* ---- Magnetic buttons ---- */
  function initMagnetic(){
    if(reduce || window.matchMedia('(pointer: coarse)').matches) return;
    document.querySelectorAll('.magnetic').forEach(el => {
      const strength = parseFloat(el.dataset.mag) || 0.4;
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width/2;
        const y = e.clientY - r.top - r.height/2;
        el.style.transform = `translate(${x*strength}px, ${y*strength}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }

  /* ---- Pointer-tilt for cards (data-tilt) ---- */
  function initTilt(){
    if(reduce || window.matchMedia('(pointer: coarse)').matches) return;
    document.querySelectorAll('[data-tilt]').forEach(card => {
      const max = parseFloat(card.dataset.tilt) || 6;
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left)/r.width - .5;
        const py = (e.clientY - r.top)/r.height - .5;
        card.style.transform = `perspective(900px) rotateX(${(-py*max).toFixed(2)}deg) rotateY(${(px*max).toFixed(2)}deg)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }

  /* ---- Hero pointer drift (mouse parallax) ---- */
  function initPointerDrift(){
    if(reduce || window.matchMedia('(pointer: coarse)').matches) return;
    const els = document.querySelectorAll('[data-drift]');
    if(!els.length) return;
    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX/window.innerWidth - .5);
      const y = (e.clientY/window.innerHeight - .5);
      els.forEach(el => {
        const d = parseFloat(el.dataset.drift) || 18;
        el.style.setProperty('--dx', (x*d).toFixed(1)+'px');
        el.style.setProperty('--dy', (y*d).toFixed(1)+'px');
      });
    });
  }

  /* ---- Animated counters (position-based) ---- */
  function initCounters(){
    let els = [...document.querySelectorAll('[data-count]')];
    if(!els.length) return;
    const run = (el) => {
      const end = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const dec = (end % 1 !== 0) ? 1 : 0;
      if(reduce){ el.textContent = end.toFixed(dec)+suffix; return; }
      const dur = 1400; const start = performance.now();
      const step = (now) => {
        const p = Math.min((now-start)/dur, 1);
        const e = 1 - Math.pow(1-p, 3);
        el.textContent = (end*e).toFixed(dec) + suffix;
        if(p < 1) requestAnimationFrame(step);
        else el.textContent = end.toFixed(dec) + suffix;
      };
      requestAnimationFrame(step);
    };
    const check = () => {
      const vh = window.innerHeight;
      els = els.filter(el => {
        const r = el.getBoundingClientRect();
        if(r.top < vh*0.85 && r.bottom > 0){ run(el); return false; }
        return true;
      });
      if(!els.length) window.removeEventListener('scroll', onScroll);
    };
    const onScroll = () => requestAnimationFrame(check);
    window.addEventListener('scroll', onScroll, { passive:true });
    check();
  }

  /* ---- Custom cursor ---- */
  function initCustomCursor(){
    if(reduce || window.matchMedia('(pointer: coarse)').matches) return;

    const css = document.createElement('style');
    css.textContent = `
      *, *::before, *::after { cursor: none !important; }
      .cur-dot {
        position: fixed; left: 0; top: 0;
        width: 7px; height: 7px; border-radius: 50%;
        background: #f4ebe6;
        pointer-events: none; z-index: 10000;
        will-change: transform;
        transition: opacity .18s;
        box-shadow: 0 0 6px rgba(179,36,52,.9), 0 0 2px rgba(244,235,230,.7);
      }
      .cur-orb {
        position: fixed; left: 0; top: 0;
        width: 30px; height: 30px; border-radius: 50%;
        pointer-events: none; z-index: 9999;
        will-change: transform;
        border: 1.5px solid rgba(244,235,230,.25);
        background:
          radial-gradient(circle at 32% 26%, rgba(255,255,255,.14) 0%, transparent 52%),
          radial-gradient(circle at 65% 72%, rgba(179,36,52,.07) 0%, transparent 48%);
        box-shadow:
          inset 0 1.5px 0 rgba(255,255,255,.14),
          inset 0 -1px 0 rgba(0,0,0,.12),
          0 0 16px rgba(179,36,52,.1),
          0 5px 16px rgba(0,0,0,.25);
        transition:
          width .38s cubic-bezier(.23,1,.32,1),
          height .38s cubic-bezier(.23,1,.32,1),
          border-color .32s, background .32s, box-shadow .32s, opacity .18s;
      }
      .cur-orb.hov {
        width: 50px; height: 50px;
        border-color: rgba(179,36,52,.52);
        background:
          radial-gradient(circle at 32% 26%, rgba(255,255,255,.09) 0%, transparent 48%),
          radial-gradient(circle at 65% 72%, rgba(179,36,52,.15) 0%, transparent 55%);
        box-shadow:
          inset 0 1.5px 0 rgba(255,255,255,.09),
          inset 0 -1px 0 rgba(0,0,0,.1),
          0 0 28px rgba(179,36,52,.22),
          0 8px 24px rgba(0,0,0,.32);
      }
      .cur-dot.off, .cur-orb.off { opacity: 0; }
    `;
    document.head.appendChild(css);

    const dot = document.createElement('div'); dot.className = 'cur-dot off';
    const orb = document.createElement('div'); orb.className = 'cur-orb off';
    document.body.append(orb, dot);

    let mx = -200, my = -200, ox = -200, oy = -200;
    let dotS = 1, dotST = 1, clickS = 1, clickST = 1;
    const lerp = (a, b, t) => a + (b - a) * t;

    (function tick(){
      ox = lerp(ox, mx, 0.1);
      oy = lerp(oy, my, 0.1);
      dotS   = lerp(dotS,   dotST,   0.14);
      clickS = lerp(clickS, clickST, 0.17);
      dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%) scale(${dotS.toFixed(3)})`;
      orb.style.transform = `translate(${ox}px,${oy}px) translate(-50%,-50%) scale(${clickS.toFixed(3)})`;
      requestAnimationFrame(tick);
    })();

    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.classList.remove('off'); orb.classList.remove('off');
    });
    document.addEventListener('mouseleave', () => { dot.classList.add('off'); orb.classList.add('off'); });
    document.addEventListener('mouseenter', () => { dot.classList.remove('off'); orb.classList.remove('off'); });

    const TARGETS = 'a, button, .magnetic, [role="button"], input, textarea, select, label';
    document.addEventListener('mouseover', e => {
      if(e.target.closest(TARGETS)){ orb.classList.add('hov'); }
    });
    document.addEventListener('mouseout', e => {
      if(e.target.closest(TARGETS)){ orb.classList.remove('hov'); }
    });

    document.addEventListener('mousedown', () => { clickST = 0.88; });
    document.addEventListener('mouseup',   () => { clickST = 1; });
  }

  /* ---- init all ---- */
  function boot(){
    initLoader(); initNav(); initMobileMenu(); initReveal();
    initParallax(); initMagnetic(); initTilt(); initPointerDrift(); initCounters(); initScrollTop();
    initCustomCursor();
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
