export class AudioManager {
    private audioContext: AudioContext | null = null;
    private soundEnabled: boolean = true;

    init() {
        if (!this.audioContext) {
            this.audioContext = new AudioContext();
        }
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }

    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        return this.soundEnabled;
    }

    isSoundEnabled(): boolean {
        return this.soundEnabled;
    }

    private getAudioContext(): AudioContext {
        if (!this.audioContext) {
            throw new Error('AudioContext not initialized');
        }
        return this.audioContext;
    }

    playSpawnSound(size: number) {
        const ctx = this.getAudioContext();
        if (ctx.state !== 'running' || !this.soundEnabled) return;

        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.type = 'sine';
        const baseFreq = 880;
        const freq = baseFreq / (size * 1.5);
        oscillator.frequency.setValueAtTime(freq, ctx.currentTime);

        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.05);
        gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.start();
        oscillator.stop(ctx.currentTime + 0.3);
    }

    playClickSound() {
        const ctx = this.getAudioContext();
        if (ctx.state !== 'running' || !this.soundEnabled) return;

        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(880, ctx.currentTime);

        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.02);
        gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.15);

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.start();
        oscillator.stop(ctx.currentTime + 0.15);
    }

    playBadClickSound() {
        const ctx = this.getAudioContext();
        if (ctx.state !== 'running' || !this.soundEnabled) return;
    
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
    
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(220, ctx.currentTime);
    
        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05);
        gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.2);
    
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
    
        oscillator.start();
        oscillator.stop(ctx.currentTime + 0.2);
    }
    
    playBonusClickSound() {
        const ctx = this.getAudioContext();
        if (ctx.state !== 'running' || !this.soundEnabled) return;
    
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
    
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(1320, ctx.currentTime);
    
        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.02);
        gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.15);
    
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
    
        oscillator.start();
        oscillator.stop(ctx.currentTime + 0.15);
    }
} 