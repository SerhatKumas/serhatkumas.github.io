/* ==========================================================
   EDUCATION PAGE — Timeline animations
   ========================================================== */

(function initEducation() {
    if (!window.gsap) return;

    const page = document.getElementById('page-education');
    if (!page) return;

    // Header
    gsap.from(page.querySelector('.section-header'), {
        opacity: 0, y: 40, duration: 0.9, ease: 'expo.out', delay: 0.1
    });

    // Timeline entries
    const entries = page.querySelectorAll('.edu-entry');
    const obs = new IntersectionObserver((records) => {
        records.forEach((rec, i) => {
            if (rec.isIntersecting) {
                setTimeout(() => rec.target.classList.add('visible'), i * 100);
                obs.unobserve(rec.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
    entries.forEach(e => obs.observe(e));

    // Cert cards
    const certObs = new IntersectionObserver((records) => {
        records.forEach((rec, i) => {
            if (rec.isIntersecting) {
                setTimeout(() => {
                    gsap.from(rec.target, { opacity: 0, y: 20, duration: 0.6, ease: 'expo.out' });
                    rec.target.style.opacity = 1;
                }, i * 80);
                certObs.unobserve(rec.target);
            }
        });
    }, { threshold: 0.1 });
    page.querySelectorAll('.cert-card').forEach(c => certObs.observe(c));
})();
