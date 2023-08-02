import {Extension} from "cm-chessboard/src/model/Extension.js"
import {INPUT_EVENT_TYPE} from "cm-chessboard/src/Chessboard.js"
import {Markers} from "cm-chessboard/src/extensions/markers/Markers.js"

/**
 * Author and copyright: Stefan Haack (https://shaack.com)
 * Repository: https://github.com/shaack/cm-chessboard-capture-them-all
 * License: MIT, see file 'LICENSE'
 */
export class CaptureThemAll extends Extension {
    /** constructor */
    constructor(chessboard, props = {}) {
        super(chessboard)
        console.log(this.createRandomPosition())
        chessboard.addExtension(Markers)
        chessboard.enableMoveInput((event) => {
            if(!event.squareFrom) {
                return false
            }
            const piece = this.chessboard.getPiece(event.squareFrom)
            switch (event.type) {
                case INPUT_EVENT_TYPE.moveInputStarted:
                    return piece && piece.charAt(0) === "b"
                case INPUT_EVENT_TYPE.moveInputCanceled:
                    return true
                case INPUT_EVENT_TYPE.validateMoveInput:
                    if(!chessboard.getPiece(event.squareTo)) {
                        return false
                    }
                    switch (piece.charAt(1)) {
                        case "r":
                            return this.validateRookMove(event.squareFrom, event.squareTo)
                        case "b":
                            return this.validateBishopMove(event.squareFrom, event.squareTo)
                        case "q":
                            return this.validateQueenMove(event.squareFrom, event.squareTo)
                        case "n":
                            return this.validateKnightMove(event.squareFrom, event.squareTo)
                    }
                    return false
            }
        })
        chessboard.startPuzzle = this.startPuzzle.bind(this)
    }

    startPuzzle(position) {
        this.chessboard.setPosition(position)
    }

    validateRookMove(squareFrom, squareTo) {
        // validate rook move
        const fileFrom = squareFrom.charCodeAt(0) - 97
        const rankFrom = parseInt(squareFrom.charAt(1)) - 1
        const fileTo = squareTo.charCodeAt(0) - 97
        const rankTo = parseInt(squareTo.charAt(1)) - 1
        if (fileFrom === fileTo || rankFrom === rankTo) {
            return true
        }
    }

    validateBishopMove(squareFrom, squareTo) {
        // validate bishop move
        const fileFrom = squareFrom.charCodeAt(0) - 97
        const rankFrom = parseInt(squareFrom.charAt(1)) - 1
        const fileTo = squareTo.charCodeAt(0) - 97
        const rankTo = parseInt(squareTo.charAt(1)) - 1
        if (Math.abs(fileFrom - fileTo) === Math.abs(rankFrom - rankTo)) {
            return true
        }
    }

    validateQueenMove(squareFrom, squareTo) {
        return this.validateRookMove(squareFrom, squareTo) || this.validateBishopMove(squareFrom, squareTo)
    }

    validateKnightMove(squareFrom, squareTo) {
        // validate knight move
        const fileFrom = squareFrom.charCodeAt(0) - 97
        const rankFrom = parseInt(squareFrom.charAt(1)) - 1
        const fileTo = squareTo.charCodeAt(0) - 97
        const rankTo = parseInt(squareTo.charAt(1)) - 1
        if (Math.abs(fileFrom - fileTo) === 1 && Math.abs(rankFrom - rankTo) === 2) {
            return true
        }
        if (Math.abs(fileFrom - fileTo) === 2 && Math.abs(rankFrom - rankTo) === 1) {
            return true
        }
    }

}
