// screens-bookings.jsx — Reservation management: timeline / calendar / agenda
// Exposes (window): BookingsScreen

const { useState: useStateB } = React;

function TimelineView({ T, go, onAction }) {
  const items = [
  { from: 10, to: 19, label: 'Desk 55A · 3rd Floor', sub: 'Parking 4V · B1', icon: 'chair', color: T.teal, kind: 'desk' },
  { from: 11, to: 11.5, label: 'Design sync', sub: 'Chai Biskut', icon: 'room', color: T.indigo, kind: 'mtg' },
  { from: 14, to: 15, label: 'Sprint review', sub: 'Poha Jalebi', icon: 'room', color: T.indigo, kind: 'mtg' },
  { from: 17, to: 18, label: 'Town hall', sub: 'Dabeli Den', icon: 'star', color: '#F59E0B', kind: 'event' }];

  const H0 = 9,H1 = 19,pxH = 46;
  const fmt = (h) => `${h > 12 ? Math.floor(h - 12) : Math.floor(h)}:${h % 1 ? '30' : '00'}${h >= 12 ? 'p' : 'a'}`;
  return (
    <div>
      <div style={{ display: 'flex', paddingLeft: 44, marginBottom: 8 }}>
        <div style={{ flex: 1, fontFamily: T.font.mono, fontSize: 9.5, color: T.ink3, letterSpacing: '.06em' }}>SPACE</div>
        <div style={{ flex: 1, fontFamily: T.font.mono, fontSize: 9.5, color: T.ink3, letterSpacing: '.06em' }}>MEETINGS</div>
      </div>
      <div style={{ position: 'relative', paddingLeft: 44 }}>
        {Array.from({ length: H1 - H0 + 1 }).map((_, i) => {
          const h = H0 + i;
          return (
            <div key={h} style={{ position: 'relative', height: pxH }}>
              <span style={{ position: 'absolute', left: -44, top: -7, width: 38, textAlign: 'right', fontFamily: T.font.mono, fontSize: 10.5, color: T.ink3 }}>{h > 12 ? h - 12 : h}{h >= 12 ? 'p' : 'a'}</span>
              <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 1, background: T.lineSoft }} />
            </div>);

        })}
        {/* mid divider */}
        <div style={{ position: 'absolute', left: 'calc(44px + 50%)', top: 0, bottom: 0, width: 1, background: T.lineSoft, transform: 'translateX(-50%)' }} />
        {/* now line */}
        <div style={{ position: 'absolute', left: 0, right: 0, top: (12.5 - H0) * pxH, height: 2, background: '#F43F5E', zIndex: 3 }}>
          <span style={{ position: 'absolute', left: -42, top: -7, fontFamily: T.font.mono, fontSize: 9.5, color: '#F43F5E', fontWeight: 600 }}>NOW</span>
          <span style={{ position: 'absolute', left: -4, top: -3, width: 8, height: 8, borderRadius: 999, background: '#F43F5E' }} />
        </div>
        {/* blocks */}
        {items.map((it, i) => {
          const top = (it.from - H0) * pxH;
          const height = Math.max(44, (it.to - it.from) * pxH - 5);
          const leftCol = it.kind === 'desk';
          return (
            <button key={i} onClick={() => onAction(it)} style={{
              position: 'absolute', top, height, left: leftCol ? 2 : 'calc(50% + 4px)', right: leftCol ? 'calc(50% + 4px)' : 2,
              background: T.hexA(it.color, T.style === 'Crisp' ? 0.10 : 0.13), borderLeft: `3px solid ${it.color}`, borderRadius: T.rEl,
              textAlign: 'left', cursor: 'pointer', overflow: 'hidden', borderTop: 'none', borderRight: 'none', borderBottom: 'none',
              display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', padding: "6px 9px", gap: 1
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Icon name={it.icon} size={14} color={it.color} sw={2} />
                <span style={{ fontFamily: T.font.ui, fontWeight: 700, fontSize: 11.5, color: T.ink, lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.label}</span>
              </div>
              <div style={{ fontFamily: T.font.ui, fontSize: 10.5, color: T.ink3, lineHeight: 1.2 }}>{it.sub}</div>
              {height > 56 && <div style={{ display: 'inline-block', fontFamily: T.font.mono, fontSize: 10, fontWeight: 500, color: T.ink2, lineHeight: 1.2, background: T.surface, padding: '1px 6px', borderRadius: 999 }}>{fmt(it.from)}–{fmt(it.to)}</div>}
            </button>);

        })}
      </div>
    </div>);

}

function CalendarView({ T }) {
  const dim = 30;const start = 0; // June 2025 starts Sunday-ish; simple
  const booked = { 2: 2, 3: 1, 4: 1, 8: 1, 10: 2, 11: 1, 16: 1, 17: 1, 18: 1 };
  const [sel, setSel] = useStateB(2);
  const dows = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <span style={{ fontFamily: T.font.ui, fontWeight: 700, fontSize: 17, color: T.ink }}>June 2025</span>
        <div style={{ display: 'flex', gap: 8 }}>
          <IconBtn T={T} name="chevL" size={34} /><IconBtn T={T} name="chevR" size={34} />
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 3, marginBottom: 6 }}>
        {dows.map((d, i) => <div key={i} style={{ textAlign: 'center', fontFamily: T.font.mono, fontSize: 10.5, color: T.ink3 }}>{d}</div>)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 3 }}>
        {Array.from({ length: dim }).map((_, i) => {
          const day = i + 1;const on = day === sel;const b = booked[day];
          return (
            <button key={day} onClick={() => setSel(day)} style={{ aspectRatio: '1', borderRadius: T.rEl - 2, border: 'none', cursor: 'pointer', background: on ? T.primary : 'transparent', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, position: 'relative' }}>
              <span style={{ fontFamily: T.font.ui, fontWeight: on ? 700 : 500, fontSize: 14, color: on ? '#fff' : T.ink }}>{day}</span>
              {b && <div style={{ display: 'flex', gap: 2 }}>{Array.from({ length: Math.min(b, 3) }).map((_, j) => <span key={j} style={{ width: 4, height: 4, borderRadius: 999, background: on ? '#fff' : T.primary }} />)}</div>}
            </button>);

        })}
      </div>
      <div style={{ marginTop: 16 }}>
        <div style={{ fontFamily: T.font.mono, fontSize: 10.5, color: T.ink3, marginBottom: 10, letterSpacing: '.05em' }}>{sel} JUNE</div>
        {(booked[sel] ? [['chair', 'Desk 55A · 3rd Floor', '10:00–19:00', T.teal], ['room', 'Design sync · Chai Biskut', '11:00–11:30', T.indigo]].slice(0, booked[sel] + 0) : []).map(([ic, t, tm, c], i) =>
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '10px 0', borderBottom: `1px solid ${T.lineSoft}` }}>
            <div style={{ width: 36, height: 36, borderRadius: T.rEl, background: T.hexA(c, 0.12), display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={ic} size={18} color={c} sw={1.9} /></div>
            <div style={{ flex: 1 }}><div style={{ fontFamily: T.font.ui, fontWeight: 600, fontSize: 13.5, color: T.ink }}>{t}</div><div style={{ fontFamily: T.font.mono, fontSize: 11, color: T.ink3 }}>{tm}</div></div>
          </div>
        )}
        {!booked[sel] && <div style={{ fontFamily: T.font.ui, fontSize: 13.5, color: T.ink3, padding: '14px 0' }}>Nothing booked. <span style={{ color: T.primary, fontWeight: 600 }}>Plan this day →</span></div>}
      </div>
    </div>);

}

