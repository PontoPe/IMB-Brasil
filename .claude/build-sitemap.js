// Gera site/sitemap.xml a partir das fontes de verdade (js/products.js e js/cases.js),
// para o sitemap nunca mais divergir do catálogo real.
//
//   node .claude/build-sitemap.js
//
// Rodar sempre que entrar/sair um equipamento ou um case.
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..', 'site');
const ORIGIN = 'https://imb-brasil.com.br';

// products.js/cases.js são IIFEs que só dependem de window.location.pathname.
function loadData() {
  const sandbox = { window: { location: { pathname: '/' } } };
  vm.createContext(sandbox);
  for (const file of ['js/products.js', 'js/cases.js']) {
    vm.runInContext(fs.readFileSync(path.join(ROOT, file), 'utf8'), sandbox, { filename: file });
  }
  return { products: sandbox.window.IMB_PRODUCTS.products, cases: sandbox.window.IMB_CASES.cases };
}

// Cada página nas 3 línguas. `query` é o mesmo nos 3 idiomas (o catálogo aceita o slug PT).
const PAGES = [
  { pt: '/',                 en: '/en/',                    es: '/es/',                      priority: '1.0', changefreq: 'weekly' },
  { pt: '/produtos.html',    en: '/en/products.html',       es: '/es/productos.html',        priority: '0.9', changefreq: 'weekly' },
  { pt: '/produtos.html',    en: '/en/products.html',       es: '/es/productos.html',        priority: '0.8', changefreq: 'weekly', query: '?tipo=pavimentadoras' },
  { pt: '/produtos.html',    en: '/en/products.html',       es: '/es/productos.html',        priority: '0.8', changefreq: 'weekly', query: '?tipo=extrusoras' },
  { pt: '/comparar.html',    en: '/en/compare.html',        es: '/es/comparar.html',         priority: '0.7', changefreq: 'monthly' },
  { pt: '/cases.html',       en: '/en/cases.html',          es: '/es/casos.html',            priority: '0.8', changefreq: 'weekly' },
  { pt: '/contato.html',     en: '/en/contact.html',        es: '/es/contacto.html',         priority: '0.8', changefreq: 'monthly' },
  { pt: '/politica-de-privacidade.html', en: '/en/privacy-policy.html', es: '/es/politica-de-privacidad.html', priority: '0.3', changefreq: 'yearly' },
  { pt: '/termos-de-uso.html',           en: '/en/terms-of-use.html',   es: '/es/terminos-de-uso.html',        priority: '0.3', changefreq: 'yearly' },
];

const DETAIL = {
  produto: { pt: '/produto.html', en: '/en/product.html', es: '/es/producto.html' },
  case:    { pt: '/case.html',    en: '/en/case.html',    es: '/es/caso.html' },
};

function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function urlBlock(entry, lang) {
  const alt = ['pt', 'en', 'es']
    .map((l) => `    <xhtml:link rel="alternate" hreflang="${l === 'pt' ? 'pt-BR' : l}" href="${esc(ORIGIN + entry[l])}"/>`)
    .join('\n');
  const xdefault = `    <xhtml:link rel="alternate" hreflang="x-default" href="${esc(ORIGIN + entry.pt)}"/>`;
  return [
    '  <url>',
    `    <loc>${esc(ORIGIN + entry[lang])}</loc>`,
    alt,
    xdefault,
    `    <changefreq>${entry.changefreq}</changefreq>`,
    `    <priority>${entry.priority}</priority>`,
    '  </url>',
  ].join('\n');
}

function build() {
  const { products, cases } = loadData();
  const groups = [];

  groups.push(['Páginas fixas', PAGES.map((p) => ({
    pt: p.pt + (p.query || ''), en: p.en + (p.query || ''), es: p.es + (p.query || ''),
    priority: p.priority, changefreq: p.changefreq,
  }))]);

  groups.push([`Fichas técnicas (${products.length} equipamentos)`, products.map((p) => ({
    pt: `${DETAIL.produto.pt}?id=${p.id}`, en: `${DETAIL.produto.en}?id=${p.id}`, es: `${DETAIL.produto.es}?id=${p.id}`,
    priority: '0.7', changefreq: 'monthly',
  }))]);

  groups.push([`Cases (${cases.length} obras)`, cases.map((c) => ({
    pt: `${DETAIL.case.pt}?id=${c.id}`, en: `${DETAIL.case.en}?id=${c.id}`, es: `${DETAIL.case.es}?id=${c.id}`,
    priority: '0.6', changefreq: 'monthly',
  }))]);

  const body = groups.map(([label, entries]) => {
    const blocks = entries.map((e) => ['pt', 'en', 'es'].map((l) => urlBlock(e, l)).join('\n')).join('\n');
    return `  <!-- ${label} -->\n${blocks}`;
  }).join('\n\n');

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<!-- Gerado por .claude/build-sitemap.js a partir de js/products.js e js/cases.js. Não editar à mão. -->',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '        xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    '',
    body,
    '',
    '</urlset>',
    '',
  ].join('\n');

  fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), xml, 'utf8');
  const count = (xml.match(/<loc>/g) || []).length;
  console.log(`sitemap.xml: ${count} URLs (${products.length} equipamentos, ${cases.length} cases) × 3 idiomas`);
}

build();
