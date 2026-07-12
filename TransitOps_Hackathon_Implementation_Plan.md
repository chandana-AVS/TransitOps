# TransitOps — 8-Hour Hackathon Implementation Plan
## Smart Transport Operations Platform

**Assumption stated upfront:** this plan assumes a team of 2–4 developers (the brief explicitly penalizes one person owning Git, implying a team). Role-split and timeline below scale down cleanly to 2 people or up to 4 — adjust the parallel tracks in Section 5 to your actual headcount.

---

## 0. Reading the Judges Correctly

The transcript is unusually specific about what they're scoring and what they *don't* want. Treat these as hard constraints, not suggestions:

| They said | What it rules in / out |
|---|---|
| "Database design and setup... model data well, build their own backend and APIs" | **No Firebase/Supabase/MongoDB Atlas.** Self-hosted PostgreSQL or MySQL, your own Express/Node (or equivalent) API. This is the single most heavily weighted thing — "and most importantly, database design" is stated twice. |
| "Minimal use of third-party APIs" | No Google Maps, no SendGrid/Twilio, no OCR services. Everything computable (fuel efficiency, ROI, utilization %) should be computed by your own backend from your own tables. |
| "Real-time and dynamic data... static JSON is fine for prototyping, not for the final solution" | Every screen must read from your live DB by the final demo. Don't leave mock JSON wired into any production path. |
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
| Data fetching | **TanStack Query (React Query)** | Clean loading/error state handling — helps usability score |
| Charts | **Recharts** | For dashboard KPIs and analytics (bonus feature), pure client-side, no external API calls |
| CSV export | **json2csv** (or hand-rolled) | Lightweight, no third-party service |
| Dev tooling | **ESLint + Prettier**, `.env` for secrets | Coding standards, security hygiene |

Nothing here is a BaaS, nothing calls an external paid API — every requirement in the brief is satisfiable from a self-hosted stack.

---

## 3. Team Role Split (adjust to your headcount)

| Role | Owns | Branches |
|---|---|---|
| **Dev A — DB & Core Backend** | Prisma schema, migrations, seed script, auth + RBAC middleware | `feat/db-schema`, `feat/auth` |
| **Dev B — Business Logic Backend** | Trip/vehicle/driver state machine, maintenance, fuel/expense APIs, reports/analytics endpoints | `feat/trips`, `feat/maintenance-fuel`, `feat/reports` |
| **Dev C — Frontend Core** | Auth pages, routing/RBAC guards, dashboard shell, vehicle/driver CRUD screens | `feat/fe-auth-dashboard`, `feat/fe-vehicles-drivers` |
| **Dev D — Frontend Ops & Analytics** | Trip creation/dispatch UI, maintenance/fuel UI, charts, CSV export button, dark mode | `feat/fe-trips`, `feat/fe-analytics` |

