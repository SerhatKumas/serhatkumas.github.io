/* ==========================================================
   EXPERIENCE PAGE — Scroll-driven career timeline
   ========================================================== */

(function initExperience() {
    const page = document.getElementById('page-experience');
    if (!page) return;

    /* ── Scroll progress bar ── */
    const fill = page.querySelector('.exp-progress-bar__fill');
    const yearEl = page.querySelector('.exp-progress-bar__year');
    const timeline = page.querySelector('.exp-timeline');

    const years = ['2019', '2020', '2021', '2022', '2023', '2024', '2025'];

    if (fill && timeline) {
        const updateProgress = () => {
            const rect = timeline.getBoundingClientRect();
            const total = timeline.offsetHeight;
            const scrolled = Math.max(0, -rect.top + window.innerHeight * 0.3);
            const pct = Math.min(100, (scrolled / total) * 100);
            fill.style.width = pct + '%';
            // Interpolate year
            const yearIdx = Math.floor((pct / 100) * (years.length - 1));
            if (yearEl) yearEl.textContent = years[yearIdx] || years[0];
        };
        window.addEventListener('scroll', updateProgress, { passive: true });
        updateProgress();
    }

    /* ── Card reveal ── */
    const cards = page.querySelectorAll('.exp-card');
    const obs = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('visible'), i * 80);
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    cards.forEach(c => obs.observe(c));

    /* ── GSAP header ── */
    if (window.gsap) {
        gsap.from(page.querySelector('.section-header'), {
            opacity: 0, y: 40, duration: 0.9, ease: 'expo.out', delay: 0.1
        });
    }
})();
