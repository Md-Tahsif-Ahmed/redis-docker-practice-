const { getRedis } = require('../config/redis');


const DEFAULT_TTL = parseInt(process.env.CACHE_TTL_SECONDS || '60', 10);


// Generic cache middleware based on request key
const cache = (keyBuilder, ttlSeconds = DEFAULT_TTL) => {
return async (req, res, next) => {
try {
const redis = getRedis();
const key = typeof keyBuilder === 'function' ? keyBuilder(req) : String(keyBuilder);
const hit = await redis.get(key);
if (hit) {
return res.json({ fromCache: true, data: JSON.parse(hit) });
}


// Wrap res.json to store response in cache
const originalJson = res.json.bind(res);
res.json = async (body) => {
try {
await redis.setEx(key, ttlSeconds, JSON.stringify(body.data ?? body));
} catch (e) {
console.warn('Cache set failed:', e.message);
}
return originalJson(body);
};


next();
} catch (err) {
console.warn('Cache middleware error:', err.message);
next();
}
};
};


// Utilities for invalidation
const invalidateByPattern = async (pattern) => {
const redis = getRedis();
const iter = redis.scanIterator({ MATCH: pattern, COUNT: 100 });
const keysToDelete = [];
for await (const key of iter) keysToDelete.push(key);
if (keysToDelete.length) await redis.del(keysToDelete);
return keysToDelete.length;
};


module.exports = { cache, invalidateByPattern };