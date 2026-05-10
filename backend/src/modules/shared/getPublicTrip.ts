import { Request, Response, NextFunction } from "express";
import prisma from "../../config/db";

const getPublicTrip = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { slug } = req.params;

    const shared = await prisma.sharedTrip.findUnique({
      where: { slug },
      include: {
        trip: {
          include: {
            user: { select: { name: true } },
            stops: {
              orderBy: { position: "asc" },
              include: {
                activities: { orderBy: { created_at: "asc" } },
              },
            },
            expenses: true,
            notes: { orderBy: { created_at: "desc" } },
          },
        },
      },
    });

    if (!shared) {
      res.status(404).json({ error: "Shared trip not found." });
      return;
    }

    if (shared.expires_at && new Date() > shared.expires_at) {
      res.status(410).json({ error: "This shared link has expired." });
      return;
    }

    if (!shared.trip.is_public) {
      res.status(403).json({ error: "This trip is no longer public." });
      return;
    }

    res.json({ trip: shared.trip });
  } catch (err) {
    next(err);
  }
};

export default getPublicTrip;
