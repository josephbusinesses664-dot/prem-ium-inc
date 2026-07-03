// Diamond brick splash animation — runs once per session
(function () {
  if (sessionStorage.getItem('splash_done')) {
    document.getElementById('splash')?.remove();
    return;
  }

  // 21×21 pixel-art diamond (Manhattan distance from center)
  const SIZE = 21, MID = 10;
  const SHAPE = Array.from({length: SIZE}, (_, r) =>
    Array.from({length: SIZE}, (_, c) => Math.abs(r - MID) + Math.abs(c - MID) <= MID)
  );

  const splash = document.getElementById('splash');
  if (!splash) return;

  const grid = document.getElementById('splash-grid');
  const label = document.getElementById('splash-label');
  const cells = [];

  SHAPE.forEach((row) => {
    row.forEach((on) => {
      const div = document.createElement('div');
      div.className = 'brick';
      if (!on) div.style.opacity = '0';
      grid.appendChild(div);
      if (on) cells.push(div);
    });
  });

  gsap.set(cells, { scale: 0, opacity: 0 });
  const tl = gsap.timeline();

  tl.to(cells, {
    scale: 1, opacity: 1,
    duration: .45,
    stagger: { amount: 1.5, from: 'center', grid: 'auto' },
    ease: 'back.out(1.6)',
  })
  .fromTo(label, { opacity: 0, scale: .85 }, { opacity: 1, scale: 1, duration: .5, ease: 'power2.out' }, '-=.2')
  .to(splash, {
    opacity: 0, duration: .6, ease: 'power2.in',
    onComplete: () => {
      splash.remove();
      sessionStorage.setItem('splash_done', '1');
    }
  }, '+=.9');
})();
