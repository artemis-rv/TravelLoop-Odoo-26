import { Request, Response, NextFunction } from "express";
import prisma from "../../config/db";

const deleteActivity = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const existing = await prisma.activity.findUnique({
      where: { id },
      include: { stop: { include: { trip: { select: { user_id: true } } } } },
    });
    if (!existing || existing.stop.trip.user_id !== req.user!.id) {
      res.status(404).json({ error: "Activity not found." });
      return;
    }

    await prisma.activity.delete({ where: { id } });

    res.json({ message: "Activity deleted." });
  } catch (err) {
    next(err);
  }
};

export default deleteActivity;
