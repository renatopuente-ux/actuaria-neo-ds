# Instrucciones para la IA de producción

Este documento es el **contrato de implementación** del Actuaria Design System. Está escrito para ser leído por un agente de IA que genera o modifica código de producción (Webflow, React, HTML/CSS).

Léelo completo antes de escribir una sola línea. Las reglas marcadas **MUST** / **NEVER** no son estilísticas: romperlas produce regresiones visuales o fallos de accesibilidad.

---

## 1 · Fuentes de verdad, en orden de precedencia

1. **`ds-spec.json`** — tokens y reglas en formato máquina. Es la referencia canónica.
2. **`index.html`** — el documento vivo. Cada componente lleva un bloque `<details class="ai-spec" data-ai-component="...">` con su contrato en JSON.
3. **El sitio en producción** (`actuaria.com`, Webflow site `6967c96e0fba2ea4f94d3c69`) — si hay conflicto entre el DS y producción, **gana producción**, y hay que reportar la discrepancia.

Si un valor no está en ninguna de las tres: **NO lo inventes**. Pregunta o marca `TODO` explícito.

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

Actuaria Consultores · DS v2.1.0