function AgendaView({ T, onAction }) {
  const groups = [
  { day: 'Today · Tue 2 Jun', items: [
    { icon: 'chair', color: T.teal, t: 'Desk 55A · 3rd Floor', tm: '10:00–19:00', tag: 'Checked in' },
    { icon: 'car', color: T.electric, t: 'Parking 4V · B1', tm: '10:00–19:00' },
    { icon: 'room', color: T.indigo, t: 'Sprint review · Poha Jalebi', tm: '14:00–15:00' }]
  },
  { day: 'Wed 3 Jun', items: [
    { icon: 'chair', color: T.teal, t: 'Desk 55A · 3rd Floor', tm: '10:00–19:00' }]
  },
  { day: 'Thu 4 Jun', items: [
    { icon: 'chair', color: T.teal, t: 'Desk 12C · 3rd Floor', tm: '09:30–18:00' },
    { icon: 'room', color: T.indigo, t: 'Bada Pav hold', tm: '12:00–13:00' }]
  }];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {groups.map((g) =>
      <div key={g.day}>
          <div style={{ fontFamily: T.font.mono, fontSize: 10.5, color: T.ink3, letterSpacing: '.05em', marginBottom: 9, textTransform: 'uppercase' }}>{g.day}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {g.items.map((it, i) =>
          <Card T={T} key={i} pad={13} onClick={() => onAction(it)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: T.rEl, background: T.hexA(it.color, 0.12), display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={it.icon} size={20} color={it.color} sw={1.9} /></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: T.font.ui, fontWeight: 700, fontSize: 14, color: T.ink }}>{it.t}</div>
                    <div style={{ fontFamily: T.font.mono, fontSize: 11, color: T.ink3, marginTop: 2 }}>{it.tm}</div>
                  </div>
                  {it.tag && <span style={{ fontFamily: T.font.ui, fontSize: 10.5, fontWeight: 600, color: '#15803D', background: '#DCFCE7', padding: '4px 9px', borderRadius: 999 }}>{it.tag}</span>}
                  <Icon name="chevR" size={18} color={T.ink3} />
                </div>
              </Card>
          )}
          </div>
        </div>
      )}
    </div>);

}

