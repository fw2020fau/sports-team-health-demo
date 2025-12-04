// script.js
// Frontend for Sports Team Health Tracker

// Empty base means "same origin" – works locally and in the cloud
const API_BASE = '';

async function fetchJSON(path, options = {}) {
  const url = API_BASE + path;

  try {
    const response = await fetch(url, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
    });

    const text = await response.text();
    let data = null;

    try {
      data = text ? JSON.parse(text) : null;
    } catch (err) {
      data = { error: 'Invalid JSON from server.' };
    }

    if (!response.ok) {
      const msg = (data && data.error) || `Request failed with status ${response.status}`;
      throw new Error(msg);
    }

    return data;
  } catch (err) {
    console.error('fetchJSON error:', err);
    throw err;
  }
}

const appDiv = document.getElementById('app');

function render(html) {
  appDiv.innerHTML = html;
}

function renderError(message) {
  const box = document.createElement('div');
  box.className = 'error-box';
  box.textContent = message;
  appDiv.prepend(box);
}

// Login screen

function showLogin() {
  render(`
    <div class="card">
      <h1>Sports Team Health Tracker</h1>
      <p class="subtitle">Demo Login</p>
      <form id="login-form">
        <label>
          Username
          <input type="text" name="username" required />
        </label>
        <label>
          Password
          <input type="password" name="password" required />
        </label>
        <label>
          Player ID (players only)
          <input type="number" name="playerId" />
        </label>
        <button type="submit">Log In</button>
      </form>
      <div class="demo-users">
        <p><strong>Demo accounts:</strong></p>
        <ul>
          <li>Trainer — <code>trainer / trainer</code></li>
          <li>Coach — <code>coach / coach</code></li>
          <li>Player — <code>player / player</code></li>
          <li>Admin — <code>admin / admin</code></li>
        </ul>
      </div>
    </div>
  `);

  const form = document.getElementById('login-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const username = fd.get('username');
    const password = fd.get('password');
    const playerId = fd.get('playerId');

    const body = { username, password };
    if (playerId) {
      body.playerId = playerId;
    }

    try {
      const result = await fetchJSON('/login', {
        method: 'POST',
        body: JSON.stringify(body),
      });
      showDashboard(result.user);
    } catch (err) {
      renderError(err.message || 'Login failed.');
    }
  });
}

// Dashboard

function showDashboard(user) {
  const roleLabel = user.role.charAt(0).toUpperCase() + user.role.slice(1);

  let actionsHTML = '';

  if (user.role === 'trainer') {
    actionsHTML = `
      <button data-action="view-players">View Players</button>
      <button data-action="record-vitals">Record Vitals</button>
      <button data-action="log-incident">Log Incident</button>
      <button data-action="view-incidents">View Incidents</button>
      <button data-action="view-summary">Team Health Summary</button>
    `;
  } else if (user.role === 'coach') {
    actionsHTML = `
      <button data-action="view-summary">Team Health Summary</button>
      <button data-action="view-incidents">View Incidents</button>
    `;
  } else if (user.role === 'player') {
    actionsHTML = `
      <button data-action="view-my-vitals">My Vitals</button>
      <button data-action="report-fatigue">Report Fatigue</button>
    `;
  } else if (user.role === 'admin') {
    actionsHTML = `
      <button data-action="view-players">View Players</button>
      <button data-action="view-summary">Team Health Summary</button>
      <button data-action="view-incidents">View Incidents</button>
    `;
  }

  render(`
    <div class="card">
      <header class="card-header">
        <div>
          <h1>Sports Team Health Tracker</h1>
          <p class="subtitle">${roleLabel} dashboard (${user.username})</p>
        </div>
        <button id="logout-button" class="secondary">Log Out</button>
      </header>

      <nav class="actions">
        ${actionsHTML}
      </nav>

      <section id="content-area">
        <p>Select an action to get started.</p>
      </section>
    </div>
  `);

  document.getElementById('logout-button').addEventListener('click', handleLogout);

  const buttons = document.querySelectorAll('nav.actions button');
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const action = btn.getAttribute('data-action');
      handleAction(action, user);
    });
  });
}

