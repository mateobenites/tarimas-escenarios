const WA_NUMBER = '5491133320622';
const WA_DEFAULT = 'Hola, buenas. Quería consultar por el alquiler de una tarima para un evento.';

const waLink = (text) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;

/* ── Links directos ─────────────────────────────────────────────── */
document.querySelectorAll('[data-wa-default]').forEach((a) => {
  a.href = waLink(WA_DEFAULT);
  a.target = '_blank';
  a.rel = 'noopener';
});

/* ── Armado por capas ───────────────────────────────────────────── */
/* El escenario se dibuja en isométrica y cada tramo del scroll suma una capa:
   patas → estructura → piso → terminación → luces. Medidas reales del módulo
   (1,05 × 0,80 m), en una plataforma de 3 × 2 módulos. */
const build = document.getElementById('build');
const svg = document.getElementById('buildSvg');
const stepItems = [...document.querySelectorAll('#buildSteps .build__step')];
const buildNow = document.getElementById('buildNow');
const STEPS = 5;

const SVG_NS = 'http://www.w3.org/2000/svg';
const S = 92;            // px por metro
const H = 0.8;           // altura de la plataforma
const T = 0.06;          // espesor visual del piso
const MX = [0, 1.05, 2.1, 3.15];
const MY = [0, 0.8, 1.6];
const W = MX[3];
const D = MY[2];
const COS = Math.cos(Math.PI / 6);

const iso = (x, y, z) => [(x - y) * COS * S, (x + y) * 0.5 * S - z * S];
const pts = (list) => list.map((p) => iso(...p).map((n) => n.toFixed(1)).join(',')).join(' ');
const clamp01 = (n) => Math.min(1, Math.max(0, n));
const ease = (t) => 1 - Math.pow(1 - t, 3);
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

function el(tag, attrs, parent) {
  const node = document.createElementNS(SVG_NS, tag);
  for (const k in attrs) node.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(node);
  return node;
}

function line(a, b, cls, parent, width) {
  const [x1, y1] = iso(...a);
  const [x2, y2] = iso(...b);
  return el('line', { x1, y1, x2, y2, class: cls, 'stroke-width': width, 'stroke-linecap': 'round' }, parent);
}

/* Definiciones: sombra, luz y máscara de la grilla de piso */
const defs = el('defs', {}, svg);
defs.innerHTML = `
  <filter id="bsBlur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="14"/></filter>
  <radialGradient id="bsFade"><stop offset=".35" stop-color="#fff"/><stop offset="1" stop-color="#000"/></radialGradient>
  <mask id="bsMask"><ellipse cx="60" cy="110" rx="330" ry="190" fill="url(#bsFade)"/></mask>
  <linearGradient id="bsBeam" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#FFF4E6" stop-opacity=".24"/>
    <stop offset="1" stop-color="#FFF4E6" stop-opacity=".02"/>
  </linearGradient>
  <radialGradient id="bsPool"><stop offset="0" stop-color="#FFF4E6" stop-opacity=".34"/><stop offset="1" stop-color="#FFF4E6" stop-opacity="0"/></radialGradient>`;

/* Piso del salón */
const ground = el('g', { mask: 'url(#bsMask)' }, svg);
for (let x = -1.05; x <= W + 1.06; x += 0.525) line([x, -0.8, 0], [x, D + 0.8, 0], 'bs-grid', ground);
for (let y = -0.8; y <= D + 0.81; y += 0.4) line([-1.05, y, 0], [W + 1.05, y, 0], 'bs-grid', ground);
const shadow = el('polygon', {
  points: pts([[0, 0, 0], [W, 0, 0], [W, D, 0], [0, D, 0]]),
  fill: '#000', filter: 'url(#bsBlur)', opacity: 0,
}, svg);

/* Capa 1: patas regulables (crecen desde el piso) */
const legsG = el('g', {}, svg);
const legs = [];
MX.flatMap((x) => MY.map((y) => [x, y]))
  .sort((a, b) => a[0] + a[1] - (b[0] + b[1]))
  .forEach(([x, y]) => {
    const r = 0.08;
    el('polygon', { class: 'bs-plate', points: pts([[x - r, y, 0], [x, y - r, 0], [x + r, y, 0], [x, y + r, 0]]) }, legsG);
    line([x, y, 0], [x, y, 0.16], 'bs-metal', legsG, 2);
    legs.push({ x, y, node: line([x, y, 0.12], [x, y, 0.12], 'bs-metal', legsG, 4.2) });
  });

/* Capa 2: estructura de caño (bastidor + cruces) */
const frameG = el('g', {}, svg);
const zF = H - T - 0.02;
MX.forEach((x) => line([x, 0, zF], [x, D, zF], 'bs-metal', frameG, 2.6));
MY.forEach((y) => line([0, y, zF], [W, y, zF], 'bs-metal', frameG, 2.6));
for (let i = 0; i < 3; i++) {
  line([MX[i], D, 0.16], [MX[i + 1], D, zF - 0.02], 'bs-metal', frameG, 1.6);
  line([MX[i], 0, 0.16], [MX[i + 1], 0, zF - 0.02], 'bs-metal', frameG, 1.6);
}
for (let j = 0; j < 2; j++) {
  line([W, MY[j], 0.16], [W, MY[j + 1], zF - 0.02], 'bs-metal', frameG, 1.6);
  line([0, MY[j], 0.16], [0, MY[j + 1], zF - 0.02], 'bs-metal', frameG, 1.6);
}

