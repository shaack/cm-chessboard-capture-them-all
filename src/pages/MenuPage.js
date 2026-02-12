export class MenuPage {
    constructor(app) {
        this.app = app
    }

    show(container) {
        this.app.state.MenuCheckpoint = "menu"
        container.innerHTML = `
            <div class="menu-background">
                <div class="menu-card menu-card-fade-in">
                    <h1 class="menu-title">Capture Them All</h1>
                    <p class="menu-description">Move your chess piece and capture all the pawns. Master the rook, bishop, knight and queen across 40 puzzles.</p>
                    <div class="Menu">
                        <button class="play-button" id="menuLevelSelect">Play</button>
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
                this.app.navigate("levelSelect")
            }, {once: true})
        }
        this.levelSelectLink.addEventListener("click", this.levelSelectHandler)
    }

    hide() {
        if (this.levelSelectLink) {
            this.levelSelectLink.removeEventListener("click", this.levelSelectHandler)
        }
    }
}
