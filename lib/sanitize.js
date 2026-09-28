/**
 * Input sanitization and validation utilities
 * Protects against XSS, NoSQL injection, and malformed payloads
 */

export function sanitizeString(val, maxLength = 1000) {
  if (val === undefined || val === null) return '';
  if (typeof val !== 'string') {
    // If an object is passed (e.g. NoSQL injection attack { $gt: "" }), reject or stringify safely
    return '';
  }

  let sanitized = val.trim();

  // Strip script tags and dangerous HTML attributes
  sanitized = sanitized
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:[^"']*/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/on\w+\s*=\s*[^>\s]+/gi, '');

  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  return sanitized;
}

export function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim()) && email.length <= 100;
}

export function isValidId(id) {
  if (!id || typeof id !== 'string') return false;
  // Valid 24-character hexadecimal ObjectId or safe alphanumeric ID
  return /^[0-9a-fA-F]{24}$/.test(id) || /^[a-zA-Z0-9_-]{1,64}$/.test(id);
}

/**
 * Remove any keys starting with "$" from object to block MongoDB operator injection
 */
export function sanitizeNoSql(obj) {
  if (!obj || typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.map(sanitizeNoSql);
  }

  const cleaned = {};
  for (const [key, value] of Object.entries(obj)) {
    if (!key.startsWith('$')) {
      if (typeof value === 'object' && value !== null) {
        const cleanedSub = sanitizeNoSql(value);
        // If sub-object was reduced to empty because its keys were stripped operator keys, omit it
        if (!Array.isArray(cleanedSub) && Object.keys(cleanedSub).length === 0 && Object.keys(value).length > 0) {
          continue;
        }
        cleaned[key] = cleanedSub;
      } else {
        cleaned[key] = value;
      }
    }
  }
  return cleaned;
}