/* Capa 3: módulos de fenólico, de atrás hacia adelante */
const deckG = el('g', {}, svg);
const tiles = [];
for (let j = 0; j < 2; j++) {
  for (let i = 0; i < 3; i++) tiles.push([i, j]);
}
tiles.sort((a, b) => a[0] + a[1] - (b[0] + b[1]));
const tileNodes = tiles.map(([i, j]) => {
  const g = el('g', {}, deckG);
  const g2 = 0.012;
  const x0 = MX[i] + g2, x1 = MX[i + 1] - g2, y0 = MY[j] + g2, y1 = MY[j + 1] - g2;
  el('polygon', { class: 'bs-tile-side', points: pts([[x1, y0, H], [x1, y1, H], [x1, y1, H - T], [x1, y0, H - T]]) }, g);
  el('polygon', { class: 'bs-tile-side', points: pts([[x0, y1, H], [x1, y1, H], [x1, y1, H - T], [x0, y1, H - T]]), opacity: 0.8 }, g);
  el('polygon', { class: 'bs-tile-top', points: pts([[x0, y0, H], [x1, y0, H], [x1, y1, H], [x0, y1, H]]) }, g);
  return g;
});

/* Capa 4: pollera, frentín y alfombra (se redibujan mientras bajan / se desenrollan) */
const finishG = el('g', {}, svg);
const skirtFront = el('polygon', { class: 'bs-skirt' }, finishG);
const skirtSide = el('polygon', { class: 'bs-skirt', 'fill-opacity': 0.85 }, finishG);
const pleatsG = el('g', {}, finishG);
const headerFront = el('polygon', { class: 'bs-header' }, finishG);
const headerSide = el('polygon', { class: 'bs-header' }, finishG);
const carpet = el('polygon', { class: 'bs-carpet' }, finishG);
const carpetEdge = el('polyline', { class: 'bs-edge' }, finishG);

/* Capa 5: luces */
const lightsG = el('g', { opacity: 0 }, svg);
[[0.55, 0.5], [1.58, 0.8], [2.6, 1.1]].forEach(([x, y], k) => {
  const [cx, cy] = iso(x, y, H);
  const sx = cx - 40 + k * 20;
  const sy = -232;
  const rx = 74, ry = 36;
  el('polygon', { points: `${sx - 7},${sy} ${sx + 7},${sy} ${cx + rx},${cy} ${cx - rx},${cy}`, fill: 'url(#bsBeam)', style: 'mix-blend-mode:screen' }, lightsG);
  el('ellipse', { cx, cy, rx: rx + 10, ry: ry + 6, fill: 'url(#bsPool)', style: 'mix-blend-mode:screen' }, lightsG);
  el('rect', { x: sx - 11, y: sy - 10, width: 22, height: 12, rx: 3, fill: '#2A2C33' }, lightsG);
  el('rect', { x: sx - 8, y: sy, width: 16, height: 2.5, rx: 1, fill: '#FFF4E6' }, lightsG);
});

/* Etiquetas técnicas, una por paso */
const calls = [
  { at: [W, D, 0.08], to: [-120, 34], text: ['Ajuste de nivel', 'por pata'] },
  { at: [0, 0, zF], to: [-70, -70], text: ['Caño de hierro', 'zincado'] },
  { at: [0.52, 0.4, H], to: [-110, -86], text: ['Fenólico 25 mm', '1,05 × 0,80 m'] },
  { at: [1.2, D, H * 0.45], to: [-150, 70], text: ['Pollera', 'negro mate'] },
  { at: [1.58, 0.8, H], to: [-170, -150], text: ['Memoria de cálculo', 'firmada'] },
].map(({ at, to, text }) => {
  const g = el('g', { class: 'bs-call' }, svg);
  const [ax, ay] = iso(...at);
  const bx = ax + to[0], by = ay + to[1];
  const right = to[0] > 0;
  const ex = bx + (right ? 46 : -46);
  el('polyline', { points: `${ax},${ay} ${bx},${by} ${ex},${by}` }, g);
  el('circle', { cx: ax, cy: ay, r: 3.2 }, g);
  const t = el('text', { x: ex + (right ? 8 : -8), y: by - 2, 'text-anchor': right ? 'start' : 'end' }, g);
  el('tspan', { x: t.getAttribute('x'), dy: 0 }, t).textContent = text[0];
  el('tspan', { x: t.getAttribute('x'), dy: 15 }, t).textContent = text[1];
  return g;
});

const layers = [legsG, frameG, deckG, finishG];

