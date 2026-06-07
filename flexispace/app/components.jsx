// components.jsx — FlexiSpace shared primitives + line-icon set
// Exposes (window): Icon, Avatar, Card, Chip, Btn, IconBtn, StatusDot, Sheet,
//   Segmented, Toggle, SearchBar, SectionLabel, Stat, Sparkbars, Amen, Donut

// ── Icon set (1.8 stroke, currentColor) ────────────────────────
const ICONS = {
  home:    'M3 11.5 12 4l9 7.5M5.5 10v9.5h13V10',
  map:    'M9 4 3.5 6v14L9 18l6 2 5.5-2V4L15 6 9 4Zm0 0v14m6-12v14',
  calendar:'M4 8h16M7 4v3m10-3v3M5.5 5.5h13A1.5 1.5 0 0 1 20 7v12a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 19V7a1.5 1.5 0 0 1 1.5-1.5Z',
  user:    'M12 12.5a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM5 20c.6-3.6 3.4-5.5 7-5.5s6.4 1.9 7 5.5',
  bell:    'M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6Zm4 10a2 2 0 0 0 4 0',
  desk:    'M4 7h16M5 7v4h14V7M7 11v6m10-6v6M4 11h16',
  chair:   'M7 4v7h10V4M6 11h12v3H6zM8 14v6m8-6v6',
  room:    'M4 20V6l8-2 8 2v14M4 20h16M9 20v-5h6v5M8 9h.01M8 13h.01',
  parking: 'M6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm3.5 13V7h4a3 3 0 0 1 0 6h-4',
  car:     'M5 16.5h14M6.5 16.5v2m11-2v2M5.5 12l1.4-4.2A2 2 0 0 1 8.8 6.4h6.4a2 2 0 0 1 1.9 1.4L18.5 12M5 12h14a1 1 0 0 1 1 1v2.5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V13a1 1 0 0 1 1-1Zm2.5 2.2h.01m8.99 0h.01',
  bike:    'M2.5 16.5a3 3 0 1 0 6 0 3 3 0 1 0 -6 0M15.5 16.5a3 3 0 1 0 6 0 3 3 0 1 0 -6 0M5.5 16.5l3-5.5h5l3 5.5M8.5 11h5M14.5 8h2.5l1.3 4.5',
  search:  'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Zm5-2 4.5 4.5',
  filter:  'M4 6h16M7 12h10M10 18h4',
  chevR:   'M9 6l6 6-6 6',
  chevL:   'M15 6l-6 6 6 6',
  chevD:   'M6 9l6 6 6-6',
  chevU:   'M6 15l6-6 6 6',
  plus:    'M12 5v14M5 12h14',
  check:   'M5 12.5 10 17l9-10',
  clock:   'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-14v5l3.5 2',
  pin:     'M12 21s7-5.5 7-11A7 7 0 0 0 5 10c0 5.5 7 11 7 11Zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z',
  nav:     'M3 11l18-7-7 18-2.5-7.5L3 11Z',
  wifi:    'M2.5 9.5a14 14 0 0 1 19 0M5.5 13a9 9 0 0 1 13 0M8.5 16.5a4.5 4.5 0 0 1 7 0M12 20h.01',
  ac:      'M12 3v18M3 12h18M6 6l12 12M18 6 6 18',
  projector:'M4 8h16a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Zm12 4h2M7 16v2m10-2v2M7 12a2 2 0 1 0 0 .01',
  monitor: 'M4 5h16a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1ZM9 20h6m-3-4v4',
  dual:    'M3 6h8v7H3zM13 6h8v7h-8M6 13v2m11-2v2M4 17h5m6 0h5',
  whiteboard:'M4 5h16v11H4zM12 5V3M8 16l-1.5 3m11-3 1.5 3M8.5 11l2-2.5 2 2 2.5-3',
  video:   'M4 7h11a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1Zm12 3.5 5-3v9l-5-3',
  ev:      'M13 3 5 13h6l-1 8 8-10h-6l1-8Z',
  a11y:    'M12 5.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM6 8l6 1 6-1M12 9v4m0 0-3 7m3-7 3 7',
  edit:    'M4 20h4L19 9l-4-4L4 16v4ZM14 6l4 4',
  close:   'M6 6l12 12M18 6 6 18',
  arrowR:  'M5 12h14M13 6l6 6-6 6',
  extend:  'M12 8v8m0-8L9 11m3-3 3 3M5 4h14M5 20h14',
  star:    'M12 4l2.4 5 5.6.6-4 4 1 5.4-5-2.6L7 22l1-5.4-4-4 5.6-.6L12 4Z',
  spark:   'M12 3l1.8 5.4L19 10l-5.2 1.6L12 17l-1.8-5.4L5 10l5.2-1.6L12 3Z',
  layers:  'M12 3 3 8l9 5 9-5-9-5ZM3 13l9 5 9-5M3 16.5l9 5 9-5',
  heat:    'M12 3c2 3 5 4.5 5 8a5 5 0 0 1-10 0c0-1.5.6-2.8 1.5-3.8',
  walk:    'M13 4.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM11 22l1.5-7L10 12V8l4 1 2 3M9 22l2-5',
  coffee:  'M5 9h11v5a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V9Zm11 1h2a2 2 0 0 1 0 4h-2M8 5V3m3 2V3',
  wc:      'M7 4a1.5 1.5 0 1 0 0-.01M17 4a1.5 1.5 0 1 0 0-.01M5.5 20v-5H4l1.5-5h3L10 15H8.5v5M15 20v-4m4 4v-4m-4 0 1-6h2l1 6M12 6v14',
  door:    'M6 21V4a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v17M6 21h12M6 21H4m12 0h4m-7-9h.01',
  team:    'M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm7 0a2.5 2.5 0 1 0 0-5M3 19c.5-3 3-4.5 6-4.5s5.5 1.5 6 4.5m1-4c2 .2 3.6 1.4 4 4',
  sliders: 'M4 7h10m4 0h2M4 12h2m4 0h10M4 17h13m4 0h0M14 5v4m-8 1v4m11 1v4',
  grid:    'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  list:    'M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01',
  refresh: 'M4 12a8 8 0 0 1 14-5l2 2M20 12a8 8 0 0 1-14 5l-2-2M18 4v5h-5M6 20v-5h5',
  shield:  'M12 3 5 6v5c0 5 3 7.5 7 9 4-1.5 7-4 7-9V6l-7-3Zm-2.5 8.5L11 13l3.5-4',
  trend:   'M4 16l5-5 4 3 7-8M21 6v5m0-5h-5',
};

