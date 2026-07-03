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
    // Circular shockwave from center — no scale bounce, pure flash
    const flash = document.createElement('div');
    flash.style.cssText = 'position:absolute;left:50%;top:50%;width:18px;height:18px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.92) 0%,rgba(255,255,255,.25) 55%,transparent 70%);transform:translate(-50%,-50%);pointer-events:none;';
    splash.appendChild(flash);
    gsap.to(flash, {
      width: 640, height: 640, opacity: 0,
      duration: .22, ease: 'power2.out',
      onComplete: () => flash.remove(),
    });

    // Bricks blast outward — biased downward so they arc toward the label
    const maxDist = Math.sqrt(10 * 10 + 10 * 10);
    cellMeta.forEach(({ div, dx, dy }) => {
      const dist  = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx) + (Math.random() - .5) * .5;
      const force = 280 + dist * 28 + Math.random() * 350;
      const drop  = 160 + Math.random() * 280; // pulls bricks toward label below
      const delay = .008 + (dist / maxDist) * .04 + Math.random() * .02;
      gsap.to(div, {
        x: Math.cos(angle) * force,
        y: Math.sin(angle) * force + drop,
        rotationZ: (Math.random() - .5) * 720,
        scale: Math.random() * .4 + .1,
        opacity: 0,
        duration: .65 + Math.random() * .4,
        ease: 'power1.out', // no spring
        delay,
      });
    });

    // Letters shatter when bricks reach them (~0.22s travel time)
    gsap.to(letters, {
      y: () => 90 + Math.random() * 200,
      x: () => (Math.random() - .5) * 260,
      rotationZ: () => (Math.random() - .5) * 130,
      opacity: 0,
      duration: () => .5 + Math.random() * .35,
      stagger: { each: .018, from: 'random' },
      ease: 'power2.in', // gravity feel
      delay: .22,
    });

    gsap.to(splash, {
      opacity: 0, duration: .28, delay: .72,
      onComplete: () => {
        splash.remove();
        sessionStorage.setItem('splash_done', '1');
      },
    });
  }, '+=1.1'); // slightly shorter hold
})();
