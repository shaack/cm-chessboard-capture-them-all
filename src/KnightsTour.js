import {CtaLevel} from "./CtaLevel.js"
import {Position} from "cm-chessboard/src/model/Position.js"

/**
 * Author and copyright: Stefan Haack (https://shaack.com)
 * Repository: https://github.com/shaack/cm-chessboard-capture-them-all
 * License: MIT, see file 'LICENSE'
 */
export class KnightsTour extends CtaLevel {
    constructor(chessboard) {
        super(chessboard)
    }
    startPuzzle(startSquare = "a1", size = 8) {
        const position = this.createPosition(startSquare, size)
        this.chessboard.setPosition(position.getFen())
    }
    createPosition(startSquare, size) {
        const position = new Position()
        for (let i = 0; i < 64; i++) {
            position.squares[i] = "wp"
        }
        position.setPiece(startSquare, "bn")
        return position
    }
}
