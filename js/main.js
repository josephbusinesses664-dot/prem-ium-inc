// Nav scroll effect + mobile toggle
const nav = document.querySelector('nav');
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
  nav?.classList.toggle('scrolled', window.scrollY > 40);
});

const ICON_MENU = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="18" y2="18"/></svg>`;
const ICON_CLOSE = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`;
if (navToggle) navToggle.innerHTML = ICON_MENU;

navToggle?.addEventListener('click', () => {
  navLinks?.classList.toggle('open');
  navToggle.innerHTML = navLinks?.classList.contains('open') ? ICON_CLOSE : ICON_MENU;
});

// Mark active nav link
const currentPath = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(a => {
  const href = a.getAttribute('href')?.split('/').pop();
  if (href === currentPath || (currentPath === '' && href === 'index.html')) {
    a.classList.add('active');
  }
});

// GSAP ScrollTrigger — register plugin
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);

  // Generic scroll-reveal for anything with data-reveal
  gsap.utils.toArray('[data-reveal]').forEach(el => {
    const delay = parseFloat(el.dataset.delay || 0);
    gsap.fromTo(el,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0, duration: .8, delay,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true }
      }
    );
  });

  // Stagger reveal for grid items
  document.querySelectorAll('[data-stagger-parent]').forEach(parent => {
    const children = parent.querySelectorAll('[data-stagger-child]');
    gsap.fromTo(children,
      { opacity: 0, y: 50 },
      {
        opacity: 1, y: 0, duration: .7, stagger: .1,
        ease: 'power2.out',
        scrollTrigger: { trigger: parent, start: 'top 80%', once: true }
      }
    );
  });
}

// Animated number counter
function animateCounter(el, target, duration = 1800) {
  const start = performance.now();
  const update = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(ease * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target.toLocaleString() + (el.dataset.suffix || '');
  };
  requestAnimationFrame(update);
}

// Trigger counters when in view
const counters = document.querySelectorAll('[data-counter]');
if (counters.length) {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCounter(e.target, parseInt(e.target.dataset.counter), 2000);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: .5 });
  counters.forEach(c => obs.observe(c));
}

// Spawn floating particles in a container
function spawnParticles(container, count = 25) {
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 4 + 2;
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      width: ${size}px; height: ${size}px;
      animation-duration: ${Math.random() * 15 + 10}s;
      animation-delay: ${Math.random() * 10}s;
      --dx: ${(Math.random() - .5) * 200}px;
      opacity: ${Math.random() * .4 + .1};
      background: ${Math.random() > .5 ? 'var(--accent)' : 'var(--accent-2)'};
    `;
    container.appendChild(p);
  }
}
document.querySelectorAll('[data-particles]').forEach(c => spawnParticles(c, 60));
