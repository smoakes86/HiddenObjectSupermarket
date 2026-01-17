// Product definitions and rendering

const Products = {
    // Product categories with items
    categories: {
        produce: {
            name: 'Produce',
            color: '#8BC34A',
            items: [
                { id: 'apple', name: 'Red Apple', color: '#e53935', shape: 'circle' },
                { id: 'green_apple', name: 'Green Apple', color: '#7cb342', shape: 'circle' },
                { id: 'banana', name: 'Banana', color: '#fdd835', shape: 'banana' },
                { id: 'orange', name: 'Orange', color: '#ff9800', shape: 'circle' },
                { id: 'lemon', name: 'Lemon', color: '#ffeb3b', shape: 'oval' },
                { id: 'tomato', name: 'Tomato', color: '#f44336', shape: 'circle' },
                { id: 'carrot', name: 'Carrot', color: '#ff7043', shape: 'carrot' },
                { id: 'broccoli', name: 'Broccoli', color: '#43a047', shape: 'broccoli' },
                { id: 'grape', name: 'Grapes', color: '#7b1fa2', shape: 'grapes' },
                { id: 'watermelon', name: 'Watermelon', color: '#4caf50', shape: 'watermelon' }
            ]
        },
        cereal: {
            name: 'Cereal',
            color: '#FF9800',
            items: [
                { id: 'corn_flakes', name: 'Corn Flakes', color: '#ffc107', shape: 'box', label: 'CF' },
                { id: 'oat_rings', name: 'Oat Rings', color: '#8d6e63', shape: 'box', label: 'OR' },
                { id: 'choco_puffs', name: 'Choco Puffs', color: '#5d4037', shape: 'box', label: 'CP' },
                { id: 'fruit_loops', name: 'Fruit Loops', color: '#e91e63', shape: 'box', label: 'FL' },
                { id: 'honey_crunch', name: 'Honey Crunch', color: '#ffb300', shape: 'box', label: 'HC' },
                { id: 'granola', name: 'Granola', color: '#795548', shape: 'box', label: 'GR' },
                { id: 'rice_pops', name: 'Rice Pops', color: '#90caf9', shape: 'box', label: 'RP' },
                { id: 'wheat_bites', name: 'Wheat Bites', color: '#a1887f', shape: 'box', label: 'WB' }
            ]
        },
        snacks: {
            name: 'Snacks',
            color: '#F44336',
            items: [
                { id: 'chips', name: 'Potato Chips', color: '#ffc107', shape: 'bag', label: 'PC' },
                { id: 'pretzels', name: 'Pretzels', color: '#8d6e63', shape: 'bag', label: 'PR' },
                { id: 'cookies', name: 'Cookies', color: '#795548', shape: 'box', label: 'CK' },
                { id: 'crackers', name: 'Crackers', color: '#ffcc80', shape: 'box', label: 'CR' },
                { id: 'popcorn', name: 'Popcorn', color: '#fff59d', shape: 'bag', label: 'PO' },
                { id: 'candy', name: 'Candy Bar', color: '#7b1fa2', shape: 'bar' },
                { id: 'nuts', name: 'Mixed Nuts', color: '#6d4c41', shape: 'jar' },
                { id: 'gummy', name: 'Gummy Bears', color: '#e91e63', shape: 'bag', label: 'GB' }
            ]
        },
        drinks: {
            name: 'Drinks',
            color: '#2196F3',
            items: [
                { id: 'milk', name: 'Milk', color: '#eceff1', shape: 'carton' },
                { id: 'orange_juice', name: 'Orange Juice', color: '#ff9800', shape: 'carton' },
                { id: 'apple_juice', name: 'Apple Juice', color: '#c0ca33', shape: 'carton' },
                { id: 'water', name: 'Water Bottle', color: '#29b6f6', shape: 'bottle' },
                { id: 'soda_red', name: 'Red Soda', color: '#f44336', shape: 'can' },
                { id: 'soda_blue', name: 'Blue Soda', color: '#2196f3', shape: 'can' },
                { id: 'soda_green', name: 'Green Soda', color: '#4caf50', shape: 'can' },
                { id: 'coffee', name: 'Coffee', color: '#5d4037', shape: 'jar' }
            ]
        },
        frozen: {
            name: 'Frozen',
            color: '#00BCD4',
            items: [
                { id: 'ice_cream_choc', name: 'Chocolate Ice Cream', color: '#5d4037', shape: 'tub' },
                { id: 'ice_cream_van', name: 'Vanilla Ice Cream', color: '#fff9c4', shape: 'tub' },
                { id: 'ice_cream_straw', name: 'Strawberry Ice Cream', color: '#f48fb1', shape: 'tub' },
                { id: 'frozen_pizza', name: 'Frozen Pizza', color: '#ff7043', shape: 'box', label: 'PZ' },
                { id: 'frozen_peas', name: 'Frozen Peas', color: '#66bb6a', shape: 'bag', label: 'FP' },
                { id: 'fish_sticks', name: 'Fish Sticks', color: '#ffcc80', shape: 'box', label: 'FS' },
                { id: 'frozen_fries', name: 'Frozen Fries', color: '#ffd54f', shape: 'bag', label: 'FF' },
                { id: 'ice_pops', name: 'Ice Pops', color: '#4dd0e1', shape: 'box', label: 'IP' }
            ]
        },
        dairy: {
            name: 'Dairy',
            color: '#FFC107',
            items: [
                { id: 'cheese_yellow', name: 'Yellow Cheese', color: '#ffc107', shape: 'cheese' },
                { id: 'cheese_white', name: 'White Cheese', color: '#fff9c4', shape: 'cheese' },
                { id: 'butter', name: 'Butter', color: '#fff59d', shape: 'box', label: 'BT' },
                { id: 'yogurt_plain', name: 'Plain Yogurt', color: '#eceff1', shape: 'cup' },
                { id: 'yogurt_straw', name: 'Strawberry Yogurt', color: '#f48fb1', shape: 'cup' },
                { id: 'yogurt_blue', name: 'Blueberry Yogurt', color: '#7986cb', shape: 'cup' },
                { id: 'cream', name: 'Cream', color: '#fff8e1', shape: 'carton' },
                { id: 'eggs', name: 'Eggs', color: '#ffcc80', shape: 'eggcarton' }
            ]
        }
    },

    // Draw a product on canvas
    draw(ctx, product, x, y, width, height, highlighted = false) {
        const padding = 4;
        const innerWidth = width - padding * 2;
        const innerHeight = height - padding * 2;
        const innerX = x + padding;
        const innerY = y + padding;

        ctx.save();

        // Highlight effect
        if (highlighted) {
            ctx.shadowColor = '#fff';
            ctx.shadowBlur = 15;
        }

        switch (product.shape) {
            case 'circle':
                this.drawCircle(ctx, product, innerX, innerY, innerWidth, innerHeight);
                break;
            case 'oval':
                this.drawOval(ctx, product, innerX, innerY, innerWidth, innerHeight);
                break;
            case 'box':
                this.drawBox(ctx, product, innerX, innerY, innerWidth, innerHeight);
                break;
            case 'bag':
                this.drawBag(ctx, product, innerX, innerY, innerWidth, innerHeight);
                break;
            case 'bottle':
                this.drawBottle(ctx, product, innerX, innerY, innerWidth, innerHeight);
                break;
            case 'can':
                this.drawCan(ctx, product, innerX, innerY, innerWidth, innerHeight);
                break;
            case 'carton':
                this.drawCarton(ctx, product, innerX, innerY, innerWidth, innerHeight);
                break;
            case 'jar':
                this.drawJar(ctx, product, innerX, innerY, innerWidth, innerHeight);
                break;
            case 'banana':
                this.drawBanana(ctx, product, innerX, innerY, innerWidth, innerHeight);
                break;
            case 'carrot':
                this.drawCarrot(ctx, product, innerX, innerY, innerWidth, innerHeight);
                break;
            case 'broccoli':
                this.drawBroccoli(ctx, product, innerX, innerY, innerWidth, innerHeight);
                break;
            case 'grapes':
                this.drawGrapes(ctx, product, innerX, innerY, innerWidth, innerHeight);
                break;
            case 'watermelon':
                this.drawWatermelon(ctx, product, innerX, innerY, innerWidth, innerHeight);
                break;
            case 'bar':
                this.drawBar(ctx, product, innerX, innerY, innerWidth, innerHeight);
                break;
            case 'tub':
                this.drawTub(ctx, product, innerX, innerY, innerWidth, innerHeight);
                break;
            case 'cup':
                this.drawCup(ctx, product, innerX, innerY, innerWidth, innerHeight);
                break;
            case 'cheese':
                this.drawCheese(ctx, product, innerX, innerY, innerWidth, innerHeight);
                break;
            case 'eggcarton':
                this.drawEggCarton(ctx, product, innerX, innerY, innerWidth, innerHeight);
                break;
            default:
                this.drawBox(ctx, product, innerX, innerY, innerWidth, innerHeight);
        }

        ctx.restore();
    },

    drawCircle(ctx, product, x, y, w, h) {
        const radius = Math.min(w, h) / 2 - 2;
        const cx = x + w / 2;
        const cy = y + h / 2;

        // Main circle
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fillStyle = product.color;
        ctx.fill();

        // Highlight
        ctx.beginPath();
        ctx.arc(cx - radius * 0.3, cy - radius * 0.3, radius * 0.25, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.fill();
    },

    drawOval(ctx, product, x, y, w, h) {
        const cx = x + w / 2;
        const cy = y + h / 2;

        ctx.beginPath();
        ctx.ellipse(cx, cy, w / 2 - 4, h / 3, 0, 0, Math.PI * 2);
        ctx.fillStyle = product.color;
        ctx.fill();

        // Highlight
        ctx.beginPath();
        ctx.ellipse(cx - w * 0.15, cy - h * 0.1, w * 0.15, h * 0.08, -0.3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.fill();
    },

    drawBox(ctx, product, x, y, w, h) {
        const boxWidth = w * 0.85;
        const boxHeight = h * 0.9;
        const boxX = x + (w - boxWidth) / 2;
        const boxY = y + (h - boxHeight) / 2;

        // Main box
        ctx.fillStyle = product.color;
        ctx.fillRect(boxX, boxY, boxWidth, boxHeight);

        // Border
        ctx.strokeStyle = Utils.darkenColor(product.color, 20);
        ctx.lineWidth = 2;
        ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

        // Label
        if (product.label) {
            ctx.fillStyle = 'white';
            ctx.font = `bold ${Math.min(boxWidth, boxHeight) * 0.35}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(product.label, boxX + boxWidth / 2, boxY + boxHeight / 2);
        }
    },

    drawBag(ctx, product, x, y, w, h) {
        const bagWidth = w * 0.8;
        const bagHeight = h * 0.85;
        const bagX = x + (w - bagWidth) / 2;
        const bagY = y + (h - bagHeight) / 2;

        ctx.beginPath();
        ctx.moveTo(bagX + bagWidth * 0.2, bagY);
        ctx.lineTo(bagX + bagWidth * 0.8, bagY);
        ctx.lineTo(bagX + bagWidth, bagY + bagHeight * 0.15);
        ctx.lineTo(bagX + bagWidth * 0.95, bagY + bagHeight);
        ctx.lineTo(bagX + bagWidth * 0.05, bagY + bagHeight);
        ctx.lineTo(bagX, bagY + bagHeight * 0.15);
        ctx.closePath();

        ctx.fillStyle = product.color;
        ctx.fill();
        ctx.strokeStyle = Utils.darkenColor(product.color, 20);
        ctx.lineWidth = 2;
        ctx.stroke();

        // Crinkle top
        ctx.beginPath();
        ctx.moveTo(bagX + bagWidth * 0.2, bagY);
        for (let i = 0; i <= 6; i++) {
            const px = bagX + bagWidth * 0.2 + (bagWidth * 0.6 / 6) * i;
            const py = bagY + (i % 2 === 0 ? -3 : 3);
            ctx.lineTo(px, py);
        }
        ctx.strokeStyle = Utils.darkenColor(product.color, 30);
        ctx.stroke();

        // Label
        if (product.label) {
            ctx.fillStyle = 'white';
            ctx.font = `bold ${bagHeight * 0.25}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(product.label, bagX + bagWidth / 2, bagY + bagHeight / 2);
        }
    },

    drawBottle(ctx, product, x, y, w, h) {
        const bottleWidth = w * 0.5;
        const bottleHeight = h * 0.9;
        const bottleX = x + (w - bottleWidth) / 2;
        const bottleY = y + (h - bottleHeight) / 2;

        // Cap
        ctx.fillStyle = '#1565c0';
        ctx.fillRect(bottleX + bottleWidth * 0.25, bottleY, bottleWidth * 0.5, bottleHeight * 0.12);

        // Neck
        ctx.fillStyle = product.color;
        ctx.fillRect(bottleX + bottleWidth * 0.25, bottleY + bottleHeight * 0.1, bottleWidth * 0.5, bottleHeight * 0.15);

        // Body
        ctx.beginPath();
        ctx.moveTo(bottleX + bottleWidth * 0.25, bottleY + bottleHeight * 0.25);
        ctx.lineTo(bottleX, bottleY + bottleHeight * 0.35);
        ctx.lineTo(bottleX, bottleY + bottleHeight);
        ctx.lineTo(bottleX + bottleWidth, bottleY + bottleHeight);
        ctx.lineTo(bottleX + bottleWidth, bottleY + bottleHeight * 0.35);
        ctx.lineTo(bottleX + bottleWidth * 0.75, bottleY + bottleHeight * 0.25);
        ctx.closePath();
        ctx.fillStyle = product.color;
        ctx.fill();

        // Highlight
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.fillRect(bottleX + bottleWidth * 0.1, bottleY + bottleHeight * 0.4, bottleWidth * 0.2, bottleHeight * 0.5);
    },

    drawCan(ctx, product, x, y, w, h) {
        const canWidth = w * 0.6;
        const canHeight = h * 0.85;
        const canX = x + (w - canWidth) / 2;
        const canY = y + (h - canHeight) / 2;

        // Main body
        ctx.fillStyle = product.color;
        ctx.beginPath();
        ctx.roundRect(canX, canY, canWidth, canHeight, 4);
        ctx.fill();

        // Top rim
        ctx.fillStyle = '#bdbdbd';
        ctx.beginPath();
        ctx.ellipse(canX + canWidth / 2, canY + 4, canWidth / 2, 4, 0, 0, Math.PI * 2);
        ctx.fill();

        // Highlight
        ctx.fillStyle = 'rgba(255,255,255,0.25)';
        ctx.fillRect(canX + 3, canY + 10, canWidth * 0.25, canHeight - 20);
    },

    drawCarton(ctx, product, x, y, w, h) {
        const cartonWidth = w * 0.7;
        const cartonHeight = h * 0.9;
        const cartonX = x + (w - cartonWidth) / 2;
        const cartonY = y + (h - cartonHeight) / 2;

        // Main body
        ctx.fillStyle = product.color;
        ctx.fillRect(cartonX, cartonY + cartonHeight * 0.15, cartonWidth, cartonHeight * 0.85);

        // Roof
        ctx.beginPath();
        ctx.moveTo(cartonX, cartonY + cartonHeight * 0.15);
        ctx.lineTo(cartonX + cartonWidth / 2, cartonY);
        ctx.lineTo(cartonX + cartonWidth, cartonY + cartonHeight * 0.15);
        ctx.closePath();
        ctx.fillStyle = Utils.darkenColor(product.color, 10);
        ctx.fill();

        // Border
        ctx.strokeStyle = Utils.darkenColor(product.color, 25);
        ctx.lineWidth = 1.5;
        ctx.strokeRect(cartonX, cartonY + cartonHeight * 0.15, cartonWidth, cartonHeight * 0.85);
    },

    drawJar(ctx, product, x, y, w, h) {
        const jarWidth = w * 0.65;
        const jarHeight = h * 0.85;
        const jarX = x + (w - jarWidth) / 2;
        const jarY = y + (h - jarHeight) / 2;

        // Lid
        ctx.fillStyle = '#795548';
        ctx.beginPath();
        ctx.roundRect(jarX - 2, jarY, jarWidth + 4, jarHeight * 0.12, 3);
        ctx.fill();

        // Body
        ctx.fillStyle = product.color;
        ctx.beginPath();
        ctx.roundRect(jarX, jarY + jarHeight * 0.1, jarWidth, jarHeight * 0.9, 6);
        ctx.fill();

        // Highlight
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.beginPath();
        ctx.roundRect(jarX + 3, jarY + jarHeight * 0.15, jarWidth * 0.25, jarHeight * 0.7, 3);
        ctx.fill();
    },

    drawBanana(ctx, product, x, y, w, h) {
        const cx = x + w / 2;
        const cy = y + h / 2;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(-0.3);

        ctx.beginPath();
        ctx.moveTo(-w * 0.35, h * 0.1);
        ctx.quadraticCurveTo(-w * 0.4, -h * 0.3, 0, -h * 0.35);
        ctx.quadraticCurveTo(w * 0.4, -h * 0.3, w * 0.35, h * 0.1);
        ctx.quadraticCurveTo(w * 0.3, h * 0.25, 0, h * 0.2);
        ctx.quadraticCurveTo(-w * 0.3, h * 0.25, -w * 0.35, h * 0.1);
        ctx.fillStyle = product.color;
        ctx.fill();

        // Brown tip
        ctx.beginPath();
        ctx.arc(w * 0.32, h * 0.05, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#5d4037';
        ctx.fill();

        ctx.restore();
    },

    drawCarrot(ctx, product, x, y, w, h) {
        const cx = x + w / 2;

        // Carrot body
        ctx.beginPath();
        ctx.moveTo(cx - w * 0.25, y + h * 0.25);
        ctx.lineTo(cx + w * 0.25, y + h * 0.25);
        ctx.lineTo(cx, y + h * 0.9);
        ctx.closePath();
        ctx.fillStyle = product.color;
        ctx.fill();

        // Green top
        ctx.fillStyle = '#43a047';
        for (let i = -1; i <= 1; i++) {
            ctx.beginPath();
            ctx.ellipse(cx + i * 6, y + h * 0.18, 3, 10, i * 0.3, 0, Math.PI * 2);
            ctx.fill();
        }
    },

    drawBroccoli(ctx, product, x, y, w, h) {
        const cx = x + w / 2;

        // Stem
        ctx.fillStyle = '#81c784';
        ctx.fillRect(cx - 5, y + h * 0.5, 10, h * 0.4);

        // Florets
        ctx.fillStyle = product.color;
        const floretPositions = [
            { x: 0, y: 0.3, r: 12 },
            { x: -10, y: 0.38, r: 10 },
            { x: 10, y: 0.38, r: 10 },
            { x: -6, y: 0.22, r: 9 },
            { x: 6, y: 0.22, r: 9 },
        ];
        floretPositions.forEach(pos => {
            ctx.beginPath();
            ctx.arc(cx + pos.x, y + h * pos.y, pos.r, 0, Math.PI * 2);
            ctx.fill();
        });
    },

    drawGrapes(ctx, product, x, y, w, h) {
        const cx = x + w / 2;
        const grapeRadius = 6;

        // Stem
        ctx.strokeStyle = '#795548';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx, y + h * 0.15);
        ctx.lineTo(cx, y + h * 0.28);
        ctx.stroke();

        // Grapes in pyramid
        ctx.fillStyle = product.color;
        const rows = [[0], [-7, 7], [-14, 0, 14], [-7, 7]];
        let yPos = y + h * 0.32;
        rows.forEach(row => {
            row.forEach(xOffset => {
                ctx.beginPath();
                ctx.arc(cx + xOffset, yPos, grapeRadius, 0, Math.PI * 2);
                ctx.fill();
            });
            yPos += 11;
        });
    },

    drawWatermelon(ctx, product, x, y, w, h) {
        const cx = x + w / 2;
        const cy = y + h / 2;
        const radius = Math.min(w, h) * 0.4;

        // Outer rind
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fillStyle = product.color;
        ctx.fill();

        // Inner red
        ctx.beginPath();
        ctx.arc(cx, cy, radius * 0.85, 0, Math.PI * 2);
        ctx.fillStyle = '#ef5350';
        ctx.fill();

        // Seeds
        ctx.fillStyle = '#1a1a1a';
        for (let i = 0; i < 5; i++) {
            const angle = (i / 5) * Math.PI * 2 + 0.3;
            const seedX = cx + Math.cos(angle) * radius * 0.5;
            const seedY = cy + Math.sin(angle) * radius * 0.5;
            ctx.beginPath();
            ctx.ellipse(seedX, seedY, 2, 4, angle, 0, Math.PI * 2);
            ctx.fill();
        }
    },

    drawBar(ctx, product, x, y, w, h) {
        const barWidth = w * 0.9;
        const barHeight = h * 0.4;
        const barX = x + (w - barWidth) / 2;
        const barY = y + (h - barHeight) / 2;

        ctx.fillStyle = product.color;
        ctx.beginPath();
        ctx.roundRect(barX, barY, barWidth, barHeight, 4);
        ctx.fill();

        // Wrapper detail
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.fillRect(barX + 3, barY + 3, barWidth - 6, barHeight * 0.3);
    },

    drawTub(ctx, product, x, y, w, h) {
        const tubWidth = w * 0.85;
        const tubHeight = h * 0.7;
        const tubX = x + (w - tubWidth) / 2;
        const tubY = y + (h - tubHeight) / 2;

        // Main body
        ctx.fillStyle = product.color;
        ctx.beginPath();
        ctx.roundRect(tubX, tubY, tubWidth, tubHeight, 8);
        ctx.fill();

        // Lid
        ctx.fillStyle = Utils.lightenColor(product.color, 20);
        ctx.beginPath();
        ctx.roundRect(tubX - 2, tubY, tubWidth + 4, tubHeight * 0.2, 4);
        ctx.fill();

        // Label area
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        ctx.fillRect(tubX + tubWidth * 0.1, tubY + tubHeight * 0.35, tubWidth * 0.8, tubHeight * 0.4);
    },

    drawCup(ctx, product, x, y, w, h) {
        const cupWidth = w * 0.6;
        const cupHeight = h * 0.7;
        const cupX = x + (w - cupWidth) / 2;
        const cupY = y + (h - cupHeight) / 2;

        // Cup body (tapered)
        ctx.beginPath();
        ctx.moveTo(cupX + 4, cupY);
        ctx.lineTo(cupX + cupWidth - 4, cupY);
        ctx.lineTo(cupX + cupWidth, cupY + cupHeight);
        ctx.lineTo(cupX, cupY + cupHeight);
        ctx.closePath();
        ctx.fillStyle = product.color;
        ctx.fill();

        // Lid
        ctx.fillStyle = '#f5f5f5';
        ctx.beginPath();
        ctx.ellipse(cupX + cupWidth / 2, cupY, cupWidth / 2, 6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 1;
        ctx.stroke();
    },

    drawCheese(ctx, product, x, y, w, h) {
        const cheeseWidth = w * 0.8;
        const cheeseHeight = h * 0.5;
        const cheeseX = x + (w - cheeseWidth) / 2;
        const cheeseY = y + (h - cheeseHeight) / 2;

        // Wedge shape
        ctx.beginPath();
        ctx.moveTo(cheeseX, cheeseY + cheeseHeight);
        ctx.lineTo(cheeseX + cheeseWidth, cheeseY + cheeseHeight);
        ctx.lineTo(cheeseX + cheeseWidth, cheeseY + cheeseHeight * 0.3);
        ctx.lineTo(cheeseX, cheeseY);
        ctx.closePath();
        ctx.fillStyle = product.color;
        ctx.fill();

        // Holes
        ctx.fillStyle = Utils.darkenColor(product.color, 15);
        ctx.beginPath();
        ctx.arc(cheeseX + cheeseWidth * 0.3, cheeseY + cheeseHeight * 0.6, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cheeseX + cheeseWidth * 0.7, cheeseY + cheeseHeight * 0.75, 3, 0, Math.PI * 2);
        ctx.fill();
    },

    drawEggCarton(ctx, product, x, y, w, h) {
        const cartonWidth = w * 0.9;
        const cartonHeight = h * 0.6;
        const cartonX = x + (w - cartonWidth) / 2;
        const cartonY = y + (h - cartonHeight) / 2;

        // Carton base
        ctx.fillStyle = '#a1887f';
        ctx.beginPath();
        ctx.roundRect(cartonX, cartonY, cartonWidth, cartonHeight, 4);
        ctx.fill();

        // Eggs visible
        ctx.fillStyle = product.color;
        const eggSpacing = cartonWidth / 6;
        for (let i = 0; i < 6; i++) {
            ctx.beginPath();
            ctx.ellipse(cartonX + eggSpacing * (i + 0.5), cartonY + cartonHeight * 0.4, 5, 7, 0, 0, Math.PI * 2);
            ctx.fill();
        }
    },

    // Get all items from a category
    getItemsByCategory(categoryId) {
        return this.categories[categoryId]?.items || [];
    },

    // Get a specific item by ID
    getItemById(itemId) {
        for (const category of Object.values(this.categories)) {
            const item = category.items.find(i => i.id === itemId);
            if (item) return item;
        }
        return null;
    },

    // Get random items from categories
    getRandomItems(count, categoryIds = null) {
        let pool = [];
        const cats = categoryIds || Object.keys(this.categories);

        cats.forEach(catId => {
            const items = this.getItemsByCategory(catId);
            pool = pool.concat(items);
        });

        Utils.shuffle(pool);
        return pool.slice(0, count);
    }
};
