/**
 * Author: Stefan Haack and Michael Hinz
 * Copyright: Stefan Haack (https://shaack.com)
 * Repository: https://github.com/shaack/cm-chessboard-capture-them-all
 * License: MIT, see file 'LICENSE'
 */
import {Chessboard} from "../node_modules/cm-chessboard/src/Chessboard.js"
import {Markers} from "../node_modules/cm-chessboard/src/extensions/markers/Markers.js"
import {createAudioContext} from "../node_modules/cm-web-modules/src/audio/Audio.js"
import {Sample} from "../node_modules/cm-web-modules/src/audio/Sample.js"
import {Level} from "./Level.js"
import {GameState} from "./GameState.js"
import {Confetti} from "./Confetti.js"


export const LEVELS = {
    "Rook": [
        "8/8/8/8/2P1rP2/8/8/8 b - - 0 1",
        "8/1P6/8/1P1r4/8/1P2P3/8/8 b - - 0 1",
        "7P/8/8/4r3/8/8/1P2P2P/8 b - - 0 1",
        "8/8/4P3/8/8/4P2P/1r2P3/P3P2P b - - 0 1",
        "4P3/8/8/1P2r2P/8/8/1P2P3/8 b - - 0 1",
        "8/1P5P/8/P3P3/8/1P1P1P2/P6P/1P1r4 b - - 0 1",
        "8/2P1PP2/8/P1P1P3/8/2P3PP/6r1/6P1 b - - 0 1",
        "8/8/PP3P2/8/Pr3P2/3P4/P4P2/1P1P4 b - - 0 1",
        "2P4P/P3P3/8/2P4P/8/P1P2P1P/5r2/P4P2 b - - 0 1", // zur vierten position
        "P7/4P2P/2P3P1/8/P1Pr4/8/1P1P2P1/P6P b - - 0 1",
    ],
    "Bishop": [ // Bishop
        "8/8/4P3/1P1b4/2P5/3P4/8/8 b - - 0 1",
        "8/8/P3b3/8/8/7P/8/5P2 b - - 0 1",
        "4P1P1/8/P1P1P3/8/P3b3/7P/P3P3/3P1P2 b - - 0 1",
        "3P1P2/2P5/1P5P/P5P1/3b4/4P1P1/8/4P3 b - - 0 1",
        "8/4P1P1/3P1P1P/8/3P1b1P/8/3P1P1P/8 b - - 0 1",
        "3P1P2/P1P3P1/7P/P7/5P1P/8/1b3P1P/P7 b - - 0 1",
        "3P1P2/P1P3P1/7P/P7/5P1P/8/1b3P1P/P7 b - - 0 1",
        "8/P3P1P1/8/2P1b1P1/7P/P3P3/1P3P2/2P3P1 b - - 0 1",
        "6P1/1P5P/P7/3P4/4b3/3P3P/P5P1/1P3P2 b - - 0 1",
        "3P4/6P1/3P3P/8/1P1P1b1P/8/3P1P2/8 b - - 0 1",
    ],
    "Knight": [ // Knight
        "n5P1/4P3/1P5P/3P4/6P1/8/5P2/7P b - - 0 1",
        "8/8/4PP2/3P3P/3n1P2/4P1P1/8/5P2 b - - 0 1",
        "8/8/2P5/4P3/1P1n1P2/3P1P2/2P3P1/4P3 b - - 0 1",
        "8/3P4/5P2/2P1P3/4P1P1/3P2n1/5P2/7P b - - 0 1",
        "8/8/8/8/3nPPP1/3P2P1/3PPP1P/5P2 b - - 0 1",
        "8/6P1/4P3/3P2PP/5P2/2P3PP/4P3/6n1 b - - 0 1",
        "7P/5P2/6P1/4nP2/3P3P/1P3P2/3P4/8 b - - 0 1",
        "8/4P3/8/3P1P1P/5PP1/4P1PP/7P/5Pn1 b - - 0 1",
        "4P3/8/3P1P2/8/2P1n1P1/3P4/3P1P2/4P3 b - - 0 1",
        "1P4P1/3PPP2/1P1P3P/3PnP2/1P2P3/3P1P2/3P4/4P3 b - - 0 1",//
    ],
    "Queen": [ // Queen
        "8/8/5P2/3q2P1/8/P3P2P/6P1/P7 b - - 0 1",
        "4P3/8/2q1P1P1/8/8/3P3P/8/8 b - - 0 1",
        "2P5/P7/8/2P4P/P3q3/7P/4P3/5P2 b - - 0 1",
        "P6P/8/2q1P2P/8/2P5/8/8/P1P4P b - - 0 1",
        "1P4P1/8/4P3/8/P1q3P1/8/4P3/1P4P1 b - - 0 1",
        "2P5/3P1P2/8/6P1/4q3/8/4P1P1/2P3P1 b - - 0 1",
        "3P4/8/1P5P/3q4/8/4P3/8/2P4P b - - 0 1",
        "1P6/4P3/5P2/1P6/4q3/2P3P1/8/8 b - - 0 1 ",
        "6P1/8/1P6/P5P1/3q4/1P4P1/3P1P2/8 b - - 0 1",
        "4P3/1q6/2P3P2/P6P/8/5P1P/7P/1P2P3 b - - 0 1",
    ],
}

export class Game {

