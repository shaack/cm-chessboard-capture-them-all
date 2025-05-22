/**
 * Author and copyright: Stefan Haack (https://shaack.com)
 * Repository: https://github.com/shaack/cm-chessboard-capture-them-all
 * License: MIT, see file 'LICENSE'
 */
export class GameState {

    constructor() {
        if (!this.levelGroupName) {
            this.levelGroupName = "Rook"
            this.level = 0
        }
    }

    set levelGroupName(value) {
        localStorage.setItem("levelGroupName", JSON.stringify(value))
    }

    get levelGroupName() {
        return JSON.parse(localStorage.getItem("levelGroupName"))
    }

    set level(value) {
        localStorage.setItem("level", JSON.stringify(value))
    }

    get level() {
        return JSON.parse(localStorage.getItem("level"))
    }
}
