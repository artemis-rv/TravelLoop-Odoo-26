import { Request, Response, NextFunction } from "express";
import prisma from "../../config/db";

const reorderStops = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { tripId } = req.params;
    const { orderedIds } = req.body;

    const trip = await prisma.trip.findFirst({
      where: { id: tripId, user_id: req.user!.id },
    });
    if (!trip) {
      res.status(404).json({ error: "Trip not found." });
      return;
    }

    if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
      res.status(400).json({ error: "orderedIds must be a non-empty array." });
      return;
    }

    const updates = orderedIds.map((id: string, index: number) =>
      prisma.stop.update({
        where: { id },
        data: { position: index },
      })
    );

    await prisma.$transaction(updates);

    res.json({ message: "Stops reordered successfully." });
  } catch (err) {
    next(err);
  }
};

export default reorderStops;
