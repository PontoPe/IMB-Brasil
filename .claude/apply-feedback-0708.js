#!/usr/bin/env node
/**
 * Checklist de feedback 07/08 — correções pontuais em todo o site.
 *
 * 1. Rodapé "Contato" apontava pro topo da página Sobre; agora ancora na seção do formulário.
 * 2. Rodapé "Assistência Técnica" era href="#"; vira .wa-link (WhatsApp com msg contextual).
 * 3. Telefone genérico (47) 98888-7777 sobrou em vários rodapés -> WhatsApp oficial.
 * 4. Cards de "Nossas Linhas" tinham .vignette-bottom (retângulo cinza chapado) -> removido.
 * 5. Subtítulo das extrusoras atualizado com a lista oficial de perfis.
 * 6. Hero de Nossos Projetos: opacity-40 estava em cada slide, então todos ficavam
 *    visíveis ao mesmo tempo (sobrepostos). A opacidade vai pro wrapper.
 */
const fs = require('fs');
const path = require('path');

const SITE = path.join(__dirname, '..', 'site');

const WA_PHONE = '+55 (41) 98849-0341';

const LOCALES = {
  pt: {
    dir: SITE,
    contactHref: 'contato.html',
    contactAnchor: 'contato.html#contato',
    contactLabel: 'Contato',
    supportLabel: 'Assistência Técnica',
    supportMsg: 'Olá! Preciso de assistência técnica para um equipamento IMB.',
    supportAria: 'Falar com a assistência técnica IMB no WhatsApp',
    extruderOld: 'Versatilidade inigualável para a construção de meio-fio, sarjetas, muretas New Jersey e calçadas com acabamento superior.',
    extruderNew: 'Versatilidade inigualável para a execução de meio-fio, guia e sarjeta, calçada, canaleta U, canaletas de drenagem em geral e perfis personalizados.',
  },
  en: {
    dir: path.join(SITE, 'en'),
    contactHref: 'contact.html',
    contactAnchor: 'contact.html#contact',
    contactLabel: 'Contact',
    supportLabel: 'Technical Support',
    supportMsg: 'Hello! I need technical support for an IMB machine.',
    supportAria: 'Talk to IMB technical support on WhatsApp',
    extruderOld: 'Unmatched versatility for building curbs, gutters, New Jersey barriers and sidewalks with superior finish.',
    extruderNew: 'Unmatched versatility for curbs, curb-and-gutter, sidewalks, U-channels, general drainage channels and custom profiles.',
  },
  es: {
    dir: path.join(SITE, 'es'),
    contactHref: 'contacto.html',
    contactAnchor: 'contacto.html#contacto',
    contactLabel: 'Contacto',
    supportLabel: 'Asistencia Técnica',
    supportMsg: '¡Hola! Necesito asistencia técnica para un equipo IMB.',
    supportAria: 'Hablar con la asistencia técnica de IMB por WhatsApp',
    extruderOld: 'Versatilidad inigualable para construir cordones, cunetas, barreras New Jersey y veredas con acabado superior.',
    extruderNew: 'Versatilidad inigualable para la ejecución de cordones, cordón cuneta, veredas, canaletas U, canaletas de drenaje en general y perfiles personalizados.',
  },
};

function esc(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

let touched = 0;
const log = [];

for (const [loc, cfg] of Object.entries(LOCALES)) {
  const files = fs
    .readdirSync(cfg.dir)
    .filter((f) => f.endsWith('.html'))
    .map((f) => path.join(cfg.dir, f));

  for (const file of files) {
    const before = fs.readFileSync(file, 'utf8');
    let s = before;
    const hits = [];

    // 1. Rodapé "Contato" -> âncora do formulário
    const contactRe = new RegExp(
      `(<li><a class="hover:text-primary transition-colors" href=")${esc(cfg.contactHref)}(">${esc(cfg.contactLabel)}</a></li>)`,
      'g'
    );
    if (contactRe.test(s)) {
      s = s.replace(contactRe, `$1${cfg.contactAnchor}$2`);
      hits.push('footer-contato-anchor');
    }

    // 2. Rodapé "Assistência Técnica" -> WhatsApp
    const supportRe = new RegExp(
      `<li><a class="hover:text-primary transition-colors" href="#">${esc(cfg.supportLabel)}</a></li>`,
      'g'
    );
    if (supportRe.test(s)) {
      s = s.replace(
        supportRe,
        `<li><a class="wa-link hover:text-primary transition-colors" href="#" target="_blank" rel="noopener" ` +
          `data-wa-msg="${cfg.supportMsg}" aria-label="${cfg.supportAria}">${cfg.supportLabel}</a></li>`
      );
      hits.push('footer-assistencia-whatsapp');
    }

    // 3. Telefone placeholder no rodapé
    if (s.includes('+55 (47) 98888-7777')) {
      s = s.split('+55 (47) 98888-7777').join(WA_PHONE);
      hits.push('footer-telefone-generico');
    }

    // 4. Vinheta cinza chapada nos cards de linha
    if (s.includes(' vignette-bottom')) {
      s = s.split(' vignette-bottom').join('');
      hits.push('vignette-bottom');
    }

    // 5. Subtítulo das extrusoras
    if (s.includes(cfg.extruderOld)) {
      s = s.split(cfg.extruderOld).join(cfg.extruderNew);
      hits.push('subtitulo-extrusoras');
    }

    // 6. Hero de projetos: opacidade por slide -> opacidade no wrapper
    if (s.includes('hero-slide is-active opacity-40') || s.includes('hero-slide opacity-40')) {
      s = s
        .split('<div class="hero-slideshow" data-hero-slideshow>')
        .join('<div class="hero-slideshow opacity-40" data-hero-slideshow>')
        .split('hero-slide is-active opacity-40')
        .join('hero-slide is-active')
        .split('hero-slide opacity-40')
        .join('hero-slide');
      hits.push('hero-slideshow-opacity');
    }

    if (s !== before) {
      fs.writeFileSync(file, s);
      touched++;
      log.push(`${loc}/${path.basename(file)} :: ${hits.join(', ')}`);
    }
  }
}

console.log(log.join('\n'));
console.log(`\n${touched} arquivo(s) alterado(s).`);
