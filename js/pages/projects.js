/* ==========================================================
   PROJECTS PAGE — Card reveals + modal
   ========================================================== */

(function initProjects() {
    const page = document.getElementById('page-projects');
    if (!page) return;

    /* ── Card reveal ── */
    const cards = page.querySelectorAll('.project-card');
    const obs = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('visible'), i * 100);
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    cards.forEach(c => obs.observe(c));

    /* ── Modal ── */
    const modal = document.getElementById('project-modal');
    const modalTitle = modal?.querySelector('.project-modal__title');
    const modalDesc = modal?.querySelector('.project-modal__desc');
    const modalRole = modal?.querySelector('.project-modal__role');
    const modalChallenge = modal?.querySelector('.project-modal__challenge');
    const modalTech = modal?.querySelector('.project-modal__tech');
    const modalClose = modal?.querySelector('.project-modal__close');
    const modalBackdrop = modal?.querySelector('.project-modal__backdrop');

    const openModal = (card) => {
        if (!modal) return;
        const data = card.dataset;
        if (modalTitle) modalTitle.textContent = data.title || '';
        if (modalDesc) modalDesc.textContent = data.desc || '';
        if (modalRole) modalRole.textContent = data.role || '';
        if (modalChallenge) modalChallenge.textContent = data.challenge || '';
        if (modalTech) {
            modalTech.innerHTML = '';
            (data.tech || '').split(',').forEach(t => {
                const span = document.createElement('span');
                span.className = 'chip';
                span.textContent = t.trim();
                modalTech.appendChild(span);
            });
        }
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        if (!modal) return;
        modal.classList.remove('open');
        document.body.style.overflow = '';
    };

    page.querySelectorAll('.project-card').forEach(card => {
        card.querySelector('.project-card__overlay-btn--primary')?.addEventListener('click', () => openModal(card));
    });

    modalClose?.addEventListener('click', closeModal);
    modalBackdrop?.addEventListener('click', closeModal);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

    /* ── GSAP header ── */
    if (window.gsap) {
        gsap.from(page.querySelector('.section-header'), {
            opacity: 0, y: 40, duration: 0.9, ease: 'expo.out', delay: 0.1
        });
    }
})();
