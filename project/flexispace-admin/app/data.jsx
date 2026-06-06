// data.jsx — FlexiSpace mock data: people, rooms, desks/floors, parking, bookings
// Exposes (window): DATA, FLOORS, makeFloor, AMENITIES, DESK_FILTERS

// ── People / teammates ─────────────────────────────────────────
const TEAMS = {
  Design:      { color: '#7C3AED', short: 'DSGN' },
  Engineering: { color: '#2F6BFF', short: 'ENG' },
  Product:     { color: '#0E9C8E', short: 'PROD' },
  Sales:       { color: '#F59E0B', short: 'SALES' },
  Ops:         { color: '#EC4899', short: 'OPS' },
};

const PEOPLE = [
  { id: 'me',  name: 'Ishita Sharma',   team: 'Product',     role: 'Sr. PM',          init: 'IS', here: true },
  { id: 'p1',  name: 'Aarav Menon',    team: 'Design',      role: 'Design Lead',     init: 'AM', here: true },
  { id: 'p2',  name: 'Sara Iyer',      team: 'Design',      role: 'Product Designer',init: 'SI', here: true },
  { id: 'p3',  name: 'Dev Kapoor',     team: 'Design',      role: 'UX Researcher',   init: 'DK', here: true },
  { id: 'p4',  name: 'Nisha Bose',     team: 'Engineering', role: 'Staff Eng',       init: 'NB', here: true },
  { id: 'p5',  name: 'Rohan Gupta',    team: 'Engineering', role: 'Frontend',        init: 'RG', here: true },
  { id: 'p6',  name: 'Tara Singh',     team: 'Engineering', role: 'Backend',         init: 'TS', here: false },
  { id: 'p7',  name: 'Imran Q.',       team: 'Engineering', role: 'Platform',        init: 'IQ', here: true },
  { id: 'p8',  name: 'Leela Nair',     team: 'Product',     role: 'PM',              init: 'LN', here: true },
  { id: 'p9',  name: 'Karan Shah',     team: 'Product',     role: 'PM',              init: 'KS', here: false },
  { id: 'p10', name: 'Ana Verma',      team: 'Sales',       role: 'AE',              init: 'AV', here: true },
  { id: 'p11', name: 'Jay Patel',      team: 'Sales',       role: 'SDR',             init: 'JP', here: true },
  { id: 'p12', name: 'Mira Khan',      team: 'Ops',         role: 'WP Manager',      init: 'MK', here: true },
  { id: 'p13', name: 'Omar Faruq',     team: 'Engineering', role: 'Mobile',          init: 'OF', here: true },
  { id: 'p14', name: 'Zoya Ali',       team: 'Design',      role: 'Brand',           init: 'ZA', here: false },
  { id: 'p15', name: 'Vikram Rao',     team: 'Product',     role: 'Group PM',        init: 'VR', here: true },
];

// ── Meeting rooms ──────────────────────────────────────────────
const ROOMS = [
  { id: 'r1', name: 'Chai Biskut',   floor: 3, seats: 8,  zone: 'North wing',  status: 'available', amen: ['wifi','ac','projector','monitor','whiteboard'], next: null,        until: '—',     pop: 0.7, x: 60,  y: 70  },
  { id: 'r2', name: 'Poha Jalebi',   floor: 3, seats: 12, zone: 'North wing',  status: 'available', amen: ['wifi','ac','monitor','whiteboard','video'],     next: '15:30',    until: '15:30', pop: 0.9, x: 230, y: 70  },
  { id: 'r3', name: 'Chole Bhature', floor: 3, seats: 8,  zone: 'East wing',   status: 'busy',      amen: ['wifi','ac','monitor','whiteboard'],            next: '14:00',    until: '14:00', pop: 0.8, x: 300, y: 300 },
  { id: 'r4', name: 'Bada Pav',      floor: 3, seats: 5,  zone: 'Quiet zone',  status: 'available', amen: ['wifi','ac','monitor'],                          next: '16:00',    until: '16:00', pop: 0.5, x: 60,  y: 360 },
  { id: 'r5', name: 'Ban Maska',     floor: 3, seats: 4,  zone: 'Quiet zone',  status: 'soon',      amen: ['wifi','ac','video'],                            next: '13:15',    until: '13:15', pop: 0.6, x: 150, y: 470 },
  { id: 'r6', name: 'Dabeli Den',    floor: 3, seats: 16, zone: 'Town hall',   status: 'available', amen: ['wifi','ac','projector','video','whiteboard'],   next: '17:00',    until: '17:00', pop: 0.95,x: 250, y: 470 },
];

