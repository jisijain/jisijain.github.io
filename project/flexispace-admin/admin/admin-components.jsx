// admin-components.jsx — admin shell primitives (nav, panels, KPI, tables)
// Reuses window.Icon/Avatar/Donut from app/components.jsx
// Exposes (window): Ic, Panel, PanelHead, KpiCard, SubStat, NavRail, TopBar,
//   StatusPill, AlertRow, ActivityRow, ThemeToggle, Seg

const EXTRA_ICONS = {
  building: 'M4 21V5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v16M15 21V9h4a1 1 0 0 1 1 1v11M3 21h18M7.5 8h3M7.5 12h3M7.5 16h3',
  download: 'M12 4v11m0 0 4-4m-4 4-4-4M5 19h14',
  sun:      'M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10ZM12 2v2m0 16v2M4 12H2m20 0h-2M5.6 5.6 4.2 4.2m15.6 1.4 1.4-1.4M5.6 18.4l-1.4 1.4m15.6-1.4 1.4 1.4',
  moon:     'M20 14.5A8 8 0 0 1 9.5 4 7 7 0 1 0 20 14.5Z',
  logout:   'M15 4h3a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-3M10 8l-4 4 4 4M6 12h11',
  alert:    'M12 4 2.5 20.5h19L12 4Zm0 6v4m0 3.5h.01',
  dots:     'M6 12h.01M12 12h.01M18 12h.01',
  cmd:      'M9 6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6Z',
  pulse:    'M3 12h4l2-6 4 14 2-8h6',
  gauge:    'M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm1.4-1.4L17 9M5.5 19a9 9 0 1 1 13 0',
  flag:     'M5 21V4m0 0 4.5 2 4-1.5 4.5 2v8l-4.5-2-4 1.5L5 13',
  link:     'M9 15l6-6M10 6l1-1a4 4 0 0 1 6 6l-1 1M14 18l-1 1a4 4 0 0 1-6-6l1-1',
};

function Ic({ name, size = 20, color = 'currentColor', sw = 1.8, style }) {
  if (EXTRA_ICONS[name]) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, display: 'block', ...style }}>
        <path d={EXTRA_ICONS[name]} stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return <Icon name={name} size={size} color={color} sw={sw} style={style} />;
}

// ── Generic panel (admin card) ─────────────────────────────────
function Panel({ T, children, style, pad = 20, span }) {
  return (
    <div style={{
      background: T.surface, borderRadius: T.rCard, padding: pad,
      border: `1px solid ${T.dark ? T.borderColor : T.lineSoft}`,
      boxShadow: T.dark ? 'none' : T.shadowSm,
      gridColumn: span ? `span ${span}` : undefined,
      minWidth: 0, boxSizing: 'border-box', ...style,
    }}>{children}</div>
  );
}

function PanelHead({ T, title, sub, right, icon, color }) {
  const c = color ? cKey(T, color) : T.ink;
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
        {icon && (
          <div style={{ width: 32, height: 32, borderRadius: 9, background: T.hexA(c, T.dark ? 0.2 : 0.12), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Ic name={icon} size={18} color={T.accent ? T.accent(c) : c} sw={1.9} />
          </div>
        )}
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: T.font.ui, fontWeight: 700, fontSize: 16, color: T.ink, letterSpacing: '-.01em' }}>{title}</div>
          {sub && <div style={{ fontFamily: T.font.ui, fontSize: 12.5, color: T.ink3, marginTop: 2 }}>{sub}</div>}
        </div>
      </div>
      {right}
    </div>
  );
}

