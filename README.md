# MuniFix Ctg

**Intelligent Citizen Complaint Reporting System for Chattogram City Corporation**

MuniFix Ctg lets citizens of Chattogram, Bangladesh report local infrastructure issues — waterlogging, broken roads, open manholes, waste mismanagement — directly from their phone or browser. Reports are automatically categorized and routed to the correct municipal department using AI, removing the manual triage bottleneck that slows down traditional complaint systems.

Built as a course project for **SD2 (Software Development 2)** at **IIUC (International Islamic University Chittagong)**.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [User Roles](#user-roles)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Branch Workflow](#branch-workflow)
- [Repositories](#repositories)

---

## Overview

Citizens submit complaints with a photo, description, and geolocation. Google's Gemini API analyzes the submission to assign a category and priority, then routes it to the responsible department. Department admins can review, override AI decisions when confidence is low, and assign field workers to resolve issues. Citizens track their complaint's status in real time, from submission to resolution.

## Features

- 📍 **Geolocation-based reporting** with map picker and address search (Leaflet + OpenStreetMap Nominatim)
- 🤖 **AI-powered categorization** — automatic category, priority, and confidence scoring via Gemini API
- 📸 **Photo evidence** — up to 6 images per complaint via Cloudinary
- 🔐 **Role-based access control** — four distinct user roles with scoped data visibility
- 📊 **Analytics dashboards** — status distribution, complaints over time, incident hotspot maps
- 🔔 **Real-time notifications** on status changes
- 📝 **Full audit trail** — every status change and admin action is logged
- 🔎 **Natural language search** across complaints

## Tech Stack

**Frontend**
- Next.js (TypeScript)
- Tailwind CSS
- Leaflet.js — maps, geolocation, hotspot pins
- Recharts — analytics charts
- Deployed on [Vercel](https://vercel.com)

**Backend**
- Node.js + Express.js
- JWT authentication + bcrypt
- Cloudinary — image storage
- Nodemailer — OTP delivery via Gmail SMTP
- Gemini API — AI categorization
- Winston + Morgan — logging
- express-rate-limit — rate limiting
- Deployed on [Railway](https://railway.app)

**Database**
- PostgreSQL on [Neon](https://neon.tech) (serverless)
- Raw SQL via `pg` (node-postgres) — no ORM
- SSL required for all connections

## User Roles

| Role | Access |
|---|---|
| **citizen** | Submits and tracks their own complaints; edits/cancels while pending |
| **field_worker** | Views and resolves complaints assigned to them |
| **dept_admin** | Manages complaints within their department; can assign workers and override AI category |
| **super_admin** | Full system access — all complaints, department CRUD, user management, activity logs |

## Database Schema

8 tables: `departments`, `users`, `complaints`, `assignments`, `status_history`, `notifications`, `otp_verifications`, `activity_logs`.

Key relationships:
- `complaints.citizen_id` → `users.id`
- `complaints.department_id` → `departments.id`
- `assignments.complaint_id` → `complaints.id` (one-to-one)
- `assignments.worker_id` → `users.id`
- `status_history` logs every status transition with `changed_by` and timestamp

## API Endpoints

**Auth:** `/api/auth/signup`, `signin`, `signout`, `verify-otp`, `forgot-password`, `refresh`

**Profile:** `GET/PUT /api/my/profile`, `PATCH /api/my/password`

**Complaints:** `POST /api/complain`, `GET /api/complain` (role-scoped automatically), `GET/PATCH/DELETE /api/complain/:id`, `PATCH /api/complain/:id/status`, `PATCH /api/complain/:id/category` (AI override), `GET /api/complain/search`, `POST /api/complain/:id/assign`

**Departments:** `GET /api/departments`, `POST/PUT/DELETE /api/departments/:id` (super_admin only)

**Users:** `GET /api/users`, `PATCH /api/admin/users/:userId/role`, `PATCH /api/admin/users/:userId/status`

**Logs:** `GET /api/logs` (super_admin only)

**Health:** `GET /health`

## Getting Started

### Prerequisites
- Node.js
- A Neon PostgreSQL database
- Gemini API key
- Cloudinary account
- Gmail account with an App Password (for SMTP)

### Backend

```bash
git clone https://github.com/meheraaj/MuniFix-Backend.git
cd MuniFix-Backend
npm install
cp .env.example .env   # fill in your values, see below
npm run dev
```

Verify it's running: `GET /health` should return `{ status: "ok" }`.

### Frontend

```bash
git clone https://github.com/tasifhossan/MuniFix.git
cd MuniFix
npm install
cp .env.local.example .env.local   # set NEXT_PUBLIC_API_URL
npm run dev
```

## Environment Variables

**Backend (`.env`)**
```
DATABASE_URL=postgresql://...neon.tech/munifix_ctg?sslmode=require
JWT_SECRET=
JWT_EXPIRES_IN=24h
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
GEMINI_API_KEY=
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=          # Gmail App Password, not your login password
PORT=3000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

**Frontend (`.env.local`)**
```
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## Deployment

**Backend → Railway**
1. Push to `main`
2. Railway → New Project → Deploy from GitHub → select `MuniFix-Backend`
3. Add all env variables in the Railway dashboard (use Neon's **pooled** connection string)
4. Verify `/health` returns OK

**Frontend → Vercel**
1. Replace any hardcoded `localhost` URLs with `process.env.NEXT_PUBLIC_API_URL`
2. `npm run build` locally — fix all errors first
3. Push to `main`, import the repo in Vercel
4. Set `NEXT_PUBLIC_API_URL` to the Railway backend URL + `/api`
5. Deploy, then update the backend's `CLIENT_URL` to the new Vercel URL

## Branch Workflow

```
feature/* → develop → main
```

- Never push directly to `main` or `develop`
- Every change goes through a Pull Request
- Merge `feature/*` branches into `develop` first
- Only merge `develop` → `main` when fully tested and ready for deployment

## Repositories

- **Frontend:** [github.com/tasifhossan/MuniFix](https://github.com/tasifhossan/MuniFix)
- **Backend:** [github.com/meheraaj/MuniFix-Backend](https://github.com/meheraaj/MuniFix-Backend)

---

*A course project for SD2 at IIUC (International Islamic University Chittagong).*