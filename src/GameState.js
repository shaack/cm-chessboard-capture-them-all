/**
 * Author and copyright: Stefan Haack (https://shaack.com)
 * Repository: https://github.com/shaack/cm-chessboard-capture-them-all
 * License: MIT, see file 'LICENSE'
 */
export class GameState {

    constructor(sdk) {
        this.sdk = sdk
        if (!this.levelGroupName) {
            this.levelGroupName = "Rook"
            this.level = 0
            this.currentLevel = 0
            this.MenuCheckpoint = "game"

            if (!localStorage.getItem("beatenLevels")) {
                this.beatenLevels = {
                    Rook: 0,
                    Bishop: 0,
                    Knight: 0,
                    Queen: 0,
                    Multi: 0
                }
            }
        }
    }

    async loadCloudProgress() {
        const cloudData = await this.sdk.getItem("beatenLevels")
        if (cloudData) {
            const cloudLevels = JSON.parse(cloudData)
            const localLevels = this.beatenLevels
            // Merge: keep the higher progress for each group
            for (const group of Object.keys(cloudLevels)) {
                localLevels[group] = Math.max(localLevels[group] || 0, cloudLevels[group] || 0)
            }
            this.beatenLevels = localLevels
        }
    }

    saveCloudProgress() {
        this.sdk.setItem("beatenLevels", JSON.stringify(this.beatenLevels))
    }

    set levelGroupName(value) {
        localStorage.setItem("levelGroupName", JSON.stringify(value))
    }

    get levelGroupName() {
        return JSON.parse(localStorage.getItem("levelGroupName"))
    }

    set level(value) {
        localStorage.setItem("level", JSON.stringify(value))
    }

    get level() {
        return JSON.parse(localStorage.getItem("level"))
    }

    set MenuCheckpoint(value) {
        localStorage.setItem("MenuCheckpoint", JSON.stringify(value))
    }

    get MenuCheckpoint() {
        return JSON.parse(localStorage.getItem("MenuCheckpoint"))
    }

    set beatenLevels(value) {
        localStorage.setItem("beatenLevels", JSON.stringify(value))
        this.saveCloudProgress()
    }
    
    get beatenLevels() {
        return JSON.parse(localStorage.getItem("beatenLevels")) || {
            Rook: 0,
            Bishop: 0,
            Knight: 0,
            Queen: 0,
            Multi: 0
        };
    }

    set musicEnabled(value) {
        localStorage.setItem("musicEnabled", JSON.stringify(value))
    }

    get musicEnabled() {
        const val = localStorage.getItem("musicEnabled")
        return val === null ? true : JSON.parse(val)
    }

    set soundEnabled(value) {
        localStorage.setItem("soundEnabled", JSON.stringify(value))
    }

    get soundEnabled() {
        const val = localStorage.getItem("soundEnabled")
        return val === null ? true : JSON.parse(val)
    }

    set tutorialCompleted(value) {
        localStorage.setItem("tutorialCompleted", JSON.stringify(value))
    }

    get tutorialCompleted() {
        return JSON.parse(localStorage.getItem("tutorialCompleted")) || false
    }

    resetProgress() {
        this.beatenLevels = {
            Rook: 0,
            Bishop: 0,
            Knight: 0,
            Queen: 0,
            Multi: 0
        }
        this.tutorialCompleted = false
        this.levelGroupName = "Rook"
        this.level = 0
        this.currentLevel = 0
        this.MenuCheckpoint = "game"
    }
}
