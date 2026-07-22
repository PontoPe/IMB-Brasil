// site vars
var IMB_CONFIG = {
  whatsappNumber: '5541988490341',        // somente num
  whatsappDefaultMsg: 'Olá! Gostaria de mais informações sobre os equipamentos IMB.',
  telefone: '+55 (41) 3679-8050',
  email: 'comercial2@imb-brasil.com.br',
  // Horário comercial — exibido em badges perto de botões WA principais.
  horarioComercial: 'Seg–Sex · 8h–18h · Resposta em ~15min',
};

if (window.IMB_I18N) {
  IMB_CONFIG.whatsappDefaultMsg = window.IMB_I18N.t('wa.default');
  IMB_CONFIG.horarioComercial = window.IMB_I18N.t('wa.hint');
}

// Helper público: monta URL do WhatsApp com mensagem (já tratando encoding).
// Pode ser chamado por qualquer script (compare.js, cases.js, etc).
window.IMB_buildWaUrl = function (msg) {
  var text = (msg && String(msg).trim()) || IMB_CONFIG.whatsappDefaultMsg;
  return 'https://wa.me/' + IMB_CONFIG.whatsappNumber + '?text=' + encodeURIComponent(text);
};

// Resolve a mensagem contextual de um link .wa-link:
// 1. data-wa-msg no próprio elemento
// 2. data-wa-msg em ancestral mais próximo (permite agrupar cards inteiros)
// 3. <meta name="wa-default-msg"> da página
// 4. fallback global IMB_CONFIG.whatsappDefaultMsg
window.IMB_resolveWaMsg = function (el) {
  if (!el) return IMB_CONFIG.whatsappDefaultMsg;
  if (el.dataset && el.dataset.waMsg) return el.dataset.waMsg;
  var ancestor = el.closest && el.closest('[data-wa-msg]');
  if (ancestor) return ancestor.dataset.waMsg;
  var meta = document.querySelector('meta[name="wa-default-msg"]');
  if (meta && meta.content) return meta.content;
  return IMB_CONFIG.whatsappDefaultMsg;
};

