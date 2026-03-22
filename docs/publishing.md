# Capture Them All – Publishing

### Eigentumsverhältnisse

CrazyGames erwirbt **kein Eigentumsrecht** am Spiel. Laut den Developer Terms (Stand 08/2025):

> „These Terms and Conditions do not transfer any ownership rights in and to the Game(s) and Developer reserves all rights not expressly granted."

Der Entwickler bleibt vollständiger Rechteinhaber.

### Exklusivität (optional)

CrazyGames bietet zwei Modelle:

| Modell | Beschreibung | Vergütung |
|---|---|---|
| **Non-exclusive** (Standard) | Spiel darf auf anderen Portalen veröffentlicht werden | Standard-Rate |
| **Exclusive** | Exklusiv auf Browser-Gaming-Portalen für einen definierten Zeitraum | +50 % höhere Vergütung |

**Wichtig:** Exklusivität gilt **nur für Browser-Gaming-Websites**. Plattformen wie Steam, Apple App Store, Google Play Store und Facebook sind ausdrücklich ausgenommen.

### Mehrfach-Veröffentlichung

Ohne Exklusivvertrag ist eine Veröffentlichung auf weiteren Portalen problemlos möglich. Empfehlenswerte Alternativen:

| Portal | Besonderheit |
|---|---|
| **itch.io** | Sehr entwicklerfreundlich, keine Exklusivität, starke Indie-Community |
| **GameDistribution** | Ähnliches Revenue-Share-Modell wie CrazyGames |
| **Poki** | Qualitätsorientiert, etwas schwieriger reinzukommen |
| **Newgrounds** | Klassische Community, gut für Puzzle-/Casual-Games |

### SDK-Hinweis für Multi-Portal-Publishing

Das `CrazyGamesSDK.js` darf **nur auf CrazyGames** aktiv sein. Für andere Portale wird eine Version ohne SDK (oder mit neutralem Stub) benötigt.

Da das SDK sauber in `CrazyGamesSDK.js` gekapselt und in `App.js` instanziiert ist, lässt sich das einfach über eine separate Config oder einen No-Op-Stub lösen.
