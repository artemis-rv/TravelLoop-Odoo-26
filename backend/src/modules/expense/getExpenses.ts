import { Request, Response, NextFunction } from "express";
import prisma from "../../config/db";

const getExpenses = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { tripId } = req.params;

    const trip = await prisma.trip.findFirst({
      where: { id: tripId, user_id: req.user!.id },
    });
    if (!trip) {
      res.status(404).json({ error: "Trip not found." });
      return;
    }

    const expenses = await prisma.expense.findMany({
      where: { trip_id: tripId },
      include: { activity: { select: { title: true } } },
      orderBy: { created_at: "desc" },
    });

    res.json({ expenses });
  } catch (err) {
    next(err);
  }
};

export default getExpenses;
