import {Game} from "../Game.js"

export class GamePage {
    constructor(app) {
        this.app = app
        this.game = null
    }

    show(container) {
        container.innerHTML = `
            <div class="page-background game-page">
                <div class="level-info">
                    <h3><span id="levelGroup">--</span>
                    Level: <span id="level">--</span></h3>
                </div>
                <div class="board" id="board"></div>
                <div class="game-buttons">
                    <button class="game-btn" id="restartButton">Restart</button>
                    <button class="game-btn game-btn-exit" id="exitButton">Exit</button>
                </div>
            </div>
        `

        this.restartButton = document.getElementById("restartButton")
        this.exitButton = document.getElementById("exitButton")

        this.restartHandler = () => { this.game.restartLevel() }
        this.exitHandler = () => { this.app.navigate("levelSelect") }

        this.restartButton.addEventListener("click", this.restartHandler)
        this.exitButton.addEventListener("click", this.exitHandler)

        const boardElement = document.querySelector(".board")
        this.game = new Game(boardElement, this.app, () => {
            this.app.navigate("menu")
        })
    }

    hide() {
        if (this.restartButton) {
            this.restartButton.removeEventListener("click", this.restartHandler)
        }
        if (this.exitButton) {
            this.exitButton.removeEventListener("click", this.exitHandler)
        }
        if (this.game) {
            this.app.sdk.gameplayStop()
            this.game.destroy()
            this.game = null
        }
    }
}
