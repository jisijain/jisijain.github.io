// admin-shell.jsx — responsive admin shell: nav (sidebar/top-nav), topbar, tweaks
const { useState: useStateA, useEffect: useEffectA } = React;

const NAV = [
  { id: 'overview',  label: 'Overview',   icon: 'grid' },
  { id: 'floors',    label: 'Floor plans', icon: 'map' },
  { id: 'rooms',     label: 'Rooms',      icon: 'room' },
  { id: 'bookings',  label: 'Bookings',   icon: 'calendar' },
  { id: 'people',    label: 'People',     icon: 'team' },
  { id: 'parking',   label: 'Parking',    icon: 'parking' },
  { id: 'analytics', label: 'Analytics',  icon: 'trend' },
  { id: 'settings',  label: 'Settings',   icon: 'sliders' },
];

const META = {
  overview:  { title: 'Command center', sub: 'Live workplace pulse · HQ Noida' },
  floors:    { title: 'Floor plans', sub: 'Desks, neighborhoods & maintenance' },
  rooms:     { title: 'Meeting rooms', sub: 'Configuration & utilization' },
  bookings:  { title: 'Bookings', sub: 'All reservations across the site' },
  people:    { title: 'People & access', sub: 'Directory, roles & permissions' },
  parking:   { title: 'Parking', sub: 'Zones, EV & allocations' },
  analytics: { title: 'Analytics', sub: 'Trends, utilization & cost' },
  settings:  { title: 'Settings', sub: 'Policies, sites & integrations' },
};

const ADMIN_DEFAULTS = /*EDITMODE-BEGIN*/{
  "nav": "Sidebar",
  "mode": "light",
  "brand": "Teal · Indigo",
  "density": "Airy"
}/*EDITMODE-END*/;

function Brandmark({ T, compact }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
      <div style={{ width: 34, height: 34, borderRadius: 10, background: T.gradient, boxShadow: `0 4px 12px ${T.hexA(T.indigo, 0.3)}`, flexShrink: 0 }} />
      {!compact && (
        <div>
          <div style={{ fontFamily: T.font.ui, fontWeight: 800, fontSize: 16, color: T.ink, letterSpacing: '-.02em' }}>FlexiSpace</div>
          <div style={{ fontFamily: T.font.mono, fontSize: 9, color: T.ink3, letterSpacing: '.12em' }}>ADMIN CONSOLE</div>
        </div>
      )}
    </div>
  );
}

function SiteSelector({ T, site, onClick, wide }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 10, width: wide ? '100%' : undefined,
      padding: '10px 12px', borderRadius: T.rEl, border: `1px solid ${T.line}`, background: T.dark ? T.surfaceAlt : T.surface,
      cursor: 'pointer', textAlign: 'left',
    }}>
      <div style={{ width: 28, height: 28, borderRadius: 8, background: T.hexA(T.primary, T.dark ? 0.2 : 0.12), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Ic name="building" size={16} color={T.accent ? T.accent(T.primary) : T.primary} sw={1.9} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: T.font.ui, fontWeight: 700, fontSize: 13.5, color: T.ink, whiteSpace: 'nowrap' }}>{site.name}</div>
        <div style={{ fontFamily: T.font.ui, fontSize: 11, color: T.ink3 }}>{site.people} people</div>
      </div>
      <Icon name="chevD" size={16} color={T.ink3} />
    </button>
  );
}

function NavItem({ T, item, active, onClick, horizontal }) {
  const c = T.primary;
  if (horizontal) {
    return (
      <button onClick={onClick} style={{
        display: 'inline-flex', alignItems: 'center', gap: 8, padding: '9px 14px', borderRadius: T.rPill,
        border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
        background: active ? T.hexA(c, T.dark ? 0.2 : 0.12) : 'transparent',
        color: active ? (T.accent ? T.accent(c) : c) : T.ink2,
        fontFamily: T.font.ui, fontWeight: 600, fontSize: 13.5, transition: 'all .15s',
      }}>
        <Ic name={item.icon} size={17} color={active ? (T.accent ? T.accent(c) : c) : T.ink3} sw={1.9} />{item.label}
      </button>
    );
  }
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '11px 13px', borderRadius: T.rEl,
      border: 'none', cursor: 'pointer', textAlign: 'left', position: 'relative',
      background: active ? T.hexA(c, T.dark ? 0.18 : 0.1) : 'transparent', transition: 'all .15s',
    }}>
      <Ic name={item.icon} size={20} color={active ? (T.accent ? T.accent(c) : c) : T.ink3} sw={1.9} />
      <span style={{ fontFamily: T.font.ui, fontWeight: active ? 700 : 600, fontSize: 14, color: active ? T.ink : T.ink2 }}>{item.label}</span>
      {active && <span style={{ position: 'absolute', left: -13, top: '50%', transform: 'translateY(-50%)', width: 4, height: 22, borderRadius: 999, background: c }} />}
    </button>
  );
}

