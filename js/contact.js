/* ==============================================
   contact.js – טיפול בטופס יצירת הקשר
   שליחה דרך FormSubmit.co (שליחה נטיבית)
   ולידציה בסיסית מצד לקוח לפני שליחה
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

            /* ── נעילת כפתור בזמן שליחה ─────────── */
            if (submitBtn) {
                submitBtn.disabled    = true;
                submitBtn.textContent = 'שולח...';
            }

            /* ── הוספת השם לכתובת דף התודה ─────────
               מעדכנים את שדה _next כך שיכלול את שם
               הפונה כפרמטר URL לפני השליחה           */
            const nextInput = form.querySelector('input[name="_next"]');
            if (nextInput) {
                const base = nextInput.value.split('?')[0];
                nextInput.value = base + '?name=' + encodeURIComponent(nameVal);
            }

            /* ── שליחה נטיבית ל-FormSubmit.co ──────
               FormSubmit.co מטפל בשליחת המייל ומפנה
               לדף thanks.html לפי שדה _next          */
            form.submit();
        });

        /* ── הודעת שגיאה טקסטואלית ──────────── */
        const showStatus = (message, type) => {
            if (!status) return;
            status.textContent = message;
            status.className   = type === 'success'
                ? 'text-center text-sm mt-2 text-sage-700 font-medium'
                : 'text-center text-sm mt-2 text-rose-400 font-medium';
        };
    };

    document.addEventListener('DOMContentLoaded', () => {
        initContactForm();
    });

})();
