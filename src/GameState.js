/**
 * Author and copyright: Stefan Haack (https://shaack.com)
 * Repository: https://github.com/shaack/cm-chessboard-capture-them-all
 * License: MIT, see file 'LICENSE'
 */
export class GameState {

    constructor() {
        if (!this.levelGroupName) {
            this.levelGroupName = "Rook"
            this.marathonMode = false
            this.level = 0
            this.MenuCheckpoint = "game"
            
            if (!localStorage.getItem("beatenLevels")) {
                this.beatenLevels = {
                    Rook: 0,
                    Bishop: 0,
                    Knight: 0,
                    Queen: 0
                }
            }
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

    set marathonMode(bool) {
        localStorage.setItem("marathonMode", JSON.stringify(bool))
    }

    get marathonMode() {
        return JSON.parse(localStorage.getItem("marathonMode"))
    }

    set MenuCheckpoint(value) {
        localStorage.setItem("MenuCheckpoint", JSON.stringify(value))
    }

    get MenuCheckpoint() {
        return JSON.parse(localStorage.getItem("MenuCheckpoint"))
    }

    set beatenLevels(value) {
        localStorage.setItem("beatenLevels", JSON.stringify(value));
    }
    
    get beatenLevels() {
        return JSON.parse(localStorage.getItem("beatenLevels")) || {
            Rook: 0,
            Bishop: 0,
            Knight: 0,
            Queen: 0
        };
    }
}
