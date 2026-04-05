# 🎨 Component Color Usage Guide

Hướng dẫn cụ thể cách dùng bảng màu mới (Gold + Orange + Modern Gray) trong các component.

---

## Button Components

### Primary Button (Gold Gradient)

```tsx
<button
  className="bg-gradient-to-r from-brand-gold-primary to-brand-gold-bright 
                   hover:from-brand-gold-bright hover:to-brand-gold-soft
                   text-white font-semibold rounded-lg px-6 py-3
                   transition-all duration-200 active:scale-95
                   shadow-md hover:shadow-lg"
>
  Primary Action
</button>
```

**CSS Alternative:**

```css
.btn-primary {
  background: linear-gradient(135deg, #e4a808 0%, #f5b500 100%);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 20px rgba(228, 168, 8, 0.3);
}

.btn-primary:hover {
  background: linear-gradient(135deg, #f5b500 0%, #fdd52f 100%);
  box-shadow: 0 6px 30px rgba(228, 168, 8, 0.45);
}
```

### Secondary Button (Orange)

```tsx
<button
  className="bg-brand-orange-primary hover:bg-brand-orange-light
                   text-white font-semibold rounded-lg px-6 py-3
                   transition-all duration-200
                   shadow-md hover:shadow-lg"
>
  Secondary Action
</button>
```

### Tertiary Button (Ghost)

```tsx
<button
  className="bg-transparent border-2 border-brand-gold-primary
                   text-brand-gold-primary hover:bg-yellow-50
                   dark:hover:bg-slate-800
                   rounded-lg px-6 py-3
                   transition-all duration-200"
>
  Go Back
</button>
```

### Button States

```tsx
// Disabled state
<button disabled className="bg-brand-gray-300 dark:bg-brand-gray-700
                            text-brand-gray-500 dark:text-brand-gray-400
                            cursor-not-allowed opacity-60">
  Disabled
</button>

// Loading state
<button className="bg-brand-gold-primary opacity-80
                   cursor-wait">
  Loading...
</button>
```

---

## Card Components

### Premium Card (White Background)

```tsx
<div
  className="bg-white dark:bg-brand-gray-900
                border border-brand-gray-200 dark:border-brand-gray-900
                rounded-xl p-6
                hover:shadow-lg dark:hover:shadow-lg
                hover:border-brand-gold-primary dark:hover:border-brand-gold-primary
                transition-all duration-300"
>
  <h3 className="text-lg font-semibold text-brand-gray-800 dark:text-white mb-2">
    Card Title
  </h3>
  <p className="text-brand-gray-600 dark:text-brand-gray-400 text-sm">
    Card description
  </p>
</div>
```

### Featured Card (Gold Accent)

```tsx
<div
  className="relative bg-white dark:bg-brand-gray-900
                border-2 border-brand-gold-soft dark:border-brand-gold-primary
                rounded-xl p-6
                before:absolute before:top-0 before:left-0 
                before:h-1 before:w-16 before:bg-gradient-to-r 
                before:from-brand-gold-primary before:to-brand-orange-primary
                before:rounded-bl-lg"
>
  <div
    className="mb-3 inline-block px-3 py-1 
                  bg-brand-gold-lighter dark:bg-brand-gold-lighter
                  text-brand-gold-primary rounded-full font-semibold text-xs"
  >
    Featured
  </div>
  <h3 className="text-lg font-semibold text-brand-gray-800 dark:text-white">
    Special Offer
  </h3>
</div>
```

### Card with Orange Accent

```tsx
<div
  className="bg-white dark:bg-brand-gray-900
                border-l-4 border-l-brand-orange-primary
                rounded-lg p-6
                shadow-md"
>
  <h4 className="text-brand-orange-primary font-semibold mb-2">Warning</h4>
  <p className="text-brand-gray-700 dark:text-brand-gray-300">
    Important information
  </p>
</div>
```

---

## Input/Form Components

### Text Input (Modern)

```tsx
<input
  type="text"
  placeholder="Enter your name..."
  className="w-full px-4 py-3 
             bg-white dark:bg-brand-gray-900
             border border-brand-gray-300 dark:border-brand-gray-800
             text-brand-gray-900 dark:text-white
             placeholder-brand-gray-400 dark:placeholder-brand-gray-600
             rounded-lg
             focus:border-brand-gold-primary
             focus:ring-2 focus:ring-brand-gold-primary focus:ring-opacity-20
             transition-all duration-200"
/>
```

### Dropdown/Select

