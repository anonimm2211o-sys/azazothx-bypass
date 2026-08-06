async function bypass(url) {
  try {
    const apiUrl = `https://izen.lol/userscript?url=${encodeURIComponent(url)}&apikey=&time=0`;
    const resp = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Referer': 'https://izen.lol/',
      },
      redirect: 'manual',
    });

    const location = resp.headers.get('location');
    if (location) {
      try {
        const loc = new URL(location);
        const redirect = loc.searchParams.get('redirect');
        if (redirect && redirect !== url) return { success: true, destination: redirect, source: 'izen.lol' };
      } catch (_) {}
      if (location !== url) return { success: true, destination: location, source: 'izen.lol' };
    }

    const text = await resp.text();

    const redirectMatch = text.match(/[?&]redirect=([^"&\s<]+)/);
    if (redirectMatch) {
      const dest = decodeURIComponent(redirectMatch[1]);
      if (dest && dest !== url) return { success: true, destination: dest, source: 'izen.lol (html)' };
    }

    const winLocMatch = text.match(/window\.location(?:\.replace|\.href)?\s*[=(]\s*['"]([^'"]+)['"]/);
    if (winLocMatch && winLocMatch[1] !== url) return { success: true, destination: winLocMatch[1], source: 'izen.lol (js)' };

    return { success: false };
  } catch (_) { return { success: false }; }
}

module.exports = { bypass };
