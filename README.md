# Chrono Vault

A premium 3D watch browsing experience built by **Aashish Thakuri**. Explore curated collections of luxury timepieces in an interactive spherical grid with smooth animations, brand filtering, and cinematic zoom controls.

## Features

- **3D Spherical Grid** — Watches arranged in a curved sphere with dynamic curvature
- **Cinematic Entrance** — Staggered fly-in animation after loading screen
- **Brand Filtering** — Dynamic filters based on actual brands in each collection
- **Collection Switching** — All, Luxury, Sport, Under $500 categories
- **Color Filtering** — Filter watches by dial color with minimap
- **Watch Crown Close Button** — Custom watch-mechanism inspired UI
- **Dark Glass Navigation** — Chrono Nav bar with serif typography
- **Responsive** — Works on mobile, tablet, and desktop

## Stack

- **Next.js 16** (Pages Router)
- **React 19**
- **React Three Fiber + Drei** — 3D rendering and helpers
- **Framer Motion** — UI animations
- **Tailwind CSS v4**
- **Leva** — Debug controls

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npm run format` | Format with Prettier |

## Project Structure

```
src/
├── components/
│   ├── grid/              # 3D grid internals
│   │   ├── WatchGrid.jsx  # Main orchestrator
│   │   ├── WatchTile.jsx  # Individual 3D watch tile
│   │   ├── GridCanvas.jsx # Grid layout + time-sliced mounting
│   │   ├── Rig.jsx        # Camera controls (drag/zoom)
│   │   ├── gridState.js   # Shared state + helpers
│   │   └── gridConfig.js  # Grid configuration
│   ├── GridUI.jsx         # Chrono Nav control bar
│   ├── MiniMap.jsx        # Navigation minimap
│   ├── Header.jsx         # Top header (Chrono Vault branding)
│   ├── CloseButton.jsx    # Watch-crown close button
│   ├── RemotionBackground.jsx # Animated background
│   └── HoloCardMaterial.js # Custom shader material
├── pages/
│   ├── index.js           # Entry point
│   └── _document.js       # HTML preloader
└── styles/                # Global CSS
```

## Author

**Aashish Thakuri**

## License

MIT
