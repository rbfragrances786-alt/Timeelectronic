// This script runs automatically on every Netlify deploy.
// It reads all category folders inside data/products/ and combines
// every product file into one data/products.json file that the
// website (index.html) actually loads. You never need to run this
// yourself — Netlify does it for you whenever the Admin Panel saves
// a change.

const fs = require("fs");
const path = require("path");

const baseDir = path.join(__dirname, "data", "products");
const outFile = path.join(__dirname, "data", "products.json");

let all = [];

if (fs.existsSync(baseDir)) {
  const categoryFolders = fs
    .readdirSync(baseDir)
    .filter(f => fs.statSync(path.join(baseDir, f)).isDirectory());

  for (const folder of categoryFolders) {
    const folderPath = path.join(baseDir, folder);
    const files = fs.readdirSync(folderPath).filter(f => f.endsWith(".json"));
    for (const file of files) {
      const raw = fs.readFileSync(path.join(folderPath, file), "utf8");
      try {
        const product = JSON.parse(raw);
        all.push(product);
      } catch (err) {
        console.error(`Skipping invalid JSON file: ${folder}/${file}`, err.message);
      }
    }
  }
}

fs.writeFileSync(outFile, JSON.stringify({ products: all }, null, 2));
console.log(`Combined ${all.length} products into data/products.json`);
