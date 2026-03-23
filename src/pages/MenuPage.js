export class MenuPage {
    constructor(app) {
        this.app = app
    }

    show(container) {
        this.app.state.MenuCheckpoint = "menu"
        // Preload BGM so it starts instantly on first interaction
        if (!this.app.bgmPreloaded) {
            fetch("./assets/bgm1.mp3").then(() => { this.app.bgmPreloaded = true })
        }
        container.innerHTML = `
            <div class="menu-background">
                <div class="menu-card menu-card-fade-in">
                    <h1 class="menu-title">Capture Them All</h1>
                    <p class="menu-description">Move your chess piece and capture all the pawns. Master the rook, bishop, knight and queen in increasingly challenging puzzles.</p>
                    <div class="Menu">
                        <button class="play-button" id="menuLevelSelect">Play</button>
                        ${this.app.debugMode ? '<button class="play-button" id="debugGameComplete" style="margin-top: 10px; opacity: 0.5;">Debug: Game Complete</button>' : ''}
                    </div>
                    <div class="menu-settings">
                        <button class="game-btn game-btn-exit" id="menuSettings">Settings</button>
                    </div>
                </div>
            </div>
        `
        this.card = container.querySelector(".menu-card")
        this.levelSelectLink = document.getElementById("menuLevelSelect")
        this.levelSelectHandler = (e) => {
            e.preventDefault()
            this.card.classList.remove("menu-card-fade-in")
            this.card.classList.add("menu-card-fade-out")
            this.card.addEventListener("animationend", () => {
                if (!this.app.state.tutorialCompleted) {
                    this.app.state.levelGroupName = "Rook"
                    this.app.state.level = 0
                    this.app.navigate("game")
                } else {
                    this.app.navigate("levelSelect")
                }
            }, {once: true})
        }
        this.levelSelectLink.addEventListener("click", this.levelSelectHandler)
        this.settingsLink = document.getElementById("menuSettings")
        this.settingsHandler = (e) => {
            e.preventDefault()
            this.card.classList.remove("menu-card-fade-in")
            this.card.classList.add("menu-card-fade-out")
            this.card.addEventListener("animationend", () => {
                this.app.navigate("settings")
            }, {once: true})
        }
        this.settingsLink.addEventListener("click", this.settingsHandler)
        if (this.app.debugMode) {
            this.debugButton = document.getElementById("debugGameComplete")
            this.debugHandler = () => { this.app.navigate("gameComplete") }
            this.debugButton.addEventListener("click", this.debugHandler)
        }
    }

    hide() {
        if (this.levelSelectLink) {
            this.levelSelectLink.removeEventListener("click", this.levelSelectHandler)
        }
        if (this.settingsLink) {
            this.settingsLink.removeEventListener("click", this.settingsHandler)
        }
        if (this.debugButton) {
            this.debugButton.removeEventListener("click", this.debugHandler)
        }
    }
}