function Icon({ name, size = 22, color = 'currentColor', sw = 1.8, style }) {
  const d = ICONS[name];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, display: 'block', ...style }}>
      <path d={d} stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Avatar ─────────────────────────────────────────────────────
function Avatar({ person, size = 34, ring, T, dim }) {
  const team = (window.TEAMS || {})[person?.team] || { color: '#64748B' };
  const c = team.color;
  const dark = T && T.dark;
  const acc = (T && T.accent) ? T.accent(c) : c;
  const ringGap = (T && T.surface) ? T.surface : '#fff';
  return (
    <div style={{
      width: size, height: size, borderRadius: 999, flexShrink: 0,
      background: dim ? (dark ? '#222C3A' : '#E7ECF1') : window.hexA(c, dark ? 0.24 : 0.14),
      color: dim ? (dark ? '#7E8A98' : '#9AA6B2') : acc,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: (T||{font:{ui:'sans-serif'}}).font.ui, fontWeight: 700, fontSize: size * 0.36,
      boxShadow: ring ? `0 0 0 2px ${ringGap}, 0 0 0 ${2 + (ring===true?2:ring)}px ${c}` : 'none',
      border: dim ? `1px solid ${dark ? '#2C3645' : '#DDE3E9'}` : 'none',
      letterSpacing: '.01em',
    }}>{person?.init}</div>
  );
}

