// embed.jsx — chrome-free FlexiSpace phone for the case study
// Renders ONLY the iOS device + Screens (no strategy bar, no hints).
// Fits to viewport. Reads ?screen= and ?mode= and ?fit= from the URL.
// Publishes window.__SCREENS_API for programmatic navigation / capture.
const { useState: useStateE, useEffect: useEffectE } = React;

const EMBED_DEFAULTS = {
  brand: 'Teal · Indigo', visual: 'Soft', mode: 'light',
  homeLayout: 'Plan-first', seatColors: 'Classic',
  navModel: '5-tab + action', mapHeatmap: false, mapLabels: true,
};

const E_DEVICE_W = 402, E_DEVICE_H = 874;

// screen shortcut -> initial nav state
function initialFor(screen) {
  switch (screen) {
    case 'deskDetail': return { tab: 'desk', stack: [{ name: 'desk-detail', params: { deskId: '3-D14' } }] };
    case 'roomDetail': return { tab: 'rooms', stack: [{ name: 'room-detail', params: { roomId: 'r1' } }] };
    case 'route':      return { tab: 'desk', stack: [{ name: 'route', params: { deskId: '3-D14' } }] };
    case 'desk':
    case 'map':
    case 'rooms':
    case 'parking':
    case 'bookings':
    case 'profile':
    case 'notifications':
    case 'home':       return { tab: screen, stack: [] };
    default:           return { tab: 'home', stack: [] };
  }
}

function Embed() {
  const params = new URLSearchParams(location.search);
  const screen = params.get('screen') || (location.hash || '').replace('#', '') || 'home';
  const mode = params.get('mode') === 'dark' ? 'dark' : 'light';
  const capRaw = params.get('cap');                 // cap=<scale> => hi-res capture mode
  const capScale = capRaw ? Math.max(1, parseFloat(capRaw) || 2) : 0;
  const cap = capScale > 0;
  const fit = !cap && params.get('fit') !== 'off';  // fit=off => fixed 1:1 (for crisp capture)

  const t = { ...EMBED_DEFAULTS, mode };
  const T = buildTokens(t);
  const setTweak = () => {}; // tweaks disabled inside embed

  const [scale, setScale] = useStateE(fit ? 1 : 1);

  // listen for navigation from the case-study demo chips
  useEffectE(() => {
    const onMsg = (e) => {
      const d = e.data;
      if (!d || d.type !== 'fsnav' || !window.__SCREENS_API) return;
      const api = window.__SCREENS_API();
      const init = initialFor(d.screen);
      api.go.tab(init.tab);
      if (init.stack && init.stack.length) {
        const r = init.stack[init.stack.length - 1];
        setTimeout(() => window.__SCREENS_API().go.route(r.name, r.params), 60);
      }
    };
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, []);

  useEffectE(() => {
    if (!fit) { setScale(1); return; }
    const recalc = () => {
      const pad = 14;
      const s = Math.min(
        (window.innerHeight - pad * 2) / E_DEVICE_H,
        (window.innerWidth - pad * 2) / E_DEVICE_W,
        1.2
      );
      setScale(Math.max(0.2, s));
    };
    recalc();
    window.addEventListener('resize', recalc);
    return () => window.removeEventListener('resize', recalc);
  }, [fit]);

  // ── hi-res capture mode: device at scale, top-left, with shadow padding ──
  if (cap) {
    const pad = Math.round(34 * capScale);
    return (
      <div id="caproot" style={{ position: 'absolute', top: 0, left: 0, padding: pad, background: 'transparent', width: 'fit-content' }}>
        <div style={{ width: E_DEVICE_W * capScale, height: E_DEVICE_H * capScale, position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: E_DEVICE_W, height: E_DEVICE_H, transform: `scale(${capScale})`, transformOrigin: 'top left' }}>
            <IOSDevice dark={mode === 'dark'}>
              <Screens T={T} t={t} setTweak={setTweak} initial={initialFor(screen)} />
            </IOSDevice>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      <div style={{ width: E_DEVICE_W * scale, height: E_DEVICE_H * scale, position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: E_DEVICE_W, height: E_DEVICE_H, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
          <IOSDevice dark={mode === 'dark'}>
            <Screens T={T} t={t} setTweak={setTweak} initial={initialFor(screen)} />
          </IOSDevice>
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Embed />);
