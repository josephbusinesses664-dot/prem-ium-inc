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
    if (el.hasAttribute('data-words')) return; // masked word reveal handles these
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

// ─── Card 3-D tilt + glare ──────────────────────────────────
window.applyTilt = function (scope) {
  (scope || document).querySelectorAll('[data-tilt]').forEach(card => {
    if (card.dataset.tiltInit) return;
    card.dataset.tiltInit = '1';
    card.style.transformStyle = 'preserve-3d';
    if (getComputedStyle(card).position === 'static') card.style.position = 'relative';

    const glare = document.createElement('div');
    glare.className = 'tilt-glare';
    card.appendChild(glare);

    card.addEventListener('mousemove', e => {
      const { left, top, width, height } = card.getBoundingClientRect();
      const nx = (e.clientX - left) / width  - .5;
      const ny = (e.clientY - top)  / height - .5;
      gsap.to(card, { rotateX: -ny * 11, rotateY: nx * 11, transformPerspective: 900, duration: .35, ease: 'power2.out' });
      glare.style.opacity = '1';
      glare.style.background = `radial-gradient(circle at ${(nx + .5) * 100}% ${(ny + .5) * 100}%, rgba(255,255,255,.09) 0%, rgba(139,92,246,.05) 35%, transparent 65%)`;
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { rotateX: 0, rotateY: 0, duration: .55, ease: 'back.out(1.5)' });
      glare.style.opacity = '0';
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

// ─── Masked word reveal on scroll ───────────────────────────
// Each word slides up from behind an invisible mask with a slight
// stagger. Splits text nodes only, so nested markup (gradient spans,
// multi-line block spans, <br>) stays intact.
(function () {
  function splitWords(el) {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    let n;
    while ((n = walker.nextNode())) {
      if (n.data.trim()) textNodes.push(n);
    }
    const inners = [];
    textNodes.forEach(node => {
      const isGrad = node.parentElement.closest('.grad-text') !== null;
      const frag = document.createDocumentFragment();
      node.data.split(/(\s+)/).forEach(part => {
        if (!part) return;
        if (!part.trim()) { frag.appendChild(document.createTextNode(part)); return; }
        const mask = document.createElement('span');
        mask.className = 'reveal-word';
        const inner = document.createElement('span');
        inner.className = 'reveal-word-inner' + (isGrad ? ' grad-text' : '');
        inner.textContent = part;
        mask.appendChild(inner);
        frag.appendChild(mask);
        inners.push(inner);
      });
      node.parentNode.replaceChild(frag, node);
    });
    return inners;
  }

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const targets = [];
  document.querySelectorAll('[data-words]').forEach(el => {
    if (reduced || typeof gsap === 'undefined') return;
    targets.push({ el, inners: splitWords(el) });
  });

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const t = targets.find(x => x.el === e.target);
      if (t) {
        gsap.to(t.inners, {
          y: 0,
          duration: .9,
          stagger: .07,
          ease: 'power4.out',
          delay: parseFloat(e.target.dataset.delay || 0),
        });
      }
      obs.unobserve(e.target);
    });
  }, { threshold: .3 });

  targets.forEach(t => obs.observe(t.el));
})();

// ─── Scroll progress bar ────────────────────────────────────
(function () {
  const bar = document.createElement('div');
  bar.id = 'scroll-progress';
  document.body.appendChild(bar);
  const update = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? Math.min(scrollY / max, 1) : 0})`;
  };
  addEventListener('scroll', update, { passive: true });
  addEventListener('resize', update);
  update();
})();

// ─── Back to top ────────────────────────────────────────────
(function () {
  const btn = document.createElement('button');
  btn.id = 'back-to-top';
  btn.setAttribute('aria-label', 'Back to top');
  btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>`;
  document.body.appendChild(btn);
  btn.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));
  addEventListener('scroll', () => {
    btn.classList.toggle('visible', scrollY > 600);
  }, { passive: true });
})();
