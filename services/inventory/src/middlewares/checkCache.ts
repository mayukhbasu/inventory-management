import { Request, Response, NextFunction } from 'express';

import { createClient } from 'redis';

// Create a Redis client
const redisClient = createClient({ url: 'redis://localhost:6379' });
redisClient.connect();

export const checkCache = async (req: Request, res: Response, next: NextFunction) => {
  // Construct cache key based on the endpoint and query parameters
  const basePath = req.baseUrl + req.path; // e.g., "/inventory/products"
  const queryParams = Object.entries(req.query)
                             .map(([key, value]) => `${key}=${value}`)
                             .join('&');
  const cacheKey = `cache:${basePath}?${queryParams}`;

  try {
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData != null) {
      console.log('Serving from cache');
      return res.json(JSON.parse(cachedData));
    } else {
      res.locals.cacheKey = cacheKey;
      next();
    }
  } catch (error) {
    console.error('Redis error:', error);
    next(); // Proceed without caching in case of a Redis error
  }
};
