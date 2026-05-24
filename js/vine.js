/* ==============================================
   vine.js — Scroll-driven vine growth animation

   Strategy
   ────────
   1. Measure the stem <path> total length once.
   2. Set strokeDasharray = strokeDashoffset = length
      so the stem starts fully hidden.
   3. On every (rAF-batched) scroll event:
        • Decrease strokeDashoffset proportionally
          to scroll progress → stem "draws" itself.
        • For each [data-vine-threshold] element,
          add/remove .vine-bloomed when progress
          crosses the threshold → flowers bloom.
        • Move the glowing tip circle to the
          current leading point of the stem.
   ============================================== */

(function () {
  'use strict';

  /* ── Element references ─────────────────────── */
  const vine  = document.getElementById('scroll-vine');
  const stem  = document.getElementById('vine-stem');
  const tip   = document.getElementById('vine-tip');

  // Nothing to do if the vine isn't in the DOM
  // (or the browser can't measure SVG paths)
  if (!vine || !stem || typeof stem.getTotalLength !== 'function') return;

  /* ── Measure the stem ──────────────────────── */
  let stemLength = 0;
  try {
    stemLength = stem.getTotalLength();
  } catch (e) {
    return;
  }
  if (!stemLength) return;

  stem.style.strokeDasharray  = stemLength;
  stem.style.strokeDashoffset = stemLength; // fully hidden at start

  /* ── Collect bloom elements ─────────────────── */
  const bloomEls = Array.from(
    vine.querySelectorAll('[data-vine-threshold]')
  );

  /* ── rAF-batched scroll handler ─────────────── */
  let ticking = false;

  function update() {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress  = maxScroll > 0
      ? Math.min(window.scrollY / maxScroll, 1)
      : 0;

    /* 1. Reveal the stem */
    stem.style.strokeDashoffset = stemLength * (1 - progress);

    /* 2. Bloom elements at their scroll thresholds */
    for (const el of bloomEls) {
      const threshold = parseFloat(el.dataset.vineThreshold);
      if (progress >= threshold) {
        el.classList.add('vine-bloomed');
      } else {
        el.classList.remove('vine-bloomed');
      }
    }

    /* 3. Animated growing tip */
    if (tip) {
      if (progress > 0.01 && progress < 0.99) {
        try {
          const pt = stem.getPointAtLength(stemLength * progress);
          tip.setAttribute('cx', pt.x);
          tip.setAttribute('cy', pt.y);
        } catch (e) { /* no-op */ }
        tip.classList.add('is-active');
      } else {
        tip.classList.remove('is-active');
      }
    }

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }, { passive: true });

  /* Run once immediately (handles pre-scrolled state) */
  requestAnimationFrame(update);

})();