const AMENITIES = {
  wifi:      { label: 'Wi-Fi' },
  ac:        { label: 'AC' },
  projector: { label: 'Projector' },
  monitor:   { label: 'Monitor' },
  dual:      { label: 'Dual monitor' },
  whiteboard:{ label: 'Whiteboard' },
  video:     { label: 'Video conf' },
};

// availability timeline (per room, 9–18h slots; true = free)
function roomTimeline(seed) {
  const out = [];
  for (let h = 9; h <= 17; h++) {
    const free = ((seed * (h + 3)) % 7) > 2;
    out.push({ h, free });
  }
  return out;
}

// ── Desk filters ───────────────────────────────────────────────
const DESK_FILTERS = [
  { id: 'window',    label: 'Window seat' },
  { id: 'quiet',     label: 'Quiet zone' },
  { id: 'collab',    label: 'Collaboration' },
  { id: 'standing',  label: 'Standing desk' },
  { id: 'dual',      label: 'Dual monitor' },
  { id: 'a11y',      label: 'Accessible' },
  { id: 'nearteam',  label: 'Near my team' },
  { id: 'nearmgr',   label: 'Near manager' },
];

// ── Floor / desk generation ────────────────────────────────────
// viewBox is 360 x 540 (portrait). Neighborhoods are team clusters.
function rng(seed) { let s = seed; return () => (s = (s * 9301 + 49297) % 233280) / 233280; }

function makeFloor(floorNum) {
  const r = rng(floorNum * 1000 + 7);
  const neighborhoods = [
    { team: 'Design',      x: 36,  y: 120, cols: 3, rows: 3, zone: 'window' },
    { team: 'Engineering', x: 150, y: 120, cols: 4, rows: 3, zone: 'collab' },
    { team: 'Product',     x: 40,  y: 250, cols: 3, rows: 3, zone: 'quiet' },
    { team: 'Sales',       x: 240, y: 250, cols: 3, rows: 2, zone: 'collab' },
    { team: 'Ops',         x: 150, y: 350, cols: 3, rows: 2, zone: 'standing' },
  ];
  const desks = [];
  let n = 1;
  const peopleHere = PEOPLE.filter(p => p.here);
  let pPtr = 0;
  neighborhoods.forEach((nb, ni) => {
    const gap = 30;
    for (let row = 0; row < nb.rows; row++) {
      for (let col = 0; col < nb.cols; col++) {
        const x = nb.x + col * gap;
        const y = nb.y + row * gap;
        const roll = r();
        let status = 'available';
        let occupant = null;
        if (roll > 0.86) status = 'maintenance';
        else if (nb.team === 'Product' && row === 0 && col === 2 && floorNum === 3) status = 'mine';
        else if (roll > 0.74) status = 'vip' && false || (roll > 0.97 ? 'vip' : 'booked');
        else if (roll > 0.5) status = 'booked';
        if (status === 'booked') {
          // assign a teammate from same team if possible
          const sameTeam = peopleHere.filter(p => p.team === nb.team && !p._used);
          const pick = sameTeam[0] || peopleHere[pPtr % peopleHere.length];
          if (pick) { pick._used = true; occupant = pick.id; }
          pPtr++;
        }
        if (status === 'mine') occupant = 'me';
        const tags = [];
        if (col === 0) tags.push('window');
        if (nb.zone === 'quiet') tags.push('quiet');
        if (nb.zone === 'collab') tags.push('collab');
        if (nb.zone === 'standing' || roll > 0.7) tags.push('standing');
        if (roll > 0.4) tags.push('dual');
        if (ni === 0 && row === 2 && col === 0) tags.push('a11y');
        desks.push({ id: `${floorNum}-D${n}`, label: `${nb.team[0]}${n}`, x, y, status, team: nb.team, occupant, tags, zone: nb.zone });
        n++;
      }
    }
  });
  PEOPLE.forEach(p => delete p._used);
  return {
    num: floorNum,
    name: floorNum === 3 ? '3rd Floor' : `${floorNum}th Floor`,
    desks,
    rooms: ROOMS.map(rm => ({ ...rm })),
    amenities: [
      { id: 'entry', kind: 'entrance', x: 180, y: 510, label: 'Entrance' },
      { id: 'cafe',  kind: 'cafe',     x: 300, y: 130, label: 'Café' },
      { id: 'wc',    kind: 'wc',       x: 320, y: 420, label: 'Restroom' },
    ],
  };
}

