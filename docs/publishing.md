# Capture Them All – Publishing

### Pre-publishing checklist

1. **Run e2e tests**
   ```bash
   python3 -m http.server 8081 & node tests/e2e.js; kill %1
   ```
   All levels must be solvable, all 3 test scenarios must pass.

2. **Analyze level difficulty**
   ```bash
   node tools/level-tool.js analyze --file src/level-sets/level-set-2-2026-02-15.js
   ```
   Verify scores increase progressively per piece type.

3. **Compile CSS**
   ```bash
   npm run build:css
   ```

4. **Build production bundle**
   ```bash
   ./build.sh
   ```
   This creates `dist/` and `capture-them-all.zip`.

5. **Test locally from dist/**
   ```bash
   cd dist && python3 -m http.server 8080
   ```
   Open `http://localhost:8080` and verify:
   - Game loads without console errors
   - Music and sound effects play
   - Tutorial shows on first play (clear localStorage first)
   - Settings page toggles work
   - All piece types are playable

6. **Test on CrazyGames QA**
   - Upload `capture-them-all.zip` to the Developer Portal
   - Open the QA preview URL
   - Verify in the **game's iframe console** (not the parent page):
     - `CrazyGamesSDK: initialized` appears
     - Mute button works (`settingsChange, muteAudio: true/false`)
     - Ads trigger correctly (midgame ads between levels)
     - Cloud save syncs (`getItem`/`setItem` logs)

7. **Submit for review**

---

### Ownership

CrazyGames does **not** acquire any ownership rights to the game. According to the Developer Terms (as of 08/2025):

> "These Terms and Conditions do not transfer any ownership rights in and to the Game(s) and Developer reserves all rights not expressly granted."

The developer retains full ownership.

### Exclusivity (optional)

CrazyGames offers two models:

| Model | Description | Compensation |
|---|---|---|
| **Non-exclusive** (default) | Game may be published on other portals | Standard rate |
| **Exclusive** | Exclusive to browser gaming portals for a defined period | +50% higher compensation |

**Important:** Exclusivity applies **only to browser gaming websites**. Platforms like Steam, Apple App Store, Google Play Store, and Facebook are explicitly excluded.

### Multi-portal publishing

Without an exclusivity agreement, publishing on additional portals is straightforward. Recommended alternatives:

| Portal | Notes |
|---|---|
| **itch.io** | Very developer-friendly, no exclusivity required, strong indie community |
| **GameDistribution** | Similar revenue-share model to CrazyGames |
| **Poki** | Quality-focused, somewhat harder to get accepted |
| **Newgrounds** | Classic community, good for puzzle/casual games |

### SDK note for multi-portal publishing

The `CrazyGamesSDK.js` must **only be active on CrazyGames**. For other portals, a version without the SDK (or with a neutral stub) is needed.

Since the SDK is cleanly encapsulated in `CrazyGamesSDK.js` and instantiated in `App.js`, this can easily be solved with a separate config or a no-op stub.
