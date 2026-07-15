import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { markNotificationRead, messages, notifications, sendMessage } from "../controllers/communicationController.js";

export const communicationRoutes = Router();
communicationRoutes.use(authenticate);

communicationRoutes.get("/messages/:peerId", messages);
communicationRoutes.post("/messages/:peerId", sendMessage);
communicationRoutes.get("/notifications", notifications);
communicationRoutes.patch("/notifications/:id/read", markNotificationRead);
