export default class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        // Create loading bar
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        const progressBox = this.add.graphics();
        const progressBar = this.add.graphics();

        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);

        const loadingText = this.add.text(width / 2, height / 2 - 50, 'Loading...', {
            fontFamily: 'Segoe UI, Arial, sans-serif',
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);

        const percentText = this.add.text(width / 2, height / 2, '0%', {
            fontFamily: 'Segoe UI, Arial, sans-serif',
            fontSize: '18px',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.load.on('progress', (value) => {
            progressBar.clear();
            progressBar.fillStyle(0x4caf50, 1);
            progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
            percentText.setText(Math.floor(value * 100) + '%');
        });

        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
        });

        // Load real product images
        this.loadProductImages();

        // Create generated textures for environment
        this.createEnvironmentTextures();
    }

    loadProductImages() {
        const products = [
            // Produce
            'apple', 'green_apple', 'banana', 'orange', 'lemon',
            'tomato', 'carrot', 'broccoli', 'bunch_of_grapes', 'watermelon',
            // Cereal
            'cereal_box_of_corn_flakes', 'cereal_box_of_oat_rings',
            'cereal_box_of_choco_puffs', 'cereal_box_of_fruit_loops',
            'cereal_box_of_honey_crunch', 'cereal_box_of_granola',
            'cereal_box_of_rice_pops', 'cereal_box_of_wheat_bites',
            // Snacks
            'bag_of_chips', 'bag_of_pretzels', 'bag_of_cookies',
            'bag_of_crackers', 'bag_of_popcorn', 'bag_of_candy',
            'jar_of_nuts', 'bag_of_gummies',
            // Drinks
            'milk_bottle', 'orange_juice_carton', 'apple_juice_carton',
            'bottled_water', 'can_soda_red', 'can_soda_blue',
            'bottle_soda_green', 'tin_of_coffee',
            // Frozen
            'ice_cream_choc', 'ice_cream_van', 'ice_cream_straw',
            'frozen_pizza', 'box_of_fish_sticks', 'bag_of_frozen_fries',
            'bag_of_ice_pops',
            // Dairy
            'cheese_yellow', 'cheese_white', 'butter',
            'yogurt_straw', 'yogurt_blue', 'bottle_of_cream', 'carton_of_eggs'
        ];

        // Load each product image
        products.forEach(id => {
            this.load.image(id, `assets/images/products/${id}.png`);
        });
    }

    createEnvironmentTextures() {
        // These will be created after load completes in create()
    }

    create() {
        // Create shelf texture
        const shelfGraphics = this.make.graphics({ x: 0, y: 0, add: false });

        // Wood grain shelf surface
        shelfGraphics.fillStyle(0x8b4513, 1);
        shelfGraphics.fillRect(0, 0, 64, 16);

        // Darker bottom edge
        shelfGraphics.fillStyle(0x654321, 1);
        shelfGraphics.fillRect(0, 12, 64, 4);

        // Wood grain lines
        shelfGraphics.lineStyle(1, 0x7a3d10, 0.3);
        for (let i = 0; i < 5; i++) {
            shelfGraphics.lineBetween(0, 3 + i * 2, 64, 3 + i * 2);
        }

        shelfGraphics.generateTexture('shelf_surface', 64, 16);
        shelfGraphics.destroy();

        // Create shelf back texture with gradient effect
        const shelfBackGraphics = this.make.graphics({ x: 0, y: 0, add: false });

        // Background
        shelfBackGraphics.fillStyle(0x1a1a2e, 1);
        shelfBackGraphics.fillRect(0, 0, 68, 110);

        // Shelf back panel
        shelfBackGraphics.fillStyle(0x2d3436, 1);
        shelfBackGraphics.fillRect(2, 2, 64, 106);

        // Inner panel with subtle gradient effect
        shelfBackGraphics.fillStyle(0x353b48, 1);
        shelfBackGraphics.fillRect(4, 4, 60, 102);

        // Top highlight
        shelfBackGraphics.fillStyle(0x4a5568, 0.5);
        shelfBackGraphics.fillRect(4, 4, 60, 20);

        shelfBackGraphics.generateTexture('shelf_back', 68, 110);
        shelfBackGraphics.destroy();

        // Create particle texture with glow
        const particleGraphics = this.make.graphics({ x: 0, y: 0, add: false });

        // Outer glow
        particleGraphics.fillStyle(0xffffff, 0.3);
        particleGraphics.fillCircle(12, 12, 12);

        // Inner bright
        particleGraphics.fillStyle(0xffffff, 0.6);
        particleGraphics.fillCircle(12, 12, 8);

        // Core
        particleGraphics.fillStyle(0xffffff, 1);
        particleGraphics.fillCircle(12, 12, 4);

        particleGraphics.generateTexture('particle', 24, 24);
        particleGraphics.destroy();

        // Create star particle for celebrations
        const starGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        starGraphics.fillStyle(0xffd700, 1);
        this.drawStar(starGraphics, 12, 12, 5, 12, 6);
        starGraphics.generateTexture('star_particle', 24, 24);
        starGraphics.destroy();

        this.scene.start('StartScene');
    }

    drawStar(graphics, cx, cy, spikes, outerRadius, innerRadius) {
        let rot = Math.PI / 2 * 3;
        let step = Math.PI / spikes;

        graphics.beginPath();
        graphics.moveTo(cx, cy - outerRadius);

        for (let i = 0; i < spikes; i++) {
            let x = cx + Math.cos(rot) * outerRadius;
            let y = cy + Math.sin(rot) * outerRadius;
            graphics.lineTo(x, y);
            rot += step;

            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            graphics.lineTo(x, y);
            rot += step;
        }

        graphics.lineTo(cx, cy - outerRadius);
        graphics.closePath();
        graphics.fillPath();
    }
}