// ── KPI card ───────────────────────────────────────────────────
function KpiCard({ T, k }) {
  const c = cKey(T, k.color);
  const up = k.dir === 'up';
  const positive = up === k.good;
  const deltaC = positive ? cKey(T, 'avail') : cKey(T, 'crit');
  return (
    <Panel T={T} pad={18} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: T.hexA(c, T.dark ? 0.2 : 0.12), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Ic name={k.icon} size={19} color={T.accent ? T.accent(c) : c} sw={2} />
          </div>
          <span style={{ fontFamily: T.font.ui, fontWeight: 600, fontSize: 13, color: T.ink2 }}>{k.label}</span>
        </div>
        <LineMini T={T} data={k.spark} color={k.color} width={64} height={24} />
      </div>
      <div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span style={{ fontFamily: T.font.ui, fontWeight: 800, fontSize: 34, color: T.ink, letterSpacing: '-.03em', lineHeight: 1 }}>{k.value}<span style={{ fontSize: 18, fontWeight: 700, color: T.ink2 }}>{k.unit}</span></span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2, fontFamily: T.font.ui, fontWeight: 700, fontSize: 12.5, color: deltaC, background: T.hexA(deltaC, T.dark ? 0.18 : 0.12), padding: '2px 7px', borderRadius: 999 }}>
            <Icon name={up ? 'chevU' : 'chevD'} size={13} color={deltaC} sw={2.4} />{k.delta}{k.unit}
          </span>
        </div>
        <div style={{ fontFamily: T.font.ui, fontSize: 12.5, color: T.ink3, marginTop: 6 }}>{k.sub}</div>
      </div>
    </Panel>
  );
}

// ── Secondary stat ─────────────────────────────────────────────
function SubStat({ T, s }) {
  const c = s.warn ? cKey(T, 'warn') : T.ink2;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '4px 0' }}>
      <div style={{ width: 38, height: 38, borderRadius: 11, background: T.hexA(s.warn ? cKey(T, 'warn') : T.primary, T.dark ? 0.16 : 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Ic name={s.icon} size={19} color={s.warn ? cKey(T, 'warn') : (T.accent ? T.accent(T.primary) : T.primary)} sw={1.9} />
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span style={{ fontFamily: T.font.ui, fontWeight: 700, fontSize: 19, color: T.ink, letterSpacing: '-.01em', whiteSpace: 'nowrap' }}>{s.value}</span>
          <span style={{ fontFamily: T.font.ui, fontSize: 12.5, color: T.ink2, fontWeight: 600 }}>{s.label}</span>
        </div>
        <div style={{ fontFamily: T.font.ui, fontSize: 11.5, color: T.ink3, marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.hint}</div>
      </div>
    </div>
  );
}

// ── Status pill ────────────────────────────────────────────────
const STATUS_STYLE = {
  'checked-in': { key: 'avail', label: 'Checked in' },
  'confirmed':  { key: 'indigo', label: 'Confirmed' },
  'no-show':    { key: 'crit', label: 'No-show' },
  'open':       { key: 'avail', label: 'Open' },
  'pending':    { key: 'warn', label: 'Pending' },
};
function StatusPill({ T, status, label }) {
  const m = STATUS_STYLE[status] || { key: 'teal', label: status };
  const c = cKey(T, m.key);
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 999, background: T.hexA(c, T.dark ? 0.18 : 0.12), fontFamily: T.font.ui, fontWeight: 600, fontSize: 12, color: T.accent ? T.accent(c) : c, whiteSpace: 'nowrap' }}>
      <span style={{ width: 6, height: 6, borderRadius: 999, background: c }} />{label || m.label}
    </span>
  );
}

// ── Alert row ──────────────────────────────────────────────────
function AlertRow({ T, a, last }) {
  const sev = { crit: 'crit', warn: 'warn', info: 'indigo' }[a.sev] || 'teal';
  const c = cKey(T, sev);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '13px 0', borderBottom: last ? 'none' : `1px solid ${T.lineSoft}` }}>
      <div style={{ width: 38, height: 38, borderRadius: 11, background: T.hexA(c, T.dark ? 0.18 : 0.12), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Ic name={a.icon} size={19} color={c} sw={1.9} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: T.font.ui, fontWeight: 600, fontSize: 13.5, color: T.ink, lineHeight: 1.3 }}>{a.title}</div>
        <div style={{ fontFamily: T.font.ui, fontSize: 12, color: T.ink3, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.sub}</div>
      </div>
      <button style={{ flexShrink: 0, padding: '7px 13px', borderRadius: T.rPill, border: `1px solid ${T.line}`, background: 'transparent', cursor: 'pointer', fontFamily: T.font.ui, fontWeight: 600, fontSize: 12.5, color: T.ink }}>{a.action}</button>
    </div>
  );
}

