const ApiError = require('../utils/ApiError');

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

  req[source] = value;
  next();
};

module.exports = validate;
