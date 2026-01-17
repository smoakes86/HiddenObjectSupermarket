import { createCanvas } from 'canvas';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'assets', 'images', 'products');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Product definitions with drawing instructions
const products = {
    // PRODUCE
    apple: { color: '#e53935', shape: 'apple' },
    green_apple: { color: '#7cb342', shape: 'apple' },
    banana: { color: '#fdd835', shape: 'banana' },
    orange: { color: '#ff9800', shape: 'orange' },
    lemon: { color: '#ffeb3b', shape: 'lemon' },
    tomato: { color: '#f44336', shape: 'tomato' },
    carrot: { color: '#ff7043', shape: 'carrot' },
    broccoli: { color: '#43a047', shape: 'broccoli' },
    grape: { color: '#7b1fa2', shape: 'grapes' },
    watermelon: { color: '#4caf50', shape: 'watermelon' },

    // CEREAL
    corn_flakes: { color: '#ffc107', shape: 'box', label: 'CF' },
    oat_rings: { color: '#8d6e63', shape: 'box', label: 'OR' },
    choco_puffs: { color: '#5d4037', shape: 'box', label: 'CP' },
    fruit_loops: { color: '#e91e63', shape: 'box', label: 'FL' },
    honey_crunch: { color: '#ffb300', shape: 'box', label: 'HC' },
    granola: { color: '#795548', shape: 'box', label: 'GR' },
    rice_pops: { color: '#90caf9', shape: 'box', label: 'RP' },
    wheat_bites: { color: '#a1887f', shape: 'box', label: 'WB' },

    // SNACKS
    chips: { color: '#ffc107', shape: 'bag', label: 'PC' },
    pretzels: { color: '#8d6e63', shape: 'bag', label: 'PR' },
    cookies: { color: '#795548', shape: 'box', label: 'CK' },
    crackers: { color: '#ffcc80', shape: 'box', label: 'CR' },
    popcorn: { color: '#fff59d', shape: 'bag', label: 'PO' },
    candy: { color: '#7b1fa2', shape: 'bar' },
    nuts: { color: '#6d4c41', shape: 'jar' },
    gummy: { color: '#e91e63', shape: 'bag', label: 'GB' },

    // DRINKS
    milk: { color: '#eceff1', shape: 'carton', accent: '#2196f3' },
    orange_juice: { color: '#ff9800', shape: 'carton' },
    apple_juice: { color: '#c0ca33', shape: 'carton' },
    water: { color: '#29b6f6', shape: 'bottle' },
    soda_red: { color: '#f44336', shape: 'can' },
    soda_blue: { color: '#2196f3', shape: 'can' },
    soda_green: { color: '#4caf50', shape: 'can' },
    coffee: { color: '#5d4037', shape: 'jar' },

    // FROZEN
    ice_cream_choc: { color: '#5d4037', shape: 'tub' },
    ice_cream_van: { color: '#fff9c4', shape: 'tub' },
    ice_cream_straw: { color: '#f48fb1', shape: 'tub' },
    frozen_pizza: { color: '#ff7043', shape: 'box', label: 'PZ' },
    frozen_peas: { color: '#66bb6a', shape: 'bag', label: 'FP' },
    fish_sticks: { color: '#ffcc80', shape: 'box', label: 'FS' },
    frozen_fries: { color: '#ffd54f', shape: 'bag', label: 'FF' },
    ice_pops: { color: '#4dd0e1', shape: 'box', label: 'IP' },

    // DAIRY
    cheese_yellow: { color: '#ffc107', shape: 'cheese' },
    cheese_white: { color: '#fff9c4', shape: 'cheese' },
    butter: { color: '#fff59d', shape: 'box', label: 'BT' },
    yogurt_plain: { color: '#eceff1', shape: 'cup' },
    yogurt_straw: { color: '#f48fb1', shape: 'cup' },
    yogurt_blue: { color: '#7986cb', shape: 'cup' },
    cream: { color: '#fff8e1', shape: 'carton' },
    eggs: { color: '#ffcc80', shape: 'eggcarton' }
};

// Color utilities
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
}

function darken(hex, percent) {
    const rgb = hexToRgb(hex);
    const factor = 1 - percent / 100;
    return `rgb(${Math.floor(rgb.r * factor)}, ${Math.floor(rgb.g * factor)}, ${Math.floor(rgb.b * factor)})`;
}