```tsx
<select
  className="w-full px-4 py-3
                  bg-white dark:bg-brand-gray-900
                  border border-brand-gray-300 dark:border-brand-gray-800
                  text-brand-gray-900 dark:text-white
                  rounded-lg
                  focus:border-brand-gold-primary
                  focus:ring-2 focus:ring-brand-gold-primary focus:ring-opacity-20
                  cursor-pointer"
>
  <option>Select option...</option>
</select>
```

### Checkbox / Radio

```tsx
<label className="flex items-center cursor-pointer">
  <input
    type="checkbox"
    className="w-5 h-5 accent-brand-gold-primary cursor-pointer"
  />
  <span className="ml-3 text-brand-gray-700 dark:text-brand-gray-300">
    I agree
  </span>
</label>
```

---

## Badge Components

### Status Badges

```tsx
// Active / Success
<span className="inline-flex items-center px-3 py-1 rounded-full
                 text-xs font-semibold
                 bg-green-100 dark:bg-green-950
                 text-green-800 dark:text-green-200">
  Active
</span>

// Featured / Gold
<span className="inline-flex items-center px-3 py-1 rounded-full
                 text-xs font-semibold
                 bg-brand-gold-lighter dark:bg-brand-gold-lighter
                 text-brand-gold-primary">
  Featured
</span>

// Hot / Important
<span className="inline-flex items-center px-3 py-1 rounded-full
                 text-xs font-black text-white
                 bg-gradient-to-r from-brand-gold-primary to-brand-orange-primary">
  🔥 Hot
</span>

// Warning
<span className="inline-flex items-center px-3 py-1 rounded-full
                 text-xs font-semibold
                 bg-brand-orange-lighter dark:bg-orange-950
                 text-brand-orange-primary dark:text-orange-200">
  Expires Soon
</span>
```

---

## Typography

### Headings

```tsx
// H1
<h1 className="text-4xl font-bold text-brand-gold-primary mb-4">
  Fly Labour
</h1>

// H2
<h2 className="text-3xl font-bold text-brand-gray-900 dark:text-white mb-3">
  Section Title
</h2>

// H3
<h3 className="text-2xl font-semibold text-brand-gray-800 dark:text-white mb-2">
  Subtitle
</h3>
```

### Body Text

```tsx
// Primary text
<p className="text-brand-gray-900 dark:text-white">
  Main content
</p>

// Secondary text
<p className="text-brand-gray-600 dark:text-brand-gray-400">
  Supporting content
</p>

// Muted text
<p className="text-brand-gray-500 dark:text-brand-gray-500 text-sm">
  Disabled, hint, or helper text
</p>
```

### Accent Text

```tsx
<p className="text-brand-gold-primary font-semibold">
  Important accent
</p>

<p className="text-brand-orange-primary font-semibold">
  Warning or secondary accent
</p>
```

---

## Hero Section

### Hero Banner

```tsx
<section
  className="relative bg-gradient-to-br from-brand-gray-900 via-brand-gray-800 to-brand-gray-900
                    dark:from-brand-gray-900 dark:via-brand-gold-primary dark:via-opacity-10 dark:to-brand-gray-900
                    text-white overflow-hidden"
>
  {/* Background image or pattern */}
  <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent"></div>

  {/* Content */}
  <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 md:py-32">
    <h1 className="text-5xl md:text-6xl font-bold mb-4">
      Welcome to
      <span
        className="text-transparent bg-clip-text bg-gradient-to-r 
                       from-brand-gold-soft to-brand-orange-primary"
      >
        {" "}
        Fly Labour
      </span>
    </h1>
    <p className="text-xl text-gray-300 mb-8">
      Find jobs in Australia, Canada, New Zealand
    </p>
    <button
      className="bg-gradient-to-r from-brand-gold-primary to-brand-orange-primary
                       hover:from-brand-gold-bright hover:to-brand-orange-light
                       text-black font-bold px-8 py-4 rounded-lg
                       transition-all duration-200"
    >
      Get Started
    </button>
  </div>
</section>
```

---

## Navigation / Header

### Header Bar

```tsx
<header
  className="sticky top-0 z-50
                   bg-white dark:bg-brand-gray-900
                   border-b border-brand-gray-200 dark:border-brand-gray-800
                   shadow-sm hover:shadow-md transition-shadow"
>
  <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
    {/* Logo */}
    <a href="/" className="text-2xl font-bold text-brand-gold-primary">
      Fly
    </a>

    {/* Menu */}
    <ul className="flex gap-6">
      <li>
        <a
          href="#"
          className="text-brand-gray-700 dark:text-brand-gray-300
                                  hover:text-brand-gold-primary transition-colors"
        >
          Jobs
        </a>
      </li>
      <li>
        <a
          href="#"
          className="text-brand-gray-700 dark:text-brand-gray-300
                                  hover:text-brand-gold-primary transition-colors"
        >
          Employers
        </a>
      </li>
    </ul>

    {/* CTA */}
    <button
      className="bg-brand-gold-primary hover:bg-brand-gold-bright
                       text-black font-semibold px-6 py-2 rounded-lg
                       transition-all duration-200"
    >
      Sign In
    </button>
  </nav>
</header>
```

