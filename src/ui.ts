export class UIManager {
    private scoreElement: HTMLSpanElement;
    private finalScoreElement: HTMLSpanElement;
    private gameOverScreen: HTMLDivElement;
    private restartButton: HTMLButtonElement;
    private restartAdButton: HTMLButtonElement;
    private soundToggleButton: HTMLButtonElement;
    private startScreen: HTMLDivElement;
    private startButton: HTMLButtonElement;
    private progressBar: HTMLDivElement;
    private currentEmojiElement: HTMLSpanElement;
    private nextEmojiElement: HTMLSpanElement;

    constructor() {
        this.scoreElement = document.getElementById('score') as HTMLSpanElement;
        this.finalScoreElement = document.getElementById('final-score') as HTMLSpanElement;
        this.gameOverScreen = document.querySelector('.game-over') as HTMLDivElement;
        this.restartButton = document.getElementById('restart-button') as HTMLButtonElement;
        this.restartAdButton = document.getElementById('restart-ad-button') as HTMLButtonElement;
        this.soundToggleButton = document.getElementById('sound-toggle') as HTMLButtonElement;
        this.startScreen = document.getElementById('start-screen') as HTMLDivElement;
        this.startButton = document.getElementById('start-button') as HTMLButtonElement;
        this.progressBar = document.getElementById('progress-bar') as HTMLDivElement;
        this.currentEmojiElement = document.getElementById('current-emoji') as HTMLSpanElement;
        this.nextEmojiElement = document.getElementById('next-emoji') as HTMLSpanElement;
    }

    updateScore(score: number) {
        this.scoreElement.textContent = score.toString();
    }

    updateFinalScore(score: number) {
        this.finalScoreElement.textContent = score.toString();
    }

    showGameOver() {
        this.gameOverScreen.style.display = 'flex';
    }

    hideGameOver() {
        this.gameOverScreen.style.display = 'none';
    }

    isGameOverVisible(): boolean {
        return this.gameOverScreen.style.display.includes('flex');
    }

    hideStartScreen() {
        this.startScreen.style.display = 'none';
    }

    updateProgressBar(value: number, level: number, maxLevel: number) {
        if (level >= maxLevel) {
            this.progressBar.style.width = '100%';
            this.progressBar.style.setProperty('background', 'white', 'important');
        } else {
            this.progressBar.style.width = value + '%';
            this.progressBar.style.backgroundColor = '';
        }
    }

    updateLevelEmojis(currentEmoji: string, nextEmoji: string) {
        this.currentEmojiElement.textContent = currentEmoji;
        this.nextEmojiElement.textContent = nextEmoji;
        this.restartAdButton.textContent = '📺→' + currentEmoji;
    }

    updateSoundButton(isEnabled: boolean) {
        this.soundToggleButton.textContent = isEnabled ? '🔊' : '🔇';
    }

    onStartButtonClick(handler: (e: Event) => void) {
        this.startButton.addEventListener('mousedown', handler);
        this.startButton.addEventListener('touchstart', handler, { passive: false });
    }

    onRestartButtonClick(handler: (e: Event) => void) {
        this.restartButton.addEventListener('mousedown', handler);
        this.restartButton.addEventListener('touchstart', handler, { passive: false });
    }

    onRestartAdButtonClick(handler: (e: Event) => void) {
        this.restartAdButton.addEventListener('mousedown', handler);
        this.restartAdButton.addEventListener('touchstart', handler, { passive: false });
    }

    onSoundButtonClick(handler: (e: Event) => void) {
        this.soundToggleButton.addEventListener('mousedown', handler);
        this.soundToggleButton.addEventListener('touchstart', handler, { passive: false });
    }
} 