function lighten(hex, percent) {
    const rgb = hexToRgb(hex);
    const factor = percent / 100;
    return `rgb(${Math.floor(rgb.r + (255 - rgb.r) * factor)}, ${Math.floor(rgb.g + (255 - rgb.g) * factor)}, ${Math.floor(rgb.b + (255 - rgb.b) * factor)})`;
}

// Drawing functions
function drawApple(ctx, x, y, w, h, color) {
    const cx = x + w / 2;
    const cy = y + h / 2 + 5;
    const radius = Math.min(w, h) / 2 - 6;

    // Main body
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();

    // Indent at top
    ctx.beginPath();
    ctx.arc(cx, cy - radius + 3, 6, 0, Math.PI, true);
    ctx.fillStyle = darken(color, 20);
    ctx.fill();

    // Stem
    ctx.beginPath();
    ctx.moveTo(cx, cy - radius + 2);
    ctx.lineTo(cx + 2, cy - radius - 8);
    ctx.strokeStyle = '#5d4037';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Leaf
    ctx.beginPath();
    ctx.ellipse(cx + 8, cy - radius - 4, 6, 3, 0.5, 0, Math.PI * 2);
    ctx.fillStyle = '#4caf50';
    ctx.fill();

    // Highlight
    ctx.beginPath();
    ctx.arc(cx - radius * 0.3, cy - radius * 0.3, radius * 0.25, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.fill();
}

function drawOrange(ctx, x, y, w, h, color) {
    const cx = x + w / 2;
    const cy = y + h / 2;
    const radius = Math.min(w, h) / 2 - 6;

    // Main body with texture
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();

    // Texture dots
    ctx.fillStyle = darken(color, 10);
    for (let i = 0; i < 20; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * radius * 0.8;
        const dotX = cx + Math.cos(angle) * dist;
        const dotY = cy + Math.sin(angle) * dist;
        ctx.beginPath();
        ctx.arc(dotX, dotY, 1.5, 0, Math.PI * 2);
        ctx.fill();
    }

    // Stem nub
    ctx.beginPath();
    ctx.arc(cx, cy - radius + 3, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#8bc34a';
    ctx.fill();

    // Highlight
    ctx.beginPath();
    ctx.arc(cx - radius * 0.3, cy - radius * 0.3, radius * 0.2, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.fill();
}

function drawBanana(ctx, x, y, w, h, color) {
    const cx = x + w / 2;
    const cy = y + h / 2;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(-0.3);

    // Banana body
    ctx.beginPath();
    ctx.moveTo(-w * 0.35, h * 0.1);
    ctx.quadraticCurveTo(-w * 0.4, -h * 0.3, 0, -h * 0.35);
    ctx.quadraticCurveTo(w * 0.4, -h * 0.3, w * 0.35, h * 0.1);
    ctx.quadraticCurveTo(w * 0.3, h * 0.25, 0, h * 0.2);
    ctx.quadraticCurveTo(-w * 0.3, h * 0.25, -w * 0.35, h * 0.1);
    ctx.fillStyle = color;
    ctx.fill();

    // Dark edge
    ctx.beginPath();
    ctx.moveTo(-w * 0.32, h * 0.08);
    ctx.quadraticCurveTo(-w * 0.35, -h * 0.25, 0, -h * 0.32);
    ctx.strokeStyle = darken(color, 15);
    ctx.lineWidth = 2;
    ctx.stroke();

    // Brown tips
    ctx.beginPath();
    ctx.arc(w * 0.32, h * 0.05, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#5d4037';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(-w * 0.32, h * 0.05, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#5d4037';
    ctx.fill();

    ctx.restore();
}

function drawLemon(ctx, x, y, w, h, color) {
    const cx = x + w / 2;
    const cy = y + h / 2;

    ctx.beginPath();
    ctx.ellipse(cx, cy, w / 2 - 6, h / 3, 0, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();

    // Points
    ctx.beginPath();
    ctx.ellipse(cx - w / 2 + 8, cy, 4, 3, 0, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(cx + w / 2 - 8, cy, 4, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Highlight
    ctx.beginPath();
    ctx.ellipse(cx - w * 0.15, cy - h * 0.08, w * 0.12, h * 0.06, -0.3, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.fill();
}

function drawTomato(ctx, x, y, w, h, color) {
    const cx = x + w / 2;
    const cy = y + h / 2 + 3;
    const radius = Math.min(w, h) / 2 - 6;

    // Main body (slightly flattened)
    ctx.beginPath();
    ctx.ellipse(cx, cy, radius, radius * 0.85, 0, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();

    // Green stem
    ctx.fillStyle = '#4caf50';
    for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
        ctx.beginPath();
        ctx.ellipse(
            cx + Math.cos(angle) * 6,
            cy - radius * 0.85 + 2,
            4, 8, angle + Math.PI / 2, 0, Math.PI * 2
        );
        ctx.fill();
    }

    // Highlight
    ctx.beginPath();
    ctx.arc(cx - radius * 0.3, cy - radius * 0.3, radius * 0.2, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.fill();
}

function drawCarrot(ctx, x, y, w, h, color) {
    const cx = x + w / 2;

    // Carrot body
    ctx.beginPath();
    ctx.moveTo(cx - w * 0.25, y + h * 0.25);
    ctx.lineTo(cx + w * 0.25, y + h * 0.25);
    ctx.lineTo(cx, y + h * 0.9);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();

    // Lines on carrot
    ctx.strokeStyle = darken(color, 15);
    ctx.lineWidth = 1;
    for (let i = 0; i < 4; i++) {
        const yPos = y + h * 0.35 + i * 12;
        const width = (h * 0.9 - yPos + y) / (h * 0.65) * w * 0.25;
        ctx.beginPath();
        ctx.moveTo(cx - width, yPos);
        ctx.lineTo(cx + width, yPos);
        ctx.stroke();
    }

    // Green top
    ctx.fillStyle = '#43a047';
    for (let i = -1; i <= 1; i++) {
        ctx.beginPath();
        ctx.ellipse(cx + i * 6, y + h * 0.18, 4, 12, i * 0.3, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawBroccoli(ctx, x, y, w, h, color) {
    const cx = x + w / 2;

    // Stem
    ctx.fillStyle = '#81c784';
    ctx.fillRect(cx - 6, y + h * 0.5, 12, h * 0.4);

    // Florets
    ctx.fillStyle = color;
    const florets = [
        { x: 0, y: 0.32, r: 14 },
        { x: -12, y: 0.4, r: 11 },
        { x: 12, y: 0.4, r: 11 },
        { x: -7, y: 0.24, r: 10 },
        { x: 7, y: 0.24, r: 10 },
    ];
    florets.forEach(f => {
        ctx.beginPath();
        ctx.arc(cx + f.x, y + h * f.y, f.r, 0, Math.PI * 2);
        ctx.fill();
    });

    // Texture bumps
    ctx.fillStyle = darken(color, 10);
    for (let i = 0; i < 15; i++) {
        const fx = cx + (Math.random() - 0.5) * 24;
        const fy = y + h * 0.25 + Math.random() * 20;
        ctx.beginPath();
        ctx.arc(fx, fy, 3, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawGrapes(ctx, x, y, w, h, color) {
    const cx = x + w / 2;
    const grapeRadius = 7;

    // Stem
    ctx.strokeStyle = '#795548';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx, y + h * 0.12);
    ctx.lineTo(cx, y + h * 0.26);
    ctx.stroke();

    // Grapes in pyramid
    ctx.fillStyle = color;
    const rows = [[0], [-8, 8], [-16, 0, 16], [-8, 8]];
    let yPos = y + h * 0.32;
    rows.forEach(row => {
        row.forEach(xOffset => {
            ctx.beginPath();
            ctx.arc(cx + xOffset, yPos, grapeRadius, 0, Math.PI * 2);
            ctx.fill();
            // Highlight
            ctx.beginPath();
            ctx.arc(cx + xOffset - 2, yPos - 2, 2, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255,255,255,0.4)';
            ctx.fill();
            ctx.fillStyle = color;
        });
        yPos += 13;
    });
}

function drawWatermelon(ctx, x, y, w, h, color) {
    const cx = x + w / 2;
    const cy = y + h / 2;
    const radius = Math.min(w, h) * 0.4;

    // Outer rind (green)
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();

    // Light green ring
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 0.9, 0, Math.PI * 2);
    ctx.fillStyle = '#a5d6a7';
    ctx.fill();

    // Inner red
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 0.8, 0, Math.PI * 2);
    ctx.fillStyle = '#ef5350';
    ctx.fill();

    // Seeds
    ctx.fillStyle = '#1a1a1a';
    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2 + 0.3;
        const seedX = cx + Math.cos(angle) * radius * 0.5;
        const seedY = cy + Math.sin(angle) * radius * 0.5;
        ctx.beginPath();
        ctx.ellipse(seedX, seedY, 2, 4, angle, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawBox(ctx, x, y, w, h, color, label) {
    const boxWidth = w * 0.8;
    const boxHeight = h * 0.85;
    const boxX = x + (w - boxWidth) / 2;
    const boxY = y + (h - boxHeight) / 2;

    // Main box
    ctx.fillStyle = color;
    ctx.fillRect(boxX, boxY, boxWidth, boxHeight);

    // 3D effect - right side
    ctx.fillStyle = darken(color, 20);
    ctx.beginPath();
    ctx.moveTo(boxX + boxWidth, boxY);
    ctx.lineTo(boxX + boxWidth + 4, boxY + 4);
    ctx.lineTo(boxX + boxWidth + 4, boxY + boxHeight + 4);
    ctx.lineTo(boxX + boxWidth, boxY + boxHeight);
    ctx.fill();

    // 3D effect - top
    ctx.fillStyle = lighten(color, 20);
    ctx.beginPath();
    ctx.moveTo(boxX, boxY);
    ctx.lineTo(boxX + 4, boxY - 4);
    ctx.lineTo(boxX + boxWidth + 4, boxY - 4);
    ctx.lineTo(boxX + boxWidth, boxY);
    ctx.fill();

    // Border
    ctx.strokeStyle = darken(color, 30);
    ctx.lineWidth = 2;
    ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

    // Label
    if (label) {
        // Label background
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.fillRect(boxX + 4, boxY + boxHeight * 0.3, boxWidth - 8, boxHeight * 0.4);

        ctx.fillStyle = darken(color, 40);
        ctx.font = `bold ${boxHeight * 0.3}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, boxX + boxWidth / 2, boxY + boxHeight / 2);
    }
}

function drawBag(ctx, x, y, w, h, color, label) {
    const bagWidth = w * 0.75;
    const bagHeight = h * 0.8;
    const bagX = x + (w - bagWidth) / 2;
    const bagY = y + (h - bagHeight) / 2;

    // Bag body
    ctx.beginPath();
    ctx.moveTo(bagX + bagWidth * 0.15, bagY + bagHeight * 0.15);
    ctx.lineTo(bagX + bagWidth * 0.85, bagY + bagHeight * 0.15);
    ctx.lineTo(bagX + bagWidth * 0.95, bagY + bagHeight);
    ctx.lineTo(bagX + bagWidth * 0.05, bagY + bagHeight);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = darken(color, 25);
    ctx.lineWidth = 2;
    ctx.stroke();

    // Crinkled top
    ctx.beginPath();
    ctx.moveTo(bagX + bagWidth * 0.1, bagY + bagHeight * 0.15);
    for (let i = 0; i <= 8; i++) {
        const px = bagX + bagWidth * 0.1 + (bagWidth * 0.8 / 8) * i;
        const py = bagY + bagHeight * 0.15 + (i % 2 === 0 ? -8 : 0);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
    }
    ctx.strokeStyle = darken(color, 20);
    ctx.lineWidth = 2;
    ctx.stroke();

    // Twist tie
    ctx.fillStyle = '#f44336';
    ctx.fillRect(bagX + bagWidth * 0.35, bagY + bagHeight * 0.05, bagWidth * 0.3, 6);

    // Label
    if (label) {
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        const labelY = bagY + bagHeight * 0.35;
        ctx.fillRect(bagX + bagWidth * 0.1, labelY, bagWidth * 0.8, bagHeight * 0.35);

        ctx.fillStyle = darken(color, 40);
        ctx.font = `bold ${bagHeight * 0.22}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, bagX + bagWidth / 2, labelY + bagHeight * 0.175);
    }
}

function drawBottle(ctx, x, y, w, h, color) {
    const bottleWidth = w * 0.45;
    const bottleHeight = h * 0.85;
    const bottleX = x + (w - bottleWidth) / 2;
    const bottleY = y + (h - bottleHeight) / 2;

    // Cap
    ctx.fillStyle = '#1565c0';
    ctx.fillRect(bottleX + bottleWidth * 0.2, bottleY, bottleWidth * 0.6, bottleHeight * 0.1);

    // Neck
    ctx.fillStyle = color;
    ctx.fillRect(bottleX + bottleWidth * 0.25, bottleY + bottleHeight * 0.08, bottleWidth * 0.5, bottleHeight * 0.15);

    // Body
    ctx.beginPath();
    ctx.moveTo(bottleX + bottleWidth * 0.25, bottleY + bottleHeight * 0.23);
    ctx.lineTo(bottleX, bottleY + bottleHeight * 0.33);
    ctx.lineTo(bottleX, bottleY + bottleHeight);
    ctx.lineTo(bottleX + bottleWidth, bottleY + bottleHeight);
    ctx.lineTo(bottleX + bottleWidth, bottleY + bottleHeight * 0.33);
    ctx.lineTo(bottleX + bottleWidth * 0.75, bottleY + bottleHeight * 0.23);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();

    // Label
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.fillRect(bottleX + 2, bottleY + bottleHeight * 0.45, bottleWidth - 4, bottleHeight * 0.3);

    // Highlight
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.fillRect(bottleX + 3, bottleY + bottleHeight * 0.35, bottleWidth * 0.25, bottleHeight * 0.5);
}

function drawCan(ctx, x, y, w, h, color) {
    const canWidth = w * 0.55;
    const canHeight = h * 0.8;
    const canX = x + (w - canWidth) / 2;
    const canY = y + (h - canHeight) / 2;

    // Main body
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(canX, canY + 5, canWidth, canHeight - 5, 4);
    ctx.fill();

    // Top rim
    ctx.fillStyle = '#bdbdbd';
    ctx.beginPath();
    ctx.ellipse(canX + canWidth / 2, canY + 6, canWidth / 2, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Pull tab
    ctx.fillStyle = '#9e9e9e';
    ctx.beginPath();
    ctx.ellipse(canX + canWidth / 2, canY + 6, 6, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Highlight
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.fillRect(canX + 4, canY + 15, canWidth * 0.25, canHeight - 25);
}

function drawCarton(ctx, x, y, w, h, color, accent) {
    const cartonWidth = w * 0.65;
    const cartonHeight = h * 0.85;
    const cartonX = x + (w - cartonWidth) / 2;
    const cartonY = y + (h - cartonHeight) / 2;

    // Main body
    ctx.fillStyle = color;
    ctx.fillRect(cartonX, cartonY + cartonHeight * 0.15, cartonWidth, cartonHeight * 0.85);

    // Roof
    ctx.beginPath();
    ctx.moveTo(cartonX, cartonY + cartonHeight * 0.15);
    ctx.lineTo(cartonX + cartonWidth / 2, cartonY);
    ctx.lineTo(cartonX + cartonWidth, cartonY + cartonHeight * 0.15);
    ctx.closePath();
    ctx.fillStyle = accent || darken(color, 15);
    ctx.fill();

    // Border
    ctx.strokeStyle = darken(color, 25);
    ctx.lineWidth = 2;
    ctx.strokeRect(cartonX, cartonY + cartonHeight * 0.15, cartonWidth, cartonHeight * 0.85);
    ctx.beginPath();
    ctx.moveTo(cartonX, cartonY + cartonHeight * 0.15);
    ctx.lineTo(cartonX + cartonWidth / 2, cartonY);
    ctx.lineTo(cartonX + cartonWidth, cartonY + cartonHeight * 0.15);
    ctx.stroke();
}

function drawJar(ctx, x, y, w, h, color) {
    const jarWidth = w * 0.6;
    const jarHeight = h * 0.8;
    const jarX = x + (w - jarWidth) / 2;
    const jarY = y + (h - jarHeight) / 2;

    // Lid
    ctx.fillStyle = '#795548';
    ctx.beginPath();
    ctx.roundRect(jarX - 3, jarY, jarWidth + 6, jarHeight * 0.12, 3);
    ctx.fill();

    // Body
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(jarX, jarY + jarHeight * 0.1, jarWidth, jarHeight * 0.9, 8);
    ctx.fill();

    // Highlight
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.beginPath();
    ctx.roundRect(jarX + 4, jarY + jarHeight * 0.15, jarWidth * 0.25, jarHeight * 0.7, 4);
    ctx.fill();
}

function drawBar(ctx, x, y, w, h, color) {
    const barWidth = w * 0.85;
    const barHeight = h * 0.35;
    const barX = x + (w - barWidth) / 2;
    const barY = y + (h - barHeight) / 2;

    // Wrapper
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(barX, barY, barWidth, barHeight, 4);
    ctx.fill();

    // Foil showing
    ctx.fillStyle = '#ffd700';
    ctx.fillRect(barX, barY, barWidth * 0.15, barHeight);

    // Wrapper detail
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.fillRect(barX + barWidth * 0.2, barY + 3, barWidth * 0.6, barHeight * 0.35);

    ctx.strokeStyle = darken(color, 20);
    ctx.lineWidth = 1;
    ctx.strokeRect(barX, barY, barWidth, barHeight);
}

function drawTub(ctx, x, y, w, h, color) {
    const tubWidth = w * 0.8;
    const tubHeight = h * 0.6;
    const tubX = x + (w - tubWidth) / 2;
    const tubY = y + (h - tubHeight) / 2 + 5;

    // Main body
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(tubX, tubY, tubWidth, tubHeight, 8);
    ctx.fill();

    // Lid
    ctx.fillStyle = lighten(color, 30);
    ctx.beginPath();
    ctx.roundRect(tubX - 2, tubY - 2, tubWidth + 4, tubHeight * 0.2, 4);
    ctx.fill();

    // Label
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.fillRect(tubX + tubWidth * 0.1, tubY + tubHeight * 0.35, tubWidth * 0.8, tubHeight * 0.45);

    // Ice cream swirl hint
    ctx.fillStyle = darken(color, 10);
    ctx.beginPath();
    ctx.arc(tubX + tubWidth / 2, tubY + tubHeight * 0.55, 8, 0, Math.PI * 2);
    ctx.fill();
}

function drawCup(ctx, x, y, w, h, color) {
    const cupWidth = w * 0.55;
    const cupHeight = h * 0.65;
    const cupX = x + (w - cupWidth) / 2;
    const cupY = y + (h - cupHeight) / 2 + 5;

    // Cup body (tapered)
    ctx.beginPath();
    ctx.moveTo(cupX + 4, cupY + cupHeight * 0.15);
    ctx.lineTo(cupX + cupWidth - 4, cupY + cupHeight * 0.15);
    ctx.lineTo(cupX + cupWidth, cupY + cupHeight);
    ctx.lineTo(cupX, cupY + cupHeight);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();

    // Lid
    ctx.fillStyle = '#f5f5f5';
    ctx.beginPath();
    ctx.ellipse(cupX + cupWidth / 2, cupY + cupHeight * 0.15, cupWidth / 2, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Foil top
    ctx.fillStyle = '#c0c0c0';
    ctx.beginPath();
    ctx.ellipse(cupX + cupWidth / 2, cupY + cupHeight * 0.15, cupWidth / 2 - 3, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Stripe
    ctx.fillStyle = darken(color, 15);
    ctx.fillRect(cupX + 2, cupY + cupHeight * 0.5, cupWidth - 4, cupHeight * 0.15);
}

function drawCheese(ctx, x, y, w, h, color) {
    const cheeseWidth = w * 0.75;
    const cheeseHeight = h * 0.5;
    const cheeseX = x + (w - cheeseWidth) / 2;
    const cheeseY = y + (h - cheeseHeight) / 2 + 5;

    // Wedge shape
    ctx.beginPath();
    ctx.moveTo(cheeseX, cheeseY + cheeseHeight);
    ctx.lineTo(cheeseX + cheeseWidth, cheeseY + cheeseHeight);
    ctx.lineTo(cheeseX + cheeseWidth, cheeseY + cheeseHeight * 0.25);
    ctx.lineTo(cheeseX, cheeseY);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();

    // Top surface
    ctx.beginPath();
    ctx.moveTo(cheeseX, cheeseY);
    ctx.lineTo(cheeseX + cheeseWidth, cheeseY + cheeseHeight * 0.25);
    ctx.lineTo(cheeseX + cheeseWidth + 6, cheeseY + cheeseHeight * 0.15);
    ctx.lineTo(cheeseX + 6, cheeseY - 8);
    ctx.closePath();
    ctx.fillStyle = lighten(color, 15);
    ctx.fill();

    // Holes
    ctx.fillStyle = darken(color, 20);
    ctx.beginPath();
    ctx.arc(cheeseX + cheeseWidth * 0.3, cheeseY + cheeseHeight * 0.6, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cheeseX + cheeseWidth * 0.7, cheeseY + cheeseHeight * 0.75, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cheeseX + cheeseWidth * 0.5, cheeseY + cheeseHeight * 0.45, 3, 0, Math.PI * 2);
    ctx.fill();
}

function drawEggCarton(ctx, x, y, w, h, color) {
    const cartonWidth = w * 0.85;
    const cartonHeight = h * 0.55;
    const cartonX = x + (w - cartonWidth) / 2;
    const cartonY = y + (h - cartonHeight) / 2 + 5;

    // Carton base
    ctx.fillStyle = '#a1887f';
    ctx.beginPath();
    ctx.roundRect(cartonX, cartonY, cartonWidth, cartonHeight, 4);
    ctx.fill();

    // Lid (slightly open)
    ctx.fillStyle = '#8d6e63';
    ctx.beginPath();
    ctx.moveTo(cartonX, cartonY);
    ctx.lineTo(cartonX + cartonWidth, cartonY);
    ctx.lineTo(cartonX + cartonWidth - 4, cartonY - 8);
    ctx.lineTo(cartonX + 4, cartonY - 8);
    ctx.closePath();
    ctx.fill();

    // Eggs visible
    ctx.fillStyle = color;
    const eggSpacing = cartonWidth / 6;
    for (let i = 0; i < 6; i++) {
        ctx.beginPath();
        ctx.ellipse(cartonX + eggSpacing * (i + 0.5), cartonY + cartonHeight * 0.45, 6, 8, 0, 0, Math.PI * 2);
        ctx.fill();
        // Highlight on each egg
        ctx.beginPath();
        ctx.arc(cartonX + eggSpacing * (i + 0.5) - 2, cartonY + cartonHeight * 0.4, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.fill();
        ctx.fillStyle = color;
    }
}

// Main drawing function
function drawProduct(productId, product) {
    const width = 64;
    const height = 80;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Transparent background
    ctx.clearRect(0, 0, width, height);

    const { color, shape, label, accent } = product;

    switch (shape) {
        case 'apple':
            drawApple(ctx, 0, 0, width, height, color);
            break;
        case 'orange':
            drawOrange(ctx, 0, 0, width, height, color);
            break;
        case 'banana':
            drawBanana(ctx, 0, 0, width, height, color);
            break;
        case 'lemon':
            drawLemon(ctx, 0, 0, width, height, color);
            break;
        case 'tomato':
            drawTomato(ctx, 0, 0, width, height, color);
            break;
        case 'carrot':
            drawCarrot(ctx, 0, 0, width, height, color);
            break;
        case 'broccoli':
            drawBroccoli(ctx, 0, 0, width, height, color);
            break;
        case 'grapes':
            drawGrapes(ctx, 0, 0, width, height, color);
            break;
        case 'watermelon':
            drawWatermelon(ctx, 0, 0, width, height, color);
            break;
        case 'box':
            drawBox(ctx, 0, 0, width, height, color, label);
            break;
        case 'bag':
            drawBag(ctx, 0, 0, width, height, color, label);
            break;
        case 'bottle':
            drawBottle(ctx, 0, 0, width, height, color);
            break;
        case 'can':
            drawCan(ctx, 0, 0, width, height, color);
            break;
        case 'carton':
            drawCarton(ctx, 0, 0, width, height, color, accent);
            break;
        case 'jar':
            drawJar(ctx, 0, 0, width, height, color);
            break;
        case 'bar':
            drawBar(ctx, 0, 0, width, height, color);
            break;
        case 'tub':
            drawTub(ctx, 0, 0, width, height, color);
            break;
        case 'cup':
            drawCup(ctx, 0, 0, width, height, color);
            break;
        case 'cheese':
            drawCheese(ctx, 0, 0, width, height, color);
            break;
        case 'eggcarton':
            drawEggCarton(ctx, 0, 0, width, height, color);
            break;
        default:
            drawBox(ctx, 0, 0, width, height, color, label);
    }

    return canvas;
}

// Generate all sprites
console.log('Generating product sprites...');

let count = 0;
for (const [id, product] of Object.entries(products)) {
    const canvas = drawProduct(id, product);
    const buffer = canvas.toBuffer('image/png');
    const outputPath = path.join(OUTPUT_DIR, `${id}.png`);
    fs.writeFileSync(outputPath, buffer);
    count++;
    console.log(`  Created: ${id}.png`);
}

console.log(`\nGenerated ${count} product sprites in ${OUTPUT_DIR}`);
