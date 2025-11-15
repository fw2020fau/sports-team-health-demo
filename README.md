# Sports Team Health Performance Tracking (Demo App)

# Overview

# A simple Node.js/Express backend for a classroom project: monitor and manage health/vitals for sports teams in real-time, demonstrating features from your class documentation and diagrams. Data is in-memory, focusing on API logic and role-based workflows for demo purposes.

# 

# Features

# User Authentication \& Roles: Trainer, Coach, Player, Admin (with hardcoded sample accounts)

# 

# Player Dashboard: List and update player health/status

# 

# Incident Logging: Trainers log new health incidents; all roles can view logs

# 

# Vital Signs Tracking: Trainers record HR/temp/o2 for any player; all roles can get per-player vitals history

# 

# Automatic Alerts: Server logs alerts if danger vital sign values detected (e.g., high/low HR, high temp)

# 

# Player Self-Reporting: Fatigue value submission

# 

# Session Timeout: 30 min inactivity limit with Express-session



Quick Start

Clone and enter the repo:



text

git clone https://github.com/yourusername/sports-team-health-demo.git

cd sports-team-health-demo/backend

Install dependencies:



text

npm install

Run the backend server:



text

node server.js

Sample Users

Trainer: trainer1 / trainerpass



Coach: coach1 / coachpass



Player: player1 / playerpass



Admin: admin1 / adminpass



API Endpoints (Main Examples)

Route	Method	Purpose	Who Can Use

/login	POST	Log in	Everyone

/logout	POST	Log out	Everyone

/players	GET	List all players	All roles

/players/:id/status	PATCH	Update status	Trainer

/incidents	POST	Log new incident	Trainer

/incidents	GET	View all incidents	All roles

/vitals	POST	Record new vitals	Trainer

/players/:id/vitals	GET	See player vitals history	All roles

/alerts	GET	List all alerts	Trainer, Coach, Admin

/dashboard	GET	Team dashboard	All roles

/players/:id/fatigue	POST	Player reports fatigue	Player

Use Postman to test; see comments and docs in server.js for details.



Folder Structure

text

sports-team-health-demo/

├── backend/

│   ├── server.js

│   └── package.json

├── frontend/     (placeholder for demo UI)

├── README.md

Class Demo Tips

Login as trainer in Postman, show each route in the docs, log a vital out-of-range to trigger an alert



Narrate how the routes map to system requirements and diagrams for your class



Notes \& Limitations

Data is not persistent (in-memory only; resets on server restart)



No full admin/team CRUD; roles, players, sample data are all hardcoded for demonstration



Ready for simple static frontend (e.g., with HTML/JavaScript) or Postman demo



No database or production-ready security—educational demonstration only



For classroom demo and documentation only. Not for real medical or safety use.



