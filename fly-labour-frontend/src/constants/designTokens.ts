/**
 * Design System Tokens - Fly Labour Premium Brand
 * Color Palette: Gold + Orange + Modern Gray
 * 
 * Last Updated: April 5, 2026
 * See: /COLOR_PALETTE_GUIDE.md for full documentation
 */

// ════════════════════════════════════════════════════════════════════
// BRAND PALETTE (Static - Logo Based)
// ════════════════════════════════════════════════════════════════════

export const brandPalette = {
  gold: {
    primary: '#e4a808',       // Main brand color - Premium
    bright: '#f5b500',        // Hover state, interactive
    soft: '#fdd52f',          // Light accent, highlights
    lighter: '#f2ee8c',       // Disabled, subtle background
  },
  
  orange: {
    primary: '#ff9500',       // Secondary CTA, warnings, energy
    light: '#ffb84d',         // Hover state, muted
    lighter: '#ffe5cc',       // Background tint
  },
  
  cream: '#fffbf0',           // Warm white, luxury feel
  
  // Modern Gray Series
  gray: {
    50: '#fafaf9',            // Lightest - off-white
    100: '#f5f5f3',
    200: '#e5e5e4',           // Light border
    300: '#d4d4d2',
    400: '#b8b8b6',           // Default border
    500: '#a0a09f',           // Muted text
    600: '#626262',           // Secondary text
    700: '#3d3d3d',
    800: '#2a2a2a',           // Primary text
    900: '#1a1a1a',
  },
} as const

// ════════════════════════════════════════════════════════════════════
// LIGHT MODE THEME (Default)
// ════════════════════════════════════════════════════════════════════
export const lightTheme = {
  // Surfaces
  background: '#fafaf9',          // Main page background - warm white
  surface: '#ffffff',             // Cards, panels
  surfaceSecondary: '#f5f5f3',    // Alternate panel bg
  
  // Text Colors
  text: {
    base: '#2a2a2a',              // Primary text - dark gray
    secondary: '#626262',          // Secondary text
    tertiary: '#a0a09f',           // Muted, disabled
    inverse: '#ffffff',            // On dark backgrounds
  },
  
  // Borders
  border: {
    default: '#e5e5e4',            // Default borders
    subtle: '#d4d4d2',             // Subtle dividers
    strong: '#b8b8b6',             // Strong focus, hover
  },
  
  // Accents (Brand Colors)
  accent: {
    primary: '#e4a808',            // Gold - Main CTA
    secondary: '#ff9500',          // Orange - Secondary
  },
  
  // Scrollbar
  scrollbarTrack: '#f5f5f3',
} as const

// ════════════════════════════════════════════════════════════════════
// DARK MODE THEME
// ════════════════════════════════════════════════════════════════════
export const darkTheme = {
  // Surfaces
  background: '#0f0f0e',          // Main page background - deep black
  surface: '#1a1a19',             // Cards, panels - dark gray
  surfaceSecondary: '#262624',    // Alternate panel bg
  
  // Text Colors
  text: {
    base: '#f0f0ee',              // Primary text - off-white
    secondary: '#b8b8b6',          // Secondary text
    tertiary: '#7a7a78',           // Muted, disabled
    inverse: '#0f0f0e',            // On light backgrounds
  },
  
  // Borders
  border: {
    default: '#3a3a38',            // Default borders
    subtle: '#2a2a28',             // Subtle dividers
    strong: '#4a4a48',             // Strong focus, hover
  },
  
  // Accents (Same as Light Mode for Brand Consistency)
  accent: {
    primary: '#e4a808',            // Gold - stays same
    secondary: '#ff9500',          // Orange - stays same
  },
  
  // Scrollbar
  scrollbarTrack: '#1a1a19',
} as const

// ════════════════════════════════════════════════════════════════════
// SEMANTIC COLORS (Functional States)
// ════════════════════════════════════════════════════════════════════
export const semanticColors = {
  success: {
    light: '#d4edda',
    dark: '#1e3d26',
    primary: '#28a745',
  },
  warning: {
    light: '#fff3cd',
    dark: '#3d3020',
    primary: '#ff9500',             // Using orange for warmth
  },
  error: {
    light: '#f8d7da',
    dark: '#3d2326',
    primary: '#dc3545',
  },
  info: {
    light: '#d1ecf1',
    dark: '#1f4d52',
    primary: '#17a2b8',
  },
} as const

