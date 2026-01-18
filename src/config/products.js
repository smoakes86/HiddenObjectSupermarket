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
            { id: 'bunch_of_grapes', name: 'Grapes', color: '#7b1fa2', visualGroup: 'purple_cluster' },
            { id: 'watermelon', name: 'Watermelon', color: '#4caf50', visualGroup: 'large_green' }
        ]
    },
    cereal: {
        name: 'Cereal',
        color: '#FF9800',
        items: [
            { id: 'cereal_box_of_corn_flakes', name: 'Corn Flakes', color: '#ffc107', visualGroup: 'cereal_yellow' },
            { id: 'cereal_box_of_oat_rings', name: 'Oat Rings', color: '#8d6e63', visualGroup: 'cereal_brown' },
            { id: 'cereal_box_of_choco_puffs', name: 'Choco Puffs', color: '#5d4037', visualGroup: 'cereal_dark' },
            { id: 'cereal_box_of_fruit_loops', name: 'Fruit Loops', color: '#e91e63', visualGroup: 'cereal_pink' },
            { id: 'cereal_box_of_honey_crunch', name: 'Honey Crunch', color: '#ffb300', visualGroup: 'cereal_gold' },
            { id: 'cereal_box_of_granola', name: 'Granola', color: '#795548', visualGroup: 'cereal_brown' },
            { id: 'cereal_box_of_rice_pops', name: 'Rice Pops', color: '#90caf9', visualGroup: 'cereal_blue' },
            { id: 'cereal_box_of_wheat_bites', name: 'Wheat Bites', color: '#a1887f', visualGroup: 'cereal_tan' }
        ]
    },
    snacks: {
        name: 'Snacks',
        color: '#F44336',
        items: [
            { id: 'bag_of_chips', name: 'Potato Chips', color: '#ffc107', visualGroup: 'bag_yellow' },
            { id: 'bag_of_pretzels', name: 'Pretzels', color: '#8d6e63', visualGroup: 'bag_brown' },
            { id: 'bag_of_cookies', name: 'Cookies', color: '#795548', visualGroup: 'pack_brown' },
            { id: 'bag_of_crackers', name: 'Crackers', color: '#ffcc80', visualGroup: 'box_tan' },
            { id: 'bag_of_popcorn', name: 'Popcorn', color: '#fff59d', visualGroup: 'bag_white' },
            { id: 'bag_of_candy', name: 'Candy', color: '#7b1fa2', visualGroup: 'bag_purple' },
            { id: 'jar_of_nuts', name: 'Mixed Nuts', color: '#6d4c41', visualGroup: 'jar_brown' },
            { id: 'bag_of_gummies', name: 'Gummy Bears', color: '#e91e63', visualGroup: 'bag_pink' }
        ]
    },
    drinks: {
        name: 'Drinks',
        color: '#2196F3',
        items: [
            { id: 'milk_bottle', name: 'Milk', color: '#eceff1', visualGroup: 'bottle_white' },
            { id: 'orange_juice_carton', name: 'Orange Juice', color: '#ff9800', visualGroup: 'carton_orange' },
            { id: 'apple_juice_carton', name: 'Apple Juice', color: '#c0ca33', visualGroup: 'carton_green' },
            { id: 'bottled_water', name: 'Water Bottle', color: '#29b6f6', visualGroup: 'bottle_clear' },
            { id: 'can_soda_red', name: 'Red Soda', color: '#f44336', visualGroup: 'can_red' },
            { id: 'can_soda_blue', name: 'Blue Soda', color: '#2196f3', visualGroup: 'can_blue' },
            { id: 'bottle_soda_green', name: 'Green Soda', color: '#4caf50', visualGroup: 'bottle_green' },
            { id: 'tin_of_coffee', name: 'Coffee', color: '#5d4037', visualGroup: 'tin_brown' }
        ]
    },
    frozen: {
        name: 'Frozen',
        color: '#00BCD4',
        items: [
            { id: 'ice_cream_choc', name: 'Choc Ice Cream', color: '#5d4037', visualGroup: 'tub_brown' },
            { id: 'ice_cream_van', name: 'Van Ice Cream', color: '#fff9c4', visualGroup: 'tub_white' },
            { id: 'ice_cream_straw', name: 'Straw Ice Cream', color: '#f48fb1', visualGroup: 'tub_pink' },
            { id: 'frozen_pizza', name: 'Frozen Pizza', color: '#ff7043', visualGroup: 'box_flat' },
            { id: 'box_of_fish_sticks', name: 'Fish Sticks', color: '#ffcc80', visualGroup: 'box_orange' },
            { id: 'bag_of_frozen_fries', name: 'Frozen Fries', color: '#ffd54f', visualGroup: 'bag_yellow' },
            { id: 'bag_of_ice_pops', name: 'Ice Pops', color: '#4dd0e1', visualGroup: 'bag_blue' }
        ]
    },
    dairy: {
        name: 'Dairy',
        color: '#FFC107',
        items: [
            { id: 'cheese_yellow', name: 'Yellow Cheese', color: '#ffc107', visualGroup: 'wedge_yellow' },
            { id: 'cheese_white', name: 'White Cheese', color: '#fff9c4', visualGroup: 'wedge_white' },
            { id: 'butter', name: 'Butter', color: '#fff59d', visualGroup: 'block_yellow' },
            { id: 'yogurt_straw', name: 'Straw Yogurt', color: '#f48fb1', visualGroup: 'cup_pink' },
            { id: 'yogurt_blue', name: 'Blue Yogurt', color: '#7986cb', visualGroup: 'cup_blue' },
            { id: 'bottle_of_cream', name: 'Cream', color: '#fff8e1', visualGroup: 'bottle_cream' },
            { id: 'carton_of_eggs', name: 'Eggs', color: '#ffcc80', visualGroup: 'carton_eggs' }
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
