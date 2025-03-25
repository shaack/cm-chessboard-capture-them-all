/**
 * Author and copyright: Stefan Haack (https://shaack.com)
 * Repository: https://github.com/shaack/cm-chessboard-capture-them-all
 * License: MIT, see file 'LICENSE'
 */
import {Chessboard} from "cm-chessboard/src/Chessboard.js"
import {Markers} from "cm-chessboard/src/extensions/markers/Markers.js"
import {Level} from "./Level.js"

export const LEVEL_FENS = {
    "Knight": [
        "n5P1/4P3/1P5P/3P4/6P1/8/5P2/7P w - - 0 1",
        "8/8/8/8/8/8/8/8 w - - 0 1",
        "8/8/8/8/8/8/8/8 w - - 0 1",
        "8/8/8/8/8/8/8/8 w - - 0 1",
        "8/8/8/8/8/8/8/8 w - - 0 1"
    ],
    "Rook": [
        "1P5P/2P3P1/8/8/P2r4/2P5/1P4P1/P6P w - - 0 1",
        "8/8/4P3/8/8/4P2P/1r2P3/P3P2P w - - 0 1",
        "8/8/8/8/8/8/8/8 w - - 0 1",
        "8/8/8/8/8/8/8/8 w - - 0 1",
        "8/8/8/8/8/8/8/8 w - - 0 1"
    ],
    "Bishop": [
        "8/8/8/8/8/8/8/8 w - - 0 1",
        "8/8/8/8/8/8/8/8 w - - 0 1",
        "8/8/8/8/8/8/8/8 w - - 0 1",
        "8/8/8/8/8/8/8/8 w - - 0 1",
        "8/8/8/8/8/8/8/8 w - - 0 1"
    ]
}
export class Game {
    /** @constructor */
    constructor(chessboard) {
        this.chessboard = new Chessboard(document.querySelector(".board"), {
            assetsUrl: "./node_modules/cm-chessboard/assets/",
            style: {showCoordinates: true},
            extensions: [{class: Markers}]
        })
        this.currentLevel = new Level(LEVEL_FENS.Rook[0], this.chessboard)
    }
}
