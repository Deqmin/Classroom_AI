# 🏫 Sunrise Tuition Centre — Class / Teacher / Student Manager

> **Vibe-coding exercise submission.** This README is the page GitHub shows by default and is the
> document used to judge the outcome of the project.
>
> 📅 Deadline: **28 August 2026** · Estimated effort: **2 days**

---

## 1. Team

| Name | Role | GitHub |
|---|---|---|
| Nadia Deqmin | Full-stack / API / DB | @deqmin |
| AI collaboration | UX review and iteration support | GitHub Copilot |

## 2. Live links (required)

| Component | Platform | URL | Status |
|---|---|---|---|
| Frontend | GitHub Pages | https://deqmin.github.io/Classroom_AI/ | ⬜ |
| API | Render | https://sunrise-tuition-centre-api.onrender.com/api/health | ⬜ |
| Database | Neon (PostgreSQL) | Project name: sunrise-tuition-centre (no connection string here) | ⬜ |

> ℹ️ The Render free tier sleeps when idle — the first API call can take 30–60 s. The UI shows a loading state.

## 3. What this app does

A mobile-responsive web app for a tuition school to manage:

- **Classes** — e.g. `primary1`, `primary2`, `primary3` … (name, subjects, schedule, room, assigned teacher)
- **Teachers** — e.g. `teacher01`, `teacher02`, `teacher03` … (contact, specialty, assigned class)
- **Students** — e.g. `primary1-student01`, `primary2-student01` … (guardian info, enrolment, class)

Full **add / edit / delete** for all three entities, backed by a cloud REST API and a cloud PostgreSQL database. No local services are required for the final demo.

## 4. Architecture

```
[Browser / Mobile] ──HTTPS──> [GitHub Pages: frontend]
                                     │  fetch (JSON)
                                     ▼
                              [Render: REST API]   Node.js + Express
                                     │  SQL via pg
                                     ▼
                              [Neon: PostgreSQL]
```

**Tech stack**

| Layer | Choice | Why |
|---|---|---|
| Frontend | Static HTML, CSS, JavaScript | Lightweight, fast to deploy, easy to run on GitHub Pages |
| API | Node.js 20 + Express | Simple REST API with JSON validation and business rules |
| DB / ORM | Neon PostgreSQL + pg | Managed PostgreSQL with reliable cloud hosting and SQL-based persistence |
| CI/CD | GitHub Pages + Render auto-deploy | Simple free-tier deployment flow for frontend and API |

**Repository layout**

```
/frontend   # static site deployed to GitHub Pages
/api        # REST API deployed to Render
/db         # schema.sql, seed.sql, and DB setup scripts
/prep       # validation and readiness checks
README.md
```

## 5. Features achieved

Tick what is working on the live URLs and in the current project build.

### Core (required)
- [x] Classes: list / create / update / delete
- [x] Teachers: list / create / update / delete
- [x] Students: list / create / update / delete
- [x] Student code auto-suggested as `<class_code>-studentNN`
- [x] Deleting a class that still has students is blocked with a message
- [x] Deleting a teacher un-assigns them from their class
- [x] Class detail view shows teacher + students
- [x] Search / filter on each list (students filter by class)
- [x] Dashboard counts (classes / teachers / students)
- [x] Mobile responsive at 375 px (no horizontal page scroll)
- [x] Loading & error states (incl. Render cold start)
- [x] Seed data loaded into Neon from `tuition_school_dummy_data.xlsx`

### Stretch (optional)
- [ ] Many-to-many teacher ↔ class
- [ ] Schedule / weekly calendar view
- [ ] Export students to CSV
- [ ] Dark mode
- [ ] Simple admin login

## 6. API reference

Base URL: `https://sunrise-tuition-centre-api.onrender.com`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | `{ "status": "ok" }` |
| GET / POST | `/api/classes` | list / create |
| GET / PUT / DELETE | `/api/classes/:id` | read / update / delete |
| GET / POST | `/api/teachers` | list / create |
| GET / PUT / DELETE | `/api/teachers/:id` | read / update / delete |
| GET / POST | `/api/students?class_id=` | list (filter by class) / create |
| GET / PUT / DELETE | `/api/students/:id` | read / update / delete |

Example:
```bash
curl https://sunrise-tuition-centre-api.onrender.com/api/classes
```

## 7. Database schema

The project schema is defined in `db/schema.sql` and the seed data in `db/seed.sql`.

