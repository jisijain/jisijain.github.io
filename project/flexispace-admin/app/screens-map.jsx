// screens-map.jsx — Interactive 3D floor map (orbital dollhouse) + team presence
// Exposes (window): FloorMap, MapScreen, deskMeta

const { useState: useStateM, useRef: useRefM, useEffect: useEffectM, useCallback } = React;

// inject keyframes once
(function injectMapCSS(){
  if (document.getElementById('fs-map-css')) return;
  const s = document.createElement('style');
  s.id = 'fs-map-css';
  s.textContent = `
    @keyframes fsPulse { 0%{ transform:scale(.5); opacity:.5 } 70%{ opacity:0 } 100%{ transform:scale(2.6); opacity:0 } }
    @keyframes fsDash { to { stroke-dashoffset: -24; } }
    @keyframes fsBeam { 0%,100%{ opacity:.30 } 50%{ opacity:.6 } }
    .fs-mapstage { touch-action: none; user-select: none; -webkit-user-select: none; }
  `;
  document.head.appendChild(s);
})();

function deskMeta(desk, T) {
  return T.seatSystem.states[desk.status] || T.seatSystem.states.available;
}

// shade a hex toward black by factor f (0..1)
function fsShade(hex, f) {
  const h = String(hex).replace('#', '');
  if (h.length < 6) return hex;
  let r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
  r = Math.round(r * (1 - f)); g = Math.round(g * (1 - f)); b = Math.round(b * (1 - f));
  return `rgb(${r},${g},${b})`;
}
const fsClamp = (v, a, b) => Math.max(a, Math.min(b, v));

