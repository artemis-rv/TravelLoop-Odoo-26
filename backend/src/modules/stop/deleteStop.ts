import { Request, Response, NextFunction } from "express";
import prisma from "../../config/db";

const deleteStop = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const existing = await prisma.stop.findUnique({
      where: { id },
      include: { trip: { select: { user_id: true } } },
    });
    if (!existing || existing.trip.user_id !== req.user!.id) {
      res.status(404).json({ error: "Stop not found." });
      return;
    }

    await prisma.stop.delete({ where: { id } });

    res.json({ message: "Stop deleted." });
  } catch (err) {
    next(err);
  }
};

export default deleteStop;
