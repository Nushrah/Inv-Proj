import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

type AccessTokenPayload = jwt.JwtPayload & { userId?: string; email?: string };

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = header.slice("Bearer ".length).trim();
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret) as AccessTokenPayload;
    if (!decoded.userId || !decoded.email) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.auth = { userId: decoded.userId, email: decoded.email };
    next();
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }
}
