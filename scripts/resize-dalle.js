/**
 * DALL-E Sprite Resizer
 *
 * Resizes DALL-E generated images (1024x1024) to game size (64x80)
 * Also removes white backgrounds for transparency
 */

import { createCanvas, loadImage } from 'canvas';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PRODUCTS_DIR = path.join(__dirname, '..', 'public', 'assets', 'images', 'products');
const BACKUP_DIR = path.join(__dirname, '..', 'public', 'assets', 'images', 'products_original');
const TARGET_WIDTH = 64;
const TARGET_HEIGHT = 80;

async function resizeImage(inputPath, outputPath) {
    try {
        const image = await loadImage(inputPath);

        const canvas = createCanvas(TARGET_WIDTH, TARGET_HEIGHT);
        const ctx = canvas.getContext('2d');

        // Clear with transparency
        ctx.clearRect(0, 0, TARGET_WIDTH, TARGET_HEIGHT);

        // Calculate scaling to fit within target while maintaining aspect ratio
        const scale = Math.min(
            (TARGET_WIDTH - 4) / image.width,
            (TARGET_HEIGHT - 4) / image.height
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

async function main() {
    console.log('DALL-E Sprite Resizer');
    console.log('====================\n');

    // Create backup directory
    if (!fs.existsSync(BACKUP_DIR)) {
        fs.mkdirSync(BACKUP_DIR, { recursive: true });
        console.log(`Created backup directory: ${BACKUP_DIR}\n`);
    }

    // Get all PNG files in products directory
    const files = fs.readdirSync(PRODUCTS_DIR).filter(f => f.endsWith('.png'));

    console.log(`Found ${files.length} images to resize\n`);

    let resized = 0;
    let skipped = 0;

    for (const file of files) {
        const inputPath = path.join(PRODUCTS_DIR, file);
        const backupPath = path.join(BACKUP_DIR, file);

        // Check if it's a large DALL-E image (> 100KB typically means 1024x1024)
        const stats = fs.statSync(inputPath);
        if (stats.size < 50000) {
            console.log(`  Skipped: ${file} (already small)`);
            skipped++;
            continue;
        }

        // Backup original
        fs.copyFileSync(inputPath, backupPath);

        // Resize
        const success = await resizeImage(inputPath, inputPath);
        if (success) {
            console.log(`  Resized: ${file}`);
            resized++;
        }
    }

    console.log('\n====================');
    console.log(`Resized: ${resized}`);
    console.log(`Skipped: ${skipped}`);
    console.log(`\nOriginal files backed up to: ${BACKUP_DIR}`);
}

main().catch(console.error);
