---
mode: operate
theme: dark
colors:
  bg: '#090d16'
  surface: '#111827'
  surface-hover: '#182234'
  surface-active: '#1e2d44'
  surface-inset: '#0c121d'
  border: '#1f293d'
  border-subtle: '#172033'
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
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.35)'
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -2px rgba(0, 0, 0, 0.3)'
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -4px rgba(0, 0, 0, 0.4)'
---

# Design System: Student Records Registry & REST API Console

## 1. Overview
A precision-engineered operational workspace designed for database record management and live API evaluation. Follows **Impeccable Operate Mode** rules: maximum data scanability, strict tabular alignment, high contrast (contrast ratio ≥ 5.2:1 everywhere), zero decorative gimmicks, and complete accessibility.

## 2. Typography
- **Interface & Labels**: `Public Sans` (-apple-system fallback), weights 400, 500, 600.
- **Data, Code, & Payloads**: `JetBrains Mono` with `font-variant-numeric: tabular-nums` for rock-solid tabular reading without horizontal jitter.
- **Hierarchy**:
  - Main Heading (H1): 1.5rem (24px) / SemiBold (600), solid `#f8fafc`.
  - Section Titles (H2): 0.875rem (14px) / Medium (500), uppercase tracking 0.06em, `#94a3b8`.
  - Table Cell Text: 0.8125rem (13px) / Regular (400), `#f8fafc`.
  - Secondary Cell Data / Email / PRN: 0.75rem (12px) / Mono (400), `#94a3b8`.
  - Button & Control Labels: 0.8125rem (13px) / Medium (500).

## 3. Color & Contrast Rules
- **Canvas Base**: `#090d16` (deep obsidian slate).
- **Surface Elevation**: `#111827` (slate-900) with crisp 1px neutral border `#1f293d`.
- **Contrast Proof**:
  - Text Primary (`#f8fafc`) on Surface: 15.1:1 (surpasses WCAG AAA).
  - Text Secondary (`#cbd5e1`) on Surface: 10.4:1 (surpasses WCAG AAA).
  - Text Muted (`#94a3b8`) on Surface: 5.4:1 (surpasses WCAG AA).
- **Semantic Badges**:
  - Active: `#34d399` text on `#064e3b` surface with `#059669` 1px border.
  - Probation: `#fde68a` text on `#451a03` surface with `#d97706` 1px border.
  - Graduated: `#7dd3fc` text on `#082f49` surface with `#0284c7` 1px border.
  - On Leave: `#cbd5e1` text on `#1e293b` surface with `#475569` 1px border.

## 4. Depth & Elevation
- Natural directional offset shadows (`0 4px 6px -1px rgba(0, 0, 0, 0.4)`).
- Zero colored glow halos or blurred backlight artifacts.
- Subdued 1px top specular highlight on active cards and drawers (`border-top: 1px solid rgba(255, 255, 255, 0.08)`).

## 5. Layout & Components
- Single-canvas layout without nested containers or repetitive card walls.
- Search and multi-filter toolbar with immediate responsive response.
- Accessible modal drawer for Create/Edit operations with visible keyboard focus rings.
- Split-pane Live API & Response Inspector showing real HTTP method, path, latency, and syntax-highlighted JSON.
