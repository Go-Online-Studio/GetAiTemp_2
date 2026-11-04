/**
 * In-memory sliding window rate limiter
 */
const rateLimitMap = new Map();

/**
 * Periodically clean up expired rate limit entries to prevent memory leaks
 */
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, 60000);

/**
 * Check if a client IP has exceeded the limit
 * @param {string} ip - Client identifier (IP)
 * @param {string} action - Action key, e.g. 'unlock' or 'contact'
 * @param {number} limit - Maximum requests allowed within window
 * @param {number} windowMs - Window duration in milliseconds (default 60s)
 * @returns {{ success: boolean, remaining: number, resetTime: number }}
 */
export function rateLimit(ip = 'unknown', action = 'general', limit = 15, windowMs = 60000) {
  const key = `${action}:${ip}`;
  const now = Date.now();

  let record = rateLimitMap.get(key);

  if (!record || now > record.resetTime) {
    record = {
      count: 1,
      resetTime: now + windowMs,
    };
    rateLimitMap.set(key, record);
    return {
      success: true,
      remaining: limit - 1,
      resetTime: record.resetTime,
    };
  }

  if (record.count >= limit) {
    return {
      success: false,
      remaining: 0,
      resetTime: record.resetTime,
    };
  }

  record.count += 1;
  return {
    success: true,
    remaining: limit - record.count,
    resetTime: record.resetTime,
  };
}

/**
 * Helper to extract client IP from Next.js Request
 */
export function getClientIp(request) {
  if (!request || !request.headers) return '127.0.0.1';
  const forwarded = typeof request.headers.get === 'function'
    ? request.headers.get('x-forwarded-for')
    : request.headers['x-forwarded-for'];
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = typeof request.headers.get === 'function'
    ? request.headers.get('x-real-ip')
    : request.headers['x-real-ip'];
  if (realIp) return realIp.trim();

  return '127.0.0.1';
}
