// admin-data.jsx — FlexiSpace Admin: portfolio, KPIs, time-series, heatmap, breakdowns
// Builds on window.PEOPLE / TEAMS / ROOMS from app/data.jsx
// Exposes (window): ADMIN

const HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

// ── Portfolio of sites ─────────────────────────────────────────
const SITES = [
  { id: 'noida', name: 'HQ Noida',   city: 'Noida, IN',     floors: 4, desks: 320, rooms: 18, parking: 140, people: 412, occ: 68, status: 'open' },
  { id: 'blr',   name: 'Bangalore',  city: 'Bengaluru, IN', floors: 6, desks: 540, rooms: 28, parking: 220, people: 690, occ: 74, status: 'open' },
  { id: 'mum',   name: 'Mumbai',     city: 'Mumbai, IN',    floors: 2, desks: 120, rooms: 9,  parking: 60,  people: 168, occ: 51, status: 'open' },
];

// ── Headline KPIs (today, HQ Noida) ────────────────────────────
// dir: 'up' = increased; good = whether up is good (drives green/red)
const KPIS = [
  { id: 'occ',     label: 'Desk occupancy', value: 68, unit: '%',  sub: '218 / 320 desks',   delta: 6,  dir: 'up',   good: true,  icon: 'chair', color: 'teal',
    spark: [42, 48, 51, 47, 55, 61, 58, 64, 68] },
  { id: 'rooms',   label: 'Room utilization', value: 74, unit: '%', sub: '13 / 18 in use now', delta: 3,  dir: 'up',   good: true,  icon: 'room', color: 'indigo',
    spark: [55, 60, 58, 66, 70, 68, 72, 71, 74] },
  { id: 'parking', label: 'Parking filled', value: 81, unit: '%',   sub: '113 / 140 bays',     delta: 12, dir: 'up',   good: false, icon: 'car', color: 'electric',
    spark: [40, 52, 60, 65, 70, 74, 78, 80, 81] },
  { id: 'checkin', label: 'Check-in rate', value: 89, unit: '%',    sub: 'of confirmed desks', delta: 2,  dir: 'down', good: false, icon: 'check', color: 'teal',
    spark: [94, 93, 92, 91, 90, 90, 89, 89, 89] },
];

// secondary stat strip
const SUB_STATS = [
  { label: 'People on-site', value: '274', icon: 'team',  hint: 'Live · badge + app check-ins' },
  { label: 'No-shows today', value: '14',  icon: 'clock', hint: 'Auto-released after 30 min', warn: true },
  { label: 'Peak hour',     value: '14:00', icon: 'trend', hint: 'Busiest · 71% load' },
  { label: 'Avg. dwell',     value: '6.4h', icon: 'clock', hint: 'Time on-site per person' },
];

// ── Hourly occupancy curve (today vs last week ghost) ──────────
const occToday = [12, 28, 47, 62, 70, 66, 71, 68, 60, 44, 26, 10];
const occLastWk = [10, 24, 41, 55, 63, 60, 64, 61, 54, 40, 22, 9];
const roomToday = [8, 22, 40, 58, 66, 50, 70, 64, 52, 34, 18, 6];
const HOURLY = HOURS.map((h, i) => ({ h, label: `${h}`, desks: occToday[i], last: occLastWk[i], rooms: roomToday[i] }));

// ── Weekly attendance (anchor days mid-week) ───────────────────
const WEEKLY = [
  { day: 'Mon', pct: 52, ppl: 214 },
  { day: 'Tue', pct: 71, ppl: 292 },
  { day: 'Wed', pct: 78, ppl: 321 },
  { day: 'Thu', pct: 68, ppl: 280 },
  { day: 'Fri', pct: 39, ppl: 161 },
];

// ── Occupancy heatmap: day × hour, value = % ──────────────────
function heatVal(di, hi) {
  const dayW = [0.66, 0.92, 1.0, 0.88, 0.5][di];
  // bell curve over hours, peak ~ index 4-6
  const bell = Math.exp(-Math.pow((hi - 5) / 3.4, 2));
  const noise = ((di * 7 + hi * 13) % 11) / 60;
  return Math.round(Math.min(98, Math.max(4, (bell * 96 * dayW) + noise * 10)));
}
const HEATMAP = DAYS.map((d, di) => ({ day: d, cells: HOURS.map((h, hi) => ({ h, v: heatVal(di, hi) })) }));

// ── Department / team breakdown ────────────────────────────────
const TEAM_BREAKDOWN = Object.keys(window.TEAMS).map((t) => {
  const all = window.PEOPLE.filter((p) => p.team === t);
  const here = all.filter((p) => p.here);
  const base = { Engineering: 78, Product: 64, Design: 71, Sales: 46, Ops: 88 }[t] || 60;
  return { team: t, color: window.TEAMS[t].color, onsite: here.length, total: all.length, util: base };
});

