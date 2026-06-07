// theme.jsx — FlexiSpace design tokens + tweakable variants
// Exposes: buildTokens(t), SEAT_SYSTEMS, FONTS, hexA
// Evolved teal→indigo identity: solid teal primary, indigo brand, electric-blue accent,
// gradient used sparingly. Premium restraint.

const hexA = (hex, a) => {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
};

// lighten a hex toward white by amt (0..1) — raises lightness + lowers saturation
// (used to lift saturated accents to readable contrast on dark surfaces)
const fsLighten = (hex, amt) => {
  const h = String(hex).replace('#', '');
  if (h.length < 6) return hex;
  let r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
  r = Math.round(r + (255 - r) * amt); g = Math.round(g + (255 - g) * amt); b = Math.round(b + (255 - b) * amt);
  return `rgb(${r},${g},${b})`;
};

const FONTS = {
  ui: '"Schibsted Grotesk", system-ui, sans-serif',
  mono: '"JetBrains Mono", ui-monospace, monospace',
};

// ── Brand palettes (selectable) ───────────────────────────────
const BRANDS = {
  'Teal · Indigo': { teal: '#0E9C8E', tealDeep: '#0B7E73', indigo: '#4F46E5', electric: '#2F6BFF' },
  'Deep Teal':     { teal: '#0F8F84', tealDeep: '#0A6B62', indigo: '#3B3FB6', electric: '#2563EB' },
  'Indigo Lead':   { teal: '#11A89A', tealDeep: '#0C8076', indigo: '#5B57F2', electric: '#3D7BFF' },
};

// ── Seat-status color systems (a requested variation dimension) ─
const SEAT_SYSTEMS = {
  Classic: {
    label: 'Classic',
    fill: 'solid',
    states: {
      available:  { dot: '#16A34A', fill: '#16A34A', ink: '#fff', soft: '#DCFCE7', text: '#15803D' },
      booked:     { dot: '#2F6BFF', fill: '#2F6BFF', ink: '#fff', soft: '#DBE7FF', text: '#1D4ED8' },
      restricted: { dot: '#94A3B8', fill: '#CBD5E1', ink: '#475569', soft: '#EEF2F6', text: '#64748B' },
      maintenance:{ dot: '#F59E0B', fill: '#F59E0B', ink: '#fff', soft: '#FEF3C7', text: '#B45309' },
      vip:        { dot: '#7C3AED', fill: '#7C3AED', ink: '#fff', soft: '#EDE4FE', text: '#6D28D9' },
      mine:       { dot: '#0E9C8E', fill: '#0E9C8E', ink: '#fff', soft: '#D5F3EF', text: '#0B7E73' },
    },
  },
  Tinted: {
    label: 'Tinted',
    fill: 'tint',
    states: {
      available:  { dot: '#16A34A', fill: '#E7F8EE', ink: '#15803D', soft: '#E7F8EE', text: '#15803D', ring: '#16A34A' },
      booked:     { dot: '#2F6BFF', fill: '#E7EEFF', ink: '#1D4ED8', soft: '#E7EEFF', text: '#1D4ED8', ring: '#2F6BFF' },
      restricted: { dot: '#94A3B8', fill: '#EFF2F6', ink: '#64748B', soft: '#EFF2F6', text: '#64748B', ring: '#CBD5E1' },
      maintenance:{ dot: '#F59E0B', fill: '#FEF4DC', ink: '#B45309', soft: '#FEF4DC', text: '#B45309', ring: '#F59E0B' },
      vip:        { dot: '#7C3AED', fill: '#F0E9FE', ink: '#6D28D9', soft: '#F0E9FE', text: '#6D28D9', ring: '#7C3AED' },
      mine:       { dot: '#0E9C8E', fill: '#DCF4F0', ink: '#0B7E73', soft: '#DCF4F0', text: '#0B7E73', ring: '#0E9C8E' },
    },
  },
  'High contrast': {
    label: 'High contrast',
    fill: 'solid',
    states: {
      available:  { dot: '#047A33', fill: '#04A33F', ink: '#fff', soft: '#CFF6DC', text: '#047A33' },
      booked:     { dot: '#1B2A6B', fill: '#1F39B5', ink: '#fff', soft: '#D3DAFB', text: '#1B2A6B' },
      restricted: { dot: '#3F4A5A', fill: '#64748B', ink: '#fff', soft: '#E2E8F0', text: '#334155' },
      maintenance:{ dot: '#9A5800', fill: '#E07B00', ink: '#fff', soft: '#FCE6C2', text: '#9A5800' },
      vip:        { dot: '#4A1D96', fill: '#6D28D9', ink: '#fff', soft: '#E6DAFB', text: '#4A1D96' },
      mine:       { dot: '#075F57', fill: '#0B7E73', ink: '#fff', soft: '#CDEEE9', text: '#075F57' },
    },
  },
};

const STATUS_META = {
  available:   { name: 'Available',   bookable: true },
  booked:      { name: 'Booked',      bookable: false },
  restricted:  { name: 'Restricted',  bookable: false },
  maintenance: { name: 'Maintenance', bookable: false },
  vip:         { name: 'Executive',   bookable: false },
  mine:        { name: 'Your desk',   bookable: false },
};

