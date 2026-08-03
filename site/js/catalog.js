// Catalog grid renderer (produtos.html / products.html / productos.html).
// Builds cards from IMB_PRODUCTS, then applies client-side filtering and sorting.
(function () {
  'use strict';

  if (!window.IMB_PRODUCTS) return;
  var grid = document.getElementById('catalog-grid');
  if (!grid) return;

  var products = window.IMB_PRODUCTS.products || [];
  var controls = document.getElementById('catalog-controls');
  var LANG = (window.IMB_I18N && window.IMB_I18N.lang) || 'pt';
  var state = { type: 'all', line: 'all', capability: 'all', sort: 'recommended', query: '' };

  // Deep-link de categoria — produtos.html?tipo=pavimentadoras|extrusoras.
  // Substituiu as antigas páginas de linha (pavimentadora.html / extrusora.html), que
  // hoje só redirecionam para cá. Aceita os slugs das 3 línguas + os valores internos.
  var TYPE_ALIASES = {
    'paver': 'paver', 'pavers': 'paver', 'pavimentadora': 'paver', 'pavimentadoras': 'paver',
    'extruder': 'extruder', 'extruders': 'extruder', 'extrusora': 'extruder', 'extrusoras': 'extruder',
    'all': 'all', 'todos': 'all', 'todas': 'all',
  };
  var TYPE_SLUGS = { paver: 'pavimentadoras', extruder: 'extrusoras' };

  function typeFromUrl() {
    var params = new URLSearchParams(window.location.search);
    var raw = (params.get('tipo') || params.get('type') || params.get('categoria') || '').trim().toLowerCase();
    return TYPE_ALIASES[raw] || 'all';
  }

  // Mantém a URL em sincronia com o filtro para o link continuar compartilhável.
  function syncUrl() {
    if (!window.history || !window.history.replaceState) return;
    var slug = TYPE_SLUGS[state.type];
    var url = window.location.pathname + (slug ? '?tipo=' + slug : '') + window.location.hash;
    window.history.replaceState(null, '', url);
  }

  state.type = typeFromUrl();

  var UI = {
    title:          { pt: 'Filtros', en: 'Filters', es: 'Filtros' },
    search:         { pt: 'Busca', en: 'Search', es: 'Búsqueda' },
    searchPh:       { pt: 'Modelo, aplicação ou linha', en: 'Model, application or line', es: 'Modelo, aplicación o línea' },
    category:       { pt: 'Categoria', en: 'Category', es: 'Categoría' },
    all:            { pt: 'Todos', en: 'All', es: 'Todos' },
    pavers:         { pt: 'Pavimentadoras', en: 'Pavers', es: 'Pavimentadoras' },
    extruders:      { pt: 'Extrusoras', en: 'Extruders', es: 'Extrusoras' },
    line:           { pt: 'Linha', en: 'Line', es: 'Línea' },
    anyLine:        { pt: 'Todas as linhas', en: 'All lines', es: 'Todas las líneas' },
    capability:     { pt: 'Recurso', en: 'Feature', es: 'Recurso' },
    allFeatures:    { pt: 'Todos os recursos', en: 'All features', es: 'Todos los recursos' },
    automated:      { pt: 'Automação / sensores', en: 'Automation / sensors', es: 'Automatización / sensores' },
    steelTracks:    { pt: 'Esteiras de aço', en: 'Steel tracks', es: 'Orugas de acero' },
    clutch:         { pt: 'Com embreagem', en: 'With clutch', es: 'Con embrague' },
    sort:           { pt: 'Ordenar por', en: 'Sort by', es: 'Ordenar por' },
    recommended:    { pt: 'Recomendados', en: 'Recommended', es: 'Recomendados' },
    powerDesc:      { pt: 'Maior potência', en: 'Highest power', es: 'Mayor potencia' },
    widthDesc:      { pt: 'Maior perfil', en: 'Widest profile', es: 'Mayor perfil' },
    weightAsc:      { pt: 'Mais leves', en: 'Lightest', es: 'Más livianos' },
    nameAsc:        { pt: 'Nome A-Z', en: 'Name A-Z', es: 'Nombre A-Z' },
    seeDetails:     { pt: 'Ver Detalhes', en: 'View Details', es: 'Ver Detalles' },
    available:      { pt: 'Disponível', en: 'Available', es: 'Disponible' },
    powerLabel:     { pt: 'Potência', en: 'Power', es: 'Potencia' },
    productivityLabel:{ pt: 'Produtividade', en: 'Productivity', es: 'Productividad' },
    widthLabel:     { pt: 'Largura Máx.', en: 'Max. Width', es: 'Ancho Máx.' },
    applicationLabel:{ pt: 'Aplicação', en: 'Application', es: 'Aplicación' },
    resultOne:      { pt: '1 equipamento', en: '1 machine', es: '1 equipo' },
    resultsMany:    { pt: 'equipamentos', en: 'machines', es: 'equipos' },
    noResults:      { pt: 'Nenhum equipamento encontrado com estes filtros.', en: 'No machines found with these filters.', es: 'No se encontraron equipos con estos filtros.' },
  };

  function ui(k) {
    var e = UI[k];
    return e ? (e[LANG] || e.pt) : k;
  }

  function T(v) {
    if (v == null) return '';
    if (typeof v === 'object' && (v.pt || v.en || v.es)) {
      return (window.IMB_I18N && window.IMB_I18N.pickLang) ? window.IMB_I18N.pickLang(v) : (v.pt || v.en || v.es || '');
    }
    return v;
  }

  function escHTML(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
    });
  }

  function normalText(s) {
    return String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  function productDetailUrl(p) {
    if (window.IMB_I18N && window.IMB_I18N.productDetailUrl) return window.IMB_I18N.productDetailUrl(p.id);
    return 'produto.html?id=' + encodeURIComponent(p.id);
  }

  function fmtNumber(n) {
    if (n == null || Number.isNaN(Number(n))) return '';
    var locale = LANG === 'pt' ? 'pt-BR' : (LANG === 'en' ? 'en-US' : 'es-AR');
    return Number(n).toLocaleString(locale);
  }

  function kindOf(p) {
    var tipo = normalText((p.specs.tipo && p.specs.tipo.pt) || T(p.specs.tipo));
    if (tipo.indexOf('pavimentadora') !== -1) return 'paver';
    if (tipo.indexOf('extrusora') !== -1) return 'extruder';
    return 'other';
  }

  var isYes = window.IMB_PRODUCTS.isYes || function () { return false; };
  var isOptional = window.IMB_PRODUCTS.isOptional || function () { return false; };

  function hasCapability(p, capability) {
    if (capability === 'all') return true;
    if (capability === 'automated') return isYes(p.specs.sensor_altura) || isYes(p.specs.sensor_direcao) || isYes(p.specs.sensor_inclinacao);
    if (capability === 'steel-tracks') return isYes(p.specs.esteiras_aco);
    if (capability === 'clutch') return isYes(p.specs.embreagem_radial) || isOptional(p.specs.embreagem_radial);
    return true;
  }

  function searchableText(p) {
    return normalText([
      p.name,
      T(p.subtitle),
      T(p.specs.tipo),
      T(p.specs.linha),
      T(p.specs.aplicacoes),
      p.specs.motor_tipo,
    ].join(' '));
  }

  function productMatches(p) {
    if (state.type !== 'all' && kindOf(p) !== state.type) return false;
    if (state.line !== 'all' && T(p.specs.linha) !== state.line) return false;
    if (!hasCapability(p, state.capability)) return false;
    if (state.query && searchableText(p).indexOf(normalText(state.query)) === -1) return false;
    return true;
  }

  function sortValue(p, key, fallback) {
    var n = Number(p.specs[key]);
    return Number.isFinite(n) ? n : fallback;
  }

  function sortProducts(list) {
    return list.slice().sort(function (a, b) {
      if (state.sort === 'power-desc') return sortValue(b.p, 'motor_hp', -1) - sortValue(a.p, 'motor_hp', -1) || a.index - b.index;
      if (state.sort === 'width-desc') return sortValue(b.p, 'largura_perfil', -1) - sortValue(a.p, 'largura_perfil', -1) || a.index - b.index;
      if (state.sort === 'weight-asc') return sortValue(a.p, 'peso', 999999) - sortValue(b.p, 'peso', 999999) || a.index - b.index;
      if (state.sort === 'name-asc') return a.p.name.localeCompare(b.p.name) || a.index - b.index;
      return a.index - b.index;
    });
  }

  function uniqueLines() {
    var seen = {};
    return products.reduce(function (acc, p) {
      var line = T(p.specs.linha);
      if (line && !seen[line]) {
        seen[line] = true;
        acc.push(line);
      }
      return acc;
    }, []);
  }

  function renderControls() {
    if (!controls) return;
    var lineOptions = uniqueLines().map(function (line) {
      return '<option value="' + escHTML(line) + '">' + escHTML(line) + '</option>';
    }).join('');

    controls.innerHTML = ''
      + '<h3 class="text-sm font-bold text-on-surface uppercase tracking-wider mb-6 flex items-center gap-2 font-headline"><span class="w-1.5 h-6 bg-primary"></span>' + escHTML(ui('title')) + '</h3>'
      + '<div class="catalog-control-stack">'
      +   '<div><label class="catalog-control-label" for="catalog-search">' + escHTML(ui('search')) + '</label><input id="catalog-search" class="catalog-search" type="search" autocomplete="off" placeholder="' + escHTML(ui('searchPh')) + '" /></div>'
      +   '<div><span class="catalog-control-label">' + escHTML(ui('category')) + '</span><div class="catalog-filter-row" role="group" aria-label="' + escHTML(ui('category')) + '">'
      +     '<button type="button" class="catalog-filter-button" data-catalog-type="all">' + escHTML(ui('all')) + '</button>'
      +     '<button type="button" class="catalog-filter-button" data-catalog-type="paver">' + escHTML(ui('pavers')) + '</button>'
      +     '<button type="button" class="catalog-filter-button" data-catalog-type="extruder">' + escHTML(ui('extruders')) + '</button>'
      +   '</div></div>'
      +   '<div><label class="catalog-control-label" for="catalog-line">' + escHTML(ui('line')) + '</label><select id="catalog-line" class="catalog-select"><option value="all">' + escHTML(ui('anyLine')) + '</option>' + lineOptions + '</select></div>'
      +   '<div><label class="catalog-control-label" for="catalog-capability">' + escHTML(ui('capability')) + '</label><select id="catalog-capability" class="catalog-select">'
      +     '<option value="all">' + escHTML(ui('allFeatures')) + '</option>'
      +     '<option value="automated">' + escHTML(ui('automated')) + '</option>'
      +     '<option value="steel-tracks">' + escHTML(ui('steelTracks')) + '</option>'
      +     '<option value="clutch">' + escHTML(ui('clutch')) + '</option>'
      +   '</select></div>'
      +   '<div><label class="catalog-control-label" for="catalog-sort">' + escHTML(ui('sort')) + '</label><select id="catalog-sort" class="catalog-select">'
      +     '<option value="recommended">' + escHTML(ui('recommended')) + '</option>'
      +     '<option value="power-desc">' + escHTML(ui('powerDesc')) + '</option>'
      +     '<option value="width-desc">' + escHTML(ui('widthDesc')) + '</option>'
      +     '<option value="weight-asc">' + escHTML(ui('weightAsc')) + '</option>'
      +     '<option value="name-asc">' + escHTML(ui('nameAsc')) + '</option>'
      +   '</select></div>'
      +   '<div id="catalog-results-count" class="catalog-result-summary"></div>'
      + '</div>';
  }

  function syncControls(count) {
    if (!controls) return;
    controls.querySelectorAll('[data-catalog-type]').forEach(function (button) {
      var active = button.getAttribute('data-catalog-type') === state.type;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
    var line = controls.querySelector('#catalog-line');
    var capability = controls.querySelector('#catalog-capability');
    var sort = controls.querySelector('#catalog-sort');
    var search = controls.querySelector('#catalog-search');
    var countEl = controls.querySelector('#catalog-results-count');
    if (line) line.value = state.line;
    if (capability) capability.value = state.capability;
    if (sort) sort.value = state.sort;
    if (search && search.value !== state.query) search.value = state.query;
    if (countEl) countEl.textContent = count === 1 ? ui('resultOne') : count + ' ' + ui('resultsMany');
  }

  // Quem chega pelo deep-link de categoria vê o título da categoria, não o do catálogo inteiro.
  var baseTitle = document.title;
  var heading = document.querySelector('[data-catalog-heading]');
  var baseHeading = heading ? heading.textContent : '';
  function syncPageTitle() {
    var label = state.type === 'paver' ? ui('pavers') : (state.type === 'extruder' ? ui('extruders') : '');
    document.title = label ? label + ' | IMB Brasil' : baseTitle;
    if (heading) heading.textContent = label ? label.toUpperCase() : baseHeading;
  }

  function card(p) {
    var detailUrl = productDetailUrl(p);
    var widthVal = p.specs.largura_perfil != null ? fmtNumber(p.specs.largura_perfil) + ' mm' : '-';
    var prodVal  = p.specs.produtividade != null ? T(p.specs.produtividade) : '-';
    return ''
      + '<a href="' + escHTML(detailUrl) + '" class="group bg-surface-container-lowest rounded-xl overflow-hidden flex flex-col transition-all hover:shadow-2xl block fade-in-up is-visible">'
      +   '<div class="relative aspect-[16/10] overflow-hidden bg-surface-container">'
      +     '<img class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src="' + escHTML(p.image) + '" alt="' + escHTML(p.name) + '" loading="lazy" />'
      +   '</div>'
      +   '<div class="p-6 md:p-8 flex-1 flex flex-col">'
      +     '<div class="mb-4">'
      +       '<h3 class="text-xl md:text-2xl font-black tracking-tight text-on-surface mb-1 uppercase font-headline">' + escHTML(p.name) + '</h3>'
      +       '<p class="text-sm font-semibold text-on-surface-variant">' + escHTML(T(p.subtitle)) + '</p>'
      +     '</div>'
      +     (p.specs.aplicacoes ? '<p class="text-sm text-on-surface-variant mb-4 leading-relaxed"><span class="font-bold text-on-surface">' + escHTML(ui('applicationLabel')) + ':</span> ' + escHTML(T(p.specs.aplicacoes)) + '</p>' : '')
      +     '<div class="grid grid-cols-2 gap-3 mb-6">'
      +       '<div class="bg-surface-container-low p-3 rounded-lg border-b-2 border-outline-variant">'
      +         '<span class="text-[10px] font-bold text-on-surface-variant uppercase block mb-1">' + escHTML(ui('widthLabel')) + '</span>'
      +         '<span class="text-sm font-bold text-on-surface">' + escHTML(widthVal) + '</span>'
      +       '</div>'
      +       '<div class="bg-surface-container-low p-3 rounded-lg border-b-2 border-outline-variant">'
      +         '<span class="text-[10px] font-bold text-on-surface-variant uppercase block mb-1">' + escHTML(ui('productivityLabel')) + '</span>'
      +         '<span class="text-sm font-bold text-on-surface">' + escHTML(prodVal) + '</span>'
      +       '</div>'
      +     '</div>'
      +     '<div class="mt-auto flex items-center justify-between gap-3">'
      +       '<span class="text-xs font-bold text-success flex items-center gap-1">'
      +         '<span class="material-symbols-outlined text-xs" style="font-variation-settings:\'FILL\' 1;">check_circle</span>'
      +         escHTML(ui('available'))
      +       '</span>'
      +       '<span class="bg-primary-container text-on-primary-container px-5 py-2.5 rounded font-bold text-xs uppercase tracking-widest group-hover:bg-primary group-hover:text-on-primary transition-colors flex items-center gap-2">'
      +         escHTML(ui('seeDetails'))
      +         '<span class="material-symbols-outlined text-sm">arrow_outward</span>'
      +       '</span>'
      +     '</div>'
      +   '</div>'
      + '</a>';
  }

  function render() {
    var filtered = sortProducts(products.map(function (p, index) {
      return { p: p, index: index };
    }).filter(function (item) {
      return productMatches(item.p);
    }));

    syncControls(filtered.length);
    syncUrl();
    syncPageTitle();
    if (!filtered.length) {
      grid.innerHTML = '<div class="col-span-full catalog-empty">' + escHTML(ui('noResults')) + '</div>';
      return;
    }
    grid.innerHTML = filtered.map(function (item) { return card(item.p); }).join('');
  }

  function bindControls() {
    if (!controls) return;
    controls.addEventListener('click', function (event) {
      var button = event.target.closest('[data-catalog-type]');
      if (!button || !controls.contains(button)) return;
      state.type = button.getAttribute('data-catalog-type') || 'all';
      render();
    });
    controls.addEventListener('input', function (event) {
      if (event.target && event.target.id === 'catalog-search') {
        state.query = event.target.value || '';
        render();
      }
    });
    controls.addEventListener('change', function (event) {
      if (!event.target) return;
      if (event.target.id === 'catalog-line') state.line = event.target.value || 'all';
      if (event.target.id === 'catalog-capability') state.capability = event.target.value || 'all';
      if (event.target.id === 'catalog-sort') state.sort = event.target.value || 'recommended';
      render();
    });
  }

  renderControls();
  bindControls();
  render();
})();
