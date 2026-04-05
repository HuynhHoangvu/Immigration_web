# Dark Mode & Design System Refactor - Fly Labour Frontend

## 📋 Overview

Đã centralize toàn bộ design tokens (màu, spacing, shadows...) để:

- ✅ Quản lý dễ dàng: sửa 1 chỗ → cập nhật toàn app
- ✅ Dark mode tự động: dùng CSS variables + Tailwind `dark:` modifier
- ✅ Performance tốt: CSS-based, không cần conditional rendering
- ✅ Maintain dễ: không dùng !important, clean code

---

## 🎯 Changes Made

### 1. **Design Tokens** (`/src/constants/designTokens.ts`)

Centralize tất cả màu, spacing, shadows, fonts...

```ts
export const brandColors = { primary, gold, yellow, ... }
export const lightTheme = { surface, text, border, ... }
export const darkTheme = { surface, text, border, ... }
```

**Benefit**: Thay đổi design system ở 1 file, auto apply toàn app.

---

### 2. **CSS Variables** (`/src/index.css`)

Clean up, loại bỏ 100+ `!important` declarations.

```css
:root {
  --surface: #ffffff;
  --text-base: #1a1f3a;
  /* ... */
}

html.dark {
  --surface: #1a1f3a;
  --text-base: #f1f5f9;
  /* ... */
}
```

**Before**: 300+ lines CSS override  
**After**: 50 lines clean CSS variables

---

### 3. **Theme Store** (`/src/store/themeStore.ts`)

- Persist theme to localStorage
- Auto apply `.dark` class to `<html>`
- Add `hydrate()` method để restore theme khi load app

```ts
export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "dark",
      toggle: () => {
        /* ... */
      },
      setTheme: (theme) => {
        /* ... */
      },
      hydrate: () => {
        /* Restore from localStorage */
      },
    }),
    { name: "fly-labour-theme" },
  ),
);
```

---

### 4. **Theme Hook** (`/src/hooks/useTheme.ts`)

Refactored để dùng Zustand store instead of useState.

```ts
export function useTheme() {
  const theme = useThemeStore((s) => s.theme);
  const toggle = useThemeStore((s) => s.toggle);

  return { theme, isDark, isLight, toggle, setTheme };
}
```

---

### 5. **App Initialization** (`/src/App.tsx`)

Thêm `ThemeInitializer` component để hydrate theme khi app load.

```tsx
function ThemeInitializer() {
  useEffect(() => {
    useThemeStore.getState().hydrate();
  }, []);
  return null;
}
```

---

### 6. **Component Template** (`/src/components/ui/TemplateComponent.tsx`)

Ví dụ hoàn chỉnh cách dùng dark mode với best practices.

---

### 7. **Documentation**

- `DARK_MODE_GUIDE.md` - Chi tiết cách implement dark mode
- `TemplateComponent.tsx` - Component template với pattern

---

## 🚀 How to Use

### Pattern 1: Tailwind `dark:` Modifier (RECOMMENDED - 90% cases)

```tsx
<div className="bg-white dark:bg-slate-900 text-black dark:text-white">
  Content
</div>
```

**Auto adjust khi toggle dark mode ✨**

---

### Pattern 2: CSS Variables + Class Names

```tsx
<div className="bg-theme-surface text-theme-text-base">Content</div>
```

Maps tới:

- `bg-theme-surface` → `var(--surface)`
- `text-theme-text-base` → `var(--text-base)`

---

### Pattern 3: useTheme Hook

```tsx
import { useTheme } from "@/hooks/useTheme";

function MyComponent() {
  const { isDark, toggle } = useTheme();

  return <button onClick={toggle}>{isDark ? "☀️" : "🌙"}</button>;
}
```

---

## 🎨 Khi cần sửa Design System

### Thêm màu mới

1. **`/src/constants/designTokens.ts`**

   ```ts
   export const lightTheme = {
     newColor: "#abc123",
   };
   export const darkTheme = {
     newColor: "#def456",
   };
   ```

