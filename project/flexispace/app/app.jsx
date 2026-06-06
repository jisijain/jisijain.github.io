// app.jsx — FlexiSpace root: navigation, tab-bar variants, routing, sheets, tweaks
const { useState, useEffect, useRef } = React;

// ── Tab bar (3 nav-model variants) ─────────────────────────────
function TabBar({ T, model, active, go, onCreate }) {
  const item = (name, icon, label) => {
    const on = active === name || (name === 'home' && ['desk','rooms','parking','notifications'].includes(active) && model !== '5-tab + action' && false);
    return (
      <button key={name} onClick={() => go.tab(name)} style={{ flex: 1, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '2px 0' }}>
        <Icon name={icon} size={24} color={on ? T.primary : T.ink3} sw={on ? 2.1 : 1.8} />
        <span style={{ fontFamily: T.font.ui, fontWeight: on ? 700 : 500, fontSize: 10.5, color: on ? T.primary : T.ink3 }}>{label}</span>
      </button>
    );
  };
  const createOnFlows = ['desk','rooms','parking'].includes(active);

  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 30 }}>
      <div style={{ position: 'relative', background: T.glass, backdropFilter: 'blur(18px) saturate(180%)', WebkitBackdropFilter: 'blur(18px) saturate(180%)', borderTop: `1px solid ${T.line}`, paddingBottom: 'calc(8px + env(safe-area-inset-bottom, 0px))', paddingTop: 9 }}>
        {model === '3-tab + FAB' && (
          <button onClick={onCreate} style={{ position: 'absolute', right: 18, top: -64, width: 58, height: 58, borderRadius: 20, border: 'none', cursor: 'pointer', background: T.gradient, boxShadow: `0 10px 24px ${T.hexA(T.indigo,0.36)}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="plus" size={28} color="#fff" sw={2.4} />
          </button>
        )}
        <div style={{ display: 'flex', alignItems: 'center', padding: '0 8px' }}>
          {model === '5-tab + action' && <>
            {item('home','home','Home')}
            {item('map','map','Map')}
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
              <button onClick={onCreate} style={{ width: 54, height: 54, marginTop: -26, borderRadius: 18, border: '3px solid #fff', cursor: 'pointer', background: createOnFlows ? T.gradient : T.primary, boxShadow: `0 8px 20px ${T.hexA(T.primary,0.4)}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="plus" size={26} color="#fff" sw={2.4} />
              </button>
            </div>
            {item('bookings','calendar','Bookings')}
            {item('profile','user','Profile')}
          </>}
          {model === '4-tab' && <>
            {item('home','home','Home')}
            {item('map','map','Map')}
            {item('bookings','calendar','Bookings')}
            {item('profile','user','Profile')}
          </>}
          {model === '3-tab + FAB' && <>
            {item('home','home','Home')}
            {item('map','map','Map')}
            {item('bookings','calendar','Bookings')}
          </>}
        </div>
      </div>
    </div>
  );
}

function QuickBookSheet({ T, open, onClose, go }) {
  const acts = [
    { ic: 'chair', c: T.teal, t: 'Book a desk', s: '41 free on your floor', go: 'desk' },
    { ic: 'room', c: T.indigo, t: 'Find a meeting room', s: '4 available now', go: 'rooms' },
    { ic: 'car', c: T.electric, t: 'Reserve parking', s: '47 bays open', go: 'parking' },
    { ic: 'team', c: '#7C3AED', t: 'Locate a teammate', s: '11 people in today', go: 'map' },
  ];
  return (
    <Sheet T={T} open={open} onClose={onClose} title="Quick book">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {acts.map(a => (
          <button key={a.t} onClick={() => { onClose(); go.tab(a.go); }} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 14, borderRadius: T.rEl, background: T.hexA(a.c,0.07), border: 'none', cursor: 'pointer', textAlign: 'left' }}>
            <div style={{ width: 46, height: 46, borderRadius: T.rEl, background: T.hexA(a.c,0.14), display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={a.ic} size={23} color={a.c} sw={1.9} /></div>
            <div style={{ flex: 1 }}><div style={{ fontFamily: T.font.ui, fontWeight: 700, fontSize: 15.5, color: T.ink }}>{a.t}</div><div style={{ fontFamily: T.font.ui, fontSize: 12.5, color: T.ink3, marginTop: 1 }}>{a.s}</div></div>
            <Icon name="chevR" size={19} color={T.ink3} />
          </button>
        ))}
      </div>
    </Sheet>
  );
}

function Screens({ T, t, setTweak, initial }) {
  const [tab, setTab] = useState((initial && initial.tab) || 'home');
  const [stack, setStack] = useState((initial && initial.stack) || []);
  const [floorNum, setFloorNum] = useState(3);
  const [quick, setQuick] = useState(false);
  const [confirm, setConfirm] = useState(null);
  const [selDay, setSelDay] = useState(2);
  // shared booking schedule (date · time · recurrence) across all flows
  const [bkDate, setBkDate] = useState(window.W_TODAY || new Date(2026, 5, 5));
  const [bkIn, setBkIn] = useState(600);    // 10:00 AM
  const [bkOut, setBkOut] = useState(1140); // 07:00 PM
  const [bkRecur, setBkRecur] = useState(window.WHEN_RECUR_DEFAULT);
  const when = { date: bkDate, setDate: setBkDate, inMin: bkIn, setIn: setBkIn, outMin: bkOut, setOut: setBkOut, recur: bkRecur, setRecur: setBkRecur };
  const scrollRef = useRef(null);
  const toggleTheme = () => setTweak && setTweak('mode', t.mode === 'dark' ? 'light' : 'dark');

  const floor = window.FLOORS.find(f => f.num === floorNum) || window.FLOORS[1];

  const go = {
    tab: (name) => { setStack([]); setTab(name); setQuick(false); if (scrollRef.current) scrollRef.current.scrollTop = 0; },
    route: (name, params) => { setStack(s => [...s, { name, params }]); if (scrollRef.current) scrollRef.current.scrollTop = 0; },
    back: () => { setStack(s => s.slice(0, -1)); },
  };

  const current = stack.length ? stack[stack.length - 1] : { name: tab };

  // expose a navigation handle for embedding / capture
  const apiRef = useRef();
  apiRef.current = { go, setTab, setStack, tab, stack };
  useEffect(() => { window.__SCREENS_API = () => apiRef.current; return () => { delete window.__SCREENS_API; }; }, []);
  const openDesk = (d) => go.route('desk-detail', { deskId: d.id });
  const openRoom = (r) => go.route('room-detail', { roomId: r.id });

  // schedule lines shared by every confirmation
  const fmtRange = () => `${window.fmtMin(bkIn)} – ${window.fmtMin(bkOut)}`;
  const recurLine = () => window.whenFmt.recur(bkRecur, bkDate);
  const isRecurring = () => bkRecur && bkRecur.type !== 'none';

  const bookDesk = (d) => setConfirm({
    summary: `Desk ${d.label} on the ${floor.name} is reserved.`,
    lines: [
      ['chair','Desk',`${d.label} · ${d.team}`],
      ['calendar','Date', window.whenFmt.date(bkDate)],
      ['clock','Time', fmtRange()],
      ...(isRecurring() ? [['refresh','Repeats', recurLine()]] : []),
      ['nav','Floor',floor.name],
    ],
    route: { deskId: d.id },
  });
  const bookRoom = (info) => setConfirm({
    summary: `${info.name} is held for your meeting.`,
    lines: [
      ['room','Room',info.name],
      ['calendar','Date', window.whenFmt.date(bkDate)],
      ['clock','Time',`${info.slot>12?info.slot-12:info.slot}:00 · ${info.dur} min`],
      ...(isRecurring() ? [['refresh','Repeats', recurLine()]] : []),
      ['team','Floor',floor.name],
    ],
  });
  const bookParking = (info) => setConfirm({
    summary: `${info.name} on ${info.level} is reserved${isRecurring() ? '' : ' for the day'}.`,
    lines: [
      ['car','Bay',info.name],
      ['parking','Level',info.level],
      ['calendar','Date', window.whenFmt.date(bkDate)],
      ...(isRecurring() ? [['refresh','Repeats', recurLine()]] : []),
    ],
  });
  const onBook = (info) => { if (info.type === 'room') bookRoom(info); else if (info.type === 'parking') bookParking(info); else bookDesk(info); };

  // dynamic island time
  const screen = (() => {
    switch (current.name) {
      case 'home': return <HomeScreen T={T} go={go} floor={floor} layout={t.homeLayout} selDay={selDay} setSelDay={setSelDay} />;
      case 'map': return <MapScreen T={T} floor={floor} setFloorNum={setFloorNum} openDesk={openDesk} openRoom={openRoom} mapTweaks={{ heatmap: t.mapHeatmap, labels: t.mapLabels }} />;
      case 'desk': return <DeskScreen T={T} floor={floor} go={go} openDesk={openDesk} onBook={onBook} when={when} />;
      case 'rooms': return <RoomsScreen T={T} go={go} openRoom={openRoom} />;
      case 'parking': return <ParkingScreen T={T} go={go} onBook={onBook} when={when} />;
      case 'bookings': return <BookingsScreen T={T} go={go} />;
      case 'profile': return <ProfileScreen T={T} go={go} mode={t.mode} setMode={(v) => setTweak && setTweak('mode', v)} />;
      case 'notifications': return <NotificationsScreen T={T} go={go} />;
      case 'desk-detail': return <DeskDetail T={T} floor={floor} deskId={current.params.deskId} go={go} onBook={onBook} when={when} />;
      case 'room-detail': return <RoomDetail T={T} roomId={current.params.roomId} floor={floor} go={go} onBook={onBook} when={when} />;
      case 'route': return <RouteScreen T={T} floor={floor} deskId={current.params.deskId} go={go} />;
      default: return <HomeScreen T={T} go={go} floor={floor} layout={t.homeLayout} />;
    }
  })();

  const hideBar = ['desk-detail','room-detail','route','notifications'].includes(current.name);

  return (
    <div style={{ position: 'absolute', inset: 0, background: T.canvas, overflow: 'hidden', fontFamily: T.font.ui, zIndex: 1 }}>
      <div ref={scrollRef} style={{ position: 'absolute', inset: 0, overflowY: 'auto', overflowX: 'hidden', WebkitOverflowScrolling: 'touch', paddingBottom: hideBar ? 0 : 86 }}>
        {screen}
      </div>

      {!hideBar && <TabBar T={T} model={t.navModel} active={tab} go={go} onCreate={() => setQuick(true)} />}

      <QuickBookSheet T={T} open={quick} onClose={() => setQuick(false)} go={go} />

      <Sheet T={T} open={!!confirm} onClose={() => setConfirm(null)}>
        {confirm && <ConfirmBody T={T} info={confirm} onDone={() => { setConfirm(null); go.tab('bookings'); }} onRoute={confirm.route ? () => { const r = confirm.route; setConfirm(null); go.route('route', r); } : null} />}
      </Sheet>
    </div>
  );
}

window.Screens = Screens;
