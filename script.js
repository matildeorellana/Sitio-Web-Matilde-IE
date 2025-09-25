/* Casita: click → tope */
(function () {
    const home = document.getElementById('home-slot');
    if (!home) return;
    home.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
})();

/* Parallax casita */
(function () {
    const logoSlot = document.getElementById('home-slot');
    function onScroll() {
        if (!logoSlot) return;
        const doc = document.documentElement;
        const y = window.scrollY || doc.scrollTop || 0;
        const maxScroll = Math.max(1, doc.scrollHeight - doc.clientHeight);
        const p = Math.min(1, Math.max(0, y / maxScroll));
        const maxShift = (window.innerHeight * 0.5) - 24;
        logoSlot.style.setProperty('--parallax-y', `${p * maxShift}px`);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    (document.readyState === 'loading') ? document.addEventListener('DOMContentLoaded', onScroll) : onScroll();
})();

/* Paneles (DEL CURSO / WIKI) */
(function () {
    function togglePanel(id) {
        const el = document.querySelector(id);
        if (!el) return;
        el.classList.toggle('open');
    }
    document.querySelectorAll('.panel-header .pill').forEach(btn => {
        btn.addEventListener('click', () => togglePanel(btn.dataset.target));
    });
})();

/* Galería → Visor (IMAGEN 600x600 + botón arriba) */
(function () {
    const gallery = document.getElementById('gallery');
    const viewer = document.getElementById('viewer');
    const stage = document.getElementById('viewer-stage');
    const titleEl = document.getElementById('viewer-title');
    if (!gallery || !viewer || !stage || !titleEl) return;

    gallery.addEventListener('click', (e) => {
        const item = e.target.closest('.thumb');
        if (!item) return;

        viewer.classList.remove('viewer-collapsed');

        const title = item.dataset.title || 'Proyecto';
        const link = item.dataset.link || '#';
        const img = item.dataset.img;

        titleEl.innerHTML = `
      <a class="pill navy pill-link" href="${link}" target="_blank" rel="noopener noreferrer">
        Abrir en p5.js — ${title}
      </a>
    `;

        stage.innerHTML = '';
        const imgEl = document.createElement('img');
        imgEl.src = img; imgEl.alt = title; imgEl.className = 'viewer-image';
        stage.appendChild(imgEl);

        viewer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
})();

/* Pelotas rebotando — 10 bolas, 2 tonos, mismo tamaño */
(function () {
    const canvas = document.getElementById('balls');
    const frame = document.getElementById('frame');
    if (!canvas || !frame) return;
    const ctx = canvas.getContext('2d');

    const balls = [];
    const COLORS = ['#0050bf', 'rgba(5,32,80,.60)'];
    const RADIUS = 26;

    function resizeCanvas() {
        const rect = frame.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
    }

    function spawnBalls(n = 10) {
        balls.length = 0;
        const pad = 10;
        for (let i = 0; i < n; i++) {
            balls.push({
                r: RADIUS,
                x: pad + RADIUS + Math.random() * (canvas.width - (pad + RADIUS) * 2),
                y: pad + RADIUS + Math.random() * (canvas.height - (pad + RADIUS) * 2),
                vx: (Math.random() * 1.8 + 0.8) * (Math.random() < .5 ? -1 : 1),
                vy: (Math.random() * 1.8 + 0.8) * (Math.random() < .5 ? -1 : 1),
                c: COLORS[i % COLORS.length]
            });
        }
    }

    function step() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (const b of balls) {
            const minX = b.r + 6, maxX = canvas.width - b.r - 6;
            const minY = b.r + 6, maxY = canvas.height - b.r - 6;

            b.x += b.vx; b.y += b.vy;

            if (b.x < minX) { b.x = minX; b.vx *= -1; }
            if (b.x > maxX) { b.x = maxX; b.vx *= -1; }
            if (b.y < minY) { b.y = minY; b.vy *= -1; }
            if (b.y > maxY) { b.y = maxY; b.vy *= -1; }

            ctx.globalAlpha = 1; ctx.fillStyle = b.c;
            ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.fill();
        }
        requestAnimationFrame(step);
    }

    function init() { resizeCanvas(); spawnBalls(10); step(); }
    window.addEventListener('resize', () => { resizeCanvas(); spawnBalls(10); });
    window.addEventListener('load', init);
})();

// Barra derecha con histéresis: más tolerante
(function () {
  const rail = document.getElementById('top-rail');
  if (!rail) return;

  let enterT = null, leaveT = null;
  const open  = () => rail.classList.add('open');
  const close = () => rail.classList.remove('open');

  rail.addEventListener('mouseenter', () => {
    clearTimeout(leaveT);
    enterT = setTimeout(open, 60);   // abre más rápido
  });
  rail.addEventListener('mouseleave', () => {
    clearTimeout(enterT);
    leaveT = setTimeout(close, 280); // tarda más en cerrarse
  });

  // Accesible con teclado
  rail.addEventListener('focusin', open);
  rail.addEventListener('focusout', (e) => {
    if (!rail.contains(e.relatedTarget)) close();
  });
})();


/* CONTACTO — animación de iconos */
(function () {
    const footer = document.getElementById('contacto');
    if (!footer) return;
    const btn = footer.querySelector('.cta');
    if (!btn) return;

    const openIcons = () => footer.classList.add('footer-open');

    btn.addEventListener('click', () => {
        footer.classList.toggle('footer-open');
    });

    document.querySelectorAll('a[href="#contacto"]').forEach(a => {
        a.addEventListener('click', () => setTimeout(openIcons, 300));
    });
})();

// === HERO IZQUIERDO: Fuegos artificiales (mate, colores del sitio) ===
(function () {
  const slot = document.getElementById('p5-hero-1');
  if (!slot) return;

  // Colores desde :root
  const root = getComputedStyle(document.documentElement);
  const BLUE_HEX = (root.getPropertyValue('--blue') || '#0050bf').trim();
  const NAVY_HEX = (root.getPropertyValue('--navy') || '#0b2d6a').trim();

  function hexToRgb(hex){
    const m = hex.replace('#','').match(/.{1,2}/g);
    const [r,g,b] = (m||['05','20','50']).map(h=>parseInt(h,16));
    return {r,g,b};
  }
  const BLUE = hexToRgb(BLUE_HEX);
  const NAVY = hexToRgb(NAVY_HEX);
  const PALETTE = [BLUE, NAVY];

  // Canvas DPR-aware
  const canvas = document.createElement('canvas');
  canvas.className = 'p5-canvas';
  slot.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  function resize() {
    const r = slot.getBoundingClientRect();
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    canvas.width = Math.floor(r.width * dpr);
    canvas.height = Math.floor(r.height * dpr);
    canvas.style.width = r.width + 'px';
    canvas.style.height = r.height + 'px';
    ctx.setTransform(1,0,0,1,0,0);
    ctx.scale(dpr, dpr);
  }
  resize();
  window.addEventListener('resize', resize);

  // Parámetros (grande pero mate)
  const particles = [];
  const TWO_PI = Math.PI * 2;
  const BASE_SPEED = 3.4;
  const FRICTION   = 0.985;
  const GRAVITY    = 0.045;
  const SHRINK     = 0.986;

  function spawnExplosion(x, y) {
    const count = 46 + Math.floor(Math.random() * 22); // 46..67
    for (let i = 0; i < count; i++) {
      const ang  = (i / count) * TWO_PI + Math.random() * 0.18;
      const spd  = BASE_SPEED * (0.85 + Math.random() * 0.7);
      const r0   = 5 + Math.random() * 7;
      const life = 78 + Math.floor(Math.random()*32);
      const col  = PALETTE[Math.random() < 0.5 ? 0 : 1]; // azul o navy

      particles.push({
        x, y,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        r: r0,
        life,
        ttl: life,
        col
      });
    }
  }

  let lastSpawn = 0;
  function maybeSpawn(now) {
    const interval = 560 + Math.random()*620;
    if (now - lastSpawn > interval) {
      const b = slot.getBoundingClientRect();
      const padX = b.width * 0.18;
      const padY = b.height * 0.22;
      const x = padX + Math.random() * (b.width  - padX*2);
      const y = padY + Math.random() * (b.height - padY*2);
      spawnExplosion(x, y);
      lastSpawn = now;
    }
  }

  function fillRadial(x,y,r, rgb, alphaCenter, alphaEdge){
    const g = ctx.createRadialGradient(x,y,0, x,y,r);
    g.addColorStop(0.0, `rgba(${rgb.r},${rgb.g},${rgb.b},${alphaCenter})`);
    g.addColorStop(0.7, `rgba(${rgb.r},${rgb.g},${rgb.b},${alphaCenter*0.45})`);
    g.addColorStop(1.0, `rgba(${rgb.r},${rgb.g},${rgb.b},${alphaEdge})`);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x,y,r,0,TWO_PI);
    ctx.fill();
  }

  function tick(now = 0) {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;

    // Trail sutil (no aditivo → no “neón”)
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.fillRect(0, 0, w, h);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.vx *= FRICTION;
      p.vy = p.vy * FRICTION + GRAVITY;
      p.x += p.vx;
      p.y += p.vy;
      p.r *= SHRINK;
      p.life--;

      const alpha = Math.max(0, p.life / p.ttl);
      // círculo mate
      fillRadial(p.x, p.y, Math.max(1, p.r), p.col, 0.85*alpha, 0);

      if (p.life <= 0 || p.r < 0.8) particles.splice(i, 1);
    }

    maybeSpawn(now);
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();

/* === HERO DERECHO: Cascada vertical (6–7 columnas, hover agranda) === */
(function () {
    const slot = document.getElementById('p5-hero-2');
    if (!slot) return;

    const COLS = 7, PER_COL = 16, BASE_R = 7, VAR_R = 4;
    const MIN_V = 0.8, MAX_V = 2, HOVER_BOOST = 1.4, INFLUENCE = 90;

    const canvas = document.createElement('canvas');
    canvas.className = 'p5-canvas'; slot.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    let W = 0, H = 0, DPR = 1; const cols = [];
    function rand(a, b) { return a + Math.random() * (b - a); }

    function resize() {
        const r = slot.getBoundingClientRect(); DPR = Math.max(1, window.devicePixelRatio || 1);
        canvas.width = Math.floor(r.width * DPR); canvas.height = Math.floor(r.height * DPR);
        canvas.style.width = r.width + 'px'; canvas.style.height = r.height + 'px';
        ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.scale(DPR, DPR);
        W = r.width; H = r.height; initColumns();
    }
    window.addEventListener('resize', resize);

    function initColumns() {
        cols.length = 0;
        const gap = W / (COLS + 1);
        for (let c = 0; c < COLS; c++) {
            const x = gap * (c + 1);
            const speed = rand(MIN_V, MAX_V) * (0.9 + 0.2 * Math.sin(c * 1.3));
            const items = [];
            for (let i = 0; i < PER_COL; i++) {
                items.push({ y: rand(-H, H), r: BASE_R + rand(-VAR_R, VAR_R), v: speed * rand(0.85, 1.15), a: rand(0.35, 0.9) });
            }
            cols.push({ x, items });
        }
    }

    let mouseX = null;
    slot.addEventListener('mousemove', e => {
        const rect = slot.getBoundingClientRect(); mouseX = e.clientX - rect.left;
    });
    slot.addEventListener('mouseleave', () => { mouseX = null; });

    function drawDisc(x, y, r, alpha) {
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0.0, `rgba(255,255,255,${alpha})`);
        g.addColorStop(0.7, `rgba(255,255,255,${alpha * 0.5})`);
        g.addColorStop(1.0, `rgba(255,255,255,0)`);
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    }

    function tick() {
        ctx.globalCompositeOperation = 'source-over';
        ctx.clearRect(0, 0, W, H);

        let boostIndex = -1, boostK = 0;
        if (mouseX != null) {
            let bestD = Infinity;
            cols.forEach((col, i) => {
                const d = Math.abs(mouseX - col.x);
                if (d < bestD) { bestD = d; boostIndex = i; }
            });
            boostK = Math.max(0, 1 - (bestD / INFLUENCE));
        }

        cols.forEach((col, i) => {
            const factor = (i === boostIndex) ? (1 + HOVER_BOOST * boostK) : 1;
            col.items.forEach(p => {
                p.y += p.v;
                if (p.y - (BASE_R + VAR_R) * 2 > H) { p.y = -rand(10, H * 0.3); p.a = rand(0.35, 0.9); }
                drawDisc(col.x, p.y, p.r * factor, p.a);
            });
        });

        requestAnimationFrame(tick);
    }

    resize(); initColumns(); requestAnimationFrame(tick);
})();

