// Provider: bypass.vip

export default async function bypass(url) {
  try {
    const resp = await fetch(
      `https://api.bypass.vip/?url=${encodeURIComponent(url)}`,
      {
        headers: {
          'User-Agent': 'Azazothx-Bypass/1.0',
          'Accept': 'application/json',
        },
      }
    );

    if (!resp.ok) return { success: false };

    const data = await resp.json();
    const dest = data.destination || data.result || data.url || null;

    if (dest && dest !== url) {
      return { success: true, destination: dest, source: 'bypass.vip' };
    }

    return { success: false };
  } catch (_) {
    return { success: false };
  }
}
