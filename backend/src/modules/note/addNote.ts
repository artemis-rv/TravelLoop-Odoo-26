import { Request, Response, NextFunction } from "express";
import prisma from "../../config/db";

const addNote = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { tripId } = req.params;
    const { title, content } = req.body;

    const trip = await prisma.trip.findFirst({
      where: { id: tripId, user_id: req.user!.id },
    });
    if (!trip) {
      res.status(404).json({ error: "Trip not found." });
      return;
    }

    const note = await prisma.note.create({
      data: { trip_id: tripId, title, content },
    });

    res.status(201).json({ note });
  } catch (err) {
    next(err);
  }
};

export default addNote;
