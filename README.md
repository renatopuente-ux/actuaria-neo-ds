# Actuaria Design System

Sistema de diseño de Actuaria Consultores. Dos fuentes de verdad, un solo documento:

1. **Tokens y componentes reales de [actuaria.com](https://actuaria.com)** — auditados contra el sitio Webflow en producción (site `6967c96e0fba2ea4f94d3c69`, 31 páginas, publicado 2026-11-24).
2. **Sistema Neo** — 54 componentes alineados 1:1 con el inventario del Figma oficial (fileKey `N1wh3u4sX3UGyUU5oWOaz6`): Glass UI + Neumorphism + Bento Boxes.

## Vista en vivo

**https://renatopuente-ux.github.io/actuaria-neo-ds/**

---

## Parte 1 · Tokens oficiales de actuaria.com

Extraídos del DOM en vivo + Webflow Data API: **6 colecciones de variables, 357 variables CSS**, en arquitectura de 3 capas.

| Capa | Colección Webflow | Qué contiene |
|------|-------------------|--------------|
| 1 · Primitive | 🎨 Colours primitive | 84 vars — paleta cruda (blue, orange, amber, green, red, teal, purple, grey-slate, grey-neutral) con rampas 1000/800/200/50 |
| 2 · Theme | 🖼️ Theme | 26 alias — mapea paleta → roles de marca (`brand--light--1000` → `blue--light--1000`) |
| 3 · Semantic | 🏷️ Colours semantic | Roles de uso (`text--strong`, `fill--brand-strong`, `stroke--weak`, `icon--brand`) · **con modo Dark** |
| — | 📐 Spacing | 17 pasos (0→256) + 8 corner-radius (0→32) |
| — | 🔤 Typography | 4 familias, 8 tamaños con line-height pareado · **con modo Mobile** |

### Marca

```css
--fill-brand-strong:     #151f47;  /* navy · blue--light--1000 */
--fill-brand-alternate:  #e0592a;  /* naranja · orange--1000   */
--text-strong:           #000626e6;
--text-weak:             #000933a6;
--bg-sunken:             #f5f6fa;
```

### Tipografía

| Rol | Familia | Uso |
|-----|---------|-----|
| `font-family--display` | **Lemon Milk Pro** | Titulares y wordmark |
| `font-family--heading` | **Nunito** | Subtítulos y botones |
| `font-family--body` / `--subheading` | **Prompt** | Cuerpo, labels, chips |

> ⚠️ Lemon Milk Pro es una fuente licenciada. Este repo cae a Tahoma. Para fidelidad total, subir el `.woff2` a `/fonts`.

### Escalas

- **Spacing**: 0 · 4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 56 · 64 · 80 · 96 · 128 · 192 · 256
- **Corner radius**: 0 · 4 · 8 · 12 · 16 · 20 · 24 · 32 (+ píldoras 40/50/64 usadas en producción pero **sin token** en Webflow)
- **Tamaños**: display 56/64 · h1 40/48 · h2 32/40 · h3 24/32 · h4 20/28 · small 16/24 · tiny 14/20 · uppercase 14/20

---

## Parte 2 · Componentes del sitio

Réplica de los 21 componentes registrados en Webflow más los patrones del DOM en producción.

| Componente | Instancias | Notas |
|---|---|---|
| **Navbar Main** | 27 | Píldora flotante · radius 40px · ES/EN · toggle claro/oscuro · botón `actuaria+` |
| **Footer** | 26 | 4 columnas sobre degradado navy · iconos naranjas |
| **Form_Section** | 9 | RUC · Razón social · Nombre · Apellido · Email · 4 checkboxes de servicio · Legal · Cloudflare Turnstile |
| **Testimonios carrusel** | 5 | Card radius 40px · estrellas naranjas `letter-spacing:8px` · chip de logo 120×44 |
| **Barra movil contacto** | 26 | Llamar / Correo / WhatsApp · solo <768px |
| **WhatsApp flotante** | 26 | 60px · `#25d366` |
| Hero Section | — | H1 Lemon Milk Pro con typing (cursor naranja) + slider Swiper de portadas del blog |
| Contadores / Odómetro | — | `odo-d` + `odo-roll` dígito a dígito, con IntersectionObserver |
| Card de Soluciones | 4 | Media con vídeo bajo demanda · chipset · CTA naranja · radius 24px |
| Marquee de marcas | 20 logos | Cinta infinita en escala de grises con máscara de desvanecido |
| Grid de certificaciones | 7 | `cert_frame` radius 32px · celda 110×110 |
| CTA Section | — | Degradado `#1b2757 → #10183a` · radius 32px |
| Chipsets / icon chips | — | radius 50px · alto 30px |
| Cabecera de sección | 6 | `heading-section` (display 40/42) + `subheading-section` (Nunito 18/22) |

Grupo **Design System** en Webflow: Card · Bento Grid · Glass Panel · Field · Toggle · Tabs · Alert.
Grupo **Typography**: Display · Heading 1-4 · Body Small · Body Tiny · Eyebrow.

---

## Parte 3 · Sistema Neo (Figma)

| Capa | Componentes |
|------|-------------|
| **Fundamentos** | Colores, Tipografía, Iconos, Espacios, Elevaciones, Radios, Cuadrículas, Z-Index, Motion, Voz y Tono |
| **Elements** (13) | Button, Button group, Button icon, Icon container, Text link, Avatar, Avatar labelled, Avatar dropdown, Tag group, Badge, Badge count, Badge dot, Slot |
| **Forms** (15) | Text input, Text area, Select, Search input, Autocomplete, Combobox, Date picker, File upload, Slider, Loading bar, Progress indicator, Checkbox group, Radio button group, Stepper, Toggle |
| **Feedback** (3) | Alert, Alert global, Empty state |
| **Navigation** (7) | Navigation header, Footer, Tabs, Pagination, Segmented control, Breadcrumbs, Navigation side |
| **Surfaces** (6) | Modal, Drawer, Card, Tooltip, Dropdown menu, Dropdown menu list |
| **Content display** (6) | Table, Summary list, Accordion, Text, Text block, Divider |
| **Marketing** (4) | Hero, Testimonial, Rating, Avatar stack |
| **Layouts** | App Shell, Bento Grid, Grids de datos |
| **Patrones** | Glass Recipe, Neumorphic Surfaces, Responsive, Interaction States, Color Guidelines |

Estilos base:
- **Neumorphism** — Raised = interactivo · Sunken = dato estático
- **Glass UI** — `backdrop-filter: blur(12px)` + fondo semitransparente
- **Bento Boxes** — grids asimétricos para dashboards

---

## Brechas DS ↔ producción

Resueltas en v2.0:

| Área | Antes | actuaria.com |
|---|---|---|
| Color de marca | `#4c64d9` índigo | `#151f47` navy ✅ |
| Acento | `#de5e2d` | `#e0592a` ✅ |
| Fondo base | `#e8ecf4` | `#f3f3f3` + patrón topográfico ✅ |
| Arquitectura de tokens | Plana (1 capa) | 3 capas + modo Dark ✅ |
| Escala de spacing | No documentada | 17 pasos ✅ |
| Tipografía | Solo Nunito | Prompt + Nunito + Lemon Milk Pro ⚠️ parcial |

Pendientes:
1. Subir **Lemon Milk Pro** (`.woff2`) al repo.
2. Registrar `corner-radius--40/50/64` en la colección 📐 Spacing de Webflow.
3. Documentar el **modo Dark** de 🏷️ Colours semantic (ya existe en Webflow, sin demo aquí).

---

## Uso

```bash
# Autocontenido: sin build step, sin dependencias locales
start index.html      # Windows
open  index.html      # macOS
```

Único CDN: Google Fonts (Nunito + Prompt) y Font Awesome 6.5.

## Fuentes de verdad

- **Sitio**: Webflow `6967c96e0fba2ea4f94d3c69` · dominios `actuaria.com` / `www.actuaria.com`
- **Figma**: Design-System-Actuaria (Actualizado), página "↳ Todos los componentes" (node `8703:121838`)

## Productos

- **Actuaria Plus** — cálculo en tiempo real: reservas, capital, primas
- **Data Wave** — dashboards de analytics personalizados
- **Data Analytics** — modelos ML: deserción, liquidez, fraude
- **ActuaFast** — gestión de procesos actuariales

---

Actuaria Consultores © 2026 · 40+ años · 6.500+ clientes en la región
