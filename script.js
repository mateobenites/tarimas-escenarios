const WA_NUMBER = '5491133320622';
const WA_DEFAULT = 'Hola, buenas. Quería consultar por el alquiler de una tarima para un evento.';

const waLink = (text) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;

/* ── Links directos ─────────────────────────────────────────────── */
document.querySelectorAll('[data-wa-default]').forEach((a) => {
  a.href = waLink(WA_DEFAULT);
  a.target = '_blank';
  a.rel = 'noopener';
});

/* ── Armador de consulta ────────────────────────────────────────── */
const form = document.getElementById('waForm');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const fecha = document.getElementById('fFecha').value;
  const rows = [
    ['Tipo de evento', document.getElementById('fTipo').value],
    ['Medida aproximada', document.getElementById('fMedida').value.trim()],
    ['Altura', document.getElementById('fAltura').value],
    ['Fecha', fecha ? fecha.split('-').reverse().join('/') : ''],
    ['Lugar', document.getElementById('fLugar').value.trim()],
  ].filter(([, v]) => v);

  const text = rows.length
    ? 'Hola, buenas. Quería consultar por el alquiler de una tarima.\n\n' +
      rows.map(([k, v]) => `• ${k}: ${v}`).join('\n') +
      '\n\n¡Gracias!'
    : WA_DEFAULT;

  window.open(waLink(text), '_blank', 'noopener');
});

/* ── Altura regulable ───────────────────────────────────────────── */
const range = document.getElementById('hRange');
const out = document.getElementById('hOut');
const use = document.getElementById('hUse');
const deck = document.getElementById('evDeck');
const legs = [document.getElementById('evLeg1'), document.getElementById('evLeg2'), document.getElementById('evLeg3')];
const dim = document.getElementById('evDim');
const tick = document.getElementById('evTick');

const GROUND = 300;
const DECK_T = 12;

const useCase = (h) => {
  if (h <= 0.45) return 'Ideal para mesas de panel y presentaciones en salones chicos.';
  if (h <= 0.75) return 'La altura más pedida para eventos corporativos y conferencias.';
  if (h <= 1.15) return 'Buena visibilidad desde el fondo del salón en auditorios grandes.';
  return 'Escenarios elevados para plenarios, shows y producciones con público de pie.';
};

function renderHeight() {
  const h = parseFloat(range.value);
  const topY = GROUND - h * 100;

  out.textContent = h.toFixed(2).replace('.', ',');
  use.textContent = useCase(h);
  range.style.setProperty('--pct', `${((h - 0.3) / 1.7) * 100}%`);

  deck.setAttribute('y', topY);
  legs.forEach((leg) => {
    leg.setAttribute('y', topY + DECK_T);
    leg.setAttribute('height', GROUND - topY - DECK_T);
  });
  dim.setAttribute('y2', topY);
  tick.setAttribute('y1', topY);
  tick.setAttribute('y2', topY);
}

range.addEventListener('input', renderHeight);
renderHeight();

/* ── Nav + botón flotante ───────────────────────────────────────── */
const nav = document.getElementById('nav');
const float = document.querySelector('.wafloat');
const contact = document.getElementById('contacto');

let contactVisible = false;
new IntersectionObserver(([entry]) => {
  contactVisible = entry.isIntersecting;
  updateChrome();
}, { threshold: 0.25 }).observe(contact);

function updateChrome() {
  nav.classList.toggle('is-stuck', window.scrollY > 8);
  float.classList.toggle('is-on', window.scrollY > window.innerHeight * 0.7 && !contactVisible);
}

addEventListener('scroll', updateChrome, { passive: true });
updateChrome();

/* ── Reveal ─────────────────────────────────────────────────────── */
const revealObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach((entry, i) => {
    if (!entry.isIntersecting) return;
    entry.target.style.transitionDelay = `${Math.min(i, 4) * 70}ms`;
    entry.target.classList.add('is-in');
    obs.unobserve(entry.target);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px' });

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));
