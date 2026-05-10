import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import prisma from "../../config/db";

const updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    const data: Record<string, any> = {};

    if (name) data.name = name;
    if (email) data.email = email;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      data.password_hash = await bcrypt.hash(password, salt);
    }

    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data,
      select: { id: true, name: true, email: true, updated_at: true },
    });

    res.json({ user, message: "Profile updated." });
  } catch (err) {
    next(err);
  }
};

export default updateProfile;
