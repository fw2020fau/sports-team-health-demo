// server.js
const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001; // important for cloud hosting

// Parse JSON bodies
app.use(express.json());

// Session middleware
app.use(session({
  secret: 'demo-sports-health-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 60 * 1000,
    sameSite: 'lax',
    secure: false  // ok for HTTP demo; not production-grade
  },
}));

// Serve static frontend files (index.html, script.js, styles.css) from this folder
app.use(express.static(path.join(__dirname)));

// -------- Demo data --------

const users = [
  { id: 1, username: 'trainer', password: 'trainer', role: 'trainer', playerId: null },
  { id: 2, username: 'coach',   password: 'coach',   role: 'coach',   playerId: null },
  { id: 3, username: 'player',  password: 'player',  role: 'player',  playerId: 101 },
  { id: 4, username: 'admin',   password: 'admin',   role: 'admin',   playerId: null },
];

const players = [
  { id: 101, name: 'John Adams', team: 'Team A', position: 'Quarterback',   status: 'cleared' },
  { id: 102, name: 'Mike Brown', team: 'Team A', position: 'Wide Receiver', status: 'at risk' },
  { id: 103, name: 'Alex Green', team: 'Team A', position: 'Running Back',  status: 'needs attention' },
];

let nextIncidentId = 1;
const incidents = [];
const vitals = {};
const fatigueReports = {};

// -------- Middleware helpers --------

function requireLogin(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not logged in.' });
  }
  next();
}

function requireRole(roles) {
  return (req, res, next) => {
    if (!req.session.user) {
      return res.status(401).json({ error: 'Not logged in.' });
    }
    if (!roles.includes(req.session.user.role)) {
      return res.status(403).json({ error: 'Forbidden. Role not allowed.' });
    }
    next();
  };
}

// -------- Auth routes --------

app.post('/login', (req, res) => {
  const { username, password, playerId } = req.body || {};

  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ error: 'Invalid username or password.' });
  }

  const sessionUser = {
    id: user.id,
    username: user.username,
    role: user.role,
    playerId: user.playerId,
  };

  // allow player to choose which playerId they are
  if (user.role === 'player' && playerId) {
    const pid = parseInt(playerId, 10);
    const playerExists = players.some((p) => p.id === pid);
    if (!playerExists) {
      return res.status(400).json({ error: 'Player ID not found.' });
    }
    sessionUser.playerId = pid;
  }

  req.session.user = sessionUser;

  res.json({ message: 'Logged in.', user: sessionUser });
});

app.get('/session', (req, res) => {
  if (!req.session.user) {
    return res.json({ user: null });
  }
  res.json({ user: req.session.user });
});

app.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ message: 'Logged out.' });
  });
});

// -------- Players --------

// any logged in user can view players
app.get('/players', requireLogin, (req, res) => {
  res.json(players);
});

