# TalentFlow Job Portal Management System

TalentFlow is a production-style full stack job portal for three roles: Admin, Recruiter, and Job Seeker. It includes JWT authentication with refresh tokens, role dashboards, job search, application tracking, recruiter pipelines, company profiles, file uploads, email notifications, analytics, Swagger API documentation, and a normalized MySQL schema.

## Tech Stack

Frontend: React, TypeScript, Tailwind CSS, shadcn-style UI primitives, Framer Motion, React Router, Axios, Chart.js.

Backend: Node.js, Express, MySQL, JWT, BCrypt, Multer, Nodemailer, Helmet, rate limiting, validation, Swagger.

## Folder Structure

```text
backend/
  src/config        Environment and MySQL pool
  src/controllers   MVC route handlers
  src/middleware    Auth, validation, upload, errors
  src/routes        REST API routes
  src/services      Email and AI-assisted matching
  src/database      MySQL schema and seed script
frontend/
  src/components    Reusable UI, layout, dashboard widgets
  src/contexts      Auth and theme state
  src/pages         Auth, admin, recruiter, candidate screens
docs/               API docs and ER diagram
```

## Installation

```bash
npm install
cp backend/.env.example backend/.env
```

Create a MySQL database user and update `backend/.env`, then seed:

```bash
npm run seed --workspace backend
npm run dev
```

Frontend: `http://localhost:5173`

Backend: `http://localhost:5000`

Swagger: `http://localhost:5000/api/docs`

## Seed Users

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@talentflow.dev` | `Password123!` |
| Recruiter | `recruiter@talentflow.dev` | `Password123!` |
| Candidate | `candidate@talentflow.dev` | `Password123!` |

## Features

- Registration, login, logout, forgot/reset password, JWT auth, protected routes, role authorization
- Admin metrics, monthly graph, users, recruiter approval, categories, skills, companies, reports, CSV and PDF export
- Recruiter company profile, logo upload, job CRUD, application pipeline, shortlist/reject stages, interviews, analytics
- Candidate profile, resume upload, application tracking, bookmarks, recommendations, interview schedule support
- Advanced job search by keyword and location, with backend filters for type, remote mode, and skills
- Resume and job matching service for ATS score, skill extraction-style matching, and recommendations
- Messaging and notification APIs with read receipts
- Security middleware: Helmet, CORS, rate limiting, validation, XSS cleanup, secure environment configuration
- Deployment configs for Vercel frontend and Render backend

## Documentation

- [API Documentation](docs/API.md)
- [ER Diagram](docs/ER_DIAGRAM.md)
- Database schema: `backend/src/database/schema.sql`
- Swagger spec: `backend/src/swagger.js`

## Deployment Guide

1. Deploy MySQL on your preferred provider.
2. Deploy `backend` to Render using `backend/render.yaml`.
3. Set all backend environment variables in Render.
4. Deploy `frontend` to Vercel.
5. Set `VITE_API_URL` to your Render API URL plus `/api`.
6. Run the seed command once against production only if demo data is desired.

## Future Improvements

- Replace polling-style chat with Socket.IO for live typing indicators and online presence.
- Replace the lightweight PDF exporter with branded multi-page report templates.
- Add integration tests with Supertest and frontend tests with Playwright.
- Add object storage for uploads when deploying beyond local demos.