function BookingsScreen({ T, go }) {
  const [view, setView] = useStateB('timeline');
  const [sheet, setSheet] = useStateB(null);
  return (
    <div>
      <ScreenHeaderBar T={T} title="My bookings" />
      <div style={{ padding: '0 18px 16px' }}>
        <Segmented T={T} full options={[{ value: 'timeline', label: 'Timeline' }, { value: 'calendar', label: 'Calendar' }, { value: 'agenda', label: 'Agenda' }]} value={view} onChange={setView} />
      </div>

      {/* active booking control */}
      {view !== 'calendar' &&
      <div style={{ padding: '0 18px 16px' }}>
          <Card T={T} pad={15} elevate style={{ background: T.gradient }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontFamily: T.font.mono, fontSize: 10, color: T.hexA('#ffffff', 0.8), letterSpacing: '.05em' }}>ACTIVE NOW · CHECKED IN</div>
                <div style={{ fontFamily: T.font.ui, fontWeight: 700, fontSize: 18, color: '#fff', marginTop: 3 }}>Desk 55A · 3rd Floor</div>
                <div style={{ fontFamily: T.font.ui, fontSize: 12.5, color: T.hexA('#ffffff', 0.85), marginTop: 1 }}>10:00–19:00 · Parking 4V</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                <button onClick={() => setSheet({ t: 'Extend booking' })} style={{ display: 'flex', alignItems: 'center', gap: 6, background: T.hexA('#ffffff', 0.18), border: 'none', borderRadius: T.rPill, padding: '8px 13px', cursor: 'pointer', color: '#fff', fontFamily: T.font.ui, fontWeight: 600, fontSize: 12.5 }}><Icon name="extend" size={15} color="#fff" sw={2} />Extend</button>
                <button style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#fff', border: 'none', borderRadius: T.rPill, padding: '8px 13px', cursor: 'pointer', color: T.tealDeep, fontFamily: T.font.ui, fontWeight: 700, fontSize: 12.5 }}><Icon name="arrowR" size={15} color={T.tealDeep} sw={2} />Check out</button>
              </div>
            </div>
          </Card>
        </div>
      }

      <div style={{ padding: '0 18px 20px' }}>
        {view === 'timeline' && <TimelineView T={T} go={go} onAction={(it) => setSheet({ t: it.label || it.t, it })} />}
        {view === 'calendar' && <CalendarView T={T} />}
        {view === 'agenda' && <AgendaView T={T} onAction={(it) => setSheet({ t: it.t, it })} />}
      </div>

      <Sheet T={T} open={!!sheet} onClose={() => setSheet(null)} title={sheet?.t}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[['extend', 'Extend', 'Add time to this booking'], ['edit', 'Reschedule', 'Move to another day or time'], ['refresh', 'Make recurring', 'Repeat weekly · Mon–Thu'], ['nav', 'Route here', 'Turn-by-turn to this space']].map(([ic, t, s]) =>
          <button key={t} onClick={() => setSheet(null)} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: 13, borderRadius: T.rEl, background: T.hexA(T.ink, 0.035), border: 'none', cursor: 'pointer', textAlign: 'left' }}>
              <div style={{ width: 40, height: 40, borderRadius: T.rEl, background: T.surface, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: T.shadowSm }}><Icon name={ic} size={19} color={T.primary} sw={1.9} /></div>
              <div style={{ flex: 1 }}><div style={{ fontFamily: T.font.ui, fontWeight: 700, fontSize: 14.5, color: T.ink }}>{t}</div><div style={{ fontFamily: T.font.ui, fontSize: 12.5, color: T.ink3 }}>{s}</div></div>
              <Icon name="chevR" size={18} color={T.ink3} />
            </button>
          )}
          <Btn T={T} kind="danger" full icon="close" onClick={() => setSheet(null)}>Cancel booking</Btn>
        </div>
      </Sheet>
    </div>);

}

Object.assign(window, { BookingsScreen });