function UserCard({ T }) {
  const me = window.PEOPLE[0];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '10px 11px', borderRadius: T.rEl, border: `1px solid ${T.line}` }}>
      <Avatar person={me} size={36} T={T} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: T.font.ui, fontWeight: 700, fontSize: 13.5, color: T.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{me.name}</div>
        <div style={{ fontFamily: T.font.ui, fontSize: 11, color: T.ink3 }}>Workplace admin</div>
      </div>
      <button aria-label="Sign out" style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 4 }}><Ic name="logout" size={18} color={T.ink3} sw={1.9} /></button>
    </div>
  );
}

function TopActions({ T, mode, onMode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 13px', borderRadius: T.rPill, border: `1px solid ${T.line}`, background: T.surface }}>
        <Icon name="calendar" size={16} color={T.ink3} sw={1.9} />
        <span style={{ fontFamily: T.font.ui, fontWeight: 600, fontSize: 13, color: T.ink }}>Tue, 3 Jun</span>
        <Icon name="chevD" size={15} color={T.ink3} />
      </div>
      <ThemeToggle T={T} mode={mode} onChange={onMode} />
      <button aria-label="Notifications" style={{ position: 'relative', width: 40, height: 40, borderRadius: 999, border: `1px solid ${T.line}`, background: T.surface, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="bell" size={19} color={T.ink2} sw={1.8} />
        <span style={{ position: 'absolute', top: 9, right: 10, width: 8, height: 8, borderRadius: 999, background: cKey(T, 'crit'), border: `1.5px solid ${T.surface}` }} />
      </button>
    </div>
  );
}

function SectionBody({ T, active, narrow }) {
  switch (active) {
    case 'floors': return <FloorsSection T={T} narrow={narrow} />;
    case 'rooms': return <RoomsSection T={T} narrow={narrow} />;
    case 'bookings': return <BookingsSection T={T} narrow={narrow} />;
    case 'people': return <PeopleSection T={T} narrow={narrow} />;
    case 'parking': return <ParkingSection T={T} narrow={narrow} />;
    case 'analytics': return <AnalyticsSection T={T} narrow={narrow} />;
    case 'settings': return <SettingsSection T={T} narrow={narrow} />;
    default: return <OverviewSection T={T} narrow={narrow} />;
  }
}

function PageHeader({ T, active, sidebar }) {
  const m = META[active];
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 22 }}>
      <div>
        <h1 style={{ margin: 0, fontFamily: T.font.ui, fontWeight: 800, fontSize: 27, color: T.ink, letterSpacing: '-.025em' }}>{m.title}</h1>
        <div style={{ fontFamily: T.font.ui, fontSize: 14, color: T.ink3, marginTop: 5 }}>{m.sub}</div>
      </div>
      {sidebar && <TopActions T={T} mode={T.dark ? 'dark' : 'light'} onMode={sidebar} />}
    </div>
  );
}

const VALID_SECTIONS = NAV.map((n) => n.id);
function initialSection() {
  try {
    const s = new URLSearchParams(window.location.search).get('section');
    if (s && VALID_SECTIONS.includes(s)) return s;
  } catch (e) {}
  return 'overview';
}