2. **`/src/index.css`**

   ```css
   :root {
     --new-color: #abc123;
   }
   html.dark {
     --new-color: #def456;
   }
   ```

3. **`/tailwind.config.js`**

   ```js
   colors: {
     theme: {
       newColor: 'var(--new-color)',
     }
   }
   ```

4. **Dùng:**
   ```tsx
   <div className="text-theme-newColor">...</div>
   ```

---

### Thay đổi spacing, shadow, animation

Giống như trên, nhưng dùng `spacing`, `shadows` object từ `designTokens.ts`

---

## 📂 File Structure

```
src/
├── constants/
│   └── designTokens.ts          ← Design tokens definition
├── hooks/
│   └── useTheme.ts              ← Theme hook
├── store/
│   └── themeStore.ts            ← Zustand store
├── components/
│   └── ui/
│       └── TemplateComponent.tsx ← Component template
├── index.css                    ← CSS variables + @layer
├── App.tsx                      ← ThemeInitializer
└── tailwind.config.js           ← Tailwind config
```

---

## ✅ Best Practices

| ✅ Do                                 | ❌ Don't                     |
| ------------------------------------- | ---------------------------- |
| Dùng `dark:` modifier                 | Hardcode colors (#fff, #000) |
| CSS variables từ `/src/index.css`     | Inline styles                |
| `@apply` cho reusable styles          | Multiple class selectors     |
| `transition-colors` cho smooth change | Large CSS override           |
| Zustand store cho state               | Multiple useState for theme  |
| Template component pattern            | Copy-paste styles            |

---

## 🧪 Testing Dark Mode

1. Open DevTools (F12)
2. Console: `document.documentElement.classList.add('dark')`
3. Or use theme toggle button in header

---

## 📊 Migration Status

| Component          | Status     | Notes                            |
| ------------------ | ---------- | -------------------------------- |
| index.css          | ✅ Done    | Cleaned up, removed !important   |
| themeStore.ts      | ✅ Done    | Added hydrate method             |
| useTheme.ts        | ✅ Done    | Refactored to use Zustand        |
| App.tsx            | ✅ Done    | Added ThemeInitializer           |
| tailwind.config.js | ✅ Done    | CSS variables mapped             |
| designTokens.ts    | ✅ Done    | Centralized all tokens           |
| Components         | 🔄 Pending | Refactor to use `dark:` modifier |

---

## 🔄 Next Steps

1. **Refactor existing components** to use `dark:` modifier
   - Start with Header, Footer, Card components
   - Replace conditional className logic with dark: modifier

2. **Audit CSS** for remaining hardcoded colors
   - Search for `#fff`, `#000`, hardcoded hex colors
   - Replace with CSS variables or dark: modifier

3. **Test dark mode** in all pages
   - Home, Jobs, Profile, Admin pages
   - Mobile responsive

4. **Performance check**
   - No unnecessary re-renders
   - CSS transitions smooth

---

## 📚 References

- [Tailwind Dark Mode](https://tailwindcss.com/docs/dark-mode)
- [CSS Variables](https://developer.mozilla.org/en-US/docs/Web/CSS/using_css_custom-properties)
- [Zustand Persist](https://github.com/pmndrs/zustand#persist)
- [designTokens.ts](./src/constants/designTokens.ts)
- [DARK_MODE_GUIDE.md](./DARK_MODE_GUIDE.md)
- [TemplateComponent.tsx](./src/components/ui/TemplateComponent.tsx)

---

## 💡 Tips

- **Keep consistent**: Dùng CSS variables + `dark:` modifier cho 90% cases
- **Avoid useTheme**: Chỉ dùng khi thực sự cần JS logic
- **Test frequently**: Toggle theme khi phát triển component
- **Ask for review**: Nếu không chắc pattern nào là tốt

---

**Last Updated**: April 5, 2026  
**Refactored**: Dark Mode & Design System Centralization
