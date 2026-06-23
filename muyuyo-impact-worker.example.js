// Cloudflare Worker de ejemplo para guardar contadores en GitHub sin exponer el token en el HTML.
// Secrets requeridos: GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO.
// Variables opcionales: GITHUB_BRANCH=main, COUNTER_PATH=impact-data/menu-counters.json, ALLOWED_ORIGIN=*

const DEFAULT_COUNTERS = {
  page: 'menu-principal',
  updatedAt: null,
  totals: {
    'buenas-practicas': 0,
    'clasificacion-residuos': 0,
    'datos-bancarios': 0,
    'emergencias': 0,
    'reglas-parque': 0
  }
};

function cors(env) {
  return {
    'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN || '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
}

function json(body, env, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...cors(env) }
  });
}

function encodeBase64Utf8(value) {
  return btoa(unescape(encodeURIComponent(value)));
}

function decodeBase64Utf8(value) {
  return decodeURIComponent(escape(atob(value)));
}

async function github(env, path, init = {}) {
  const owner = env.GITHUB_OWNER;
  const repo = env.GITHUB_REPO;
  const branch = env.GITHUB_BRANCH || 'main';
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;
  return fetch(url, {
    ...init,
    headers: {
      'Accept': 'application/vnd.github+json',
      'Authorization': `Bearer ${env.GITHUB_TOKEN}`,
      'User-Agent': 'muyuyo-impact-counter',
      ...(init.headers || {})
    }
  });
}

async function readCounters(env) {
  const path = env.COUNTER_PATH || 'impact-data/menu-counters.json';
  const res = await github(env, path);
  if (res.status === 404) return { data: structuredClone(DEFAULT_COUNTERS), sha: null, path };
  if (!res.ok) throw new Error(`GitHub read failed: ${res.status}`);
  const file = await res.json();
  return { data: JSON.parse(decodeBase64Utf8(file.content.replace(/\n/g, ''))), sha: file.sha, path };
}

async function writeCounters(env, data, sha, path) {
  const branch = env.GITHUB_BRANCH || 'main';
  const res = await github(env, path, {
    method: 'PUT',
    body: JSON.stringify({
      message: `impact: update menu counters ${new Date().toISOString()}`,
      content: encodeBase64Utf8(JSON.stringify(data, null, 2) + '\n'),
      sha: sha || undefined,
      branch
    })
  });
  if (!res.ok) throw new Error(`GitHub write failed: ${res.status}`);
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') return new Response(null, { headers: cors(env) });
    try {
      const { data, sha, path } = await readCounters(env);
      if (request.method === 'GET') return json(data, env);
      if (request.method !== 'POST') return json({ error: 'Method not allowed' }, env, 405);
      const event = await request.json();
      const card = String(event.card || '');
      if (!Object.prototype.hasOwnProperty.call(data.totals, card)) return json({ error: 'Unknown card' }, env, 400);
      data.totals[card] += 1;
      data.updatedAt = new Date().toISOString();
      await writeCounters(env, data, sha, path);
      return json(data, env);
    } catch (error) {
      return json({ error: String(error && error.message || error) }, env, 500);
    }
  }
};
