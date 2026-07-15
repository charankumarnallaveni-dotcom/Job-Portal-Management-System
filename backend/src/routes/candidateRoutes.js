import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.js";
import { uploadResume } from "../middleware/upload.js";
import {
  applications,
  applyJob,
  bookmarkJob,
  profile,
  recommendations,
  updateProfile,
  uploadResumeFile,
  withdrawApplication
} from "../controllers/candidateController.js";

export const candidateRoutes = Router();
candidateRoutes.use(authenticate, authorize("candidate"));

candidateRoutes.get("/profile", profile);
candidateRoutes.put("/profile", updateProfile);
candidateRoutes.post("/resume", uploadResume.single("resume"), uploadResumeFile);
candidateRoutes.post("/jobs/:jobId/apply", applyJob);
candidateRoutes.post("/jobs/:jobId/bookmark", bookmarkJob);
candidateRoutes.get("/applications", applications);
candidateRoutes.patch("/applications/:id/withdraw", withdrawApplication);
candidateRoutes.get("/recommendations", recommendations);
