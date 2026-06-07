// components-when.jsx — shared scheduling primitives for every booking flow
// Exposes (window): PickField, WhenCard, DatePickerPanel, RecurrencePanel, whenFmt, WHEN_RECUR_DEFAULT
const { useState: useStateW } = React;

// ── Date helpers (anchored on the app's "today") ───────────────
const W_DOW  = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const W_DOW1 = ['S','M','T','W','T','F','S'];
const W_MON  = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const W_MON3 = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const W_TODAY = (() => { const n = new Date(2026, 5, 5); return new Date(n.getFullYear(), n.getMonth(), n.getDate()); })();

const wStart   = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const wAddDays = (d, n) => { const x = wStart(d); x.setDate(x.getDate() + n); return x; };
const wSame    = (a, b) => a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const wBefore  = (a, b) => wStart(a).getTime() < wStart(b).getTime();

const WHEN_RECUR_DEFAULT = { type: 'none', days: [1, 2, 3, 4, 5], endMode: 'never', count: 10 };

const whenFmt = {
  date: (d) => {
    if (wSame(d, W_TODAY)) return 'Today';
    if (wSame(d, wAddDays(W_TODAY, 1))) return 'Tomorrow';
    return `${W_DOW[d.getDay()]}, ${W_MON3[d.getMonth()]} ${d.getDate()}`;
  },
  dateFull: (d) => {
    const rel = wSame(d, W_TODAY) ? 'Today · ' : wSame(d, wAddDays(W_TODAY, 1)) ? 'Tomorrow · ' : '';
    return `${rel}${W_DOW[d.getDay()]}, ${W_MON3[d.getMonth()]} ${d.getDate()}`;
  },
  recur: (rec, d) => {
    if (!rec || rec.type === 'none') return 'Does not repeat';
    let base;
    if (rec.type === 'daily') base = 'Daily';
    else if (rec.type === 'weekday') base = 'Every weekday';
    else if (rec.type === 'weekly') base = `Weekly on ${W_DOW[d.getDay()]}`;
    else {
      const days = (rec.days || []).slice().sort((a, b) => a - b);
      if (!days.length) return 'Custom';
      base = days.length === 7 ? 'Daily' : days.map((x) => W_DOW[x].slice(0, 3)).join(' · ');
    }
    return base + (rec.endMode === 'after' ? ` · ${rec.count}×` : '');
  },
};

// ── Field row (date / repeat triggers) ─────────────────────────
function PickField({ T, icon, label, value, active, onClick, color }) {
  const c = color || T.primary;
  const ca = T.accent ? T.accent(c) : c;
  return (
    <button onClick={onClick} style={{
      width: '100%', display: 'flex', alignItems: 'center', gap: 12, height: 56, padding: '0 14px',
      borderRadius: T.rEl, cursor: 'pointer', textAlign: 'left', transition: 'all .15s',
      border: `1.5px solid ${active ? T.hexA(c, 0.6) : T.line}`,
      background: active ? T.hexA(c, T.dark ? 0.16 : 0.08) : T.surface,
    }}>
      <div style={{ width: 34, height: 34, borderRadius: 10, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: T.hexA(c, active ? (T.dark ? 0.22 : 0.13) : (T.dark ? 0.16 : 0.08)) }}>
        <Icon name={icon} size={18} color={active ? ca : c} sw={1.9} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: T.font.mono, fontSize: 9.5, letterSpacing: '.07em', textTransform: 'uppercase', color: T.ink3, fontWeight: 600 }}>{label}</div>
        <div style={{ fontFamily: T.font.ui, fontWeight: 700, fontSize: 15, color: T.ink, marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{value}</div>
      </div>
      <Icon name={active ? 'chevU' : 'chevD'} size={18} color={T.ink3} sw={2} />
    </button>
  );
}

// ── Panel shell (matches time-range picker card) ───────────────
function WhenCard({ T, title, onClose, children, style }) {
  return (
    <div style={{ background: T.surface, border: `1px solid ${T.line}`, borderRadius: T.rCard, padding: 16, boxShadow: T.shadowMd, ...style }}>
      {title && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <span style={{ fontFamily: T.font.ui, fontWeight: 700, fontSize: 15, color: T.ink }}>{title}</span>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: 999, border: 'none', background: T.hexA(T.ink, 0.05), cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="close" size={15} color={T.ink2} sw={2} />
          </button>
        </div>
      )}
      {children}
    </div>
  );
}