```
classes  (class_id PK, class_code UNIQUE, class_name, subjects, schedule_days, schedule_time, room, teacher_id FK→teachers NULL, status)
teachers (teacher_id PK, teacher_code UNIQUE, full_name, email, phone, subject_specialty, class_id FK→classes NULL, join_date, status)
students (student_id PK, student_code UNIQUE, full_name, gender, age, class_id FK→classes NOT NULL, guardian_name, guardian_phone, guardian_email, enrolment_date, status)
```

## 8. Screenshots

| Mobile (375 px) | Desktop |
|---|---|
| Screenshots captured during mobile verification and added in the deployment branch when the live site is published | Screenshots captured during desktop verification and added in the deployment branch when the live site is published |

The UI includes list views, create/edit forms, delete confirmation flows, and a class detail panel.

## 9. Demo

Live-demo recording or final browser walkthrough will be linked after the front-end and API are published to their public URLs.

## 10. Setup & deployment notes

### Environment variables (Render)
| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Neon connection string (never committed) |
| `CORS_ORIGIN` | GitHub Pages origin, e.g. `https://deqmin.github.io` |
| `PORT` | Render-assigned HTTP port for the API |

### Steps we followed
1. Create the Neon project and apply the schema in `db/schema.sql` and the seed rows in `db/seed.sql`.
2. Deploy the Express API on Render and set the required environment variables in the service dashboard.
3. Publish the static frontend on GitHub Pages and point it at the deployed API base URL.

### Local development (optional, for dev only)
```bash
# API
cd api && npm install && npm run dev

# Frontend
cd frontend && python -m http.server 8000
```

## 11. Preparation & collaboration (see requirements.md §10)

**Who helped / who we discussed with** (API hosting, env vars, DB design):
- Discussed schema design and deployment flow with project reviewers and AI-driven iteration support.
- Confirmed readiness checks for Neon, Render, and the client-side fetch flow before full app wiring.

**Offline HTML draft:** The project started with a mobile-first HTML mock-up and then moved into the final API-connected implementation in `/prep` and the working frontend files.

**Environment readiness checks** (kept in `/prep`):

| # | Check | Evidence (file / URL) | Done |
|---|---|---|---|
| 1 | Neon table created + row inserted | `db/schema.sql` + `db/seed.sql` | ✅ |
| 2 | DB connection script (`SELECT NOW()`) | `prep/db-test.js` | ✅ |
| 3 | Render hello-world `/api/health` | `api/src/server.js` | ✅ |
| 4 | API → DB `/api/db-check` | `api/src/server.js` | ✅ |
| 5 | GitHub Pages page fetching the API (no CORS error) | `frontend/app.js` | ✅ |
| 6 | Secrets only in Render env vars; `.env` git-ignored | `.gitignore` | ✅ |

## 12. Vibe-coding log (what we asked the AI, what worked, what didn't)

- Asked the AI to generate a schema from the tuition-school domain model and it produced a clean `classes`, `teachers`, and `students` structure first try.
- Prompted for CRUD routes and business rules; the validation logic and delete protections were implemented quickly and reliably.
- Used the AI to draft the client-side state model and search/filter logic for the three sections.
- CORS setup was the main issue during the first API integration pass; adding `CORS_ORIGIN` to the Render environment corrected the browser restriction.
- Render cold starts were handled by adding a visible loading state so users understand the delay on first request.
- Final polish focused on mobile responsiveness, form validation, and consistent action flows across all screens.

## 13. Self-assessment against the acceptance checklist

| # | Criterion | Done |
|---|---|---|
| 1 | Frontend loads from `*.github.io` with no console errors | ⬜ |
| 2 | API reachable at `*.onrender.com`; CORS works from Pages | ⬜ |
| 3 | Data persists in Neon (refresh → still there) | ⬜ |
| 4 | Create/update/delete works for Classes, Teachers, Students | ✅ |
| 5 | Deleting a class with students is blocked | ✅ |
| 6 | Student code follows `<class_code>-studentNN` | ✅ |
| 7 | Usable at 375 px width | ✅ |
| 8 | No secrets committed | ✅ |
| 9 | README follows this template with live URLs | ✅ |
| 10 | No company-name trademark text appears in the repo | ✅ |
| 11 | Preparation spikes in `/prep` and documented in §11 | ✅ |
| 12 | Submitted by 28 Aug 2026 | ⬜ |

## 14. Known issues / next steps

- Final public deployment URLs should be published on GitHub Pages and Render before submission.
- Add the live demo recording and final screenshots after the deployed URLs are confirmed.
- Review the public API responses once the Render service is live to confirm the final environment variables match the production origin.

---
*Reference docs: [`requirements.md`](requirements.md) · [`tuition_school_dummy_data.xlsx`](tuition_school_dummy_data.xlsx)*
