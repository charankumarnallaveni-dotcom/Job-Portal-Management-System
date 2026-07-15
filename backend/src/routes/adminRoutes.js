import { Router } from "express";
import { body } from "express-validator";
import { authenticate, authorize } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import {
  approveRecruiter,
  crudCreate,
  crudList,
  dashboard,
  deleteUser,
  exportCsv,
  exportPdf,
  listUsers,
  reports,
  updateUserStatus
} from "../controllers/adminController.js";

export const adminRoutes = Router();
adminRoutes.use(authenticate, authorize("admin"));

adminRoutes.get("/dashboard", dashboard);
adminRoutes.get("/users", listUsers);
adminRoutes.patch("/users/:id/status", [body("status").isIn(["active", "pending", "suspended", "rejected"]), validate], updateUserStatus);
adminRoutes.delete("/users/:id", deleteUser);
adminRoutes.patch("/recruiters/:id/review", [body("status").isIn(["approved", "rejected"]), validate], approveRecruiter);
adminRoutes.get("/categories", crudList("categories"));
adminRoutes.post("/categories", [body("name").notEmpty(), validate], crudCreate("categories"));
adminRoutes.get("/skills", crudList("skills"));
adminRoutes.post("/skills", [body("name").notEmpty(), validate], crudCreate("skills"));
adminRoutes.get("/companies", crudList("companies"));
adminRoutes.get("/reports", reports);
adminRoutes.get("/reports/jobs.csv", exportCsv);
adminRoutes.get("/reports/summary.pdf", exportPdf);
