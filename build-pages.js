// This script runs automatically on every Netlify deploy (after
// build-products.js). It takes the main index.html (the "engine")
// and creates a real, separate page for every category, e.g.
// /mobiles/index.html, /air-conditioners/index.html, etc.
//
// Each generated page is the exact same site — same design, same
// code — just pre-set to show one category when it loads, with its
// own clean URL, title and description for better SEO.
//
// You never need to run this yourself — Netlify does it automatically
// whenever the Admin Panel (or Claude) saves a change.

const fs = require("fs");
const path = require("path");

const rootDir = __dirname;
const templatePath = path.join(rootDir, "index.html");
const template = fs.readFileSync(templatePath, "utf8");

const categories = [
  { name: "Air Conditioners", slug: "air-conditioners", title: "Air Conditioners", desc: "Shop Air Conditioners in Karachi on easy monthly installments with 0% markup and free delivery." },
  { name: "LED / Smart TVs", slug: "led-smart-tvs", title: "LED & Smart TVs", desc: "Shop LED and Smart TVs in Karachi on easy monthly installments with 0% markup and free delivery." },
  { name: "Refrigerators", slug: "refrigerators", title: "Refrigerators", desc: "Shop Refrigerators in Karachi on easy monthly installments with 0% markup and free delivery." },
  { name: "Washing Machines", slug: "washing-machines", title: "Washing Machines", desc: "Shop Washing Machines in Karachi on easy monthly installments with 0% markup and free delivery." },
  { name: "Deep Freezers", slug: "deep-freezers", title: "Deep Freezers", desc: "Shop Deep Freezers in Karachi on easy monthly installments with 0% markup and free delivery." },
  { name: "Mobiles", slug: "mobiles", title: "Mobiles & Tablets", desc: "Shop Mobiles and Tablets in Karachi on easy monthly installments with 0% markup and free delivery." },
  { name: "Laptops", slug: "laptops", title: "Laptops", desc: "Shop Laptops in Karachi on easy monthly installments with 0% markup and free delivery." },
  { name: "Room Coolers", slug: "room-coolers", title: "Room Coolers", desc: "Shop Room Coolers in Karachi on easy monthly installments with 0% markup and free delivery." },
  { name: "Kitchen Appliances", slug: "kitchen-appliances", title: "Kitchen Appliances", desc: "Shop Kitchen Appliances in Karachi on easy monthly installments with 0% markup and free delivery." },
];

const TITLE_RE = /<title>.*?<\/title>/s;
const DESC_RE = /<meta name="description" content=".*?">/s;
const HEAD_CLOSE = "</head>";

let created = 0;

for (const cat of categories) {
  let page = template;

  // Give each page its own title + meta description (better for SEO)
  page = page.replace(TITLE_RE, `<title>${cat.title} in Karachi | Time Electronic</title>`);
  page = page.replace(DESC_RE, `<meta name="description" content="${cat.desc}">`);

  // Tell the page which category to auto-show when it loads
  const initScript = `<script>window.__INITIAL_CATEGORY__ = ${JSON.stringify(cat.name)};</script>\n`;
  page = page.replace(HEAD_CLOSE, initScript + HEAD_CLOSE);

  const outDir = path.join(rootDir, cat.slug);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "index.html"), page);
  created++;
}

console.log(`Generated ${created} category pages.`);
