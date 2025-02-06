document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const emojiContainer = document.querySelector('.emoji-container');
    const scoreElement = document.getElementById('score');
    const gameOverScreen = document.querySelector('.game-over');
    const finalScoreElement = document.getElementById('final-score');
    const restartButton = document.getElementById('restart-button');
    const restartAdButton = document.getElementById('restart-ad-button');
    const soundToggleButton = document.getElementById('sound-toggle');
    const startScreen = document.getElementById('start-screen');
    const startButton = document.getElementById('start-button');
    const progressBar = document.getElementById('progress-bar');
    const currentEmojiElement = document.getElementById('current-emoji');
    const nextEmojiElement = document.getElementById('next-emoji');

    const goodEmojis = [
        '🍓', '🍎', '🍑', '🥭', '🍊', '🍍', '🍌', '🍋', '🍐', '🍏', '🥝', '🥑', '🍈', '🥥', '🍇',
        '🍅', '🌶️', '🥕', '🌽', '🥔', '🧄', '🧅', '🥬', '🥦', '🥒', '🍆',
        '🌹', '🌺', '🌻', '💐', '🌼', '🌷',
        '🏆'
    ];
    const badEmojis = ['💀', '☠️', '💩'];
    const bonusEmojis = ['🧨'];
    const particles = ['🌟', '✨', '⭐', '🔅', '🔆'];

    function generateFibonacciSequence(length) {
        const sequence = [1, 1];
        for (let i = 2; i < length; i++) {
            sequence.push(sequence[i - 1] + sequence[i - 2]);
        }
        return sequence;
    }
    const emojiMultipliers = {};
    const fibonacciSequence = generateFibonacciSequence(goodEmojis.length);
    goodEmojis.forEach((emoji, index) => {
        emojiMultipliers[emoji] = fibonacciSequence[index];
    });

    // Game variables
    let audioContext;
    let score = 0;
    let gameActive = false;
    let emojiRemovalIntervalID;
    let emojiStats = {};
    let soundEnabled = true;
    let isPaused = false;
    let progressBarValue = 0;
    let progressIntervalID;
    let level = 1;

    // Update level emojis display in the UI
    function updateLevelEmojis() {
        const currentIndex = (level - 1) < goodEmojis.length ? (level - 1) : goodEmojis.length - 1;
        let nextIndex;
        if (level < goodEmojis.length) {
            nextIndex = level;
        } else {
            nextIndex = currentIndex;
        }
        currentEmojiElement.textContent = goodEmojis[currentIndex];
        nextEmojiElement.textContent = goodEmojis[nextIndex];
        restartAdButton.textContent = '📺→' + goodEmojis[currentIndex];
    }

    function pauseGame() {
        if (!isPaused && gameActive) {
            isPaused = true;
            gameActive = false;
            clearInterval(emojiRemovalIntervalID);
            clearInterval(progressIntervalID); // Clear progress interval
            // Pause all emoji animations and freeze their removal timers
            document.querySelectorAll('.emoji').forEach(emoji => {
                emoji.style.animationPlayState = 'paused';
                if (emoji.removalTarget) {
                    const remaining = emoji.removalTarget - Date.now();
                    if (remaining > 0) {
                        emoji.removalRemaining = remaining;
                        delete emoji.removalTarget;
                    } else {
                        emoji.remove();
                    }
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
                const duration = parseFloat(emoji.dataset.duration);
                if (duration) {
                    const fullDurationMs = duration * 1000;
                    const currentTop = emoji.getBoundingClientRect().top;
                    const remainingTime = (currentTop / window.innerHeight) * fullDurationMs;
                    emoji.removalTarget = Date.now() + remainingTime;
                }
            });
            emojiRemovalIntervalID = setInterval(checkEmojiRemovals, 100);
            progressIntervalID = setInterval(() => {
                decrementProgress();
            }, 1000); // Restart progress interval
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
    
    function playBonusClickSound() {
        if (!audioContext || audioContext.state !== 'running' || !soundEnabled) return;
    
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
    
        oscillator.type = 'triangle'; // Similar to click sound but different
        oscillator.frequency.setValueAtTime(1320, audioContext.currentTime); // Higher frequency
    
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.4, audioContext.currentTime + 0.02);
        gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.15);
    
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
    
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.15);
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
                particle.innerText = particles[Math.floor(Math.random() * particles.length)];
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

    function updateScore(points = 0) {
        score += points;
        if (score < 0) {
            score = 0;
        }
        scoreElement.textContent = score;
    }
    function showLevelTransition() {
        const transitionContainer = document.createElement('div');
        transitionContainer.classList.add('level-transition');
    
        const largeEmoji = document.createElement('div');
        largeEmoji.classList.add('large-emoji');
        largeEmoji.innerText = goodEmojis[level - 1];
    
        transitionContainer.appendChild(largeEmoji);
    
        document.body.appendChild(transitionContainer);
    
        const rect = largeEmoji.getBoundingClientRect();
        createLevelParticles(rect.left + rect.width / 2, rect.top + rect.height / 2, goodEmojis[level - 1]);
    
        setTimeout(() => {
            transitionContainer.remove();
        }, 1000);
    }
    
    function createLevelParticles(x, y, emoji) {
        const particleCount = 20; // Increase the number of particles
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            particle.innerText = emoji;
    
            const angle = (Math.PI * 2 * i) / particleCount;
            const distance = 200; // Increase the distance for further flight
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;
    
            particle.style.setProperty('--tx', `${tx}px`);
            particle.style.setProperty('--ty', `${ty}px`);
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
    
            emojiContainer.appendChild(particle);
    
            setTimeout(() => particle.remove(), 1500); // Increase the duration for further flight
        }
    }

    function updateProgressBar() {
        if (progressBar) {
            if (level >= goodEmojis.length) {
                progressBar.style.width = '100%';
                progressBar.style.setProperty('background', 'white', 'important');
            } else {
                progressBar.style.width = progressBarValue + '%';
                progressBar.style.backgroundColor = '';
            }
        }
    }
    
    function incrementProgress(value = 1) {
        const currentEmojiCost = emojiMultipliers[goodEmojis[level - 1]] || 1;
        const adjustedValue = value / currentEmojiCost;
        if (level < goodEmojis.length) {
            progressBarValue = Math.min(progressBarValue + adjustedValue, 100);
            updateProgressBar();
            if (progressBarValue === 100) {
                level++;
                resetProgress();
                updateLevelEmojis();
                showLevelTransition();
            }
        } else {
            // Final level reached: lock progress bar at 100%.
            progressBarValue = 100;
            updateProgressBar();
        }
    }
    function decrementProgress(value = 1) {
        if (level >= goodEmojis.length) {
            progressBarValue = 100;
        } else {
            const previousProgress = progressBarValue;
            progressBarValue = Math.max(progressBarValue - value, 0);
            if (previousProgress > 0 && progressBarValue === 0) {
                endGame();
            }
        }
        updateProgressBar();
    }
    function resetProgress() {
        progressBarValue = 0;
        updateProgressBar();
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

        function determineEmojiType() {
            const rand = Math.random();
            if (rand < 0.01) {
                return {
                    type: 'bonus',
                    emoji: bonusEmojis[Math.floor(Math.random() * bonusEmojis.length)]
                };
            }

            const badProbability = score < 100 ? 0.2 :
                                   score <= 1000 ? 0.2 + ((score - 100) / 900) * 0.3 :
                                   0.5;

            if (Math.random() < badProbability) {
                return {
                    type: 'bad',
                    emoji: badEmojis[Math.floor(Math.random() * badEmojis.length)]
                };
            }

            const availableGoodEmojis = goodEmojis.slice(0, Math.min(level, goodEmojis.length));
            return {
                type: 'good',
                emoji: availableGoodEmojis[Math.floor(Math.random() * availableGoodEmojis.length)]
            };
        }

        const { type, emoji: selectedEmoji } = determineEmojiType();

        emoji.innerText = selectedEmoji;
        if (type === 'bad') {
            emoji.classList.add('bad-emoji');
        } else if (type === 'bonus') {
            emoji.classList.add('bonus-emoji');
        }

        const size = Math.random() * 2 + 1;
        emoji.style.fontSize = `${size}rem`;
        playSpawnSound(size);

        const x = Math.random() * (window.innerWidth - 50);
        const y = window.innerHeight;
        emoji.style.left = `${x}px`;
        emoji.style.top = `${y}px`;

        const duration = Math.random() * 5 + 3;
        emoji.dataset.duration = duration;
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

                // Decrease score and progressbar
                updateScore(-Math.round(score * 0.1));
                decrementProgress(progressBarValue * 0.5);
            } else if (emoji.textContent === "🧨") {
                playBonusClickSound();
                // Add bonus emoji styling
                createParticles(rect.left, rect.top, false);
                emoji.remove();

                // Bonus emoji logic: explode all bad emojis without affecting score, level, or progress
                document.querySelectorAll('.bad-emoji').forEach(badEmoji => {
                    const rectBad = badEmoji.getBoundingClientRect();
                    createParticles(rectBad.left, rectBad.top, true);
                    badEmoji.remove();
                });
            } else {
                playClickSound();
                createParticles(rect.left, rect.top, false);

                // Calculate points (1-10) based on size and speed
                // size range: 1-3 (smaller = better)
                // duration range: 3-8 (shorter = better)
                const sizeScore = (3 - size) / 2; // 0 to 1
                const speedScore = (8 - duration) / 5; // 0 to 1
                const multiplier = emojiMultipliers[selectedEmoji] || 1;
                const points = Math.max(1, Math.min(10, Math.ceil((sizeScore + speedScore) * 7))) * multiplier;

                updateScore(points);
                incrementProgress(points);
            }

            // Update emoji stats
            emojiStats[selectedEmoji] = (emojiStats[selectedEmoji] || 0) + 1;

            emoji.remove();
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
        emojiStats = config.emojiStats !== undefined ? config.emojiStats : {};
        level = config.level !== undefined ? config.level : 1;
        progressBarValue = config.progressBarValue !== undefined ? config.progressBarValue : 0;
    
        // Update UI
        updateScore();
        gameOverScreen.style.display = 'none';
        resetProgress();
        if (progressIntervalID) {
            clearInterval(progressIntervalID);
        }
        progressIntervalID = setInterval(() => {
            decrementProgress();
        }, 1000);
    
        updateLevelEmojis();
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

    // Handle start button click or tap
    const handleStartButton = (e) => {
        if (e.cancelable) e.preventDefault();
        initAudio(); // Initialize audio on first interaction
        startGame();
        startScreen.style.display = 'none';
    };
    startButton.addEventListener('mousedown', handleStartButton);
    startButton.addEventListener('touchstart', handleStartButton, { passive: false });

    // Handle restart button click or tap
    const handleRestartButton = (e) => {
        if (e.cancelable) e.preventDefault();
        startGame();
    };
    restartButton.addEventListener('mousedown', handleRestartButton);
    restartButton.addEventListener('touchstart', handleRestartButton, { passive: false });
    
    // Handle restart with ad button click or tap
    const handleRestartAdButton = (e) => {
        if (e.cancelable) e.preventDefault();
        if (window.ysdk && window.ysdk.adv && typeof window.ysdk.adv.showRewardedVideo === 'function') {
            window.ysdk.adv.showRewardedVideo({
                callbacks: {
                    onOpen: () => { console.debug('Video ad open.'); },
                    onRewarded: () => {
                        console.debug('Reward granted.');
                        startGame({ score, level, progressBarValue, emojiStats});
                    },
                    onClose: () => { console.debug('Video ad closed.'); },
                    onError: (error) => { console.error('Error while opening video ad:', error); }
                }
            });
        } else {
            console.warn('Rewarded video ad not available.');
            startGame({ score, level, progressBarValue, emojiStats});
        }
    };
    restartAdButton.addEventListener('mousedown', handleRestartAdButton);
    restartAdButton.addEventListener('touchstart', handleRestartAdButton, { passive: false });

    // Handle sound toggle button click or tap
    const handleSoundButton = (e) => {
        if (e.cancelable) e.preventDefault();
        toggleSound();
    };
    soundToggleButton.addEventListener('mousedown', handleSoundButton);
    soundToggleButton.addEventListener('touchstart', handleSoundButton, { passive: false });
});