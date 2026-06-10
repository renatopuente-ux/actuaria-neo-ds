# Actuaria Neo Design System

Sistema de diseño oficial de Actuaria Consultores. **Glass UI + Neumorphism + Bento Boxes** siguiendo Atomic Design.

## Vista en vivo

**https://renatopuente-ux.github.io/actuaria-neo-ds/**

## Qué incluye

| Capa | Componentes |
|------|-------------|
| **Fundamentos** | Colores, Tipografía, Espaciado, Sombras, Radios, Z-Index, Animaciones |
| **Átomos** | Botones (5 variantes), Chips/Badges, Avatares, Inputs, Toggle, Code Inline |
| **Moléculas** | Field Display, Form Group, Nav Item, Breadcrumb, Tabs, Timeline Item, Metric Tile, Pipeline Step |
| **Organismos** | Neu Card, Glass Card, Sidebar, Top Header, Data Table, Tab System, Pipeline Tracker, Modal |
| **Layouts** | App Shell, Bento Grid, Grids de datos (5 variantes) |
| **Patrones** | Glass Recipe, Neumorphic Surfaces, Responsive Breakpoints, Interaction States, Color Guidelines |

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

## Productos

- **Actuaria Plus** — Cálculo en tiempo real: reservas, capital, primas
- **Data Wave** — Dashboards de analytics personalizados
- **Data Analytics** — Modelos ML: deserción, liquidez, fraude
- **ActuaFast** — Gestión de procesos actuariales

---

Actuaria Consultores © 2026 · 35+ años · 6,000+ clientes
