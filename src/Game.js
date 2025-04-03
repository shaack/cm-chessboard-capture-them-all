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
        "8/8/8/8/2P1rP2/8/8/8 b - - 0 1",
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
        "1P4P1/3PPP2/1P1P3P/3PkP2/1P2P3/3P1P2/3P4/4P3 b - - 0 1",
        "P2P3P/1PP1PP2/1PPPPPP1/1PPnPP1P/P1PP1PP1/1PPPP1P1/2PP1PP1/P3P2P b - - 0 1",
        "PPPPnPPP/PPPPPPPP/PPPPPPPP/PPPPPPPP/PPPPPPPP/PPPPPPPP/PPPPPPPP/PPPPPPPP b - - 0 1",
    ],
    [ // Queen
        "4P3/1q6/2P3P2/P6P/8/5P1P/7P/1P2P3 b - - 0 1",
        "",
        "",
        "",
        "",
    ],

]

export class Game {

    constructor() {
        this.restartButton = document.getElementById("restartButton")
        this.resetButton = document.getElementById("resetButton")
        this.explanation = document.getElementById("explanation")
        this.restartButton.addEventListener("click", this.restartLevel.bind(this))   
        this.resetButton.addEventListener("click", this.resetGame.bind(this))
        this.chessboard = new Chessboard(document.querySelector(".board"), {
            assetsUrl: "./node_modules/cm-chessboard/assets/",
            style: {showCoordinates: true},
            extensions: [{class: Markers}]
        })
        this.state = new GameState()
        this.restartLevel()
        this.levelUI()
    }

    levelUI() {
        const levelGroup = document.getElementById("levelGroup")
        const level = document.getElementById("level")
        levelGroup.innerText = this.state.levelGroup + 1
        level.innerText = this.state.level + 1
    }

    levelFinished() {
        console.log("levelFinished, TODO win animation")
        setTimeout(() => {
            this.nextLevel()
        }, 500)

    }

    nextLevel() {
        this.state.level++
        if (!LEVEL_FENS[this.state.levelGroup][this.state.level]) {
            if (this.state.levelGroup < LEVEL_FENS.length - 1) {
                this.state.levelGroup++
                this.state.level = 0
            } else {
                console.log("game finished")
                this.restartButton.style.display = "none"
                this.explanation.style.display = "none"
                return
            }
        }
        this.levelUI()
        this.state.currentLevel = new Level(LEVEL_FENS[this.state.levelGroup][this.state.level], this)
    }

    restartLevel() {
        this.state.currentLevel = new Level(LEVEL_FENS[this.state.levelGroup][this.state.level], this)
        this.levelUI()
    }

    restartGroup() {

    }

    resetGame() {
        this.state.levelGroup = 0
        this.state.level = 0
        this.state.currentLevel = new Level(LEVEL_FENS[this.state.levelGroup][this.state.level], this)
        this.explanation.style.display = "none"
        this.restartButton.style.display = "block"
        this.levelUI()
    }
}
