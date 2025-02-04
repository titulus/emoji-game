document.addEventListener('DOMContentLoaded', () => {
    // UI Elements
    const scoreElement = document.getElementById('score');
    const timerElement = document.getElementById('timer');
    const gameOverScreen = document.querySelector('.game-over');
    const finalScoreElement = document.getElementById('final-score');
    const restartButton = document.getElementById('restart-button');
    const restartAdButton = document.getElementById('restart-ad-button');
    const soundToggleButton = document.getElementById('sound-toggle');
    const startScreen = document.getElementById('start-screen');
    const startButton = document.getElementById('start-button');

    let audioContext;
    let score = 0;
    let timeLeft = 30;
    let gameActive = false;
    let countdownInterval;
    let isPaused = false;
    let soundEnabled = true;

    // Pause the game
    function pauseGame() {
        if (!isPaused && gameActive) {
            isPaused = true;
            gameActive = false;
            clearInterval(countdownInterval);
            if (window.ysdk) window.ysdk.features.GameplayAPI?.stop();
        }
    }

    // Resume the game
    function resumeGame() {
        if (isPaused && !gameOverScreen.style.display.includes('flex')) {
            isPaused = false;
            gameActive = true;
            countdownInterval = setInterval(updateTimer, 1000);
            if (window.ysdk) window.ysdk.features.GameplayAPI?.start();
        }
    }

    // Initialize audio system
    function initAudio() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
    }

    // Toggle sound on/off
    function toggleSound() {
        soundEnabled = !soundEnabled;
        soundToggleButton.textContent = soundEnabled ? '🔊' : '🔇';
    }

    // Update score UI
    function updateScore(newScore) {
        score = newScore;
        scoreElement.textContent = score;
    }

    // Update timer UI
    function updateTimer() {
        timerElement.textContent = timeLeft;
        if (timeLeft <= 0) {
            endGame();
        } else {
            timeLeft--;
        }
    }

    // Start the game: Initialize template game settings
    function startGame(config = {}) {
        score = config.score !== undefined ? config.score : 0;
        timeLeft = config.timeLeft !== undefined ? config.timeLeft : 30;
        gameActive = true;
        isPaused = false;
        updateScore(score);
        updateTimer();
        gameOverScreen.style.display = 'none';
        
        // Start the game timer
        countdownInterval = setInterval(updateTimer, 1000);
        
        // Placeholder for game-specific initialization logic
        // Developers can implement custom gameplay logic here
        
        if (window.ysdk) window.ysdk.features.GameplayAPI?.start();
    }

    // End the game and display final score
    function endGame() {
        gameActive = false;
        clearInterval(countdownInterval);
        finalScoreElement.textContent = score;
        gameOverScreen.style.display = 'flex';
        if (window.ysdk) {
            window.ysdk.features.GameplayAPI?.stop();
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

    // Handle visibility changes to pause/resume game
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            pauseGame();
        } else {
            resumeGame();
        }
    });
    window.addEventListener('blur', pauseGame);
    window.addEventListener('focus', resumeGame);

    // Handle start button click
    const handleStartButton = (e) => {
        if (e.cancelable) e.preventDefault();
        initAudio();
        startGame();
        startScreen.style.display = 'none';
    };
    startButton.addEventListener('mousedown', handleStartButton);
    startButton.addEventListener('touchstart', handleStartButton, { passive: false });

    // Restart game on restart button click
    restartButton.addEventListener('mousedown', (e) => {
        if (e.cancelable) e.preventDefault();
        startGame();
    });
    restartButton.addEventListener('touchstart', (e) => {
        if (e.cancelable) e.preventDefault();
        startGame();
    });

    // Restart game with ad on restart ad button click
    const handleRestartAd = (e) => {
        if (e.cancelable) e.preventDefault();
        if (window.ysdk && window.ysdk.adv && typeof window.ysdk.adv.showRewardedVideo === 'function') {
            window.ysdk.adv.showRewardedVideo({
                callbacks: {
                    onOpen: () => { console.debug('Video ad open.'); },
                    onRewarded: () => { console.debug('Reward granted.'); startGame({ timeLeft: 60 }); },
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

    // Handle sound toggle button click
    soundToggleButton.addEventListener('mousedown', (e) => {
        if (e.cancelable) e.preventDefault();
        toggleSound();
    });
    soundToggleButton.addEventListener('touchstart', (e) => {
        if (e.cancelable) e.preventDefault();
        toggleSound();
    });
});