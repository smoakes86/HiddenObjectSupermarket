import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createCanvas, loadImage } from 'canvas';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PRODUCTS_DIR = path.join(__dirname, '..', 'public', 'assets', 'images', 'products');
const TARGET_SIZE = 128; // Target size in pixels
const SIZE_THRESHOLD = 50000; // Only resize files larger than 50KB (likely DALL-E generated)

async function resizeImage(inputPath, outputPath, size) {
    const image = await loadImage(inputPath);
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    // Clear with transparency
    ctx.clearRect(0, 0, size, size);

    // Draw image scaled to fit
    ctx.drawImage(image, 0, 0, size, size);

    // Save as PNG
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(outputPath, buffer);
}

async function main() {
    console.log('Resizing product images...\n');

    const files = fs.readdirSync(PRODUCTS_DIR).filter(f => f.endsWith('.png'));

    let resized = 0;
    let skipped = 0;

    for (const file of files) {
        const filePath = path.join(PRODUCTS_DIR, file);
        const stats = fs.statSync(filePath);

        // Only resize large files (DALL-E images are ~1.5MB)
        if (stats.size > SIZE_THRESHOLD) {
            console.log(`Resizing: ${file} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
            try {
                await resizeImage(filePath, filePath, TARGET_SIZE);
                resized++;
            } catch (err) {
                console.error(`  Error: ${err.message}`);
            }
        } else {
            console.log(`Skipping: ${file} (${(stats.size / 1024).toFixed(1)} KB - already small)`);
            skipped++;
        }
    }

    console.log(`\nDone! Resized: ${resized}, Skipped: ${skipped}`);
}

main().catch(console.error);
