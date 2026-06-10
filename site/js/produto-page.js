// produto.html — renderiza ficha técnica de produto a partir de ?id=<slug>
(function () {
  'use strict';

  if (!window.IMB_PRODUCTS) return;

  function escHtml(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
    });
  }

  // i18n helper
  function T(v) {
    if (v == null) return '';
    if (typeof v === 'object' && (v.pt || v.en || v.es)) {
      return (window.IMB_I18N && window.IMB_I18N.pickLang) ? window.IMB_I18N.pickLang(v) : (v.pt || v.en || v.es || '');
    }
    return v;
  }
  var LANG = (window.IMB_I18N && window.IMB_I18N.lang) || 'pt';
  var LOCALE = LANG === 'pt' ? 'pt-BR' : (LANG === 'en' ? 'en-US' : 'es-AR');
  var UI = {
    notFound:      { pt: 'Produto não encontrado', en: 'Product not found', es: 'Producto no encontrado' },
    notFoundDesc:  { pt: 'O equipamento solicitado não existe ou foi removido.', en: 'The requested equipment does not exist or has been removed.', es: 'El equipo solicitado no existe o fue removido.' },
    backCatalog:   { pt: 'Voltar ao catálogo', en: 'Back to catalog', es: 'Volver al catálogo' },
    precisionEng:  { pt: 'Engenharia de Precisão', en: 'Precision Engineering', es: 'Ingeniería de Precisión' },
    breadcrumbProd:{ pt: 'Produtos', en: 'Products', es: 'Productos' },
    pavers:        { pt: 'Pavimentadoras', en: 'Pavers', es: 'Pavimentadoras' },
    extruders:     { pt: 'Extrusoras', en: 'Extruders', es: 'Extrusoras' },
    widthLabel:    { pt: 'Largura', en: 'Width', es: 'Ancho' },
    engineLabel:   { pt: 'Motor', en: 'Engine', es: 'Motor' },
    weightLabel:   { pt: 'Peso', en: 'Weight', es: 'Peso' },
    profilesLabel: { pt: 'perfis', en: 'profiles', es: 'perfiles' },
    vibratorsLabel:{ pt: 'vibradores', en: 'vibrators', es: 'vibradores' },
    requestQuote:  { pt: 'Solicitar Orçamento', en: 'Request a Quote', es: 'Solicitar Cotización' },
    consultManual: { pt: 'Consulte o Manual', en: 'Consult the Manual', es: 'Consulte el Manual' },
    manualUnavailable: { pt: 'Manual em breve', en: 'Manual coming soon', es: 'Manual próximamente' },
    waHint:        { pt: 'Seg–Sex · 8h–18h · Resposta em ~15min', en: 'Mon–Fri · 8am–6pm · Reply in ~15min', es: 'Lun–Vie · 8h–18h · Respuesta en ~15min' },
    techSpecs:     { pt: 'Especificações Técnicas', en: 'Technical Specifications', es: 'Especificaciones Técnicas' },
    yes:           { pt: 'Sim', en: 'Yes', es: 'Sí' },
    no:            { pt: 'Não', en: 'No', es: 'No' },
    relatedProj:   { pt: 'Obras com este equipamento', en: 'Projects with this equipment', es: 'Obras con este equipo' },
    compareTitle:  { pt: 'Quer comparar com outros modelos?', en: 'Want to compare with other models?', es: '¿Quieres comparar con otros modelos?' },
    compareDesc:   { pt: 'Use nosso comparador para escolher o equipamento ideal para sua obra.', en: 'Use our comparator to choose the ideal equipment for your project.', es: 'Usa nuestro comparador para elegir el equipo ideal para tu obra.' },
    compareBtn:    { pt: 'Comparar', en: 'Compare', es: 'Comparar' },
    waSeen:        { pt: function(n,s){ return 'Olá! Tenho interesse no equipamento ' + n + ' (' + s + ').'; },
                     en: function(n,s){ return 'Hi! I\'m interested in the ' + n + ' (' + s + ').'; },
                     es: function(n,s){ return '¡Hola! Tengo interés en el equipo ' + n + ' (' + s + ').'; } },
    waQuote:       { pt: function(n,s){ return 'Olá! Gostaria de um orçamento para o equipamento ' + n + ' (' + s + ').'; },
                     en: function(n,s){ return 'Hi! I\'d like a quote for the ' + n + ' (' + s + ').'; },
                     es: function(n,s){ return '¡Hola! Quisiera una cotización para el equipo ' + n + ' (' + s + ').'; } },
    pageTitleSuffix:{pt: '— Ficha técnica IMB Brasil', en: '— IMB Brasil Data Sheet', es: '— Ficha técnica IMB Brasil' },
    profilesTitle:  { pt: 'Perfis de Aplicação', en: 'Application Profiles', es: 'Perfiles de Aplicación' },
    profilesThis:   { pt: 'Este equipamento executa os seguintes tipos de perfil:', en: 'This equipment produces the following profile types:', es: 'Este equipo ejecuta los siguientes tipos de perfil:' },
    profilesCustom: { pt: 'Perfis personalizados sob consulta — moldes sob medida para o seu projeto.', en: 'Custom profiles on request — made-to-measure molds for your project.', es: 'Perfiles personalizados bajo consulta — moldes a medida para su proyecto.' },
    profilesCatBtn: { pt: 'Ver catálogo de perfis (PDF)', en: 'View profile catalog (PDF)', es: 'Ver catálogo de perfiles (PDF)' },
    profilesAlt:    { pt: 'Perfis personalizados sob consulta', en: 'Custom profiles on request', es: 'Perfiles personalizados bajo consulta' },
  };
  var PROFILE_LABELS = {
    'meio-fio':            { pt: 'Meio-fio',              en: 'Curb',               es: 'Cordón' },
    'guia-sarjeta':        { pt: 'Guia e Sarjeta',        en: 'Guide & Gutter',     es: 'Guía y Cuneta' },
    'calcada':             { pt: 'Calçada',               en: 'Sidewalk',           es: 'Vereda' },
    'canaleta-drenagem':   { pt: 'Canaleta de Drenagem',  en: 'Drainage Channel',   es: 'Canal de Drenaje' },
    'barreira-new-jersey': { pt: 'Barreira New Jersey',   en: 'New Jersey Barrier', es: 'Barrera New Jersey' },
    'pavimento-concreto':  { pt: 'Pavimento de Concreto', en: 'Concrete Pavement',  es: 'Pavimento de Concreto' },
  };
  var assetPrefix = /\/(en|es)\//i.test(window.location.pathname) ? '../' : '';
  function ui(k) { var e = UI[k]; return e ? (e[LANG] || e.pt) : k; }

  function fmt(v, unit) {
    if (v == null || v === '') return '—';
    var s = typeof v === 'number' ? v.toLocaleString(LOCALE) : T(v);
    var u = unit ? T(unit) : '';
    return u ? s + ' ' + u : s;
  }

  var params = new URLSearchParams(window.location.search);
  var id = params.get('id') || '';
  var prod = window.IMB_PRODUCTS.products.find(function (p) { return p.id === id; });
  var main = document.getElementById('produto-main');
  if (!main) return;

  if (!prod) {
    var catalogUrl = (window.IMB_I18N && window.IMB_I18N.urlFor) ? window.IMB_I18N.urlFor('produtos') : 'produtos.html';
    main.innerHTML = ''
      + '<section class="max-w-3xl mx-auto px-4 md:px-8 py-20 md:py-32 text-center">'
      +   '<span class="material-symbols-outlined text-5xl text-on-surface-variant mb-4">search_off</span>'
      +   '<h1 class="font-headline font-black text-3xl md:text-4xl uppercase tracking-tight mb-4">' + escHtml(ui('notFound')) + '</h1>'
      +   '<p class="text-on-surface-variant mb-8">' + escHtml(ui('notFoundDesc')) + '</p>'
      +   '<a href="' + escHtml(catalogUrl) + '" class="inline-flex items-center gap-2 bg-primary-container text-on-primary-container px-6 py-3 rounded font-bold text-sm uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-colors">'
      +     '<span class="material-symbols-outlined text-sm">arrow_back</span>' + escHtml(ui('backCatalog'))
      +   '</a>'
      + '</section>';
    return;
  }

  var prodSubtitle = T(prod.subtitle);
  var prodTipo     = T(prod.specs.tipo);
  var prodAplic    = T(prod.specs.aplicacoes);
  var prodSerie    = T(prod.specs.serie);

  // SEO + WA
  document.title = prod.name + ' — ' + prodSubtitle + ' | IMB Brasil';
  var metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.content = prodSubtitle + '. ' + prod.name + '.';
  var metaWa = document.querySelector('meta[name="wa-default-msg"]');
  if (metaWa) metaWa.content = UI.waSeen[LANG](prod.name, prodSubtitle);

  var waMsg = UI.waQuote[LANG](prod.name, prodSubtitle);
  var isExtrusora = /extrus/i.test(prodTipo || '');
  var contatoBase = (window.IMB_I18N && window.IMB_I18N.urlFor) ? window.IMB_I18N.urlFor('contato') : 'contato.html';
  var contatoAnchor = LANG === 'en' ? '#contact' : (LANG === 'es' ? '#contacto' : '#contato');
  var contatoUrl  = contatoBase + contatoAnchor;
  var produtosUrl = (window.IMB_I18N && window.IMB_I18N.urlFor) ? window.IMB_I18N.urlFor('produtos') : 'produtos.html';
  var compararUrl = (window.IMB_I18N && window.IMB_I18N.urlFor) ? window.IMB_I18N.urlFor('comparar') : 'comparar.html';
  var lineUrl     = (window.IMB_I18N && window.IMB_I18N.productLineUrl) ? window.IMB_I18N.productLineUrl(prod) : (prod.url || produtosUrl);

  // ---- Hero ----
  var manualBtnHtml;
  if (prod.manualUrl) {
    manualBtnHtml = '<a href="' + escHtml(prod.manualUrl) + '" target="_blank" rel="noopener" class="w-full border-2 border-outline-variant hover:bg-surface-container-high text-on-surface font-headline font-bold py-3 md:py-4 px-8 rounded-lg text-center uppercase tracking-widest text-sm flex justify-center items-center gap-2 transition-all"><span class="material-symbols-outlined text-primary">picture_as_pdf</span>' + escHtml(ui('consultManual')) + '</a>';
  } else {
    manualBtnHtml = '<span class="w-full border-2 border-outline-variant text-on-surface-variant font-headline font-bold py-3 md:py-4 px-8 rounded-lg text-center uppercase tracking-widest text-sm flex justify-center items-center gap-2 opacity-70 cursor-not-allowed"><span class="material-symbols-outlined text-on-surface-variant">picture_as_pdf</span>' + escHtml(ui('manualUnavailable')) + '</span>';
  }

  var hero = ''
    + '<section class="relative w-full bg-surface-container-low overflow-hidden">'
    +   '<div class="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-20 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">'
    +     '<div class="lg:col-span-7 relative fade-in-up">'
    +       '<div class="relative z-10 group">'
    +         '<img alt="' + escHtml(prod.name) + '" class="w-full aspect-[4/3] object-cover rounded-xl shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]" src="' + escHtml(prod.image) + '" />'
    +         ''
    +       '</div>'
    +     '</div>'
    +     '<div class="lg:col-span-5 space-y-6 md:space-y-8 fade-in-up">'
    +       '<div class="flex items-center gap-2 text-xs text-on-surface-variant">'
    +         '<a href="' + escHtml(produtosUrl) + '" class="hover:text-primary transition-colors">' + escHtml(ui('breadcrumbProd')) + '</a>'
    +         '<span class="material-symbols-outlined text-xs">chevron_right</span>'
    +         '<a href="' + escHtml(lineUrl) + '" class="hover:text-primary transition-colors">' + escHtml(isExtrusora ? ui('extruders') : ui('pavers')) + '</a>'
    +         '<span class="material-symbols-outlined text-xs">chevron_right</span>'
    +         '<span class="text-primary font-semibold">' + escHtml(prod.name) + '</span>'
    +       '</div>'
    +       '<div>'
    +         '<span class="text-primary font-bold tracking-[0.2em] uppercase text-sm">' + escHtml(prodSerie || '') + '</span>'
    +         '<h1 class="mt-3 text-4xl md:text-5xl lg:text-6xl font-black font-headline text-on-surface tracking-tighter leading-[1.05]">'
    +           escHtml(prodTipo || '') + ' <span class="text-primary">' + escHtml(prod.name) + '</span>'
    +         '</h1>'
    +         '<p class="mt-6 text-on-surface-variant text-base md:text-lg leading-relaxed max-w-md">' + escHtml(prodAplic || '') + '</p>'
    +       '</div>'
    +       '<div class="flex flex-wrap gap-3">'
    +         (prod.specs.largura_perfil ? '<div class="spec-chip bg-surface-container-high px-4 py-2"><span class="text-xs font-bold text-on-surface uppercase tracking-tight">' + ui('widthLabel') + ': ' + prod.specs.largura_perfil + 'mm</span></div>' : '')
    +         (prod.specs.motor_hp ? '<div class="spec-chip bg-surface-container-high px-4 py-2"><span class="text-xs font-bold text-on-surface uppercase tracking-tight">' + ui('engineLabel') + ': ' + prod.specs.motor_hp + 'cv</span></div>' : '')
    +         (prod.specs.peso ? '<div class="spec-chip bg-surface-container-high px-4 py-2"><span class="text-xs font-bold text-on-surface uppercase tracking-tight">' + ui('weightLabel') + ': ' + prod.specs.peso.toLocaleString(LOCALE) + 'kg</span></div>' : '')
    +         (prod.specs.vibradores ? '<div class="spec-chip bg-surface-container-high px-4 py-2"><span class="text-xs font-bold text-on-surface uppercase tracking-tight">' + prod.specs.vibradores + ' ' + ui('vibratorsLabel') + '</span></div>' : '')
    +       '</div>'
    +       '<div class="flex flex-col gap-3 pt-2">'
    +         manualBtnHtml
    +         '<a href="#" class="wa-link w-full bg-primary-container hover:bg-primary text-on-primary-container font-headline font-black py-4 md:py-5 px-8 rounded-lg text-base md:text-lg uppercase tracking-wider flex justify-center items-center gap-3 transition-all" target="_blank" rel="noopener" data-wa-msg="' + escHtml(waMsg) + '">'
    +           '<span class="material-symbols-outlined" style="font-variation-settings:\'FILL\' 1;">chat</span>' + escHtml(ui('requestQuote'))
    +         '</a>'
    +         '<span class="wa-hint">' + escHtml(ui('waHint')) + '</span>'
    +       '</div>'
    +     '</div>'
    +   '</div>'
    + '</section>';

  // ---- Specs (agrupadas) ----
  var fields = window.IMB_PRODUCTS.fields;
  var groups = window.IMB_PRODUCTS.groups;

  function renderField(f) {
    var v = prod.specs[f.key];
    var displayValue;
    if (f.type === 'bool') {
      displayValue = v
        ? '<span class="inline-flex items-center gap-1 text-primary font-bold"><span class="material-symbols-outlined text-base">check_circle</span>' + escHtml(ui('yes')) + '</span>'
        : '<span class="inline-flex items-center gap-1 text-on-surface-variant"><span class="material-symbols-outlined text-base">cancel</span>' + escHtml(ui('no')) + '</span>';
    } else if (v == null || v === '') {
      displayValue = '<span class="text-on-surface-variant">—</span>';
    } else {
      displayValue = '<span class="font-bold text-on-surface">' + escHtml(fmt(v, f.unit)) + '</span>';
    }
    return ''
      + '<div class="flex justify-between items-center border-b border-surface-container-high pb-3 gap-4">'
      +   '<span class="text-on-surface-variant text-sm">' + escHtml(T(f.label)) + '</span>'
      +   '<span class="text-right">' + displayValue + '</span>'
      + '</div>';
  }

  var specBlocks = groups.map(function (g) {
    var inGroup = fields.filter(function (f) { return f.group === g.id; });
    var hasAny = inGroup.some(function (f) {
      var v = prod.specs[f.key];
      return v != null && v !== '';
    });
    if (!hasAny) return '';
    var rows = inGroup.map(renderField).join('');
    return ''
      + '<div class="bg-surface-container-lowest rounded-xl p-6 md:p-8 fade-in-up break-inside-avoid mb-6 md:mb-8">'
      +   '<h3 class="font-headline font-extrabold text-lg md:text-xl uppercase tracking-tight text-on-surface mb-6 border-l-4 border-primary-container pl-4">' + escHtml(T(g.label)) + '</h3>'
      +   '<div class="space-y-3">' + rows + '</div>'
      + '</div>';
  }).join('');

  var specsSection = ''
    + '<section class="py-16 md:py-24 bg-surface">'
    +   '<div class="max-w-7xl mx-auto px-4 md:px-8">'
    +     '<div class="mb-12 md:mb-16 fade-in-up">'
    +       '<h2 class="text-2xl md:text-3xl font-black font-headline tracking-tight uppercase border-l-8 border-primary-container pl-6">' + escHtml(ui('techSpecs')) + '</h2>'
    +     '</div>'
    +     '<div class="columns-1 md:columns-2 gap-6 md:gap-8">' + specBlocks + '</div>'
    +   '</div>'
    + '</section>';

  // ---- Perfis de aplicação ----
  var profileChips = (prod.profile_types || []).map(function (id) {
    var lbl = PROFILE_LABELS[id];
    return lbl
      ? '<span class="spec-chip bg-tertiary-container/30 px-3 py-1.5 text-xs font-bold text-tertiary">' + escHtml(T(lbl)) + '</span>'
      : '';
  }).join('');

  var perfisSection = ''
    + '<section class="py-16 md:py-24 bg-surface-container-low">'
    +   '<div class="max-w-7xl mx-auto px-4 md:px-8">'
    +     '<div class="mb-10 md:mb-12 fade-in-up">'
    +       '<h2 class="text-2xl md:text-3xl font-black font-headline tracking-tight uppercase border-l-8 border-primary-container pl-6">' + escHtml(ui('profilesTitle')) + '</h2>'
    +     '</div>'
    +     '<div class="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center fade-in-up">'
    +       '<div class="rounded-xl p-6 md:p-8 border border-outline-variant" style="background:#ffffff;">'
    +         '<img src="' + escHtml(assetPrefix + 'images/perfis-personalizados.png') + '" alt="' + escHtml(ui('profilesAlt')) + '" class="w-full h-auto" loading="lazy" />'
    +       '</div>'
    +       '<div>'
    +         (profileChips ? '<p class="text-on-surface-variant text-sm md:text-base mb-3">' + escHtml(ui('profilesThis')) + '</p><div class="flex flex-wrap gap-2 mb-6">' + profileChips + '</div>' : '')
    +         '<p class="text-on-surface text-base md:text-lg font-semibold leading-relaxed mb-6">' + escHtml(ui('profilesCustom')) + '</p>'
    +         '<a href="' + escHtml(assetPrefix + 'manuals/sugestao-de-perfis-imb.pdf') + '" target="_blank" rel="noopener" class="inline-flex items-center gap-2 bg-primary-container hover:bg-primary text-on-primary-container hover:text-on-primary font-bold text-sm uppercase tracking-widest px-6 py-3 rounded transition-colors">'
    +           '<span class="material-symbols-outlined text-base">picture_as_pdf</span>' + escHtml(ui('profilesCatBtn'))
    +         '</a>'
    +       '</div>'
    +     '</div>'
    +   '</div>'
    + '</section>';

  // ---- Cases relacionados ----
  var relatedCases = [];
  if (window.IMB_CASES && window.IMB_CASES.cases) {
    relatedCases = window.IMB_CASES.cases.filter(function (c) {
      return (c.equipment || []).some(function (e) { return e.id === prod.id; });
    }).slice(0, 3);
  }
  var casesBlock = '';
  if (relatedCases.length) {
    var caseCards = relatedCases.map(function (c) {
      return window.IMB_CASES.renderCard ? window.IMB_CASES.renderCard(c) : '';
    }).join('');
    casesBlock = ''
      + '<section class="py-16 md:py-20 bg-surface-container-low">'
      +   '<div class="max-w-7xl mx-auto px-4 md:px-8">'
      +     '<h2 class="font-headline font-extrabold text-2xl md:text-3xl tracking-tight mb-8 border-l-8 border-primary pl-6">' + escHtml(ui('relatedProj')) + '</h2>'
      +     '<div class="case-list-grid">' + caseCards + '</div>'
      +   '</div>'
      + '</section>';
  }

  // ---- CTA + Comparar ----
  var ctaBlock = ''
    + '<section class="py-16 md:py-20 bg-surface">'
    +   '<div class="max-w-7xl mx-auto px-4 md:px-8">'
    +     '<div class="bg-primary-container/20 border border-primary-container/40 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center gap-6 justify-between">'
    +       '<div>'
    +         '<h3 class="font-headline font-black text-2xl md:text-3xl uppercase tracking-tight leading-tight mb-2">' + escHtml(ui('compareTitle')) + '</h3>'
    +         '<p class="text-on-surface-variant max-w-xl">' + escHtml(ui('compareDesc')) + '</p>'
    +       '</div>'
    +       '<div class="flex flex-wrap gap-3 shrink-0">'
    +         '<a href="' + escHtml(compararUrl) + '?ids=' + encodeURIComponent(prod.id) + '" class="bg-primary-container hover:bg-primary text-on-primary-container hover:text-on-primary font-bold text-sm uppercase tracking-widest px-6 py-3 rounded transition-colors flex items-center gap-2">'
    +           '<span class="material-symbols-outlined text-sm">compare_arrows</span>' + escHtml(ui('compareBtn'))
    +         '</a>'
    +         '<a href="#" class="wa-link bg-success hover:bg-success-strong text-white font-bold text-sm uppercase tracking-widest px-6 py-3 rounded transition-colors flex items-center gap-2" data-wa-msg="' + escHtml(waMsg) + '" target="_blank" rel="noopener">'
    +           '<span class="material-symbols-outlined text-sm" style="font-variation-settings:\'FILL\' 1;">chat</span>WhatsApp'
    +         '</a>'
    +       '</div>'
    +     '</div>'
    +   '</div>'
    + '</section>';

  main.innerHTML = hero + specsSection + perfisSection + casesBlock + ctaBlock;
})();
