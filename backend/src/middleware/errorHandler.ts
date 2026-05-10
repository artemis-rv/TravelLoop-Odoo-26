import { Request, Response, NextFunction } from "express";

interface PrismaError extends Error {
  code?: string;
}

const errorHandler = (err: PrismaError, _req: Request, res: Response, _next: NextFunction): void => {
  console.error(`[ERROR] ${err.message}`);
  console.error(err.stack);

  // Prisma known errors
  if (err.code === "P2025") {
    res.status(404).json({ error: "Record not found." });
    return;
  }
  if (err.code === "P2002") {
    res.status(409).json({ error: "A record with that value already exists." });
    return;
  }

  const statusCode = (err as any).statusCode || 500;
  res.status(statusCode).json({
    error: err.message || "Internal Server Error",
  });
};

export default errorHandler;
