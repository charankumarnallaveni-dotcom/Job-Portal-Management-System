export const swaggerSpec = {
  openapi: "3.0.3",
  info: {
    title: "TalentFlow Job Portal API",
    version: "1.0.0",
    description: "REST API for admin, recruiter, and candidate workflows."
  },
  servers: [{ url: "http://localhost:5000/api" }],
  components: {
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" }
    }
  },
  paths: {
    "/auth/register": { post: { summary: "Register admin, recruiter, or candidate" } },
    "/auth/login": { post: { summary: "Login and receive access and refresh tokens" } },
    "/auth/refresh": { post: { summary: "Rotate refresh token and access token" } },
    "/auth/forgot-password": { post: { summary: "Send password reset email" } },
    "/auth/reset-password": { post: { summary: "Reset password using token" } },
    "/admin/dashboard": { get: { summary: "Admin dashboard metrics", security: [{ bearerAuth: [] }] } },
    "/admin/users": { get: { summary: "List users", security: [{ bearerAuth: [] }] } },
    "/jobs": {
      get: { summary: "Search jobs with filters" },
      post: { summary: "Create job", security: [{ bearerAuth: [] }] }
    },
    "/candidate/profile": { get: { summary: "Candidate profile", security: [{ bearerAuth: [] }] } },
    "/candidate/jobs/{jobId}/apply": { post: { summary: "Apply to a job", security: [{ bearerAuth: [] }] } },
    "/recruiter/applications": { get: { summary: "Recruiter application pipeline", security: [{ bearerAuth: [] }] } },
    "/communication/messages/{peerId}": { get: { summary: "Chat history", security: [{ bearerAuth: [] }] } }
  }
};
