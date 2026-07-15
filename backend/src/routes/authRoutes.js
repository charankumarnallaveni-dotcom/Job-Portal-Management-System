import { Router } from "express";
import { body } from "express-validator";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { forgotPassword, login, logout, me, refresh, register, resetPassword } from "../controllers/authController.js";

export const authRoutes = Router();

authRoutes.post("/register", [
  body("name").trim().isLength({ min: 2 }),
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 8 }),
  body("role").optional().isIn(["admin", "recruiter", "candidate"]),
  validate
], register);

authRoutes.post("/login", [body("email").isEmail(), body("password").notEmpty(), validate], login);
authRoutes.post("/refresh", refresh);
authRoutes.post("/forgot-password", [body("email").isEmail(), validate], forgotPassword);
authRoutes.post("/reset-password", [body("token").notEmpty(), body("password").isLength({ min: 8 }), validate], resetPassword);
authRoutes.post("/logout", authenticate, logout);
authRoutes.get("/me", authenticate, me);
