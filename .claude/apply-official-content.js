// One-off bulk edit: official content pass.
// 1) "Entre em contato / Contact Us / Contacto" secondary CTA now points to the
//    contact form anchor (#contato / #contact / #contacto) instead of the page top.
// 2) WhatsApp display number updated everywhere it appears as text.
// Run: node .claude/apply-official-content.js
const fs = require('fs');
const path = require('path');

const SITE = path.join(__dirname, '..', 'site');

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = path.join(dir, d.name);
    if (d.isDirectory()) return walk(p);
    return d.name.endsWith('.html') ? [p] : [];
  });
}

// Secondary CTA href -> contact form anchor, per language filename.
const ctaRules = [
  [/href="contato\.html"(\s+class="[^"]*btn-secondary-light nav-cta[^"]*")/g, 'href="contato.html#contato"$1'],
  [/href="contact\.html"(\s+class="[^"]*btn-secondary-light nav-cta[^"]*")/g, 'href="contact.html#contact"$1'],
  [/href="contacto\.html"(\s+class="[^"]*btn-secondary-light nav-cta[^"]*")/g, 'href="contacto.html#contacto"$1'],
];

const WA_OLD = '+55 (47) 98888-7777';
const WA_NEW = '+55 (41) 98849-0341';

let filesChanged = 0;
let ctaCount = 0;
let waCount = 0;

for (const file of walk(SITE)) {
  let src = fs.readFileSync(file, 'utf8');
  const before = src;

  for (const [re, rep] of ctaRules) {
    const matches = src.match(re);
    if (matches) ctaCount += matches.length;
    src = src.replace(re, rep);
  }
  if (src.includes(WA_OLD)) {
    waCount += src.split(WA_OLD).length - 1;
    src = src.split(WA_OLD).join(WA_NEW);
  }

  if (src !== before) {
    fs.writeFileSync(file, src, 'utf8');
    filesChanged++;
    console.log('updated', path.relative(SITE, file));
  }
}

console.log(`\nDone. files changed: ${filesChanged}, CTA anchors fixed: ${ctaCount}, WhatsApp numbers updated: ${waCount}`);
