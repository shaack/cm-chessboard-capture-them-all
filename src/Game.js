/**
 * Author: Stefan Haack and Michael Hinz
 * Copyright: Stefan Haack (https://shaack.com)
 * Repository: https://github.com/shaack/cm-chessboard-capture-them-all
 * License: MIT, see file 'LICENSE'
 */
import {Chessboard} from "cm-chessboard/src/Chessboard.js"
import {Markers} from "cm-chessboard/src/extensions/markers/Markers.js"
import {createAudioContext} from "/node_modules/cm-web-modules/src/audio/Audio.js"
import {Sample} from "/node_modules/cm-web-modules/src/audio/Sample.js"
import {Level} from "./Level.js"
import {GameState} from "./GameState.js"
import {Confetti} from "./Confetti.js"


export const LEVELS = {
    "Rook": [
        "8/8/8/8/2P1rP2/8/8/8 b - - 0 1",
        "8/1P6/8/1P1r4/8/1P2P3/8/8 b - - 0 1",
        "8/8/4P3/8/8/4P2P/1r2P3/P3P2P b - - 0 1",
        "8/1P5P/8/P3P3/8/1P1P1P2/P6P/1P1r4 b - - 0 1",
        "8/2P1PP2/8/P1P1P3/8/2P3PP/6r1/6P1 b - - 0 1",
        "8/8/PP3P2/8/Pr3P2/3P4/P4P2/1P1P4 b - - 0 1",
        "2P4P/P3P3/8/2P4P/8/P1P2P1P/5r2/P4P2 b - - 0 1",
        "P7/4P2P/2P3P1/8/P1Pr4/8/1P1P2P1/P6P b - - 0 1",
    ],
    "Bishop": [ // Bishop
        "8/8/4P3/1P1b4/2P5/3P4/8/8 b - - 0 1",
        "4P1P1/8/P1P1P3/8/P3b3/7P/P3P3/3P1P2 b - - 0 1",
        "3P1P2/2P5/1P5P/P5P1/3b4/4P1P1/8/4P3 b - - 0 1",
        "8/4P1P1/3P1P1P/8/3P1b1P/8/3P1P1P/8 b - - 0 1",
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
        "8/4P3/8/3P1P1P/5PP1/4P1PP/7P/5Pn1 b - - 0 1",
        "4P3/8/3P1P2/8/2P1n1P1/3P4/3P1P2/4P3 b - - 0 1",
        "1P4P1/3PPP2/1P1P3P/3PnP2/1P2P3/3P1P2/3P4/4P3 b - - 0 1",//
    ],
    "Queen": [ // Queen
        "3P4/8/1P5P/3q4/8/4P3/8/2P4P b - - 0 1",
        "6P1/8/1P6/P5P1/3q4/1P4P1/3P1P2/8 b - - 0 1",
        "4P3/1q6/2P3P2/P6P/8/5P1P/7P/1P2P3 b - - 0 1",
    ],
}

export class Game {

    constructor() {

        if (!window.cmAudioContext) {
            createAudioContext()
        }
        
        this.restartButton = document.getElementById("restartButton")
        this.menuButton = document.getElementById("menuButton")
        this.closebtn = document.getElementById("closebtn")

        this.restartButton.addEventListener("click", this.restartLevel.bind(this))
        this.menuButton.addEventListener("click", this.openNav.bind(this))
        this.closebtn.addEventListener("click", this.closeNav.bind(this))

        this.winSound = new Sample("./assets/winSound.mp3")

        this.chessboard = new Chessboard(document.querySelector(".board"), {
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
        console.log("levelFinished, TODO win animation")
        const beatenLevels = this.state.beatenLevels; // Hole den aktuellen Fortschritt
        beatenLevels[this.state.levelGroupName] = Math.max(
            beatenLevels[this.state.levelGroupName] || 0,
            this.state.level + 1
        );
        this.state.beatenLevels = beatenLevels; // Speichere den aktualisierten Fortschritt
        setTimeout(() => {
            this.nextLevel()
        }, 500)

    }

    nextLevel() {
        this.state.level++
        if (!LEVELS[this.state.levelGroupName][this.state.level]) {
            const levelGroupsCount = Object.keys(LEVELS).length
            const levelGroupNames = Object.keys(LEVELS)
            const currentLevelGroupNumber = levelGroupNames.indexOf(this.state.levelGroupName)
            if (currentLevelGroupNumber < levelGroupsCount - 1 & this.state.marathonMode == false) {
                Confetti.shoot()
                this.winSound.play()
                this.state.levelGroupName = levelGroupNames[currentLevelGroupNumber + 1]
                this.state.level = 0
                
            } else {
                console.log("game finished")
                this.restartButton.style.display = "none"
                window.location.href = "index.html"
                this.state.marathonMode = false
                return
            }
        }
        this.reloadUI()
        this.state.currentLevel = new Level(LEVELS[this.state.levelGroupName][this.state.level], this)
    }

    restartLevel() {
        console.log("restartLevel",  this.state.levelGroupName,  this.state.level)
        this.state.currentLevel = new Level(LEVELS[this.state.levelGroupName][this.state.level], this)
        this.currentCheckpoint()
        this.reloadUI()
    }

    openNav() {
        document.getElementById("myNav").style.display = "block"
    }

    closeNav() {
        document.getElementById("myNav").style.display = "none"
    }

    goBack() {
        const checkpoint = JSON.parse(localStorage.getItem("MenuCheckpoint"))
        window.location = checkpoint ? checkpoint : "index.html"
    }

    currentCheckpoint() {
        localStorage.setItem("MenuCheckpoint", JSON.stringify("game.html"))
    }
}