// ════════════════════════════════════════════════════════════════════
// SPACING SCALE
// ════════════════════════════════════════════════════════════════════
export const spacing = {
  xs: '4px',      // Icon spacing, tight groups
  sm: '8px',      // Button padding, component gaps
  md: '16px',     // Section padding, card padding
  lg: '24px',     // Section spacing
  xl: '32px',     // Major sections
  '2xl': '48px',  // Page padding
} as const

// ════════════════════════════════════════════════════════════════════
// BORDER RADIUS (Soft, Modern)
// ════════════════════════════════════════════════════════════════════
export const borderRadius = {
  none: '0',
  xs: '4px',      // Subtle, badge accents
  sm: '8px',      // Button, small inputs
  md: '12px',     // Card, main component
  lg: '16px',     // Large modal, prominent component
  xl: '20px',
  full: '999px',
} as const

// ════════════════════════════════════════════════════════════════════
// SHADOWS (Sophisticated Depth)
// ════════════════════════════════════════════════════════════════════
export const shadows = {
  none: 'none',
  xs: '0 1px 3px rgba(0, 0, 0, 0.05)',              // Subtle
  sm: '0 2px 6px rgba(0, 0, 0, 0.08)',              // Light hover
  md: '0 4px 12px rgba(0, 0, 0, 0.10)',             // Card hover
  lg: '0 8px 24px rgba(0, 0, 0, 0.12)',             // Elevated modal
  xl: '0 16px 48px rgba(0, 0, 0, 0.15)',            // Deep focus
  
  // Gold-tinted shadows
  gold: '0 4px 20px rgba(228, 168, 8, 0.30)',        // Gold button
  goldHover: '0 6px 30px rgba(228, 168, 8, 0.45)',   // Gold hover
  
  // Dark mode versions
  dark: {
    xs: '0 1px 3px rgba(0, 0, 0, 0.20)',
    sm: '0 2px 6px rgba(0, 0, 0, 0.25)',
    md: '0 4px 12px rgba(0, 0, 0, 0.30)',
    lg: '0 8px 24px rgba(0, 0, 0, 0.40)',
  },
} as const

// ════════════════════════════════════════════════════════════════════
// TRANSITIONS
// ════════════════════════════════════════════════════════════════════
export const transitions = {
  fast: '150ms ease-out',
  base: '200ms ease',
  slow: '300ms ease',
  slower: '500ms ease-in-out',
} as const

// ════════════════════════════════════════════════════════════════════
// FONT FAMILIES
// ════════════════════════════════════════════════════════════════════
export const fonts = {
  display: '"Montserrat", sans-serif',        // Bold, headings, premium
  body: '"Nunito Sans", "Segoe UI", sans-serif',  // Soft, readable
  mono: '"Courier New", monospace',           // Code
} as const

// ════════════════════════════════════════════════════════════════════
// TYPOGRAPHY SCALE
// ════════════════════════════════════════════════════════════════════
export const fontSize = {
  xs: '12px',
  sm: '13px',
  base: '15px',
  md: '16px',
  lg: '18px',
  xl: '20px',
  '2xl': '24px',
  '3xl': '32px',
  '4xl': '40px',
} as const

// ════════════════════════════════════════════════════════════════════
// Z-INDEX SCALE
// ════════════════════════════════════════════════════════════════════
export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  topbar: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
} as const

// ════════════════════════════════════════════════════════════════════
// LINE HEIGHT
// ════════════════════════════════════════════════════════════════════
export const lineHeight = {
  tight: '1.2',
  normal: '1.5',
  relaxed: '1.65',
  loose: '1.8',
} as const

// ════════════════════════════════════════════════════════════════════
// LETTER SPACING
// ════════════════════════════════════════════════════════════════════
export const letterSpacing = {
  tight: '-0.01em',
  normal: '0',
  wide: '0.025em',
  wider: '0.05em',
  widest: '0.1em',
} as const
