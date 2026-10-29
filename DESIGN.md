---
mode: operate
theme: dark
colors:
  bg: '#070a12'
  surface: '#0f1523'
  surface-hover: '#172033'
  surface-active: '#1e2b45'
  surface-inset: '#0a0e18'
  border: '#1e293d'
  border-subtle: '#151d2d'
  border-hover: '#334155'
  border-focus: '#38bdf8'
  text-primary: '#f8fafc'
  text-secondary: '#cbd5e1'
  text-muted: '#94a3b8'
  text-white: '#ffffff'
  accent-brand: '#0284c7'
  accent-brand-btn: '#0369a1'
  accent-brand-hover: '#075985'
  accent-success: '#34d399'
  accent-success-bg: '#064e3b'
  accent-success-border: '#059669'
  accent-warning: '#fde68a'
  accent-warning-bg: '#451a03'
  accent-warning-border: '#d97706'
  accent-info: '#7dd3fc'
  accent-info-bg: '#082f49'
  accent-info-border: '#0284c7'
  accent-leave: '#cbd5e1'
  accent-leave-bg: '#1e293b'
  accent-leave-border: '#475569'
  accent-danger: '#dc2626'
  accent-danger-hover: '#b91c1c'
  accent-danger-bg: '#450a0a'
  accent-danger-light: '#fca5a5'
  accent-danger-text: '#f87171'
typography:
  display: 'Public Sans'
  body: 'Public Sans'
  mono: 'JetBrains Mono'
  scale: 1.15
elevation:
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.4)'
  md: '0 4px 8px -1px rgba(0, 0, 0, 0.45), 0 2px 4px -2px rgba(0, 0, 0, 0.35)'
  lg: '0 12px 20px -4px rgba(0, 0, 0, 0.6), 0 4px 6px -2px rgba(0, 0, 0, 0.4)'
---

# Design System: Student Records Registry & REST API Console (Redesigned)

## 1. Overview
A precision-engineered operational workspace designed for high-density database record management and live API evaluation. Follows **Impeccable Operate Mode** rules: maximum data scanability, strict tabular alignment, high contrast (contrast ratio ≥ 5.4:1 everywhere), zero decorative gimmicks, purposeful keyboard ergonomics, and complete accessibility.

## 2. Typography
- **Interface & Labels**: `Public Sans` (-apple-system fallback), weights 400, 500, 600, 700.
- **Data, Code, & Payloads**: `JetBrains Mono` with `font-variant-numeric: tabular-nums` for rock-solid tabular reading without horizontal jitter.
- **Hierarchy**:
  - Main Heading (H1): 1.125rem (18px) / SemiBold (600), solid `#f8fafc`.
  - Metric Headers (H2): 0.75rem (12px) / Medium (500), uppercase tracking 0.06em, `#94a3b8`.
  - Metric Big Values: 1.5rem (24px) / SemiBold (600), tabular mono, `#f8fafc`.
  - Table Cell Text: 0.8125rem (13px) / Regular (400), `#f8fafc`.
  - Secondary Cell Data / Email / PRN: 0.75rem (12px) / Mono (400), `#cbd5e1`.
  - Button & Control Labels: 0.8125rem (13px) / SemiBold (600).

## 3. Color & Contrast Rules
- **Canvas Base**: `#070a12` (deep obsidian slate).
- **Surface Elevation**: `#0f1523` with crisp 1px neutral border `#1e293d`.
- **Contrast Proof**:
  - Text Primary (`#f8fafc`) on Surface: 15.4:1 (surpasses WCAG AAA 7:1).
  - Text Secondary (`#cbd5e1`) on Surface: 10.8:1 (surpasses WCAG AAA 7:1).
  - Text Muted (`#94a3b8`) on Surface: 5.6:1 (surpasses WCAG AA 4.5:1).
- **Semantic Badges**:
  - Active: `#34d399` text on `#064e3b` surface with `#059669` 1px border.
  - Probation: `#fde68a` text on `#451a03` surface with `#d97706` 1px border.
  - Graduated: `#7dd3fc` text on `#082f49` surface with `#0284c7` 1px border.
  - On Leave: `#cbd5e1` text on `#1e293b` surface with `#475569` 1px border.

## 4. Depth & Elevation
- Natural directional offset shadows (`0 4px 8px -1px rgba(0, 0, 0, 0.45)`).
- Zero colored glow halos or blurred backlight artifacts.
- Subdued 1px top specular highlight on active cards and drawers (`border-top: 1px solid rgba(255, 255, 255, 0.08)`).

## 5. Layout & Components
- Single-canvas layout without nested containers or repetitive card walls.
- High-velocity Metric Overview Strip for instant cohort telemetry.
- Quick Department Filter chips for zero-friction navigation.
- Accessible modal drawer with visible keyboard focus rings and full ARIA support.
- Split-pane Live API & Response Inspector showing real HTTP method, path, latency, and syntax-highlighted JSON.