    constructor(boardElement, app, onGameComplete) {
        this.app = app
        this.onGameComplete = onGameComplete

        if (!window.cmAudioContext) {
            createAudioContext()
        }

        this.winSound = new Sample("./assets/winSound.mp3")

        this.chessboard = new Chessboard(boardElement, {
            assetsUrl: "./node_modules/cm-chessboard/assets/",
            style: {
                showCoordinates: true,
                pieces: {
                    file: "pieces/staunty.svg",
                }
            },
            extensions: [{class: Markers}]
        })
        this.state = new GameState()
        this.restartLevel()
    }

    reloadUI() {
        const levelGroupNameOutput = document.getElementById("levelGroup")
        const levelNumberOutput = document.getElementById("level")
        levelGroupNameOutput.innerText = this.state.levelGroupName
        levelNumberOutput.innerText = this.state.level + 1
    }

    levelFinished() {
        console.log("levelFinished")
        this.app.sdk.gameplayStop()
        const beatenLevels = this.state.beatenLevels;
        beatenLevels[this.state.levelGroupName] = Math.max(
            beatenLevels[this.state.levelGroupName] || 0,
            this.state.level + 1
        );
        this.state.beatenLevels = beatenLevels;
        Confetti.shoot()
        this.winSound.play()
        setTimeout(() => {
            this.showLevelSolvedDialog()
        }, 1000)
    }

    showLevelSolvedDialog() {
        this.levelSolvedOverlay = document.createElement("div")
        this.levelSolvedOverlay.className = "level-solved-overlay"
        this.levelSolvedOverlay.innerHTML = `
            <div class="level-solved-dialog">
                <h2>Level solved!</h2>
                <div class="level-solved-buttons">
                    <button class="game-btn">Solve again</button>
                    <button class="game-btn game-btn-exit">Exit</button>
                    <button class="game-btn">Next Level</button>
                </div>
            </div>
        `
        document.body.appendChild(this.levelSolvedOverlay)
        const buttons = this.levelSolvedOverlay.querySelectorAll("button")
        buttons[0].addEventListener("click", () => {
            this.hideLevelSolvedDialog()
            this.restartLevel()
        })
        buttons[1].addEventListener("click", () => {
            this.hideLevelSolvedDialog()
            this.app.navigate("levelSelect")
        })
        buttons[2].addEventListener("click", () => {
            this.hideLevelSolvedDialog()
            this.app.sdk.requestAd("midgame").then(() => {
                this.nextLevel()
            })
        })
    }

    hideLevelSolvedDialog() {
        if (this.levelSolvedOverlay) {
            this.levelSolvedOverlay.remove()
            this.levelSolvedOverlay = null
        }
    }

    showGameCompleteDialog() {
        this.gameCompleteOverlay = document.createElement("div")
        this.gameCompleteOverlay.className = "level-solved-overlay"
        this.gameCompleteOverlay.innerHTML = `
            <div class="menu-card game-complete-dialog">
                <h1 class="menu-title">Congratulations!</h1>
                <p class="menu-description">You solved all levels… more coming soon.</p>
                <p class="menu-description">Capture Them All, a game by <a href="http://7d0.com" target="_blank">7d0</a>.</p>
            </div>
        `
        document.body.appendChild(this.gameCompleteOverlay)
        this.confettiInterval = Confetti.firework(10000)
        setTimeout(() => {
            const okButton = document.createElement("button")
            okButton.className = "play-button"
            okButton.textContent = "OK"
            okButton.addEventListener("click", () => {
                this.hideGameCompleteDialog()
                if (this.onGameComplete) {
                    this.onGameComplete()
                }
            })
            const dialog = this.gameCompleteOverlay.querySelector(".game-complete-dialog")
            if (dialog) {
                dialog.appendChild(okButton)
            }
        }, 10000)
    }

    hideGameCompleteDialog() {
        if (this.confettiInterval) {
            clearInterval(this.confettiInterval)
            this.confettiInterval = null
        }
        if (this.gameCompleteOverlay) {
            this.gameCompleteOverlay.remove()
            this.gameCompleteOverlay = null
        }
    }

    nextLevel() {
        if (this.state.currentLevel) {
            this.state.currentLevel.destroy()
        }
        this.state.level++
        if (!LEVELS[this.state.levelGroupName][this.state.level]) {
            const levelGroupsCount = Object.keys(LEVELS).length
            const levelGroupNames = Object.keys(LEVELS)
            const currentLevelGroupNumber = levelGroupNames.indexOf(this.state.levelGroupName)
            if (currentLevelGroupNumber < levelGroupsCount - 1 & this.state.marathonMode == false) {
                Confetti.shoot()
                this.app.sdk.happytime()
                this.winSound.play()
                this.state.levelGroupName = levelGroupNames[currentLevelGroupNumber + 1]
                this.state.level = 0

            } else {
                console.log("game finished")
                this.app.sdk.happytime()
                this.winSound.play()
                this.state.marathonMode = false
                this.showGameCompleteDialog()
                return
            }
        }
        this.reloadUI()
        this.state.currentLevel = new Level(LEVELS[this.state.levelGroupName][this.state.level], this)
        this.app.sdk.gameplayStart()
    }

    restartLevel() {
        console.log("restartLevel",  this.state.levelGroupName,  this.state.level)
        if (this.state.currentLevel) {
            this.state.currentLevel.destroy()
        }
        this.state.currentLevel = new Level(LEVELS[this.state.levelGroupName][this.state.level], this)
        this.state.MenuCheckpoint = "game"
        this.reloadUI()
        this.app.sdk.gameplayStart()
    }

    destroy() {
        this.hideLevelSolvedDialog()
        this.hideGameCompleteDialog()
        if (this.state.currentLevel) {
            this.state.currentLevel.destroy()
        }
        this.chessboard.destroy()
    }
}
