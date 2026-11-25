# Instrucciones para la IA de producción

Este documento es el **contrato de implementación** del Actuaria Design System. Está escrito para ser leído por un agente de IA que genera o modifica código de producción (Webflow, React, HTML/CSS).

Léelo completo antes de escribir una sola línea. Las reglas marcadas **MUST** / **NEVER** no son estilísticas: romperlas produce regresiones visuales o fallos de accesibilidad.

---

## 1 · Fuentes de verdad, en orden de precedencia

1. **BRANDBOOK — normativo.** `actuaria-brandbook-ai/tokens/tokens.json` es la **fuente canónica de valores de marca**. Índice para LLMs: [`llms.txt`](https://renatopuente-ux.github.io/actuaria-brandbook-ai/llms.txt). Documentos narrativos en `/brand/01-identidad.md` … `/brand/07-gobernanza.md`.
2. **`ds-spec.json`** — tokens del DS en formato máquina, derivados y reconciliados.
3. **`index.html`** — el documento vivo. Cada componente lleva `<details class="ai-spec" data-ai-component="...">` con su contrato en JSON.
4. **El sitio en producción** (Webflow site `6967c96e0fba2ea4f94d3c69`) — es lo **implementado**, no lo normativo.

> **Regla del propio brandbook:** «Si un color, fuente o valor no aparece en `tokens.json` o en `/brand`, **NO es de marca: no lo inventes**.»

**Cuando brandbook y producción difieran: manda el BRANDBOOK y se reporta la brecha.** NEVER elijas unilateralmente ni silencies la diferencia. Las brechas conocidas están en la sección *Brandbook vs producción* del documento y en `known_gaps` del contrato `brandbook-reconciliation`.

Si un valor no está en ninguna fuente: **NO lo inventes**. Pregunta o marca `TODO` explícito.

---

## 2 · Arquitectura de tokens — la regla que más se rompe

Tres capas: `primitive` → `theme` → `semantic`.

```
🎨 primitive   #151f47          (paleta cruda, 84 vars)
🖼️ theme       brand--light--1000 → blue--light--1000
🏷️ semantic    fill--brand-strong → brand--light--1000
```

- **MUST** consumir únicamente la capa **semantic** desde cualquier componente.
- **NEVER** hardcodear un hex en un componente.
- **NEVER** consumir `primitive` directamente: si necesitas un color que no tiene rol semántico, el rol falta — créalo en la capa semantic primero.

La capa semantic tiene **modo Dark**. Cualquier color que escribas debe existir en ambos modos o el dark mode se rompe.

---

## 3 · Tipografía — tres familias, no una

| Rol | Familia | Pesos | Dónde |
|---|---|---|---|
| `display` | **Lemon Milk Pro** | 400 · 500 · 700 | `h1`, `heading-section`, títulos de card, wordmark, odómetro |
| `heading` | **Nunito** | 400 · 600 · 700 · 800 | `subheading-section`, navbar, botones, chips, autor de testimonio, **todo el footer** |
| `body` | **Prompt** | 300 · 400 · 500 · 700 | bajada del hero, párrafos de card, **citas de testimonio**, labels |

Trampas verificadas midiendo producción:

- Los **chips** y el **footer** parecen cuerpo pero son **Nunito**.
- Las **citas de testimonio** y los **párrafos de card** parecen interfaz pero son **Prompt**.
- El `h1` del hero es peso **500**, no 700.

**MUST**: antes de asignar una familia, consulta `tokens.typography.measured_in_production` en `ds-spec.json`. No deduzcas la familia desde el rol del elemento.

Lemon Milk Pro es **licenciada**. Se carga por `@font-face` desde el CDN de Webflow del propio sitio. **NEVER** copies el `.woff2` a un repo público.

---

## 3·bis · Reglas normativas del brandbook

Valores canónicos (con Pantone, para pieza impresa):

| Rol | HEX | Pantone |
|---|---|---|
| Navy institucional | `#151F47` | 2766 C |
| Azul secundario | `#3061AA` | 7455 C |
| Naranja acento | `#DF5E2D` | 7579 C |
| Superficie base | `#E8ECF4` | — |
| Neutro claro | `#D9DEEB` | — |
| Naranja claro | `#FFBBA1` | — |

Reglas duras:

- **Proporción 60/30/10** — ~60% navy/neutro, ~30% azul, ~10% naranja. El naranja es **acento**: **NEVER** fondo dominante ni bloques de texto largos.
- **Naranja sobre navy MUST ser `#FFBBA1`** (9.76:1 AAA). `#DF5E2D` puro sobre navy da 4.38:1 y está **prohibido** como texto.
- **Títulos en Lemon Milk SIEMPRE en MAYÚSCULAS.** Sin licencia, el fallback es **Nunito Black** — **NEVER** Tahoma ni una sans genérica.
- **NEVER** uses Nunito para párrafos largos ni Prompt para títulos.
- **NEVER** mezcles **Nunito Sans**: es otra familia.
- Logo: el símbolo **nunca** va a la derecha del wordmark; no recolorear el wordmark; no condensar ni estirar. Área de seguridad mínima `0.5x`, donde `x` = altura de la A del wordmark.

Identidad verbal: claim **«Trazamos el camino juntos.»** · arquetipo **El Tutor** (El Sabio + El Cuidador), tono mentor: claro, riguroso, cercano · metáfora **cartas de navegación / «mar de datos»**.

### Advertencia de contraste verificada

El brandbook afirma que sus niveles `text` están verificados contra `#E8ECF4`. **Recalculado, no cumplen:** success-text 2.30:1, warning-text 1.77:1, danger-text 4.34:1, info-text 4.20:1. Ninguno llega a 4.5:1.

**MUST**: no uses esos niveles para texto pequeño de estado sin oscurecerlos. Alternativa segura: color solo en el icono o el punto, y el texto en navy. Decisión de fondo **pendiente del equipo de marca** — no la tomes tú.

---

## 4 · Neumorfismo — jerarquía, no decoración

El sistema usa tres estados de superficie con significado:

| Estado | Sombra | Significa |
|---|---|---|
| **raised** | `--neu-out` / `--neu-out-sm` | Interactivo, accionable |
| **sunken** | `--neu-in` / `--neu-in-sm` | Dato estático, histórico, ya resuelto |
| **flat** | ninguna | Contenido sin jerarquía dentro de una superficie ya elevada |

Límites duros:

- **MUST** haber como máximo **un elemento elevado por grupo**. Dos elementos elevados compiten y el usuario pierde el foco.
- **NEVER** anides `raised` dentro de `raised`. El hijo va `flat` o `sunken`.
- **NEVER** uses la sombra como único portador de significado. Acompáñala siempre con color, icono o texto — WCAG 1.4.1.
- Sobre **fondo oscuro** el neumorfismo pierde la luz superior y se ve sucio: usa un borde de 1px en su lugar.

---

## 5 · Radios: la escala tiene un hueco conocido

Oficiales en Webflow: `0 4 8 12 16 20 24 32`.

Las **píldoras 40 / 50 / 64** existen en producción (navbar, chipsets, botón actuaria+, card de testimonio) pero **NO** están registradas como token. Cuando toques esos componentes, usa el valor literal y deja el `TODO` apuntando a registrarlos. **NEVER** los sustituyas por el radio oficial más cercano: cambiaría la identidad visual.

---

## 6 · Accesibilidad — mínimos no negociables

- Contraste de texto normal ≥ **4.5:1**; texto grande (≥24px o ≥19px bold) ≥ **3:1**.
- Foco visible siempre: borde `--stroke-focus` + halo de 3px en `--fill-brand-weak`. **NEVER** `outline: none` sin reemplazo.
- Toda animación (odómetro, typing, marquee, transiciones) **MUST** respetar `prefers-reduced-motion: reduce`.
- Imágenes decorativas: `alt=""`. Logos de certificación y cliente: `alt` con el nombre de la entidad.
- El estado nunca se comunica solo por color.

---

## 7 · Diseño atómico — dónde vive cada cosa

```
atoms      color · typography · spacing · radius · elevation · icon · logo
molecules  button · chipset · field · avatar · badge · text-link · icon-chip · stars
organisms  navbar · megamenu · card-solution · card-testimonial · cert-grid ·
           form-section · footer · tracking · marquee · counters
templates  app-shell · bento-grid · landing-section
pages      home · solución · calculadora · informe
```

**MUST**: un átomo no importa moléculas; una molécula no importa organismos. Si necesitas romperlo, el componente está mal clasificado.

---

## 8 · Contenido de ejemplo

Los demos usan **nomenclatura actuarial genérica** a propósito (valuación actuarial, reservas técnicas, tablas de mortalidad, prima de riesgo, probabilidad de ruina, test de suficiencia), no copy de marketing. Al generar nuevos ejemplos, mantén ese registro: hace el DS reutilizable entre productos.

---

## 9 · Cómo leer el contrato de un componente

Cada componente del documento lleva:

```html
<details class="ai-spec" data-ai-component="tracking">
  <summary>Contrato de implementación · legible por IA</summary>
  <pre>{ ...JSON... }</pre>
</details>
```

El JSON trae `anatomy` (estructura y roles ARIA), `rules` (invariantes), `tokens` (qué token va en qué parte), `typography`, `responsive`, `a11y` y `do_not`.

Para extraerlos todos programáticamente:

```js
[...document.querySelectorAll('[data-ai-component]')].map(el => ({
  component: el.dataset.aiComponent,
  spec: JSON.parse(el.querySelector('pre').textContent)
}));
```

**MUST** respetar el array `do_not` de cada componente. Está escrito a partir de errores reales ya cometidos.

---

## 10 · Antes de dar por terminado

- [ ] Ningún hex hardcodeado; todo vía token semantic.
- [ ] Familia tipográfica verificada contra `measured_in_production`.
- [ ] Un solo elemento elevado por grupo.
- [ ] Contrastes medidos, no estimados.
- [ ] `prefers-reduced-motion` respetado.
- [ ] Foco visible en todo elemento interactivo.
- [ ] `alt` correcto en cada imagen.
- [ ] Discrepancias con producción reportadas, no silenciadas.

---

Actuaria Consultores · DS v2.2.0 · reconciliado con el brandbook