function drop(node, t, dist = 80) {
  const e = ease(t);
  node.setAttribute('opacity', e.toFixed(3));
  node.setAttribute('transform', reduceMotion ? '' : `translate(0 ${(-(1 - e) * dist).toFixed(1)})`);
}

function renderFinish(t) {
  const e = ease(t);
  finishG.setAttribute('opacity', t > 0 ? 1 : 0);
  const zb = H - H * e; // la pollera baja desde el borde del piso
  const o = 0.01;
  skirtFront.setAttribute('points', pts([[0, D + o, H], [W, D + o, H], [W, D + o, zb], [0, D + o, zb]]));
  skirtSide.setAttribute('points', pts([[W + o, 0, H], [W + o, D, H], [W + o, D, zb], [W + o, 0, zb]]));
  const hz = H - Math.min(0.12, H * e);
  headerFront.setAttribute('points', pts([[0, D + o, H], [W, D + o, H], [W, D + o, hz], [0, D + o, hz]]));
  headerSide.setAttribute('points', pts([[W + o, 0, H], [W + o, D, H], [W + o, D, hz], [W + o, 0, hz]]));

  pleatsG.textContent = '';
  if (e > 0.02) {
    for (let x = 0.18; x < W; x += 0.18) line([x, D + o, H - 0.12], [x, D + o, zb], 'bs-pleat', pleatsG);
    for (let y = 0.18; y < D; y += 0.18) line([W + o, y, H - 0.12], [W + o, y, zb], 'bs-pleat', pleatsG);
  }

  const cw = W * clamp01(t * 1.6 - 0.6); // la alfombra se desenrolla al final del tramo
  carpet.setAttribute('points', pts([[0, 0, H + 0.003], [cw, 0, H + 0.003], [cw, D, H + 0.003], [0, D, H + 0.003]]));
  carpetEdge.setAttribute('points', pts([[0, D + o, H], [W, D + o, H], [W + o, 0, H]]));
  carpetEdge.setAttribute('opacity', clamp01(t * 1.6 - 0.6));
}

let lastStep = -1;

function renderBuild() {
  const rect = build.getBoundingClientRect();
  const pinTop = parseFloat(getComputedStyle(build.firstElementChild).top) || 0;
  const span = build.offsetHeight - build.firstElementChild.offsetHeight;
  const p = clamp01((pinTop - rect.top) / span);
  const pos = p * STEPS;
  const local = (i) => clamp01((pos - i) / 0.8);

  const tLegs = ease(local(0));
  legs.forEach(({ x, y, node }) => {
    const [, y2] = iso(x, y, 0.12 + (zF - 0.12) * tLegs);
    node.setAttribute('y2', y2.toFixed(1));
  });
  shadow.setAttribute('opacity', (0.15 + 0.45 * local(2)).toFixed(3));

  drop(frameG, local(1), 60);
  tileNodes.forEach((g, k) => drop(g, clamp01(local(2) * 1.7 - k * 0.14), 90));
  renderFinish(local(3));
  // con la pollera puesta, la estructura queda oculta: se apaga para que no asome en las esquinas
  const hidden = 1 - ease(local(3));
  legsG.setAttribute('opacity', (Math.max(0.35, tLegs) * hidden).toFixed(3));
  frameG.setAttribute('opacity', (ease(local(1)) * hidden).toFixed(3));
  lightsG.setAttribute('opacity', ease(local(4)).toFixed(3));

  const step = Math.min(STEPS - 1, Math.floor(pos));
  if (step !== lastStep) {
    lastStep = step;
    layers.forEach((g, i) => g.classList.toggle('is-act', i === step));
    calls.forEach((g, i) => g.classList.toggle('is-on', i === step));
    stepItems.forEach((li, i) => {
      li.classList.toggle('is-on', i === step);
      li.querySelector('button').setAttribute('aria-current', i === step ? 'step' : 'false');
    });
    buildNow.textContent = String(step + 1).padStart(2, '0');
  }
  build.style.setProperty('--p', ((step + clamp01(pos - step)) / STEPS).toFixed(3));
}

stepItems.forEach((li) => {
  li.querySelector('button').addEventListener('click', (e) => {
    const i = Number(e.currentTarget.dataset.go);
    const pinTop = parseFloat(getComputedStyle(build.firstElementChild).top) || 0;
    const span = build.offsetHeight - build.firstElementChild.offsetHeight;
    const target = build.getBoundingClientRect().top + scrollY - pinTop + span * ((i + 0.85) / STEPS);
    scrollTo({ top: target, behavior: reduceMotion ? 'auto' : 'smooth' });
  });
});

let buildTick = false;
const queueBuild = () => {
  if (buildTick) return;
  buildTick = true;
  requestAnimationFrame(() => { buildTick = false; renderBuild(); });
};
addEventListener('scroll', queueBuild, { passive: true });
const compact = matchMedia('(max-width: 760px)');
const fitBuild = () => svg.setAttribute('viewBox', compact.matches ? '-150 -255 420 485' : '-230 -250 560 500');
compact.addEventListener('change', fitBuild);
fitBuild();
addEventListener('resize', queueBuild);
renderBuild();

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
