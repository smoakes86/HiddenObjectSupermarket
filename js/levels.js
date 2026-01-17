// Level definitions and progression

const Levels = {
    // Level definitions
    data: [
        // Level 1 - Tutorial: Produce
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
        // Level 2 - Produce continued
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
        // Level 3 - Introduction to Cereal
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
        // Level 4 - Mixed produce and dairy
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
        // Level 5 - Snacks
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
        // Level 6 - Drinks
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
        // Level 7 - Frozen section
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
        // Level 8 - Mixed categories
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
        // Level 9 - All snacks and cereal
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
        // Level 10 - Challenge level
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
        // Level 11+: Procedurally gets harder
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
    ],

    // Get level configuration
    getLevel(levelNumber) {
        // Cycle through levels if we run out
        const index = (levelNumber - 1) % this.data.length;
        const baseLevel = this.data[index];

        // Scale difficulty for repeated levels
        const cycle = Math.floor((levelNumber - 1) / this.data.length);

        return {
            ...baseLevel,
            id: levelNumber,
            targetCount: Math.min(baseLevel.targetCount + cycle, 10),
            itemsPerShelf: Math.min(baseLevel.itemsPerShelf + cycle * 2, 25),
            shelfCount: Math.min(baseLevel.shelfCount + Math.floor(cycle / 2), 6)
        };
    },

    // Generate shopping list for a level
    generateShoppingList(levelConfig) {
        const { categories, targetCount } = levelConfig;

        // Get items from the level's categories
        const availableItems = Products.getRandomItems(targetCount * 3, categories);

        // Select unique items for the shopping list
        const selectedItems = [];
        const usedIds = new Set();

        Utils.shuffle(availableItems);

        for (const item of availableItems) {
            if (!usedIds.has(item.id) && selectedItems.length < targetCount) {
                selectedItems.push({ ...item });
                usedIds.add(item.id);
            }
        }

        return selectedItems;
    },

    // Calculate star rating based on performance
    calculateStars(level, timeTaken, mistakes) {
        const baseTime = level.targetCount * 8; // 8 seconds per item baseline
        const maxMistakes = Math.ceil(level.targetCount / 2);

        let stars = 3;

        // Deduct for time
        if (timeTaken > baseTime * 1.5) stars--;
        if (timeTaken > baseTime * 2.5) stars--;

        // Deduct for mistakes
        if (mistakes > maxMistakes) stars--;
        if (mistakes > maxMistakes * 2) stars--;

        return Math.max(1, Math.min(3, stars));
    },

    // Calculate score
    calculateScore(level, timeTaken, mistakes, itemsFound) {
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
};
