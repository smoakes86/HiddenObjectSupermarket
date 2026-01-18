export default class LevelCompleteScene extends Phaser.Scene {
    constructor() {
        super('LevelCompleteScene');
    }

    init(data) {
        this.levelData = data;
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Warm semi-transparent overlay
        const overlay = this.add.graphics();
        overlay.fillStyle(0x5D4E37, 0.7);
        overlay.fillRect(0, 0, width, height);

        // Celebration confetti
        this.createConfetti();

        // Modal card
        const modalWidth = 340;
        const modalHeight = 420;
        const modalX = (width - modalWidth) / 2;
        const modalY = (height - modalHeight) / 2;

        // Modal shadow
        const modalShadow = this.add.graphics();
        modalShadow.fillStyle(0x5D4E37, 0.3);
        modalShadow.fillRoundedRect(modalX + 8, modalY + 8, modalWidth, modalHeight, 24);

        // Modal background (cream paper)
        const modal = this.add.graphics();
        modal.fillStyle(0xFFFBF0, 1);
        modal.fillRoundedRect(modalX, modalY, modalWidth, modalHeight, 24);

        // Decorative header ribbon
        const ribbon = this.add.graphics();
        ribbon.fillStyle(0x6BBF59, 1);
        ribbon.fillRoundedRect(modalX, modalY, modalWidth, 70, { tl: 24, tr: 24, bl: 0, br: 0 });

        // Ribbon shine
        ribbon.fillStyle(0x7DD169, 1);
        ribbon.fillRoundedRect(modalX, modalY, modalWidth, 15, { tl: 24, tr: 24, bl: 0, br: 0 });

        // Ribbon bottom shadow
        ribbon.fillStyle(0x4A9E3D, 1);
        ribbon.fillRect(modalX, modalY + 65, modalWidth, 5);

        // Trophy/badge icon
        this.createBadge(width / 2, modalY + 35);

        // Title
        const titleShadow = this.add.text(width / 2 + 2, modalY + 95 + 2, 'Great Shopping!', {
            fontFamily: 'Fredoka, Arial, sans-serif',
            fontSize: '28px',
            fontStyle: '700',
            color: '#D4A574'
        }).setOrigin(0.5);

        const title = this.add.text(width / 2, modalY + 95, 'Great Shopping!', {
            fontFamily: 'Fredoka, Arial, sans-serif',
            fontSize: '28px',
            fontStyle: '700',
            color: '#5D4E37'
        }).setOrigin(0.5);

        // Bounce animation for title
        this.tweens.add({
            targets: [title, titleShadow],
            scale: { from: 0, to: 1 },
            duration: 500,
            ease: 'Back.easeOut'
        });

        // Stars rating
        this.createStars(width / 2, modalY + 140, this.levelData.stars);

        // Stats card
        const statsY = modalY + 175;
        const statsCardX = modalX + 20;
        const statsCardWidth = modalWidth - 40;

        // Stats background
        const statsBg = this.add.graphics();
        statsBg.fillStyle(0xFFF5E6, 1);
        statsBg.fillRoundedRect(statsCardX, statsY, statsCardWidth, 130, 12);
        statsBg.lineStyle(2, 0xE8DDD0, 1);
        statsBg.strokeRoundedRect(statsCardX, statsY, statsCardWidth, 130, 12);

        // Stats content
        const statsConfig = {
            fontFamily: 'Nunito, Arial, sans-serif',
            fontSize: '16px',
            fontStyle: '600',
            color: '#8B7355'
        };

        const valueConfig = {
            fontFamily: 'Fredoka, Arial, sans-serif',
            fontSize: '16px',
            fontStyle: '600',
            color: '#5D4E37'
        };

        // Items found row
        this.add.text(statsCardX + 20, statsY + 18, 'Items Found', statsConfig);
        this.add.text(statsCardX + statsCardWidth - 20, statsY + 18, `${this.levelData.itemsFound}`, valueConfig).setOrigin(1, 0);

        // Time row
        this.add.text(statsCardX + 20, statsY + 48, 'Time', statsConfig);
        this.add.text(statsCardX + statsCardWidth - 20, statsY + 48, `${Math.floor(this.levelData.time)}s`, valueConfig).setOrigin(1, 0);

        // Mistakes row
        this.add.text(statsCardX + 20, statsY + 78, 'Mistakes', statsConfig);
        const mistakesColor = this.levelData.mistakes === 0 ? '#6BBF59' : (this.levelData.mistakes > 3 ? '#FF6B6B' : '#5D4E37');
        this.add.text(statsCardX + statsCardWidth - 20, statsY + 78, `${this.levelData.mistakes}`, {
            ...valueConfig,
            color: mistakesColor
        }).setOrigin(1, 0);

        // Divider
        const divider = this.add.graphics();
        divider.lineStyle(2, 0xE8DDD0, 1);
        divider.lineBetween(statsCardX + 15, statsY + 105, statsCardX + statsCardWidth - 15, statsY + 105);

        // Score - highlighted
        this.add.text(statsCardX + 20, statsY + 112, 'Score', {
            fontFamily: 'Fredoka, Arial, sans-serif',
            fontSize: '18px',
            fontStyle: '700',
            color: '#5D4E37'
        });

        const scoreText = this.add.text(statsCardX + statsCardWidth - 20, statsY + 112, `+${this.levelData.score}`, {
            fontFamily: 'Fredoka, Arial, sans-serif',
            fontSize: '18px',
            fontStyle: '700',
            color: '#6BBF59'
        }).setOrigin(1, 0);

        // Animate score counting up
        this.tweens.addCounter({
            from: 0,
            to: this.levelData.score,
            duration: 1000,
            delay: 500,
            onUpdate: (tween) => {
                scoreText.setText(`+${Math.floor(tween.getValue())}`);
            }
        });

        // Total score badge
        const totalY = modalY + 320;
        const totalBadge = this.add.graphics();
        totalBadge.fillStyle(0xFFD93D, 1);
        totalBadge.fillRoundedRect(width / 2 - 80, totalY, 160, 35, 17);

        totalBadge.fillStyle(0xE8C42A, 1);
        totalBadge.fillRoundedRect(width / 2 - 80, totalY + 28, 160, 7, { tl: 0, tr: 0, bl: 17, br: 17 });

        this.add.text(width / 2, totalY + 17, `Total: ${this.levelData.totalScore}`, {
            fontFamily: 'Fredoka, Arial, sans-serif',
            fontSize: '16px',
            fontStyle: '600',
            color: '#5D4E37'
        }).setOrigin(0.5);

        // Next Level button
        this.createButton(
            width / 2,
            modalY + modalHeight - 45,
            'Continue Shopping!',
            0x6BBF59,
            () => this.nextLevel()
        );
    }

    createBadge(x, y) {
        const badge = this.add.graphics();

        // Outer circle
        badge.fillStyle(0xFFD93D, 1);
        badge.fillCircle(x, y, 28);

        // Inner circle
        badge.fillStyle(0xFFE566, 1);
        badge.fillCircle(x, y, 22);

        // Cart icon in center
        badge.fillStyle(0x5D4E37, 1);

        // Simple cart shape
        badge.fillRoundedRect(x - 12, y - 5, 24, 14, 3);
        badge.fillCircle(x - 6, y + 14, 4);
        badge.fillCircle(x + 6, y + 14, 4);

        // Handle
        badge.lineStyle(3, 0x5D4E37, 1);
        badge.beginPath();
        badge.arc(x, y - 12, 10, Math.PI, 0, false);
        badge.strokePath();

        // Bounce animation
        this.tweens.add({
            targets: badge,
            scale: { from: 0, to: 1 },
            duration: 600,
            ease: 'Bounce.easeOut'
        });
    }

    createStars(x, y, count) {
        const starSpacing = 55;
        const startX = x - starSpacing;

        for (let i = 0; i < 3; i++) {
            const starX = startX + i * starSpacing;
            const filled = i < count;

            // Star background circle
            const starBg = this.add.graphics();
            starBg.fillStyle(filled ? 0xFFD93D : 0xE8DDD0, 1);
            starBg.fillCircle(starX, y, 22);

            if (filled) {
                starBg.fillStyle(0xE8C42A, 1);
                starBg.fillCircle(starX, y + 3, 22);
            }

            const star = this.add.text(starX, y - 2, '★', {
                fontFamily: 'Arial',
                fontSize: '32px',
                color: filled ? '#FFFFFF' : '#C4B8A8'
            }).setOrigin(0.5);

            if (filled) {
                // Pop-in animation with bounce
                star.setScale(0);
                starBg.setScale(0);

                this.tweens.add({
                    targets: [star, starBg],
                    scale: 1,
                    duration: 400,
                    delay: 300 + i * 200,
                    ease: 'Back.easeOut'
                });

                // Sparkle effect
                this.time.delayedCall(500 + i * 200, () => {
                    this.createSparkle(starX, y);
                });
            }
        }
    }

    createSparkle(x, y) {
        const sparkleColors = [0xFFD93D, 0xFFFFFF, 0xFFE566];

        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const sparkle = this.add.text(x, y, '✦', {
                fontFamily: 'Arial',
                fontSize: '12px',
                color: '#FFD93D'
            }).setOrigin(0.5).setAlpha(0);

            this.tweens.add({
                targets: sparkle,
                x: x + Math.cos(angle) * 35,
                y: y + Math.sin(angle) * 35,
                alpha: { from: 1, to: 0 },
                scale: { from: 1, to: 0 },
                duration: 500,
                ease: 'Power2',
                onComplete: () => sparkle.destroy()
            });
        }
    }

    createButton(x, y, text, color, callback) {
        const buttonWidth = 220;
        const buttonHeight = 55;

        // Button shadow
        const shadow = this.add.graphics();
        shadow.fillStyle(0x4A9E3D, 1);
        shadow.fillRoundedRect(x - buttonWidth / 2 + 4, y - buttonHeight / 2 + 4, buttonWidth, buttonHeight, 16);

        // Main button
        const button = this.add.graphics();
        this.drawButton(button, x, y, buttonWidth, buttonHeight, color);

        const buttonText = this.add.text(x, y - 2, text, {
            fontFamily: 'Fredoka, Arial, sans-serif',
            fontSize: '18px',
            fontStyle: '600',
            color: '#FFFFFF'
        }).setOrigin(0.5);

        const hitArea = this.add.rectangle(x, y, buttonWidth, buttonHeight);
        hitArea.setInteractive({ useHandCursor: true });

        hitArea.on('pointerover', () => {
            this.drawButton(button, x, y - 3, buttonWidth, buttonHeight, 0x7DD169);
            buttonText.setY(y - 5);
            shadow.setAlpha(0.5);
        });

        hitArea.on('pointerout', () => {
            this.drawButton(button, x, y, buttonWidth, buttonHeight, color);
            buttonText.setY(y - 2);
            shadow.setAlpha(1);
        });

        hitArea.on('pointerdown', () => {
            this.drawButton(button, x, y + 2, buttonWidth, buttonHeight, 0x5AAF49);
            buttonText.setY(y);

            this.time.delayedCall(100, callback);
        });

        // Gentle pulse
        this.tweens.add({
            targets: [button, shadow],
            scaleX: 1.02,
            scaleY: 1.02,
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
            delay: 1000
        });
    }

    drawButton(graphics, x, y, width, height, color) {
        graphics.clear();
        graphics.fillStyle(color, 1);
        graphics.fillRoundedRect(x - width / 2, y - height / 2, width, height, 16);

        // Highlight
        graphics.fillStyle(0xFFFFFF, 0.2);
        graphics.fillRoundedRect(x - width / 2 + 8, y - height / 2 + 4, width - 16, height / 3, 10);
    }

    createConfetti() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        const confettiColors = ['#FF8C5A', '#6BBF59', '#FFD93D', '#7FCDFF', '#FFB7C5', '#B39DDB'];
        const confettiShapes = ['●', '■', '▲', '♦'];

        for (let i = 0; i < 40; i++) {
            const shape = Phaser.Utils.Array.GetRandom(confettiShapes);
            const color = Phaser.Utils.Array.GetRandom(confettiColors);

            const confetti = this.add.text(
                Phaser.Math.Between(0, width),
                Phaser.Math.Between(-150, -20),
                shape,
                {
                    fontFamily: 'Arial',
                    fontSize: Phaser.Math.Between(12, 24) + 'px',
                    color: color
                }
            ).setOrigin(0.5).setAlpha(0.9);

            const targetY = height + 50;
            const drift = Phaser.Math.Between(-80, 80);
            const duration = Phaser.Math.Between(2000, 4000);

            this.tweens.add({
                targets: confetti,
                y: targetY,
                x: confetti.x + drift,
                rotation: Phaser.Math.Between(2, 8),
                alpha: 0,
                duration: duration,
                delay: i * 50,
                ease: 'Sine.easeIn',
                onComplete: () => confetti.destroy()
            });

            // Add wobble
            this.tweens.add({
                targets: confetti,
                x: confetti.x + Phaser.Math.Between(-20, 20),
                duration: 300,
                yoyo: true,
                repeat: Math.floor(duration / 600),
                ease: 'Sine.easeInOut'
            });
        }
    }

    nextLevel() {
        const nextLevel = this.levelData.level + 1;
        this.scene.stop('GameScene');
        this.scene.stop();
        this.scene.start('GameScene', { level: nextLevel });
    }
}
