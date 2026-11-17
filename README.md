# CampusFind — Startup Guide

## Quick Start

### 1. Start the Backend

```powershell
cd campusfind/backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Then seed the database (first time only):
```powershell
python seed.py
```

### 2. Start the Frontend

```powershell
cd campusfind/frontend
npm run dev
```

### 3. Open in Browser

- **App**: http://localhost:5173
- **API Docs**: http://localhost:8000/api/docs

---

## Default Login Credentials

| Role    | Email                  | Password      |
|---------|------------------------|---------------|
| Student | aryan@college.edu      | Password123!  |
| Admin   | admin@college.edu      | Password123!  |

---

## Environment Variables

Edit `campusfind/backend/.env` to configure:

- `ALLOWED_EMAIL_DOMAIN` — change from `college.edu` to your institution's domain
- `DATABASE_URL` — swap SQLite for PostgreSQL in production
- `SECRET_KEY` — change to a secure random string in production

---

## Project Structure

```
campusfind/
├── backend/          ← FastAPI Python backend
│   ├── app/
│   │   ├── api/      ← Route handlers
│   │   ├── models/   ← SQLAlchemy models
│   │   ├── schemas/  ← Pydantic schemas
│   │   ├── services/ ← Business logic
│   │   ├── matching/ ← Smart matching engine
│   │   ├── auth/     ← JWT & password hashing
│   │   └── database/ ← SQLAlchemy setup
│   └── seed.py       ← Dev seed data
│
└── frontend/         ← React + TypeScript + Tailwind
    └── src/
        ├── api/       ← Axios API client
        ├── components/ ← Reusable components
        ├── pages/     ← Route pages
        ├── store/     ← Zustand state
        ├── hooks/     ← Custom hooks
        └── types/     ← TypeScript types
```
