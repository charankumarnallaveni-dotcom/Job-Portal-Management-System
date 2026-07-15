import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export function signAccessToken(user) {
  return jwt.sign({ sub: user.id, role: user.role, email: user.email }, env.jwt.accessSecret, {
    expiresIn: env.jwt.accessExpiresIn
  });
}

export function signRefreshToken(user) {
  return jwt.sign({ sub: user.id, tokenVersion: user.token_version || 0 }, env.jwt.refreshSecret, {
    expiresIn: env.jwt.refreshExpiresIn
  });
}
