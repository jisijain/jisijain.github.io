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

  /* ---- Fluid cursor (cursor-splash.js) ---- */
  function loadFluidCursor(){
    if(window.matchMedia('(pointer: coarse)').matches) return;
    const me = document.querySelector('script[src*="animations.js"]');
    if(!me) return;
    const s = document.createElement('script');
    s.src = me.src.replace('animations.js','cursor-splash.js');
    document.head.appendChild(s);
  }

  /* ---- init all ---- */
  function boot(){
    initLoader(); initNav(); initMobileMenu(); initReveal();
    initParallax(); initMagnetic(); initTilt(); initPointerDrift(); initCounters(); initScrollTop();
    loadFluidCursor();
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
