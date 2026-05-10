import { Request, Response, NextFunction } from "express";
import prisma from "../../config/db";

const getTrips = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const trips = await prisma.trip.findMany({
      where: { user_id: req.user!.id },
      include: {
        _count: { select: { stops: true, expenses: true } },
      },
      orderBy: { created_at: "desc" },
    });

    res.json({ trips });
  } catch (err) {
    next(err);
  }
};

export default getTrips;
