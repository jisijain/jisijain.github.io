// screens-parking.jsx — Parking map, zones, vehicle profiles, reserve flow
// Exposes (window): ParkingScreen

const { useState: useStateP } = React;

function genSlots(level) {
  const seed = level === 'B1' ? 11 : 23;
  let s = seed; const r = () => (s = (s*9301+49297)%233280)/233280;
  const rows = [
    { kind: 'reserved', n: 8 }, { kind: 'ev', n: 6 }, { kind: 'general', n: 10 },
    { kind: 'general', n: 10 }, { kind: 'a11y', n: 4 }, { kind: 'visitor', n: 8 },
    { kind: 'bike', n: 10 },
  ];
  const out = []; let id = 1;
  rows.forEach((row, ri) => {
    for (let i = 0; i < row.n; i++) {
      const free = r() > 0.62;
      out.push({ id: `${level}-${id}`, code: `${row.kind[0].toUpperCase()}-${String(id).padStart(2,'0')}`, kind: row.kind, free, row: ri, col: i });
      id++;
    }
  });
  return out;
}

const ZONE_META = {
  reserved: { label: 'Reserved', color: '#7C3AED', icon: 'shield' },
  general:  { label: 'General',  color: '#2F6BFF', icon: 'car' },
  ev:       { label: 'EV',       color: '#16A34A', icon: 'ev' },
  a11y:     { label: 'Accessible', color: '#0EA5E9', icon: 'a11y' },
  visitor:  { label: 'Visitor',  color: '#F59E0B', icon: 'user' },
  bike:     { label: 'Two-wheeler', color: '#DB2777', icon: 'bike' },
};