// ── Mode-aware neutral palettes (light / dark) ─────────────────
const NEUTRALS = {
  light: {
    ink: '#0E1726', ink2: '#5A6675', ink3: '#8C97A6', inkInv: '#FFFFFF',
    canvas: '#F4F6F8', surface: '#FFFFFF', surfaceAlt: '#FBFCFD',
    line: '#E8ECF1', lineSoft: '#EFF2F6', borderColor: '#E4E9EF',
    glass: 'rgba(255,255,255,0.86)', glassChip: 'rgba(255,255,255,0.85)',
    overlay: 'rgba(14,23,38,0.42)',
    mapBg: 'linear-gradient(180deg, #EEF2F7 0%, #E2E8F0 100%)',
    mapSlab: '#FFFFFF', mapSlabSide: '#CBD4DE', mapSlabStroke: '#DCE2E9', mapCorridor: '#EDF1F5',
    shadowColor: '15,23,42',
  },
  dark: {
    ink: '#ECEFF4', ink2: '#AEB8C6', ink3: '#8B96A4', inkInv: '#FFFFFF',
    canvas: '#0B1018', surface: '#161D29', surfaceAlt: '#1C2433',
    line: '#2A3340', lineSoft: '#202836', borderColor: '#313B4B',
    glass: 'rgba(17,23,33,0.84)', glassChip: 'rgba(28,36,49,0.82)',
    overlay: 'rgba(3,6,12,0.62)',
    mapBg: 'linear-gradient(180deg, #161E2B 0%, #0D131C 100%)',
    mapSlab: '#1E2734', mapSlabSide: '#10161F', mapSlabStroke: '#2B3645', mapCorridor: '#27313F',
    shadowColor: '0,0,0',
  },
};

// ── Build the full token set from current tweaks ───────────────
function buildTokens(t) {
  const b = BRANDS[t.brand] || BRANDS['Teal · Indigo'];
  const style = t.visual || 'Soft';
  const dark = (t.mode || 'light') === 'dark';
  const N = dark ? NEUTRALS.dark : NEUTRALS.light;
  const sc = N.shadowColor;

  const styleMap = {
    Soft:  { rCard: 22, rEl: 14, rPill: 999, border: dark?1:0, sm: `0 1px 2px rgba(${sc},${dark?.5:.04}), 0 4px 16px rgba(${sc},${dark?.5:.05})`, md: `0 6px 24px rgba(${sc},${dark?.6:.08}), 0 2px 6px rgba(${sc},${dark?.5:.05})`, fillTint: 0.10 },
    Crisp: { rCard: 14, rEl: 10, rPill: 10,  border: 1,        sm: `0 1px 1px rgba(${sc},${dark?.45:.03})`, md: `0 4px 14px rgba(${sc},${dark?.55:.06})`, fillTint: 0.07 },
    Bold:  { rCard: 26, rEl: 16, rPill: 999, border: dark?1:0, sm: `0 2px 6px rgba(${sc},${dark?.5:.06}), 0 8px 28px rgba(${sc},${dark?.55:.07})`, md: `0 10px 34px rgba(${sc},${dark?.65:.12})`, fillTint: 0.14 },
  };
  const s = styleMap[style];

  return {
    font: FONTS,
    mode: dark ? 'dark' : 'light', dark,
    // brand
    teal: b.teal, tealDeep: b.tealDeep, indigo: b.indigo, electric: b.electric,
    primary: b.teal,
    gradient: `linear-gradient(105deg, ${b.teal} 0%, ${b.indigo} 100%)`,
    // ink + surfaces (mode-aware)
    ink: N.ink, ink2: N.ink2, ink3: N.ink3, inkInv: N.inkInv,
    canvas: N.canvas, surface: N.surface, surfaceAlt: N.surfaceAlt,
    line: N.line, lineSoft: N.lineSoft,
    glass: N.glass, glassChip: N.glassChip, overlay: N.overlay,
    mapBg: N.mapBg, mapSlab: N.mapSlab, mapSlabSide: N.mapSlabSide, mapSlabStroke: N.mapSlabStroke, mapCorridor: N.mapCorridor,
    // style
    style, rCard: s.rCard, rEl: s.rEl, rPill: s.rPill,
    border: s.border, borderColor: N.borderColor,
    shadowSm: s.sm, shadowMd: s.md, fillTint: s.fillTint,
    // helpers
    hexA,
    // mode-aware accent foreground (lifts saturated colors to AA contrast on dark)
    accent: dark ? (hex) => fsLighten(hex, 0.42) : (hex) => hex,
    accentSoft: (hex, a) => hexA(hex, (dark ? (a || 0.12) + 0.05 : (a || 0.12))),
    link: dark ? fsLighten(b.teal, 0.46) : b.tealDeep,
    // tweak-derived
    seatSystem: SEAT_SYSTEMS[t.seatColors] || SEAT_SYSTEMS.Classic,
    statusMeta: STATUS_META,
  };
}

Object.assign(window, { buildTokens, SEAT_SYSTEMS, STATUS_META, FONTS, hexA, BRANDS });
