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
| Auth | JWT + bcrypt (custom middleware supporting Header & Query Token fallbacks for exports) |
| Validation | Zod (server-side, shared schemas) |
| Frontend | React (Vite) + Tailwind CSS v4 |
| Theme | Premium Glassmorphism & Custom Light/Dark System |
| Data Fetching | TanStack Query (React Query) |
| Charts | Recharts |
| Deploy | Docker Compose |

---

## Premium Visual Design System

TransitOps features an high-fidelity visual overhaul optimized for usability and a state-of-the-art feel:
- **Typography & Color**: Styled with Google's *Inter* typeface and a custom-built, semantic slate palette containing indigo and teal tones.
- **Glassmorphism**: Component layouts, dialogs, and navigation shell cards utilize back-drop blur and subtle outline borders to provide a clean, modern aesthetic.
- **Dark/Light Mode**: Full manual system toggling powered by custom Tailwind v4 variants (`@variant dark (&:where(.dark, .dark *))`) ensuring immediate responsive application.
- **Micro-animations**: Subtle hover elevates, active scaling, and smooth scale-in transitions are integrated across buttons, badges, modals, and lists to make the dashboard feel reactive and alive.

---

## Transactional State Machine & Race-Condition Safety

The trip lifecycle (Draft → Dispatched → Completed / Cancelled) relies on strict state updates. To prevent multi-threaded race conditions (e.g. assigning a driver or vehicle to two different trips simultaneously), all checks and updates are wrapped in a formal `prisma.$transaction` block:
- **Atomicity**: The trip, vehicle, and driver are loaded, validated, and updated within a single PostgreSQL transaction block.
- **Consistent Validation**: State verification (checking if a vehicle is retired or driver is suspended) happens directly inside the transaction using database-level isolates (`tx`), ensuring absolute consistency.

---

## Secure CSV Export Flow

The Financial Analyst analytics page contains a secure spreadsheet export:
- **Authorization Flow**: The backend middleware allows passing the JWT token through a `token` query parameter as a fallback when headers cannot be customized (e.g., standard browser downloads using `window.open`).
- **Data Protection**: All downloads require verification and check the requester's role (`FINANCIAL_ANALYST` or `FLEET_MANAGER`) before rendering the database rows.

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
npm run dev
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
