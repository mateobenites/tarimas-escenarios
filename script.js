const WA_NUMBER = '5491133320622';
const WA_DEFAULT = 'Hola, buenas. Quería consultar por el alquiler de una tarima para un evento.';

const waLink = (text) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;

/* ── Links directos ─────────────────────────────────────────────── */
document.querySelectorAll('[data-wa-default]').forEach((a) => {
  a.href = waLink(WA_DEFAULT);
  a.target = '_blank';
  a.rel = 'noopener';
});

/* ── Plano: la leyenda y los puntos se resaltan juntos ─────────── */
const pins = document.querySelectorAll('.blueprint [data-pin]');

function highlightPin(n) {
  pins.forEach((el) => el.classList.toggle('is-on', el.dataset.pin === n));
}

pins.forEach((el) => {
  el.addEventListener('mouseenter', () => highlightPin(el.dataset.pin));
  el.addEventListener('mouseleave', () => highlightPin(null));
});

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

/* El logo del menú aparece recién cuando el de la portada sale de pantalla */
new IntersectionObserver(([entry]) => {
  nav.classList.toggle('hide-brand', entry.isIntersecting);
}, { rootMargin: '-74px 0px 0px' }).observe(document.querySelector('.hero__logo'));

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
