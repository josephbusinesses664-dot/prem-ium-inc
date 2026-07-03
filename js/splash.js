// Diamond brick splash — punch-through exit
(function () {
  if (sessionStorage.getItem('splash_done')) {
    document.getElementById('splash')?.remove();
    return;
  }

  const SIZE = 21, MID = 10;
  const SHAPE = Array.from({length: SIZE}, (_, r) =>
    Array.from({length: SIZE}, (_, c) => Math.abs(r - MID) + Math.abs(c - MID) <= MID)
  );

  const splash = document.getElementById('splash');
  if (!splash) return;

  const grid = document.getElementById('splash-grid');
  const label = document.getElementById('splash-label');
  const cells = [];

  // Track logical grid positions for scatter math
  const cellMeta = [];
  SHAPE.forEach((row, r) => {
    row.forEach((on, c) => {
      const div = document.createElement('div');
      div.className = 'brick';
      if (!on) div.style.opacity = '0';
      grid.appendChild(div);
      if (on) {
        cells.push(div);
        cellMeta.push({ div, r, c, dx: c - MID, dy: r - MID });
      }
    });
  });

  gsap.set(cells, { scale: 0, opacity: 0 });
  const tl = gsap.timeline();

  // ── Build animation ──────────────────────────────────
  tl.to(cells, {
    scale: 1, opacity: 1,
    duration: .45,
    stagger: { amount: 1.5, from: 'center', grid: 'auto' },
    ease: 'back.out(1.6)',
  })
  .fromTo(label,
    { opacity: 0, scale: .85 },
    { opacity: 1, scale: 1, duration: .5, ease: 'power2.out' },
    '-=.2'
  )

  // ── Hold, then PUNCH ─────────────────────────────────
  .add(() => {
    // Impact shake — grid jolts
    gsap.timeline()
      .to(grid, { scale: 1.12, duration: .07, ease: 'power4.out' })
      .to(grid, { scale: 0.95, duration: .06, ease: 'power4.in' })
      .to(grid, { scale: 1.0,  duration: .05 });

    // Label blasts away upward
    gsap.to(label, {
      y: -120, scale: 1.4, opacity: 0,
      duration: .3, ease: 'power3.out', delay: .08
    });

    // Compute max distance for stagger timing
    const maxDist = Math.sqrt(MID * MID + MID * MID);

    cellMeta.forEach(({ div, dx, dy }) => {
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Scatter angle = away from center with some randomness
      const angle = Math.atan2(dy, dx) + (Math.random() - .5) * .7;
      // Force scales with distance from center (outer bricks fly farther)
      const force = 180 + dist * 28 + Math.random() * 300;
      // Gravity bias — everything also pulls downward
      const gravity = 300 + Math.random() * 500;

      // Center cells burst first (delay 0), outer cells just behind
      const delay = .05 + (dist / maxDist) * .06 + Math.random() * .04;

      gsap.to(div, {
        x: Math.cos(angle) * force,
        y: Math.sin(angle) * force + gravity,
        rotationZ: (Math.random() - .5) * 900,
        scale: Math.random() * .6 + .2,
        opacity: 0,
        duration: .5 + Math.random() * .25,
        ease: 'power2.in',
        delay,
      });
    });

    // Dissolve overlay after bricks are flying
    gsap.to(splash, {
      opacity: 0, duration: .35, delay: .45,
      onComplete: () => {
        splash.remove();
        sessionStorage.setItem('splash_done', '1');
      }
    });

  }, '+=1.0'); // hold 1 second after build completes
})();
