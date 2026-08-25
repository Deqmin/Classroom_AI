# Tuition School Management App — Vibe Coding Exercise

## 1. Goal

Build and deploy a small, fully cloud-hosted web application for a tuition school to manage
**Classes**, **Teachers** and **Students**. Everything must run on free-tier cloud services —
**no local servers** are allowed for the final deliverable.

The purpose of this exercise is to practise "vibe coding": describe what you want to an AI
coding assistant, iterate quickly, and ship a working product end-to-end (frontend → API →
database) on real cloud infrastructure.

## 1.1 ⚠️ Important restrictions — READ FIRST

> **Trademark restriction:** Do **NOT** mention, reference, or use the names **FFFlexx**, **FFFlexxFFlowwww**, or **FFFlexxtronnnnxxxx**
> anywhere in this exercise — not in code, comments, commit messages, repository names, README, UI text, domain data,
> screenshots or the demo. These are registered company trademarks and must not be included in this exercise.
> Use only the fictional school name **"Sunrise Tuition Centre"** (or any other fictional name of your choice).
> Any submission containing these names will be rejected.

> **Timeline:** Estimated effort is **2 working days**. **Deadline: Friday, 28 August 2026 (end of day)**.
> Submit the repository URL (with live URLs in its README) before the deadline.

## 2. Architecture (mandatory)

| Layer | Platform | Notes |
|---|---|---|
| Frontend (static web) | **GitHub Pages** | Static site (HTML/CSS/JS or a built SPA such as React/Vue/Svelte). Must call the API over HTTPS. |
| API / backend | **Render** (Web Service) | Any language/framework (Node/Express, Python/FastAPI, Go, etc.). Exposes a REST (or GraphQL) API. |
| Database | **Neon** (serverless PostgreSQL) | Store classes, teachers, students. Connect from Render using the Neon connection string. |

```
[Browser / Mobile] ──HTTPS──> [GitHub Pages: frontend]
                                     │  fetch / axios
                                     ▼
                              [Render: REST API]
                                     │  SQL (pg / Prisma / SQLAlchemy …)
                                     ▼
                              [Neon: PostgreSQL]
```

Rules:
- No `localhost` in the final demo. The teacher/reviewer will open the GitHub Pages URL on a phone and a laptop.
- Secrets (DB connection string) must live in Render **Environment Variables**, never in the repo.
- CORS on the API must allow the GitHub Pages origin.
- Note: Render free web services sleep after inactivity; the first request may take ~30–60 s. Show a loading state.

## 3. Domain model

Seed/reference data is provided in `tuition_school_dummy_data.xlsx` (sheets: Classes, Teachers, Students, Schedule, Summary).

### Class
| Field | Type | Notes |
|---|---|---|
| class_id | PK (uuid or serial) | |
| class_code | text, unique | e.g. `primary1`, `primary2`, `primary3` |
| class_name | text | e.g. `Primary 1` |
| subjects | text | comma-separated or separate table (stretch) |
| schedule_days / schedule_time / room | text | optional |
| teacher_id | FK → Teacher (nullable) | assigned teacher |
| status | `Active` / `Inactive` | |

### Teacher
| Field | Type | Notes |
|---|---|---|
| teacher_id | PK | |
| teacher_code | text, unique | `teacher01`, `teacher02`, … |
| full_name, email, phone | text | |
| subject_specialty | text | |
| class_id | FK → Class (nullable) | class they teach |
| join_date | date | |
| status | `Active` / `On Leave` / `Inactive` | |

### Student
| Field | Type | Notes |
|---|---|---|
| student_id | PK | |
| student_code | text, unique | `<class_code>-studentNN`, e.g. `primary1-student01` |
| full_name, gender, age | | |
| class_id | FK → Class (**required**) | a student belongs to exactly one class |
| guardian_name, guardian_phone, guardian_email | text | |
| enrolment_date | date | |
| status | `Active` / `Withdrawn` | |

Relationships: one Class has many Students; one Teacher is assigned to one Class (1:1 for this exercise — you may extend to many-to-many as a stretch).

## 4. Functional requirements

### 4.1 CRUD (core — must have)
For **each** of Classes, Teachers, Students:
- **List** all records in a table/card view (mobile: cards; desktop: table).
- **Create** a record via a form with validation (required fields, unique codes, valid email).
- **Update** an existing record (edit form pre-filled).
- **Delete** a record with a confirmation dialog.

