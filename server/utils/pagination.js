/**
 * Pagination Utilities
 * Provides helper functions for paginated API responses
 */

/**
 * Default pagination settings
 */
export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 20;
export const MAX_LIMIT = 100;

/**
 * Parse pagination parameters from query string
 * @param {Object} query - Express request query object
 * @returns {Object} Parsed pagination params
 */
export function parsePaginationParams(query) {
  let page = parseInt(query.page, 10);
  let limit = parseInt(query.limit, 10);

  // Validate and set defaults
  if (isNaN(page) || page < 1) {
    page = DEFAULT_PAGE;
  }
  if (isNaN(limit) || limit < 1) {
    limit = DEFAULT_LIMIT;
  }
  if (limit > MAX_LIMIT) {
    limit = MAX_LIMIT;
  }

  const offset = (page - 1) * limit;

  return { page, limit, offset };
}

/**
 * Create pagination metadata
 * @param {number} total - Total number of items
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @returns {Object} Pagination metadata
 */
export function createPaginationMeta(total, page, limit) {
  const totalPages = Math.ceil(total / limit);

  return {
    page,
    limit,
    total,
    totalPages,
    hasMore: page < totalPages,
    hasPrev: page > 1,
    hasNext: page < totalPages,
  };
}

/**
 * Create paginated response
 * @param {Array} data - Array of items
 * @param {number} total - Total count
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @returns {Object} Paginated response object
 */
export function createPaginatedResponse(data, total, page, limit) {
  return {
    data,
    pagination: createPaginationMeta(total, page, limit),
  };
}

/**
 * Parse filter parameters from query string
 * @param {Object} query - Express request query object
 * @param {Array} allowedFilters - List of allowed filter keys
 * @returns {Object} Parsed filters
 */
export function parseFilterParams(query, allowedFilters = []) {
  const filters = {};

  for (const key of allowedFilters) {
    if (query[key] !== undefined && query[key] !== '' && query[key] !== 'all') {
      filters[key] = query[key];
    }
  }

  return filters;
}

/**
 * Parse sort parameters from query string
 * @param {Object} query - Express request query object
 * @param {string} defaultSort - Default sort column
 * @param {string} defaultOrder - Default sort order (ASC/DESC)
 * @param {Array} allowedSortFields - List of allowed sort fields
 * @returns {Object} Parsed sort params
 */
export function parseSortParams(query, defaultSort, defaultOrder = 'DESC', allowedSortFields = []) {
  let sort = query.sort || defaultSort;
  let order = (query.order || defaultOrder).toUpperCase();

  // Validate sort field
  if (allowedSortFields.length > 0 && !allowedSortFields.includes(sort)) {
    sort = defaultSort;
  }

  // Validate order
  if (order !== 'ASC' && order !== 'DESC') {
    order = defaultOrder;
  }

  return { sort, order };
}

/**
 * Parse search parameter from query string
 * @param {Object} query - Express request query object
 * @returns {string|null} Search term or null
 */
export function parseSearchParam(query) {
  const search = query.search || query.q;
  return search && search.trim() ? search.trim() : null;
}

/**
 * Build WHERE clause for search across multiple fields
 * @param {string} search - Search term
 * @param {Array} fields - Fields to search in
 * @param {number} startParam - Starting parameter number
 * @returns {Object} { clause, params, nextParam }
 */
export function buildSearchClause(search, fields, startParam = 1) {
  if (!search || fields.length === 0) {
    return { clause: '', params: [], nextParam: startParam };
  }

  const conditions = fields.map((field, index) =>
    `${field} ILIKE $${startParam + index}`
  );

  const searchPattern = `%${search}%`;
  const params = fields.map(() => searchPattern);

  return {
    clause: `(${conditions.join(' OR ')})`,
    params,
    nextParam: startParam + fields.length,
  };
}
