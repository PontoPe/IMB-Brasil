// case.html — renderiza o detalhe de um case a partir de ?id=<slug>
(function () {
  'use strict';

  if (!window.IMB_CASES) return;

  function escHtml(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
    });
  }
  function T(v) {
    if (v == null) return '';
    if (typeof v === 'object' && (v.pt || v.en || v.es)) {
      return (window.IMB_I18N && window.IMB_I18N.pickLang) ? window.IMB_I18N.pickLang(v) : (v.pt || v.en || v.es || '');
    }
    return v;
  }
  var LANG = (window.IMB_I18N && window.IMB_I18N.lang) || 'pt';
  var UI = {
    caseSuffix:    { pt: '— Case IMB Brasil', en: '— IMB Brasil Case', es: '— Caso IMB Brasil' },
    notFound:      { pt: 'Case não encontrado', en: 'Case not found', es: 'Caso no encontrado' },
    notFoundDesc:  { pt: 'O case solicitado não existe ou foi removido.', en: 'The requested case does not exist or has been removed.', es: 'El caso solicitado no existe o fue removido.' },
    viewAll:       { pt: 'Ver todas as obras', en: 'View all projects', es: 'Ver todas las obras' },
    featured:      { pt: 'Obras de Destaque', en: 'Featured Projects', es: 'Obras Destacadas' },
    talkAbout:     { pt: 'Falar sobre este case', en: 'Talk about this case', es: 'Hablar sobre este caso' },
    requestQuote:  { pt: 'Solicitar Orçamento', en: 'Request a Quote', es: 'Solicitar Cotización' },
    numbers:       { pt: 'Números do projeto', en: 'Project numbers', es: 'Números del proyecto' },
    equipUsed:     { pt: 'Equipamentos utilizados', en: 'Equipment used', es: 'Equipos utilizados' },
    clientLabel:   { pt: 'Cliente: ', en: 'Client: ', es: 'Cliente: ' },
    dataSheet:     { pt: 'Ver ficha técnica', en: 'View data sheet', es: 'Ver ficha técnica' },
    story:         { pt: 'A obra', en: 'The project', es: 'La obra' },
    similar:       { pt: 'Tem um projeto parecido?', en: 'Have a similar project?', es: '¿Tienes un proyecto similar?' },
    similarDesc:   { pt: 'Fale com nossos engenheiros e receba uma proposta com os equipamentos certos para sua obra.', en: 'Talk to our engineers and receive a proposal with the right equipment for your project.', es: 'Habla con nuestros ingenieros y recibe una propuesta con los equipos adecuados para tu obra.' },
    contact:       { pt: 'Contato', en: 'Contact', es: 'Contacto' },
    otherCases:    { pt: 'Outros cases', en: 'Other cases', es: 'Otros casos' },
    gallery:       { pt: 'Galeria da obra', en: 'Project gallery', es: 'Galería de la obra' },
    videoTitle:    { pt: 'Vídeo da obra', en: 'Project video', es: 'Video de la obra' },
    galleryPrev:   { pt: 'Foto anterior', en: 'Previous photo', es: 'Foto anterior' },
    galleryNext:   { pt: 'Próxima foto', en: 'Next photo', es: 'Foto siguiente' },
    galleryGoTo:   { pt: 'Ir para a foto', en: 'Go to photo', es: 'Ir a la foto' },
    waSeen:        { pt: function(t){ return 'Olá! Vi o case "' + t + '" no site da IMB e quero saber mais.'; },
                     en: function(t){ return 'Hi! I saw the case "' + t + '" on the IMB website and want to know more.'; },
                     es: function(t){ return '¡Hola! Vi el caso "' + t + '" en el sitio de IMB y quiero saber más.'; } },
    waFull:        { pt: function(t,l){ return 'Olá! Tenho interesse no case ' + t + ' (' + l + '). Pode me passar mais detalhes sobre os equipamentos utilizados?'; },
                     en: function(t,l){ return 'Hi! I\'m interested in the case ' + t + ' (' + l + '). Could you share more details about the equipment used?'; },
                     es: function(t,l){ return '¡Hola! Tengo interés en el caso ' + t + ' (' + l + '). ¿Pueden darme más detalles sobre los equipos utilizados?'; } },
  };
  function ui(k) { var e = UI[k]; return e ? (e[LANG] || e.pt) : k; }
  var produtosUrl = (window.IMB_I18N && window.IMB_I18N.urlFor) ? window.IMB_I18N.urlFor('produtos') : 'produtos.html';
  var contatoBase = (window.IMB_I18N && window.IMB_I18N.urlFor) ? window.IMB_I18N.urlFor('contato')  : 'contato.html';
  var contatoAnchor = LANG === 'en' ? '#contact' : (LANG === 'es' ? '#contacto' : '#contato');
  var contatoUrl  = contatoBase + contatoAnchor;
  var casesUrl    = (window.IMB_I18N && window.IMB_I18N.urlFor) ? window.IMB_I18N.urlFor('cases')    : 'cases.html';
  function productDetailUrl(product) {
    if (product && window.IMB_I18N && window.IMB_I18N.productDetailUrl) {
      return window.IMB_I18N.productDetailUrl(product.id);
    }
    return produtosUrl;
  }

  var params = new URLSearchParams(window.location.search);
  var id = params.get('id') || '';
  var c = window.IMB_CASES.getById(id);
  var main = document.getElementById('case-main');
  if (!main) return;

  if (!c) {
    main.innerHTML = ''
      + '<section class="max-w-3xl mx-auto px-4 md:px-8 py-20 md:py-32 text-center">'
      +   '<span class="material-symbols-outlined text-5xl text-on-surface-variant mb-4">search_off</span>'
      +   '<h1 class="font-headline font-black text-3xl md:text-4xl uppercase tracking-tight mb-4">' + escHtml(ui('notFound')) + '</h1>'
      +   '<p class="text-on-surface-variant mb-8">' + escHtml(ui('notFoundDesc')) + '</p>'
      +   '<a href="' + escHtml(casesUrl) + '" class="inline-flex items-center gap-2 bg-primary-container text-on-primary-container px-6 py-3 rounded font-bold text-sm uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-colors">'
      +     '<span class="material-symbols-outlined text-sm">arrow_back</span>' + escHtml(ui('viewAll'))
      +   '</a>'
      + '</section>';
    return;
  }

  var cTitle    = T(c.title);
  var cSubtitle = T(c.subtitle);
  var cLocation = T(c.location);
  var cStatus   = T(c.status);
  var cSummary  = T(c.summary);
  var cHighlight= c.highlight ? T(c.highlight) : '';
  var cClient   = c.client ? T(c.client) : '';

  // Atualiza head para SEO + WA contextual
  document.title = cTitle + ' ' + ui('caseSuffix');
  var metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.content = cSummary;
  var metaWa = document.querySelector('meta[name="wa-default-msg"]');
  if (metaWa) metaWa.content = UI.waSeen[LANG](cTitle);

  var waMsgFull = UI.waFull[LANG](cTitle, cLocation);

  // ---- Hero ----
  var hero = ''
    + '<section class="relative bg-inverse-surface text-white overflow-hidden">'
    +   '<div class="absolute inset-0 z-0">'
    +     '<img class="w-full h-full object-cover opacity-50" src="' + escHtml(c.hero_image) + '" alt="' + escHtml(cTitle) + '" />'
    +     '<div class="absolute inset-0 bg-inverse-surface/60"></div>'
    +   '</div>'
    +   '<div class="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-20 md:py-28">'
    +     '<div class="flex items-center gap-2 text-xs text-white/70 mb-6">'
    +       '<a href="' + escHtml(casesUrl) + '" class="hover:text-primary-container transition-colors">' + escHtml(ui('featured')) + '</a>'
    +       '<span class="material-symbols-outlined text-xs">chevron_right</span>'
    +       '<span class="text-primary-container font-semibold">' + escHtml(cTitle) + '</span>'
    +     '</div>'
    +     '<div class="flex flex-wrap items-center gap-3 mb-4">'
    +       (cHighlight ? '<span class="bg-primary-container text-on-primary-container font-black text-[10px] uppercase tracking-widest px-3 py-1.5 rounded">' + escHtml(cHighlight) + '</span>' : '')
    +       '<span class="bg-white/10 backdrop-blur text-white font-bold text-[11px] uppercase tracking-widest px-3 py-1.5 rounded flex items-center gap-1.5">'
    +         '<span class="material-symbols-outlined text-sm">location_on</span>' + escHtml(cLocation)
    +       '</span>'
    +       (c.year ? '<span class="bg-white/10 backdrop-blur text-white font-bold text-[11px] uppercase tracking-widest px-3 py-1.5 rounded">' + escHtml(c.year) + '</span>' : '')
    +       (cStatus ? '<span class="bg-white/10 backdrop-blur text-white font-bold text-[11px] uppercase tracking-widest px-3 py-1.5 rounded">' + escHtml(cStatus) + '</span>' : '')
    +     '</div>'
    +     '<h1 class="font-headline font-black text-4xl md:text-6xl uppercase tracking-tighter leading-none mb-4 max-w-4xl">' + escHtml(cTitle) + '</h1>'
    +     '<p class="text-primary-container font-bold uppercase tracking-widest text-sm mb-6">' + escHtml(cSubtitle) + '</p>'
    +     '<p class="text-white/85 text-base md:text-lg leading-relaxed max-w-2xl mb-8">' + escHtml(cSummary) + '</p>'
    +     '<div class="flex flex-wrap gap-3">'
    +       '<a href="#" class="wa-link inline-flex items-center gap-2 bg-success hover:bg-success-strong text-white font-bold text-sm uppercase tracking-widest px-6 py-3 rounded shadow-lg transition-colors" data-wa-msg="' + escHtml(waMsgFull) + '" target="_blank" rel="noopener">'
    +         '<span class="material-symbols-outlined text-base" style="font-variation-settings:\'FILL\' 1;">chat</span>' + escHtml(ui('talkAbout'))
    +       '</a>'
    +       '<a href="' + escHtml(contatoUrl) + '" class="inline-flex items-center gap-2 bg-white/10 backdrop-blur hover:bg-white/20 text-white font-bold text-sm uppercase tracking-widest px-6 py-3 rounded border border-white/20 transition-colors">'
    +         '<span class="material-symbols-outlined text-base">request_quote</span>' + escHtml(ui('requestQuote'))
    +       '</a>'
    +     '</div>'
    +   '</div>'
    + '</section>';

  // ---- Métricas ----
  var metricsBlock = '';
  if (c.metrics && c.metrics.length) {
    var metricsHtml = c.metrics.map(function (m) {
      return ''
        + '<div class="bg-surface-container-lowest rounded-xl p-5 md:p-6 border-b-4 border-primary/30">'
        +   '<span class="material-symbols-outlined text-3xl md:text-4xl text-primary mb-3 block">' + escHtml(m.icon) + '</span>'
        +   '<div class="font-headline font-black text-3xl md:text-4xl text-on-surface tracking-tight leading-none">'
        +     escHtml(m.value) + (m.unit ? ' <span class="text-base md:text-lg text-on-surface-variant font-bold">' + escHtml(T(m.unit)) + '</span>' : '')
        +   '</div>'
        +   '<div class="text-[10px] md:text-xs font-bold uppercase tracking-widest text-on-surface-variant mt-2">' + escHtml(T(m.label)) + '</div>'
        + '</div>';
    }).join('');
    metricsBlock = ''
      + '<section class="py-12 md:py-16 bg-surface-container-low">'
      +   '<div class="max-w-7xl mx-auto px-4 md:px-8">'
      +     '<h2 class="font-headline font-extrabold text-2xl md:text-3xl tracking-tight mb-8 border-l-8 border-primary pl-6">' + escHtml(ui('numbers')) + '</h2>'
      +     '<div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">' + metricsHtml + '</div>'
      +   '</div>'
      + '</section>';
  }

  // ---- Equipamentos + Cliente ----
  var equipBlock = '';
  if (c.equipment && c.equipment.length) {
    var equipHtml = c.equipment.map(function (e) {
      var p = window.IMB_PRODUCTS && window.IMB_PRODUCTS.products.find(function (pp) { return pp.id === e.id; });
      var image = p ? p.image : '';
      var url = productDetailUrl(p);
      var subtitle = p ? T(p.subtitle) : '';
      var ename = T(e.name);
      return ''
        + '<a href="' + escHtml(url) + '" class="group bg-surface-container-lowest rounded-xl overflow-hidden hover:shadow-xl transition-all flex flex-col block">'
        +   (image
              ? '<div class="aspect-[16/10] overflow-hidden bg-surface-container">'
              +   '<img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="' + escHtml(image) + '" alt="' + escHtml(ename) + '" loading="lazy" />'
              + '</div>'
              : '')
        +   '<div class="p-5 md:p-6">'
        +     '<h4 class="font-headline font-bold text-lg uppercase tracking-tight text-on-surface">' + escHtml(ename) + '</h4>'
        +     (subtitle ? '<p class="text-sm text-on-surface-variant mt-1">' + escHtml(subtitle) + '</p>' : '')
        +     '<span class="mt-3 inline-flex items-center gap-1.5 text-primary font-bold uppercase text-xs tracking-widest group-hover:gap-2.5 transition-all">'
        +       escHtml(ui('dataSheet')) + '<span class="material-symbols-outlined text-sm">arrow_forward</span>'
        +     '</span>'
        +   '</div>'
        + '</a>';
    }).join('');
    equipBlock = ''
      + '<section class="py-16 md:py-20 bg-surface">'
      +   '<div class="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10">'
      +     '<div class="lg:col-span-4">'
      +       '<h2 class="font-headline font-extrabold text-2xl md:text-3xl tracking-tight mb-4 border-l-8 border-primary pl-6">' + escHtml(ui('equipUsed')) + '</h2>'
      +       '<p class="text-on-surface-variant text-sm leading-relaxed">' + escHtml(cClient ? ui('clientLabel') + cClient : '') + '</p>'
      +     '</div>'
      +     '<div class="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">' + equipHtml + '</div>'
      +   '</div>'
      + '</section>';
  }

  // ---- Story ----
  var storyBlock = '';
  if (c.story && c.story.length) {
    var paragraphs = c.story.map(function (p) {
      return '<p>' + escHtml(T(p)) + '</p>';
    }).join('');
    storyBlock = ''
      + '<section class="py-16 md:py-20 bg-surface-container-low">'
      +   '<div class="max-w-3xl mx-auto px-4 md:px-8">'
      +     '<h2 class="font-headline font-extrabold text-2xl md:text-3xl tracking-tight mb-8 border-l-8 border-primary pl-6">' + escHtml(ui('story')) + '</h2>'
      +     '<div class="space-y-6 text-on-surface-variant leading-loose text-sm md:text-base">' + paragraphs + '</div>'
      +   '</div>'
      + '</section>';
  }

  // ---- Vídeo oficial da obra (YouTube) ----
  // `video` em js/cases.js guarda só o id. Usamos youtube-nocookie para não plantar
  // cookie de rastreio antes de o visitante dar play.
  var videoBlock = '';
  if (c.video) {
    videoBlock = ''
      + '<section class="py-16 md:py-20 bg-surface-container-low">'
      +   '<div class="max-w-5xl mx-auto px-4 md:px-8">'
      +     '<h2 class="font-headline font-extrabold text-2xl md:text-3xl tracking-tight mb-8 border-l-8 border-primary pl-6">' + escHtml(ui('videoTitle')) + '</h2>'
      +     '<div class="case-video">'
      +       '<iframe src="https://www.youtube-nocookie.com/embed/' + encodeURIComponent(c.video) + '"'
      +         ' title="' + escHtml(cTitle) + '" loading="lazy" allowfullscreen'
      +         ' allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"'
      +         ' referrerpolicy="strict-origin-when-cross-origin"></iframe>'
      +     '</div>'
      +   '</div>'
      + '</section>';
  }

  // ---- Galeria da obra (carrossel automático) ----
  // A foto principal é a hero_image; a galeria são as demais fotos da obra.
  // Sem fotos em `gallery` (js/cases.js) a seção nem é renderizada.
  var galleryPhotos = (c.gallery || []).filter(Boolean);
  var galleryBlock = '';
  if (galleryPhotos.length) {
    var slides = galleryPhotos.map(function (src, i) {
      return '<img class="media-carousel-slide' + (i === 0 ? ' is-active' : '') + '" src="' + escHtml(src) + '"'
        + ' alt="' + escHtml(cTitle) + ' — ' + (i + 1) + '/' + galleryPhotos.length + '"'
        + (i === 0 ? '' : ' loading="lazy"') + ' />';
    }).join('');
    var dots = galleryPhotos.map(function (_, i) {
      return '<button type="button" class="media-carousel-dot' + (i === 0 ? ' is-active' : '') + '"'
        + ' data-gallery-go="' + i + '" aria-label="' + escHtml(ui('galleryGoTo')) + ' ' + (i + 1) + '"></button>';
    }).join('');
    galleryBlock = ''
      + '<section class="py-16 md:py-20 bg-surface">'
      +   '<div class="max-w-7xl mx-auto px-4 md:px-8">'
      +     '<h2 class="font-headline font-extrabold text-2xl md:text-3xl tracking-tight mb-8 border-l-8 border-primary pl-6">' + escHtml(ui('gallery')) + '</h2>'
      +     '<div class="media-carousel" data-media-carousel aria-roledescription="carousel" aria-label="' + escHtml(ui('gallery')) + '">'
      +       '<div class="media-carousel-stage">' + slides + '</div>'
      +       (galleryPhotos.length > 1
            ? '<button type="button" class="media-carousel-arrow media-carousel-arrow--prev" data-gallery-step="-1" aria-label="' + escHtml(ui('galleryPrev')) + '"><span class="material-symbols-outlined">chevron_left</span></button>'
              + '<button type="button" class="media-carousel-arrow media-carousel-arrow--next" data-gallery-step="1" aria-label="' + escHtml(ui('galleryNext')) + '"><span class="material-symbols-outlined">chevron_right</span></button>'
              + '<div class="media-carousel-dots">' + dots + '</div>'
            : '')
      +     '</div>'
      +   '</div>'
      + '</section>';
  }

  // ---- Testimonial ----
  var testimonialBlock = '';
  if (c.testimonial) {
    var t = c.testimonial;
    testimonialBlock = ''
      + '<section class="py-16 md:py-20 bg-on-background text-white">'
      +   '<div class="max-w-4xl mx-auto px-4 md:px-8 text-center">'
      +     '<span class="material-symbols-outlined text-primary-container text-5xl mb-4 inline-block">format_quote</span>'
      +     '<blockquote class="font-headline font-black text-2xl md:text-3xl leading-tight tracking-tight mb-8">"' + escHtml(T(t.quote)) + '"</blockquote>'
      +     '<div class="flex items-center justify-center gap-3">'
      +       '<div class="w-12 h-12 rounded-full bg-primary-container/20 flex items-center justify-center">'
      +         '<span class="material-symbols-outlined text-primary-container">person</span>'
      +       '</div>'
      +       '<div class="text-left">'
      +         '<div class="font-bold text-base">' + escHtml(t.author) + '</div>'
      +         '<div class="text-sm text-surface-container-high/70">' + escHtml(T(t.role)) + ' · ' + escHtml(T(t.company)) + '</div>'
      +       '</div>'
      +     '</div>'
      +   '</div>'
      + '</section>';
  }

  // ---- CTA + outros cases ----
  var others = window.IMB_CASES.cases.filter(function (cc) { return cc.id !== c.id; }).slice(0, 3);
  var othersHtml = others.map(function (cc) {
    return window.IMB_CASES.renderCard ? window.IMB_CASES.renderCard(cc) : '';
  }).join('');
  var ctaBlock = ''
    + '<section class="py-16 md:py-20 bg-surface">'
    +   '<div class="max-w-7xl mx-auto px-4 md:px-8">'
    +     '<div class="bg-primary-container/20 border border-primary-container/40 rounded-2xl p-8 md:p-12 mb-12 flex flex-col md:flex-row items-start md:items-center gap-6 justify-between">'
    +       '<div>'
    +         '<h3 class="font-headline font-black text-2xl md:text-3xl uppercase tracking-tight leading-tight mb-2">' + escHtml(ui('similar')) + '</h3>'
    +         '<p class="text-on-surface-variant max-w-xl">' + escHtml(ui('similarDesc')) + '</p>'
    +       '</div>'
    +       '<div class="flex flex-wrap gap-3 shrink-0">'
    +         '<a href="#" class="wa-link bg-success hover:bg-success-strong text-white font-bold text-sm uppercase tracking-widest px-6 py-3 rounded transition-colors flex items-center gap-2" data-wa-msg="' + escHtml(waMsgFull) + '" target="_blank" rel="noopener">'
    +           '<span class="material-symbols-outlined text-sm" style="font-variation-settings:\'FILL\' 1;">chat</span>WhatsApp'
    +         '</a>'
    +         '<a href="' + escHtml(contatoUrl) + '" class="bg-primary-container hover:bg-primary text-on-primary-container hover:text-on-primary font-bold text-sm uppercase tracking-widest px-6 py-3 rounded transition-colors flex items-center gap-2">'
    +           '<span class="material-symbols-outlined text-sm">mail</span>' + escHtml(ui('contact'))
    +         '</a>'
    +       '</div>'
    +     '</div>'
    +     '<h2 class="font-headline font-extrabold text-xl uppercase tracking-widest text-on-surface-variant flex items-center gap-4 mb-8">'
    +       '<span class="w-12 h-[2px] bg-primary-container"></span>' + escHtml(ui('otherCases'))
    +     '</h2>'
    +     '<div class="case-list-grid">' + othersHtml + '</div>'
    +   '</div>'
    + '</section>';

  main.innerHTML = hero + metricsBlock + equipBlock + storyBlock + galleryBlock + videoBlock + testimonialBlock + ctaBlock;

})();
