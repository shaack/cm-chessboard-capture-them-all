# Capture Them All

A chess puzzle game where you control a single black piece (rook, bishop, knight, or queen) and must capture all white pawns on the board. 40 puzzles across 4 categories with 10 levels each.

Built with [cm-chessboard](https://github.com/shaack/cm-chessboard).

## Development

No build step is needed for development. The app uses ES modules loaded directly by the browser.

### Setup

```bash
npm install
```

### Run locally

Serve the project root with any HTTP server (ES modules require it):

```bash
python3 -m http.server 8080
```

Then open http://localhost:8080.

### Project structure

```
src/
  App.js              - Application shell, routing, SDK integration
  Game.js             - Game engine, level data (FEN), progression logic
  Level.js            - Individual puzzle logic, move validation
  GameState.js        - State persistence via localStorage
  Confetti.js         - Confetti effect wrapper
  CrazyGamesSDK.js   - CrazyGames SDK wrapper (no-ops when running locally)
  pages/
    MenuPage.js       - Start screen
    LevelSelectPage.js - Level selection grid
    GamePage.js       - Game board and controls
    SettingsPage.js   - Settings page
assets/
  bkgnd-1.jpg         - Background image
  winSound.mp3        - Level completion sound
  styles/
    screen.css         - Main stylesheet (dark mode only)
    chessboard.css     - Chessboard styles
    markers.css        - Marker styles
```

## Production build

The build script bundles all JavaScript with Rollup, copies required assets, and creates a zip file ready for upload.

### Build

```bash
bash build.sh
```

This produces:
- `dist/` - Self-contained production files
- `capture-them-all.zip` - Ready for upload to CrazyGames

### Test the production build

```bash
python3 -m http.server 8081 --directory dist
```

Then open http://localhost:8081 and verify:
- All pages load and navigate correctly
- Chess pieces render on the board
- Sound effects play
- Background image displays
- Console shows `CrazyGamesSDK (no-op):` messages (expected outside CrazyGames)

### What the build does

1. Bundles `src/App.js` and all dependencies into `dist/bundle.js` (minified ES module)
2. Copies `assets/` (CSS, images, audio)
3. Copies required files from `node_modules/` (chessboard pieces SVG, markers, move sound, confetti)
4. Generates `dist/index.html`
5. Creates `capture-them-all.zip` excluding source maps

## CrazyGames integration

The game integrates the CrazyGames SDK v2 for platform compatibility:

- **Loading events** - `loadingStart`/`loadingStop` during app initialization
- **Gameplay events** - `gameplayStart`/`gameplayStop` on level start, finish, and navigation
- **Midgame ads** - Shown between levels
- **Happy time** - Triggered on category completion and game completion

All SDK calls silently no-op when running outside CrazyGames.

## License

MIT
