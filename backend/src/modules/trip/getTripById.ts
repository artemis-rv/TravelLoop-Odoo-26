import { Request, Response, NextFunction } from "express";
import prisma from "../../config/db";

const getTripById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const trip = await prisma.trip.findFirst({
      where: { id, user_id: req.user!.id },
      include: {
        stops: {
          orderBy: { position: "asc" },
          include: {
            activities: { orderBy: { created_at: "asc" } },
          },
        },
        expenses: { orderBy: { created_at: "desc" } },
        packing: true,
        notes: { orderBy: { created_at: "desc" } },
        shared: true,
      },
    });

    if (!trip) {
      res.status(404).json({ error: "Trip not found." });
      return;
    }

    res.json({ trip });
  } catch (err) {
    next(err);
  }
};

export default getTripById;
