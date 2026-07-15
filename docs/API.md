# API Documentation

Base URL: `http://localhost:5000/api`

Swagger UI is available at `/api/docs`.

## Authentication

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/auth/register` | Register admin, recruiter, or candidate |
| POST | `/auth/login` | Login and receive access/refresh tokens |
| POST | `/auth/refresh` | Rotate tokens |
| POST | `/auth/logout` | Invalidate refresh token version |
| POST | `/auth/forgot-password` | Send password reset email |
| POST | `/auth/reset-password` | Reset password |
| GET | `/auth/me` | Current user |

## Admin

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/admin/dashboard` | SaaS metrics, graph data, activities, notifications |
| GET | `/admin/users` | Manage users |
| PATCH | `/admin/users/:id/status` | Suspend or reactivate users |
| DELETE | `/admin/users/:id` | Delete account |
| PATCH | `/admin/recruiters/:id/review` | Approve or reject recruiter |
| GET/POST | `/admin/categories` | Manage categories |
| GET/POST | `/admin/skills` | Manage skills |
| GET | `/admin/companies` | Manage companies |
| GET | `/admin/reports/jobs.csv` | Export report CSV |
| GET | `/admin/reports/summary.pdf` | Export summary PDF |

## Recruiter

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/recruiter/companies` | Create company profile with logo upload |
| POST | `/jobs` | Create job |
| PUT/PATCH/DELETE | `/jobs/:id` | Edit, close, or delete jobs |
| GET | `/recruiter/applications` | View applications |
| PATCH | `/recruiter/applications/:id/stage` | Move candidate through pipeline |
| POST | `/recruiter/applications/:applicationId/interviews` | Schedule interview and send email |
| GET | `/recruiter/analytics` | Funnel and job analytics |

## Candidate

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET/PUT | `/candidate/profile` | Manage candidate profile |
| POST | `/candidate/resume` | Upload PDF, DOC, or DOCX resume |
| POST | `/candidate/jobs/:jobId/apply` | Apply for a job |
| PATCH | `/candidate/applications/:id/withdraw` | Withdraw application |
| GET | `/candidate/applications` | Track applications |
| POST | `/candidate/jobs/:jobId/bookmark` | Bookmark job |
| GET | `/candidate/recommendations` | AI-assisted recommendations |

## Communication

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET/POST | `/communication/messages/:peerId` | Chat with read receipts |
| GET | `/communication/notifications` | Notification center |
| PATCH | `/communication/notifications/:id/read` | Mark notification read |
