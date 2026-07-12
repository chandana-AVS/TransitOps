# TransitOps — 8-Hour Hackathon Implementation Plan (Corrected)
## Smart Transport Operations Platform

**Assumption stated upfront:** this plan assumes a team of 2–4 developers (the brief explicitly penalizes one person owning Git, implying a team). Role-split and timeline below scale down cleanly to 2 people or up to 4 — adjust the parallel tracks in Section 5 to your actual headcount.

---

## 0. Reading the Judges Correctly

The transcript is unusually specific about what they're scoring and what they *don't* want. Treat these as hard constraints, not suggestions:

| They said | What it rules in / out |
|---|---|
| "Database design and setup... model data well, build their own backend and APIs" | **No Firebase/Supabase/MongoDB Atlas.** Self-hosted PostgreSQL or MySQL, your own Express/Node (or equivalent) API. This is the single most heavily weighted thing — "and most importantly, database design" is stated twice. |
| "Minimal use of third-party APIs" | No Google Maps, no SendGrid/Twilio, no OCR services. Everything computable (fuel efficiency, ROI, utilization %) should be computed by your own backend from your own tables. |
| "Real-time and dynamic data... static JSON is fine for prototyping, not for the final solution" | Every screen must read from your live DB by the final demo. Don't leave mock JSON wired into any production path. **Recommended: add 5-second polling or SSE on dashboard for live feel.** |
| "Robust input validation... user errors must be handled gracefully" | Server-side validation is mandatory (not just frontend). Every business rule in Section 3.4 of the brief must produce a clear, specific error message, not a generic 500. |
| "One member managing Git isn't enough. Version control is a team effort" | Every team member commits directly, on their own branch, with their own PRs. Judges can and will check contributor graphs. |
| "Everyone should participate [in the demo]" | Assign a section of the demo script (Section 17 below) to each person now, not at hour 7:45. |
| "Trendy tech... great if it genuinely adds value" | Don't bolt on AI/blockchain/chatbots for this problem. There's no natural fit here — skip it. Your differentiation is clean architecture and correct business logic, not buzzwords. |

---

## 1. Judging Criteria → Where This Plan Delivers It

| Criterion | Section |
|---|---|
| Database design | §6 (ER model, constraints, indexes) |
| Logic | §7 (state machine / business rule enforcement) |
| Modularity | §9, §10 (layered backend, componentized frontend) |
| Frontend design | §13 |
| Performance | §12 |
| Scalability | §12 |
| Security | §11 |
| Usability | §13 |
| Debugging skills | §14 |
| Coding standards | §15 |
| Git discipline | §16 |

---

## 2. Final Tech Stack

| Layer | Choice | Why (given the constraints above) |
|---|---|---|
| Backend | **Node.js + Express** | Fastest to scaffold in a time-boxed hackathon; whole team likely already knows it |
| ORM | **Prisma** | Schema-as-code (`schema.prisma`) *is* a visible, reviewable artifact of your database design — directly plays to the top-weighted criterion. Auto-generates migrations, prevents SQL injection by construction. |
| Database | **PostgreSQL** | Explicitly allowed in the brief; strong constraint/enum support for status fields |
| Auth | **JWT + bcrypt**, custom middleware | Self-built, no Auth-as-a-Service — matches "build your own backend" |
| Validation | **Zod** | Shared schema definitions reusable on both frontend and backend; strict server-side re-validation regardless of frontend state |
| Frontend | **React (Vite) + TypeScript + Tailwind CSS** | Fast dev loop, no third-party UI SaaS |
| Data fetching | **TanStack Query (React Query)** | Clean loading/error state handling — helps usability score; built-in refetch interval for "real-time" polling on dashboard |
| Charts | **Recharts** | For dashboard KPIs and analytics, pure client-side, no external API calls |
| CSV export | **json2csv** (or hand-rolled) | Lightweight, no third-party service; in-memory generation is fine for hackathon scale |
| State machine testing | **Jest** | Unit tests around `trips/service.js` state transition functions — covers the highest-value logic |
| Deployment | **Docker Compose** (PostgreSQL + Node) + **Render/Railway free tier** | One-click deploy proves "real-time and dynamic" on live URL, not localhost |
| Dev tooling | **ESLint + Prettier**, `.env` for secrets | Coding standards, security hygiene |

