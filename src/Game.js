/**
 * Author and copyright: Stefan Haack (https://shaack.com)
 * Repository: https://github.com/shaack/cm-chessboard-capture-them-all
 * License: MIT, see file 'LICENSE'
 */
import {Chessboard} from "cm-chessboard/src/Chessboard.js"
import {Markers} from "cm-chessboard/src/extensions/markers/Markers.js"
import {Level} from "./Level.js"
import {GameState} from "./GameState.js"

export const LEVEL_FENS = [
    [ // Rook
        "8/8/8/8/3Pr3/8/8/8 w - - 0 1",
        "8/8/8/8/2P1r3/8/8/8 w - - 0 1",
        "8/8/8/8/1P2r3/8/8/8 w - - 0 1",
        "8/1P6/8/1P1r4/8/1P2P3/8/8 w - - 0 1",
        "1P5P/2P3P1/8/8/P2r4/2P5/1P4P1/P6P w - - 0 1",
        "8/8/4P3/8/8/4P2P/1r2P3/P3P2P w - - 0 1",
        "8/1P5P/8/P3P3/8/1P1P1P2/P6P/1P1r4 w - - 0 1",
    ],
    [ // Bishop
        "8/8/4P3/1P1b4/2P5/3P4/8/8 w - - 0 1",
        "4P1P1/8/P1P1P3/8/P3b3/7P/P3P3/3P1P2 w - - 0 1",
    ],
    [ // Knight
        "8/8/8/3P4/5n2/8/8/8 w - - 0 1",
        "n5P1/4P3/1P5P/3P4/6P1/8/5P2/7P w - - 0 1",
    ]
]
export class Game {

    constructor() {
        this.restartButton = document.getElementById("restartButton")
        this.resetButton = document.getElementById("resetButton")
        restartButton.addEventListener("click", this.restartLevel.bind(this))
        resetButton.addEventListener("click", this.resetGame.bind(this))
        this.chessboard = new Chessboard(document.querySelector(".board"), {
            assetsUrl: "./node_modules/cm-chessboard/assets/",
            style: {showCoordinates: true},
            extensions: [{class: Markers}]
        })
        this.state = new GameState()
        this.restartLevel()
    }

    levelFinished() {
        console.log("levelFinished, TODO win animation")
        setTimeout(() => {
            this.nextLevel()
        }, 500)

    }

    nextLevel() {
        if(this.state.levelGroup === null) {
            this.state.levelGroup = 0
            this.state.level = 0
        } else {
            this.state.level++
        }
        if(!LEVEL_FENS[this.state.levelGroup][this.state.level]) {
            if(this.state.levelGroup < LEVEL_FENS.length - 1) {
            this.state.levelGroup++
            this.state.level = 0
            
        } else {
                console.log("game finished")
                return
            }
        }
        this.state.currentLevel = new Level(LEVEL_FENS[this.state.levelGroup][this.state.level], this)
    }

    restartLevel() {
        this.state.currentLevel = new Level(LEVEL_FENS[this.state.levelGroup][this.state.level], this)
    }

    resetGame() {
        this.state.levelGroup = 0
        this.state.level = 0
        this.state.currentLevel = new Level(LEVEL_FENS[this.state.levelGroup][this.state.level], this)
    }
}
