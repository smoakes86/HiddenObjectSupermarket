import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize OpenAI client - requires OPENAI_API_KEY environment variable
const openai = new OpenAI();

// Output directory for sprites
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'assets', 'images', 'products');

// GLOBAL PROMPT - Set this to use the same prompt for all products
// Use {id} as a placeholder for the product ID (e.g., "apple", "milk", etc.)
// Leave empty/null to use individual product prompts below
const GLOBAL_PROMPT = '\'Create a sprite of a {id} viewed square on from the front in a pixar style, no faces, no shadow, correct shape for object\'';
// Example: const GLOBAL_PROMPT = 'a {id} in pixel art style';

// All products with detailed descriptions for DALL-E (Animal Crossing style, no faces)
const PRODUCTS = [
    { id: 'apple_juice_carton', prompt: 'a green-yellow juice carton with apple picture, similar to the Animal Crossing style' },
    { id: 'bottled_water', prompt: 'a clear water bottle with a blue cap, similar to the Animal Crossing style' },
    { id: 'can_soda_red', prompt: 'a red soda can with rounded edges, similar to the Animal Crossing style' },
    { id: 'can_soda_blue', prompt: 'a blue soda can with rounded edges, similar to the Animal Crossing style' },
    { id: 'bottle_soda_green', prompt: 'a green soda can with rounded edges, similar to the Animal Crossing style' },
    { id: 'tin_of_coffee', prompt: 'a brown coffee cup with a white lid and steam, similar to the Animal Crossing style' },

    // Frozen (cool-toned containers)
    { id: 'ice_cream_choc', prompt: 'a brown ice cream tub with rounded lid, chocolate flavor, similar to the Animal Crossing style' },
    { id: 'ice_cream_van', prompt: 'a cream-white ice cream tub with rounded lid, vanilla flavor, similar to the Animal Crossing style' },
    { id: 'ice_cream_straw', prompt: 'a pink ice cream tub with rounded lid, strawberry flavor, similar to the Animal Crossing style' },
    { id: 'frozen_pizza', prompt: 'a flat pizza box with rounded corners showing pizza, similar to the Animal Crossing style' },
    { id: 'frozen_peas', prompt: 'a green frozen peas bag showing round peas, similar to the Animal Crossing style' },
    { id: 'box_of_ish_sticks', prompt: 'an orange fish sticks box with rounded corners, similar to the Animal Crossing style' },
    { id: 'bag_of_frozen_fries', prompt: 'a yellow fries bag showing golden french fries, similar to the Animal Crossing style' },
    { id: 'bag_of_ice_pops', prompt: 'a blue ice pops box with colorful popsicles, similar to the Animal Crossing style' },

    // Dairy (soft creamy shapes)
    { id: 'cheese_yellow', prompt: 'a yellow cheese wedge with holes, similar to the Animal Crossing style' },
    { id: 'cheese_white', prompt: 'a white swiss cheese wedge with round holes, similar to the Animal Crossing style' },
    { id: 'butter', prompt: 'a yellow butter stick in paper wrapper, similar to the Animal Crossing style' },
    { id: 'yogurt_plain', prompt: 'a white yogurt cup with foil lid, similar to the Animal Crossing style' },
    { id: 'yogurt_straw', prompt: 'a pink yogurt cup with foil lid, strawberry flavor, similar to the Animal Crossing style' },
    { id: 'yogurt_blue', prompt: 'a blue yogurt cup with foil lid, blueberry flavor, similar to the Animal Crossing style' },
    { id: 'bottle_of_cream', prompt: 'a cream-colored cream carton with rounded top, similar to the Animal Crossing style' },
    { id: 'carton_of_eggs', prompt: 'an egg carton showing brown eggs nestled inside, similar to the Animal Crossing style' }
];

// Base prompt for consistent Animal Crossing style (no faces on items)
const STYLE_PROMPT = `One item only, front on, transparent background.
A single grocery item game icon, soft cartoon style.
Rounded shapes with soft edges and subtle gradients.
Warm inviting colors with slight glossy highlights.
Perfectly centered, no shadows.
No faces or eyes on the items. No text or labels.
No harsh black outlines, edges blend softly.
Cozy game inventory icon:`;

async function generateSprite(product) {
    // Use GLOBAL_PROMPT if set, otherwise use individual product prompt
    const productPrompt = GLOBAL_PROMPT
        ? GLOBAL_PROMPT.replace(/\{id\}/g, product.id)
        : product.prompt;
    const fullPrompt =`${productPrompt}`;

    console.log(`Generating: ${fullPrompt}...`);

    try {
        const response = await openai.images.generate({
            model: 'gpt-image-1.5',
            prompt: fullPrompt,
            n: 1,
            size: '1024x1024',
            quality: 'medium',
            output_format: 'png'
        });

        const imageData = response.data[0].b64_json;
        const buffer = Buffer.from(imageData, 'base64');
        const outputPath = path.join(OUTPUT_DIR, `${product.id}.png`);

        fs.writeFileSync(outputPath, buffer);
        console.log(`  Saved: ${outputPath}`);

        return true;
    } catch (error) {
        console.error(`  Error generating ${product.id}:`, error.message);
        return false;
    }
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    console.log('DALL-E Sprite Generator for Hidden Object Supermarket');
    console.log('=====================================================\n');

    // Ensure output directory exists
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
        console.log(`Created output directory: ${OUTPUT_DIR}\n`);
    }

    // Check for API key
    if (!process.env.OPENAI_API_KEY) {
        console.error('Error: OPENAI_API_KEY environment variable is not set.');
        console.error('Set it with: set OPENAI_API_KEY=your-api-key-here');
        process.exit(1);
    }

    // Check for specific products to generate (passed as arguments)
    const args = process.argv.slice(2);
    let productsToGenerate = PRODUCTS;

    if (args.length > 0) {
        productsToGenerate = PRODUCTS.filter(p => args.includes(p.id));
        if (productsToGenerate.length === 0) {
            console.error('No matching products found for:', args.join(', '));
            console.log('\nAvailable products:', PRODUCTS.map(p => p.id).join(', '));
            process.exit(1);
        }
    }

    console.log(`Generating ${productsToGenerate.length} sprites...\n`);

    let successful = 0;
    let failed = 0;
    const failedProducts = [];

    for (const product of productsToGenerate) {
        const success = await generateSprite(product);
        if (success) {
            successful++;
        } else {
            failed++;
            failedProducts.push(product.id);
        }

        // Rate limiting - DALL-E 3 has limits, wait between requests
        await sleep(2000);
    }

    console.log('\n=====================================================');
    console.log(`Generation complete!`);
    console.log(`  Successful: ${successful}`);
    console.log(`  Failed: ${failed}`);

    if (failedProducts.length > 0) {
        console.log(`\nFailed products: ${failedProducts.join(', ')}`);
        console.log('You can retry specific products with: node scripts/generate-sprites.js ' + failedProducts.join(' '));
    }
}

main().catch(console.error);
