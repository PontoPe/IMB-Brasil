// IMB i18n — translation runtime
// Detects current language from <html lang> attribute or URL path (/en/, /es/).
// Exposes window.IMB_I18N { lang, t(key), pickLang(obj), urlFor(page) }.
//
// Usage patterns:
//   IMB_I18N.t('nav.products')           → 'Equipamentos' | 'Equipment' | 'Equipos'
//   IMB_I18N.pickLang({pt:'a', en:'b'})  → picks current lang or PT fallback
//   IMB_I18N.urlFor('produtos')          → resolves '/produtos.html', '/en/products.html', '/es/productos.html'
window.IMB_I18N = (function () {
  'use strict';

  // ---- Language detection ----
  function detectLang() {
    var html = document.documentElement;
    var attr = (html.getAttribute('lang') || '').toLowerCase();
    if (attr.indexOf('en') === 0) return 'en';
    if (attr.indexOf('es') === 0) return 'es';
    // Fallback: path-based detection (/en/, /es/)
    var path = window.location.pathname.toLowerCase();
    if (path.indexOf('/en/') >= 0) return 'en';
    if (path.indexOf('/es/') >= 0) return 'es';
    return 'pt';
  }

  var lang = detectLang();

  // ---- UI string dictionary ----
  var DICT = {
    'nav.home':        { pt: 'Início',     en: 'Home',         es: 'Inicio' },
    'nav.products':    { pt: 'Equipamentos', en: 'Equipment',  es: 'Equipos' },
    'nav.cases':       { pt: 'Nossos Projetos', en: 'Our Projects', es: 'Nuestros Proyectos' },
    'nav.about':       { pt: 'Sobre a IMB', en: 'About IMB', es: 'Sobre IMB' },
    'nav.contact':     { pt: 'Contato',    en: 'Contact',      es: 'Contacto' },
    'nav.compare':     { pt: 'Comparar',   en: 'Compare',      es: 'Comparar' },
    'nav.menu':        { pt: 'Menu',       en: 'Menu',         es: 'Menú' },

    'btn.quote':       { pt: 'Orçamento',          en: 'Get a Quote',     es: 'Cotización' },
    'btn.requestQuote':{ pt: 'Solicite um orçamento', en: 'Request a Quote', es: 'Solicitar Cotización' },
    'btn.whatsapp':    { pt: 'WhatsApp',           en: 'WhatsApp',        es: 'WhatsApp' },
    'btn.viewCatalog': { pt: 'Ver Catálogo',       en: 'View Catalog',    es: 'Ver Catálogo' },
    'btn.contact':     { pt: 'Fale Conosco',       en: 'Contact Us',      es: 'Contáctanos' },
    'btn.compare':     { pt: 'Comparar',           en: 'Compare',         es: 'Comparar' },
    'btn.back':        { pt: 'Voltar',             en: 'Back',            es: 'Volver' },

    'product.industrialLine':  { pt: 'Pavimentação', en: 'Pavers',        es: 'Pavimentadoras' },
    'product.pavers':          { pt: 'Pavimentadoras', en: 'Concrete Pavers', es: 'Pavimentadoras' },
    'product.extruders':       { pt: 'Extrusoras',  en: 'Extruders',      es: 'Extrusoras' },
    'product.specs':           { pt: 'Especificações Técnicas', en: 'Technical Specifications', es: 'Especificaciones Técnicas' },
    'product.relatedCases':    { pt: 'Obras com este equipamento', en: 'Projects with this equipment', es: 'Obras con este equipo' },

    'cases.title':       { pt: 'Cases de Obras',          en: 'Project Cases',           es: 'Casos de Obras' },
    'cases.numbers':     { pt: 'Cases em números',        en: 'Cases by the numbers',    es: 'Casos en números' },
    'cases.testimonials':{ pt: 'Depoimentos',             en: 'Testimonials',            es: 'Testimonios' },
    'cases.featured':    { pt: 'Obras de Destaque',       en: 'Featured Projects',       es: 'Obras Destacadas' },
    'cases.notFound':    { pt: 'Case não encontrado',     en: 'Case not found',          es: 'Caso no encontrado' },

    'about.title':     { pt: 'Nossa Empresa',  en: 'Our Company',        es: 'Nuestra Empresa' },
    'about.history':   { pt: 'Nossa História', en: 'Our Story',          es: 'Nuestra Historia' },
    'about.presence':  { pt: 'Onde atuamos',   en: 'Where we operate',   es: 'Dónde operamos' },

    'contact.title':   { pt: 'Entre em Contato', en: 'Get in Touch',     es: 'Ponte en Contacto' },
    'contact.form':    { pt: 'Formulário',       en: 'Form',             es: 'Formulario' },

    'footer.equipment':   { pt: 'Equipamentos',     en: 'Equipment',           es: 'Equipos' },
    'footer.company':     { pt: 'Empresa',          en: 'Company',             es: 'Empresa' },
    'footer.international':{pt:'Atuação Internacional', en:'International Reach', es: 'Presencia Internacional' },
    'footer.quickContact':{ pt: 'Contato Rápido',   en: 'Quick Contact',       es: 'Contacto Rápido' },
    'footer.rights':      { pt: 'Todos os direitos reservados.', en: 'All rights reserved.', es: 'Todos los derechos reservados.' },
    'footer.privacy':     { pt: 'Política de Privacidade', en: 'Privacy Policy', es: 'Política de Privacidad' },
    'footer.terms':       { pt: 'Termos de Uso',    en: 'Terms of Use',        es: 'Términos de Uso' },

    'wa.hint':            { pt: 'Seg–Sex · 8h–18h · Resposta em ~15min',
                            en: 'Mon–Fri · 8am–6pm · Reply in ~15min',
                            es: 'Lun–Vie · 8h–18h · Respuesta en ~15min' },
    'wa.default':         { pt: 'Olá! Gostaria de mais informações sobre os equipamentos IMB.',
                            en: 'Hi! I would like more information about IMB equipment.',
                            es: '¡Hola! Quisiera más información sobre los equipos IMB.' },
  };

  // ---- Helpers ----
  function t(key) {
    var entry = DICT[key];
    if (!entry) return key;
    return entry[lang] || entry.pt || key;
  }

  // Picks correct field from {pt, en, es} object. If passed plain string, returns as-is.
  function pickLang(obj) {
    if (obj == null) return '';
    if (typeof obj === 'string') return obj;
    if (typeof obj === 'object') {
      return obj[lang] || obj.pt || obj.en || obj.es || '';
    }
    return String(obj);
  }

  // URL resolver — given canonical page slug, returns correct path for current lang.
  var URL_MAP = {
    'home':        { pt: 'index.html',        en: 'en/index.html',        es: 'es/index.html' },
    'produtos':    { pt: 'produtos.html',     en: 'en/products.html',     es: 'es/productos.html' },
    'produto':     { pt: 'produto.html',      en: 'en/product.html',      es: 'es/producto.html' },
    // As linhas de produto não têm mais página própria: são o catálogo filtrado por categoria.
    'pavimentadora':{pt: 'produtos.html?tipo=pavimentadoras', en: 'en/products.html?tipo=pavimentadoras', es: 'es/productos.html?tipo=pavimentadoras' },
    'extrusora':   { pt: 'produtos.html?tipo=extrusoras',     en: 'en/products.html?tipo=extrusoras',     es: 'es/productos.html?tipo=extrusoras' },
    'comparar':    { pt: 'comparar.html',     en: 'en/compare.html',      es: 'es/comparar.html' },
    'cases':       { pt: 'cases.html',        en: 'en/cases.html',        es: 'es/casos.html' },
    'case':        { pt: 'case.html',         en: 'en/case.html',         es: 'es/caso.html' },
    'contato':     { pt: 'contato.html',      en: 'en/contact.html',      es: 'es/contacto.html' },
  };

  function urlFor(slug) {
    var entry = URL_MAP[slug];
    if (!entry) return '#';
    // If we're inside /en/ or /es/, paths in the dict need to be remapped relative to current location.
    // Simplest: dict already encodes from root, so prepend '../' if we're in a subfolder.
    var path = window.location.pathname.toLowerCase();
    var inSub = path.indexOf('/en/') >= 0 || path.indexOf('/es/') >= 0;
    var url = entry[lang] || entry.pt;
    if (inSub) {
      // strip own lang prefix from url if present; otherwise prefix '../'
      if (url.indexOf('en/') === 0 || url.indexOf('es/') === 0) {
        url = url.substring(3);
      } else {
        url = '../' + url;
      }
    }
    return url;
  }

  // ---- Canonical das paginas com query string ----
  // Tres paginas servem varias URLs: produto.html e case.html mudam com ?id=,
  // e produtos.html com ?tipo=. A URL canonica so existe depois que o JS le a
  // query — sem isto todas as fichas cairiam em /produto.html e as duas
  // categorias do catalogo em /produtos.html, colapsadas numa pagina so.
  var CANON_ORIGIN = 'https://imb-brasil.com.br';
  var DETAIL_PATH = {
    'produto': { pt: '/produto.html', en: '/en/product.html', es: '/es/producto.html' },
    'case':    { pt: '/case.html',    en: '/en/case.html',    es: '/es/caso.html' },
  };
  var CATALOG_PATH = { pt: '/produtos.html', en: '/en/products.html', es: '/es/productos.html' };

  function writeUrlSignals(pathByLang, query) {
    function absUrl(l) { return CANON_ORIGIN + pathByLang[l] + (query || ''); }

    var canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', absUrl(lang));

    // Os alternates tem que acompanhar: o conjunto hreflang de uma pagina
    // inclui ela mesma, e essa entrada precisa ser identica a canonica.
    var ALT = { 'pt-BR': 'pt', 'en': 'en', 'es': 'es', 'x-default': 'pt' };
    Object.keys(ALT).forEach(function (hl) {
      var el = document.querySelector('link[rel="alternate"][hreflang="' + hl + '"]');
      if (el) el.setAttribute('href', absUrl(ALT[hl]));
    });
  }

  function setDetailSeo(slug, id) {
    var entry = DETAIL_PATH[slug];
    if (!entry || !id) return;
    writeUrlSignals(entry, '?id=' + encodeURIComponent(id));
  }

  // typeSlug: 'pavimentadoras' | 'extrusoras' | vazio para o catalogo inteiro.
  // As tres formas estao no sitemap, entao cada uma aponta para si mesma; os
  // demais filtros (busca, ordenacao) nao entram na URL e nao mudam nada aqui.
  function setCatalogSeo(typeSlug) {
    writeUrlSignals(CATALOG_PATH, typeSlug ? '?tipo=' + encodeURIComponent(typeSlug) : '');
  }

  // ?id= inexistente gera URL sem conteudo. Como o espaco de parametros e
  // infinito, essas paginas saem do indice em vez de virar duplicata.
  function setNoIndex() {
    var meta = document.querySelector('meta[name="robots"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'robots');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', 'noindex, follow');
  }

  function withQuery(url, params) {
    var qs = Object.keys(params || {}).filter(function (key) {
      return params[key] != null && params[key] !== '';
    }).map(function (key) {
      return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
    }).join('&');
    return qs ? url + (url.indexOf('?') >= 0 ? '&' : '?') + qs : url;
  }

  function caseDetailUrl(id) {
    return withQuery(urlFor('case'), { id: id });
  }

  function productDetailUrl(id) {
    return withQuery(urlFor('produto'), { id: id });
  }

  function productLineSlug(product) {
    var raw = [
      product && product.url,
      product && product.subtitle && pickLang(product.subtitle),
      product && product.specs && product.specs.tipo && pickLang(product.specs.tipo),
    ].join(' ').toLowerCase();
    return raw.indexOf('extrus') >= 0 ? 'extrusora' : 'pavimentadora';
  }

  function productLineUrl(product) {
    return urlFor(productLineSlug(product));
  }

  // ---- DOM auto-translation ----
  // Any element with data-i18n="key" gets its textContent replaced.
  // Any element with data-i18n-attr="attr:key" gets that attribute replaced.
  function applyDom(root) {
    (root || document).querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (key) el.textContent = t(key);
    });
    (root || document).querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      var spec = el.getAttribute('data-i18n-attr');
      if (!spec) return;
      var parts = spec.split(':');
      if (parts.length === 2) el.setAttribute(parts[0], t(parts[1]));
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { applyDom(); });
  } else {
    applyDom();
  }

  return {
    lang: lang,
    t: t,
    pickLang: pickLang,
    urlFor: urlFor,
    caseDetailUrl: caseDetailUrl,
    productDetailUrl: productDetailUrl,
    productLineUrl: productLineUrl,
    setDetailSeo: setDetailSeo,
    setCatalogSeo: setCatalogSeo,
    setNoIndex: setNoIndex,
    applyDom: applyDom,
  };
})();
