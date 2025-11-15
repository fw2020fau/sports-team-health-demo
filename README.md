# Sports Team Health Performance Tracking (Demo App)

## 📌 Overview
A simple **Node.js / Express backend** built for a classroom project.  
This demo app monitors and manages **health and vital signs** for sports teams in real time.  
All data is **in-memory** to keep the focus on API logic and role-based workflows.

---

## 🚀 Features

### 🔐 User Authentication & Roles
- Trainer  
- Coach  
- Player  
- Admin  
*(All using hardcoded sample accounts)*

### 🩺 Player Dashboard
- View all players  
- Trainers can update player status  

### 📝 Incident Logging
- Trainers log new incidents  
- All roles can view incident history  

### 📊 Vital Signs Tracking
- Trainers record HR, temperature, O₂ levels  
- Every role can access vitals history per player  

### ⚠️ Automatic Alerts
- Server logs alerts for dangerous values  
  - e.g., very high/low heart rate, high temperature

### 🧍 Player Self-Reporting
- Players submit fatigue score

### ⏳ Session Timeout
- **30 minutes** inactivity limit via `express-session`

---

## ⚡ Quick Start

### 1️⃣ Clone and enter the repo:
```bash
git clone https://github.com/yourusername/sports-team-health-demo.git
cd sports-team-health-demo/backend
```

### 2️⃣ Install dependencies:
```bash
npm install
```

### 3️⃣ Run the backend server:
```bash
node server.js
```

---

## 👥 Sample Users

| Role    | Username   | Password     |
|---------|------------|---------------|
| Trainer | trainer1   | trainerpass   |
| Coach   | coach1     | coachpass     |
| Player  | player1    | playerpass    |
| Admin   | admin1     | adminpass     |

---

## 🔗 API Endpoints (Main Examples)

| Route                     | Method | Purpose                      | Who Can Use              |
|---------------------------|--------|------------------------------|---------------------------|
| `/login`                  | POST   | Log in                       | Everyone                  |
| `/logout`                 | POST   | Log out                      | Everyone                  |
| `/players`                | GET    | List all players             | All roles                 |
| `/players/:id/status`     | PATCH  | Update player status         | Trainer                   |
| `/incidents`              | POST   | Log new incident             | Trainer                   |
| `/incidents`              | GET    | View all incidents           | All roles                 |
| `/vitals`                 | POST   | Record new vitals            | Trainer                   |
| `/players/:id/vitals`     | GET    | View player vitals history   | All roles                 |
| `/alerts`                 | GET    | List all alerts              | Trainer, Coach, Admin     |
| `/dashboard`              | GET    | Team dashboard               | All roles                 |
| `/players/:id/fatigue`    | POST   | Player submits fatigue        | Player                    |

Use **Postman** to test the API.  
See comments inside `server.js` for explanation of workflows.

---

## 📁 Folder Structure
```text
sports-team-health-demo/
├── backend/
│   ├── server.js
│   └── package.json
├── frontend/        (placeholder for UI demo)
└── README.md
```

---

## 🎓 Class Demo Tips
- Log in as **trainer** in Postman  
- Demonstrate each route from your class documentation  
- Trigger an alert by logging an unsafe HR/temperature value  
- Explain how routes correspond to your **UML diagrams** and **requirements**

---

## ⚠️ Notes & Limitations
- All data resets on server restart (**in-memory**)  
- No team or admin CRUD (hardcoded roles & players)  
- No database & no production authentication  
- For educational demo use only — **not real medical software**

---

## ✔️ Disclaimer
This backend is intended **only for classroom demonstration and documentation.**
Not for real medical or athletic safety applications.
