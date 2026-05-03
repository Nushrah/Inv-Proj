import { Prisma } from "@prisma/client";
import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { env } from "../config/env.js";
import { prisma } from "../lib/prisma.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { HttpError } from "../middleware/error.middleware.js";

const router = Router();

const registerSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  password: z.string().min(6).max(128),
});

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

router.post("/register", async (req, res, next) => {
  try {
    const body = registerSchema.parse(req.body);
    const email = normalizeEmail(body.email);
    const passwordHash = await bcrypt.hash(body.password, 10);

    await prisma.user.create({
      data: {
        name: body.name.trim(),
        email,
        passwordHash,
      },
    });

    return res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return next(new HttpError(409, "Email already registered"));
    }
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const body = loginSchema.parse(req.body);
    const email = normalizeEmail(body.email);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const ok = await bcrypt.compare(body.password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const signOptions: jwt.SignOptions = { expiresIn: env.jwtExpiresIn as jwt.SignOptions["expiresIn"] };
    const token = jwt.sign({ userId: user.id, email: user.email }, env.jwtSecret, signOptions);

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    return next(err);
  }
});

router.get("/me", authenticate, async (req, res, next) => {
  try {
    const userId = req.auth!.userId;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true },
    });
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    return res.json(user);
  } catch (err) {
    return next(err);
  }
});

export const authRouter = router;