// ── Activity row (table) ───────────────────────────────────────
function ActivityRow({ T, a, last }) {
  const p = window.PEOPLE.find((x) => x.id === a.who) || window.PEOPLE[0];
  const tIcon = { desk: 'chair', room: 'room', park: 'car' }[a.type];
  const tColor = { desk: T.teal, room: T.indigo, park: T.electric }[a.type];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1.4fr 0.9fr 0.7fr 1fr', alignItems: 'center', gap: 10, padding: '12px 0', borderBottom: last ? 'none' : `1px solid ${T.lineSoft}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
        <Avatar person={p} size={32} T={T} />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: T.font.ui, fontWeight: 600, fontSize: 13.5, color: T.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
          <div style={{ fontFamily: T.font.ui, fontSize: 11.5, color: T.ink3 }}>{p.team}</div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
        <div style={{ width: 26, height: 26, borderRadius: 8, background: T.hexA(tColor, T.dark ? 0.2 : 0.12), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Ic name={tIcon} size={15} color={T.accent ? T.accent(tColor) : tColor} sw={1.9} />
        </div>
        <span style={{ fontFamily: T.font.ui, fontWeight: 600, fontSize: 13, color: T.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.resource}</span>
      </div>
      <span style={{ fontFamily: T.font.ui, fontSize: 12.5, color: T.ink2 }}>{a.floor}</span>
      <span style={{ fontFamily: T.font.mono, fontSize: 12.5, color: T.ink2 }}>{a.time}</span>
      <div style={{ justifySelf: 'start' }}><StatusPill T={T} status={a.status} /></div>
    </div>
  );
}

// ── Theme toggle (light/dark) ──────────────────────────────────
function ThemeToggle({ T, mode, onChange }) {
  return (
    <div style={{ display: 'flex', background: T.hexA(T.ink, 0.05), borderRadius: 999, padding: 3, gap: 2, border: `1px solid ${T.line}` }}>
      {[['light', 'sun'], ['dark', 'moon']].map(([m, icon]) => {
        const on = mode === m;
        return (
          <button key={m} onClick={() => onChange(m)} aria-label={m} style={{
            width: 32, height: 30, borderRadius: 999, border: 'none', cursor: 'pointer',
            background: on ? T.surface : 'transparent', boxShadow: on ? T.shadowSm : 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .18s',
          }}>
            <Ic name={icon} size={16} color={on ? T.primary : T.ink3} sw={2} />
          </button>
        );
      })}
    </div>
  );
}

// ── Tab segments (admin) ───────────────────────────────────────
function Seg({ T, options, value, onChange }) {
  return (
    <div style={{ display: 'inline-flex', background: T.hexA(T.ink, 0.05), borderRadius: T.rPill === 999 ? 999 : T.rEl, padding: 3, gap: 2 }}>
      {options.map((o) => {
        const v = typeof o === 'string' ? o : o.value;
        const lbl = typeof o === 'string' ? o : o.label;
        const on = v === value;
        return (
          <button key={v} onClick={() => onChange(v)} style={{
            padding: '7px 13px', borderRadius: T.rPill === 999 ? 999 : T.rEl - 2, border: 'none', cursor: 'pointer',
            fontFamily: T.font.ui, fontWeight: 600, fontSize: 12.5, whiteSpace: 'nowrap',
            background: on ? T.surface : 'transparent', color: on ? T.ink : T.ink3, boxShadow: on ? T.shadowSm : 'none', transition: 'all .15s',
          }}>{lbl}</button>
        );
      })}
    </div>
  );
}

Object.assign(window, { Ic, EXTRA_ICONS, Panel, PanelHead, KpiCard, SubStat, StatusPill, AlertRow, ActivityRow, ThemeToggle, Seg });
