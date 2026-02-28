/* ==========================================================
   ABOUT PAGE — Scroll storytelling + floating orb background
   ========================================================== */

(function initAbout() {
    /* ── 3D Background Orb ── */
    const canvas = document.getElementById('about-canvas');
    if (canvas && window.THREE) {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, canvas.parentElement.offsetWidth / canvas.parentElement.offsetHeight, 0.1, 100);
        camera.position.z = 4;

        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
        renderer.setSize(canvas.parentElement.offsetWidth, canvas.parentElement.offsetHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);

        const light1 = new THREE.PointLight(0xc0a062, 3, 15);
        light1.position.set(2, 2, 2);
        scene.add(light1);
        const light2 = new THREE.PointLight(0xe8c87a, 2, 15);
        light2.position.set(-2, -1, 1);
        scene.add(light2);
        scene.add(new THREE.AmbientLight(0xffffff, 0.1));

        const geo = new THREE.SphereGeometry(1.4, 64, 64);
        const mat = new THREE.MeshPhongMaterial({
            color: 0xc0a062,
            emissive: 0x1a1060,
            specular: 0xe8c87a,
            shininess: 60,
            transparent: true,
            opacity: 0.6,
            wireframe: false
        });
        const orb = new THREE.Mesh(geo, mat);
        scene.add(orb);

        const geoW = new THREE.SphereGeometry(1.42, 24, 24);
        const matW = new THREE.MeshBasicMaterial({ color: 0xd4b876, wireframe: true, transparent: true, opacity: 0.12 });
        scene.add(new THREE.Mesh(geoW, matW));

        let t = 0;
        const mouse = { x: 0, y: 0 };
        document.addEventListener('mousemove', e => {
            mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
            mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
        });

        (function loop() {
            requestAnimationFrame(loop);
            t += 0.005;
            orb.rotation.y += 0.003;
            orb.rotation.x += 0.001;
            light1.position.x = Math.sin(t) * 3;
            light1.position.y = Math.cos(t * 0.7) * 2;
            light2.position.x = Math.cos(t * 0.5) * 3;
            renderer.render(scene, camera);
        })();
    }

    /* ── GSAP Scroll Reveals ── */
    if (!window.gsap) return;

    const container = document.getElementById('page-about');
    if (!container) return;

    // Hero name split reveal
    const nameEl = container.querySelector('.about-hero__name-large');
    if (nameEl) {
        gsap.from(nameEl, { opacity: 0, y: 60, duration: 1.2, ease: 'expo.out', delay: 0.2 });
    }

    gsap.from(container.querySelector('.about-hero__tagline'), {
        opacity: 0, y: 40, duration: 1, ease: 'expo.out', delay: 0.5
    });

    gsap.from(container.querySelectorAll('.about-hero__meta-item'), {
        opacity: 0, y: 20, duration: 0.8, stagger: 0.15, ease: 'expo.out', delay: 0.7
    });

    // Story blocks
    container.querySelectorAll('.about-story__block').forEach((block, i) => {
        if (window.ScrollTrigger) {
            gsap.from(block, {
                scrollTrigger: { trigger: block, start: 'top 80%' },
                opacity: 0, x: -40, duration: 0.9, ease: 'expo.out', delay: i * 0.1
            });
        }
    });

    // Profile
    const profile = container.querySelector('.about-profile-placeholder');
    if (profile && window.ScrollTrigger) {
        gsap.from(profile, {
            scrollTrigger: { trigger: profile, start: 'top 80%' },
            opacity: 0, scale: 0.9, duration: 1, ease: 'expo.out'
        });
    }

    // Chips
    if (window.ScrollTrigger) {
        gsap.from(container.querySelectorAll('.chip'), {
            scrollTrigger: { trigger: '.about-interests', start: 'top 85%' },
            opacity: 0, y: 20, stagger: 0.07, duration: 0.6, ease: 'expo.out'
        });
    }
})();
