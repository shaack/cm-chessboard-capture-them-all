import {Game} from "../Game.js"

export class GamePage {
    constructor(app) {
        this.app = app
        this.game = null
    }

    show(container) {
        container.innerHTML = `
            <div class="page-background game-page">
                <div class="board" id="board"></div>
                <div class="game-toolbar">
                    <div class="level-info">
                        <span id="levelGroup">--</span> Level: <span id="level">--</span>
                    </div>
                    <div class="game-buttons">
                        <button class="btn-primary no-sound" id="undoButton" disabled>Undo</button>
                        <button class="btn-secondary" id="restartButton" disabled>Restart</button>
                        <button class="btn-secondary" id="exitButton"><span class="label-desktop">All Levels</span><span class="label-mobile">Levels</span></button>
                    </div>
                </div>
            </div>
        `

        this.undoButton = document.getElementById("undoButton")
        this.restartButton = document.getElementById("restartButton")
        this.exitButton = document.getElementById("exitButton")

        this.undoHandler = () => { this.game.undo() }
        this.restartHandler = () => { this.game.restartLevel() }
        this.exitHandler = () => { this.app.navigate("levelSelect") }

        this.undoButton.addEventListener("click", this.undoHandler)
        this.restartButton.addEventListener("click", this.restartHandler)
        this.exitButton.addEventListener("click", this.exitHandler)

        const boardElement = document.querySelector(".board")
        this.game = new Game(boardElement, this.app, () => {
            this.app.navigate("menu")
        })
    }

    hide() {
        if (this.undoButton) {
            this.undoButton.removeEventListener("click", this.undoHandler)
        }
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