const FLOORS = [2, 3, 4, 5].map(makeFloor);

// ── Parking ────────────────────────────────────────────────────
const PARKING = {
  levels: ['B1', 'B2'],
  zones: [
    { id: 'z1', name: 'Reserved',   total: 24, free: 6,  kind: 'reserved' },
    { id: 'z2', name: 'General',    total: 80, free: 23, kind: 'general' },
    { id: 'z3', name: 'EV Charging',total: 12, free: 4,  kind: 'ev' },
    { id: 'z4', name: 'Accessible', total: 8,  free: 5,  kind: 'a11y' },
    { id: 'z5', name: 'Visitor',    total: 16, free: 9,  kind: 'visitor' },
    { id: 'z6', name: 'Two-wheeler',total: 60, free: 28, kind: 'bike' },
  ],
  vehicles: [
    { id: 'v1', name: 'Hyundai Creta', plate: 'DL 4C AB 1234', ev: false, primary: true },
    { id: 'v2', name: 'Tata Nexon EV', plate: 'DL 1C XY 9087', ev: true,  primary: false },
    { id: 'v3', name: 'Honda Activa',  plate: 'DL 8S CD 4521', ev: false, twoWheeler: true },
  ],
};

// ── Week + per-date schedule (calendar-driven dashboard) ───────
const WEEK = [
  { n: 1, dow: 'Mon', label: 'Mon 1 Jun' },
  { n: 2, dow: 'Tue', label: 'Tue 2 Jun', today: true },
  { n: 3, dow: 'Wed', label: 'Wed 3 Jun' },
  { n: 4, dow: 'Thu', label: 'Thu 4 Jun' },
  { n: 5, dow: 'Fri', label: 'Fri 5 Jun' },
  { n: 6, dow: 'Sat', label: 'Sat 6 Jun', weekend: true },
  { n: 7, dow: 'Sun', label: 'Sun 7 Jun', weekend: true },
];

