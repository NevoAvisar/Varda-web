/* ==============================================
   contact.js – טיפול בטופס יצירת הקשר
   שליחה אמיתית דרך Netlify Forms באמצעות fetch()
   ולידציה בסיסית מצד לקוח והצגת הודעת סטטוס
   ============================================== */

(function () {
    'use strict';

    /* ==============================================
       5. טיפול בטופס יצירת קשר
       ============================================== */
    const initContactForm = () => {
        const form      = document.getElementById('contact-form');
        const status    = document.getElementById('form-status');
        const submitBtn = document.getElementById('form-submit-btn');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            /* השתמש ב-form.elements כדי למנוע התנגשות עם
               המאפיין הנייטיב form.name של הטופס עצמו */
            const nameVal  = form.elements['name']?.value.trim();
            const phoneVal = form.elements['phone']?.value.trim();

            // ולידציה בסיסית – שם וטלפון חובה
            if (!nameVal || !phoneVal) {
                showStatus('אנא מלאו שם וטלפון כדי שנוכל לחזור אליכם.', 'error');
                return;
            }

            // בדיקת פורמט מספר טלפון
            if (!/^[\d\s+()-]{7,}$/.test(phoneVal)) {
                showStatus('מספר הטלפון אינו תקין, נא לבדוק שוב.', 'error');
                return;
            }

            // נעילת כפתור השליחה במהלך הבקשה
            setSubmitting(true);

            /* ===== שליחה ל-Netlify Forms באמצעות fetch =====
               Netlify מזהה את הטופס לפי שדה form-name הנסתר.
               הצורה היחידה הנדרשת: application/x-www-form-urlencoded */
            fetch('/', {
                method : 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body   : new URLSearchParams(new FormData(form)).toString(),
            })
                .then(() => {
                    showStatus('מעולה! הפנייה נקלטה, אחזור אליכם בהקדם. 💚', 'success');
                    form.reset();
                })
                .catch(() => {
                    showStatus(
                        'אירעה שגיאה בשליחה. אנא נסו שוב או צרו קשר ישירות.',
                        'error'
                    );
                })
                .finally(() => {
                    setSubmitting(false);
                });
        });

        /** נעילה/שחרור כפתור השליחה */
        const setSubmitting = (isBusy) => {
            if (!submitBtn) return;
            submitBtn.disabled    = isBusy;
            submitBtn.textContent = isBusy ? 'שולח...' : 'שליחת פנייה';
        };

        /** הצגת הודעת סטטוס צבעונית בתוך הטופס */
        const showStatus = (message, type) => {
            if (!status) return;
            status.textContent = message;
            status.className   = type === 'success'
                ? 'text-center text-sm mt-2 text-sage-700 font-medium'
                : 'text-center text-sm mt-2 text-rose-400 font-medium';
        };
    };

    /* אתחול לאחר טעינת ה-DOM */
    document.addEventListener('DOMContentLoaded', () => {
        initContactForm();
    });

})();
