// NOTE: Map ini in-memory — works fine untuk warm instances.
// Di Vercel serverless cold start, state reset. Cukup buat basic protection.
// Kalau butuh strict rate limit, ganti pakai Upstash Redis / Vercel KV.
const store = new Map();

export function rateLimit(ip, windowMs = 30000) {
  const now = Date.now();
  const expiry = store.get(ip);

  if (expiry && now < expiry) return false;

  store.set(ip, now + windowMs);

  // Cleanup biar ga memory leak
  if (store.size > 5000) {
    for (const [key, val] of store) {
      if (now > val) store.delete(key);
    }
  }

  return true;
}
