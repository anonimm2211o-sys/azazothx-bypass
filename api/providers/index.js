import providerBypassLinks from './bypasslinks.js';
import providerIzen from './izen.js';
import providerBypassVip from './bypassvip.js';
import { withTimeout } from '../utils/timeout.js';

// Urutan: yang paling cepet / paling reliable duluan
const PROVIDERS = [
  { name: 'bypass-links.com', fn: providerBypassLinks },
  { name: 'bypass.vip',       fn: providerBypassVip },
  { name: 'izen.lol',         fn: providerIzen },
];

export async function runProviders(url) {
  for (const prov of PROVIDERS) {
    try {
      const result = await withTimeout(prov.fn(url), 12000);
      if (result?.success) {
        console.log(`[${prov.name}] ✅ ${result.destination}`);
        return result;
      }
      console.log(`[${prov.name}] ❌ failed`);
    } catch (err) {
      console.log(`[${prov.name}] ❌ ${err.message}`);
    }
  }
  return { success: false };
}
