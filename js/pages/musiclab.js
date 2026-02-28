/* ==========================================================
   MUSIC LAB — YouTube Audio-Only Player with Turntable
   Uses a direct iframe embed to avoid IFrame API issues on file://
   ========================================================== */

(function () {
    'use strict';

    let isPlaying = false;
    let currentVideoId = null;

    // Preset songs (YouTube video IDs and titles)
    const PRESETS = [
        { id: 'dQw4w9WgXcQ', title: 'Rick Astley – Never Gonna Give You Up' },
        { id: 'fJ9rUzIMcZQ', title: 'Queen – Bohemian Rhapsody' },
        { id: 'hTWKbfoikeg', title: 'Nirvana – Smells Like Teen Spirit' },
        { id: '5qap5aO4i9A', title: 'Linkin Park – Numb' },
        { id: 'kXYiU_JCYtU', title: 'Linkin Park – In The End' },
        { id: 'YQHsXMglC9A', title: 'Adele – Hello' },
        { id: 'RBumgq5yVrA', title: 'The Weeknd – Blinding Lights' },
        { id: '60ItHLz5WEA', title: 'Alan Walker – Faded' },
        { id: 'JGwWNGJdvx8', title: 'Ed Sheeran – Shape of You' },
    ];

    function playVideo(videoId, title) {
        const container = document.getElementById('musiclab-yt');
        if (!container) return;

        currentVideoId = videoId;

        // Create an iframe embed — autoplay=1 enables auto-playing after user gesture
        container.innerHTML = `<iframe
            id="musiclab-yt-iframe"
            src="https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&modestbranding=1&rel=0&enablejsapi=1"
            allow="autoplay; encrypted-media"
            allowfullscreen
            style="width:1px;height:1px;position:absolute;opacity:0;pointer-events:none;"
            frameborder="0">
        </iframe>`;

        setNowPlaying(title || videoId);
        setStatus('Playing');
        setPlayingState(true);

        // Listen for iframe load
        const iframe = document.getElementById('musiclab-yt-iframe');
        if (iframe) {
            iframe.addEventListener('load', () => {
                setPlayingState(true);
            });
        }
    }

    function togglePlayPause() {
        const iframe = document.getElementById('musiclab-yt-iframe');
        if (!iframe || !currentVideoId) return;

        if (isPlaying) {
            // Pause: remove the iframe src to stop playback
            iframe.contentWindow.postMessage(
                JSON.stringify({ event: 'command', func: 'pauseVideo', args: '' }),
                '*'
            );
            setPlayingState(false);
        } else {
            // Resume: send play command
            iframe.contentWindow.postMessage(
                JSON.stringify({ event: 'command', func: 'playVideo', args: '' }),
                '*'
            );
            setPlayingState(true);
        }
    }

    function setPlayingState(playing) {
        isPlaying = playing;
        const vinyl = document.querySelector('.turntable-vinyl');
        const arm = document.querySelector('.turntable-arm');
        const playBtn = document.getElementById('musiclab-play-btn');

        if (vinyl) vinyl.classList.toggle('spinning', playing);
        if (arm) arm.classList.toggle('playing', playing);
        if (playBtn) playBtn.textContent = playing ? '⏸' : '▶';
    }

    function setNowPlaying(title) {
        const el = document.querySelector('.musiclab-nowplaying__title');
        const label = document.querySelector('.turntable-label-text');
        if (el) el.textContent = title || 'No track selected';
        if (label) label.textContent = title ? title.substring(0, 30) : '♪';
    }

    function setStatus(text) {
        const el = document.querySelector('.musiclab-nowplaying__status');
        if (el) el.textContent = text;
    }

    function searchAndPlay(query) {
        if (!query.trim()) return;
        setStatus('Searching…');

        // If user pastes a YouTube URL, extract the ID
        const urlMatch = query.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
        if (urlMatch) {
            playVideo(urlMatch[1], query);
            return;
        }

        // Check if it's a raw video ID (11 chars)
        if (/^[a-zA-Z0-9_-]{11}$/.test(query.trim())) {
            playVideo(query.trim(), query.trim());
            return;
        }

        // Search presets first
        const q = query.toLowerCase();
        const match = PRESETS.find(p => p.title.toLowerCase().includes(q));
        if (match) {
            playVideo(match.id, match.title);
            highlightPreset(match.id);
            return;
        }

        // Fallback: construct a YouTube search URL and pick the first result
        // Use multiple Invidious instances as fallback
        const instances = [
            'https://inv.nadeko.net',
            'https://invidious.fdn.fr',
            'https://iv.datura.network',
        ];

        trySearch(instances, 0, query);
    }

    function trySearch(instances, idx, query) {
        if (idx >= instances.length) {
            // All instances failed — show helpful message
            setStatus('Tip: Paste a YouTube URL directly, or choose a preset below!');
            return;
        }

        fetch(`${instances[idx]}/api/v1/search?q=${encodeURIComponent(query)}&type=video`, {
            mode: 'cors',
        })
            .then(r => r.json())
            .then(results => {
                if (results && results.length > 0 && results[0].videoId) {
                    const video = results[0];
                    playVideo(video.videoId, video.title || query);
                } else {
                    trySearch(instances, idx + 1, query);
                }
            })
            .catch(() => {
                trySearch(instances, idx + 1, query);
            });
    }

    function highlightPreset(id) {
        document.querySelectorAll('.musiclab-preset').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.id === id);
        });
    }

    window.initMusicLab = function () {
        const searchInput = document.getElementById('musiclab-search');
        const searchBtn = document.getElementById('musiclab-search-btn');
        const playBtn = document.getElementById('musiclab-play-btn');
        const volumeSlider = document.getElementById('musiclab-volume');

        // Search
        searchBtn?.addEventListener('click', () => {
            searchAndPlay(searchInput?.value || '');
        });
        searchInput?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') searchAndPlay(searchInput.value);
        });

        // Play / Pause
        playBtn?.addEventListener('click', () => {
            if (!currentVideoId) return;
            togglePlayPause();
        });

        // Volume — YouTube embed doesn't support external volume control easily,
        // so we'll just display it as a visual element
        volumeSlider?.addEventListener('input', () => {
            // Volume control via postMessage is limited for embedded iframes
            // This serves as a visual indicator
        });

        // Presets
        document.querySelectorAll('.musiclab-preset').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                const title = btn.dataset.title;
                playVideo(id, title);
                highlightPreset(id);
                if (searchInput) searchInput.value = title;
            });
        });
    };
})();
