// screens-desk.jsx — Desk discovery, filters, smart suggestions, seat detail
// Exposes (window): DeskScreen, DeskDetail, Photo, TimeField

const { useState: useStateD } = React;

// photo tile — renders a real image when `src` is given, else a striped placeholder
function Photo({ T, label, h = 150, r, accent, src }) {
  const c = accent || T.ink3;
  if (src) {
    return (
      <div style={{ height: h, borderRadius: r ?? T.rEl, overflow: 'hidden', position: 'relative', background: T.hexA(c, 0.06) }}>
        <img src={src} alt={label} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      </div>
    );
  }
  return (
    <div style={{ height: h, borderRadius: r ?? T.rEl, overflow: 'hidden', position: 'relative', background: `repeating-linear-gradient(135deg, ${T.hexA(c,0.07)} 0 10px, ${T.hexA(c,0.03)} 10px 20px)`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px dashed ${T.hexA(c,0.3)}` }}>
      <span style={{ fontFamily: T.font.mono, fontSize: 10.5, color: T.hexA(c,0.85), textTransform: 'uppercase', letterSpacing: '.06em' }}>{label}</span>
    </div>
  );
}

// ── Time helpers + editable time field ─────────────────────────
const TIME_OPTIONS = (() => {
  const out = [];
  for (let m = 7 * 60; m <= 21 * 60; m += 30) {
    const h = Math.floor(m / 60), mm = m % 60;
    const ap = h >= 12 ? 'PM' : 'AM';
    const h12 = ((h + 11) % 12) + 1;
    out.push(`${String(h12).padStart(2, '0')}:${String(mm).padStart(2, '0')} ${ap}`);
  }
  return out;
})();
const toMin = (s) => { const m = String(s).match(/(\d+):(\d+)\s*(AM|PM)/i); if (!m) return 0; let h = (+m[1]) % 12; if (/PM/i.test(m[3])) h += 12; return h * 60 + (+m[2]); };
const fmtDur = (a, b) => { const d = Math.max(0, toMin(b) - toMin(a)); const h = Math.floor(d / 60), mm = d % 60; return `${h}h${mm ? ` ${mm}m` : ''}`; };
const fmtMin = (m) => { const h = Math.floor(m / 60), mm = m % 60; const ap = h >= 12 ? 'PM' : 'AM'; const h12 = ((h + 11) % 12) + 1; return `${String(h12).padStart(2, '0')}:${String(mm).padStart(2, '0')} ${ap}`; };
const fmtHour = (m) => { const h = Math.floor(m / 60); const ap = h >= 12 ? 'p' : 'a'; const h12 = ((h + 11) % 12) + 1; return `${h12}${ap}`; };
const durWords = (mins) => { const h = Math.floor(mins / 60), mm = mins % 60; if (h === 0) return `${mm} min`; return `${h}h${mm ? ` ${mm}m` : ''}`; };

// ── Range timeline picker config ───────────────────────────────
const TL_START = 7 * 60;        // 7:00 AM
const TL_END = 21 * 60;         // 9:00 PM
const TL_SPAN = TL_END - TL_START;
const TL_STEP = 30;             // 30-min granularity
const TL_GAP = 30;              // minimum booking length
const TL_NOW = 9 * 60 + 41;     // "now" — matches the device clock
const TL_AXIS = [7, 9, 11, 13, 15, 17, 19, 21];
const TIME_PRESETS = [
  { label: 'Morning', in: 9 * 60, out: 12 * 60 },
  { label: 'Afternoon', in: 13 * 60, out: 18 * 60 },
  { label: 'Full day', in: 9 * 60, out: 18 * 60 },
  { label: '9–5', in: 9 * 60, out: 17 * 60 },
];

function TimeField({ T, label, value, onClick, active }) {
  return (
    <div style={{ flex: 1 }}>
      <div style={{ fontFamily: T.font.ui, fontSize: 12, color: T.ink3, fontWeight: 600, marginBottom: 6 }}>{label}</div>
      <button onClick={onClick} style={{ width: '100%', height: 48, borderRadius: T.rEl, border: `1.5px solid ${active ? T.hexA(T.primary, 0.6) : T.line}`, background: active ? T.hexA(T.primary, T.dark ? 0.16 : 0.08) : T.surface, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 14px', cursor: 'pointer', transition: 'all .15s' }}>
        <span style={{ fontFamily: T.font.ui, fontWeight: 700, fontSize: 16, color: T.ink, fontVariantNumeric: 'tabular-nums' }}>{value}</span>
        <Icon name="clock" size={17} color={active ? T.primary : T.ink3} sw={1.9} />
      </button>
    </div>
  );
}

function TimeRangePicker({ T, inMin, outMin, active, setActive, onChange, onClose }) {
  const trackRef = React.useRef(null);
  const dragRef = React.useRef(null);
  const accent = T.accent ? T.accent(T.primary) : T.primary;
  const dur = Math.max(0, outMin - inMin);
  const pct = (m) => ((m - TL_START) / TL_SPAN) * 100;

  const setEnd = (which, raw) => {
    let m = Math.round(raw / TL_STEP) * TL_STEP;
    if (which === 'in') { m = Math.max(TL_START, Math.min(m, outMin - TL_GAP)); onChange(m, outMin); }
    else { m = Math.min(TL_END, Math.max(m, inMin + TL_GAP)); onChange(inMin, m); }
  };
  const minFromX = (clientX) => {
    const r = trackRef.current.getBoundingClientRect();
    const frac = Math.max(0, Math.min(1, (clientX - r.left) / r.width));
    return TL_START + frac * TL_SPAN;
  };
  const onDown = (e) => {
    e.preventDefault();
    const m = minFromX(e.clientX);
    const which = Math.abs(m - inMin) <= Math.abs(m - outMin) ? 'in' : 'out';
    dragRef.current = which;
    setActive(which);
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch (_) {}
    setEnd(which, m);
  };
  const onMove = (e) => { if (dragRef.current) setEnd(dragRef.current, minFromX(e.clientX)); };
  const onUp = (e) => { dragRef.current = null; try { e.currentTarget.releasePointerCapture(e.pointerId); } catch (_) {} };

  const handle = (which, m) => {
    const on = active === which;
    return (
      <div style={{ position: 'absolute', top: '50%', left: `${pct(m)}%`, transform: 'translate(-50%,-50%)', zIndex: 3, pointerEvents: 'none' }}>
        <div style={{
          width: on ? 28 : 24, height: on ? 28 : 24, borderRadius: 999, background: T.surface,
          border: `${on ? 3 : 2.5}px solid ${on ? accent : T.hexA(T.primary, 0.7)}`,
          boxShadow: on ? `0 4px 14px ${T.hexA(T.primary, 0.4)}` : T.shadowSm, transition: 'width .12s, height .12s, border-color .12s',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ width: 4, height: 4, borderRadius: 999, background: on ? accent : T.hexA(T.primary, 0.7) }} />
        </div>
      </div>
    );
  };

  const segBtn = (which, m) => {
    const on = active === which;
    return (
      <button onClick={() => setActive(which)} style={{
        flex: 1, textAlign: 'left', border: 'none', cursor: 'pointer', borderRadius: T.rEl - 2, padding: '7px 11px',
        background: on ? T.hexA(T.primary, T.dark ? 0.18 : 0.09) : 'transparent', transition: 'background .14s',
      }}>
        <div style={{ fontFamily: T.font.mono, fontSize: 9.5, letterSpacing: '.07em', textTransform: 'uppercase', color: on ? accent : T.ink3, fontWeight: 600 }}>{which === 'in' ? 'Check-in' : 'Check-out'}</div>
        <div style={{ fontFamily: T.font.ui, fontWeight: 800, fontSize: 19, color: on ? T.ink : T.ink2, fontVariantNumeric: 'tabular-nums', marginTop: 1 }}>{fmtMin(m)}</div>
      </button>
    );
  };

  return (
    <div className="fs-trp" style={{ background: T.surface, border: `1px solid ${T.line}`, borderRadius: T.rCard, padding: 16, boxShadow: T.shadowMd }}>
        {/* readout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {segBtn('in', inMin)}
          <Icon name="chevR" size={18} color={T.ink3} />
          {segBtn('out', outMin)}
          <button onClick={onClose} style={{ width: 30, height: 30, flexShrink: 0, marginLeft: 2, borderRadius: 999, border: 'none', background: T.hexA(T.ink, 0.05), cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="close" size={15} color={T.ink2} sw={2} />
          </button>
        </div>

        {/* duration */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, margin: '12px 2px 18px' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 11px', borderRadius: 999, background: T.hexA(T.primary, T.dark ? 0.16 : 0.08) }}>
            <Icon name="clock" size={13} color={accent} sw={2} />
            <span style={{ fontFamily: T.font.ui, fontWeight: 700, fontSize: 12.5, color: accent }}>{durWords(dur)}</span>
          </span>
          <span style={{ fontFamily: T.font.ui, fontSize: 12.5, color: T.ink3, fontWeight: 600 }}>Today</span>
        </div>

        {/* timeline */}
        <div style={{ position: 'relative', padding: '0 4px' }}>
          <div ref={trackRef} style={{ position: 'relative', height: 28 }}>
            {/* base track */}
            <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 7, transform: 'translateY(-50%)', borderRadius: 999, background: T.hexA(T.ink, T.dark ? 0.14 : 0.07) }} />
            {/* past (before now) shaded */}
            <div style={{ position: 'absolute', top: '50%', left: 0, width: `${pct(TL_NOW)}%`, height: 7, transform: 'translateY(-50%)', borderRadius: '999px 0 0 999px', background: `repeating-linear-gradient(45deg, ${T.hexA(T.ink, 0.10)} 0 4px, transparent 4px 8px)` }} />
            {/* active duration band */}
            <div style={{ position: 'absolute', top: '50%', left: `${pct(inMin)}%`, width: `${pct(outMin) - pct(inMin)}%`, height: 7, transform: 'translateY(-50%)', borderRadius: 999, background: T.gradient }} />
            {/* now marker */}
            <div style={{ position: 'absolute', top: -3, bottom: -3, left: `${pct(TL_NOW)}%`, width: 2, transform: 'translateX(-50%)', background: T.hexA(T.ink, 0.28), borderRadius: 999, zIndex: 2 }} />
            {handle('in', inMin)}
            {handle('out', outMin)}
            {/* interaction layer */}
            <div onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}
              style={{ position: 'absolute', top: -10, bottom: -10, left: 0, right: 0, zIndex: 4, cursor: 'pointer', touchAction: 'none' }} />
          </div>
          {/* axis */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
            {TL_AXIS.map((h) => (
              <div key={h} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 1.5, height: 5, borderRadius: 999, background: T.hexA(T.ink, 0.18) }} />
                <span style={{ fontFamily: T.font.mono, fontSize: 9.5, color: T.ink3, fontWeight: 500 }}>{fmtHour(h * 60)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* presets */}
        <div style={{ display: 'flex', gap: 7, marginTop: 16, overflowX: 'auto', scrollbarWidth: 'none' }}>
          {TIME_PRESETS.map((p) => {
            const on = p.in === inMin && p.out === outMin;
            return (
              <button key={p.label} onClick={() => onChange(p.in, p.out)} style={{
                flexShrink: 0, height: 34, padding: '0 14px', borderRadius: 999, cursor: 'pointer',
                border: `1.5px solid ${on ? T.hexA(T.primary, 0.6) : T.line}`,
                background: on ? T.hexA(T.primary, T.dark ? 0.18 : 0.10) : T.surface,
                color: on ? accent : T.ink2, fontFamily: T.font.ui, fontWeight: 700, fontSize: 12.5, transition: 'all .12s',
              }}>{p.label}</button>
            );
          })}
        </div>
      </div>
  );
}

function DeskScreen({ T, floor, go, openDesk, onBook, when }) {
  const [filters, setFilters] = useStateD(['nearteam']);
  const [view, setView] = useStateD('list');
  const [sel, setSel] = useStateD(null);
  const [panel, setPanel] = useStateD(null);   // null | 'date' | 'time' | 'recur'
  const [tActive, setTActive] = useStateD('in'); // which time handle the panel emphasizes
  const toggle = (id) => setFilters(f => f.includes(id) ? f.filter(x => x !== id) : [...f, id]);

  const w = when || { date: window.W_TODAY, setDate: () => {}, inMin: 600, outMin: 1140, setIn: () => {}, setOut: () => {}, recur: window.WHEN_RECUR_DEFAULT, setRecur: () => {} };
  const setRange = (i, o) => { w.setIn(i); w.setOut(o); };
  const openTime = (which) => { setTActive(which); setPanel(p => (p === 'time' && tActive === which) ? null : 'time'); };
  const togglePanel = (name) => setPanel(p => p === name ? null : name);

  // candidate desks (available), scored
  const avail = floor.desks.filter(d => d.status === 'available');
  const scored = avail.map(d => {
    let score = 0; const reasons = [];
    if (filters.includes('nearteam') && d.team === 'Product') { score += 3; reasons.push('Near your team'); }
    if (filters.includes('window') && d.tags.includes('window')) { score += 2; reasons.push('Window'); }
    if (filters.includes('quiet') && d.tags.includes('quiet')) { score += 2; reasons.push('Quiet zone'); }
    if (filters.includes('standing') && d.tags.includes('standing')) { score += 2; reasons.push('Standing'); }
    if (filters.includes('dual') && d.tags.includes('dual')) { score += 1; reasons.push('Dual monitor'); }
    if (d.tags.includes('window')) score += 0.5;
    return { ...d, score, reasons };
  }).sort((a, b) => b.score - a.score);
  const top = scored.slice(0, 6);

  // shared scheduling controls (date · time range · recurrence) — reused in list header and map booking card
  const whenControls = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <PickField T={T} icon="calendar" label="Date" value={window.whenFmt.dateFull(w.date)} active={panel === 'date'} onClick={() => togglePanel('date')} />
      {panel === 'date' && <DatePickerPanel T={T} date={w.date} onPick={(d) => { w.setDate(d); setPanel(null); }} onClose={() => setPanel(null)} />}
      <div style={{ display: 'flex', gap: 10 }}>
        <TimeField T={T} label="Check-in" value={fmtMin(w.inMin)} active={panel === 'time' && tActive === 'in'} onClick={() => openTime('in')} />
        <div style={{ alignSelf: 'flex-end', paddingBottom: 14, color: T.ink3, fontFamily: T.font.ui }}>→</div>
        <TimeField T={T} label="Check-out" value={fmtMin(w.outMin)} active={panel === 'time' && tActive === 'out'} onClick={() => openTime('out')} />
      </div>
      {panel === 'time' && <TimeRangePicker T={T} inMin={w.inMin} outMin={w.outMin} active={tActive} setActive={setTActive} onChange={setRange} onClose={() => setPanel(null)} />}
      <PickField T={T} icon="refresh" label="Repeat" value={window.whenFmt.recur(w.recur, w.date)} active={panel === 'recur'} onClick={() => togglePanel('recur')} color={T.indigo} />
      {panel === 'recur' && <RecurrencePanel T={T} recur={w.recur} date={w.date} onChange={w.setRecur} onClose={() => setPanel(null)} />}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <Icon name="clock" size={13} color={T.ink3} sw={1.9} />
        <span style={{ fontFamily: T.font.ui, fontSize: 12, color: T.ink3, fontWeight: 600 }}>{fmtDur(fmtMin(w.inMin), fmtMin(w.outMin))} · {window.whenFmt.date(w.date)}{w.recur && w.recur.type !== 'none' ? ` · ${window.whenFmt.recur(w.recur, w.date)}` : ''}</span>
      </div>
    </div>
  );

  return (
    <div>
      <ScreenHeaderBar T={T} title="Book a desk" sub={`${floor.name} · ${avail.length} desks free`} right={<Segmented T={T} options={[{value:'list',label:'List'},{value:'map',label:'Map'}]} value={view} onChange={setView} />} />

      {view === 'map' ? (
        <div style={{ padding: '0 18px' }}>
          <FloorMap T={T} floor={floor} selected={sel} onSelect={(d) => setSel(d.id)} onSelectRoom={() => {}} presence labels height={sel ? 300 : 400} />
          <div style={{ marginTop: 12 }}><MapLegend T={T} /></div>
          {sel ? (() => {
            const d = floor.desks.find(x => x.id === sel); const m = window.deskMeta(d, T); const sm = T.statusMeta[d.status];
            return (
              <Card T={T} style={{ marginTop: 14 }} elevate>
                {/* selected seat */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 46, height: 46, borderRadius: T.rEl, background: m.soft, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon name="chair" size={21} color={m.text} sw={1.9} />
                    <span style={{ fontFamily: T.font.mono, fontSize: 8.5, color: m.text, fontWeight: 600, marginTop: 1 }}>{d.label}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: T.font.ui, fontWeight: 700, fontSize: 16, color: T.ink }}>Desk {d.label} · {d.team}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}><StatusDot T={T} status={d.status} /><span style={{ fontFamily: T.font.ui, fontSize: 12.5, color: m.text, fontWeight: 600 }}>{sm.name}</span></div>
                  </div>
                  <button onClick={() => setSel(null)} style={{ width: 30, height: 30, borderRadius: 999, border: 'none', background: T.hexA(T.ink, 0.05), cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon name="close" size={15} color={T.ink2} sw={2} />
                  </button>
                </div>

                {sm.bookable ? (
                  <>
                    <div style={{ height: 1, background: T.lineSoft, margin: '14px 0' }} />
                    <div style={{ fontFamily: T.font.mono, fontSize: 10, letterSpacing: '.07em', textTransform: 'uppercase', color: T.ink3, fontWeight: 600, marginBottom: 10 }}>When</div>
                    {whenControls}
                    <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                      <Btn T={T} kind="ghost" onClick={() => openDesk(d)}>Details</Btn>
                      <Btn T={T} kind="gradient" full icon="check" onClick={() => (onBook ? onBook(d) : openDesk(d))}>Book this desk</Btn>
                    </div>
                  </>
                ) : (
                  <div style={{ marginTop: 14 }}>
                    <Btn T={T} kind="ghost" full onClick={() => openDesk(d)}>View details</Btn>
                  </div>
                )}
              </Card>
            );
          })() : (
            <div style={{ marginTop: 14, padding: '16px', borderRadius: T.rCard, border: `1.5px dashed ${T.line}`, display: 'flex', alignItems: 'center', gap: 12, background: T.hexA(T.primary, T.dark ? 0.06 : 0.035) }}>
              <div style={{ width: 40, height: 40, borderRadius: 999, background: T.hexA(T.primary, T.dark ? 0.18 : 0.10), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon name="pin" size={20} color={T.primary} sw={2} />
              </div>
              <div>
                <div style={{ fontFamily: T.font.ui, fontWeight: 700, fontSize: 14.5, color: T.ink }}>Tap a seat to book</div>
                <div style={{ fontFamily: T.font.ui, fontSize: 12.5, color: T.ink3, marginTop: 1 }}>Pick any available desk, set your time, then confirm.</div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div style={{ padding: '0 18px' }}>
          {whenControls}
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '14px 0', scrollbarWidth: 'none' }}>
            <Chip T={T} icon="sliders" onClick={() => {}}>Filters</Chip>
            {window.DESK_FILTERS.map(f => (
              <Chip key={f.id} T={T} active={filters.includes(f.id)} onClick={() => toggle(f.id)}>{f.label}</Chip>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Icon name="spark" size={16} color={T.indigo} sw={2} />
            <span style={{ fontFamily: T.font.ui, fontWeight: 700, fontSize: 14.5, color: T.ink }}>Best matches for you</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
            {top.map(d => {
              const near = window.PEOPLE.filter(p => p.here && p.team === d.team && p.id !== 'me').slice(0, 3);
              return (
                <Card T={T} key={d.id} pad={14} onClick={() => openDesk(d)}>
                  <div style={{ display: 'flex', gap: 13 }}>
                    <div style={{ width: 58, height: 58, borderRadius: T.rEl, background: T.hexA(T.teal,0.10), display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon name="chair" size={24} color={T.teal} sw={1.8} />
                      <span style={{ fontFamily: T.font.mono, fontSize: 9.5, color: T.tealDeep, fontWeight: 600, marginTop: 2 }}>{d.label}</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontFamily: T.font.ui, fontWeight: 700, fontSize: 15, color: T.ink }}>Desk {d.label}</span>
                        {d.score >= 3 && <span style={{ fontFamily: T.font.mono, fontSize: 9, color: '#15803D', background: '#DCFCE7', padding: '3px 7px', borderRadius: 999, fontWeight: 600 }}>TOP PICK</span>}
                      </div>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>
                        {(d.reasons.length?d.reasons:['Available now']).slice(0,3).map(r => (
                          <span key={r} style={{ fontFamily: T.font.ui, fontSize: 11, fontWeight: 600, color: T.ink2, background: T.hexA(T.ink,0.045), padding: '3px 8px', borderRadius: 999 }}>{r}</span>
                        ))}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 9 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: -0 }}>
                          {near.map((p, i) => <div key={p.id} style={{ marginLeft: i?-8:0, borderRadius: 999, boxShadow: '0 0 0 2px #fff' }}><Avatar person={p} size={24} T={T} /></div>)}
                          <span style={{ fontFamily: T.font.ui, fontSize: 11.5, color: T.ink3, marginLeft: 8 }}>{near.length} teammates near</span>
                        </div>
                        <Icon name="chevR" size={17} color={T.ink3} />
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Full seat detail ───────────────────────────────────────────
function DeskDetail({ T, floor, deskId, go, onBook, when }) {
  const d = floor.desks.find(x => x.id === deskId) || floor.desks[0];
  const w = when || { date: window.W_TODAY, inMin: 600, outMin: 1140, recur: window.WHEN_RECUR_DEFAULT };
  const m = window.deskMeta(d, T);
  const sm = T.statusMeta[d.status];
  const near = window.PEOPLE.filter(p => p.here && p.team === d.team && p.id !== 'me').slice(0, 4);
  const amen = ['dual','monitor','wifi','ac'].filter(() => true);

  return (
    <div>
      <DetailHeader T={T} go={go} title={`Desk ${d.label}`} sub={`${d.team} neighborhood · ${floor.name}`} />
      <div style={{ padding: '0 18px 130px' }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 2 }}><Photo T={T} label="desk photo · 4:3" h={150} accent={T.teal} src="assets/desk-cluster.png" /></div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Photo T={T} label="view" h={70} accent={T.teal} src="assets/desk-view.png" />
            <Photo T={T} label="setup" h={70} accent={T.teal} src="assets/desk-setup.png" />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16 }}>
          <StatusDot T={T} status={d.status} size={11} />
          <span style={{ fontFamily: T.font.ui, fontWeight: 700, fontSize: 15, color: m.text }}>{sm.name}</span>
          {d.tags.includes('a11y') && <span style={{ display:'inline-flex', alignItems:'center', gap:4, fontFamily: T.font.ui, fontSize: 12, fontWeight: 600, color: '#0EA5E9', background:'#E0F2FE', padding:'4px 9px', borderRadius: 999 }}><Icon name="a11y" size={13} color="#0EA5E9" sw={2}/>Accessible</span>}
        </div>

        {/* quick facts */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 14 }}>
          {[['walk','2 min from entrance'],['room','Bada Pav 8m away'],['heat','Quiet zone · low noise'],['layers','Sit/stand · adjustable']].map(([ic, tx]) => (
            <div key={tx} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '11px 12px', borderRadius: T.rEl, background: T.hexA(T.ink,0.035) }}>
              <Icon name={ic} size={18} color={T.primary} sw={1.9} />
              <span style={{ fontFamily: T.font.ui, fontSize: 12.5, fontWeight: 600, color: T.ink2, lineHeight: 1.25 }}>{tx}</span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 20 }}>
          <div style={{ fontFamily: T.font.ui, fontWeight: 700, fontSize: 15, color: T.ink, marginBottom: 10 }}>Equipment</div>
          <Amen T={T} items={amen} />
        </div>

        <div style={{ marginTop: 20 }}>
          <div style={{ fontFamily: T.font.ui, fontWeight: 700, fontSize: 15, color: T.ink, marginBottom: 10 }}>Who's nearby</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {near.map(p => (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '8px 0' }}>
                <Avatar person={p} size={36} T={T} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: T.font.ui, fontWeight: 600, fontSize: 14, color: T.ink }}>{p.name}</div>
                  <div style={{ fontFamily: T.font.ui, fontSize: 12, color: T.ink3 }}>{p.role}</div>
                </div>
                <span style={{ fontFamily: T.font.mono, fontSize: 10, color: '#15803D', background: '#DCFCE7', padding: '3px 8px', borderRadius: 999, fontWeight: 600 }}>IN OFFICE</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 20 }}>
          <div style={{ fontFamily: T.font.ui, fontWeight: 700, fontSize: 15, color: T.ink, marginBottom: 10 }}>Location on floor</div>
          <FloorMap T={T} floor={floor} selected={d.id} onSelect={() => {}} onSelectRoom={() => {}} presence={false} labels height={210} interactive={false} />
        </div>
      </div>

      <StickyBar T={T}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: T.font.ui, fontSize: 12, color: T.ink3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {window.whenFmt.date(w.date)} · {fmtMin(w.inMin)}–{fmtMin(w.outMin)}{w.recur && w.recur.type !== 'none' ? ` · ${window.whenFmt.recur(w.recur, w.date)}` : ''}
          </div>
          <div style={{ fontFamily: T.font.ui, fontWeight: 700, fontSize: 15, color: T.ink }}>Desk {d.label}</div>
        </div>
        {sm.bookable
          ? <Btn T={T} kind="gradient" size="lg" icon="check" onClick={() => onBook(d)}>Book this desk</Btn>
          : <Btn T={T} kind="ghost" size="lg" disabled>Not bookable</Btn>}
      </StickyBar>
    </div>
  );
}

// shared detail header with breadcrumb + back
function DetailHeader({ T, go, title, sub, crumbs }) {
  return (
    <div style={{ padding: '52px 18px 14px', position: 'sticky', top: 0, zIndex: 9, background: `linear-gradient(${T.canvas} 78%, ${T.hexA(T.canvas,0)} 100%)` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <IconBtn T={T} name="chevL" size={40} onClick={() => go.back()} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: T.font.ui, fontWeight: 700, fontSize: 21, color: T.ink, letterSpacing: '-.01em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</div>
          {sub && <div style={{ fontFamily: T.font.ui, fontSize: 12.5, color: T.ink3, marginTop: 1 }}>{sub}</div>}
        </div>
      </div>
    </div>
  );
}

function StickyBar({ T, children }) {
  return (
    <div style={{ position: 'sticky', bottom: 0, marginTop: 'auto', zIndex: 40, padding: '14px 18px calc(20px + env(safe-area-inset-bottom, 0px))', background: `linear-gradient(${T.hexA(T.canvas,0)} 0%, ${T.canvas} 26%)`, display: 'flex', alignItems: 'center', gap: 12 }}>
      {children}
    </div>
  );
}

Object.assign(window, { DeskScreen, DeskDetail, Photo, TimeField, DetailHeader, StickyBar, fmtMin, toMin, fmtDur });