async function handleLogout() {
  try {
    await fetchJSON('/logout', { method: 'POST' });
  } catch (err) {
    console.warn('Logout error (ignored):', err);
  }
  showLogin();
}

function handleAction(action, user) {
  const content = document.getElementById('content-area');

  if (action === 'view-players') {
    loadPlayers(content, user);
  } else if (action === 'record-vitals') {
    showVitalsForm(content);
  } else if (action === 'log-incident') {
    showIncidentForm(content);
  } else if (action === 'view-incidents') {
    loadIncidents(content);
  } else if (action === 'view-summary') {
    loadSummary(content);
  } else if (action === 'view-my-vitals') {
    loadMyVitals(content, user);
  } else if (action === 'report-fatigue') {
    showFatigueForm(content, user);
  }
}

// Actions

async function loadPlayers(container, user) {
  container.innerHTML = '<p>Loading players...</p>';

  const canEditStatus = user.role === 'trainer' || user.role === 'admin';
  const isAdmin = user.role === 'admin';

  try {
    const players = await fetchJSON('/players');
    if (!players.length) {
      container.innerHTML = '<p>No players found.</p>';
      return;
    }

    const rows = players.map((p) => `
      <tr>
        <td>${p.id}</td>
        <td>${p.name}</td>
        <td>${p.team}</td>
        <td>${p.position}</td>
        <td>${p.status}</td>
      </tr>
    `).join('');

    container.innerHTML = `
      <h2>Players</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Team</th><th>Position</th><th>Status</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>

      ${canEditStatus ? `
        <h3>Update Player Status</h3>
        <form id="status-form">
          <label>
            Player ID
            <input type="number" name="playerId" required />
          </label>
          <label>
            New status
            <select name="status">
              <option value="cleared">cleared</option>
              <option value="at risk">at risk</option>
              <option value="needs attention">needs attention</option>
            </select>
          </label>
          <button type="submit">Update</button>
        </form>
        <div id="status-result"></div>
      ` : ''}

      ${isAdmin ? `
        <h3>Add Player (Admin)</h3>
        <form id="add-player-form">
          <label>
            Name
            <input type="text" name="name" required />
          </label>
          <label>
            Team
            <input type="text" name="team" placeholder="e.g. Team A" />
          </label>
          <label>
            Position
            <input type="text" name="position" placeholder="e.g. Forward" />
          </label>
          <label>
            Status
            <select name="status">
              <option value="cleared">cleared</option>
              <option value="at risk">at risk</option>
              <option value="needs attention">needs attention</option>
            </select>
          </label>
          <button type="submit">Create Player</button>
        </form>
        <div id="add-player-result"></div>

        <h3>Remove Player (Admin)</h3>
        <form id="remove-player-form">
          <label>
            Player ID
            <input type="number" name="playerId" required />
          </label>
          <button type="submit">Remove Player</button>
        </form>
        <div id="remove-player-result"></div>
      ` : ''}
    `;

    if (canEditStatus) {
      const form = document.getElementById('status-form');
      const resultDiv = document.getElementById('status-result');

      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const fd = new FormData(form);
        const playerId = fd.get('playerId');
        const status = fd.get('status');

        try {
          const updated = await fetchJSON(`/players/${playerId}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status }),
          });
          resultDiv.innerHTML =
            `<p class="success">Player ${updated.id} status updated to "${updated.status}".</p>`;
          loadPlayers(container, user);
        } catch (err) {
          resultDiv.innerHTML = `<p class="error">Error updating status: ${err.message}</p>`;
        }
      });
    }

    if (isAdmin) {
      const addForm = document.getElementById('add-player-form');
      const addResult = document.getElementById('add-player-result');
      const removeForm = document.getElementById('remove-player-form');
      const removeResult = document.getElementById('remove-player-result');

      addForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const fd = new FormData(addForm);
        const body = {
          name: fd.get('name'),
          team: fd.get('team'),
          position: fd.get('position'),
          status: fd.get('status'),
        };

        try {
          const player = await fetchJSON('/admin/players', {
            method: 'POST',
            body: JSON.stringify(body),
          });
          addResult.innerHTML =
            `<p class="success">Player "${player.name}" created with ID ${player.id}.</p>`;
          addForm.reset();
          loadPlayers(container, user);
        } catch (err) {
          addResult.innerHTML = `<p class="error">Error adding player: ${err.message}</p>`;
        }
      });

      removeForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const fd = new FormData(removeForm);
        const playerId = fd.get('playerId');

        try {
          const result = await fetchJSON(`/admin/players/${playerId}`, {
            method: 'DELETE',
          });
          removeResult.innerHTML =
            `<p class="success">${result.message}</p>`;
          removeForm.reset();
          loadPlayers(container, user);
        } catch (err) {
          removeResult.innerHTML = `<p class="error">Error removing player: ${err.message}</p>`;
        }
      });
    }
  } catch (err) {
    container.innerHTML = `<p class="error">Error loading players: ${err.message}</p>`;
  }
}

function showVitalsForm(container) {
  container.innerHTML = `
    <h2>Record Vitals</h2>
    <form id="vitals-form">
      <label>
        Player ID
        <input type="number" name="playerId" required />
      </label>
      <label>
        Heart Rate (bpm)
        <input type="number" name="hr" required />
      </label>
      <label>
        Temperature (°C)
        <input type="number" step="0.1" name="temp" required />
      </label>
      <label>
        O₂ Saturation (%)
        <input type="number" name="o2" required />
      </label>
      <button type="submit">Save</button>
    </form>
    <div id="vitals-result"></div>
  `;

  const form = document.getElementById('vitals-form');
  const resultDiv = document.getElementById('vitals-result');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const body = {
      playerId: fd.get('playerId'),
      hr: fd.get('hr'),
      temp: fd.get('temp'),
      o2: fd.get('o2'),
    };

    try {
      const entry = await fetchJSON('/vitals', {
        method: 'POST',
        body: JSON.stringify(body),
      });
      resultDiv.innerHTML = `<p class="success">Vitals saved at ${entry.recordedAt}.</p>`;
      form.reset();
    } catch (err) {
      resultDiv.innerHTML = `<p class="error">Error: ${err.message}</p>`;
    }
  });
}

function showIncidentForm(container) {
  container.innerHTML = `
    <h2>Log Incident</h2>
    <form id="incident-form">
      <label>
        Player ID
        <input type="number" name="playerId" required />
      </label>
      <label>
        Type
        <input type="text" name="type" placeholder="e.g. concussion evaluation" required />
      </label>
      <label>
        Severity
        <select name="severity">
          <option value="low">Low</option>
          <option value="moderate">Moderate</option>
          <option value="high">High</option>
        </select>
      </label>
      <label>
        Notes
        <textarea name="notes" rows="3"></textarea>
      </label>
      <button type="submit">Save Incident</button>
    </form>
    <div id="incident-result"></div>
  `;

  const form = document.getElementById('incident-form');
  const resultDiv = document.getElementById('incident-result');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const body = {
      playerId: fd.get('playerId'),
      type: fd.get('type'),
      severity: fd.get('severity'),
      notes: fd.get('notes'),
    };

    try {
      const incident = await fetchJSON('/incidents', {
        method: 'POST',
        body: JSON.stringify(body),
      });
      resultDiv.innerHTML =
        `<p class="success">Incident #${incident.id} saved for player ${incident.playerId}.</p>`;
      form.reset();
    } catch (err) {
      resultDiv.innerHTML = `<p class="error">Error: ${err.message}</p>`;
    }
  });
}

async function loadIncidents(container) {
  container.innerHTML = '<p>Loading incidents...</p>';
  try {
    const list = await fetchJSON('/incidents');
    if (!list.length) {
      container.innerHTML = '<p>No incidents logged yet.</p>';
      return;
    }

    const rows = list.map((i) => `
      <tr>
        <td>${i.id}</td>
        <td>${i.playerId}</td>
        <td>${i.type}</td>
        <td>${i.severity}</td>
        <td>${i.notes || ''}</td>
        <td>${i.createdBy}</td>
        <td>${new Date(i.createdAt).toLocaleString()}</td>
      </tr>
    `).join('');

    container.innerHTML = `
      <h2>Incident Log</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Player</th>
            <th>Type</th>
            <th>Severity</th>
            <th>Notes</th>
            <th>Logged By</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    `;
  } catch (err) {
    container.innerHTML = `<p class="error">Error loading incidents: ${err.message}</p>`;
  }
}

async function loadSummary(container) {
  container.innerHTML = '<p>Loading summary...</p>';
  try {
    const summary = await fetchJSON('/dashboard/summary');
    if (!summary.length) {
      container.innerHTML = '<p>No players found.</p>';
      return;
    }

    const rows = summary.map((s) => `
      <tr class="status-${s.color}">
        <td>${s.playerId}</td>
        <td>${s.name}</td>
        <td>${s.team}</td>
        <td>${s.position}</td>
        <td>${s.status}</td>
        <td>${s.latestVitals ? s.latestVitals.hr : '-'}</td>
        <td>${s.latestVitals ? s.latestVitals.temp : '-'}</td>
        <td>${s.latestVitals ? s.latestVitals.o2 : '-'}</td>
      </tr>
    `).join('');

    container.innerHTML = `
      <h2>Team Health Summary</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Team</th><th>Position</th>
            <th>Status</th><th>HR</th><th>Temp</th><th>O₂</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    `;
  } catch (err) {
    container.innerHTML = `<p class="error">Error loading summary: ${err.message}</p>`;
  }
}

async function loadMyVitals(container, user) {
  if (!user.playerId) {
    container.innerHTML = '<p>No player attached to this user.</p>';
    return;
  }

  container.innerHTML = '<p>Loading your vitals...</p>';
  try {
    const list = await fetchJSON(`/players/${user.playerId}/vitals`);
    if (!list.length) {
      container.innerHTML = '<p>No vitals recorded for you yet.</p>';
      return;
    }

    const rows = list.map((v) => `
      <tr>
        <td>${new Date(v.recordedAt).toLocaleString()}</td>
        <td>${v.hr}</td>
        <td>${v.temp}</td>
        <td>${v.o2}</td>
      </tr>
    `).join('');

    container.innerHTML = `
      <h2>My Vitals</h2>
      <table>
        <thead>
          <tr>
            <th>Time</th><th>HR</th><th>Temp</th><th>O₂</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    `;
  } catch (err) {
    container.innerHTML = `<p class="error">Error loading vitals: ${err.message}</p>`;
  }
}

function showFatigueForm(container, user) {
  if (!user.playerId) {
    container.innerHTML = '<p>No player attached to this user.</p>';
    return;
  }

  container.innerHTML = `
    <h2>Report Fatigue</h2>
    <form id="fatigue-form">
      <label>
        Fatigue level (1–10)
        <input type="number" name="level" min="1" max="10" required />
      </label>
      <label>
        Notes
        <textarea name="note" rows="3"></textarea>
      </label>
      <button type="submit">Submit</button>
    </form>
    <div id="fatigue-result"></div>
  `;

  const form = document.getElementById('fatigue-form');
  const resultDiv = document.getElementById('fatigue-result');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const body = {
      level: fd.get('level'),
      note: fd.get('note'),
    };

    try {
      const report = await fetchJSON(`/players/${user.playerId}/fatigue`, {
        method: 'POST',
        body: JSON.stringify(body),
      });
      resultDiv.innerHTML =
        `<p class="success">Fatigue reported (${report.level}/10 at ${new Date(report.reportedAt).toLocaleString()}).</p>`;
      form.reset();
    } catch (err) {
      resultDiv.innerHTML = `<p class="error">Error: ${err.message}</p>`;
    }
  });
}

(async function init() {
  try {
    const data = await fetchJSON('/session', { method: 'GET' });
    if (data.user) {
      showDashboard(data.user);
    } else {
      showLogin();
    }
  } catch (err) {
    console.warn('Session check failed, showing login.', err);
    showLogin();
  }
})();
