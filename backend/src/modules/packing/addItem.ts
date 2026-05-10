import { Request, Response, NextFunction } from "express";
import prisma from "../../config/db";

const addItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { tripId } = req.params;
    const { item_name } = req.body;

    const trip = await prisma.trip.findFirst({
      where: { id: tripId, user_id: req.user!.id },
    });
    if (!trip) {
      res.status(404).json({ error: "Trip not found." });
      return;
    }

    const item = await prisma.packingItem.create({
      data: { trip_id: tripId, item_name },
    });

    res.status(201).json({ item });
  } catch (err) {
    next(err);
  }
};

export default addItem;
