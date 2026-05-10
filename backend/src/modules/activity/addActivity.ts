import { Request, Response, NextFunction } from "express";
import prisma from "../../config/db";

const addActivity = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { stopId } = req.params;
    const { title, category, location, cost, duration, notes, start_time } = req.body;

    const stop = await prisma.stop.findUnique({
      where: { id: stopId },
      include: { trip: { select: { user_id: true } } },
    });
    if (!stop || stop.trip.user_id !== req.user!.id) {
      res.status(404).json({ error: "Stop not found." });
      return;
    }

    const activity = await prisma.activity.create({
      data: {
        stop_id: stopId,
        title,
        category,
        location,
        cost: cost ? parseFloat(cost) : 0,
        duration: duration ? parseInt(duration) : null,
        notes,
        start_time: start_time ? new Date(start_time) : null,
      },
    });

    res.status(201).json({ activity });
  } catch (err) {
    next(err);
  }
};

export default addActivity;
