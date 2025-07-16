# Theme System Design & Implementation

## Overview

This document outlines the comprehensive theme system implementation for the Biaori Vocab application, providing seamless light/dark mode support with system preference detection.

## Current State Analysis

### ✅ Already Implemented
- `next-themes` package installed (v0.4.6)
- Dark theme CSS variables defined in `globals.css`
- Theme toggle component architecture (needs recreation)
- Tailwind CSS with custom theme integration
- System preference detection in metadata
- Comprehensive UI component library with shadcn/ui

### 🔧 Needs Enhancement
- Complete theme provider setup
- Recreate theme toggle component
- Audit and enhance component-level theming
- Optimize Japanese text for both themes
- Improve modal and overlay theming

## Architecture Design

### 1. Theme Provider Structure
```
App Layout
├── ThemeProvider (next-themes)
│   ├── Theme Detection (system/manual)
│   ├── Hydration Handling
│   └── Theme Persistence
└── Application Components
```

### 2. CSS Variable System
The theme system uses CSS custom properties for seamless switching:

**Light Theme (Default)**
- Background: `oklch(1 0 0)` (Pure white)
- Foreground: `oklch(0.145 0 0)` (Near black)
- Primary: `oklch(0.205 0 0)` (Dark gray)
- Secondary: `oklch(0.97 0 0)` (Light gray)

**Dark Theme**
- Background: `oklch(0.145 0 0)` (Near black)
- Foreground: `oklch(0.985 0 0)` (Near white)
- Primary: `oklch(0.922 0 0)` (Light gray)
- Secondary: `oklch(0.269 0 0)` (Dark gray)

### 3. Component Integration Strategy

#### Theme-Aware Components
1. **Vocabulary Table** - Row highlighting, borders, text contrast
2. **Filter Panel** - Input backgrounds, dropdown styling
3. **Conjugation Display** - Badge colors, container backgrounds
4. **Detail Modal** - Overlay opacity, content backgrounds
5. **Navigation** - Header styling, active states

#### Japanese Text Optimization
- Font weight adjustments for dark backgrounds
- Letter spacing optimization
- Contrast ratio compliance (WCAG AA)

### 4. Scrollbar Theming

#### Cross-Browser Scrollbar Support
The application includes comprehensive scrollbar theming that works across all browsers:

**CSS Variables for Scrollbar Colors**
```css
/* Light theme */
--scrollbar-track: oklch(0.97 0 0);
--scrollbar-thumb: oklch(0.8 0 0);
--scrollbar-thumb-hover: oklch(0.7 0 0);

/* Dark theme */
--scrollbar-track: oklch(0.269 0 0);
--scrollbar-thumb: oklch(0.5 0 0);
--scrollbar-thumb-hover: oklch(0.6 0 0);
```

**Safari-Specific Dark Mode Support**
- Uses `@media (prefers-color-scheme: dark)` for system preference detection
- Includes `.dark` class overrides with `!important` for manual theme switching
- Supports webkit scrollbar properties: `::-webkit-scrollbar`, `::-webkit-scrollbar-track`, `::-webkit-scrollbar-thumb`

**Implementation**
- `.scrollbar-theme` utility class applies to all scrollable containers
- Firefox support via `scrollbar-width` and `scrollbar-color`
- Webkit browsers support via `::-webkit-scrollbar-*` selectors
- Consistent 8px width and 4px border radius across themes

### 5. Theme Transitions

#### Smooth Theme Switching
All theme changes include smooth transitions for better UX:

**Transition Properties**
- Background color: 200ms ease
- Text color: 200ms ease  
- Border color: 200ms ease
- Component-specific transitions: 300ms-500ms ease

**Components with Enhanced Transitions**
- Theme toggle button (icon rotation and color)
- Table rows (background and border changes)
- Cards and modals (background and shadow transitions)
- Filter panels and dropdowns

## Implementation Plan

### Phase 1: Core Theme Infrastructure
1. Create ThemeProvider wrapper component
2. Recreate theme toggle component with proper state management
3. Update layout to include theme toggle
4. Ensure proper hydration handling

### Phase 2: Component Theming
1. Audit existing UI components for dark theme compatibility
2. Update vocabulary table theming
3. Enhance filter panel styling
4. Improve modal and overlay appearance
5. Optimize conjugation display badges

### Phase 3: Typography & Accessibility
1. Enhance Japanese text rendering for both themes
2. Verify contrast ratios across all components
3. Add smooth theme transition animations
4. Test screen reader compatibility

### Phase 4: Polish & Testing
1. Cross-browser testing
2. Performance optimization
3. Mobile theme switching experience
4. System preference change handling

## Technical Specifications

### Theme Toggle Component Features
- Light/Dark/System options
- Visual theme indicators
- Smooth icon transitions
- Accessible keyboard navigation
- Chinese labels for consistency

### CSS Variable Naming Convention
```css
/* Semantic color tokens */
--background: /* Main background color */
--foreground: /* Main text color */
--primary: /* Primary accent color */
--secondary: /* Secondary accent color */
--muted: /* Muted text/backgrounds */
--accent: /* Interactive accent color */
--destructive: /* Error/warning color */
--border: /* Border color */
--input: /* Form input styling */
--ring: /* Focus ring color */
```

### Component Theming Patterns
```tsx
// Use semantic class names
className="bg-background text-foreground border-border"

// Dark mode specific styles
className="dark:bg-card dark:text-card-foreground"

// Interactive elements
className="hover:bg-accent hover:text-accent-foreground"
```

## Accessibility Considerations

### Contrast Ratios
- Normal text: 4.5:1 minimum
- Large text: 3:1 minimum
- Interactive elements: 3:1 minimum

### User Preferences
- Respect `prefers-color-scheme` media query
- Provide manual override capability
- Persist user choice across sessions
- Smooth transitions without motion for users with vestibular sensitivity

## Japanese Typography Optimization

### Font Stack Enhancements
```css
.japanese-text {
  font-family: "Hiragino Sans", "Yu Gothic", "Meiryo", "Takao", 
               "IPAexGothic", "IPAPGothic", "VL PGothic", 
               "Noto Sans CJK JP", sans-serif;
  font-weight: 500; /* Light theme */
}

.dark .japanese-text {
  font-weight: 400; /* Adjusted for dark theme */
  letter-spacing: 0.03em; /* Slightly increased */
}
```

## Performance Considerations

### Theme Switching Speed
- Use CSS custom properties for instant updates
- Minimize layout shifts during theme changes
- Optimize for 60fps transitions

### Bundle Size Impact
- Theme provider adds ~2KB to bundle
- CSS variables have no runtime overhead
- Lazy load theme toggle component if needed

## Browser Support

### Minimum Requirements
- Modern browsers with CSS custom property support
- Chrome 49+, Firefox 31+, Safari 9.1+, Edge 16+

### Fallback Strategy
- Graceful degradation to light theme
- No JavaScript theme switching fallback
- Server-side theme detection where possible

## Testing Strategy

### Automated Testing
- Unit tests for theme provider
- Component theme rendering tests
- Accessibility audit automation

### Manual Testing
- Cross-device theme consistency
- System preference synchronization
- Theme persistence verification
- Screen reader compatibility

---

*Last Updated: July 15, 2025*
*Author: Development Team*
