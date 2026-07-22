// IMB product catalog — dados oficiais de site/docs/fichas_tecnicas_maquinas_revisado.xlsx (2026-07).
// Translatable fields use {pt, en, es} objects. Use IMB_I18N.pickLang(obj) at render time.
//
// Linha mecânica/automatizada e linha hidráulica têm fichas técnicas de estruturas diferentes.
// A estrutura sai do próprio `specs`: campo ausente = linha não existe na ficha daquele equipamento;
// campo `null` = linha existe e aparece como "—". Um campo `<chave>_label` sobrescreve só o texto
// exibido na ficha e no comparador (o número em `<chave>` continua valendo para barras e ordenação).
window.IMB_PRODUCTS = (function () {
  'use strict';

  function L(pt, en, es) { return { pt: pt, en: en, es: es }; }

  const SIM = L('Sim', 'Yes', 'Sí');
  const NAO = L('Não', 'No', 'No');
  const OPC = L('Opcional', 'Optional', 'Opcional');
  const MANUAL = L('Manual', 'Manual', 'Manual');
  const AUTOM = L('Automatizada', 'Automated', 'Automatizada');
  const PARTIDA_ELET = L('Elétrica', 'Electric', 'Eléctrica');
  const PARTIDA_ELET_RET = L('Elétrica / manual retrátil', 'Electric / recoil manual', 'Eléctrica / manual retráctil');
  const CORREIA_DUPLA = L('Polia e correia dupla', 'Double pulley and belt', 'Polea y correa doble');
  const CORREIA_TRIPLA = L('Polia e correia tripla', 'Triple pulley and belt', 'Polea y correa triple');
  const CORRENTE_DUPLA = L('Corrente e engrenagem dupla', 'Double chain and gear', 'Cadena y engranaje doble');

  function isToken(v, pt) { return !!v && typeof v === 'object' && v.pt === pt; }
  function isYes(v) { return isToken(v, 'Sim'); }
  function isNo(v) { return isToken(v, 'Não'); }
  function isOptional(v) { return isToken(v, 'Opcional'); }

  // ----- groups + fields used by compare table and product spec sheet -----
  const groups = [
    { id: 'app',   label: L('Categoria & Aplicação',  'Category & Application',    'Categoría y Aplicación') },
    { id: 'motor', label: L('Motor & Transmissão',    'Engine & Transmission',     'Motor y Transmisión') },
    { id: 'cap',   label: L('Capacidade do Perfil',   'Profile Capacity',          'Capacidad del Perfil') },
    { id: 'dim',   label: L('Dimensões & Peso',       'Dimensions & Weight',       'Dimensiones y Peso') },
    { id: 'tech',  label: L('Tecnologia & Recursos',  'Technology & Features',     'Tecnología y Funciones') },
    { id: 'prod',  label: L('Produtividade',          'Productivity',              'Productividad') },
  ];

  // A ordem aqui vale para as duas linhas: cada uma exibe só os campos que possui.
  const fields = [
    { key: 'tipo',              label: L('Tipo de Equipamento',         'Equipment Type',              'Tipo de Equipo'),                  type: 'text',   group: 'app' },
    { key: 'linha',             label: L('Linha',                       'Line',                        'Línea'),                           type: 'text',   group: 'app' },
    { key: 'aplicacoes',        label: L('Aplicações',                  'Applications',                'Aplicaciones'),                    type: 'text',   group: 'app' },

    { key: 'motor_hp',          label: L('Potência (a partir de)',      'Power (from)',                'Potencia (desde)'),                type: 'bar',    unit: 'cv',   group: 'motor' },
    { key: 'motor_tipo',        label: L('Motor',                       'Engine',                      'Motor'),                           type: 'text',   group: 'motor' },
    { key: 'redutor',           label: L('Redutor',                     'Gear Reducer',                'Reductor'),                        type: 'text',   group: 'motor' },
    { key: 'transmissao',       label: L('Transmissão',                 'Transmission',                'Transmisión'),                     type: 'text',   group: 'motor' },
    { key: 'tracao',            label: L('Tração',                      'Drive',                       'Tracción'),                        type: 'text',   group: 'motor' },
    { key: 'partida',           label: L('Partida',                     'Start',                       'Arranque'),                        type: 'text',   group: 'motor' },
    { key: 'vibradores',        label: L('Vibradores Hidráulicos',      'Hydraulic Vibrators',         'Vibradores Hidráulicos'),          type: 'number', unit: L('un','units','un'), group: 'motor' },

    { key: 'largura_perfil',    label: L('Largura Máx. do Perfil',      'Max. Profile Width',          'Ancho Máx. del Perfil'),           type: 'bar',    unit: 'mm', group: 'cap' },
    { key: 'altura_perfil',     label: L('Altura Máx. do Perfil',       'Max. Profile Height',         'Altura Máx. del Perfil'),          type: 'number', unit: 'mm', group: 'cap' },

    { key: 'peso',              label: L('Peso Aproximado',             'Approx. Weight',              'Peso Aproximado'),                 type: 'bar',    unit: 'kg', group: 'dim' },
    { key: 'comprimento',       label: L('Comprimento',                 'Length',                      'Longitud'),                        type: 'number', unit: 'mm', group: 'dim' },
    { key: 'largura',           label: L('Largura',                     'Width',                       'Ancho'),                           type: 'number', unit: 'mm', group: 'dim' },
    { key: 'altura',            label: L('Altura',                      'Height',                      'Altura'),                          type: 'number', unit: 'mm', group: 'dim' },
    { key: 'tanque_combust',    label: L('Tanque de Combustível',       'Fuel Tank',                   'Tanque de Combustible'),           type: 'number', unit: 'L',  group: 'dim' },
    { key: 'tanque_hidr',       label: L('Tanque de Óleo Hidráulico',   'Hydraulic Oil Tank',          'Tanque de Aceite Hidráulico'),     type: 'number', unit: 'L',  group: 'dim' },
    { key: 'tanque_agua',       label: L('Tanque de Água',              'Water Tank',                  'Tanque de Agua'),                  type: 'number', unit: 'L',  group: 'dim' },

    { key: 'horimetro',         label: L('Horímetro',                   'Hourmeter',                   'Horómetro'),                       type: 'text', group: 'tech' },
    { key: 'suspensao',         label: L('Suspensão',                   'Suspension',                  'Suspensión'),                      type: 'text', group: 'tech' },
    { key: 'direcao',           label: L('Direção',                     'Steering',                    'Dirección'),                       type: 'text', group: 'tech' },
    { key: 'embreagem_radial',  label: L('Embreagem Radial',            'Radial Clutch',               'Embrague Radial'),                 type: 'text', group: 'tech' },
    { key: 'sensor_altura',     label: L('Sensor de Altura',            'Height Sensor',               'Sensor de Altura'),                type: 'text', group: 'tech' },
    { key: 'sensor_direcao',    label: L('Sensor de Direção',           'Steering Sensor',             'Sensor de Dirección'),             type: 'text', group: 'tech' },
    { key: 'sensor_inclinacao', label: L('Sensor de Inclinação',        'Inclination Sensor',          'Sensor de Inclinación'),           type: 'text', group: 'tech' },
    { key: 'monitoramento_3d',  label: L('Monitoramento 3D',            '3D Monitoring',               'Monitoreo 3D'),                    type: 'text', group: 'tech' },
    { key: 'inset_offset',      label: L('Inset + Offset (duplo setup)','Inset + Offset (dual setup)', 'Inset + Offset (doble setup)'),    type: 'text', group: 'tech' },
    { key: 'esteiras_aco',      label: L('Esteiras de Aço',             'Steel Tracks',                'Orugas de Acero'),                 type: 'text', group: 'tech' },
    { key: 'desloc_lateral',    label: L('Deslocamento Hidráulico Lateral da Suspensão', 'Hydraulic Lateral Suspension Shift', 'Desplazamiento Hidráulico Lateral de la Suspensión'), type: 'text', group: 'tech' },
    { key: 'rosca_sem_fim',     label: L('Sistema de Alimentação de Concreto por Rosca Sem Fim', 'Auger Concrete Feeding System', 'Sistema de Alimentación de Concreto por Tornillo Sin Fin'), type: 'text', group: 'tech' },
    { key: 'revest_esteiras',   label: L('Revestimento de Borracha para Esteiras de Tração', 'Rubber Coating for Traction Tracks', 'Revestimiento de Goma para Orugas de Tracción'), type: 'text', group: 'tech' },

    { key: 'produtividade',     label: L('Produtividade',               'Productivity',                'Productividad'),                   type: 'text',   group: 'prod' },
  ];

  // ----- product catalog -----
  var assetPrefix = /\/(en|es)\//i.test(window.location.pathname) ? '../' : '';

  const IMG_PAVER_COMPACT_2000HD = assetPrefix + 'images/produtos/2000hd-max.jpg';
  const IMG_PAVER_MEDIUM_3500HD  = assetPrefix + 'images/produtos/3500hd.jpg';
  const IMG_PAVER_LARGE_TITAN    = assetPrefix + 'images/produtos/5500hd-titan.jpg';
  const IMG_PAVER_LARGE_CRONUS   = assetPrefix + 'images/produtos/5500hd-cronus.jpg';

  const IMG_EXTRUDER_500HD       = assetPrefix + 'images/produtos/500hd.jpg';
  const IMG_EXTRUDER_400_ECON    = assetPrefix + 'images/produtos/400-economic.jpg';
  const IMG_EXTRUDER_700_COMPACT = assetPrefix + 'images/produtos/700-compact.jpg';
  const IMG_EXTRUDER_800_COMPACT = assetPrefix + 'images/produtos/800-compact.jpg';
  const IMG_EXTRUDER_900_MASTER  = assetPrefix + 'images/produtos/900g-master.jpg';
  const IMG_EXTRUDER_900_EMB     = assetPrefix + 'images/produtos/900g-master-embreagem.jpg';
  const IMG_EXTRUDER_900_STC     = assetPrefix + 'images/produtos/900g-stc.jpg';

  const TIPO_PAVER    = L('Pavimentadora de Concreto', 'Concrete Paver', 'Pavimentadora de Concreto');
  const TIPO_EXTRUSOR = L('Extrusora de Concreto', 'Concrete Extruder', 'Extrusora de Concreto');
  const LINHA_HIDR    = L('Hidráulica', 'Hydraulic', 'Hidráulica');

  function vibradores(qtd) {
    var n = qtd < 10 ? '0' + qtd : String(qtd);
    return L(n + ' un · 10.000 rpm', n + ' units · 10,000 rpm', n + ' un · 10.000 rpm');
  }
  function perfilOffset(mm) {
    return L('Offset: ' + mm, 'Offset: ' + mm, 'Offset: ' + mm);
  }
  function perfilOffsetInset(off, ins) {
    return L('Offset: ' + off + ' / Inset: ' + ins, 'Offset: ' + off + ' / Inset: ' + ins, 'Offset: ' + off + ' / Inset: ' + ins);
  }

  const products = [
    // ===== LINHA HIDRÁULICA — Pavimentadoras de Formas Deslizantes =====
    {
      id: 'imb-2000hd-max',
      name: 'IMB 2000HD MAX',
      subtitle: L('Pavimentadora — Linha Hidráulica','Paver — Hydraulic Line','Pavimentadora — Línea Hidráulica'),
      url: 'pavimentadora.html',
      image: IMG_PAVER_COMPACT_2000HD,
      manualUrl: 'manuals/manual-imb-2000hd-max.pdf',
      profile_types: ['pavimento-concreto'],
      specs: {
        tipo: TIPO_PAVER,
        linha: LINHA_HIDR,
        aplicacoes:        L('Meio-fio, guia e sarjeta, calçadas e canaletas em geral','Curbs, curb & gutter, sidewalks and general channels','Cordones, guías y cunetas, veredas y canaletas en general'),
        motor_hp: 22,      motor_tipo: 'Diesel',
        tracao:            L('Hidráulica integral 3WD','Full hydraulic 3WD','Hidráulica integral 3WD'),
        vibradores: 2,     vibradores_label: vibradores(2),
        largura_perfil: 1200, largura_perfil_label: perfilOffset('1.200 mm'),
        altura_perfil: 350,
        peso: 2500, comprimento: 3470, largura: 2410, altura: 1910,
        tanque_combust: 50, tanque_hidr: 100, tanque_agua: null,
        sensor_altura: SIM, sensor_direcao: SIM, sensor_inclinacao: SIM,
        monitoramento_3d: null, inset_offset: null, esteiras_aco: null,
        desloc_lateral: null, rosca_sem_fim: null, revest_esteiras: null,
        produtividade: L('3,5 a 4 m/min, variável conforme perfil','3.5 to 4 m/min, varies by profile','3,5 a 4 m/min, variable según perfil'),
      },
    },
    {
      id: 'imb-3500hd',
      name: 'IMB 3500HD',
      subtitle: L('Pavimentadora — Linha Hidráulica','Paver — Hydraulic Line','Pavimentadora — Línea Hidráulica'),
      url: 'pavimentadora.html',
      image: IMG_PAVER_MEDIUM_3500HD,
      manualUrl: 'manuals/manual-imb-3500hd.pdf',
      profile_types: ['pavimento-concreto', 'canaleta-drenagem'],
      specs: {
        tipo: TIPO_PAVER,
        linha: LINHA_HIDR,
        aplicacoes:        L('Calçadas, canaletas em geral, cocho para confinamento e barreira tipo New Jersey simples','Sidewalks, general channels, feed troughs and single New Jersey barriers','Veredas, canaletas en general, comederos para confinamiento y barrera tipo New Jersey simple'),
        motor_hp: 36,      motor_tipo: 'Diesel',
        tracao:            L('Hidráulica integral 3WD em esteiras de aço','Full hydraulic 3WD on steel tracks','Hidráulica integral 3WD en orugas de acero'),
        vibradores: 4,     vibradores_label: vibradores(4),
        largura_perfil: 2000, largura_perfil_label: perfilOffset('2.000 mm'),
        altura_perfil: 350,
        peso: 7500, comprimento: 6900, largura: 2550, altura: 2800,
        tanque_combust: 150, tanque_hidr: 200, tanque_agua: 390,
        sensor_altura: SIM, sensor_direcao: SIM, sensor_inclinacao: SIM,
        monitoramento_3d: OPC, inset_offset: null, esteiras_aco: SIM,
        desloc_lateral: OPC, rosca_sem_fim: OPC, revest_esteiras: OPC,
        produtividade: L('2 m/min','2 m/min','2 m/min'),
      },
    },
    {
      id: 'imb-5500hd-titan',
      name: 'IMB 5500HD TITAN',
      subtitle: L('Pavimentadora — Linha Hidráulica','Paver — Hydraulic Line','Pavimentadora — Línea Hidráulica'),
      url: 'pavimentadora.html',
      image: IMG_PAVER_LARGE_TITAN,
      manualUrl: 'manuals/manual-imb-5500hd-titan.pdf',
      profile_types: ['pavimento-concreto', 'barreira-new-jersey'],
      specs: {
        tipo: TIPO_PAVER,
        linha: LINHA_HIDR,
        aplicacoes:        L('Calçadas, canaletas em geral, cocho para confinamento, barreira tipo New Jersey simples ou dupla e pavimento de concreto','Sidewalks, general channels, feed troughs, single or double New Jersey barriers and concrete pavement','Veredas, canaletas en general, comederos, barrera tipo New Jersey simple o doble y pavimento de concreto'),
        motor_hp: 85,      motor_tipo: L('Diesel — Yanmar 4TNV','Diesel — Yanmar 4TNV','Diésel — Yanmar 4TNV'),
        tracao:            L('Hidráulica integral 3WD em esteiras de aço','Full hydraulic 3WD on steel tracks','Hidráulica integral 3WD en orugas de acero'),
        vibradores: 6,     vibradores_label: vibradores(6),
        largura_perfil: 3600, largura_perfil_label: perfilOffsetInset('2.500 mm', '3.600 mm'),
        altura_perfil: 350,
        peso: 10500, comprimento: 8100, largura: 2600, altura: 2800,
        tanque_combust: 175, tanque_hidr: 450, tanque_agua: 700,
        sensor_altura: SIM, sensor_direcao: SIM, sensor_inclinacao: SIM,
        monitoramento_3d: OPC, inset_offset: OPC, esteiras_aco: SIM,
        desloc_lateral:    L('De série (traseira) / opcional (dianteira direita)','Standard (rear) / optional (front right)','De serie (trasera) / opcional (delantera derecha)'),
        rosca_sem_fim: OPC, revest_esteiras: OPC,
        produtividade: L('2 m/min','2 m/min','2 m/min'),
      },
    },
    {
      id: 'imb-5500hd-cronus',
      name: 'IMB 5500HD CRONUS',
      subtitle: L('Pavimentadora — Linha Hidráulica','Paver — Hydraulic Line','Pavimentadora — Línea Hidráulica'),
      url: 'pavimentadora.html',
      image: IMG_PAVER_LARGE_CRONUS,
      manualUrl: null,
      profile_types: ['pavimento-concreto', 'barreira-new-jersey'],
      specs: {
        tipo: TIPO_PAVER,
        linha: LINHA_HIDR,
        aplicacoes:        L('Calçadas, canaletas em geral, cocho para confinamento, barreira tipo New Jersey simples ou dupla e pavimento de concreto','Sidewalks, general channels, feed troughs, single or double New Jersey barriers and concrete pavement','Veredas, canaletas en general, comederos, barrera tipo New Jersey simple o doble y pavimento de concreto'),
        motor_hp: 142,     motor_tipo: L('Diesel — Perkins 1104D','Diesel — Perkins 1104D','Diésel — Perkins 1104D'),
        tracao:            L('Hidráulica integral 4WD em esteiras de aço','Full hydraulic 4WD on steel tracks','Hidráulica integral 4WD en orugas de acero'),
        vibradores: 12,    vibradores_label: vibradores(12),
        largura_perfil: 5000, largura_perfil_label: perfilOffsetInset('2.750 mm', '5.000 mm'),
        altura_perfil: 350,
        peso: 16800, comprimento: 9600, largura: 2350, altura: 2800,
        tanque_combust: 220, tanque_hidr: 480, tanque_agua: 1700,
        sensor_altura: SIM, sensor_direcao: SIM, sensor_inclinacao: SIM,
        monitoramento_3d: OPC, inset_offset: OPC, esteiras_aco: SIM,
        desloc_lateral: SIM, rosca_sem_fim: OPC, revest_esteiras: OPC,
        produtividade: L('2 m/min','2 m/min','2 m/min'),
      },
    },

    // ===== LINHA AUTOMATIZADA (ficha da linha mecânica) =====
    {
      id: 'imb-500hd',
      name: 'IMB 500HD',
      subtitle: L('Extrusora — Linha Automatizada','Extruder — Automated Line','Extrusora — Línea Automatizada'),
      url: 'extrusora.html',
      image: IMG_EXTRUDER_500HD,
      manualUrl: 'manuals/manual-imb-500hd.pdf',
      profile_types: ['meio-fio', 'guia-sarjeta', 'calcada'],
      specs: {
        tipo: TIPO_EXTRUSOR,
        linha:             L('Automatizada','Automated','Automatizada'),
        aplicacoes:        L('Meio-fio, guia e sarjeta e calçada','Curbs, curb & gutter and sidewalks','Cordones, guías y cunetas, y veredas'),
        motor_hp: 14,      motor_tipo: 'Diesel',
        redutor: '1:40',
        transmissao: CORREIA_TRIPLA,
        partida: PARTIDA_ELET_RET,
        largura_perfil: 1500, altura_perfil: 450,
        peso: 800, comprimento: 3050, largura: 720, altura: 840,
        tanque_combust: 5.5, tanque_hidr: 10,
        horimetro: SIM, suspensao: AUTOM, direcao: AUTOM, embreagem_radial: NAO,
        sensor_altura: SIM, sensor_direcao: SIM, sensor_inclinacao: SIM,
        produtividade: L('2,5 a 3,5 m/min, variável conforme perfil','2.5 to 3.5 m/min, varies by profile','2,5 a 3,5 m/min, variable según perfil'),
      },
    },

    // ===== LINHA MECÂNICA — LINHA LEVE =====
    // IMB 300 BANTAM retirado do catálogo (checklist 21/07 — AJUSTES SITE item 2.1).
    {
      id: 'imb-400-economic',
      name: 'IMB 400 ECONOMIC',
      subtitle: L('Extrusora — Linha Leve','Extruder — Light Line','Extrusora — Línea Liviana'),
      url: 'extrusora.html',
      image: IMG_EXTRUDER_400_ECON,
      manualUrl: 'manuals/manual-imb-400-economic.pdf',
      profile_types: ['meio-fio', 'guia-sarjeta'],
      specs: {
        tipo: TIPO_EXTRUSOR,
        linha:             L('Leve','Light','Liviana'),
        aplicacoes:        L('Meio-fio, guia e sarjeta','Curbs and curb & gutter','Cordones, guías y cunetas'),
        motor_hp: 7,       motor_tipo: 'Diesel',
        redutor: '1:40',
        transmissao: CORREIA_DUPLA,
        partida: PARTIDA_ELET_RET,
        largura_perfil: 450, altura_perfil: 300,
        peso: 410, comprimento: 2520, largura: 600, altura: 980,
        tanque_combust: 3.5, tanque_hidr: null,
        horimetro: NAO, suspensao: MANUAL, direcao: MANUAL, embreagem_radial: NAO,
        sensor_altura: NAO, sensor_direcao: NAO, sensor_inclinacao: NAO,
        produtividade: L('até 2 m/min','up to 2 m/min','hasta 2 m/min'),
      },
    },

    // ===== LINHA MECÂNICA — LINHA MÉDIA =====
    {
      id: 'imb-700-compact',
      name: 'IMB 700 COMPACT',
      subtitle: L('Extrusora — Linha Média','Extruder — Medium Line','Extrusora — Línea Media'),
      url: 'extrusora.html',
      image: IMG_EXTRUDER_700_COMPACT,
      manualUrl: 'manuals/manual-imb-700-800-compact-900g-master.pdf',
      profile_types: ['meio-fio', 'guia-sarjeta', 'calcada'],
      specs: {
        tipo: TIPO_EXTRUSOR,
        linha:             L('Média','Medium','Media'),
        aplicacoes:        L('Meio-fio, guia e sarjeta e calçada','Curbs, curb & gutter and sidewalks','Cordones, guías y cunetas, y veredas'),
        motor_hp: 13,      motor_tipo: 'Diesel',
        redutor: '1:40',
        transmissao: CORREIA_DUPLA,
        partida: PARTIDA_ELET_RET,
        largura_perfil: 1200, altura_perfil: 450,
        peso: 580, comprimento: 2930, largura: 720, altura: 980,
        tanque_combust: 5.5, tanque_hidr: null,
        horimetro: NAO, suspensao: MANUAL, direcao: MANUAL, embreagem_radial: NAO,
        sensor_altura: NAO, sensor_direcao: NAO, sensor_inclinacao: NAO,
        produtividade: L('2 a 3 m/min, variável conforme perfil','2 to 3 m/min, varies by profile','2 a 3 m/min, variable según perfil'),
      },
    },
    {
      id: 'imb-800-compact',
      name: 'IMB 800 COMPACT',
      subtitle: L('Extrusora — Linha Média','Extruder — Medium Line','Extrusora — Línea Media'),
      url: 'extrusora.html',
      image: IMG_EXTRUDER_800_COMPACT,
      manualUrl: 'manuals/manual-imb-700-800-compact-900g-master.pdf',
      profile_types: ['meio-fio', 'guia-sarjeta', 'calcada'],
      specs: {
        tipo: TIPO_EXTRUSOR,
        linha:             L('Média','Medium','Media'),
        aplicacoes:        L('Meio-fio, guia e sarjeta e calçadas','Curbs, curb & gutter and sidewalks','Cordones, guías y cunetas, y veredas'),
        motor_hp: 15,      motor_tipo: 'Diesel',
        redutor: '1:40',
        transmissao: CORRENTE_DUPLA,
        partida: PARTIDA_ELET,
        largura_perfil: 1500, altura_perfil: 450,
        peso: 600, comprimento: 2900, largura: 720, altura: 1030,
        tanque_combust: 5.5, tanque_hidr: null,
        horimetro: SIM, suspensao: MANUAL, direcao: MANUAL, embreagem_radial: OPC,
        sensor_altura: NAO, sensor_direcao: NAO, sensor_inclinacao: NAO,
        produtividade: L('2 a 3 m/min, variável conforme perfil','2 to 3 m/min, varies by profile','2 a 3 m/min, variable según perfil'),
      },
    },

    // ===== LINHA MECÂNICA — LINHA PESADA =====
    {
      id: 'imb-900g-master',
      name: 'IMB 900G MASTER',
      subtitle: L('Extrusora — Linha Pesada','Extruder — Heavy Line','Extrusora — Línea Pesada'),
      url: 'extrusora.html',
      image: IMG_EXTRUDER_900_MASTER,
      manualUrl: 'manuals/manual-imb-700-800-compact-900g-master.pdf',
      profile_types: ['meio-fio', 'guia-sarjeta', 'calcada', 'barreira-new-jersey'],
      specs: {
        tipo: TIPO_EXTRUSOR,
        linha:             L('Pesada','Heavy','Pesada'),
        aplicacoes:        L('Meio-fio, guia e sarjeta, calçadas e canaletas U','Curbs, curb & gutter, sidewalks and U-channels','Cordones, guías y cunetas, veredas y canaletas U'),
        motor_hp: 14,      motor_tipo: 'Diesel',
        redutor: '1:40',
        transmissao: CORRENTE_DUPLA,
        partida: PARTIDA_ELET,
        largura_perfil: 1500, altura_perfil: 450,
        peso: 710, comprimento: 3000, largura: 720, altura: 1030,
        tanque_combust: 12.5, tanque_hidr: null,
        horimetro: SIM, suspensao: MANUAL, direcao: MANUAL, embreagem_radial: NAO,
        sensor_altura: NAO, sensor_direcao: NAO, sensor_inclinacao: NAO,
        produtividade: L('2 a 3 m/min, variável conforme perfil','2 to 3 m/min, varies by profile','2 a 3 m/min, variable según perfil'),
      },
    },
    {
      id: 'imb-900g-master-embreagem',
      name: 'IMB 900G MASTER C/ Embreagem',
      subtitle: L('Extrusora — Linha Pesada','Extruder — Heavy Line','Extrusora — Línea Pesada'),
      url: 'extrusora.html',
      image: IMG_EXTRUDER_900_EMB,
      manualUrl: 'manuals/manual-imb-700-800-compact-900g-master.pdf',
      profile_types: ['meio-fio', 'guia-sarjeta', 'calcada', 'barreira-new-jersey'],
      specs: {
        tipo: TIPO_EXTRUSOR,
        linha:             L('Pesada','Heavy','Pesada'),
        aplicacoes:        L('Meio-fio, guia e sarjeta, calçadas e canaletas U','Curbs, curb & gutter, sidewalks and U-channels','Cordones, guías y cunetas, veredas y canaletas U'),
        motor_hp: 14,      motor_tipo: 'Diesel',
        redutor: '1:40',
        transmissao: CORRENTE_DUPLA,
        partida: PARTIDA_ELET,
        largura_perfil: 1500, altura_perfil: 450,
        peso: 800, comprimento: 3280, largura: 720, altura: 1030,
        tanque_combust: 12.5, tanque_hidr: null,
        horimetro: SIM, suspensao: MANUAL, direcao: MANUAL, embreagem_radial: SIM,
        sensor_altura: NAO, sensor_direcao: NAO, sensor_inclinacao: NAO,
        produtividade: L('2 a 3 m/min, variável conforme perfil','2 to 3 m/min, varies by profile','2 a 3 m/min, variable según perfil'),
      },
    },

    // ===== LINHA MECÂNICA — LINHA ESPECIAL =====
    {
      id: 'imb-900g-stc',
      name: 'IMB 900G STC',
      subtitle: L('Extrusora — Linha Especial (drenagem)','Extruder — Special Line (drainage)','Extrusora — Línea Especial (drenaje)'),
      url: 'extrusora.html',
      image: IMG_EXTRUDER_900_STC,
      manualUrl: 'manuals/manual-imb-900g-stc.pdf',
      profile_types: ['canaleta-drenagem'],
      specs: {
        tipo: TIPO_EXTRUSOR,
        linha:             L('Especial','Special','Especial'),
        aplicacoes:        L('Canaletas de drenagem tipo STC, SCC, SZC, VPA e VPC, entre outros','STC, SCC, SZC, VPA and VPC drainage channels, among others','Canaletas de drenaje tipo STC, SCC, SZC, VPA y VPC, entre otros'),
        motor_hp: 14,      motor_tipo: 'Diesel',
        redutor: '1:40',
        transmissao: CORRENTE_DUPLA,
        partida: PARTIDA_ELET,
        largura_perfil: 1800, altura_perfil: 600,
        peso: 1000, comprimento: 3080, largura: 870, altura: 1030,
        tanque_combust: 12.5, tanque_hidr: null,
        horimetro: SIM, suspensao: MANUAL, direcao: MANUAL, embreagem_radial: SIM,
        sensor_altura: NAO, sensor_direcao: NAO, sensor_inclinacao: NAO,
        produtividade: L('até 1,5 m/min, variável conforme perfil','up to 1.5 m/min, varies by profile','hasta 1,5 m/min, variable según perfil'),
      },
    },
  ];

  return { groups, fields, products, isYes, isNo, isOptional };
})();
