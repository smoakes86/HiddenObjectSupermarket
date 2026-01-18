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
        const worldWidth = this.levelConfig.itemsPerShelf * 85 + 60;

        // Warm cream background gradient
        const bg = this.add.graphics();
        bg.fillGradientStyle(0xFFF8E7, 0xFFF8E7, 0xFFEED6, 0xFFE8CC, 1);
        bg.fillRect(0, 0, worldWidth, height);

        // Subtle wall pattern (vertical stripes)
        const wallPattern = this.add.graphics();
        wallPattern.fillStyle(0xFFE4CC, 0.3);
        for (let x = 0; x < worldWidth; x += 60) {
            wallPattern.fillRect(x, 0, 2, height - 120);
        }

        // Warm header area (store ceiling)
        const ceiling = this.add.graphics();
        ceiling.fillGradientStyle(0xFFE8D6, 0xFFE8D6, 0xFFF0E0, 0xFFF0E0, 1);
        ceiling.fillRect(0, 0, worldWidth, 55);

        // Decorative molding
        ceiling.fillStyle(0xD4A574, 1);
        ceiling.fillRect(0, 50, worldWidth, 6);
        ceiling.fillStyle(0xE8C4A0, 1);
        ceiling.fillRect(0, 53, worldWidth, 3);

        // Add warm ceiling lights
        this.createCeilingLights(worldWidth);

        // Create warm floor tiles
        this.createFloorTiles(worldWidth, height);
    }

    createCeilingLights(worldWidth) {
        const lightSpacing = 200;
        const lightY = 25;

        for (let x = 100; x < worldWidth; x += lightSpacing) {
            // Warm pendant light fixture
            const fixture = this.add.graphics();

            // Cord
            fixture.lineStyle(3, 0x8B7355, 1);
            fixture.lineBetween(x, 0, x, lightY - 15);

            // Lamp shade (warm terracotta)
            fixture.fillStyle(0xD4A574, 1);
            fixture.beginPath();
            fixture.moveTo(x - 25, lightY - 10);
            fixture.lineTo(x + 25, lightY - 10);
            fixture.lineTo(x + 18, lightY + 8);
            fixture.lineTo(x - 18, lightY + 8);
            fixture.closePath();
            fixture.fillPath();

            // Inner glow
            fixture.fillStyle(0xFFE8B0, 1);
            fixture.fillRect(x - 15, lightY + 5, 30, 5);

            // Light glow effect
            const glow = this.add.graphics();

            // Warm outer glow
            glow.fillStyle(0xFFE8B0, 0.04);
            glow.fillCircle(x, lightY + 50, 100);

            // Middle glow
            glow.fillStyle(0xFFE8B0, 0.06);
            glow.fillCircle(x, lightY + 35, 60);

            // Inner glow
            glow.fillStyle(0xFFE8B0, 0.1);
            glow.fillCircle(x, lightY + 20, 35);
        }
    }

    createFloorTiles(worldWidth, height) {
        const floorY = height - 120;
        const floorHeight = 120;
        const tileSize = 45;

        // Floor base (warm wood color)
        const floorBase = this.add.graphics();
        floorBase.fillStyle(0xD4A574, 1);
        floorBase.fillRect(0, floorY, worldWidth, floorHeight);

        // Wood plank pattern
        const tiles = this.add.graphics();
        const tilesAcross = Math.ceil(worldWidth / tileSize) + 1;

        for (let row = 0; row < 3; row++) {
            const offset = row % 2 === 0 ? 0 : tileSize / 2;
            for (let col = -1; col < tilesAcross; col++) {
                const x = col * tileSize + offset;
                const y = floorY + row * 40;

                // Alternate wood tones
                const isLight = (row + col) % 2 === 0;
                const baseColor = isLight ? 0xC99B6D : 0xB8895E;

                tiles.fillStyle(baseColor, 1);
                tiles.fillRect(x, y, tileSize - 2, 38);

                // Wood grain highlight
                tiles.fillStyle(0xFFFFFF, 0.1);
                tiles.fillRect(x + 5, y + 5, tileSize - 15, 2);
                tiles.fillRect(x + 10, y + 15, tileSize - 25, 1);

                // Subtle shadow between planks
                tiles.fillStyle(0x8B6914, 0.3);
                tiles.fillRect(x + tileSize - 3, y, 3, 38);
            }
        }

        // Floor shine
        const shine = this.add.graphics();
        shine.fillStyle(0xFFFFFF, 0.08);
        shine.fillRect(0, floorY + 5, worldWidth, 25);

        // Baseboard (warm wood)
        const baseboard = this.add.graphics();
        baseboard.fillStyle(0x8B6914, 1);
        baseboard.fillRect(0, floorY - 8, worldWidth, 10);
        baseboard.fillStyle(0xA67C3D, 1);
        baseboard.fillRect(0, floorY - 8, worldWidth, 4);
    }

    createShelves() {
        const { shelfCount, itemsPerShelf, categories } = this.levelConfig;

        // Generate shopping list
        this.shoppingList = generateShoppingList(this.levelConfig);
        this.shoppingList.forEach(item => item.found = false);

        // Shelf slot dimensions - wider spacing for better visibility
        const slotWidth = 85;
        const shelfPadding = 30;

        // Calculate world width
        const shelfWidth = itemsPerShelf * slotWidth + shelfPadding * 2;
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
        const productPool = getRandomItems(100, categories);

        // Create array of products to place on shelves
        const shelfProducts = [];

        // First, add all shopping list items (these MUST be on the shelves)
        this.shoppingList.forEach(item => {
            shelfProducts.push({ ...item, isTarget: true });
        });

        // Fill remaining slots with random products from the pool
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
                const x = shelfPadding + i * slotWidth;
                this.add.tileSprite(x, y, slotWidth, 110, 'shelf_back').setOrigin(0, 0);
            }

            // Draw shelf surface
            for (let i = 0; i < itemsPerShelf; i++) {
                const x = shelfPadding + i * slotWidth;
                this.add.tileSprite(x, y + 95, slotWidth, 16, 'shelf_surface').setOrigin(0, 0);
            }

            // Place products - fill EVERY slot
            for (let i = 0; i < itemsPerShelf; i++) {
                const product = shelfProducts[productIndex];
                const x = shelfPadding + i * slotWidth + slotWidth / 2;
                const prodY = y + 60;

                const sprite = this.add.sprite(x, prodY, product.id);
                sprite.setScale(0.65); // Scale products to fit slots
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

        // Header background (warm store banner style)
        const headerBg = this.add.graphics();

        // Main header background
        headerBg.fillStyle(0x6BBF59, 1);
        headerBg.fillRoundedRect(5, 5, width - 10, 55, { tl: 12, tr: 12, bl: 0, br: 0 });

        // Highlight stripe
        headerBg.fillStyle(0x7DD169, 1);
        headerBg.fillRect(5, 5, width - 10, 8);

        // Bottom shadow
        headerBg.fillStyle(0x4A9E3D, 1);
        headerBg.fillRect(5, 55, width - 10, 5);

        this.uiContainer.add(headerBg);

        // Level badge
        const levelBadge = this.add.graphics();
        levelBadge.fillStyle(0xFFD93D, 1);
        levelBadge.fillRoundedRect(12, 15, 85, 35, 10);
        levelBadge.fillStyle(0xE8C42A, 1);
        levelBadge.fillRoundedRect(12, 42, 85, 8, { tl: 0, tr: 0, bl: 10, br: 10 });
        this.uiContainer.add(levelBadge);

        this.levelText = this.add.text(54, 32, `Level ${this.currentLevel}`, {
            fontFamily: 'Fredoka, Arial, sans-serif',
            fontSize: '16px',
            fontStyle: '600',
            color: '#5D4E37'
        }).setOrigin(0.5);
        this.uiContainer.add(this.levelText);

        // Timer with clock icon style
        const timerBg = this.add.graphics();
        timerBg.fillStyle(0xFFFFFF, 0.25);
        timerBg.fillRoundedRect(width / 2 - 40, 15, 80, 35, 17);
        this.uiContainer.add(timerBg);

        this.timerText = this.add.text(width / 2, 32, '0:00', {
            fontFamily: 'Nunito, Arial, sans-serif',
            fontSize: '20px',
            fontStyle: '700',
            color: '#FFFFFF'
        }).setOrigin(0.5);
        this.uiContainer.add(this.timerText);

        // Score badge
        const scoreBadge = this.add.graphics();
        scoreBadge.fillStyle(0xFF8C5A, 1);
        scoreBadge.fillRoundedRect(width - 97, 15, 85, 35, 10);
        scoreBadge.fillStyle(0xE07A4A, 1);
        scoreBadge.fillRoundedRect(width - 97, 42, 85, 8, { tl: 0, tr: 0, bl: 10, br: 10 });
        this.uiContainer.add(scoreBadge);

        const totalScore = this.registry.get('totalScore') || 0;
        this.scoreText = this.add.text(width - 55, 32, `${totalScore}`, {
            fontFamily: 'Fredoka, Arial, sans-serif',
            fontSize: '16px',
            fontStyle: '600',
            color: '#FFFFFF'
        }).setOrigin(0.5);
        this.uiContainer.add(this.scoreText);

        // Shopping list UI (bottom) - notepad style
        this.createShoppingListUI();

        // Feedback text
        this.feedbackText = this.add.text(width / 2, this.cameras.main.height / 2 - 40, '', {
            fontFamily: 'Fredoka, Arial, sans-serif',
            fontSize: '42px',
            fontStyle: '700',
            color: '#6BBF59',
            stroke: '#FFFFFF',
            strokeThickness: 4
        }).setOrigin(0.5).setAlpha(0).setScrollFactor(0).setDepth(101);

        // Scroll indicators
        this.createScrollIndicators();
    }

    createShoppingListUI() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Shopping list background (notepad style)
        const listBg = this.add.graphics();

        // Paper background
        listBg.fillStyle(0xFFFBF0, 1);
        listBg.fillRoundedRect(5, height - 125, width - 10, 120, { tl: 16, tr: 16, bl: 0, br: 0 });

        // Red line at top (like a notepad)
        listBg.fillStyle(0xFF8C5A, 1);
        listBg.fillRect(5, height - 125, width - 10, 4);

        // Subtle lines
        listBg.lineStyle(1, 0xE8DDD0, 1);
        for (let y = height - 95; y < height - 10; y += 20) {
            listBg.lineBetween(15, y, width - 15, y);
        }

        // Left margin line
        listBg.lineStyle(2, 0xFFB7B7, 0.5);
        listBg.lineBetween(35, height - 120, 35, height);

        // Shadow at top
        listBg.fillStyle(0x5D4E37, 0.08);
        listBg.fillRect(5, height - 125, width - 10, 10);

        this.uiContainer.add(listBg);

        // Title with cart icon
        const listTitle = this.add.text(50, height - 118, '🛒 Shopping List', {
            fontFamily: 'Fredoka, Arial, sans-serif',
            fontSize: '14px',
            fontStyle: '600',
            color: '#8B7355'
        });
        this.uiContainer.add(listTitle);

        // Items found counter
        this.foundCounter = this.add.text(width - 20, height - 118, '0/' + this.shoppingList.length, {
            fontFamily: 'Nunito, Arial, sans-serif',
            fontSize: '14px',
            fontStyle: '700',
            color: '#6BBF59'
        }).setOrigin(1, 0);
        this.uiContainer.add(this.foundCounter);

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
        const startX = 45;

        // Show names on easy/medium levels
        const showNames = this.levelConfig.difficulty === 'easy' || this.levelConfig.difficulty === 'medium';
        const itemHeight = showNames ? 55 : 42;
        const startY = height - (showNames ? 95 : 88);
        const itemWidth = 68;

        // Update found counter
        const foundCount = this.foundItems.length;
        if (this.foundCounter) {
            this.foundCounter.setText(`${foundCount}/${this.shoppingList.length}`);
        }

        this.shoppingList.forEach((item, index) => {
            const x = startX + (index % 5) * itemWidth;
            const y = startY + Math.floor(index / 5) * (itemHeight + 5);

            // Item card background
            const bg = this.add.graphics();
            if (item.found) {
                // Found - green with check pattern
                bg.fillStyle(0x6BBF59, 1);
                bg.fillRoundedRect(x, y, 60, itemHeight, 8);
                bg.fillStyle(0x5AAF49, 1);
                bg.fillRoundedRect(x, y + itemHeight - 8, 60, 8, { tl: 0, tr: 0, bl: 8, br: 8 });
            } else {
                // Not found - cream card
                bg.fillStyle(0xFFF5E6, 1);
                bg.fillRoundedRect(x, y, 60, itemHeight, 8);
                bg.lineStyle(2, 0xE8DDD0, 1);
                bg.strokeRoundedRect(x, y, 60, itemHeight, 8);
            }
            this.shoppingListContainer.add(bg);

            // Product sprite
            const spriteY = showNames ? y + 18 : y + 21;
            const sprite = this.add.sprite(x + 30, spriteY, item.id);
            sprite.setScale(showNames ? 0.38 : 0.42);
            if (item.found) {
                sprite.setAlpha(0.7);
            }
            this.shoppingListContainer.add(sprite);

            // Product name (on easier levels)
            if (showNames) {
                let displayName = item.name || item.id;
                if (displayName.length > 8) {
                    displayName = displayName.substring(0, 7) + '.';
                }
                const nameText = this.add.text(x + 30, y + itemHeight - 10, displayName, {
                    fontFamily: 'Nunito, Arial, sans-serif',
                    fontSize: '9px',
                    fontStyle: '600',
                    color: item.found ? '#FFFFFF' : '#8B7355'
                }).setOrigin(0.5);
                this.shoppingListContainer.add(nameText);
            }

            // Checkmark for found items
            if (item.found) {
                const checkBg = this.add.graphics();
                checkBg.fillStyle(0xFFFFFF, 1);
                checkBg.fillCircle(x + 48, y + 10, 10);
                this.shoppingListContainer.add(checkBg);

                const check = this.add.text(x + 48, y + 10, '✓', {
                    fontFamily: 'Arial',
                    fontSize: '14px',
                    fontStyle: 'bold',
                    color: '#6BBF59'
                }).setOrigin(0.5);
                this.shoppingListContainer.add(check);
            }
        });
    }

    createScrollIndicators() {
        const height = this.cameras.main.height;
        const width = this.cameras.main.width;

        // Left indicator (arrow in circle)
        const leftBg = this.add.graphics();
        leftBg.fillStyle(0x5D4E37, 0.3);
        leftBg.fillCircle(25, height / 2 - 60, 20);
        this.leftIndicator = this.add.container(0, 0, [leftBg]);

        const leftArrow = this.add.text(25, height / 2 - 60, '◀', {
            fontFamily: 'Arial',
            fontSize: '18px',
            color: '#FFFFFF'
        }).setOrigin(0.5);
        this.leftIndicator.add(leftArrow);
        this.leftIndicator.setAlpha(0).setScrollFactor(0).setDepth(50);

        // Right indicator
        const rightBg = this.add.graphics();
        rightBg.fillStyle(0x5D4E37, 0.3);
        rightBg.fillCircle(width - 25, height / 2 - 60, 20);
        this.rightIndicator = this.add.container(0, 0, [rightBg]);

        const rightArrow = this.add.text(width - 25, height / 2 - 60, '▶', {
            fontFamily: 'Arial',
            fontSize: '18px',
            color: '#FFFFFF'
        }).setOrigin(0.5);
        this.rightIndicator.add(rightArrow);
        this.rightIndicator.setAlpha(0.7).setScrollFactor(0).setDepth(50);

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
        if (type === 'correct') {
            this.feedbackText.setColor('#6BBF59');
            this.feedbackText.setStroke('#FFFFFF', 4);
        } else {
            this.feedbackText.setColor('#FF6B6B');
            this.feedbackText.setStroke('#FFFFFF', 4);
        }
        this.feedbackText.setAlpha(1).setScale(0.5);

        this.tweens.add({
            targets: this.feedbackText,
            scale: { from: 0.5, to: 1.3 },
            y: this.feedbackText.y - 30,
            alpha: { from: 1, to: 0 },
            duration: 700,
            ease: 'Back.easeOut',
            onComplete: () => {
                this.feedbackText.setY(this.cameras.main.height / 2 - 40);
            }
        });
    }

    playCollectEffect(sprite) {
        const currentScale = sprite.scale;

        // Scale up slightly then shrink to nothing
        this.tweens.add({
            targets: sprite,
            alpha: 0,
            scaleX: currentScale * 1.4,
            scaleY: currentScale * 1.4,
            duration: 200,
            ease: 'Back.easeIn',
            onComplete: () => {
                this.tweens.add({
                    targets: sprite,
                    scaleX: 0,
                    scaleY: 0,
                    duration: 150
                });
            }
        });

        // Particle burst with warm colors
        const particles = this.add.particles(sprite.x, sprite.y, 'particle', {
            speed: { min: 100, max: 200 },
            scale: { start: 0.6, end: 0 },
            alpha: { start: 1, end: 0 },
            tint: [0x6BBF59, 0xFFD93D, 0xFF8C5A],
            lifespan: 500,
            quantity: 12
        });

        this.time.delayedCall(600, () => particles.destroy());
    }

    shakeProduct(sprite) {
        // Red tint flash
        sprite.setTint(0xFF6B6B);

        this.tweens.add({
            targets: sprite,
            x: { from: sprite.x - 6, to: sprite.x + 6 },
            duration: 50,
            yoyo: true,
            repeat: 4,
            ease: 'Sine.easeInOut',
            onComplete: () => {
                sprite.clearTint();
            }
        });
    }

    playCollectSound() {
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
