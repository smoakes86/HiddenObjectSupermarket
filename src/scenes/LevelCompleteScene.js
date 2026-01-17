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

        // Semi-transparent overlay
        const overlay = this.add.graphics();
        overlay.fillStyle(0x000000, 0.8);
        overlay.fillRect(0, 0, width, height);

        // Modal background
        const modalWidth = 340;
        const modalHeight = 400;
        const modalX = (width - modalWidth) / 2;
        const modalY = (height - modalHeight) / 2;

        const modal = this.add.graphics();
        modal.fillStyle(0x2d2d2d, 1);
        modal.fillRoundedRect(modalX, modalY, modalWidth, modalHeight, 16);

        // Title
        this.add.text(width / 2, modalY + 30, 'Level Complete!', {
            fontFamily: 'Segoe UI, Arial, sans-serif',
            fontSize: '28px',
            fontStyle: 'bold',
            color: '#4caf50'
        }).setOrigin(0.5);

        // Stars
        this.createStars(width / 2, modalY + 80, this.levelData.stars);

        // Stats
        const statsY = modalY + 130;
        const statsConfig = {
            fontFamily: 'Segoe UI, Arial, sans-serif',
            fontSize: '18px',
            color: '#ffffff'
        };

        this.add.text(modalX + 30, statsY, 'Items Found:', statsConfig);
        this.add.text(modalX + modalWidth - 30, statsY, `${this.levelData.itemsFound}`, statsConfig).setOrigin(1, 0);

        this.add.text(modalX + 30, statsY + 35, 'Time:', statsConfig);
        this.add.text(modalX + modalWidth - 30, statsY + 35, `${Math.floor(this.levelData.time)}s`, statsConfig).setOrigin(1, 0);

        this.add.text(modalX + 30, statsY + 70, 'Mistakes:', statsConfig);
        this.add.text(modalX + modalWidth - 30, statsY + 70, `${this.levelData.mistakes}`, statsConfig).setOrigin(1, 0);

        // Divider
        const divider = this.add.graphics();
        divider.lineStyle(2, 0x4caf50, 1);
        divider.lineBetween(modalX + 30, statsY + 110, modalX + modalWidth - 30, statsY + 110);

        // Score
        this.add.text(modalX + 30, statsY + 125, 'Score:', {
            fontFamily: 'Segoe UI, Arial, sans-serif',
            fontSize: '22px',
            fontStyle: 'bold',
            color: '#ffffff'
        });
        this.add.text(modalX + modalWidth - 30, statsY + 125, `+${this.levelData.score}`, {
            fontFamily: 'Segoe UI, Arial, sans-serif',
            fontSize: '22px',
            fontStyle: 'bold',
            color: '#4caf50'
        }).setOrigin(1, 0);

        // Total score
        this.add.text(width / 2, statsY + 165, `Total: ${this.levelData.totalScore}`, {
            fontFamily: 'Segoe UI, Arial, sans-serif',
            fontSize: '16px',
            color: '#aaaaaa'
        }).setOrigin(0.5);

        // Next Level button
        this.createButton(
            width / 2,
            modalY + modalHeight - 60,
            'Next Level',
            0x4caf50,
            () => this.nextLevel()
        );

        // Celebration particles
        this.createCelebration();
    }

    createStars(x, y, count) {
        const starSpacing = 50;
        const startX = x - starSpacing;

        for (let i = 0; i < 3; i++) {
            const starX = startX + i * starSpacing;
            const filled = i < count;

            const star = this.add.text(starX, y, '★', {
                fontFamily: 'Arial',
                fontSize: '40px',
                color: filled ? '#ffc107' : '#555555'
            }).setOrigin(0.5);

            if (filled) {
                // Pop-in animation
                star.setScale(0);
                this.tweens.add({
                    targets: star,
                    scale: 1,
                    duration: 300,
                    delay: i * 150,
                    ease: 'Back.easeOut'
                });
            }
        }
    }

    createButton(x, y, text, color, callback) {
        const buttonWidth = 200;
        const buttonHeight = 50;

        const button = this.add.graphics();
        button.fillStyle(color, 1);
        button.fillRoundedRect(x - buttonWidth / 2, y - buttonHeight / 2, buttonWidth, buttonHeight, 10);

        const buttonText = this.add.text(x, y, text, {
            fontFamily: 'Segoe UI, Arial, sans-serif',
            fontSize: '20px',
            fontStyle: 'bold',
            color: '#ffffff'
        }).setOrigin(0.5);

        const hitArea = this.add.rectangle(x, y, buttonWidth, buttonHeight);
        hitArea.setInteractive({ useHandCursor: true });

        hitArea.on('pointerover', () => {
            button.clear();
            button.fillStyle(this.lightenColor(color), 1);
            button.fillRoundedRect(x - buttonWidth / 2, y - buttonHeight / 2, buttonWidth, buttonHeight, 10);
        });

        hitArea.on('pointerout', () => {
            button.clear();
            button.fillStyle(color, 1);
            button.fillRoundedRect(x - buttonWidth / 2, y - buttonHeight / 2, buttonWidth, buttonHeight, 10);
        });

        hitArea.on('pointerdown', callback);
    }

    lightenColor(color) {
        const r = Math.min(255, ((color >> 16) & 0xff) + 30);
        const g = Math.min(255, ((color >> 8) & 0xff) + 30);
        const b = Math.min(255, (color & 0xff) + 30);
        return (r << 16) | (g << 8) | b;
    }

    createCelebration() {
        const width = this.cameras.main.width;

        // Create falling stars
        for (let i = 0; i < 20; i++) {
            const star = this.add.text(
                Phaser.Math.Between(20, width - 20),
                Phaser.Math.Between(-100, -20),
                '★',
                {
                    fontFamily: 'Arial',
                    fontSize: Phaser.Math.Between(16, 32) + 'px',
                    color: Phaser.Utils.Array.GetRandom(['#ffc107', '#4caf50', '#2196f3', '#e91e63'])
                }
            ).setOrigin(0.5).setAlpha(0.7);

            this.tweens.add({
                targets: star,
                y: this.cameras.main.height + 50,
                x: star.x + Phaser.Math.Between(-50, 50),
                rotation: Phaser.Math.Between(0, 6),
                alpha: 0,
                duration: Phaser.Math.Between(1500, 3000),
                delay: i * 100,
                onComplete: () => star.destroy()
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
