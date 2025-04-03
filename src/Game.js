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
        "1P5P/2P3P1/8/8/P2r4/2P5/1P4P1/P6P b - - 0 1",
        "8/1P6/8/1P1r4/8/1P2P3/8/8 b - - 0 1",
        "8/8/4P3/8/8/4P2P/1r2P3/P3P2P b - - 0 1",
        "8/1P5P/8/P3P3/8/1P1P1P2/P6P/1P1r4 b - - 0 1",
        "8/8/PP3P2/8/Pr3P2/3P4/P4P2/1P1P4 b - - 0 1",
    ],
    [ // Bishop
        "8/8/4P3/1P1b4/2P5/3P4/8/8 b - - 0 1",
        "4P1P1/8/P1P1P3/8/P3b3/7P/P3P3/3P1P2 b - - 0 1",
        "3P1P2/2P5/1P5P/P5P1/3b4/4P1P1/8/4P3 b - - 0 1",
        "6P1/1P5P/P7/3P4/4b3/3P3P/P5P1/1P3P2 b - - 0 1",
    ],
    [ // Knight
        "n5P1/4P3/1P5P/3P4/6P1/8/5P2/7P b - - 0 1",
        "8/8/4PP2/3P3P/3n1P2/4P1P1/8/5P2 b - - 0 1",
        "8/8/2P5/4P3/1P1n1P2/3P1P2/2P3P1/4P3 b - - 0 1",
        "8/3P4/5P2/2P1P3/4P1P1/3P2n1/5P2/7P b - - 0 1",
        "8/8/8/8/3nPPP1/3P2P1/3PPP1P/5P2 b - - 0 1",
    ],

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
