# Actuaria Neo Design System

Sistema de diseño Neo de Actuaria Consultores — **54 componentes alineados 1:1 con el inventario del Figma oficial** (fileKey `N1wh3u4sX3UGyUU5oWOaz6`). **Glass UI + Neumorphism + Bento Boxes** siguiendo la estructura de categorías del Design System Actuaria.

## Vista en vivo

**https://renatopuente-ux.github.io/actuaria-neo-ds/**

## Qué incluye

| Capa | Componentes |
|------|-------------|
| **Fundamentos** | Colores, Tipografía, Espaciado, Sombras, Radios, Z-Index, Animaciones |
| **Elements** (13) | Button, Button group, Button icon, Icon container, Text link, Avatar, Avatar labelled, Avatar dropdown, Tag group, Badge, Badge count, Badge dot, Slot |
| **Forms** (15) | Text input, Text area, Select, Search input, Autocomplete, Combobox, Date picker, File upload, Slider, Loading bar, Progress indicator, Checkbox group, Radio button group, Stepper, Toggle |
| **Feedback** (3) | Alert, Alert global, Empty state |
| **Navigation** (7) | Navigation header, Footer, Tabs, Pagination, Segmented control, Breadcrumbs, Navigation side |
| **Surfaces** (6) | Modal, Drawer, Card, Tooltip, Dropdown menu, Dropdown menu list |
| **Content display** (6) | Table, Summary list, Accordion, Text, Text block, Divider |
| **Marketing** (4) | Hero, Testimonial, Rating, Avatar stack |
| **Layouts** | App Shell, Bento Grid, Grids de datos |
| **Patrones** | Glass Recipe, Neumorphic Surfaces, Responsive Breakpoints, Interaction States, Color Guidelines |

Cada componente documenta sus **variantes Figma** (Size, State, Type…) y un demo en vivo reinterpretado en estilo Neo, con las dimensiones estructurales del spec original.

## Uso

```bash
# Abre el style guide en el navegador
open index.html
```

El archivo `index.html` es completamente autocontenido — sin build step, sin dependencias locales. Solo CDN para Nunito + Font Awesome 6.

## Tokens principales

```css
--navy: #0f1f3d;
--indigo: #4c64d9;
--bg: #e8ecf4;
--neu-out: 6px 6px 16px rgba(163,177,198,0.55), -4px -4px 12px rgba(255,255,255,0.95);
--neu-in:  inset 3px 3px 8px rgba(163,177,198,0.45), inset -2px -2px 6px rgba(255,255,255,0.90);
```

## Estilos base

- **Neumorphism**: Raised = interactivo · Sunken = dato estático
- **Glass UI**: `backdrop-filter: blur(12px)` + fondo semitransparente
- **Bento Boxes**: Grids asimétricos para dashboards

## Fuente de verdad

El inventario y las propiedades de los 54 componentes provienen del Figma oficial **Design-System-Actuaria (Actualizado)**, página "↳ Todos los componentes" (node `8703:121838`). Los specs extraídos viven en el workspace Actuagency: `02_Diseno_UX_UI/design_system/specs/`.

## Productos

- **Actuaria Plus** — Cálculo en tiempo real: reservas, capital, primas
- **Data Wave** — Dashboards de analytics personalizados
- **Data Analytics** — Modelos ML: deserción, liquidez, fraude
- **ActuaFast** — Gestión de procesos actuariales

---

Actuaria Consultores © 2026 · 35+ años · 6,000+ clientes