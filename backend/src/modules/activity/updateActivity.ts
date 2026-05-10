import { Request, Response, NextFunction } from "express";
import prisma from "../../config/db";

const updateActivity = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, category, location, cost, duration, notes, start_time } = req.body;

    const existing = await prisma.activity.findUnique({
      where: { id },
      include: { stop: { include: { trip: { select: { user_id: true } } } } },
    });
    if (!existing || existing.stop.trip.user_id !== req.user!.id) {
      res.status(404).json({ error: "Activity not found." });
      return;
    }

    const data: Record<string, any> = {};
    if (title !== undefined) data.title = title;
    if (category !== undefined) data.category = category;
    if (location !== undefined) data.location = location;
    if (cost !== undefined) data.cost = parseFloat(cost);
    if (duration !== undefined) data.duration = parseInt(duration);
    if (notes !== undefined) data.notes = notes;
    if (start_time !== undefined) data.start_time = start_time ? new Date(start_time) : null;

    const activity = await prisma.activity.update({ where: { id }, data });

    res.json({ activity, message: "Activity updated." });
  } catch (err) {
    next(err);
  }
};

export default updateActivity;
