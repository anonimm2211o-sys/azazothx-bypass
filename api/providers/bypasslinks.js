// Provider: bypass-links.com (instant API)

export default async function bypass(url) {
  try {
    const resp = await fetch(
      `https://bypass-links.com/api/bypass?url=${encodeURIComponent(url)}`,
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

    if (data.success && dest && dest !== url) {
      return { success: true, destination: dest, source: 'bypass-links.com' };
    }

    return { success: false };
  } catch (_) {
    return { success: false };
  }
}
