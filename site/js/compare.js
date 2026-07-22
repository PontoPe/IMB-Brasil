// Comparison page: product picker + dynamic comparison table.
// Selection persists via ?ids=a,b,c URL param so links can share specific comparisons.
(function () {
  'use strict';

  if (!window.IMB_PRODUCTS) return;
  const { groups, fields, products } = window.IMB_PRODUCTS;
  const productMap = Object.fromEntries(products.map((p) => [p.id, p]));

  // i18n helper — picks current-lang string from {pt,en,es} or returns scalar as-is.
  function T(v) {
    if (v == null) return '';
    if (typeof v === 'object' && (v.pt || v.en || v.es)) {
      return (window.IMB_I18N && window.IMB_I18N.pickLang) ? window.IMB_I18N.pickLang(v) : (v.pt || v.en || v.es || '');
    }
    return v;
  }
  const LANG = (window.IMB_I18N && window.IMB_I18N.lang) || 'pt';
  const I18N_UI = {
    selected:    { pt: 'selecionado',   en: 'selected',           es: 'seleccionado' },
    selectedPl:  { pt: 'selecionados',  en: 'selected',           es: 'seleccionados' },
    needMore:    { pt: 'Selecione mais 1 equipamento', en: 'Select 1 more equipment', es: 'Seleccione 1 equipo más' },
    needMoreP:   { pt: 'Adicione ao menos mais um para gerar a comparação.', en: 'Add at least one more to generate the comparison.', es: 'Agregue al menos uno más para generar la comparación.' },
    needTwo:     { pt: 'Selecione ao menos 2 equipamentos', en: 'Select at least 2 equipment', es: 'Seleccione al menos 2 equipos' },
    needTwoP:    { pt: 'Toque nos cartões acima para adicionar à comparação. Um comparativo detalhado aparecerá aqui.', en: 'Tap the cards above to add to the comparison. A detailed comparison will appear here.', es: 'Toque las tarjetas arriba para agregar a la comparación. Aquí aparecerá un comparativo detallado.' },
    compare:     { pt: 'Comparativo',   en: 'Comparison',          es: 'Comparativo' },
    equipCount:  { pt: 'equipamentos',  en: 'equipment items',     es: 'equipos' },
    sheet:       { pt: 'Ficha',         en: 'Data sheet',          es: 'Ficha' },
    remove:      { pt: 'Remover',       en: 'Remove',              es: 'Quitar' },
    shareLink:   { pt: 'Copiar link da comparação', en: 'Copy comparison link', es: 'Copiar enlace de comparación' },
    linkCopied:  { pt: 'Link copiado!', en: 'Link copied!',        es: '¡Enlace copiado!' },
    print:       { pt: 'Imprimir / Salvar PDF', en: 'Print / Save PDF', es: 'Imprimir / Guardar PDF' },
    waCompare:   { pt: function(p, list){ return 'Olá! Estou comparando o ' + p + ' com ' + list + ' e gostaria de ajuda para escolher.'; },
                   en: function(p, list){ return 'Hi! I\'m comparing the ' + p + ' with ' + list + ' and would like help choosing.'; },
                   es: function(p, list){ return '¡Hola! Estoy comparando el ' + p + ' con ' + list + ' y quisiera ayuda para elegir.'; } },
    waSingle:    { pt: function(p){ return 'Olá! Tenho interesse no ' + p + ' e gostaria de mais informações.'; },
                   en: function(p){ return 'Hi! I\'m interested in the ' + p + ' and would like more information.'; },
                   es: function(p){ return '¡Hola! Tengo interés en el ' + p + ' y quisiera más información.'; } },
    joinAnd:     { pt: ' e ',           en: ' and ',               es: ' y ' },
  };
  function ui(key) {
    var e = I18N_UI[key];
    if (!e) return key;
    return e[LANG] || e.pt;
  }
  function locale() { return LANG === 'pt' ? 'pt-BR' : (LANG === 'en' ? 'en-US' : 'es-AR'); }
  function productDetailUrl(product) {
    if (window.IMB_I18N && window.IMB_I18N.productDetailUrl) {
      return window.IMB_I18N.productDetailUrl(product.id);
    }
    return 'produto.html?id=' + encodeURIComponent(product.id);
  }

  const pickerEl     = document.getElementById('picker');
  const comparisonEl = document.getElementById('comparison');
  const emptyEl      = document.getElementById('empty-state');
  const countEl      = document.getElementById('selection-count');
  const clearBtn     = document.getElementById('clear-btn');
  const selectAllBtn = document.getElementById('select-all-btn');

  if (!pickerEl || !comparisonEl) return;

  let selected = readSelectionFromURL();
  let comparisonResizeObserver = null;
  let comparisonResizeHandler = null;

  function readSelectionFromURL() {
    const raw = new URLSearchParams(window.location.search).get('ids') || '';
    const ids = raw.split(',').map((s) => s.trim()).filter((id) => productMap[id]);
    return new Set(ids);
  }

  function writeSelectionToURL() {
    const params = new URLSearchParams(window.location.search);
    if (selected.size === 0) params.delete('ids');
    else params.set('ids', Array.from(selected).join(','));
    const qs = params.toString();
    const url = window.location.pathname + (qs ? '?' + qs : '');
    history.replaceState(null, '', url);
  }

  function toggle(id) {
    if (selected.has(id)) selected.delete(id);
    else selected.add(id);
    writeSelectionToURL();
    render();
  }

  function cleanupComparisonScrollSync() {
    if (comparisonResizeObserver) {
      comparisonResizeObserver.disconnect();
      comparisonResizeObserver = null;
    }
    if (comparisonResizeHandler) {
      window.removeEventListener('resize', comparisonResizeHandler);
      comparisonResizeHandler = null;
    }
  }

  function setupComparisonScrollSync() {
    cleanupComparisonScrollSync();

    const topScroll = comparisonEl.querySelector('.cmp-top-scroll');
    const topTrack = comparisonEl.querySelector('.cmp-top-scroll-track');
    const mainScroll = comparisonEl.querySelector('.cmp-scroll');
    const grid = comparisonEl.querySelector('.cmp-grid');
    if (!topScroll || !topTrack || !mainScroll || !grid) return;

    let syncing = false;
    function syncTo(source, target) {
      if (syncing) return;
      syncing = true;
      target.scrollLeft = source.scrollLeft;
      requestAnimationFrame(function () { syncing = false; });
    }

    function syncWidth() {
      topTrack.style.width = grid.scrollWidth + 'px';
      const hasOverflow = mainScroll.scrollWidth > mainScroll.clientWidth + 1;
      topScroll.hidden = !hasOverflow;
      if (hasOverflow) {
        topScroll.scrollLeft = mainScroll.scrollLeft;
      } else {
        topScroll.scrollLeft = 0;
        mainScroll.scrollLeft = 0;
      }
    }

    topScroll.addEventListener('scroll', function () { syncTo(topScroll, mainScroll); });
    mainScroll.addEventListener('scroll', function () { syncTo(mainScroll, topScroll); });

    if ('ResizeObserver' in window) {
      comparisonResizeObserver = new ResizeObserver(syncWidth);
      comparisonResizeObserver.observe(mainScroll);
      comparisonResizeObserver.observe(grid);
    } else {
      comparisonResizeHandler = syncWidth;
      window.addEventListener('resize', comparisonResizeHandler);
    }

    requestAnimationFrame(syncWidth);
  }

  function fmtNumber(n) {
    if (n === null || n === undefined) return '—';
    if (Number.isInteger(n)) return n.toLocaleString(locale());
    return n.toLocaleString(locale(), { maximumFractionDigits: 2 });
  }

  function subtitleParts(product) {
    const subtitle = T(product.subtitle);
    const parts = subtitle.split(/\s+[—-]\s+/).map((part) => part.trim()).filter(Boolean);
    return parts.length ? parts : [subtitle];
  }

  function renderPicker() {
    pickerEl.innerHTML = products.map((p) => {
      const isOn = selected.has(p.id);
      const toggleStateClass = isOn ? 'is-selected' : 'is-add';
      const subtitle = subtitleParts(p).slice(0, 2).map((part) => `<span>${escapeHTML(part)}</span>`).join('');
      return `
        <button type="button" data-id="${p.id}" aria-pressed="${isOn}"
          class="picker-card group">
          <div class="picker-thumb">
            <img src="${p.image}" alt="${escapeAttr(p.name)}" loading="lazy" />
          </div>
          <div class="picker-copy">
            <div class="picker-title">${escapeHTML(p.name)}</div>
            <div class="picker-subtitle">${subtitle}</div>
          </div>
          <span class="picker-toggle ${toggleStateClass}" aria-hidden="true"></span>
        </button>`;
    }).join('');

    pickerEl.querySelectorAll('.picker-card').forEach((btn) => {
      btn.addEventListener('click', () => toggle(btn.dataset.id));
    });

    countEl.textContent = selected.size + ' ' + (selected.size === 1 ? ui('selected') : ui('selectedPl'));
  }

  function maxFor(fieldKey, picks) {
    let max = 0;
    picks.forEach((p) => {
      const v = p.specs[fieldKey];
      if (typeof v === 'number' && v > max) max = v;
    });
    return max;
  }

  const isYes = window.IMB_PRODUCTS.isYes || function () { return false; };
  const isNo  = window.IMB_PRODUCTS.isNo  || function () { return false; };

  function renderCell(field, product, max) {
    const v = product.specs[field.key];
    const override = product.specs[field.key + '_label'];
    const unitStr = field.unit ? T(field.unit) : '';
    const unit = unitStr ? ` <span class="text-[10px] text-on-surface-variant font-semibold uppercase tracking-wider ml-1">${unitStr}</span>` : '';

    if (v === null || v === undefined) {
      return `<div class="text-on-surface-variant/60 text-sm italic">N/A</div>`;
    }

    if (isYes(v)) {
      return `<span class="cmp-bool cmp-bool-yes"><span class="material-symbols-outlined" style="font-size:inherit;line-height:1;">check</span></span>`;
    }
    if (isNo(v)) {
      return `<span class="cmp-bool cmp-bool-no"><span class="material-symbols-outlined" style="font-size:inherit;line-height:1;">close</span></span>`;
    }

    // `<key>_label` troca só o texto exibido; o número segue valendo para a barra.
    const numeric = override ? escapeHTML(T(override)) : `${fmtNumber(v)}${unit}`;

    if (field.type === 'bar') {
      const pct = max > 0 ? Math.max(4, Math.round((v / max) * 100)) : 0;
      return `
        <div class="space-y-2">
          <div class="font-bold text-on-surface text-sm md:text-base">${numeric}</div>
          <div class="cmp-bar-track">
            <div class="cmp-bar-fill" style="width:${pct}%"></div>
          </div>
        </div>`;
    }

    if (field.type === 'number') {
      return `<div class="font-bold text-on-surface text-sm md:text-base">${numeric}</div>`;
    }

    // text (may be multilang object)
    return `<div class="text-on-surface text-sm leading-snug">${escapeHTML(T(v))}</div>`;
  }

  function renderComparison() {
    const picks = Array.from(selected).map((id) => productMap[id]).filter(Boolean);

    if (picks.length < 2) {
      cleanupComparisonScrollSync();
      comparisonEl.innerHTML = '';
      emptyEl.classList.toggle('hidden', picks.length === 0);
      if (picks.length === 1) {
        emptyEl.querySelector('h3').textContent = ui('needMore');
        emptyEl.querySelector('p').textContent = ui('needMoreP');
      } else {
        emptyEl.querySelector('h3').textContent = ui('needTwo');
        emptyEl.querySelector('p').textContent = ui('needTwoP');
      }
      return;
    }
    emptyEl.classList.add('hidden');

    const colCount = picks.length;
    const colWidth = 'minmax(180px, 1fr)';
    const gridTemplate = `minmax(180px, 220px) repeat(${colCount}, ${colWidth})`;

    // Header row — inclui CTA WhatsApp contextual por produto
    const otherNames = picks.filter((x) => x.id !== '__placeholder__').map((x) => x.name);
    const headerCells = picks.map((p) => {
      const compareList = picks.filter((x) => x.id !== p.id).map((x) => x.name).join(ui('joinAnd'));
      const waMsg = compareList
        ? I18N_UI.waCompare[LANG](p.name, compareList)
        : I18N_UI.waSingle[LANG](p.name);
      const detailUrl = productDetailUrl(p);
      return `
      <div class="cmp-head-cell">
        <a href="${detailUrl}" class="block group">
          <div class="aspect-[4/3] rounded-lg overflow-hidden bg-surface-container mb-3">
            <img src="${p.image}" alt="${escapeAttr(p.name)}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
          </div>
          <div class="cmp-selected-name font-headline font-black text-base md:text-lg uppercase tracking-tight leading-tight text-on-surface">${escapeHTML(p.name)}</div>
          <div class="cmp-selected-subtitle text-[10px] md:text-xs text-on-surface-variant mt-1">${escapeHTML(T(p.subtitle))}</div>
        </a>
        <div class="cmp-selected-actions mt-3 flex flex-wrap gap-2 items-start">
          <a href="#" class="wa-link inline-flex items-center gap-1.5 bg-success hover:bg-success-strong text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded transition-colors"
             data-wa-msg="${escapeAttr(waMsg)}" target="_blank" rel="noopener">
            <span class="material-symbols-outlined text-[14px]" style="font-variation-settings:'FILL' 1;">chat</span>WhatsApp
          </a>
          <a href="${detailUrl}" class="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-primary hover:underline">
            ${ui('sheet')} <span class="material-symbols-outlined text-[14px]">arrow_outward</span>
          </a>
          <button type="button" data-remove="${p.id}" class="cmp-remove inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant hover:text-on-surface">
            <span class="material-symbols-outlined text-[14px]">close</span>${ui('remove')}
          </button>
        </div>
      </div>`;
    }).join('');

    let html = `
      <div class="cmp-top-scroll" hidden aria-hidden="true">
        <div class="cmp-top-scroll-track"></div>
      </div>
      <div class="cmp-table-wrap rounded-xl border border-surface-container-high bg-surface-container-lowest">
        <div class="cmp-scroll overflow-x-auto" tabindex="0" aria-label="${ui('compare')}">
          <div class="cmp-grid" style="grid-template-columns:${gridTemplate};">
            <div class="cmp-head-cell cmp-head-label flex items-end">
              <div>
                <div class="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">${ui('compare')}</div>
                <div class="font-headline font-black text-lg uppercase tracking-tight">${colCount} ${ui('equipCount')}</div>
              </div>
            </div>
            ${headerCells}
    `;

    groups.forEach((g) => {
      const groupFields = fields.filter((f) => f.group === g.id);
      // Skip groups where every selected product is N/A for every field — keeps view tight
      const anyData = groupFields.some((f) => picks.some((p) => p.specs[f.key] !== null && p.specs[f.key] !== undefined));
      if (!anyData) return;

      html += `
        <div class="cmp-section-head" style="grid-column:1 / -1;">
          <span class="w-1.5 h-5 bg-primary inline-block align-middle mr-2"></span>
          ${escapeHTML(T(g.label))}
        </div>`;

      groupFields.forEach((field) => {
        // Linha some quando o campo não se aplica a nenhum dos produtos selecionados.
        const applies = picks.some((p) => field.key in p.specs);
        if (!applies) return;
        const max = field.type === 'bar' ? maxFor(field.key, picks) : 0;
        html += `<div class="cmp-row-label">${escapeHTML(T(field.label))}</div>`;
        picks.forEach((p) => {
          html += `<div class="cmp-cell">${renderCell(field, p, max)}</div>`;
        });
      });
    });

    html += `
          </div>
        </div>
      </div>
      <div class="mt-6 flex flex-wrap gap-3 justify-end">
        <button type="button" id="share-link-btn" class="text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-md bg-surface-container-high hover:bg-surface-dim transition-colors flex items-center gap-2">
          <span class="material-symbols-outlined text-sm">link</span>${ui('shareLink')}
        </button>
        <button type="button" id="print-btn" class="text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-md bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary transition-colors flex items-center gap-2">
          <span class="material-symbols-outlined text-sm">print</span>${ui('print')}
        </button>
      </div>
    `;

    comparisonEl.innerHTML = html;
    setupComparisonScrollSync();

    comparisonEl.querySelectorAll('.cmp-remove').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(btn.dataset.remove);
      });
    });

    const shareBtn = document.getElementById('share-link-btn');
    if (shareBtn) {
      shareBtn.addEventListener('click', () => {
        const url = window.location.href;
        if (navigator.clipboard) {
          navigator.clipboard.writeText(url).then(() => {
            shareBtn.innerHTML = '<span class="material-symbols-outlined text-sm">check</span>' + ui('linkCopied');
            setTimeout(() => {
              shareBtn.innerHTML = '<span class="material-symbols-outlined text-sm">link</span>' + ui('shareLink');
            }, 2000);
          });
        }
      });
    }
    const printBtn = document.getElementById('print-btn');
    if (printBtn) printBtn.addEventListener('click', () => window.print());
  }

  function render() {
    renderPicker();
    renderComparison();
  }

  function escapeHTML(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    }[c]));
  }
  function escapeAttr(s) { return escapeHTML(s); }

  clearBtn.addEventListener('click', () => {
    selected = new Set();
    writeSelectionToURL();
    render();
  });
  selectAllBtn.addEventListener('click', () => {
    selected = new Set(products.map((p) => p.id));
    writeSelectionToURL();
    render();
  });

  // First render
  render();
})();
