import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { query } from "../config/db.js";
import { ApiError } from "../utils/apiError.js";

export async function authenticate(req, _res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) throw new ApiError(401, "Authentication required");

    const payload = jwt.verify(token, env.jwt.accessSecret);
    const users = await query(
      "SELECT id, name, email, role, status, token_version FROM users WHERE id = :id LIMIT 1",
      { id: payload.sub }
    );
    if (!users.length || users[0].status === "suspended") throw new ApiError(401, "Invalid account");
    req.user = users[0];
    next();
  } catch (error) {
    next(error.statusCode ? error : new ApiError(401, "Invalid or expired token"));
  }
}

export function authorize(...roles) {
  return (req, _res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ApiError(403, "You do not have permission to perform this action"));
    }
    next();
  };
}
