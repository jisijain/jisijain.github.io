// admin-overview.jsx — flagship command-center dashboard
// Exposes (window): OverviewSection

const { useState: useStateOv } = React;

function LiveNowPanel({ T }) {
  const occPct = 68;
  return (
    <Panel T={T}>
      <PanelHead T={T} title="Live right now" icon="pulse" color="teal"
        right={<span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: T.font.mono, fontSize: 10.5, color: T.ink3, letterSpacing: '.04em' }}>
          <span style={{ width: 7, height: 7, borderRadius: 999, background: cKey(T, 'avail'), boxShadow: `0 0 0 3px ${T.hexA(cKey(T, 'avail'), 0.18)}` }} />UPDATED 1m AGO
        </span>} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 18 }}>
        <GaugeArc T={T} pct={occPct} label={`${occPct}%`} sub="Occupied" color="teal" size={150} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <div style={{ fontFamily: T.font.ui, fontWeight: 800, fontSize: 26, color: T.ink, letterSpacing: '-.02em', lineHeight: 1 }}>274</div>
            <div style={{ fontFamily: T.font.ui, fontSize: 12.5, color: T.ink3, marginTop: 3 }}>people on-site</div>
          </div>
          <div style={{ height: 1, background: T.lineSoft }} />
          <div>
            <div style={{ fontFamily: T.font.ui, fontWeight: 800, fontSize: 26, color: T.ink, letterSpacing: '-.02em', lineHeight: 1 }}>13<span style={{ fontSize: 16, color: T.ink3, fontWeight: 700 }}>/18</span></div>
            <div style={{ fontFamily: T.font.ui, fontSize: 12.5, color: T.ink3, marginTop: 3 }}>rooms in session</div>
          </div>
        </div>
      </div>
      <div style={{ fontFamily: T.font.mono, fontSize: 10.5, color: T.ink3, letterSpacing: '.04em', marginBottom: 10, textTransform: 'uppercase' }}>Desk states · 320 total</div>
      <StackBar T={T} segs={window.ADMIN.SPACE_MIX} />
    </Panel>
  );
}

function TrendPanel({ T }) {
  const [metric, setMetric] = useStateOv('desks');
  const color = metric === 'desks' ? 'teal' : 'indigo';
  const valKey = metric === 'desks' ? 'desks' : 'rooms';
  return (
    <Panel T={T}>
      <PanelHead T={T} title="Occupancy through the day" sub="Live hourly load vs. last week" icon="trend" color={color}
        right={<Seg T={T} value={metric} onChange={setMetric} options={[{ value: 'desks', label: 'Desks' }, { value: 'rooms', label: 'Rooms' }]} />} />
      <AreaTrend T={T} data={window.ADMIN.HOURLY} color={color} valKey={valKey} ghostKey={metric === 'desks' ? 'last' : undefined} height={210} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 14, flexWrap: 'wrap' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontFamily: T.font.ui, fontSize: 12.5, color: T.ink2, fontWeight: 600 }}>
          <span style={{ width: 14, height: 3, borderRadius: 999, background: cKey(T, color) }} />Today
        </span>
        {metric === 'desks' && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontFamily: T.font.ui, fontSize: 12.5, color: T.ink3, fontWeight: 600 }}>
          <span style={{ width: 14, height: 0, borderTop: `2px dashed ${T.ink3}` }} />Last week
        </span>}
        <span style={{ marginLeft: 'auto', fontFamily: T.font.ui, fontSize: 12.5, color: T.ink3 }}>Peak <strong style={{ color: T.ink }}>{metric === 'desks' ? '71% at 14:00' : '70% at 14:00'}</strong></span>
      </div>
    </Panel>
  );
}

function AttendancePanel({ T }) {
  const items = window.ADMIN.TEAM_BREAKDOWN.map((t) => ({
    label: t.team, value: t.util, color: t.team === 'Engineering' ? 'electric' : t.team === 'Product' ? 'teal' : t.team === 'Design' ? 'purple' : t.team === 'Sales' ? 'warn' : 'indigo',
    dot: true, display: `${t.onsite}/${t.total}`,
  }));
  return (
    <Panel T={T}>
      <PanelHead T={T} title="Attendance by team" sub="On-site now · share of team" icon="team" color="purple" />
      <BarsH T={T} items={items} max={100} />
    </Panel>
  );
}

function HeatmapPanel({ T }) {
  return (
    <Panel T={T}>
      <PanelHead T={T} title="Weekly occupancy heatmap" sub="Avg desk load · Mon–Fri × hour" icon="grid" color="teal"
        right={<span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: T.font.mono, fontSize: 10, color: T.ink3 }}>
          LOW
          <span style={{ display: 'flex', gap: 2 }}>{[0.12, 0.32, 0.55, 0.78, 0.95].map((a, i) => <span key={i} style={{ width: 12, height: 12, borderRadius: 3, background: T.hexA(T.teal, a) }} />)}</span>
          HIGH
        </span>} />
      <Heatmap T={T} rows={window.ADMIN.HEATMAP} color="teal" />
    </Panel>
  );
}

