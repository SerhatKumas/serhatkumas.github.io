/* ==========================================================
   ROUTER — SPA Hash Router with GSAP page transitions
   ========================================================== */

class Router {
    constructor() {
        this.pages = document.querySelectorAll('.page');
        this.links = document.querySelectorAll('[data-page]');
        this.current = null;
        this.isAnimating = false;
        this.handlers = {};
        this.init();
    }

    register(pageId, initFn) {
        this.handlers[pageId] = initFn;
    }

    init() {
        // Click handlers
        document.addEventListener('click', e => {
            const trigger = e.target.closest('[data-page]');
            if (!trigger) return;
            e.preventDefault();
            const target = trigger.dataset.page;
            if (target !== this.current) this.navigate(target);
        });

        // Hash change
        window.addEventListener('hashchange', () => {
            const hash = location.hash.replace('#', '') || 'home';
            if (hash !== this.current) this.navigate(hash, false);
        });

        // Initial load
        const hash = location.hash.replace('#', '') || 'home';
        this.navigate(hash, false);
    }

    navigate(pageId, pushState = true) {
        if (this.isAnimating) return;
        const target = document.getElementById('page-' + pageId);
        if (!target) return;

        this.isAnimating = true;

        if (pushState) {
            history.pushState({ page: pageId }, '', '#' + pageId);
        }

        // Update nav links
        document.querySelectorAll('[data-page]').forEach(l => {
            l.classList.toggle('active', l.dataset.page === pageId);
        });

        const prev = document.querySelector('.page.active');

        const showPage = () => {
            // Show new page
            this.pages.forEach(p => p.classList.remove('active'));
            target.classList.add('active');

            // Scroll to top
            window.scrollTo(0, 0);

            // GSAP entrance
            if (window.gsap) {
                gsap.fromTo(target,
                    { opacity: 0, y: 30 },
                    {
                        opacity: 1, y: 0,
                        duration: 0.7,
                        ease: 'expo.out',
                        onComplete: () => {
                            this.isAnimating = false;
                            this.current = pageId;
                            // Run page init handler
                            if (this.handlers[pageId]) {
                                this.handlers[pageId]();
                            } else {
                                this.runPageInit(pageId);
                            }
                            // Nav progress
                            this.updateProgress(pageId);
                        }
                    }
                );
            } else {
                target.style.opacity = 1;
                this.isAnimating = false;
                this.current = pageId;
                this.runPageInit(pageId);
            }
        };

        if (prev && prev.id !== 'page-' + pageId && window.gsap) {
            gsap.to(prev, {
                opacity: 0,
                y: -20,
                duration: 0.4,
                ease: 'expo.in',
                onComplete: () => {
                    prev.classList.remove('active');
                    showPage();
                }
            });
        } else {
            showPage();
        }
    }

    runPageInit(pageId) {
        // Default inits that don't require a registered handler
        initScrollReveal();
        initNavScroll();
    }

    updateProgress(pageId) {
        const order = ['home', 'lab', 'gamelab', 'about', 'education', 'experience', 'projects', 'skills', 'contact'];
        const idx = order.indexOf(pageId);
        const pct = idx >= 0 ? ((idx + 1) / order.length) : 0;
        const bar = document.querySelector('.nav__progress');
        if (bar) bar.style.transform = `scaleX(${pct})`;
    }
}

/* ── Scroll Reveal ── */
function initScrollReveal() {
    const els = document.querySelectorAll('.page.active .reveal, .page.active .edu-entry, .page.active .exp-card, .page.active .project-card, .page.active .skill-bubble, .page.active .skill-row');
    if (!els.length) return;

    const obs = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, i * 60);
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    els.forEach(el => obs.observe(el));
}

/* ── Nav Scroll ── */
function initNavScroll() {
    const nav = document.querySelector('.nav');
    if (!nav) return;
    const update = () => {
        nav.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
}

window.PortfolioRouter = Router;
window.initScrollReveal = initScrollReveal;
window.initNavScroll = initNavScroll;
