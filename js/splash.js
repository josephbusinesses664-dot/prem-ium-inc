// Heart brick splash — shatter exit
(function () {
  if (sessionStorage.getItem('splash_done')) {
    document.getElementById('splash')?.remove();
    return;
  }

  const HEART = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,1,1,1,0,0,0,1,1,1,0,0,0,1,1,1,0,0,0,0],
    [0,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,0,0,0],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
    [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
    [0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0],
    [0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0],
    [0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
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
  const cells = [], cellMeta = [];

  HEART.forEach((row, r) => {
    row.forEach((on, c) => {
      const div = document.createElement('div');
      div.className = 'brick';
      if (!on) div.style.opacity = '0';
      grid.appendChild(div);
      if (on) {
        cells.push(div);
        cellMeta.push({ div, dx: c - 9, dy: r - 6 });
      }
    });
  });

  // Split label into per-letter spans so they can shatter independently
  const raw = label.textContent;
  label.textContent = '';
  raw.split('').forEach(ch => {
    const s = document.createElement('span');
    s.style.cssText = 'display:inline-block;background:linear-gradient(135deg,#8b5cf6,#ec4899);-webkit-background-clip:text;-webkit-text-fill-color:transparent;';
    s.textContent = ch === ' ' ? ' ' : ch;
    label.appendChild(s);
  });
  const letters = label.querySelectorAll('span');

  gsap.set(cells, { scale: 0, opacity: 0 });
  const tl = gsap.timeline();

  // ── Build ─────────────────────────────────────────────
  tl.to(cells, {
    scale: 1, opacity: 1,
    duration: .55,
    stagger: { amount: 1.8, from: 'center', grid: 'auto' },
    ease: 'back.out(1.4)',
  })
  .fromTo(label,
    { opacity: 0, scale: .85 },
    { opacity: 1, scale: 1, duration: .55, ease: 'power2.out' },
    '-=.25'
  )

  // ── SHATTER ───────────────────────────────────────────
  .add(() => {
    // Flash origin: center of the grid element (not viewport center —
    // the label below shifts the grid above the 50% mark)
    const gr = grid.getBoundingClientRect();
    const sr = splash.getBoundingClientRect();
    const cx = gr.left + gr.width  / 2 - sr.left;
    const cy = gr.top  + gr.height / 2 - sr.top;

    const flash = document.createElement('div');
    flash.style.cssText = `position:absolute;left:${cx}px;top:${cy}px;width:20px;height:20px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.95) 0%,rgba(255,255,255,.3) 50%,transparent 72%);transform:translate(-50%,-50%);pointer-events:none;`;
    splash.appendChild(flash);
    gsap.to(flash, {
      width: 700, height: 700, opacity: 0,
      duration: .45, ease: 'power2.out',
      onComplete: () => flash.remove(),
    });

    // Bricks blast outward — biased downward so they arc toward the label
    const maxDist = Math.sqrt(10 * 10 + 10 * 10);
    cellMeta.forEach(({ div, dx, dy }) => {
      const dist  = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx) + (Math.random() - .5) * .45;
      const force = 220 + dist * 22 + Math.random() * 280;
      const drop  = 120 + Math.random() * 220;
      const delay = .01 + (dist / maxDist) * .055 + Math.random() * .025;
      gsap.to(div, {
        x: Math.cos(angle) * force,
        y: Math.sin(angle) * force + drop,
        rotationZ: (Math.random() - .5) * 540,
        scale: Math.random() * .35 + .08,
        opacity: 0,
        duration: 1.1 + Math.random() * .7,  // slower, smoother
        ease: 'power2.out',                   // decelerates gracefully
        delay,
      });
    });

    // Letters shatter when bricks reach the label area
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
      onComplete: () => {
        splash.remove();
        sessionStorage.setItem('splash_done', '1');
      },
    });
  }, '+=1.1');
})();
