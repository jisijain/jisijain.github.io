// shell.jsx — page shell: scaled phone stage, strategy overlay, tweaks (outside transform)
const { useState: useStateS, useEffect: useEffectS } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "brand": "Teal · Indigo",
  "visual": "Soft",
  "mode": "light",
  "homeLayout": "Plan-first",
  "seatColors": "Classic",
  "navModel": "5-tab + action",
  "mapHeatmap": false,
  "mapLabels": true
}/*EDITMODE-END*/;

const DEVICE_W = 402, DEVICE_H = 874;

function Shell() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const T = buildTokens(t);
  const [story, setStory] = useStateS(false);
  const [scale, setScale] = useStateS(1);

  useEffectS(() => {
    const fit = () => {
      const vh = window.innerHeight, vw = window.innerWidth;
      const topbar = 60;
      const availH = vh - topbar - 36;
      const availW = (vw < 760 ? vw : vw * 0.62) - 36;
      setScale(Math.min(1.04, availH / DEVICE_H, availW / DEVICE_W));
    };
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);

  const F = T.font;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'radial-gradient(1200px 700px at 80% -10%, #EAEFF5 0%, #E4E9F0 45%, #DDE3EB 100%)', fontFamily: F.ui, overflow: 'hidden' }}>
      {/* top bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 22px', zIndex: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
          <div style={{ width: 30, height: 30, borderRadius: 9, background: T.gradient, boxShadow: `0 4px 12px ${T.hexA(T.indigo,0.3)}` }} />
          <div>
            <div style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 15, color: '#0E1726', letterSpacing: '-.01em' }}>FlexiSpace</div>
            <div style={{ fontFamily: F.mono, fontSize: 9.5, color: '#7C8896', letterSpacing: '.05em' }}>WORKPLACE OS · CONCEPT</div>
          </div>
        </div>
        <button onClick={() => setStory(true)} style={{ display: 'flex', alignItems: 'center', gap: 8, height: 40, padding: '0 16px', borderRadius: 999, border: '1px solid rgba(14,23,38,0.1)', background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)', cursor: 'pointer', fontFamily: F.ui, fontWeight: 600, fontSize: 13.5, color: '#0E1726' }}>
          <Icon name="layers" size={17} color={T.primary} sw={2} />
          Strategy &amp; system
        </button>
      </div>

      {/* phone stage */}
      <div style={{ position: 'absolute', top: 60, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: DEVICE_W * scale, height: DEVICE_H * scale, position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: DEVICE_W, height: DEVICE_H, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
            <IOSDevice dark={t.mode === 'dark'}>
              <Screens T={T} t={t} setTweak={setTweak} />
            </IOSDevice>
          </div>
        </div>
      </div>

      {/* hint */}
      <div style={{ position: 'absolute', bottom: 16, left: 0, right: 0, textAlign: 'center', zIndex: 5, pointerEvents: 'none' }}>
        <span style={{ fontFamily: F.mono, fontSize: 10.5, color: '#8B97A4', letterSpacing: '.04em' }}>TAP TO NAVIGATE · OPEN TWEAKS TO SWITCH DIRECTIONS</span>
      </div>

      {/* strategy overlay */}
      <div onClick={() => setStory(false)} style={{ position: 'absolute', inset: 0, zIndex: 40, background: 'rgba(14,23,38,0.4)', backdropFilter: story?'blur(3px)':'none', opacity: story?1:0, pointerEvents: story?'auto':'none', transition: 'opacity .3s' }} />
      <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 'min(760px, 92vw)', zIndex: 41, transform: story?'translateX(0)':'translateX(105%)', transition: 'transform .42s cubic-bezier(.32,.72,0,1)', boxShadow: '-20px 0 60px rgba(14,23,38,0.2)' }}>
        <CaseStudy T={T} onClose={() => setStory(false)} />
      </div>

      {/* tweaks — outside the scale transform */}
      <TweaksPanel>
        <TweakSection label="Identity" />
        <TweakSelect label="Brand" value={t.brand} options={Object.keys(window.BRANDS)} onChange={(v) => setTweak('brand', v)} />
        <TweakRadio label="Visual style" value={t.visual} options={['Soft','Crisp','Bold']} onChange={(v) => setTweak('visual', v)} />
        <TweakSection label="Layout & IA" />
        <TweakSelect label="Home layout" value={t.homeLayout} options={['Plan-first','Snapshot-first','Actions-first']} onChange={(v) => setTweak('homeLayout', v)} />
        <TweakSelect label="Navigation" value={t.navModel} options={['5-tab + action','4-tab','3-tab + FAB']} onChange={(v) => setTweak('navModel', v)} />
        <TweakSection label="Floor map" />
        <TweakRadio label="Seat colors" value={t.seatColors} options={['Classic','Tinted','High contrast']} onChange={(v) => setTweak('seatColors', v)} />
        <TweakToggle label="Heatmap default" value={t.mapHeatmap} onChange={(v) => setTweak('mapHeatmap', v)} />
        <TweakToggle label="Map labels" value={t.mapLabels} onChange={(v) => setTweak('mapLabels', v)} />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Shell />);
