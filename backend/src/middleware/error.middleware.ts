import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "HttpError";
  }
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ message: err.message });
  }
  if (err instanceof ZodError) {
    const first = err.errors[0];
    return res.status(400).json({
      message: first ? `${first.path.join(".")}: ${first.message}` : "Invalid request",
    });
  }
  console.error(err);
  return res.status(500).json({ message: "Something went wrong" });
}
