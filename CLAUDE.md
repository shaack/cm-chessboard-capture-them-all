# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Chess puzzle game where the player controls a single black piece (rook, bishop, knight, or queen) and must capture all white pawns. Built on cm-chessboard. 40 puzzles across 4 categories (10 each).

## Development

No build step needed for development. Serve `index.html` via any local HTTP server (ES modules require it):

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

**Bundle for production** (Rollup, outputs to `dist/nodeBundle.js`):

```bash
npx rollup -c
```

No test suite exists.

## Architecture

Single Page Application with manual page-based routing. No framework.

**`App.js`** — Application shell. Holds shared `GameState`, creates page instances, provides `navigate(pageName)` to switch between pages. Pages are `"menu"`, `"levelSelect"`, `"game"`, `"settings"`.

**Page contract** — Each page in `src/pages/` implements `show(container)` (render HTML, attach listeners) and `hide()` (remove listeners, destroy resources). Pages receive the `App` instance and use `this.app.navigate()` for routing.

**`Game.js`** — Game engine. Exports `LEVELS` (object keyed by piece type, values are arrays of FEN strings). Constructor takes a DOM element and an `onGameComplete` callback. Manages the chessboard instance, level progression, win detection, and audio. Has `destroy()` for cleanup.

**`Level.js`** — Individual puzzle logic. Validates moves per piece type (rook/bishop/queen/knight), handles click-to-capture interaction on the chessboard. Stores event handlers as instance properties for proper cleanup via `destroy()`.

**`GameState.js`** — All state persisted in `localStorage` via getters/setters. Stores: `levelGroupName`, `level`, `marathonMode`, `MenuCheckpoint`, `beatenLevels`.

**`GamePage.js`** — Creates game DOM (overlay nav, buttons, board div), instantiates `Game`, and handles the overlay menu (settings/level select/menu navigation).

## Key Dependencies

- **cm-chessboard** — Board rendering, piece management, markers. Assets loaded from `node_modules/cm-chessboard/assets/`.
- **cm-web-modules** — Audio utilities (`createAudioContext`, `Sample`).
- **canvas-confetti** — Loaded as a global script in `index.html` (not as ES module).

## Conventions

- Puzzle positions use FEN notation. All puzzles have black to move (`b` in FEN).
- Navigation checkpoint system: `MenuCheckpoint` in state tracks which page the "Back" button should return to.
- Marathon mode: triggered by clicking a category name in level select (plays all levels in that category sequentially).
- Locked levels: levels beyond `beatenLevels[group]` get `deactivatelinks` CSS class.
- SCSS source is in `assets/styles/screen.scss`; the compiled `screen.css` is committed. Dark mode is handled via `prefers-color-scheme` media queries and the `data-emc-theme` attribute.
