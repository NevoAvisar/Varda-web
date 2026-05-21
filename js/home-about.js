/* ==============================================
   home-about.js – לוגיקה גלובלית, ניווט, בית ואודות
   כולל: תפריט מובייל, גלילת navbar, אנימציות גילוי,
          גלילה חלקה ושנת פוטר
   ============================================== */

(function () {
    'use strict';

    /* ==============================================
       1. תפריט המובייל (Hamburger)
       פותח/סוגר את התפריט ומחליף אייקונים
       ============================================== */
    const initMobileMenu = () => {
        const toggleBtn  = document.getElementById('mobile-menu-toggle');
        const menu       = document.getElementById('mobile-menu');
        const iconOpen   = document.getElementById('menu-icon-open');
        const iconClose  = document.getElementById('menu-icon-close');

        if (!toggleBtn || !menu) return;

        // סגירת התפריט
        const closeMenu = () => {
            menu.classList.add('hidden');
            iconOpen.classList.remove('hidden');
            iconClose.classList.add('hidden');
            toggleBtn.setAttribute('aria-expanded', 'false');
        };

        // פתיחת התפריט
        const openMenu = () => {
            menu.classList.remove('hidden');
            iconOpen.classList.add('hidden');
            iconClose.classList.remove('hidden');
            toggleBtn.setAttribute('aria-expanded', 'true');
        };

        // לחיצה על כפתור ה햄בורגר
        toggleBtn.addEventListener('click', () => {
            const isOpen = !menu.classList.contains('hidden');
            isOpen ? closeMenu() : openMenu();
        });

        // סגירה בלחיצה על קישור פנימי
        menu.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // סגירה במקש Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !menu.classList.contains('hidden')) {
                closeMenu();
                toggleBtn.focus();
            }
        });
    };


    /* ==============================================
       2. אפקט גלילה על הניווט (Sticky Nav)
       מוסיף רקע מטושטש לnavbar לאחר גלילה
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

        toggleScrolled(); // הפעלה ראשונית
        window.addEventListener('scroll', toggleScrolled, { passive: true });
    };


    /* ==============================================
       3. אנימציות גילוי בגלילה (.reveal)
       משתמש ב-IntersectionObserver לטעינה מדורגת
       ============================================== */
    const initRevealOnScroll = () => {
        const elements = document.querySelectorAll('.reveal');
        if (!elements.length) return;

        // גיבוי לדפדפנים ישנים שאינם תומכים ב-IntersectionObserver
        if (!('IntersectionObserver' in window)) {
            elements.forEach(el => el.classList.add('is-visible'));
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target); // הפסק מעקב לאחר גילוי
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -60px 0px'
        });

        elements.forEach(el => observer.observe(el));
    };


    /* ==============================================
       6. גלילה חלקה לעוגנים פנימיים
       מבטיח פיצוי נכון לפס ניווט קבוע
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
       7. שנת זכויות יוצרים דינמית בפוטר
       ============================================== */
    const initFooterYear = () => {
        const el = document.getElementById('year');
        if (el) el.textContent = new Date().getFullYear();
    };


    /* ==============================================
       אתחול כל הפונקציות לאחר טעינת ה-DOM
       ============================================== */
    document.addEventListener('DOMContentLoaded', () => {
        initMobileMenu();
        initNavbarScroll();
        initRevealOnScroll();
        initSmoothScroll();
        initFooterYear();
    });

})();
