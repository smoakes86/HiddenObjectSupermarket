// Shelf rendering and item placement

const Shelf = {
    // Shelf configuration
    config: {
        shelfHeight: 110,
        shelfPadding: 15,
        itemWidth: 60,
        itemHeight: 80,
        shelfColor: '#5d4037',
        shelfLightColor: '#8d6e63',
        backgroundColor: '#f5f5dc',
        floorColor: '#d7ccc8',
        ceilingColor: '#efebe9'
    },

    // Generate shelf layout for a level
    generate(levelConfig) {
        const {
            aisleLength,
            shelfCount,
            itemsPerShelf,
            categories,
            targetItems,
            difficulty
        } = levelConfig;

        const shelves = [];
        const allPlacedItems = [];

        // Get item pool from categories
        let itemPool = [];
        categories.forEach(catId => {
            itemPool = itemPool.concat(Products.getItemsByCategory(catId));
        });

        // Generate shelves
        for (let s = 0; s < shelfCount; s++) {
            const shelf = {
                y: s,
                items: []
            };

            // Place items on this shelf
            for (let i = 0; i < itemsPerShelf; i++) {
                const xPos = i * (this.config.itemWidth + 8);

                // Pick a random item from the pool
                const product = Utils.randomElement(itemPool);

                const item = {
                    id: Utils.generateId(),
                    product: product,
                    x: xPos,
                    shelfIndex: s,
                    collected: false,
                    hasSaleTag: Math.random() < 0.15 // 15% chance of sale tag
                };

                shelf.items.push(item);
                allPlacedItems.push(item);
            }

            shelves.push(shelf);
        }

        // Ensure target items are placed
        targetItems.forEach(targetProduct => {
            // Find a random position to place the target item
            const shelfIndex = Utils.randomInt(0, shelfCount - 1);
            const itemIndex = Utils.randomInt(0, shelves[shelfIndex].items.length - 1);

            // Replace the item at that position
            const existingItem = shelves[shelfIndex].items[itemIndex];
            existingItem.product = targetProduct;
            existingItem.isTarget = true;
        });

        return {
            shelves,
            width: itemsPerShelf * (this.config.itemWidth + 8),
            height: shelfCount * this.config.shelfHeight
        };
    },

    // Draw the entire aisle view
    draw(ctx, shelfData, scrollX, canvasWidth, canvasHeight, highlightedItem = null) {
        const { shelves, width } = shelfData;
        const { shelfHeight, itemWidth, itemHeight, shelfPadding } = this.config;

        // Clear and draw background
        this.drawBackground(ctx, canvasWidth, canvasHeight);

        // Calculate visible area
        const startX = Math.max(0, scrollX - 100);
        const endX = scrollX + canvasWidth + 100;

        // Draw floor tiles
        this.drawFloor(ctx, scrollX, canvasWidth, canvasHeight);

        // Calculate vertical positioning to center shelves
        const totalShelfHeight = shelves.length * shelfHeight;
        const startY = Math.max(50, (canvasHeight * 0.55 - totalShelfHeight) / 2);

        // Draw each shelf
        shelves.forEach((shelf, index) => {
            const shelfY = startY + index * shelfHeight;

            // Draw shelf bracket/back
            this.drawShelfBack(ctx, -scrollX, shelfY, width + 200, shelfHeight);

            // Draw items on shelf
            shelf.items.forEach((item, itemIndex) => {
                const itemScreenX = item.x - scrollX;

                // Only draw if visible
                if (itemScreenX > -itemWidth && itemScreenX < canvasWidth + itemWidth) {
                    if (!item.collected) {
                        const isHighlighted = highlightedItem && highlightedItem.id === item.id;
                        const itemY = shelfY + shelfPadding;

                        Products.draw(
                            ctx,
                            item.product,
                            itemScreenX,
                            itemY,
                            itemWidth,
                            itemHeight,
                            isHighlighted
                        );

                        // Draw sale tag on some items for visual variety
                        if (item.hasSaleTag) {
                            this.drawSaleTag(ctx, itemScreenX + itemWidth - 15, itemY - 5);
                        }

                        // Store screen position for hit detection
                        item.screenX = itemScreenX;
                        item.screenY = itemY;
                        item.screenWidth = itemWidth;
                        item.screenHeight = itemHeight;
                    }
                }
            });

            // Draw shelf surface
            this.drawShelfSurface(ctx, -scrollX, shelfY + itemHeight + shelfPadding, width + 200);
        });

        // Draw ceiling lights
        this.drawCeilingLights(ctx, scrollX, canvasWidth, startY - 30);

        // Draw scroll indicators if needed
        if (scrollX > 10) {
            this.drawScrollIndicator(ctx, 'left', canvasHeight);
        }
        if (scrollX < width - canvasWidth - 10) {
            this.drawScrollIndicator(ctx, 'right', canvasHeight);
        }
    },

    drawBackground(ctx, width, height) {
        // Gradient background
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, '#efebe9');
        gradient.addColorStop(0.3, '#f5f5dc');
        gradient.addColorStop(1, '#e8e4d9');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // Subtle pattern
        ctx.fillStyle = 'rgba(0,0,0,0.02)';
        for (let i = 0; i < width; i += 40) {
            for (let j = 0; j < height; j += 40) {
                if ((i + j) % 80 === 0) {
                    ctx.fillRect(i, j, 20, 20);
                }
            }
        }
    },

    drawFloor(ctx, scrollX, width, height) {
        const floorY = height * 0.85;
        const tileSize = 60;

        // Floor base
        ctx.fillStyle = '#d7ccc8';
        ctx.fillRect(0, floorY, width, height - floorY);

        // Tile pattern
        const startTile = Math.floor(scrollX / tileSize);
        for (let i = -1; i < width / tileSize + 2; i++) {
            const tileX = (i - (scrollX % tileSize) / tileSize) * tileSize;

            ctx.fillStyle = (startTile + i) % 2 === 0 ? '#c8beb7' : '#d7ccc8';
            ctx.fillRect(tileX, floorY, tileSize - 1, height - floorY);
        }

        // Floor line
        ctx.strokeStyle = '#a69b97';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, floorY);
        ctx.lineTo(width, floorY);
        ctx.stroke();
    },

    drawShelfBack(ctx, x, y, width, height) {
        // Back panel
        ctx.fillStyle = '#efebe9';
        ctx.fillRect(x, y, width, height);

        // Subtle shadow
        const gradient = ctx.createLinearGradient(x, y, x, y + 20);
        gradient.addColorStop(0, 'rgba(0,0,0,0.1)');
        gradient.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, width, 20);
    },

    drawShelfSurface(ctx, x, y, width) {
        const shelfDepth = 12;

        // Main shelf surface
        ctx.fillStyle = this.config.shelfColor;
        ctx.fillRect(x, y, width, shelfDepth);

        // Top highlight
        ctx.fillStyle = this.config.shelfLightColor;
        ctx.fillRect(x, y, width, 3);

        // Front edge shadow
        const shadowGradient = ctx.createLinearGradient(x, y + shelfDepth, x, y + shelfDepth + 8);
        shadowGradient.addColorStop(0, 'rgba(0,0,0,0.2)');
        shadowGradient.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = shadowGradient;
        ctx.fillRect(x, y + shelfDepth, width, 8);
    },

    drawCeilingLights(ctx, scrollX, width, y) {
        const lightSpacing = 200;
        const startLight = Math.floor(scrollX / lightSpacing);

        for (let i = -1; i < width / lightSpacing + 2; i++) {
            const lightX = (i * lightSpacing) - (scrollX % lightSpacing) + lightSpacing / 2;

            // Light fixture
            ctx.fillStyle = '#e0e0e0';
            ctx.fillRect(lightX - 30, y - 10, 60, 8);

            // Light glow
            const glowGradient = ctx.createRadialGradient(lightX, y, 0, lightX, y + 50, 100);
            glowGradient.addColorStop(0, 'rgba(255,255,200,0.15)');
            glowGradient.addColorStop(1, 'rgba(255,255,200,0)');
            ctx.fillStyle = glowGradient;
            ctx.beginPath();
            ctx.arc(lightX, y + 50, 100, 0, Math.PI * 2);
            ctx.fill();
        }
    },

    drawScrollIndicator(ctx, direction, canvasHeight) {
        const x = direction === 'left' ? 30 : ctx.canvas.width - 30;
        const y = canvasHeight * 0.5;

        ctx.save();
        ctx.globalAlpha = 0.5 + Math.sin(Date.now() / 300) * 0.2;

        ctx.fillStyle = 'white';
        ctx.beginPath();
        if (direction === 'left') {
            ctx.moveTo(x + 10, y - 15);
            ctx.lineTo(x - 10, y);
            ctx.lineTo(x + 10, y + 15);
        } else {
            ctx.moveTo(x - 10, y - 15);
            ctx.lineTo(x + 10, y);
            ctx.lineTo(x - 10, y + 15);
        }
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    },

    drawSaleTag(ctx, x, y) {
        ctx.save();

        // Tag shape
        ctx.fillStyle = '#f44336';
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + 22, y);
        ctx.lineTo(x + 22, y + 14);
        ctx.lineTo(x + 11, y + 18);
        ctx.lineTo(x, y + 14);
        ctx.closePath();
        ctx.fill();

        // Text
        ctx.fillStyle = 'white';
        ctx.font = 'bold 8px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('SALE', x + 11, y + 10);

        ctx.restore();
    },

    // Find item at screen position
    findItemAt(shelfData, screenX, screenY) {
        for (const shelf of shelfData.shelves) {
            for (const item of shelf.items) {
                if (item.collected) continue;
                if (item.screenX === undefined) continue;

                if (Utils.pointInRect(
                    screenX, screenY,
                    item.screenX, item.screenY,
                    item.screenWidth, item.screenHeight
                )) {
                    return item;
                }
            }
        }
        return null;
    }
};