const SCHEDULE = {
  1: {
    state: 'past', tag: 'Completed',
    desk: { id: '3-D5', label: '30B', floor: '3rd Floor', from: '10:00', to: '18:00' },
    parking: { zone: 'General', slot: '2V', level: 'B1', from: '10:00', to: '18:00' },
    meetings: [{ id: 'm1a', title: 'Weekly sync', room: 'Chai Biskut', from: '11:00', to: '11:30', team: 'Product' }],
    events: [],
    snapshot: { desks: { free: 0, total: 96 }, rooms: { free: 0, total: 6 }, parking: { free: 0, total: 140 } },
  },
  2: {
    state: 'today', tag: 'Checked in',
    desk: { id: '3-D14', label: '55A', floor: '3rd Floor', from: '10:00', to: '19:00', status: 'checked-in' },
    parking: { zone: 'General', slot: '4V', level: 'B1', from: '10:00', to: '19:00' },
    meetings: [
      { id: 'm1', title: 'Design sync', room: 'Chai Biskut', from: '11:00', to: '11:30', team: 'Design' },
      { id: 'm2', title: 'Sprint review', room: 'Poha Jalebi', from: '14:00', to: '15:00', team: 'Engineering' },
    ],
    events: [{ id: 'e1', title: 'Town hall — Q2', room: 'Dabeli Den', from: '17:00', to: '18:00' }],
    snapshot: { desks: { free: 41, total: 96 }, rooms: { free: 4, total: 6 }, parking: { free: 47, total: 140 } },
  },
  3: {
    state: 'upcoming', tag: 'Upcoming',
    desk: { id: '3-D14', label: '55A', floor: '3rd Floor', from: '10:00', to: '19:00' },
    parking: { zone: 'General', slot: '4V', level: 'B1', from: '10:00', to: '19:00' },
    meetings: [{ id: 'm3', title: 'Roadmap review', room: 'Poha Jalebi', from: '10:30', to: '11:30', team: 'Product' }],
    events: [],
    snapshot: { desks: { free: 38, total: 96 }, rooms: { free: 3, total: 6 }, parking: { free: 44, total: 140 } },
  },
  4: {
    state: 'upcoming', tag: 'Upcoming',
    desk: { id: '3-D8', label: '12C', floor: '3rd Floor', from: '09:30', to: '18:00' },
    parking: null,
    meetings: [{ id: 'm4', title: '1:1 · Vikram', room: 'Bada Pav', from: '12:00', to: '12:30', team: 'Product' }],
    events: [],
    snapshot: { desks: { free: 52, total: 96 }, rooms: { free: 5, total: 6 }, parking: { free: 61, total: 140 } },
  },
  5: {
    state: 'upcoming', tag: 'Working from home', wfh: true,
    desk: null, parking: null, meetings: [], events: [],
    snapshot: { desks: { free: 71, total: 96 }, rooms: { free: 6, total: 6 }, parking: { free: 88, total: 140 } },
  },
  6: { state: 'weekend', tag: 'Weekend', desk: null, parking: null, meetings: [], events: [], snapshot: { desks: { free: 96, total: 96 }, rooms: { free: 6, total: 6 }, parking: { free: 140, total: 140 } } },
  7: { state: 'weekend', tag: 'Weekend', desk: null, parking: null, meetings: [], events: [], snapshot: { desks: { free: 96, total: 96 }, rooms: { free: 6, total: 6 }, parking: { free: 140, total: 140 } } },
};

function getDay(n) {
  const meta = WEEK.find(w => w.n === n) || WEEK[1];
  const s = SCHEDULE[n] || { state: 'empty', tag: 'Nothing booked', desk: null, parking: null, meetings: [], events: [], snapshot: { desks: { free: 60, total: 96 }, rooms: { free: 5, total: 6 }, parking: { free: 70, total: 140 } } };
  const count = (s.desk ? 1 : 0) + (s.parking ? 1 : 0) + s.meetings.length + s.events.length;
  return { ...meta, ...s, count };
}

const TODAY = { date: 'Tue, 2 Jun', ...SCHEDULE[2] };

const UPCOMING = [
  { id: 'b1', day: 'Wed 3 Jun',  desk: '55A · 3rd Floor', from: '10:00', to: '19:00', parking: '4V', room: null,           kind: 'desk' },
  { id: 'b2', day: 'Thu 4 Jun',  desk: '12C · 3rd Floor', from: '09:30', to: '18:00', parking: null, room: 'Bada Pav 12:00',kind: 'desk' },
  { id: 'b3', day: 'Mon 8 Jun',  desk: null,              from: '15:00', to: '16:00', parking: null, room: 'Poha Jalebi',  kind: 'room' },
];

const SNAPSHOT = SCHEDULE[2].snapshot;

const DATA = { TEAMS, PEOPLE, ROOMS, AMENITIES, DESK_FILTERS, PARKING, TODAY, UPCOMING, SNAPSHOT, WEEK, SCHEDULE, getDay, roomTimeline };

Object.assign(window, { DATA, FLOORS, makeFloor, AMENITIES, DESK_FILTERS, TEAMS, PEOPLE, WEEK, getDay });
