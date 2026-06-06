// screens-misc.jsx — Profile, Notifications, Route (wayfinding), ConfirmSheet
// Exposes (window): ProfileScreen, NotificationsScreen, RouteScreen, ConfirmBody

const { useState: useStateX, useEffect: useEffectX } = React;

function ProfileScreen({ T, go, mode, setMode }) {
  const me = window.PEOPLE[0];
  const dark = mode === 'dark';
  const rows = [
    ['chair','Workplace preferences','Window · quiet · standing'],
    ['team','My team & favorites','Product · 3 favorites'],
    ['car','Vehicles','2 saved'],
    ['bell','Notifications','Check-in reminders on'],
    ['shield','Privacy & presence','Visible to team'],
    ['sliders','Accessibility','Standard'],
  ];
  return (
    <div>
      <ScreenHeaderBar T={T} title="Profile" />
      <div style={{ padding: '0 18px' }}>
        <Card T={T} pad={18}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Avatar person={me} size={58} T={T} ring />
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: T.font.ui, fontWeight: 700, fontSize: 19, color: T.ink }}>{me.name}</div>
              <div style={{ fontFamily: T.font.ui, fontSize: 13.5, color: T.ink3 }}>{me.role} · {me.team}</div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 6, padding: '4px 10px', borderRadius: 999, background: '#DCFCE7' }}>
                <span style={{ width: 7, height: 7, borderRadius: 999, background: '#16A34A' }} /><span style={{ fontFamily: T.font.ui, fontSize: 11.5, fontWeight: 600, color: '#15803D' }}>In office today</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
            {[['12','days this month'],['3.2','avg days/wk'],['Tue–Thu','usual days']].map(([v,l]) => (
              <div key={l} style={{ flex: 1, textAlign: 'center', padding: '10px 4px', borderRadius: T.rEl, background: T.hexA(T.ink,0.035) }}>
                <div style={{ fontFamily: T.font.ui, fontWeight: 700, fontSize: 16, color: T.ink }}>{v}</div>
                <div style={{ fontFamily: T.font.ui, fontSize: 10.5, color: T.ink3, marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </Card>

        <div style={{ marginTop: 16 }}>
          <Card T={T} pad={14}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 13, width: '100%' }}>
              <div style={{ width: 38, height: 38, borderRadius: T.rEl, background: T.hexA(dark ? T.indigo : '#F59E0B', 0.14), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon name={dark ? 'layers' : 'spark'} size={20} color={dark ? T.indigo : '#F59E0B'} sw={1.9} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: T.font.ui, fontWeight: 700, fontSize: 14.5, color: T.ink }}>Appearance</div>
                <div style={{ fontFamily: T.font.ui, fontSize: 12, color: T.ink3, marginTop: 1 }}>{dark ? 'Dark theme' : 'Light theme'}</div>
              </div>
              <Segmented T={T} value={mode || 'light'} onChange={(v) => setMode && setMode(v)} options={[{ value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }]} />
            </div>
          </Card>
        </div>

        <div style={{ marginTop: 16 }}>
          <Card T={T} pad={6}>
            {rows.map(([ic, t, s], i) => (
              <button key={t} style={{ display: 'flex', alignItems: 'center', gap: 13, width: '100%', padding: '12px 12px', background: 'none', border: 'none', borderBottom: i<rows.length-1?`1px solid ${T.lineSoft}`:'none', cursor: 'pointer', textAlign: 'left' }}>
                <Icon name={ic} size={20} color={T.ink2} sw={1.9} />
                <div style={{ flex: 1 }}><div style={{ fontFamily: T.font.ui, fontWeight: 600, fontSize: 14.5, color: T.ink }}>{t}</div><div style={{ fontFamily: T.font.ui, fontSize: 12, color: T.ink3, marginTop: 1 }}>{s}</div></div>
                <Icon name="chevR" size={18} color={T.ink3} />
              </button>
            ))}
          </Card>
        </div>
        <div style={{ textAlign: 'center', padding: '20px 0', fontFamily: T.font.mono, fontSize: 11, color: T.ink3 }}>FlexiSpace · v3.0 · Noida HQ</div>
      </div>
    </div>
  );
}

function NotificationsScreen({ T, go }) {
  const notifs = [
    { ic: 'check', c: '#16A34A', t: 'Checked in at Desk 55A', s: '2 min ago', unread: true },
    { ic: 'team', c: '#7C3AED', t: 'Aarav & Sara are sitting near you today', s: '1 hr ago', unread: true },
    { ic: 'room', c: T.indigo, t: 'Sprint review starts in 30 min · Poha Jalebi', s: '1 hr ago' },
    { ic: 'car', c: T.electric, t: 'EV bay E-04 is now free', s: '3 hr ago' },
    { ic: 'spark', c: T.indigo, t: 'Suggested desk near your team for Thursday', s: 'Yesterday' },
  ];
  return (
    <div>
      <DetailHeader T={T} go={go} title="Notifications" sub="2 new" />
      <div style={{ padding: '0 18px', display: 'flex', flexDirection: 'column', gap: 9 }}>
        {notifs.map((n, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: 13, borderRadius: T.rEl, background: n.unread?T.hexA(T.primary,0.05):T.surface, boxShadow: T.shadowSm, border: T.border?`1px solid ${T.borderColor}`:'none' }}>
            <div style={{ width: 38, height: 38, borderRadius: 999, background: T.hexA(n.c,0.12), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icon name={n.ic} size={18} color={n.c} sw={2} /></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: T.font.ui, fontWeight: 600, fontSize: 13.5, color: T.ink, lineHeight: 1.35 }}>{n.t}</div>
              <div style={{ fontFamily: T.font.mono, fontSize: 10.5, color: T.ink3, marginTop: 3 }}>{n.s.toUpperCase()}</div>
            </div>
            {n.unread && <span style={{ width: 8, height: 8, borderRadius: 999, background: T.primary, marginTop: 4 }} />}
          </div>
        ))}
      </div>
    </div>
  );
}

