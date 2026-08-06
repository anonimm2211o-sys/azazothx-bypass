const store = new Map();

function rateLimit(ip, windowMs = 30000) {
  const now = Date.now();
  const expiry = store.get(ip);
  if (expiry && now < expiry) return false;
  store.set(ip, now + windowMs);
  if (store.size > 5000) {
    for (const [key, val] of store) {
      if (now > val) store.delete(key);
    }
  }
  return true;
}

module.exports = { rateLimit };