Nothing here is a BaaS, nothing calls an external paid API — every requirement in the brief is satisfiable from a self-hosted stack.

---

## 3. Team Role Split (REBALANCED)

**Change from original:** Maintenance/fuel APIs moved from Dev B to Dev D (frontend owns those endpoints too) to balance backend load; Dev D becomes full-stack on ops features instead of pure frontend. Dev C adds frontend validation.

| Role | Owns | Branches |
|---|---|---|
| **Dev A — DB & Core Backend** | Prisma schema, migrations, seed script, auth + RBAC middleware, Postman collection (pre-written at 0:00) | `feat/db-schema`, `feat/auth`, `docs/postman` |
| **Dev B — Business Logic Backend** | Trip/vehicle/driver state machine, reports/analytics endpoints, Jest unit tests for state transitions | `feat/trips`, `feat/reports` |
| **Dev C — Frontend Core** | Auth pages, routing/RBAC guards, dashboard shell, vehicle/driver CRUD screens, **client-side Zod validation on all forms** | `feat/fe-auth-dashboard`, `feat/fe-vehicles-drivers` |
| **Dev D — Full-Stack Ops** | Maintenance + fuel/expense APIs **and** their UIs, trip creation/dispatch UI, charts, CSV export, dark mode, **SSE or polling for dashboard live updates** | `feat/fe-trips`, `feat/fe-analytics`, `feat/maintenance-fuel-apis` |

*Rationale:* Dev B's original scope (trips state machine + maintenance/fuel + reports) was the single highest-risk item. Moving maintenance/fuel APIs to Dev D splits backend work 3 ways instead of 2, reducing the critical path bottleneck at 2:45–4:15.

