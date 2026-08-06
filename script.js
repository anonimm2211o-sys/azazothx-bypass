const input  = document.getElementById('urlInput');
const btn    = document.getElementById('bypassBtn');
const result = document.getElementById('result');
const spinner = document.getElementById('spinner');

function showResult(type, html) {
  result.className = `result ${type}`;
  result.innerHTML = html;
  result.classList.remove('hidden');
}

function setLoading(state) {
  btn.disabled = state;
  btn.textContent = state ? 'Bypassing...' : 'Bypass';
  spinner.classList.toggle('hidden', !state);
  if (state) result.classList.add('hidden');
}

async function doBypass() {
  const url = input.value.trim();
  if (!url) {
    showResult('error', '<span class="label">Error</span>URL cannot be empty.');
    return;
  }

  try { new URL(url); } catch (_) {
    showResult('error', '<span class="label">Error</span>Not a valid URL.');
    return;
  }

  setLoading(true);

  try {
    const resp = await fetch(`/api/bypass?url=${encodeURIComponent(url)}`);
    const data = await resp.json();

    if (data.status === 'success') {
      showResult('success', `
        <span class="label">Bypassed via ${data.source}</span>
        <a href="${data.destination}" target="_blank" rel="noopener noreferrer">${data.destination}</a>
      `);
    } else {
      showResult('error', `<span class="label">Failed</span>${data.message}`);
    }
  } catch (_) {
    showResult('error', '<span class="label">Error</span>Request failed. Check your connection.');
  } finally {
    setLoading(false);
  }
}

btn.addEventListener('click', doBypass);
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') doBypass();
});
