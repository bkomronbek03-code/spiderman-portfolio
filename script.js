/* ---------- Loader ---------- */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => loader.classList.add('hidden'), 500);
});

/* ---------- Custom cursor ---------- */
const cursor = document.getElementById('cursor');
let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
window.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
});
window.addEventListener('mousedown', () => cursor.classList.add('click'));
window.addEventListener('mouseup', () => cursor.classList.remove('click'));

/* ---------- Web-shooter click effect: a spider web flies in on click ---------- */
const webOverlay = document.getElementById('webOverlay');
let lastShot = 0;
window.addEventListener('click', e => {
  const now = Date.now();
  if (now - lastShot < 180) return;
  lastShot = now;
  spawnWebFly(e.clientX, e.clientY);
});

function spawnWebFly(x, y) {
  const web = document.createElement('img');
  web.src = 'spiderweb-cursor.png';
  web.className = 'web-fly';

  // fly in from a random screen edge toward the click point
  const edge = Math.floor(Math.random() * 4);
  let sx, sy;
  if (edge === 0) { sx = x; sy = -220; }
  else if (edge === 1) { sx = window.innerWidth + 220; sy = y; }
  else if (edge === 2) { sx = x; sy = window.innerHeight + 220; }
  else { sx = -220; sy = y; }

  web.style.left = sx + 'px';
  web.style.top = sy + 'px';
  webOverlay.appendChild(web);

  requestAnimationFrame(() => {
    web.style.left = x + 'px';
    web.style.top = y + 'px';
    web.classList.add('land');
  });

  setTimeout(() => {
    const impact = document.createElement('div');
    impact.className = 'web-impact';
    impact.style.left = x + 'px';
    impact.style.top = y + 'px';
    webOverlay.appendChild(impact);
    setTimeout(() => impact.remove(), 550);
  }, 480);

  setTimeout(() => web.classList.add('fade'), 460);
  setTimeout(() => web.remove(), 820);
}

/* ---------- Ambient spider-web canvas network ---------- */
const canvas = document.getElementById('webCanvas');
const ctx = canvas.getContext('2d');
let w, h, nodes = [];
const NODE_COUNT = 75;
const LINK_DIST = 170;

function resizeCanvas() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

for (let i = 0; i < NODE_COUNT; i++) {
  nodes.push({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.35
  });
}

function animateWeb() {
  ctx.clearRect(0, 0, w, h);
  nodes.forEach(n => {
    n.x += n.vx; n.y += n.vy;
    if (n.x < 0 || n.x > w) n.vx *= -1;
    if (n.y < 0 || n.y > h) n.vy *= -1;
  });
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < LINK_DIST) {
        ctx.strokeStyle = `rgba(224,33,46,${(1 - dist / LINK_DIST) * 0.22})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(animateWeb);
}
animateWeb();

/* ---------- Navbar scroll state ---------- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

/* ---------- Mobile burger menu ---------- */
const burger = document.getElementById('burger');
const navLinks = document.querySelector('.nav-links');
burger.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => navLinks.classList.remove('open'))
);

/* ---------- Scroll reveal ---------- */
const revealEls = document.querySelectorAll('.reveal');
const skillFills = document.querySelectorAll('.skill-fill');
const statNums = document.querySelectorAll('.stat-num');
let countersDone = false;

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');

      if (entry.target.querySelector('.skill-fill')) {
        const fill = entry.target.querySelector('.skill-fill');
        fill.style.width = fill.dataset.w + '%';
      }

      if (entry.target.classList.contains('about-stats') && !countersDone) {
        countersDone = true;
        animateCounters();
      }
    }
  });
}, { threshold: 0.25 });

revealEls.forEach(el => observer.observe(el));

function animateCounters() {
  statNums.forEach(num => {
    const target = parseInt(num.dataset.count, 10);
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 60));
    const tick = () => {
      current += step;
      if (current >= target) {
        num.textContent = target;
      } else {
        num.textContent = current;
        requestAnimationFrame(tick);
      }
    };
    tick();
  });
}

/* ---------- Hero image spotlight follows cursor ---------- */
const heroImageWrap = document.querySelector('.hero-image');
const spotlight = document.getElementById('spotlight');
if (heroImageWrap) {
  heroImageWrap.addEventListener('mousemove', e => {
    const rect = heroImageWrap.getBoundingClientRect();
    spotlight.style.left = (e.clientX - rect.left) + 'px';
    spotlight.style.top = (e.clientY - rect.top) + 'px';
  });
}

/* ---------- Occasional title glitch burst (comic-panel flair, not constant flicker) ---------- */
const glitchTitle = document.querySelector('.glitch-title');
if (glitchTitle) {
  setInterval(() => {
    glitchTitle.classList.add('burst');
    setTimeout(() => glitchTitle.classList.remove('burst'), 180);
  }, 5000);
}

/* ---------- Contact form ---------- */
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', e => {
  e.preventDefault();
  const btn = contactForm.querySelector('button');
  const original = btn.textContent;
  btn.textContent = 'Signal yuborildi! 🕸';
  btn.style.background = 'var(--red-2)';
  contactForm.reset();
  setTimeout(() => { btn.textContent = original; }, 2600);
});
