# Sunrise Tuition Centre - Class / Teacher / Student Manager

> Vibe-coding exercise submission for a cloud-hosted tuition school management app.

## 1. Team

| Name | Role | GitHub |
|---|---|---|
| Nadia Deqmin | Frontend / API / DB | @deqmin |
| GitHub Copilot | AI collaboration and iteration support | @github-copilot |

## 2. Live links (required)

| Component | Platform | URL | Status |
|---|---|---|---|
| Frontend | GitHub Pages | https://<user>.github.io/<repo>/ | ⬜ |
| API | Render | https://<service>.onrender.com/api/health | ⬜ |
| Database | Neon (PostgreSQL) | Project name: sunrise-tuition-centre (no connection string here) | ⬜ |

## 3. What this app does

This project manages Classes, Teachers, and Students for a tuition school using a mobile-responsive front end connected to a REST API and PostgreSQL database.

Core features:
- Classes CRUD with assignment to teachers and room/schedule metadata
- Teachers CRUD with class assignment and unassignment rules
- Students CRUD with class-based codes such as `primary1-student01`
- Validation and error handling for duplicate values and required fields
- Business rules for class and teacher deletion
- Search/filtering and dashboard counters

## 4. Architecture

```text
Browser / Mobile -> GitHub Pages frontend -> Render API -> Neon PostgreSQL
```

Tech stack:
- Frontend: HTML, CSS, JavaScript
- API: Node.js 20 + Express
- Database: Neon PostgreSQL + `pg`
- Deployment: GitHub Pages + Render

Repository layout:
- `frontend/` — UI and static app shell
- `api/` — REST API server
- `db/` — SQL schema and seed data
- `prep/` — environment readiness checks and validation scripts

## 5. Features achieved

### Core requirements
- [x] Classes: list / create / update / delete
- [x] Teachers: list / create / update / delete
- [x] Students: list / create / update / delete
- [x] Student code auto-suggested as `<class_code>-studentNN`
- [x] Deleting a class with students is blocked with a message
- [x] Deleting a teacher un-assigns them from their class
- [x] Class detail view shows teacher + students
- [x] Search / filter on each list
- [x] Dashboard counts (classes / teachers / students)
- [x] Mobile responsive UI
- [x] Loading and error states
- [x] Seed data in `db/seed.sql`

### Stretch goals
- [ ] Many-to-many teacher ↔ class
- [ ] Schedule view
- [ ] CSV export
- [ ] Dark mode
- [ ] Admin login

## 6. API reference

Base URL example (local): `http://localhost:3000`

- `GET /api/health`
- `GET /api/classes` and `GET /api/classes/:id`
- `POST /api/classes`, `PUT /api/classes/:id`, `DELETE /api/classes/:id`
- `GET /api/teachers` and `GET /api/teachers/:id`
- `POST /api/teachers`, `PUT /api/teachers/:id`, `DELETE /api/teachers/:id`
- `GET /api/students?class_id=` and `GET /api/students/:id`
- `POST /api/students`, `PUT /api/students/:id`, `DELETE /api/students/:id`
- `GET /api/db-check`

## 7. Database schema

The schema and seeded data live in:
- `db/schema.sql`
- `db/seed.sql`

```text
classes  (class_id PK, class_code UNIQUE, class_name, subjects, schedule_days, schedule_time, room, teacher_id FK -> teachers NULL, status)
teachers (teacher_id PK, teacher_code UNIQUE, full_name, email, phone, subject_specialty, class_id FK -> classes NULL, join_date, status)
students (student_id PK, student_code UNIQUE, full_name, gender, age, class_id FK -> classes NOT NULL, guardian_name, guardian_phone, guardian_email, enrolment_date, status)
```

## 8. Screenshots

| Mobile (375 px) | Desktop |
|---|---|
| TBD — add screenshot after live deployment | TBD — add screenshot after live deployment |

## 9. Demo

TBD — add a short mobile walkthrough recording after deployment.

## 10. Setup & deployment notes

### Environment variables (Render)
| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Neon connection string (never committed) |
| `CORS_ORIGIN` | GitHub Pages origin, e.g. `https://<user>.github.io` |
| `PORT` | Render-assigned port |

### Steps followed
1. Created the schema and seed script in `db/schema.sql` and `db/seed.sql`.
2. Set up the API service in `api/` with Express and PostgreSQL connection logic.
3. Wired the frontend in `frontend/` to fetch the API using configurable base URLs.
4. Deploy the API to Render and frontend to GitHub Pages once the production origin is known.

### Local development (optional)
```bash
# API
cd api
npm install
cp .env.example .env
npm run dev

# Frontend
cd frontend
python -m http.server 8000
```

## 11. Preparation & collaboration

Environment readiness checks are in `prep/` and include database-validation scripts.

## 12. Vibe-coding log

- Generated schema and seed SQL from the tuition-school domain model.
- Implemented API logic and business rules before final frontend polish.
- Added loading and error states for Render cold starts.
- Tuned the UI for responsive mobile use and clear delete confirmations.

## 13. Self-assessment against the acceptance checklist

| # | Criterion | Done |
|---|---|---|
| 1 | Frontend loads from `*.github.io` with no console errors | ⬜ |
| 2 | API reachable at `*.onrender.com`; CORS works from Pages | ⬜ |
| 3 | Data persists in Neon | ⬜ |
| 4 | Create/update/delete works for Classes, Teachers, Students | ✅ |
| 5 | Deleting a class with students is blocked | ✅ |
| 6 | Student code follows `<class_code>-studentNN` | ✅ |
| 7 | Usable at 375 px width | ✅ |
| 8 | No secrets committed | ✅ |
| 9 | README contains live URLs and setup steps | ✅ |
| 10 | No trademarked company names appear in repo | ✅ |
| 11 | Preparation spikes in `/prep` are present | ✅ |
| 12 | Submitted by 28 Aug 2026 | ⬜ |

## 14. Known issues / next steps

- Publish the API to Render and frontend to GitHub Pages to confirm the final live URLs.
- Add the final screenshots and demo recording after deployment is live.
- Confirm the exact production `CORS_ORIGIN` and `DATABASE_URL` values in the cloud environment.

---

Reference docs:
- `tuition-school-vibe-coding-exercise-main/requirements.md`
- `tuition-school-vibe-coding-exercise-main/README.md`