// ── Card ───────────────────────────────────────────────────────
function Card({ T, children, style, pad = 16, onClick, elevate, flat }) {
  return (
    <div onClick={onClick} style={{
      background: T.surface, borderRadius: T.rCard, padding: pad,
      boxShadow: flat ? 'none' : (elevate ? T.shadowMd : T.shadowSm),
      border: T.border ? `1px solid ${T.borderColor}` : (flat ? `1px solid ${T.lineSoft}` : 'none'),
      cursor: onClick ? 'pointer' : 'default', boxSizing: 'border-box',
      ...style,
    }}>{children}</div>
  );
}

// ── Chip ───────────────────────────────────────────────────────
function Chip({ T, children, active, onClick, color, icon, size = 'md' }) {
  const c = color || T.primary;
  const ca = T.accent ? T.accent(c) : c;
  const py = size === 'sm' ? 5 : 8;
  return (
    <button onClick={onClick} style={{
      display: 'inline-flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap',
      padding: `${py}px ${size==='sm'?10:13}px`, borderRadius: T.rPill,
      fontFamily: T.font.ui, fontWeight: 600, fontSize: size==='sm'?12.5:13.5,
      border: active ? `1.5px solid ${T.hexA(ca, 0.9)}` : `1.5px solid ${T.line}`,
      background: active ? T.hexA(c, T.dark ? 0.18 : 0.10) : T.surface,
      color: active ? ca : T.ink2, cursor: 'pointer', transition: 'all .15s',
    }}>
      {icon && <Icon name={icon} size={15} color={active ? ca : T.ink3} sw={2} />}
      {children}
    </button>
  );
}

// ── Buttons ────────────────────────────────────────────────────
function Btn({ T, children, kind = 'primary', onClick, full, icon, iconR, size = 'md', disabled }) {
  const h = size === 'lg' ? 54 : size === 'sm' ? 38 : 46;
  const base = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    height: h, padding: `0 ${size==='lg'?22:18}px`, width: full ? '100%' : undefined,
    borderRadius: size==='lg' ? T.rEl + 4 : T.rEl, fontFamily: T.font.ui,
    fontWeight: 700, fontSize: size==='lg'?17:15, cursor: disabled?'not-allowed':'pointer',
    border: 'none', transition: 'all .15s', letterSpacing: '.01em', opacity: disabled?0.5:1,
  };
  const kinds = {
    primary:   { background: T.primary, color: '#fff', boxShadow: `0 6px 16px ${T.hexA(T.primary,0.30)}` },
    gradient:  { background: T.gradient, color: '#fff', boxShadow: `0 8px 20px ${T.hexA(T.indigo,0.28)}` },
    soft:      { background: T.hexA(T.primary,0.12), color: T.tealDeep },
    ghost:     { background: T.surface, color: T.ink, border: `1.5px solid ${T.line}` },
    dark:      { background: T.ink, color: '#fff' },
    danger:    { background: '#FCE8E8', color: '#D7263D' },
  };
  return (
    <button onClick={disabled?undefined:onClick} style={{ ...base, ...kinds[kind] }}>
      {icon && <Icon name={icon} size={size==='lg'?20:18} sw={2.1} />}
      {children}
      {iconR && <Icon name={iconR} size={size==='lg'?20:18} sw={2.1} />}
    </button>
  );
}

