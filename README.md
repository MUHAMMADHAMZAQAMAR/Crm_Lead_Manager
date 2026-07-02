# Ledger — Mini CRM Lead Manager

A small full-stack lead management app built with MongoDB, Express, React, and Node (MERN).

## What's inside

```
mern-crm/
├── backend/     Express API — auth (JWT) + leads CRUD
└── frontend/    React (Vite) + Tailwind — login, dashboard, lead table
```

## Backend setup

```bash
cd backend
npm install
cp .env.example .env     # then fill in JWT_SECRET
npm run dev               # starts on http://localhost:5000
```

The backend now runs in local store mode only. Data is saved in the
JSON store at `backend/data/local-db.json`, so the app works without any
MongoDB setup.

### API endpoints

| Method | Route                     | Auth | Description                         |
|--------|---------------------------|------|--------------------------------------|
| POST   | `/api/auth/register`      | —    | Create an account, returns a token   |
| POST   | `/api/auth/login`         | —    | Log in, returns a token              |
| GET    | `/api/auth/me`            | ✓    | Return the logged-in user            |
| GET    | `/api/leads`              | ✓    | List leads (paginated, filterable)   |
| POST   | `/api/leads`               | ✓    | Create a lead                        |
| PATCH  | `/api/leads/:id/status`   | ✓    | Update a lead's status               |
| DELETE | `/api/leads/:id`          | ✓    | Delete a lead                        |
| GET    | `/api/leads/analytics`    | ✓    | Lead counts by status                |

`GET /api/leads` accepts query params: `page`, `limit`, `status` (`new` / `contacted` / `converted` / `all`), and `search` (matches name, email, or phone).

## Frontend setup

```bash
cd frontend
npm install
npm run dev                # starts on http://localhost:5173
```

The Vite dev server proxies `/api/*` requests to `http://localhost:5000`, so make sure the backend is running first.

## How it works, at a glance

- **Auth**: passwords are hashed with bcrypt before being saved; login returns a JWT that the frontend stores in `localStorage` and attaches to every request via an axios interceptor.
- **Protected routes**: an Express middleware (`protect`) checks the JWT on every `/api/leads/*` request; a React component (`ProtectedRoute`) redirects to `/login` if there's no logged-in user.
- **Leads are scoped per user** — every query filters by `createdBy`, so one person can't see or edit another's leads.
- **Search + filter** happen server-side (MongoDB query), not by filtering an already-loaded list client-side — this keeps it correct even with pagination.

## Notes

This was built as a technical assignment, so a few things are intentionally kept simple rather than production-hardened: no refresh-token rotation, no rate limiting, no automated tests. Happy to talk through how I'd extend it for production in the technical discussion.
