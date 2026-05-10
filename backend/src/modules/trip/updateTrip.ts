import { Request, Response, NextFunction } from "express";
import prisma from "../../config/db";

const updateTrip = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, cover_image, budget, start_date, end_date, is_public } = req.body;

    const existing = await prisma.trip.findFirst({
      where: { id, user_id: req.user!.id },
    });
    if (!existing) {
      res.status(404).json({ error: "Trip not found." });
      return;
    }

    const data: Record<string, any> = {};
    if (title !== undefined) data.title = title;
    if (description !== undefined) data.description = description;
    if (cover_image !== undefined) data.cover_image = cover_image;
    if (budget !== undefined) data.budget = parseFloat(budget);
    if (start_date !== undefined) data.start_date = start_date ? new Date(start_date) : null;
    if (end_date !== undefined) data.end_date = end_date ? new Date(end_date) : null;
    if (is_public !== undefined) data.is_public = is_public;

    const trip = await prisma.trip.update({ where: { id }, data });

    res.json({ trip, message: "Trip updated." });
  } catch (err) {
    next(err);
  }
};

export default updateTrip;
