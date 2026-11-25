/**
 * QA del Actuaria Design System
 * ------------------------------------------------------------------
 * Auditoría SISTEMÁTICA, no por muestreo. Nació de un fallo real: se
 * verificaron selectores sueltos (.section-header h2, #act-hero-section h1)
 * y se dio por bueno el documento mientras el h1 del banner de intro
 * seguía en Nunito. Recorrer TODO o no sirve.
 *
 * Uso: pegar en la consola del navegador sobre index.html
 *      Las comprobaciones 1-8 son estaticas; la 9 ejerce el motor.
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
  // sr-only mide 1x1 px a proposito, y el badge de notificaciones sobresale del
  // boton por diseno: contarlos como desbordamiento es un falso positivo
  const OVERFLOW_OK = /ds-code|pg-out|act-marquee|act-tokentable|neo-slider|neo-slide|act-odo|ds-hero|overflow|fa-|sr-only|sa-tablewrap|sa-content|sa-side|sa-cmdk|sa-icon-btn|sa-layer/;
  document.querySelectorAll('.ds-content *').forEach(e => {
    if (e.scrollWidth > e.clientWidth + 2 && e.clientWidth > 0 && e.className) {
      const cls = e.className.toString();
      if (OVERFLOW_OK.test(cls) || cls.includes('SVGAnimatedString')) return;
      add('desbordamiento', `${cls.slice(0, 40)} (${e.clientWidth} < ${e.scrollWidth})`);
    }
  });

  /* ── 4 · Ninguna imagen rota ──
     Ojo: `complete && naturalWidth===0` solo detecta fallos YA resueltos.
     Una imagen aún cargando pasa en silencio, así que se reporta aparte. */
  let pendientes = 0;
  document.querySelectorAll('img').forEach(i => {
    if (!i.complete) { pendientes++; return; }
    if (i.naturalWidth === 0) add('imagen-rota', i.src.split('/').pop());
  });
  if (pendientes) add('imagen-pendiente', `${pendientes} sin resolver — volver a ejecutar tras la carga`);

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

  /* ── 7 · Chips, etiquetas y botones no se estiran al contenedor ──
     Un hijo de flex-column recibe align-self:stretch y "blockifica" el
     inline-flex: el chip acaba ocupando todo el ancho. Se compara el ancho
     real contra el que tendria con width:max-content. */
  const SEL_INLINE = '.act-chipset,.act-eyebrow,.act-card-sol-cta,.act-cert-link,.act-blog-cta,' +
                     '.act-btn-primary,.act-btn-ghost,.act-btn-orange,.act-btn-contacto,.act-btn-plus';
  document.querySelectorAll(SEL_INLINE).forEach(e => {
    if (!e.offsetHeight || e.closest('[data-qa-ignore]')) return;
    const probe = e.cloneNode(true);
    Object.assign(probe.style, { position: 'absolute', visibility: 'hidden', width: 'max-content', alignSelf: 'auto' });
    document.body.appendChild(probe);
    const natural = probe.offsetWidth;
    probe.remove();
    if (e.offsetWidth > natural + 6) {
      add('estirado', `${(e.className || '').toString().slice(0, 30)} ${e.offsetWidth}px vs ${natural}px — «${(e.innerText || '').trim().slice(0, 24)}»`);
    }
  });

  /* ── 8 · Contraste mínimo del texto (WCAG 2.1) ──
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


  /* ── 9 · El motor de interactividad FUNCIONA ──
     Las ocho comprobaciones anteriores miran propiedades estaticas: un motor
     muerto las pasa todas. Esto ejerce el comportamiento de verdad y deja el
     DOM como estaba. Sin esto, "0 fallos" no significa "funciona". */
  /* Guarda de arranque: si el motor aun no ha booteado, el smoke test
     reportaria seis fallos fantasma. Mejor decirlo una vez y repetir la
     pasada. Paso de verdad: la primera ejecucion gano la carrera al
     DOMContentLoaded y acuso a un motor que estaba sano. */
  const motorListo = typeof window.dsToast === 'function';
  if (!motorListo) add('motor-no-listo', 'el motor aun no arranco - repetir qa.js cuando document.readyState sea complete');

  const tbl = motorListo && document.querySelector('[data-table]');
  if (tbl) {
    const filas = () => tbl.querySelectorAll('tbody tr').length;
    const n0 = filas();
    if (n0 === 0) add('motor', 'la tabla no pinto ninguna fila');
    const inp = tbl.querySelector('[data-tblsearch]');
    if (inp) {
      const guardado = inp.value;
      inp.value = '\u0000zzz-sin-coincidencia';
      inp.dispatchEvent(new Event('input', { bubbles: true }));
      if (tbl.querySelectorAll('tbody tr').length !== 1) add('motor', 'el filtro de busqueda no reacciona');
      inp.value = guardado;
      inp.dispatchEvent(new Event('input', { bubbles: true }));
      if (filas() !== n0) add('motor', 'la tabla no se restaura al limpiar la busqueda');
    }
    const th = tbl.querySelector('th[data-sort]');
    if (th) {
      th.click();
      const marcada = tbl.querySelector('th[aria-sort]');
      if (!marcada) add('motor', 'ordenar no expone aria-sort');
      else if (marcada !== th) add('a11y', 'aria-sort marca una columna distinta de la pulsada');
      th.click(); th.click();
    }
  }
  const wiz = motorListo && document.querySelector('[data-wizard]');
  if (wiz) {
    const ini = wiz.dataset.current;
    const next = wiz.querySelector('[data-stepnav="next"]');
    if (next) {
      next.click();
      if (wiz.dataset.current === ini) add('motor', 'el asistente no avanza de paso');
      const prev = wiz.querySelector('[data-stepnav="prev"]');
      if (prev) prev.click();
    }
  }
  const react = motorListo && document.querySelector('[data-reactive]');
  if (react) {
    const salida = react.querySelector('[data-out="dbo"]');
    const entrada = react.querySelector('[data-in="tasa"]');
    if (salida && entrada) {
      const antes = salida.textContent, v0 = entrada.value;
      entrada.value = String(parseFloat(v0) + 2);
      entrada.dispatchEvent(new Event('input', { bubbles: true }));
      if (salida.textContent === antes) add('motor', 'el recalculo reactivo no responde');
      entrada.value = v0;
      entrada.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }

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
