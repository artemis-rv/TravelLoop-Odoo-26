import { Request, Response, NextFunction } from "express";
import prisma from "../../config/db";

const createTrip = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, description, cover_image, budget, start_date, end_date } = req.body;

    const trip = await prisma.trip.create({
      data: {
        user_id: req.user!.id,
        title,
        description,
        cover_image,
        budget: budget ? parseFloat(budget) : 0,
        start_date: start_date ? new Date(start_date) : null,
        end_date: end_date ? new Date(end_date) : null,
      },
    });

    res.status(201).json({ trip });
  } catch (err) {
    next(err);
  }
};

export default createTrip;