function ParkingScreen({ T, go, onBook, when }) {
  const [level, setLevel] = useStateP('B1');
  const [sel, setSel] = useStateP(null);
  const [veh, setVeh] = useStateP(window.DATA.PARKING.vehicles[0].id);
  const [pPanel, setPPanel] = useStateP(null); // null | 'date' | 'recur'
  const w = when || { date: window.W_TODAY, setDate: () => {}, recur: window.WHEN_RECUR_DEFAULT, setRecur: () => {} };
  const slots = genSlots(level);
  const selSlot = slots.find(s => s.id === sel);
  const vehObj = window.DATA.PARKING.vehicles.find(v => v.id === veh);

  // layout slots into an SVG grid by row
  const W = 360, slotW = 30, slotH = 22, gapX = 3, padX = 14;
  const rowY = (ri) => 16 + ri * 40;

  return (
    <div>
      <ScreenHeaderBar T={T} title="Parking" sub={`${window.DATA.PARKING.zones.reduce((a,z)=>a+z.free,0)} bays free today`} right={<Segmented T={T} options={window.DATA.PARKING.levels} value={level} onChange={setLevel} />} />

      {/* zone summary */}
      <div style={{ display: 'flex', gap: 9, overflowX: 'auto', padding: '0 18px 14px', scrollbarWidth: 'none' }}>
        {window.DATA.PARKING.zones.map(z => {
          const zm = ZONE_META[z.kind];
          return (
            <div key={z.id} style={{ flexShrink: 0, width: 104, padding: 13, borderRadius: T.rEl, background: T.surface, boxShadow: T.shadowSm, border: T.border?`1px solid ${T.borderColor}`:'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <Icon name={zm.icon} size={16} color={zm.color} sw={2} />
                <span style={{ fontFamily: T.font.ui, fontSize: 11.5, fontWeight: 600, color: T.ink2 }}>{zm.label}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
                <span style={{ fontFamily: T.font.ui, fontWeight: 700, fontSize: 22, color: T.ink }}>{z.free}</span>
                <span style={{ fontFamily: T.font.ui, fontSize: 12, color: T.ink3 }}>/{z.total}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* parking map */}
      <div style={{ padding: '0 18px' }}>
        <div style={{ borderRadius: T.rCard, overflow: 'hidden', background: '#EEF1F5', border: T.border?`1px solid ${T.borderColor}`:'none', padding: '8px 0' }}>
          <svg width="100%" viewBox={`0 0 ${W} 300`} style={{ display: 'block' }}>
            {/* lanes */}
            {[0,1,2,3].map(i => <rect key={i} x="10" y={36 + i*80} width={W-20} height="22" fill={T.hexA(T.ink,0.04)} rx="4" />)}
            {['reserved','ev','general','general','a11y','visitor','bike'].map((kind, ri) => {
              const rowSlots = slots.filter(s => s.row === ri);
              const zm = ZONE_META[kind];
              return (
                <g key={ri}>
                  <text x={padX} y={rowY(ri)-3} fontFamily={T.font.mono} fontSize="7.5" fill={T.ink3} style={{ letterSpacing: '.05em' }}>{zm.label.toUpperCase()}</text>
                  {rowSlots.map((s, ci) => {
                    const x = padX + ci * (slotW + gapX);
                    const on = s.id === sel;
                    const col = s.free ? zm.color : T.ink3;
                    return (
                      <g key={s.id} onClick={() => s.free && setSel(s.id)} style={{ cursor: s.free?'pointer':'default' }}>
                        <rect x={x} y={rowY(ri)} width={slotW} height={slotH} rx="4"
                          fill={s.free ? T.hexA(zm.color,0.14) : T.hexA(T.ink,0.07)}
                          stroke={on ? T.ink : (s.free ? zm.color : 'transparent')} strokeWidth={on?2:1.3} strokeDasharray={s.free?'0':'0'} />
                        {!s.free && <g transform={`translate(${x+slotW/2-6},${rowY(ri)+slotH/2-6})`}><Icon name="car" size={12} color={T.ink3} sw={1.6} /></g>}
                        {s.free && (kind==='ev'||kind==='a11y'||kind==='bike') && <g transform={`translate(${x+slotW/2-6},${rowY(ri)+slotH/2-6})`}><Icon name={kind==='ev'?'ev':kind==='a11y'?'a11y':'bike'} size={12} color={zm.color} sw={2} /></g>}
                        {on && <circle cx={x+slotW/2} cy={rowY(ri)+slotH/2} r="16" fill="none" stroke={T.ink} strokeWidth="1.5" strokeDasharray="3 3" />}
                      </g>
                    );
                  })}
                </g>
              );
            })}
            {/* entrance marker */}
            <g transform="translate(166,284)"><Icon name="door" size={14} color={T.ink2} sw={1.8} /></g>
            <text x="186" y="295" fontFamily={T.font.mono} fontSize="8" fill={T.ink3}>RAMP / ENTRY</text>
          </svg>
        </div>
        <div style={{ display: 'flex', gap: 14, marginTop: 12, flexWrap: 'wrap' }}>
          {['general','ev','a11y','visitor','bike'].map(k => (
            <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 11, height: 11, borderRadius: 3, background: T.hexA(ZONE_META[k].color,0.18), border: `1.3px solid ${ZONE_META[k].color}` }} />
              <span style={{ fontFamily: T.font.ui, fontSize: 11.5, color: T.ink2, fontWeight: 600 }}>{ZONE_META[k].label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* when */}
      <div style={{ padding: '20px 18px 0' }}>
        <SectionLabel T={T}>When</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <PickField T={T} icon="calendar" label="Date" value={window.whenFmt.dateFull(w.date)} active={pPanel === 'date'} onClick={() => setPPanel(p => p === 'date' ? null : 'date')} />
          {pPanel === 'date' && <DatePickerPanel T={T} date={w.date} onPick={(d) => { w.setDate(d); setPPanel(null); }} onClose={() => setPPanel(null)} />}
          <PickField T={T} icon="refresh" label="Repeat" value={window.whenFmt.recur(w.recur, w.date)} active={pPanel === 'recur'} onClick={() => setPPanel(p => p === 'recur' ? null : 'recur')} color={T.indigo} />
          {pPanel === 'recur' && <RecurrencePanel T={T} recur={w.recur} date={w.date} onChange={w.setRecur} onClose={() => setPPanel(null)} />}
        </div>
      </div>

      {/* vehicle profiles */}
      <div style={{ padding: '20px 18px 0' }}>
        <SectionLabel T={T} action="Add vehicle">Your vehicles</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {window.DATA.PARKING.vehicles.map(v => {
            const on = v.id === veh;
            return (
              <button key={v.id} onClick={() => setVeh(v.id)} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: 13, borderRadius: T.rEl, border: on?`2px solid ${T.primary}`:`1px solid ${T.line}`, background: on?T.hexA(T.primary,0.06):T.surface, cursor: 'pointer', textAlign: 'left' }}>
                <div style={{ width: 44, height: 44, borderRadius: T.rEl, background: T.hexA(v.twoWheeler?'#DB2777':v.ev?'#16A34A':T.electric,0.12), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name={v.twoWheeler?'bike':v.ev?'ev':'car'} size={22} color={v.twoWheeler?'#DB2777':v.ev?'#16A34A':T.electric} sw={1.9} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: T.font.ui, fontWeight: 700, fontSize: 14.5, color: T.ink }}>{v.name}</div>
                  <div style={{ fontFamily: T.font.mono, fontSize: 11.5, color: T.ink3, marginTop: 2 }}>{v.plate}</div>
                </div>
                {v.ev && <span style={{ fontFamily: T.font.ui, fontSize: 11, fontWeight: 600, color: '#15803D', background: '#DCFCE7', padding: '4px 9px', borderRadius: 999 }}>EV</span>}
                {v.twoWheeler && <span style={{ fontFamily: T.font.ui, fontSize: 11, fontWeight: 600, color: '#BE185D', background: '#FCE7F3', padding: '4px 9px', borderRadius: 999 }}>2W</span>}
                <div style={{ width: 22, height: 22, borderRadius: 999, border: on?`6px solid ${T.primary}`:`2px solid ${T.line}`, transition: 'all .15s' }} />
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ height: 8 }} />

      <StickyBar T={T}>
        <div style={{ flex: 1 }}>
          {selSlot ? (
            <>
              <div style={{ fontFamily: T.font.ui, fontSize: 12, color: T.ink3 }}>{level} · {ZONE_META[selSlot.kind].label}{vehObj?.ev && selSlot.kind==='ev'?' · charging':''}</div>
              <div style={{ fontFamily: T.font.ui, fontWeight: 700, fontSize: 16, color: T.ink }}>Bay {selSlot.code}</div>
            </>
          ) : (
            <div style={{ fontFamily: T.font.ui, fontSize: 13.5, color: T.ink3 }}>Tap a free bay to reserve</div>
          )}
        </div>
        <Btn T={T} kind="gradient" size="lg" icon="check" disabled={!selSlot} onClick={() => onBook({ type: 'parking', name: `Bay ${selSlot.code}`, level })}>Reserve</Btn>
      </StickyBar>
    </div>
  );
}

Object.assign(window, { ParkingScreen });
