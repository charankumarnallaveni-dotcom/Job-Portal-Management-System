import { Router } from "express";
import { adminRoutes } from "./adminRoutes.js";
import { authRoutes } from "./authRoutes.js";
import { candidateRoutes } from "./candidateRoutes.js";
import { communicationRoutes } from "./communicationRoutes.js";
import { jobRoutes } from "./jobRoutes.js";
import { recruiterRoutes } from "./recruiterRoutes.js";

export const apiRoutes = Router();

apiRoutes.use("/auth", authRoutes);
apiRoutes.use("/admin", adminRoutes);
apiRoutes.use("/jobs", jobRoutes);
apiRoutes.use("/candidate", candidateRoutes);
apiRoutes.use("/recruiter", recruiterRoutes);
apiRoutes.use("/communication", communicationRoutes);
