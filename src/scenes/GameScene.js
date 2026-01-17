import { PRODUCTS, getProductById, getRandomItems } from '../config/products.js';
import { getLevel, generateShoppingList, calculateScore, calculateStars } from '../config/levels.js';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    init(data) {
        this.currentLevel = data.level || 1;
        this.score = 0;
        this.mistakes = 0;
        this.startTime = 0;
        this.elapsedTime = 0;
        this.shoppingList = [];
        this.foundItems = [];
        this.products = [];

        // Scrolling state
        this.scrollVelocity = 0;
        this.isDragging = false;
        this.dragStartX = 0;
        this.dragStartScrollX = 0;
        this.lastPointerX = 0;
        this.pointerDownTime = 0;
        this.hasMoved = false;
        this.maxScrollX = 0;
    }

    create() {
        this.levelConfig = getLevel(this.currentLevel);

        this.createEnvironment();
        this.createShelves();
        this.createUI();
        this.setupInput();
        this.startLevel();
    }

    createEnvironment() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        const worldWidth = this.levelConfig.itemsPerShelf * 68 + 100;

        // Background gradient - darker at top for ceiling effect
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x0a0a15, 0x0a0a15, 0x1a1a2e, 0x1a1a2e, 1);
        bg.fillRect(0, 0, worldWidth, height);

        // Ceiling
        const ceiling = this.add.graphics();
        ceiling.fillStyle(0x1a1a1a, 1);
        ceiling.fillRect(0, 0, worldWidth, 50);

        // Ceiling trim
        ceiling.fillStyle(0x2d2d2d, 1);
        ceiling.fillRect(0, 45, worldWidth, 8);
        ceiling.fillStyle(0x3d3d3d, 1);
        ceiling.fillRect(0, 50, worldWidth, 3);

        // Add ceiling lights
        this.createCeilingLights(worldWidth);

        // Create checkered floor
        this.createFloorTiles(worldWidth, height);
    }

    createCeilingLights(worldWidth) {
        const lightSpacing = 200;
        const lightY = 25;

        for (let x = 100; x < worldWidth; x += lightSpacing) {
            // Light fixture (dark metal)
            const fixture = this.add.graphics();
            fixture.fillStyle(0x2d2d2d, 1);
            fixture.fillRect(x - 30, 0, 60, 20);

            // Fixture bottom trim
            fixture.fillStyle(0x404040, 1);
            fixture.fillRect(x - 25, 18, 50, 4);

            // Light panel (bright)
            const lightPanel = this.add.graphics();
            lightPanel.fillStyle(0xfff8e1, 1);
            lightPanel.fillRect(x - 20, 20, 40, 8);

            // Light glow effect (larger, semi-transparent)
            const glow = this.add.graphics();

            // Outer glow
            glow.fillStyle(0xfff8e1, 0.03);
            glow.fillCircle(x, lightY + 60, 120);

            // Middle glow
            glow.fillStyle(0xfff8e1, 0.05);
            glow.fillCircle(x, lightY + 40, 80);

            // Inner glow
            glow.fillStyle(0xfff8e1, 0.08);
            glow.fillCircle(x, lightY + 20, 50);

            // Bright center
            glow.fillStyle(0xffffff, 0.15);
            glow.fillCircle(x, lightY + 10, 25);

            // Light rays (subtle)
            const rays = this.add.graphics();
            rays.fillStyle(0xfff8e1, 0.02);

            // Left ray
            rays.beginPath();
            rays.moveTo(x - 20, 28);
            rays.lineTo(x - 80, 200);
            rays.lineTo(x - 40, 200);
            rays.lineTo(x - 10, 28);
            rays.closePath();
            rays.fillPath();

            // Right ray
            rays.beginPath();
            rays.moveTo(x + 20, 28);
            rays.lineTo(x + 80, 200);
            rays.lineTo(x + 40, 200);
            rays.lineTo(x + 10, 28);
            rays.closePath();
            rays.fillPath();
        }
    }

    createFloorTiles(worldWidth, height) {
        const floorY = height - 120;
        const floorHeight = 120;
        const tileSize = 40;

        // Floor base
        const floorBase = this.add.graphics();
        floorBase.fillStyle(0x2a2a2a, 1);
        floorBase.fillRect(0, floorY, worldWidth, floorHeight);

        // Checkered tiles
        const tiles = this.add.graphics();
        const tilesAcross = Math.ceil(worldWidth / tileSize) + 1;
        const tilesDown = Math.ceil(floorHeight / tileSize) + 1;

        for (let row = 0; row < tilesDown; row++) {
            for (let col = 0; col < tilesAcross; col++) {
                const x = col * tileSize;
                const y = floorY + row * tileSize;

                // Alternate colors for checkered pattern
                const isLight = (row + col) % 2 === 0;
                const baseColor = isLight ? 0x3d3d3d : 0x2d2d2d;

                tiles.fillStyle(baseColor, 1);
                tiles.fillRect(x, y, tileSize, tileSize);

                // Tile highlight (top-left edges)
                tiles.fillStyle(isLight ? 0x4a4a4a : 0x383838, 1);
                tiles.fillRect(x, y, tileSize, 2);
                tiles.fillRect(x, y, 2, tileSize);

                // Tile shadow (bottom-right edges)
                tiles.fillStyle(isLight ? 0x333333 : 0x252525, 1);
                tiles.fillRect(x, y + tileSize - 2, tileSize, 2);
                tiles.fillRect(x + tileSize - 2, y, 2, tileSize);
            }
        }

        // Floor reflection/shine strip
        const shine = this.add.graphics();
        shine.fillStyle(0xffffff, 0.03);
        shine.fillRect(0, floorY + 10, worldWidth, 30);

        // Baseboard where floor meets shelves
        const baseboard = this.add.graphics();
        baseboard.fillStyle(0x1a1a1a, 1);
        baseboard.fillRect(0, floorY - 5, worldWidth, 8);
        baseboard.fillStyle(0x252525, 1);
        baseboard.fillRect(0, floorY - 5, worldWidth, 3);
    }

    createShelves() {
        const { shelfCount, itemsPerShelf, categories } = this.levelConfig;

        // Generate shopping list
        this.shoppingList = generateShoppingList(this.levelConfig);
        this.shoppingList.forEach(item => item.found = false);

        // Calculate world width
        const shelfWidth = itemsPerShelf * 68 + 40;
        this.worldWidth = shelfWidth;
        this.maxScrollX = Math.max(0, shelfWidth - this.cameras.main.width);

        // Set camera bounds
        this.cameras.main.setBounds(0, 0, shelfWidth, this.cameras.main.height);

        // Create shelf containers
        const startY = 80;
        const shelfHeight = 130;

        // Calculate total slots needed
        const totalSlots = shelfCount * itemsPerShelf;

        // Get the pool of available products from the level's categories
        const productPool = getRandomItems(100, categories); // Get all available products

        // Create array of products to place on shelves
        const shelfProducts = [];

        // First, add all shopping list items (these MUST be on the shelves)
        this.shoppingList.forEach(item => {
            shelfProducts.push({ ...item, isTarget: true });
        });

        // Fill remaining slots with random products from the pool (allowing duplicates)
        while (shelfProducts.length < totalSlots) {
            const randomProduct = Phaser.Utils.Array.GetRandom(productPool);
            shelfProducts.push({ ...randomProduct, isTarget: false });
        }

        // Shuffle all products so targets are spread across shelves
        Phaser.Utils.Array.Shuffle(shelfProducts);

        let productIndex = 0;

        for (let shelfIdx = 0; shelfIdx < shelfCount; shelfIdx++) {
            const y = startY + shelfIdx * shelfHeight;

            // Draw shelf back
            for (let i = 0; i < itemsPerShelf; i++) {
                const x = 20 + i * 68;
                this.add.tileSprite(x, y, 68, 110, 'shelf_back').setOrigin(0, 0);
            }

            // Draw shelf surface
            for (let i = 0; i < itemsPerShelf; i++) {
                const x = 20 + i * 68;
                this.add.tileSprite(x, y + 95, 68, 16, 'shelf_surface').setOrigin(0, 0);
            }

            // Place products - fill EVERY slot
            for (let i = 0; i < itemsPerShelf; i++) {
                const product = shelfProducts[productIndex];
                const x = 20 + i * 68 + 34;
                const prodY = y + 55;

                const sprite = this.add.sprite(x, prodY, product.id);
                sprite.setInteractive({ useHandCursor: true });
                sprite.productData = product;
                sprite.isTarget = product.isTarget;
                sprite.collected = false;

                this.products.push(sprite);
                productIndex++;
            }
        }
    }

    createUI() {
        const width = this.cameras.main.width;

        // UI Container (fixed to camera)
        this.uiContainer = this.add.container(0, 0);
        this.uiContainer.setScrollFactor(0);
        this.uiContainer.setDepth(100);

        // Header background
        const headerBg = this.add.graphics();
        headerBg.fillStyle(0x000000, 0.7);
        headerBg.fillRect(0, 0, width, 60);
        this.uiContainer.add(headerBg);

        // Level text
        this.levelText = this.add.text(20, 18, `Level ${this.currentLevel}`, {
            fontFamily: 'Segoe UI, Arial, sans-serif',
            fontSize: '18px',
            fontStyle: 'bold',
            color: '#ffffff',
            backgroundColor: '#ffffff33',
            padding: { x: 12, y: 6 }
        });
        this.uiContainer.add(this.levelText);

        // Timer
        this.timerText = this.add.text(width / 2, 18, '0:00', {
            fontFamily: 'Segoe UI, Arial, sans-serif',
            fontSize: '22px',
            fontStyle: 'bold',
            color: '#ffffff'
        }).setOrigin(0.5, 0);
        this.uiContainer.add(this.timerText);

        // Score
        const totalScore = this.registry.get('totalScore') || 0;
        this.scoreText = this.add.text(width - 20, 18, `${totalScore}`, {
            fontFamily: 'Segoe UI, Arial, sans-serif',
            fontSize: '18px',
            fontStyle: 'bold',
            color: '#ffffff',
            backgroundColor: '#4caf50cc',
            padding: { x: 12, y: 6 }
        }).setOrigin(1, 0);
        this.uiContainer.add(this.scoreText);

        // Shopping list UI (bottom)
        this.createShoppingListUI();

        // Feedback text
        this.feedbackText = this.add.text(width / 2, this.cameras.main.height / 2, '', {
            fontFamily: 'Segoe UI, Arial, sans-serif',
            fontSize: '48px',
            fontStyle: 'bold',
            color: '#4caf50'
        }).setOrigin(0.5).setAlpha(0).setScrollFactor(0).setDepth(101);

        // Scroll indicators
        this.createScrollIndicators();
    }

    createShoppingListUI() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Shopping list background
        const listBg = this.add.graphics();
        listBg.fillStyle(0x000000, 0.8);
        listBg.fillRect(0, height - 120, width, 120);
        this.uiContainer.add(listBg);

        // Title
        const listTitle = this.add.text(20, height - 115, 'Shopping List:', {
            fontFamily: 'Segoe UI, Arial, sans-serif',
            fontSize: '14px',
            color: '#aaaaaa'
        });
        this.uiContainer.add(listTitle);

        // Shopping list items container
        this.shoppingListContainer = this.add.container(0, 0);
        this.shoppingListContainer.setScrollFactor(0);
        this.shoppingListContainer.setDepth(100);

        this.updateShoppingListUI();
    }

    updateShoppingListUI() {
        // Clear existing items
        this.shoppingListContainer.removeAll(true);

        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        const startX = 20;

        // Show names on easy/medium levels
        const showNames = this.levelConfig.difficulty === 'easy' || this.levelConfig.difficulty === 'medium';
        const itemHeight = showNames ? 55 : 40;
        const startY = height - (showNames ? 95 : 85);
        const itemWidth = 70;

        this.shoppingList.forEach((item, index) => {
            const x = startX + (index % 5) * itemWidth;
            const y = startY + Math.floor(index / 5) * (itemHeight + 5);

            // Item background
            const bg = this.add.graphics();
            bg.fillStyle(item.found ? 0x4caf50 : 0x333333, 0.8);
            bg.fillRoundedRect(x, y, 60, itemHeight, 6);
            this.shoppingListContainer.add(bg);

            // Product sprite
            const spriteY = showNames ? y + 16 : y + 20;
            const sprite = this.add.sprite(x + 30, spriteY, item.id);
            sprite.setScale(showNames ? 0.35 : 0.4);
            if (item.found) {
                sprite.setAlpha(0.5);
            }
            this.shoppingListContainer.add(sprite);

            // Product name (on easier levels)
            if (showNames) {
                // Shorten long names
                let displayName = item.name || item.id;
                if (displayName.length > 8) {
                    displayName = displayName.substring(0, 7) + '.';
                }
                const nameText = this.add.text(x + 30, y + itemHeight - 10, displayName, {
                    fontFamily: 'Segoe UI, Arial, sans-serif',
                    fontSize: '9px',
                    color: item.found ? '#ffffff' : '#cccccc'
                }).setOrigin(0.5);
                this.shoppingListContainer.add(nameText);
            }

            // Checkmark for found items
            if (item.found) {
                const check = this.add.text(x + 45, y + 5, '✓', {
                    fontFamily: 'Arial',
                    fontSize: '20px',
                    color: '#ffffff'
                });
                this.shoppingListContainer.add(check);
            }
        });
    }

    createScrollIndicators() {
        const height = this.cameras.main.height;
        const width = this.cameras.main.width;

        // Left indicator
        this.leftIndicator = this.add.text(15, height / 2 - 60, '◀', {
            fontFamily: 'Arial',
            fontSize: '32px',
            color: '#ffffff'
        }).setOrigin(0.5).setAlpha(0).setScrollFactor(0).setDepth(50);

        // Right indicator
        this.rightIndicator = this.add.text(width - 15, height / 2 - 60, '▶', {
            fontFamily: 'Arial',
            fontSize: '32px',
            color: '#ffffff'
        }).setOrigin(0.5).setAlpha(0.6).setScrollFactor(0).setDepth(50);

        // Pulse animation
        this.tweens.add({
            targets: [this.leftIndicator, this.rightIndicator],
            alpha: { from: 0.3, to: 0.8 },
            duration: 800,
            yoyo: true,
            repeat: -1
        });
    }

    setupInput() {
        this.input.on('pointerdown', (pointer) => {
            this.isDragging = true;
            this.dragStartX = pointer.x;
            this.dragStartScrollX = this.cameras.main.scrollX;
            this.lastPointerX = pointer.x;
            this.scrollVelocity = 0;
            this.pointerDownTime = this.time.now;
            this.hasMoved = false;
        });

        this.input.on('pointermove', (pointer) => {
            if (!this.isDragging) return;

            const deltaX = pointer.x - this.lastPointerX;
            const totalDelta = Math.abs(pointer.x - this.dragStartX);

            if (totalDelta > 10) {
                this.hasMoved = true;
            }

            this.scrollVelocity = -deltaX;
            const newScrollX = Phaser.Math.Clamp(
                this.dragStartScrollX - (pointer.x - this.dragStartX),
                0,
                this.maxScrollX
            );
            this.cameras.main.scrollX = newScrollX;

            this.lastPointerX = pointer.x;
        });

        this.input.on('pointerup', (pointer) => {
            const tapDuration = this.time.now - this.pointerDownTime;

            if (!this.hasMoved && tapDuration < 300) {
                this.handleTap(pointer);
            }

            this.isDragging = false;
        });
    }

    handleTap(pointer) {
        // Convert screen position to world position
        const worldX = pointer.x + this.cameras.main.scrollX;
        const worldY = pointer.y;

        // Find product at position
        const hitProduct = this.products.find(p => {
            if (p.collected) return false;
            const bounds = p.getBounds();
            return bounds.contains(worldX, worldY);
        });

        if (hitProduct) {
            this.collectItem(hitProduct);
        }
    }

    collectItem(sprite) {
        const productData = sprite.productData;

        // Check if item is on shopping list
        const listItem = this.shoppingList.find(
            li => li.id === productData.id && !li.found
        );

        if (listItem) {
            // Correct item!
            sprite.collected = true;
            listItem.found = true;
            this.foundItems.push(sprite);

            this.showFeedback('correct', '+100');
            this.playCollectEffect(sprite);
            this.updateShoppingListUI();
            this.playCollectSound();

            // Check for level complete
            if (this.foundItems.length === this.shoppingList.length) {
                this.time.delayedCall(500, () => this.completeLevel());
            }
        } else {
            // Wrong item
            this.mistakes++;
            this.showFeedback('wrong', 'Nope!');
            this.shakeProduct(sprite);
            this.playWrongSound();
        }
    }

    showFeedback(type, text) {
        this.feedbackText.setText(text);
        this.feedbackText.setColor(type === 'correct' ? '#4caf50' : '#f44336');
        this.feedbackText.setAlpha(1).setScale(0.5);

        this.tweens.add({
            targets: this.feedbackText,
            scale: { from: 0.5, to: 1.2 },
            alpha: { from: 1, to: 0 },
            duration: 600,
            ease: 'Back.easeOut'
        });
    }

    playCollectEffect(sprite) {
        // Scale down and fade
        this.tweens.add({
            targets: sprite,
            alpha: 0,
            scaleX: 0,
            scaleY: 0,
            duration: 300,
            ease: 'Back.easeIn'
        });

        // Particle burst
        const particles = this.add.particles(sprite.x, sprite.y, 'particle', {
            speed: { min: 100, max: 200 },
            scale: { start: 0.5, end: 0 },
            alpha: { start: 1, end: 0 },
            tint: 0x4caf50,
            lifespan: 400,
            quantity: 10
        });

        this.time.delayedCall(500, () => particles.destroy());
    }

    shakeProduct(sprite) {
        this.tweens.add({
            targets: sprite,
            x: { from: sprite.x - 5, to: sprite.x + 5 },
            duration: 50,
            yoyo: true,
            repeat: 5,
            ease: 'Sine.easeInOut',
            onComplete: () => {
                sprite.x = sprite.x; // Reset position
            }
        });
    }

    playCollectSound() {
        // Web Audio synthesis for collect sound
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);
            oscillator.type = 'sine';

            const now = ctx.currentTime;
            oscillator.frequency.setValueAtTime(523, now);
            oscillator.frequency.setValueAtTime(659, now + 0.08);
            oscillator.frequency.setValueAtTime(784, now + 0.16);

            gainNode.gain.setValueAtTime(0.3, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

            oscillator.start(now);
            oscillator.stop(now + 0.3);
        } catch (e) {
            // Audio not supported
        }
    }

    playWrongSound() {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);
            oscillator.type = 'square';

            const now = ctx.currentTime;
            oscillator.frequency.setValueAtTime(200, now);
            oscillator.frequency.setValueAtTime(150, now + 0.1);

            gainNode.gain.setValueAtTime(0.2, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

            oscillator.start(now);
            oscillator.stop(now + 0.2);
        } catch (e) {
            // Audio not supported
        }
    }

    startLevel() {
        this.startTime = this.time.now;
    }

    completeLevel() {
        this.elapsedTime = (this.time.now - this.startTime) / 1000;

        // Calculate score
        this.score = calculateScore(
            this.levelConfig,
            this.elapsedTime,
            this.mistakes,
            this.foundItems.length
        );

        // Calculate stars
        const stars = calculateStars(this.levelConfig, this.elapsedTime, this.mistakes);

        // Update total score
        let totalScore = this.registry.get('totalScore') || 0;
        totalScore += this.score;
        this.registry.set('totalScore', totalScore);

        // Update level stars
        const levelStars = this.registry.get('levelStars') || {};
        const prevStars = levelStars[this.currentLevel] || 0;
        if (stars > prevStars) {
            levelStars[this.currentLevel] = stars;
            this.registry.set('levelStars', levelStars);
        }

        // Save progress
        this.saveProgress();

        // Play level complete sound
        this.playLevelCompleteSound();

        // Launch level complete scene
        this.scene.launch('LevelCompleteScene', {
            level: this.currentLevel,
            score: this.score,
            totalScore: totalScore,
            time: this.elapsedTime,
            mistakes: this.mistakes,
            itemsFound: this.foundItems.length,
            stars: stars
        });
    }

    playLevelCompleteSound() {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const notes = [523, 587, 659, 698, 784, 880, 988, 1047];

            notes.forEach((freq, i) => {
                const oscillator = ctx.createOscillator();
                const gainNode = ctx.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(ctx.destination);
                oscillator.type = 'sine';

                const startTime = ctx.currentTime + i * 0.1;
                oscillator.frequency.setValueAtTime(freq, startTime);
                gainNode.gain.setValueAtTime(0.2, startTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.15);

                oscillator.start(startTime);
                oscillator.stop(startTime + 0.15);
            });
        } catch (e) {
            // Audio not supported
        }
    }

    saveProgress() {
        const progress = {
            currentLevel: this.currentLevel + 1,
            totalScore: this.registry.get('totalScore'),
            levelStars: this.registry.get('levelStars')
        };
        localStorage.setItem('hiddenObjectProgress', JSON.stringify(progress));
    }

    update(time, delta) {
        // Update timer
        if (this.startTime > 0) {
            this.elapsedTime = (time - this.startTime) / 1000;
            const minutes = Math.floor(this.elapsedTime / 60);
            const seconds = Math.floor(this.elapsedTime % 60);
            this.timerText.setText(`${minutes}:${seconds.toString().padStart(2, '0')}`);
        }

        // Momentum scrolling
        if (!this.isDragging && Math.abs(this.scrollVelocity) > 0.5) {
            this.cameras.main.scrollX = Phaser.Math.Clamp(
                this.cameras.main.scrollX + this.scrollVelocity,
                0,
                this.maxScrollX
            );
            this.scrollVelocity *= 0.92;
        }

        // Update scroll indicators
        this.leftIndicator.setVisible(this.cameras.main.scrollX > 10);
        this.rightIndicator.setVisible(this.cameras.main.scrollX < this.maxScrollX - 10);
    }
}
