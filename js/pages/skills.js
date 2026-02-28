/* ==========================================================
   SKILLS PAGE — Tabs + animated progress bars
   ========================================================== */

(function initSkills() {
    const page = document.getElementById('page-skills');
    if (!page) return;

    /* ── Tabs ── */
    const tabs = page.querySelectorAll('.skills-tab');
    const panels = page.querySelectorAll('.skills-panel');

    const showPanel = (id) => {
        panels.forEach(p => p.classList.toggle('active', p.dataset.panel === id));
        tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === id));
        // Reset and reveal fills
        setTimeout(() => animateFills(id), 100);
        // Reveal bubbles + rows
        revealBubbles();
        revealRows();
    };

    tabs.forEach(tab => {
        tab.addEventListener('click', () => showPanel(tab.dataset.tab));
    });

    /* ── Skill bar animation ── */
    const animateFills = (panelId) => {
        const panel = page.querySelector(`.skills-panel[data-panel="${panelId}"]`);
        if (!panel) return;
        panel.querySelectorAll('.skill-row__fill').forEach(fill => {
            fill.style.width = '0%';
            setTimeout(() => {
                fill.style.width = fill.dataset.pct || '0%';
            }, 100);
        });
    };

    /* ── Visible reveal for bubbles ── */
    const revealBubbles = () => {
        const obs = new IntersectionObserver((entries) => {
            entries.forEach((e, i) => {
                if (e.isIntersecting) {
                    setTimeout(() => e.target.classList.add('visible'), i * 60);
                    obs.unobserve(e.target);
                }
            });
        }, { threshold: 0.1 });
        page.querySelectorAll('.skill-bubble:not(.visible)').forEach(b => obs.observe(b));
    };

    const revealRows = () => {
        const obs = new IntersectionObserver((entries) => {
            entries.forEach((e, i) => {
                if (e.isIntersecting) {
                    setTimeout(() => e.target.classList.add('visible'), i * 50);
                    obs.unobserve(e.target);
                }
            });
        }, { threshold: 0.05 });
        page.querySelectorAll('.skill-row:not(.visible)').forEach(r => obs.observe(r));
    };

    /* ── Three.js background ── */
    const canvas = document.getElementById('skills-canvas');
    if (canvas && window.THREE) {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, canvas.offsetWidth / canvas.offsetHeight, 0.1, 50);
        camera.position.z = 5;
        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
        renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        renderer.setClearColor(0x000000, 0);

        scene.add(new THREE.AmbientLight(0xc0a062, 0.5));

        // Floating icons
        const shapes = [];
        const colors = [0xc0a062, 0xe8c87a, 0xFF6B9D];
        for (let i = 0; i < 30; i++) {
            const geo = Math.random() > 0.5
                ? new THREE.OctahedronGeometry(0.12, 0)
                : new THREE.TetrahedronGeometry(0.12, 0);
            const mat = new THREE.MeshPhongMaterial({
                color: colors[i % 3],
                emissive: colors[i % 3],
                emissiveIntensity: 0.3,
                transparent: true,
                opacity: 0.6
            });
            const mesh = new THREE.Mesh(geo, mat);
            mesh.position.set(
                (Math.random() - 0.5) * 12,
                (Math.random() - 0.5) * 8,
                (Math.random() - 0.5) * 4
            );
            scene.add(mesh);
            shapes.push({ mesh, speed: 0.3 + Math.random() * 0.7, offset: Math.random() * Math.PI * 2 });
        }

        let t = 0;
        (function loop() {
            requestAnimationFrame(loop);
            t += 0.005;
            shapes.forEach(s => {
                s.mesh.rotation.y += 0.02 * s.speed;
                s.mesh.rotation.x += 0.01 * s.speed;
                s.mesh.position.y += Math.sin(t * s.speed + s.offset) * 0.002;
            });
            renderer.render(scene, camera);
        })();
    }

    /* ── Init first tab ── */
    showPanel('languages');

    /* ── GSAP header ── */
    if (window.gsap) {
        gsap.from(page.querySelector('.section-header'), {
            opacity: 0, y: 40, duration: 0.9, ease: 'expo.out', delay: 0.1
        });
        gsap.from(page.querySelectorAll('.skills-stat'), {
            opacity: 0, y: 30, stagger: 0.1, duration: 0.8, ease: 'expo.out', delay: 0.3,
            scrollTrigger: page.querySelector('.skills-stats')
                ? { trigger: '.skills-stats', start: 'top 80%' }
                : undefined
        });
    }
})();
