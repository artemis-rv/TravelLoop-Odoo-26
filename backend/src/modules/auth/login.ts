import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../../config/db";

const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ error: "Invalid email or password." });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      res.status(401).json({ error: "Invalid email or password." });
      return;
    }

    const secret = process.env.JWT_SECRET || "default_secret";
    const token = jwt.sign(
      { id: user.id, email: user.email },
      secret,
      { expiresIn: (process.env.JWT_EXPIRES_IN || "7d") as any }
    );

    res.json({
      user: { id: user.id, name: user.name, email: user.email },
      token,
    });
  } catch (err) {
    next(err);
  }
};

export default login;
