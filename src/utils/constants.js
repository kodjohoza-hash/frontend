/**
 * BUS TIX CONNECT — Legacy Constants
 * This file is deprecated. Use specific imports instead:
 *   - Route paths → @routes/routeConstants
 *   - Roles/Permissions → @routes/permissions
 *   - Storage keys → @store/app.store (STORAGE_KEYS)
 *   - HTTP status codes → @services/api.config (HTTP_STATUS)
 *   - Query keys → @hooks/useQuery (QUERY_KEYS)
 */

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
};
