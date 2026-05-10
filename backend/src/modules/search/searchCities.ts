import { Request, Response, NextFunction } from "express";

const searchCities = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { q, limit } = req.query;

    if (!q || (q as string).length < 2) {
      res.status(400).json({ error: "Query must be at least 2 characters." });
      return;
    }

    const apiKey = process.env.GEODB_API_KEY;
    const apiHost = process.env.GEODB_API_HOST || "wft-geo-db.p.rapidapi.com";

    if (!apiKey) {
      res.status(503).json({ error: "City search API not configured." });
      return;
    }

    const url = `https://${apiHost}/v1/geo/cities?namePrefix=${encodeURIComponent(q as string)}&limit=${limit || 10}&sort=-population`;

    const response = await fetch(url, {
      headers: {
        "X-RapidAPI-Key": apiKey,
        "X-RapidAPI-Host": apiHost,
      },
    });

    if (!response.ok) {
      res.status(response.status).json({ error: "Failed to fetch cities." });
      return;
    }

    const data = await response.json();

    const cities = data.data.map((city: any) => ({
      id: city.id,
      name: city.name,
      country: city.country,
      countryCode: city.countryCode,
      region: city.region,
      latitude: city.latitude,
      longitude: city.longitude,
      population: city.population,
    }));

    res.json({ cities });
  } catch (err) {
    next(err);
  }
};

export default searchCities;
