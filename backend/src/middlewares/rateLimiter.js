const ApiError = require('../utils/ApiError');

/**
 * Rate limiter simple en mémoire (par IP).
 * Usage : router.use(rateLimit(100, 15 * 60 * 1000))
 */
const rateLimit = (max = 100, windowMs = 15 * 60 * 1000) => {
  const hits = new Map();

  return (req, _res, next) => {
    const key = req.ip;
    const now = Date.now();
    const record = hits.get(key) || { count: 0, resetAt: now + windowMs };

    if (now > record.resetAt) {
      record.count = 0;
      record.resetAt = now + windowMs;
    }

    record.count += 1;
    hits.set(key, record);

    if (record.count > max) {
      return next(new ApiError(429, 'Trop de requêtes. Veuillez réessayer plus tard.'));
    }

    next();
  };
};

module.exports = rateLimit;