// ── Calendar date picker ───────────────────────────────────────
function DatePickerPanel({ T, date, onPick, onClose }) {
  const accent = T.accent ? T.accent(T.primary) : T.primary;
  const [vm, setVm] = useStateW(new Date(date.getFullYear(), date.getMonth(), 1));
  const maxMonth = new Date(W_TODAY.getFullYear(), W_TODAY.getMonth() + 4, 1); // 4 months out
  const minMonth = new Date(W_TODAY.getFullYear(), W_TODAY.getMonth(), 1);

  const first = new Date(vm.getFullYear(), vm.getMonth(), 1);
  const lead = first.getDay();
  const daysIn = new Date(vm.getFullYear(), vm.getMonth() + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < lead; i++) cells.push(null);
  for (let d = 1; d <= daysIn; d++) cells.push(new Date(vm.getFullYear(), vm.getMonth(), d));
  while (cells.length % 7 !== 0) cells.push(null);

  const canPrev = vm > minMonth;
  const canNext = vm < maxMonth;
  const navBtn = (dir, enabled) => (
    <button disabled={!enabled} onClick={() => setVm(new Date(vm.getFullYear(), vm.getMonth() + dir, 1))} style={{
      width: 32, height: 32, borderRadius: 999, border: `1px solid ${T.line}`, background: T.surface,
      cursor: enabled ? 'pointer' : 'not-allowed', opacity: enabled ? 1 : 0.4, display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <Icon name={dir < 0 ? 'chevL' : 'chevR'} size={16} color={T.ink2} sw={2} />
    </button>
  );

  const quick = [
    { label: 'Today', d: W_TODAY },
    { label: 'Tomorrow', d: wAddDays(W_TODAY, 1) },
    { label: `Next ${W_DOW[1]}`, d: wAddDays(W_TODAY, ((8 - W_TODAY.getDay()) % 7) || 7) },
  ];

  return (
    <WhenCard T={T} title="Pick a date" onClose={onClose}>
      {/* quick chips */}
      <div style={{ display: 'flex', gap: 7, marginBottom: 14, overflowX: 'auto', scrollbarWidth: 'none' }}>
        {quick.map((q) => {
          const on = wSame(q.d, date);
          return (
            <button key={q.label} onClick={() => onPick(q.d)} style={{
              flexShrink: 0, height: 32, padding: '0 13px', borderRadius: 999, cursor: 'pointer',
              border: `1.5px solid ${on ? T.hexA(T.primary, 0.6) : T.line}`,
              background: on ? T.hexA(T.primary, T.dark ? 0.18 : 0.10) : T.surface,
              color: on ? accent : T.ink2, fontFamily: T.font.ui, fontWeight: 700, fontSize: 12.5,
            }}>{q.label}</button>
          );
        })}
      </div>

      {/* month nav */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        {navBtn(-1, canPrev)}
        <span style={{ fontFamily: T.font.ui, fontWeight: 700, fontSize: 15, color: T.ink }}>{W_MON[vm.getMonth()]} {vm.getFullYear()}</span>
        {navBtn(1, canNext)}
      </div>

      {/* weekday header */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: 4 }}>
        {W_DOW1.map((d, i) => (
          <div key={i} style={{ textAlign: 'center', fontFamily: T.font.mono, fontSize: 10, color: T.ink3, fontWeight: 600, padding: '4px 0' }}>{d}</div>
        ))}
      </div>

      {/* grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
        {cells.map((c, i) => {
          if (!c) return <div key={i} />;
          const on = wSame(c, date);
          const isToday = wSame(c, W_TODAY);
          const past = wBefore(c, W_TODAY);
          return (
            <button key={i} disabled={past} onClick={() => onPick(c)} style={{
              height: 38, borderRadius: 11, border: 'none', position: 'relative',
              cursor: past ? 'not-allowed' : 'pointer',
              background: on ? T.gradient : 'transparent',
              color: on ? '#fff' : past ? T.hexA(T.ink, 0.25) : T.ink,
              fontFamily: T.font.ui, fontWeight: on ? 800 : 600, fontSize: 14, fontVariantNumeric: 'tabular-nums',
              boxShadow: on ? `0 4px 12px ${T.hexA(T.indigo, 0.32)}` : 'none', transition: 'background .12s',
            }}>
              {c.getDate()}
              {isToday && !on && <span style={{ position: 'absolute', bottom: 5, left: '50%', transform: 'translateX(-50%)', width: 4, height: 4, borderRadius: 999, background: accent }} />}
            </button>
          );
        })}
      </div>
    </WhenCard>
  );
}

// ── Recurrence picker ──────────────────────────────────────────
function RecurrencePanel({ T, recur, date, onChange, onClose }) {
  const accent = T.accent ? T.accent(T.primary) : T.primary;
  const rec = recur || WHEN_RECUR_DEFAULT;
  const set = (patch) => onChange({ ...rec, ...patch });

  const opts = [
    { id: 'none', label: 'Does not repeat', sub: 'One-time booking' },
    { id: 'daily', label: 'Daily', sub: 'Every day' },
    { id: 'weekday', label: 'Every weekday', sub: 'Monday to Friday' },
    { id: 'weekly', label: `Weekly on ${W_DOW[date.getDay()]}`, sub: 'Same day each week' },
    { id: 'custom', label: 'Custom', sub: 'Choose specific days' },
  ];

  const toggleDay = (i) => {
    const has = rec.days.includes(i);
    const days = has ? rec.days.filter((x) => x !== i) : [...rec.days, i];
    set({ days });
  };

  return (
    <WhenCard T={T} title="Repeat" onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {opts.map((o) => {
          const on = rec.type === o.id;
          return (
            <button key={o.id} onClick={() => set({ type: o.id })} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '11px 12px', borderRadius: T.rEl, cursor: 'pointer', textAlign: 'left',
              border: `1.5px solid ${on ? T.hexA(T.primary, 0.6) : T.line}`,
              background: on ? T.hexA(T.primary, T.dark ? 0.16 : 0.07) : T.surface, transition: 'all .12s',
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: T.font.ui, fontWeight: 700, fontSize: 14.5, color: on ? T.ink : T.ink2 }}>{o.label}</div>
                <div style={{ fontFamily: T.font.ui, fontSize: 12, color: T.ink3, marginTop: 1 }}>{o.sub}</div>
              </div>
              <div style={{ width: 22, height: 22, borderRadius: 999, flexShrink: 0, border: on ? `7px solid ${accent}` : `2px solid ${T.line}`, transition: 'all .15s' }} />
            </button>
          );
        })}
      </div>

      {/* custom weekday selector */}
      {rec.type === 'custom' && (
        <div style={{ marginTop: 14 }}>
          <div style={{ fontFamily: T.font.mono, fontSize: 10, letterSpacing: '.06em', textTransform: 'uppercase', color: T.ink3, fontWeight: 600, marginBottom: 9 }}>Repeat on</div>
          <div style={{ display: 'flex', gap: 6, justifyContent: 'space-between' }}>
            {W_DOW1.map((d, i) => {
              const on = rec.days.includes(i);
              return (
                <button key={i} onClick={() => toggleDay(i)} style={{
                  width: 38, height: 38, borderRadius: 999, cursor: 'pointer', flex: 1,
                  border: on ? 'none' : `1.5px solid ${T.line}`,
                  background: on ? T.gradient : T.surface,
                  color: on ? '#fff' : T.ink2, fontFamily: T.font.ui, fontWeight: 700, fontSize: 13,
                  boxShadow: on ? `0 4px 10px ${T.hexA(T.indigo, 0.28)}` : 'none', transition: 'all .12s',
                }}>{d}</button>
              );
            })}
          </div>
        </div>
      )}

      {/* end rule */}
      {rec.type !== 'none' && (
        <div style={{ marginTop: 16, paddingTop: 14, borderTop: `1px solid ${T.lineSoft}` }}>
          <div style={{ fontFamily: T.font.mono, fontSize: 10, letterSpacing: '.06em', textTransform: 'uppercase', color: T.ink3, fontWeight: 600, marginBottom: 9 }}>Ends</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Segmented T={T} options={[{ value: 'never', label: 'Never' }, { value: 'after', label: 'After' }]} value={rec.endMode} onChange={(v) => set({ endMode: v })} />
            {rec.endMode === 'after' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 'auto' }}>
                <button onClick={() => set({ count: Math.max(2, rec.count - 1) })} style={{ width: 32, height: 32, borderRadius: 999, border: `1px solid ${T.line}`, background: T.surface, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="chevD" size={15} color={T.ink2} sw={2.2} style={{ transform: 'rotate(90deg)' }} />
                </button>
                <span style={{ minWidth: 60, textAlign: 'center', fontFamily: T.font.ui, fontWeight: 700, fontSize: 14, color: T.ink }}>{rec.count} times</span>
                <button onClick={() => set({ count: Math.min(60, rec.count + 1) })} style={{ width: 32, height: 32, borderRadius: 999, border: `1px solid ${T.line}`, background: T.surface, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="chevD" size={15} color={T.ink2} sw={2.2} style={{ transform: 'rotate(-90deg)' }} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </WhenCard>
  );
}

Object.assign(window, { PickField, WhenCard, DatePickerPanel, RecurrencePanel, whenFmt, WHEN_RECUR_DEFAULT, W_TODAY });
