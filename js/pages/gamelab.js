/* ==========================================================
   GAME LAB — 5 Playable Mini-Games
   ========================================================== */

function initGameLab() {
    const container = document.querySelector('.gamelab-container');
    const gameCanvas = document.getElementById('gamelab-game-canvas');
    const ctx = gameCanvas ? gameCanvas.getContext('2d') : null;
    const hudTitle = document.querySelector('.gamelab-hud__title');
    const hudScoreVal = document.querySelector('.gamelab-hud__score-val');
    const gameoverEl = document.querySelector('.gamelab-gameover');
    const gameoverTitle = document.querySelector('.gamelab-gameover__title');
    const gameoverScore = document.querySelector('.gamelab-gameover__score');
    if (!container || !gameCanvas || !ctx) return;

    let currentGame = null;
    let raf = null;
    let bestScores = {};

    // ── BG Particles ──
    const bgCanvas = document.getElementById('gamelab-bg-canvas');
    if (bgCanvas) {
        const bgCtx = bgCanvas.getContext('2d');
        const dots = [];
        function initBgParticles() {
            bgCanvas.width = window.innerWidth;
            bgCanvas.height = window.innerHeight;
            dots.length = 0;
            for (let i = 0; i < 40; i++) dots.push({ x: Math.random() * bgCanvas.width, y: Math.random() * bgCanvas.height, r: 1 + Math.random() * 2, vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3, a: 0.3 + Math.random() * 0.4 });
        }
        initBgParticles();
        let bgRaf;
        function animBg() {
            bgRaf = requestAnimationFrame(animBg);
            bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
            dots.forEach(d => { d.x += d.vx; d.y += d.vy; if (d.x < 0) d.x = bgCanvas.width; if (d.x > bgCanvas.width) d.x = 0; if (d.y < 0) d.y = bgCanvas.height; if (d.y > bgCanvas.height) d.y = 0; bgCtx.beginPath(); bgCtx.arc(d.x, d.y, d.r, 0, Math.PI * 2); bgCtx.fillStyle = `rgba(108,99,255,${d.a})`; bgCtx.fill(); });
        }
        animBg();
        window.addEventListener('resize', initBgParticles);
    }

    // ── Resize game canvas ──
    function resizeCanvas() {
        const hudH = document.querySelector('.gamelab-hud')?.offsetHeight || 56;
        const w = window.innerWidth, h = window.innerHeight - hudH;
        gameCanvas.width = w;
        gameCanvas.height = h;
        gameCanvas.style.width = w + 'px';
        gameCanvas.style.height = h + 'px';
    }

    // ── Launch game ──
    function launchGame(key) {
        container.classList.add('active');
        gameoverEl.classList.remove('active');
        document.body.style.overflow = 'hidden';
        // Hide site nav so it doesn't bleed through
        const siteNav = document.querySelector('.nav');
        if (siteNav) siteNav.style.display = 'none';
        // Small delay to let flexbox settle before measuring
        requestAnimationFrame(() => {
            resizeCanvas();
            const info = GAMES[key];
            if (!info) return;
            hudTitle.innerHTML = info.icon + ' ' + info.name;
            hudScoreVal.textContent = '0';
            currentGame = info.create(gameCanvas, ctx, updateScore, showGameOver);
            currentGame._key = key;
            currentGame.start();
            function loop() { raf = requestAnimationFrame(loop); currentGame.update(); currentGame.render(); }
            loop();
        });
    }

    function updateScore(s) { hudScoreVal.textContent = s; }

    function showGameOver(score) {
        cancelAnimationFrame(raf);
        gameoverTitle.textContent = 'Game Over!';
        gameoverScore.textContent = 'Score: ' + score;
        const key = currentGame._key;
        if (!bestScores[key] || score > bestScores[key]) { bestScores[key] = score; const badge = document.querySelector(`.gamelab-card[data-game="${key}"] .gamelab-card__best`); if (badge) badge.textContent = '🏆 ' + score; }
        gameoverEl.classList.add('active');
    }

    function quitGame() {
        cancelAnimationFrame(raf);
        if (currentGame && currentGame.destroy) currentGame.destroy();
        currentGame = null;
        container.classList.remove('active');
        gameoverEl.classList.remove('active');
        document.body.style.overflow = '';
        // Restore site nav
        const siteNav = document.querySelector('.nav');
        if (siteNav) siteNav.style.display = '';
    }

    // ── Events ──
    document.querySelectorAll('.gamelab-card[data-game]').forEach(card => {
        card.addEventListener('click', () => launchGame(card.dataset.game));
    });
    const backBtn = document.querySelector('.gamelab-hud__back');
    if (backBtn) {
        backBtn.addEventListener('click', (e) => { e.stopPropagation(); e.preventDefault(); quitGame(); });
        backBtn.addEventListener('touchend', (e) => { e.stopPropagation(); e.preventDefault(); quitGame(); }, { passive: false });
    }
    const quitBtn = document.querySelector('.gamelab-gameover__btn--quit');
    if (quitBtn) {
        quitBtn.addEventListener('click', (e) => { e.stopPropagation(); quitGame(); });
    }
    const playAgainBtn = document.querySelector('.gamelab-gameover__btn--play');
    if (playAgainBtn) {
        playAgainBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            gameoverEl.classList.remove('active');
            if (currentGame) { const key = currentGame._key; if (currentGame.destroy) currentGame.destroy(); cancelAnimationFrame(raf); launchGame(key); }
        });
    }
    window.addEventListener('resize', () => { if (currentGame) resizeCanvas(); });

    /* ══════════════════════════════════════════════════════════
       GAME DEFINITIONS
       ══════════════════════════════════════════════════════════ */
    const GAMES = {
        basketball: { icon: '🏀', name: 'Basketball', create: createBasketball },
        bowling: { icon: '🎳', name: 'Bowling', create: createBowling },
        football: { icon: '⚽', name: 'Football', create: createFootball },
        pong: { icon: '🏓', name: 'Ping Pong', create: createPong },
        spaceinvaders: { icon: '🚀', name: 'Space Invaders', create: createSpaceInvaders },
        roulette: { icon: '🎰', name: 'Roulette', create: createRoulette }
    };

    /* ─── 1. BASKETBALL ─────────────────────────────────────── */
    function createBasketball(canvas, ctx, onScore, onGameOver) {
        let W, H, ball, hoop, score = 0, shots = 0, maxShots = 10, dragging = false, dragStart = null, dragEnd = null, gravity = 0.4, particles = [], state = 'aiming';

        function init() { W = canvas.width; H = canvas.height; hoop = { x: W * 0.7, y: H * 0.3, w: 80, rimH: 6 }; resetBall(); }
        function resetBall() { ball = { x: W * 0.2, y: H * 0.55, r: 18, vx: 0, vy: 0, color: '#6366f1' }; state = 'aiming'; }

        function onMouseDown(e) { if (state !== 'aiming') return; const r = canvas.getBoundingClientRect(); const mx = e.clientX - r.left, my = e.clientY - r.top; const dx = mx - ball.x, dy = my - ball.y; if (Math.sqrt(dx * dx + dy * dy) < 60) { dragging = true; dragStart = { x: mx, y: my }; dragEnd = { x: mx, y: my }; } }
        function onMouseMove(e) { if (!dragging) return; const r = canvas.getBoundingClientRect(); dragEnd = { x: e.clientX - r.left, y: e.clientY - r.top }; }
        function onMouseUp() { if (!dragging) return; dragging = false; const dx = dragStart.x - dragEnd.x, dy = dragStart.y - dragEnd.y; const power = Math.min(Math.sqrt(dx * dx + dy * dy) * 0.12, 18); ball.vx = dx * 0.12; ball.vy = dy * 0.12; state = 'flying'; shots++; }
        function onTouchStart(e) { e.preventDefault(); const t = e.touches[0]; onMouseDown(t); }
        function onTouchMove(e) { e.preventDefault(); const t = e.touches[0]; onMouseMove(t); }
        function onTouchEnd(e) { onMouseUp(); }

        canvas.addEventListener('mousedown', onMouseDown);
        canvas.addEventListener('mousemove', onMouseMove);
        canvas.addEventListener('mouseup', onMouseUp);
        canvas.addEventListener('touchstart', onTouchStart, { passive: false });
        canvas.addEventListener('touchmove', onTouchMove, { passive: false });
        canvas.addEventListener('touchend', onTouchEnd);

        return {
            start() { init(); },
            update() {
                if (state === 'flying') {
                    ball.vy += gravity; ball.x += ball.vx; ball.y += ball.vy;
                    // Check hoop
                    const hx = hoop.x, hy = hoop.y, hw = hoop.w / 2;
                    if (ball.y > hy - 10 && ball.y < hy + 20 && ball.x > hx - hw && ball.x < hx + hw && ball.vy > 0) {
                        score += ball.y < hy + 5 ? 3 : 2; // swish vs normal
                        onScore(score);
                        for (let i = 0; i < 20; i++) particles.push({ x: ball.x, y: ball.y, vx: (Math.random() - 0.5) * 6, vy: -Math.random() * 5, life: 1, color: '#6366f1' });
                        state = 'scored';
                        setTimeout(() => { if (shots >= maxShots) onGameOver(score); else resetBall(); }, 600);
                    }
                    // Out of bounds
                    if (ball.y > H + 50 || ball.x > W + 50 || ball.x < -50) {
                        state = 'missed';
                        setTimeout(() => { if (shots >= maxShots) onGameOver(score); else resetBall(); }, 400);
                    }
                }
                particles = particles.filter(p => { p.x += p.vx; p.y += p.vy; p.vy += 0.15; p.life -= 0.03; return p.life > 0; });
            },
            render() {
                ctx.clearRect(0, 0, W, H);
                // Background gradient
                const bg = ctx.createLinearGradient(0, 0, 0, H);
                bg.addColorStop(0, '#0f172a'); bg.addColorStop(1, '#1e293b');
                ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
                // Court floor
                ctx.fillStyle = '#2a1a0a'; ctx.fillRect(0, H * 0.85, W, H * 0.15);
                ctx.strokeStyle = '#fff3'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, H * 0.85); ctx.lineTo(W, H * 0.85); ctx.stroke();
                // Backboard
                ctx.fillStyle = '#ffffff22'; ctx.fillRect(hoop.x + hoop.w / 2 + 5, hoop.y - 60, 8, 90);
                ctx.strokeStyle = '#fff6'; ctx.lineWidth = 2; ctx.strokeRect(hoop.x + hoop.w / 2 + 5, hoop.y - 60, 8, 90);
                // Hoop (rim)
                ctx.strokeStyle = '#2563eb'; ctx.lineWidth = 5;
                ctx.beginPath(); ctx.moveTo(hoop.x - hoop.w / 2, hoop.y); ctx.lineTo(hoop.x + hoop.w / 2, hoop.y); ctx.stroke();
                // Net (simple lines)
                for (let i = 0; i < 6; i++) { ctx.strokeStyle = '#fff3'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(hoop.x - hoop.w / 2 + i * hoop.w / 5, hoop.y); ctx.lineTo(hoop.x - hoop.w / 2 + i * hoop.w / 5 + (i < 3 ? 5 : -5), hoop.y + 35); ctx.stroke(); }
                // Ball
                ctx.save();
                const grad = ctx.createRadialGradient(ball.x - 4, ball.y - 4, 3, ball.x, ball.y, ball.r);
                grad.addColorStop(0, '#ff9a5c'); grad.addColorStop(1, '#e85d2a');
                ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2); ctx.fill();
                // Ball lines
                ctx.strokeStyle = '#c44a1a'; ctx.lineWidth = 1.5;
                ctx.beginPath(); ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(ball.x - ball.r, ball.y); ctx.lineTo(ball.x + ball.r, ball.y); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(ball.x, ball.y - ball.r); ctx.lineTo(ball.x, ball.y + ball.r); ctx.stroke();
                ctx.restore();
                // Drag line
                if (dragging && dragStart && dragEnd) {
                    ctx.strokeStyle = '#fff8'; ctx.lineWidth = 2; ctx.setLineDash([6, 4]);
                    ctx.beginPath(); ctx.moveTo(ball.x, ball.y); ctx.lineTo(ball.x + (dragStart.x - dragEnd.x) * 0.5, ball.y + (dragStart.y - dragEnd.y) * 0.5); ctx.stroke();
                    ctx.setLineDash([]);
                }
                // Particles
                particles.forEach(p => { ctx.globalAlpha = p.life; ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(p.x, p.y, 4 * p.life, 0, Math.PI * 2); ctx.fill(); });
                ctx.globalAlpha = 1;
                // Shots left
                ctx.fillStyle = '#fff8'; ctx.font = 'bold 14px Outfit'; ctx.fillText(`Shots: ${maxShots - shots}/${maxShots}`, 20, 30);
            },
            destroy() {
                canvas.removeEventListener('mousedown', onMouseDown);
                canvas.removeEventListener('mousemove', onMouseMove);
                canvas.removeEventListener('mouseup', onMouseUp);
                canvas.removeEventListener('touchstart', onTouchStart);
                canvas.removeEventListener('touchmove', onTouchMove);
                canvas.removeEventListener('touchend', onTouchEnd);
            }
        };
    }

    /* ─── 2. BOWLING ────────────────────────────────────────── */
    function createBowling(canvas, ctx, onScore, onGameOver) {
        let W, H, ball, pins, throwing = false, thrown = false, score = 0, frame = 0, maxFrames = 5, dragStartX = null, aimX = 0, power = 0, state = 'aim', particles = [];

        function init() { W = canvas.width; H = canvas.height; setupFrame(); }
        function setupFrame() {
            ball = { x: W / 2, y: H * 0.6, r: 16, vy: 0, vx: 0, rolling: false };
            pins = [];
            const rows = 4, startY = H * 0.15, pinR = 10, gap = 28;
            for (let row = 0; row < rows; row++) for (let col = 0; col <= row; col++) {
                pins.push({ x: W / 2 - row * gap / 2 + col * gap, y: startY + row * gap, r: pinR, alive: true, vx: 0, vy: 0 });
            }
            state = 'aim'; thrown = false; aimX = W / 2;
        }

        function onMD(e) { if (state !== 'aim') return; const r = canvas.getBoundingClientRect(); dragStartX = (e.clientX || e.touches[0].clientX) - r.left; }
        function onMM(e) { if (dragStartX === null || state !== 'aim') return; const r = canvas.getBoundingClientRect(); const mx = (e.clientX || e.touches[0].clientX) - r.left; aimX = Math.max(50, Math.min(W - 50, mx)); ball.x = aimX; }
        function onMU(e) { if (state !== 'aim' || dragStartX === null) return; dragStartX = null; ball.vy = -12; ball.vx = (aimX - W / 2) * 0.02; ball.rolling = true; state = 'rolling'; }
        function onTS(e) { e.preventDefault(); onMD(e.touches[0]); }
        function onTM(e) { e.preventDefault(); onMM(e.touches[0]); }

        canvas.addEventListener('mousedown', onMD); canvas.addEventListener('mousemove', onMM); canvas.addEventListener('mouseup', onMU);
        canvas.addEventListener('touchstart', onTS, { passive: false }); canvas.addEventListener('touchmove', onTM, { passive: false }); canvas.addEventListener('touchend', onMU);

        return {
            start() { init(); },
            update() {
                if (state === 'rolling') {
                    ball.y += ball.vy; ball.x += ball.vx;
                    // Hit pins
                    pins.forEach(p => {
                        if (!p.alive) return;
                        const dx = ball.x - p.x, dy = ball.y - p.y, dist = Math.sqrt(dx * dx + dy * dy);
                        if (dist < ball.r + p.r) {
                            p.alive = false; score += 10; onScore(score);
                            p.vx = (p.x - ball.x) * 0.3; p.vy = -3 - Math.random() * 3;
                            for (let i = 0; i < 8; i++) particles.push({ x: p.x, y: p.y, vx: (Math.random() - 0.5) * 4, vy: -Math.random() * 4, life: 1, color: '#3b82f6' });
                        }
                    });
                    // Ball out
                    if (ball.y < -30 || ball.x < -30 || ball.x > W + 30) {
                        state = 'done'; frame++;
                        setTimeout(() => { if (frame >= maxFrames) onGameOver(score); else setupFrame(); }, 800);
                    }
                }
                // Animate dead pins falling
                pins.forEach(p => { if (!p.alive) { p.x += p.vx; p.y += p.vy; p.vy += 0.2; } });
                particles = particles.filter(p => { p.x += p.vx; p.y += p.vy; p.vy += 0.1; p.life -= 0.03; return p.life > 0; });
            },
            render() {
                ctx.clearRect(0, 0, W, H);
                const bg = ctx.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#f1f5f9'); bg.addColorStop(1, '#f8fafc');
                ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
                // Lane
                const lw = 200, lx = W / 2 - lw / 2;
                ctx.fillStyle = '#3a2a1a'; ctx.fillRect(lx, 0, lw, H);
                ctx.strokeStyle = '#5a4a3a'; ctx.lineWidth = 2;
                ctx.beginPath(); ctx.moveTo(lx, 0); ctx.lineTo(lx, H); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(lx + lw, 0); ctx.lineTo(lx + lw, H); ctx.stroke();
                // Gutters
                ctx.fillStyle = '#1a1a1a'; ctx.fillRect(lx - 15, 0, 15, H); ctx.fillRect(lx + lw, 0, 15, H);
                // Arrow guides
                if (state === 'aim') { ctx.fillStyle = '#fff2'; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(W / 2 - 8, H * 0.5 + i * 40); ctx.lineTo(W / 2 + 8, H * 0.5 + i * 40); ctx.lineTo(W / 2, H * 0.5 + i * 40 - 12); ctx.fill(); } }
                // Pins
                pins.forEach(p => {
                    ctx.save();
                    ctx.fillStyle = p.alive ? '#f5f5f0' : '#888';
                    ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
                    if (p.alive) { ctx.fillStyle = '#2563eb'; ctx.beginPath(); ctx.arc(p.x, p.y - 3, 4, 0, Math.PI * 2); ctx.fill(); }
                    ctx.restore();
                });
                // Ball
                const g = ctx.createRadialGradient(ball.x - 3, ball.y - 3, 2, ball.x, ball.y, ball.r);
                g.addColorStop(0, '#4a90d9'); g.addColorStop(1, '#1a3a5c');
                ctx.fillStyle = g; ctx.beginPath(); ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2); ctx.fill();
                // Finger holes
                ctx.fillStyle = '#f1f5f9'; ctx.beginPath(); ctx.arc(ball.x - 4, ball.y - 5, 3, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.arc(ball.x + 4, ball.y - 5, 3, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.arc(ball.x, ball.y - 9, 3, 0, Math.PI * 2); ctx.fill();
                // Particles
                particles.forEach(p => { ctx.globalAlpha = p.life; ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(p.x, p.y, 3 * p.life, 0, Math.PI * 2); ctx.fill(); });
                ctx.globalAlpha = 1;
                // Info
                ctx.fillStyle = '#fff8'; ctx.font = 'bold 14px Outfit'; ctx.fillText(`Frame: ${frame + 1}/${maxFrames}`, 20, 30);
            },
            destroy() {
                canvas.removeEventListener('mousedown', onMD); canvas.removeEventListener('mousemove', onMM); canvas.removeEventListener('mouseup', onMU);
                canvas.removeEventListener('touchstart', onTS); canvas.removeEventListener('touchmove', onTM); canvas.removeEventListener('touchend', onMU);
            }
        };
    }

    /* ─── 3. FOOTBALL ───────────────────────────────────────── */
    function createFootball(canvas, ctx, onScore, onGameOver) {
        let W, H, ball, goal, keeper, score = 0, kicks = 0, maxKicks = 10, state = 'aim', dragStart = null, dragEnd = null, particles = [];

        function init() { W = canvas.width; H = canvas.height; goal = { x: W / 2, y: H * 0.18, w: 240, h: 80 }; resetKick(); }
        function resetKick() {
            ball = { x: W / 2, y: H * 0.6, r: 14, vx: 0, vy: 0 }; keeper = { x: W / 2, y: goal.y + goal.h - 25, w: 40, h: 50, targetX: W / 2 }; state = 'aim'; dragStart = null; dragEnd = null;
            // Keeper moves randomly
            keeper.targetX = goal.x - goal.w / 2 + 30 + Math.random() * (goal.w - 60);
        }

        function onMD(e) { if (state !== 'aim') return; const r = canvas.getBoundingClientRect(); dragStart = { x: (e.clientX || e.touches[0].clientX) - r.left, y: (e.clientY || e.touches[0].clientY) - r.top }; dragEnd = { ...dragStart }; }
        function onMM(e) { if (!dragStart || state !== 'aim') return; const r = canvas.getBoundingClientRect(); dragEnd = { x: (e.clientX || e.touches[0].clientX) - r.left, y: (e.clientY || e.touches[0].clientY) - r.top }; }
        function onMU() { if (!dragStart || state !== 'aim') return; const dx = dragStart.x - dragEnd.x, dy = dragStart.y - dragEnd.y; ball.vx = dx * 0.1; ball.vy = Math.min(dy * 0.1, -6); state = 'flying'; kicks++; dragStart = null; }
        function onTS(e) { e.preventDefault(); onMD(e.touches[0]); }
        function onTM(e) { e.preventDefault(); onMM(e.touches[0]); }

        canvas.addEventListener('mousedown', onMD); canvas.addEventListener('mousemove', onMM); canvas.addEventListener('mouseup', onMU);
        canvas.addEventListener('touchstart', onTS, { passive: false }); canvas.addEventListener('touchmove', onTM, { passive: false }); canvas.addEventListener('touchend', onMU);

        return {
            start() { init(); },
            update() {
                if (state === 'flying') {
                    ball.x += ball.vx; ball.y += ball.vy; ball.vy += 0.08;
                    // Keeper moves
                    keeper.x += (keeper.targetX - keeper.x) * 0.06;
                    // Check goal
                    if (ball.y < goal.y + goal.h && ball.y > goal.y && ball.x > goal.x - goal.w / 2 && ball.x < goal.x + goal.w / 2) {
                        // Check keeper block
                        if (Math.abs(ball.x - keeper.x) < keeper.w / 2 + ball.r && Math.abs(ball.y - keeper.y) < keeper.h / 2 + ball.r) {
                            state = 'blocked'; for (let i = 0; i < 15; i++) particles.push({ x: ball.x, y: ball.y, vx: (Math.random() - 0.5) * 5, vy: (Math.random() - 0.5) * 5, life: 1, color: '#2563eb' });
                            setTimeout(() => { if (kicks >= maxKicks) onGameOver(score); else resetKick(); }, 800);
                        } else {
                            score += 10; onScore(score); state = 'goal';
                            for (let i = 0; i < 25; i++) particles.push({ x: ball.x, y: ball.y, vx: (Math.random() - 0.5) * 8, vy: -Math.random() * 6, life: 1, color: '#3b82f6' });
                            setTimeout(() => { if (kicks >= maxKicks) onGameOver(score); else resetKick(); }, 800);
                        }
                    }
                    if (ball.y < -50 || ball.x < -50 || ball.x > W + 50 || ball.y > H + 50) {
                        state = 'miss'; setTimeout(() => { if (kicks >= maxKicks) onGameOver(score); else resetKick(); }, 500);
                    }
                }
                particles = particles.filter(p => { p.x += p.vx; p.y += p.vy; p.vy += 0.1; p.life -= 0.025; return p.life > 0; });
            },
            render() {
                ctx.clearRect(0, 0, W, H);
                // Sky
                const bg = ctx.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#0a2a1a'); bg.addColorStop(1, '#0a1a0a');
                ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
                // Field
                ctx.fillStyle = '#1a5a2a'; ctx.fillRect(0, H * 0.1, W, H * 0.9);
                // Field lines
                ctx.strokeStyle = '#fff2'; ctx.lineWidth = 2;
                ctx.strokeRect(W / 2 - 160, H * 0.1, 320, H * 0.5);
                ctx.beginPath(); ctx.arc(W / 2, H * 0.1 + H * 0.25, 50, 0, Math.PI * 2); ctx.stroke();
                // Goal
                ctx.strokeStyle = '#fff'; ctx.lineWidth = 4;
                ctx.strokeRect(goal.x - goal.w / 2, goal.y, goal.w, goal.h);
                // Net
                ctx.strokeStyle = '#fff3'; ctx.lineWidth = 1;
                for (let i = 0; i < 12; i++) { ctx.beginPath(); ctx.moveTo(goal.x - goal.w / 2 + i * goal.w / 11, goal.y); ctx.lineTo(goal.x - goal.w / 2 + i * goal.w / 11, goal.y + goal.h); ctx.stroke(); }
                for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(goal.x - goal.w / 2, goal.y + i * goal.h / 3); ctx.lineTo(goal.x + goal.w / 2, goal.y + i * goal.h / 3); ctx.stroke(); }
                // Keeper
                ctx.fillStyle = '#6366f1'; ctx.fillRect(keeper.x - keeper.w / 2, keeper.y - keeper.h / 2, keeper.w, keeper.h);
                ctx.fillStyle = '#fff'; ctx.fillRect(keeper.x - 5, keeper.y - keeper.h / 2, 10, 12); // head
                // Ball
                const g = ctx.createRadialGradient(ball.x - 3, ball.y - 3, 2, ball.x, ball.y, ball.r);
                g.addColorStop(0, '#fff'); g.addColorStop(1, '#ddd');
                ctx.fillStyle = g; ctx.beginPath(); ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2); ctx.fill();
                ctx.strokeStyle = '#333'; ctx.lineWidth = 1; ctx.stroke();
                // Pentagon pattern
                ctx.fillStyle = '#333';
                for (let i = 0; i < 5; i++) { const a = i * Math.PI * 2 / 5 - Math.PI / 2; ctx.beginPath(); ctx.arc(ball.x + Math.cos(a) * ball.r * 0.45, ball.y + Math.sin(a) * ball.r * 0.45, 3, 0, Math.PI * 2); ctx.fill(); }
                // Drag arrow
                if (dragging()) { ctx.strokeStyle = '#fff8'; ctx.lineWidth = 2; ctx.setLineDash([6, 4]); ctx.beginPath(); ctx.moveTo(ball.x, ball.y); ctx.lineTo(ball.x + (dragStart.x - dragEnd.x) * 0.5, ball.y + (dragStart.y - dragEnd.y) * 0.5); ctx.stroke(); ctx.setLineDash([]); }
                // Particles
                particles.forEach(p => { ctx.globalAlpha = p.life; ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(p.x, p.y, 4 * p.life, 0, Math.PI * 2); ctx.fill(); }); ctx.globalAlpha = 1;
                // State text
                if (state === 'goal') { ctx.fillStyle = '#3b82f6'; ctx.font = 'bold 40px Outfit'; ctx.textAlign = 'center'; ctx.fillText('GOAL!', W / 2, H / 2); ctx.textAlign = 'left'; }
                if (state === 'blocked') { ctx.fillStyle = '#2563eb'; ctx.font = 'bold 32px Outfit'; ctx.textAlign = 'center'; ctx.fillText('SAVED!', W / 2, H / 2); ctx.textAlign = 'left'; }
                ctx.fillStyle = '#fff8'; ctx.font = 'bold 14px Outfit'; ctx.fillText(`Kicks: ${maxKicks - kicks}/${maxKicks}`, 20, 30);
            },
            destroy() { canvas.removeEventListener('mousedown', onMD); canvas.removeEventListener('mousemove', onMM); canvas.removeEventListener('mouseup', onMU); canvas.removeEventListener('touchstart', onTS); canvas.removeEventListener('touchmove', onTM); canvas.removeEventListener('touchend', onMU); }
        };
        function dragging() { return dragStart && dragEnd && state === 'aim'; }
    }

    /* ─── 4. PING PONG ─────────────────────────────────────── */
    function createPong(canvas, ctx, onScore, onGameOver) {
        let W, H, playerY, aiY, ballX, ballY, ballVX, ballVY, pScore = 0, aScore = 0, pw = 12, ph = 80, br = 8, maxScore = 7;

        function init() { W = canvas.width; H = canvas.height; playerY = H / 2; aiY = H / 2; serveBall(); }
        function serveBall() { ballX = W / 2; ballY = H / 2; ballVX = (Math.random() > 0.5 ? 1 : -1) * 5; ballVY = (Math.random() - 0.5) * 4; }

        function onMM(e) { const r = canvas.getBoundingClientRect(); playerY = (e.clientY || ((e.touches && e.touches[0]) ? e.touches[0].clientY : playerY)) - r.top; }
        function onTM(e) { e.preventDefault(); onMM(e.touches[0]); }

        canvas.addEventListener('mousemove', onMM);
        canvas.addEventListener('touchmove', onTM, { passive: false });

        return {
            start() { init(); },
            update() {
                ballX += ballVX; ballY += ballVY;
                // Top/bottom bounce — clamp strictly (long edges reflect)
                if (ballY <= br) { ballVY = Math.abs(ballVY); ballY = br; }
                if (ballY >= H - br) { ballVY = -Math.abs(ballVY); ballY = H - br; }
                // Left/right edges: ball passes through for scoring (no clamp)
                // Player paddle
                if (ballX < 30 + pw && ballY > playerY - ph / 2 && ballY < playerY + ph / 2 && ballVX < 0) {
                    ballVX = Math.abs(ballVX) * 1.05; ballVY += (ballY - playerY) * 0.08;
                }
                // AI paddle
                aiY += (ballY - aiY) * 0.04;
                if (ballX > W - 30 - pw && ballY > aiY - ph / 2 && ballY < aiY + ph / 2 && ballVX > 0) {
                    ballVX = -Math.abs(ballVX) * 1.05; ballVY += (ballY - aiY) * 0.08;
                }
                // Speed cap
                ballVX = Math.max(-14, Math.min(14, ballVX));
                // Scoring
                if (ballX < 0) { aScore++; onScore(pScore); if (aScore >= maxScore) onGameOver(pScore * 10); else serveBall(); }
                if (ballX > W) { pScore++; onScore(pScore); if (pScore >= maxScore) onGameOver(pScore * 10); else serveBall(); }
            },
            render() {
                ctx.clearRect(0, 0, W, H);
                ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, W, H);
                // Center line
                ctx.setLineDash([8, 8]); ctx.strokeStyle = '#fff2'; ctx.lineWidth = 2;
                ctx.beginPath(); ctx.moveTo(W / 2, 0); ctx.lineTo(W / 2, H); ctx.stroke(); ctx.setLineDash([]);
                // Center circle
                ctx.beginPath(); ctx.arc(W / 2, H / 2, 40, 0, Math.PI * 2); ctx.stroke();
                // Scores
                ctx.fillStyle = '#fff3'; ctx.font = 'bold 60px Outfit'; ctx.textAlign = 'center';
                ctx.fillText(pScore, W / 2 - 60, 70); ctx.fillText(aScore, W / 2 + 60, 70); ctx.textAlign = 'left';
                // Player paddle
                const pg = ctx.createLinearGradient(20, playerY - ph / 2, 20 + pw, playerY + ph / 2); pg.addColorStop(0, '#3b82f6'); pg.addColorStop(1, '#2563eb');
                ctx.fillStyle = pg; ctx.beginPath(); roundRect(ctx, 20, playerY - ph / 2, pw, ph, 6); ctx.fill();
                // AI paddle
                const ag = ctx.createLinearGradient(W - 20 - pw, aiY - ph / 2, W - 20, aiY + ph / 2); ag.addColorStop(0, '#2563eb'); ag.addColorStop(1, '#c41a3a');
                ctx.fillStyle = ag; ctx.beginPath(); roundRect(ctx, W - 20 - pw, aiY - ph / 2, pw, ph, 6); ctx.fill();
                // Ball with glow
                ctx.shadowColor = '#fff'; ctx.shadowBlur = 15;
                ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(ballX, ballY, br, 0, Math.PI * 2); ctx.fill();
                ctx.shadowBlur = 0;
                // Labels
                ctx.fillStyle = '#fff4'; ctx.font = '12px Outfit'; ctx.textAlign = 'center';
                ctx.fillText('YOU', 30 + pw / 2, H - 15); ctx.fillText('AI', W - 30 - pw / 2, H - 15); ctx.textAlign = 'left';
            },
            destroy() { canvas.removeEventListener('mousemove', onMM); canvas.removeEventListener('touchmove', onTM); }
        };
    }

    /* ─── 5. SPACE INVADERS ─────────────────────────────────── */
    function createSpaceInvaders(canvas, ctx, onScore, onGameOver) {
        let W, H, player, bullets = [], aliens = [], alienBullets = [], score = 0, alienDir = 1, alienSpeed = 1, dropTimer = 0, keys = {}, particles = [], gameActive = true;

        function init() {
            W = canvas.width; H = canvas.height;
            player = { x: W / 2, y: H - 100, w: 36, h: 20, speed: 5 };
            aliens = []; bullets = []; alienBullets = []; particles = [];
            const cols = 8, rows = 4, aw = 30, ah = 22, gap = 12, startX = W / 2 - (cols * (aw + gap)) / 2;
            for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
                aliens.push({ x: startX + c * (aw + gap), y: 60 + r * (ah + gap), w: aw, h: ah, alive: true, type: r });
            }
            alienDir = 1; alienSpeed = 1; gameActive = true; score = 0;
        }

        function onKD(e) { keys[e.key] = true; if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') e.preventDefault(); }
        function onKU(e) { keys[e.key] = false; }
        // Touch controls
        let touchX = null;
        function onTS(e) { e.preventDefault(); touchX = e.touches[0].clientX - canvas.getBoundingClientRect().left; shoot(); }
        function onTM(e) { e.preventDefault(); touchX = e.touches[0].clientX - canvas.getBoundingClientRect().left; }
        function onTE() { touchX = null; }

        window.addEventListener('keydown', onKD); window.addEventListener('keyup', onKU);
        canvas.addEventListener('touchstart', onTS, { passive: false }); canvas.addEventListener('touchmove', onTM, { passive: false }); canvas.addEventListener('touchend', onTE);

        let lastShot = 0;
        function shoot() { const now = Date.now(); if (now - lastShot < 250) return; lastShot = now; bullets.push({ x: player.x, y: player.y - player.h / 2, vy: -8 }); }

        return {
            start() { init(); },
            update() {
                if (!gameActive) return;
                // Player movement
                if (keys['ArrowLeft'] || keys['a']) player.x -= player.speed;
                if (keys['ArrowRight'] || keys['d']) player.x += player.speed;
                if (keys[' ']) shoot();
                if (touchX !== null) player.x += (touchX - player.x) * 0.1;
                player.x = Math.max(player.w / 2, Math.min(W - player.w / 2, player.x));
                // Bullets
                bullets = bullets.filter(b => { b.y += b.vy; return b.y > -10; });
                // Alien movement
                let moveDown = false;
                aliens.forEach(a => { if (a.alive) { a.x += alienDir * alienSpeed; if (a.x < 20 || a.x + a.w > W - 20) moveDown = true; } });
                if (moveDown) { alienDir *= -1; aliens.forEach(a => { if (a.alive) a.y += 15; }); }
                // Alien shooting
                dropTimer++; if (dropTimer > 60) { dropTimer = 0; const alive = aliens.filter(a => a.alive); if (alive.length > 0) { const shooter = alive[Math.floor(Math.random() * alive.length)]; alienBullets.push({ x: shooter.x + shooter.w / 2, y: shooter.y + shooter.h, vy: 3 + Math.random() * 2 }); } }
                alienBullets = alienBullets.filter(b => { b.y += b.vy; return b.y < H + 10; });
                // Bullet-alien collision
                bullets.forEach(b => { aliens.forEach(a => { if (a.alive && b.y < a.y + a.h && b.y > a.y && b.x > a.x && b.x < a.x + a.w) { a.alive = false; b.y = -100; score += 10 * (4 - a.type); onScore(score); for (let i = 0; i < 8; i++)particles.push({ x: a.x + a.w / 2, y: a.y + a.h / 2, vx: (Math.random() - 0.5) * 4, vy: (Math.random() - 0.5) * 4, life: 1, color: ['#6366f1', '#2563eb', '#3b82f6', '#3b82f6'][a.type] }); } }); });
                // Alien bullet-player collision
                alienBullets.forEach(b => { if (b.x > player.x - player.w / 2 && b.x < player.x + player.w / 2 && b.y > player.y - player.h / 2 && b.y < player.y + player.h / 2) { gameActive = false; for (let i = 0; i < 20; i++)particles.push({ x: player.x, y: player.y, vx: (Math.random() - 0.5) * 6, vy: (Math.random() - 0.5) * 6, life: 1, color: '#2563eb' }); setTimeout(() => onGameOver(score), 800); } });
                // Aliens reach bottom
                aliens.forEach(a => { if (a.alive && a.y + a.h > player.y - 30) { gameActive = false; setTimeout(() => onGameOver(score), 500); } });
                // All aliens dead → win bonus + respawn
                if (aliens.filter(a => a.alive).length === 0) { score += 50; onScore(score); alienSpeed += 0.3; init(); score = score; }
                particles = particles.filter(p => { p.x += p.vx; p.y += p.vy; p.life -= 0.03; return p.life > 0; });
            },
            render() {
                ctx.clearRect(0, 0, W, H);
                ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, W, H);
                // Stars
                ctx.fillStyle = '#fff2'; for (let i = 0; i < 30; i++) { const sx = (i * 137.5) % W, sy = (i * 97.3) % H; ctx.fillRect(sx, sy, 1.5, 1.5); }
                // Aliens
                const colors = ['#6366f1', '#2563eb', '#3b82f6', '#3b82f6'];
                aliens.forEach(a => {
                    if (!a.alive) return; ctx.fillStyle = colors[a.type]; ctx.fillRect(a.x, a.y, a.w, a.h);
                    // Eyes
                    ctx.fillStyle = '#fff'; ctx.fillRect(a.x + 6, a.y + 6, 5, 5); ctx.fillRect(a.x + a.w - 11, a.y + 6, 5, 5);
                    ctx.fillStyle = '#000'; ctx.fillRect(a.x + 8, a.y + 8, 2, 2); ctx.fillRect(a.x + a.w - 9, a.y + 8, 2, 2);
                    // Antenna
                    ctx.fillStyle = colors[a.type]; ctx.fillRect(a.x + a.w / 2 - 1, a.y - 4, 2, 4);
                });
                // Player ship
                if (gameActive) {
                    ctx.fillStyle = '#3b82f6';
                    ctx.beginPath(); ctx.moveTo(player.x, player.y - player.h / 2); ctx.lineTo(player.x - player.w / 2, player.y + player.h / 2); ctx.lineTo(player.x + player.w / 2, player.y + player.h / 2); ctx.closePath(); ctx.fill();
                    // Cockpit
                    ctx.fillStyle = '#3b82f6'; ctx.beginPath(); ctx.arc(player.x, player.y, 5, 0, Math.PI * 2); ctx.fill();
                    // Engine glow
                    ctx.fillStyle = '#6366f188'; ctx.beginPath(); ctx.moveTo(player.x - 8, player.y + player.h / 2); ctx.lineTo(player.x + 8, player.y + player.h / 2); ctx.lineTo(player.x, player.y + player.h / 2 + 8 + Math.random() * 4); ctx.fill();
                }
                // Player bullets
                ctx.fillStyle = '#3b82f6'; bullets.forEach(b => { ctx.fillRect(b.x - 2, b.y, 4, 10); });
                // Alien bullets
                ctx.fillStyle = '#2563eb'; alienBullets.forEach(b => { ctx.fillRect(b.x - 2, b.y, 4, 8); });
                // Particles
                particles.forEach(p => { ctx.globalAlpha = p.life; ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(p.x, p.y, 3 * p.life, 0, Math.PI * 2); ctx.fill(); }); ctx.globalAlpha = 1;
            },
            destroy() { window.removeEventListener('keydown', onKD); window.removeEventListener('keyup', onKU); canvas.removeEventListener('touchstart', onTS); canvas.removeEventListener('touchmove', onTM); canvas.removeEventListener('touchend', onTE); }
        };
    }

    /* ─── 6. ROULETTE ───────────────────────────────────────── */
    function createRoulette(canvas, ctx, onScore, onGameOver) {
        const NUMS = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];
        const REDS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
        let W, H, angle = 0, spinSpeed = 0, result = null, balance = 100, bet = 10;
        let betNum = null, betColor = null, phase = 'betting', roundNum = 0, particles = [];
        let ballAngleOffset = 0, ballRadius = 0;

        function init() { W = canvas.width; H = canvas.height; }
        function getColor(n) { return n === 0 ? '#0a7a3a' : REDS.includes(n) ? '#c41a3a' : '#1a1a2e'; }

        // ── Responsive layout helpers ──
        // Reserve space for controls at bottom, fit wheel in remaining area
        function layout() {
            const controlH = 140; // Balance + bet row + color row + info text
            const topPad = 30;    // space above wheel for pointer marker
            const gap = 20;       // between wheel bottom and controls
            const availH = H - controlH - topPad - gap;
            const radius = Math.min(W * 0.24, availH * 0.42, 180);
            const wheelCY = topPad + radius + 4;
            const wheelCX = W / 2;
            const ctrlTop = wheelCY + radius + gap;
            return { cx: wheelCX, cy: wheelCY, radius, ctrlTop };
        }

        // ── Hit-test cached positions (computed per-frame in render) ──
        let hitZones = {};

        function handleClick(e) {
            const r = canvas.getBoundingClientRect();
            const scaleX = W / r.width, scaleY = H / r.height;
            const mx = (e.clientX - r.left) * scaleX;
            const my = (e.clientY - r.top) * scaleY;
            if (phase !== 'betting') return;

            const L = layout();

            // Spin button
            if (hitZones.spin && (betNum !== null || betColor !== null)) {
                const s = hitZones.spin;
                if (mx >= s.x && mx <= s.x + s.w && my >= s.y && my <= s.y + s.h) {
                    phase = 'spinning'; spinSpeed = 18 + Math.random() * 12;
                    result = null; ballAngleOffset = Math.random() * Math.PI * 2;
                    ballRadius = L.radius * 0.85;
                    return;
                }
            }

            // Bet minus
            if (hitZones.minus) {
                const b = hitZones.minus;
                if (mx >= b.x && mx <= b.x + b.w && my >= b.y && my <= b.y + b.h) {
                    bet = Math.max(5, bet - 5); return;
                }
            }
            // Bet plus
            if (hitZones.plus) {
                const b = hitZones.plus;
                if (mx >= b.x && mx <= b.x + b.w && my >= b.y && my <= b.y + b.h) {
                    bet = Math.min(balance, bet + 5); return;
                }
            }
            // Red button
            if (hitZones.red) {
                const b = hitZones.red;
                if (mx >= b.x && mx <= b.x + b.w && my >= b.y && my <= b.y + b.h) {
                    betColor = 'red'; betNum = null; return;
                }
            }
            // Black button
            if (hitZones.black) {
                const b = hitZones.black;
                if (mx >= b.x && mx <= b.x + b.w && my >= b.y && my <= b.y + b.h) {
                    betColor = 'black'; betNum = null; return;
                }
            }

            // Number bet: click on wheel sector
            const dx = mx - L.cx, dy = my - L.cy;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > L.radius * 0.4 && dist < L.radius * 1.08) {
                let a = Math.atan2(dy, dx) - angle;
                a = ((a % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
                const idx = Math.floor(a / (Math.PI * 2 / 37));
                if (idx >= 0 && idx < 37) { betNum = NUMS[idx]; betColor = null; }
            }
        }

        function onTouch(e) {
            e.preventDefault();
            if (e.touches && e.touches[0]) {
                handleClick({ clientX: e.touches[0].clientX, clientY: e.touches[0].clientY });
            }
        }

        canvas.addEventListener('click', handleClick);
        canvas.addEventListener('touchend', onTouch, { passive: false });

        return {
            start() {
                init(); balance = 100; bet = 10; betNum = null; betColor = null;
                phase = 'betting'; roundNum = 0; angle = 0; particles = [];
                onScore(balance);
            },
            update() {
                if (phase === 'spinning') {
                    angle += spinSpeed * 0.018;
                    spinSpeed *= 0.988;
                    // Ball settles toward wheel edge
                    const L = layout();
                    ballRadius += (L.radius * 0.72 - ballRadius) * 0.03;

                    if (spinSpeed < 0.12) {
                        phase = 'result';
                        // Determine result
                        let normA = ((angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
                        let bAngle = (Math.PI * 1.5 - normA + ballAngleOffset);
                        bAngle = ((bAngle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
                        const idx = Math.floor(bAngle / (Math.PI * 2 / 37));
                        result = NUMS[idx >= 0 && idx < 37 ? idx : 0];
                        // Evaluate
                        let win = false;
                        if (betNum !== null && betNum === result) { balance += bet * 35; win = true; }
                        else if (betColor === 'red' && REDS.includes(result) && result !== 0) { balance += bet * 2; win = true; }
                        else if (betColor === 'black' && !REDS.includes(result) && result !== 0) { balance += bet * 2; win = true; }
                        else { balance -= bet; }
                        onScore(balance);
                        if (win) {
                            for (let i = 0; i < 30; i++)
                                particles.push({ x: W / 2, y: L.cy, vx: (Math.random() - 0.5) * 12, vy: (Math.random() - 0.5) * 12, life: 1, color: Math.random() > 0.5 ? '#ffd700' : '#6366f1' });
                        }
                        roundNum++;
                        setTimeout(() => {
                            if (balance <= 0) onGameOver(roundNum);
                            else { phase = 'betting'; betNum = null; betColor = null; bet = Math.min(bet, balance); }
                        }, 2400);
                    }
                }
                particles = particles.filter(p => { p.x += p.vx; p.y += p.vy; p.vy += 0.15; p.life -= 0.018; return p.life > 0; });
            },
            render() {
                ctx.clearRect(0, 0, W, H);
                // Background
                const bg = ctx.createLinearGradient(0, 0, 0, H);
                bg.addColorStop(0, '#0d1a0d'); bg.addColorStop(0.5, '#0a0f1a'); bg.addColorStop(1, '#0a0a14');
                ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
                // Subtle felt texture
                ctx.fillStyle = 'rgba(0,80,40,0.04)'; ctx.fillRect(0, 0, W, H);

                const L = layout();
                const { cx, cy, radius, ctrlTop } = L;
                const sliceAngle = (Math.PI * 2) / 37;

                // ── Outer ring ──
                ctx.save();
                ctx.shadowColor = 'rgba(255,215,0,0.2)'; ctx.shadowBlur = 25;
                ctx.beginPath(); ctx.arc(cx, cy, radius + 10, 0, Math.PI * 2);
                ctx.strokeStyle = '#aa9a3a'; ctx.lineWidth = 5; ctx.stroke();
                ctx.restore();
                // Inner gold ring
                ctx.beginPath(); ctx.arc(cx, cy, radius + 3, 0, Math.PI * 2);
                ctx.strokeStyle = 'rgba(170,154,58,0.5)'; ctx.lineWidth = 1.5; ctx.stroke();

                // ── Wheel sectors ──
                ctx.save();
                ctx.translate(cx, cy); ctx.rotate(angle);
                for (let i = 0; i < 37; i++) {
                    const a0 = i * sliceAngle, a1 = a0 + sliceAngle;
                    ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, radius, a0, a1); ctx.closePath();
                    ctx.fillStyle = getColor(NUMS[i]); ctx.fill();
                    ctx.strokeStyle = 'rgba(255,255,255,0.12)'; ctx.lineWidth = 0.8; ctx.stroke();
                    // Number
                    ctx.save(); ctx.rotate(a0 + sliceAngle / 2);
                    ctx.fillStyle = '#fff'; ctx.font = `bold ${Math.max(9, radius * 0.06)}px Outfit`;
                    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                    ctx.fillText(NUMS[i], radius * 0.82, 0);
                    ctx.restore();
                }
                // Inner wood circle
                const innerR = radius * 0.32;
                ctx.beginPath(); ctx.arc(0, 0, innerR, 0, Math.PI * 2);
                const ig = ctx.createRadialGradient(0, 0, innerR * 0.2, 0, 0, innerR);
                ig.addColorStop(0, '#3a3520'); ig.addColorStop(0.6, '#2a2515'); ig.addColorStop(1, '#1a1a0a');
                ctx.fillStyle = ig; ctx.fill();
                ctx.strokeStyle = '#aa9a3a'; ctx.lineWidth = 2; ctx.stroke();
                // Center emblem
                ctx.fillStyle = 'rgba(170,154,58,0.3)'; ctx.font = `bold ${innerR * 0.5}px Outfit`;
                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                ctx.fillText('♦', 0, 0);
                ctx.restore();

                // ── Ball marker (pointer at top) ──
                ctx.save();
                ctx.shadowColor = 'rgba(255,215,0,0.4)'; ctx.shadowBlur = 8;
                ctx.fillStyle = '#ffd700'; ctx.beginPath();
                ctx.moveTo(cx, cy - radius - 8);
                ctx.lineTo(cx - 7, cy - radius - 22);
                ctx.lineTo(cx + 7, cy - radius - 22);
                ctx.closePath(); ctx.fill();
                ctx.restore();

                // ── Ball on wheel ──
                if (phase === 'spinning' || phase === 'result') {
                    const ballA = angle + Math.PI * 1.5 + ballAngleOffset;
                    const br = ballRadius || radius * 0.72;
                    const bx = cx + Math.cos(ballA) * br, by = cy + Math.sin(ballA) * br;
                    ctx.save();
                    ctx.shadowColor = '#fff'; ctx.shadowBlur = 10;
                    ctx.beginPath(); ctx.arc(bx, by, Math.max(4, radius * 0.035), 0, Math.PI * 2);
                    const ballG = ctx.createRadialGradient(bx - 1, by - 1, 0, bx, by, radius * 0.035);
                    ballG.addColorStop(0, '#ffffff'); ballG.addColorStop(0.7, '#e8e8e0'); ballG.addColorStop(1, '#bbb');
                    ctx.fillStyle = ballG; ctx.fill();
                    ctx.restore();
                }

                // ── Result overlay ──
                if (phase === 'result' && result !== null) {
                    const rc = getColor(result);
                    // Backdrop
                    ctx.fillStyle = 'rgba(0,0,0,0.3)';
                    ctx.beginPath(); ctx.arc(cx, cy, innerR - 4, 0, Math.PI * 2); ctx.fill();
                    // Number pill
                    ctx.fillStyle = rc; ctx.beginPath(); roundRect(ctx, cx - 32, cy - 22, 64, 44, 10); ctx.fill();
                    ctx.strokeStyle = '#ffd700'; ctx.lineWidth = 2; ctx.beginPath(); roundRect(ctx, cx - 32, cy - 22, 64, 44, 10); ctx.stroke();
                    ctx.fillStyle = '#fff'; ctx.font = `bold ${Math.max(20, radius * 0.14)}px Outfit`;
                    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                    ctx.fillText(result, cx, cy);
                    ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
                }

                // ──────────────────────────────────
                // CONTROLS — all relative to ctrlTop
                // ──────────────────────────────────
                const row1 = ctrlTop;       // Balance text
                const row2 = row1 + 22;    // Bet controls row
                const row3 = row2 + 38;    // Color buttons + SPIN

                // Balance
                ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.font = '13px Outfit'; ctx.textAlign = 'center';
                ctx.fillText('Balance: $' + balance, cx, row1);

                // ── Bet controls (row2): [−5] [$bet] [+5]  [SPIN] ──
                const btnW = 42, btnH = 30, btnR = 8;
                const minusX = cx - 90, plusX = cx - 10, spinX = cx + 50;

                // Minus button
                ctx.fillStyle = '#c41a3a'; ctx.beginPath(); roundRect(ctx, minusX, row2, btnW, btnH, btnR); ctx.fill();
                ctx.fillStyle = '#fff'; ctx.font = 'bold 14px Outfit'; ctx.fillText('−5', minusX + btnW / 2, row2 + 20);
                hitZones.minus = { x: minusX, y: row2, w: btnW, h: btnH };

                // Bet amount
                ctx.fillStyle = '#ffd700'; ctx.font = 'bold 16px Outfit';
                ctx.fillText('$' + bet, cx - 50 + 18, row2 + 20);

                // Plus button
                ctx.fillStyle = '#0a7a3a'; ctx.beginPath(); roundRect(ctx, plusX, row2, btnW, btnH, btnR); ctx.fill();
                ctx.fillStyle = '#fff'; ctx.font = 'bold 14px Outfit'; ctx.fillText('+5', plusX + btnW / 2, row2 + 20);
                hitZones.plus = { x: plusX, y: row2, w: btnW, h: btnH };

                // Spin button
                if (phase === 'betting' && (betNum !== null || betColor !== null)) {
                    const spinW = 90, spinH = btnH;
                    const sg = ctx.createLinearGradient(spinX, row2, spinX + spinW, row2 + spinH);
                    sg.addColorStop(0, '#3b82f6'); sg.addColorStop(1, '#2563eb');
                    ctx.fillStyle = sg; ctx.beginPath(); roundRect(ctx, spinX, row2, spinW, spinH, 15); ctx.fill();
                    ctx.fillStyle = '#fff'; ctx.font = 'bold 13px Outfit';
                    ctx.fillText('SPIN ▶', spinX + spinW / 2, row2 + 20);
                    hitZones.spin = { x: spinX, y: row2, w: spinW, h: spinH };
                } else {
                    hitZones.spin = null;
                }

                // ── Color buttons (row3) ──
                const colorBtnW = 80, colorBtnH = 32, colorR = 10;
                const redX = cx - colorBtnW - 10, blackX = cx + 10;

                ctx.fillStyle = betColor === 'red' ? '#ff3a5a' : '#c41a3a';
                ctx.beginPath(); roundRect(ctx, redX, row3, colorBtnW, colorBtnH, colorR); ctx.fill();
                ctx.strokeStyle = betColor === 'red' ? '#ffd700' : 'transparent'; ctx.lineWidth = 2;
                if (betColor === 'red') { ctx.beginPath(); roundRect(ctx, redX, row3, colorBtnW, colorBtnH, colorR); ctx.stroke(); }
                ctx.fillStyle = '#fff'; ctx.font = 'bold 13px Outfit';
                ctx.fillText('RED', redX + colorBtnW / 2, row3 + 21);
                hitZones.red = { x: redX, y: row3, w: colorBtnW, h: colorBtnH };

                ctx.fillStyle = betColor === 'black' ? '#3a3a5a' : '#1a1a2e';
                ctx.beginPath(); roundRect(ctx, blackX, row3, colorBtnW, colorBtnH, colorR); ctx.fill();
                if (betColor === 'black') { ctx.strokeStyle = '#ffd700'; ctx.beginPath(); roundRect(ctx, blackX, row3, colorBtnW, colorBtnH, colorR); ctx.stroke(); }
                ctx.fillStyle = '#fff';
                ctx.fillText('BLACK', blackX + colorBtnW / 2, row3 + 21);
                hitZones.black = { x: blackX, y: row3, w: colorBtnW, h: colorBtnH };

                // ── Bet info ──
                ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.font = '11px Outfit';
                if (betNum !== null) ctx.fillText('Betting #' + betNum + ' (35:1)', cx, row3 + colorBtnH + 16);
                else if (betColor) ctx.fillText('Betting ' + betColor.toUpperCase() + ' (2:1)', cx, row3 + colorBtnH + 16);
                else ctx.fillText('Click wheel or color to bet', cx, row3 + colorBtnH + 16);

                ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';

                // ── Particles ──
                particles.forEach(p => {
                    ctx.globalAlpha = p.life;
                    ctx.fillStyle = p.color;
                    ctx.beginPath(); ctx.arc(p.x, p.y, 4 * p.life, 0, Math.PI * 2); ctx.fill();
                });
                ctx.globalAlpha = 1;

                // Round counter
                ctx.fillStyle = 'rgba(255,255,255,0.25)'; ctx.font = '11px Outfit';
                ctx.fillText('Round ' + (roundNum + 1), 14, 22);
            },
            destroy() {
                canvas.removeEventListener('click', handleClick);
                canvas.removeEventListener('touchend', onTouch);
            }
        };
    }

    /* ── Utility: rounded rect ── */
    function roundRect(ctx, x, y, w, h, r) { ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r); ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h); ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r); ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y); }
}

window.initGameLab = initGameLab;
