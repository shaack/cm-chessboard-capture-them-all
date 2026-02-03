import {Game} from "../Game.js"

export class GamePage {
    constructor(app) {
        this.app = app
        this.game = null
    }

    show(container) {
        container.innerHTML = `
            <div id="myNav" class="overlay">
                <a href="#" id="closebtn" class="closebtn">&times;</a>
                <div class="overlay-content">
                    <a href="#" id="navSettings">Settings</a>
                    <a href="#" id="navLevelSelect">Level select</a>
                    <a href="#" id="navMenu">Menu</a>
                </div>
            </div>
            <div class="buttons" id="buttons">
                <button class="button" id="restartButton">Level restart</button>
                <button class="menubutton" id="menuButton"><i class="fa fa-bars"></i></button>
            </div>
            <div class="level-info" style="text-align: center; margin-top: 20px;">
                <h3><span id="levelGroup">--</span>
                Level: <span id="level">--</span></h3>
            </div>
            <div class="board" id="board" style="max-width: 640px">
            </div>
        `

        this.restartButton = document.getElementById("restartButton")
        this.menuButton = document.getElementById("menuButton")
        this.closebtn = document.getElementById("closebtn")
        this.navSettings = document.getElementById("navSettings")
        this.navLevelSelect = document.getElementById("navLevelSelect")
        this.navMenu = document.getElementById("navMenu")

        this.restartHandler = () => { this.game.restartLevel() }
        this.menuOpenHandler = () => { this.openNav() }
        this.closeHandler = (e) => { e.preventDefault(); this.closeNav() }
        this.navSettingsHandler = (e) => { e.preventDefault(); this.closeNav(); this.app.navigate("settings") }
        this.navLevelSelectHandler = (e) => { e.preventDefault(); this.closeNav(); this.app.navigate("levelSelect") }
        this.navMenuHandler = (e) => { e.preventDefault(); this.closeNav(); this.app.navigate("menu") }

        this.restartButton.addEventListener("click", this.restartHandler)
        this.menuButton.addEventListener("click", this.menuOpenHandler)
        this.closebtn.addEventListener("click", this.closeHandler)
        this.navSettings.addEventListener("click", this.navSettingsHandler)
        this.navLevelSelect.addEventListener("click", this.navLevelSelectHandler)
        this.navMenu.addEventListener("click", this.navMenuHandler)

        const boardElement = document.querySelector(".board")
        this.game = new Game(boardElement, () => {
            this.app.navigate("menu")
        })
    }

    openNav() {
        document.getElementById("myNav").style.display = "block"
    }

    closeNav() {
        document.getElementById("myNav").style.display = "none"
    }

    hide() {
        if (this.restartButton) {
            this.restartButton.removeEventListener("click", this.restartHandler)
        }
        if (this.menuButton) {
            this.menuButton.removeEventListener("click", this.menuOpenHandler)
        }
        if (this.closebtn) {
            this.closebtn.removeEventListener("click", this.closeHandler)
        }
        if (this.navSettings) {
            this.navSettings.removeEventListener("click", this.navSettingsHandler)
        }
        if (this.navLevelSelect) {
            this.navLevelSelect.removeEventListener("click", this.navLevelSelectHandler)
        }
        if (this.navMenu) {
            this.navMenu.removeEventListener("click", this.navMenuHandler)
        }
        if (this.game) {
            this.game.destroy()
            this.game = null
        }
    }
}
