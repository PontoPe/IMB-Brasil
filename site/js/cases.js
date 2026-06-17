// IMB cases — fonte única de verdade.
// Translatable fields use {pt, en, es} objects. Use IMB_I18N.pickLang(obj) at render time.
//
// NOTE(conteúdo): obras reais informadas pela IMB. Métricas, história e depoimentos
// ainda NÃO foram fornecidos — por isso metrics/story ficam vazios (a UI mostra
// "Em breve") e nenhum número é inventado. Preencher quando os dados oficiais chegarem.
window.IMB_CASES = (function () {
  'use strict';

  function L(pt, en, es) { return { pt: pt, en: en, es: es }; }

  var assetPrefix = /\/(en|es)\//i.test(window.location.pathname) ? '../' : '';
  var IMG_1 = assetPrefix + 'images/casees/ponte-guaratuba.jpg';
  var IMG_2 = assetPrefix + 'images/casees/linha-verde.jpg';
  var IMG_3 = assetPrefix + 'images/casees/rodoanel.jpg';
  var IMG_4 = assetPrefix + 'images/casees/palotina.jpg';
  var IMG_5 = assetPrefix + 'images/casees/major-vieira.jpg';
  var IMG_6 = assetPrefix + 'images/casees/lages.jpg';

  // Equipamentos reais (ids batem com IMB_PRODUCTS quando o modelo existe no catálogo).
  var EQ_700C   = { id: 'imb-700c',          name: L('Pavimentadora IMB 700C',  'IMB 700C Paver',   'Pavimentadora IMB 700C') };
  var EQ_3500HD = { id: 'imb-3500hd',        name: L('Pavimentadora IMB 3500HD','IMB 3500HD Paver', 'Pavimentadora IMB 3500HD') };
  var EQ_CRONUS = { id: 'imb-5500hd-cronus', name: L('Pavimentadora IMB 5500HD Cronus','IMB 5500HD Cronus Paver','Pavimentadora IMB 5500HD Cronus') };
  var EQ_TITAN  = { id: 'imb-5500hd-titan',  name: L('Pavimentadora IMB 5500HD Titan', 'IMB 5500HD Titan Paver', 'Pavimentadora IMB 5500HD Titan') };

  var SOON = L('Em breve', 'Coming soon', 'Próximamente');

  function summary(local, modelo) {
    return L(
      'Obra de pavimentação em ' + local.pt + ', executada com a pavimentadora IMB ' + modelo + '. Números e detalhes técnicos em breve.',
      'Paving project in ' + local.en + ', carried out with the IMB ' + modelo + ' paver. Figures and technical details coming soon.',
      'Obra de pavimentación en ' + local.es + ', ejecutada con la pavimentadora IMB ' + modelo + '. Números y detalles técnicos próximamente.'
    );
  }

  var LOC_LINHA_VERDE = L('Curitiba, PR — Brasil', 'Curitiba, PR — Brazil', 'Curitiba, PR — Brasil');
  var LOC_RODOANEL    = L('São Paulo, SP — Brasil', 'São Paulo, SP — Brazil', 'São Paulo, SP — Brasil');
  var LOC_PALOTINA    = L('Palotina, PR — Brasil', 'Palotina, PR — Brazil', 'Palotina, PR — Brasil');
  var LOC_GUARATUBA   = L('Guaratuba, PR — Brasil', 'Guaratuba, PR — Brazil', 'Guaratuba, PR — Brasil');
  var LOC_MAJOR_VIEIRA= L('Major Vieira, SC — Brasil', 'Major Vieira, SC — Brazil', 'Major Vieira, SC — Brasil');
  var LOC_LAGES       = L('Lages, SC — Brasil', 'Lages, SC — Brazil', 'Lages, SC — Brasil');

  const cases = [
    {
      id: 'ponte-guaratuba',
      title: L('Ponte de Guaratuba', 'Guaratuba Bridge', 'Puente de Guaratuba'),
      subtitle: L('Pavimentação com IMB 3500HD', 'Paving with IMB 3500HD', 'Pavimentación con IMB 3500HD'),
      location: LOC_GUARATUBA,
      region: L('Sul', 'South', 'Sur'),
      status: SOON,
      featured: true,
      client: '',
      hero_image: IMG_1,
      summary: summary(LOC_GUARATUBA, '3500HD'),
      story: [],
      metrics: [],
      equipment: [EQ_3500HD],
      testimonial: null,
    },
    {
      id: 'linha-verde',
      title: L('Linha Verde', 'Green Line', 'Línea Verde'),
      subtitle: L('Pavimentação com IMB 700C', 'Paving with IMB 700C', 'Pavimentación con IMB 700C'),
      location: LOC_LINHA_VERDE,
      region: L('Sul', 'South', 'Sur'),
      status: SOON,
      featured: true,
      client: 'Marandel',
      hero_image: IMG_2,
      summary: summary(LOC_LINHA_VERDE, '700C'),
      story: [],
      metrics: [],
      equipment: [EQ_700C],
      testimonial: null,
    },
    {
      id: 'rodoanel',
      title: L('Rodoanel', 'Beltway (Rodoanel)', 'Anillo Vial (Rodoanel)'),
      subtitle: L('Pavimentação com IMB 5500HD Cronus', 'Paving with IMB 5500HD Cronus', 'Pavimentación con IMB 5500HD Cronus'),
      location: LOC_RODOANEL,
      region: L('Sudeste', 'Southeast', 'Sudeste'),
      status: SOON,
      featured: true,
      client: '',
      hero_image: IMG_3,
      summary: summary(LOC_RODOANEL, '5500HD Cronus'),
      story: [],
      metrics: [],
      equipment: [EQ_CRONUS],
      testimonial: null,
    },
    {
      id: 'palotina',
      title: L('Palotina', 'Palotina', 'Palotina'),
      subtitle: L('Pavimentação com IMB 5500HD Cronus', 'Paving with IMB 5500HD Cronus', 'Pavimentación con IMB 5500HD Cronus'),
      location: LOC_PALOTINA,
      region: L('Sul', 'South', 'Sur'),
      status: SOON,
      featured: false,
      client: '',
      hero_image: IMG_4,
      summary: summary(LOC_PALOTINA, '5500HD Cronus'),
      story: [],
      metrics: [],
      equipment: [EQ_CRONUS],
      testimonial: null,
    },
    {
      id: 'major-vieira',
      title: L('Major Vieira', 'Major Vieira', 'Major Vieira'),
      subtitle: L('Pavimentação com IMB 5500HD Titan', 'Paving with IMB 5500HD Titan', 'Pavimentación con IMB 5500HD Titan'),
      location: LOC_MAJOR_VIEIRA,
      region: L('Sul', 'South', 'Sur'),
      status: SOON,
      featured: false,
      client: '',
      hero_image: IMG_5,
      summary: summary(LOC_MAJOR_VIEIRA, '5500HD Titan'),
      story: [],
      metrics: [],
      equipment: [EQ_TITAN],
      testimonial: null,
    },
    {
      id: 'lages',
      title: L('Lages', 'Lages', 'Lages'),
      subtitle: L('Pavimentação com IMB 5500HD Cronus', 'Paving with IMB 5500HD Cronus', 'Pavimentación con IMB 5500HD Cronus'),
      location: LOC_LAGES,
      region: L('Sul', 'South', 'Sur'),
      status: SOON,
      featured: false,
      client: '',
      hero_image: IMG_6,
      summary: summary(LOC_LAGES, '5500HD Cronus'),
      story: [],
      metrics: [],
      equipment: [EQ_CRONUS],
      testimonial: null,
    },
  ];

  function pickNum(v) {
    if (v == null) return NaN;
    return parseFloat(String(v).replace(/\./g, '').replace(',', '.'));
  }

  // Helper: pulls Portuguese label for the totals computation (label keyword matching).
  function labelPt(m) {
    return (m.label && typeof m.label === 'object') ? (m.label.pt || '') : String(m.label || '');
  }

  function totals() {
    let kmRodovia = 0;
    let kmBarreira = 0;
    let m3 = 0;
    let obras = cases.length;
    cases.forEach((c) => {
      c.metrics.forEach((m) => {
        const v = pickNum(m.value);
        if (isNaN(v)) return;
        const lbl = labelPt(m);
        if (m.unit === 'km' && /pavimenta|trecho|contorno|eixo|duplicad|executad/i.test(lbl)) kmRodovia += v;
        if (m.unit === 'km' && /barreira/i.test(lbl)) kmBarreira += v;
        if (m.unit === 'm³') m3 += v;
      });
    });
    return { kmRodovia, kmBarreira, m3, obras };
  }

  function getById(id) {
    return cases.find((c) => c.id === id) || null;
  }

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

  function caseHref(c) {
    if (window.IMB_I18N && window.IMB_I18N.caseDetailUrl) return window.IMB_I18N.caseDetailUrl(c.id);
    return 'case.html?id=' + encodeURIComponent(c.id);
  }

  function metricText(m) {
    var value = T(m.value);
    var unit = T(m.unit);
    return unit ? value + ' ' + unit : value;
  }

  function renderCard(c) {
    var title = T(c.title);
    var location = T(c.location);
    var summaryText = T(c.summary);
    var chips = (c.metrics || []).slice(0, 3).map(function (m) {
      return '<span class="case-card-chip">' + escHtml(metricText(m)) + '</span>';
    }).join('');

    return ''
      + '<article class="case-card group fade-in-up" data-case-id="' + escHtml(c.id) + '">'
      +   '<a href="' + escHtml(caseHref(c)) + '" class="case-card-link" aria-label="' + escHtml(title) + '">'
      +     '<div class="case-card-media">'
      +       '<img src="' + escHtml(c.hero_image) + '" alt="' + escHtml(title) + '" loading="lazy" />'
      +     '</div>'
      +     '<div class="case-card-body">'
      +       '<div class="case-card-location">'
      +         '<span class="material-symbols-outlined">location_on</span>'
      +         '<span>' + escHtml(location) + '</span>'
      +       '</div>'
      +       '<h3 class="case-card-title">' + escHtml(title) + '</h3>'
      +       '<p class="case-card-summary">' + escHtml(summaryText) + '</p>'
      +       (chips ? '<div class="case-card-chips">' + chips + '</div>' : '')
      +     '</div>'
      +   '</a>'
      + '</article>';
  }

  return { cases, totals, getById, renderCard };
})();
