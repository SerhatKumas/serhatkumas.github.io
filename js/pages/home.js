/* ==========================================================
   HOME PAGE — Three.js Interactive 3D Hub
   ========================================================== */

(function initHome() {
    const canvas = document.getElementById('home-canvas');
    if (!canvas || !window.THREE) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    /* ── Realistic 3D Laptop ── */
    const laptopGroup = new THREE.Group();

    // Detailed Materials
    const matSilver = new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.3, metalness: 0.8 });
    const matDark = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9, metalness: 0.1 }); // Trackpad/bezel

    // Keyboard Texture Generation via Canvas
    const kbCanvas = document.createElement('canvas');
    kbCanvas.width = 512; kbCanvas.height = 256;
    const kbCtx = kbCanvas.getContext('2d');
    kbCtx.fillStyle = '#1e293b'; // dark base
    kbCtx.fillRect(0, 0, 512, 256);
    kbCtx.fillStyle = '#0f172a'; // keys
    for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 14; c++) {
            let w = 30; let keyX = 15 + c * 34;
            // Spacebar logic
            if (r === 4 && (c > 3 && c < 10)) {
                if (c === 4) { kbCtx.fillRect(keyX, 15 + r * 45, 180, 35); }
                continue;
            }
            kbCtx.fillRect(keyX, 15 + r * 45, w, 35);
        }
    }
    const kbTex = new THREE.CanvasTexture(kbCanvas);
    const matKb = new THREE.MeshStandardMaterial({ map: kbTex, roughness: 0.6, metalness: 0.4 });

    // Screen Texture Generation via Canvas
    const scCanvas = document.createElement('canvas');
    scCanvas.width = 1024; scCanvas.height = 512;
    const scCtx = scCanvas.getContext('2d');
    scCtx.fillStyle = '#0f172a'; scCtx.fillRect(0, 0, 1024, 512); // Background Editor
    scCtx.fillStyle = '#1e293b'; scCtx.fillRect(0, 0, 80, 512); // Sidebar
    scCtx.fillStyle = '#334155'; scCtx.fillRect(0, 0, 1024, 40); // Topbar

    // MacOS window dots
    ['#ef4444', '#f59e0b', '#22c55e'].forEach((c, i) => {
        scCtx.fillStyle = c; scCtx.beginPath(); scCtx.arc(25 + i * 20, 20, 6, 0, Math.PI * 2); scCtx.fill();
    });

    // Write Hero Text Into Screen

    // 1. Availability Eyebrow
    scCtx.font = "bold 18px monospace";
    scCtx.fillStyle = '#22c55e'; // Green dot accent
    scCtx.fillText("●", 120, 140);
    scCtx.fillStyle = '#94a3b8';
    scCtx.fillText("AVAILABLE FOR WORK — OPEN TO INTERNATIONAL OPPORTUNITIES", 145, 140);

    // 2. Name
    const gradient = scCtx.createLinearGradient(120, 0, 600, 0);
    gradient.addColorStop(0, "#ffffff");
    gradient.addColorStop(1, "#38bdf8");
    scCtx.font = "900 90px sans-serif";
    scCtx.fillStyle = gradient;
    scCtx.fillText("Serhat Kumas", 115, 260);

    // 3. Tagline
    scCtx.font = "400 32px sans-serif";
    scCtx.fillStyle = '#cbd5e1';
    const t1 = "Software Engineer focused on ";
    scCtx.fillText(t1, 120, 330);
    const t1Width = scCtx.measureText(t1).width;
    scCtx.fillStyle = '#38bdf8'; // Accent color
    scCtx.fillText("AI Applications", 120 + t1Width, 330);

    // 4. Decorative IDE Elements
    scCtx.font = "20px monospace";
    scCtx.fillStyle = '#475569';
    scCtx.fillText("> System.ready()", 120, 440);
    scCtx.fillText("> _", 120, 470);
    const scTex = new THREE.CanvasTexture(scCanvas);
    const matScreenReal = new THREE.MeshStandardMaterial({
        map: scTex, emissive: 0x38bdf8, emissiveIntensity: 0.2, roughness: 1.0, metalness: 0.0
    });

    // Base Assembly
    const baseGroup = new THREE.Group();
    const baseGeo = new THREE.BoxGeometry(4.2, 0.1, 2.0); // reduced depth from 2.4 to 2.0, increased width 3.6 to 4.2
    const base = new THREE.Mesh(baseGeo, matSilver);
    baseGroup.add(base);

    // Keyboard
    const kbGeo = new THREE.BoxGeometry(3.6, 0.02, 1.0); // reduced depth from 1.2 to 1.0, increased width 3.0 to 3.6
    const kb = new THREE.Mesh(kbGeo, matKb);
    kb.position.set(0, 0.05, -0.2); // shifted to match new depth
    baseGroup.add(kb);

    // Trackpad
    const padGeo = new THREE.BoxGeometry(1.6, 0.01, 0.6); // reduced depth from 0.7 to 0.6, increased width 1.2 to 1.6
    const pad = new THREE.Mesh(padGeo, matDark);
    pad.position.set(0, 0.055, 0.65); // shifted
    baseGroup.add(pad);

    // Hinge
    const hingeGeo = new THREE.CylinderGeometry(0.06, 0.06, 3.6, 16); // length 3.0 to 3.6
    const hinge = new THREE.Mesh(hingeGeo, matDark);
    hinge.rotation.z = Math.PI / 2;
    hinge.position.set(0, 0.02, -1.0); // shifted to match base back edge
    baseGroup.add(hinge);

    laptopGroup.add(baseGroup);

    // Lid Assembly
    window.lidGroup = new THREE.Group(); // globally exposed to animate rotation easily
    const lidGroup = window.lidGroup;
    lidGroup.position.set(0, 0.02, -1.0); // Pivot on the new hinge position

    // Outer lid casing (Matches base width)
    const lidGeo = new THREE.BoxGeometry(4.2, 2.4, 0.05); // width 3.6 to 4.2
    const lid = new THREE.Mesh(lidGeo, matSilver);
    lid.position.set(0, 1.2, 0); // Center lid mesh relative to pivot
    lidGroup.add(lid);

    // Inner bezel
    const bezelGeo = new THREE.PlaneGeometry(4.2, 2.4); // width 3.6 to 4.2
    const bezel = new THREE.Mesh(bezelGeo, matDark);
    bezel.position.set(0, 1.2, 0.026);
    lidGroup.add(bezel);

    // Screen display plane
    const screenGeo = new THREE.PlaneGeometry(4.0, 2.15); // width 3.4 to 4.0
    const screen = new THREE.Mesh(screenGeo, matScreenReal);
    screen.position.set(0, 1.2, 0.027); // Very slightly in front of bezel
    lidGroup.add(screen);

    // Glowing Apple-style logo (Custom generic)
    const logoGeo = new THREE.PlaneGeometry(0.3, 0.3);
    const lCanvas = document.createElement('canvas'); lCanvas.width = 64; lCanvas.height = 64;
    const lCtx = lCanvas.getContext('2d');
    lCtx.fillStyle = '#ffffff';
    lCtx.beginPath();
    lCtx.arc(32, 32, 24, 0, Math.PI * 2);
    lCtx.fill();
    lCtx.globalCompositeOperation = 'destination-out';
    lCtx.beginPath(); lCtx.arc(42, 20, 12, 0, Math.PI * 2); lCtx.fill(); // bite shape
    const lTex = new THREE.CanvasTexture(lCanvas);
    const mLogo = new THREE.MeshStandardMaterial({ map: lTex, emissive: 0xffffff, emissiveIntensity: 0.8, transparent: true });

    const logo = new THREE.Mesh(logoGeo, mLogo);
    logo.position.set(0, 1.2, -0.026); // Backside of the casing
    logo.rotation.y = Math.PI; // Face backwards
    lidGroup.add(logo);

    laptopGroup.add(lidGroup);

    // Configure initial position and start with lid closed down
    laptopGroup.position.set(0, -1.0, 0);
    laptopGroup.scale.set(1.6, 1.6, 1.6); // Scale slightly up since geometry is smaller
    lidGroup.rotation.x = Math.PI / 2;
    scene.add(laptopGroup);

    /* ── Mouse parallax ── */
    const mouse = { x: 0, y: 0 };
    document.addEventListener('mousemove', e => {
        mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
        mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    /* ── Resize ── */
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    /* ── GSAP hero text animation ── */
    if (window.gsap) {
        gsap.from('.home-hero__actions', { opacity: 0, y: 20, duration: 0.8, delay: 0.8, ease: 'expo.out' });
        gsap.from('.home-hero__scroll', { opacity: 0, y: 20, duration: 0.8, delay: 1.0, ease: 'expo.out' });

        // Cards
        gsap.from('.home-section-card', {
            opacity: 0, y: 50,
            duration: 0.8,
            stagger: 0.1,
            ease: 'expo.out',
            delay: 0.4,
            scrollTrigger: {
                trigger: '.home-sections',
                start: 'top 80%'
            }
        });
    }

    /* ── Lights ── */
    scene.add(new THREE.AmbientLight(0xffffff, 0.9));
    const pointLight1 = new THREE.PointLight(0x38bdf8, 1.5, 20);
    pointLight1.position.set(3, 4, 3);
    scene.add(pointLight1);
    const pointLight2 = new THREE.PointLight(0xe2e8f0, 1.5, 20);
    pointLight2.position.set(-3, -2, 4);
    scene.add(pointLight2);

    /* ── Animate ── */
    let t = 0;

    // Animation target variables
    let currentLidAngle = Math.PI / 2; // Start completely closed
    const targetLidAngle = -0.1 * Math.PI; // Open past 90 degrees backward slightly

    function animate() {
        requestAnimationFrame(animate);
        t += 0.015;

        // Smooth lid opening down from closed to open position
        if (currentLidAngle > targetLidAngle) {
            currentLidAngle += (targetLidAngle - currentLidAngle) * 0.03;
            if (window.lidGroup) {
                window.lidGroup.rotation.x = currentLidAngle;
            }
        }

        // Stationary Laptop
        laptopGroup.position.y = -1.0; // Lowered further down per user request
        laptopGroup.rotation.y = 0;
        laptopGroup.rotation.z = 0;
        laptopGroup.rotation.x = 0.2; // Gentle pitch to reveal the keyboard from a seated perspective

        // Point lights orbit to cast moving specular highlights over the metal surfaces
        pointLight1.position.x = Math.sin(t * 0.5) * 5;
        pointLight1.position.y = 2 + Math.cos(t * 0.3) * 2;
        pointLight2.position.x = Math.cos(t * 0.4) * 4;
        pointLight2.position.y = Math.sin(t * 0.6) * 3;

        // Interactive mouse parallax offset - base camera at 1.0 height for a moderate top-down "sitting" view without cutting off the top edge
        camera.position.x += (mouse.x * 0.5 - camera.position.x) * 0.05;
        camera.position.y += (-mouse.y * 0.3 + 1.0 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }

    animate();
})();
