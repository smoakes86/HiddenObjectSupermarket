/**
 * Auto-Assign Assets Script
 *
 * Automatically assigns assets from the YEET food pack to product slots
 * based on category matching and copies them to the products folder.
 */

import { createCanvas, loadImage } from 'canvas';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EXTRAS_DIR = path.join(__dirname, '..', 'public', 'assets', 'images', 'extras');
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'assets', 'images', 'products');
const TARGET_WIDTH = 64;
const TARGET_HEIGHT = 80;

// Category-based assignments
// We map YEET categories to our product categories
// Green folder = fruits and vegetables
// Carb folder = cereals, bread, pasta items
// Condiment folder = bottles, jars, sauces (good for drinks)
// Protein folder = meat, dairy, eggs

const assignments = {
    // Produce - use Green folder (fruits and vegetables)
    'apple': 'green (1)',
    'green_apple': 'green (2)',
    'banana': 'green (3)',
    'orange': 'green (4)',
    'lemon': 'green (5)',
    'tomato': 'green (6)',
    'carrot': 'green (7)',
    'broccoli': 'green (8)',
    'grape': 'green (9)',
    'watermelon': 'green (10)',

    // Cereal - use Carb folder
    'corn_flakes': 'carb (1)',
    'oat_rings': 'carb (2)',
    'choco_puffs': 'carb (3)',
    'fruit_loops': 'carb (4)',
    'honey_crunch': 'carb (5)',
    'granola': 'carb (6)',
    'rice_pops': 'carb (7)',
    'wheat_bites': 'carb (8)',

    // Snacks - use Carb folder (different items)
    'chips': 'carb (10)',
    'pretzels': 'carb (11)',
    'cookies': 'carb (12)',
    'crackers': 'carb (13)',
    'popcorn': 'carb (14)',
    'candy': 'carb (15)',
    'nuts': 'carb (16)',
    'gummy': 'carb (17)',

    // Drinks - use Condiment folder (bottles)
    'milk': 'Condiment (1)',
    'orange_juice': 'Condiment (2)',
    'apple_juice': 'Condiment (3)',
    'water': 'Condiment (4)',
    'soda_red': 'Condiment (5)',
    'soda_blue': 'Condiment (6)',
    'soda_green': 'Condiment (7)',
    'coffee': 'Condiment (8)',

    // Frozen - use Protein folder (mixed)
    'ice_cream_choc': 'Protein (1)',
    'ice_cream_van': 'Protein (2)',
    'ice_cream_straw': 'Protein (3)',
    'frozen_pizza': 'Protein (4)',
    'frozen_peas': 'green (20)',
    'fish_sticks': 'Protein (5)',
    'frozen_fries': 'carb (20)',
    'ice_pops': 'Condiment (10)',

    // Dairy - use Protein folder
    'cheese_yellow': 'Protein (10)',
    'cheese_white': 'Protein (11)',
    'butter': 'Protein (12)',
    'yogurt_plain': 'Protein (13)',
    'yogurt_straw': 'Protein (14)',
    'yogurt_blue': 'Protein (15)',
    'cream': 'Protein (16)',
    'eggs': 'Protein (17)'
};

async function copyAndResize(srcName, destName) {
    const srcPath = path.join(EXTRAS_DIR, `${srcName}.png`);
    const destPath = path.join(OUTPUT_DIR, `${destName}.png`);

    if (!fs.existsSync(srcPath)) {
        console.log(`  ✗ Source not found: ${srcName}`);
        return false;
    }

    try {
        // The extras are already resized, just copy
        fs.copyFileSync(srcPath, destPath);
        console.log(`  ✓ ${destName} <- ${srcName}`);
        return true;
    } catch (error) {
        console.log(`  ✗ Error copying ${srcName}: ${error.message}`);
        return false;
    }
}

async function main() {
    console.log('Auto-Assign Assets');
    console.log('==================\n');

    // Ensure output directory exists
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    let success = 0;
    let failed = 0;

    console.log('Copying assets to products folder:\n');

    for (const [productId, assetName] of Object.entries(assignments)) {
        const result = await copyAndResize(assetName, productId);
        if (result) {
            success++;
        } else {
            failed++;
        }
    }

    console.log('\n==================');
    console.log(`Success: ${success}`);
    console.log(`Failed:  ${failed}`);

    if (success > 0) {
        console.log('\nAssets have been copied to:');
        console.log(OUTPUT_DIR);
        console.log('\nRefresh the game to see the new sprites!');
    }

    if (failed > 0) {
        console.log('\nTo fix failed assignments:');
        console.log('1. Open http://localhost:3003/asset-browser.html');
        console.log('2. Manually assign the missing products');
        console.log('3. Use the generated copy commands');
    }
}

main().catch(console.error);
