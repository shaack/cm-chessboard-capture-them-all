/**
 * Author and copyright: Stefan Haack (https://shaack.com)
 * Repository: https://github.com/shaack/cm-chessboard-capture-them-all
 * License: MIT, see file 'LICENSE'
 */
import {COLOR, INPUT_EVENT_TYPE} from "../node_modules/cm-chessboard/src/Chessboard.js"
import {MARKER_TYPE} from "../node_modules/cm-chessboard/src/extensions/markers/Markers.js"
import {ARROW_TYPE} from "../node_modules/cm-chessboard/src/extensions/arrows/Arrows.js"
import {Sample} from "../node_modules/cm-web-modules/src/audio/Sample.js"

export class Level {

    constructor(levelString, game, tutorial = false) {
        this.game = game
        this.chessboard = game.chessboard
        this.tutorial = tutorial
        this.tutorialStep = 0
        this.ready = false

        // Parse optional level text from parentheses: "FEN (text)"
        const parenMatch = levelString.match(/^(.*?)\s*\((.+)\)\s*$/)
        const fen = parenMatch ? parenMatch[1].trim() : levelString
        this.levelText = parenMatch ? parenMatch[2] : null

        this.chessboard.setPosition(fen, true).then(() => {
            if (!this.destroyed) {
                this.ready = true
                this.chessboard.enableMoveInput(this.moveInputHandler.bind(this), COLOR.black)
                this.autoSelectBlackPiece()
                if (this.tutorial) {
                    this.showTutorialStep()
                } else if (this.levelText && !this.game.levelTextShown) {
                    this.game.levelTextShown = true
                    this.speechBubbleDelay = setTimeout(() => {
                        if (!this.destroyed) {
                            this.showSpeechBubble(this.levelText)
                        }
                    }, 300)
                }
            }
        })

        this.moveSound = new Sample("./assets/chessmove.wav", {"gain": 0.5})
        this.transformSound = new Sample("./assets/take_piece.mp3")
        this.undoSound = new Sample("./assets/take_back.mp3", {"gain": 1.0})

        this.destroyed = false
        this.pendingCapturedType = null
        this.positionHistory = []
    }

