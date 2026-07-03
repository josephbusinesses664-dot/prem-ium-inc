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

// Floating particles for inner page heroes
function spawnParticles(container, count = 60) {
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 4 + 2;
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      bottom: -10px;
      width: ${size}px; height: ${size}px;
      animation-duration: ${Math.random() * 15 + 10}s;
      animation-delay: -${Math.random() * 20}s;
      --dx: ${(Math.random() - .5) * 200}px;
      opacity: ${Math.random() * .4 + .1};
      background: ${Math.random() > .5 ? 'var(--accent)' : 'var(--accent-2)'};
    `;
    container.appendChild(p);
  }
}
document.querySelectorAll('[data-particles]').forEach(c => spawnParticles(c));

// Glass bubbles for the homepage hero
function spawnBubbles(container, count = 34) {
  const h = () => container.offsetHeight + 120;

  for (let i = 0; i < count; i++) {
    const size    = 10 + Math.random() * 54;          // 10–64px
    const dur     = 14 + Math.random() * 24;           // 14–38s per cycle
    const startFr = Math.random();                      // random starting height
    const sway    = (20 + Math.random() * 52) * (Math.random() > .5 ? 1 : -1);
    const alpha   = .25 + Math.random() * .3;
    const glow    = .18 + Math.random() * .22;

    // Wrapper: GSAP controls x+y transforms
    const wrap = document.createElement('div');
    wrap.style.cssText = `
      position:absolute;
      left:${Math.random() * 94}%;
      bottom:-${size + 10}px;
      width:${size}px; height:${size}px;
      pointer-events:none; opacity:0;
    `;

    // Inner: glassy bubble — pink body, lit from top-right
    const bubble = document.createElement('div');
    bubble.style.cssText = `
      width:100%; height:100%; border-radius:50%;
      background: radial-gradient(circle at 70% 18%,
        rgba(255,255,255,.30) 0%,
        rgba(236,72,153,.22) 30%,
        rgba(236,72,153,.10) 60%,
        rgba(139,92,246,.12) 100%);
      border: 1px solid rgba(236,72,153,${alpha});
      box-shadow:
        inset -3px 3px 8px rgba(236,72,153,.18),
        0 0 14px rgba(236,72,153,${glow}),
        0 0 32px rgba(236,72,153,${glow * .5});
      animation: bubbleWobble ${2 + Math.random() * 2.6}s ease-in-out ${Math.random() * 2}s infinite;
    `;

    // Soft highlight — large, top-right, simulates light source
    const hl = document.createElement('div');
    hl.style.cssText = `
      position:absolute; border-radius:50%;
      width:34%; height:22%; top:10%; left:56%;
      background:rgba(255,220,240,.55); filter:blur(3px);
      pointer-events:none;
    `;

    // Sharp specular dot — bright pinpoint of the light
    const hl2 = document.createElement('div');
    hl2.style.cssText = `
      position:absolute; border-radius:50%;
      width:12%; height:9%; top:8%; left:68%;
      background:rgba(255,255,255,.85); filter:blur(1px);
      pointer-events:none;
    `;

    bubble.appendChild(hl);
    bubble.appendChild(hl2);
    wrap.appendChild(bubble);
    container.appendChild(wrap);

    // Rise animation — recursively restarts from bottom after each cycle
    function rise(fromY, duration) {
      gsap.fromTo(wrap,
        { y: fromY },
        {
          y: -h(),
          duration,
          ease: 'none',
          onUpdate() {
            const p = this.progress();
            // Fade in over first 7%, fade out over last 12%
            wrap.style.opacity = Math.min(p / .07, 1) * (1 - Math.max((p - .88) / .12, 0));
          },
          onComplete() { rise(0, dur); },
        }
      );
    }
    rise(-h() * startFr, dur * (1 - startFr));

    // Sinusoidal horizontal sway — GSAP merges x with the y above
    gsap.to(wrap, {
      x: sway,
      duration: 2.4 + Math.random() * 4.2,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });
  }
}
document.querySelectorAll('[data-bubbles]').forEach(c => spawnBubbles(c));

// ─── Custom cursor ──────────────────────────────────────────
(function () {
  if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;
  const dot  = document.createElement('div'); dot.id  = 'cursor';
  const ring = document.createElement('div'); ring.id = 'cursor-ring';
  document.body.append(dot, ring);

  gsap.set([dot, ring], { xPercent: -50, yPercent: -50 });
  const mx = gsap.quickTo(dot,  'x', { duration: .06 });
  const my = gsap.quickTo(dot,  'y', { duration: .06 });
  const rx = gsap.quickTo(ring, 'x', { duration: .14, ease: 'power3' });
  const ry = gsap.quickTo(ring, 'y', { duration: .14, ease: 'power3' });

  window.addEventListener('mousemove', e => { mx(e.clientX); my(e.clientY); rx(e.clientX); ry(e.clientY); });

  const hoverEls = 'a, button, [data-tilt], .nav-cta, .btn, label, input, textarea, select, .svc-card, .port-card, .svc-full-card';
  document.addEventListener('mouseover',  e => { if (e.target.closest(hoverEls)) document.body.classList.add('cursor-hover'); });
  document.addEventListener('mouseout',   e => { if (e.target.closest(hoverEls)) document.body.classList.remove('cursor-hover'); });
  document.addEventListener('mousedown',  () => document.body.classList.add('cursor-click'));
  document.addEventListener('mouseup',    () => document.body.classList.remove('cursor-click'));
  document.addEventListener('mouseleave', () => { gsap.to([dot, ring], { opacity: 0, duration: .2 }); });
  document.addEventListener('mouseenter', () => { gsap.to([dot, ring], { opacity: 1, duration: .2 }); });
})();

// ─── Hero blob parallax ─────────────────────────────────────
(function () {
  const hero  = document.querySelector('[data-bubbles]');
  const blob1 = hero?.querySelector('.blob-1');
  const blob2 = hero?.querySelector('.blob-2');
  if (!hero || !blob1 || !blob2) return;
  hero.addEventListener('mousemove', e => {
    const { left, top, width, height } = hero.getBoundingClientRect();
    const nx = (e.clientX - left) / width  - .5;
    const ny = (e.clientY - top)  / height - .5;
    gsap.to(blob1, { x: nx * 50, y: ny * 36, duration: 1.4, ease: 'power2.out' });
    gsap.to(blob2, { x: -nx * 36, y: -ny * 26, duration: 1.7, ease: 'power2.out' });
  });
})();

// ─── Card 3-D tilt ──────────────────────────────────────────
window.applyTilt = function (scope) {
  (scope || document).querySelectorAll('[data-tilt]').forEach(card => {
    card.style.transformStyle = 'preserve-3d';
    card.addEventListener('mousemove', e => {
      const { left, top, width, height } = card.getBoundingClientRect();
      const nx = (e.clientX - left) / width  - .5;
      const ny = (e.clientY - top)  / height - .5;
      gsap.to(card, { rotateX: -ny * 11, rotateY: nx * 11, transformPerspective: 900, duration: .35, ease: 'power2.out' });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { rotateX: 0, rotateY: 0, duration: .55, ease: 'back.out(1.5)' });
    });
  });
};
window.applyTilt();

// ─── Magnetic buttons ───────────────────────────────────────
document.querySelectorAll('.btn-primary, .nav-cta').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const { left, top, width, height } = btn.getBoundingClientRect();
    gsap.to(btn, { x: (e.clientX - left - width / 2) * .22, y: (e.clientY - top - height / 2) * .22, duration: .32, ease: 'power2.out' });
  });
  btn.addEventListener('mouseleave', () => {
    gsap.to(btn, { x: 0, y: 0, duration: .55, ease: 'elastic.out(1, .45)' });
  });
});

// ─── Text scramble on scroll ────────────────────────────────
(function () {
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*';
  function scramble(el) {
    const originalHTML = el.innerHTML;
    const originalText = el.textContent;
    const len = originalText.length;
    let frame = 0;
    const totalFrames = 20;
    const tick = () => {
      if (frame <= totalFrames) {
        el.textContent = originalText.split('').map((ch, i) => {
          if (ch === ' ' || ch === '\n') return ch;
          if (frame / totalFrames >= i / len) return ch;
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        }).join('');
        frame++;
        requestAnimationFrame(tick);
      } else {
        el.innerHTML = originalHTML;
      }
    };
    requestAnimationFrame(tick);
  }

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { scramble(e.target); obs.unobserve(e.target); }
    });
  }, { threshold: .25 });

  document.querySelectorAll('[data-scramble]').forEach(el => obs.observe(el));
})();
