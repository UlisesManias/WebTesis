// Datos de la última versión y novedades, desde los releases públicos de este repositorio.
// Si la API de GitHub no responde, la página queda con el contenido escrito en el HTML.
const RELEASES_API = 'https://api.github.com/repos/UlisesManias/WebTesis/releases?per_page=5';

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' });

const toMB = (bytes) => `${Math.round(bytes / (1024 * 1024))} MB`;

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text; // textContent: las notas nunca se interpretan como HTML
  return node;
}

// Notas del release: las líneas "- texto" son viñetas; el resto, párrafos. Se omite el título "Novedades de...".
function renderNotes(body) {
  const fragment = document.createDocumentFragment();
  let list = null;
  for (const raw of (body || '').split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || /^novedades de/i.test(line)) continue;
    const bullet = line.match(/^[-*]\s+(.*)$/);
    if (bullet) {
      if (!list) { list = el('ul'); fragment.append(list); }
      list.append(el('li', '', bullet[1]));
    } else {
      list = null;
      fragment.append(el('p', '', line.replace(/^#+\s*/, '')));
    }
  }
  return fragment;
}

async function loadReleases() {
  const response = await fetch(RELEASES_API, { headers: { Accept: 'application/vnd.github+json' } });
  if (!response.ok) return;
  const releases = (await response.json()).filter((r) => !r.draft && !r.prerelease);
  if (!releases.length) return;

  const latest = releases[0];
  document.querySelectorAll('[data-version]').forEach((n) => { n.textContent = latest.tag_name.replace(/^v/i, ''); });
  document.querySelectorAll('[data-date]').forEach((n) => { n.textContent = formatDate(latest.published_at); });
  for (const asset of latest.assets) {
    document.querySelectorAll(`[data-size="${asset.name}"]`).forEach((n) => { n.textContent = toMB(asset.size); });
  }

  const list = document.querySelector('[data-releases]');
  list.replaceChildren(...releases.map((release, index) => {
    const item = el('li', 'release');
    const head = el('div', 'release__head');
    head.append(el('span', index === 0 ? 'tag tag--latest' : 'tag', release.tag_name),
      el('span', 'release__date', formatDate(release.published_at)));
    if (index === 0) {
      item.append(head, renderNotes(release.body));
    } else {
      // Las versiones anteriores, plegadas: sus notas pueden ser largas.
      const details = el('details', 'release__more');
      details.append(el('summary', '', 'Ver notas de la versión'), renderNotes(release.body));
      item.append(head, details);
    }
    return item;
  }));
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-year]').forEach((n) => { n.textContent = new Date().getFullYear(); });

  const targets = document.querySelectorAll('.section__head, .feature, .showcase, .download, .releases');
  targets.forEach((t) => t.classList.add('reveal'));
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }
  }, { rootMargin: '0px 0px -60px 0px' });
  targets.forEach((t) => observer.observe(t));

  loadReleases().catch(() => { /* sin API: queda el contenido del HTML */ });
});
