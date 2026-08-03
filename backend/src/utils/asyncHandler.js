/**
 * Enveloppe un handler async pour propager les erreurs
 * au middleware errorHandler (Express 5 gère aussi nativement).
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
