/**
 * Erreur applicative avec statut HTTP.
 * Jetée dans les services/controllers, capturée par errorHandler.
 */
class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

module.exports = ApiError;
