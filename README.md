# Sports Team Health Tracker

Real-time health monitoring system for sports teams. Monitor player vital signs, log health incidents, and manage team health through role-based dashboards.

## What It Does

This system enables athletic trainers to monitor player health during games and practices, with automatic alerts when vital signs exceed safe thresholds. Coaches can view team health status at a glance, players can access their personal health data, and administrators can manage users and rosters.

## Features

- Real-time vital signs monitoring (heart rate, temperature, O2 saturation)
- Automated health alerts (HR >180/<40 bpm, Temp >103°F)
- Health incident logging with severity tracking
- Role-based dashboards (Trainer, Coach, Player, Admin)
- Color-coded status indicators (green/yellow/red)
- Session-based authentication with 30-minute timeout
- CSV data export

## Tech Stack

- **Backend:** Node.js, Express.js, express-session
- **Frontend:** Vanilla JavaScript, HTML5, CSS3
- **Database:** In-memory (development), PostgreSQL/MySQL (production ready)

## Getting Started

### Prerequisites

- Node.js v14 or higher
- npm

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/sports-team-health-tracker.git
cd sports-team-health-tracker
```

2. Install dependencies
```bash
cd Backend
npm install
```

3. Start the backend
```bash
npm start
```
The server runs on `http://localhost:3001`

4. Open the frontend

Open `Frontend/index.html` in your browser, or run a local server:
```bash
cd Frontend
python -m http.server 5500
```
Navigate to `http://localhost:5500`

### Demo Accounts

| Role | Username | Password |
|------|----------|----------|
| Trainer | `trainer1` | `trainer1` |
| Coach | `coach1` | `coach1` |
| Player | `player1` | `player1` |
| Admin | `admin1` | `admin1` |

## Usage

### For Athletic Trainers
- Monitor all players' vital signs in real-time
- Log health incidents (injuries, cramps, dehydration)
- Update player status (cleared/at-risk/needs attention)
- Receive automatic alerts for dangerous vitals

### For Coaches
- View team health overview with color-coded indicators
- Access incident logs
- Identify at-risk players for substitution decisions

### For Players
- View personal vital signs and health status
- Report fatigue levels (1-10 scale)
- Access personal health history

### For Administrators
- Manage user accounts and roles
- Create and manage team rosters
- Generate reports and export data

## API Reference

### Authentication
```
POST   /login          # Authenticate user
GET    /session        # Check current session
POST   /logout         # End session
```

### Players
```
GET    /players                    # List all players
PATCH  /players/:id/status        # Update player status (trainer/admin only)
```

### Health Data
```
GET    /incidents      # View incident logs
POST   /incidents      # Log new incident (trainer only)
GET    /vitals/:id     # Get player vital signs
POST   /vitals/:id     # Record vital signs (trainer only)
POST   /fatigue        # Submit fatigue report (player only)
GET    /fatigue/:id    # Get fatigue history
```

## Configuration

Backend configuration in `Backend/server.js`:
```javascript
const PORT = 3001;
const FRONTEND_ORIGIN = 'http://127.0.0.1:5500';
```

Frontend API endpoint in `Frontend/script.js`:
```javascript
const API_BASE = 'http://127.0.0.1:3001';
```

## Health Alert Thresholds

| Vital Sign | Warning Threshold | Critical Threshold |
|------------|------------------|-------------------|
| Heart Rate | 170-180 or 40-50 bpm | >180 or <40 bpm |
| Temperature | 101-103°F | >103°F |
| O2 Saturation | 85-90% | <85% |

## Project Structure

```
.
├── Backend/
│   ├── server.js           # Express server and API routes
│   ├── package.json
│   └── node_modules/
├── Frontend/
│   ├── index.html          # Main application page
│   ├── script.js           # Client-side logic
│   └── styles.css          # Application styling
└── README.md
```

## Security Notes

- Session-based authentication with express-session
- Role-based access control for all endpoints
- 30-minute automatic session timeout
- bcrypt password hashing recommended for production
- HTTPS required for production deployment

## Known Issues

- Data is stored in-memory and resets on server restart
- Real-time updates use polling instead of WebSockets
- Passwords are currently stored in plain text (demo only)