(function () {
  'use strict';

  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuOverlay = document.getElementById('menu-overlay');
  const closeMenuBtn = document.getElementById('close-menu-btn');

  function openMenu() {
    mobileMenu.classList.remove('translate-x-full');
    menuOverlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    mobileMenu.classList.add('translate-x-full');
    menuOverlay.classList.add('hidden');
    document.body.style.overflow = '';
  }

  if (menuBtn) {
    menuBtn.addEventListener('click', openMenu);
    closeMenuBtn.addEventListener('click', closeMenu);
    menuOverlay.addEventListener('click', closeMenu);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  }

  // ---- Language switcher (globe + dropdown) ----
  // Marks current locale from <html lang> and wires open/close + outside-click.
  document.querySelectorAll('.lang-switcher').forEach(function (root) {
    var btn  = root.querySelector('.lang-switcher-btn');
    var menu = root.querySelector('.lang-switcher-menu');
    if (!btn || !menu) return;

    var pageLang = (document.documentElement.getAttribute('lang') || '').toLowerCase();
    var lang = pageLang.indexOf('en') === 0 ? 'en' : (pageLang.indexOf('es') === 0 ? 'es' : 'pt');
    menu.querySelectorAll('a[data-lang]').forEach(function (a) {
      if (a.getAttribute('data-lang') === lang) a.classList.add('is-current');
    });

    function setOpen(open) {
      menu.setAttribute('data-open', open ? 'true' : 'false');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      setOpen(menu.getAttribute('data-open') !== 'true');
    });
    document.addEventListener('click', function (e) {
      if (!root.contains(e.target)) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setOpen(false);
    });
  });

  // ---- Hero slideshow (home) — auto-cycles placeholder photos by time ----
  // Markup: a [data-hero-slideshow] wrapper with N <img class="hero-slide">.
  // The first slide carries .is-active; CSS crossfades on opacity.
  document.querySelectorAll('[data-hero-slideshow]').forEach(function (show) {
    var slides = show.querySelectorAll('.hero-slide');
    if (slides.length < 2) return;
    var prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;
    var idx = 0;
    setInterval(function () {
      slides[idx].classList.remove('is-active');
      idx = (idx + 1) % slides.length;
      slides[idx].classList.add('is-active');
    }, 5000);
  });

  const nav = document.getElementById('main-nav');
  if (nav) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 40) {
        nav.classList.add('shadow-md');
        nav.classList.remove('shadow-sm');
      } else {
        nav.classList.remove('shadow-md');
        nav.classList.add('shadow-sm');
      }
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        closeMenu();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  var animatedElements = document.querySelectorAll('.fade-in-up');
  if (animatedElements.length > 0 && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    animatedElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    animatedElements.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  // Delegação global: qualquer .wa-link (inclusive renderizado dinamicamente
  // por compare.js / cases.js depois deste arquivo) tem o href resolvido na hora do clique.
  // Mantém o atributo href visível como espelho para acessibilidade / hover preview.
  function refreshWaHrefs(root) {
    (root || document).querySelectorAll('.wa-link').forEach(function (link) {
      link.href = window.IMB_buildWaUrl(window.IMB_resolveWaMsg(link));
    });
  }
  refreshWaHrefs();
  // Reaplica após mutações relevantes (DOM dinâmico)
  if ('MutationObserver' in window) {
    var moTimer = null;
    var mo = new MutationObserver(function () {
      if (moTimer) return;
      moTimer = setTimeout(function () { moTimer = null; refreshWaHrefs(); }, 50);
    });
    mo.observe(document.body, { childList: true, subtree: true });
  }
  // Garantia adicional na hora do clique (caso o atributo não tenha sido sincronizado)
  document.addEventListener('click', function (e) {
    var link = e.target.closest && e.target.closest('.wa-link');
    if (!link) return;
    link.href = window.IMB_buildWaUrl(window.IMB_resolveWaMsg(link));
  }, true);

  // ---- Cases (obras de destaque) — render a partir de window.IMB_CASES ----
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
  var I18N_LANG = (window.IMB_I18N && window.IMB_I18N.lang) || 'pt';
  var I18N_LOCALE = I18N_LANG === 'pt' ? 'pt-BR' : (I18N_LANG === 'en' ? 'en-US' : 'es-AR');
  var MAIN_UI = {
    viewCase:       { pt: 'Ver case', en: 'View case', es: 'Ver caso' },
    totalRoad:      { pt: 'Pavimentação rígida & contornos', en: 'Rigid paving & bypasses', es: 'Pavimentación rígida y circunvalaciones' },
    totalBarrier:   { pt: 'Barreiras de concreto extrudadas', en: 'Extruded concrete barriers', es: 'Barreras de concreto extruidas' },
    totalConcrete:  { pt: 'Concreto aplicado', en: 'Concrete poured', es: 'Concreto aplicado' },
    totalProjects:  { pt: 'Obras de destaque entregues', en: 'Featured projects delivered', es: 'Obras destacadas entregadas' },
  };
  function mainUi(k) { var e = MAIN_UI[k]; return e ? (e[I18N_LANG] || e.pt) : k; }
  var caseUrl = (window.IMB_I18N && window.IMB_I18N.urlFor) ? window.IMB_I18N.urlFor('case') : 'case.html';

  function fmtNum(n) {
    if (typeof n === 'number') return n.toLocaleString(I18N_LOCALE);
    return String(n);
  }

  function renderCaseCard(c) {
    if (window.IMB_CASES && window.IMB_CASES.renderCard) return window.IMB_CASES.renderCard(c);
    return '';
  }

  var COMING_SOON = { pt: 'Em breve', en: 'Coming soon', es: 'Próximamente' };
  function renderTotalCard(value, unit, label, icon) {
    var hasValue = (typeof value === 'number' && value > 0) || (typeof value === 'string' && value.length > 0);
    var valueHtml;
    if (hasValue) {
      valueHtml = fmtNum(value) + (unit ? ' <span class="text-base md:text-lg text-on-surface-variant font-bold">' + escHtml(unit) + '</span>' : '');
    } else {
      valueHtml = '<span class="text-xl md:text-2xl text-on-surface-variant font-bold">' + escHtml(COMING_SOON[I18N_LANG] || COMING_SOON.pt) + '</span>';
    }
    return ''
      + '<div class="bg-surface-container-lowest rounded-xl p-5 md:p-6 border-b-4 border-outline-variant fade-in-up">'
      +   '<span class="material-symbols-outlined text-3xl md:text-4xl text-primary mb-3 block">' + escHtml(icon) + '</span>'
      +   '<div class="font-headline font-black text-3xl md:text-4xl text-on-surface tracking-tight leading-none">' + valueHtml + '</div>'
      +   '<div class="text-[10px] md:text-xs font-bold uppercase tracking-widest text-on-surface-variant mt-2">' + escHtml(label) + '</div>'
      + '</div>';
  }

  function renderTestimonialCard(c) {
    if (!c.testimonial) return '';
    var t = c.testimonial;
    var detailUrl = (window.IMB_I18N && window.IMB_I18N.caseDetailUrl)
      ? window.IMB_I18N.caseDetailUrl(c.id)
      : caseUrl + '?id=' + encodeURIComponent(c.id);
    return ''
      + '<article class="bg-surface-container-lowest rounded-xl p-6 md:p-8 flex flex-col gap-4 shadow-sm">'
      +   '<span class="testimonial-quote-mark" aria-hidden="true">“</span>'
      +   '<p class="text-on-surface text-sm md:text-base leading-relaxed flex-1 italic">“' + escHtml(T(t.quote)) + '”</p>'
      +   '<div class="flex items-start justify-between gap-3 pt-4 border-t border-surface-container-high">'
      +     '<div class="min-w-0">'
      +       '<div class="font-headline font-bold text-sm text-on-surface leading-tight">' + escHtml(t.author) + '</div>'
      +       '<div class="text-[11px] text-on-surface-variant mt-0.5">' + escHtml(T(t.role)) + ' · ' + escHtml(T(t.company)) + '</div>'
      +     '</div>'
      +     '<a href="' + escHtml(detailUrl) + '" class="shrink-0 text-[10px] font-bold uppercase tracking-widest text-primary hover:underline flex items-center gap-1">'
      +       escHtml(mainUi('viewCase')) + '<span class="material-symbols-outlined text-sm">arrow_outward</span>'
      +     '</a>'
      +   '</div>'
      + '</article>';
  }

  if (window.IMB_CASES) {
    var grid = document.getElementById('cases-grid');
    if (grid) {
      var caseItems = window.IMB_CASES.cases.slice();
      var caseLimit = parseInt(grid.getAttribute('data-limit') || '', 10);
      if (grid.getAttribute('data-featured') === 'home') {
        caseItems = caseItems.filter(function (c) { return !!c.featured; })
          .concat(caseItems.filter(function (c) { return !c.featured; }));
      }
      if (!isNaN(caseLimit) && caseLimit > 0) caseItems = caseItems.slice(0, caseLimit);
      grid.innerHTML = caseItems.map(function (c) {
        return renderCaseCard(c);
      }).join('');
      // Reaplicar IntersectionObserver nos novos .fade-in-up
      grid.querySelectorAll('.fade-in-up').forEach(function (el) {
        if ('IntersectionObserver' in window) {
          var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting) { entry.target.classList.add('is-visible'); io.unobserve(entry.target); }
            });
          }, { threshold: 0.15 });
          io.observe(el);
        } else {
          el.classList.add('is-visible');
        }
      });
    }

    var totalsEl = document.getElementById('cases-totals');
    if (totalsEl) {
      var t = window.IMB_CASES.totals();
      totalsEl.innerHTML = [
        renderTotalCard(Math.round(t.kmRodovia),  'km', mainUi('totalRoad'),     'route'),
        renderTotalCard(Math.round(t.kmBarreira), 'km', mainUi('totalBarrier'),  'security'),
        renderTotalCard(Math.round(t.m3),         'm³', mainUi('totalConcrete'), 'package_2'),
        renderTotalCard(t.obras,                  '',   mainUi('totalProjects'), 'verified'),
      ].join('');
    }

    var testEl = document.getElementById('cases-testimonials');
    if (testEl) {
      var withTestimonials = window.IMB_CASES.cases.filter(function (c) { return !!c.testimonial; });
      testEl.innerHTML = withTestimonials.map(renderTestimonialCard).join('');
    }
  }

  // Clients marquee — populate the track w/ two copies so translateX(-50%) loops cleanly.
  // Logos oficiais em site/images/clientes/. `dark: true` = logo branco, precisa de card escuro.
  // Sem loading="lazy" nas imgs: dentro do track animado (width:max-content) o lazy nunca dispara.
  var clientsTrack = document.getElementById('clients-track');
  if (clientsTrack) {
    var CLIENTS = [
      { name: 'Odebrecht Engenharia & Construção', file: 'odebrecht.png' },
      { name: 'Vale',                  file: 'vale.png' },
      { name: 'Contec',                file: 'contec.png' },
      { name: 'Marandel',              file: 'marandel.png' },
      { name: 'Neovia Engenharia',     file: 'neovia.png' },
      { name: 'Construtora Alya',      file: 'alya.png' },
      { name: 'Construtora Castilho',  file: 'castilho.png' },
      { name: 'Construtora Luiz Costa',file: 'clc.png' },
      { name: 'Grupo Cotragon',        file: 'cotragon.png' },
      { name: 'Dameda',                file: 'dameda.png' },
      { name: 'ICV',                   file: 'icv.png' },
      { name: 'Infra Urbana',          file: 'infraurbana.png', dark: true },
      { name: 'Tripoloni',             file: 'tripoloni.png',   dark: true },
      { name: 'Valevias Construtora',  file: 'valevias.png' },
    ];
    var logoPrefix = /\/(en|es)\//i.test(window.location.pathname) ? '../' : '';
    var html = '';
    for (var pass = 0; pass < 2; pass++) {
      for (var i = 0; i < CLIENTS.length; i++) {
        var c = CLIENTS[i];
        var dup = pass === 1;
        html += '<div class="client-logo' + (c.dark ? ' client-logo--dark' : '') + '"'
              + (dup ? ' aria-hidden="true"' : '') + '>'
              + '<img src="' + logoPrefix + 'images/clientes/' + c.file + '"'
              + ' alt="' + (dup ? '' : c.name) + '" decoding="async" width="190" height="60" />'
              + '</div>';
      }
    }
    clientsTrack.innerHTML = html;
  }

  var contactForm = document.getElementById('contact-form');
  if (contactForm) {
    // ToDo: replace with WPForms/CF7 in WordPress
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var nome = contactForm.querySelector('[name="nome"]');
      var telefone = contactForm.querySelector('[name="telefone"]');
      var interesse = contactForm.querySelector('[name="interesse"]');
      var mensagem = contactForm.querySelector('[name="mensagem"]');

      var text = 'Olá! Meu nome é ' + (nome ? nome.value : '') + '.';
      if (interesse && interesse.value) text += ' Tenho interesse em: ' + interesse.value + '.';
      if (mensagem && mensagem.value) text += ' ' + mensagem.value;
      if (telefone && telefone.value) text += ' Meu telefone: ' + telefone.value;

      window.open(window.IMB_buildWaUrl(text), '_blank', 'noopener');
    });
  }
})();
