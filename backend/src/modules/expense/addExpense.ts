import { Request, Response, NextFunction } from "express";
import prisma from "../../config/db";

const addExpense = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { tripId } = req.params;
    const { amount, category, description, activity_id, date } = req.body;

    const trip = await prisma.trip.findFirst({
      where: { id: tripId, user_id: req.user!.id },
    });
    if (!trip) {
      res.status(404).json({ error: "Trip not found." });
      return;
    }

    const expense = await prisma.expense.create({
      data: {
        trip_id: tripId,
        amount: parseFloat(amount),
        category,
        description,
        activity_id: activity_id || null,
        date: date ? new Date(date) : new Date(),
      },
    });

    res.status(201).json({ expense });
  } catch (err) {
    next(err);
  }
};

export default addExpense;
