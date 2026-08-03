const ApiError = require('../utils/ApiError');

/** 404 pour toute route inconnue. */
// eslint-disable-next-line no-unused-vars
const notFoundHandler = (req, _res, next) => {
  next(new ApiError(404, `Route introuvable : ${req.method} ${req.originalUrl}`));
};

module.exports = { notFoundHandler };