// ── Floor utilization (HQ Noida) ───────────────────────────────
const FLOOR_UTIL = [
  { floor: '2nd Floor', desks: 80, occ: 54, rooms: 4, hot: false },
  { floor: '3rd Floor', desks: 96, occ: 82, rooms: 6, hot: true },
  { floor: '4th Floor', desks: 80, occ: 71, rooms: 5, hot: false },
  { floor: '5th Floor', desks: 64, occ: 49, rooms: 3, hot: false },
];

// ── Top rooms by booked hours ──────────────────────────────────
const TOP_ROOMS = window.ROOMS.slice(0, 6).map((r, i) => ({
  name: r.name, floor: `${r.floor}rd Floor`, seats: r.seats,
  hours: [38, 31, 27, 22, 19, 12][i], util: [92, 84, 73, 61, 52, 33][i],
}));

// ── Space mix (desk states right now) ──────────────────────────
const SPACE_MIX = [
  { label: 'Occupied',  v: 218, color: 'teal' },
  { label: 'Booked, not in', v: 36, color: 'indigo' },
  { label: 'Available', v: 52, color: 'avail' },
  { label: 'Maintenance', v: 14, color: 'warn' },
];

// ── Operational alerts ─────────────────────────────────────────
const ALERTS = [
  { id: 'a1', sev: 'warn',  icon: 'desk',    title: '3 desks flagged for maintenance', sub: '3rd Floor · Engineering pod · since 09:12', action: 'Assign' },
  { id: 'a2', sev: 'info',  icon: 'clock',   title: '14 no-show bookings auto-released', sub: 'Returned to pool · 41 desks freed this week', action: 'Review' },
  { id: 'a3', sev: 'crit',  icon: 'car',     title: 'Parking B2 at 92% capacity', sub: 'Overflow to visitor zone enabled', action: 'Manage' },
  { id: 'a4', sev: 'warn',  icon: 'ac',      title: 'AC ticket — Chole Bhature', sub: 'Reported by 2 occupants · 14:00 booking at risk', action: 'View' },
];

// ── Recent activity / bookings ─────────────────────────────────
const ACTIVITY = [
  { who: 'p4',  type: 'desk', resource: 'Desk 55A',     floor: '3rd Floor', time: '09:58', status: 'checked-in' },
  { who: 'p1',  type: 'room', resource: 'Chai Biskut',  floor: '3rd Floor', time: '11:00', status: 'confirmed' },
  { who: 'p10', type: 'park', resource: 'Bay 2V · B1',  floor: 'Parking',   time: '10:04', status: 'checked-in' },
  { who: 'p5',  type: 'desk', resource: 'Desk 12C',     floor: '3rd Floor', time: '10:20', status: 'no-show' },
  { who: 'p8',  type: 'room', resource: 'Poha Jalebi',  floor: '3rd Floor', time: '14:00', status: 'confirmed' },
  { who: 'p13', type: 'desk', resource: 'Desk 30B',     floor: '4th Floor', time: '09:41', status: 'checked-in' },
  { who: 'p11', type: 'park', resource: 'EV E-04 · B1', floor: 'Parking',   time: '10:32', status: 'confirmed' },
  { who: 'p15', type: 'room', resource: 'Dabeli Den',   floor: '3rd Floor', time: '17:00', status: 'confirmed' },
];

// ── Parking zones (reuse PARKING from app) ─────────────────────
const PARK_ZONES = window.DATA.PARKING.zones;

// ── Policies (settings preview) ────────────────────────────────
const POLICIES = [
  { id: 'pol1', label: 'Auto-release no-shows', sub: 'Free desk if not checked-in within 30 min', on: true },
  { id: 'pol2', label: 'Max advance booking', sub: 'Desks bookable up to 14 days ahead', on: true },
  { id: 'pol3', label: 'Anchor days', sub: 'Tue · Wed · Thu required for hybrid teams', on: true },
  { id: 'pol4', label: 'Room approval for >12 seats', sub: 'Town-hall rooms need WP-manager sign-off', on: false },
  { id: 'pol5', label: 'EV bay time limit', sub: 'Release EV bays after 4h of charging', on: true },
];

const ADMIN = {
  HOURS, DAYS, SITES, KPIS, SUB_STATS, HOURLY, WEEKLY, HEATMAP,
  TEAM_BREAKDOWN, FLOOR_UTIL, TOP_ROOMS, SPACE_MIX, ALERTS, ACTIVITY,
  PARK_ZONES, POLICIES,
};

Object.assign(window, { ADMIN });
