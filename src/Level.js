/**
 * Author and copyright: Stefan Haack (https://shaack.com)
 * Repository: https://github.com/shaack/cm-chessboard-capture-them-all
 * License: MIT, see file 'LICENSE'
 */
import {COLOR} from "cm-chessboard/src/Chessboard.js"
import {MARKER_TYPE} from "cm-chessboard/src/extensions/markers/Markers.js"

export class Level {

    constructor(initialFen, game) {
        this.chessboard = game.chessboard
        this.chessboard.setPosition(initialFen, true)

        this.chessboard.context.addEventListener("pointerdown", (e) => {
            const square = e.target.getAttribute("data-square")
            if (square) {
                const piece = this.chessboard.getPiece(square)
                const blackPieceSquare = this.chessboard.state.position.getPieces(COLOR.black)[0].square
                if (piece && piece.charAt(0) === "w" && this.isValidMove(blackPieceSquare, square)) {
                    this.chessboard.movePiece(blackPieceSquare, square, true)
                    this.chessboard.context.style.cursor = ""
                    const piecesLeft = this.chessboard.state.position.getPieces(COLOR.white).length
                    // console.log("pieces left", piecesLeft)
                    if(piecesLeft === 0) {
                        game.levelFinished()
                    }
                }
            }
        })

        this.chessboard.context.addEventListener("mouseover", (e) => {
            const square = e.target.getAttribute("data-square")
            this.chessboard.removeMarkers()
            if (square) {
                const piece = this.chessboard.getPiece(square)
                if (piece) {
                    e.target.style.cursor = "pointer"
                    if(piece.charAt(0) === "w") {
                        this.chessboard.addMarker(MARKER_TYPE.frame, square)
                    }
                } else {
                    e.target.style.cursor = ""
                }
            }
        })

    }

    isValidMove(squareFrom, squareTo) {
        const piece = this.chessboard.getPiece(squareFrom)
        switch (piece.charAt(1)) {
            case "r":
                return this.validateRookMove(squareFrom, squareTo)
            case "b":
                return this.validateBishopMove(squareFrom, squareTo)
            case "q":
                return this.validateQueenMove(squareFrom, squareTo)
            case "n":
                return this.validateKnightMove(squareFrom, squareTo)
        }
    }

    validateRookMove(squareFrom, squareTo) {
        const fileFrom = squareFrom.charCodeAt(0) - 97
        const rankFrom = parseInt(squareFrom.charAt(1)) - 1
        const fileTo = squareTo.charCodeAt(0) - 97
        const rankTo = parseInt(squareTo.charAt(1)) - 1
        // prevent jumping over pieces
        if (fileFrom === fileTo) {
            for (let rank = Math.min(rankFrom, rankTo) + 1; rank < Math.max(rankFrom, rankTo); rank++) {
                const square = String.fromCharCode(fileFrom + 97) + (rank + 1)
                if (this.chessboard.getPiece(square)) {
                    return false
                }
            }
        }
        if (rankFrom === rankTo) {
            for (let file = Math.min(fileFrom, fileTo) + 1; file < Math.max(fileFrom, fileTo); file++) {
                const square = String.fromCharCode(file + 97) + (rankFrom + 1)
                if (this.chessboard.getPiece(square)) {
                    return false
                }
            }
        }
        if (fileFrom === fileTo || rankFrom === rankTo) {
            return true
        }
    }

    validateBishopMove(squareFrom, squareTo) {
        const fileFrom = squareFrom.charCodeAt(0) - 97
        const rankFrom = parseInt(squareFrom.charAt(1)) - 1
        const fileTo = squareTo.charCodeAt(0) - 97
        const rankTo = parseInt(squareTo.charAt(1)) - 1
        // prevent jumping over pieces
        for (let file = Math.min(fileFrom, fileTo) + 1; file < Math.max(fileFrom, fileTo); file++) {
            const rank = Math.min(rankFrom, rankTo) + (file - Math.min(fileFrom, fileTo))
            const square = String.fromCharCode(file + 97) + (rank + 1)
            if (this.chessboard.getPiece(square)) {
                return false
            }
        }
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
