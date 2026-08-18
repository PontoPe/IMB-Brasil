// IMB cases — fonte única de verdade.
// Translatable fields use {pt, en, es} objects. Use IMB_I18N.pickLang(obj) at render time.
//
// NOTE(conteúdo): textos, números e depoimentos oficiais entregues pela IMB em
// "AJUSTES SITE" (28/07/2026). Não inventar métricas: só entra aqui o que está no documento.
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
  var IMG_7 = assetPrefix + 'images/casees/ferrovia-mato-grosso.jpg';
  var IMG_8 = assetPrefix + 'images/casees/br-101-alagoas.jpg';

  // Galeria por obra — vira carrossel automático na página do case.
  // Convenção: a foto PRINCIPAL fica em hero_image (é a do card e a do topo da
  // página); as demais entram em `gallery` e passam sozinhas. Para adicionar,
  // solte os arquivos em site/images/casees/<id-da-obra>/ e liste os nomes aqui.
  // Galeria vazia = a seção simplesmente não aparece.
  function gal(slug, files) {
    return files.map(function (f) { return assetPrefix + 'images/casees/' + slug + '/' + f; });
  }

  // Equipamentos reais (ids batem com IMB_PRODUCTS).
  var EQ_700C   = { id: 'imb-700-compact',   name: L('Extrusora IMB 700 Compact', 'IMB 700 Compact Extruder', 'Extrusora IMB 700 Compact') };
  var EQ_3500HD = { id: 'imb-3500hd',        name: L('Pavimentadora IMB 3500HD','IMB 3500HD Paver', 'Pavimentadora IMB 3500HD') };
  var EQ_CRONUS = { id: 'imb-5500hd-cronus', name: L('Pavimentadora IMB 5500HD Cronus','IMB 5500HD Cronus Paver','Pavimentadora IMB 5500HD Cronus') };
  var EQ_TITAN  = { id: 'imb-5500hd-titan',  name: L('Pavimentadora IMB 5500HD Titan', 'IMB 5500HD Titan Paver', 'Pavimentadora IMB 5500HD Titan') };

  var EM_ANDAMENTO = L('Em andamento', 'In progress', 'En ejecución');

  var UN_M   = L('m lineares', 'linear m', 'm lineales');
  var UN_M2  = L('m²', 'm²', 'm²');
  var UN_M3  = L('m³', 'm³', 'm³');
  var UN_MH  = L('m/h', 'm/h', 'm/h');
  var UN_MMIN= L('m/min', 'm/min', 'm/min');
  var UN_MM  = L('mm', 'mm', 'mm');
  var UN_M_S = L('m', 'm', 'm');

  // Rótulos curtos: usados só nos chips do card de case (a página do case continua
  // mostrando o label completo). Sem isso o chip vira uma frase inteira e estoura no mobile.
  var SL_EXT       = L('Extensão', 'Length', 'Extensión');
  var SL_PROD      = L('Produtividade', 'Output', 'Productividad');
  var SL_LARG      = L('Largura', 'Width', 'Ancho');
  var SL_LARG_TOT  = L('Largura total', 'Total width', 'Ancho total');
  var SL_ESP       = L('Espessura', 'Thickness', 'Espesor');
  var SL_AREA      = L('Área', 'Area', 'Área');
  var SL_CONC      = L('Concreto', 'Concrete', 'Concreto');
  var SL_TUN       = L('Túneis', 'Tunnels', 'Túneles');
  var SL_DREN      = L('Drenagem', 'Drainage', 'Drenaje');
  var SL_REC       = L('Recorde diário', 'Daily record', 'Récord diario');

  var LOC_LINHA_VERDE  = L('Curitiba, PR — Brasil', 'Curitiba, PR — Brazil', 'Curitiba, PR — Brasil');
  var LOC_RODOANEL     = L('Guarulhos, SP — Brasil', 'Guarulhos, SP — Brazil', 'Guarulhos, SP — Brasil');
  var LOC_PALOTINA     = L('Palotina, PR — Brasil', 'Palotina, PR — Brazil', 'Palotina, PR — Brasil');
  var LOC_GUARATUBA    = L('Guaratuba / Matinhos, PR — Brasil', 'Guaratuba / Matinhos, PR — Brazil', 'Guaratuba / Matinhos, PR — Brasil');
  var LOC_MAJOR_VIEIRA = L('Major Vieira, SC — Brasil', 'Major Vieira, SC — Brazil', 'Major Vieira, SC — Brasil');
  var LOC_LAGES        = L('Lages, SC — Brasil', 'Lages, SC — Brazil', 'Lages, SC — Brasil');
  var LOC_FERROVIA_MT  = L('Mato Grosso — Brasil', 'Mato Grosso — Brazil', 'Mato Grosso — Brasil');
  var LOC_ALAGOAS      = L('Alagoas — Brasil', 'Alagoas — Brazil', 'Alagoas — Brasil');

  const cases = [
    {
      id: 'ponte-guaratuba',
      title: L('Ponte de Guaratuba', 'Guaratuba Bridge', 'Puente de Guaratuba'),
      subtitle: L('Barreiras New Jersey com IMB 3500HD', 'New Jersey barriers with IMB 3500HD', 'Barreras New Jersey con IMB 3500HD'),
      location: LOC_GUARATUBA,
      region: L('Sul', 'South', 'Sur'),
      status: null,
      featured: true,
      client: '',
      hero_image: IMG_1,
      gallery: gal('ponte-guaratuba', ['01.jpg', '02.jpg', '03.jpg', '04.jpg', '05.jpg', '06.jpg', '07.jpg', '08.jpg']),
      video: 'k9QqYW0zS7M',
      summary: L(
        'Execução de barreiras divisórias de pista tipo New Jersey simples, com ferragem armada, em uma das obras mais aguardadas do litoral paranaense.',
        'Construction of single New Jersey median barriers with reinforcing steel on one of the most anticipated projects on the Paraná coast.',
        'Ejecución de barreras divisorias de calzada tipo New Jersey simple, con armadura, en una de las obras más esperadas del litoral paranaense.'
      ),
      story: [
        L(
          'Execução de Barreiras New Jersey Simples com ferragem armada na Ponte de Guaratuba, uma das obras mais aguardadas no litoral paranaense.',
          'Construction of single New Jersey barriers with reinforcing steel on the Guaratuba Bridge, one of the most anticipated projects on the Paraná coast.',
          'Ejecución de Barreras New Jersey Simples con armadura en el Puente de Guaratuba, una de las obras más esperadas del litoral paranaense.'
        ),
        L(
          'A IMB 3500HD proporcionou uma produtividade média de 60 metros lineares por hora.',
          'The IMB 3500HD delivered an average output of 60 linear metres per hour.',
          'La IMB 3500HD proporcionó una productividad media de 60 metros lineales por hora.'
        ),
      ],
      metrics: [
        { icon: 'security', value: '2.900', unit: UN_M,  short_label: SL_EXT, label: L('Barreiras New Jersey Simples executadas', 'Single New Jersey barriers built', 'Barreras New Jersey Simples ejecutadas') },
        { icon: 'speed',    value: '60',    unit: UN_MH, short_label: SL_PROD, label: L('Produtividade média', 'Average output', 'Productividad media') },
      ],
      card_tags: [L('Ferragem armada', 'Reinforced steel', 'Armadura')],
      equipment: [EQ_3500HD],
      testimonial: null,
    },
    {
      id: 'linha-verde',
      title: L('Linha Verde de Curitiba', 'Curitiba Green Line', 'Línea Verde de Curitiba'),
      subtitle: L('Meio-fio e sarjeta com IMB 700 Compact', 'Curb and gutter with IMB 700 Compact', 'Cordón y cuneta con IMB 700 Compact'),
      location: LOC_LINHA_VERDE,
      region: L('Sul', 'South', 'Sur'),
      status: null,
      featured: true,
      client: '',
      hero_image: IMG_2,
      gallery: gal('linha-verde', ['01.jpg', '02.jpg', '03.jpg', '04.jpg', '05.jpg', '06.jpg', '07.jpg', '08.jpg']),
      summary: L(
        'Execução de meio-fio e de guia e sarjeta no complexo da Linha Verde, a maior obra viária de Curitiba.',
        'Curb and curb & gutter construction across the Green Line complex, Curitiba’s largest road project.',
        'Ejecución de cordón y de guía y cuneta en el complejo de la Línea Verde, la mayor obra vial de Curitiba.'
      ),
      story: [
        L(
          'Execução de meio-fio e de guia e sarjeta no complexo da Linha Verde, em Curitiba/PR.',
          'Curb and curb & gutter construction across the Green Line complex in Curitiba, Paraná.',
          'Ejecución de cordón y de guía y cuneta en el complejo de la Línea Verde, en Curitiba/PR.'
        ),
        L(
          'Conhecida como a maior obra viária de Curitiba, foram executados mais de 40.000 metros entre o eixo urbano e bairros da região.',
          'Known as Curitiba’s largest road project, more than 40,000 metres were built across the urban axis and surrounding districts.',
          'Conocida como la mayor obra vial de Curitiba, se ejecutaron más de 40.000 metros entre el eje urbano y los barrios de la región.'
        ),
      ],
      metrics: [
        { icon: 'route', value: '+40.000', unit: UN_M, short_label: SL_EXT, label: L('Meio-fio e guia e sarjeta executados', 'Curb and curb & gutter built', 'Cordón y guía y cuneta ejecutados') },
      ],
      equipment: [EQ_700C],
      testimonial: null,
    },
    {
      id: 'rodoanel',
      title: L('Túneis do Rodoanel Mário Covas', 'Mário Covas Beltway Tunnels', 'Túneles del Anillo Vial Mário Covas'),
      subtitle: L('Pavimento de concreto com IMB 5500HD Cronus', 'Concrete pavement with IMB 5500HD Cronus', 'Pavimento de concreto con IMB 5500HD Cronus'),
      location: LOC_RODOANEL,
      region: L('Sudeste', 'Southeast', 'Sudeste'),
      status: null,
      featured: true,
      client: '',
      hero_image: IMG_3,
      gallery: gal('rodoanel', ['01.jpg', '02.jpg', '03.jpg', '04.jpg', '05.jpg', '06.jpg', '07.jpg', '08.jpg', '09.jpg', '10.jpg']),
      video: 'qDNPor8lTic',
      summary: L(
        'Pavimento de concreto com 14,40 metros de largura total, em passadas de 3,60 metros e espessura mínima de 25 centímetros, incluindo três faixas de rolagem e acostamento.',
        'Concrete pavement 14.40 metres wide in total, laid in 3.60-metre passes with a minimum thickness of 25 centimetres, covering three traffic lanes plus the shoulder.',
        'Pavimento de concreto con 14,40 metros de ancho total, en pasadas de 3,60 metros y espesor mínimo de 25 centímetros, incluyendo tres carriles de circulación y banquina.'
      ),
      story: [
        L(
          'Considerada uma das maiores e mais complexas obras de engenharia da América Latina, a IMB esteve presente na execução dos pavimentos dos túneis do Rodoanel.',
          'Considered one of the largest and most complex engineering projects in Latin America, IMB took part in paving the Rodoanel tunnels.',
          'Considerada una de las mayores y más complejas obras de ingeniería de América Latina, IMB estuvo presente en la ejecución de los pavimentos de los túneles del Rodoanel.'
        ),
        L(
          'A execução proporcionou mais segurança e durabilidade para o tráfego rodoviário.',
          'The work delivered greater safety and durability for road traffic.',
          'La ejecución proporcionó más seguridad y durabilidad para el tráfico vial.'
        ),
      ],
      metrics: [
        { icon: 'package_2', value: '10.000', unit: UN_M3, short_label: SL_CONC, label: L('Concreto consumido', 'Concrete poured', 'Concreto consumido') },
        { icon: 'route',     value: '3.000',  unit: UN_M,  short_label: SL_TUN, label: L('Túneis pavimentados', 'Tunnels paved', 'Túneles pavimentados') },
        { icon: 'straighten',value: '14,40',  unit: UN_M_S,short_label: SL_LARG_TOT, label: L('Largura total do pavimento', 'Total pavement width', 'Ancho total del pavimento') },
        { icon: 'layers',    value: '0,25',   unit: UN_M_S,short_label: SL_ESP, label: L('Espessura mínima', 'Minimum thickness', 'Espesor mínimo') },
      ],
      equipment: [EQ_CRONUS],
      testimonial: null,
    },
    {
      id: 'palotina',
      title: L('Barreiras no Contorno da Rodovia PR-182', 'Barriers on the PR-182 Bypass', 'Barreras en la Circunvalación de la PR-182'),
      subtitle: L('Barreiras New Jersey Duplas com IMB 5500HD Cronus', 'Double New Jersey barriers with IMB 5500HD Cronus', 'Barreras New Jersey Dobles con IMB 5500HD Cronus'),
      location: LOC_PALOTINA,
      region: L('Sul', 'South', 'Sur'),
      status: null,
      featured: false,
      client: '',
      hero_image: IMG_4,
      gallery: gal('palotina', ['01.jpg', '02.jpg', '03.jpg', '04.jpg', '05.jpg', '06.jpg', '07.jpg', '08.jpg']),
      video: 'x4bnRptPIME',
      summary: L(
        'Execução de barreiras divisórias de pista tipo New Jersey dupla no contorno viário de Palotina, uma das obras de infraestrutura logística mais estratégicas do Oeste do Paraná.',
        'Double New Jersey median barriers on the Palotina bypass, one of the most strategic logistics infrastructure projects in western Paraná.',
        'Ejecución de barreras divisorias de calzada tipo New Jersey doble en la circunvalación de Palotina, una de las obras de infraestructura logística más estratégicas del Oeste de Paraná.'
      ),
      story: [
        L(
          'O Contorno Viário de Palotina é uma das obras de infraestrutura logística mais estratégicas do Oeste do Paraná. Planejado para ligar trechos das rodovias PR-182 e PR-364 por fora da malha urbana, o empreendimento nasceu para resolver um dos gargalos de tráfego mais intensos causados pelo agronegócio na região.',
          'The Palotina bypass is one of the most strategic logistics infrastructure projects in western Paraná. Designed to connect stretches of the PR-182 and PR-364 highways outside the urban grid, it was conceived to relieve one of the region’s heaviest agribusiness traffic bottlenecks.',
          'La Circunvalación de Palotina es una de las obras de infraestructura logística más estratégicas del Oeste de Paraná. Planificada para unir tramos de las rutas PR-182 y PR-364 por fuera de la malla urbana, nació para resolver uno de los cuellos de botella de tráfico más intensos causados por el agronegocio en la región.'
        ),
        L(
          'Foram executados mais de 2.000 metros lineares de Barreira New Jersey com a Pavimentadora de Concreto IMB 5500HD Cronus.',
          'More than 2,000 linear metres of New Jersey barrier were built with the IMB 5500HD Cronus concrete paver.',
          'Se ejecutaron más de 2.000 metros lineales de Barrera New Jersey con la Pavimentadora de Concreto IMB 5500HD Cronus.'
        ),
      ],
      metrics: [
        { icon: 'security', value: '+2.370', unit: UN_M, short_label: SL_EXT, label: L('Barreiras New Jersey Duplas executadas', 'Double New Jersey barriers built', 'Barreras New Jersey Dobles ejecutadas') },
      ],
      equipment: [EQ_CRONUS],
      testimonial: null,
    },
    {
      id: 'major-vieira',
      title: L('Bordo do Acostamento em Major Vieira', 'Shoulder Edge in Major Vieira', 'Borde de Banquina en Major Vieira'),
      subtitle: L('Bordo de acostamento com IMB 5500HD Titan', 'Shoulder edge with IMB 5500HD Titan', 'Borde de banquina con IMB 5500HD Titan'),
      location: LOC_MAJOR_VIEIRA,
      region: L('Sul', 'South', 'Sur'),
      status: null,
      featured: false,
      client: '',
      hero_image: IMG_5,
      gallery: gal('major-vieira', ['01.jpg', '02.jpg', '03.jpg', '04.jpg', '05.jpg', '06.jpg']),
      video: 'zSISqKmgzHw',
      summary: L(
        'Execução de bordo de acostamento na rodovia SC-477, com 90 centímetros de largura e 22 centímetros de espessura.',
        'Shoulder edge construction on the SC-477 highway, 90 centimetres wide and 22 centimetres thick.',
        'Ejecución de borde de banquina en la ruta SC-477, con 90 centímetros de ancho y 22 centímetros de espesor.'
      ),
      story: [
        L(
          'Realizada no estado de Santa Catarina, no Brasil, na rodovia SC-477, a IMB 5500HD Titan executou 72.000 m² de bordo de acostamento, com uma largura de 90 centímetros e espessura de 22 centímetros.',
          'Carried out in the state of Santa Catarina, Brazil, on the SC-477 highway, the IMB 5500HD Titan built 72,000 m² of shoulder edge, 90 centimetres wide and 22 centimetres thick.',
          'Realizada en el estado de Santa Catarina, Brasil, en la ruta SC-477, la IMB 5500HD Titan ejecutó 72.000 m² de borde de banquina, con 90 centímetros de ancho y 22 centímetros de espesor.'
        ),
      ],
      metrics: [
        { icon: 'route',      value: '80.000', unit: UN_M,  short_label: SL_EXT, label: L('Bordo de acostamento executado', 'Shoulder edge built', 'Borde de banquina ejecutado') },
        { icon: 'grid_on',    value: '72.000', unit: UN_M2, short_label: SL_AREA, label: L('Área executada', 'Area built', 'Área ejecutada') },
        { icon: 'straighten', value: '0,90',   unit: UN_M_S, short_label: SL_LARG, label: L('Largura do perfil', 'Profile width', 'Ancho del perfil') },
        { icon: 'layers',     value: '0,22',   unit: UN_M_S, short_label: SL_ESP, label: L('Espessura', 'Thickness', 'Espesor') },
      ],
      equipment: [EQ_TITAN],
      testimonial: null,
    },
    {
      id: 'lages',
      title: L('Barreiras New Jersey na BR-116 — Régis Bittencourt', 'New Jersey Barriers on BR-116 — Régis Bittencourt', 'Barreras New Jersey en la BR-116 — Régis Bittencourt'),
      subtitle: L('Barreiras New Jersey Duplas com IMB 5500HD Cronus', 'Double New Jersey barriers with IMB 5500HD Cronus', 'Barreras New Jersey Dobles con IMB 5500HD Cronus'),
      location: LOC_LAGES,
      region: L('Sul', 'South', 'Sur'),
      status: null,
      featured: false,
      client: '',
      hero_image: IMG_6,
      gallery: gal('lages', ['01.jpg', '02.jpg', '03.jpg', '04.jpg', '05.jpg', '06.jpg']),
      summary: L(
        'Execução de barreiras New Jersey duplas com concreto armado na BR-116, no trecho que liga Lages/SC ao Rio Grande do Sul.',
        'Double New Jersey barriers in reinforced concrete on the BR-116, on the stretch linking Lages, SC to Rio Grande do Sul.',
        'Ejecución de barreras New Jersey dobles con concreto armado en la BR-116, en el tramo que une Lages/SC con Rio Grande do Sul.'
      ),
      story: [
        L(
          'Execução de Barreiras New Jersey Duplas com concreto armado na Rodovia BR-116 — Régis Bittencourt, no trecho que liga a cidade de Lages/SC ao estado do Rio Grande do Sul, proporcionando maior segurança ao tráfego rodoviário.',
          'Construction of double New Jersey barriers in reinforced concrete on the BR-116 — Régis Bittencourt highway, on the stretch linking Lages, SC to the state of Rio Grande do Sul, delivering greater safety for road traffic.',
          'Ejecución de Barreras New Jersey Dobles con concreto armado en la Ruta BR-116 — Régis Bittencourt, en el tramo que une la ciudad de Lages/SC con el estado de Rio Grande do Sul, brindando mayor seguridad al tráfico vial.'
        ),
        L(
          'A IMB 5500HD Cronus proporcionou produtividade, qualidade e eficiência na execução do projeto.',
          'The IMB 5500HD Cronus delivered output, quality and efficiency throughout the project.',
          'La IMB 5500HD Cronus proporcionó productividad, calidad y eficiencia en la ejecución del proyecto.'
        ),
      ],
      metrics: [
        { icon: 'security', value: '+2.500', unit: UN_M, short_label: SL_EXT, label: L('Barreiras New Jersey Duplas executadas', 'Double New Jersey barriers built', 'Barreras New Jersey Dobles ejecutadas') },
      ],
      equipment: [EQ_CRONUS],
      testimonial: null,
    },
    {
      id: 'ferrovia-mato-grosso',
      title: L('Canaletas de Drenagem na Ferrovia de Mato Grosso', 'Drainage Channels on the Mato Grosso Railway', 'Canaletas de Drenaje en el Ferrocarril de Mato Grosso'),
      subtitle: L('Drenagem com IMB 5500HD Cronus e IMB 3500HD', 'Drainage with IMB 5500HD Cronus and IMB 3500HD', 'Drenaje con IMB 5500HD Cronus e IMB 3500HD'),
      location: LOC_FERROVIA_MT,
      region: L('Centro-Oeste', 'Central-West', 'Centro-Oeste'),
      status: null,
      featured: true,
      client: '',
      hero_image: IMG_7,
      gallery: gal('ferrovia-mato-grosso', ['01.jpg', '02.jpg', '03.jpg', '04.jpg', '05.jpg', '06.jpg', '07.jpg', '08.jpg']),
      video: 'z7Y5mJWOsxc',
      summary: L(
        'Execução de canaletas de drenagem de até 1.600 mm de largura no projeto ferroviário mais ambicioso em execução no Brasil.',
        'Drainage channels up to 1,600 mm wide on the most ambitious railway project underway in Brazil.',
        'Ejecución de canaletas de drenaje de hasta 1.600 mm de ancho en el proyecto ferroviario más ambicioso en ejecución en Brasil.'
      ),
      story: [
        L(
          'A Ferrovia Estadual de Mato Grosso é atualmente o projeto ferroviário mais ambicioso e estratégico em execução no Brasil. O empreendimento está criando um gigantesco corredor de exportação para interligar o coração do agronegócio mato-grossense ao Porto de Santos.',
          'The Mato Grosso State Railway is currently the most ambitious and strategic railway project underway in Brazil. It is creating a vast export corridor linking the heart of Mato Grosso agribusiness to the Port of Santos.',
          'El Ferrocarril Estatal de Mato Grosso es actualmente el proyecto ferroviario más ambicioso y estratégico en ejecución en Brasil. La obra está creando un gigantesco corredor de exportación para conectar el corazón del agronegocio matogrossense con el Puerto de Santos.'
        ),
        L(
          'Para execução do projeto foram utilizadas duas Pavimentadoras de Concreto IMB, que entregaram uma produtividade média de 6,0 metros lineares por minuto e atingiram um marco de produção de 1.200 metros lineares em um único dia.',
          'Two IMB concrete pavers were used on the project, delivering an average output of 6.0 linear metres per minute and reaching a production milestone of 1,200 linear metres in a single day.',
          'Para la ejecución del proyecto se utilizaron dos Pavimentadoras de Concreto IMB, que entregaron una productividad media de 6,0 metros lineales por minuto y alcanzaron un hito de producción de 1.200 metros lineales en un solo día.'
        ),
      ],
      metrics: [
        { icon: 'water_drop', value: '+17.000', unit: UN_M,   short_label: SL_DREN, label: L('Drenagem executada', 'Drainage built', 'Drenaje ejecutado') },
        { icon: 'straighten', value: '1.600',   unit: UN_MM,  short_label: SL_LARG, label: L('Largura máxima da canaleta', 'Maximum channel width', 'Ancho máximo de la canaleta') },
        { icon: 'speed',      value: '6,0',     unit: UN_MMIN,short_label: SL_PROD, label: L('Produtividade média', 'Average output', 'Productividad media') },
        { icon: 'trending_up',value: '1.200',   unit: UN_M,   short_label: SL_REC, label: L('Recorde em um único dia', 'Record in a single day', 'Récord en un solo día') },
      ],
      equipment: [EQ_CRONUS, EQ_3500HD],
      testimonial: null,
    },
    {
      id: 'br-101-alagoas',
      title: L('Duplicação da BR-101 em Alagoas', 'BR-101 Duplication in Alagoas', 'Duplicación de la BR-101 en Alagoas'),
      subtitle: L('Pavimento de concreto com IMB 5500HD Cronus', 'Concrete pavement with IMB 5500HD Cronus', 'Pavimento de concreto con IMB 5500HD Cronus'),
      location: LOC_ALAGOAS,
      region: L('Nordeste', 'Northeast', 'Nordeste'),
      status: EM_ANDAMENTO,
      featured: false,
      client: '',
      hero_image: IMG_8,
      gallery: gal('br-101-alagoas', ['01.jpg', '02.jpg', '03.jpg', '04.jpg', '05.jpg', '06.jpg', '07.jpg', '08.jpg', '09.jpg']),
      video: '2kxTaPZRqs4',
      summary: L(
        'Execução de pavimento de concreto com 10,40 metros de largura total em um dos projetos viários mais marcantes do Nordeste.',
        'Concrete pavement 10.40 metres wide in total on one of the most significant road projects in Brazil’s Northeast.',
        'Ejecución de pavimento de concreto con 10,40 metros de ancho total en uno de los proyectos viales más destacados del Nordeste.'
      ),
      story: [
        L(
          'A duplicação da BR-101 no trecho sul de Alagoas é um dos projetos viários mais marcantes do Nordeste, pois serve de principal artéria para quem segue rumo a Arapiraca, o segundo maior polo econômico e populacional de Alagoas.',
          'The duplication of the BR-101 in southern Alagoas is one of the most significant road projects in the Northeast, serving as the main artery towards Arapiraca, the second largest economic and population hub in Alagoas.',
          'La duplicación de la BR-101 en el tramo sur de Alagoas es uno de los proyectos viales más destacados del Nordeste, ya que es la principal arteria hacia Arapiraca, el segundo mayor polo económico y poblacional de Alagoas.'
        ),
        L(
          'Nesse projeto, a IMB 5500HD Cronus executou passadas de 3,60 metros de largura e 25 centímetros de espessura, garantindo alta durabilidade do pavimento e resistência ao calor e ao peso do tráfego rodoviário da região.',
          'On this project the IMB 5500HD Cronus laid 3.60-metre-wide passes at 25 centimetres thick, ensuring high pavement durability and resistance to the heat and traffic loads of the region.',
          'En este proyecto, la IMB 5500HD Cronus ejecutó pasadas de 3,60 metros de ancho y 25 centímetros de espesor, garantizando alta durabilidad del pavimento y resistencia al calor y al peso del tráfico vial de la región.'
        ),
      ],
      metrics: [
        { icon: 'straighten', value: '10,40', unit: UN_M_S, short_label: SL_LARG_TOT, label: L('Largura total do pavimento', 'Total pavement width', 'Ancho total del pavimento') },
        { icon: 'layers',     value: '0,25',  unit: UN_M_S, short_label: SL_ESP, label: L('Espessura', 'Thickness', 'Espesor') },
      ],
      equipment: [EQ_CRONUS],
      testimonial: null,
    },
  ];

  // Depoimentos que não pertencem a um case específico (AJUSTES SITE 28/07/2026).
  // Mesmo formato de `case.testimonial` + `case_id` opcional para o link "ver case".
  const testimonials = [
    {
      id: 'contec-felipe',
      case_id: 'rodoanel',
      author: 'Felipe Alvarez',
      role: L('Sócio-proprietário', 'Owner-partner', 'Socio propietario'),
      company: L('Contec Projetos Especiais — 05 pavimentadoras IMB na frota',
                 'Contec Projetos Especiais — 5 IMB pavers in its fleet',
                 'Contec Projetos Especiais — 05 pavimentadoras IMB en su flota'),
      quote: L(
        'Desde o primeiro momento, o atendimento da IMB sempre foi muito solícito e de qualidade. Temos sido muito bem atendidos, com um relacionamento muito próximo. Os equipamentos apresentam uma produtividade excelente e uma enorme versatilidade de aplicações. Os equipamentos IMB estão em um nível equivalente aos de fabricantes americanos e alemães. Recomendamos de olhos fechados.',
        'From the very first moment, IMB’s service has always been highly responsive and of great quality. We have been very well supported, with a very close relationship. The machines deliver excellent output and enormous versatility of applications. IMB equipment is on a par with American and German manufacturers. We recommend them without hesitation.',
        'Desde el primer momento, la atención de IMB siempre fue muy solícita y de calidad. Hemos sido muy bien atendidos, con una relación muy cercana. Los equipos presentan una productividad excelente y una enorme versatilidad de aplicaciones. Los equipos IMB están a un nivel equivalente al de fabricantes americanos y alemanes. Los recomendamos con los ojos cerrados.'
      ),
    },
    {
      id: 'jgx-ricardo',
      case_id: null,
      author: 'Ricardo',
      role: L('Construtora', 'Contractor', 'Constructora'),
      company: L('JGX Construtora — Caconde (SP)', 'JGX Construtora — Caconde (SP), Brazil', 'JGX Construtora — Caconde (SP)'),
      quote: L(
        'Já faz bastante tempo que adquirimos uma IMB 900G Master, e o equipamento é excelente. Temos máquinas de outras marcas, mas hoje não nos vemos trabalhando com outra. Nos acostumamos com a qualidade e o desempenho da IMB e agora estamos nos preparando para adquirir um novo equipamento da linha automatizada. Sem dúvida, recomendamos a IMB para quem deseja entrar ou crescer no mercado da construção.',
        'We bought an IMB 900G Master a long time ago, and the machine is excellent. We own machines from other brands, but today we cannot see ourselves working with any other. We got used to IMB’s quality and performance and we are now preparing to buy a new machine from the automated line. We certainly recommend IMB to anyone looking to enter or grow in the construction market.',
        'Hace bastante tiempo que adquirimos una IMB 900G Master, y el equipo es excelente. Tenemos máquinas de otras marcas, pero hoy no nos vemos trabajando con otra. Nos acostumbramos a la calidad y al desempeño de IMB y ahora nos estamos preparando para adquirir un nuevo equipo de la línea automatizada. Sin duda, recomendamos IMB a quien desee entrar o crecer en el mercado de la construcción.'
      ),
    },
    {
      id: 'marandel-vanderlei',
      case_id: 'linha-verde',
      author: 'Wanderlei Marconi',
      role: L('Proprietário', 'Owner', 'Propietario'),
      company: L('Marandel Marconi Ltda.', 'Marandel Marconi Ltda.', 'Marandel Marconi Ltda.'),
      quote: L(
        'Minha história com a IMB começou em 1979, acompanhando o desenvolvimento da extrusão de concreto no Brasil. Desde 1996, como proprietário da Marandel, utilizo exclusivamente equipamentos IMB, construindo uma parceria baseada em confiança, técnica e profissionalismo. Ao longo dessa trajetória, participei do desenvolvimento e utilizei equipamentos que se tornaram referência no mercado, como a IMB 5500HD. Mais do que uma relação comercial, a parceria entre Marandel e IMB é uma história construída ao longo de décadas.',
        'My story with IMB began in 1979, following the development of concrete extrusion in Brazil. Since 1996, as the owner of Marandel, I have used IMB equipment exclusively, building a partnership based on trust, technical expertise and professionalism. Along the way I took part in developing and operating machines that became market benchmarks, such as the IMB 5500HD. More than a commercial relationship, the partnership between Marandel and IMB is a story built over decades.',
        'Mi historia con IMB comenzó en 1979, acompañando el desarrollo de la extrusión de concreto en Brasil. Desde 1996, como propietario de Marandel, utilizo exclusivamente equipos IMB, construyendo una alianza basada en confianza, técnica y profesionalismo. A lo largo de esa trayectoria participé en el desarrollo y utilicé equipos que se volvieron referencia en el mercado, como la IMB 5500HD. Más que una relación comercial, la alianza entre Marandel e IMB es una historia construida a lo largo de décadas.'
      ),
    },
  ];

  function pickNum(v) {
    if (v == null) return NaN;
    return parseFloat(String(v).replace(/[^\d.,-]/g, '').replace(/\./g, '').replace(',', '.'));
  }

  // Helper: pulls Portuguese label for the totals computation (label keyword matching).
  function labelPt(m) {
    return (m.label && typeof m.label === 'object') ? (m.label.pt || '') : String(m.label || '');
  }

  function unitPt(m) {
    return (m.unit && typeof m.unit === 'object') ? (m.unit.pt || '') : String(m.unit || '');
  }

  // Métricas vêm em metros lineares; os totalizadores da página de cases são em km.
  function km(v, unit) {
    if (/^m lineares$/.test(unit)) return v / 1000;
    if (/^km$/.test(unit)) return v;
    return NaN;
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
        const unit = unitPt(m);
        const asKm = km(v, unit);
        if (!isNaN(asKm) && /barreira/i.test(lbl)) kmBarreira += asKm;
        else if (!isNaN(asKm) && /pavimenta|trecho|contorno|eixo|duplicad|executad|drenagem|acostamento|meio-fio|t[úu]neis/i.test(lbl)) kmRodovia += asKm;
        if (unit === 'm³') m3 += v;
      });
    });
    return { kmRodovia, kmBarreira, m3, obras };
  }

  function getById(id) {
    return cases.find((c) => c.id === id) || null;
  }

  // Depoimentos de cases + avulsos, na ordem em que devem aparecer.
  function allTestimonials() {
    var fromCases = cases.filter(function (c) { return !!c.testimonial; }).map(function (c) {
      var t = c.testimonial;
      return { id: c.id, case_id: c.id, author: t.author, role: t.role, company: t.company, quote: t.quote };
    });
    return fromCases.concat(testimonials);
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

  // Tags livres do card: entram junto com as métricas nos chips, mas não viram
  // "número" da obra (não aparecem no bloco de métricas da página do case).
  function cardChipTexts(c) {
    var out = (c.metrics || []).map(function (m) {
      return { key: T(m.short_label), value: metricText(m) };
    });
    (c.card_tags || []).forEach(function (t) { out.push({ key: '', value: T(t) }); });
    return out.slice(0, 3);
  }

  function renderCard(c) {
    var title = T(c.title);
    var location = T(c.location);
    var summaryText = T(c.summary);
    // Rótulo e valor vão em spans separados de propósito: só o rótulo pode quebrar,
    // o valor nunca parte no meio (ver .case-card-chip em styles.css).
    var chips = cardChipTexts(c).map(function (chip) {
      var value = '<span class="case-card-chip-value">' + escHtml(chip.value) + '</span>';
      var key = chip.key ? '<span class="case-card-chip-key">' + escHtml(chip.key) + ':</span> ' : '';
      return '<span class="case-card-chip">' + key + value + '</span>';
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

  return { cases, testimonials, allTestimonials, totals, getById, renderCard };
})();
