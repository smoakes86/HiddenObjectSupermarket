// Main game logic

class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        // Game state
        this.state = 'start'; // start, playing, paused, levelComplete
        this.currentLevel = 1;
        this.score = 0;
        this.totalScore = 0;

        // Level state
        this.shelfData = null;
        this.shoppingList = [];
        this.foundItems = [];
        this.mistakes = 0;
        this.startTime = 0;
        this.elapsedTime = 0;

        // Scrolling
        this.scrollX = 0;
        this.targetScrollX = 0;
        this.maxScrollX = 0;
        this.isDragging = false;
        this.dragStartX = 0;
        this.dragStartScrollX = 0;
        this.lastDragX = 0;
        this.velocity = 0;

        // Animation
        this.highlightedItem = null;
        this.feedbackQueue = [];
        this.animations = [];

        // Touch handling
        this.touchStartTime = 0;
        this.touchStartPos = { x: 0, y: 0 };
        this.hasMoved = false;

        // Bind methods
        this.update = this.update.bind(this);
        this.render = this.render.bind(this);

        // Setup
        this.resize();
        this.setupEventListeners();
    }

    resize() {
        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.getBoundingClientRect();

        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;

        // Reset transform before scaling (setting canvas dimensions should reset, but be explicit)
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.scale(dpr, dpr);

        this.width = rect.width;
        this.height = rect.height;
    }

    setupEventListeners() {
        // Touch events
        this.canvas.addEventListener('touchstart', this.onTouchStart.bind(this), { passive: false });
        this.canvas.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: false });
        this.canvas.addEventListener('touchend', this.onTouchEnd.bind(this), { passive: false });

        // Mouse events (for desktop testing)
        this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
        this.canvas.addEventListener('mouseleave', this.onMouseUp.bind(this));

        // Window resize
        window.addEventListener('resize', () => {
            this.resize();
        });
    }

    // Touch handlers
    onTouchStart(e) {
        if (this.state !== 'playing') return;
        e.preventDefault();

        const touch = e.touches[0];
        const pos = this.getTouchPos(touch);

        this.touchStartTime = Date.now();
        this.touchStartPos = pos;
        this.hasMoved = false;

        this.isDragging = true;
        this.dragStartX = pos.x;
        this.dragStartScrollX = this.scrollX;
        this.lastDragX = pos.x;
        this.velocity = 0;
    }

    onTouchMove(e) {
        if (!this.isDragging || this.state !== 'playing') return;
        e.preventDefault();

        const touch = e.touches[0];
        const pos = this.getTouchPos(touch);

        const deltaX = pos.x - this.lastDragX;
        const totalDelta = Math.abs(pos.x - this.touchStartPos.x) + Math.abs(pos.y - this.touchStartPos.y);

        if (totalDelta > 10) {
            this.hasMoved = true;
        }

        this.velocity = deltaX;
        this.scrollX = Utils.clamp(
            this.dragStartScrollX - (pos.x - this.dragStartX),
            0,
            this.maxScrollX
        );

        this.lastDragX = pos.x;
    }

    onTouchEnd(e) {
        if (this.state !== 'playing') return;

        const touchDuration = Date.now() - this.touchStartTime;

        // If it was a quick tap without much movement, treat as a tap
        if (!this.hasMoved && touchDuration < 300) {
            this.handleTap(this.touchStartPos.x, this.touchStartPos.y);
        } else {
            // Apply momentum scrolling
            this.targetScrollX = Utils.clamp(
                this.scrollX - this.velocity * 10,
                0,
                this.maxScrollX
            );
        }

        this.isDragging = false;
    }

    // Mouse handlers
    onMouseDown(e) {
        if (this.state !== 'playing') return;

        const pos = this.getMousePos(e);

        this.touchStartTime = Date.now();
        this.touchStartPos = pos;
        this.hasMoved = false;

        this.isDragging = true;
        this.dragStartX = pos.x;
        this.dragStartScrollX = this.scrollX;
        this.lastDragX = pos.x;
        this.velocity = 0;
    }

    onMouseMove(e) {
        if (!this.isDragging || this.state !== 'playing') return;

        const pos = this.getMousePos(e);
        const deltaX = pos.x - this.lastDragX;
        const totalDelta = Math.abs(pos.x - this.touchStartPos.x) + Math.abs(pos.y - this.touchStartPos.y);

        if (totalDelta > 5) {
            this.hasMoved = true;
        }

        this.velocity = deltaX;
        this.scrollX = Utils.clamp(
            this.dragStartScrollX - (pos.x - this.dragStartX),
            0,
            this.maxScrollX
        );

        this.lastDragX = pos.x;

        // Highlight item under cursor
        const item = Shelf.findItemAt(this.shelfData, pos.x, pos.y);
        this.highlightedItem = item;
    }

    onMouseUp(e) {
        if (this.state !== 'playing') return;

        const touchDuration = Date.now() - this.touchStartTime;

        if (!this.hasMoved && touchDuration < 300) {
            this.handleTap(this.touchStartPos.x, this.touchStartPos.y);
        } else {
            this.targetScrollX = Utils.clamp(
                this.scrollX - this.velocity * 8,
                0,
                this.maxScrollX
            );
        }

        this.isDragging = false;
        this.highlightedItem = null;
    }

    getTouchPos(touch) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: touch.clientX - rect.left,
            y: touch.clientY - rect.top
        };
    }

    getMousePos(e) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    handleTap(x, y) {
        const item = Shelf.findItemAt(this.shelfData, x, y);

        if (item) {
            this.collectItem(item);
        }
    }

    collectItem(item) {
        // Check if item is on shopping list
        const listItem = this.shoppingList.find(
            li => li.id === item.product.id && !li.found
        );

        if (listItem) {
            // Correct item!
            item.collected = true;
            listItem.found = true;
            this.foundItems.push(item);

            this.showFeedback('correct', '+100');
            this.addCollectAnimation(item);
            this.updateShoppingListUI();
            Audio.playCollect();

            // Check for level complete
            if (this.foundItems.length === this.shoppingList.length) {
                this.completeLevel();
            }
        } else {
            // Wrong item
            this.mistakes++;
            this.showFeedback('wrong', 'Nope!');
            this.addShakeAnimation(item);
            Audio.playWrong();
        }
    }

    showFeedback(type, text) {
        const feedback = document.getElementById('feedback');
        feedback.textContent = text;
        feedback.className = type;

        // Force reflow to restart animation
        feedback.offsetHeight;

        setTimeout(() => {
            feedback.style.animation = 'fadeOut 0.3s ease-out forwards';
            setTimeout(() => {
                feedback.className = 'hidden';
                feedback.style.animation = '';
            }, 300);
        }, 400);
    }

    addCollectAnimation(item) {
        this.animations.push({
            type: 'collect',
            item: item,
            startTime: Date.now(),
            duration: 500,
            startX: item.screenX + item.screenWidth / 2,
            startY: item.screenY + item.screenHeight / 2
        });
    }

    addShakeAnimation(item) {
        this.animations.push({
            type: 'shake',
            item: item,
            startTime: Date.now(),
            duration: 300
        });
    }

    updateShoppingListUI() {
        const listElement = document.getElementById('list-items');
        listElement.innerHTML = '';

        this.shoppingList.forEach(item => {
            const li = document.createElement('li');
            li.className = item.found ? 'found' : '';

            // Item preview canvas
            const canvas = document.createElement('canvas');
            canvas.className = 'item-preview';
            canvas.width = 40;
            canvas.height = 40;
            const ctx = canvas.getContext('2d');
            Products.draw(ctx, item, 0, 0, 40, 40, false);
            li.appendChild(canvas);

            // Item name
            const name = document.createTextNode(item.name);
            li.appendChild(name);

            // Checkmark for found items
            if (item.found) {
                const check = document.createElement('span');
                check.textContent = ' ✓';
                li.appendChild(check);
            }

            listElement.appendChild(li);
        });
    }

    startLevel(levelNumber) {
        this.currentLevel = levelNumber;
        const levelConfig = Levels.getLevel(levelNumber);

        // Generate shopping list
        this.shoppingList = Levels.generateShoppingList(levelConfig);
        this.shoppingList.forEach(item => item.found = false);

        // Generate shelf layout
        this.shelfData = Shelf.generate({
            ...levelConfig,
            targetItems: this.shoppingList
        });

        // Reset level state
        this.foundItems = [];
        this.mistakes = 0;
        this.scrollX = 0;
        this.targetScrollX = 0;
        this.velocity = 0;
        this.maxScrollX = Math.max(0, this.shelfData.width - this.width + 100);
        this.startTime = Date.now();
        this.animations = [];
        this.highlightedItem = null;
        this.isDragging = false;

        // Update UI
        document.getElementById('level-number').textContent = levelNumber;
        document.getElementById('score').textContent = this.totalScore;
        this.updateShoppingListUI();

        // Hide modals
        document.getElementById('start-screen').classList.add('hidden');
        document.getElementById('level-complete').classList.add('hidden');

        this.state = 'playing';
    }

    completeLevel() {
        this.state = 'levelComplete';
        this.elapsedTime = (Date.now() - this.startTime) / 1000;
        Audio.playLevelComplete();

        // Calculate score
        const levelConfig = Levels.getLevel(this.currentLevel);
        this.score = Levels.calculateScore(
            levelConfig,
            this.elapsedTime,
            this.mistakes,
            this.foundItems.length
        );
        this.totalScore += this.score;

        // Calculate stars
        const stars = Levels.calculateStars(levelConfig, this.elapsedTime, this.mistakes);

        // Save best stars for this level
        if (!this.levelStars) this.levelStars = {};
        const prevStars = this.levelStars[this.currentLevel] || 0;
        if (stars > prevStars) {
            this.levelStars[this.currentLevel] = stars;
        }

        // Save progress
        this.saveProgress();

        // Update UI
        document.getElementById('items-found').textContent = this.foundItems.length;
        document.getElementById('time-taken').textContent = Math.floor(this.elapsedTime);
        document.getElementById('final-score').textContent = this.score;
        document.getElementById('score').textContent = this.totalScore;

        // Show stars
        const starContainer = document.getElementById('star-rating');
        starContainer.innerHTML = '';
        for (let i = 0; i < 3; i++) {
            const star = document.createElement('span');
            star.className = 'star' + (i < stars ? ' filled' : '');
            star.textContent = '★';
            starContainer.appendChild(star);
        }

        // Show modal
        setTimeout(() => {
            document.getElementById('level-complete').classList.remove('hidden');
        }, 500);
    }

    update() {
        if (this.state !== 'playing') return;

        // Smooth scrolling
        if (!this.isDragging) {
            const diff = this.targetScrollX - this.scrollX;
            this.scrollX += diff * 0.15;

            // Apply friction to velocity
            this.velocity *= 0.95;
        }

        // Update elapsed time
        this.elapsedTime = (Date.now() - this.startTime) / 1000;

        // Update timer display
        document.getElementById('timer').textContent = Utils.formatTime(this.elapsedTime);

        // Update animations
        this.animations = this.animations.filter(anim => {
            const elapsed = Date.now() - anim.startTime;
            return elapsed < anim.duration;
        });
    }

    render() {
        if (!this.shelfData) return;

        // Clear canvas
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Draw shelf
        Shelf.draw(
            this.ctx,
            this.shelfData,
            this.scrollX,
            this.width,
            this.height,
            this.highlightedItem
        );

        // Draw animations
        this.renderAnimations();
    }

    renderAnimations() {
        this.animations.forEach(anim => {
            const elapsed = Date.now() - anim.startTime;
            const progress = Math.min(1, elapsed / anim.duration);

            if (anim.type === 'collect') {
                // Particle burst effect
                const particleCount = 8;
                for (let i = 0; i < particleCount; i++) {
                    const angle = (i / particleCount) * Math.PI * 2;
                    const distance = progress * 50;
                    const x = anim.startX + Math.cos(angle) * distance;
                    const y = anim.startY + Math.sin(angle) * distance;
                    const alpha = 1 - progress;
                    const radius = Math.max(0, 5 * (1 - progress));

                    this.ctx.beginPath();
                    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
                    this.ctx.fillStyle = `rgba(76, 175, 80, ${alpha})`;
                    this.ctx.fill();
                }
            }
        });
    }

    gameLoop() {
        this.update();
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }

    start() {
        this.loadProgress();
        this.gameLoop();
    }

    // Save/Load Progress
    saveProgress() {
        const progress = {
            currentLevel: this.currentLevel,
            totalScore: this.totalScore,
            levelStars: this.levelStars || {}
        };
        localStorage.setItem('hiddenObjectProgress', JSON.stringify(progress));
    }

    loadProgress() {
        const saved = localStorage.getItem('hiddenObjectProgress');
        if (saved) {
            const progress = JSON.parse(saved);
            this.currentLevel = progress.currentLevel || 1;
            this.totalScore = progress.totalScore || 0;
            this.levelStars = progress.levelStars || {};
            document.getElementById('score').textContent = this.totalScore;
        } else {
            this.levelStars = {};
        }
    }

    clearProgress() {
        localStorage.removeItem('hiddenObjectProgress');
        this.currentLevel = 1;
        this.totalScore = 0;
        this.levelStars = {};
        document.getElementById('score').textContent = 0;
    }
}
