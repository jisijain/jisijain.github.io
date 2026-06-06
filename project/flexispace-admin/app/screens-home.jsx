// screens-home.jsx — Workplace command center + layout variants
// Exposes (window): HomeScreen

const { useState: useStateH } = React;

function Greeting({ T, onProfile, onBell }) {
  const me = window.PEOPLE[0];
  const first = (me.name || 'there').split(' ')[0];
  return (
    <div style={{ padding: '52px 18px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div>
        <div style={{ fontFamily: T.font.ui, fontWeight: 700, fontSize: 25, color: T.ink, letterSpacing: '-.02em' }}>Hello, {first}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
          <Icon name="pin" size={14} color={T.primary} sw={2} />
          <span style={{ fontFamily: T.font.ui, fontSize: 13, color: T.ink2, fontWeight: 600 }}>HQ Noida · 3rd Floor</span>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 9 }}>
        <IconBtn T={T} name="bell" onClick={onBell} badge />
        <button onClick={onProfile} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}>
          <Avatar person={window.PEOPLE[0]} size={40} T={T} />
        </button>
      </div>
    </div>);

}

function DateRail({ T, sel, setSel }) {
  return (
    <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '8px 18px 4px', scrollbarWidth: 'none' }}>
      {window.WEEK.map((w) => {
        const on = w.n === sel;
        const day = window.getDay(w.n);
        const dots = Math.min(day.count, 3);
        return (
          <button key={w.n} onClick={() => setSel(w.n)} style={{
            flexShrink: 0, width: 50, padding: '10px 0', borderRadius: T.rEl, border: T.border ? `1px solid ${on ? 'transparent' : T.borderColor}` : 'none', cursor: 'pointer',
            background: on ? T.primary : T.surface, boxShadow: on ? `0 6px 14px ${T.hexA(T.primary, 0.28)}` : T.shadowSm,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3
          }}>
            <span style={{ fontFamily: T.font.ui, fontSize: 11.5, fontWeight: 600, color: on ? T.hexA('#ffffff', 0.85) : T.ink3 }}>{w.dow}</span>
            <span style={{ fontFamily: T.font.ui, fontSize: 17, fontWeight: 700, color: on ? '#fff' : w.weekend ? T.ink3 : T.ink }}>{w.n}</span>
            <div style={{ display: 'flex', gap: 2, height: 5 }}>
              {Array.from({ length: dots }).map((_, j) => <span key={j} style={{ width: 5, height: 5, borderRadius: 999, background: on ? '#fff' : T.primary }} />)}
            </div>
          </button>);

      })}
    </div>);

}

