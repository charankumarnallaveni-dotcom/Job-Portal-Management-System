import { Router } from "express";
import { body } from "express-validator";
import { authenticate, authorize } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { closeJob, createJob, deleteJob, getJob, listJobs, updateJob } from "../controllers/jobController.js";

export const jobRoutes = Router();

jobRoutes.get("/", listJobs);
jobRoutes.get("/:id", getJob);
jobRoutes.post("/", authenticate, authorize("recruiter"), [
  body("title").notEmpty(),
  body("description").notEmpty(),
  body("companyId").isInt(),
  validate
], createJob);
jobRoutes.put("/:id", authenticate, authorize("recruiter"), updateJob);
jobRoutes.patch("/:id/close", authenticate, authorize("recruiter"), closeJob);
jobRoutes.delete("/:id", authenticate, authorize("recruiter"), deleteJob);
