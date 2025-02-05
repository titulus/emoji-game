document.addEventListener('DOMContentLoaded', () => {
    const emojiContainer = document.querySelector('.emoji-container');
    const scoreElement = document.getElementById('score');
    const gameOverScreen = document.querySelector('.game-over');
    const finalScoreElement = document.getElementById('final-score');
    const restartButton = document.getElementById('restart-button');
    const restartAdButton = document.getElementById('restart-ad-button');
    const soundToggleButton = document.getElementById('sound-toggle');
    const startScreen = document.getElementById('start-screen');
    const startButton = document.getElementById('start-button');

    const goodEmojis = ['🍋', '🍎', '🍊', '🍌', '🍉', '🍇', '🍓', '🥝', '🥭', '🍍', '🥑', '🍒'];
    const badEmojis = ['💀', '🦠', '🤬', '☠️', '💩'];
    const burstEmojis = ['🌟', '✨', '💥', '⭐', '🕸️', '🔅', '🔆'];

    let audioContext;
    let score = 0;
    let gameActive = false;
    let emojiRemovalIntervalID;
    let emojiStats = {};
    let soundEnabled = true;
    let isPaused = false;

    function pauseGame() {
        if (!isPaused && gameActive) {
            isPaused = true;
            gameActive = false;
            clearInterval(emojiRemovalIntervalID);
            // Pause all emoji animations and freeze their removal timers
            document.querySelectorAll('.emoji').forEach(emoji => {
                emoji.style.animationPlayState = 'paused';
                if (emoji.removalTarget) {
                    const remaining = emoji.removalTarget - Date.now();
                    if (remaining > 0) {
                        emoji.removalRemaining = remaining;
                    }
                    delete emoji.removalTarget;
                }
            });
            if (window.ysdk) window.ysdk.features.GameplayAPI?.stop();
        }
    }

    function resumeGame() {
        if (isPaused && !gameOverScreen.style.display.includes('flex')) {
            isPaused = false;
            gameActive = true;
            // For each emoji, restart removal timers with the remaining time
            document.querySelectorAll('.emoji').forEach(emoji => {
                emoji.style.animationPlayState = 'running';
                if (emoji.removalRemaining) {
                    emoji.removalTarget = Date.now() + emoji.removalRemaining;
                    delete emoji.removalRemaining;
                }
            });
            emojiRemovalIntervalID = setInterval(checkEmojiRemovals, 100);
            scheduleNextEmoji();
            if (window.ysdk) window.ysdk.features.GameplayAPI?.start();
        }
    }

    function initAudio() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
    }

    function toggleSound() {
        soundEnabled = !soundEnabled;
        soundToggleButton.textContent = soundEnabled ? '🔊' : '🔇';
    }

    function playSpawnSound(size) {
        if (!audioContext || audioContext.state !== 'running' || !soundEnabled) return;

        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.type = 'sine';
        const baseFreq = 880;
        const freq = baseFreq / (size * 1.5);
        oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);

        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.05);
        gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.3);

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.3);
    }

    function playClickSound() {
        if (!audioContext || audioContext.state !== 'running' || !soundEnabled) return;

        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(880, audioContext.currentTime);

        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.02);
        gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.15);

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.15);
    }

    function playBadClickSound() {
        if (!audioContext || audioContext.state !== 'running' || !soundEnabled) return;

        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.type = 'sawtooth'; // More harsh sound
        oscillator.frequency.setValueAtTime(220, audioContext.currentTime); // Lower frequency

        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.05);
        gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.2);

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.2);
    }

    function createParticles(x, y, isBad = false) {
        const particleCount = Math.random() * 5 + 3;
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            if (isBad) {
                particle.classList.add('bad-particle');
                particle.innerText = '❌';
            } else {
                particle.innerText = burstEmojis[Math.floor(Math.random() * burstEmojis.length)];
            }
            
            const angle = (Math.PI * 2 * i) / particleCount;
            const distance = 100;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;
            
            particle.style.setProperty('--tx', `${tx}px`);
            particle.style.setProperty('--ty', `${ty}px`);
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            
            emojiContainer.appendChild(particle);
            
            setTimeout(() => particle.remove(), 800);
        }
    }

    function updateScore(points) {
        score += points;
        if (score < 0) {
            score = 0;
        }
        scoreElement.textContent = score;
    }

    // Global checker for auto-removal of emojis using removalTarget timestamps
    function checkEmojiRemovals() {
        // Only check removals when not paused
        if (isPaused) return;
        const now = Date.now();
        document.querySelectorAll('.emoji').forEach(emoji => {
            if (emoji.removalTarget && now >= emoji.removalTarget) {
                emoji.remove();
            }
        });
    }

    function spawnEmoji() {
        if (!gameActive) return;

        const emoji = document.createElement('div');
        emoji.classList.add('emoji');

        let badProbability;
        if (score < 100) {
            badProbability = 0.2;
        } else if (score <= 1000) {
            badProbability = 0.2 + ((score - 100) / 900) * 0.7;
        } else {
            badProbability = 0.9;
        }
        const isBadEmoji = Math.random() < badProbability;
        const selectedEmoji = isBadEmoji
            ? badEmojis[Math.floor(Math.random() * badEmojis.length)]
            : goodEmojis[Math.floor(Math.random() * goodEmojis.length)];

        emoji.innerText = selectedEmoji;
        if (isBadEmoji) {
            emoji.classList.add('bad-emoji');
        }

        const size = Math.random() * 2 + 1;
        emoji.style.fontSize = `${size}rem`;
        playSpawnSound(size);

        const x = Math.random() * (window.innerWidth - 50);
        const y = window.innerHeight;
        emoji.style.left = `${x}px`;
        emoji.style.top = `${y}px`;

        const duration = Math.random() * 5 + 3;
        emoji.style.animationDuration = `${duration}s`;

        // Set removal target based on spawn duration
        emoji.removalTarget = Date.now() + duration * 1000;

        const handleEmojiInteraction = (e) => {
            if (!gameActive) return;
            if (e.cancelable) {
                e.preventDefault();
            }

            const rect = emoji.getBoundingClientRect();

            if (emoji.classList.contains('bad-emoji')) {
                playBadClickSound();
                // Negative effects for bad emojis
                createParticles(rect.left, rect.top, true);
                emoji.classList.add('burst-bad');

                // Decrease score and time
                updateScore(-1);

                // Update emoji stats
                emojiStats[selectedEmoji] = (emojiStats[selectedEmoji] || 0) + 1;
            } else {
                playClickSound();
                createParticles(rect.left, rect.top, false);
                emoji.classList.add('burst');

                // Calculate points (1-10) based on size and speed
                // size range: 1-3 (smaller = better)
                // duration range: 3-8 (shorter = better)
                const sizeScore = (3 - size) / 2; // 0 to 1
                const speedScore = (8 - duration) / 5; // 0 to 1
                const points = Math.max(1, Math.min(10, Math.ceil((sizeScore + speedScore) * 7)));
                emojiStats[selectedEmoji] = (emojiStats[selectedEmoji] || 0) + 1;
                updateScore(points);
            }
            // Update removal timing to 500ms from now upon interaction
            if (isPaused) {
                emoji.removalRemaining = 500;
                delete emoji.removalTarget;
            } else {
                emoji.removalTarget = Date.now() + 500;
            }
        };

        emoji.addEventListener('mousedown', handleEmojiInteraction);
        emoji.addEventListener('touchstart', handleEmojiInteraction, { passive: false });

        emojiContainer.appendChild(emoji);
    }

    function calculateSpawnDelay() {
        const baseMin = 800;
        const baseMax = 300;
        const targetMin = 200;
        const targetMax = 100;
        const progressionPoint = 100;

        // Cap progress at 1 when score reaches progressionPoint
        const progress = Math.min(1, Math.pow(score / progressionPoint, 2.5));

        // Calculate current min/max delay
        const currentMin = targetMin + (baseMin - targetMin) * (1 - progress);
        const currentMax = targetMax + (baseMax - targetMax) * (1 - progress);

        // Return random delay within current range
        return Math.random() * (currentMax - currentMin) + currentMin;
    }

    function scheduleNextEmoji() {
        if (!gameActive) return;
        const delay = calculateSpawnDelay();
        setTimeout(() => {
            spawnEmoji();
            scheduleNextEmoji();
        }, delay);
    }

    function startGame(config = {}) {
        // Reset game state
        score = config.score !== undefined ? config.score : 0;
        gameActive = true;
        emojiStats = {};

        // Update UI
        updateScore(score);
        gameOverScreen.style.display = 'none';
    
        // Start game loops
        scheduleNextEmoji();
        emojiRemovalIntervalID = setInterval(checkEmojiRemovals, 100);
    
        // Inform SDK that game has started
        if (window.ysdk) window.ysdk.features.GameplayAPI?.start();
    }

    function endGame() {
        gameActive = false;
        clearInterval(emojiRemovalIntervalID);

        // Clear all existing emojis
        const emojis = document.querySelectorAll('.emoji');
        emojis.forEach(emoji => emoji.remove());
    
        // Show game over screen with stats
        finalScoreElement.textContent = score;
        gameOverScreen.style.display = 'flex';
    
        if (window.ysdk) {
            // Inform SDK that game has ended
            window.ysdk.features.GameplayAPI?.stop();
            // Submit score to leaderboard if available
            window.ysdk.isAvailableMethod('leaderboards.setLeaderboardScore')
                .then(isAvailable => {
                    if (isAvailable) {
                        window.ysdk.setLeaderboardScore('leader', score)
                            .then(() => console.debug('Score submitted to leaderboard'))
                            .catch(err => console.error('Error submitting score:', err));
                    }
                })
                .catch(err => console.error('Error checking leaderboard availability:', err));
        }
    }

    document.addEventListener('selectstart', (e) => {
        e.preventDefault();
    });

    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });

    // Pause and resume game on visibility change
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            pauseGame();
        } else {
            resumeGame();
        }
    });

    // Pause and resume game on window blur and focus
    window.addEventListener('blur', pauseGame);
    window.addEventListener('focus', resumeGame);

    // Remove automatic start, instead wait for start button click
    const handleStartButton = (e) => {
        if (e.cancelable) e.preventDefault();
        initAudio(); // Initialize audio on first interaction
        startGame();
        startScreen.style.display = 'none';
    };
    startButton.addEventListener('mousedown', handleStartButton);
    startButton.addEventListener('touchstart', handleStartButton, { passive: false });

    restartButton.addEventListener('mousedown', (e) => {
        if (e.cancelable) e.preventDefault();
        startGame();
    });;
    restartButton.addEventListener('touchstart', (e) => {
        if (e.cancelable) e.preventDefault();
        startGame();
    }, { passive: false });
    
    const handleRestartAd = (e) => {
        if (e.cancelable) e.preventDefault();
        if (window.ysdk && window.ysdk.adv && typeof window.ysdk.adv.showRewardedVideo === 'function') {
            window.ysdk.adv.showRewardedVideo({
                callbacks: {
                    onOpen: () => { console.debug('Video ad open.'); },
                    onRewarded: () => { console.debug('Reward granted.'); startGame(); },
                    onClose: () => { console.debug('Video ad closed.'); },
                    onError: (error) => { console.error('Error while opening video ad:', error); }
                }
            });
        } else {
            console.warn('Rewarded video ad not available.');
        }
    };
    
    restartAdButton.addEventListener('mousedown', handleRestartAd);
    restartAdButton.addEventListener('touchstart', handleRestartAd, { passive: false });
    soundToggleButton.addEventListener('mousedown', (e) => {
        if (e.cancelable) e.preventDefault();
        toggleSound();
    });
    soundToggleButton.addEventListener('touchstart', (e) => {
        if (e.cancelable) e.preventDefault();
        toggleSound();
    }, { passive: false });
});