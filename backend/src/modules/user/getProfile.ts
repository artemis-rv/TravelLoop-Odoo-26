import { Request, Response, NextFunction } from "express";
import prisma from "../../config/db";

const getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        name: true,
        email: true,
        created_at: true,
        updated_at: true,
        _count: { select: { trips: true } },
      },
    });

    if (!user) {
      res.status(404).json({ error: "User not found." });
      return;
    }

    res.json({ user });
  } catch (err) {
    next(err);
  }
};

export default getProfile;
