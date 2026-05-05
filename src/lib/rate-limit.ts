type RateLimitOptions = {
  interval: number; // ms
  uniqueTokenPerInterval: number; // max users tracked
};

export function rateLimit(options: RateLimitOptions) {
  const tokenCache = new Map();

  return {
    check: (res: Response | any, limit: number, token: string) =>
      new Promise<void>((resolve, reject) => {
        const tokenCount = tokenCache.get(token) || [0];
        if (tokenCount[0] === 0) {
          tokenCache.set(token, [1, Date.now()]);
        } else {
          tokenCount[0] += 1;
        }

        const currentUsage = tokenCount[0];
        const isRateLimited = currentUsage >= limit;
        
        // Cleanup old tokens if cache is too large
        if (tokenCache.size > options.uniqueTokenPerInterval) {
          const now = Date.now();
          for (const [key, value] of tokenCache.entries()) {
            if (now - value[1] > options.interval) {
              tokenCache.delete(key);
            }
          }
        }

        if (isRateLimited) {
          return reject();
        }
        
        return resolve();
      }),
  };
}

export const authLimiter = rateLimit({
  interval: 15 * 60 * 1000, // 15 mins
  uniqueTokenPerInterval: 500,
});

export const generalLimiter = rateLimit({
  interval: 60 * 1000, // 1 min
  uniqueTokenPerInterval: 1000,
});
