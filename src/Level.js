/**
 * Author and copyright: Stefan Haack (https://shaack.com)
 * Repository: https://github.com/shaack/cm-chessboard-capture-them-all
 * License: MIT, see file 'LICENSE'
 */
import {COLOR} from "cm-chessboard/src/Chessboard.js"
import {MARKER_TYPE} from "cm-chessboard/src/extensions/markers/Markers.js"
import {Sample} from "/node_modules/cm-web-modules/src/audio/Sample.js"
import {createAudioContext} from "/node_modules/cm-web-modules/src/audio/Audio.js"

export class Level {

    constructor(initialFen, game) {
        this.chessboard = game.chessboard
        this.chessboard.setPosition(initialFen, true)

        if (!window.cmAudioContext) {
            createAudioContext()
        }

        this.moveSound = new Sample("./node_modules/cm-web-modules/assets/move.mp3")

        this.chessboard.context.addEventListener("pointerdown", (e) => {
            const square = e.target.getAttribute("data-square")
            if (square) {
                const piece = this.chessboard.getPiece(square)
                const blackPieceSquare = this.chessboard.state.position.getPieces(COLOR.black)[0].square
                if (piece && piece.charAt(0) === "w" && this.isValidMove(blackPieceSquare, square)) {
                    this.chessboard.movePiece(blackPieceSquare, square, true)
                    this.chessboard.context.style.cursor = ""
                    const piecesLeft = this.chessboard.state.position.getPieces(COLOR.white).length
                    this.moveSound.play()
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
        // must move on a diagonal
        const fileDiff = fileTo - fileFrom
        const rankDiff = rankTo - rankFrom
        if (Math.abs(fileDiff) !== Math.abs(rankDiff) || fileDiff === 0) {
            return false
        }
        // prevent jumping over pieces by checking every intermediate square
        const fileStep = fileDiff > 0 ? 1 : -1
        const rankStep = rankDiff > 0 ? 1 : -1
        for (let i = 1; i < Math.abs(fileDiff); i++) {
            const file = fileFrom + i * fileStep
            const rank = rankFrom + i * rankStep
            const square = String.fromCharCode(file + 97) + (rank + 1)
            if (this.chessboard.getPiece(square)) {
                return false
            }
        }
        return true
    }

    validateQueenMove(squareFrom, squareTo) {
        console.log("validateRookMove", this.validateRookMove(squareFrom, squareTo))
        console.log("validateBishopMove", this.validateBishopMove(squareFrom, squareTo))
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
