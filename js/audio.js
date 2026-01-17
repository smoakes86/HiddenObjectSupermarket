// Audio system using Web Audio API for generated sounds

const Audio = {
    context: null,
    enabled: true,

    init() {
        try {
            this.context = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('Web Audio API not supported');
            this.enabled = false;
        }
    },

    resume() {
        if (this.context && this.context.state === 'suspended') {
            this.context.resume();
        }
    },

    // Play a success/collect sound
    playCollect() {
        if (!this.enabled || !this.context) return;
        this.resume();

        const oscillator = this.context.createOscillator();
        const gainNode = this.context.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.context.destination);

        oscillator.type = 'sine';

        // Rising arpeggio
        const now = this.context.currentTime;
        oscillator.frequency.setValueAtTime(523, now); // C5
        oscillator.frequency.setValueAtTime(659, now + 0.08); // E5
        oscillator.frequency.setValueAtTime(784, now + 0.16); // G5

        gainNode.gain.setValueAtTime(0.3, now);
        gainNode.gain.exponentialDecayTo = 0.01;
        gainNode.gain.setValueAtTime(0.3, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

        oscillator.start(now);
        oscillator.stop(now + 0.3);
    },

    // Play a wrong/error sound
    playWrong() {
        if (!this.enabled || !this.context) return;
        this.resume();

        const oscillator = this.context.createOscillator();
        const gainNode = this.context.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.context.destination);

        oscillator.type = 'square';

        const now = this.context.currentTime;
        oscillator.frequency.setValueAtTime(200, now);
        oscillator.frequency.setValueAtTime(150, now + 0.1);

        gainNode.gain.setValueAtTime(0.15, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

        oscillator.start(now);
        oscillator.stop(now + 0.2);
    },

    // Play level complete fanfare
    playLevelComplete() {
        if (!this.enabled || !this.context) return;
        this.resume();

        const notes = [523, 587, 659, 698, 784, 880, 988, 1047]; // C major scale
        const now = this.context.currentTime;

        notes.forEach((freq, i) => {
            const oscillator = this.context.createOscillator();
            const gainNode = this.context.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.context.destination);

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(freq, now + i * 0.08);

            gainNode.gain.setValueAtTime(0, now + i * 0.08);
            gainNode.gain.linearRampToValueAtTime(0.2, now + i * 0.08 + 0.02);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + i * 0.08 + 0.3);

            oscillator.start(now + i * 0.08);
            oscillator.stop(now + i * 0.08 + 0.35);
        });
    },

    // Play button click
    playClick() {
        if (!this.enabled || !this.context) return;
        this.resume();

        const oscillator = this.context.createOscillator();
        const gainNode = this.context.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.context.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(800, this.context.currentTime);

        gainNode.gain.setValueAtTime(0.2, this.context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.1);

        oscillator.start();
        oscillator.stop(this.context.currentTime + 0.1);
    }
};

// Initialize audio on first user interaction
document.addEventListener('click', () => {
    if (!Audio.context) {
        Audio.init();
    }
    Audio.resume();
}, { once: true });

document.addEventListener('touchstart', () => {
    if (!Audio.context) {
        Audio.init();
    }
    Audio.resume();
}, { once: true });