function PlanBlock({ T, go, day }) {
  const Row = ({ icon, color, title, sub, right, onClick, last }) =>
  <div onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 13, width: '100%', padding: '13px 0', borderBottom: last ? 'none' : `1px solid ${T.lineSoft}`, cursor: onClick ? 'pointer' : 'default', textAlign: 'left' }}>
      <div style={{ width: 42, height: 42, borderRadius: T.rEl, background: T.hexA(color, T.dark ? 0.2 : 0.12), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon name={icon} size={21} color={T.accent(color)} sw={1.9} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: T.font.ui, fontWeight: 700, fontSize: 14.5, color: T.ink }}>{title}</div>
        <div style={{ fontFamily: T.font.ui, fontSize: 12.5, color: T.ink3, marginTop: 1 }}>{sub}</div>
      </div>
      {right}
    </div>;


  const tagColor = day.state === 'today' ? { c: '#15803D', bg: '#DCFCE7' } :
  day.state === 'past' ? { c: T.ink3, bg: T.hexA(T.ink, 0.07) } :
  day.wfh ? { c: T.indigo, bg: T.hexA(T.indigo, 0.12) } :
  day.state === 'weekend' ? { c: T.ink3, bg: T.hexA(T.ink, 0.07) } :
  { c: T.tealDeep, bg: T.hexA(T.primary, 0.12) };
  const rows = [];
  if (day.desk) rows.push(['desk', T.teal, `Desk ${day.desk.label} · ${day.desk.floor}`, `${day.desk.from}–${day.desk.to}`, 'route', { deskId: day.desk.id }]);
  if (day.parking) rows.push(['car', T.electric, `Parking ${day.parking.slot} · ${day.parking.level}`, `${day.parking.zone} · ${day.parking.from}–${day.parking.to}`, 'parking']);
  day.meetings.forEach((m) => rows.push(['room', T.indigo, m.title, `${m.room} · ${m.from}–${m.to}`, 'room', { roomId: 'r1' }]));
  day.events.forEach((e) => rows.push(['star', '#F59E0B', e.title, `${e.room} · ${e.from}–${e.to}`, 'room', { roomId: 'r6' }]));

  return (
    <Card T={T} pad={18} elevate>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: rows.length ? 4 : 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: T.font.ui, fontWeight: 700, fontSize: 17.5, color: T.ink }}>{day.today ? "Today's plan" : `${day.label.split(' ').slice(0, 2).join(' ')}`}</span>
          <span style={{ fontFamily: T.font.mono, fontSize: 10.5, color: tagColor.c, background: tagColor.bg, padding: '3px 8px', borderRadius: 999, fontWeight: 600, textTransform: 'uppercase' }}>{day.tag}</span>
        </div>
        <button onClick={() => go.tab('bookings')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.link, fontFamily: T.font.ui, fontWeight: 600, fontSize: 13 }}>Manage</button>
      </div>
      {rows.length === 0 ?
      <div style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '8px 0 4px' }}>
          <div style={{ width: 42, height: 42, borderRadius: T.rEl, background: T.hexA(day.wfh ? T.indigo : T.ink, 0.10), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name={day.wfh ? 'home' : 'calendar'} size={21} color={day.wfh ? T.indigo : T.ink3} sw={1.9} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: T.font.ui, fontWeight: 600, fontSize: 14, color: T.ink }}>{day.wfh ? 'Working from home' : day.state === 'weekend' ? 'Weekend — office closed' : 'Nothing booked yet'}</div>
            <div style={{ fontFamily: T.font.ui, fontSize: 12.5, color: T.ink3, marginTop: 1 }}>{day.wfh ? 'No desk or parking needed' : day.state === 'weekend' ? 'Enjoy your weekend' : 'Plan this day in a tap'}</div>
          </div>
          {day.state !== 'weekend' && !day.wfh && <Btn T={T} size="sm" onClick={() => go.tab('desk')}>Plan</Btn>}
        </div> :
      rows.map((r, i) =>
      <Row key={i} icon={r[0]} color={r[1]} title={r[2]} sub={r[3]} last={i === rows.length - 1}
      onClick={r[4] === 'parking' ? () => go.tab('parking') : r[4] === 'room' ? () => go.route('room-detail', r[5]) : () => go.route('desk-detail', { deskId: day.desk.id })}
      right={r[4] === 'route' ?
      <button onClick={(e) => {e.stopPropagation();go.route('route', r[5]);}} style={{ display: 'flex', alignItems: 'center', gap: 5, background: T.hexA(T.primary, 0.1), border: 'none', borderRadius: T.rPill, padding: '7px 11px', cursor: 'pointer', color: T.tealDeep, fontFamily: T.font.ui, fontWeight: 600, fontSize: 12 }}><Icon name="nav" size={13} color={T.tealDeep} sw={2} />Route</button> :
      <Icon name="chevR" size={18} color={T.ink3} />} />
      )}
    </Card>);

}

function QuickActions({ T, go }) {
  const acts = [
  { icon: 'chair', label: 'Book desk', color: T.teal, on: () => go.tab('desk') },
  { icon: 'room', label: 'Meeting room', color: T.indigo, on: () => go.tab('rooms') },
  { icon: 'car', label: 'Parking', color: T.electric, on: () => go.tab('parking') },
  { icon: 'team', label: 'Locate team', color: '#7C3AED', on: () => go.tab('map') }];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 9 }}>
      {acts.map((a) =>
      <button key={a.label} onClick={a.on} style={{ background: T.surface, border: T.border ? `1px solid ${T.borderColor}` : 'none', borderRadius: T.rEl + 2, padding: '14px 6px 11px', cursor: 'pointer', boxShadow: T.shadowSm, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 44, height: 44, borderRadius: 999, background: T.hexA(a.color, T.dark ? 0.2 : 0.12), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name={a.icon} size={22} color={T.accent(a.color)} sw={1.9} />
          </div>
          <span style={{ fontFamily: T.font.ui, fontWeight: 600, fontSize: 11.5, color: T.ink2, textAlign: 'center', lineHeight: 1.2 }}>{a.label}</span>
        </button>
      )}
    </div>);

}

