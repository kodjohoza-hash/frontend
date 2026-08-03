const ApiError = require('../../../utils/ApiError');

/**
 * Remplace une propriété de requête (query/body/params).
 * NOTE Express 5 : `req.query` est un accessor getter-only → une affectation
 * simple est ignorée silencieusement. On redéfinit la propriété via
 * Object.defineProperty (configurable: true côté Express).
 */
const setRequestPart = (req, source, value) => {
  try {
    Object.defineProperty(req, source, {
      value,
      writable: true,
      configurable: true,
      enumerable: true,
    });
  } catch (_err) {
    req[source] = value;
  }
};

/**
 * Valide une partie de la requête avec un schéma Zod.
 * @param {import('zod').ZodSchema} schema
 * @param {'body'|'query'|'params'} source
 */
const validateZod = (schema, source = 'body') => (req, _res, next) => {
  const result = schema.safeParse(req[source]);

  if (!result.success) {
    const message = result.error.issues.map((i) => i.message).join('; ');
    return next(new ApiError(400, message));
  }

  setRequestPart(req, source, result.data);
  next();
};

module.exports = validateZod;
