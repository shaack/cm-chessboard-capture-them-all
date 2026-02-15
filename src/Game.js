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
import {LEVELS} from "./level-sets/level-set-2-2026-02-15.js"

export {LEVELS};
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
                this.app.navigate("gameComplete")
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
        if (this.state.currentLevel) {
            this.state.currentLevel.destroy()
        }
        this.chessboard.destroy()
    }
}
