# Sports Team Health Tracker

**Course:** CEN 4010 – Principles of Software Engineering  
**Contributors:**  
- Frank Watkins  
- Dominic James  

**Emails:**  
- fwatkins2020@fau.edu  
- dominicjames2023@fau.edu  

A full-stack web application that tracks player health, logs incidents, and provides role-based dashboards for Trainers, Coaches, Players, and Admins.

---

## 🚀 Project Overview

This web-based system helps sports organizations monitor players during practices and games.

The system supports:

- Tracking **vital signs** (heart rate, temperature, oxygen levels)  
- Logging **health incidents**  
- Automatic **status color-coding** (green / yellow / red)  
- **Role-based dashboards** for each user type  
- **Player fatigue reporting**  
- **Admin roster management**  

Data is stored in memory (demo requirement). When the server restarts, data resets.

---

## 🧠 User Roles

| Role | Capabilities |
|------|--------------|
| **Trainer** | Record vitals, log incidents, update player status, view summary |
| **Coach** | View team summary + incidents |
| **Player** | View own vitals, submit fatigue reports |
| **Admin** | Add/remove players, manage users, view all data |

---

## 🔧 Tech Stack

- **Node.js + Express** (backend + API)
- **HTML / CSS / Vanilla JavaScript** (frontend UI)
- **express-session** (session-based authentication)
- **CORS** (frontend–backend communication)
- **In-memory data storage** (demo, resets on server restart)
- **Render Web Service** (cloud hosting for the entire app)

Everything runs inside **one project directory**.

---

## ▶️ How to Run Locally (Developer Setup)

### 1. Install dependencies
```bash
npm install
```

### 2. Start the server
```bash
npm start
```

This launches:

- Backend API  
- Frontend files served automatically via Express  

### 3. Open the app in a browser:

```
http://localhost:3001
```

---

## 🔐 Demo Login Accounts

| Role | Username | Password | Notes |
|------|----------|----------|-------|
| Trainer | trainer | trainer | Full access |
| Coach | coach | coach | View-only |
| Player | player | player | Enter Player ID: Ex. 101 |
| Admin | admin | admin | Manage players/users |

---

## 📡 API Endpoints (Summary)

```
POST   /login
GET    /session
POST   /logout

GET    /players
PATCH  /players/:id/status
GET    /players/:id/vitals

POST   /vitals
POST   /incidents
GET    /incidents

POST   /players/:id/fatigue

GET    /dashboard/summary

GET    /admin/users
POST   /admin/players
DELETE /admin/players/:id
PATCH  /admin/users/:id/role
```

---

## ☁️ Cloud Deployment (Render)

### 1. Push code to GitHub

Repository root must contain:

```
index.html
script.js
styles.css
server.js
package.json
package-lock.json
README.md
```

### 2. Deploy on Render

- Environment: **Node**  
- Build Command: `npm install`  
- Start Command: `npm start`  

Render will provide a public URL for instructor access.

---

## 📁 Project Structure

```
sports-team-health-demo/
│── index.html
│── script.js
│── styles.css
│── server.js
│── package.json
│── package-lock.json
└── README.md
```

---

## 📈 Future Enhancements

- SQL/MongoDB integration  
- Wearable device data  
- Trend analytics  
- Notifications  
- Multi-team support  

---

## 📝 Final Notes

This project demonstrates:

- Full-stack design  
- REST API development  
- Session authentication  
- Role-based permissions  
- Practical software engineering concepts  
