# Actuaria Design System

Sistema de diseño de **Actuaria Consultores** (Ecuador) y de su plataforma SaaS **actuaria+**.

**En vivo:** https://renatopuente-ux.github.io/actuaria-neo-ds/

Un único `index.html` con los tokens, los componentes y sus contratos de implementación.
Los demos **funcionan**: no son capturas ni maquetas estáticas.

---

## Las tres fuentes de verdad

No coinciden entre sí. El orden de precedencia es este y no se negocia:

| # | Fuente | Qué es | Dónde |
|---|---|---|---|
| 1 | **Brandbook** | **Normativo.** Lo que la marca *debe* ser | [`actuaria-brandbook-ai`](https://github.com/renatopuente-ux/actuaria-brandbook-ai) · `tokens/tokens.json` · [llms.txt](https://renatopuente-ux.github.io/actuaria-brandbook-ai/llms.txt) |
| 2 | **Webflow producción** | Lo *implementado* hoy en actuaria.com | site `6967c96e0fba2ea4f94d3c69` · 6 colecciones · 357 variables |
| 3 | **Figma** | Inventario de componentes | fileKey `N1wh3u4sX3UGyUU5oWOaz6` · node `8703:121838` |

> «Si un color, fuente o valor no aparece en tokens.json o en /brand, **NO es de marca: no lo inventes**.»
> — Brandbook de Actuaria

Cuando difieren, **manda el brandbook y la diferencia se reporta** como brecha. Nunca se resuelve
en silencio eligiendo una. Las brechas detectadas están en la sección *Brandbook vs producción*
del documento y en `known_gaps` de `ds-spec.json`.

### Valores normativos

| Rol | HEX | Pantone | En producción |
|---|---|---|---|
| Navy | `#151F47` | 2766 C | coincide |
| Azul | `#3061AA` | 7455 C | `#3258a2` (Δ12.2) |
| Naranja | `#DF5E2D` | 7579 C | `#e0592a` (Δ5.9) |
| Superficie | `#E8ECF4` | — | `#f3f3f3` (Δ13.1) |
| Naranja claro | `#FFBBA1` | — | ausente |

Proporción cromática **60/30/10**: navy-neutro / azul / naranja. El naranja es acento, nunca fondo
dominante ni bloques de texto largos.

---

## Arquitectura atómica

| Capa | Contenido |
|---|---|
| **Átomos** | Color, tipografía, iconos, espacios, elevaciones, radios, cuadrículas, z-index, motion, voz y tono |
| **Moléculas** | Elements, Forms, Chipsets, botones del sitio |
| **Organismos** | Feedback, Navegación, Surfaces, Content display, Marketing, **Plataforma**, **Dominio actuarial** |
| **Plantillas** | App shell, Bento, Grids de datos |

### Un concepto = un bloque

El documento tenía **18 duplicados funcionales**: dos sistemas conviviendo (el genérico heredado del
Figma y el real del sitio) más conceptos partidos en varios bloques. Se fusionaron en **13 canónicos**:

| Canónico | Absorbió |
|---|---|
| `el-avatar` | Avatar labelled · dropdown · stack |
| `el-badge` | Badge count · dot |
| `el-button` | Button group · icon |
| `alert` | Alert global |
| `text` | Text block |
| `dropdown-menu` | Dropdown menu list |
| `form-loading` | Progress indicator |
| `act-navbar-main` | Navigation header (genérico) |
| `act-hero-section` | Hero (genérico) |
| `act-footer-section` | Footer (genérico) |
| `act-testimonials` | Testimonial (genérico) · Rating |
| `act-card-solutions` | Card (genérico) |
| `act-chips` | Tag group |

Las antiguas duplicaciones son ahora **filas de variante** dentro del canónico, que es como el diseño
atómico lo pide. Cada canónico muestra una nota de qué absorbió.

---

## Componentes de plataforma y de dominio

21 componentes que un sistema de marketing no tiene y una plataforma SaaS actuarial necesita.

**Plataforma** · app shell con sidebar colapsable, paleta de comandos ⌘K, centro de notificaciones,
tabla de datos, barra de filtros, rango de fechas, vistas guardadas, puesta en marcha, medidor de
consumo, equipo y permisos, claves de API, registro de auditoría.

**Dominio actuarial** · panel de hipótesis, visor de tabla de mortalidad, asistente de valuación,
resultados, sensibilidad tipo tornado, proyección de flujos, triángulo run-off, conciliación de
reservas, comparador de escenarios.

### Los datos de ejemplo son coherentes, no decorativos

- La tabla **EMSSA-09** cumple `lx(x+1) = lx(x) − dx(x)` fila a fila, con `qx` creciente y `lx` decreciente
- La **conciliación cuadra**: DBO inicial + servicio + financiero − pagados ± actuariales = DBO final
- Los escenarios comparten fecha de valuación, colectivo y versión del motor
- La normativa citada es real: NIC 19, Código del Trabajo arts. **185** (desahucio) y **216** (jubilación patronal)

Cada bloque lleva sus **advertencias de rigor técnico**: no interpolar `qx` linealmente, no sumar flujos
sin descontar como si fueran la DBO, no publicar una conciliación que no cuadra, no mostrar una DBO sin
la fecha de valuación y la tabla usada.

> ⚠️ El recálculo reactivo de la sección de resultados es un **modelo didáctico, no actuarial**.
> Existe para que el desarrollador vea la dirección del efecto. Una valuación real exige proyección
> individual por empleado con su tabla de mortalidad, antigüedad y salario. El contrato lo declara.

---

## Interactividad

Motor por **delegación de eventos única** en `document`: un componente nuevo no necesita JS propio,
basta con marcarlo.

| Atributo | Comportamiento |
|---|---|
| `data-group` `data-val` `data-target` `data-multi` | Pestañas, segmentados, facetas |
| `data-table` `data-sort` `data-tblsearch` `data-faceta` `data-bulk` | Orden, filtro, selección, paginación, acciones masivas |
| `data-wizard` `data-step` `data-stepdot` `data-stepnav` | Asistente multi-paso |
| `data-reactive` `data-in` `data-out` `data-echo` `data-sens` | Recálculo entrada → salida |
| `data-toggle` `data-close` | Popovers, drawers, paleta |
| `data-toast` | Avisos efímeros |
| `data-qa-ignore` | Excluye del QA un demo de fallo intencional |

**Teclado:** `⌘K`/`Ctrl+K` abre la paleta · `Esc` cierra toda capa · `← →` entre pestañas.
Animaciones, shimmer, odómetro, typing y marquee respetan `prefers-reduced-motion`.

---

## QA

`qa.js` — **8 comprobaciones que recorren todo el documento**, no una muestra.

```js
// en la consola, sobre la página publicada
document.querySelectorAll('img[loading=lazy]').forEach(i => { i.loading='eager'; i.src=i.src; });
// esperar a que carguen, luego pegar el contenido de qa.js
```

Comprueba: familia de titulares · carga real de las 3 fuentes · desbordamiento por contenedor ·
imágenes rotas **y pendientes** · contratos `data-ai-component` parseables · anclas de navegación ·
**chips estirados** · contraste WCAG 2.1 **con composición de alpha**.

Nació de un fallo real: se verificaron selectores sueltos y se declaró el documento correcto mientras
el `h1` del banner seguía en Nunito. **Muestreo ≠ auditoría.**

El propio QA tuvo que corregirse: su primera versión daba 317 falsos positivos por tratar un tinte con
alpha como color sólido y por ignorar los degradados. Si un chequeo escupe cientos de fallos idénticos,
el sospechoso es el chequeo.

---

## Para la IA que opera producción

| Archivo | Para qué |
|---|---|
| `AI-INSTRUCTIONS.md` | Reglas narrativas MUST/NEVER y precedencia de fuentes |
| `ds-spec.json` | Tokens, arquitectura, interactividad y `known_gaps` con deltas medidos |
| `platform-spec.json` | Las 21 especificaciones funcionales completas |
| `assets.json` | Manifest de los assets reales del CDN |
| `qa.js` | Auditoría ejecutable |

Además, cada componente embebe su contrato:

```html
<details class="ai-spec" data-ai-component="data-table">
  <summary>Contrato de implementación · legible por IA</summary>
  <pre>{ purpose, anatomy, interactions, states, a11y, do_not, tokens }</pre>
</details>
```

---

## Tipografía

Tres familias con roles que **no** son intercambiables:

| Familia | Rol | Regla |
|---|---|---|
| **Lemon Milk Pro** | Títulos | Siempre en **MAYÚSCULAS**. Fallback: **Nunito Black** |
| **Nunito** | Interfaz, etiquetas, chips, footer | Nunca para párrafos largos |
| **Prompt** | Cuerpo, citas, párrafos de card | Nunca para títulos |

Pesos reales medidos: `h1` hero Lemon Milk **500** · `heading-section` **700** · odómetro **800** ·
`link_navbar` Nunito 600 · chips Nunito 700 · autor de testimonio Nunito 800 · bajada del hero Prompt 20/21.6.

Trampa frecuente: chips y footer parecen cuerpo pero son **Nunito**; las citas de testimonio y los
párrafos de card parecen interfaz pero son **Prompt**. Medir, nunca inferir del rol del token.

Lemon Milk Pro es **licenciada**: se referencia por `@font-face` desde el CDN de Webflow
(CORS `*`). **No** se redistribuye el `.woff2` en este repo público.

---

## Contraste

Los tokens `*-1000` son de **relleno, no de texto**. Medidos sobre blanco: naranja 3.73 · verde 2.78 ·
ámbar 2.16. Pares usables: `--text-orange #a8431c` (6.03) · `--text-weak #000933a6` (6.29).

**Naranja sobre navy: siempre `#FFBBA1`** (9.76:1). El `#DF5E2D` puro da 4.38:1 y está prohibido como texto.

Los niveles `text` del brandbook **no alcanzan 4.5:1** sobre su propio tinte (warn 1.90 · ok 2.41 ·
info 4.20 · bad 4.34). El DS usa versiones oscurecidas de 7.4–8.1:1 (`#14532d`, `#6b3e00`, `#8f1d1d`,
`#1d3f8f`) y una variante `.on-dark` para superficies navy. Documentado como brecha pendiente de
decisión del equipo de marca.

---

## Escalas

- **Spacing**: 0 · 4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 56 · 64 · 80 · 96 · 128 · 192 · 256
- **Corner radius**: 0 · 4 · 8 · 12 · 16 · 20 · 24 · 32 (+ píldoras 40/50/64 usadas en producción pero **sin token** en Webflow)
- **Tamaños**: display 56/64 · h1 40/48 · h2 32/40 · h3 24/32 · h4 20/28 · small 16/24 · tiny 14/20

---

## Pendientes del lado Webflow

1. Registrar `corner-radius--40/50/64` en la colección 📐 Spacing (hoy hardcodeados).
2. Documentar el **modo Dark** de 🏷️ Colours semantic (existe en Webflow, sin demo aquí).
3. Fijar `font-family--body` en el `body` del sitio — hoy cae a **Arial 14/20**.

---

## Uso

```bash
# Autocontenido: sin build step, sin dependencias locales
start index.html      # Windows
open  index.html      # macOS
```

CDN: Google Fonts (Nunito + Prompt), Font Awesome 6.5 y el CDN de fuentes de actuaria.com (Lemon Milk Pro).

## Publicar

```bash
gh auth switch -u renatopuente-ux        # el repo es de esta cuenta
git push origin master
gh api repos/renatopuente-ux/actuaria-neo-ds/pages/builds/latest --jq '.status+" "+.commit[0:7]'
gh auth switch -u renatopuente           # restaurar
```

Pages puede quedarse en el commit anterior por la carrera entre push y webhook: comparar el commit
del build con el HEAD remoto antes de dar nada por publicado.

---

## Productos

- **Actuaria Plus** — cálculo en tiempo real: reservas, capital, primas
- **Data Wave** — dashboards de analytics personalizados
- **Data Analytics** — modelos ML: deserción, liquidez, fraude
- **ActuaFast** — gestión de procesos actuariales

---

Actuaria Consultores © 2026 · 40+ años · 6.500+ clientes en la región
