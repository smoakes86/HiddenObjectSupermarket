import OpenAI from "openai";
import fs from "fs";
import path from "path";

const openai = new OpenAI();

// ============ CONFIGURATION ============

const products = [
  "apple",
  "banana",
  "milk",
  // Add more products here
];

const prompt = (productName) =>
  `A clean, simple illustration of a ${productName} on a white background, suitable for a supermarket game. Cartoon style, vibrant colors.`;

const variationsPerProduct = 3;

const outputDir = "./public/assets/images/generated";

const imageOptions = {
  model: "gpt-image-1.5", // Latest OpenAI image model
  size: "1024x1024",
  quality: "medium", // Options: "low", "medium", "high"
};

// ========================================

async function generateImages() {
  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log(`Generating ${variationsPerProduct} variation(s) for ${products.length} product(s)...`);
  console.log(`Output directory: ${outputDir}\n`);

  for (const product of products) {
    console.log(`\n--- ${product} ---`);

    for (let i = 1; i <= variationsPerProduct; i++) {
      const productPrompt = prompt(product);
      const filename = `${product}_${i}.png`;
      const filepath = path.join(outputDir, filename);

      console.log(`  Generating ${filename}...`);

      try {
        const result = await openai.images.generate({
          ...imageOptions,
          prompt: productPrompt,
        });

        const imageBase64 = result.data[0].b64_json;
        const imageBuffer = Buffer.from(imageBase64, "base64");
        fs.writeFileSync(filepath, imageBuffer);

        console.log(`  ✓ Saved ${filename}`);
      } catch (error) {
        console.error(`  ✗ Failed to generate ${filename}: ${error.message}`);
      }
    }
  }

  console.log("\n✓ Done!");
}

generateImages();