function IconBtn({ T, name, onClick, size = 40, badge, color, bg, active }) {
  return (
    <button onClick={onClick} style={{
      width: size, height: size, borderRadius: T.rPill === 999 ? 999 : T.rEl,
      background: bg || (active ? T.hexA(T.primary,0.12) : T.surface),
      border: bg ? 'none' : `1px solid ${T.line}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
      position: 'relative', flexShrink: 0, boxShadow: bg ? 'none' : T.shadowSm,
    }}>
      <Icon name={name} size={size*0.5} color={color || (active?T.primary:T.ink)} sw={1.9} />
      {badge && <span style={{ position: 'absolute', top: 7, right: 8, width: 8, height: 8, borderRadius: 999, background: '#F43F5E', border: '1.5px solid #fff' }} />}
    </button>
  );
}

// ── Status dot ─────────────────────────────────────────────────
function StatusDot({ T, status, size = 9 }) {
  const s = T.seatSystem.states[status] || T.seatSystem.states.available;
  return <span style={{ width: size, height: size, borderRadius: 999, background: s.dot, flexShrink: 0, display: 'inline-block' }} />;
}

// ── Bottom sheet ───────────────────────────────────────────────
function Sheet({ T, open, onClose, children, title, height = 'auto', tall }) {
  return (
    <>
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0, background: 'rgba(14,23,38,0.42)',
        opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none',
        transition: 'opacity .28s', zIndex: 80, backdropFilter: open?'blur(2px)':'none',
      }} />
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 81,
        background: T.surface, borderRadius: `${T.rCard+6}px ${T.rCard+6}px 0 0`,
        transform: open ? 'translateY(0)' : 'translateY(110%)',
        transition: 'transform .34s cubic-bezier(.32,.72,0,1)',
        boxShadow: '0 -10px 40px rgba(14,23,38,0.18)',
        maxHeight: tall ? '92%' : '85%', display: 'flex', flexDirection: 'column',
        paddingBottom: 'calc(env(safe-area-inset-bottom, 0px))',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 10 }}>
          <div style={{ width: 40, height: 5, borderRadius: 999, background: T.line }} />
        </div>
        {title && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px 6px' }}>
            <div style={{ fontFamily: T.font.ui, fontWeight: 700, fontSize: 19, color: T.ink }}>{title}</div>
            <IconBtn T={T} name="close" size={32} onClick={onClose} />
          </div>
        )}
        <div style={{ overflowY: 'auto', padding: title ? '4px 20px 22px' : '8px 20px 22px', WebkitOverflowScrolling: 'touch' }}>{children}</div>
      </div>
    </>
  );
}

// ── Segmented control ──────────────────────────────────────────
function Segmented({ T, options, value, onChange, full }) {
  return (
    <div style={{
      display: 'flex', background: T.hexA(T.ink, 0.05), borderRadius: T.rPill === 999 ? 999 : T.rEl,
      padding: 4, gap: 2, width: full ? '100%' : undefined,
    }}>
      {options.map(o => {
        const v = typeof o === 'string' ? o : o.value;
        const lbl = typeof o === 'string' ? o : o.label;
        const on = v === value;
        return (
          <button key={v} onClick={() => onChange(v)} style={{
            flex: full ? 1 : undefined, padding: '8px 14px', borderRadius: T.rPill === 999 ? 999 : T.rEl - 2,
            border: 'none', cursor: 'pointer', fontFamily: T.font.ui, fontWeight: 600, fontSize: 13.5,
            background: on ? T.surface : 'transparent', color: on ? T.ink : T.ink3,
            boxShadow: on ? T.shadowSm : 'none', transition: 'all .18s', whiteSpace: 'nowrap',
          }}>{lbl}</button>
        );
      })}
    </div>
  );
}

// ── Toggle ─────────────────────────────────────────────────────
function Toggle({ T, on, onChange }) {
  return (
    <button onClick={() => onChange(!on)} style={{
      width: 50, height: 30, borderRadius: 999, border: 'none', cursor: 'pointer',
      background: on ? T.primary : '#D2D9E0', position: 'relative', transition: 'background .2s', flexShrink: 0,
    }}>
      <span style={{
        position: 'absolute', top: 3, left: on ? 23 : 3, width: 24, height: 24, borderRadius: 999,
        background: '#fff', transition: 'left .2s', boxShadow: '0 1px 3px rgba(0,0,0,.2)',
      }} />
    </button>
  );
}

// ── Search bar ─────────────────────────────────────────────────
function SearchBar({ T, value, onChange, placeholder, onFocus }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10, height: 46, padding: '0 14px',
      background: T.hexA(T.ink, 0.045), borderRadius: T.rPill === 999 ? 999 : T.rEl,
      border: T.border ? `1px solid ${T.borderColor}` : 'none',
    }}>
      <Icon name="search" size={19} color={T.ink3} sw={2} />
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} onFocus={onFocus} style={{
        flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: T.font.ui,
        fontSize: 15, color: T.ink, fontWeight: 500,
      }} />
    </div>
  );
}

// ── Section label ──────────────────────────────────────────────
function SectionLabel({ T, children, action, onAction }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', margin: '0 0 11px' }}>
      <div style={{ fontFamily: T.font.ui, fontWeight: 700, fontSize: 17.5, color: T.ink, letterSpacing: '-.01em' }}>{children}</div>
      {action && <button onClick={onAction} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: T.font.ui, fontWeight: 600, fontSize: 13.5, color: T.link || T.primary }}>{action}</button>}
    </div>
  );
}

// ── Stat tile ──────────────────────────────────────────────────
function Stat({ T, value, total, label, icon, color }) {
  const c = color || T.primary;
  const pct = total ? Math.round((value / total) * 100) : 0;
  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 7 }}>
        <Icon name={icon} size={16} color={T.accent ? T.accent(c) : c} sw={2} />
        <span style={{ fontFamily: T.font.mono, fontSize: 11, color: T.ink3, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.04em' }}>{label}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <span style={{ fontFamily: T.font.ui, fontWeight: 700, fontSize: 25, color: T.ink, letterSpacing: '-.02em' }}>{value}</span>
        <span style={{ fontFamily: T.font.ui, fontSize: 13, color: T.ink3, fontWeight: 500 }}>/{total}</span>
      </div>
      <div style={{ height: 5, borderRadius: 999, background: T.hexA(c, 0.14), marginTop: 7, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: c, borderRadius: 999 }} />
      </div>
    </div>
  );
}

// ── Sparkbars (occupancy by hour) ──────────────────────────────
function Sparkbars({ T, data, color, height = 38 }) {
  const max = Math.max(...data);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height }}>
      {data.map((v, i) => (
        <div key={i} style={{ flex: 1, height: `${(v/max)*100}%`, minHeight: 3, background: i === data.indexOf(max) ? color : T.hexA(color, 0.30), borderRadius: 3 }} />
      ))}
    </div>
  );
}

// ── Donut ──────────────────────────────────────────────────────
function Donut({ T, pct, size = 56, color, track, label, sub }) {
  const r = (size - 8) / 2, C = 2 * Math.PI * r;
  const c = color || T.primary;
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={track || T.hexA(c,0.14)} strokeWidth="6" />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={c} strokeWidth="6" strokeLinecap="round" strokeDasharray={`${C*pct} ${C}`} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontFamily: T.font.ui, fontWeight: 700, fontSize: size*0.26, color: T.ink, lineHeight: 1 }}>{label}</span>
        {sub && <span style={{ fontFamily: T.font.ui, fontSize: 9, color: T.ink3 }}>{sub}</span>}
      </div>
    </div>
  );
}

// ── Amenity row ────────────────────────────────────────────────
function Amen({ T, items, size = 'md' }) {
  return (
    <div style={{ display: 'flex', gap: size==='sm'?6:8, flexWrap: 'wrap' }}>
      {items.map(a => {
        const meta = (window.AMENITIES||{})[a] || { label: a };
        return (
          <div key={a} style={{
            display: 'inline-flex', alignItems: 'center', gap: 5, padding: size==='sm'?'4px 8px':'6px 10px',
            borderRadius: T.rEl - 2, background: T.hexA(T.ink, 0.045), fontFamily: T.font.ui, fontWeight: 600,
            fontSize: size==='sm'?11.5:12.5, color: T.ink2,
          }}>
            <Icon name={a} size={size==='sm'?13:15} color={T.ink2} sw={1.9} />
            {meta.label}
          </div>
        );
      })}
    </div>
  );
}

Object.assign(window, { Icon, Avatar, Card, Chip, Btn, IconBtn, StatusDot, Sheet, Segmented, Toggle, SearchBar, SectionLabel, Stat, Sparkbars, Donut, Amen });
