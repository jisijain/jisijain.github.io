// screens-rooms.jsx — Meeting room discovery + detail + quick book
// Exposes (window): RoomsScreen, RoomDetail

const { useState: useStateR } = React;

const HOURS = [9,10,11,12,13,14,15,16,17];

function MiniTimeline({ T, seed, height = 6 }) {
  const tl = window.DATA.roomTimeline(seed);
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {tl.map(s => (
        <div key={s.h} style={{ flex: 1, height, borderRadius: 2, background: s.free ? T.hexA(T.teal,0.8) : T.hexA(T.ink,0.10) }} />
      ))}
    </div>
  );
}

function statusChip(T, st) {
  if (st === 'available') return { t: 'Available', c: '#15803D', bg: '#DCFCE7' };
  if (st === 'soon') return { t: 'Free in 15m', c: '#B45309', bg: '#FEF3C7' };
  return { t: 'In use', c: '#B42318', bg: '#FEE4E2' };
}

function RoomsScreen({ T, go, openRoom }) {
  const [onlyFree, setOnlyFree] = useStateR(false);
  const [cap, setCap] = useStateR('any');
  let rooms = window.DATA.ROOMS;
  if (onlyFree) rooms = rooms.filter(r => r.status === 'available');
  if (cap !== 'any') rooms = rooms.filter(r => cap === 'small' ? r.seats <= 6 : cap === 'med' ? r.seats > 6 && r.seats <= 10 : r.seats > 10);

  return (
    <div>
      <ScreenHeaderBar T={T} title="Meeting rooms" sub="3rd Floor · Noida HQ" />
      <div style={{ padding: '0 18px 10px' }}>
        <SearchBar T={T} value="" onChange={() => {}} placeholder="Search rooms or time…" />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 18px 16px', overflowX: 'auto', scrollbarWidth: 'none' }}>
        <Chip T={T} active={onlyFree} onClick={() => setOnlyFree(!onlyFree)} icon="check">Free now</Chip>
        <Chip T={T} active={cap==='small'} onClick={() => setCap(cap==='small'?'any':'small')}>≤6</Chip>
        <Chip T={T} active={cap==='med'} onClick={() => setCap(cap==='med'?'any':'med')}>7–10</Chip>
        <Chip T={T} active={cap==='large'} onClick={() => setCap(cap==='large'?'any':'large')}>10+</Chip>
        <Chip T={T} icon="video">Video</Chip>
      </div>

      <div style={{ padding: '0 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {rooms.map((r, i) => {
          const sc = statusChip(T, r.status);
          return (
            <Card T={T} key={r.id} pad={16} onClick={() => openRoom(r)}>
              {/* title row */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                <div>
                  <div style={{ fontFamily: T.font.ui, fontWeight: 700, fontSize: 17, color: T.ink, letterSpacing: '-.01em' }}>{r.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4, fontFamily: T.font.ui, fontSize: 12.5, color: T.ink3 }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><Icon name="team" size={14} color={T.ink3} sw={1.9} />{r.seats} seats</span>
                    <span style={{ width: 3, height: 3, borderRadius: 999, background: T.ink3 }} />
                    <span>{r.zone}</span>
                  </div>
                </div>
                <span style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: T.font.ui, fontSize: 12, fontWeight: 700, color: sc.c, background: sc.bg, padding: '5px 11px', borderRadius: 999 }}>
                  <span style={{ width: 7, height: 7, borderRadius: 999, background: sc.c }} />{sc.t}
                </span>
              </div>

              {/* availability strip */}
              <div style={{ margin: '14px 0 4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontFamily: T.font.mono, fontSize: 9.5, color: T.ink3, letterSpacing: '.04em' }}>9A</span>
                  <span style={{ fontFamily: T.font.mono, fontSize: 9.5, color: T.ink3, letterSpacing: '.04em' }}>TODAY</span>
                  <span style={{ fontFamily: T.font.mono, fontSize: 9.5, color: T.ink3, letterSpacing: '.04em' }}>6P</span>
                </div>
                <MiniTimeline T={T} seed={i+2} />
              </div>

              {/* footer */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14, paddingTop: 14, borderTop: `1px solid ${T.line}` }}>
                <Amen T={T} items={r.amen.slice(0, 4)} size="sm" />
                <Btn T={T} size="sm" onClick={(e) => { e.stopPropagation(); openRoom(r); }}>Book</Btn>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ── Room detail ────────────────────────────────────────────────
function RoomDetail({ T, roomId, floor, go, onBook, when }) {
  const r = window.DATA.ROOMS.find(x => x.id === roomId) || window.DATA.ROOMS[0];
  const tl = window.DATA.roomTimeline(3);
  const [slot, setSlot] = useStateR(tl.find(s => s.free)?.h ?? 11);
  const [dur, setDur] = useStateR(60);
  const [rPanel, setRPanel] = useStateR(null); // null | 'date' | 'recur'
  const w = when || { date: window.W_TODAY, setDate: () => {}, recur: window.WHEN_RECUR_DEFAULT, setRecur: () => {} };
  const sc = statusChip(T, r.status);

  const facts = [
    ['team', `${r.seats} seats`],
    ['nav', r.zone],
    ['layers', floor.name],
  ];

  return (
    <div>
      <DetailHeader T={T} go={go} title={r.name} sub={`${r.zone} · ${r.seats} seats · ${floor.name}`} />
      <div style={{ padding: '0 18px 140px' }}>
        {/* status */}
        <div style={{ marginTop: 4 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: T.font.ui, fontSize: 13, fontWeight: 700, color: sc.c, background: sc.bg, padding: '6px 12px', borderRadius: 999 }}>
            <span style={{ width: 7, height: 7, borderRadius: 999, background: sc.c }} />{sc.t}
          </span>
        </div>

        {/* quick facts */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginTop: 16 }}>
          {facts.map(([ic, tx]) => (
            <div key={tx} style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start', padding: '12px', borderRadius: T.rEl, background: T.hexA(T.ink,0.035) }}>
              <Icon name={ic} size={18} color={T.primary} sw={1.9} />
              <span style={{ fontFamily: T.font.ui, fontSize: 12, fontWeight: 600, color: T.ink2 }}>{tx}</span>
            </div>
          ))}
        </div>

        {/* date + recurrence */}
        <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontFamily: T.font.ui, fontWeight: 700, fontSize: 15.5, color: T.ink, marginBottom: 2 }}>When</div>
          <PickField T={T} icon="calendar" label="Date" value={window.whenFmt.dateFull(w.date)} active={rPanel === 'date'} onClick={() => setRPanel(p => p === 'date' ? null : 'date')} />
          {rPanel === 'date' && <DatePickerPanel T={T} date={w.date} onPick={(d) => { w.setDate(d); setRPanel(null); }} onClose={() => setRPanel(null)} />}
          <PickField T={T} icon="refresh" label="Repeat" value={window.whenFmt.recur(w.recur, w.date)} active={rPanel === 'recur'} onClick={() => setRPanel(p => p === 'recur' ? null : 'recur')} color={T.indigo} />
          {rPanel === 'recur' && <RecurrencePanel T={T} recur={w.recur} date={w.date} onChange={w.setRecur} onClose={() => setRPanel(null)} />}
        </div>

        {/* interactive availability timeline */}
        <div style={{ marginTop: 24 }}>
          <div style={{ fontFamily: T.font.ui, fontWeight: 700, fontSize: 15.5, color: T.ink, marginBottom: 12 }}>Pick a time</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {tl.map(s => {
              const on = s.h === slot && s.free;
              return (
                <button key={s.h} disabled={!s.free} onClick={() => setSlot(s.h)} style={{
                  flex: 1, height: 56, borderRadius: T.rEl, border: on ? `2px solid ${T.primary}` : `1px solid ${T.line}`, cursor: s.free?'pointer':'not-allowed',
                  background: on ? T.hexA(T.primary,0.12) : (s.free ? T.surface : T.hexA(T.ink,0.05)),
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, padding: 0,
                }}>
                  <span style={{ fontFamily: T.font.ui, fontWeight: 700, fontSize: 13, color: s.free ? (on?T.tealDeep:T.ink) : T.ink3 }}>{s.h>12?s.h-12:s.h}</span>
                  <span style={{ width: 6, height: 6, borderRadius: 999, background: s.free ? (on?T.primary:T.hexA(T.teal,0.5)) : T.ink3 }} />
                </button>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            {[30,60,90].map(d => <Chip key={d} T={T} active={dur===d} onClick={() => setDur(d)}>{d} min</Chip>)}
          </div>
        </div>

        {/* equipment */}
        <div style={{ marginTop: 24 }}>
          <div style={{ fontFamily: T.font.ui, fontWeight: 700, fontSize: 15, color: T.ink, marginBottom: 10 }}>Equipment</div>
          <Amen T={T} items={r.amen} />
        </div>

        {/* nearby */}
        <div style={{ marginTop: 24 }}>
          <div style={{ fontFamily: T.font.ui, fontWeight: 700, fontSize: 15, color: T.ink, marginBottom: 10 }}>Nearby</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1, borderRadius: T.rEl, overflow: 'hidden', border: `1px solid ${T.line}` }}>
            {[['coffee','Café','12m'],['wc','Restroom','20m'],['door','Exit','30m']].map(([ic, tx, d]) => (
              <div key={tx} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '13px 14px', background: T.surface }}>
                <Icon name={ic} size={18} color={T.primary} sw={1.9} />
                <span style={{ flex: 1, fontFamily: T.font.ui, fontSize: 13.5, fontWeight: 600, color: T.ink2 }}>{tx}</span>
                <span style={{ fontFamily: T.font.mono, fontSize: 12, color: T.ink3 }}>{d}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <StickyBar T={T}>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: T.font.ui, fontSize: 12, color: T.ink3 }}>{window.whenFmt.date(w.date)} · {slot>12?slot-12:slot}:00 {slot>=12?'PM':'AM'} · {dur} min{w.recur && w.recur.type !== 'none' ? ` · ${window.whenFmt.recur(w.recur, w.date)}` : ''}</div>
          <div style={{ fontFamily: T.font.ui, fontWeight: 700, fontSize: 15, color: T.ink }}>{r.name}</div>
        </div>
        <Btn T={T} kind="gradient" size="lg" icon="check" onClick={() => onBook({ type: 'room', name: r.name, slot, dur })}>Quick book</Btn>
      </StickyBar>
    </div>
  );
}

Object.assign(window, { RoomsScreen, RoomDetail, MiniTimeline });
