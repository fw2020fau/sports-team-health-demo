# Sports Team Health Tracker

**Class Assignment Project**  
Contributors: Dominic James, Frank Watkins  
Course: CEN 4010 - Principles of Software Engineering  
Fall 2025 | Due: December 3, 2025

---

## Project Overview

A web-based health monitoring system for sports teams that tracks athlete vital signs, logs health incidents, and provides role-based dashboards. This is a demonstration project for our software engineering course, showcasing full-stack development with Node.js and vanilla JavaScript.

## Features

- **Real-time monitoring** of player vital signs (heart rate, temperature, O2 saturation)
- **Automated alerts** when vitals exceed safe thresholds
- **Incident logging** by athletic trainers with severity tracking
- **Role-based access** for Trainers, Coaches, Players, and Administrators
- **Color-coded status** indicators (green/yellow/red) for quick health assessment
- **Fatigue self-reporting** by players

## Tech Stack

- **Backend:** Node.js, Express.js, express-session
- **Frontend:** Vanilla JavaScript, HTML5, CSS3
- **Data Storage:** In-memory (demo - resets on server restart)
- **Authentication:** Session-based with role-based access control

## Getting Started

### Prerequisites

- Node.js v14 or higher
- npm (comes with Node.js)
- Python 3 (for serving frontend)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/sports-team-health-tracker.git
cd sports-team-health-tracker
```

2. **Install backend dependencies**
```bash
cd Backend
npm install
```

3. **Start the backend server**
```bash
npm start
```
The server will run on `http://localhost:3001`

4. **Open the frontend** (in a new terminal)
```bash
cd Frontend
python3 -m http.server 5500
```

5. **Access the application**

Open your browser to: `http://localhost:5500`

## Demo Accounts

| Role | Username | Password | Notes |
|------|----------|----------|-------|
| Athletic Trainer | `trainer` | `trainer` | Full vitals and incident management |
| Coach | `coach` | `coach` | View-only access to team data |
| Player | `player` | `player` | Personal data + fatigue reporting (use Player ID: 101) |
| Administrator | `admin` | `admin` | Full system management |

**For Player login:** Enter Player ID `101` to associate with John Adams.

## Usage Guide

### Athletic Trainer Features
- Monitor all players' vital signs
- Record vital signs (heart rate, temperature, O2 saturation)
- Log health incidents with severity levels
- Update player status (cleared/at-risk/needs attention)
- View team health summary

### Coach Features
- View team health overview with color-coded status
- Access incident logs
- Identify at-risk players for game decisions

### Player Features
- View personal vital signs and health history
- Self-report fatigue levels (1-10 scale)
- Access personal health status

### Administrator Features
- View all system data
- Add new players to roster
- Remove players from roster
- Manage team composition

## Health Alert Thresholds

| Vital Sign | Warning | Critical |
|------------|---------|----------|
| Heart Rate | 160-180 or 40-50 bpm | >180 or <40 bpm |
| Temperature | 100-103°F (37.8-39.4°C) | >103°F (>39.4°C) |
| O2 Saturation | 90-92% | <90% |

## API Reference

### Authentication
```
POST   /login          # Authenticate user
GET    /session        # Check current session
POST   /logout         # End session
```

### Players
```
GET    /players                # List all players
PATCH  /players/:id/status     # Update player status (trainer/admin only)
```

### Health Data
```
POST   /vitals                   # Record vital signs (trainer only)
GET    /players/:id/vitals       # Get player vital signs
POST   /incidents                # Log health incident (trainer only)
GET    /incidents                # View incident logs (trainer/coach/admin)
POST   /players/:id/fatigue      # Submit fatigue report (player only)
```

### Admin
```
GET    /admin/users              # View all users (admin only)
POST   /admin/players            # Add player to roster (admin only)
DELETE /admin/players/:id        # Remove player from roster (admin only)
```

### Dashboard
```
GET    /dashboard/summary        # Team health overview (trainer/coach/admin)
```

## Configuration