*(2-person team: split into "Backend" and "Frontend" tracks and merge the sub-items above. 3-person: fold Dev D's charts/analytics into Dev C and keep Dev D on maintenance/fuel APIs only.)*

---

## 4. Pre-Hackathon Preparation (NEW — addresses 0:00–0:25 time pressure)

**Do this before the clock starts:**

- [ ] Every team member reads the brief and this plan — no "what are we building" discussion needed at 0:00
- [ ] Dev A generates the initial `schema.prisma` and shares via DM — 10 min pre-work saves 30 min at kickoff
- [ ] Dev A pre-writes the Postman collection skeleton (`/docs/transitops.postman_collection.json`) with all endpoint stubs — import at 0:05, not 4:15
- [ ] All team members install Node 20+, PostgreSQL, and create a free Render/Railway account
- [ ] Clone repo, run `npm init` and commit ESLint + Prettier config before the hackathon starts

---

## 5. Hour-by-Hour Timeline (CORRECTED)

**Changes from original:**
- Added 15 min deployment buffer at 6:00
- Added 15 min Jest test buffer at 6:45
- Added 10 min Docker + deploy step at 7:20
- Seed script + Postman collection prepped ahead (see §4)
- Frontend form validation explicitly in Dev C's slot
- Maintenance/fuel APIs moved to Dev D parallel track

| Time | Everyone | Dev A (DB + Auth) | Dev B (State Machine + Reports) | Dev C (Frontend Core) | Dev D (Full-Stack Ops) |
|---|---|---|---|---|---|
| 0:00–0:15 | Kickoff: confirm roles, walk the ERD together (§6), agree on API contract (§8) | — | — | — | — |
| 0:15–1:00 | — | Prisma schema + migration + seed script; auth endpoints | Scaffold Express folder structure (§8), middleware stubs | Vite scaffold, Tailwind setup, routing skeleton, login page (against mocked response) | Scaffold maintenance/fuel/expenses module folders, Zod schemas |
| 1:00–2:30 | — | Vehicle + Driver CRUD APIs w/ Zod validation | Begin trip state machine service functions + Jest unit tests | Vehicle/Driver list + create/edit forms, **client-side Zod validation** | Maintenance + fuel + expense APIs (routes, controller, service) |
| 2:30–4:00 | — | Bug fixes, help others as needed | Trip lifecycle APIs + state machine — **highest-risk item, protect this slot** | Trip creation form + trip list/status board, connected to real API | Trip dispatch/complete UI, connected to Dev B's real API |
| 4:00–4:45 | **Merge checkpoint** — everyone tests against Postman collection; fix integration bugs together | | | | |
| 4:45–5:45 | — | Dashboard KPI + reports endpoints (utilization, fuel efficiency, cost, ROI), CSV export | **Write Jest unit tests** for trip state machine (dispatch/complete/cancel guard clauses) | Dashboard charts (Recharts), KPI cards, filters | Maintenance log UI, fuel/expense entry forms, CSV export button |
| 5:45–6:00 | — | **Docker Compose** setup (postgres + app) + deploy to Render/Railway | Continue tests or help Dev A with Docker | RBAC-gated nav, empty/error/loading states, dark mode | **Add 5-second polling** on dashboard for live data refresh |
| 6:00–6:45 | — | Bug fixes, seed script refinement | Integration test all endpoints against deployed instance | Responsive pass, form edge cases | Dark mode polish, confirmation modals |
| 6:45–7:15 | **Full regression pass** against the Example Workflow in the brief (§14) + 3 deliberate invalid-input tests | | | | |
| 7:15–7:40 | **Docker build + re-deploy** with final code; seed realistic demo data | | | | |
| 7:40–7:50 | Assign demo sections (§17), final `git push` + tag `v1.0-demo` | | | | |
| 7:50–8:00 | Breathe. **Do not touch `main` again.** Practice demo flow once. | | | | |

---

## 6. Database Design (the criterion they weighted highest)

### Entity list & key fields

```
roles
  id PK, name UNIQUE  -- FLEET_MANAGER | DRIVER | SAFETY_OFFICER | FINANCIAL_ANALYST

users
  id PK, name, email UNIQUE, password_hash, role_id FK->roles, created_at, updated_at

vehicles
  id PK, registration_number UNIQUE INDEX, name, model, type,
  max_load_capacity DECIMAL, odometer DECIMAL, acquisition_cost DECIMAL,
  status INDEX  -- AVAILABLE | ON_TRIP | IN_SHOP | RETIRED
  region, created_at, updated_at

drivers
  id PK, user_id FK->users UNIQUE, license_number UNIQUE,
  license_category, license_expiry_date INDEX, contact_number,
  safety_score DECIMAL, status INDEX  -- AVAILABLE | ON_TRIP | OFF_DUTY | SUSPENDED
  created_at, updated_at

trips
  id PK, source, destination, vehicle_id FK->vehicles INDEX, driver_id FK->drivers INDEX,
  cargo_weight DECIMAL, planned_distance DECIMAL, actual_distance DECIMAL NULL,
  start_odometer DECIMAL NULL, end_odometer DECIMAL NULL,
  status INDEX  -- DRAFT | DISPATCHED | COMPLETED | CANCELLED
  dispatched_at, completed_at, cancelled_at, created_by FK->users, created_at, updated_at

maintenance_logs
  id PK, vehicle_id FK->vehicles INDEX, description, cost DECIMAL,
  status INDEX  -- OPEN | CLOSED
  opened_at, closed_at, created_at

fuel_logs
  id PK, vehicle_id FK->vehicles INDEX, trip_id FK->trips NULL,
  liters DECIMAL, cost DECIMAL, odometer_reading DECIMAL, logged_date, created_at

expenses
  id PK, vehicle_id FK->vehicles NULL INDEX, trip_id FK->trips NULL,
  type  -- TOLL | MAINTENANCE | OTHER
  amount DECIMAL, description, expense_date, created_at
```

### Design decisions worth stating out loud in the demo
- `roles` as its own lookup table rather than a raw string on `users` — normalized, and it's an easy visual proof of "we thought about database design" on the ERD slide.
- `drivers.user_id` is a 1:1 link to `users` — a driver logs in as a user, but license/safety data lives in its own table so the `users` table stays generic and reusable across roles.
- Every status field is indexed — the dashboard's "Active Vehicles / Available / In Maintenance" KPIs are all `WHERE status = ...` counts; without indexes these degrade as data grows.
- `fuel_logs.trip_id` and `expenses.trip_id` are nullable — fuel and expenses can exist independent of a specific trip (e.g., a scheduled top-up), but link back to one when relevant, which is what powers the per-vehicle operational cost rollup.
- All money/measurement fields are `DECIMAL`, never `FLOAT` — avoids floating-point rounding errors in cost/ROI calculations, a small detail that signals care.

Generate the actual ERD image from `schema.prisma` using `prisma-erd-generator` or dbdiagram.io and put it on its own slide — don't just describe it verbally.

---

## 7. Business Rule Enforcement (Logic)

Implement every transition as an explicit service function wrapped in a DB transaction — never a bare `UPDATE`. This is where "logic" and "modularity" get scored together.

```
dispatchTrip(tripId):
  trip = getTrip(tripId)              → must be status = DRAFT, else 409
  vehicle = getVehicle(trip.vehicle_id) → must be AVAILABLE (not IN_SHOP/RETIRED/ON_TRIP), else 409
  driver = getDriver(trip.driver_id)    → must be AVAILABLE, license_expiry_date >= today,
                                           status != SUSPENDED, else 403/409
  assert trip.cargo_weight <= vehicle.max_load_capacity, else 400
  TRANSACTION:
    trip.status = DISPATCHED; trip.dispatched_at = now
    vehicle.status = ON_TRIP
    driver.status = ON_TRIP

completeTrip(tripId, end_odometer, fuel_consumed):
  trip must be DISPATCHED, else 409
  TRANSACTION:
    trip.status = COMPLETED; trip.completed_at = now
    trip.actual_distance = end_odometer - trip.start_odometer
    vehicle.odometer = end_odometer; vehicle.status = AVAILABLE
    driver.status = AVAILABLE
    optionally insert fuel_logs row from fuel_consumed

cancelTrip(tripId):
  trip must be DRAFT or DISPATCHED, else 409
  TRANSACTION:
    if trip.status was DISPATCHED: vehicle.status = AVAILABLE; driver.status = AVAILABLE
    trip.status = CANCELLED; trip.cancelled_at = now

openMaintenance(vehicleId, description, cost):
  vehicle must not be ON_TRIP, else 409
  TRANSACTION:
    insert maintenance_logs row, status = OPEN
    vehicle.status = IN_SHOP

closeMaintenance(maintenanceId):
  TRANSACTION:
    maintenance.status = CLOSED; maintenance.closed_at = now
    if vehicle.status != RETIRED: vehicle.status = AVAILABLE
```

Every guard clause above maps 1:1 to a "Mandatory Business Rule" in the brief — when you write the service layer, literally comment the rule number next to the check. Judges reading your code should be able to tell you read the spec carefully.

---

## 8. API Design

| Resource | Endpoints | Roles allowed |
|---|---|---|
| Auth | `POST /auth/login`, `GET /auth/me` | all (login is public) |
| Vehicles | `GET /vehicles` (filter: type/status/region, paginated), `POST /vehicles`, `GET /vehicles/:id`, `PUT /vehicles/:id`, `PATCH /vehicles/:id/retire` | Fleet Manager write; all roles read |
| Drivers | `GET /drivers`, `POST /drivers`, `PUT /drivers/:id`, `PATCH /drivers/:id/suspend` | Fleet Manager / Safety Officer write; all read |
| Trips | `GET /trips`, `POST /trips`, `POST /trips/:id/dispatch`, `POST /trips/:id/complete`, `POST /trips/:id/cancel` | Driver/Fleet Manager |
| Maintenance | `GET /maintenance`, `POST /maintenance`, `POST /maintenance/:id/close` | Fleet Manager |
| Fuel logs | `GET /fuel-logs`, `POST /fuel-logs` | Fleet Manager / Driver |
| Expenses | `GET /expenses`, `POST /expenses` | Financial Analyst / Fleet Manager |
| Dashboard/Reports | `GET /dashboard/kpis`, `GET /reports/fuel-efficiency`, `GET /reports/utilization`, `GET /reports/cost`, `GET /reports/roi`, `GET /reports/export.csv` | Financial Analyst read-heavy; Fleet Manager also reads |

**The Postman/Thunder Client collection must be in the repo** (`/docs/transitops.postman_collection.json`) before coding begins — Dev A pre-writes it during pre-hackathon prep (§4). This doubles as your own integration test log and something judges can run themselves.

**All list endpoints paginated** (`?page=&limit=`, default 25) — never return an unbounded table.

---

## 9. Backend Architecture (Modularity)

```
/server
  /src
    /config        (db client, env loader)
    /middleware     (auth.js, rbac.js, validate.js, errorHandler.js, logger.js)
    /modules
      /auth         (routes, controller, service)
      /vehicles     (routes, controller, service, schema.zod.js)
      /drivers
      /trips        (routes, controller, service — state machine lives here)
      /maintenance
      /fuel
      /expenses
      /reports
    /prisma
      schema.prisma
      seed.js
    /__tests__      (trip.service.test.js — Jest unit tests for state machine)
    app.js
    server.js
  Dockerfile
  docker-compose.yml
```

Rule of thumb: **routes** parse HTTP in/out only, **controllers** orchestrate, **services** hold business logic and DB transactions, **schema.zod.js** files hold validation — no logic embedded directly in route handlers. This separation is what "modularity" is graded on; a single 800-line `index.js` will score poorly regardless of whether the app works.

---

## 10. Frontend Architecture

```
/client/src
  /api          (typed fetch wrappers per resource, one file each)
  /components   (shared: Table, StatusBadge, Modal, KPICard, Chart wrappers)
  /features
    /auth
    /vehicles
    /drivers
    /trips
    /maintenance
    /fuel-expenses
    /dashboard
  /hooks        (useAuth, useRole)
  /routes       (RoleGuard wrapper component, route config)
  /lib          (zod schemas shared with backend where possible)
```

- `RoleGuard` wraps routes and redirects/hides nav items based on `useAuth().role` — this is your RBAC enforcement on the frontend (backend RBAC middleware is the real gate; frontend gating is UX only, never trust it as the security boundary).
- **Every list screen**: loading skeleton → data table → empty state → error state, in that order of precedence. Judges scoring "usability" are looking for exactly this kind of state-completeness, not just the happy path.
- **Client-side Zod validation** on every form, running the same schemas as the server — instant feedback for users, server re-validates independently for security.
- **Dashboard polling:** TanStack Query's `refetchInterval: 5000` on dashboard KPIs gives a "real-time" feel without WebSocket complexity. Mention in demo: "we use 5-second polling to reflect live operational changes — Server-Sent Events would be the production upgrade path."

---

## 11. Security Checklist

- [ ] Passwords hashed with **bcrypt** (cost factor 10+), never stored/returned in plaintext
- [ ] JWT signed with a secret from `.env` (never committed — add `.env` to `.gitignore` immediately, first commit)
- [ ] Auth middleware verifies JWT on every protected route; RBAC middleware checks `req.user.role` against an allow-list per route
- [ ] All DB queries via Prisma (parameterized by construction) — no raw string-concatenated SQL anywhere
- [ ] Server-side Zod validation on every POST/PUT/PATCH body, independent of whatever the frontend already checked
- [ ] `helmet` + explicit CORS origin whitelist (not `*`)
- [ ] Rate limit `/auth/login` (e.g. `express-rate-limit`, 5 attempts/min) — cheap to add, shows security awareness beyond the minimum
- [ ] API responses never include `password_hash` — use explicit `select` fields in Prisma queries, not `select *`

---

## 12. Performance & Scalability

- Index every column used in a `WHERE` or `JOIN` (see §6) — this alone is most of what "performance" means at this data scale.
- Paginate every list endpoint (`?page=&limit=`), default limit 25 — never return an unbounded table.
- Use Prisma's `include`/`select` to eager-load relations (e.g., trip + vehicle + driver in one query) instead of N+1 sequential fetches.
- Keep the layered architecture (§9) — it's what makes it *plausible* to say "this could scale" in the demo: swapping Postgres for a managed instance, or adding a Redis cache layer later, wouldn't require touching business logic. You don't need to actually build that caching layer in 8 hours — just be able to point at the seam where it would go.
- Dashboard uses **5-second polling** instead of WebSocket — judges see data update live after completing a trip; mention SSE as the production upgrade path.

---

## 13. Frontend Design & Usability

- Follow the provided Excalidraw mockup for layout — don't freelance a different IA under time pressure; consistency with the given wireframe is a safer bet than a redesign judged against a spec you didn't write.
- Pick one spacing scale (Tailwind's default 4px scale) and one type scale, and don't deviate — visual inconsistency is the fastest way to look unfinished even when the logic is solid.
- Status badges (`AVAILABLE`/`ON_TRIP`/`IN_SHOP`/`RETIRED`, etc.) should be color-coded consistently across every screen they appear on.
- Confirmation modals on state-changing actions (dispatch, cancel, retire, suspend) — prevents accidental clicks and signals thoughtful UX.
- Dark mode is a ~15-minute add with Tailwind's `dark:` classes if your components already use Tailwind utility classes consistently — good effort-to-score ratio, do it in the polish pass (§5, 6:45–7:15).

---

## 14. Testing Strategy (CORRECTED — adds Jest unit tests)

### A. Jest Unit Tests (State Machine — highest-value logic)
Dev B writes tests for `trips/service.js` during the 4:45–5:45 slot:

```
trip.service.test.js
  ✓ dispatchTrip rejects a non-DRAFT trip with 409
  ✓ dispatchTrip rejects an IN_SHOP vehicle with 409
  ✓ dispatchTrip rejects a SUSPENDED driver with 403
  ✓ dispatchTrip rejects expired license driver with 403
  ✓ dispatchTrip rejects over-capacity cargo with 400
  ✓ dispatchTrip transitions trip/vehicle/driver status correctly
  ✓ completeTrip computes actual_distance from odometer diff
  ✓ completeTrip restores vehicle/driver to AVAILABLE
  ✓ cancelTrip on DISPATCHED restores vehicle/driver to AVAILABLE
  ✓ cancelTrip on DRAFT does not touch vehicle/driver status
  ✓ openMaintenance sets vehicle to IN_SHOP
  ✓ closeMaintenance restores vehicle to AVAILABLE
```

Run with: `npx jest --coverage` — code coverage output is another artifact to show judges.

### B. Seed Script as Integration Test Harness
Include, verbatim, the Example Workflow from the brief (Van-05 / Alex / 450kg trip) so the demo can walk through the exact scenario the judges wrote — plus 3 deliberate rule-violation seeds:

1. A trip attempt with cargo weight > vehicle capacity → expect 400 with a specific message.
2. A trip attempt assigning a driver with an expired license → expect 403.
3. A dispatch attempt on a vehicle already `ON_TRIP` → expect 409.

### C. Full Regression Pass (6:45–7:15)
Run against deployed instance: walk through the example workflow + all 3 violation cases. Log results in a simple text file `/docs/regression-results.txt`.

---

## 15. Coding Standards

- ESLint + Prettier configured at hour 0 (5 minutes), so nobody argues about formatting later — commit the config first thing.
- Consistent HTTP status code usage: `200` read, `201` create, `400` validation error, `401` unauthenticated, `403` unauthorized/business-rule block, `404` not found, `409` state conflict, `500` unexpected.
- One function, one responsibility — a service function that dispatches a trip should not also be formatting a response object; that belongs in the controller.
- Comment *why*, not *what* — e.g. `// vehicle must not be IN_SHOP or RETIRED per rule 4.7` next to a guard clause, not `// check vehicle status`.
- A short `README.md` with: setup steps, `.env.example`, how to run the seed script, how to run tests (`npx jest`), Docker quickstart, and the ERD image — treat this as a deliverable, not an afterthought; it's the first thing a judge opens.

---

## 16. Git Workflow

- `main` is the only protected branch; every feature is its own branch (`feat/trips`, `feat/fe-analytics`, etc. — see §3).
- Every team member pushes their own commits under their own name/account — this is explicitly what the judges said they check.
- Small, frequent commits with conventional prefixes (`feat:`, `fix:`, `chore:`, `refactor:`) over infrequent giant commits.
- Merge to `main` at the two checkpoints in §5 (4:00–4:45 and 7:15–7:40), not continuously — reduces mid-hackathon merge-conflict chaos while still keeping the individual branches honest.
- Tag the final commit (`v1.0-demo`) before the 7:50 cutoff and don't touch `main` after that.

---

## 17. Deliverables Checklist

**Mandatory (all must work by 7:15):**
- [x] Auth + RBAC (4 roles)
- [x] Vehicle CRUD
- [x] Driver CRUD
- [x] Trip management with full validation set
- [x] Automatic status transitions (vehicle/driver/trip/maintenance)
- [x] Maintenance workflow
- [x] Fuel & expense tracking
- [x] Dashboard KPIs
- [x] Charts/visual analytics
- [x] CSV export
- [x] Jest unit tests for trip state machine (≥12 tests)
- [x] Docker Compose + deployed to Render/Railway
- [x] Dashboard polling (5-second refetch for live feel)
- [x] Client-side Zod validation on all forms
- [x] Postman collection in `/docs/`
- [x] Regression results log in `/docs/`

**Bonus — priority order if time remains (best effort-to-score ratio first):**
1. Dark mode (~15 min, Tailwind)
2. Search/filters/sorting on list views (mostly already implied by the query-param filters in §8 — just surface them in the UI)
3. PDF export — skip unless everything above is done and stable; the brief itself marks it optional
4. Email reminders for expiring licenses — **don't wire real SMTP.** Instead, compute "license expires within 14 days" server-side and surface it as an in-app warning badge on the Safety Officer dashboard. This satisfies the actual business need without pulling in a third-party mail service under time pressure, and it's worth saying exactly this out loud in the demo — it shows judgment, not just feature-checking.
5. Vehicle document management — skip; low score-per-hour for an 8-hour box.

---

## 18. Deployment Strategy (NEW — one of the key gaps from original)

**Docker Compose configuration** (Dev A owns this at 5:45–6:00):

```yaml
# docker-compose.yml
version: "3.9"
services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: transitops
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
  app:
    build: ./server
    ports:
      - "3001:3001"
    depends_on:
      - db
    environment:
      DATABASE_URL: postgresql://postgres:${DB_PASSWORD}@db:5432/transitops
      JWT_SECRET: ${JWT_SECRET}
volumes:
  pgdata:
```

**Production deployment (Render/Railway free tier):**
- Push to GitHub → connect to Render/Railway → auto-deploys on push to `main`
- Add a PostgreSQL add-on (free tier, 1 GB)
- Set `DATABASE_URL` and `JWT_SECRET` as environment variables
- Run migrations on deploy: `npx prisma migrate deploy`

Demo from the live URL, not localhost — proves "real-time and dynamic data" more convincingly.

---

## 19. Real-Time Data Strategy (NEW — addresses the "real-time" gap)

| Approach | Effort | Demo Value | Recommendation |
|---|---|---|---|
| WebSocket (Socket.IO) | ~45 min setup + integration | High — instant updates | **Skip for 8h; too heavy** |
| Server-Sent Events (SSE) | ~30 min | High — one-way live updates | **Best production path, mention in demo** |
| Polling (TanStack Query) | **~5 min** — `refetchInterval: 5000` | Medium — 5s delay, updates appear live-ish | **✓ Use this** |
| No real-time, manual refresh button | 0 min | Low — judges might note "not real-time" | Do not use |

**Implementation:** In every dashboard query, add `refetchInterval: 5000` to the TanStack Query options. When a trip is completed, the dashboard KPIs auto-update within 5 seconds. Demo line: *"We use 5-second polling for live data — Server-Sent Events would be the production upgrade for true real-time, but polling keeps our third-party dependency count at zero."*

---

## 20. Demo Script

Target: 5–6 minutes, one person per section.

1. **(Dev A)** — Architecture + ERD + Docker deployment. 45 seconds on the DB design decisions in §6 — this is the highest-weighted criterion, don't bury it. Show the live URL.
2. **(Dev C)** — Login as Fleet Manager → dashboard KPIs (note the 5-second polling) → register a vehicle.
3. **(Dev C/D)** — Login as Driver → attempt an over-capacity trip (show the validation error) → create a valid trip → dispatch it (show vehicle/driver flip to `ON_TRIP` live on dashboard).
4. **(Dev B)** — Login as Safety Officer → show a suspended/expired-license driver blocked from assignment → show the license-expiry warning badge. Mention that the state machine is covered by 12+ Jest unit tests.
5. **(Dev D)** — Complete the trip → open a maintenance record (vehicle auto-flips to `IN_SHOP`, disappears from dispatch pool, dashboard reflects it) → close it.
6. **(Dev A/B)** — Login as Financial Analyst → fuel efficiency / utilization / cost / ROI reports → CSV export.
7. **(Whole team, 20 seconds)** — One sentence each on what you personally built — matches "showing ownership and teamwork" from the brief.

---

## 21. Risk Registry (NEW — explicitly tracks every limitation from the original plan)

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Trip state machine runs over its 2:30–4:00 slot | Medium | High — cascades to everything downstream | Maintenance/fuel APIs moved to Dev D to unblock Dev B; Dev A and Dev C available to assist Dev B after their own 1:00–2:30 slot |
| Merge conflicts at 4:00 checkpoint | Medium | Medium | Small frequent commits (§16); API contract agreed at 0:00; shared Zod schemas reduce interface mismatches |
| No automated test framework | Low (fixed) | High — bugs surface in demo | 12 Jest unit tests written during 4:45–5:45 by Dev B; seed script covers integration happy + sad paths |
| No deployment / judges see localhost | Low (fixed) | Medium — less convincing demo | Docker Compose + Render/Railway deploy at 5:45–6:00; re-deploy at 7:15–7:40 |
| Dashboard feels static, not "real-time" | Low (fixed) | Medium — judges may deduct on "dynamic data" | TanStack Query `refetchInterval: 5000` on all dashboard queries |
| Frontend form bugs caught at demo time | Medium | Medium | Client-side Zod validation on all forms (Dev C, 1:00–2:30); same schemas as server |
| Team member drops out / no-show | Low | High — timeline assumes 4 people | §3 shows 2-person and 3-person fallback splits; critical path (state machine) can be pair-programmed if needed |
| Postgres connection issues in demo environment | Low | High — entire app fails | Docker Compose tested locally before deployment; DATABASE_URL as env var, not hardcoded |
| Seed script doesn't cover all demo scenarios | Low (fixed) | Medium — demo stumbles | Seed script includes Van-05/Alex example workflow + 3 violation cases; checked into repo at 0:15 |
| Judges don't see Jest tests because they don't know to run them | Low | Medium — testing effort invisible | Mention "12 Jest unit tests covering every state transition" in Dev B's demo section; show `npx jest --coverage` output screenshot if possible |

---

## 22. Immediate Next Steps

1. **Right now:** Every team member reads the brief + this plan. Dev A generates `schema.prisma` skeleton and Postman collection.
2. **Before clock starts:** Create repo, commit ESLint/Prettier config, `.gitignore`, `.env.example`. All members fork/clone.
3. **At 0:00:** 15-min standup to confirm roles, walk ERD, agree on API contract. Start coding at 0:15 sharp.
4. **First file to write:** `schema.prisma` + `docker-compose.yml` — everything depends on these.
