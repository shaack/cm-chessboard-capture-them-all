export class MenuPage {
    constructor(app) {
        this.app = app
    }

    show(container) {
        this.app.state.MenuCheckpoint = "menu"
        container.innerHTML = `
            <div class="menu-background">
                <div class="menu-card">
                    <h1 class="menu-title">Capture Them All</h1>
                    <p class="menu-description">Move your chess piece and capture all the pawns. Master the rook, bishop, knight and queen across 40 puzzles.</p>
                    <div class="Menu">
                        <button class="play-button" id="menuLevelSelect">Play</button>
                    </div>
                </div>
            </div>
        `
        this.levelSelectLink = document.getElementById("menuLevelSelect")
        this.levelSelectHandler = (e) => {
            e.preventDefault()
            this.app.navigate("levelSelect")
        }
        this.levelSelectLink.addEventListener("click", this.levelSelectHandler)
    }

    hide() {
        if (this.levelSelectLink) {
            this.levelSelectLink.removeEventListener("click", this.levelSelectHandler)
        }
    }
}
