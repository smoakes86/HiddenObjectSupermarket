export default class StartScene extends Phaser.Scene {
    constructor() {
        super('StartScene');
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Warm gradient background
        const bg = this.add.graphics();
        bg.fillGradientStyle(0xFFF8E7, 0xFFF8E7, 0xFFE8D6, 0xFFE4CC, 1);
        bg.fillRect(0, 0, width, height);

        // Decorative circles/blobs in background
        this.createBackgroundDecor(width, height);

        // Store awning at top
        this.createAwning(width);

        // Title with shadow effect
        const titleShadow = this.add.text(width / 2 + 3, height * 0.22 + 3, 'Hidden Object', {
            fontFamily: 'Fredoka, Arial, sans-serif',
            fontSize: '34px',
            fontStyle: '600',
            color: '#D4A574'
        }).setOrigin(0.5);

        const title = this.add.text(width / 2, height * 0.22, 'Hidden Object', {
            fontFamily: 'Fredoka, Arial, sans-serif',
            fontSize: '34px',
            fontStyle: '600',
            color: '#5D4E37'
        }).setOrigin(0.5);

        // Subtitle with fun color
        const subtitleShadow = this.add.text(width / 2 + 2, height * 0.29 + 2, 'SUPERMARKET', {
            fontFamily: 'Fredoka, Arial, sans-serif',
            fontSize: '38px',
            fontStyle: '700',
            color: '#4A9E3D'
        }).setOrigin(0.5);

        const subtitle = this.add.text(width / 2, height * 0.29, 'SUPERMARKET', {
            fontFamily: 'Fredoka, Arial, sans-serif',
            fontSize: '38px',
            fontStyle: '700',
            color: '#6BBF59'
        }).setOrigin(0.5);

        // Bouncy title animation
        this.tweens.add({
            targets: [title, titleShadow],
            y: title.y - 5,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        this.tweens.add({
            targets: [subtitle, subtitleShadow],
            y: subtitle.y + 3,
            duration: 2500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Shopping cart icon
        this.createShoppingCartIcon(width / 2, height * 0.42);

        // Decorative floating products
        this.createFloatingProducts();

        // Start button with playful design
        this.createStartButton(width / 2, height * 0.60);

        // Instructions with friendly tone
        this.add.text(width / 2, height * 0.75, 'Find items from your shopping list!', {
            fontFamily: 'Nunito, Arial, sans-serif',
            fontSize: '16px',
            fontStyle: '600',
            color: '#8B7355'
        }).setOrigin(0.5);

        const tapText = this.add.text(width / 2, height * 0.80, 'Tap to collect • Swipe to explore', {
            fontFamily: 'Nunito, Arial, sans-serif',
            fontSize: '14px',
            color: '#A89880'
        }).setOrigin(0.5);

        // Subtle pulse on instructions
        this.tweens.add({
            targets: tapText,
            alpha: 0.6,
            duration: 1500,
            yoyo: true,
            repeat: -1
        });

        // Load progress
        this.loadProgress();

        // Show continue info if returning player
        this.showContinueInfo(width, height);
    }

    createBackgroundDecor(width, height) {
        const decor = this.add.graphics();

        // Soft colored circles
        const decorColors = [
            { color: 0xFFD93D, alpha: 0.1, x: width * 0.1, y: height * 0.15, r: 80 },
            { color: 0xFF8C5A, alpha: 0.08, x: width * 0.85, y: height * 0.25, r: 100 },
            { color: 0x6BBF59, alpha: 0.08, x: width * 0.15, y: height * 0.7, r: 120 },
            { color: 0x7FCDFF, alpha: 0.06, x: width * 0.9, y: height * 0.8, r: 90 },
            { color: 0xFFB7C5, alpha: 0.07, x: width * 0.5, y: height * 0.95, r: 150 },
        ];

        decorColors.forEach(d => {
            decor.fillStyle(d.color, d.alpha);
            decor.fillCircle(d.x, d.y, d.r);
        });
    }

    createAwning(width) {
        const awning = this.add.graphics();
        const stripeWidth = 30;
        const awningHeight = 50;

        // Draw alternating stripes
        for (let i = 0; i < Math.ceil(width / stripeWidth) + 1; i++) {
            const color = i % 2 === 0 ? 0xFF8C5A : 0xFFFFFF;
            awning.fillStyle(color, 1);
            awning.fillRect(i * stripeWidth - 15, 0, stripeWidth, awningHeight);
        }

        // Scalloped edge
        awning.fillStyle(0xFF8C5A, 1);
        for (let x = 0; x < width + 20; x += 20) {
            awning.fillCircle(x, awningHeight, 12);
        }

        // White scallop highlights
        awning.fillStyle(0xFFFFFF, 0.3);
        for (let x = 10; x < width + 20; x += 40) {
            awning.fillCircle(x, awningHeight, 12);
        }

        // Shadow under awning
        const shadow = this.add.graphics();
        shadow.fillStyle(0x5D4E37, 0.1);
        shadow.fillRect(0, awningHeight + 5, width, 15);
    }

    createShoppingCartIcon(x, y) {
        const cart = this.add.graphics();

        // Cart body (basket)
        cart.fillStyle(0x6BBF59, 1);
        cart.fillRoundedRect(x - 35, y - 20, 70, 45, 8);

        // Cart handle
        cart.lineStyle(6, 0x5D4E37, 1);
        cart.beginPath();
        cart.arc(x, y - 35, 25, Math.PI, 0, false);
        cart.strokePath();

        // Wheels
        cart.fillStyle(0x5D4E37, 1);
        cart.fillCircle(x - 20, y + 30, 8);
        cart.fillCircle(x + 20, y + 30, 8);

        // Wheel centers
        cart.fillStyle(0xFFFFFF, 1);
        cart.fillCircle(x - 20, y + 30, 3);
        cart.fillCircle(x + 20, y + 30, 3);

        // Items peeking out (colorful rectangles)
        cart.fillStyle(0xFFD93D, 1);
        cart.fillRoundedRect(x - 25, y - 30, 18, 15, 3);

        cart.fillStyle(0xFF8C5A, 1);
        cart.fillRoundedRect(x - 3, y - 35, 16, 20, 3);

        cart.fillStyle(0x7FCDFF, 1);
        cart.fillRoundedRect(x + 15, y - 28, 14, 12, 3);

        // Bounce animation
        this.tweens.add({
            targets: cart,
            y: 5,
            duration: 600,
            yoyo: true,
            repeat: -1,
            ease: 'Bounce.easeOut'
        });
    }

    createFloatingProducts() {
        const products = ['apple', 'banana', 'orange', 'cheese_yellow', 'carrot'];
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        products.forEach((productId, index) => {
            const x = 40 + index * 85;
            const y = height * 0.88;

            // Soft shadow under product
            const shadow = this.add.ellipse(x, y + 25, 40, 12, 0x5D4E37, 0.15);

            const sprite = this.add.sprite(x, y, productId);
            sprite.setScale(0.55);

            // Floating animation with varying timing
            this.tweens.add({
                targets: sprite,
                y: y - 12,
                duration: 1200 + index * 150,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });

            // Shadow scales with float
            this.tweens.add({
                targets: shadow,
                scaleX: 0.7,
                scaleY: 0.7,
                alpha: 0.08,
                duration: 1200 + index * 150,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });

            // Gentle rotation
            this.tweens.add({
                targets: sprite,
                angle: { from: -5, to: 5 },
                duration: 2000 + index * 200,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        });
    }

    createStartButton(x, y) {
        const buttonWidth = 220;
        const buttonHeight = 65;

        // Button shadow
        const shadow = this.add.graphics();
        shadow.fillStyle(0x4A9E3D, 1);
        shadow.fillRoundedRect(x - buttonWidth / 2 + 4, y - buttonHeight / 2 + 4, buttonWidth, buttonHeight, 20);

        // Main button
        const button = this.add.graphics();
        this.drawButton(button, x, y, buttonWidth, buttonHeight, 0x6BBF59);

        // Button text
        const buttonText = this.add.text(x, y - 2, 'START SHOPPING!', {
            fontFamily: 'Fredoka, Arial, sans-serif',
            fontSize: '22px',
            fontStyle: '600',
            color: '#FFFFFF'
        }).setOrigin(0.5);

        // Hit area
        const hitArea = this.add.rectangle(x, y, buttonWidth, buttonHeight);
        hitArea.setInteractive({ useHandCursor: true });

        // Hover effects
        hitArea.on('pointerover', () => {
            this.drawButton(button, x, y - 3, buttonWidth, buttonHeight, 0x7DD169);
            buttonText.setY(y - 5);
            shadow.setAlpha(0.5);
        });

        hitArea.on('pointerout', () => {
            this.drawButton(button, x, y, buttonWidth, buttonHeight, 0x6BBF59);
            buttonText.setY(y - 2);
            shadow.setAlpha(1);
        });

        hitArea.on('pointerdown', () => {
            // Press effect
            this.drawButton(button, x, y + 2, buttonWidth, buttonHeight, 0x5AAF49);
            buttonText.setY(y);

            this.time.delayedCall(100, () => {
                this.startGame();
            });
        });

        // Gentle pulse animation
        this.tweens.add({
            targets: [button, shadow],
            scaleX: 1.02,
            scaleY: 1.02,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    drawButton(graphics, x, y, width, height, color) {
        graphics.clear();
        graphics.fillStyle(color, 1);
        graphics.fillRoundedRect(x - width / 2, y - height / 2, width, height, 20);

        // Highlight on top
        graphics.fillStyle(0xFFFFFF, 0.2);
        graphics.fillRoundedRect(x - width / 2 + 8, y - height / 2 + 4, width - 16, height / 3, 12);
    }

    showContinueInfo(width, height) {
        const currentLevel = this.registry.get('currentLevel') || 1;
        const totalScore = this.registry.get('totalScore') || 0;

        if (currentLevel > 1 || totalScore > 0) {
            // Progress badge
            const badge = this.add.graphics();
            badge.fillStyle(0xFFD93D, 1);
            badge.fillRoundedRect(width / 2 - 80, height * 0.68, 160, 35, 17);

            badge.fillStyle(0x5D4E37, 0.1);
            badge.fillRoundedRect(width / 2 - 78, height * 0.68 + 2, 156, 31, 15);

            this.add.text(width / 2, height * 0.68 + 17, `Level ${currentLevel} • ${totalScore} pts`, {
                fontFamily: 'Nunito, Arial, sans-serif',
                fontSize: '14px',
                fontStyle: '700',
                color: '#5D4E37'
            }).setOrigin(0.5);
        }
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
