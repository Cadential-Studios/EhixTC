# Edoria: The Triune Convergence – Style Guide

## Table of Contents
- [Theme Overview](#theme-overview)
- [Color Palette](#color-palette)
- [Typography](#typography)
- [Layout & Spacing](#layout--spacing)
- [Component Styles](#component-styles)
- [Animations](#animations)
- [Responsive Design](#responsive-design)
- [Accessibility](#accessibility)

---

## Theme Overview

- **Genre:** Dark Fantasy / Mystical Medieval RPG
- **Visual Style:** Glassmorphism, gradients, deep backgrounds, glowing accents
- **Inspiration:** Baldur’s Gate 3, D&D digital tools, high-fantasy interfaces
- **Experience:** Immersive, sophisticated, modern RPG UI

---

## Color Palette

### Backgrounds & Surfaces
- **Primary Background:** `#1a1a2e`
- **Secondary Background:** `#16213e`
- **Tertiary Background:** `#0f1419`
- **Panel/Surface:** `#23233f`
- **Panel Border:** `#4a4a6a`

### Moons (Signature Colors)
- **Edyria:** `#6a8dff` (blue)
- **Kapra:** `#ff6a6a` (red)
- **Enia:** `#fffb8a` (yellow)

### Text
- **Primary:** `#e0e0e0`
- **Secondary:** `#c0c0c0`
- **Muted:** `#9ca3af`

### Accents & Status
- **Success/Healing:** `#10b981`
- **Warning:** `#f59e0b`
- **Danger:** `#dc2626`
- **Gold/Highlight:** `#d4af37`
- **Accent Purple:** `#8a8ac2`

### Item Rarity
- **Common:** `#9ca3af`
- **Uncommon:** `#4ade80`
- **Rare:** `#60a5fa`
- **Epic:** `#c084fc`
- **Legendary:** `#facc15`

---

## Typography

### Font Families
- **Display/Headers:** `'Cinzel', serif`
- **Body/UI:** `"Faculty Glyphic", sans-serif`
- **System/Logs:** `'Courier New', monospace`

### Type Scale (rem)
- **xs:** 0.75
- **sm:** 0.875
- **base:** 1
- **lg:** 1.125
- **xl:** 1.25
- **2xl:** 1.5
- **3xl:** 1.875
- **4xl:** 2.25
- **7xl:** 4.5

### Usage
- **Titles/Headers:** Cinzel, bold, large sizes
- **Body/Labels:** Faculty Glyphic, regular
- **Logs/Combat:** Courier New, small

---

## Layout & Spacing

### Spacing Scale
- **Micro:** 4px
- **Small:** 8px
- **Medium:** 16px
- **Large:** 24px
- **XL:** 32px

### Component Sizing
- **Moon Icon:** 32px (desktop), 28px (mobile)
- **Button Height:** 48px+
- **Choice Button Min Height:** 100px (desktop), 70–80px (mobile)
- **Panel/Card Radius:** 8–12px

### Layout Patterns
- **Max Container Width:** 800px
- **Flex Column:** Main containers
- **Glass Panel:** Backdrop blur, semi-transparent, rounded

---

## Component Styles

### Buttons

**Primary Action**
```css
background: linear-gradient(45deg, #8a8ac2, #6a8dff);
color: #fff;
font-family: 'Cinzel', serif;
font-weight: 600;
border-radius: 8px;
box-shadow: 0 4px 15px rgba(106,141,255,0.3);
transition: all 0.3s;
```

**Choice Button**
```css
background: #2e2e4d;
border: 1px solid #4a4a6a;
min-height: 100px;
border-radius: 8px;
transition: all 0.3s;
```
_Hover:_ background `#4a4a6a`, border `#8a8ac2`, slight lift

### Panels

**Glass Panel**
```css
background: rgba(255,255,255,0.05);
backdrop-filter: blur(10px);
border: 1px solid rgba(255,255,255,0.1);
border-radius: 12px;
```

**UI Overlay Panel**
```css
background: rgba(26,26,46,0.95);
backdrop-filter: blur(8px);
padding: 1.5rem;
border-radius: 12px;
```

### Moons

**Base**
```css
width: 32px; height: 32px; border-radius: 50%;
box-shadow: 0 0 15px 3px currentColor;
transition: all 0.3s;
```
- `.moon-edyria` – blue, `.moon-kapra` – red, `.moon-enia` – yellow

### Progress Bars

**Base**
```css
height: 8px; border-radius: 4px;
background: rgba(75,85,99,0.5);
```
- **Health:** red gradient
- **Mana:** blue gradient
- **Buff:** green gradient

### Cards

**Participant Card**
```css
background: linear-gradient(135deg, #1f2937, #374151);
border: 2px solid #4b5563;
border-radius: 8px;
padding: 1rem;
transition: all 0.3s;
```
_Current turn:_ border `#3b82f6`, blue glow

---

## Animations

- **Transitions:** 0.3s ease for hover, focus, and state changes
- **Lift/Scale:** `transform: translateY(-2px)` or `scale(1.05)`
- **Glow/Pulse:** Keyframes for moon and rarity glows
- **Entry:** Fade/slide in for modals and panels

**Example:**
```css
@keyframes moonPulse {
  0%,100% { box-shadow: 0 0 15px 3px currentColor; }
  50% { box-shadow: 0 0 25px 6px currentColor; }
}
```

---

## Responsive Design

- **Mobile:** Font size reduced, touch targets increased, padding reduced
- **Breakpoints:** 430px (mobile), 768px (tablet), 1200px+ (desktop)
- **Moon/Icon Sizing:** Scales down for mobile
- **Panels/Buttons:** Padding and min-height reduced for mobile

---

## Accessibility

- **Contrast:** High contrast for text and UI elements
- **Focus:** Visible focus states for interactive elements
- **Touch Targets:** Minimum 44px for mobile
- **Font Scaling:** Uses rem/em for scalable text
- **Reduced Motion:** Animations are smooth and not excessive

---

## Usage Tips

- Use the defined color palette and typography for all new UI.
- Maintain consistent spacing and sizing for a polished look.
- Prefer CSS transitions and keyframes for performance.
- Test on both desktop and mobile for responsive fidelity.
- Reference this guide for all new components and screens.

---
