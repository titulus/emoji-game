import { AudioManager } from './audio';
import { SDKManager } from './sdk';
import { UIManager } from './ui';

interface HTMLDivElement extends Element {
    style: CSSStyleDeclaration;
    dataset: DOMStringMap;
    innerText: string;
}

document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const emojiContainer = document.querySelector('.emoji-container') as HTMLDivElement;

    const goodEmojis: string[] = [
        '🐷', '🐖', '🐽', '🦩', '🪱', '🦑', '🦀', '🦞', '🦐', '🐙' , 
        '🐥', '🐤', '🐣', '🐡', '🐆', '🦘', '🐪', '🐫', '🐕', '🦧', '🦁', '🐯', '🐶', '🐹', '🦊', '🐅', '🐝', 
        '🐂', '🐎', '🐒', '🦣', '🦬', '🐻', '🐵', '🦅', '🦉', '🐿️','🦌', '🦒', '🦔', 
        '🐸', '🪲', '🐢', '🐍', '🦎', '🐛', '🐊', '🦚',
        '🐠', '🐬', '🐋', '🐳', '🐟',
        '🐇', '🐁', '🦙', '🐏', '🐑', '🐭', '🐨', '🐩', '🐘', '🐀', '🦏', '🐃', '🦍', '🦨', '🦡', 
        '🍓', '🍎', '🍒', '🍅', '🌶️',
        '💐', '🌷', '🌸', '🌺', '🌸', '🌺',
        '🍑', '🥭', '🍊', '🥕', '🍂',
        '🍍', '🍌', '🍋', '🌽', '🌻', '🌾', '🌾',
        '🍐', '🍏', '🥝', '🥑', '🥬', '🥦', '🥒', '🌿', '🍀', '🍃', '🌳', '🌲',
        '🥥', '🥔', '🧄', '🧅',
        '🫐', '🍇', '🍆', '🪻',
        '🐰', '🐼', '🐮', '🐔', '🐧', '🦓', '🐏', '🐑',
        '🧛‍♀️', '🧛‍♂️', '👿', '😈', '🤖',
        '🧟‍♀️', '🧟‍♂️', '🐉',
        '🧞‍♀️', '🧞‍♂️', '🧞', '🦸‍♀️', '🦸‍♂️',
        '👻', '🦄',
        '🦹‍♀️', '🦹‍♂️', '🧚', '🧚‍♀️', '🧚‍♂️',
        '🎈', '🏮', '🍷', '🔖', '📌', '📍',
        '💼', '🚪', '🧺', '🍺', '🥨',
        '🔑', '🧽', '🥂', '📝',
        '🎏', '📱', '💻', '🖥️', '🛋️', '🛏️',
        '🏆'
    ];
    const badEmojis: string[] = ['💀', '☠️', '💩'];
    const bonusEmojis: string[] = ['🧨', '📦', '🚀', '🐌'];
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
    let gameStarted: boolean = false;
    let emojiStats: { [key: string]: number } = {};
    let isSuspended: boolean = false;
    let isPaused: boolean = false;
    let isFullScreenAdShowing: boolean = false;
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
        largeEmoji.innerText = isSpeedLevel(level) ? '🚀' : (isSlowLevel(level) ? '🐌' : goodEmojis[level - 1]);
    
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
                const nextLevel = level + 1;
                if (isBonusLevel(nextLevel)) {
                    showFullscreenAd(() => {
                        level = nextLevel;
                        resetProgress(10);
                        updateLevelEmojis();
                        showLevelTransition();
                    });
                } else {
                    level = nextLevel;
                    resetProgress(10);
                    updateLevelEmojis();
                    showLevelTransition();
                }
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
        
    function handleBadEmojiInteraction(rect: DOMRect) {
        audioManager.playBadClickSound();
        // Negative effects for bad emojis
        createParticles(rect.left, rect.top, true);
        // Decrease score and progressbar
        updateScore(-Math.round(score * 0.1));
        decrementProgress(progressBarValue * 0.5);
    }
    
    function handleBonusEmojiInteraction(rect: DOMRect, emojiType: string) {
        audioManager.playBonusClickSound();
        // Add bonus emoji styling
        createParticles(rect.left, rect.top, false);
    
        if (emojiType === "📦") {
            // Temporarily increase spawn frequency
            setTemporarySpawnDelay();
            setTimeout(resetSpawnDelay, 1000);
        } else if (emojiType === "🧨") {
            // Bonus emoji logic: explode all bad emojis without affecting score, level, or progress
            document.querySelectorAll<HTMLDivElement>('.bad-emoji').forEach(badEmoji => {
                const rectBad = badEmoji.getBoundingClientRect();
                createParticles(rectBad.left, rectBad.top, true);
                badEmoji.remove();
            });
        } else if (emojiType === "🚀") {
            setTemporarySpeed(true);
            setTimeout(() => setTemporarySpeed(false), 5000);
        } else if (emojiType === "🐌") {
            setTemporarySlow(true);
            setTimeout(() => setTemporarySlow(false), 5000);
        }
    }
    
    function handleGoodEmojiInteraction(rect: DOMRect, selectedEmoji: string, size: number, duration: number) {
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

    function spawnEmoji() {
        if (!isGameRunning()) return;

        const emoji = document.createElement('div') as HTMLDivElement;
        emoji.classList.add('emoji');

        function determineEmoji() {
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
    
            let availableGoodEmojis: string[];
            if (level < 20) {
                availableGoodEmojis = goodEmojis.slice(0, Math.min(level, goodEmojis.length));
            } else {
                availableGoodEmojis = goodEmojis.slice(Math.max(0, level - 20), level);
            }
            return {
                type: 'good',
                emoji: availableGoodEmojis[Math.floor(Math.random() * availableGoodEmojis.length)]
            };
        }

        const { type, emoji: selectedEmoji } = determineEmoji();

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
        const speedMultiplier = Math.pow(1.02, level - 1);
        emoji.style.animationDuration = `${temporarySpeed ? duration / (2 * speedMultiplier) : (temporarySlow ? duration * 2 * speedMultiplier : (isSpeedLevel(level) ? duration / (2 * speedMultiplier) : (isSlowLevel(level) ? duration * 2 * speedMultiplier : duration / speedMultiplier))) }s`;

         
        const handleEmojiInteraction = (e: Event) => {
            if (!isGameRunning()) return;
            if (e.cancelable) {
                e.preventDefault();
            }
        
            const rect = emoji.getBoundingClientRect();
        
            switch (emoji.textContent) {
                case "💀":
                case "☠️":
                case "💩":
                    handleBadEmojiInteraction(rect);
                    break;
                case "🧨":
                case "📦":
                case "🚀":
                case "🐌":
                    handleBonusEmojiInteraction(rect, emoji.textContent);
                    break;
                default:
                    handleGoodEmojiInteraction(rect, selectedEmoji, size, duration);
                    break;
            }
        
            // Update emoji stats
            emojiStats[selectedEmoji] = (emojiStats[selectedEmoji] || 0) + 1;
        
            emoji.remove();
        };

        emoji.addEventListener('mousedown', handleEmojiInteraction);
        emoji.addEventListener('touchstart', handleEmojiInteraction, { passive: false });

        emojiContainer.appendChild(emoji);

        // Remove emoji when it reaches the top of the screen
        emoji.addEventListener('animationend', () => {
            emoji.remove();
        });
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
        if (!isGameRunning()) return;
        const delay = temporarySpeed ? (temporarySpawnDelay ? 5 : calculateSpawnDelay() / 2) : (temporarySlow ? (temporarySpawnDelay ? 20 : calculateSpawnDelay() * 2) : (isSpeedLevel(level) ? (temporarySpawnDelay ? 5 : calculateSpawnDelay() / 2) : (isSlowLevel(level) ? (temporarySpawnDelay ? 20 : calculateSpawnDelay() * 2) : (temporarySpawnDelay ? 10 : calculateSpawnDelay()))));
        setTimeout(() => {
            spawnEmoji();
            scheduleNextEmoji();
        }, delay);
    }
    
    function setTemporarySpawnDelay() {
        temporarySpawnDelay = true;
    }
    
    function isSpeedLevel(level: number): boolean {
        return level % 10 === 5;
    }
    
    function isSlowLevel(level: number): boolean {
        return level % 10 === 0;
    }
    
    let temporarySpeed: boolean = false;
    let temporarySlow: boolean = false;
    
    function setTemporarySpeed(value: boolean) {
        temporarySpeed = value;
    }
    
    function setTemporarySlow(value: boolean) {
        temporarySlow = value;
    }
    
    function resetSpawnDelay() {
        temporarySpawnDelay = false;
    }

    function isGameRunning(): boolean {
        return gameStarted && !isPaused && !isSuspended && !isFullScreenAdShowing;
    }

    function runGame() {
        if (!isGameRunning()) return;
        document.querySelectorAll<HTMLDivElement>('.emoji').forEach(emoji => {
            emoji.style.animationPlayState = 'running';
        });
        progressIntervalID = setInterval(() => {
            decrementProgress();
        }, 1000) as unknown as number;
        scheduleNextEmoji();
        sdkManager.startGameplay();
    }

    function holdGame() {
        clearInterval(progressIntervalID);
        document.querySelectorAll<HTMLDivElement>('.emoji').forEach(emoji => {
            emoji.style.animationPlayState = 'paused';
        });
        sdkManager.stopGameplay();
    }

    function suspendGame() {
        if (!isSuspended) {
            isSuspended = true;
            holdGame();
        }
    }
    
    function restoreGame() {
        if (isSuspended) {
            isSuspended = false;
            runGame();
        }
    }

    function pauseGame() {
        if (!isPaused) {
            isPaused = true;
            holdGame();
        }
    }

    function resumeGame() {
        if (isPaused) {
            isPaused = false;
            runGame();
        }
    }

    function startGame(config: any = {}) {
        // Reset game state
        score = config.score !== undefined ? config.score : 0;
        gameStarted = true;
        emojiStats = config.emojiStats !== undefined ? config.emojiStats : {};
        level = config.level !== undefined ? config.level : 1;
        progressBarValue = config.progressBarValue !== undefined ? config.progressBarValue : 0;
    
        // Update UI
        updateScore();
        uiManager.hideGameOver();
        resetProgress();
        updateLevelEmojis();

        if (progressIntervalID) {
            clearInterval(progressIntervalID);
        }
        runGame();
    }

    function endGame() {
        gameStarted = false;
        holdGame();

        const emojis = document.querySelectorAll<HTMLDivElement>('.emoji');
        emojis.forEach(emoji => emoji.remove());
    
        uiManager.updateFinalScore(score);
        uiManager.showGameOver();
        sdkManager.submitScore(score);
    }

    // Pause and resume game on visibility change
    uiManager.setupWindowEvents(suspendGame, restoreGame);

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

    // Handle pause button click or tap
    const handlePauseButton = (e: Event) => {
        if (e.cancelable) e.preventDefault();
        if (isGameRunning()) {
            pauseGame();
            uiManager.showPauseMenu();
        }
    };

    // Handle resume button click or tap
    const handleResumeButton = (e: Event) => {
        if (e.cancelable) e.preventDefault();
        if (isPaused) {
            uiManager.hidePauseMenu();
            resumeGame();
        }
    };

    function showFullscreenAd(onComplete?: () => void) {
        if (!isGameRunning()) return;
        
        isFullScreenAdShowing = true;
        holdGame();
        
        const showAdResult = sdkManager.showFullscreenAdv({
            onOpen: () => {
                console.debug('Fullscreen ad opened');
            },
            onClose: (wasShown) => {
                console.debug('Fullscreen ad closed, wasShown:', wasShown);
                isFullScreenAdShowing = false;
                if (onComplete) {
                    onComplete();
                }
                runGame();
            },
            onError: (error) => {
                console.error('Fullscreen ad error:', error);
                isFullScreenAdShowing = false;
                if (onComplete) {
                    onComplete();
                }
                runGame();
            }
        });

        if (!showAdResult) {
            console.warn('Fullscreen ad not available.');
            isFullScreenAdShowing = false;
            if (onComplete) {
                onComplete();
            }
            runGame();
        }
    }

    function isBonusLevel(level: number): boolean {
        return isSpeedLevel(level) || isSlowLevel(level);
    }

    uiManager.onStartButtonClick(handleStartButton);
    uiManager.onRestartButtonClick(handleRestartButton);
    uiManager.onRestartAdButtonClick(handleRestartAdButton);
    uiManager.onSoundButtonClick(handleSoundButton);
    uiManager.onPauseButtonClick(handlePauseButton);
    uiManager.onResumeButtonClick(handleResumeButton);

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('Service Worker registered with scope:', registration.scope);
            })
            .catch(error => {
                console.error('Service Worker registration failed:', error);
            });
    }
    });