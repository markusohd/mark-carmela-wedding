/* ============================================================
   MARK & CARMELA — Forever and Ever Babe
   script.js — All interactive magic
   ============================================================ */

'use strict';

/* ══════════════════════════════════════════════════
   1. CONSTANTS & DOM REFS
══════════════════════════════════════════════════ */
const WEDDING_DATE = new Date('2012-06-16');

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

/* ══════════════════════════════════════════════════
   2. FLOATING PETALS CANVAS (Hero)
══════════════════════════════════════════════════ */
function initPetalsCanvas() {
  const canvas = $('#petals-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let petals = [];
  let animFrame;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createPetal() {
    const type = Math.random() < 0.15 ? 'sparkle' : 'petal';
    return {
      x:        Math.random() * canvas.width,
      y:        Math.random() * -canvas.height,
      size:     type === 'sparkle' ? Math.random() * 4 + 2 : Math.random() * 10 + 5,
      speedY:   Math.random() * 0.8 + 0.3,
      speedX:   (Math.random() - 0.5) * 0.6,
      angle:    Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.04,
      sineAmp:  Math.random() * 0.8 + 0.2,
      sineFreq: Math.random() * 0.015 + 0.005,
      sineOff:  Math.random() * Math.PI * 2,
      alpha:    Math.random() * 0.5 + 0.25,
      type
    };
  }

  function drawPetal(p, t) {
    ctx.save();
    const sx = p.x + Math.sin(t * p.sineFreq + p.sineOff) * p.sineAmp * 25;
    ctx.translate(sx, p.y);
    ctx.rotate(p.angle);
    ctx.globalAlpha = p.alpha;

    if (p.type === 'sparkle') {
      ctx.fillStyle = '#FFD700';
      ctx.font = `${p.size * 2}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('✦', 0, 0);
    } else {
      // Petal shape: ellipse, slightly ivory/champagne
      const isGold = Math.random() < 0.001; // rarely flip to gold
      ctx.fillStyle = isGold ? 'rgba(212,175,55,0.55)' : 'rgba(247,231,206,0.65)';
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size * 0.55, p.size, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  function update(t) {
    petals.forEach(p => {
      p.y     += p.speedY;
      p.angle += p.rotSpeed;

      // Wrap when below viewport
      if (p.y > canvas.height + 20) {
        p.y = -20;
        p.x = Math.random() * canvas.width;
      }
    });
  }

  let t = 0;
  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    t += 1;
    update(t);
    petals.forEach(p => drawPetal(p, t));
    animFrame = requestAnimationFrame(loop);
  }

  // Stop petals when hero is scrolled out to save GPU
  const heroEl = $('#hero');
  const heroObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      if (!animFrame) loop();
    } else {
      cancelAnimationFrame(animFrame);
      animFrame = null;
    }
  }, { threshold: 0.01 });

  if (heroEl) heroObserver.observe(heroEl);

  resize();
  for (let i = 0; i < 35; i++) petals.push(createPetal());
  // Spread initial Y positions across whole canvas height
  petals.forEach(p => { p.y = Math.random() * canvas.height; });
  loop();

  window.addEventListener('resize', resize, { passive: true });
}


/* ══════════════════════════════════════════════════
   3. INTERSECTION OBSERVER — Scroll Reveals & Triggers
══════════════════════════════════════════════════ */
const scrollTriggers = {
  timelineDots:    new Set(),
  yearsCounter:    null,
  vowTypewriters:  new Set()
};

function initScrollReveal() {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;

      el.classList.add('is-visible');

      // Timeline dot bounce
      if (el.classList.contains('timeline__item')) {
        const dot = el.querySelector('.timeline__dot');
        if (dot && !scrollTriggers.timelineDots.has(dot)) {
          scrollTriggers.timelineDots.add(dot);
          dot.classList.add('bounced');
        }
      }

      // Years counter
      if (el.id === 'years-counter-wrap' && !scrollTriggers.yearsCounter) {
        scrollTriggers.yearsCounter = true;
        animateYearsCounter();
      }

      // Vow typewriter
      if (el.classList.contains('vow-scroll')) {
        const textEl = el.querySelector('.typewriter-pending');
        if (textEl && !scrollTriggers.vowTypewriters.has(textEl)) {
          scrollTriggers.vowTypewriters.add(textEl);
          // Small delay so the card animates in first
          setTimeout(() => typewriterReveal(textEl), 600);
        }
      }

      revealObserver.unobserve(el);
    });
  }, { threshold: 0.12 });

  $$('.animate-on-scroll').forEach(el => revealObserver.observe(el));
}


/* ══════════════════════════════════════════════════
   4. HERO PARALLAX
══════════════════════════════════════════════════ */
function initHeroParallax() {
  const heroBg = $('#hero-bg');
  if (!heroBg) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrolled = window.scrollY;
        const heroH = window.innerHeight;
        if (scrolled < heroH * 1.5) {
          heroBg.style.transform = `scale(1.06) translateY(${scrolled * 0.28}px)`;
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}


/* ══════════════════════════════════════════════════
   5. STICKY NAV
══════════════════════════════════════════════════ */
function initNav() {
  const nav = $('#main-nav');
  if (!nav) return;

  const heroH = window.innerHeight * 0.7;

  window.addEventListener('scroll', () => {
    if (window.scrollY > heroH) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }, { passive: true });
}


/* ══════════════════════════════════════════════════
   6. MUSIC TOGGLE
══════════════════════════════════════════════════ */
function initMusic() {
  const btn = $('#music-toggle');
  if (!btn) return;

  const audio = new Audio();
  audio.loop   = true;
  audio.volume = 0.35;
  // Set audio.src to your music file when available, e.g.:
  // audio.src = './assets/background-music.mp3';

  btn.addEventListener('click', () => {
    if (!audio.src || audio.src === window.location.href) {
      // No music file loaded — show a gentle nudge
      btn.style.borderColor = 'rgba(212,175,55,0.8)';
      setTimeout(() => { btn.style.borderColor = ''; }, 1000);
      return;
    }

    if (audio.paused) {
      audio.play().then(() => {
        btn.setAttribute('aria-pressed', 'true');
        btn.classList.add('is-playing');
      }).catch(() => {});
    } else {
      audio.pause();
      btn.setAttribute('aria-pressed', 'false');
      btn.classList.remove('is-playing');
    }
  });
}


/* ══════════════════════════════════════════════════
   7. GALLERY — Filter Tabs
══════════════════════════════════════════════════ */
function initGalleryFilter() {
  const filterBtns = $$('.gallery__filter-btn');
  const galleryItems = $$('.gallery__item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active state
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filter = btn.dataset.filter;

      galleryItems.forEach(item => {
        const matches = filter === 'all' || item.dataset.category === filter;

        if (matches) {
          item.style.display = 'block';
          item.classList.remove('pop-in');
          // Force reflow to restart animation
          void item.offsetWidth;
          item.classList.add('pop-in');
        } else {
          item.style.display = 'none';
          item.classList.remove('pop-in');
        }
      });
    });
  });
}


/* ══════════════════════════════════════════════════
   8. GALLERY — Lightbox
══════════════════════════════════════════════════ */
function initLightbox() {
  const lightbox   = $('#lightbox');
  const backdrop   = $('#lightbox-backdrop');
  const imgEl      = $('#lightbox-img');
  const captionEl  = $('#lightbox-caption');
  const counterEl  = $('#lightbox-counter');
  const closeBtn   = $('#lightbox-close');
  const prevBtn    = $('#lightbox-prev');
  const nextBtn    = $('#lightbox-next');

  if (!lightbox) return;

  // Build images array from currently visible items
  let images = [];
  let currentIndex = 0;

  function buildImagesArray() {
    images = [...$$('.gallery__item')]
      .filter(item => item.style.display !== 'none')
      .map(item => ({
        src:     item.dataset.src,
        alt:     item.querySelector('.gallery__img')?.alt || '',
        caption: item.dataset.caption || ''
      }));
  }

  function openLightbox(index) {
    buildImagesArray();
    currentIndex = Math.max(0, Math.min(index, images.length - 1));
    showImage(currentIndex);

    backdrop.classList.add('open');
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Focus trap
    closeBtn.focus();
  }

  function closeLightbox() {
    backdrop.classList.remove('open');
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function showImage(index) {
    const item = images[index];
    if (!item) return;

    imgEl.src = item.src;
    imgEl.alt = item.alt;
    captionEl.textContent = item.caption.replace(/&amp;/g, '&');
    counterEl.textContent = `${index + 1} / ${images.length}`;
    currentIndex = index;
  }

  function prev() {
    showImage((currentIndex - 1 + images.length) % images.length);
  }

  function next() {
    showImage((currentIndex + 1) % images.length);
  }

  // Open on gallery item click
  $$('.gallery__item').forEach((item, i) => {
    item.addEventListener('click', () => {
      buildImagesArray();
      // Find this item's index in the current visible set
      const visibleItems = [...$$('.gallery__item')].filter(it => it.style.display !== 'none');
      const idx = visibleItems.indexOf(item);
      openLightbox(idx);
    });
  });

  closeBtn.addEventListener('click', closeLightbox);
  backdrop.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);

  // Keyboard navigation
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  prev();
    if (e.key === 'ArrowRight') next();
  });

  // Touch swipe
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });

  lightbox.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) {
      dx < 0 ? next() : prev();
    }
  }, { passive: true });
}


/* ══════════════════════════════════════════════════
   9. YEARS COUNTER (Nano Banana)
══════════════════════════════════════════════════ */
function animateYearsCounter() {
  const numEl = $('#years-count');
  if (!numEl) return;

  const yearsTotal = Math.floor(
    (Date.now() - WEDDING_DATE.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
  );

  let current = 0;
  const duration = 1800; // ms
  const startTime = performance.now();

  function step(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out
    const eased = 1 - Math.pow(1 - progress, 3);
    current = Math.round(eased * yearsTotal);
    numEl.textContent = current;

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      numEl.textContent = yearsTotal;
      numEl.classList.add('count-arrived');
    }
  }

  requestAnimationFrame(step);
}


/* ══════════════════════════════════════════════════
   10. TYPEWRITER REVEAL (Nano Banana — Vows)
══════════════════════════════════════════════════ */
function typewriterReveal(element) {
  const originalText = element.textContent;
  element.textContent = '';
  element.classList.remove('typewriter-pending');
  element.classList.add('typewriter-done');
  element.style.visibility = 'visible';

  let i = 0;
  const charDelay = 22; // ms per character

  function typeNext() {
    if (i < originalText.length) {
      element.textContent += originalText[i];
      i++;
      setTimeout(typeNext, charDelay);
    }
  }

  typeNext();
}


/* ══════════════════════════════════════════════════
   11. FLOATING HEARTS CANVAS (Footer)
══════════════════════════════════════════════════ */
function initHeartsCanvas() {
  const canvas = $('#hearts-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let hearts = [];
  let animFrame;

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  const heartSymbols = ['♥', '♡', '❤', '✦'];

  function createHeart() {
    return {
      x:      Math.random() * canvas.width,
      y:      canvas.height + 20,
      size:   Math.random() * 16 + 8,
      speedY: Math.random() * 0.6 + 0.25,
      drift:  (Math.random() - 0.5) * 0.3,
      alpha:  Math.random() * 0.4 + 0.15,
      symbol: heartSymbols[Math.floor(Math.random() * heartSymbols.length)],
      color:  Math.random() < 0.6 ? '#D4AF37' : '#FF6B8A'
    };
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    hearts.forEach(h => {
      ctx.save();
      ctx.globalAlpha = h.alpha;
      ctx.fillStyle = h.color;
      ctx.font = `${h.size}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(h.symbol, h.x, h.y);
      ctx.restore();

      h.y     -= h.speedY;
      h.x     += h.drift;
      h.alpha -= 0.0012;

      // Reset when faded or exited
      if (h.alpha <= 0 || h.y < -20) {
        Object.assign(h, createHeart());
      }
    });

    animFrame = requestAnimationFrame(loop);
  }

  // Only run when footer is visible
  const footerEl = $('#footer');
  if (footerEl) {
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        if (!animFrame) loop();
      } else {
        cancelAnimationFrame(animFrame);
        animFrame = null;
      }
    }, { threshold: 0.05 });
    obs.observe(footerEl);
  }

  resize();
  for (let i = 0; i < 25; i++) {
    const h = createHeart();
    h.y = Math.random() * canvas.height; // start spread
    hearts.push(h);
  }

  window.addEventListener('resize', () => {
    resize();
  }, { passive: true });
}


/* ══════════════════════════════════════════════════
   12. INIT
══════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initPetalsCanvas();
  initScrollReveal();
  initHeroParallax();
  initNav();
  initMusic();
  initGalleryFilter();
  initLightbox();
  initHeartsCanvas();
});
