/**
 * Asset Resizer Script
 *
 * Resizes downloaded food asset images from 160x160 to 64x80 for the game.
 *
 * Usage:
 *   1. Download YEET's Food Assets from https://2yeet.itch.io/foodassets
 *   2. Extract the RAR files to: public/assets/downloads/
 *   3. Run: node scripts/resize-assets.js
 *   4. Resized images will be in: public/assets/images/products/
 */

import { createCanvas, loadImage } from 'canvas';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const SOURCE_DIR = path.join(__dirname, '..', 'public', 'assets', 'downloads');
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'assets', 'images', 'products');
const TARGET_WIDTH = 64;
const TARGET_HEIGHT = 80;

// Product mapping - maps downloaded asset filenames to our product IDs
// Update these mappings based on the actual filenames in the downloaded pack
const PRODUCT_MAPPINGS = {
    // Produce (Greens folder)
    'apple': ['apple', 'Apple', 'red_apple'],
    'green_apple': ['green_apple', 'GreenApple', 'apple_green'],
    'banana': ['banana', 'Banana'],
    'orange': ['orange', 'Orange'],
    'lemon': ['lemon', 'Lemon'],
    'tomato': ['tomato', 'Tomato'],
    'carrot': ['carrot', 'Carrot'],
    'broccoli': ['broccoli', 'Broccoli'],
    'grape': ['grape', 'Grape', 'grapes', 'Grapes'],
    'watermelon': ['watermelon', 'Watermelon'],

    // Cereal/Carbs
    'corn_flakes': ['cereal', 'Cereal', 'cornflakes', 'corn'],
    'oat_rings': ['oatmeal', 'Oatmeal', 'oats'],
    'choco_puffs': ['chocolate_cereal', 'choco'],
    'fruit_loops': ['fruit_cereal', 'colorful_cereal'],
    'honey_crunch': ['honey_cereal', 'granola'],
    'granola': ['granola', 'Granola', 'muesli'],
    'rice_pops': ['rice', 'Rice', 'rice_cereal'],
    'wheat_bites': ['wheat', 'Wheat', 'wheat_cereal'],

    // Snacks
    'chips': ['chips', 'Chips', 'potato_chips', 'crisps'],
    'pretzels': ['pretzel', 'Pretzel', 'pretzels'],
    'cookies': ['cookie', 'Cookie', 'cookies', 'biscuit'],
    'crackers': ['cracker', 'Cracker', 'crackers'],
    'popcorn': ['popcorn', 'Popcorn'],
    'candy': ['candy', 'Candy', 'chocolate', 'Chocolate'],
    'nuts': ['nuts', 'Nuts', 'peanuts', 'almonds'],
    'gummy': ['gummy', 'Gummy', 'gummybear', 'jelly'],

    // Drinks
    'milk': ['milk', 'Milk'],
    'orange_juice': ['orange_juice', 'OrangeJuice', 'oj'],
    'apple_juice': ['apple_juice', 'AppleJuice'],
    'water': ['water', 'Water', 'water_bottle'],
    'soda_red': ['soda', 'Soda', 'cola', 'Cola', 'soda_red'],
    'soda_blue': ['blue_soda', 'soda_blue', 'sports_drink'],
    'soda_green': ['green_soda', 'soda_green', 'lime_soda'],
    'coffee': ['coffee', 'Coffee'],

    // Frozen
    'ice_cream_choc': ['chocolate_ice_cream', 'ice_cream_chocolate', 'icecream_choc'],
    'ice_cream_van': ['vanilla_ice_cream', 'ice_cream_vanilla', 'icecream'],
    'ice_cream_straw': ['strawberry_ice_cream', 'ice_cream_strawberry', 'icecream_straw'],
    'frozen_pizza': ['pizza', 'Pizza', 'frozen_pizza'],
    'frozen_peas': ['peas', 'Peas', 'frozen_peas'],
    'fish_sticks': ['fish', 'Fish', 'fish_sticks', 'fishsticks'],
    'frozen_fries': ['fries', 'Fries', 'french_fries', 'chips'],
    'ice_pops': ['popsicle', 'Popsicle', 'ice_pop', 'icepop'],

    // Dairy (Protein folder likely)
    'cheese_yellow': ['cheese', 'Cheese', 'cheddar'],
    'cheese_white': ['white_cheese', 'mozzarella', 'feta'],
    'butter': ['butter', 'Butter'],
    'yogurt_plain': ['yogurt', 'Yogurt', 'yoghurt'],
    'yogurt_straw': ['strawberry_yogurt', 'yogurt_strawberry'],
    'yogurt_blue': ['blueberry_yogurt', 'yogurt_blueberry'],
    'cream': ['cream', 'Cream', 'whipped_cream'],
    'eggs': ['egg', 'Egg', 'eggs', 'Eggs']
};

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Ensure downloads directory exists
if (!fs.existsSync(SOURCE_DIR)) {
    fs.mkdirSync(SOURCE_DIR, { recursive: true });
    console.log(`\nCreated downloads directory at: ${SOURCE_DIR}`);
    console.log('\nPlease:');
    console.log('1. Download assets from https://2yeet.itch.io/foodassets');
    console.log('2. Extract the RAR files to the downloads folder');
    console.log('3. Run this script again\n');
    process.exit(0);
}

