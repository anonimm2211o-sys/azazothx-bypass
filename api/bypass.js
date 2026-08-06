import { runProviders } from './providers/index.js';
import { rateLimit } from './utils/ratelimit.js';

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') {
    return res.status(405).json({ status: 'error', message: 'Method not allowed.' });
  }

  // Rate limit per IP
  const ip =
    (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
    req.socket?.remoteAddress ||
    'unknown';

  if (!rateLimit(ip)) {
    return res.status(429).json({
      status: 'error',
      message: 'Rate limited. Tunggu 30 detik sebelum request lagi.',
    });
  }

  // Validasi URL
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ status: 'error', message: 'Parameter ?url= diperlukan.' });
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(url);
  } catch (_) {
    return res.status(400).json({ status: 'error', message: 'URL tidak valid.' });
  }

  // Jalankan semua provider
  const result = await runProviders(parsedUrl.href);

  if (result.success) {
    return res.status(200).json({
      status: 'success',
      destination: result.destination,
      source: result.source,
    });
  }

  return res.status(500).json({
    status: 'error',
    message: 'Semua provider gagal. Link mungkin tidak didukung atau sudah expired.',
  });
}
