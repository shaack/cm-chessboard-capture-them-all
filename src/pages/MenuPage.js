export class MenuPage {
    constructor(app) {
        this.app = app
    }

    show(container) {
        this.app.state.MenuCheckpoint = "menu"
        container.innerHTML = `
            <h1>Capture Them All</h1>
            <div class="Menu">
                <a href="#" id="menuLevelSelect">Level select</a>
                <a href="#" id="menuSettings">Settings</a>
            </div>
        `
        this.levelSelectLink = document.getElementById("menuLevelSelect")
        this.settingsLink = document.getElementById("menuSettings")
        this.levelSelectHandler = (e) => {
            e.preventDefault()
            this.app.navigate("levelSelect")
        }
        this.settingsHandler = (e) => {
            e.preventDefault()
            this.app.navigate("settings")
        }
        this.levelSelectLink.addEventListener("click", this.levelSelectHandler)
        this.settingsLink.addEventListener("click", this.settingsHandler)
    }

    hide() {
        if (this.levelSelectLink) {
            this.levelSelectLink.removeEventListener("click", this.levelSelectHandler)
        }
        if (this.settingsLink) {
            this.settingsLink.removeEventListener("click", this.settingsHandler)
        }
    }
}
