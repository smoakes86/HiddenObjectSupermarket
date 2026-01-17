import { getRandomItems } from './products.js';

// Level definitions
export const LEVELS = [
    {
        id: 1,
        name: 'Fresh Start',
        aisle: 'Produce',
        categories: ['produce'],
        shelfCount: 2,
        itemsPerShelf: 8,
        targetCount: 2,
        difficulty: 'easy',
        description: 'Find some fresh produce!'
    },
    {
        id: 2,
        name: 'Fruit Basket',
        aisle: 'Produce',
        categories: ['produce'],
        shelfCount: 3,
        itemsPerShelf: 10,
        targetCount: 3,
        difficulty: 'easy',
        description: 'A few more items to find.'
    },
    {
        id: 3,
        name: 'Breakfast Time',
        aisle: 'Cereal',
        categories: ['cereal'],
        shelfCount: 3,
        itemsPerShelf: 10,
        targetCount: 3,
        difficulty: 'easy',
        description: 'Time for some cereal!'
    },
    {
        id: 4,
        name: 'Morning Essentials',
        aisle: 'Mixed',
        categories: ['produce', 'dairy'],
        shelfCount: 3,
        itemsPerShelf: 12,
        targetCount: 4,
        difficulty: 'medium',
        description: 'Breakfast essentials await.'
    },
    {
        id: 5,
        name: 'Snack Attack',
        aisle: 'Snacks',
        categories: ['snacks'],
        shelfCount: 3,
        itemsPerShelf: 12,
        targetCount: 4,
        difficulty: 'medium',
        description: 'Find some tasty treats!'
    },
    {
        id: 6,
        name: 'Thirst Quencher',
        aisle: 'Beverages',
        categories: ['drinks'],
        shelfCount: 3,
        itemsPerShelf: 14,
        targetCount: 4,
        difficulty: 'medium',
        description: 'Stock up on drinks.'
    },
    {
        id: 7,
        name: 'Chill Zone',
        aisle: 'Frozen',
        categories: ['frozen'],
        shelfCount: 4,
        itemsPerShelf: 12,
        targetCount: 5,
        difficulty: 'medium',
        description: 'Explore the freezer aisle.'
    },
    {
        id: 8,
        name: 'Big Shop',
        aisle: 'Mixed',
        categories: ['produce', 'dairy', 'drinks'],
        shelfCount: 4,
        itemsPerShelf: 14,
        targetCount: 5,
        difficulty: 'medium',
        description: 'A longer shopping list today.'
    },
    {
        id: 9,
        name: 'Treat Yourself',
        aisle: 'Mixed',
        categories: ['snacks', 'cereal'],
        shelfCount: 4,
        itemsPerShelf: 16,
        targetCount: 6,
        difficulty: 'hard',
        description: 'So many options!'
    },
    {
        id: 10,
        name: 'Master Shopper',
        aisle: 'Megastore',
        categories: ['produce', 'cereal', 'snacks', 'drinks', 'frozen', 'dairy'],
        shelfCount: 5,
        itemsPerShelf: 18,
        targetCount: 7,
        difficulty: 'hard',
        description: 'The ultimate shopping challenge!'
    },
    {
        id: 11,
        name: 'Weekly Shop',
        aisle: 'Full Store',
        categories: ['produce', 'cereal', 'snacks', 'drinks', 'frozen', 'dairy'],
        shelfCount: 5,
        itemsPerShelf: 18,
        targetCount: 7,
        difficulty: 'hard',
        description: 'Keep those shopping skills sharp!'
    },
    {
        id: 12,
        name: 'Express Lane',
        aisle: 'Mixed',
        categories: ['produce', 'snacks', 'drinks'],
        shelfCount: 4,
        itemsPerShelf: 20,
        targetCount: 8,
        difficulty: 'hard',
        description: 'Quick shopping challenge!'
    }
];

// Get level configuration
export function getLevel(levelNumber) {
    const index = (levelNumber - 1) % LEVELS.length;
    const baseLevel = LEVELS[index];
    const cycle = Math.floor((levelNumber - 1) / LEVELS.length);

    return {
        ...baseLevel,
        id: levelNumber,
        targetCount: Math.min(baseLevel.targetCount + cycle, 10),
        itemsPerShelf: Math.min(baseLevel.itemsPerShelf + cycle * 2, 25),
        shelfCount: Math.min(baseLevel.shelfCount + Math.floor(cycle / 2), 6)
    };
}

// Generate shopping list for a level
export function generateShoppingList(levelConfig) {
    const { categories, targetCount, difficulty } = levelConfig;
    const availableItems = getRandomItems(100, categories); // Get all items from categories

    const selectedItems = [];
    const usedIds = new Set();
    const usedVisualGroups = new Set();

    // Shuffle
    for (let i = availableItems.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [availableItems[i], availableItems[j]] = [availableItems[j], availableItems[i]];
    }

    // For easy/medium levels, prioritize visually distinct items
    const requireDistinct = difficulty === 'easy' || difficulty === 'medium';

    // First pass: select visually distinct items
    if (requireDistinct) {
        for (const item of availableItems) {
            if (selectedItems.length >= targetCount) break;
            if (usedIds.has(item.id)) continue;

            const visualGroup = item.visualGroup || item.id;
            if (!usedVisualGroups.has(visualGroup)) {
                selectedItems.push({ ...item });
                usedIds.add(item.id);
                usedVisualGroups.add(visualGroup);
            }
        }
    }

    // Second pass: fill remaining slots (allow duplicates if needed for hard levels)
    for (const item of availableItems) {
        if (selectedItems.length >= targetCount) break;
        if (!usedIds.has(item.id)) {
            selectedItems.push({ ...item });
            usedIds.add(item.id);
        }
    }

    return selectedItems;
}

// Calculate star rating based on performance
export function calculateStars(level, timeTaken, mistakes) {
    const baseTime = level.targetCount * 8;
    const maxMistakes = Math.ceil(level.targetCount / 2);

    let stars = 3;

    if (timeTaken > baseTime * 1.5) stars--;
    if (timeTaken > baseTime * 2.5) stars--;

    if (mistakes > maxMistakes) stars--;
    if (mistakes > maxMistakes * 2) stars--;

    return Math.max(1, Math.min(3, stars));
}

// Calculate score
export function calculateScore(level, timeTaken, mistakes, itemsFound) {
    const baseScore = itemsFound * 100;
    const timeBonus = Math.max(0, Math.floor((60 - timeTaken) * 5));
    const accuracyBonus = mistakes === 0 ? 200 : Math.max(0, 100 - mistakes * 25);
    const difficultyMultiplier = {
        easy: 1,
        medium: 1.5,
        hard: 2
    }[level.difficulty] || 1;

    return Math.floor((baseScore + timeBonus + accuracyBonus) * difficultyMultiplier);
}
