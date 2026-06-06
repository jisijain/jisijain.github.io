// casestudy.jsx — strategy rail: audit, IA, design system, how-to-explore
// Exposes (window): CaseStudy
function CaseStudy({ T, onClose }) {
  const ink = '#0E1726', ink2 = '#5A6675', ink3 = '#93A0AE', line = '#E8ECF1';
  const F = T.font;
  const H = ({ children }) => <div style={{ fontFamily: F.mono, fontSize: 11, letterSpacing: '.12em', color: T.primary, fontWeight: 600, marginBottom: 14, textTransform: 'uppercase' }}>{children}</div>;
  const Title = ({ children }) => <div style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 20, color: ink, letterSpacing: '-.01em', marginBottom: 16 }}>{children}</div>;

  const audit = [
    ['Disconnected cards', 'Home was a stack of unrelated widgets', 'A single command center: today\u2019s plan, live availability, presence and AI picks in one scan'],
    ['Static floor plan', 'Isometric render, not interactive', 'Pan / zoom 2D map as the hero \u2014 locate people, desks & routes in seconds'],
    ['Blind seat picking', 'No team or context awareness', 'Smart suggestions ranked by team proximity, preferences & history'],
    ['Booking ≠ management', 'Hard to see or change what you\u2019ve booked', 'Timeline / calendar / agenda with reschedule, extend & recurring'],
  ];

  const seatStates = ['available','booked','mine','maintenance','vip','restricted'];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#fff' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 26px', borderBottom: `1px solid ${line}`, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
          <div style={{ width: 30, height: 30, borderRadius: 9, background: T.gradient }} />
          <div>
            <div style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 15, color: ink }}>FlexiSpace</div>
            <div style={{ fontFamily: F.mono, fontSize: 10, color: ink3, letterSpacing: '.04em' }}>WORKPLACE OS · 2026 REDESIGN</div>
          </div>
        </div>
        <button onClick={onClose} style={{ width: 36, height: 36, borderRadius: 999, border: `1px solid ${line}`, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="close" size={18} color={ink2} />
        </button>
      </div>

      <div style={{ overflowY: 'auto', padding: '26px 26px 60px' }}>
        {/* intro */}
        <div style={{ fontFamily: F.ui, fontSize: 16.5, color: ink2, lineHeight: 1.55, marginBottom: 34, maxWidth: 560 }}>
          A redesign that turns a booking app into a <b style={{ color: ink }}>workplace operating system</b> — answering “where do I sit, who’s in, can I park, which room’s free?” in seconds. Mobile-first, enterprise-ready, premium restraint.
        </div>

        {/* audit */}
        <section style={{ marginBottom: 40 }}>
          <H>01 · UX Audit</H>
          <Title>What was holding it back</Title>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
            {audit.map(([t, was, now]) => (
              <div key={t} style={{ border: `1px solid ${line}`, borderRadius: 16, padding: 18, display: 'grid', gridTemplateColumns: '160px 1fr', gap: 18, alignItems: 'start' }}>
                <div>
                  <div style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 14.5, color: ink, marginBottom: 4 }}>{t}</div>
                  <div style={{ fontFamily: F.ui, fontSize: 12.5, color: ink3, lineHeight: 1.4 }}>{was}</div>
                </div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div style={{ marginTop: 2, color: T.primary }}><Icon name="arrowR" size={18} color={T.primary} sw={2} /></div>
                  <div style={{ fontFamily: F.ui, fontSize: 13.5, color: ink2, lineHeight: 1.45 }}>{now}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* IA */}
        <section style={{ marginBottom: 40 }}>
          <H>02 · Information Architecture</H>
          <Title>Five intents, one thumb-reachable bar</Title>
          <div style={{ fontFamily: F.ui, fontSize: 14, color: ink2, lineHeight: 1.5, marginBottom: 18, maxWidth: 560 }}>
            Desk, Rooms and Parking aren’t peers of Home — they’re <b style={{ color: ink }}>creation flows</b>. So they collapse behind a center “book” action, freeing the bar for the two things checked many times a day (Home, Map) plus management and identity.
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {[['home','Home','Command center'],['map','Map','Locate & explore'],['plus','Book','Desk · room · parking'],['calendar','Bookings','Manage & reschedule'],['user','Profile','Prefs & presence']].map(([ic, t, s], i) => (
              <div key={t} style={{ flex: '1 1 150px', border: `1px solid ${line}`, borderRadius: 14, padding: 15, background: i===2?T.hexA(T.primary,0.06):'#fff' }}>
                <div style={{ width: 38, height: 38, borderRadius: 11, background: i===2?T.gradient:T.hexA(T.ink,0.05), display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 11 }}>
                  <Icon name={ic} size={20} color={i===2?'#fff':ink} sw={1.9} />
                </div>
                <div style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 14, color: ink }}>{t}</div>
                <div style={{ fontFamily: F.ui, fontSize: 12, color: ink3, marginTop: 2 }}>{s}</div>
              </div>
            ))}
          </div>
        </section>

        {/* design system */}
        <section style={{ marginBottom: 40 }}>
          <H>03 · Design System</H>
          <Title>Evolved teal · indigo, premium restraint</Title>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 24 }}>
            {/* color */}
            <div>
              <div style={{ fontFamily: F.mono, fontSize: 10.5, color: ink3, marginBottom: 10, letterSpacing: '.05em' }}>BRAND & ACCENT</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {[[T.teal,'Teal'],[T.indigo,'Indigo'],[T.electric,'Electric'],['#0E1726','Ink']].map(([c, l]) => (
                  <div key={l} style={{ textAlign: 'center' }}>
                    <div style={{ width: 52, height: 52, borderRadius: 13, background: c, boxShadow: '0 4px 12px rgba(15,23,42,.12)' }} />
                    <div style={{ fontFamily: F.mono, fontSize: 9.5, color: ink3, marginTop: 6 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* type */}
            <div>
              <div style={{ fontFamily: F.mono, fontSize: 10.5, color: ink3, marginBottom: 10, letterSpacing: '.05em' }}>TYPE · SCHIBSTED GROTESK</div>
              <div style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 26, color: ink, letterSpacing: '-.02em', lineHeight: 1 }}>Aa</div>
              <div style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 15, color: ink, marginTop: 6 }}>Display · 700</div>
              <div style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 13.5, color: ink2 }}>Body · 500 · tabular nums</div>
              <div style={{ fontFamily: F.mono, fontSize: 11.5, color: ink3, marginTop: 2 }}>Mono · labels & codes</div>
            </div>
          </div>

          {/* seat states */}
          <div style={{ fontFamily: F.mono, fontSize: 10.5, color: ink3, marginBottom: 10, letterSpacing: '.05em' }}>SEAT STATUS SYSTEM</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {seatStates.map(s => {
              const m = T.seatSystem.states[s];
              return (
                <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 7, border: `1px solid ${line}`, borderRadius: 999, padding: '6px 12px 6px 8px' }}>
                  <span style={{ width: 16, height: 16, borderRadius: 5, background: T.seatSystem.fill==='tint'?m.fill:m.dot, border: `1.4px solid ${m.ring||m.dot}` }} />
                  <span style={{ fontFamily: F.ui, fontSize: 12.5, fontWeight: 600, color: ink2 }}>{T.statusMeta[s].name}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* explore */}
        <section>
          <H>04 · Explore the variations</H>
          <Title>Mix & match live with Tweaks</Title>
          <div style={{ fontFamily: F.ui, fontSize: 14, color: ink2, lineHeight: 1.5, marginBottom: 16, maxWidth: 560 }}>
            Open <b style={{ color: ink }}>Tweaks</b> (toolbar) to switch between directions without leaving the prototype:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[['Visual style','Soft · Crisp · Bold'],['Home layout','Plan / Snapshot / Actions first'],['Navigation','5-tab+action · 4-tab · 3-tab+FAB'],['Seat colors','Classic · Tinted · High-contrast'],['Brand','Three teal·indigo balances'],['Map','Heatmap & label toggles']].map(([t, s]) => (
              <div key={t} style={{ border: `1px solid ${line}`, borderRadius: 12, padding: 14 }}>
                <div style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 13.5, color: ink }}>{t}</div>
                <div style={{ fontFamily: F.ui, fontSize: 12, color: ink3, marginTop: 3 }}>{s}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
window.CaseStudy = CaseStudy;
