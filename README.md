# TransitOps — Smart Transport Operations Platform

An end-to-end transport operations platform that digitizes vehicle, driver, dispatch, maintenance, and expense management while enforcing business rules and providing operational insights.

Built for a **8-hour hackathon** — PostgreSQL, Express, React, Node.js stack.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js + Express |
| ORM | Prisma (PostgreSQL) |
| Database | PostgreSQL 16 |
| Auth | JWT + bcrypt |
| Validation | Zod (server-side) |
| Frontend | React (Vite) + Tailwind CSS v4 |
| Data Fetching | TanStack Query |
| Charts | Recharts |
| Real-time Chat | Socket.io |
| Deploy | Docker Compose |

---

## Features

- **Role-based access**: Fleet Manager, Driver, Safety Officer, Financial Analyst
- **Trip state machine**: Draft → Dispatched → Completed / Cancelled with transactional integrity
- **Vehicle lifecycle**: Available, On Trip, In Shop, Retired
- **Driver management**: License expiry, safety scores, suspend/unsuspend
- **Maintenance**: Open/close with vehicle state transitions
- **Fuel & Expenses**: Role-filtered logs and cost tracking
- **Dashboards**: 4 role-specific dashboards with KPI cards, Recharts, CSV export
- **Real-time Chat**: Socket.io-based operations chat with DM to Fleet Manager
- **Dark mode**: Full light/dark theme toggle
- **Responsive design**: Mobile sidebar with overlay

---

## Setup & Run

### Prerequisites
- Node.js 18+
- PostgreSQL 16 (running on port 5432)

### 1. Create the database

```bash
psql -U postgres -c "CREATE DATABASE transitops;"
```

### 2. Backend

```bash
cd server

# Create .env file with your DB credentials
echo DATABASE_URL=postgresql://postgres:postgres@localhost:5432/transitops > .env
echo JWT_SECRET=my-secret-key >> .env

npm install
npx prisma db push
npx prisma db seed
node src/server.js
```

Server starts at **http://localhost:3001**

### 3. Frontend

```bash
cd client
npm install
npm run dev
```

Frontend starts at **http://localhost:5173**

### 4. Login

Open `http://localhost:5173` and use any demo account below.

---

## Demo Credentials

| Role | Email | Password |
|---|---|---|
| Fleet Manager | fm@transitops.com | password123 |
| Driver | driver@transitops.com | password123 |
| Safety Officer | safety@transitops.com | password123 |
| Financial Analyst | finance@transitops.com | password123 |

---

## Project Structure

```
transitops/
├── server/
│   ├── src/
│   │   ├── config/          (db.js, env.js)
│   │   ├── middleware/      (auth, rbac, validate, errorHandler)
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── vehicles/
│   │   │   ├── drivers/
│   │   │   ├── trips/       (state machine with business rules)
│   │   │   ├── maintenance/
│   │   │   ├── fuel/
│   │   │   ├── expenses/
│   │   │   ├── reports/
│   │   │   └── chat/
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   └── seed.js
│   │   ├── app.js
│   │   ├── server.js
│   │   └── socket.js
│   ├── Dockerfile
│   └── package.json
├── client/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   └── ui/          (Button, Card, Table, Modal, Toast, etc.)
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   ├── dashboard/
│   │   │   ├── vehicles/
│   │   │   ├── drivers/
│   │   │   ├── trips/
│   │   │   ├── maintenance/
│   │   │   ├── fuel-expenses/
│   │   │   └── chat/
│   │   ├── lib/
│   │   └── routes/
│   ├── vite.config.js
│   └── package.json
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

## Docker (Alternative Setup)

```bash
docker compose up --build
```

---

## Seed Data

- 4 roles, 4 users, 4 vehicles, 3 drivers
- Example workflow: Van-05 + Alex, 450kg trip
- 3 violation test cases: Over-capacity, expired license, suspended driver
- Fuel logs, expenses, maintenance records pre-populated
