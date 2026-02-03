const toCamelCase = (value) => value.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());

const toCamelCaseKeys = (input) => {
  if (input === null || input === undefined) return input;
  if (Array.isArray(input)) return input.map(toCamelCaseKeys);
  if (typeof input !== 'object') return input;

  return Object.entries(input).reduce((acc, [key, value]) => {
    const nextKey = typeof key === 'string' ? toCamelCase(key) : key;
    acc[nextKey] = toCamelCaseKeys(value);
    return acc;
  }, {});
};

export const normalizeRequest = (req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    req.body = toCamelCaseKeys(req.body);
  }

  if (req.query && typeof req.query === 'object') {
    req.query = toCamelCaseKeys(req.query);
  }

  next();
};
