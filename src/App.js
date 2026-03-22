/**
 * Author: https://7d0.com
 * Date: 2026-02-15
 */

import {Audio} from "../node_modules/cm-web-modules/src/audio/Audio.js"
import {Sample} from "../node_modules/cm-web-modules/src/audio/Sample.js"
import {GameState} from "./GameState.js"
import {CrazyGamesSDK} from "./CrazyGamesSDK.js"
import {MenuPage} from "./pages/MenuPage.js"
import {LevelSelectPage} from "./pages/LevelSelectPage.js"
import {GamePage} from "./pages/GamePage.js"
import {GameCompletePage} from "./pages/GameCompletePage.js"
import {SettingsPage} from "./pages/SettingsPage.js"

export class App {
    constructor(container) {
        this.container = container
        this.sdk = new CrazyGamesSDK()
        this.state = new GameState(this.sdk)
        this.sdk.loadingStart()
        this.currentPage = null
        this.pages = {
            menu: new MenuPage(this),
            levelSelect: new LevelSelectPage(this),
            game: new GamePage(this),
            gameComplete: new GameCompletePage(this),
            settings: new SettingsPage(this),
        }
        this.clickSound = null
        this.blipSound = null
        this.bgm = null
        this.bgmGain = 0.2
        document.addEventListener("click", (e) => {
            if (e.target.matches("button, a")) {
                if (!Audio.context()) Audio.createContext()
                this.startBgm()
                if (e.target.matches(".level-tile, .level-solved-buttons button")) {
                    if (!this.blipSound) this.blipSound = new Sample("./assets/LevelUp03.mp3", {gain: 0.3})
                    this.blipSound.play()
                } else {
                    if (!this.clickSound) this.clickSound = new Sample("./assets/click2.mp3", {gain: 0.5})
                    this.clickSound.play()
                }
            }
        })
        this.sdk.init().then(async () => {
            await this.state.loadCloudProgress()
            const params = new URLSearchParams(window.location.search)
            this.debugMode = params.get("key") === "0x7d0"
            this.navigate("menu")
            this.sdk.loadingStop()
        })
    }

    startBgm() {
        if (this.bgmStopped) return
        if (!Audio.context()) Audio.createContext()
        if (!this.bgm) {
            this.bgm = new Sample("./assets/bgm1.mp3", {loop: true, gain: this.bgmGain})
            this.bgm.play()
        }
    }

    muteBgm() {
        this.bgmStopped = true
        if (this.bgm) {
            this.bgm.stop()
            this.bgm = null
        }
    }

    unmuteBgm() {
        this.bgmStopped = false
        this.startBgm()
    }

    navigate(pageName) {
        if (pageName === "gameComplete" || pageName === "menu") {
            this.muteBgm()
        } else {
            this.unmuteBgm()
        }
        if (this.currentPage) {
            this.currentPage.hide()
        }
        this.container.innerHTML = ""
        this.currentPage = this.pages[pageName]
        this.currentPage.show(this.container)
    }
}
