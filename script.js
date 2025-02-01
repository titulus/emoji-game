document.addEventListener('DOMContentLoaded', () => {
    const emojiContainer = document.querySelector('.emoji-container');
    const scoreElement = document.getElementById('score');
    const timerElement = document.getElementById('timer');
    const gameOverScreen = document.querySelector('.game-over');
    const finalScoreElement = document.getElementById('final-score');
    const restartButton = document.getElementById('restart-button');

    const goodEmojis = ['🧑‍💻', '💻', '📊', '🛠️', '📚', '🌐', '🔍', '📈', '📄', '🔑', '🔒', '🔓'];
    const badEmojis = ['💀', '🦠', '🤬', '☠️', '💩'];
    const burstEmojis = ['🌟', '✨', '💥', '⭐', '🕸️', '🔅', '🔆'];
    
    let audioContext;
    
    let score = 0;
    let timeLeft = 15;
    let gameActive = false;
    let countdownInterval;
    let emojiStats = {};

    function initAudio() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
    }

    function playSpawnSound(size) {
        if (!audioContext || audioContext.state !== 'running') return;
        
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
        if (!audioContext || audioContext.state !== 'running') return;
        
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
        if (!audioContext || audioContext.state !== 'running') return;
        
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
            particle.innerText = '💥'; // Always use explosion for bad emojis
        } else {
            particle.innerText = burstEmojis[Math.floor(Math.random() * burstEmojis.length)];
        }
            particle.innerText = burstEmojis[Math.floor(Math.random() * burstEmojis.length)];
            
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
        
        // Add bonus time for high-scoring hits (points > 7)
        if (points > 7) {
            const bonusTime = points - 7;
            timeLeft += bonusTime;
            timerElement.textContent = timeLeft;
        }
    }

    function updateTimer() {
        timerElement.textContent = timeLeft;
        if (timeLeft <= 0) {
            endGame();
        } else {
            timeLeft--;
        }
    }

    function spawnEmoji() {
        if (!gameActive) return;

        const emoji = document.createElement('div');
        emoji.classList.add('emoji');
        
        // 40% chance to spawn a bad emoji
        const isBadEmoji = Math.random() < 0.4;
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

        emoji.addEventListener('click', (e) => {
            if (!gameActive) return;
            
            initAudio(); // Initialize audio on first interaction
            const rect = emoji.getBoundingClientRect();
            
            if (emoji.classList.contains('bad-emoji')) {
                playBadClickSound();
                // Negative effects for bad emojis
                createParticles(rect.left, rect.top, true);
                emoji.classList.add('burst-bad');
                
                // Decrease score and time
                updateScore(-1);
                timeLeft = Math.max(1, timeLeft - 1); // Prevent time from going below 1
                timerElement.textContent = timeLeft;
                
                // Update emoji stats
                emojiStats[selectedEmoji] = (emojiStats[selectedEmoji] || 0) + 1;
            } else {
                // Regular emoji handling
                playClickSound();
                createParticles(rect.left, rect.top, false);
                emoji.classList.add('burst');
                
                // Calculate points (1-10) based on size and speed
                // size range: 1-3 (smaller = better)
                // duration range: 3-8 (shorter = better)
                const sizeScore = (3 - size) / 2; // 0 to 1
                const speedScore = (8 - duration) / 5; // 0 to 1
                const points = Math.max(1, Math.min(10, Math.ceil((sizeScore + speedScore) * 7)));
                
                // Update emoji stats
                emojiStats[selectedEmoji] = (emojiStats[selectedEmoji] || 0) + 1;
                
                updateScore(points);
            }
            
            setTimeout(() => emoji.remove(), 500);
        });

        emojiContainer.appendChild(emoji);

        setTimeout(() => {
            if (emoji.parentElement) {
                emoji.remove();
            }
        }, duration * 1000);
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


    function startGame() {
        // Reset game state
        score = 0;
        timeLeft = 15;
        gameActive = true;
        emojiStats = {};
        
        // Update UI
        updateScore(0);
        updateTimer();
        gameOverScreen.style.display = 'none';
        
        // Start game loops
        countdownInterval = setInterval(updateTimer, 1000);
        scheduleNextEmoji();
    }

    function endGame() {
        gameActive = false;
        clearInterval(countdownInterval);
        
        // Clear all existing emojis
        const emojis = document.querySelectorAll('.emoji');
        emojis.forEach(emoji => emoji.remove());
        
        // Show game over screen with stats
        finalScoreElement.textContent = score;
        gameOverScreen.style.display = 'flex';
    }

    // Event Listeners
    restartButton.addEventListener('click', startGame);

    // Start the game
    startGame();
});