import { Request, Response, NextFunction } from "express";
import prisma from "../../config/db";

const getNotes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { tripId } = req.params;

    const trip = await prisma.trip.findFirst({
      where: { id: tripId, user_id: req.user!.id },
    });
    if (!trip) {
      res.status(404).json({ error: "Trip not found." });
      return;
    }

    const notes = await prisma.note.findMany({
      where: { trip_id: tripId },
      orderBy: { created_at: "desc" },
    });

    res.json({ notes });
  } catch (err) {
    next(err);
  }
};

export default getNotes;
