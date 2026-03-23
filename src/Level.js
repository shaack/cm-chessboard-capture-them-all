/**
 * Author and copyright: Stefan Haack (https://shaack.com)
 * Repository: https://github.com/shaack/cm-chessboard-capture-them-all
 * License: MIT, see file 'LICENSE'
 */
import {COLOR} from "../node_modules/cm-chessboard/src/Chessboard.js"
import {MARKER_TYPE} from "../node_modules/cm-chessboard/src/extensions/markers/Markers.js"
import {ARROW_TYPE} from "../node_modules/cm-chessboard/src/extensions/arrows/Arrows.js"
import {Sample} from "../node_modules/cm-web-modules/src/audio/Sample.js"

export class Level {

    constructor(initialFen, game, tutorial = false) {
        this.game = game
        this.chessboard = game.chessboard
        this.tutorial = tutorial
        this.tutorialStep = 0
        this.ready = false
        this.chessboard.setPosition(initialFen, true).then(() => {
            if (!this.destroyed) {
                this.ready = true
                if (this.tutorial) {
                    this.showTutorialStep()
                }
            }
        })

        this.moveSound = new Sample("./assets/take_piece.mp3")

        this.destroyed = false

        this.pointerdownHandler = (e) => {
            if (this.destroyed || !this.ready) return
            const square = e.target.getAttribute("data-square")
            if (square) {
                const piece = this.chessboard.getPiece(square)
                const blackPieces = this.chessboard.state.position.getPieces(COLOR.black)
                if (!blackPieces.length) return
                const blackPieceSquare = blackPieces[0].square

                if (piece && piece.charAt(0) === "w" && this.isValidMove(blackPieceSquare, square)) {
                    const capturedType = piece.charAt(1)
                    this.chessboard.movePiece(blackPieceSquare, square, true)
                    this.afterCapture(square, capturedType)
                }
            }
        }

        this.mouseoverHandler = (e) => {
            const square = e.target.getAttribute("data-square")
            this.chessboard.removeMarkers()
            if (square) {
                const piece = this.chessboard.getPiece(square)
                if (piece) {
                    e.target.style.cursor = "pointer"
                    if (piece.charAt(0) === "w") {
                        this.chessboard.addMarker(MARKER_TYPE.frame, square)
                    }
                } else {
                    e.target.style.cursor = ""
                }
            }
        }

        this.chessboard.context.addEventListener("pointerdown", this.pointerdownHandler)
        this.chessboard.context.addEventListener("mouseover", this.mouseoverHandler)
    }

    afterCapture(square, capturedPieceType) {
        if (this.destroyed) return
        if (capturedPieceType && capturedPieceType !== "p") {
            const newBlackPiece = `b${capturedPieceType}`
            this.chessboard.setPiece(square, newBlackPiece)
        }
        this.chessboard.context.style.cursor = ""
        if (this.game.app.state.soundEnabled) {
            this.moveSound.play()
        }
        if (this.tutorial) {
            this.chessboard.removeArrows()
            this.tutorialStep++
            this.showTutorialStep()
        }
        const piecesLeft = this.chessboard.state.position.getPieces(COLOR.white).length
        if (piecesLeft === 0) {
            if (this.tutorial) {
                this.hideTutorialHint()
                this.game.app.state.tutorialCompleted = true
            }
            this.game.levelFinished()
        }
    }

    showTutorialStep() {
        if (this.tutorialStep === 0) {
            this.chessboard.addArrow(ARROW_TYPE.default, "e4", "c4")
            this.showTutorialHint("You are black and must capture all white pawns. Click this one first.")
        } else if (this.tutorialStep === 1) {
            this.showTutorialHint("Well done! Now capture the remaining two pawns.")
        }
    }

    showTutorialHint(text) {
        this.hideTutorialHint()
        this.tutorialHint = document.createElement("div")
        this.tutorialHint.className = "tutorial-hint"
        this.tutorialHint.textContent = text
        this.chessboard.context.parentElement.appendChild(this.tutorialHint)
    }

    hideTutorialHint() {
        if (this.tutorialHint) {
            this.tutorialHint.remove()
            this.tutorialHint = null
        }
    }

    destroy() {
        this.destroyed = true
        this.hideTutorialHint()
        this.chessboard.removeArrows()
        this.chessboard.context.removeEventListener("pointerdown", this.pointerdownHandler)
        this.chessboard.context.removeEventListener("mouseover", this.mouseoverHandler)
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
