/**
 * Security utilities: Cryptographic hashing, input sanitization, and credential verification.
 */

// Default credentials stored as immutable SHA-256 hashes (never plaintext)
export const DEFAULT_OWNER_PASSWORD_HASH = '377e4597a5ea952fe607c962484000c90336de27a91d7171954de8f20eef8e6c';
export const SECURITY_ANSWER_HASH = 'b8e538768eaf2b25385a1eab86ab635979c1c1a1616702e81ad5d09539e831de';

/**
 * Computes a SHA-256 hash using the native browser Web Crypto API.
 */
export async function sha256(value: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(value.trim());
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Sanitizes input text to prevent XSS / HTML injection attacks.
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/[<>]/g, '') // Strip brackets to prevent script tags
    .trim();
}

/**
 * Sanitizes an object of string values.
 */
export function sanitizeRecord<T extends Record<string, unknown>>(record: T): T {
  const sanitized: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(record)) {
    if (typeof val === 'string') {
      sanitized[key] = sanitizeInput(val);
    } else {
      sanitized[key] = val;
    }
  }
  return sanitized as T;
}
