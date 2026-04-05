# 🎨 Color Palette Implementation Checklist

## Overview

Fly Labour được redesign lại với bảng màu: **Gold** (Primary) + **Orange** (Secondary) + **Modern Gray** (Neutral).

Tất cả design tokens và CSS variables đã được cập nhật trong:

- ✅ `/src/constants/designTokens.ts` - Centralized tokens
- ✅ `/src/index.css` - CSS variables (light & dark mode)
- ✅ `/tailwind.config.js` - Tailwind color mappings
- ✅ `/COLOR_PALETTE_GUIDE.md` - Full color documentation
- ✅ `/COLOR_PALETTE.html` - Interactive color swatches
- ✅ `/COMPONENT_COLOR_USAGE.md` - Component examples

**Trang web sẽ trông**: Modern ✨ + Mềm mại 🌸 + Tinh tế 💎 + Hợp mắt 👁️

---

## Hex Color Reference

```
BRAND COLORS:
├─ Gold Primary      #e4a808
├─ Gold Bright       #f5b500
├─ Gold Soft         #fdd52f
├─ Gold Lighter      #f2ee8c
├─ Orange Primary    #ff9500
├─ Orange Light      #ffb84d
├─ Orange Lighter    #ffe5cc
└─ Cream             #fffbf0

LIGHT MODE NEUTRALS:
├─ Background        #fafaf9 (warm white)
├─ Surface           #ffffff
├─ Surface Sec       #f5f5f3
├─ Text Base         #2a2a2a (dark gray)
├─ Text Secondary    #626262
├─ Text Tertiary     #a0a09f
├─ Border Default    #e5e5e4
├─ Border Subtle     #d4d4d2
└─ Border Strong     #b8b8b6

DARK MODE:
├─ Background        #0f0f0e (deep black)
├─ Surface           #1a1a19
├─ Surface Sec       #262624
├─ Text Base         #f0f0ee (off-white)
├─ Text Secondary    #b8b8b6
├─ Text Tertiary     #7a7a78
├─ Border Default    #3a3a38
├─ Border Subtle     #2a2a28
└─ Border Strong     #4a4a48
```

---

## CSS Classes Available

### Brand Colors

```
bg-brand-gold-primary          #e4a808
bg-brand-gold-bright           #f5b500
bg-brand-gold-soft             #fdd52f
bg-brand-gold-lighter          #f2ee8c
bg-brand-orange-primary        #ff9500
bg-brand-orange-light          #ffb84d
bg-brand-orange-lighter        #ffe5cc
bg-brand-cream                 #fffbf0
```

### Gray Scale

```
bg-brand-gray-50 through bg-brand-gray-900
text-brand-gray-50 through text-brand-gray-900
border-brand-gray-50 through border-brand-gray-900
```

### Theme Variables (Auto Light/Dark)

```
bg-theme-background
bg-theme-surface
bg-theme-surfaceSecondary
text-theme-text-base
text-theme-text-secondary
text-theme-text-tertiary
border-theme-border-default
border-theme-border-subtle
border-theme-border-strong
text-theme-accent-primary (Gold)
text-theme-accent-secondary (Orange)
```

---

## Implementation Tasks

### Phase 1: Core Component Update ⚙️

- [ ] **Header Component** - Update navigation colors to new palette
- [ ] **Button Component** - Refactor all button variants (primary/secondary/tertiary)
- [ ] **Card Component** - Update card backgrounds & borders
- [ ] **Input Component** - Update form input styling
- [ ] **Badge Component** - Update badge colors & variants

### Phase 2: Page Updates 📄

- [ ] **HomePage** - Update hero banner, feature cards
- [ ] **JobsPage** - Update job card listings, filters
- [ ] **JobDetailPage** - Update detail layout
- [ ] **ProfilePage** - Update user profile styling
- [ ] **AdminDashboard** - Update admin theme
- [ ] **AdminJobsPage** - Update admin job management UI
- [ ] **EmployerDashboard** - Update employer portal theme

### Phase 3: Utility Components 🛠️

- [ ] **Modal Component** - Update modal backgrounds & buttons
- [ ] **Toast/Alert Component** - Update semantic colors (success/error/warning)
- [ ] **Pagination** - Update pagination styling
- [ ] **Dropdown Menu** - Update dropdown colors
- [ ] **Tooltip Component** - Update tooltip styling

### Phase 4: Dark Mode Testing 🌙

- [ ] [ ] Test all pages in dark mode
- [ ] [ ] Verify text contrast ratios (WCAG AA)
- [ ] [ ] Check hover/focus states in dark mode
- [ ] [ ] Verify images look good with dark overlay
- [ ] [ ] Test scrollbar visibility

### Phase 5: Cross-browser Testing 🌐

- [ ] Chrome/Edge on Windows
- [ ] Firefox on Windows
- [ ] Safari (if available)
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

### Phase 6: Accessibility Audit ♿

- [ ] Verify color contrast for all text
- [ ] Check focus states are visible
- [ ] Verify semantic color meanings (red=error, green=success)
- [ ] Test with color blindness simulator

---

## Before/After Comparison

### Before (Old Palette)

