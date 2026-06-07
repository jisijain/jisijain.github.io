// admin-charts.jsx — SVG charts for the admin dashboard (theme-driven, responsive)
// Exposes (window): cKey, AreaTrend, Heatmap, BarsH, GaugeArc, StackBar, LineMini

// resolve a semantic color key against the live theme
function cKey(T, key) {
  const map = {
    teal: T.teal, indigo: T.indigo, electric: T.electric, primary: T.primary,
    avail: T.dark ? '#34D27B' : '#16A34A', warn: T.dark ? '#FBBF24' : '#F59E0B',
    crit: T.dark ? '#FB7185' : '#F43F5E', purple: T.dark ? '#A78BFA' : '#7C3AED',
  };
  return map[key] || key;
}

// ── Area + ghost line trend (hourly) ───────────────────────────
function AreaTrend({ T, data, height = 200, color = 'teal', ghostKey, valKey = 'desks', xKey = 'label', unit = '%' }) {
  const W = 720, H = height, padL = 30, padR = 12, padT = 16, padB = 26;
  const c = cKey(T, color);
  const n = data.length;
  const max = 100;
  const x = (i) => padL + (i / (n - 1)) * (W - padL - padR);
  const y = (v) => padT + (1 - v / max) * (H - padT - padB);
  const line = (key) => data.map((d, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(d[key]).toFixed(1)}`).join(' ');
  const area = `${line(valKey)} L${x(n - 1).toFixed(1)} ${y(0)} L${x(0).toFixed(1)} ${y(0)} Z`;
  const gid = `area-${color}-${valKey}`;
  const grid = [0, 25, 50, 75, 100];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block', overflow: 'visible' }} preserveAspectRatio="none">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c} stopOpacity={T.dark ? 0.42 : 0.26} />
          <stop offset="100%" stopColor={c} stopOpacity="0" />
        </linearGradient>
      </defs>
      {grid.map((g) => (
        <g key={g}>
          <line x1={padL} y1={y(g)} x2={W - padR} y2={y(g)} stroke={T.line} strokeWidth="1" strokeDasharray={g === 0 ? '0' : '3 5'} />
          <text x={padL - 7} y={y(g) + 3.5} textAnchor="end" fontFamily={T.font.mono} fontSize="10" fill={T.ink3}>{g}</text>
        </g>
      ))}
      {ghostKey && <path d={line(ghostKey)} fill="none" stroke={T.ink3} strokeWidth="1.6" strokeDasharray="4 4" opacity="0.55" strokeLinecap="round" />}
      <path d={area} fill={`url(#${gid})`} />
      <path d={line(valKey)} fill="none" stroke={c} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      {data.map((d, i) => (
        <g key={i}>
          {i % 2 === 0 && <text x={x(i)} y={H - 7} textAnchor="middle" fontFamily={T.font.mono} fontSize="10" fill={T.ink3}>{d[xKey]}</text>}
        </g>
      ))}
      {/* peak marker */}
      {(() => {
        const pi = data.reduce((m, d, i) => (d[valKey] > data[m][valKey] ? i : m), 0);
        return <circle cx={x(pi)} cy={y(data[pi][valKey])} r="4.5" fill={T.surface} stroke={c} strokeWidth="2.5" />;
      })()}
    </svg>
  );
}

// ── Occupancy heatmap (day rows × hour cols) ──────────────────
function Heatmap({ T, rows, color = 'teal' }) {
  const c = cKey(T, color);
  const hours = (rows[0] && rows[0].cells) || [];
  const shade = (v) => {
    const a = T.dark ? 0.10 + (v / 100) * 0.80 : 0.06 + (v / 100) * 0.82;
    return T.hexA(c, a);
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <div style={{ display: 'grid', gridTemplateColumns: `34px repeat(${hours.length}, 1fr)`, gap: 4, alignItems: 'center' }}>
        <span />
        {hours.map((h, i) => (
          <span key={i} style={{ fontFamily: T.font.mono, fontSize: 9.5, color: T.ink3, textAlign: 'center' }}>{i % 2 === 0 ? h.h : ''}</span>
        ))}
      </div>
      {rows.map((r) => (
        <div key={r.day} style={{ display: 'grid', gridTemplateColumns: `34px repeat(${r.cells.length}, 1fr)`, gap: 4, alignItems: 'center' }}>
          <span style={{ fontFamily: T.font.ui, fontSize: 11.5, fontWeight: 600, color: T.ink2 }}>{r.day}</span>
          {r.cells.map((cell, i) => (
            <div key={i} title={`${r.day} ${cell.h}:00 · ${cell.v}%`} style={{
              height: 26, borderRadius: 6, background: shade(cell.v),
              border: cell.v > 85 ? `1px solid ${T.hexA(c, T.dark ? 0.9 : 0.55)}` : '1px solid transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {cell.v > 80 && <span style={{ fontFamily: T.font.mono, fontSize: 9, fontWeight: 600, color: T.dark ? '#06231F' : '#fff' }}>{cell.v}</span>}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ── Horizontal bars list ───────────────────────────────────────
function BarsH({ T, items, max = 100 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
      {items.map((it, i) => {
        const c = cKey(T, it.color || 'teal');
        const pct = Math.round((it.value / max) * 100);
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 92, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 7 }}>
              {it.dot && <span style={{ width: 8, height: 8, borderRadius: 999, background: c, flexShrink: 0 }} />}
              <span style={{ fontFamily: T.font.ui, fontSize: 13, fontWeight: 600, color: T.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{it.label}</span>
            </div>
            <div style={{ flex: 1, height: 9, borderRadius: 999, background: T.hexA(c, T.dark ? 0.16 : 0.12), overflow: 'hidden' }}>
              <div style={{ width: `${pct}%`, height: '100%', borderRadius: 999, background: c }} />
            </div>
            <span style={{ width: 52, textAlign: 'right', fontFamily: T.font.ui, fontSize: 13, fontWeight: 700, color: T.ink, flexShrink: 0 }}>{it.display || `${it.value}${it.unit || '%'}`}</span>
          </div>
        );
      })}
    </div>
  );
}

// ── Stacked single bar (space mix) ─────────────────────────────
function StackBar({ T, segs, height = 14 }) {
  const total = segs.reduce((s, x) => s + x.v, 0);
  return (
    <div>
      <div style={{ display: 'flex', height, borderRadius: 999, overflow: 'hidden', gap: 2 }}>
        {segs.map((s, i) => (
          <div key={i} title={`${s.label}: ${s.v}`} style={{ width: `${(s.v / total) * 100}%`, background: cKey(T, s.color), minWidth: 4 }} />
        ))}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 16px', marginTop: 13 }}>
        {segs.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{ width: 9, height: 9, borderRadius: 3, background: cKey(T, s.color) }} />
            <span style={{ fontFamily: T.font.ui, fontSize: 12.5, color: T.ink2, fontWeight: 600 }}>{s.label}</span>
            <span style={{ fontFamily: T.font.ui, fontSize: 12.5, color: T.ink, fontWeight: 700 }}>{s.v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Gauge arc (semicircle) ─────────────────────────────────────
function GaugeArc({ T, pct, size = 150, color = 'teal', label, sub }) {
  const c = cKey(T, color);
  const stroke = 13, r = (size - stroke) / 2;
  const cx = size / 2, cy = size / 2;
  const circ = Math.PI * r; // semicircle length
  const dash = (pct / 100) * circ;
  const arc = (sweepR) => {
    const a0 = Math.PI, a1 = 0;
    return `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`;
  };
  return (
    <div style={{ position: 'relative', width: size, height: size / 2 + 14 }}>
      <svg width={size} height={size / 2 + 14} viewBox={`0 0 ${size} ${size / 2 + 14}`}>
        <path d={arc()} fill="none" stroke={T.hexA(c, T.dark ? 0.16 : 0.12)} strokeWidth={stroke} strokeLinecap="round" />
        <path d={arc()} fill="none" stroke={c} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={`${dash} ${circ}`} />
      </svg>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, textAlign: 'center' }}>
        <div style={{ fontFamily: T.font.ui, fontWeight: 700, fontSize: size * 0.22, color: T.ink, lineHeight: 1 }}>{label}</div>
        {sub && <div style={{ fontFamily: T.font.mono, fontSize: 10, color: T.ink3, marginTop: 3, textTransform: 'uppercase', letterSpacing: '.04em' }}>{sub}</div>}
      </div>
    </div>
  );
}

// ── Mini sparkline (line) ──────────────────────────────────────
function LineMini({ T, data, color = 'teal', width = 96, height = 30 }) {
  const c = cKey(T, color);
  const max = Math.max(...data), min = Math.min(...data);
  const rng = max - min || 1;
  const x = (i) => (i / (data.length - 1)) * width;
  const y = (v) => height - 3 - ((v - min) / rng) * (height - 6);
  const d = data.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ');
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block', overflow: 'visible' }}>
      <path d={d} fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={x(data.length - 1)} cy={y(data[data.length - 1])} r="2.6" fill={c} />
    </svg>
  );
}

Object.assign(window, { cKey, AreaTrend, Heatmap, BarsH, StackBar, GaugeArc, LineMini });
