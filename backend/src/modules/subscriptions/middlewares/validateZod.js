const ApiError = require('../../../utils/ApiError');

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

  req[source] = result.data;
  next();
};

module.exports = validateZod;