    moveInputHandler(event) {
        if (this.destroyed) return false
        switch (event.type) {
            case INPUT_EVENT_TYPE.moveInputStarted:
                this.updateCapturableMarkers()
                return true
            case INPUT_EVENT_TYPE.validateMoveInput: {
                const targetPiece = this.chessboard.getPiece(event.squareTo)
                if (!targetPiece || targetPiece.charAt(0) !== "w") return false
                if (!this.isValidMove(event.squareFrom, event.squareTo)) return false
                this.pendingCapturedType = targetPiece.charAt(1)
                this.pendingPosition = this.chessboard.getPosition()
                return true
            }
            case INPUT_EVENT_TYPE.moveInputCanceled:
                this.chessboard.removeMarkers(MARKER_TYPE.bevel)
                this.autoSelectBlackPiece()
                return false
            case INPUT_EVENT_TYPE.moveInputFinished:
                this.chessboard.removeMarkers(MARKER_TYPE.bevel)
                if (event.legalMove) {
                    this.positionHistory.push(this.pendingPosition)
                    this.afterCapture(event.squareTo, this.pendingCapturedType)
                    this.pendingCapturedType = null
                    this.updateUndoButton()
                } else {
                    this.autoSelectBlackPiece()
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
        if (this.levelText) {
            this.hideSpeechBubble()
            this.levelText = null
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
            this.showTutorialHint("You have the black piece and must capture all the white pawns. Click on the pawn to capture it.")
        } else if (this.tutorialStep === 1) {
            const blackPieces = this.chessboard.state.position.getPieces(COLOR.black)
            if (blackPieces.length && blackPieces[0].square === "f4") {
                this.showTutorialHint("Oops, wrong pawn! You can't reach all pawns now. Press the Restart button to try again.")
            } else {
                this.showTutorialHint("Well done! Now, click on the remaining two pawns to capture them.")
            }
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

    showSpeechBubble(text) {
        this.hideSpeechBubble()
        const blackPieces = this.chessboard.state.position.getPieces(COLOR.black)
        if (!blackPieces.length) return
        const square = blackPieces[0].square
        const squareElem = this.chessboard.view.svg.querySelector(`[data-square='${square}']`)
        if (!squareElem) return

        const parentEl = this.chessboard.context.parentElement

        this.speechBubble = document.createElement("div")
        this.speechBubble.className = "speech-bubble speech-bubble-hidden"
        this.speechBubble.textContent = text
        parentEl.appendChild(this.speechBubble)

        // Compute position relative to the parent element
        const parentRect = parentEl.getBoundingClientRect()
        const squareRect = squareElem.getBoundingClientRect()
        const pieceX = squareRect.left + squareRect.width / 2 - parentRect.left
        const pieceY = squareRect.top - parentRect.top
        const pieceBottom = squareRect.bottom - parentRect.top

        // Measure before animation starts
        const bubbleRect = this.speechBubble.getBoundingClientRect()
        let left = pieceX - bubbleRect.width / 2
        // Clamp to parent bounds
        left = Math.max(4, Math.min(left, parentRect.width - bubbleRect.width - 4))

        // Try placing above the piece
        let top = pieceY - bubbleRect.height - 10
        let placeBelow = false

        // Check if the bubble goes above the parent or above the viewport
        if (top < 0 || parentRect.top + top < 0) {
            placeBelow = true
        }

        // Check if the bubble overlaps any white piece
        if (!placeBelow) {
            const whitePieces = this.chessboard.state.position.getPieces(COLOR.white)
            const bubbleAbsLeft = parentRect.left + left
            const bubbleAbsRight = bubbleAbsLeft + bubbleRect.width
            const bubbleAbsTop = parentRect.top + top
            const bubbleAbsBottom = bubbleAbsTop + bubbleRect.height + 10 // include tail
            for (const wp of whitePieces) {
                const wpElem = this.chessboard.view.svg.querySelector(`[data-square='${wp.square}']`)
                if (!wpElem) continue
                const wpRect = wpElem.getBoundingClientRect()
                if (bubbleAbsRight > wpRect.left && bubbleAbsLeft < wpRect.right &&
                    bubbleAbsBottom > wpRect.top && bubbleAbsTop < wpRect.bottom) {
                    placeBelow = true
                    break
                }
            }
        }

        if (placeBelow) {
            top = pieceBottom + 10
            this.speechBubble.classList.add("speech-bubble-below")
        }

        this.speechBubble.style.left = left + "px"
        this.speechBubble.style.top = top + "px"

        // Position the tail to point at the piece
        const tailLeft = pieceX - left
        this.speechBubble.style.setProperty("--tail-left", tailLeft + "px")

        // Start animation after positioning
        this.speechBubble.classList.remove("speech-bubble-hidden")

        // Fade out on click/tap or after 5 seconds
        this.speechBubbleDismiss = () => this.fadeOutSpeechBubble()
        document.addEventListener("pointerdown", this.speechBubbleDismiss, {once: true})
        this.speechBubbleTimeout = setTimeout(() => this.fadeOutSpeechBubble(), 5000)
    }

    fadeOutSpeechBubble() {
        if (!this.speechBubble || this.speechBubbleFading) return
        this.speechBubbleFading = true
        if (this.speechBubbleTimeout) {
            clearTimeout(this.speechBubbleTimeout)
            this.speechBubbleTimeout = null
        }
        if (this.speechBubbleDismiss) {
            document.removeEventListener("pointerdown", this.speechBubbleDismiss)
            this.speechBubbleDismiss = null
        }
        this.speechBubble.classList.add("speech-bubble-fade-out")
        this.speechBubble.addEventListener("animationend", () => {
            this.hideSpeechBubble()
        }, {once: true})
    }

    hideSpeechBubble() {
        this.speechBubbleFading = false
        if (this.speechBubbleDelay) {
            clearTimeout(this.speechBubbleDelay)
            this.speechBubbleDelay = null
        }
        if (this.speechBubbleTimeout) {
            clearTimeout(this.speechBubbleTimeout)
            this.speechBubbleTimeout = null
        }
        if (this.speechBubbleDismiss) {
            document.removeEventListener("pointerdown", this.speechBubbleDismiss)
            this.speechBubbleDismiss = null
        }
        if (this.speechBubble) {
            this.speechBubble.remove()
            this.speechBubble = null
        }
    }

    updateCapturableMarkers() {
        this.chessboard.removeMarkers(MARKER_TYPE.bevel)
        const blackPieces = this.chessboard.state.position.getPieces(COLOR.black)
        if (!blackPieces.length) return
        const blackSquare = blackPieces[0].square
        const whitePieces = this.chessboard.state.position.getPieces(COLOR.white)
        let hasTarget = false
        for (const wp of whitePieces) {
            if (this.isValidMove(blackSquare, wp.square)) {
                this.chessboard.addMarker(MARKER_TYPE.bevel, wp.square)
                hasTarget = true
            }
        }
        if (!hasTarget && whitePieces.length > 0) {
            const restartBtn = document.getElementById("restartButton")
            if (restartBtn) {
                restartBtn.classList.remove("restart-pulse")
                void restartBtn.offsetWidth
                restartBtn.classList.add("restart-pulse")
            }
        }
    }

    undo() {
        if (!this.positionHistory.length) return
        if (this.game.app.state.soundEnabled) {
            this.undoSound.play()
        }
        this.chessboard.disableMoveInput()
        this.chessboard.removeMarkers(MARKER_TYPE.bevel)
        const previousPosition = this.positionHistory.pop()
        this.chessboard.setPosition(previousPosition, true).then(() => {
            if (!this.destroyed) {
                this.updateUndoButton()
                this.chessboard.enableMoveInput(this.moveInputHandler.bind(this), COLOR.black)
                this.autoSelectBlackPiece()
            }
        })
    }

    updateUndoButton() {
        const hasMoves = this.positionHistory.length > 0
        const undoBtn = document.getElementById("undoButton")
        if (undoBtn) {
            undoBtn.disabled = !hasMoves
        }
        const restartBtn = document.getElementById("restartButton")
        if (restartBtn) {
            restartBtn.disabled = !hasMoves
        }
    }

    destroy() {
        this.destroyed = true
        this.hideTutorialHint()
        this.hideSpeechBubble()
        this.chessboard.removeMarkers(MARKER_TYPE.bevel)
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
