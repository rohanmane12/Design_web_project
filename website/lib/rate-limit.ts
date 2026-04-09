type RateLimitEntry = {
  count: number;
  resetAt: number;
};

type HeaderSource =
  | Headers
  | Record<string, string | string[] | undefined>
  | undefined;

const rateLimitStore = new Map<string, RateLimitEntry>();

function pruneExpiredEntries(now: number) {
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetAt <= now) {
      rateLimitStore.delete(key);
    }
  }
}

function readHeader(headers: HeaderSource, name: string) {
  if (!headers) {
    return undefined;
  }

  if (typeof (headers as Headers).get === 'function') {
    return (headers as Headers).get(name) ?? undefined;
  }

  const value = (headers as Record<string, string | string[] | undefined>)[name];

  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

export function getClientIp(headers: HeaderSource) {
  const forwardedFor = readHeader(headers, 'x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() || 'unknown';
  }

  return readHeader(headers, 'x-real-ip') || 'unknown';
}

export function buildRateLimitKey(prefix: string, identifier: string, ipAddress: string) {
  return `${prefix}:${identifier.toLowerCase()}:${ipAddress}`;
}

export function assertRateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  pruneExpiredEntries(now);

  const currentEntry = rateLimitStore.get(key);

  if (!currentEntry || currentEntry.resetAt <= now) {
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });

    return { allowed: true, retryAfterMs: 0 };
  }

  if (currentEntry.count >= limit) {
    return {
      allowed: false,
      retryAfterMs: Math.max(currentEntry.resetAt - now, 0),
    };
  }

  currentEntry.count += 1;
  rateLimitStore.set(key, currentEntry);

  return { allowed: true, retryAfterMs: 0 };
}
