import { Request, Response, NextFunction } from "express";
import prisma from "../../config/db";

const updateStop = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { city_name, country, latitude, longitude, start_date, end_date } = req.body;

    const existing = await prisma.stop.findUnique({
      where: { id },
      include: { trip: { select: { user_id: true } } },
    });
    if (!existing || existing.trip.user_id !== req.user!.id) {
      res.status(404).json({ error: "Stop not found." });
      return;
    }

    const data: Record<string, any> = {};
    if (city_name !== undefined) data.city_name = city_name;
    if (country !== undefined) data.country = country;
    if (latitude !== undefined) data.latitude = parseFloat(latitude);
    if (longitude !== undefined) data.longitude = parseFloat(longitude);
    if (start_date !== undefined) data.start_date = start_date ? new Date(start_date) : null;
    if (end_date !== undefined) data.end_date = end_date ? new Date(end_date) : null;

    const stop = await prisma.stop.update({ where: { id }, data });

    res.json({ stop, message: "Stop updated." });
  } catch (err) {
    next(err);
  }
};

export default updateStop;
