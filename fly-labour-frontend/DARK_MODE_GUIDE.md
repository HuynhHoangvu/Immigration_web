# Dark Mode Implementation Guide

## Centralized Design System

Tất cả design tokens (màu, spacing, shadows...) được quản lý ở:

- **Định nghĩa**: `/src/constants/designTokens.ts`
- **CSS Variables**: `/src/index.css`
- **Tailwind Config**: `/tailwind.config.js`

## Cách hoạt động

### 1. CSS Variables (Automatic Dark Mode)

HTML root có 2 bộ CSS variables tùy theo `.dark` class trên `<html>`:

```css
/* Light mode (default) */
:root {
  --surface: #ffffff;
  --text-base: #1a1f3a;
  --accent-primary: #e4a808;
  /* ... */
}

/* Dark mode */
html.dark {
  --surface: #1a1f3a;
  --text-base: #f1f5f9;
  --accent-primary: #e4a808;
  /* ... */
}
```

### 2. Theme Store (Zustand)

`/src/store/themeStore.ts` quản lý state:

- Persist vào localStorage
- Auto apply `.dark` class vào `<html>`
- Hydrate theme khi app load

### 3. Hook useTheme

Dễ lấy theme state trong component:

```tsx
import { useTheme } from "@/hooks/useTheme";

function MyComponent() {
  const { theme, isDark, toggle } = useTheme();

  return <button onClick={toggle}>{isDark ? "☀️ Light" : "🌙 Dark"}</button>;
}
```

---

## Pattern 1: Tailwind `dark:` Modifier (RECOMMENDED)

**Dùng cho 90% cases:**

```tsx
<div className="bg-white dark:bg-slate-900 text-black dark:text-white">
  <h1 className="text-gray-900 dark:text-gray-100">Title</h1>
  <p className="text-gray-600 dark:text-gray-400">Description</p>
</div>
```

**Lợi ích:**

- Tất cả CSS tự động apply theo theme
- Không cần kiểm tra `isDark` trong JSX
- Performance tốt (CSS class based)
- TypeScript hỗ trợ tốt

---

## Pattern 2: CSS Variables + Class Names

**Dùng cho custom styling:**

```tsx
<div className="bg-theme-surface text-theme-text-base border-theme-border-col">
  Card content
</div>
```

**Classes được map từ CSS variables:**

- `bg-theme-surface` → `var(--surface)`
- `text-theme-text-base` → `var(--text-base)`
- `border-theme-border-col` → `var(--border-col)`

---

## Pattern 3: Conditional Logic (Nếu cần)

**Chỉ dùng khi logic không thể làm với CSS:**

```tsx
import { useTheme } from "@/hooks/useTheme";

function ComplexComponent() {
  const { isDark } = useTheme();

  if (isDark) {
    return <DarkLayout />;
  }
  return <LightLayout />;
}
```

---

## Sửa Design System

### Thêm màu mới

1. Edit `/src/constants/designTokens.ts`:

```ts
export const lightTheme = {
  surface: "#...",
  newColor: "#abc123", // Thêm mới
  // ...
};

export const darkTheme = {
  newColor: "#def456", // Dark mode version
  // ...
};
```

2. Edit `/src/index.css`:

```css
:root {
  --new-color: #abc123;
}

html.dark {
  --new-color: #def456;
}
```

3. Edit `/tailwind.config.js`:

```js
colors: {
  theme: {
    newColor: 'var(--new-color)',
  }
}
```

4. Dùng trong component:

```tsx
<div className="text-theme-newColor">...</div>
```

---

## Component Template

```tsx
// ✅ GOOD: Dùng Tailwind dark: modifier
export function Card() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg p-4 shadow-md dark:shadow-lg">
      <h2 className="text-gray-900 dark:text-white font-bold">Title</h2>
      <p className="text-gray-600 dark:text-gray-400">Description</p>
    </div>
  );
}

// ✅ GOOD: Theme toggle button
export function ThemeToggle() {
  const { isDark, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
      aria-label="Toggle theme"
    >
      {isDark ? "☀️" : "🌙"}
    </button>
  );
}

// ❌ AVOID: Không cần dùng useTheme nếu CSS đủ
export function BadExample() {
  const { isDark } = useTheme(); // Không cần!

  return (
    <div className={isDark ? "bg-slate-900" : "bg-white"}>
      {/* Dùng Tailwind dark: thay vì conditional */}
    </div>
  );
}
```

---

## Testing Dark Mode

1. Mở DevTools (F12)
2. Console: `document.documentElement.classList.add('dark')`
3. Hoặc click theme toggle button

---

## File Structure

```
src/
├── constants/designTokens.ts      ← Design tokens definition
├── index.css                      ← CSS variables + @layer
├── hooks/
│   └── useTheme.ts               ← Theme hook
├── store/
│   └── themeStore.ts             ← Zustand store
├── tailwind.config.js             ← Tailwind config
└── components/
    └── (dùng dark: modifier)
```

---

## Notes

- **Transitions**: Tất cả color transitions được định nghĩa trong `index.css` `body` selector
- **Performance**: CSS variable-based dark mode nhanh hơn component re-render
- **Browser support**: CSS variables hỗ trợ tất cả modern browsers
- **Accessibility**: `prefers-color-scheme` sẽ được integrate ở bước tiếp theo nếu cần
