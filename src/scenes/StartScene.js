export default class StartScene extends Phaser.Scene {
    constructor() {
        super('StartScene');
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Background gradient
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x1a1a2e, 0x1a1a2e, 0x16213e, 0x16213e, 1);
        bg.fillRect(0, 0, width, height);

        // Title
        this.add.text(width / 2, height * 0.25, 'HIDDEN OBJECT', {
            fontFamily: 'Segoe UI, Arial, sans-serif',
            fontSize: '36px',
            fontStyle: 'bold',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.add.text(width / 2, height * 0.32, 'SUPERMARKET', {
            fontFamily: 'Segoe UI, Arial, sans-serif',
            fontSize: '28px',
            fontStyle: 'bold',
            color: '#4caf50'
        }).setOrigin(0.5);

        // Decorative products
        this.createFloatingProducts();

        // Start button
        const startButton = this.add.graphics();
        startButton.fillStyle(0x4caf50, 1);
        startButton.fillRoundedRect(width / 2 - 100, height * 0.55, 200, 60, 12);

        const startText = this.add.text(width / 2, height * 0.55 + 30, 'START GAME', {
            fontFamily: 'Segoe UI, Arial, sans-serif',
            fontSize: '24px',
            fontStyle: 'bold',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Make button interactive
        const hitArea = this.add.rectangle(width / 2, height * 0.55 + 30, 200, 60);
        hitArea.setInteractive({ useHandCursor: true });

        hitArea.on('pointerover', () => {
            startButton.clear();
            startButton.fillStyle(0x66bb6a, 1);
            startButton.fillRoundedRect(width / 2 - 100, height * 0.55, 200, 60, 12);
        });

        hitArea.on('pointerout', () => {
            startButton.clear();
            startButton.fillStyle(0x4caf50, 1);
            startButton.fillRoundedRect(width / 2 - 100, height * 0.55, 200, 60, 12);
        });

        hitArea.on('pointerdown', () => {
            this.startGame();
        });

        // Instructions
        this.add.text(width / 2, height * 0.75, 'Find items from your shopping list!', {
            fontFamily: 'Segoe UI, Arial, sans-serif',
            fontSize: '16px',
            color: '#aaaaaa'
        }).setOrigin(0.5);

        this.add.text(width / 2, height * 0.80, 'Tap to collect, drag to scroll', {
            fontFamily: 'Segoe UI, Arial, sans-serif',
            fontSize: '14px',
            color: '#888888'
        }).setOrigin(0.5);

        // Load progress
        this.loadProgress();
    }

    createFloatingProducts() {
        const products = ['apple', 'banana', 'milk', 'chips', 'cheese_yellow'];
        const width = this.cameras.main.width;

        products.forEach((productId, index) => {
            const x = 60 + index * 80;
            const y = this.cameras.main.height * 0.45;

            const sprite = this.add.sprite(x, y, productId);
            sprite.setScale(0.6);
            sprite.setAlpha(0.6);

            // Floating animation
            this.tweens.add({
                targets: sprite,
                y: y - 10,
                duration: 1500 + index * 200,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        });
    }

    loadProgress() {
        const saved = localStorage.getItem('hiddenObjectProgress');
        if (saved) {
            const progress = JSON.parse(saved);
            this.registry.set('currentLevel', progress.currentLevel || 1);
            this.registry.set('totalScore', progress.totalScore || 0);
            this.registry.set('levelStars', progress.levelStars || {});
        } else {
            this.registry.set('currentLevel', 1);
            this.registry.set('totalScore', 0);
            this.registry.set('levelStars', {});
        }
    }

    startGame() {
        const level = this.registry.get('currentLevel') || 1;
        this.scene.start('GameScene', { level });
    }
}