Backend settings in `Backend/server.js`:
```javascript
const PORT = 3001;
const FRONTEND_ORIGIN = 'http://127.0.0.1:5500';
```

Frontend API endpoint in `Frontend/script.js`:
```javascript
const API_BASE = 'http://127.0.0.1:3001';
```

## Development Notes

This project demonstrates key software engineering principles:

- **Separation of Concerns:** Backend API separate from frontend UI
- **REST API Design:** RESTful endpoints for all operations
- **Role-Based Access Control:** Different permissions for different user types
- **Session Management:** Secure authentication with 30-minute timeout
- **Modular Code Structure:** Clean, maintainable code organization

**What This Project Shows:**
- Full-stack JavaScript development
- User authentication and authorization
- CRUD operations for health data
- Real-time data updates
- Responsive web design

## Known Limitations

This is a demonstration project for educational purposes:

- **In-Memory Storage:** Data resets when server restarts (no database)
- **No Real Devices:** Manual vital sign entry (no actual wearable integration)
- **Plain Text Passwords:** Demo accounts use simple passwords (production would use bcrypt)
- **Single Team:** System supports one team (architecture allows expansion)
- **Local Only:** Designed for local development (production would need deployment setup)
- **No Data Export:** CSV/PDF export not yet implemented

## Project Structure

```
.
├── Backend/
│   ├── server.js           # Express server with all API routes
│   ├── package.json        # Backend dependencies (express, cors, express-session)
│   └── package-lock.json
├── Frontend/
│   ├── index.html          # Main application page
│   ├── script.js           # Client-side logic and API calls
│   └── styles.css          # Application styling
└── README.md
```

## Troubleshooting

### "NetworkError when attempting to fetch resource"

**Cause:** Browser CORS policy - localhost and 127.0.0.1 are treated as different origins.

**Solution:** Access the frontend at `http://127.0.0.1:5500` instead of `http://localhost:5500`

Update your browser URL to use the IP address, and the CORS error should resolve.

---

### npm install fails with SSL certificate errors (macOS 12 Monterey or older)

**Cause:** Older macOS versions have outdated SSL certificates that npm doesn't trust.

**Solution:** Temporarily disable SSL verification for local development:
```bash
npm config set strict-ssl false
npm install
```

After installation completes, you can re-enable SSL verification if desired:
```bash
npm config set strict-ssl true
```

This is safe for local development. In production environments, always use proper SSL verification.

---

### Port 3001 or 5500 already in use

**Solution:** Kill the process using that port:

**Find and kill process:**
```bash
# macOS/Linux:
lsof -ti:3001 | xargs kill
lsof -ti:5500 | xargs kill

# Windows:
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

Or use different ports in the configuration.

---

### Server crashes or unexpected behavior

**Solution:** Restart both servers:
```bash
# Stop backend (Ctrl+C in terminal)
# Stop frontend (Ctrl+C in terminal)
# Restart both as shown in Installation section
```

Data will reset since storage is in-memory.

---

### Player can't view their vitals

**Issue:** Player must enter their Player ID during login to associate with a player.

**Solution:** When logging in as `player/player`, enter `101` in the Player ID field to view John Adams' data.

---

## Security Notes

**For Production Deployment (not implemented in this demo):**
- Use bcrypt for password hashing
- Enable HTTPS with valid SSL certificates
- Use environment variables for secrets
- Implement proper database with connection pooling
- Add rate limiting and input sanitization
- Set secure cookie options
- Implement CSRF protection

This demo uses simplified security suitable only for local development and academic demonstration.

## Future Enhancements

Potential improvements for a production system:
- PostgreSQL or MySQL database integration
- Real-time WebSocket connections for live updates
- Wearable device API integration
- Data export to CSV/PDF
- Email/SMS notifications for critical alerts
- Historical trend analysis and reporting
- Multi-team support
- Mobile app companion
- Backup and recovery procedures

## Acknowledgments

Project developed for CEN 4010 - Principles of Software Engineering, Fall 2025.

## License

This project is for educational purposes as part of a university course assignment.