/**
 * Author and copyright: Stefan Haack (https://shaack.com)
 * Repository: https://github.com/shaack/cm-chessboard-capture-them-all
 * License: MIT, see file 'LICENSE'
 */
import {COLOR, INPUT_EVENT_TYPE} from "../node_modules/cm-chessboard/src/Chessboard.js"
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
                this.chessboard.enableMoveInput(this.moveInputHandler.bind(this), COLOR.black)
                this.autoSelectBlackPiece()
                if (this.tutorial) {
                    this.showTutorialStep()
                }
            }
        })

        this.moveSound = new Sample("./assets/chessmove.wav", {"gain": 0.5})
        this.transformSound = new Sample("./assets/take_piece.mp3")

        this.destroyed = false
        this.pendingCapturedType = null
    }

    moveInputHandler(event) {
        if (this.destroyed) return false
        switch (event.type) {
            case INPUT_EVENT_TYPE.moveInputStarted:
                return true
            case INPUT_EVENT_TYPE.validateMoveInput: {
                const targetPiece = this.chessboard.getPiece(event.squareTo)
                if (!targetPiece || targetPiece.charAt(0) !== "w") return false
                if (!this.isValidMove(event.squareFrom, event.squareTo)) return false
                this.pendingCapturedType = targetPiece.charAt(1)
                return true
            }
            case INPUT_EVENT_TYPE.moveInputFinished:
                if (event.legalMove) {
                    this.afterCapture(event.squareTo, this.pendingCapturedType)
                    this.pendingCapturedType = null
                }
                return false
        }
    }

    autoSelectBlackPiece() {
        const trySelect = () => {
            if (this.destroyed) return
            if (this.chessboard.view.visualMoveInput.moveInputState !== "waitForInputStart") {
                requestAnimationFrame(trySelect)
                return
            }
            const blackPieces = this.chessboard.state.position.getPieces(COLOR.black)
            if (!blackPieces.length) return
            const square = blackPieces[0].square
            const squareElem = this.chessboard.view.svg.querySelector(`[data-square='${square}']`)
            if (!squareElem) return
            const rect = squareElem.getBoundingClientRect()
            const x = rect.left + rect.width / 2
            const y = rect.top + rect.height / 2
            squareElem.dispatchEvent(new MouseEvent("mousedown", {bubbles: true, clientX: x, clientY: y, button: 0}))
            squareElem.dispatchEvent(new MouseEvent("mouseup", {bubbles: true, clientX: x, clientY: y, button: 0}))
        }
        requestAnimationFrame(trySelect)
    }

    async afterCapture(square, capturedPieceType) {
        if (this.destroyed) return
        const transformed = capturedPieceType && capturedPieceType !== "p"
        if (this.game.app.state.soundEnabled) {
            if (transformed) {
                this.transformSound.play()
            } else {
                this.moveSound.play()
            }
        }
        if (transformed) {
            const newBlackPiece = `b${capturedPieceType}`
            await this.chessboard.setPiece(square, newBlackPiece)
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
        } else {
            this.autoSelectBlackPiece()
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
        this.chessboard.disableMoveInput()
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
