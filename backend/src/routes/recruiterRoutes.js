import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.js";
import { uploadLogo } from "../middleware/upload.js";
import { analytics, createCompany, moveApplication, myApplications, scheduleInterview } from "../controllers/recruiterController.js";

export const recruiterRoutes = Router();
recruiterRoutes.use(authenticate, authorize("recruiter"));

recruiterRoutes.post("/companies", uploadLogo.single("logo"), createCompany);
recruiterRoutes.get("/applications", myApplications);
recruiterRoutes.patch("/applications/:id/stage", moveApplication);
recruiterRoutes.post("/applications/:applicationId/interviews", scheduleInterview);
recruiterRoutes.get("/analytics", analytics);