/**
 * Recursively find all PNG files in a directory
 */
function findPngFiles(dir, files = []) {
    if (!fs.existsSync(dir)) return files;

    const items = fs.readdirSync(dir);

    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            findPngFiles(fullPath, files);
        } else if (item.toLowerCase().endsWith('.png')) {
            files.push({
                path: fullPath,
                name: path.basename(item, '.png')
            });
        }
    }

    return files;
}

/**
 * Resize an image to target dimensions
 */
async function resizeImage(inputPath, outputPath) {
    try {
        const image = await loadImage(inputPath);

        const canvas = createCanvas(TARGET_WIDTH, TARGET_HEIGHT);
        const ctx = canvas.getContext('2d');

        // Clear with transparency
        ctx.clearRect(0, 0, TARGET_WIDTH, TARGET_HEIGHT);

        // Calculate scaling to fit within target while maintaining aspect ratio
        const scale = Math.min(
            (TARGET_WIDTH - 8) / image.width,
            (TARGET_HEIGHT - 8) / image.height
        );

        const scaledWidth = image.width * scale;
        const scaledHeight = image.height * scale;

        // Center the image
        const x = (TARGET_WIDTH - scaledWidth) / 2;
        const y = (TARGET_HEIGHT - scaledHeight) / 2;

        // Draw with smooth scaling
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(image, x, y, scaledWidth, scaledHeight);

        // Save
        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(outputPath, buffer);

        return true;
    } catch (error) {
        console.error(`Error resizing ${inputPath}: ${error.message}`);
        return false;
    }
}

/**
 * Find best matching source file for a product
 */
function findMatchingFile(productId, sourceFiles) {
    const possibleNames = PRODUCT_MAPPINGS[productId] || [productId];

    for (const possibleName of possibleNames) {
        const match = sourceFiles.find(f =>
            f.name.toLowerCase() === possibleName.toLowerCase() ||
            f.name.toLowerCase().includes(possibleName.toLowerCase()) ||
            possibleName.toLowerCase().includes(f.name.toLowerCase())
        );
        if (match) return match;
    }

    return null;
}

/**
 * Main function
 */
async function main() {
    console.log('Asset Resizer for Hidden Object Supermarket');
    console.log('==========================================\n');

    // Find all PNG files in downloads
    console.log(`Scanning ${SOURCE_DIR} for PNG files...`);
    const sourceFiles = findPngFiles(SOURCE_DIR);

    if (sourceFiles.length === 0) {
        console.log('\nNo PNG files found in downloads folder!');
        console.log('\nPlease:');
        console.log('1. Download assets from https://2yeet.itch.io/foodassets');
        console.log('2. Extract the RAR files to:', SOURCE_DIR);
        console.log('3. Run this script again\n');
        return;
    }

    console.log(`Found ${sourceFiles.length} PNG files\n`);

    // List all found files
    console.log('Available source files:');
    sourceFiles.slice(0, 20).forEach(f => console.log(`  - ${f.name}`));
    if (sourceFiles.length > 20) {
        console.log(`  ... and ${sourceFiles.length - 20} more\n`);
    }

    // Process each product
    const products = Object.keys(PRODUCT_MAPPINGS);
    let processed = 0;
    let matched = 0;
    let failed = 0;

    console.log('\nProcessing products:');

    for (const productId of products) {
        const sourceFile = findMatchingFile(productId, sourceFiles);

        if (sourceFile) {
            const outputPath = path.join(OUTPUT_DIR, `${productId}.png`);
            const success = await resizeImage(sourceFile.path, outputPath);

            if (success) {
                console.log(`  ✓ ${productId} <- ${sourceFile.name}`);
                matched++;
            } else {
                console.log(`  ✗ ${productId} (resize failed)`);
                failed++;
            }
        } else {
            console.log(`  ? ${productId} (no match found)`);
        }
        processed++;
    }

    console.log('\n==========================================');
    console.log(`Processed: ${processed} products`);
    console.log(`Matched:   ${matched} files`);
    console.log(`Failed:    ${failed} files`);
    console.log(`Missing:   ${processed - matched - failed} files`);

    if (matched < processed) {
        console.log('\n--- Handling Missing Products ---');
        console.log('For products without matches, you can:');
        console.log('1. Manually rename source files to match product IDs');
        console.log('2. Update PRODUCT_MAPPINGS in this script');
        console.log('3. Use the generated sprites (run: node scripts/generate-sprites.js)');
    }

    // Also copy any unmatched files to an "extras" folder for manual selection
    const extrasDir = path.join(OUTPUT_DIR, '..', 'extras');
    if (!fs.existsSync(extrasDir)) {
        fs.mkdirSync(extrasDir, { recursive: true });
    }

    console.log('\n--- Copying All Assets to Extras Folder ---');
    let extraCount = 0;

    for (const file of sourceFiles) {
        const outputPath = path.join(extrasDir, `${file.name}.png`);
        const success = await resizeImage(file.path, outputPath);
        if (success) extraCount++;
    }

    console.log(`Copied ${extraCount} resized assets to: ${extrasDir}`);
    console.log('\nYou can browse the extras folder and manually copy/rename');
    console.log('files to the products folder as needed.');
}

main().catch(console.error);