---

## Alert / Toast Messages

### Success Alert

```tsx
<div
  className="px-4 py-3 rounded-lg
                bg-green-50 dark:bg-green-950
                border border-green-200 dark:border-green-900
                text-green-800 dark:text-green-200"
>
  ✓ Success! Your changes have been saved.
</div>
```

### Error Alert

```tsx
<div
  className="px-4 py-3 rounded-lg
                bg-red-50 dark:bg-red-950
                border border-red-200 dark:border-red-900
                text-red-800 dark:text-red-200"
>
  ✕ Error! Something went wrong.
</div>
```

### Warning Alert

```tsx
<div
  className="px-4 py-3 rounded-lg
                bg-brand-orange-lighter dark:bg-orange-950
                border border-brand-orange-light dark:border-orange-900
                text-brand-orange-primary dark:text-orange-200"
>
  ⚠ Warning! Please review before proceeding.
</div>
```

### Info Alert

```tsx
<div
  className="px-4 py-3 rounded-lg
                bg-blue-50 dark:bg-blue-950
                border border-blue-200 dark:border-blue-900
                text-blue-800 dark:text-blue-200"
>
  ℹ Info: Important information for you.
</div>
```

---

## Pagination

```tsx
<div className="flex gap-2">
  {/* Previous */}
  <button
    className="px-3 py-2 rounded-lg
                     bg-white dark:bg-brand-gray-900
                     border border-brand-gray-300 dark:border-brand-gray-800
                     text-brand-gray-700 dark:text-brand-gray-300
                     hover:bg-brand-gray-50 dark:hover:bg-brand-gray-800
                     hover:border-brand-gold-primary
                     transition-all"
  >
    ← Previous
  </button>

  {/* Page numbers */}
  {[1, 2, 3].map((num) => (
    <button
      key={num}
      className={`px-3 py-2 rounded-lg transition-all ${
        num === 1
          ? "bg-brand-gold-primary text-white font-semibold"
          : "bg-white dark:bg-brand-gray-900 border border-brand-gray-300 dark:border-brand-gray-800 hover:border-brand-gold-primary"
      }`}
    >
      {num}
    </button>
  ))}

  {/* Next */}
  <button
    className="px-3 py-2 rounded-lg
                     bg-white dark:bg-brand-gray-900
                     border border-brand-gray-300 dark:border-brand-gray-800
                     text-brand-gray-700 dark:text-brand-gray-300
                     hover:bg-brand-gray-50 dark:hover:bg-brand-gray-800
                     hover:border-brand-gold-primary
                     transition-all"
  >
    Next →
  </button>
</div>
```

---

## Tips for Maintaining Color Consistency

1. **Always use CSS variables/ Tailwind classes**, never hardcode hex values
2. **Use consistent hierarchy**:
   - Gold for primary actions and branding
   - Orange for secondary actions and important info
   - Grays for neutral elements
3. **Test dark mode** frequently while building
4. **Use `dark:` modifier** for 90% of dark mode needs
5. **Keep shadows subtle** - use only `shadow-sm md lg xl`
6. **Transitions should be 200-300ms** for smooth changes
7. **Borders should use `border-brand-gray-*`** for consistency

---

## Color Usage Summary

| Element          | Light Mode | Dark Mode | Accent        |
| ---------------- | ---------- | --------- | ------------- |
| Card Background  | `#ffffff`  | `#1a1a19` | N/A           |
| Text Primary     | `#2a2a2a`  | `#f0f0ee` | N/A           |
| Border           | `#e5e5e4`  | `#3a3a38` | N/A           |
| Button Primary   | `#e4a808`  | `#e4a808` | Gold Gradient |
| Button Secondary | `#ff9500`  | `#ff9500` | Orange        |
| Hover Accent     | `#f5b500`  | `#fdd52f` | -             |
| Success          | `#28a745`  | `#28a745` | Green         |
| Warning          | `#ff9500`  | `#ff9500` | Orange        |
| Error            | `#dc3545`  | `#dc3545` | Red           |

---

**Last Updated**: April 5, 2026  
**See Also**: `/COLOR_PALETTE_GUIDE.md`, `/COLOR_PALETTE.html`
