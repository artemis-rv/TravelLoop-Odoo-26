import { Request, Response, NextFunction } from "express";
import prisma from "../../config/db";

const getBudgetSummary = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { tripId } = req.params;

    const trip = await prisma.trip.findFirst({
      where: { id: tripId, user_id: req.user!.id },
      select: { id: true, budget: true, title: true },
    });
    if (!trip) {
      res.status(404).json({ error: "Trip not found." });
      return;
    }

    const aggregate = await prisma.expense.aggregate({
      where: { trip_id: tripId },
      _sum: { amount: true },
      _count: { id: true },
    });

    const byCategory = await prisma.expense.groupBy({
      by: ["category"],
      where: { trip_id: tripId },
      _sum: { amount: true },
      _count: { id: true },
    });

    const totalSpent = aggregate._sum.amount || 0;
    const budget = trip.budget || 0;

    res.json({
      tripTitle: trip.title,
      budget,
      totalSpent,
      remaining: budget - totalSpent,
      expenseCount: aggregate._count.id,
      byCategory: byCategory.map((c) => ({
        category: c.category || "Uncategorized",
        total: c._sum.amount,
        count: c._count.id,
      })),
    });
  } catch (err) {
    next(err);
  }
};

export default getBudgetSummary;