- **Primary**: Navy blue text (#1a1f3a)
- **Backgrounds**: Slate-based (#f8fafc, #243556)
- **Accents**: Single gold color
- **Issues**: Too many !important in CSS, hard to maintain

### After (New Palette)

- **Primary**: Modern gray text (#2a2a2a light, #f0f0ee dark)
- **Backgrounds**: Warm, neutral (#fafaf9 light, #0f0f0e dark)
- **Accents**: Gold (primary) + Orange (secondary) = more dynamic
- **Benefits**: Clean CSS variables, easy to maintain, modern feel

---

## Component Migration Example

### Button Before

```tsx
// ❌ OLD: Mixed colors, inconsistent
<button className="bg-yellow-500 text-black px-6 py-3 rounded">Click Me</button>
```

### Button After

```tsx
// ✅ NEW: Consistent, dark mode ready
<button className="bg-brand-gold-primary hover:bg-brand-gold-bright
                   dark:bg-brand-gold-primary dark:hover:bg-brand-gold-soft
                   text-white dark:text-black
                   px-6 py-3 rounded-lg
                   transition-colors duration-200">
  Click Me
</button>

// OR using gradients (PREMIUM)
<button className="bg-gradient-to-r from-brand-gold-primary to-brand-gold-bright
                   hover:from-brand-gold-bright hover:to-brand-gold-soft
                   text-white px-6 py-3 rounded-lg
                   shadow-md hover:shadow-lg
                   transition-all duration-200">
  Click Me
</button>
```

---

## Testing Checklist

### Visual Testing

- [ ] Colors match design mockups
- [ ] Gradients render smoothly
- [ ] Shadows are subtle and appropriate
- [ ] Rounded corners are consistent
- [ ] Spacing is even and intentional

### Dark Mode Testing

```bash
# In DevTools Console:
document.documentElement.classList.add('dark')      # Enable dark mode
document.documentElement.classList.remove('dark')   # Disable dark mode
```

- [ ] Text is readable in dark mode
- [ ] Borders are visible
- [ ] Images have appropriate overlay/contrast
- [ ] Gold/Orange accents still pop
- [ ] No white text on light backgrounds

### Contrast Testing

```
Use: https://webaim.org/resources/contrastchecker/

Minimum ratios:
  Text on Background: 4.5:1 (normal), 3:1 (large)
  UI Components: 3:1
```

- [ ] Primary text on backgrounds: ✓
- [ ] Button text on button backgrounds: ✓
- [ ] Link colors: ✓
- [ ] Form labels: ✓

---

## Files to View/Reference

```
Key documentation:
├─ COLOR_PALETTE_GUIDE.md          ← Comprehensive color guide
├─ COLOR_PALETTE.html              ← Interactive color swatches (open in browser)
├─ COMPONENT_COLOR_USAGE.md        ← Component examples
├─ DARK_MODE_GUIDE.md              ← Dark mode implementation
├─ REFACTOR_SUMMARY.md             ← Overall refactor summary
│
Implementation files:
├─ src/constants/designTokens.ts   ← Centralized design tokens
├─ src/index.css                   ← CSS variables + base styles
├─ tailwind.config.js              ← Tailwind color mappings
├─ src/hooks/useTheme.ts           ← Theme hook
├─ src/store/themeStore.ts         ← Theme state management
│
Component template:
└─ src/components/ui/TemplateComponent.tsx  ← Component example with new colors
```

---

## Quick Start for Developers

### 1. View Color Palette

Open in browser: `file:///path/to/COLOR_PALETTE.html`

### 2. Copy Hex Code

Click any hex code in palette to copy to clipboard

### 3. Use in Component

```tsx
import { useTheme } from "@/hooks/useTheme";

function MyComponent() {
  const { isDark } = useTheme();

  return (
    // ✅ GOOD: Use dark: modifier
    <div
      className="bg-white dark:bg-brand-gray-900
                    text-brand-gray-900 dark:text-white"
    >
      Content
    </div>
  );
}
```

### 4. Test Dark Mode

```bash
# In DevTools Console:
document.documentElement.classList.toggle('dark')
```

---

## Common Mistakes to Avoid

❌ **Don't:**

- Hardcode hex colors: `bg-blue-500`, `text-gray-700`
- Use !important for color overrides
- Create new color variables outside designTokens.ts
- Mix light/dark colors without `dark:` modifier
- Use `bg-gray-50` instead of `bg-brand-gray-50`

✅ **Do:**

- Use `bg-theme-surface dark:bg-theme-surface` (auto switch)
- Use `dark:` Tailwind modifier for overrides
- Add new colors to designTokens.ts
- Test in both light AND dark mode
- Use Tailwind classes from config

---

## Performance Considerations

- **CSS Variables**: Zero JS overhead, pure CSS
- **Dark Mode**: CSS class-based, instant toggle
- **Gradients**: GPU-rendered, smooth
- **Transitions**: 150-300ms for smooth UX
- **Bundle Size**: No increase (uses existing colors)

---

## Rollback Plan

If needed to revert:

1. Restore backed-up versions of:
   - `src/constants/designTokens.ts`
   - `src/index.css`
   - `tailwind.config.js`
2. A/B test old vs new palette with users
3. Document learnings for future designs

---

## Success Metrics

- ✅ No visual glitches in light/dark mode
- ✅ Contrast ratios WCAG AA compliant
- ✅ Components render consistently
- ✅ Performance unchanged
- ✅ User satisfaction improves
- ✅ Theme toggle works smoothly

---

## Next Steps

1. **This week**: Update core components (Header, Button, Card)
2. **Next week**: Update all page layouts
3. **Week 3**: Dark mode testing & accessibility audit
4. **Week 4**: Final polish & deployment

---

## Questions & Support

For questions about:

- **Color usage**: See `COMPONENT_COLOR_USAGE.md`
- **Dark mode**: See `DARK_MODE_GUIDE.md`
- **Design system**: See `COLOR_PALETTE_GUIDE.md`
- **Implementation**: See specific component in `TemplateComponent.tsx`

---

**Status**: ✅ Ready for Implementation  
**Last Updated**: April 5, 2026  
**Next Review**: After Phase 2 completion