// trainer/admin can update player status
app.patch('/players/:id/status', requireRole(['trainer', 'admin']), (req, res) => {
  const playerId = parseInt(req.params.id, 10);
  const { status } = req.body || {};
  const player = players.find((p) => p.id === playerId);

  if (!player) {
    return res.status(404).json({ error: 'Player not found.' });
  }

  if (!['cleared', 'at risk', 'needs attention'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status value.' });
  }

  player.status = status;
  res.json(player);
});

// -------- Vitals --------

// trainer logs vitals
app.post('/vitals', requireRole(['trainer']), (req, res) => {
  const { playerId, hr, temp, o2 } = req.body || {};
  const pid = parseInt(playerId, 10);

  const player = players.find((p) => p.id === pid);
  if (!player) {
    return res.status(404).json({ error: 'Player not found.' });
  }

  const entry = {
    hr: Number(hr),
    temp: Number(temp),
    o2: Number(o2),
    recordedAt: new Date().toISOString(),
  };

  if (!vitals[pid]) {
    vitals[pid] = [];
  }
  vitals[pid].push(entry);

  if (entry.hr < 50 || entry.hr > 190 || entry.temp > 38.5 || entry.o2 < 92) {
    console.log('ALERT: abnormal vitals for player', pid, entry);
  }

  res.status(201).json(entry);
});

// get vitals for a player
app.get('/players/:id/vitals', requireLogin, (req, res) => {
  const playerId = parseInt(req.params.id, 10);
  const player = players.find((p) => p.id === playerId);

  if (!player) {
    return res.status(404).json({ error: 'Player not found.' });
  }

  if (req.session.user.role === 'player' &&
      req.session.user.playerId !== playerId) {
    return res.status(403).json({ error: 'Players can only view their own vitals.' });
  }

  res.json(vitals[playerId] || []);
});

// -------- Incidents --------

// trainer logs incident
app.post('/incidents', requireRole(['trainer']), (req, res) => {
  const { playerId, type, severity, notes } = req.body || {};
  const pid = parseInt(playerId, 10);

  const player = players.find((p) => p.id === pid);
  if (!player) {
    return res.status(404).json({ error: 'Player not found.' });
  }

  const incident = {
    id: nextIncidentId++,
    playerId: pid,
    type: type || 'unknown',
    severity: severity || 'low',
    notes: notes || '',
    createdBy: player.name,
    createdAt: new Date().toISOString(),
  };

  incidents.push(incident);
  res.status(201).json(incident);
});

// trainer / coach / admin can view incidents
app.get('/incidents', requireRole(['trainer', 'coach', 'admin']), (req, res) => {
  res.json(incidents);
});

// -------- Fatigue reporting by players --------

app.post('/players/:id/fatigue', requireRole(['player']), (req, res) => {
  const playerId = parseInt(req.params.id, 10);
  const { level, note } = req.body || {};

  const player = players.find((p) => p.id === playerId);
  if (!player) {
    return res.status(404).json({ error: 'Player not found.' });
  }

  if (req.session.user.playerId !== playerId) {
    return res.status(403).json({ error: 'Players can only report their own fatigue.' });
  }

  const lvl = Number(level);
  if (Number.isNaN(lvl) || lvl < 1 || lvl > 10) {
    return res.status(400).json({ error: 'Fatigue level must be 1-10.' });
  }

  if (!fatigueReports[playerId]) {
    fatigueReports[playerId] = [];
  }

  const report = {
    level: lvl,
    note: note || '',
    reportedAt: new Date().toISOString(),
  };

  fatigueReports[playerId].push(report);

  const fatigueIncident = {
    id: nextIncidentId++,
    playerId,
    type: 'Fatigue report',
    severity: lvl >= 8 ? 'high' : lvl >= 5 ? 'moderate' : 'low',
    notes: `Level ${lvl}/10${report.note ? ` - ${report.note}` : ''}`,
    createdBy: player.name,
    createdAt: report.reportedAt,
  };
  incidents.push(fatigueIncident);

  res.status(201).json(report);
});

// -------- Dashboard summary (coach / trainer / admin) --------

app.get('/dashboard/summary', requireRole(['trainer', 'coach', 'admin']), (req, res) => {
  const summary = players.map((player) => {
    const history = vitals[player.id] || [];
    const latest = history[history.length - 1] || null;

    let baseStatus = player.status;
    let autoStatus = 'cleared';

    if (latest) {
      if (latest.hr < 50 || latest.hr > 190 || latest.temp > 38.5 || latest.o2 < 92) {
        autoStatus = 'needs attention';
      } else if (latest.temp > 37.8 || latest.hr > 160) {
        autoStatus = 'at risk';
      } else {
        autoStatus = 'cleared';
      }
    }

    const rank = { 'cleared': 1, 'at risk': 2, 'needs attention': 3 };
    const finalRank = Math.max(rank[baseStatus] || 1, rank[autoStatus] || 1);

    const finalStatus =
      finalRank === 3 ? 'needs attention' :
      finalRank === 2 ? 'at risk' :
      'cleared';

    let color = 'green';
    if (finalStatus === 'at risk') color = 'yellow';
    if (finalStatus === 'needs attention') color = 'red';

    return {
      playerId: player.id,
      name: player.name,
      team: player.team,
      position: player.position,
      status: finalStatus,
      color,
      latestVitals: latest,
    };
  });

  res.json(summary);
});

// -------- Admin management --------

// view all users
app.get('/admin/users', requireRole(['admin']), (req, res) => {
  const safeUsers = users.map(u => ({
    id: u.id,
    username: u.username,
    role: u.role,
    playerId: u.playerId,
  }));
  res.json(safeUsers);
});

// change user role
app.patch('/admin/users/:id/role', requireRole(['admin']), (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { role } = req.body || {};
  const user = users.find(u => u.id === id);

  if (!user) return res.status(404).json({ error: 'User not found.' });

  if (!['trainer', 'coach', 'player', 'admin'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role.' });
  }

  user.role = role;
  res.json({ id: user.id, username: user.username, role: user.role });
});

// create new player for team roster
app.post('/admin/players', requireRole(['admin']), (req, res) => {
  const { name, team, position, status } = req.body || {};
  if (!name) return res.status(400).json({ error: 'Name is required.' });

  const newId = players.length ? Math.max(...players.map(p => p.id)) + 1 : 100;
  const player = {
    id: newId,
    name,
    team: team || 'Team A',
    position: position || 'Unknown',
    status: status || 'cleared',
  };
  players.push(player);
  res.status(201).json(player);
});

// delete player from roster
app.delete('/admin/players/:id', requireRole(['admin']), (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = players.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Player not found.' });
  }

  // remove player
  players.splice(index, 1);

  // clean up related data
  delete vitals[id];
  delete fatigueReports[id];

  for (let i = incidents.length - 1; i >= 0; i--) {
    if (incidents[i].playerId === id) {
      incidents.splice(i, 1);
    }
  }

  res.json({ message: 'Player removed.' });
});

// Root route – send index.html (for safety)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 404 JSON for unknown API routes
app.use((req, res) => {
  res.status(404).json({ error: 'Not found.' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