function SnapshotBlock({ T, go, day }) {
  const s = day && day.snapshot || window.DATA.SNAPSHOT;
  return (
    <Card T={T} pad={16}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <span style={{ fontFamily: T.font.ui, fontWeight: 700, fontSize: 15.5, color: T.ink }}>{day && !day.today ? 'Availability' : 'Live availability'}</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: T.font.mono, fontSize: 10.5, color: T.ink3 }}>
          {day && !day.today ?
          <span style={{ textTransform: 'uppercase', letterSpacing: '.04em' }}>{day.label}</span> :
          <><span style={{ width: 7, height: 7, borderRadius: 999, background: '#16A34A', boxShadow: '0 0 0 3px rgba(22,163,74,.16)' }} />UPDATED 1m AGO</>}
        </span>
      </div>
      <div style={{ display: 'flex', gap: 18 }}>
        <Stat T={T} value={s.desks.free} total={s.desks.total} label="Desks" icon="chair" color={T.teal} />
        <div style={{ width: 1, background: T.lineSoft }} />
        <Stat T={T} value={s.rooms.free} total={s.rooms.total} label="Rooms" icon="room" color={T.indigo} />
        <div style={{ width: 1, background: T.lineSoft }} />
        <Stat T={T} value={s.parking.free} total={s.parking.total} label="Parking" icon="car" color={T.electric} />
      </div>
    </Card>);

}

function PresenceBlock({ T, go }) {
  const here = window.PEOPLE.filter((p) => p.here && p.id !== 'me');
  const byTeam = {};
  here.forEach((p) => {byTeam[p.team] = (byTeam[p.team] || 0) + 1;});
  const shown = here.slice(0, 6);
  const extra = here.length - shown.length;
  return (
    <Card T={T} pad={16} onClick={() => go.tab('map')}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 13 }}>
        <span style={{ fontFamily: T.font.ui, fontWeight: 700, fontSize: 15.5, color: T.ink }}>Your team is in</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: T.font.ui, fontWeight: 600, fontSize: 12.5, color: T.ink3 }}>{here.length} today<Icon name="chevR" size={17} color={T.ink3} /></span>
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        {shown.map((p) =>
        <div key={p.id} style={{ textAlign: 'center', width: 40 }}>
            <Avatar person={p} size={40} T={T} />
            <div style={{ fontFamily: T.font.ui, fontSize: 10, color: T.ink3, marginTop: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name.split(' ')[0]}</div>
          </div>
        )}
        {extra > 0 &&
        <div style={{ width: 40, textAlign: 'center' }}>
            <div style={{ width: 40, height: 40, borderRadius: 999, background: T.hexA(T.ink, T.dark ? 0.12 : 0.06), display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: T.font.ui, fontWeight: 700, fontSize: 13, color: T.ink2 }}>+{extra}</div>
            <div style={{ fontFamily: T.font.ui, fontSize: 10, color: T.ink3, marginTop: 4 }}>more</div>
          </div>
        }
      </div>
      <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
        {Object.entries(byTeam).map(([tm, n]) => {
          const tc = window.TEAMS[tm].color;
          return (
            <span key={tm} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 11px', borderRadius: 999, background: T.hexA(tc, T.dark ? 0.18 : 0.10), fontFamily: T.font.ui, fontWeight: 600, fontSize: 12, color: T.accent(tc) }}>
              <span style={{ width: 7, height: 7, borderRadius: 999, background: T.accent(tc) }} />{tm} {n}
            </span>);

        })}
      </div>
    </Card>);

}

