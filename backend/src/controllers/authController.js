import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { query } from "../config/db.js";
import { env } from "../config/env.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { signAccessToken, signRefreshToken } from "../utils/tokens.js";
import { sendPasswordResetEmail, sendRegistrationEmail } from "../services/emailService.js";

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role = "candidate" } = req.body;
  const existing = await query("SELECT id FROM users WHERE email = :email", { email });
  if (existing.length) throw new ApiError(409, "Email already exists");

  const passwordHash = await bcrypt.hash(password, 12);
  const status = role === "recruiter" ? "pending" : "active";
  const result = await query(
    "INSERT INTO users (name, email, password_hash, role, status) VALUES (:name, :email, :passwordHash, :role, :status)",
    { name, email, passwordHash, role, status }
  );
  const user = { id: result.insertId, name, email, role, status, token_version: 0 };
  if (role === "candidate") {
    await query("INSERT INTO candidates (user_id, headline) VALUES (:userId, :headline)", {
      userId: user.id,
      headline: "Open to opportunities"
    });
  }
  if (role === "recruiter") {
    await query("INSERT INTO recruiters (user_id, approval_status) VALUES (:userId, 'pending')", { userId: user.id });
  }
  await sendRegistrationEmail(user);
  res.status(201).json({ success: true, user, accessToken: signAccessToken(user), refreshToken: signRefreshToken(user) });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const users = await query("SELECT * FROM users WHERE email = :email LIMIT 1", { email });
  if (!users.length) throw new ApiError(401, "Invalid credentials");
  const user = users[0];
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) throw new ApiError(401, "Invalid credentials");
  if (user.status === "suspended") throw new ApiError(403, "Account suspended");
  res.json({ success: true, user: sanitize(user), accessToken: signAccessToken(user), refreshToken: signRefreshToken(user) });
});

export const refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) throw new ApiError(400, "Refresh token required");
  const payload = jwt.verify(refreshToken, env.jwt.refreshSecret);
  const users = await query("SELECT * FROM users WHERE id = :id LIMIT 1", { id: payload.sub });
  if (!users.length || users[0].token_version !== payload.tokenVersion) throw new ApiError(401, "Invalid refresh token");
  res.json({ success: true, accessToken: signAccessToken(users[0]), refreshToken: signRefreshToken(users[0]) });
});

export const logout = asyncHandler(async (req, res) => {
  await query("UPDATE users SET token_version = token_version + 1 WHERE id = :id", { id: req.user.id });
  res.json({ success: true, message: "Logged out" });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const users = await query("SELECT id, name, email FROM users WHERE email = :email", { email });
  if (users.length) {
    const token = crypto.randomBytes(24).toString("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 30);
    await query("UPDATE users SET reset_token = :token, reset_token_expires_at = :expires WHERE id = :id", {
      token,
      expires,
      id: users[0].id
    });
    await sendPasswordResetEmail(users[0], token);
  }
  res.json({ success: true, message: "If the account exists, reset instructions were sent." });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;
  const users = await query(
    "SELECT id FROM users WHERE reset_token = :token AND reset_token_expires_at > NOW() LIMIT 1",
    { token }
  );
  if (!users.length) throw new ApiError(400, "Invalid or expired reset token");
  const passwordHash = await bcrypt.hash(password, 12);
  await query(
    "UPDATE users SET password_hash = :passwordHash, reset_token = NULL, reset_token_expires_at = NULL, token_version = token_version + 1 WHERE id = :id",
    { passwordHash, id: users[0].id }
  );
  res.json({ success: true, message: "Password reset successful" });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user });
});

function sanitize(user) {
  const { password_hash, reset_token, ...safe } = user;
  return safe;
}
