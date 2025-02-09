import { AudioManager } from './audio';
import { SDKManager } from './sdk';
import { UIManager } from './ui';

interface HTMLDivElement extends Element {
    removalTarget?: number;
    removalRemaining?: number;
    style: CSSStyleDeclaration;
    dataset: DOMStringMap;
    innerText: string;
}

document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const emojiContainer = document.querySelector('.emoji-container') as HTMLDivElement;
    const scoreElement = document.getElementById('score') as HTMLSpanElement;
    const gameOverScreen = document.querySelector('.game-over') as HTMLDivElement;
    const finalScoreElement = document.getElementById('final-score') as HTMLSpanElement;
    const restartButton = document.getElementById('restart-button') as HTMLButtonElement;
    const restartAdButton = document.getElementById('restart-ad-button') as HTMLButtonElement;
    const soundToggleButton = document.getElementById('sound-toggle') as HTMLButtonElement;
    const startScreen = document.getElementById('start-screen') as HTMLDivElement;
    const startButton = document.getElementById('start-button') as HTMLButtonElement;
    const progressBar = document.getElementById('progress-bar') as HTMLDivElement;
    const currentEmojiElement = document.getElementById('current-emoji') as HTMLSpanElement;
    const nextEmojiElement = document.getElementById('next-emoji') as HTMLSpanElement;

    const goodEmojis: string[] = [
        '🍓', '🍎', '🍑', '🥭', '🍊', '🍍', '🍌', '🍋', '🍐', '🍏', '🥝', '🥑', '🍈', '🥥', '🍇',
        '🍅', '🌶️', '🥕', '🌽', '🥔', '🧄', '🧅', '🥬', '🥦', '🥒', '🍆',
        '🌹', '🌺', '🌻', '💐', '🌼', '🌷',
        '🏆'
    ];
    const badEmojis: string[] = ['💀', '☠️', '💩'];
    const bonusEmojis: string[] = ['🧨', '📦'];
    const particles: string[] = ['🌟', '✨', '⭐', '🔅', '🔆'];

    function generateFibonacciSequence(length: number): number[] {
        const sequence = [1, 1];
        for (let i = 2; i < length; i++) {
            sequence.push(sequence[i - 1] + sequence[i - 2]);
        }
        return sequence;
    }
    const emojiMultipliers: { [key: string]: number } = {};
    const fibonacciSequence = generateFibonacciSequence(goodEmojis.length);
    goodEmojis.forEach((emoji, index) => {
        emojiMultipliers[emoji] = fibonacciSequence[index];
    });

    // Game variables
    const audioManager = new AudioManager();
    const sdkManager = new SDKManager();
    const uiManager = new UIManager();
    let score: number = 0;
    let gameActive: boolean = false;
    let emojiRemovalIntervalID: number;
    let emojiStats: { [key: string]: number } = {};
    let isPaused: boolean = false;
    let progressBarValue: number = 0;
    let progressIntervalID: number;
    let level: number = 1;

    // Update level emojis display in the UI
    function updateLevelEmojis() {
        const currentIndex = (level - 1) < goodEmojis.length ? (level - 1) : goodEmojis.length - 1;
        let nextIndex: number;
        if (level < goodEmojis.length) {
            nextIndex = level;
        } else {
            nextIndex = currentIndex;
        }
        uiManager.updateLevelEmojis(goodEmojis[currentIndex], goodEmojis[nextIndex]);
    }

    function pauseGame() {
        if (!isPaused && gameActive) {
            isPaused = true;
            gameActive = false;
            clearInterval(emojiRemovalIntervalID);
            clearInterval(progressIntervalID);
            document.querySelectorAll<HTMLDivElement>('.emoji').forEach(emoji => {
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
            sdkManager.stopGameplay();
        }
    }
    
    function resumeGame() {
        if (isPaused && !uiManager.isGameOverVisible()) {
            isPaused = false;
            gameActive = true;
            document.querySelectorAll<HTMLDivElement>('.emoji').forEach(emoji => {
                emoji.style.animationPlayState = 'running';
                const duration = parseFloat(emoji.dataset.duration || '0');
                if (duration) {
                    const fullDurationMs = duration * 1000;
                    const currentTop = emoji.getBoundingClientRect().top;
                    const remainingTime = (currentTop / window.innerHeight) * fullDurationMs;
                    emoji.removalTarget = Date.now() + remainingTime;
                }
            });
            emojiRemovalIntervalID = setInterval(checkEmojiRemovals, 100) as unknown as number; // Set a new interval
            progressIntervalID = setInterval(() => {
                decrementProgress();
            }, 1000) as unknown as number; // Restart progress interval
            scheduleNextEmoji();
            sdkManager.startGameplay();
        }
    }

    function toggleSound() {
        const isEnabled = audioManager.toggleSound();
        uiManager.updateSoundButton(isEnabled);
    }

    function createParticles(x: number, y: number, isBad: boolean = false) {
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

    function updateScore(points: number = 0) {
        score += points;
        if (score < 0) {
            score = 0;
        }
        uiManager.updateScore(score);
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
    
    function createLevelParticles(x: number, y: number, emoji: string) {
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
        uiManager.updateProgressBar(progressBarValue, level, goodEmojis.length);
    }
    
    function incrementProgress(value: number = 1) {
        const currentEmojiCost = emojiMultipliers[goodEmojis[level - 1]] || 1;
        const adjustedValue = value / currentEmojiCost;
        if (level < goodEmojis.length) {
            progressBarValue = Math.min(progressBarValue + adjustedValue, 100);
            updateProgressBar();
            if (progressBarValue === 100) {
                level++;
                resetProgress(10);
                updateLevelEmojis();
                showLevelTransition();
            }
        } else {
            // Final level reached: lock progress bar at 100%.
            progressBarValue = 100;
            updateProgressBar();
        }
    }
    function decrementProgress(value: number = 1) {
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
    function resetProgress(value: number = 0) {
        progressBarValue = value;
        updateProgressBar();
    }

    // Global checker for auto-removal of emojis using removalTarget timestamps
    function checkEmojiRemovals() {
        // Only check removals when not paused
        if (isPaused) return;
        const now = Date.now();
        document.querySelectorAll<HTMLDivElement>('.emoji').forEach(emoji => {
            if (emoji.removalTarget && now >= emoji.removalTarget) {
                emoji.remove();
            }
        });
    }

    function spawnEmoji() {
        if (!gameActive) return;

        const emoji = document.createElement('div') as HTMLDivElement;
        emoji.classList.add('emoji');

        function determineEmojiType() {
            const rand = Math.random();
            if (rand < 0.01) {
                return {
                    type: 'bonus',
                    emoji: bonusEmojis[Math.floor(Math.random() * bonusEmojis.length)]
                };
            }

            const badProbability = 0.1 + (level - 1) * (0.5 / (goodEmojis.length - 1));

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
        audioManager.playSpawnSound(size);

        const x = Math.random() * (window.innerWidth - 50);
        const y = window.innerHeight;
        emoji.style.left = `${x}px`;
        emoji.style.top = `${y}px`;

        const duration = Math.random() * 5 + 3;
        emoji.dataset.duration = duration.toString();
        emoji.style.animationDuration = `${duration}s`;
         
        // Set removal target based on spawn duration
        emoji.removalTarget = Date.now() + duration * 1000;

        const handleEmojiInteraction = (e: Event) => {
            if (!gameActive) return;
            if (e.cancelable) {
                e.preventDefault();
            }
        
            const rect = emoji.getBoundingClientRect();
        
            if (emoji.classList.contains('bad-emoji')) {
                audioManager.playBadClickSound();
                // Negative effects for bad emojis
                createParticles(rect.left, rect.top, true);
                // Decrease score and progressbar
                updateScore(-Math.round(score * 0.1));
                decrementProgress(progressBarValue * 0.5);
            } else if (emoji.textContent === "🧨" || emoji.textContent === "📦") {
                audioManager.playBonusClickSound();
                // Add bonus emoji styling
                createParticles(rect.left, rect.top, false);
                emoji.remove();
        
                if (emoji.textContent === "📦") {
                    // Temporarily increase spawn frequency
                    setTemporarySpawnDelay();
                    setTimeout(resetSpawnDelay, 1000);
                } else if (emoji.textContent === "🧨") {
                    // Bonus emoji logic: explode all bad emojis without affecting score, level, or progress
                    document.querySelectorAll<HTMLDivElement>('.bad-emoji').forEach(badEmoji => {
                        const rectBad = badEmoji.getBoundingClientRect();
                        createParticles(rectBad.left, rectBad.top, true);
                        badEmoji.remove();
                    });
                }
            } else {
                audioManager.playClickSound();
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

    let temporarySpawnDelay: boolean = false;
    
    function scheduleNextEmoji() {
        if (!gameActive) return;
        const delay = temporarySpawnDelay ? 10 : calculateSpawnDelay();
        setTimeout(() => {
            spawnEmoji();
            scheduleNextEmoji();
        }, delay);
    }
    
    function setTemporarySpawnDelay() {
        temporarySpawnDelay = true;
    }
    
    function resetSpawnDelay() {
        temporarySpawnDelay = false;
    }

    function startGame(config: any = {}) {
        // Reset game state
        score = config.score !== undefined ? config.score : 0;
        gameActive = true;
        emojiStats = config.emojiStats !== undefined ? config.emojiStats : {};
        level = config.level !== undefined ? config.level : 1;
        progressBarValue = config.progressBarValue !== undefined ? config.progressBarValue : 0;
    
        // Update UI
        updateScore();
        uiManager.hideGameOver();
        resetProgress();
        if (progressIntervalID) {
            clearInterval(progressIntervalID);
        }
        progressIntervalID = setInterval(() => {
            decrementProgress();
        }, 1000) as unknown as number;
    
        updateLevelEmojis();
        // Start game loops
        scheduleNextEmoji();
        emojiRemovalIntervalID = setInterval(checkEmojiRemovals, 100) as unknown as number;
    
        sdkManager.startGameplay();
    }

    function endGame() {
        gameActive = false;
        clearInterval(emojiRemovalIntervalID);

        const emojis = document.querySelectorAll<HTMLDivElement>('.emoji');
        emojis.forEach(emoji => emoji.remove());
    
        uiManager.updateFinalScore(score);
        uiManager.showGameOver();
    
        sdkManager.stopGameplay();
        sdkManager.submitScore(score);
    }

    document.addEventListener('selectstart', (e) => {
        e.preventDefault();
    });

    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });

    // Pause and resume game on visibility change
    uiManager.setupWindowEvents(pauseGame, resumeGame);

    // Handle start button click or tap
    const handleStartButton = (e: Event) => {
        if (e.cancelable) e.preventDefault();
        audioManager.init(); // Initialize audio on first interaction
        startGame();
        uiManager.hideStartScreen();
    };

    // Handle restart button click or tap
    const handleRestartButton = (e: Event) => {
        if (e.cancelable) e.preventDefault();
        startGame();
    };
    
    // Handle restart with ad button click or tap
    const handleRestartAdButton = (e: Event) => {
        if (e.cancelable) e.preventDefault();
        
        const showAdResult = sdkManager.showRewardedVideo({
            onOpen: () => { console.debug('Video ad open.'); },
            onRewarded: () => {
                console.debug('Reward granted.');
                startGame({ score, level, progressBarValue, emojiStats});
            },
            onClose: () => { console.debug('Video ad closed.'); },
            onError: (error) => { console.error('Error while opening video ad:', error); }
        });

        if (!showAdResult) {
            console.warn('Rewarded video ad not available.');
            startGame({ score, level, progressBarValue, emojiStats});
        }
    };

    // Handle sound toggle button click or tap
    const handleSoundButton = (e: Event) => {
        if (e.cancelable) e.preventDefault();
        toggleSound();
    };

    uiManager.onStartButtonClick(handleStartButton);
    uiManager.onRestartButtonClick(handleRestartButton);
    uiManager.onRestartAdButtonClick(handleRestartAdButton);
    uiManager.onSoundButtonClick(handleSoundButton);
});