/**
 * QA del Actuaria Design System
 * ------------------------------------------------------------------
 * Auditoría SISTEMÁTICA, no por muestreo. Nació de un fallo real: se
 * verificaron selectores sueltos (.section-header h2, #act-hero-section h1)
 * y se dio por bueno el documento mientras el h1 del banner de intro
 * seguía en Nunito. Recorrer TODO o no sirve.
 *
 * Uso: pegar en la consola del navegador sobre index.html
 *      o   node --input-type=module  (con jsdom)  —  ver README.
 */
(function qaDesignSystem() {
  const MONO = ['ui-monospace', 'monospace', 'Cascadia Code', 'Courier New'];
  const fam = el => getComputedStyle(el).fontFamily.split(',')[0].replace(/["']/g, '');
  const fallos = [];
  const add = (regla, detalle) => fallos.push({ regla, detalle });

  /* ── 1 · Todo titular va en Lemon Milk Pro ── */
  const SEL_TITULO = 'h1,h2,h3,h4,h5,h6,.hero-stat-val,.act-heading-section,.act-blog-title,.act-odo';
  let lemon = 0;
  document.querySelectorAll(SEL_TITULO).forEach(e => {
    if (!e.offsetHeight) return;
    const f = fam(e);
    if (f === 'Lemon Milk Pro') { lemon++; return; }
    if (MONO.includes(f)) return;                       // tokens/código: permitido
    add('titulo-no-display', `${e.tagName.toLowerCase()}.${e.className} usa ${f} — «${(e.innerText || '').trim().slice(0, 40)}»`);
  });

  /* ── 2 · Las tres familias deben estar cargadas de verdad ── */
  [['Lemon Milk Pro', '500 16px "Lemon Milk Pro"'], ['Prompt', '400 16px Prompt'], ['Nunito', '400 16px Nunito']]
    .forEach(([n, q]) => { if (!document.fonts.check(q)) add('fuente-no-carga', n); });

  /* ── 3 · Ningún elemento desborda su contenedor ──
     Allowlist: scroll horizontal intencional (código, tablas), pistas de
     marquee/slider y ventanas de overflow del odómetro. */
  const OVERFLOW_OK = /ds-code|pg-out|act-marquee|act-tokentable|neo-slider|neo-slide|act-odo|ds-hero|overflow|fa-/;
  document.querySelectorAll('.ds-content *').forEach(e => {
    if (e.scrollWidth > e.clientWidth + 2 && e.clientWidth > 0 && e.className) {
      const cls = e.className.toString();
      if (OVERFLOW_OK.test(cls) || cls.includes('SVGAnimatedString')) return;
      add('desbordamiento', `${cls.slice(0, 40)} (${e.clientWidth} < ${e.scrollWidth})`);
    }
  });

  /* ── 4 · Ninguna imagen rota ── */
  document.querySelectorAll('img').forEach(i => {
    if (i.complete && i.naturalWidth === 0) add('imagen-rota', i.src.split('/').pop());
  });

  /* ── 5 · Los contratos para IA deben parsear ── */
  const specs = [...document.querySelectorAll('[data-ai-component]')];
  specs.forEach(el => {
    const pre = el.querySelector('pre');
    if (!pre) return add('contrato-sin-pre', el.dataset.aiComponent);
    try { JSON.parse(pre.textContent); }
    catch (err) { add('contrato-json-invalido', `${el.dataset.aiComponent}: ${err.message.slice(0, 60)}`); }
  });

  /* ── 6 · Ningún enlace de navegación roto ── */
  document.querySelectorAll('.ds-nav-link').forEach(a => {
    const h = a.getAttribute('href');
    if (h && h.startsWith('#') && !document.getElementById(h.slice(1))) add('ancla-rota', h);
  });

  /* ── 7 · Contraste mínimo del texto (WCAG 2.1) ──
     El fondo se COMPONE: un tinte con alpha sobre su ancestro no es un color
     sólido. Ignorarlo producía falsos positivos (navy 19% leído como navy
     sólido → 1.00:1). Si hay degradado en la cadena, no se puede calcular
     de forma fiable y se omite en vez de inventar un veredicto. */
  const parseCol = s => {
    const n = (s.match(/[\d.]+/g) || []).map(Number);
    return n.length >= 3 ? { r: n[0], g: n[1], b: n[2], a: n.length > 3 ? n[3] : 1 } : null;
  };
  const sobre = (fg, bg) => ({
    r: fg.r * fg.a + bg.r * (1 - fg.a),
    g: fg.g * fg.a + bg.g * (1 - fg.a),
    b: fg.b * fg.a + bg.b * (1 - fg.a), a: 1
  });
  const lum = c => {
    const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
    return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
  };
  /** Devuelve el fondo efectivo compuesto, o null si hay degradado/imagen. */
  const fondoEfectivo = el => {
    const capas = [];
    for (let n = el; n && n !== document.documentElement; n = n.parentElement) {
      const cs = getComputedStyle(n);
      if (cs.backgroundImage && cs.backgroundImage !== 'none') return null;   // no calculable
      const c = parseCol(cs.backgroundColor);
      if (c && c.a > 0) { capas.push(c); if (c.a === 1) break; }
    }
    let base = { r: 255, g: 255, b: 255, a: 1 };
    for (let i = capas.length - 1; i >= 0; i--) base = sobre(capas[i], base);
    return base;
  };
  let omitidos = 0;
  document.querySelectorAll('p,span,div,a,td,th,label,li').forEach(e => {
    if (!e.offsetHeight || e.children.length) return;
    if (e.closest('[data-qa-ignore]')) return;   // demo de fallo intencional
    const t = (e.innerText || '').trim();
    if (t.length < 4) return;
    const cs = getComputedStyle(e);
    const bg = fondoEfectivo(e);
    if (!bg) { omitidos++; return; }
    let fg = parseCol(cs.color); if (!fg) return;
    if (fg.a < 1) fg = sobre(fg, bg);
    const px = parseFloat(cs.fontSize), bold = parseInt(cs.fontWeight, 10) >= 700;
    const grande = px >= 24 || (px >= 18.66 && bold);
    const L1 = lum(fg), L2 = lum(bg);
    const r = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
    const min = grande ? 3 : 4.5;
    if (r < min) add('contraste', `${r.toFixed(2)}:1 (min ${min}) ${px}px — «${t.slice(0, 34)}»`);
  });

  /* ── Informe ── */
  const porRegla = fallos.reduce((a, f) => { (a[f.regla] = a[f.regla] || []).push(f.detalle); return a; }, {});
  console.log(`%cQA Actuaria DS — ${fallos.length === 0 ? 'SIN FALLOS' : fallos.length + ' FALLOS'}`,
              `font-weight:bold;color:${fallos.length ? '#CC3333' : '#00B374'}`);
  console.log(`titulares en Lemon Milk Pro: ${lemon} · contratos IA: ${specs.length}`);
  if (omitidos) console.log(`contraste: ${omitidos} nodos omitidos (fondo con degradado, no calculable)`);
  Object.entries(porRegla).forEach(([regla, items]) => {
    console.group(`${regla} (${items.length})`);
    items.slice(0, 15).forEach(i => console.log(i));
    if (items.length > 15) console.log(`… y ${items.length - 15} más`);
    console.groupEnd();
  });
  return { fallos: fallos.length, porRegla, titularesLemon: lemon, contratos: specs.length };
})();
