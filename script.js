/* ==============================================
   VARDA MOSHE — INTERACTIVE SCRIPT
   Modular JS: each feature is its own init function,
   orchestrated inside a single DOMContentLoaded bootstrap.
   ============================================== */

(function () {
    'use strict';

    /* ==============================================
       1. MOBILE MENU TOGGLE
       Handles the hamburger open/close + icon swap.
       ============================================== */
    const initMobileMenu = () => {
        const toggleBtn  = document.getElementById('mobile-menu-toggle');
        const menu       = document.getElementById('mobile-menu');
        const iconOpen   = document.getElementById('menu-icon-open');
        const iconClose  = document.getElementById('menu-icon-close');

        if (!toggleBtn || !menu) return;

        const closeMenu = () => {
            menu.classList.add('hidden');
            iconOpen.classList.remove('hidden');
            iconClose.classList.add('hidden');
            toggleBtn.setAttribute('aria-expanded', 'false');
        };

        const openMenu = () => {
            menu.classList.remove('hidden');
            iconOpen.classList.add('hidden');
            iconClose.classList.remove('hidden');
            toggleBtn.setAttribute('aria-expanded', 'true');
        };

        toggleBtn.addEventListener('click', () => {
            const isOpen = !menu.classList.contains('hidden');
            isOpen ? closeMenu() : openMenu();
        });

        // Close menu when an internal link is clicked
        menu.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // Close menu on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !menu.classList.contains('hidden')) {
                closeMenu();
                toggleBtn.focus();
            }
        });
    };


    /* ==============================================
       2. STICKY NAV SCROLL EFFECT
       Adds a blurred background to the navbar after
       the user has scrolled a few pixels.
       ============================================== */
    const initNavbarScroll = () => {
        const navbar = document.getElementById('navbar');
        if (!navbar) return;

        const toggleScrolled = () => {
            if (window.scrollY > 20) {
                navbar.classList.add('is-scrolled');
            } else {
                navbar.classList.remove('is-scrolled');
            }
        };

        toggleScrolled();
        window.addEventListener('scroll', toggleScrolled, { passive: true });
    };


    /* ==============================================
       3. SCROLL-TRIGGERED REVEAL ANIMATIONS
       Uses IntersectionObserver to progressively fade
       elements with the `.reveal` class into view.
       ============================================== */
    const initRevealOnScroll = () => {
        const elements = document.querySelectorAll('.reveal');
        if (!elements.length) return;

        // Graceful fallback for older browsers
        if (!('IntersectionObserver' in window)) {
            elements.forEach(el => el.classList.add('is-visible'));
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -60px 0px'
        });

        elements.forEach(el => observer.observe(el));
    };


    /* ==============================================
       4. TESTIMONIALS SLIDER
       Fully keyboard-accessible carousel with:
         - Previous / Next buttons
         - Clickable pagination dots
         - Auto-advance (pauses on hover/focus)
         - Touch swipe support for mobile
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
        const AUTOPLAY_MS = 7000;

        // Detect RTL direction once at init — slider is in an RTL document,
        // so the translate direction must be positive to move forward.
        const isRTL = document.documentElement.getAttribute('dir') === 'rtl';

        /** Move the track to display slide `index`. */
        const goTo = (index) => {
            // Wrap around
            currentIndex = (index + total) % total;
            const offset = currentIndex * 100;
            track.style.transform = `translateX(${isRTL ? '' : '-'}${offset}%)`;
            updateDots();
        };

        const goNext = () => goTo(currentIndex + 1);
        const goPrev = () => goTo(currentIndex - 1);

        /** Build pagination dots once. */
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

        /** Sync the active dot with currentIndex. */
        const updateDots = () => {
            if (!dotsWrap) return;
            Array.from(dotsWrap.children).forEach((dot, i) => {
                dot.classList.toggle('is-active', i === currentIndex);
            });
        };

        /** Auto-advance helpers. */
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

        // Wire up buttons
        prevBtn?.addEventListener('click', () => { goPrev(); resetAutoplay(); });
        nextBtn?.addEventListener('click', () => { goNext(); resetAutoplay(); });

        // Keyboard navigation (left/right arrows)
        slider.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') { goPrev(); resetAutoplay(); }
            if (e.key === 'ArrowLeft')  { goNext(); resetAutoplay(); }
        });

        // Pause auto-advance on hover/focus
        slider.addEventListener('mouseenter', stopAutoplay);
        slider.addEventListener('mouseleave', startAutoplay);
        slider.addEventListener('focusin',    stopAutoplay);
        slider.addEventListener('focusout',   startAutoplay);

        // Touch swipe support
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
                // In RTL: swipe right moves to previous slide
                if (delta > 0) isRTL ? goNext() : goPrev();
                else           isRTL ? goPrev() : goNext();
            }
            startAutoplay();
        }, { passive: true });

        // Initial render
        buildDots();
        goTo(0);
        startAutoplay();
    };


    /* ==============================================
       5. CONTACT FORM HANDLER
       Simple client-side validation with a graceful
       success/error message. Replace the mock submit
       with a real endpoint (Formspree, Netlify, etc.).
       ============================================== */
    const initContactForm = () => {
        const form   = document.getElementById('contact-form');
        const status = document.getElementById('form-status');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const name  = form.name?.value.trim();
            const phone = form.phone?.value.trim();

            // Minimal validation
            if (!name || !phone) {
                showStatus('אנא מלאו שם וטלפון כדי שנוכל לחזור אליכם.', 'error');
                return;
            }
            if (!/^[\d\s+()-]{7,}$/.test(phone)) {
                showStatus('מספר הטלפון אינו תקין, נא לבדוק שוב.', 'error');
                return;
            }

            // === Replace this block with real API integration ===
            showStatus('מעולה! הפנייה נקלטה, אחזור אליכם בהקדם. 💚', 'success');
            form.reset();
            // ===================================================
        });

        /** Display a colored inline form status message. */
        const showStatus = (message, type) => {
            if (!status) return;
            status.textContent = message;
            status.className = type === 'success'
                ? 'text-center text-sm mt-2 text-sage-700 font-medium'
                : 'text-center text-sm mt-2 text-rose-400 font-medium';
        };
    };


    /* ==============================================
       6. SMOOTH ANCHOR SCROLLING
       CSS `scroll-behavior: smooth` handles most cases,
       but this ensures consistent offset for the sticky nav.
       ============================================== */
    const initSmoothScroll = () => {
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                const targetId = link.getAttribute('href');
                if (!targetId || targetId === '#') return;
                const target = document.querySelector(targetId);
                if (!target) return;

                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });
    };


    /* ==============================================
       7. FOOTER CURRENT-YEAR STAMP
       ============================================== */
    const initFooterYear = () => {
        const el = document.getElementById('year');
        if (el) el.textContent = new Date().getFullYear();
    };


    /* ==============================================
       BOOTSTRAP — wire everything up on DOM ready
       ============================================== */
    document.addEventListener('DOMContentLoaded', () => {
        initMobileMenu();
        initNavbarScroll();
        initRevealOnScroll();
        initTestimonialSlider();
        initContactForm();
        initSmoothScroll();
        initFooterYear();
    });

})();