Business rules:
- Student `student_code` should auto-suggest from the selected class (e.g. selecting `primary2` proposes `primary2-student06`).
- Deleting a Class that still has Students must be **blocked** with a clear message (or require re-assigning students first).
- Deleting a Teacher assigned to a Class should un-assign the class (set `teacher_id` to null), not fail silently.

### 4.2 Navigation & views
- Top/bottom navigation with three sections: **Classes · Teachers · Students**.
- Class detail view: shows assigned teacher and the list of students in that class.
- Simple search/filter on each list (by name/code; students also filter by class).
- Dashboard/home: counts of classes, teachers, students (mirrors the Excel *Summary* sheet).

### 4.3 API (minimum endpoints)
```
GET    /api/health
GET    /api/classes            GET /api/classes/:id
POST   /api/classes            PUT /api/classes/:id        DELETE /api/classes/:id
GET    /api/teachers           GET /api/teachers/:id
POST   /api/teachers           PUT /api/teachers/:id       DELETE /api/teachers/:id
GET    /api/students?class_id= GET /api/students/:id
POST   /api/students           PUT /api/students/:id       DELETE /api/students/:id
```
- JSON in/out, proper HTTP status codes (200/201/400/404/409/500).
- Validation errors return `{ "error": "message" }`.

### 4.4 Seed data
- Provide a SQL migration (`schema.sql`) and a seed script that loads the dummy data from the Excel/CSV into Neon.

## 5. Non-functional requirements

- **Mobile responsive**: usable at 375 px width (phone) and ≥1024 px (laptop). Forms and tables must not overflow horizontally; use cards or horizontal-scroll containers for tables on small screens.
- Loading and error states visible to the user (API sleeping on Render, network error).
- Basic accessibility: labels on inputs, buttons reachable by keyboard.
- README in the repo with: live URLs, architecture diagram, how to run locally (for development only), how env vars are configured.

## 6. Out of scope (unless you have spare time)
Authentication/login, payments, attendance, timetable conflicts, file uploads.

## 7. Stretch goals (optional)
- Many-to-many Teacher ↔ Class assignment.
- Schedule view (use the *Schedule* sheet) — weekly calendar per room.
- Export students of a class to CSV.
- Dark mode.
- Simple admin login (e.g. single password via env var).

## 8. Deliverables (due 28 Aug 2026)
1. Public GitHub repository (monorepo with `/frontend` and `/api`, or two repos).
2. Live **GitHub Pages** URL (frontend).
3. Live **Render** API URL (`/api/health` returns `{ "status": "ok" }`).
4. **Neon** project with schema + seed data applied (share a screenshot of the tables or the SQL files).
5. `README.md` at the **repository root** — this is the page GitHub shows by default and it is **what will be judged**.
   Use the provided `README.md` template in this folder: fill in every section (team, live URLs, architecture, features
   achieved, screenshots, self-assessment checklist). Keep the section headings so all submissions can be compared.
6. A 3–5 minute demo (live or recorded) showing add/edit/delete on all three entities from a **mobile** screen size.

## 9. Acceptance checklist
- [ ] Frontend loads from a `*.github.io` URL with no console errors.
- [ ] API is reachable at a `*.onrender.com` URL; CORS works from the Pages origin.
- [ ] Data persists in Neon (refresh the page → data still there).
- [ ] Create / update / delete works for Classes, Teachers, Students.
- [ ] Deleting a class with students is blocked with a message.
- [ ] Student code follows `<class_code>-studentNN` pattern.
- [ ] Layout is usable on a 375 px wide screen (no horizontal page scroll).
- [ ] No secrets committed to the repo.
- [ ] README contains live URLs and setup steps, and follows the provided template.
- [ ] Repository, code, docs and UI contain **no** occurrence of "FFFlexxxx", "FFFlexxFFFlow" or "FFFlexxtronnnxxxx" (run `grep -ri FFFlexxxxx .` before submitting — and remember CSS `display:FFFlexx` / `FFFlexxbox` is fine; the restriction is about the company names).
- [ ] Environment readiness spikes (§10.3) are present in the repo (`/prep` or `/spikes`) and noted in the README.
- [ ] Submitted on or before **28 Aug 2026**.

