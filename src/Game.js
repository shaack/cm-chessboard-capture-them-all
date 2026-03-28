/**
 * Author: Stefan Haack and Michael Hinz
 * Copyright: Stefan Haack (https://shaack.com)
 * Repository: https://github.com/shaack/cm-chessboard-capture-them-all
 * License: MIT, see file 'LICENSE'
 */
import {Chessboard} from "../node_modules/cm-chessboard/src/Chessboard.js"
import {Markers} from "../node_modules/cm-chessboard/src/extensions/markers/Markers.js"
import {Arrows} from "../node_modules/cm-chessboard/src/extensions/arrows/Arrows.js"
import {Sample} from "../node_modules/cm-web-modules/src/audio/Sample.js"
import {Level} from "./Level.js"
import {Confetti} from "./Confetti.js"
import {Config} from "./Config.js"

const LEVELS = Config.LEVELS
export {LEVELS};
export class Game {

    constructor(boardElement, app, onGameComplete) {
        this.app = app
        this.onGameComplete = onGameComplete

        this.winSound = new Sample("./assets/winSound.mp3", {gain: 0.5})

        this.chessboard = new Chessboard(boardElement, {
            assetsUrl: "./node_modules/cm-chessboard/assets/",
            style: {
                showCoordinates: true,
                pieces: {
                    file: "pieces/staunty.svg",
                }
            },
            extensions: [{class: Markers}, {class: Arrows}]
        })
        this.state = this.app.state
        this.levelActive = false
        this.levelTextShown = false
        this.restartLevel()
    }

    reloadUI() {
        const levelGroupNameOutput = document.getElementById("levelGroup")
        const levelNumberOutput = document.getElementById("level")
        levelGroupNameOutput.innerText = this.state.levelGroupName
        levelNumberOutput.innerText = this.state.level + 1
    }

    levelFinished() {
        if (!this.levelActive) return
        this.levelActive = false
        this.app.sdk.gameplayStop()
        const beatenLevels = this.state.beatenLevels;
        const wasAlreadyComplete = Object.keys(LEVELS).every(
            group => (beatenLevels[group] || 0) >= LEVELS[group].length
        )
        beatenLevels[this.state.levelGroupName] = Math.max(
            beatenLevels[this.state.levelGroupName] || 0,
            this.state.level + 1
        );
        this.state.beatenLevels = beatenLevels;
        Confetti.shoot()
        if (this.app.state.soundEnabled) {
            this.winSound.play()
        }

        // Check if all levels are now beaten for the first time
        const allComplete = !wasAlreadyComplete && Object.keys(LEVELS).every(
            group => (beatenLevels[group] || 0) >= LEVELS[group].length
        )
        const dialogDelay = window.__testSpeedUp ? 100 : 1000
        if (allComplete) {
            this.app.sdk.happytime()
            setTimeout(() => {
                this.app.navigate("gameComplete")
            }, dialogDelay)
        } else {
            setTimeout(() => {
                this.showLevelSolvedDialog()
            }, dialogDelay)
        }
    }

    showLevelSolvedDialog() {
        this.levelSolvedOverlay = document.createElement("div")
        this.levelSolvedOverlay.className = "level-solved-overlay"
        this.levelSolvedOverlay.innerHTML = `
            <div class="level-solved-dialog">
                <h2>Level solved!</h2>
                <div class="level-solved-buttons">
                    <button class="btn-secondary">Solve again</button>
                    <button class="btn-secondary">Exit</button>
                    <button class="btn-primary">Next Level</button>
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

    nextLevel() {
        if (this.state.currentLevel) {
            this.state.currentLevel.destroy()
        }
        this.levelTextShown = false
        this.state.level++
        if (!LEVELS[this.state.levelGroupName][this.state.level]) {
            const levelGroupNames = Object.keys(LEVELS)
            const currentLevelGroupNumber = levelGroupNames.indexOf(this.state.levelGroupName)
            if (currentLevelGroupNumber < levelGroupNames.length - 1) {
                this.state.levelGroupName = levelGroupNames[currentLevelGroupNumber + 1]
                this.state.level = 0
            } else {
                // All levels in all groups done — return to level select
                this.app.navigate("levelSelect")
                return
            }
        }
        this.reloadUI()
        this.state.currentLevel = new Level(LEVELS[this.state.levelGroupName][this.state.level], this)
        this.levelActive = true
        this.app.sdk.gameplayStart()
    }

    isTutorialLevel() {
        return this.state.levelGroupName === "Introduction" && this.state.level === 0 && !this.state.tutorialCompleted
    }

    restartLevel() {
        if (this.state.currentLevel) {
            this.state.currentLevel.destroy()
        }
        const tutorial = this.isTutorialLevel()
        this.state.currentLevel = new Level(LEVELS[this.state.levelGroupName][this.state.level], this, tutorial)
        this.levelActive = true
        this.state.MenuCheckpoint = "game"
        this.reloadUI()
        this.app.sdk.gameplayStart()
    }

    destroy() {
        this.hideLevelSolvedDialog()
        if (this.state.currentLevel) {
            this.state.currentLevel.destroy()
            this.state.currentLevel = null
        }
        this.chessboard.destroy()
    }
}
