const ApiError = require('../utils/ApiError');

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
 * Valide req.body / req.params / req.query avec un schéma Joi.
 * Usage : router.post('/', validate(authValidation.login), controller)
 */
const validate = (schema, source = 'body') => (req, _res, next) => {
  const { error, value } = schema.validate(req[source], { abortEarly: false });

  if (error) {
    const message = error.details.map((d) => d.message).join('; ');
    return next(new ApiError(400, message));
  }

  setRequestPart(req, source, value);
  next();
};

module.exports = validate;
