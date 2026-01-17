// Product definitions (data only, no drawing code)
// Visual groups help ensure easy levels pick visually distinct products

export const PRODUCTS = {
    produce: {
        name: 'Produce',
        color: '#8BC34A',
        items: [
            { id: 'apple', name: 'Red Apple', color: '#e53935', visualGroup: 'round_red' },
            { id: 'green_apple', name: 'Green Apple', color: '#7cb342', visualGroup: 'round_green' },
            { id: 'banana', name: 'Banana', color: '#fdd835', visualGroup: 'yellow_long' },
            { id: 'orange', name: 'Orange', color: '#ff9800', visualGroup: 'round_orange' },
            { id: 'lemon', name: 'Lemon', color: '#ffeb3b', visualGroup: 'yellow_oval' },
            { id: 'tomato', name: 'Tomato', color: '#f44336', visualGroup: 'round_red' },
            { id: 'carrot', name: 'Carrot', color: '#ff7043', visualGroup: 'orange_long' },
            { id: 'broccoli', name: 'Broccoli', color: '#43a047', visualGroup: 'green_bushy' },
            { id: 'grape', name: 'Grapes', color: '#7b1fa2', visualGroup: 'purple_cluster' },
            { id: 'watermelon', name: 'Watermelon', color: '#4caf50', visualGroup: 'large_green' }
        ]
    },
    cereal: {
        name: 'Cereal',
        color: '#FF9800',
        items: [
            { id: 'corn_flakes', name: 'Corn Flakes', color: '#ffc107', label: 'CF', visualGroup: 'cereal_yellow' },
            { id: 'oat_rings', name: 'Oat Rings', color: '#8d6e63', label: 'OR', visualGroup: 'cereal_brown' },
            { id: 'choco_puffs', name: 'Choco Puffs', color: '#5d4037', label: 'CP', visualGroup: 'cereal_dark' },
            { id: 'fruit_loops', name: 'Fruit Loops', color: '#e91e63', label: 'FL', visualGroup: 'cereal_pink' },
            { id: 'honey_crunch', name: 'Honey Crunch', color: '#ffb300', label: 'HC', visualGroup: 'cereal_gold' },
            { id: 'granola', name: 'Granola', color: '#795548', label: 'GR', visualGroup: 'cereal_brown' },
            { id: 'rice_pops', name: 'Rice Pops', color: '#90caf9', label: 'RP', visualGroup: 'cereal_blue' },
            { id: 'wheat_bites', name: 'Wheat Bites', color: '#a1887f', label: 'WB', visualGroup: 'cereal_tan' }
        ]
    },
    snacks: {
        name: 'Snacks',
        color: '#F44336',
        items: [
            { id: 'chips', name: 'Potato Chips', color: '#ffc107', label: 'PC', visualGroup: 'bag_yellow' },
            { id: 'pretzels', name: 'Pretzels', color: '#8d6e63', label: 'PR', visualGroup: 'bag_brown' },
            { id: 'cookies', name: 'Cookies', color: '#795548', label: 'CK', visualGroup: 'pack_brown' },
            { id: 'crackers', name: 'Crackers', color: '#ffcc80', label: 'CR', visualGroup: 'box_tan' },
            { id: 'popcorn', name: 'Popcorn', color: '#fff59d', label: 'PO', visualGroup: 'bag_white' },
            { id: 'candy', name: 'Candy Bar', color: '#7b1fa2', visualGroup: 'bar_purple' },
            { id: 'nuts', name: 'Mixed Nuts', color: '#6d4c41', visualGroup: 'jar_brown' },
            { id: 'gummy', name: 'Gummy Bears', color: '#e91e63', label: 'GB', visualGroup: 'bag_pink' }
        ]
    },
    drinks: {
        name: 'Drinks',
        color: '#2196F3',
        items: [
            { id: 'milk', name: 'Milk', color: '#eceff1', visualGroup: 'carton_white' },
            { id: 'orange_juice', name: 'Orange Juice', color: '#ff9800', visualGroup: 'carton_orange' },
            { id: 'apple_juice', name: 'Apple Juice', color: '#c0ca33', visualGroup: 'carton_green' },
            { id: 'water', name: 'Water Bottle', color: '#29b6f6', visualGroup: 'bottle_clear' },
            { id: 'soda_red', name: 'Red Soda', color: '#f44336', visualGroup: 'can_red' },
            { id: 'soda_blue', name: 'Blue Soda', color: '#2196f3', visualGroup: 'can_blue' },
            { id: 'soda_green', name: 'Green Soda', color: '#4caf50', visualGroup: 'can_green' },
            { id: 'coffee', name: 'Coffee', color: '#5d4037', visualGroup: 'cup_brown' }
        ]
    },
    frozen: {
        name: 'Frozen',
        color: '#00BCD4',
        items: [
            { id: 'ice_cream_choc', name: 'Choc Ice Cream', color: '#5d4037', visualGroup: 'tub_brown' },
            { id: 'ice_cream_van', name: 'Van Ice Cream', color: '#fff9c4', visualGroup: 'tub_white' },
            { id: 'ice_cream_straw', name: 'Straw Ice Cream', color: '#f48fb1', visualGroup: 'tub_pink' },
            { id: 'frozen_pizza', name: 'Frozen Pizza', color: '#ff7043', label: 'PZ', visualGroup: 'box_flat' },
            { id: 'frozen_peas', name: 'Frozen Peas', color: '#66bb6a', label: 'FP', visualGroup: 'bag_green' },
            { id: 'fish_sticks', name: 'Fish Sticks', color: '#ffcc80', label: 'FS', visualGroup: 'box_orange' },
            { id: 'frozen_fries', name: 'Frozen Fries', color: '#ffd54f', label: 'FF', visualGroup: 'bag_yellow' },
            { id: 'ice_pops', name: 'Ice Pops', color: '#4dd0e1', label: 'IP', visualGroup: 'box_blue' }
        ]
    },
    dairy: {
        name: 'Dairy',
        color: '#FFC107',
        items: [
            { id: 'cheese_yellow', name: 'Yellow Cheese', color: '#ffc107', visualGroup: 'wedge_yellow' },
            { id: 'cheese_white', name: 'White Cheese', color: '#fff9c4', visualGroup: 'wedge_white' },
            { id: 'butter', name: 'Butter', color: '#fff59d', label: 'BT', visualGroup: 'block_yellow' },
            { id: 'yogurt_plain', name: 'Plain Yogurt', color: '#eceff1', visualGroup: 'cup_white' },
            { id: 'yogurt_straw', name: 'Straw Yogurt', color: '#f48fb1', visualGroup: 'cup_pink' },
            { id: 'yogurt_blue', name: 'Blue Yogurt', color: '#7986cb', visualGroup: 'cup_blue' },
            { id: 'cream', name: 'Cream', color: '#fff8e1', visualGroup: 'carton_cream' },
            { id: 'eggs', name: 'Eggs', color: '#ffcc80', visualGroup: 'carton_eggs' }
        ]
    }
};

// Get items from a category
export function getItemsByCategory(categoryId) {
    return PRODUCTS[categoryId]?.items || [];
}

// Get a specific item by ID
export function getProductById(itemId) {
    for (const category of Object.values(PRODUCTS)) {
        const item = category.items.find(i => i.id === itemId);
        if (item) return item;
    }
    return null;
}

// Get random items from categories
export function getRandomItems(count, categoryIds = null) {
    let pool = [];
    const cats = categoryIds || Object.keys(PRODUCTS);

    cats.forEach(catId => {
        const items = getItemsByCategory(catId);
        pool = pool.concat(items);
    });

    // Shuffle
    for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
    }

    return pool.slice(0, count);
}
