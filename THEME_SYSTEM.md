# Theme System - v3.0

## Architecture

Same HTML, different CSS. CSS Zen Garden style.

### Files
- `styles/themes.css` - Complete theme definitions for both modern and classic
- `app.jsx` - Clean component with semantic class names

### Usage

```jsx
// Root element gets theme classes
<div className="theme-classic dark">  // or "theme-modern light"
  ...
</div>
```

### Class Names (semantic, theme-agnostic)

**Layout:**
- `.app` - Root app container
- `.header` / `.header-inner` - Header
- `.main` - Main content area
- `.nav` / `.nav-item` - Navigation

**Library:**
- `.library-hero` - Hero section (hidden in modern)
- `.source-tabs` / `.source-tab` - Source navigation
- `.search-bar` / `.search-input` / `.search-btn` - Search
- `.category-filters` / `.category-btn` - Category buttons
- `.game-list` / `.game-card` - Game listing
- `.player-grid` / `.player-card` - Player cards

**UI Components:**
- `.panel` / `.panel-header` / `.panel-content` - Side panels
- `.overlay` - Modal backdrop
- `.btn` / `.btn-primary` - Buttons
- `.form-group` / `.form-label` / `.form-select` - Forms
- `.empty-state` / `.loading` - States

### Adding a New Theme

1. Add CSS variables block in `themes.css`:
```css
.theme-yourtheme {
  --content-width: 1200px;
  --text-hero: 48px;
  /* ... all variables */
}

.theme-yourtheme.dark {
  --bg: #000;
  --ink: #fff;
  /* ... colors */
}
```

2. Add component overrides:
```css
.theme-yourtheme .header { ... }
.theme-yourtheme .game-card { ... }
```

3. Add to icons in `app.jsx`:
```js
const ICONS = {
  modern: { ... },
  classic: { ... },
  yourtheme: { ... }
};
```

### Key Differences: Modern vs Classic

| Aspect | Modern | Classic |
|--------|--------|---------|
