/**
 * Author and copyright: Stefan Haack (https://shaack.com)
 * Repository: https://github.com/shaack/cm-chessboard-capture-them-all
 * License: MIT, see file 'LICENSE'
 */
export class GameState {

    constructor() {
        if (this.levelGroup === null) {
            this.levelGroup = 0
            this.level = 0
        }
    }

    set levelGroup(value) {
        localStorage.setItem("levelGroup", JSON.stringify(value))
    }

    get levelGroup() {
        return JSON.parse(localStorage.getItem("levelGroup"))
    }

    set level(value) {
        localStorage.setItem("level", JSON.stringify(value))
    }

    get level() {
        return JSON.parse(localStorage.getItem("level"))
    }
}