function RouteScreen({ T, floor, deskId, go }) {
  const [step, setStep] = useStateX(0);
  const steps = [
    { ic: 'door', t: 'Enter from main lobby', s: 'Take the elevator to the 3rd floor' },
    { ic: 'nav', t: 'Turn right at reception', s: '20 m · past the café' },
    { ic: 'walk', t: 'Continue down the main aisle', s: '35 m · Product neighborhood ahead' },
    { ic: 'chair', t: 'Arrive at Desk 55A', s: 'On your left, by the window' },
  ];
  return (
    <div>
      <DetailHeader T={T} go={go} title="Route to desk" sub="Step-by-step · ~2 min walk" />
      <div style={{ padding: '0 18px' }}>
        <FloorMap T={T} floor={floor} selected={deskId} routeTo={deskId} onSelect={() => {}} onSelectRoom={() => {}} presence={false} labels height={300} interactive={true} />
        <Card T={T} style={{ marginTop: 14 }} pad={16}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <Icon name="a11y" size={17} color="#0EA5E9" sw={2} />
            <span style={{ fontFamily: T.font.ui, fontSize: 12.5, fontWeight: 600, color: T.ink2 }}>Step-free route · elevator access</span>
          </div>
        </Card>
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {steps.map((s, i) => {
            const done = i < step, active = i === step;
            return (
              <div key={i} style={{ display: 'flex', gap: 13, padding: '10px 0' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 999, background: active?T.primary:(done?T.hexA(T.primary,0.14):T.hexA(T.ink,0.05)), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon name={done?'check':s.ic} size={18} color={active?'#fff':(done?T.primary:T.ink3)} sw={2} />
                  </div>
                  {i<steps.length-1 && <div style={{ width: 2, flex: 1, minHeight: 18, background: done?T.hexA(T.primary,0.3):T.lineSoft, marginTop: 2 }} />}
                </div>
                <div style={{ flex: 1, paddingBottom: 6 }}>
                  <div style={{ fontFamily: T.font.ui, fontWeight: active?700:600, fontSize: 14.5, color: active?T.ink:T.ink2 }}>{s.t}</div>
                  <div style={{ fontFamily: T.font.ui, fontSize: 12.5, color: T.ink3, marginTop: 1 }}>{s.s}</div>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ height: 8 }} />
      </div>
      <StickyBar T={T}>
        <Btn T={T} kind="ghost" size="lg" onClick={() => setStep(Math.max(0, step-1))}>Back</Btn>
        <Btn T={T} kind="primary" size="lg" full iconR="arrowR" onClick={() => step<steps.length-1?setStep(step+1):go.back()}>{step<steps.length-1?'Next step':'Done'}</Btn>
      </StickyBar>
    </div>
  );
}

// success body shown inside a Sheet after a booking
function ConfirmBody({ T, info, onDone, onRoute }) {
  return (
    <div style={{ textAlign: 'center', padding: '6px 0 4px' }}>
      <div style={{ width: 68, height: 68, borderRadius: 999, background: T.hexA('#16A34A',0.12), display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '4px auto 16px' }}>
        <Icon name="check" size={36} color="#16A34A" sw={2.4} />
      </div>
      <div style={{ fontFamily: T.font.ui, fontWeight: 700, fontSize: 21, color: T.ink }}>You're booked!</div>
      <div style={{ fontFamily: T.font.ui, fontSize: 14, color: T.ink3, marginTop: 5 }}>{info?.summary}</div>
      <Card T={T} flat style={{ margin: '18px 0 6px', textAlign: 'left' }} pad={15}>
        {(info?.lines || []).map(([ic, k, v], i) => (
          <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '9px 0', borderBottom: i<(info.lines.length-1)?`1px solid ${T.lineSoft}`:'none' }}>
            <Icon name={ic} size={18} color={T.primary} sw={1.9} />
            <span style={{ flex: 1, fontFamily: T.font.ui, fontSize: 13, color: T.ink3 }}>{k}</span>
            <span style={{ fontFamily: T.font.ui, fontWeight: 700, fontSize: 13.5, color: T.ink }}>{v}</span>
          </div>
        ))}
      </Card>
      <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
        {onRoute && <Btn T={T} kind="ghost" full icon="nav" onClick={onRoute}>Route</Btn>}
        <Btn T={T} kind="primary" full icon="check" onClick={onDone}>Done</Btn>
      </div>
    </div>
  );
}

Object.assign(window, { ProfileScreen, NotificationsScreen, RouteScreen, ConfirmBody });