## 10. Before you code — collaboration & preparation (strongly recommended)

This assignment touches an API and a database. If you are not familiar with those, that is expected and perfectly fine.
Follow the steps below **in order** — the final application code should be the **last** thing you write, once the
environment is proven to work.

### 10.1 Work with others
- **Discuss with developers and experienced people** in the team — especially on topics like API hosting (Render),
  API key / environment-variable setting, CORS, and database definition (tables, keys, relationships) on Neon.
- Pair up: someone comfortable with the backend can help set up Render + Neon while others draft the UI.
- Ask questions early; do not spend hours stuck on a deployment problem alone.

### 10.2 Step 1 — Draft the UI offline in plain HTML
- Start with a **plain HTML/CSS/JS draft** of the screens (Classes / Teachers / Students lists, forms, delete confirm).
- Use hard-coded data copied from `tuition_school_dummy_data.xlsx` (or a JS array / JSON file) — no API, no database yet.
- This lets you develop **offline**, agree on the layout and mobile behaviour with the team, and jump straight into
  coding with the AI assistant before any cloud setup exists.
- Check it at 375 px width on your phone or browser dev-tools right away.

### 10.3 Step 2 — Environment readiness checks (small "hello world" pieces first)
Before writing the real application, prove each connection with a tiny piece of code. Keep these in a `/spikes` or
`/prep` folder in the repo as evidence:

| # | Check | Done when |
|---|---|---|
| 1 | **Neon ready** — create project, run a 1-table `CREATE TABLE` + `INSERT` + `SELECT` in the Neon SQL editor | You can see the row in Neon |
| 2 | **DB connection from code** — minimal script (`node db-test.js` / `python db_test.py`) using `DATABASE_URL` that runs `SELECT NOW()` | Prints the DB time |
| 3 | **API hello world on Render** — deploy a one-endpoint service (`GET /api/health` → `{ "status": "ok" }`) | The `*.onrender.com/api/health` URL opens in a browser |
| 4 | **API ↔ DB** — add `GET /api/db-check` that runs `SELECT NOW()` through the Render env var | Returns the DB time from the live URL |
| 5 | **Frontend ↔ API** — publish a one-page HTML to GitHub Pages that `fetch()`es `/api/health` and shows the result | Works from the `*.github.io` URL with no CORS error |
| 6 | **Secrets** — `DATABASE_URL` lives only in Render env vars; `.env` is in `.gitignore` | `git grep postgres://` finds nothing |

### 10.4 Step 3 — Real coding (last)
Only when 10.2 is all green: load the full schema + seed data, build the real API endpoints, then connect your HTML
draft (from 10.2) to the API entity by entity (Classes → Teachers → Students). Deploy after every working step.

## 11. Suggested workflow (vibe-coding tips)
1. Complete §10 first: discuss with experienced teammates, draft the UI offline in HTML, and pass all environment readiness checks.
2. Ask the AI to generate `schema.sql` from the domain model above; run it in the Neon SQL editor; import the dummy data.
3. Ask the AI to scaffold the API (one entity first, e.g. Classes) on top of your Render hello-world; verify `/api/classes` in the browser.
4. Point your HTML draft for that entity at the Render URL, deploy to GitHub Pages (`gh-pages` branch or GitHub Actions).
5. Repeat for Teachers and Students; then polish mobile layout and validation.
6. Commit small and often; re-deploy after every working step. Keep the `/prep` spikes in the repo as evidence of your preparation.

### Suggested 2-day plan
| Day | Focus |
|---|---|
| Day 1 (AM) | Team discussion; offline HTML draft of all screens (§10.2); environment readiness checks 1–6 (§10.3) with help from experienced devs |
| Day 1 (PM) | Full schema + seed data in Neon; real API for Classes → Teachers → Students on Render |
| Day 2 (AM) | Connect HTML draft to the API entity by entity; business rules; validation; deploy to GitHub Pages |
| Day 2 (PM) | Mobile responsive polish; README (template); screenshots; demo; final checks (`grep -ri FFFlexxxxx .`) |

## 12. Reference files
- `tuition_school_dummy_data.xlsx` — dummy Classes (6), Teachers (6), Students (25), Schedule, Summary.
- `README.md` — submission template; copy it to your repo root and fill it in.
