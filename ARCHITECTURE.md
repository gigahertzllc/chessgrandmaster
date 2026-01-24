# ChessGrandmaster 2026 - Architecture Guide

## Version 3.5.0 - Architectural Refactor

This version introduces a clean separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                        │
│  /components/ThemedLayouts.jsx                              │
│  - GalleryMastersLayout (asymmetric grid, hover reveals)    │
│  - TypographicMastersLayout (numbered list, marquee)        │
│  - EditorialMastersLayout (magazine style, 3:4 cards)       │
│  - ClassicMastersLayout (vertical cards, grayscale)         │
│  - ModernMastersLayout (horizontal cards)                   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    FUNCTIONALITY LAYER                       │
│  /hooks/                                                    │
│  - useAuth.js         (authentication state & operations)   │
│  - useGames.js        (game loading, parsing, navigation)   │
│  - useMasters.js      (players, overrides, custom players)  │
│  - usePreferences.js  (theme & board settings)              │
│  - useSystemHealth.js (backend service verification)        │
│  - useResponsive.js   (screen size detection)               │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      SERVICES LAYER                          │
│  /services/                                                 │
│  - wikipediaService.js  (image fetching + load validation)  │
│  - chessServices.js     (Lichess & Chess.com APIs)          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      DATA LAYER                              │
│  /data/                                                     │
│  - playerInfo.js     (player biographies)                   │
│  - famousGames.js    (classic games database)               │
│  - mastersDatabase.js (local game storage)                  │
│  /supabase.js        (database client)                      │
└─────────────────────────────────────────────────────────────┘
```

## Key Improvements

### 1. Separation of Concerns
- **Theme changes only touch the presentation layer**
- **Feature changes only touch the functionality layer**
- **No more rework when changing visuals**

### 2. Verified Image Loading
The Wikipedia service (`/services/wikipediaService.js`) now **actually tests if images load** before reporting success:

```javascript
// Not just checking if API returns URL
// Actually creates an Image() and waits for onload/onerror
const testImageLoads = (url, timeout = 5000) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ success: true });
    img.onerror = () => resolve({ success: false });
    setTimeout(() => resolve({ success: false }), timeout);
    img.src = url;
  });
};
```

### 3. System Health Checks
Admin Panel → System tab now tests ALL services:
- ✅ Supabase (database connection)
- ✅ Wikipedia (image API + actual image load)
- ✅ Lichess API
- ✅ Chess.com API
- ✅ Stockfish engine
- ✅ Audio support
- ✅ AI Coach (Claude API)
- ✅ Local storage

### 4. Theme-Specific Layouts
Each theme now has its own **completely unique layout**, not just different colors:

| Theme | Layout Style |
|-------|--------------|
| Gallery | Vertical nav, asymmetric masonry grid, sizes vary |
| Typographic | 200px headers, numbered list, marquee, grayscale→color |
| Editorial | Magazine style, centered headers, 3:4 vertical cards |
| Classic | Vertical cards with grayscale images |
| Modern | Horizontal cards, thumbnail + info |

## File Structure

```
/renderer/src/
├── hooks/
│   ├── index.js           # Central exports
│   ├── useAuth.js         # Authentication
│   ├── useGames.js        # Game management
│   ├── useMasters.js      # Player management
│   ├── usePreferences.js  # Theme/settings
│   ├── useSystemHealth.js # Health checks
│   └── useResponsive.js   # Screen detection
├── services/
│   ├── wikipediaService.js # Wikipedia/Commons API
│   └── chessServices.js    # Lichess/Chess.com API
├── components/
│   ├── ThemedLayouts.jsx   # All theme layouts
│   ├── SystemHealthPanel.jsx # Health UI
│   ├── AdminPanel.jsx      # Admin interface
│   └── ...
├── styles/
│   ├── base.css
│   ├── components.css
│   ├── gallery.css
│   ├── typographic.css
│   ├── editorial.css
│   ├── classic.css
│   ├── modern.css
│   └── responsive.css
└── app.jsx                 # Main app (uses hooks)
```

## Usage

### Using Hooks
```javascript
import { useAuth, useMasters, useGames } from './hooks';

function MyComponent() {
  const { user, signIn, signOut } = useAuth();
  const { players, selectMaster, masterGames } = useMasters();
  const { searchLichess, selectGame, fen } = useGames();
  
  // Clean separation - component only handles rendering
}
```

### Using Services
```javascript
import { fetchAllPhotoOptions } from './services/wikipediaService';

const result = await fetchAllPhotoOptions('Magnus Carlsen', (progress) => {
  console.log(progress.message); // "Searching Wikipedia...", "Verifying images..."
});

if (result.success) {
  console.log(`Found ${result.count} verified images`);
}
```

## Defaults
- **Default theme**: Gallery
- **Default view**: Masters
- **Default board**: Classic
