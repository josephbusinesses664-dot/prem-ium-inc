// Heart brick splash animation — runs once per session
(function () {
  if (sessionStorage.getItem('splash_done')) {
    document.getElementById('splash')?.remove();
    return;
  }

  // 21×21 pixel-art heart (1 = filled brick)
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

  const grid = document.getElementById('splash-grid');
  const label = document.getElementById('splash-label');
  const cells = [];

  HEART.forEach((row, r) => {
    row.forEach((cell, c) => {
      const div = document.createElement('div');
      div.className = 'brick';
      div.dataset.heart = cell;
      if (!cell) div.style.opacity = '0';
      grid.appendChild(div);
      if (cell) cells.push(div);
    });
  });

  // GSAP heart animation
  gsap.set(cells, { scale: 0, opacity: 0 });
  const tl = gsap.timeline();

  tl.to(cells, {
    scale: 1, opacity: 1,
    duration: .5,
    stagger: { amount: 1.6, from: 'center', grid: 'auto' },
    ease: 'back.out(1.4)',
  })
  .fromTo(label, { opacity: 0, scale: .8 }, { opacity: 1, scale: 1, duration: .5, ease: 'power2.out' }, '-=.2')
  .to(splash, {
    opacity: 0, duration: .6, ease: 'power2.in',
    onComplete: () => {
      splash.remove();
      sessionStorage.setItem('splash_done', '1');
    }
  }, '+=.8');
})();
