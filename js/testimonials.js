/* ==============================================
   testimonials.js – לוגיקה של מגלשת ההמלצות
   קרוסלה נגישה עם: כפתורים, נקודות, auto-advance,
   תמיכה במגע (swipe) ומקלדת
   ============================================== */

(function () {
    'use strict';

    /* ==============================================
       4. מגלשת ההמלצות (Testimonial Slider)
       ============================================== */
    const initTestimonialSlider = () => {
        const track     = document.getElementById('testimonial-track');
        const slider    = document.getElementById('testimonial-slider');
        const prevBtn   = document.getElementById('testimonial-prev');
        const nextBtn   = document.getElementById('testimonial-next');
        const dotsWrap  = document.getElementById('testimonial-dots');

        if (!track || !slider) return;

        const slides = Array.from(track.children);
        const total  = slides.length;
        if (total === 0) return;

        let currentIndex  = 0;
        let autoplayTimer = null;
        const AUTOPLAY_MS = 7000; // מעבר אוטומטי כל 7 שניות

        // זיהוי כיוון RTL פעם אחת בטעינה
        const isRTL = document.documentElement.getAttribute('dir') === 'rtl';

        /** מעבר לשקופית לפי אינדקס */
        const goTo = (index) => {
            currentIndex = (index + total) % total; // עטיפה מעגלית
            const offset = currentIndex * 100;
            // בRTL נכיוון ההזזה הפוך
            track.style.transform = `translateX(${isRTL ? '' : '-'}${offset}%)`;
            updateDots();
        };

        const goNext = () => goTo(currentIndex + 1);
        const goPrev = () => goTo(currentIndex - 1);

        /** בניית נקודות פגינציה */
        const buildDots = () => {
            if (!dotsWrap) return;
            dotsWrap.innerHTML = '';
            slides.forEach((_, i) => {
                const dot = document.createElement('button');
                dot.className = 'dot';
                dot.type = 'button';
                dot.setAttribute('aria-label', `מעבר להמלצה ${i + 1}`);
                dot.addEventListener('click', () => {
                    goTo(i);
                    resetAutoplay();
                });
                dotsWrap.appendChild(dot);
            });
        };

        /** עדכון הנקודה הפעילה */
        const updateDots = () => {
            if (!dotsWrap) return;
            Array.from(dotsWrap.children).forEach((dot, i) => {
                dot.classList.toggle('is-active', i === currentIndex);
            });
        };

        // פונקציות ניהול auto-advance
        const startAutoplay = () => {
            stopAutoplay();
            autoplayTimer = setInterval(goNext, AUTOPLAY_MS);
        };

        const stopAutoplay = () => {
            if (autoplayTimer) {
                clearInterval(autoplayTimer);
                autoplayTimer = null;
            }
        };

        const resetAutoplay = () => {
            stopAutoplay();
            startAutoplay();
        };

        // חיבור כפתורי הניווט
        prevBtn?.addEventListener('click', () => { goPrev(); resetAutoplay(); });
        nextBtn?.addEventListener('click', () => { goNext(); resetAutoplay(); });

        // ניווט מקלדת (חצים)
        slider.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') { goPrev(); resetAutoplay(); }
            if (e.key === 'ArrowLeft')  { goNext(); resetAutoplay(); }
        });

        // עצירת auto-advance בעת hover/focus
        slider.addEventListener('mouseenter', stopAutoplay);
        slider.addEventListener('mouseleave', startAutoplay);
        slider.addEventListener('focusin',    stopAutoplay);
        slider.addEventListener('focusout',   startAutoplay);

        // תמיכה בswipe במגע (מובייל)
        let touchStartX = 0;
        let touchEndX   = 0;
        const SWIPE_THRESHOLD = 40;

        slider.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            stopAutoplay();
        }, { passive: true });

        slider.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const delta = touchEndX - touchStartX;
            if (Math.abs(delta) > SWIPE_THRESHOLD) {
                // בRTL: swipe ימינה = קדימה
                if (delta > 0) isRTL ? goNext() : goPrev();
                else           isRTL ? goPrev() : goNext();
            }
            startAutoplay();
        }, { passive: true });

        // אתחול ראשוני
        buildDots();
        goTo(0);
        startAutoplay();
    };

    /* אתחול לאחר טעינת ה-DOM */
    document.addEventListener('DOMContentLoaded', () => {
        initTestimonialSlider();
    });

})();
