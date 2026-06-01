/* =========================================================================
   Lightweight Tweaks panel (vanilla) — host-protocol wired
   Usage:
     mountTweaks({
       defaults: TWEAKS,            // object (also the EDITMODE JSON block)
       apply: (state) => {...},     // apply values live to the page
       schema: [
         {key, type:'slider', label, min, max, step, unit},
         {key, type:'segment', label, options:[{label,value}]}
       ]
     });
   ========================================================================= */
(function(){
  'use strict';
  window.mountTweaks = function(opts){
    const state = opts.defaults || {};
    const apply = opts.apply || function(){};
    const schema = opts.schema || [];

    const panel = document.createElement('div');
    panel.className = 'tweaks-panel';
    panel.setAttribute('aria-hidden', 'true');
    panel.innerHTML =
      '<div class="tweaks-panel__head"><span>Tweaks</span>' +
      '<button class="tweaks-panel__close" aria-label="Close tweaks">\u2715</button></div>' +
      '<div class="tweaks-panel__body"></div>';
    const body = panel.querySelector('.tweaks-panel__body');

    function persist(edits){
      try { window.parent.postMessage({ type:'__edit_mode_set_keys', edits }, '*'); } catch(e){}
    }

    schema.forEach(ctrl => {
      const wrap = document.createElement('div');
      wrap.className = 'tw-ctrl';
      if(ctrl.type === 'slider'){
        wrap.innerHTML = '<label>' + ctrl.label + ' <b></b></label>' +
          '<input type="range" min="'+ctrl.min+'" max="'+ctrl.max+'" step="'+(ctrl.step||1)+'">';
        const input = wrap.querySelector('input');
        const val = wrap.querySelector('b');
        input.value = state[ctrl.key];
        val.textContent = state[ctrl.key] + (ctrl.unit || '');
        input.addEventListener('input', () => {
          const v = parseFloat(input.value);
          state[ctrl.key] = v;
          val.textContent = v + (ctrl.unit || '');
          apply(state);
          persist({ [ctrl.key]: v });
        });
      } else if(ctrl.type === 'segment'){
        wrap.innerHTML = '<label>' + ctrl.label + '</label><div class="tw-seg"></div>';
        const seg = wrap.querySelector('.tw-seg');
        ctrl.options.forEach(o => {
          const b = document.createElement('button');
          b.type = 'button'; b.textContent = o.label;
          if(state[ctrl.key] === o.value) b.classList.add('on');
          b.addEventListener('click', () => {
            state[ctrl.key] = o.value;
            seg.querySelectorAll('button').forEach(x => x.classList.remove('on'));
            b.classList.add('on');
            apply(state);
            persist({ [ctrl.key]: o.value });
          });
          seg.appendChild(b);
        });
      }
      body.appendChild(wrap);
    });

    document.body.appendChild(panel);

    const show = () => { panel.classList.add('open'); panel.setAttribute('aria-hidden','false'); };
    const hide = () => { panel.classList.remove('open'); panel.setAttribute('aria-hidden','true'); };

    // 1) listener BEFORE announcing availability
    window.addEventListener('message', (e) => {
      const d = e.data || {};
      if(d.type === '__activate_edit_mode') show();
      else if(d.type === '__deactivate_edit_mode') hide();
    });
    panel.querySelector('.tweaks-panel__close').addEventListener('click', () => {
      hide();
      try { window.parent.postMessage({ type:'__edit_mode_dismissed' }, '*'); } catch(e){}
    });

    // 2) announce — makes the toolbar Tweaks toggle appear
    try { window.parent.postMessage({ type:'__edit_mode_available' }, '*'); } catch(e){}

    // apply persisted defaults on load
    apply(state);
  };
})();
