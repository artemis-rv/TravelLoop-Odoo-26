import { Request, Response, NextFunction } from "express";

const searchActivities = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { lat, lng, radius, kinds, limit } = req.query;

    if (!lat || !lng) {
      res.status(400).json({ error: "lat and lng query params are required." });
      return;
    }

    const apiKey = process.env.OPENTRIPMAP_API_KEY;
    if (!apiKey) {
      res.status(503).json({ error: "Activity search API not configured." });
      return;
    }

    const searchRadius = radius || 10000;
    const searchLimit = limit || 20;

    let url = `https://api.opentripmap.com/0.1/en/places/radius?radius=${searchRadius}&lon=${lng}&lat=${lat}&limit=${searchLimit}&apikey=${apiKey}`;

    if (kinds) {
      url += `&kinds=${encodeURIComponent(kinds as string)}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      res.status(response.status).json({ error: "Failed to fetch activities." });
      return;
    }

    const data = await response.json();

    const activities = data
      .filter((place: any) => place.name && place.name.trim() !== "")
      .map((place: any) => ({
        id: place.xid,
        name: place.name,
        kinds: place.kinds,
        latitude: place.point?.lat,
        longitude: place.point?.lon,
        distance: place.dist,
      }));

    res.json({ activities });
  } catch (err) {
    next(err);
  }
};

export default searchActivities;
