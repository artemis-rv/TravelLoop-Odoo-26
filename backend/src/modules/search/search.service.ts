import axios from "axios";
import { createClient } from "redis";

// ─── Types ──────────────────────────────────────────

interface CityResult {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
}

interface ActivityResult {
  name: string;
  category: string;
  location: string;
  rating: number | null;
}

// ─── Redis Client ───────────────────────────────────

let redisClient: ReturnType<typeof createClient> | null = null;
let redisDisabled = false;

const getRedis = async () => {
  if (redisDisabled) return null;

  if (!redisClient) {
    try {
      const url = process.env.REDIS_URL || "redis://localhost:6379";
      redisClient = createClient({
        url,
        socket: {
          connectTimeout: 3000, // 3 second timeout
        }
      });
      redisClient.on("error", (err) => {
        // console.error("[Redis] Error:", err.message);
      });
      
      // Wrap connect in a timeout just in case the socket option doesn't catch it
      const connectPromise = redisClient.connect();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Timeout")), 3500)
      );

      await Promise.race([connectPromise, timeoutPromise]);
      console.log("[Redis] Connected successfully");
    } catch (err: any) {
      console.warn("[Redis] Not available or timed out — caching disabled");
      redisDisabled = true;
      if (redisClient) {
        try { await redisClient.disconnect(); } catch {}
      }
      redisClient = null;
      return null;
    }
  }
  return redisClient;
};

const CACHE_TTL = 3600; // 1 hour in seconds

// ─── Cache Helpers ──────────────────────────────────

const getFromCache = async <T>(key: string): Promise<T | null> => {
  try {
    const redis = await getRedis();
    if (!redis) return null;
    const cached = await redis.get(key);
    if (cached) {
      console.log(`[Cache] HIT  → ${key}`);
      return JSON.parse(cached) as T;
    }
    console.log(`[Cache] MISS → ${key}`);
    return null;
  } catch {
    return null;
  }
};

const setToCache = async (key: string, data: unknown): Promise<void> => {
  try {
    const redis = await getRedis();
    if (!redis) return;
    await redis.setEx(key, CACHE_TTL, JSON.stringify(data));
  } catch {
    // Silently fail — cache is optional
  }
};

// ─── City Search (GeoDB Cities API) ─────────────────

export const searchCities = async (query: string): Promise<CityResult[]> => {
  const cacheKey = `city:${query.toLowerCase().trim()}`;
  const cached = await getFromCache<CityResult[]>(cacheKey);
  if (cached) return cached;

  const apiKey = process.env.GEODB_API_KEY;
  const apiHost = process.env.GEODB_API_HOST || "wft-geo-db.p.rapidapi.com";

  if (!apiKey) {
    throw new Error("GEODB_API_KEY is not configured.");
  }

  try {
    const { data } = await axios.get(
      `https://${apiHost}/v1/geo/cities`,
      {
        params: {
          namePrefix: query,
          limit: 10,
          sort: "-population",
        },
        headers: {
          "X-RapidAPI-Key": apiKey,
          "X-RapidAPI-Host": apiHost,
        },
        timeout: 8000, // 8 second timeout
      }
    );

    const cities: CityResult[] = (data.data || []).map((city: any) => ({
      name: city.name,
      country: city.country,
      latitude: city.latitude,
      longitude: city.longitude,
    }));

    console.log(`[SearchService] GeoDB success: ${cities.length} results`);
    await setToCache(cacheKey, cities);
    return cities;
  } catch (err: any) {
    console.error("[SearchService] GeoDB API error:", err.response?.data?.message || err.message);
    return [];
  }
};

// ─── Activity Search (OpenTripMap API) ──────────────

export const searchActivities = async (city: string): Promise<ActivityResult[]> => {
  const cacheKey = `activity:${city.toLowerCase().trim()}`;
  const cached = await getFromCache<ActivityResult[]>(cacheKey);
  if (cached) return cached;

  const apiKey = process.env.OPENTRIPMAP_API_KEY;

  if (!apiKey) {
    throw new Error("OPENTRIPMAP_API_KEY is not configured.");
  }

  try {
    // Step 1: Geocode the city name to lat/lon
    const { data: geoData } = await axios.get(
      `https://api.opentripmap.com/0.1/en/places/geoname`,
      {
        params: { name: city, apikey: apiKey },
        timeout: 5000,
      }
    );

    if (!geoData.lat || !geoData.lon) {
      return [];
    }

    // Step 2: Search places by radius around the city
    const { data: places } = await axios.get(
      `https://api.opentripmap.com/0.1/en/places/radius`,
      {
        params: {
          radius: 10000,
          lon: geoData.lon,
          lat: geoData.lat,
          limit: 20,
          rate: 2,             // minimum rating filter
          format: "json",
          apikey: apiKey,
        },
        timeout: 8000,
      }
    );

    // Step 3: Filter and map results
    const activities: ActivityResult[] = (places || [])
      .filter((p: any) => p.name && p.name.trim() !== "")
      .map((place: any) => ({
        name: place.name,
        category: place.kinds?.split(",")[0] || "general",
        location: `${place.point?.lat ?? 0}, ${place.point?.lon ?? 0}`,
        rating: place.rate ?? null,
      }));

    await setToCache(cacheKey, activities);
    return activities;
  } catch (err: any) {
    console.error("[SearchService] OpenTripMap API error:", err.response?.data?.message || err.message);
    return [];
  }
};
