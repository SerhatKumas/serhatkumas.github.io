/* ==========================================================
   CURSOR — Magnetic animated custom cursor
   ========================================================== */

class Cursor {
  constructor() {
    this.dot  = document.querySelector('.cursor-dot');
    this.ring = document.querySelector('.cursor-ring');
    this.mouse = { x: -100, y: -100 };
    this.ringPos = { x: -100, y: -100 };
    this.raf = null;
    if (!this.dot || !this.ring) return;
    this.init();
  }

  init() {
    document.addEventListener('mousemove', e => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      this.dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
    });

    document.addEventListener('mousedown', () => {
      this.dot.classList.add('clicking');
      this.ring.classList.add('clicking');
    });

    document.addEventListener('mouseup', () => {
      this.dot.classList.remove('clicking');
      this.ring.classList.remove('clicking');
    });

    // Hover detection on interactive elements
    const hoverTargets = 'a, button, .home-section-card, .project-card, .nav__link, .skills-tab, .contact-link';
    document.addEventListener('mouseover', e => {
      if (e.target.closest(hoverTargets)) {
        this.dot.classList.add('hovering');
        this.ring.classList.add('hovering');
      }
    });
    document.addEventListener('mouseout', e => {
      if (e.target.closest(hoverTargets)) {
        this.dot.classList.remove('hovering');
        this.ring.classList.remove('hovering');
      }
    });

    this.animate();
  }

  animate() {
    // Lag ring behind dot
    this.ringPos.x += (this.mouse.x - this.ringPos.x) * 0.12;
    this.ringPos.y += (this.mouse.y - this.ringPos.y) * 0.12;
    this.ring.style.transform = `translate(${this.ringPos.x}px, ${this.ringPos.y}px) translate(-50%, -50%)`;
    this.raf = requestAnimationFrame(() => this.animate());
  }
}

window.portfolioCursor = new Cursor();