// ── Core map (3D orbital projection) ───────────────────────────
function FloorMap({ T, floor, selected, onSelect, onSelectRoom, presence = true, heatmap = false, labels = true, teamFilter = null, query = '', route = false, routeTo = null, height = 440, interactive = true }) {
  const wrapRef = useRefM(null);
  const [box, setBox] = useStateM({ w: 360, h: height });
  const [tf, setTf] = useStateM({ scale: interactive ? 1.3 : 1.0, px: 0, py: 0, anim: false });        // zoom + pan
  const [orbit, setOrbit] = useStateM({ yaw: -0.40, pitch: 0.94 });                // 3D camera
  const drag = useRefM(null);
  const pointers = useRefM(new Map());
  const pinch = useRefM(null);

  useEffectM(() => {
    const measure = () => { if (wrapRef.current) { const el = wrapRef.current; setBox({ w: el.clientWidth, h: el.clientHeight }); } };
    measure();
    const ro = new ResizeObserver(measure); if (wrapRef.current) ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  const VW = 360, VH = 540;
  // Interactive maps "contain" the whole floor so users can see/pan everything.
  // Embedded (non-interactive) maps "cover" their frame — fitting to the floor's
  // actual content height (~360) — so they read centered and filled, not floating.
  const baseScale = interactive
    ? Math.min(box.w / VW, box.h / VH)
    : Math.max(box.w / VW, box.h / 360);
  const eff = baseScale * tf.scale;
  const tx0 = (box.w - VW * eff) / 2 + tf.px;
  const ty0 = (box.h - VH * eff) / 2 + tf.py;

  const clampPan = (px, py, scale) => {
    const e = baseScale * scale;
    const slackX = Math.max(0, (VW * e - box.w) / 2) + 120;
    const slackY = Math.max(0, (VH * e - box.h) / 2) + 120;
    return { px: Math.max(-slackX, Math.min(slackX, px)), py: Math.max(-slackY, Math.min(slackY, py)) };
  };

  // ── Projection ──────────────────────────────────────────────
  const cosY = Math.cos(orbit.yaw), sinY = Math.sin(orbit.yaw);
  const GF = Math.sin(orbit.pitch);   // ground foreshorten
  const ZL = Math.cos(orbit.pitch);   // height lift
  const PROJ = 0.72, CX = 180, CY = 283, OX = 180, OY = 270;
  const P = (x, y, z) => {
    const dx = x - CX, dy = y - CY;
    const rx = dx * cosY - dy * sinY;
    const ry = dx * sinY + dy * cosY;
    return [OX + rx * PROJ, OY - ry * GF * PROJ - (z || 0) * ZL * PROJ, ry];
  };
  const dep = (x, y, z) => { const dx = x - CX, dy = y - CY; return (dx * sinY + dy * cosY) - (z || 0) * 0.6; };
  const nryOf = (nx, ny) => nx * sinY + ny * cosY;   // rotated outward-normal depth component
  const pts = (a) => a.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');

  const centerOn = useCallback((sx, sy, targetScale) => {
    const e = baseScale * targetScale;
    const px = box.w / 2 - sx * e - (box.w - VW * e) / 2;
    const py = box.h / 2 - sy * e - (box.h - VH * e) / 2;
    const c = clampPan(px, py, targetScale);
    setTf({ scale: targetScale, px: c.px, py: c.py, anim: true });
  }, [box, baseScale]);

  // focus selected desk — only on interactive maps; static locators stay centered
  useEffectM(() => {
    if (!selected || !interactive) return;
    const d = floor.desks.find(x => x.id === selected);
    if (d) { const p = P(d.x + 8, d.y + 8, 8); centerOn(p[0], p[1], Math.max(1.9, tf.scale < 1.9 ? 2.1 : tf.scale)); }
    // eslint-disable-next-line
  }, [selected]);

  // ── Pointer handling: drag=orbit, pinch/wheel=zoom ──────────
  const onPointerDown = (e) => {
    if (!interactive) return;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2) {
      const p = [...pointers.current.values()];
      pinch.current = { d: Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y), scale: tf.scale };
    } else {
      drag.current = { x: e.clientX, y: e.clientY, yaw: orbit.yaw, pitch: orbit.pitch, moved: false };
    }
  };
  const onPointerMove = (e) => {
    if (!interactive) return;
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pinch.current && pointers.current.size === 2) {
      const p = [...pointers.current.values()];
      const d = Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y);
      const ns = fsClamp(pinch.current.scale * (d / pinch.current.d), 0.8, 4);
      const c = clampPan(tf.px, tf.py, ns);
      setTf(t => ({ ...t, scale: ns, px: c.px, py: c.py, anim: false }));
      return;
    }
    if (drag.current) {
      const dx = e.clientX - drag.current.x, dy = e.clientY - drag.current.y;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) drag.current.moved = true;
      setOrbit({
        yaw: drag.current.yaw + dx * 0.011,
        pitch: fsClamp(drag.current.pitch + dy * 0.005, 0.52, 1.40),
      });
    }
  };
  const onPointerUp = (e) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinch.current = null;
    drag.current = null;
  };
  const onWheel = (e) => {
    if (!interactive) return;
    e.preventDefault();
    const ns = fsClamp(tf.scale * (e.deltaY < 0 ? 1.12 : 0.89), 0.8, 4);
    const c = clampPan(tf.px, tf.py, ns);
    setTf(t => ({ ...t, scale: ns, px: c.px, py: c.py, anim: false }));
  };

  const stepZoom = (dir) => {
    const ns = fsClamp(tf.scale * (dir > 0 ? 1.4 : 0.7), 0.8, 4);
    const c = clampPan(tf.px, tf.py, ns);
    setTf({ scale: ns, px: c.px, py: c.py, anim: true });
  };
  const tiltStops = [0.66, 0.94, 1.24];
  const cycleTilt = () => {
    const i = tiltStops.findIndex(s => Math.abs(s - orbit.pitch) < 0.04);
    setOrbit(o => ({ ...o, pitch: tiltStops[(i + 1) % tiltStops.length] || 0.94 }));
  };
  const reset = () => { setOrbit({ yaw: -0.40, pitch: 0.94 }); setTf({ scale: interactive ? 1.3 : 1.0, px: 0, py: 0, anim: true }); };

  const q = query.trim().toLowerCase();
  const matchPerson = (pid) => {
    if (!q || !pid) return false;
    const p = window.PEOPLE.find(x => x.id === pid); if (!p) return false;
    return p.name.toLowerCase().includes(q) || p.team.toLowerCase().includes(q);
  };

  // ── Geometry ────────────────────────────────────────────────
  const SX0 = 14, SY0 = 40, SX1 = 346, SY1 = 526, TH = 8;

  // floor slab (with thickness)
  const slabTop = [P(SX0, SY0, 0), P(SX1, SY0, 0), P(SX1, SY1, 0), P(SX0, SY1, 0)];
  const slabSides = [];
  [[[0, -1], [SX0, SY0], [SX1, SY0]], [[0, 1], [SX1, SY1], [SX0, SY1]], [[-1, 0], [SX0, SY1], [SX0, SY0]], [[1, 0], [SX1, SY0], [SX1, SY1]]]
    .forEach((s, i) => {
      if (nryOf(s[0][0], s[0][1]) < -0.001) {
        const q4 = [P(s[1][0], s[1][1], 0), P(s[2][0], s[2][1], 0), P(s[2][0], s[2][1], -TH), P(s[1][0], s[1][1], -TH)];
        slabSides.push(<polygon key={'ss' + i} points={pts(q4)} fill={T.mapSlabSide} />);
      }
    });

  // corridor decals (flat, on floor)
  const corridorQuads = [
    [P(120, 40, .2), P(154, 40, .2), P(154, 526, .2), P(120, 526, .2)],
    [P(14, 210, .2), P(346, 210, .2), P(346, 240, .2), P(14, 240, .2)],
  ];

  // team zone footprint
  let zoneEl = null;
  if (teamFilter) {
    const ds = floor.desks.filter(d => d.team === teamFilter);
    if (ds.length) {
      const minX = Math.min(...ds.map(d => d.x)) - 9, minY = Math.min(...ds.map(d => d.y)) - 9;
      const maxX = Math.max(...ds.map(d => d.x)) + 25, maxY = Math.max(...ds.map(d => d.y)) + 25;
      const c = (window.TEAMS[teamFilter] || {}).color || T.primary;
      zoneEl = <polygon points={pts([P(minX, minY, .4), P(maxX, minY, .4), P(maxX, maxY, .4), P(minX, maxY, .4)])} fill={T.hexA(c, 0.13)} stroke={c} strokeWidth="1.4" strokeDasharray="5 4" strokeLinejoin="round" />;
    }
  }

  // heatmap blobs (projected ellipses on floor)
  const heatBlobs = heatmap ? [
    { x: 200, y: 150, r: 90, v: 0.9 }, { x: 90, y: 280, r: 70, v: 0.5 },
    { x: 270, y: 280, r: 75, v: 0.8 }, { x: 190, y: 390, r: 65, v: 0.45 },
  ] : [];

  // ── Solid builders (depth-sorted) ───────────────────────────
  const roomEl = (rm) => {
    const col = rm.status === 'available' ? T.seatSystem.states.available.dot : rm.status === 'soon' ? '#F59E0B' : '#F43F5E';
    const soft = rm.status === 'available' ? T.hexA(col, 0.14) : rm.status === 'soon' ? '#FEF3C7' : '#FEE4E2';
    const x0 = rm.x, y0 = rm.y, x1 = rm.x + 56, y1 = rm.y + 40, H = 30;
    const floorQ = [P(x0, y0, 0), P(x1, y0, 0), P(x1, y1, 0), P(x0, y1, 0)];
    // back walls only (dollhouse) — keep walls whose normal points away from camera
    const walls = [];
    [[[0, -1], [x0, y0], [x1, y0]], [[0, 1], [x1, y1], [x0, y1]], [[-1, 0], [x0, y1], [x0, y0]], [[1, 0], [x1, y0], [x1, y1]]]
      .forEach((s, i) => {
        if (nryOf(s[0][0], s[0][1]) > 0.001) {
          const a = s[1], b = s[2];
          const q4 = [P(a[0], a[1], 0), P(b[0], b[1], 0), P(b[0], b[1], H), P(a[0], a[1], H)];
          walls.push(<polygon key={'w' + i} points={pts(q4)} fill={T.hexA(col, 0.22)} stroke={T.hexA(col, 0.5)} strokeWidth="0.7" strokeLinejoin="round" />);
        }
      });
    return (
      <g key={rm.id} onClick={(e) => { e.stopPropagation(); if (!drag.current?.moved) onSelectRoom?.(rm); }} style={{ cursor: 'pointer' }}>
        <polygon points={pts(floorQ)} fill={soft} stroke={col} strokeWidth="1.2" strokeLinejoin="round" />
        {walls}
      </g>
    );
  };

  const deskEl = (d, dimmed) => {
    const m = deskMeta(d, T);
    const isSel = d.id === selected;
    const top = d.status === 'maintenance' ? '#E89A1C' : m.dot;
    const x0 = d.x, y0 = d.y, x1 = d.x + 15, y1 = d.y + 15, H = isSel ? 15 : 10;
    const aT = P(x0, y0, H), bT = P(x1, y0, H), cT = P(x1, y1, H), dT = P(x0, y1, H);
    const faces = [];
    [[[0, -1], [x0, y0], [x1, y0]], [[0, 1], [x1, y1], [x0, y1]], [[-1, 0], [x0, y1], [x0, y0]], [[1, 0], [x1, y0], [x1, y1]]]
      .forEach((s, i) => {
        if (nryOf(s[0][0], s[0][1]) < -0.001) {
          const a = s[1], b = s[2];
          const q4 = [P(a[0], a[1], 0), P(b[0], b[1], 0), P(b[0], b[1], H), P(a[0], a[1], H)];
          const sc = Math.abs(s[0][0]) > 0 ? fsShade(top, 0.30) : fsShade(top, 0.16);
          faces.push(<polygon key={'f' + i} points={pts(q4)} fill={sc} />);
        }
      });
    return (
      <g key={d.id} opacity={dimmed ? 0.28 : 1} onClick={(e) => { e.stopPropagation(); if (!drag.current?.moved) onSelect?.(d); }} style={{ cursor: 'pointer', transition: 'opacity .25s' }}>
        {faces}
        <polygon points={pts([aT, bT, cT, dT])} fill={top} stroke={isSel ? T.ink : fsShade(top, 0.12)} strokeWidth={isSel ? 1.6 : 0.5} strokeLinejoin="round" />
      </g>
    );
  };

  const solids = [];
  floor.rooms.forEach(rm => solids.push({ k: dep(rm.x + 28, rm.y + 20, 15), el: roomEl(rm) }));
  floor.desks.forEach(d => {
    const isHit = matchPerson(d.occupant) || (q && d.team.toLowerCase().includes(q));
    const dimmed = (teamFilter && d.team !== teamFilter) || (q && !isHit && d.id !== selected);
    solids.push({ k: dep(d.x + 7.5, d.y + 7.5, 5), el: deskEl(d, dimmed) });
  });
  solids.sort((a, b) => b.k - a.k);

  // ── Overlay (billboards, drawn above solids) ────────────────
  const overlay = [];

  // route path
  const routeDesk = routeTo ? floor.desks.find(d => d.id === routeTo) : (route && selected ? floor.desks.find(d => d.id === selected) : null);
  const entry = floor.amenities.find(a => a.kind === 'entrance');
  if (routeDesk && entry) {
    const r0 = P(entry.x, entry.y, 1.5), r1 = P(entry.x, routeDesk.y + 7, 1.5), r2 = P(routeDesk.x + 7, routeDesk.y + 7, 1.5);
    overlay.push({ ry: -9999, el: (
      <g key="route">
        <polyline points={pts([r0, r1, r2])} fill="none" stroke={T.primary} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2 10" style={{ animation: 'fsDash .6s linear infinite' }} />
        <circle cx={r0[0]} cy={r0[1]} r="4.5" fill={T.primary} />
      </g>
    )});
  }

  // amenities
  floor.amenities.forEach(a => {
    const p = P(a.x, a.y, 1.5);
    overlay.push({ ry: p[2], el: (
      <g key={a.id} transform={`translate(${p[0]},${p[1]})`}>
        <circle r="10.5" fill={T.surface} stroke={T.line} strokeWidth="1.4" />
        <g transform="translate(-7,-7)"><Icon name={a.kind === 'entrance' ? 'door' : a.kind === 'cafe' ? 'coffee' : 'wc'} size={14} color={T.ink2} sw={1.8} /></g>
      </g>
    )});
  });

  // presence tokens + query rings + selection beam
  floor.desks.forEach(d => {
    const isSel = d.id === selected;
    const isHit = matchPerson(d.occupant) || (q && d.team.toLowerCase().includes(q));
    const dimmed = (teamFilter && d.team !== teamFilter) || (q && !isHit && !isSel);
    const occ = d.occupant ? window.PEOPLE.find(p => p.id === d.occupant) : null;
    const baseP = P(d.x + 7.5, d.y + 7.5, 0);
    const topP = P(d.x + 7.5, d.y + 7.5, isSel ? 15 : 10);

    if (isSel) {
      const beamTop = P(d.x + 7.5, d.y + 7.5, 52);
      overlay.push({ ry: 9999, el: (
        <g key={'sel' + d.id} style={{ pointerEvents: 'none' }}>
          <ellipse cx={baseP[0]} cy={baseP[1]} rx={16 * GF} ry={16 * GF * GF + 4} fill="none" stroke={T.hexA(deskMeta(d, T).dot, 0.55)} strokeWidth="2" style={{ transformOrigin: `${baseP[0]}px ${baseP[1]}px`, animation: 'fsPulse 1.7s ease-out infinite' }} />
          <line x1={baseP[0]} y1={baseP[1]} x2={beamTop[0]} y2={beamTop[1]} stroke={deskMeta(d, T).dot} strokeWidth="2.4" strokeLinecap="round" style={{ animation: 'fsBeam 1.6s ease-in-out infinite' }} />
        </g>
      )});
    }
    if (isHit && !isSel && !dimmed) {
      overlay.push({ ry: topP[2], el: <circle key={'hit' + d.id} cx={topP[0]} cy={topP[1]} r="11" fill="none" stroke="#F59E0B" strokeWidth="2" style={{ pointerEvents: 'none' }} /> });
    }
    if (presence && occ && !dimmed) {
      const c = (window.TEAMS[occ.team] || {}).color || '#64748B';
      overlay.push({ ry: topP[2], el: (
        <g key={'tok' + d.id} style={{ pointerEvents: 'none' }}>
          <line x1={baseP[0]} y1={baseP[1]} x2={topP[0]} y2={topP[1] - 4} stroke={fsShade(c, 0.1)} strokeWidth="1.2" opacity="0.4" />
          <circle cx={topP[0]} cy={topP[1] - 9} r="7.5" fill={c} stroke="#fff" strokeWidth="1.4" />
          <text x={topP[0]} y={topP[1] - 6.4} textAnchor="middle" fontFamily={T.font.ui} fontSize="6.6" fontWeight="700" fill="#fff">{occ.init}</text>
        </g>
      )});
    }
  });

  // room labels
  if (labels) {
    floor.rooms.forEach(rm => {
      const p = P(rm.x + 28, rm.y + 20, 33);
      overlay.push({ ry: p[2], el: (
        <g key={'rl' + rm.id} style={{ pointerEvents: 'none' }}>
          <text x={p[0]} y={p[1]} textAnchor="middle" fontFamily={T.font.ui} fontSize="8" fontWeight="700" fill={T.ink} stroke={T.dark ? T.canvas : '#fff'} strokeWidth="2.4" paintOrder="stroke">{rm.name.split(' ')[0]}</text>
          <text x={p[0]} y={p[1] + 8} textAnchor="middle" fontFamily={T.font.mono} fontSize="6" fill={T.ink3} stroke={T.dark ? T.canvas : '#fff'} strokeWidth="2" paintOrder="stroke">{rm.seats} seats</text>
        </g>
      )});
    });
  }

  overlay.sort((a, b) => b.ry - a.ry);

  const compassRot = -orbit.yaw * 180 / Math.PI;

  return (
    <div style={{ position: 'relative', width: '100%', height, borderRadius: T.rCard, overflow: 'hidden', background: T.mapBg, border: T.border ? `1px solid ${T.borderColor}` : 'none' }}>
      {/* zoom + tilt controls */}
      {interactive && (
        <div style={{ position: 'absolute', right: 12, bottom: 12, zIndex: 6, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <IconBtn T={T} name="plus" size={38} onClick={() => stepZoom(1)} />
          <IconBtn T={T} name="chevD" size={38} onClick={() => stepZoom(-1)} />
          <IconBtn T={T} name="layers" size={38} onClick={cycleTilt} />
          <IconBtn T={T} name="nav" size={38} onClick={reset} color={T.primary} />
        </div>
      )}
      {/* info chip + compass */}
      <div style={{ position: 'absolute', left: 12, top: 12, zIndex: 6, display: 'flex', gap: 8, alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', padding: '5px 10px', borderRadius: 999, background: T.glassChip, backdropFilter: 'blur(6px)', boxShadow: T.shadowSm, fontFamily: T.font.mono, fontSize: 10.5, color: T.ink2, fontWeight: 500 }}>
          {floor.name} · {Math.round(tf.scale * 100) / 100}×
        </div>
        {interactive && (
          <div style={{ width: 30, height: 30, borderRadius: 999, background: T.glassChip, backdropFilter: 'blur(6px)', boxShadow: T.shadowSm, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 20 20" style={{ transform: `rotate(${compassRot}deg)`, transition: 'transform .08s linear' }}>
              <circle cx="10" cy="10" r="8.5" fill="none" stroke={T.line} strokeWidth="1" />
              <polygon points="10,3 12,10 10,9 8,10" fill="#F43F5E" />
              <polygon points="10,17 12,10 10,11 8,10" fill={T.ink3} />
            </svg>
          </div>
        )}
      </div>

      <div ref={wrapRef} className="fs-mapstage" onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp} onWheel={onWheel}
        style={{ position: 'absolute', inset: 0, cursor: interactive ? 'grab' : 'default' }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, width: VW, height: VH, transformOrigin: '0 0',
          transform: `translate(${tx0}px, ${ty0}px) scale(${eff})`,
          transition: tf.anim ? 'transform .5s cubic-bezier(.32,.72,0,1)' : 'none',
        }}>
          <svg width={VW} height={VH} viewBox={`0 0 ${VW} ${VH}`} style={{ display: 'block', overflow: 'visible' }}>
            <defs>
              <radialGradient id="fsHeat" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#F43F5E" stopOpacity="0.55" />
                <stop offset="60%" stopColor="#F59E0B" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* floor slab */}
            {slabSides}
            <polygon points={pts(slabTop)} fill={T.mapSlab} stroke={T.mapSlabStroke} strokeWidth="1.4" strokeLinejoin="round" />

            {/* corridor decals */}
            {corridorQuads.map((q4, i) => <polygon key={'c' + i} points={pts(q4)} fill={T.mapCorridor} />)}

            {/* team zone */}
            {zoneEl}

            {/* heatmap */}
            {heatBlobs.map((b, i) => { const p = P(b.x, b.y, 0.3); return <ellipse key={'h' + i} cx={p[0]} cy={p[1]} rx={b.r * PROJ} ry={b.r * GF * PROJ} fill="url(#fsHeat)" opacity={b.v} />; })}

            {/* solids: rooms + desks, depth sorted */}
            {solids.map(s => s.el)}

            {/* overlay billboards */}
            {overlay.map(o => o.el)}
          </svg>
        </div>
      </div>
    </div>
  );
}

// ── Legend ─────────────────────────────────────────────────────
function MapLegend({ T }) {
  const items = [['available','Available'],['booked','Booked'],['mine','Yours'],['maintenance','Maint.'],['vip','Exec']];
  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      {items.map(([s, l]) => (
        <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <StatusDot T={T} status={s} size={10} />
          <span style={{ fontFamily: T.font.ui, fontSize: 12, color: T.ink2, fontWeight: 600 }}>{l}</span>
        </div>
      ))}
    </div>
  );
}

// ── Map screen (presence + search + controls) ──────────────────
function MapScreen({ T, floor, setFloorNum, openDesk, openRoom, mapTweaks }) {
  const [query, setQuery] = useStateM('');
  const [team, setTeam] = useStateM(null);
  const [heat, setHeat] = useStateM(mapTweaks.heatmap);
  const [presence, setPresence] = useStateM(true);
  const [sel, setSel] = useStateM(null);
  useEffectM(() => setHeat(mapTweaks.heatmap), [mapTweaks.heatmap]);

  const here = window.PEOPLE.filter(p => p.here);
  const teams = Object.keys(window.TEAMS);

  return (
    <div style={{ padding: '0 0 12px' }}>
      <ScreenHeaderBar T={T} title="Floor map" sub={`${here.length} people in today · drag to orbit`} />
      <div style={{ padding: '0 18px' }}>
        <SearchBar T={T} value={query} onChange={setQuery} placeholder="Search people, desks, rooms…" />
      </div>

      {/* team presence chips */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '12px 18px', scrollbarWidth: 'none' }}>
        <Chip T={T} active={!team} onClick={() => setTeam(null)} icon="team">Everyone</Chip>
        {teams.map(tm => {
          const c = window.TEAMS[tm].color;
          const cnt = floor.desks.filter(d => d.team === tm && d.occupant).length;
          return <Chip key={tm} T={T} active={team===tm} onClick={() => setTeam(team===tm?null:tm)} color={c}>{tm} · {cnt}</Chip>;
        })}
      </div>

      <div style={{ padding: '0 18px' }}>
        <FloorMap T={T} floor={floor} selected={sel} onSelect={(d) => { setSel(d.id); }} onSelectRoom={openRoom}
          presence={presence} heatmap={heat} labels={mapTweaks.labels} teamFilter={team} query={query} height={430} />

        {/* map control row */}
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <Chip T={T} active={presence} onClick={() => setPresence(!presence)} icon="user">Presence</Chip>
          <Chip T={T} active={heat} onClick={() => setHeat(!heat)} icon="heat">Heatmap</Chip>
          <div style={{ flex: 1 }} />
          <Segmented T={T} options={floor.num ? window.FLOORS.map(f => ({ value: f.num, label: `F${f.num}` })) : []} value={floor.num} onChange={setFloorNum} />
        </div>

        <div style={{ marginTop: 14 }}><MapLegend T={T} /></div>

        {/* selected desk preview */}
        {sel && (() => {
          const d = floor.desks.find(x => x.id === sel); if (!d) return null;
          const m = deskMeta(d, T); const occ = d.occupant ? window.PEOPLE.find(p => p.id === d.occupant) : null;
          const sm = T.statusMeta[d.status];
          return (
            <Card T={T} style={{ marginTop: 14 }} elevate>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: T.rEl, background: m.soft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="chair" size={22} color={m.text} sw={1.9} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: T.font.ui, fontWeight: 700, fontSize: 16, color: T.ink }}>Desk {d.label} · {d.team}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                    <StatusDot T={T} status={d.status} /><span style={{ fontFamily: T.font.ui, fontSize: 13, color: m.text, fontWeight: 600 }}>{sm.name}</span>
                    {occ && <span style={{ fontFamily: T.font.ui, fontSize: 13, color: T.ink3 }}>· {occ.name}</span>}
                  </div>
                </div>
                {sm.bookable
                  ? <Btn T={T} size="sm" onClick={() => openDesk(d)}>Book</Btn>
                  : <Btn T={T} size="sm" kind="ghost" onClick={() => openDesk(d)}>Details</Btn>}
              </div>
            </Card>
          );
        })()}

        {/* who's in */}
        <div style={{ marginTop: 18 }}>
          <SectionLabel T={T}>Who's in today</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {here.filter(p => p.id !== 'me' && (!team || p.team === team)).slice(0, 6).map(p => (
              <div key={p.id} onClick={() => { setQuery(p.name); }} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 4px', cursor: 'pointer' }}>
                <Avatar person={p} size={38} T={T} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: T.font.ui, fontWeight: 600, fontSize: 14.5, color: T.ink }}>{p.name}</div>
                  <div style={{ fontFamily: T.font.ui, fontSize: 12.5, color: T.ink3 }}>{p.role} · {p.team}</div>
                </div>
                <button style={{ display: 'flex', alignItems: 'center', gap: 5, background: T.hexA(T.primary,0.1), border: 'none', borderRadius: T.rPill, padding: '7px 12px', cursor: 'pointer', color: T.tealDeep, fontFamily: T.font.ui, fontWeight: 600, fontSize: 12.5 }}>
                  <Icon name="pin" size={14} color={T.tealDeep} sw={2} />Locate
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// small shared header (also used by other screens)
function ScreenHeaderBar({ T, title, sub, right }) {
  return (
    <div style={{ padding: '54px 18px 14px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
      <div>
        <div style={{ fontFamily: T.font.ui, fontWeight: 700, fontSize: 26, color: T.ink, letterSpacing: '-.02em' }}>{title}</div>
        {sub && <div style={{ fontFamily: T.font.ui, fontSize: 13.5, color: T.ink3, marginTop: 2 }}>{sub}</div>}
      </div>
      {right}
    </div>
  );
}

Object.assign(window, { FloorMap, MapScreen, MapLegend, deskMeta, ScreenHeaderBar });
