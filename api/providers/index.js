const { bypass: providerBypassLinks } = require('./bypasslinks');
const { bypass: providerIzen }        = require('./izen');
const { bypass: providerBypassVip }   = require('./bypassvip');
const { withTimeout }                 = require('../utils/timeout');

const PROVIDERS = [
  { name: 'bypass-links.com', fn: providerBypassLinks },
  { name: 'bypass.vip',       fn: providerBypassVip },
  { name: 'izen.lol',         fn: providerIzen },
];

async function runProviders(url) {
  for (const prov of PROVIDERS) {
    try {
      const result = await withTimeout(prov.fn(url), 12000);
      if (result && result.success) return result;
    } catch (_) { continue; }
  }
  return { success: false };
}

module.exports = { runProviders };
