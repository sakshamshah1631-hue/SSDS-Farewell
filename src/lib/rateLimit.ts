/**
 * Client-side Rate Limiter (sliding window algorithm)
 * Prevents credential brute-forcing, checkout spam, and form flooding.
 */

interface RateLimitRecord {
  timestamps: number[];
}

export function checkRateLimit(
  actionKey: string,
  maxAttempts: number,
  windowMs: number
): { allowed: boolean; remainingAttempts: number; retryAfterSeconds?: number } {
  const storageKey = `sahyadri_ratelimit_${actionKey}`;
  const now = Date.now();
  let record: RateLimitRecord = { timestamps: [] };

  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      record = JSON.parse(raw);
    }
  } catch {
    record = { timestamps: [] };
  }

  // Filter timestamps within the active sliding window
  const activeTimestamps = record.timestamps.filter((ts) => now - ts < windowMs);

  if (activeTimestamps.length >= maxAttempts) {
    const oldestTimestamp = activeTimestamps[0];
    const retryAfterMs = windowMs - (now - oldestTimestamp);
    return {
      allowed: false,
      remainingAttempts: 0,
      retryAfterSeconds: Math.ceil(retryAfterMs / 1000),
    };
  }

  // Record this attempt
  activeTimestamps.push(now);
  try {
    localStorage.setItem(storageKey, JSON.stringify({ timestamps: activeTimestamps }));
  } catch {
    // Quota exceeded or private browsing
  }

  return {
    allowed: true,
    remainingAttempts: maxAttempts - activeTimestamps.length,
  };
}

export function resetRateLimit(actionKey: string): void {
  try {
    localStorage.removeItem(`sahyadri_ratelimit_${actionKey}`);
  } catch {
    // Ignore
  }
}
