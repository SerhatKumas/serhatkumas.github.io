/* ==========================================================
   LOADER — Animated preloader
   ========================================================== */

class Loader {
    constructor(onComplete) {
        this.el = document.querySelector('.loader');
        this.fill = document.querySelector('.loader__bar-fill');
        this.count = document.querySelector('.loader__count');
        this.progress = 0;
        this.onComplete = onComplete;
        if (!this.el) { onComplete && onComplete(); return; }
        this.run();
    }

    run() {
        const target = 100;
        const duration = 1800;
        const start = performance.now();

        const tick = (now) => {
            const elapsed = now - start;
            const t = Math.min(elapsed / duration, 1);
            // Ease in-out
            const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
            this.progress = Math.floor(ease * target);

            if (this.fill) this.fill.style.width = this.progress + '%';
            if (this.count) this.count.textContent = this.progress + '%';

            if (t < 1) {
                requestAnimationFrame(tick);
            } else {
                this.complete();
            }
        };

        requestAnimationFrame(tick);
    }

    complete() {
        setTimeout(() => {
            if (this.el) {
                this.el.classList.add('hidden');
                setTimeout(() => {
                    this.el.remove();
                    this.onComplete && this.onComplete();
                }, 1000);
            } else {
                this.onComplete && this.onComplete();
            }
        }, 200);
    }
}

window.PortfolioLoader = Loader;