function AdminShell() {
  const [t, setTweak] = useTweaks(ADMIN_DEFAULTS);
  const T = buildTokens(t);
  const [active, setActive] = useStateA(initialSection);
  const [w, setW] = useStateA(typeof window !== 'undefined' ? window.innerWidth : 1280);

  useEffectA(() => {
    const on = () => setW(window.innerWidth);
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);

  // Deep-link nav from an embedding case-study page (demo chips post { type:'fsnav', screen })
  useEffectA(() => {
    const onMsg = (e) => {
      const d = e.data;
      if (d && d.type === 'fsnav' && typeof d.screen === 'string' && VALID_SECTIONS.includes(d.screen)) {
        setActive(d.screen);
      }
    };
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, []);

  const forceTop = w < 980;
  const useSidebar = t.nav === 'Sidebar' && !forceTop;
  const narrow = w < 1180;
  const site = window.ADMIN.SITES[0];
  const setMode = (m) => setTweak('mode', m);
  const pad = t.density === 'Compact' ? 22 : 30;
  const maxW = t.density === 'Compact' ? 1680 : 1480;

  const scrollWrap = { flex: 1, minWidth: 0, overflowY: 'auto', overflowX: 'hidden' };
  const inner = { maxWidth: maxW, margin: '0 auto', padding: `${pad}px ${pad}px ${pad + 20}px`, boxSizing: 'border-box' };

  return (
    <div style={{ position: 'fixed', inset: 0, background: T.canvas, fontFamily: T.font.ui, display: 'flex', flexDirection: useSidebar ? 'row' : 'column', overflow: 'hidden' }}>
      {useSidebar ? (
        <aside style={{ width: 252, flexShrink: 0, height: '100%', borderRight: `1px solid ${T.dark ? T.borderColor : T.line}`, background: T.dark ? T.surface : T.surfaceAlt, display: 'flex', flexDirection: 'column', padding: 18, boxSizing: 'border-box' }}>
          <div style={{ padding: '4px 4px 18px' }}><Brandmark T={T} /></div>
          <SiteSelector T={T} site={site} wide onClick={() => {}} />
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 3, marginTop: 18, flex: 1, overflowY: 'auto' }}>
            {NAV.map((it) => <NavItem key={it.id} T={T} item={it} active={active === it.id} onClick={() => setActive(it.id)} />)}
          </nav>
          <div style={{ marginTop: 14 }}><UserCard T={T} /></div>
        </aside>
      ) : (
        <header style={{ flexShrink: 0, borderBottom: `1px solid ${T.dark ? T.borderColor : T.line}`, background: T.dark ? T.surface : T.surfaceAlt }}>
          <div style={{ maxWidth: maxW, margin: '0 auto', padding: '12px 22px', display: 'flex', alignItems: 'center', gap: 16, boxSizing: 'border-box' }}>
            <Brandmark T={T} compact={w < 560} />
            <div style={{ flex: 1 }} />
            <ThemeToggle T={T} mode={T.dark ? 'dark' : 'light'} onChange={setMode} />
            <button aria-label="Notifications" style={{ position: 'relative', width: 40, height: 40, borderRadius: 999, border: `1px solid ${T.line}`, background: T.surface, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon name="bell" size={19} color={T.ink2} sw={1.8} />
              <span style={{ position: 'absolute', top: 9, right: 10, width: 8, height: 8, borderRadius: 999, background: cKey(T, 'crit'), border: `1.5px solid ${T.surface}` }} />
            </button>
            <Avatar person={window.PEOPLE[0]} size={38} T={T} />
          </div>
          <div style={{ maxWidth: maxW, margin: '0 auto', padding: '0 16px 10px', display: 'flex', gap: 4, overflowX: 'auto', boxSizing: 'border-box', scrollbarWidth: 'none' }}>
            {NAV.map((it) => <NavItem key={it.id} T={T} item={it} active={active === it.id} onClick={() => setActive(it.id)} horizontal />)}
          </div>
        </header>
      )}

      <main style={scrollWrap}>
        <div style={inner}>
          <PageHeader T={T} active={active} sidebar={useSidebar ? setMode : null} />
          <SectionBody T={T} active={active} narrow={narrow} />
        </div>
      </main>

      <TweaksPanel>
        <TweakSection label="Navigation" />
        <TweakRadio label="Nav model" value={t.nav} options={['Sidebar', 'Top nav']} onChange={(v) => setTweak('nav', v)} />
        <TweakSection label="Appearance" />
        <TweakRadio label="Theme" value={t.mode} options={['light', 'dark']} onChange={(v) => setTweak('mode', v)} />
        <TweakRadio label="Density" value={t.density} options={['Airy', 'Compact']} onChange={(v) => setTweak('density', v)} />
        <TweakSelect label="Brand palette" value={t.brand} options={Object.keys(window.BRANDS)} onChange={(v) => setTweak('brand', v)} />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<AdminShell />);
