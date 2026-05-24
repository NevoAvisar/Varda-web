/* ==============================================
   contact.js – טיפול בטופס יצירת הקשר
   שליחה דרך Netlify Forms באמצעות fetch()
   ולידציה בסיסית מצד לקוח + כרטיס תודה מונפש
   ============================================== */

(function () {
    'use strict';

    const initContactForm = () => {
        const form      = document.getElementById('contact-form');
        const status    = document.getElementById('form-status');
        const submitBtn = document.getElementById('form-submit-btn');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const nameVal  = form.elements['name']?.value.trim();
            const phoneVal = form.elements['phone']?.value.trim();

            /* ── ולידציה בסיסית ─────────────────── */
            if (!nameVal || !phoneVal) {
                showStatus('אנא מלאו שם וטלפון כדי שנוכל לחזור אליכם.', 'error');
                return;
            }

            if (!/^[\d\s+()-]{7,}$/.test(phoneVal)) {
                showStatus('מספר הטלפון אינו תקין, נא לבדוק שוב.', 'error');
                return;
            }

            setSubmitting(true);

            /* ── שליחה ל-Netlify Forms ──────────────
               Netlify מזהה את הטופס לפי שדה form-name.
               חובה: application/x-www-form-urlencoded  */
            fetch('/', {
                method : 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body   : new URLSearchParams(new FormData(form)).toString(),
            })
                .then(() => showThankYou(nameVal))
                .catch(() => {
                    showStatus('אירעה שגיאה בשליחה. אנא נסו שוב או צרו קשר ישירות.', 'error');
                    setSubmitting(false);
                });
        });

        /* ── נעילת כפתור בזמן שליחה ─────────── */
        const setSubmitting = (isBusy) => {
            if (!submitBtn) return;
            submitBtn.disabled    = isBusy;
            submitBtn.textContent = isBusy ? 'שולח...' : 'שליחת פנייה';
        };

        /* ── הודעת שגיאה טקסטואלית ──────────── */
        const showStatus = (message, type) => {
            if (!status) return;
            status.textContent = message;
            status.className   = type === 'success'
                ? 'text-center text-sm mt-2 text-sage-700 font-medium'
                : 'text-center text-sm mt-2 text-rose-400 font-medium';
        };

        /* ── כרטיס תודה מונפש ───────────────────
           מחליף את תוכן הטופס בכרטיס ירוק עם
           אנימציית כניסה חלקה לאחר שליחה מוצלחת. */
        const showThankYou = (name) => {
            /* שמירת גובה הטופס לפני החלפה (מניעת קפיצת Layout) */
            form.style.minHeight = form.offsetHeight + 'px';

            form.innerHTML = `
                <div
                  class="flex flex-col items-center justify-center text-center gap-5 py-10 px-4"
                  style="animation: thankYouFadeIn 0.6s ease-out both;"
                >
                  <!-- אייקון וי מונפש -->
                  <div class="w-20 h-20 rounded-full bg-sage-100 flex items-center justify-center shadow-soft">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#437254"
                      stroke-width="2.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="w-10 h-10"
                      style="animation: checkDraw 0.5s ease-out 0.3s both;"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>

                  <!-- כותרת תודה מותאמת אישית -->
                  <div>
                    <h3 class="font-display text-2xl font-bold text-sage-900 mb-2">
                      תודה רבה${name ? `, ${name}` : ''}! 💚
                    </h3>
                    <p class="text-ink-700 leading-relaxed">
                      הפנייה שלכם נקלטה בהצלחה.<br />
                      אחזור אליכם בהקדם האפשרי.
                    </p>
                  </div>

                  <!-- קישור לחזרה לדף -->
                  <a
                    href="#home"
                    class="mt-2 inline-flex items-center gap-2 text-sage-600 hover:text-sage-800 font-medium text-sm transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24"
                         fill="none" stroke="currentColor" stroke-width="2"
                         stroke-linecap="round" stroke-linejoin="round">
                      <path d="M19 12H5M12 5l-7 7 7 7"/>
                    </svg>
                    חזרה לדף הראשי
                  </a>
                </div>
            `;
        };
    };

    /* ── הוספת keyframes לאנימציית כרטיס התודה ──
       מוסיף ל-<head> פעם אחת בלבד               */
    const injectThankYouStyles = () => {
        if (document.getElementById('thank-you-keyframes')) return;
        const style = document.createElement('style');
        style.id = 'thank-you-keyframes';
        style.textContent = `
            @keyframes thankYouFadeIn {
                from { opacity: 0; transform: translateY(16px); }
                to   { opacity: 1; transform: translateY(0);    }
            }
            @keyframes checkDraw {
                from { opacity: 0; transform: scale(0.5); }
                to   { opacity: 1; transform: scale(1);   }
            }
        `;
        document.head.appendChild(style);
    };

    document.addEventListener('DOMContentLoaded', () => {
        injectThankYouStyles();
        initContactForm();
    });

})();