function RecoBlock({ T, go }) {
  const recos = [
  { icon: 'chair', color: T.teal, title: 'Desk D7 — by the Design pod', sub: 'Window seat · near Aarav & Sara', cta: 'Book', on: () => go.route('desk-detail', { deskId: '3-D2' }) },
  { icon: 'room', color: T.indigo, title: 'Bada Pav free 12:00–13:00', sub: 'Fits your 1:1 with Vikram', cta: 'Hold', on: () => go.route('room-detail', { roomId: 'r4' }) },
  { icon: 'car', color: T.electric, title: 'EV bay E-04 open', sub: 'Matches your Nexon EV', cta: 'Reserve', on: () => go.tab('parking') }];

  return (
    <div style={{ padding: '0 18px' }}>
      <SectionLabel T={T}>Smart suggestions</SectionLabel>
      <div style={{ display: 'flex', gap: 12, overflowX: 'auto', padding: '0 18px 4px', margin: '0 -18px', scrollbarWidth: 'none' }}>
        {recos.map((r, i) =>
        <div key={i} style={{ flexShrink: 0, width: 232 }}>
            <Card T={T} pad={15}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 999, background: T.hexA(r.color, T.dark ? 0.2 : 0.12), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name={r.icon} size={17} color={T.accent(r.color)} sw={2} />
                </div>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: T.font.mono, fontSize: 9.5, color: T.accent(T.indigo), fontWeight: 600, letterSpacing: '.04em' }}><Icon name="spark" size={12} color={T.accent(T.indigo)} sw={2} />FOR YOU</span>
              </div>
              <div style={{ fontFamily: T.font.ui, fontWeight: 700, fontSize: 14, color: T.ink, lineHeight: 1.3 }}>{r.title}</div>
              <div style={{ fontFamily: T.font.ui, fontSize: 12.5, color: T.ink3, marginTop: 3, lineHeight: 1.35 }}>{r.sub}</div>
              <Btn T={T} size="sm" kind="soft" full onClick={r.on} style={{ marginTop: 12 }}>{r.cta}</Btn>
            </Card>
          </div>
        )}
      </div>
    </div>);

}

function MapPeek({ T, go, floor }) {
  return (
    <Card T={T} pad={0} onClick={() => go.tab('map')} style={{ overflow: 'hidden' }}>
      <div style={{ position: 'relative' }}>
        <div style={{ pointerEvents: 'none' }}>
          <FloorMap T={T} floor={floor} presence labels={false} height={170} interactive={false} />
        </div>
        <div style={{ position: 'absolute', left: 14, bottom: 12, display: 'flex', alignItems: 'center', gap: 8, padding: '8px 13px', borderRadius: 999, background: T.hexA('#ffffff', 0.92), backdropFilter: 'blur(6px)', boxShadow: T.shadowSm }}>
          <Icon name="map" size={17} color={T.primary} sw={2} />
          <span style={{ ...{ fontFamily: T.font.ui, fontWeight: 700, fontSize: 13.5, color: T.ink }, color: "rgb(14, 156, 142)" }}>Explore floor map</span>
        </div>
        <div style={{ position: 'absolute', right: 14, bottom: 12 }}>
          <Icon name="chevR" size={20} color={T.ink} />
        </div>
      </div>
    </Card>);

}

function HomeScreen({ T, go, floor, layout, selDay, setSelDay }) {
  const sec = (node, key) => <div key={key} style={{ padding: '0 18px' }}>{node}</div>;
  const gap = (h = 18) => <div style={{ height: h }} />;
  const day = window.getDay(selDay || 2);

  const blocks = {
    plan: <PlanBlock T={T} go={go} day={day} />,
    actions: <QuickActions T={T} go={go} />,
    snapshot: <SnapshotBlock T={T} go={go} day={day} />,
    presence: <PresenceBlock T={T} go={go} />,
    map: <MapPeek T={T} go={go} floor={floor} />
  };

  let order;
  if (layout === 'Snapshot-first') order = ['snapshot', 'actions', 'plan', 'presence', 'map'];else
  if (layout === 'Actions-first') order = ['actions', 'plan', 'snapshot', 'map', 'presence'];else
  order = ['plan', 'actions', 'snapshot', 'presence', 'map']; // Plan-first (default)

  return (
    <div style={{ paddingBottom: 14 }}>
      <Greeting T={T} onProfile={() => go.tab('profile')} onBell={() => go.route('notifications')} />
      <DateRail T={T} sel={selDay || 2} setSel={setSelDay} />
      {gap(12)}
      {order.map((k, i) =>
      <React.Fragment key={k}>
          {sec(blocks[k], k)}
          {i < order.length - 1 && gap()}
        </React.Fragment>
      )}
      {gap(20)}
      <RecoBlock T={T} go={go} />
    </div>);

}

Object.assign(window, { HomeScreen });