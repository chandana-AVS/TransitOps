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
| Auth | JWT + bcrypt (custom middleware) |
| Validation | Zod (server-side, shared schemas) |
| Frontend | React (Vite) + Tailwind CSS |
| Data Fetching | TanStack Query (React Query) |
| Charts | Recharts |
| Deploy | Docker Compose |

---

## Architecture

```
Browser ──→ http://localhost:5173 (Vite dev server)
               │
               ├── Serves React SPA
               │
               └── Proxies /api/* ──→ http://localhost:3001 (Express API)
                                         │
                                         ├── Auth (JWT middleware)
                                         ├── RBAC (role-based access)
                                         ├── Zod validation (server-side)
                                         └── Prisma ORM ──→ PostgreSQL (port 5432)
```

---

## Database Schema (8 entities)

```
users ──→ roles
  │
  └── drivers (1:1)
  
vehicles ──→ trips ──→ drivers
  │            │
  ├── maintenance_logs
  ├── fuel_logs
  └── expenses
```

All status fields indexed. Money fields use `DECIMAL`, never `FLOAT`.

---

## Business Rules Enforced

| Rule | Code | Status Code |
|---|---|---|
| Registration number unique | `vehicles.service.js` | 409 |
| Vehicle AVAILABLE before dispatch | `trips.service.js:41` | 409 |
| Driver AVAILABLE before dispatch | `trips.service.js:54` | 409 |
| License not expired | `trips.service.js:63` | 403 |
| Driver not SUSPENDED | `trips.service.js:72` | 403 |
| Cargo ≤ vehicle capacity | `trips.service.js:81` | 400 |
| Dispatch → vehicle/driver to ON_TRIP | `trips.service.js:89-103` | — |
| Complete → vehicle/driver to AVAILABLE | `trips.service.js:111-140` | — |
| Cancel → restore vehicle/driver | `trips.service.js:146-175` | — |
| Maintenance OPEN → vehicle to IN_SHOP | `maintenance.service.js:35` | — |
| Maintenance CLOSE → vehicle to AVAILABLE | `maintenance.service.js:63` | — |

---

## API Endpoints

| Resource | Endpoints |
|---|---|
| Auth | `POST /auth/login`, `GET /auth/me` |
| Vehicles | `GET /vehicles`, `POST /vehicles`, `GET /vehicles/:id`, `PUT /vehicles/:id`, `PATCH /vehicles/:id/retire` |
| Drivers | `GET /drivers`, `POST /drivers`, `PUT /drivers/:id`, `PATCH /drivers/:id/suspend` |
| Trips | `GET /trips`, `POST /trips`, `POST /trips/:id/dispatch`, `POST /trips/:id/complete`, `POST /trips/:id/cancel` |
| Maintenance | `GET /maintenance`, `POST /maintenance`, `POST /maintenance/:id/close` |
| Fuel Logs | `GET /fuel-logs`, `POST /fuel-logs` |
| Expenses | `GET /expenses`, `POST /expenses` |
| Reports | `GET /dashboard/kpis`, `GET /reports/fuel-efficiency`, `GET /reports/utilization`, `GET /reports/cost`, `GET /reports/roi`, `GET /reports/export.csv` |

---

## Setup & Run

### Prerequisites
- Node.js 18+
- PostgreSQL 16 (running on port 5432)

### 1. Backend

```bash
cd server
cp .env.example .env    # Edit .env with your DB credentials
npm install
npx prisma db push
npx prisma db seed
node src/server.js
```

### 2. Frontend

```bash
cd client
npm install
npx vite
```

### 3. Open

Go to `http://localhost:5173`

---

## Demo Credentials

| Role | Email | Password |
|---|---|---|
| Fleet Manager | fm@transitops.com | password123 |
| Driver | driver@transitops.com | password123 |
| Safety Officer | safety@transitops.com | password123 |
| Financial Analyst | finance@transitops.com | password123 |

---

## Docker (Alternative Setup)

```bash
docker compose up --build
```

---

## Seed Data Includes

- **Example workflow from the brief:** Van-05 (500kg capacity) + Alex (driver) with 450kg trip
- **3 violation test cases:** Over-capacity, expired license, suspended driver
- Fuel logs, expenses, maintenance records pre-populated for demo

---

## Demo Script (5 min)

1. Architecture + ERD — 45 sec
2. Login as Fleet Manager → Dashboard KPIs → Register a vehicle — 60 sec
3. Create trip → Attempt over-capacity (show validation) → Dispatch valid trip — 60 sec
4. Safety Officer → Show expired/suspended driver blocked — 45 sec
5. Complete trip → Open maintenance → Vehicle to IN_SHOP → Close it — 60 sec
6. Financial Analyst → Reports (fuel efficiency, utilization, cost, ROI) → CSV export — 60 sec
7. Each team member: one sentence on what they built — 20 sec

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
│   │   │   ├── trips/       (state machine with all business rules)
│   │   │   ├── maintenance/
│   │   │   ├── fuel/
│   │   │   ├── expenses/
│   │   │   └── reports/
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   └── seed.js
│   │   ├── app.js
│   │   └── server.js
│   ├── Dockerfile
│   └── package.json
├── client/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   ├── dashboard/
│   │   │   ├── vehicles/
│   │   │   ├── drivers/
│   │   │   ├── trips/
│   │   │   ├── maintenance/
│   │   │   └── fuel-expenses/
│   │   └── routes/
│   ├── vite.config.js
│   └── package.json
├── docs/
│   └── transitops.postman_collection.json
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```
