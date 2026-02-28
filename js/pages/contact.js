/* ==========================================================
   CONTACT PAGE — Form validation + Three.js particles
   ========================================================== */

(function initContact() {
    const page = document.getElementById('page-contact');
    if (!page) return;

    /* ── Three.js particle background ── */
    const canvas = document.getElementById('contact-canvas');
    if (canvas && window.THREE) {
        const w = window.innerWidth;
        const h = window.innerHeight;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 50);
        camera.position.z = 5;
        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
        renderer.setSize(w, h);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        renderer.setClearColor(0x000000, 0);

        const count = 300;
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 20;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        const mat = new THREE.PointsMaterial({ color: 0xc0a062, size: 0.04, transparent: true, opacity: 0.4 });
        const pts = new THREE.Points(geo, mat);
        scene.add(pts);

        let t = 0;
        (function loop() {
            requestAnimationFrame(loop);
            t += 0.001;
            pts.rotation.y += 0.0005;
            pts.rotation.x += 0.0002;
            renderer.render(scene, camera);
        })();
    }

    /* ── Floating labels ── */
    page.querySelectorAll('.form-control').forEach(input => {
        const label = input.previousElementSibling;
        if (!label || label.tagName !== 'LABEL') return;

        const check = () => {
            if (input.value.trim().length > 0 || document.activeElement === input) {
                label.classList.add('floating-label');
            } else {
                label.classList.remove('floating-label');
            }
        };

        input.addEventListener('focus', check);
        input.addEventListener('blur', check);
        input.addEventListener('input', check);
    });

    /* ── Form Validation ── */
    const form = page.querySelector('.contact-form form');
    const success = page.querySelector('.form-success');
    const submitBtn = page.querySelector('.btn-submit');

    if (!form) return;

    const validate = (field) => {
        const group = field.closest('.form-group');
        const errEl = group?.querySelector('.form-error');
        let valid = true;
        let msg = '';

        if (field.required && !field.value.trim()) {
            valid = false; msg = 'This field is required.';
        } else if (field.type === 'email' && field.value) {
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
                valid = false; msg = 'Please enter a valid email.';
            }
        }

        group?.classList.toggle('has-error', !valid);
        field.classList.toggle('error', !valid);
        if (errEl) errEl.textContent = msg;
        return valid;
    };

    form.querySelectorAll('.form-control').forEach(f => {
        f.addEventListener('blur', () => validate(f));
        f.addEventListener('input', () => {
            if (f.classList.contains('error')) validate(f);
        });
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let allValid = true;
        form.querySelectorAll('.form-control').forEach(f => {
            if (!validate(f)) allValid = false;
        });

        if (!allValid) return;

        // Simulate sending
        submitBtn.classList.add('sending');
        submitBtn.disabled = true;

        setTimeout(() => {
            form.style.display = 'none';
            if (success) success.classList.add('show');
            submitBtn.classList.remove('sending');
            submitBtn.disabled = false;
        }, 1800);
    });

    /* ── GSAP ── */
    if (window.gsap) {
        gsap.from(page.querySelector('.contact-info__heading'), { opacity: 0, y: 50, duration: 1, ease: 'expo.out', delay: 0.2 });
        gsap.from(page.querySelector('.contact-info__desc'), { opacity: 0, y: 30, duration: 0.9, ease: 'expo.out', delay: 0.4 });
        gsap.from(page.querySelectorAll('.contact-link'), { opacity: 0, x: -30, stagger: 0.12, duration: 0.8, ease: 'expo.out', delay: 0.5 });
        gsap.from(page.querySelector('.contact-form'), { opacity: 0, x: 40, duration: 1, ease: 'expo.out', delay: 0.3 });
    }
})();