function FloorPanel({ T }) {
  return (
    <Panel T={T}>
      <PanelHead T={T} title="Floor utilization" sub="HQ Noida" icon="building" color="indigo" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {window.ADMIN.FLOOR_UTIL.map((f, i) => {
          const c = f.occ > 78 ? cKey(T, 'crit') : f.occ > 60 ? cKey(T, 'warn') : cKey(T, 'avail');
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 0', borderBottom: i < 3 ? `1px solid ${T.lineSoft}` : 'none' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontFamily: T.font.ui, fontWeight: 700, fontSize: 13.5, color: T.ink }}>{f.floor}</span>
                  {f.hot && <span style={{ fontFamily: T.font.mono, fontSize: 9, color: cKey(T, 'crit'), background: T.hexA(cKey(T, 'crit'), 0.12), padding: '2px 6px', borderRadius: 999, fontWeight: 600, letterSpacing: '.03em' }}>BUSY</span>}
                </div>
                <div style={{ fontFamily: T.font.ui, fontSize: 11.5, color: T.ink3, marginTop: 2 }}>{f.desks} desks · {f.rooms} rooms</div>
              </div>
              <div style={{ width: 110, height: 8, borderRadius: 999, background: T.hexA(c, T.dark ? 0.16 : 0.12), overflow: 'hidden' }}>
                <div style={{ width: `${f.occ}%`, height: '100%', borderRadius: 999, background: c }} />
              </div>
              <span style={{ width: 38, textAlign: 'right', fontFamily: T.font.ui, fontWeight: 700, fontSize: 13.5, color: T.ink }}>{f.occ}%</span>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

function AlertsPanel({ T }) {
  return (
    <Panel T={T}>
      <PanelHead T={T} title="Needs attention" icon="alert" color="warn"
        right={<span style={{ fontFamily: T.font.ui, fontWeight: 700, fontSize: 12, color: cKey(T, 'crit'), background: T.hexA(cKey(T, 'crit'), 0.12), padding: '3px 9px', borderRadius: 999 }}>{window.ADMIN.ALERTS.length} open</span>} />
      <div>
        {window.ADMIN.ALERTS.map((a, i) => <AlertRow key={a.id} T={T} a={a} last={i === window.ADMIN.ALERTS.length - 1} />)}
      </div>
    </Panel>
  );
}

function ActivityPanel({ T }) {
  return (
    <Panel T={T}>
      <PanelHead T={T} title="Recent activity" sub="Live check-ins & reservations" icon="pulse" color="teal"
        right={<button style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 13px', borderRadius: T.rPill, border: `1px solid ${T.line}`, background: 'transparent', cursor: 'pointer', fontFamily: T.font.ui, fontWeight: 600, fontSize: 12.5, color: T.ink }}><Ic name="download" size={15} color={T.ink2} sw={2} />Export</button>} />
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1.4fr 0.9fr 0.7fr 1fr', gap: 10, padding: '0 0 10px', borderBottom: `1px solid ${T.line}` }}>
        {['Person', 'Resource', 'Floor', 'Time', 'Status'].map((h) => <span key={h} style={{ fontFamily: T.font.mono, fontSize: 10, color: T.ink3, textTransform: 'uppercase', letterSpacing: '.05em', fontWeight: 500 }}>{h}</span>)}
      </div>
      {window.ADMIN.ACTIVITY.map((a, i) => <ActivityRow key={i} T={T} a={a} last={i === window.ADMIN.ACTIVITY.length - 1} />)}
    </Panel>
  );
}

function TopRoomsPanel({ T }) {
  const max = Math.max(...window.ADMIN.TOP_ROOMS.map((r) => r.hours));
  return (
    <Panel T={T}>
      <PanelHead T={T} title="Most-booked rooms" sub="This week · hours reserved" icon="room" color="indigo" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
        {window.ADMIN.TOP_ROOMS.map((r, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 22, fontFamily: T.font.mono, fontSize: 12, color: T.ink3, fontWeight: 600 }}>{String(i + 1).padStart(2, '0')}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: T.font.ui, fontWeight: 600, fontSize: 13.5, color: T.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.name}</div>
              <div style={{ height: 6, borderRadius: 999, background: T.hexA(T.indigo, T.dark ? 0.16 : 0.12), overflow: 'hidden', marginTop: 5 }}>
                <div style={{ width: `${(r.hours / max) * 100}%`, height: '100%', borderRadius: 999, background: cKey(T, 'indigo') }} />
              </div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontFamily: T.font.ui, fontWeight: 700, fontSize: 13.5, color: T.ink }}>{r.hours}h</div>
              <div style={{ fontFamily: T.font.mono, fontSize: 10.5, color: T.ink3 }}>{r.util}%</div>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function OverviewSection({ T, narrow }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: narrow ? '1fr 1fr' : 'repeat(4, 1fr)', gap: 14 }}>
        {window.ADMIN.KPIS.map((k) => <KpiCard key={k.id} T={T} k={k} />)}
      </div>

      {/* sub-stat strip */}
      <Panel T={T} pad={16}>
        <div style={{ display: 'grid', gridTemplateColumns: narrow ? '1fr 1fr' : 'repeat(4, 1fr)', gap: narrow ? 16 : 8 }}>
          {window.ADMIN.SUB_STATS.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, borderLeft: (!narrow && i > 0) ? `1px solid ${T.lineSoft}` : 'none', paddingLeft: (!narrow && i > 0) ? 18 : 0 }}>
              <SubStat T={T} s={s} />
            </div>
          ))}
        </div>
      </Panel>

      {/* main two-zone grid */}
      <div style={{ display: 'grid', gridTemplateColumns: narrow ? '1fr' : 'minmax(0, 1.85fr) minmax(0, 1fr)', gap: 18, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, minWidth: 0 }}>
          <TrendPanel T={T} />
          <HeatmapPanel T={T} />
          <ActivityPanel T={T} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, minWidth: 0 }}>
          <LiveNowPanel T={T} />
          <AttendancePanel T={T} />
          <AlertsPanel T={T} />
          <FloorPanel T={T} />
          <TopRoomsPanel T={T} />
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { OverviewSection });
