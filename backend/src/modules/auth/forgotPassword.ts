import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import prisma from "../../config/db";

const forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, newPassword } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(404).json({ error: "User not found." });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(newPassword, salt);

    await prisma.user.update({
      where: { email },
      data: { password_hash },
    });

    res.json({ message: "Password reset successful." });
  } catch (err) {
    next(err);
  }
};

export default forgotPassword;
