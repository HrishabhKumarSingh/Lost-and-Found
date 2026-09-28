/**
 * In-memory sliding window rate limiter for Next.js API routes
 */

const tracker = new Map();

// Periodic cleanup every 5 minutes to prevent memory leaks
const cleanupTimer = setInterval(() => {
  const now = Date.now();
  for (const [key, data] of tracker.entries()) {
    if (now > data.resetTime) {
      tracker.delete(key);
    }
  }
}, 300000);
if (cleanupTimer.unref) {
  cleanupTimer.unref();
}

export function getClientIp(request) {
  // Check headers commonly set by proxies, load balancers, Vercel, Cloudflare
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  return '127.0.0.1';
}

export function checkRateLimit(request, options = {}) {
  const {
    prefix = 'general',
    maxRequests = 60,
    windowMs = 60 * 1000, // 1 minute default
  } = options;

  const ip = getClientIp(request);
  const key = `${prefix}:${ip}`;
  const now = Date.now();

  let record = tracker.get(key);

  if (!record || now > record.resetTime) {
    record = {
      count: 1,
      resetTime: now + windowMs,
    };
    tracker.set(key, record);
    return { success: true, remaining: maxRequests - 1, resetIn: Math.ceil(windowMs / 1000) };
  }

  record.count += 1;

  if (record.count > maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetIn: Math.ceil((record.resetTime - now) / 1000),
    };
  }

  return {
    success: true,
    remaining: maxRequests - record.count,
    resetIn: Math.ceil((record.resetTime - now) / 1000),
  };
}
