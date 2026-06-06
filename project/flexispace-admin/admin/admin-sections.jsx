// admin-sections.jsx — Floors, Rooms, Bookings, People, Parking, Analytics, Settings
// Exposes (window): FloorsSection, RoomsSection, BookingsSection, PeopleSection,
//   ParkingSection, AnalyticsSection, SettingsSection

const { useState: useStateSec } = React;

// ── shared: section intro reused inside panels ─────────────────
function MiniLegend({ T }) {
  const ss = T.seatSystem.states;
  const items = [['available', 'Available'], ['booked', 'Booked'], ['mine', 'Assigned'], ['vip', 'Executive'], ['maintenance', 'Maintenance']];
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 14px' }}>
      {items.map(([k, lbl]) => (
        <span key={k} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: T.font.ui, fontSize: 12, color: T.ink2, fontWeight: 600 }}>
          <span style={{ width: 10, height: 10, borderRadius: 3, background: ss[k].fill }} />{lbl}
        </span>
      ))}
    </div>
  );
}

// ═══ FLOORS ════════════════════════════════════════════════════
function SelDetailCard({ T, floor, selDesk, selRoom }) {
  if (selDesk) {
    const d = floor.desks.find((x) => x.id === selDesk);
    if (!d) return null;
    const m = window.deskMeta(d, T);
    const sm = T.statusMeta[d.status];
    const occ = d.occupant ? window.PEOPLE.find((p) => p.id === d.occupant) : null;
    return (
      <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 13, padding: 13, borderRadius: T.rEl, background: T.hexA(T.ink, T.dark ? 0.04 : 0.03), border: `1px solid ${T.lineSoft}` }}>
        <div style={{ width: 44, height: 44, borderRadius: T.rEl, background: m.soft, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icon name="chair" size={22} color={m.text} sw={1.9} /></div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: T.font.ui, fontWeight: 700, fontSize: 15, color: T.ink }}>Desk {d.label} · {d.team}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
            <StatusDot T={T} status={d.status} /><span style={{ fontFamily: T.font.ui, fontSize: 12.5, color: m.text, fontWeight: 600 }}>{sm.name}</span>
            {occ && <span style={{ fontFamily: T.font.ui, fontSize: 12.5, color: T.ink3 }}>· {occ.name}</span>}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{ padding: '8px 13px', borderRadius: T.rPill, border: `1px solid ${T.line}`, background: 'transparent', cursor: 'pointer', fontFamily: T.font.ui, fontWeight: 600, fontSize: 12.5, color: T.ink }}>Flag</button>
          <button style={{ padding: '8px 13px', borderRadius: T.rPill, border: 'none', background: T.primary, cursor: 'pointer', fontFamily: T.font.ui, fontWeight: 700, fontSize: 12.5, color: '#fff' }}>Reassign</button>
        </div>
      </div>
    );
  }
  if (selRoom) {
    const r = selRoom;
    const sc = r.status === 'available' ? 'avail' : r.status === 'soon' ? 'warn' : 'crit';
    const c = cKey(T, sc);
    const lbl = r.status === 'available' ? 'Available' : r.status === 'soon' ? 'Free soon' : 'In use';
    return (
      <div style={{ marginTop: 14, padding: 14, borderRadius: T.rEl, background: T.hexA(c, T.dark ? 0.1 : 0.07), border: `1px solid ${T.hexA(c, 0.35)}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: T.rEl, background: T.hexA(c, T.dark ? 0.2 : 0.14), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icon name="room" size={22} color={c} sw={1.9} /></div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: T.font.ui, fontWeight: 700, fontSize: 15.5, color: T.ink }}>{r.name}</div>
            <div style={{ fontFamily: T.font.ui, fontSize: 12.5, color: T.ink3, marginTop: 1 }}>{r.floor}rd Floor · {r.zone} · {r.seats} seats</div>
          </div>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 11px', borderRadius: 999, background: T.hexA(c, T.dark ? 0.2 : 0.14), fontFamily: T.font.ui, fontWeight: 600, fontSize: 12, color: T.accent ? T.accent(c) : c }}>
            <span style={{ width: 6, height: 6, borderRadius: 999, background: c }} />{lbl}
          </span>
        </div>
        <div style={{ marginTop: 12 }}><Amen T={T} items={r.amen.slice(0, 5)} size="sm" /></div>
      </div>
    );
  }
  return (
    <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 9, padding: '11px 14px', borderRadius: T.rEl, background: T.hexA(T.ink, T.dark ? 0.04 : 0.03) }}>
      <Icon name="nav" size={16} color={T.ink3} sw={1.9} />
      <span style={{ fontFamily: T.font.ui, fontSize: 12.5, color: T.ink3, fontWeight: 600 }}>Drag to orbit · scroll to zoom · click a desk or room to inspect</span>
    </div>
  );
}

function FloorsSection({ T, narrow }) {
  const [fi, setFi] = useStateSec(1);
  const [selDesk, setSelDesk] = useStateSec(null);
  const [selRoom, setSelRoom] = useStateSec(null);
  const floor = window.FLOORS[fi];
  const counts = floor.desks.reduce((a, d) => { a[d.status] = (a[d.status] || 0) + 1; return a; }, {});
  const maint = floor.desks.filter((d) => d.status === 'maintenance');
  const roomStatus = { available: ['avail', 'Available'], soon: ['warn', 'Free soon'], busy: ['crit', 'In use'] };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <Seg T={T} value={String(fi)} onChange={(v) => { setFi(Number(v)); setSelDesk(null); setSelRoom(null); }} options={window.FLOORS.map((f, i) => ({ value: String(i), label: f.name.replace(' Floor', 'F') }))} />
        <div style={{ marginLeft: 'auto' }}><MiniLegend T={T} /></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: narrow ? '1fr' : 'minmax(0, 1.55fr) minmax(0, 1fr)', gap: 18, alignItems: 'start' }}>
        <Panel T={T}>
          <PanelHead T={T} title={`${floor.name} · 3D floor plan`} sub={`${floor.desks.length} desks · ${floor.rooms.length} meeting rooms`} icon="map" color="teal"
            right={<button style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 13px', borderRadius: T.rPill, border: 'none', background: T.primary, cursor: 'pointer', fontFamily: T.font.ui, fontWeight: 700, fontSize: 12.5, color: '#fff' }}><Ic name="edit" size={15} color="#fff" sw={2} />Edit layout</button>} />
          <FloorMap T={T} floor={floor} selected={selDesk}
            onSelect={(d) => { setSelDesk(d.id); setSelRoom(null); }}
            onSelectRoom={(rm) => { setSelRoom(rm); setSelDesk(null); }}
            presence labels height={narrow ? 420 : 520} />
          <SelDetailCard T={T} floor={floor} selDesk={selDesk} selRoom={selRoom} />
        </Panel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <Panel T={T}>
            <PanelHead T={T} title="Desk inventory" icon="chair" color="teal" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[['available', 'Available', 'avail'], ['booked', 'Booked', 'indigo'], ['mine', 'Assigned', 'teal'], ['maintenance', 'Maintenance', 'warn']].map(([k, lbl, col]) => (
                <div key={k} style={{ background: T.hexA(cKey(T, col), T.dark ? 0.12 : 0.08), borderRadius: T.rEl, padding: '13px 14px' }}>
                  <div style={{ fontFamily: T.font.ui, fontWeight: 800, fontSize: 24, color: T.ink, letterSpacing: '-.02em' }}>{counts[k] || 0}</div>
                  <div style={{ fontFamily: T.font.ui, fontSize: 12, color: T.ink2, fontWeight: 600, marginTop: 2 }}>{lbl}</div>
                </div>
              ))}
            </div>
          </Panel>
          <Panel T={T}>
            <PanelHead T={T} title="Meeting rooms" sub="Click to locate on map" icon="room" color="indigo" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {floor.rooms.map((r, i) => {
                const [sc, sl] = roomStatus[r.status] || roomStatus.available;
                const c = cKey(T, sc);
                const on = selRoom && selRoom.id === r.id;
                return (
                  <button key={r.id} onClick={() => { setSelRoom(r); setSelDesk(null); }} style={{
                    display: 'flex', alignItems: 'center', gap: 11, padding: '10px 11px', borderRadius: T.rEl, cursor: 'pointer', textAlign: 'left',
                    background: on ? T.hexA(T.indigo, T.dark ? 0.16 : 0.1) : 'transparent', border: on ? `1px solid ${T.hexA(T.indigo, 0.4)}` : '1px solid transparent',
                  }}>
                    <div style={{ width: 32, height: 32, borderRadius: 9, background: T.hexA(c, T.dark ? 0.18 : 0.12), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icon name="room" size={17} color={c} sw={1.9} /></div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: T.font.ui, fontWeight: 600, fontSize: 13.5, color: T.ink }}>{r.name}</div>
                      <div style={{ fontFamily: T.font.ui, fontSize: 11.5, color: T.ink3 }}>{r.zone} · {r.seats} seats</div>
                    </div>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: T.font.ui, fontSize: 11.5, fontWeight: 600, color: T.accent ? T.accent(c) : c }}>
                      <span style={{ width: 6, height: 6, borderRadius: 999, background: c }} />{sl}
                    </span>
                  </button>
                );
              })}
            </div>
          </Panel>
          <Panel T={T}>
            <PanelHead T={T} title="Maintenance queue" icon="flag" color="warn"
              right={<span style={{ fontFamily: T.font.ui, fontWeight: 700, fontSize: 12, color: cKey(T, 'warn'), background: T.hexA(cKey(T, 'warn'), 0.14), padding: '3px 9px', borderRadius: 999 }}>{maint.length}</span>} />
            {maint.length ? maint.slice(0, 5).map((d, i) => (
              <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '10px 0', borderBottom: i < Math.min(maint.length, 5) - 1 ? `1px solid ${T.lineSoft}` : 'none' }}>
                <div style={{ width: 32, height: 32, borderRadius: 9, background: T.hexA(cKey(T, 'warn'), 0.14), display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Ic name="desk" size={17} color={cKey(T, 'warn')} sw={1.9} /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: T.font.ui, fontWeight: 600, fontSize: 13, color: T.ink }}>Desk {d.label} · {d.zone}</div>
                  <div style={{ fontFamily: T.font.ui, fontSize: 11.5, color: T.ink3 }}>Out of service</div>
                </div>
                <button onClick={() => { setSelDesk(d.id); setSelRoom(null); }} style={{ padding: '6px 11px', borderRadius: T.rPill, border: `1px solid ${T.line}`, background: 'transparent', cursor: 'pointer', fontFamily: T.font.ui, fontWeight: 600, fontSize: 12, color: T.ink }}>Locate</button>
              </div>
            )) : <div style={{ fontFamily: T.font.ui, fontSize: 13, color: T.ink3, padding: '6px 0' }}>All desks operational.</div>}
          </Panel>
        </div>
      </div>
    </div>
  );
}

// ═══ ROOMS ═════════════════════════════════════════════════════
function RoomsSection({ T, narrow }) {
  const statusMap = { available: ['avail', 'Available'], soon: ['warn', 'Free soon'], busy: ['crit', 'In use'] };
  return (
    <div style={{ display: 'grid', gridTemplateColumns: narrow ? '1fr' : 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16, alignItems: 'start' }}>
      {window.ROOMS.map((r) => {
        const [sc, sl] = statusMap[r.status] || statusMap.available;
        const c = cKey(T, sc);
        const util = Math.round(r.pop * 100);
        return (
          <Panel T={T} key={r.id}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
              <div>
                <div style={{ fontFamily: T.font.ui, fontWeight: 700, fontSize: 16, color: T.ink }}>{r.name}</div>
                <div style={{ fontFamily: T.font.ui, fontSize: 12.5, color: T.ink3, marginTop: 2 }}>{r.floor}rd Floor · {r.zone}</div>
              </div>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 999, background: T.hexA(c, T.dark ? 0.18 : 0.12), fontFamily: T.font.ui, fontWeight: 600, fontSize: 12, color: T.accent ? T.accent(c) : c }}>
                <span style={{ width: 6, height: 6, borderRadius: 999, background: c }} />{sl}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 18, marginBottom: 14 }}>
              <div>
                <div style={{ fontFamily: T.font.ui, fontWeight: 700, fontSize: 18, color: T.ink }}>{r.seats}</div>
                <div style={{ fontFamily: T.font.mono, fontSize: 10, color: T.ink3, textTransform: 'uppercase', letterSpacing: '.04em' }}>Seats</div>
              </div>
              <div style={{ width: 1, background: T.lineSoft }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontFamily: T.font.ui, fontWeight: 700, fontSize: 18, color: T.ink }}>{util}%</span>
                  <span style={{ fontFamily: T.font.mono, fontSize: 10, color: T.ink3, textTransform: 'uppercase', letterSpacing: '.04em' }}>This week</span>
                </div>
                <div style={{ height: 7, borderRadius: 999, background: T.hexA(T.indigo, T.dark ? 0.16 : 0.12), overflow: 'hidden', marginTop: 7 }}>
                  <div style={{ width: `${util}%`, height: '100%', borderRadius: 999, background: cKey(T, 'indigo') }} />
                </div>
              </div>
            </div>
            <Amen T={T} items={r.amen.slice(0, 4)} size="sm" />
          </Panel>
        );
      })}
    </div>
  );
}

// ═══ BOOKINGS ══════════════════════════════════════════════════
const BK_ROWS = (() => {
  const types = ['desk', 'room', 'park'];
  const statuses = ['checked-in', 'confirmed', 'no-show', 'confirmed', 'pending', 'confirmed'];
  const res = { desk: ['Desk 55A', 'Desk 12C', 'Desk 30B', 'Desk 07A', 'Desk 41C'], room: ['Chai Biskut', 'Poha Jalebi', 'Bada Pav', 'Dabeli Den'], park: ['Bay 2V · B1', 'EV E-04 · B1', 'Bay 9V · B2'] };
  const days = ['Today', 'Today', 'Tomorrow', 'Wed 3 Jun', 'Thu 4 Jun'];
  const out = [];
  window.PEOPLE.forEach((p, i) => {
    const ty = types[i % 3];
    out.push({ who: p.id, type: ty, resource: res[ty][i % res[ty].length], floor: ty === 'park' ? 'Parking' : `${3 + (i % 2)}rd Floor`, day: days[i % days.length], time: ['09:30', '10:00', '11:00', '14:00', '16:00'][i % 5], status: statuses[i % statuses.length] });
  });
  return out;
})();

function BookingsSection({ T, narrow }) {
  const [filter, setFilter] = useStateSec('all');
  const [q, setQ] = useStateSec('');
  const rows = BK_ROWS.filter((r) => (filter === 'all' || r.type === filter) && (!q || (window.PEOPLE.find((p) => p.id === r.who)?.name || '').toLowerCase().includes(q.toLowerCase())));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: 200, maxWidth: 360 }}><SearchBar T={T} value={q} onChange={setQ} placeholder="Search people or resources…" /></div>
        <Seg T={T} value={filter} onChange={setFilter} options={[{ value: 'all', label: 'All' }, { value: 'desk', label: 'Desks' }, { value: 'room', label: 'Rooms' }, { value: 'park', label: 'Parking' }]} />
        <button style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 14px', borderRadius: T.rPill, border: 'none', background: T.primary, cursor: 'pointer', fontFamily: T.font.ui, fontWeight: 700, fontSize: 13, color: '#fff' }}><Ic name="plus" size={16} color="#fff" sw={2.2} />New booking</button>
      </div>
      <Panel T={T}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.3fr 0.9fr 0.9fr 0.7fr 1fr', gap: 10, padding: '0 0 12px', borderBottom: `1px solid ${T.line}` }}>
          {['Person', 'Resource', 'Floor', 'Day', 'Time', 'Status'].map((h) => <span key={h} style={{ fontFamily: T.font.mono, fontSize: 10, color: T.ink3, textTransform: 'uppercase', letterSpacing: '.05em' }}>{h}</span>)}
        </div>
        {rows.map((a, i) => {
          const p = window.PEOPLE.find((x) => x.id === a.who) || window.PEOPLE[0];
          const tIcon = { desk: 'chair', room: 'room', park: 'car' }[a.type];
          const tColor = { desk: T.teal, room: T.indigo, park: T.electric }[a.type];
          return (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.3fr 0.9fr 0.9fr 0.7fr 1fr', gap: 10, alignItems: 'center', padding: '12px 0', borderBottom: i < rows.length - 1 ? `1px solid ${T.lineSoft}` : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                <Avatar person={p} size={32} T={T} />
                <div style={{ minWidth: 0 }}><div style={{ fontFamily: T.font.ui, fontWeight: 600, fontSize: 13.5, color: T.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div><div style={{ fontFamily: T.font.ui, fontSize: 11.5, color: T.ink3 }}>{p.team}</div></div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                <div style={{ width: 26, height: 26, borderRadius: 8, background: T.hexA(tColor, T.dark ? 0.2 : 0.12), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Ic name={tIcon} size={15} color={T.accent ? T.accent(tColor) : tColor} sw={1.9} /></div>
                <span style={{ fontFamily: T.font.ui, fontWeight: 600, fontSize: 13, color: T.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.resource}</span>
              </div>
              <span style={{ fontFamily: T.font.ui, fontSize: 12.5, color: T.ink2 }}>{a.floor}</span>
              <span style={{ fontFamily: T.font.ui, fontSize: 12.5, color: T.ink2 }}>{a.day}</span>
              <span style={{ fontFamily: T.font.mono, fontSize: 12.5, color: T.ink2 }}>{a.time}</span>
              <div style={{ justifySelf: 'start' }}><StatusPill T={T} status={a.status} /></div>
            </div>
          );
        })}
      </Panel>
    </div>
  );
}

// ═══ PEOPLE ════════════════════════════════════════════════════
const ROLE_OF = (i) => i === 0 ? ['Workplace admin', 'crit'] : i < 3 ? ['Team manager', 'indigo'] : ['Member', 'teal'];
function PeopleSection({ T, narrow }) {
  const [q, setQ] = useStateSec('');
  const list = window.PEOPLE.filter((p) => !q || p.name.toLowerCase().includes(q.toLowerCase()) || p.team.toLowerCase().includes(q.toLowerCase()));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: 200, maxWidth: 360 }}><SearchBar T={T} value={q} onChange={setQ} placeholder="Search directory…" /></div>
        <span style={{ fontFamily: T.font.ui, fontSize: 13, color: T.ink3, fontWeight: 600 }}>{list.length} people</span>
        <button style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 14px', borderRadius: T.rPill, border: 'none', background: T.primary, cursor: 'pointer', fontFamily: T.font.ui, fontWeight: 700, fontSize: 13, color: '#fff' }}><Ic name="plus" size={16} color="#fff" sw={2.2} />Invite</button>
      </div>
      <Panel T={T}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 0.9fr 1fr', gap: 10, padding: '0 0 12px', borderBottom: `1px solid ${T.line}` }}>
          {['Name', 'Team', 'Role', 'Status', 'Permission'].map((h) => <span key={h} style={{ fontFamily: T.font.mono, fontSize: 10, color: T.ink3, textTransform: 'uppercase', letterSpacing: '.05em' }}>{h}</span>)}
        </div>
        {list.map((p, i) => {
          const [role, rc] = ROLE_OF(i);
          const c = cKey(T, rc);
          return (
            <div key={p.id} style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 0.9fr 1fr', gap: 10, alignItems: 'center', padding: '11px 0', borderBottom: i < list.length - 1 ? `1px solid ${T.lineSoft}` : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 11, minWidth: 0 }}>
                <Avatar person={p} size={34} T={T} />
                <span style={{ fontFamily: T.font.ui, fontWeight: 600, fontSize: 13.5, color: T.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</span>
              </div>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: T.font.ui, fontSize: 12.5, color: T.ink2, fontWeight: 600 }}><span style={{ width: 7, height: 7, borderRadius: 999, background: window.TEAMS[p.team].color }} />{p.team}</span>
              <span style={{ fontFamily: T.font.ui, fontSize: 12.5, color: T.ink2 }}>{p.role}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: T.font.ui, fontSize: 12.5, color: p.here ? cKey(T, 'avail') : T.ink3, fontWeight: 600 }}>
                <span style={{ width: 7, height: 7, borderRadius: 999, background: p.here ? cKey(T, 'avail') : T.ink3 }} />{p.here ? 'On-site' : 'Remote'}
              </span>
              <span style={{ justifySelf: 'start', fontFamily: T.font.ui, fontWeight: 600, fontSize: 12, color: T.accent ? T.accent(c) : c, background: T.hexA(c, T.dark ? 0.18 : 0.12), padding: '4px 10px', borderRadius: 999 }}>{role}</span>
            </div>
          );
        })}
      </Panel>
    </div>
  );
}

// ═══ PARKING ═══════════════════════════════════════════════════
function ParkingSection({ T, narrow }) {
  const kindIcon = { reserved: 'shield', general: 'car', ev: 'ev', a11y: 'a11y', visitor: 'door', bike: 'bike' };
  return (
    <div style={{ display: 'grid', gridTemplateColumns: narrow ? '1fr' : 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16, alignItems: 'start' }}>
      {window.ADMIN.PARK_ZONES.map((z) => {
        const used = z.total - z.free;
        const pct = Math.round((used / z.total) * 100);
        const c = pct > 85 ? cKey(T, 'crit') : pct > 65 ? cKey(T, 'warn') : cKey(T, 'avail');
        return (
          <Panel T={T} key={z.id}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: 11, background: T.hexA(T.electric, T.dark ? 0.2 : 0.12), display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Ic name={kindIcon[z.kind] || 'car'} size={21} color={T.accent ? T.accent(T.electric) : T.electric} sw={1.9} /></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: T.font.ui, fontWeight: 700, fontSize: 15, color: T.ink }}>{z.name}</div>
                <div style={{ fontFamily: T.font.ui, fontSize: 12, color: T.ink3 }}>{z.total} bays</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontFamily: T.font.ui, fontWeight: 800, fontSize: 26, color: T.ink, letterSpacing: '-.02em' }}>{used}<span style={{ fontSize: 15, color: T.ink3, fontWeight: 700 }}>/{z.total}</span></span>
              <span style={{ fontFamily: T.font.ui, fontWeight: 700, fontSize: 14, color: c }}>{pct}%</span>
            </div>
            <div style={{ height: 9, borderRadius: 999, background: T.hexA(c, T.dark ? 0.16 : 0.12), overflow: 'hidden' }}>
              <div style={{ width: `${pct}%`, height: '100%', borderRadius: 999, background: c }} />
            </div>
            <div style={{ fontFamily: T.font.ui, fontSize: 12, color: T.ink3, marginTop: 9 }}>{z.free} bays free now</div>
          </Panel>
        );
      })}
    </div>
  );
}

// ═══ ANALYTICS ═════════════════════════════════════════════════
function AnalyticsSection({ T, narrow }) {
  const weekItems = window.ADMIN.WEEKLY.map((w) => ({ label: w.day, value: w.pct, color: 'teal', display: `${w.ppl}` }));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'grid', gridTemplateColumns: narrow ? '1fr' : 'repeat(3, 1fr)', gap: 14 }}>
        {[['Avg. weekly occupancy', '61%', '+4 vs last month', 'teal', 'trend'], ['Booking utilization', '83%', 'of confirmed used', 'indigo', 'gauge'], ['Cost per seat / mo', '₹4,210', '-6% via right-sizing', 'electric', 'building']].map(([l, v, s, col, ic], i) => (
          <Panel T={T} key={i} pad={18}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: T.hexA(cKey(T, col), T.dark ? 0.2 : 0.12), display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Ic name={ic} size={18} color={T.accent ? T.accent(cKey(T, col)) : cKey(T, col)} sw={1.9} /></div>
              <span style={{ fontFamily: T.font.ui, fontWeight: 600, fontSize: 13, color: T.ink2 }}>{l}</span>
            </div>
            <div style={{ fontFamily: T.font.ui, fontWeight: 800, fontSize: 30, color: T.ink, letterSpacing: '-.02em' }}>{v}</div>
            <div style={{ fontFamily: T.font.ui, fontSize: 12.5, color: T.ink3, marginTop: 4 }}>{s}</div>
          </Panel>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: narrow ? '1fr' : 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: 18, alignItems: 'start' }}>
        <Panel T={T}>
          <PanelHead T={T} title="Daily attendance" sub="This week · headcount on-site" icon="trend" color="teal"
            right={<button style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 13px', borderRadius: T.rPill, border: `1px solid ${T.line}`, background: 'transparent', cursor: 'pointer', fontFamily: T.font.ui, fontWeight: 600, fontSize: 12.5, color: T.ink }}><Ic name="download" size={15} color={T.ink2} sw={2} />Export CSV</button>} />
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, height: 220, padding: '8px 0' }}>
            {window.ADMIN.WEEKLY.map((w, i) => {
              const max = 330;
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, height: '100%', justifyContent: 'flex-end' }}>
                  <span style={{ fontFamily: T.font.ui, fontWeight: 700, fontSize: 13, color: T.ink }}>{w.ppl}</span>
                  <div style={{ width: '100%', maxWidth: 56, height: `${(w.ppl / max) * 100}%`, borderRadius: `${T.rEl}px ${T.rEl}px 4px 4px`, background: i === 2 ? T.gradient : T.hexA(T.teal, T.dark ? 0.4 : 0.78) }} />
                  <span style={{ fontFamily: T.font.ui, fontSize: 12.5, color: T.ink3, fontWeight: 600 }}>{w.day}</span>
                </div>
              );
            })}
          </div>
        </Panel>
        <Panel T={T}>
          <PanelHead T={T} title="Utilization by team" icon="team" color="purple" />
          <BarsH T={T} items={window.ADMIN.TEAM_BREAKDOWN.map((t) => ({ label: t.team, value: t.util, color: t.team === 'Engineering' ? 'electric' : t.team === 'Product' ? 'teal' : t.team === 'Design' ? 'purple' : t.team === 'Sales' ? 'warn' : 'indigo', dot: true }))} max={100} />
        </Panel>
      </div>
      <Panel T={T}>
        <PanelHead T={T} title="Occupancy heatmap" sub="Avg desk load · Mon–Fri × hour" icon="grid" color="teal" />
        <Heatmap T={T} rows={window.ADMIN.HEATMAP} color="teal" />
      </Panel>
    </div>
  );
}

// ═══ SETTINGS ══════════════════════════════════════════════════
function SettingsSection({ T, narrow }) {
  const [pol, setPol] = useStateSec(() => Object.fromEntries(window.ADMIN.POLICIES.map((p) => [p.id, p.on])));
  return (
    <div style={{ display: 'grid', gridTemplateColumns: narrow ? '1fr' : 'minmax(0, 1.3fr) minmax(0, 1fr)', gap: 18, alignItems: 'start' }}>
      <Panel T={T}>
        <PanelHead T={T} title="Booking policies" sub="Applied across HQ Noida" icon="shield" color="teal" />
        <div>
          {window.ADMIN.POLICIES.map((p, i) => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '15px 0', borderBottom: i < window.ADMIN.POLICIES.length - 1 ? `1px solid ${T.lineSoft}` : 'none' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: T.font.ui, fontWeight: 600, fontSize: 14, color: T.ink }}>{p.label}</div>
                <div style={{ fontFamily: T.font.ui, fontSize: 12.5, color: T.ink3, marginTop: 2 }}>{p.sub}</div>
              </div>
              <Toggle T={T} on={pol[p.id]} onChange={(v) => setPol((s) => ({ ...s, [p.id]: v }))} />
            </div>
          ))}
        </div>
      </Panel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <Panel T={T}>
          <PanelHead T={T} title="Sites" icon="building" color="indigo" />
          {window.ADMIN.SITES.map((s, i) => (
            <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: i < window.ADMIN.SITES.length - 1 ? `1px solid ${T.lineSoft}` : 'none' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: T.hexA(T.indigo, T.dark ? 0.2 : 0.12), display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Ic name="building" size={19} color={T.accent ? T.accent(T.indigo) : T.indigo} sw={1.8} /></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: T.font.ui, fontWeight: 600, fontSize: 13.5, color: T.ink }}>{s.name}</div>
                <div style={{ fontFamily: T.font.ui, fontSize: 11.5, color: T.ink3 }}>{s.floors} floors · {s.desks} desks · {s.people} people</div>
              </div>
              <span style={{ fontFamily: T.font.ui, fontWeight: 700, fontSize: 13, color: T.ink }}>{s.occ}%</span>
            </div>
          ))}
        </Panel>
        <Panel T={T}>
          <PanelHead T={T} title="Integrations" icon="link" color="teal" />
          {[['Slack', 'Booking reminders & check-ins', true], ['Google Calendar', 'Two-way room sync', true], ['Okta SSO', 'SAML directory sync', true], ['HID Access', 'Badge-in presence', false]].map(([n, d, on], i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: i < 3 ? `1px solid ${T.lineSoft}` : 'none' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: T.font.ui, fontWeight: 600, fontSize: 13.5, color: T.ink }}>{n}</div>
                <div style={{ fontFamily: T.font.ui, fontSize: 11.5, color: T.ink3 }}>{d}</div>
              </div>
              <span style={{ fontFamily: T.font.ui, fontWeight: 600, fontSize: 12, color: on ? cKey(T, 'avail') : T.ink3, background: T.hexA(on ? cKey(T, 'avail') : T.ink3, T.dark ? 0.18 : 0.12), padding: '4px 10px', borderRadius: 999 }}>{on ? 'Connected' : 'Off'}</span>
            </div>
          ))}
        </Panel>
      </div>
    </div>
  );
}

Object.assign(window, { FloorsSection, RoomsSection, BookingsSection, PeopleSection, ParkingSection, AnalyticsSection, SettingsSection });
