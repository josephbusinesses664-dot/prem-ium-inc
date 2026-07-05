// Heart brick splash — shatter exit (GPU-cheap: only heart cells, single tweens)
(function () {
  if (sessionStorage.getItem('splash_done') ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.getElementById('splash')?.remove();
    return;
  }

  const HEART = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,1,1,1,0,0,0,0,0,0,0,1,1,1,0,0,0,0],
    [0,0,0,1,1,1,1,1,0,0,0,0,0,1,1,1,1,1,0,0,0],
    [0,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
    [0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
    [0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
    [0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0],
    [0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  ];

  const splash = document.getElementById('splash');
  if (!splash) return;
  const grid  = document.getElementById('splash-grid');
  const label = document.getElementById('splash-label');
  const cells = [], meta = [];

  // Only create the ~150 lit cells (positioned on the 21×21 grid) — not all 441.
  HEART.forEach((row, r) => {
    row.forEach((on, c) => {
      if (!on) return;
      const div = document.createElement('div');
      div.className = 'brick';
      div.style.gridColumn = c + 1;
      div.style.gridRow = r + 1;
      grid.appendChild(div);
      cells.push(div);
      meta.push({ dx: c - 10, dy: r - 8 });
    });
  });

  // Per-letter spans so the label can shatter independently
  const raw = label.textContent;
  label.textContent = '';
  raw.split('').forEach(ch => {
    const s = document.createElement('span');
    s.style.cssText = 'display:inline-block;background:linear-gradient(135deg,#8b5cf6,#ec4899);-webkit-background-clip:text;-webkit-text-fill-color:transparent;';
    s.textContent = ch === ' ' ? ' ' : ch;
    label.appendChild(s);
  });
  const letters = label.querySelectorAll('span');

  // Precompute each brick's shatter vector once (so the exit is a single tween)
  const maxDist = Math.sqrt(200);
  meta.forEach(m => {
    const dist  = Math.sqrt(m.dx * m.dx + m.dy * m.dy);
    const angle = Math.atan2(m.dy, m.dx) + (Math.random() - .5) * .45;
    const force = 220 + dist * 22 + Math.random() * 280;
    m.tx = Math.cos(angle) * force;
    m.ty = Math.sin(angle) * force + 120 + Math.random() * 220;
    m.rot = (Math.random() - .5) * 540;
    m.sc = Math.random() * .35 + .08;
    m.dur = 1.1 + Math.random() * .7;
    m.delay = .01 + (dist / maxDist) * .055 + Math.random() * .025;
  });

  gsap.set(cells, { scale: 0, opacity: 0, force3D: true });
  const tl = gsap.timeline();

  // ── Build (single tween, staggered from center) ──
  tl.to(cells, {
    scale: 1, opacity: 1,
    duration: .55, force3D: true,
    stagger: { amount: 1.6, from: 'center', grid: [21, 21] },
    ease: 'back.out(1.4)',
  })
  .fromTo(label,
    { opacity: 0, scale: .85 },
    { opacity: 1, scale: 1, duration: .55, ease: 'power2.out' },
    '-=.25'
  )
  // ── Shatter (single tween for all bricks, function-based per cell) ──
  .add(() => {
    const gr = grid.getBoundingClientRect();
    const sr = splash.getBoundingClientRect();
    const cx = gr.left + gr.width / 2 - sr.left;
    const cy = gr.top + gr.height / 2 - sr.top;

    const flash = document.createElement('div');
    flash.style.cssText = `position:absolute;left:${cx}px;top:${cy}px;width:20px;height:20px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.95) 0%,rgba(255,255,255,.3) 50%,transparent 72%);transform:translate(-50%,-50%);pointer-events:none;`;
    splash.appendChild(flash);
    gsap.to(flash, { width: 640, height: 640, opacity: 0, duration: .45, ease: 'power2.out', onComplete: () => flash.remove() });

    gsap.to(cells, {
      x: i => meta[i].tx,
      y: i => meta[i].ty,
      rotationZ: i => meta[i].rot,
      scale: i => meta[i].sc,
      opacity: 0,
      duration: i => meta[i].dur,
      delay: i => meta[i].delay,
      ease: 'power2.out',
      force3D: true,
    });

    gsap.to(letters, {
      y: () => 80 + Math.random() * 180,
      x: () => (Math.random() - .5) * 240,
      rotationZ: () => (Math.random() - .5) * 110,
      opacity: 0,
      duration: () => .75 + Math.random() * .5,
      stagger: { each: .022, from: 'random' },
      ease: 'power2.in',
      delay: .35,
    });

    gsap.to(splash, {
      opacity: 0, duration: .4, delay: 1.3,
      onComplete: () => { splash.remove(); sessionStorage.setItem('splash_done', '1'); },
    });
  }, '+=1.1');
})();
