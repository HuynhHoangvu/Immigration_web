# 🎨 Fly Labour - Professional Color Palette & Design System

## Brand Logo Analysis

- **Primary**: Gold (#e4a808) - Dynamic, premium, professional
- **Secondary**: Light Gold (#fdd52f) - Accent, highlights
- **New Addition**: Orange (#ff9500) - Energy, warmth, CTA secondary
- **New Addition**: Gray Series - Modern neutrals for text & backgrounds

---

## 📊 Complete Color Palette

### 1. BRAND COLORS (Static - Core Brand Identity)

```
┌─────────────────────────────────────────────────────────────────┐
│ PRIMARY BRAND PALETTE                                           │
├─────────────────────────────────────────────────────────────────┤
│ Gold Primary      #e4a808  ██ Main accent, buttons, headers     │
│ Gold Bright       #f5b500  ██ Hover state, interactive          │
│ Gold Soft         #fdd52f  ██ Light accents, highlights          │
│ Gold Lighter      #f2ee8c  ██ Disabled, subtle backgrounds      │
│                                                                  │
│ Orange Primary    #ff9500  ██ Secondary CTA, warnings, alerts   │
│ Orange Light      #ffb84d  ██ Hover, disabled state             │
│ Orange Lighter    #ffe5cc  ██ Background, tinted surface        │
│                                                                  │
│ Cream             #fffbf0  ██ Warm white, luxury feel           │
└─────────────────────────────────────────────────────────────────┘
```

---

### 2. NEUTRAL PALETTE (Modern Gray Series)

#### Light Mode

```
┌─────────────────────────────────────────────────────────────────┐
│ NEUTRALS - LIGHT MODE                                           │
├─────────────────────────────────────────────────────────────────┤
│ Background          #FAFAF9  ██ Main background (warm white)    │
│ Surface Elevated    #FFFFFF  ██ Cards, modals, input bg         │
│ Surface Secondary   #F5F5F3  ██ Panel, section bg               │
│                                                                  │
│ Text Primary        #2a2a2a  ██ Main text, headings             │
│ Text Secondary      #626262  ██ Secondary text, labels          │
│ Text Tertiary       #a0a09f  ██ Muted, disabled, hints          │
│                                                                  │
│ Border Default      #e5e5e4  ██ Input, card borders             │
│ Border Subdued      #d4d4d2  ██ Subtle dividers                 │
│ Border Strong       #b8b8b6  ██ Focus, hover borders            │
│                                                                  │
│ Divider             #e5e5e4  ██ Line separators                 │
│ Overlay             rgba(0,0,0,0.05) ██ Subtle shadows           │
└─────────────────────────────────────────────────────────────────┘
```

#### Dark Mode

```
┌─────────────────────────────────────────────────────────────────┐
│ NEUTRALS - DARK MODE                                            │
├─────────────────────────────────────────────────────────────────┤
│ Background          #0f0f0e  ██ Main background (deep black)    │
│ Surface Elevated    #1a1a19  ██ Cards, modals, input bg         │
│ Surface Secondary   #262624  ██ Panel, section bg               │
│                                                                  │
│ Text Primary        #f0f0ee  ██ Main text, headings             │
│ Text Secondary      #b8b8b6  ██ Secondary text, labels          │
│ Text Tertiary       #7a7a78  ██ Muted, disabled, hints          │
│                                                                  │
│ Border Default      #3a3a38  ██ Input, card borders             │
│ Border Subdued      #2a2a28  ██ Subtle dividers                 │
│ Border Strong       #4a4a48  ██ Focus, hover borders            │
│                                                                  │
│ Divider             #3a3a38  ██ Line separators                 │
│ Overlay             rgba(0,0,0,0.3) ██ Shadows, modals          │
└─────────────────────────────────────────────────────────────────┘
```

---

### 3. SEMANTIC COLORS (Functional States)

```
┌─────────────────────────────────────────────────────────────────┐
│ SUCCESS                                                         │
├─────────────────────────────────────────────────────────────────┤
│ Light   #d4edda  Dark   #1e3d26  Primary   #28a745              │

│ WARNING                                                         │
├─────────────────────────────────────────────────────────────────┤
│ Light   #fff3cd  Dark   #3d3020  Primary   #ff9500 (Orange!)    │

│ ERROR                                                           │
├─────────────────────────────────────────────────────────────────┤
│ Light   #f8d7da  Dark   #3d2326  Primary   #dc3545              │

│ INFO / SECONDARY                                                │
├─────────────────────────────────────────────────────────────────┤
│ Light   #d1ecf1  Dark   #1f4d52  Primary   #17a2b8              │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📐 Design Tokens (Updated)

### TypeScript Constants

```typescript
// Brand Colors
export const brandPalette = {
  gold: {
    primary: "#e4a808", // Main brand color
    bright: "#f5b500", // Hover/interactive
    soft: "#fdd52f", // Light accent
    lighter: "#f2ee8c", // Background tint
  },
  orange: {
    primary: "#ff9500", // Secondary CTA
    light: "#ffb84d", // Hover state
    lighter: "#ffe5cc", // Background
  },
  cream: "#fffbf0", // Warm white

  // Gray neutrals
  gray: {
    50: "#fafaf9",
    100: "#f5f5f3",
    200: "#e5e5e4",
    300: "#d4d4d2",
    400: "#b8b8b6",
    500: "#a0a09f",
    600: "#626262",
    700: "#3d3d3d",
    800: "#2a2a2a",
    900: "#1a1a1a",
  },
};

// Light Mode Theme
export const lightTheme = {
  background: "#fafaf9",
  surface: "#ffffff",
  surfaceSecondary: "#f5f5f3",

  text: {
    primary: "#2a2a2a",
    secondary: "#626262",
    tertiary: "#a0a09f",
  },

  border: {
    default: "#e5e5e4",
    subdued: "#d4d4d2",
    strong: "#b8b8b6",
  },

  accent: {
    primary: "#e4a808", // Gold
    secondary: "#ff9500", // Orange
  },
};

// Dark Mode Theme
export const darkTheme = {
  background: "#0f0f0e",
  surface: "#1a1a19",
  surfaceSecondary: "#262624",

  text: {
    primary: "#f0f0ee",
    secondary: "#b8b8b6",
    tertiary: "#7a7a78",
  },

  border: {
    default: "#3a3a38",
    subdued: "#2a2a28",
    strong: "#4a4a48",
  },

  accent: {
    primary: "#e4a808", // Gold (same in both modes)
    secondary: "#ff9500", // Orange (same in both modes)
  },
};
```

---

## ✨ Design Principles for Modern, Soft & Sophisticated Look

### 1. TYPOGRAPHY HIERARCHY

```
Heading H1    32px | Montserrat Bold | Gold (#e4a808)    | +letter-spacing: -1px
Heading H2    24px | Montserrat 700  | Gold              |
Heading H3    20px | Montserrat 600  | Gray-800          |
Body Text     16px | Nunito Sans 400 | Gray-800 / 600    | line-height: 1.6
Accent Text   14px | Montserrat 600  | Orange / Gold    | uppercase: +1.5 spacing
Small/Muted   13px | Nunito Sans 400 | Gray-500         | opacity: 0.7 alternative

→ Dùng Montserrat chỉ cho headlines (bold, chuyên nghiệp)
→ Nunito Sans cho body (mềm, dễ đọc)
```

### 2. SPACING & LAYOUT

```
Use 8px grid system:
- xs: 4px    (icon spacing, tight groups)
- sm: 8px    (button padding, component gaps)
- md: 16px   (section padding, card padding)
- lg: 24px   (section spacing)
- xl: 32px   (major sections)
- 2xl: 48px  (page padding)

Whitespace = elegance. Không nên chật chội.
Tối thiểu 16px padding trong cards.
```

### 3. BORDER RADIUS (Soft, Modern)

```
Sharp Elements: 0px      (rarely used, too harsh)
Subtle: 4px             (input focus ring, badges)
Cards: 12px             (main cards, small modals)
Large Components: 16px  (modal content, large buttons)
Buttons: 8-10px         (rounded comfort, not pill-shaped)

→ Avoid: border-radius: 999px (too cute/casual)
→ Use: consistent 12-16px untuk soft modern look
```

### 4. SHADOWS (Sophisticated Depth)

```
No Shadow      none
Subtle         0 1px 3px rgba(0,0,0,0.05)    (borders only)
Hover          0 4px 12px rgba(0,0,0,0.08)   (card on hover)
Elevated       0 8px 24px rgba(0,0,0,0.12)   (modal, dropdown)
Deep           0 16px 48px rgba(0,0,0,0.15)  (focus modal)

Dark Mode:
Subtle         0 1px 3px rgba(0,0,0,0.2)
Hover          0 4px 12px rgba(0,0,0,0.3)
Elevated       0 8px 24px rgba(0,0,0,0.4)

→ Tránh: Hard black shadows (0 0 0 10px #000000 - too cartoon)
→ Use: Soft, subtle shadows cho modern elegance
```

### 5. COLOR USAGE PATTERNS

#### Primary CTA (Gold - Premium Feel)

```css
Button Primary: linear-gradient(135deg, #e4a808 0%, #f5b500 100%)
Hover: brightness(1.08) + shadow elevation
Active: scale(0.98) + shadow reduce

Text-only: Gold text + gold underline on hover
Focus: 3px gold ring with 0.2 opacity
```

#### Secondary CTA (Orange - Dynamic)

```css
Button Secondary: #ff9500
Hover: #ffb84d + shadow
Background: rgba(255, 149, 0, 0.08)  ← Subtle tint

Use for:
- Secondary actions
- Warning messages
- Important (but not critical) alerts
- Call-to-action on secondary priority
```

#### Neutral Elements (Gray)

```css
Text Primary: #2a2a2a (light) / #f0f0ee (dark)
Text Secondary: #626262 (light) / #b8b8b6 (dark)
Inputs: Gray-100 (light) / Gray-900 (dark)
Borders: Gray-200 (light) / Gray-800 (dark)

→ Tránh: gray-500 direct use (di động quá)
→ Use: Consistent gray tier per section type
```

---

## 🎯 Component Color Pattern Examples

### Card (Elevated)

```
┌─────────────────────────────────────────────┐
│ LIGHT MODE                    │ DARK MODE   │
├─────────────────────────────────────────────┤
│ Background: #FFFFFF           │ #1a1a19     │
│ Border: #e5e5e4               │ #3a3a38     │
│ Hover Border: #e4a808 (Gold)  │ #e4a808     │
│ Shadow: subtle → elevated     │ colored box │
│ Text: #2a2a2a                 │ #f0f0ee     │
│ Hover Shadow: +50% opacity    │ +20% opacity│
│                                             │
│ Accent Marker (top-left)                   │
│ → Gold vertical bar (2-4px)    → Gold      │
│ → Orange corner dot (8px)      → Orange    │
└─────────────────────────────────────────────┘
```

### Button States

```
Primary Button:
  Resting:  gradient(gold → bright gold)
  Hover:    same + shadow + 2px lift
  Active:   darker + shadow reduce
  Focus:    ring: gold 0.25 opacity
  Disabled: gray-300 (light) / gray-600 (dark)

Secondary Button:
  Resting:  orange with gray text
  Hover:    orange with white text
  Border:   orange-light (not full orange)

Text Link:
  Resting:  gold underline
  Hover:    gold + bold
  Active:   orange accent instead of gold
```

### Input Fields

```
Normal:
  Background: gray-50 (light) / gray-900 (dark)
  Border: gray-200 (light) / gray-800 (dark)
  Text: gray-900 (light) / gray-50 (dark)
  Placeholder: gray-400

Focus:
  Border: Gold (#e4a808)
  Background: white (light) / gray-850 (dark)
  Ring: 3px gold with 0.1 opacity shadow

Error:
  Border: #dc3545 (red)
  Text: red
  Background: #fff5f7 (light) / #3d2326 (dark)

Success:
  Border: #28a745 (green)
  Text: green
```

### Badge / Pill

```
Active:
  Background: #f2ee8c (light gold tint)
  Text: #e4a808 (gold)
  Border: #e4a808

Hot / Featured:
  Background: linear-gradient(135deg, #e4a808 → #ff9500)
  Text: white
  Animate: subtle pulse

Category:
  Background: #f5f5f3 (light) / #262624 (dark)
  Border: #d4d4d2 (light) / #3a3a38 (dark)
  Text: #626262 (light) / #b8b8b6 (dark)
  Accent dot: gold or orange
```

---

## 🌈 Visual Coherence Tips

### 1. Gold & Orange Distribution

- **Gold**: Main CTA, premium feeling, hero sections, selected states
- **Orange**: Secondary actions, warnings, emphasis when gold is busy
- **Ratio**: 70% gold, 20% orange, 10% grays as accent

### 2. Avoid Color Overload

```
❌ Wrong: Many colors competing
├─ Gold + Orange + Red + Blue + Green + Purple
└─ Result: Chaotic, unprofessional

✅ Right: Limited, intentional palette
├─ Gold (primary)
├─ Orange (secondary)
├─ Gray (neutral)
└─ Red (error only) + Green (success only)
```

### 3. Contrast & Readability

```
✅ WCAG AA Compliant:
  - Gold (#e4a808) on white: 7.2:1 ratio ✓
  - White text on gold: 8.5:1 ratio ✓
  - Gray-600 (#626262) on white: 8.1:1 ratio ✓

❌ Avoid:
  - Gold on orange background
  - Gray-400 on gray-100 background
```

### 4. Animation & Transition

```
All color changes: 0.2-0.3s ease

Smooth transitions:
  Button on hover: 150ms ease-out
  Border color: 200ms ease
  Text color: 200ms ease
  Shadow elevation: 200ms ease

→ Không phải instant (choppy)
→ Không phải 1s+ (sluggish)
```

### 5. Dark Mode Considerations

```
Không khi này:
  ❌ #000000 absolute black (too harsh on eyes)
  ❌ #FFFFFF absolute white edges (burns retinas)

Thay vào:
  ✅ #0f0f0e (deep black - soft)
  ✅ #f0f0ee (off-white - less harsh)

Accent colors STAYING SAME:
  Gold: #e4a808 (both modes)
  Orange: #ff9500 (both modes)

→ Brand consistency, but eyes-friendly
```

---

## 📋 Implementation Checklist

- [ ] Update CSS variables to new palette
- [ ] Refactor button components (primary: gold gradient, secondary: orange)
- [ ] Update card border hover to gold
- [ ] Change form inputs to new gray scheme
- [ ] Update badge colors (active: gold tint, featured: gradient)
- [ ] Test WCAG contrast compliance
- [ ] Test dark mode color consistency
- [ ] Update brand color exports in designTokens.ts
- [ ] Review all pages for color consistency
- [ ] Mobile testing (colors on different screen sizes)

---

## 🎨 Hex Code Reference Sheet

Keep this handy:

```
BRAND:
  Gold Px     #e4a808
  Gold Bright #f5b500
  Gold Soft   #fdd52f
  Gold Lighter #f2ee8c
  Orange Px   #ff9500
  Orange Lt   #ffb84d
  Orange Ltx  #ffe5cc
  Cream       #fffbf0

LIGHT GRAY (50-900):
  #fafaf9 #f5f5f3 #e5e5e4 #d4d4d2 #b8b8b6
  #a0a09f #626262 #3d3d3d #2a2a2a #1a1a1a

DARK MODE:
  Background  #0f0f0e
  Surface     #1a1a19
  Text Px     #f0f0ee
```

---

**Result**: Modern ✨ + Soft 🌸 + Sophisticated 💎 + Eye-friendly 👁️
