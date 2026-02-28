/* ==========================================================
   3D LAB — Multi-Object Interactive Gallery
   6 objects built with Three.js geometry primitives.
   Each object has unique interactions & animations.
   ========================================================== */

function initLab() {
    const canvas = document.getElementById('lab-canvas');
    if (!canvas || !window.THREE) return;

    /* ── Renderer ─────────────────────────────────────────── */
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor(0x000000, 0);

    /* ── Scene ────────────────────────────────────────────── */
    const scene = new THREE.Scene();

    /* ── Camera ───────────────────────────────────────────── */
    const camera = new THREE.PerspectiveCamera(38, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    camera.position.set(0, 0.5, 9);

    /* ── Lighting ─────────────────────────────────────────── */
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);
    const keyLight = new THREE.DirectionalLight(0xfff5e0, 2.0);
    keyLight.position.set(4, 5, 5); keyLight.castShadow = true; scene.add(keyLight);
    const fillLight = new THREE.PointLight(0xc0a062, 2.5, 20);
    fillLight.position.set(-5, 2, 3); scene.add(fillLight);
    const rimLight = new THREE.PointLight(0xd4b876, 2.0, 18);
    rimLight.position.set(2, -3, -5); scene.add(rimLight);
    const topLight = new THREE.DirectionalLight(0xffffff, 0.5);
    topLight.position.set(0, 8, 0); scene.add(topLight);

    /* ── Ground ───────────────────────────────────────────── */
    const planeMat = new THREE.MeshStandardMaterial({ color: 0xf5f6fa, roughness: 0.8, metalness: 0, transparent: true, opacity: 0.0 });
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), planeMat);
    plane.rotation.x = -Math.PI / 2; plane.position.y = -2.2; plane.receiveShadow = true;
    scene.add(plane);

    /* ── Shared Materials ─────────────────────────────────── */
    const M = {
        body: new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.2, metalness: 0.1 }),
        rubber: new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.9, metalness: 0 }),
        chrome: new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.1, metalness: 0.9 }),
        darkChr: new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.3, metalness: 0.7 }),
        red: new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.4, metalness: 0.1, emissive: 0x1e40af, emissiveIntensity: 0.3 }),
        glass: new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.0, metalness: 0.05, transparent: true, opacity: 0.88 }),
        lensRing: new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.1, metalness: 0.9 }),
        gold: new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.15, metalness: 0.9 }),
        white: new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.6, metalness: 0.1 }),
        teal: new THREE.MeshStandardMaterial({ color: 0x0ea5e9, roughness: 0.3, metalness: 0.2 }),
        orange: new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.4, metalness: 0.1 }),
        blue: new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.3, metalness: 0.15 }),
        purple: new THREE.MeshStandardMaterial({ color: 0x4f46e5, roughness: 0.3, metalness: 0.2 }),
        screen: new THREE.MeshStandardMaterial({ color: 0x0a0a0c, roughness: 0.0, metalness: 0.1, emissive: 0x1a1a20, emissiveIntensity: 0.5 }),
        fabric: new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.9, metalness: 0 }),
        sole: new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.7, metalness: 0 }),
        highlight: new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.5, metalness: 0.3, emissive: 0x1e40af, emissiveIntensity: 0.6 }),
    };

    /* ── Helper ───────────────────────────────────────────── */
    function addMesh(group, namedMap, name, geo, mat, px, py, pz, rx, ry, rz) {
        px = px || 0; py = py || 0; pz = pz || 0;
        rx = rx || 0; ry = ry || 0; rz = rz || 0;
        const m = new THREE.Mesh(geo, mat);
        m.position.set(px, py, pz); m.rotation.set(rx, ry, rz);
        m.castShadow = true; m.receiveShadow = true;
        m.userData.partName = name;
        group.add(m);
        if (namedMap) namedMap[name] = m;
        return m;
    }

    /* ══════════════════════════════════════════════════════════
       OBJECT BUILDERS — each returns { group, namedMeshes, tick, action, actionLabel, actionIcon }
       ══════════════════════════════════════════════════════════ */

    // ─── 1. CAMERA ──────────────────────────────────────────
    function buildCamera() {
        const g = new THREE.Group(), n = {};
        const add = (nm, geo, mat, px, py, pz, rx, ry, rz) => addMesh(g, n, nm, geo, mat, px, py, pz, rx, ry, rz);

        add('Body', new THREE.BoxGeometry(2.6, 1.65, 1.1), M.body);
        add('Grip', new THREE.BoxGeometry(0.62, 2.0, 1.1), M.rubber, 1.22, -0.18, 0);
        add('Top Plate', new THREE.BoxGeometry(2.6, 0.14, 0.95), M.chrome, 0, 0.89, 0);
        add('Mode Dial', new THREE.CylinderGeometry(0.28, 0.28, 0.18, 32), M.darkChr, -0.85, 0.97, 0);
        add('Shutter Button', new THREE.CylinderGeometry(0.12, 0.12, 0.12, 32), M.red, 0.9, 1.02, 0.32);
        add('Viewfinder', new THREE.BoxGeometry(0.55, 0.4, 0.72), M.body, -0.3, 1.08, -0.1);
        add('Viewfinder Glass', new THREE.BoxGeometry(0.35, 0.22, 0.08), M.glass, -0.3, 1.08, -0.6);
        add('Hot Shoe', new THREE.BoxGeometry(0.45, 0.06, 0.55), M.chrome, -0.3, 1.18, 0.1);
        add('Power Dial', new THREE.CylinderGeometry(0.18, 0.18, 0.13, 32), M.chrome, 0.85, 0.97, -0.3);
        const LZ = 0.62;
        add('Lens Mount', new THREE.TorusGeometry(0.72, 0.055, 16, 80), M.lensRing, 0, 0, LZ, Math.PI / 2, 0, 0);
        add('Lens Barrel', new THREE.CylinderGeometry(0.68, 0.68, 0.68, 64), M.darkChr, 0, 0, LZ + 0.28, Math.PI / 2, 0, 0);
        add('Focus Ring', new THREE.TorusGeometry(0.64, 0.045, 16, 80), M.gold, 0, 0, LZ + 0.12, Math.PI / 2, 0, 0);
        add('Zoom Ring', new THREE.CylinderGeometry(0.58, 0.6, 0.24, 64), M.chrome, 0, 0, LZ + 0.62, Math.PI / 2, 0, 0);
        add('Lens Glass', new THREE.CircleGeometry(0.52, 64), M.glass, 0, 0, LZ + 0.74);
        add('Front Ring', new THREE.TorusGeometry(0.52, 0.038, 16, 80), M.lensRing, 0, 0, LZ + 0.745, Math.PI / 2, 0, 0);
        const glowMat = new THREE.MeshBasicMaterial({ color: 0x1a1aff, transparent: true, opacity: 0.1 });
        const glow = new THREE.Mesh(new THREE.CircleGeometry(0.38, 64), glowMat);
        glow.position.set(0, 0, LZ + 0.742); glow.userData.partName = 'Lens Reflection'; g.add(glow);
        add('Flash Unit', new THREE.BoxGeometry(0.2, 0.55, 0.08), M.chrome, -0.95, 0.75, -0.56);
        add('Flash Glass', new THREE.BoxGeometry(0.14, 0.4, 0.04), M.white, -0.95, 0.75, -0.56);
        add('Strap Lug L', new THREE.BoxGeometry(0.15, 0.2, 0.15), M.chrome, -1.38, 0.5, 0);
        add('Strap Lug R', new THREE.BoxGeometry(0.15, 0.2, 0.15), M.chrome, 1.55, 0.5, 0);
        add('Card Door', new THREE.BoxGeometry(0.06, 0.45, 0.5), M.rubber, 1.56, -0.15, 0);
        for (let i = 0; i < 4; i++) { const r = new THREE.Mesh(new THREE.BoxGeometry(0.04, 1.6, 1.14), M.rubber); r.position.set(0.92 + i * 0.06, -0.18, 0); r.userData.partName = 'Grip Texture'; g.add(r); }

        let shotCount = 0;
        return {
            group: g, namedMeshes: n,
            actionLabel: 'Click to Shoot', actionIcon: '📸',
            tick(t) { /* gentle glow pulse */ glow.material.opacity = 0.1 + Math.sin(t * 2) * 0.03; },
            action() {
                // Flash + squish + particles
                g.scale.y = 0.94; setTimeout(() => { g.scale.y = 1; }, 120);
                if (n['Shutter Button']) { const b = n['Shutter Button']; const oy = b.position.y; b.position.y -= 0.05; setTimeout(() => { b.position.y = oy; }, 150); }
                const flashEl = document.querySelector('.lab-flash');
                if (flashEl) { flashEl.classList.add('active'); setTimeout(() => flashEl.classList.remove('active'), 120); }
                spawnParticles(g, camera, LZ + 0.76);
                shotCount++;
                const sc = document.querySelector('.lab-shot-counter span');
                if (sc) sc.textContent = shotCount;
                glow.material.opacity = 0.6; setTimeout(() => { glow.material.opacity = 0.1; }, 300);
            }
        };
    }

    // ─── 2. MECHANICAL WRISTWATCH ───────────────────────────
    function buildWatch() {
        const g = new THREE.Group(), n = {};
        const add = (nm, geo, mat, px, py, pz, rx, ry, rz) => addMesh(g, n, nm, geo, mat, px, py, pz, rx, ry, rz);

        // Case
        add('Case', new THREE.CylinderGeometry(1.6, 1.6, 0.5, 64), M.chrome, 0, 0, 0, Math.PI / 2, 0, 0);
        add('Case Back', new THREE.CylinderGeometry(1.5, 1.5, 0.08, 64), M.darkChr, 0, 0, -0.28, Math.PI / 2, 0, 0);
        add('Bezel', new THREE.TorusGeometry(1.6, 0.1, 16, 64), M.gold, 0, 0, 0.25);
        // Dial
        add('Dial Face', new THREE.CircleGeometry(1.4, 64), M.white, 0, 0, 0.26);
        // Hour indices (12 ticks)
        for (let i = 0; i < 12; i++) {
            const a = (i / 12) * Math.PI * 2;
            const tick = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.2, 0.02), M.body);
            tick.position.set(Math.sin(a) * 1.15, Math.cos(a) * 1.15, 0.27);
            tick.rotation.z = -a;
            tick.userData.partName = 'Hour Mark'; g.add(tick);
        }
        // Hands — geometry translated so pivot is at (0,0) center
        const hourGeo = new THREE.BoxGeometry(0.08, 0.7, 0.03);
        hourGeo.translate(0, 0.35, 0);
        const hourHand = add('Hour Hand', hourGeo, M.body, 0, 0, 0.29);
        const minGeo = new THREE.BoxGeometry(0.05, 1.0, 0.03);
        minGeo.translate(0, 0.5, 0);
        const minHand = add('Minute Hand', minGeo, M.darkChr, 0, 0, 0.30);
        const secGeo = new THREE.BoxGeometry(0.02, 1.15, 0.02);
        secGeo.translate(0, 0.575, 0);
        const secHand = add('Second Hand', secGeo, M.red, 0, 0, 0.31);
        // Center pin
        add('Center Pin', new THREE.CylinderGeometry(0.06, 0.06, 0.1, 16), M.gold, 0, 0, 0.3, Math.PI / 2, 0, 0);
        // Crown
        const crown = add('Crown', new THREE.CylinderGeometry(0.12, 0.12, 0.35, 16), M.gold, 1.75, 0, 0, 0, 0, Math.PI / 2);
        // Crown ridges
        for (let i = 0; i < 3; i++) { add('Crown Ridge', new THREE.TorusGeometry(0.12, 0.02, 8, 16), M.darkChr, 1.7 + i * 0.08, 0, 0, 0, 0, Math.PI / 2); }
        // Lugs
        add('Lug TL', new THREE.BoxGeometry(0.3, 0.6, 0.4), M.chrome, -0.7, 1.7, 0);
        add('Lug TR', new THREE.BoxGeometry(0.3, 0.6, 0.4), M.chrome, 0.7, 1.7, 0);
        add('Lug BL', new THREE.BoxGeometry(0.3, 0.6, 0.4), M.chrome, -0.7, -1.7, 0);
        add('Lug BR', new THREE.BoxGeometry(0.3, 0.6, 0.4), M.chrome, 0.7, -1.7, 0);
        // Strap
        add('Strap Top', new THREE.BoxGeometry(1.1, 1.8, 0.25), M.rubber, 0, 2.8, 0);
        add('Strap Bottom', new THREE.BoxGeometry(1.1, 1.8, 0.25), M.rubber, 0, -2.8, 0);
        // Glass crystal
        add('Crystal', new THREE.CylinderGeometry(1.4, 1.4, 0.06, 64), new THREE.MeshStandardMaterial({ color: 0xccddff, roughness: 0, metalness: 0.05, transparent: true, opacity: 0.3 }), 0, 0, 0.28, Math.PI / 2, 0, 0);

        let winding = false;
        return {
            group: g, namedMeshes: n,
            actionLabel: 'Wind Crown', actionIcon: '⏱️',
            tick(t) {
                const d = new Date();
                const sec = d.getSeconds() + d.getMilliseconds() / 1000;
                const min = d.getMinutes() + sec / 60;
                const hr = (d.getHours() % 12) + min / 60;
                secHand.rotation.z = -(sec / 60) * Math.PI * 2;
                // hands already pivot from center via translated geometry
                minHand.rotation.z = -(min / 60) * Math.PI * 2;
                hourHand.rotation.z = -(hr / 12) * Math.PI * 2;
            },
            action() {
                // Wind crown animation
                if (winding) return; winding = true;
                const orig = crown.rotation.z;
                let i = 0;
                const iv = setInterval(() => {
                    crown.rotation.z += 0.5;
                    i++;
                    if (i > 12) { clearInterval(iv); crown.rotation.z = orig; winding = false; }
                }, 50);
            }
        };
    }

    // ─── 3. RETRO BOOMBOX ───────────────────────────────────
    function buildBoombox() {
        const g = new THREE.Group(), n = {};
        const add = (nm, geo, mat, px, py, pz, rx, ry, rz) => addMesh(g, n, nm, geo, mat, px, py, pz, rx, ry, rz);

        // Main body
        add('Body', new THREE.BoxGeometry(4.5, 2.2, 1.5), M.body);
        // Speaker grilles
        add('Speaker L Rim', new THREE.TorusGeometry(0.65, 0.08, 16, 32), M.chrome, -1.4, 0, 0.76);
        add('Speaker R Rim', new THREE.TorusGeometry(0.65, 0.08, 16, 32), M.chrome, 1.4, 0, 0.76);
        const spkL = add('Speaker L Cone', new THREE.CylinderGeometry(0.3, 0.55, 0.15, 32), M.rubber, -1.4, 0, 0.78, Math.PI / 2, 0, 0);
        const spkR = add('Speaker R Cone', new THREE.CylinderGeometry(0.3, 0.55, 0.15, 32), M.rubber, 1.4, 0, 0.78, Math.PI / 2, 0, 0);
        add('Speaker L Dust', new THREE.CylinderGeometry(0.12, 0.12, 0.04, 32), M.darkChr, -1.4, 0, 0.85, Math.PI / 2, 0, 0);
        add('Speaker R Dust', new THREE.CylinderGeometry(0.12, 0.12, 0.04, 32), M.darkChr, 1.4, 0, 0.85, Math.PI / 2, 0, 0);
        // Cassette deck
        add('Deck Window', new THREE.BoxGeometry(1.2, 0.6, 0.08), new THREE.MeshStandardMaterial({ color: 0x223344, roughness: 0, metalness: 0.1, transparent: true, opacity: 0.6 }), 0, 0.1, 0.76);
        add('Deck Frame', new THREE.BoxGeometry(1.4, 0.75, 0.04), M.chrome, 0, 0.1, 0.74);
        // Tape reels
        add('Reel L', new THREE.CylinderGeometry(0.15, 0.15, 0.04, 16), M.white, -0.3, 0.1, 0.78, Math.PI / 2, 0, 0);
        add('Reel R', new THREE.CylinderGeometry(0.15, 0.15, 0.04, 16), M.white, 0.3, 0.1, 0.78, Math.PI / 2, 0, 0);
        // Handle
        add('Handle L', new THREE.BoxGeometry(0.12, 0.6, 0.12), M.chrome, -1.8, 1.1, 0);
        add('Handle R', new THREE.BoxGeometry(0.12, 0.6, 0.12), M.chrome, 1.8, 1.1, 0);
        add('Handle Bar', new THREE.BoxGeometry(3.48, 0.12, 0.12), M.chrome, 0, 1.5, 0);
        // EQ bars
        const eqBars = [];
        for (let i = 0; i < 8; i++) {
            const bar = add('EQ Bar', new THREE.BoxGeometry(0.12, 0.4, 0.06), M.teal, -0.5 + i * 0.15, -0.6, 0.78);
            eqBars.push(bar);
        }
        // Buttons
        const btnColors = [M.red, M.teal, M.orange, M.blue];
        ['Play', 'Stop', 'FF', 'Rew'].forEach((nm, i) => {
            add(nm + ' Btn', new THREE.BoxGeometry(0.22, 0.15, 0.12), btnColors[i], -0.35 + i * 0.25, -0.95, 0.76);
        });
        // Volume knob
        add('Volume Knob', new THREE.CylinderGeometry(0.15, 0.15, 0.12, 24), M.chrome, 2.0, 0.5, 0.76, Math.PI / 2, 0, 0);
        add('Tuner Knob', new THREE.CylinderGeometry(0.12, 0.12, 0.1, 24), M.gold, 2.0, -0.3, 0.76, Math.PI / 2, 0, 0);
        // Antenna
        add('Antenna', new THREE.CylinderGeometry(0.02, 0.02, 2.0, 8), M.chrome, 2.1, 2.1, 0, 0, 0, -0.3);

        let playing = false;
        return {
            group: g, namedMeshes: n,
            actionLabel: 'Play Music', actionIcon: '🎵',
            tick(t) {
                if (playing) {
                    eqBars.forEach((bar, i) => {
                        bar.scale.y = 0.5 + Math.abs(Math.sin(t * 3 + i * 0.8)) * 2;
                    });
                    const pulse = 1 + Math.sin(t * 6) * 0.03;
                    spkL.scale.set(pulse, 1, pulse);
                    spkR.scale.set(pulse, 1, pulse);
                    n['Reel L'].rotation.y += 0.05;
                    n['Reel R'].rotation.y += 0.05;
                } else {
                    eqBars.forEach(bar => { bar.scale.y += (1 - bar.scale.y) * 0.1; });
                }
            },
            action() {
                playing = !playing;
                const label = document.querySelector('.lab-action-label');
                if (label) label.textContent = playing ? 'Stop Music' : 'Play Music';
            }
        };
    }

    // ─── 4. SMARTPHONE (Assemble / Disassemble) ─────────────
    function buildSmartphone() {
        const g = new THREE.Group(), n = {};
        const add = (nm, geo, mat, px, py, pz, rx, ry, rz) => addMesh(g, n, nm, geo, mat, px, py, pz, rx, ry, rz);

        // Back cover
        const back = add('Back Cover', new THREE.BoxGeometry(1.6, 3.0, 0.08), M.body, 0, 0, -0.2);
        // Battery
        const battery = add('Battery', new THREE.BoxGeometry(1.3, 2.0, 0.12), M.teal, 0, 0, -0.1);
        // Mainboard
        const board = add('Mainboard', new THREE.BoxGeometry(1.2, 2.4, 0.04), new THREE.MeshStandardMaterial({ color: 0x1a5c2a, roughness: 0.7, metalness: 0.1 }), 0, 0, 0);
        // Chips on board
        const chip1 = add('CPU Chip', new THREE.BoxGeometry(0.3, 0.3, 0.05), M.darkChr, -0.2, 0.5, 0.03);
        const chip2 = add('Memory Chip', new THREE.BoxGeometry(0.4, 0.2, 0.04), M.darkChr, 0.2, -0.2, 0.03);
        const chip3 = add('WiFi Module', new THREE.BoxGeometry(0.2, 0.2, 0.03), M.chrome, 0.3, 0.8, 0.03);
        // Screen frame
        const frame = add('Frame', new THREE.BoxGeometry(1.7, 3.1, 0.06), M.chrome, 0, 0, 0.12);
        // Screen
        const scr = add('Screen', new THREE.BoxGeometry(1.5, 2.8, 0.04), M.screen, 0, 0, 0.16);
        // Front glass
        const frontGlass = add('Front Glass', new THREE.BoxGeometry(1.6, 3.0, 0.02), new THREE.MeshStandardMaterial({ color: 0x222244, roughness: 0, metalness: 0.1, transparent: true, opacity: 0.4 }), 0, 0, 0.19);
        // Camera bump
        add('Camera Bump', new THREE.CylinderGeometry(0.12, 0.12, 0.1, 16), M.darkChr, -0.5, 1.2, -0.26, Math.PI / 2, 0, 0);
        add('Camera Lens', new THREE.CylinderGeometry(0.08, 0.08, 0.04, 16), M.glass, -0.5, 1.2, -0.32, Math.PI / 2, 0, 0);
        add('Camera Bump 2', new THREE.CylinderGeometry(0.1, 0.1, 0.1, 16), M.darkChr, -0.5, 0.85, -0.26, Math.PI / 2, 0, 0);
        // Side buttons
        add('Power Btn', new THREE.BoxGeometry(0.06, 0.35, 0.06), M.darkChr, 0.86, 0.4, 0);
        add('Vol Up', new THREE.BoxGeometry(0.06, 0.25, 0.06), M.darkChr, -0.86, 0.5, 0);
        add('Vol Down', new THREE.BoxGeometry(0.06, 0.25, 0.06), M.darkChr, -0.86, 0.1, 0);
        // Speaker grille
        add('Speaker Grille', new THREE.BoxGeometry(0.6, 0.04, 0.06), M.darkChr, 0, -1.45, 0.16);
        // Charging port
        add('USB Port', new THREE.BoxGeometry(0.25, 0.06, 0.08), M.darkChr, 0, -1.55, 0);

        const parts = [back, battery, board, chip1, chip2, chip3, frame, scr, frontGlass];
        const offsets = [
            { x: 0, y: 0, z: -2.5 }, { x: 0, y: 0, z: -1.6 }, { x: 0, y: 0, z: -0.6 },
            { x: -1.5, y: 0.5, z: -0.3 }, { x: 1.5, y: -0.2, z: -0.3 }, { x: 1.8, y: 0.8, z: -0.3 },
            { x: 0, y: 0, z: 0.8 }, { x: 0, y: 0, z: 1.5 }, { x: 0, y: 0, z: 2.2 }
        ];
        const origPositions = parts.map(p => p.position.clone());
        let exploded = false, animating = false;

        return {
            group: g, namedMeshes: n,
            actionLabel: 'Disassemble', actionIcon: '🔧',
            tick(t) {
                // subtle glow on screen
                if (scr.material.emissiveIntensity !== undefined) {
                    scr.material.emissiveIntensity = 0.5 + Math.sin(t * 1.5) * 0.15;
                }
            },
            action() {
                if (animating) return;
                animating = true;
                exploded = !exploded;
                const label = document.querySelector('.lab-action-label');
                parts.forEach((p, i) => {
                    const target = exploded
                        ? { x: origPositions[i].x + offsets[i].x, y: origPositions[i].y + offsets[i].y, z: origPositions[i].z + offsets[i].z }
                        : { x: origPositions[i].x, y: origPositions[i].y, z: origPositions[i].z };
                    const start = { x: p.position.x, y: p.position.y, z: p.position.z };
                    const dur = 600, st = performance.now();
                    function anim() {
                        const prog = Math.min(1, (performance.now() - st) / dur);
                        const ease = 1 - Math.pow(1 - prog, 3);
                        p.position.x = start.x + (target.x - start.x) * ease;
                        p.position.y = start.y + (target.y - start.y) * ease;
                        p.position.z = start.z + (target.z - start.z) * ease;
                        if (prog < 1) requestAnimationFrame(anim);
                        else if (i === parts.length - 1) animating = false;
                    }
                    anim();
                });
                if (label) label.textContent = exploded ? 'Assemble' : 'Disassemble';
            }
        };
    }

    // ─── 5. CLASSIC CABRIO (Headlight Toggle) ─────────────────
    function buildCar() {
        const g = new THREE.Group(), n = {};
        const add = (nm, geo, mat, px, py, pz, rx, ry, rz) => addMesh(g, n, nm, geo, mat, px, py, pz, rx, ry, rz);

        // Materials
        const matPaint = new THREE.MeshStandardMaterial({ color: 0x1a3a5c, roughness: 0.22, metalness: 0.88 });
        const matPaintAccent = new THREE.MeshStandardMaterial({ color: 0x14304d, roughness: 0.3, metalness: 0.8 });
        const matChrome = new THREE.MeshStandardMaterial({ color: 0xe8e8f0, roughness: 0.04, metalness: 0.98 });
        const matTire = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.95, metalness: 0.02 });
        const matRim = new THREE.MeshStandardMaterial({ color: 0xd8d8e8, roughness: 0.06, metalness: 0.95 });
        const matLeather = new THREE.MeshStandardMaterial({ color: 0xc4956a, roughness: 0.75, metalness: 0.02 });
        const matLeatherDark = new THREE.MeshStandardMaterial({ color: 0x6b4226, roughness: 0.8, metalness: 0 });
        const matWindshield = new THREE.MeshStandardMaterial({ color: 0xaaccee, roughness: 0, metalness: 0.1, transparent: true, opacity: 0.35 });
        const matGrill = new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.85, metalness: 0.15 });
        const matDash = new THREE.MeshStandardMaterial({ color: 0x2a1810, roughness: 0.7, metalness: 0.1 });
        const matHeadlight = new THREE.MeshStandardMaterial({ color: 0xffeebb, roughness: 0, metalness: 0.1, emissive: 0x000000, emissiveIntensity: 0 });
        const matTaillight = new THREE.MeshStandardMaterial({ color: 0xff2222, roughness: 0.3, metalness: 0.1, emissive: 0x000000, emissiveIntensity: 0 });
        const matUnder = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9, metalness: 0.1 });
        const matInteriorFloor = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.9, metalness: 0 });
        const matRubber = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.9, metalness: 0.05 });
        const matWood = new THREE.MeshStandardMaterial({ color: 0x8b5e3c, roughness: 0.6, metalness: 0.05 });

        // ── BODY (classic rounded shape) ──
        const bodyShape = new THREE.Shape();
        bodyShape.moveTo(-2.6, 0);
        bodyShape.lineTo(-2.6, 0.2);
        bodyShape.quadraticCurveTo(-2.5, 0.55, -2.0, 0.65);
        bodyShape.lineTo(1.6, 0.65);
        bodyShape.quadraticCurveTo(2.1, 0.6, 2.3, 0.3);
        bodyShape.quadraticCurveTo(2.4, 0.1, 2.3, 0);
        bodyShape.lineTo(-2.6, 0);
        const bodyGeo = new THREE.ExtrudeGeometry(bodyShape, { depth: 1.6, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 4 });
        bodyGeo.center();
        add('Body', bodyGeo, matPaint, 0, -0.5, 0);

        // ── FRONT FENDERS (rounded flowing shapes) ──
        const fenderGeo = new THREE.SphereGeometry(0.5, 16, 12, 0, Math.PI, 0, Math.PI * 0.6);
        fenderGeo.scale(1.2, 0.7, 1);
        add('Fender FL', fenderGeo, matPaint, -1.5, -0.45, 0.82);
        add('Fender FR', fenderGeo, matPaint, -1.5, -0.45, -0.82);
        // Rear fenders
        const rFenderGeo = new THREE.SphereGeometry(0.48, 16, 12, 0, Math.PI, 0, Math.PI * 0.55);
        rFenderGeo.scale(1.1, 0.65, 1);
        add('Fender RL', rFenderGeo, matPaint, 1.4, -0.48, 0.8);
        add('Fender RR', rFenderGeo, matPaint, 1.4, -0.48, -0.8);

        // ── HOOD (long, curved classic hood) ──
        const hoodShape = new THREE.Shape();
        hoodShape.moveTo(-1.2, 0);
        hoodShape.quadraticCurveTo(-1.3, 0.12, -1.2, 0.14);
        hoodShape.lineTo(0.2, 0.14);
        hoodShape.quadraticCurveTo(0.3, 0.08, 0.2, 0);
        hoodShape.lineTo(-1.2, 0);
        const hoodGeo = new THREE.ExtrudeGeometry(hoodShape, { depth: 1.35, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 2 });
        hoodGeo.center();
        add('Hood', hoodGeo, matPaintAccent, -1.6, -0.08, 0);

        // Hood center line (chrome strip)
        add('Hood Strip', new THREE.BoxGeometry(1.8, 0.02, 0.04), matChrome, -1.6, 0.03, 0);

        // Hood ornament
        add('Hood Ornament', new THREE.ConeGeometry(0.04, 0.12, 8), matChrome, -2.4, 0.1, 0);

        // ── TRUNK (rounded rear) ──
        const trunkGeo = new THREE.BoxGeometry(0.7, 0.12, 1.4);
        add('Trunk', trunkGeo, matPaintAccent, 1.7, -0.08, 0);

        // ── UNDERBODY ──
        add('Underbody', new THREE.BoxGeometry(5.0, 0.06, 1.5), matUnder, 0, -0.88, 0);

        // ── RUNNING BOARDS (side steps) ──
        add('Running Board L', new THREE.BoxGeometry(1.8, 0.04, 0.2), matRubber, 0, -0.82, 0.85);
        add('Running Board R', new THREE.BoxGeometry(1.8, 0.04, 0.2), matRubber, 0, -0.82, -0.85);

        // ── WHEELS (vintage wire-spoke style) ──
        const wheelPositions = [
            { x: -1.5, z: 0.88, name: 'FL' },
            { x: -1.5, z: -0.88, name: 'FR' },
            { x: 1.4, z: 0.88, name: 'RL' },
            { x: 1.4, z: -0.88, name: 'RR' }
        ];
        const wheels = [];
        wheelPositions.forEach(wp => {
            const tire = add('Tire ' + wp.name, new THREE.TorusGeometry(0.35, 0.1, 14, 28), matTire, wp.x, -0.82, wp.z, 0, 0, 0);
            wheels.push(tire);
            // Hub caps on BOTH sides of each wheel
            const outerZ = wp.z > 0 ? wp.z + 0.08 : wp.z - 0.08;
            const innerZ = wp.z > 0 ? wp.z - 0.08 : wp.z + 0.08;
            add('Hub Out ' + wp.name, new THREE.CylinderGeometry(0.18, 0.2, 0.04, 16), matChrome, wp.x, -0.82, outerZ, Math.PI / 2, 0, 0);
            add('Hub In ' + wp.name, new THREE.CylinderGeometry(0.18, 0.2, 0.04, 16), matChrome, wp.x, -0.82, innerZ, Math.PI / 2, 0, 0);
            // Wire spokes
            for (let s = 0; s < 12; s++) {
                const angle = (s / 12) * Math.PI * 2;
                add('Spoke', new THREE.CylinderGeometry(0.008, 0.008, 0.32, 3), matChrome,
                    wp.x + Math.sin(angle) * 0.16, -0.82 + Math.cos(angle) * 0.16, wp.z,
                    0, 0, angle);
            }
            // Center nuts on both sides
            add('Nut Out ' + wp.name, new THREE.CylinderGeometry(0.04, 0.04, 0.06, 6), matChrome, wp.x, -0.82, outerZ, Math.PI / 2, 0, 0);
            add('Nut In ' + wp.name, new THREE.CylinderGeometry(0.04, 0.04, 0.06, 6), matChrome, wp.x, -0.82, innerZ, Math.PI / 2, 0, 0);
        });

        // ── WINDSHIELD (raked, with chrome frame) ──
        add('Windshield Frame', new THREE.BoxGeometry(0.06, 0.55, 1.45), matChrome, -0.65, 0.12, 0, 0, 0, 0.22);
        add('Windshield', new THREE.PlaneGeometry(1.35, 0.5), matWindshield, -0.62, 0.13, 0, 0, -0.22 + Math.PI / 2, 0);

        // ── OPEN COCKPIT INTERIOR ──
        // Floor
        add('Interior Floor', new THREE.BoxGeometry(1.6, 0.04, 1.2), matInteriorFloor, 0.5, -0.28, 0);

        // ── DASHBOARD ──
        add('Dashboard', new THREE.BoxGeometry(0.2, 0.25, 1.25), matDash, -0.4, -0.05, 0);
        // Dashboard gauges
        for (let i = 0; i < 3; i++) {
            add('Gauge', new THREE.CylinderGeometry(0.06, 0.06, 0.02, 16), matChrome, -0.34, 0.02, -0.3 + i * 0.3, 0, Math.PI / 2, 0);
            add('Gauge Face', new THREE.CylinderGeometry(0.05, 0.05, 0.01, 16),
                new THREE.MeshStandardMaterial({ color: 0xf5f0e0, roughness: 0.5, metalness: 0 }),
                -0.33, 0.02, -0.3 + i * 0.3, 0, Math.PI / 2, 0);
        }

        // ── STEERING WHEEL (on driver side, angled toward driver) ──
        const swX = -0.18, swY = 0.05, swZ = 0.3;
        const swTilt = 0.45; // tilt angle toward driver
        const steeringWheel = add('Steering Wheel', new THREE.TorusGeometry(0.13, 0.016, 8, 24), matWood, swX, swY, swZ, swTilt, 0, 0);
        // Steering column
        add('Steering Column', new THREE.CylinderGeometry(0.018, 0.018, 0.3, 8), matChrome, swX + 0.02, swY - 0.11, swZ, swTilt, 0, 0);
        // Steering spokes (3-spoke classic)
        for (let i = 0; i < 3; i++) {
            const ang = (i / 3) * Math.PI * 2;
            const spokeGeo = new THREE.CylinderGeometry(0.007, 0.007, 0.12, 4);
            spokeGeo.translate(0, 0.06, 0);
            add('Steering Spoke', spokeGeo, matChrome,
                swX, swY, swZ, swTilt, 0, ang);
        }
        // Center hub
        add('Steering Hub', new THREE.CylinderGeometry(0.03, 0.03, 0.015, 12), matChrome, swX, swY, swZ, swTilt, 0, 0);

        // ── DRIVER SEAT ──
        // Seat base
        add('Driver Seat Base', new THREE.BoxGeometry(0.45, 0.1, 0.45), matLeather, 0.15, -0.2, 0.28);
        // Seat cushion (rounded top)
        const cushGeo = new THREE.SphereGeometry(0.25, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.4);
        cushGeo.scale(0.9, 0.3, 0.9);
        add('Driver Cushion', cushGeo, matLeather, 0.15, -0.12, 0.28);
        // Seat back
        const backGeo = new THREE.BoxGeometry(0.08, 0.45, 0.42);
        add('Driver Backrest', backGeo, matLeather, 0.42, 0.0, 0.28);
        // Backrest cushion
        const backCushGeo = new THREE.SphereGeometry(0.22, 10, 8, 0, Math.PI, 0, Math.PI * 0.5);
        backCushGeo.scale(0.2, 1, 0.95);
        add('Driver Back Cushion', backCushGeo, matLeather, 0.4, 0.0, 0.28, 0, -Math.PI / 2, 0);
        // Headrest
        add('Driver Headrest', new THREE.SphereGeometry(0.1, 8, 6), matLeather, 0.44, 0.3, 0.28);

        // ── PASSENGER SEAT ──
        add('Passenger Seat Base', new THREE.BoxGeometry(0.45, 0.1, 0.45), matLeather, 0.15, -0.2, -0.28);
        const cushGeo2 = new THREE.SphereGeometry(0.25, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.4);
        cushGeo2.scale(0.9, 0.3, 0.9);
        add('Passenger Cushion', cushGeo2, matLeather, 0.15, -0.12, -0.28);
        add('Passenger Backrest', new THREE.BoxGeometry(0.08, 0.45, 0.42), matLeather, 0.42, 0.0, -0.28);
        const backCushGeo2 = new THREE.SphereGeometry(0.22, 10, 8, 0, Math.PI, 0, Math.PI * 0.5);
        backCushGeo2.scale(0.2, 1, 0.95);
        add('Passenger Back Cushion', backCushGeo2, matLeather, 0.4, 0.0, -0.28, 0, -Math.PI / 2, 0);
        add('Passenger Headrest', new THREE.SphereGeometry(0.1, 8, 6), matLeather, 0.44, 0.3, -0.28);

        // ── DOOR PANELS (interior side) ──
        add('Door Panel L', new THREE.BoxGeometry(1.3, 0.45, 0.04), matLeatherDark, 0.1, -0.15, 0.72);
        add('Door Panel R', new THREE.BoxGeometry(1.3, 0.45, 0.04), matLeatherDark, 0.1, -0.15, -0.72);
        // Door handles (chrome)
        add('Door Handle L', new THREE.CylinderGeometry(0.015, 0.015, 0.12, 6), matChrome, -0.2, -0.05, 0.78, 0, 0, Math.PI / 2);
        add('Door Handle R', new THREE.CylinderGeometry(0.015, 0.015, 0.12, 6), matChrome, -0.2, -0.05, -0.78, 0, 0, Math.PI / 2);

        // ── HEADLIGHTS (classic round) ──
        add('HL Housing L', new THREE.CylinderGeometry(0.18, 0.16, 0.12, 20), matChrome, -2.5, -0.35, 0.5, 0, 0, Math.PI / 2);
        const hlL = add('Headlight L', new THREE.SphereGeometry(0.14, 14, 10, 0, Math.PI), matHeadlight, -2.52, -0.35, 0.5, 0, -Math.PI / 2, 0);
        add('HL Housing R', new THREE.CylinderGeometry(0.18, 0.16, 0.12, 20), matChrome, -2.5, -0.35, -0.5, 0, 0, Math.PI / 2);
        const hlR = add('Headlight R', new THREE.SphereGeometry(0.14, 14, 10, 0, Math.PI), matHeadlight, -2.52, -0.35, -0.5, 0, -Math.PI / 2, 0);

        // ── TAILLIGHTS (vertical, classic style) ──
        const tlL = add('Taillight L', new THREE.CylinderGeometry(0.08, 0.07, 0.06, 12), matTaillight, 2.28, -0.35, 0.55, 0, 0, Math.PI / 2);
        const tlR = add('Taillight R', new THREE.CylinderGeometry(0.08, 0.07, 0.06, 12), matTaillight, 2.28, -0.35, -0.55, 0, 0, Math.PI / 2);
        // Chrome rings around taillights
        add('TL Ring L', new THREE.TorusGeometry(0.09, 0.015, 8, 16), matChrome, 2.3, -0.35, 0.55, 0, Math.PI / 2, 0);
        add('TL Ring R', new THREE.TorusGeometry(0.09, 0.015, 8, 16), matChrome, 2.3, -0.35, -0.55, 0, Math.PI / 2, 0);

        // ── FRONT GRILL (classic vertical slats) ──
        add('Grill Frame', new THREE.BoxGeometry(0.08, 0.35, 0.65), matChrome, -2.52, -0.55, 0);
        for (let i = 0; i < 8; i++) {
            add('Grill Slat', new THREE.BoxGeometry(0.06, 0.3, 0.015), matChrome, -2.53, -0.55, -0.25 + i * 0.072);
        }

        // ── CHROME BUMPERS ──
        // Front
        const frontBumpShape = new THREE.Shape();
        frontBumpShape.moveTo(-0.45, -0.08);
        frontBumpShape.quadraticCurveTo(0, 0.08, 0.45, -0.08);
        frontBumpShape.lineTo(0.45, -0.12);
        frontBumpShape.quadraticCurveTo(0, 0.04, -0.45, -0.12);
        const frontBumpGeo = new THREE.ExtrudeGeometry(frontBumpShape, { depth: 0.08, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 2 });
        frontBumpGeo.center();
        add('Front Bumper', frontBumpGeo, matChrome, -2.55, -0.72, 0, Math.PI / 2, 0, 0);
        // Bumper overriders
        add('Overrider FL', new THREE.CylinderGeometry(0.03, 0.03, 0.08, 8), matChrome, -2.58, -0.72, 0.3, Math.PI / 2, 0, 0);
        add('Overrider FR', new THREE.CylinderGeometry(0.03, 0.03, 0.08, 8), matChrome, -2.58, -0.72, -0.3, Math.PI / 2, 0, 0);

        // Rear bumper
        add('Rear Bumper', new THREE.BoxGeometry(0.08, 0.1, 1.35), matChrome, 2.32, -0.72, 0);

        // ── SIDE MIRRORS (chrome stalks) ──
        add('Mirror L', new THREE.SphereGeometry(0.06, 8, 6), matChrome, -0.7, 0.15, 0.82);
        add('Mirror Arm L', new THREE.CylinderGeometry(0.012, 0.012, 0.12, 6), matChrome, -0.7, 0.1, 0.78, 0, 0, Math.PI / 3);
        add('Mirror R', new THREE.SphereGeometry(0.06, 8, 6), matChrome, -0.7, 0.15, -0.82);
        add('Mirror Arm R', new THREE.CylinderGeometry(0.012, 0.012, 0.12, 6), matChrome, -0.7, 0.1, -0.78, 0, 0, -Math.PI / 3);

        // ── EXHAUST ──
        add('Exhaust', new THREE.CylinderGeometry(0.04, 0.05, 0.2, 10), matChrome, 2.35, -0.8, 0.35, 0, 0, Math.PI / 2);

        // ── Display angle (slightly elevated view to show interior) ──
        g.rotation.set(0.35, -0.6, 0.05);

        let lightsOn = false;
        const hlGlowL = new THREE.PointLight(0xffeebb, 0, 5);
        hlGlowL.position.set(-2.7, -0.35, 0.5);
        g.add(hlGlowL);
        const hlGlowR = new THREE.PointLight(0xffeebb, 0, 5);
        hlGlowR.position.set(-2.7, -0.35, -0.5);
        g.add(hlGlowR);

        return {
            group: g, namedMeshes: n,
            actionLabel: 'Toggle Lights', actionIcon: '💡',
            tick(t) {
                wheels.forEach(w => { w.rotation.z += 0.02; });
            },
            action() {
                lightsOn = !lightsOn;
                const label = document.querySelector('.lab-action-label');
                if (lightsOn) {
                    matHeadlight.emissive.setHex(0xffeebb);
                    matHeadlight.emissiveIntensity = 1.8;
                    matTaillight.emissive.setHex(0xff0000);
                    matTaillight.emissiveIntensity = 1.5;
                    hlGlowL.intensity = 4;
                    hlGlowR.intensity = 4;
                } else {
                    matHeadlight.emissive.setHex(0x000000);
                    matHeadlight.emissiveIntensity = 0;
                    matTaillight.emissive.setHex(0x000000);
                    matTaillight.emissiveIntensity = 0;
                    hlGlowL.intensity = 0;
                    hlGlowR.intensity = 0;
                }
                if (label) label.textContent = lightsOn ? 'Lights Off' : 'Toggle Lights';
            }
        };
    }

    // ─── 6. ROBOT HEAD (Expression Cycling) ─────────────────
    function buildRobot() {
        const g = new THREE.Group(), n = {};
        const add = (nm, geo, mat, px, py, pz, rx, ry, rz) => addMesh(g, n, nm, geo, mat, px, py, pz, rx, ry, rz);

        // Head
        add('Head', new THREE.BoxGeometry(2.2, 2.2, 2.0), M.chrome);
        // Rounded corners (spheres at edges give illusion)
        add('Head Top', new THREE.BoxGeometry(2.3, 0.2, 2.1), M.chrome, 0, 1.1, 0);
        // Face plate
        add('Face Plate', new THREE.BoxGeometry(1.9, 1.6, 0.1), M.darkChr, 0, 0, 1.05);
        // Eyes
        const eyeL = add('Left Eye', new THREE.SphereGeometry(0.25, 16, 16), new THREE.MeshStandardMaterial({ color: 0x00ffcc, roughness: 0.2, metalness: 0.1, emissive: 0x00ffcc, emissiveIntensity: 0.8 }), -0.45, 0.3, 1.1);
        const eyeR = add('Right Eye', new THREE.SphereGeometry(0.25, 16, 16), new THREE.MeshStandardMaterial({ color: 0x00ffcc, roughness: 0.2, metalness: 0.1, emissive: 0x00ffcc, emissiveIntensity: 0.8 }), 0.45, 0.3, 1.1);
        // Pupils
        const pupilL = add('Left Pupil', new THREE.SphereGeometry(0.1, 12, 12), M.body, -0.45, 0.3, 1.35);
        const pupilR = add('Right Pupil', new THREE.SphereGeometry(0.1, 12, 12), M.body, 0.45, 0.3, 1.35);
        // Mouth — made of segments
        const mouthParts = [];
        for (let i = 0; i < 5; i++) {
            const mp = add('Mouth Seg', new THREE.BoxGeometry(0.22, 0.12, 0.06), new THREE.MeshStandardMaterial({ color: 0x00ffcc, roughness: 0.2, metalness: 0.1, emissive: 0x00ffcc, emissiveIntensity: 0.6 }), -0.44 + i * 0.22, -0.4, 1.1);
            mouthParts.push(mp);
        }
        // Antenna
        add('Antenna Base', new THREE.CylinderGeometry(0.12, 0.12, 0.15, 12), M.darkChr, 0, 1.25, 0);
        add('Antenna Stem', new THREE.CylinderGeometry(0.03, 0.03, 0.8, 8), M.chrome, 0, 1.7, 0);
        const antennaBall = add('Antenna Ball', new THREE.SphereGeometry(0.1, 12, 12), new THREE.MeshStandardMaterial({ color: 0xff3366, roughness: 0.2, metalness: 0.1, emissive: 0xff3366, emissiveIntensity: 0.8 }), 0, 2.15, 0);
        // Ears (side panels)
        add('Left Ear', new THREE.CylinderGeometry(0.3, 0.3, 0.2, 8), M.darkChr, -1.2, 0.2, 0, 0, 0, Math.PI / 2);
        add('Right Ear', new THREE.CylinderGeometry(0.3, 0.3, 0.2, 8), M.darkChr, 1.2, 0.2, 0, 0, 0, Math.PI / 2);
        // Neck
        add('Neck', new THREE.CylinderGeometry(0.35, 0.35, 0.5, 12), M.darkChr, 0, -1.35, 0);
        // Neck ring
        add('Neck Ring', new THREE.TorusGeometry(0.38, 0.05, 8, 24), M.chrome, 0, -1.1, 0, Math.PI / 2, 0, 0);
        // Bolts
        add('Bolt L', new THREE.CylinderGeometry(0.06, 0.06, 0.12, 6), M.gold, -1.12, 0.8, 0.6, Math.PI / 2, 0, 0);
        add('Bolt R', new THREE.CylinderGeometry(0.06, 0.06, 0.12, 6), M.gold, 1.12, 0.8, 0.6, Math.PI / 2, 0, 0);

        // Expressions
        const expressions = [
            { name: 'Happy 😊', eyeScale: 1, eyeColor: 0x00ffcc, mouthY: [-0.38, -0.42, -0.44, -0.42, -0.38], mouthScale: [1, 1, 1, 1, 1] },
            { name: 'Angry 😠', eyeScale: 0.75, eyeColor: 0xff3333, mouthY: [-0.5, -0.48, -0.46, -0.48, -0.5], mouthScale: [1, 1, 1, 1, 1] },
            { name: 'Surprised 😮', eyeScale: 1.4, eyeColor: 0xffcc00, mouthY: [-0.5, -0.5, -0.5, -0.5, -0.5], mouthScale: [0.5, 0.8, 1, 0.8, 0.5] },
            { name: 'Sad 😢', eyeScale: 0.9, eyeColor: 0x3388ff, mouthY: [-0.5, -0.45, -0.42, -0.45, -0.5], mouthScale: [1, 1, 1, 1, 1] },
            { name: 'Love 😍', eyeScale: 1.2, eyeColor: 0xff69b4, mouthY: [-0.38, -0.42, -0.44, -0.42, -0.38], mouthScale: [0.6, 0.9, 1, 0.9, 0.6] },
        ];
        let exprIdx = 0;

        return {
            group: g, namedMeshes: n,
            actionLabel: 'Change Expression', actionIcon: '😊',
            tick(t) {
                // Antenna blink
                antennaBall.material.emissiveIntensity = 0.4 + Math.sin(t * 4) * 0.4;
                // Gentle eye glow pulse
                eyeL.material.emissiveIntensity = 0.6 + Math.sin(t * 2) * 0.2;
                eyeR.material.emissiveIntensity = 0.6 + Math.sin(t * 2) * 0.2;
            },
            action() {
                exprIdx = (exprIdx + 1) % expressions.length;
                const ex = expressions[exprIdx];
                eyeL.scale.setScalar(ex.eyeScale);
                eyeR.scale.setScalar(ex.eyeScale);
                eyeL.material.color.setHex(ex.eyeColor);
                eyeL.material.emissive.setHex(ex.eyeColor);
                eyeR.material.color.setHex(ex.eyeColor);
                eyeR.material.emissive.setHex(ex.eyeColor);
                mouthParts.forEach((mp, i) => {
                    mp.position.y = ex.mouthY[i];
                    mp.scale.y = ex.mouthScale[i];
                });
                const label = document.querySelector('.lab-action-label');
                if (label) label.textContent = ex.name;
            }
        };
    }

    /* ══════════════════════════════════════════════════════════
       GALLERY SYSTEM
       ══════════════════════════════════════════════════════════ */
    const builders = {
        camera: buildCamera,
        watch: buildWatch,
        boombox: buildBoombox,
        phone: buildSmartphone,
        car: buildCar,
        robot: buildRobot
    };

    const objects = {};       // cached built objects
    let activeKey = 'camera';
    let activeObj = null;

    function switchObject(key) {
        if (key === activeKey && activeObj) return;
        // Remove current
        if (activeObj) {
            const old = activeObj;
            old.group.scale.set(0.01, 0.01, 0.01);
            scene.remove(old.group);
        }
        // Build or retrieve
        if (!objects[key]) objects[key] = builders[key]();
        activeObj = objects[key];
        activeKey = key;
        scene.add(activeObj.group);
        // Scale-in animation
        activeObj.group.scale.set(0.01, 0.01, 0.01);
        const st = performance.now();
        function scaleIn() {
            const p = Math.min(1, (performance.now() - st) / 400);
            const e = 1 - Math.pow(1 - p, 3);
            activeObj.group.scale.setScalar(e);
            if (p < 1) requestAnimationFrame(scaleIn);
        }
        scaleIn();
        // Update UI
        document.querySelectorAll('.lab-tab').forEach(t => t.classList.toggle('active', t.dataset.object === key));
        const label = document.querySelector('.lab-action-label');
        const icon = document.querySelector('.lab-shutter__icon');
        if (label) label.textContent = activeObj.actionLabel;
        if (icon) icon.textContent = activeObj.actionIcon;
        // Reset orbit
        targetEulerX = 0; targetEulerY = 0.3;
        velocityX = 0; velocityY = 0;
        // Store original materials for hover
        originalMaterials = {};
        Object.entries(activeObj.namedMeshes).forEach(([name, mesh]) => {
            originalMaterials[name] = mesh.material;
        });
    }

    /* ── Particle system ──────────────────────────────────── */
    const pCanvas = document.getElementById('lab-particles');
    const pCtx = pCanvas ? pCanvas.getContext('2d') : null;
    let particles = [];

    function resizeParticleCanvas() {
        if (!pCanvas) return;
        pCanvas.width = window.innerWidth;
        pCanvas.height = window.innerHeight;
    }
    resizeParticleCanvas();

    function spawnParticles(group, cam, lensZ) {
        const lensWorld = new THREE.Vector3(0, 0, lensZ).applyMatrix4(group.matrixWorld);
        const lensScreen = lensWorld.clone().project(cam);
        const sx = (lensScreen.x * 0.5 + 0.5) * window.innerWidth;
        const sy = (-lensScreen.y * 0.5 + 0.5) * window.innerHeight;
        const colors = ['#2563eb', '#3b82f6', '#e8476a', '#f0c060', '#ffffff'];
        for (let i = 0; i < 80; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 2 + Math.random() * 7;
            particles.push({
                x: sx, y: sy,
                vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 2,
                life: 1, decay: 0.016 + Math.random() * 0.018,
                r: 3 + Math.random() * 6,
                color: colors[Math.floor(Math.random() * colors.length)]
            });
        }
    }

    function updateParticles() {
        if (!pCtx || particles.length === 0) return;
        pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
        particles = particles.filter(p => p.life > 0);
        particles.forEach(p => {
            p.x += p.vx; p.y += p.vy; p.vy += 0.15; p.life -= p.decay;
            pCtx.globalAlpha = Math.max(0, p.life);
            pCtx.fillStyle = p.color;
            pCtx.beginPath();
            pCtx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2);
            pCtx.fill();
        });
        pCtx.globalAlpha = 1;
    }

    /* ── Orbit State ──────────────────────────────────────── */
    let isDragging = false, prevMouse = { x: 0, y: 0 };
    const euler = new THREE.Euler(0, 0.3, 0, 'YXZ');
    let targetEulerX = 0, targetEulerY = 0.3;
    let velocityX = 0, velocityY = 0;
    let autoSpin = false;
    let originalMaterials = {};
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const tooltip = document.querySelector('.lab-tooltip');
    let hoveredName = null;

    /* ── Event Listeners ─────────────────────────────────── */
    canvas.addEventListener('mousedown', e => {
        isDragging = true; prevMouse = { x: e.clientX, y: e.clientY };
        autoSpin = false;
        document.querySelector('.lab-btn[data-action="spin"]')?.classList.remove('active');
    });
    window.addEventListener('mouseup', () => { isDragging = false; });
    window.addEventListener('mousemove', e => {
        if (isDragging) {
            velocityY += (e.clientX - prevMouse.x) * 0.008;
            velocityX += (e.clientY - prevMouse.y) * 0.008;
            prevMouse = { x: e.clientX, y: e.clientY };
        }
        const rect = canvas.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    });
    let prevTouch = null;
    canvas.addEventListener('touchstart', e => { prevTouch = { x: e.touches[0].clientX, y: e.touches[0].clientY }; autoSpin = false; }, { passive: true });
    canvas.addEventListener('touchmove', e => {
        if (!prevTouch) return;
        velocityY += (e.touches[0].clientX - prevTouch.x) * 0.008;
        velocityX += (e.touches[0].clientY - prevTouch.y) * 0.008;
        prevTouch = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }, { passive: true });
    canvas.addEventListener('touchend', () => { prevTouch = null; });
    canvas.addEventListener('dblclick', () => {
        autoSpin = !autoSpin;
        document.querySelector('.lab-btn[data-action="spin"]')?.classList.toggle('active', autoSpin);
    });

    // Action button
    document.querySelector('.lab-shutter')?.addEventListener('click', () => { if (activeObj) activeObj.action(); });

    // Side controls
    document.querySelectorAll('.lab-btn[data-action]').forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.dataset.action === 'reset') {
                targetEulerX = 0; targetEulerY = 0.3; velocityX = 0; velocityY = 0; autoSpin = false;
                document.querySelector('.lab-btn[data-action="spin"]')?.classList.remove('active');
            }
            if (btn.dataset.action === 'spin') { autoSpin = !autoSpin; btn.classList.toggle('active', autoSpin); }
        });
    });

    // Tab switching
    document.querySelectorAll('.lab-tab[data-object]').forEach(tab => {
        tab.addEventListener('click', () => switchObject(tab.dataset.object));
    });

    /* ── Resize ───────────────────────────────────────────── */
    function onResize() {
        const w = canvas.clientWidth, h = canvas.clientHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        resizeParticleCanvas();
    }
    window.addEventListener('resize', onResize);

    /* ── Tick ─────────────────────────────────────────────── */
    let time = 0, raf;
    function tick() {
        raf = requestAnimationFrame(tick);
        time += 0.016;

        if (autoSpin) velocityY += 0.012;
        targetEulerY += velocityY; targetEulerX += velocityX;
        velocityX *= 0.88; velocityY *= 0.88;
        targetEulerX = Math.max(-0.55, Math.min(0.55, targetEulerX));
        euler.y = targetEulerY; euler.x = targetEulerX;

        if (activeObj) {
            activeObj.group.quaternion.setFromEuler(euler);
            activeObj.group.position.y = Math.sin(time * 0.8) * 0.07;
            activeObj.tick(time);

            // Hover raycasting
            raycaster.setFromCamera(mouse, camera);
            const hits = raycaster.intersectObjects(activeObj.group.children, true);
            const hit = hits[0];
            if (!isDragging && hit && hit.object.userData.partName) {
                const name = hit.object.userData.partName;
                if (name !== hoveredName) {
                    if (hoveredName && activeObj.namedMeshes[hoveredName]) activeObj.namedMeshes[hoveredName].material = originalMaterials[hoveredName];
                    hoveredName = name;
                    if (activeObj.namedMeshes[name]) activeObj.namedMeshes[name].material = M.highlight;
                }
                if (tooltip) {
                    const rect = canvas.getBoundingClientRect();
                    const sx = ((hit.point.clone().project(camera).x) * 0.5 + 0.5) * rect.width + rect.left;
                    const sy = (-(hit.point.clone().project(camera).y) * 0.5 + 0.5) * rect.height + rect.top;
                    tooltip.style.left = sx + 'px'; tooltip.style.top = sy + 'px';
                    tooltip.textContent = name; tooltip.classList.add('visible');
                }
            } else {
                if (hoveredName && activeObj.namedMeshes[hoveredName]) { activeObj.namedMeshes[hoveredName].material = originalMaterials[hoveredName]; hoveredName = null; }
                tooltip?.classList.remove('visible');
            }
        }

        updateParticles();
        fillLight.intensity = 2.5 + Math.sin(time * 0.5) * 0.4;
        rimLight.intensity = 2.0 + Math.cos(time * 0.7) * 0.4;
        renderer.render(scene, camera);
    }

    // ── Bootstrap ────────────────────────────────────────────
    switchObject('camera');
    tick();

    // ── Cleanup ──────────────────────────────────────────────
    return () => {
        cancelAnimationFrame(raf);
        renderer.dispose();
        window.removeEventListener('resize', onResize);
    };
}

window.initLab = initLab;