*(2-person team: split into "Backend" and "Frontend" tracks and merge the sub-items above. 3-person: fold Dev D's charts/analytics into Dev C.)*

---

## 4. Hour-by-Hour Timeline

| Time | Everyone | Backend track | Frontend track |
|---|---|---|---|
| 0:00–0:25 | Kickoff: confirm roles, walk the ERD together (§6), agree on API contract (§8) | — | — |
| 0:25–1:15 | — | Prisma schema + migration + seed script; auth endpoints | Vite scaffold, Tailwind setup, routing skeleton, login page (against mocked response) |
| 1:15–2:45 | — | Vehicle + Driver CRUD APIs w/ validation | Vehicle/Driver list + create/edit forms, wired to real API by 2:45 |
| 2:45–4:15 | — | Trip lifecycle APIs + state machine (§7) — **highest-risk item, protect this slot** | Trip creation form + trip list/status board |
| 4:15–5:15 | **Merge checkpoint** — everyone tests everyone else's endpoints against Postman collection | Maintenance + fuel/expense APIs | Maintenance log UI, fuel/expense entry forms |
| 5:15–6:15 | — | Dashboard KPI + reports endpoints (utilization, fuel efficiency, cost, ROI), CSV export route | Dashboard charts, KPI cards, filters |
| 6:15–7:00 | — | Bug fixes from integration testing | RBAC-gated nav, empty/error/loading states, dark mode, responsive pass |
| 7:00–7:30 | **Full regression pass** against the Example Workflow in the brief (§14) + 3 deliberate invalid-input tests | | |
| 7:30–7:50 | Seed realistic demo data, assign demo sections (§17), final `git push` + tag `v1.0-demo` | | |
| 7:50–8:00 | Breathe. Do not touch `main` again. | | |

---

## 5. Database Design (the criterion they weighted highest)

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

## 6. Business Rule Enforcement (Logic)

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

## 7. API Design

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

Keep a Postman/Thunder Client collection **in the repo** (`/docs/transitops.postman_collection.json`) — this doubles as your own integration test log and something judges can run themselves.

---

## 8. Backend Architecture (Modularity)

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
    app.js
    server.js
```

Rule of thumb: **routes** parse HTTP in/out only, **controllers** orchestrate, **services** hold business logic and DB transactions, **schema.zod.js** files hold validation — no logic embedded directly in route handlers. This separation is what "modularity" is graded on; a single 800-line `index.js` will score poorly regardless of whether the app works.

---

## 9. Frontend Architecture

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
- Every list screen: loading skeleton → data table → empty state → error state, in that order of precedence. Judges scoring "usability" are looking for exactly this kind of state-completeness, not just the happy path.

---

## 10. Security Checklist

- [ ] Passwords hashed with **bcrypt** (cost factor 10+), never stored/returned in plaintext
- [ ] JWT signed with a secret from `.env` (never committed — add `.env` to `.gitignore` immediately, first commit)
- [ ] Auth middleware verifies JWT on every protected route; RBAC middleware checks `req.user.role` against an allow-list per route
- [ ] All DB queries via Prisma (parameterized by construction) — no raw string-concatenated SQL anywhere
- [ ] Server-side Zod validation on every POST/PUT/PATCH body, independent of whatever the frontend already checked
- [ ] `helmet` + explicit CORS origin whitelist (not `*`)
- [ ] Rate limit `/auth/login` (e.g. `express-rate-limit`, 5 attempts/min) — cheap to add, shows security awareness beyond the minimum
- [ ] API responses never include `password_hash` — use explicit `select` fields in Prisma queries, not `select *`

---

## 11. Performance & Scalability

- Index every column used in a `WHERE` or `JOIN` (see §5) — this alone is most of what "performance" means at this data scale.
- Paginate every list endpoint (`?page=&limit=`), default limit 20–25 — never return an unbounded table.
- Use Prisma's `include`/`select` to eager-load relations (e.g., trip + vehicle + driver in one query) instead of N+1 sequential fetches.
- Keep the layered architecture (§8) — it's what makes it *plausible* to say "this could scale" in the demo: swapping Postgres for a managed instance, or adding a Redis cache layer later, wouldn't require touching business logic. You don't need to actually build that caching layer in 8 hours — just be able to point at the seam where it would go.

---

## 12. Frontend Design & Usability

- Follow the provided Excalidraw mockup for layout — don't freelance a different IA under time pressure; consistency with the given wireframe is a safer bet than a redesign judged against a spec you didn't write.
- Pick one spacing scale (Tailwind's default 4px scale) and one type scale, and don't deviate — visual inconsistency is the fastest way to look unfinished even when the logic is solid.
- Status badges (`AVAILABLE`/`ON_TRIP`/`IN_SHOP`/`RETIRED`, etc.) should be color-coded consistently across every screen they appear on.
- Confirmation modals on state-changing actions (dispatch, cancel, retire, suspend) — prevents accidental clicks and signals thoughtful UX.
- Dark mode (bonus) is a ~15-minute add with Tailwind's `dark:` classes if your components already use Tailwind utility classes consistently — good effort-to-score ratio, do it in the polish pass (§4, 6:15–7:00).

---

## 13. Debugging & Testing Strategy

- Structured error responses everywhere: `{ success: false, error: { code, message } }` — never a bare stack trace to the client, but do log the full stack server-side via a logger (`pino` or `morgan` + console).
- **Seed script is your test harness.** Include, verbatim, the Example Workflow from the brief (Van-05 / Alex / 450kg trip) so the demo can walk through the exact scenario the judges wrote — plus 3 deliberate rule-violation seeds:
  1. A trip attempt with cargo weight > vehicle capacity → expect 400 with a specific message.
  2. A trip attempt assigning a driver with an expired license → expect 403.
  3. A dispatch attempt on a vehicle already `ON_TRIP` → expect 409.
- Run the full regression pass in the 7:00–7:30 slot against exactly these scenarios before touching polish — a working core beats a pretty UI with broken validation.
- If time remains after §4's buffer, add a handful of Jest unit tests around the state-machine service functions in `trips/service.js` — this is the highest-value place to spend any bonus testing time, since it's the "logic" the judges are explicitly scoring.

---

## 14. Coding Standards

- ESLint + Prettier configured at hour 0 (5 minutes), so nobody argues about formatting later — commit the config first thing.
- Consistent HTTP status code usage: `200` read, `201` create, `400` validation error, `401` unauthenticated, `403` unauthorized/business-rule block, `404` not found, `409` state conflict, `500` unexpected.
- One function, one responsibility — a service function that dispatches a trip should not also be formatting a response object; that belongs in the controller.
- Comment *why*, not *what* — e.g. `// vehicle must not be IN_SHOP or RETIRED per rule 4.7` next to a guard clause, not `// check vehicle status`.
- A short `README.md` with: setup steps, `.env.example`, how to run the seed script, and the ERD image — treat this as a deliverable, not an afterthought; it's the first thing a judge opens.

---

## 15. Git Workflow

- `main` is the only protected branch; every feature is its own branch (`feat/trips`, `feat/fe-analytics`, etc. — see §3).
- Every team member pushes their own commits under their own name/account — this is explicitly what the judges said they check.
- Small, frequent commits with conventional prefixes (`feat:`, `fix:`, `chore:`, `refactor:`) over infrequent giant commits.
- Merge to `main` at the two checkpoints in §4 (4:15 and 7:30), not continuously — reduces mid-hackathon merge-conflict chaos while still keeping the individual branches honest.
- Tag the final commit (`v1.0-demo`) before the 7:50 cutoff and don't touch `main` after that.

---

## 16. Deliverables Checklist

**Mandatory (all must work by 7:30):**
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

**Bonus — priority order if time remains (best effort-to-score ratio first):**
1. Dark mode (~15 min, Tailwind)
2. Search/filters/sorting on list views (mostly already implied by the query-param filters in §7 — just surface them in the UI)
3. PDF export — skip unless everything above is done and stable; the brief itself marks it optional
4. Email reminders for expiring licenses — **don't wire real SMTP.** Instead, compute "license expires within 14 days" server-side and surface it as an in-app warning badge on the Safety Officer dashboard. This satisfies the actual business need without pulling in a third-party mail service under time pressure, and it's worth saying exactly this out loud in the demo — it shows judgment, not just feature-checking.
5. Vehicle document management — skip; low score-per-hour for an 8-hour box.

---

## 17. Demo Script (assign now, not at hour 7:45)

Target: 5–6 minutes, one person per section.

1. **(Dev A)** — Architecture + ERD slide. 45 seconds on the DB design decisions in §5 — this is the highest-weighted criterion, don't bury it.
2. **(Dev C)** — Login as Fleet Manager → dashboard KPIs → register a vehicle.
3. **(Dev C/D)** — Login as Driver → attempt an over-capacity trip (show the validation error) → create a valid trip → dispatch it (show vehicle/driver flip to `ON_TRIP` live).
4. **(Dev B)** — Login as Safety Officer → show a suspended/expired-license driver blocked from assignment → show the license-expiry warning badge.
5. **(Dev D)** — Complete the trip → open a maintenance record (vehicle auto-flips to `IN_SHOP`, disappears from dispatch pool) → close it.
6. **(Dev A/B)** — Login as Financial Analyst → fuel efficiency / utilization / cost / ROI reports → CSV export.
7. **(Whole team, 20 seconds)** — One sentence each on what you personally built — matches "showing ownership and teamwork" from the brief.

---

## 18. Immediate Next Steps

1. Confirm actual team size so I can rebalance §3/§4 if it's not 4 people.
2. I can generate right now, ready to paste into your repo: the full `schema.prisma` file, the `seed.js` script (with the example-workflow + 3 invalid-case scenarios from §13), or the Express folder skeleton with middleware stubs — say which one first.
